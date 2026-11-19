// Colour maths for the converter and the WCAG checker. The browser does the parsing.
export type RGB = { r: number; g: number; b: number; a: number }; // 0-255, alpha 0-1

let ctx: CanvasRenderingContext2D | null = null;

// Any CSS colour (hex with or without #, rgb, hsl, names, oklch…) plus cmyk(), read back as sRGB.
export function parse(input: string): RGB | null {
  const v = input.trim();
  const cmyk = v.match(/^cmyk\(\s*([\d.]+)%?[\s,]+([\d.]+)%?[\s,]+([\d.]+)%?[\s,]+([\d.]+)%?\s*\)$/i);
  if (cmyk) {
    const [c, m, y, k] = cmyk.slice(1).map((n) => Math.min(100, +n) / 100);
    const ch = (x: number) => Math.round(255 * (1 - x) * (1 - k));
    return { r: ch(c), g: ch(m), b: ch(y), a: 1 };
  }
  const css = /^([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v) ? '#' + v : v;
  if (!v || /^(currentcolor|inherit|initial|unset|revert(-layer)?)$/i.test(v) || !CSS.supports('color', css)) return null;
  ctx ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return { r, g, b, a: +(a / 255).toFixed(2) };
}

const hex2 = (n: number) => n.toString(16).padStart(2, '0');
export const toHex = ({ r, g, b, a }: RGB) => ('#' + [r, g, b].map(hex2).join('') + (a < 1 ? hex2(Math.round(a * 255)) : '')).toUpperCase();
export const toRgb = ({ r, g, b, a }: RGB) => (a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`);

export function toHsl({ r, g, b, a }: RGB) {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B), min = Math.min(R, G, B), d = max - min, l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const h = d === 0 ? 0 : max === R ? ((G - B) / d + 6) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
  const parts = `${Math.round(h * 60) % 360}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
  return a < 1 ? `hsla(${parts}, ${a})` : `hsl(${parts})`;
}

export function toCmyk({ r, g, b }: RGB) {
  const k = 1 - Math.max(r, g, b) / 255;
  const cmy = k === 1 ? [0, 0, 0] : [r, g, b].map((v) => Math.round(((1 - v / 255 - k) / (1 - k)) * 100));
  return `cmyk(${[...cmy, Math.round(k * 100)].join('%, ')}%)`;
}

// WCAG 2.x relative luminance and contrast ratio
const lin = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
export const luminance = ({ r, g, b }: RGB) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
export function contrast(x: RGB, y: RGB) {
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
}
// WCAG doesn't round: 4.499 fails AA. Show the ratio cut, never rounded up.
export const ratioText = (r: number) => (Math.floor(r * 100) / 100).toFixed(2) + ':1';
