// On-page SEO check of pasted HTML. DOMParser reads it: nothing is fetched, no script runs.
export type Status = 'pass' | 'warn' | 'fail' | 'info';
// key picks the message in the component (title.long…), vals fill its {placeholders}
export type Check = { id: string; status: Status; key: string; vals: Record<string, string | number> };

export const lengthKey = (n: number, min: number, max: number) => (n < min ? 'short' : n > max ? 'long' : 'ok');

// Heading levels in page order -> how many times a level is skipped going down (h2 -> h4)
export const headingSkips = (levels: number[]) => levels.filter((l, i) => i > 0 && l > levels[i - 1] + 1).length;

// "noindex, max-image-preview:none" -> Set { noindex, max-image-preview:none }
export const robotsTokens = (...contents: string[]) => new Set(contents.join(',').toLowerCase().split(',').map((s) => s.trim()));

export function checkSeo(html: string, pageUrl: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const meta = (sel: string, a = 'content') => doc.querySelector(sel)?.getAttribute(a)?.trim() ?? '';
  const checks: Check[] = [];
  const add = (id: string, status: Status, key: string, vals: Check['vals'] = {}) => checks.push({ id, status, key, vals });
  const byLength = (id: string, text: string, min: number, max: number) => {
    const k = lengthKey(text.length, min, max);
    text ? add(id, k === 'ok' ? 'pass' : 'warn', k, { n: text.length }) : add(id, 'fail', 'missing');
  };

  const title = doc.title.trim();
  const desc = meta('meta[name="description" i]');
  byLength('title', title, 30, 60);
  byLength('description', desc, 70, 160);

  const h1 = [...doc.querySelectorAll('h1')];
  h1.length === 1 ? add('h1', 'pass', 'one', { text: h1[0].textContent!.trim().replace(/\s+/g, ' ') }) : add('h1', 'warn', h1.length ? 'many' : 'none', { n: h1.length });

  const levels = [...doc.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) => +h.tagName[1]);
  const skips = headingSkips(levels);
  add('headings', skips ? 'warn' : 'pass', skips ? 'skips' : 'ok', { n: skips || levels.length });

  const lang = doc.documentElement.getAttribute('lang')?.trim();
  lang ? add('lang', 'pass', 'ok', { text: lang }) : add('lang', 'fail', 'missing');

  const viewport = !!doc.querySelector('meta[name="viewport" i]');
  add('viewport', viewport ? 'pass' : 'fail', viewport ? 'ok' : 'missing');

  const canonical = meta('link[rel~="canonical" i]', 'href');
  canonical ? add('canonical', 'pass', 'ok', { text: canonical }) : add('canonical', 'warn', 'missing');

  const robots = robotsTokens(meta('meta[name="robots" i]'), meta('meta[name="googlebot" i]'));
  if (robots.has('noindex') || robots.has('none')) add('robots', 'fail', 'noindex');
  else add('robots', robots.has('nofollow') ? 'warn' : 'pass', robots.has('nofollow') ? 'nofollow' : 'ok');

  const og = ['og:title', 'og:description', 'og:image'].filter((p) => !meta(`meta[property="${p}"]`));
  add('og', og.length ? 'warn' : 'pass', og.length ? 'missing' : 'ok', { text: og.join(', ') });

  const imgs = doc.querySelectorAll('img');
  const noAlt = [...imgs].filter((i) => !i.hasAttribute('alt')).length;
  add('images', !imgs.length ? 'info' : noAlt ? 'warn' : 'pass', !imgs.length ? 'none' : noAlt ? 'noalt' : 'ok', { n: noAlt, m: imgs.length });

  let host = '';
  try { host = new URL(pageUrl || canonical).host; } catch {}
  const links = [...doc.querySelectorAll('a[href]')].filter((a) => !/^(#|javascript:|mailto:|tel:)/i.test(a.getAttribute('href')!));
  const ext = links.filter((a) => { try { return new URL(a.getAttribute('href')!, `https://${host}/`).host !== host; } catch { return false; } }).length;
  const mute = links.filter((a) => !a.textContent!.trim() && !a.getAttribute('aria-label')?.trim() && !a.querySelector('img[alt]:not([alt=""])')).length;
  if (mute) add('links', 'warn', 'mute', { n: mute });
  else add('links', 'info', host ? 'count' : 'countNoHost', { n: links.length, int: links.length - ext, ext });

  const ld = [...doc.querySelectorAll('script[type="application/ld+json"]')];
  const bad = ld.filter((s) => { try { JSON.parse(s.textContent!); return false; } catch { return true; } }).length;
  add('jsonld', bad ? 'warn' : ld.length ? 'pass' : 'info', bad ? 'invalid' : ld.length ? 'ok' : 'none', { n: bad || ld.length });

  doc.querySelectorAll('script, style, noscript, template').forEach((e) => e.remove());
  // count text node by text node: minified HTML has no spaces between <h1>One</h1><p>Two</p>
  const walk = doc.createTreeWalker(doc.body ?? doc, NodeFilter.SHOW_TEXT);
  let words = 0;
  while (walk.nextNode()) words += walk.currentNode.textContent!.split(/\s+/).filter(Boolean).length;
  add('words', 'info', 'count', { n: words });

  return { checks, title, desc, url: canonical || pageUrl };
}
