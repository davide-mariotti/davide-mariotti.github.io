// JSON formatter: the browser's own parser. Big integers stay exact where JSON.rawJSON exists.
const J = JSON as typeof JSON & { rawJSON?: (s: string) => unknown; isRawJSON?: (v: unknown) => boolean };

const keepBigInts = (_k: string, v: unknown, ctx?: { source?: string }) =>
  typeof v === 'number' && !Number.isSafeInteger(v) && J.rawJSON && ctx?.source && /^-?\d+$/.test(ctx.source) ? J.rawJSON(ctx.source) : v;

const sortKeys = (v: any): any =>
  Array.isArray(v) ? v.map(sortKeys)
  : v && typeof v === 'object' && !J.isRawJSON?.(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]))
  : v;

// indent '' = minified
export function formatJson(text: string, indent: string, sort = false) {
  const value = JSON.parse(text, keepBigInts as any);
  return JSON.stringify(sort ? sortKeys(value) : value, null, indent);
}

// Offset where the text stops being JSON (-1 if it is valid). Chrome's message often has no position,
// so this small scanner finds it the same way in every browser.
const NUM = /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/y;
export function errorOffset(s: string) {
  let i = 0;
  const fail = (): never => { throw i; };
  const ws = () => { while (' \t\n\r'.includes(s[i] ?? 'x')) i++; };
  const str = () => {
    for (i++; s[i] !== '"'; i++) {
      if (i >= s.length || s[i] < ' ') fail();
      if (s[i] === '\\') {
        i++;
        if (s[i] === 'u') { if (!/^[\da-f]{4}$/i.test(s.slice(i + 1, i + 5))) fail(); i += 4; }
        else if (!'"\\/bfnrt'.includes(s[i] ?? 'x')) fail();
      }
    }
    i++;
  };
  const list = (close: string, item: () => void) => {
    i++; ws();
    if (s[i] === close) { i++; return; }
    for (;;) { item(); ws(); if (s[i] === close) { i++; return; } if (s[i] !== ',') fail(); i++; }
  };
  const value = (): void => {
    ws();
    const c = s[i];
    if (c === '{') return list('}', () => { ws(); if (s[i] !== '"') fail(); str(); ws(); if (s[i] !== ':') fail(); i++; value(); });
    if (c === '[') return list(']', value);
    if (c === '"') return str();
    for (const w of ['true', 'false', 'null']) if (s.startsWith(w, i)) { i += w.length; return; }
    NUM.lastIndex = i;
    if (!NUM.test(s)) fail();
    i = NUM.lastIndex;
  };
  try { value(); ws(); if (i < s.length) fail(); return -1; }
  catch (e) { if (typeof e === 'number') return e; throw e; }
}

export function errorAt(text: string) {
  const offset = errorOffset(text);
  if (offset < 0) return null;
  const before = text.slice(0, offset).split('\n');
  return { line: before.length, col: before[before.length - 1].length + 1, offset };
}
