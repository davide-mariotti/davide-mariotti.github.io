import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://davide-mariotti.github.io',
  // SEO Scraper was removed (Google closed the Custom Search JSON API): old links land on the tools page
  redirects: { '/tools/scrap-seo': '/tools/' },
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', it: 'it' } },
      filter: (page) => !/\.html$|\/404/.test(page),
    }),
  ],
  i18n: { defaultLocale: 'en', locales: ['en', 'it'], routing: { prefixDefaultLocale: false } },
  vite: { plugins: [tailwindcss()] },
});
