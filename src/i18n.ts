export type Lang = 'en' | 'it';

/** Same page in the other language: /about/ <-> /it/about/ */
export const localize = (lang: Lang, path: string) => (lang === 'it' ? `/it${path === '/' ? '/' : path}` : path);
export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'it' : 'en');

export const SOCIAL = {
  github: 'https://github.com/davide-mariotti',
  linkedin: 'https://www.linkedin.com/in/davide-mariotti-f1991/',
  instagram: 'https://www.instagram.com/guesly91/',
  kofi: 'https://ko-fi.com/Z0X32ATNHL',
};

export const ui = {
  en: {
    nav: { work: 'Work', apps: 'Apps', tools: 'Tools', games: 'Games', about: 'About', contact: "Let's talk" },
    skip: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    switchTo: 'Italiano',
    footer: {
      tagline: 'Front-end developer from San Miniato, Italy. Websites by day, small apps and games by night.',
      built: 'Designed and built by Davide Mariotti, with Astro.',
      coffee: 'Buy me a coffee',
      explore: 'Explore',
      elsewhere: 'Elsewhere',
    },
  },
  it: {
    nav: { work: 'Lavori', apps: 'App', tools: 'Strumenti', games: 'Giochi', about: 'Chi sono', contact: 'Parliamone' },
    skip: 'Vai al contenuto',
    menu: 'Menu',
    close: 'Chiudi',
    switchTo: 'English',
    footer: {
      tagline: 'Front-end developer di San Miniato. Di giorno siti web, di sera piccole app e giochi.',
      built: 'Progettato e sviluppato da Davide Mariotti, con Astro.',
      coffee: 'Offrimi un caffè',
      explore: 'Esplora',
      elsewhere: 'Altrove',
    },
  },
} as const;
