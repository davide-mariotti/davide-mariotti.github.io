// HTML beautifier: one block element per line, inline content kept together (spaces between inline tags matter),
// script/style/pre/textarea copied as they are.
// ponytail: tokenizer, not a parser. Unclosed <p>/<li> drift the indent until their parent closes; good enough to read code.
const VOID = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
const INLINE = new Set('a abbr b bdi bdo br button cite code data del dfn em i img input ins kbd label mark q s samp select small span strong sub sup time u var wbr'.split(' '));
const TOKEN = /<!--[\s\S]*?-->|<(script|style|pre|textarea)\b(?:"[^"]*"|'[^']*'|[^'">])*>[\s\S]*?<\/\1\s*>|<[!/]?[a-zA-Z](?:"[^"]*"|'[^']*'|[^'">])*>|[^<]+|</gi;

export function formatHtml(src: string, unit = '  ') {
  const lines: string[] = [];
  const stack: { name: string; line: number }[] = [];
  let inline = false; // may the next inline bit join the last line?
  const add = (s: string) => lines.push(unit.repeat(stack.length) + s);
  const join = (s: string) => (lines.length ? (lines[lines.length - 1] += s) : add(s));

  for (const [tok] of src.matchAll(TOKEN)) {
    const tag = tok.match(/^<(\/?)([a-zA-Z][\w:-]*)/);
    if (tok.startsWith('<!') || /^<(script|style|pre|textarea)\b/i.test(tok)) {
      add(tok.trim());
      inline = false;
    } else if (!tag) {
      const text = tok.replace(/\s+/g, ' ');
      if (text === ' ') { if (inline) join(' '); continue; }
      inline ? join(text) : add(text.trimStart());
      inline = true;
    } else {
      const name = tag[2].toLowerCase();
      if (INLINE.has(name)) {
        inline ? join(tok) : add(tok);
        inline = true;
      } else if (tag[1]) {
        const at = stack.map((s) => s.name).lastIndexOf(name);
        const open = at >= 0 ? stack.splice(at)[0] : null;
        open?.line === lines.length - 1 ? join(tok) : add(tok);
        inline = false;
      } else {
        add(tok);
        const opens = !VOID.has(name) && !tok.endsWith('/>');
        if (opens) stack.push({ name, line: lines.length - 1 });
        inline = opens;
      }
    }
  }
  return lines.map((l) => l.trimEnd()).join('\n');
}
