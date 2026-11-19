// Image extractor: reads pasted HTML with DOMParser (nothing is fetched, no script runs) and lists the image URLs.

// srcset as the HTML spec splits it: a URL is a run of non-spaces, so commas inside it (w_300,h_200) survive.
export function srcsetUrls(s: string) {
  const urls: string[] = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && /[\s,]/.test(s[i])) i++;
    let j = i;
    while (j < s.length && !/\s/.test(s[j])) j++;
    let url = s.slice(i, j);
    if (url.endsWith(',')) { url = url.replace(/,+$/, ''); i = j; }
    else { i = s.indexOf(',', j); if (i < 0) i = s.length; }
    if (url) urls.push(url);
  }
  return urls;
}

export const cssUrls = (css: string) => [...css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)].map((m) => m[2]);

export function extOf(url: string) {
  const m = new URL(url).pathname.toLowerCase().match(/\.(jpe?g|png|gif|svg|webp|avif|ico|bmp)$/);
  return m ? m[1].replace('jpeg', 'jpg') : 'other';
}

export function fileName(url: string) {
  try { return decodeURIComponent(new URL(url).pathname.split('/').pop() || '') || 'image'; } catch { return 'image'; }
}

// Absolute http(s) image URLs, deduplicated, plus how many relative ones couldn't be resolved.
export function extractImages(html: string, pageUrl: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const baseHref = doc.querySelector('base[href]')?.getAttribute('href') ?? '';
  let base = '';
  try { base = new URL(baseHref, pageUrl || undefined).href; } catch {}

  const raw: string[] = [];
  const attr = (sel: string, a: string) => doc.querySelectorAll(sel).forEach((el) => raw.push(el.getAttribute(a)!));
  attr('img[src], input[type=image][src]', 'src');
  attr('[data-src]', 'data-src');
  attr('[data-lazy-src]', 'data-lazy-src');
  attr('video[poster]', 'poster');
  attr('image[href]', 'href');
  attr('meta[property="og:image"], meta[property="og:image:url"], meta[name="twitter:image"]', 'content');
  attr('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="image_src"]', 'href');
  doc.querySelectorAll('[srcset], [data-srcset]').forEach((el) => {
    for (const a of ['srcset', 'data-srcset']) raw.push(...srcsetUrls(el.getAttribute(a) ?? ''));
  });
  doc.querySelectorAll('[style], style').forEach((el) => raw.push(...cssUrls(el.getAttribute('style') ?? el.textContent ?? '')));

  const urls = new Set<string>();
  let skipped = 0;
  for (const r of raw) {
    const v = r?.trim();
    if (!v || v.startsWith('data:') || v.startsWith('#')) continue;
    try {
      const u = new URL(v, base || undefined);
      if (u.protocol === 'http:' || u.protocol === 'https:') urls.add(u.href);
    } catch { skipped++; }
  }
  return { urls: [...urls], skipped };
}
