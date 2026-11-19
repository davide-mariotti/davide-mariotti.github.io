// Base64 (UTF-8 safe, URL-safe variant accepted), URL encoding and JWT decoding.
export const b64encode = (s: string) => btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(''));

// Accepts standard and URL-safe Base64, missing padding, spaces and a data: prefix. Throws if it isn't UTF-8 text.
export function b64decode(s: string) {
  const clean = s.trim().replace(/^data:[^,]*,/, '').replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(clean + '='.repeat((4 - (clean.length % 4)) % 4));
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function decodeJwt(token: string) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('not a JWT');
  const [header, payload] = parts.slice(0, 2).map((p) => JSON.parse(b64decode(p)));
  return { header, payload };
}
