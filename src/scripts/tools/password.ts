// Password generator: crypto.getRandomValues only, no Math.random.
export const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~',
};

// Uniform integer in [0, max): rejection sampling, so no modulo bias.
const randInt = (max: number) => {
  const limit = 2 ** 32 - (2 ** 32 % max);
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf); while (buf[0] >= limit);
  return buf[0] % max;
};
const pick = (s: string) => s[randInt(s.length)];

// One character from every chosen set, the rest from all of them, then shuffled.
export function generate(length: number, sets: string[]) {
  const pool = sets.join('');
  const chars = sets.map(pick);
  while (chars.length < length) chars.push(pick(pool));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

// Bits of entropy of a random password: what an attacker who knows the rules has to guess.
export const entropy = (length: number, pool: number) => Math.round(length * Math.log2(pool));
export const strength = (bits: number) => (bits < 50 ? 0 : bits < 80 ? 1 : 2);
