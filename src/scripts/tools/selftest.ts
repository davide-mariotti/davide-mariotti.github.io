// Checks for the tools' logic: npm test (Node 22.18+ runs TypeScript directly).
import assert from 'node:assert/strict';
import { generate, entropy, SETS } from './password.ts';
import { toHex, toHsl, toCmyk, contrast, ratioText } from './color.ts';
import { CASES } from './case.ts';
import { formatHtml } from './html.ts';
import { fitSize, outName } from './image.ts';
import { srcsetUrls, cssUrls, extOf } from './extract.ts';

// password: length, one of every set, nothing outside the pool
for (const n of [4, 16, 64]) {
  const sets = [SETS.upper, SETS.digits, SETS.symbols];
  const p = generate(n, sets);
  assert.equal(p.length, n);
  for (const s of sets) assert.ok([...p].some((ch) => s.includes(ch)), `missing a char from ${s}`);
  assert.ok([...p].every((ch) => sets.join('').includes(ch)));
}
assert.equal(entropy(16, 94), 105);

// colour
const green = { r: 47, g: 227, b: 127, a: 1 };
assert.equal(toHex(green), '#2FE37F');
assert.equal(toHsl(green), 'hsl(147, 76%, 54%)');
assert.equal(toCmyk(green), 'cmyk(79%, 0%, 44%, 11%)');
assert.equal(toHex({ r: 0, g: 0, b: 0, a: 0.5 }), '#00000080');
assert.equal(ratioText(contrast({ r: 119, g: 119, b: 119, a: 1 }, { r: 255, g: 255, b: 255, a: 1 })), '4.47:1'); // #777 on white: 4.478, fails AA
assert.equal(ratioText(contrast({ r: 0, g: 0, b: 0, a: 1 }, { r: 255, g: 255, b: 255, a: 1 })), '21.00:1');

// case
const t = "ciao mondo. è l'ora di andare! perché no? helloWorld foo-bar";
assert.equal(CASES.sentence(t), "Ciao mondo. È l'ora di andare! Perché no? Helloworld foo-bar");
assert.equal(CASES.title(t), "Ciao Mondo. È L'ora Di Andare! Perché No? Helloworld Foo-Bar");
assert.equal(CASES.camel(t), 'ciaoMondoELOraDiAndarePercheNoHelloWorldFooBar');
assert.equal(CASES.snake('Ciao, Mondo!'), 'ciao_mondo');
assert.equal(CASES.slug("L'ora è già passata?"), 'l-ora-e-gia-passata');
assert.equal(CASES.inverse('Hello È'), 'hELLO è');

// html
const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>T</title></head><body><div class="a" data-x="a>b"><p>Hello <b>bold</b> <i>text</i></p><img src="x.png"><ul><li>One</li><li>Two</li></ul></div><!-- note --><pre>  keep\n    me</pre><script>if(a<b){x()}</script></body></html>';
assert.equal(formatHtml(html), [
  '<!DOCTYPE html>',
  '<html>',
  '  <head>',
  '    <meta charset="utf-8">',
  '    <title>T</title>',
  '  </head>',
  '  <body>',
  '    <div class="a" data-x="a>b">',
  '      <p>Hello <b>bold</b> <i>text</i></p>',
  '      <img src="x.png">',
  '      <ul>',
  '        <li>One</li>',
  '        <li>Two</li>',
  '      </ul>',
  '    </div>',
  '    <!-- note -->',
  '    <pre>  keep\n    me</pre>',
  '    <script>if(a<b){x()}</script>',
  '  </body>',
  '</html>',
].join('\n'));
assert.equal(formatHtml('<ul>\n  <li>a\n  <li>b\n</ul><p>x</p>', '\t'), '<ul>\n\t<li>a\n\t\t<li>b\n</ul>\n<p>x</p>');

// image
assert.deepEqual(fitSize(4000, 3000, 1600), [1600, 1200]);
assert.deepEqual(fitSize(800, 600, 1600), [800, 600]);
assert.deepEqual(fitSize(800, 600, 0), [800, 600]);
assert.equal(outName('photo.final.PNG', 'image/jpeg'), 'photo.final-optimized.jpg');
assert.equal(outName('icon.png', 'image/webp'), 'icon-optimized.webp');

// extractor
assert.deepEqual(srcsetUrls('a.jpg 1x,b.jpg 2x'), ['a.jpg', 'b.jpg']);
assert.deepEqual(srcsetUrls('https://c.io/w_300,h_200/a.jpg 300w, https://c.io/b.jpg 600w'), ['https://c.io/w_300,h_200/a.jpg', 'https://c.io/b.jpg']);
assert.deepEqual(srcsetUrls('a.jpg, b.jpg'), ['a.jpg', 'b.jpg']);
assert.deepEqual(cssUrls(`background: url("a.png"), url(b.svg); x: url( 'c.webp' )`), ['a.png', 'b.svg', 'c.webp']);
assert.equal(extOf('https://x.io/p/IMG.JPEG?w=3'), 'jpg');
assert.equal(extOf('https://x.io/image?id=3'), 'other');

console.log('tools: all checks passed');
