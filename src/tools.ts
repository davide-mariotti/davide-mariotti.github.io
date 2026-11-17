// The browser tools: one entry per page in src/pages/tools/ (EN only, the tools' UI is in English).
export const TOOLS = [
  { slug: 'psw-generator', icon: 'KeyRound', name: 'Password Generator', en: 'Strong passwords in one click, with the rules you choose.', it: 'Password robuste con un clic, con le regole che scegli tu.' },
  { slug: 'color-converter', icon: 'Palette', name: 'Color Converter', en: 'HEX, RGB, HSL and CMYK, back and forth.', it: 'HEX, RGB, HSL e CMYK, avanti e indietro.' },
  { slug: 'wcag-contrast-calculator', icon: 'Contrast', name: 'WCAG Contrast', en: 'Is that grey on white readable? Check it against WCAG.', it: 'Quel grigio su bianco si legge? Controllalo con le WCAG.' },
  { slug: 'img-optimization', icon: 'ImageDown', name: 'Image Optimizer', en: 'Compress images locally: nothing leaves your browser.', it: 'Comprimi le immagini in locale: niente esce dal browser.' },
  { slug: 'img-extractor', icon: 'Images', name: 'Image Extractor', en: 'Every image of a web page, ready to download.', it: 'Tutte le immagini di una pagina web, pronte da scaricare.' },
  { slug: 'case-converter', icon: 'CaseSensitive', name: 'Case Converter', en: 'UPPER, lower, Title, camelCase and friends.', it: 'MAIUSCOLO, minuscolo, Titolo, camelCase e compagnia.' },
  { slug: 'html-beautify', icon: 'Braces', name: 'HTML Beautifier', en: 'Turns a wall of HTML into something you can read.', it: 'Trasforma un muro di HTML in qualcosa di leggibile.' },
  { slug: 'scrap-seo', icon: 'SearchCode', name: 'SEO Scraper', en: 'Google results for a query, through Custom Search.', it: 'I risultati di Google per una ricerca, tramite Custom Search.' },
  { slug: 'weather-app', icon: 'CloudSun', name: 'Weather', en: 'Current weather and forecast for any city.', it: 'Meteo attuale e previsioni per qualsiasi città.' },
] as const;
