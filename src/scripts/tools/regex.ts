// Regex tester: the browser's own RegExp. Without the g flag only the first match counts, as in code.
export type Match = { index: number; text: string; groups: (string | undefined)[]; named?: Record<string, string | undefined> };

export function findMatches(source: string, flags: string, text: string, limit = 500): Match[] {
  const global = flags.includes('g');
  const re = new RegExp(source, global ? flags : flags + 'g'); // throws SyntaxError on a bad pattern
  const out: Match[] = [];
  for (const m of text.matchAll(re)) {
    out.push({ index: m.index!, text: m[0], groups: m.slice(1), named: m.groups });
    if (!global || out.length >= limit) break;
  }
  return out;
}
