// The browser tools. Each one is src/components/pages/tools/<PascalSlug>.astro, served at /tools/<slug>/ and /it/tools/<slug>/.
export const TOOLS = [
  { slug: 'psw-generator', icon: 'KeyRound', name: { en: 'Password Generator', it: 'Generatore di password' }, text: { en: 'Strong passwords in one click, with the rules you choose.', it: 'Password robuste con un clic, con le regole che scegli tu.' } },
  { slug: 'color-converter', icon: 'Palette', name: { en: 'Colour Converter', it: 'Convertitore di colori' }, text: { en: 'HEX, RGB, HSL and CMYK, back and forth.', it: 'HEX, RGB, HSL e CMYK, avanti e indietro.' } },
  { slug: 'wcag-contrast-calculator', icon: 'Contrast', name: { en: 'WCAG Contrast', it: 'Contrasto WCAG' }, text: { en: 'Is that grey on white readable? Check it against WCAG.', it: 'Quel grigio su bianco si legge? Controllalo con le WCAG.' } },
  { slug: 'img-optimization', icon: 'ImageDown', name: { en: 'Image Optimizer', it: 'Ottimizza immagini' }, text: { en: 'Smaller images in WebP or JPEG. Nothing leaves your browser.', it: 'Immagini più leggere in WebP o JPEG. Niente esce dal browser.' } },
  { slug: 'img-extractor', icon: 'Images', name: { en: 'Image Extractor', it: 'Estrai immagini' }, text: { en: 'Every image in a page\'s source, listed and ready to save.', it: 'Tutte le immagini nel sorgente di una pagina, pronte da salvare.' } },
  { slug: 'seo-check', icon: 'SearchCheck', name: { en: 'SEO Check', it: 'Controllo SEO' }, text: { en: 'Title, description, headings, canonical, robots: what Google sees first.', it: 'Titolo, descrizione, intestazioni, canonical, robots: quello che Google vede per primo.' } },
  { slug: 'case-converter', icon: 'CaseSensitive', name: { en: 'Case Converter', it: 'Maiuscole e minuscole' }, text: { en: 'UPPER, lower, Title, camelCase, slugs and friends.', it: 'MAIUSCOLO, minuscolo, Titolo, camelCase, slug e compagnia.' } },
  { slug: 'html-beautify', icon: 'Braces', name: { en: 'HTML Beautifier', it: 'Formatta HTML' }, text: { en: 'Turns a wall of HTML into something you can read.', it: 'Trasforma un muro di HTML in qualcosa di leggibile.' } },
  { slug: 'json-formatter', icon: 'FileBraces', name: { en: 'JSON Formatter', it: 'Formatta JSON' }, text: { en: 'Indent, minify, sort and validate, with the line of every error.', it: 'Rientra, minifica, ordina e valida, con la riga di ogni errore.' } },
  { slug: 'encoder', icon: 'Binary', name: { en: 'Base64, URL & JWT', it: 'Base64, URL e JWT' }, text: { en: 'Encode and decode Base64 and URLs, files to data URIs, JWTs opened up.', it: 'Codifica e decodifica Base64 e URL, file in data URI, JWT aperti.' } },
  { slug: 'regex-tester', icon: 'Regex', name: { en: 'Regex Tester', it: 'Tester di regex' }, text: { en: 'Matches light up as you type, with groups and a replace preview.', it: 'Le corrispondenze si accendono mentre scrivi, con gruppi e sostituzione.' } },
  { slug: 'weather-app', icon: 'CloudSun', name: { en: 'Weather', it: 'Meteo' }, text: { en: 'Weather now, next 24 hours and the week, for any city. No API key.', it: 'Meteo di adesso, prossime 24 ore e settimana, per ogni città. Senza chiavi.' } },
] as const;

export type Tool = (typeof TOOLS)[number];
export const component = (slug: string) => slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('');
