<p align="center">
  <img src="public/favicon.svg" width="96" alt="dm. logo">
</p>

<h1 align="center">davide-mariotti.github.io</h1>

<p align="center">
  My portfolio. Websites by day, small apps and games by night.<br>
  <a href="#english">English</a> · <a href="#italiano">Italiano</a> · <a href="https://davide-mariotti.github.io">Live site</a>
</p>

<p align="center">
  <a href="https://ko-fi.com/Z0X32ATNHL"><img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Buy me a coffee on Ko-fi"></a>
</p>

---

## English

### What it is

- The home of my work: who I am, the desktop apps, the browser tools, a way to get in touch.
- Built with **Astro**, **Tailwind CSS** and one **React** island: the WebGL field of characters in the hero (click it).
- In English and Italian (`/it/`). Static pages, fast, no server.
- A dedicated page for every app, with what it does, what it doesn't and how it works.

### What it isn't

- It isn't where the games live: they have their own repo, [games](https://github.com/davide-mariotti/games), served on the same `/games/` path.
- It isn't the Garmin dashboard either: that one moved to [garmin](https://github.com/davide-mariotti/garmin), still on `/garmin/`.
- No cookie wall, no tracking besides Google Analytics, no newsletter popup. You're welcome.

### Run it locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

Node 22.23 or newer. Every push to `main` is built and published by GitHub Actions (`.github/workflows/deploy.yml`).

### How it's organised

```
src/components/pages/   one component per page, with the EN and IT copy side by side
src/pages/              the routes: /, /about/, /apps/, /tools/, /contact/ and the same under /it/
src/components/         header, footer, intro, logo, the glyph background
src/styles/global.css   design tokens (one green, #2fe37f), type, buttons, cards
public/assets/          app icons, the old tools' JS and CSS
```

The nine tools are the original pages, moved inside the new layout. Their Bootstrap is scoped to `.legacy-tool` (`public/assets/css/legacy-bootstrap.css`), so it can't leak into the rest of the site.

### Credits

- Hero background: **Glyph Background** by [@skyleen77](https://21st.dev/@skyleen77/components/backgrounds-glyph) on 21st.dev, adapted to run without dependencies.
- Icons: [Lucide](https://lucide.dev) (ISC). Brand logos: [svgl](https://svgl.app).
- Fonts: Geist, Geist Mono (OFL) and Instrument Serif (OFL).

### Support

If something here saved you some time, you can [buy me a coffee on Ko-fi](https://ko-fi.com/Z0X32ATNHL).

### License

The code is [MIT](LICENSE). The words and the dm. logo are mine: ask before reusing them.

---

## Italiano

### Cos'è

- La casa del mio lavoro: chi sono, le app desktop, gli strumenti nel browser, un modo per scrivermi.
- Fatto con **Astro**, **Tailwind CSS** e un'isola **React**: il campo di caratteri in WebGL nell'hero (cliccaci sopra).
- In inglese e italiano (`/it/`). Pagine statiche, veloci, nessun server.
- Una pagina dedicata per ogni app, con cosa fa, cosa non fa e come funziona.

### Cosa non è

- Non è dove vivono i giochi: hanno la loro repo, [games](https://github.com/davide-mariotti/games), servita sullo stesso percorso `/games/`.
- Non è nemmeno la dashboard Garmin: si è spostata in [garmin](https://github.com/davide-mariotti/garmin), sempre su `/garmin/`.
- Niente muro di cookie, nessun tracciamento a parte Google Analytics, nessun popup per la newsletter. Prego.

### Avviarlo in locale

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # sito statico in dist/
```

Serve Node 22.23 o più recente. Ogni push su `main` viene compilato e pubblicato da GitHub Actions (`.github/workflows/deploy.yml`).

### Com'è organizzato

```
src/components/pages/   un componente per pagina, con i testi IT ed EN uno accanto all'altro
src/pages/              le rotte: /, /about/, /apps/, /tools/, /contact/ e le stesse sotto /it/
src/components/         header, footer, intro, logo, lo sfondo di caratteri
src/styles/global.css   i token del design (un solo verde, #2fe37f), tipografia, bottoni, card
public/assets/          icone delle app, JS e CSS dei vecchi strumenti
```

I nove strumenti sono le pagine originali, spostate dentro il nuovo layout. Il loro Bootstrap vale solo dentro `.legacy-tool` (`public/assets/css/legacy-bootstrap.css`), così non tocca il resto del sito.

### Riconoscimenti

- Sfondo dell'hero: **Glyph Background** di [@skyleen77](https://21st.dev/@skyleen77/components/backgrounds-glyph) su 21st.dev, adattato per girare senza dipendenze.
- Icone: [Lucide](https://lucide.dev) (ISC). Loghi dei marchi: [svgl](https://svgl.app).
- Font: Geist, Geist Mono (OFL) e Instrument Serif (OFL).

### Supporto

Se qualcosa qui ti ha fatto risparmiare tempo, puoi [offrirmi un caffè su Ko-fi](https://ko-fi.com/Z0X32ATNHL).

### Licenza

Il codice è [MIT](LICENSE). I testi e il logo dm. sono miei: chiedi prima di riusarli.
