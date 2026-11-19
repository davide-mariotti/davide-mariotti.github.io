// Case conversions. Unicode-aware: è, ß and friends count as letters.
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

// Words for code-style cases: accents dropped, split on anything that isn't a letter or digit and on camelCase humps.
const words = (s: string) =>
  s.normalize('NFD').replace(/\p{M}/gu, '').replace(/(\p{Ll})(\p{Lu})/gu, '$1 $2').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);

export const CASES = {
  sentence: (s: string) => s.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)(\p{L})/gu, (_, p, c) => p + c.toUpperCase()),
  lower: (s: string) => s.toLowerCase(),
  upper: (s: string) => s.toUpperCase(),
  // an apostrophe is not a word break: "don't" stays "Don't"
  title: (s: string) => s.toLowerCase().replace(/(^|[^\p{L}\p{N}'’])(\p{L})/gu, (_, p, c) => p + c.toUpperCase()),
  camel: (s: string) => words(s).map((w, i) => (i ? cap(w) : w)).join(''),
  snake: (s: string) => words(s).join('_'),
  slug: (s: string) => words(s).join('-'),
  inverse: (s: string) => [...s].map((c) => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase())).join(''),
};
export type CaseName = keyof typeof CASES;
