// Image optimizer helpers (the encoding itself is canvas.toBlob in the component).

// Longest side down to `max` px, proportions kept; 0 or a bigger max leaves the size alone.
export function fitSize(w: number, h: number, max: number): [number, number] {
  const long = Math.max(w, h);
  if (!max || max >= long) return [w, h];
  const s = max / long;
  return [Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s))];
}

// photo.png + image/webp -> photo-optimized.webp (the extension follows what was really encoded)
export const outName = (name: string, type: string) =>
  `${name.replace(/\.[^.]*$/, '') || 'image'}-optimized.${type === 'image/jpeg' ? 'jpg' : type.split('/')[1]}`;

export function formatBytes(n: number, lang: string) {
  const f = (v: number) => v.toLocaleString(lang, { maximumFractionDigits: 1 });
  return n < 1024 ? `${n} B` : n < 1024 ** 2 ? `${f(n / 1024)} KB` : `${f(n / 1024 ** 2)} MB`;
}
