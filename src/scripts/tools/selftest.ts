// Checks for the tools' logic: npm test (Node 22.18+ runs TypeScript directly).
import assert from 'node:assert/strict';
import { generate, entropy, SETS } from './password.ts';
import { toHex, toHsl, toCmyk, contrast, ratioText } from './color.ts';
import { CASES } from './case.ts';
import { formatHtml } from './html.ts';
import { fitSize, outName } from './image.ts';
import { srcsetUrls, cssUrls, extOf } from './extract.ts';
import { lengthKey, headingSkips, robotsTokens } from './seo.ts';
import { formatJson, errorAt } from './json.ts';
import { b64encode, b64decode, decodeJwt } from './encode.ts';
import { findMatches } from './regex.ts';

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

// seo helpers
assert.equal(lengthKey(10, 30, 60), 'short');
assert.equal(lengthKey(45, 30, 60), 'ok');
assert.equal(lengthKey(61, 30, 60), 'long');
assert.equal(headingSkips([1, 2, 3, 2, 4, 2]), 1);
assert.equal(headingSkips([2, 4, 6]), 2);
assert.ok(robotsTokens('index, max-image-preview:none', '').has('index'));
assert.ok(!robotsTokens('max-image-preview:none').has('none'));

// json
assert.equal(formatJson('{"b":1,"a":[1,{"d":2,"c":3}]}', '', true), '{"a":[1,{"c":3,"d":2}],"b":1}');
assert.equal(formatJson('{"a":1}', '  '), '{\n  "a": 1\n}');
assert.equal(formatJson('{"id":12345678901234567890}', ''), '{"id":12345678901234567890}'); // no rounding
assert.deepEqual(errorAt('{"a": 1,\n}'), { line: 2, col: 1, offset: 9 });
assert.deepEqual(errorAt('{"a": 1,\n  "b": [1, 2,]\n}'), { line: 2, col: 14, offset: 22 }); // trailing comma: Chrome gives no position
assert.equal(errorAt(String.raw`{"a": "xé\n", "b": [true, null, -1.5e3, {}, []]}`), null);
for (const bad of ['{"a" 1}', '[01]', String.raw`"\q"`, '{"a":1}x', '', '{"a":', '"abc']) assert.ok(errorAt(bad)!.offset >= 0, bad);

// encode
assert.equal(b64encode('Perché ☕'), 'UGVyY2jDqSDimJU=');
assert.equal(b64decode('UGVyY2jDqSDimJU'), 'Perché ☕'); // missing padding
assert.equal(b64decode('data:text/plain;base64,aGk='), 'hi');
assert.throws(() => b64decode('/w=='));                   // 0xff is not UTF-8 text
const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
assert.deepEqual(decodeJwt(jwt).payload, { sub: '1234567890', name: 'John Doe', iat: 1516239022 });

// regex
assert.deepEqual(findMatches(String.raw`(\d+)-(?<b>\d+)`, 'g', 'a 1-2 b 33-44').map((m) => [m.index, m.text, m.named?.b]), [[2, '1-2', '2'], [8, '33-44', '44']]);
assert.equal(findMatches(String.raw`\d`, '', 'a1b2').length, 1); // no g: first match only
assert.equal(findMatches('x*', 'g', 'abc').length, 4);  // empty matches don't loop forever
assert.throws(() => findMatches('(', 'g', 'x'));

console.log('tools: all checks passed');
