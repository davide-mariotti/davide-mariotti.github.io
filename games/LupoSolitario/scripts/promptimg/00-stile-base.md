# Stile base — Lupo Solitario (immagini per sezione)

Questo file è la fonte di verità per lo stile visivo di TUTTE le immagini del
gioco, in tutti i libri. Ogni prompt dentro `book01/`, `book02/`, ecc. incolla
già questo blocco all'inizio — non serve copiarlo a mano, ma se lo modifichi
qui aggiorna anche i file già generati (o rigenerali con lo script).

I prompt sono scritti in **inglese**: i modelli di generazione immagini
(ChatGPT/DALL·E, Nano Banana/Gemini, Midjourney) seguono le indicazioni di
stile in modo più preciso e prevedibile in inglese. Le descrizioni "umane"
(indice, note) restano in italiano.

## Direzione artistica scelta

Pittura dark-fantasy atmosferica, semi-realistica, in stile "copertina di
romanzo fantasy" — non fumetto, non anime, non fotografia. Palette scura e
fredda con accenti caldi localizzati (fuoco, torce, bagliori magici). Luce
drammatica e cinematografica, forte chiaroscuro. Nessun testo, loghi,
filigrane o didascalie bruciate nell'immagine (a differenza di una delle
illustrazioni attuali che scrive il nome del mostro in sovraimpressione: non
va più fatto).

## Blocco di stile (da incollare in ogni prompt — già incluso nei file pronti)

```
Dark-fantasy digital painting, painterly brushwork with visible textured
strokes, semi-realistic illustrative style (not photographic, not flat
vector, not anime, not comic-book line art). Moody, cinematic lighting with
strong chiaroscuro contrast: one dominant light source (firelight, torchlight,
cold overcast daylight, or a magical glow) cutting through heavy shadow.
Desaturated, cold base palette (charcoal grey, iron blue, bone white, deep
mossy green) accented by pockets of warm color (ember orange, blood red,
torch gold) concentrated at the focal point. Atmospheric depth via fog,
smoke, dust, or mist layers separating foreground and background. Epic,
grim, foreboding mood — melancholic heroism, dark fantasy, not gratuitously
gory, suitable for a teen-and-up audience. Dynamic cinematic composition,
rule-of-thirds framing, slightly low or dramatic camera angle, single clear
focal action. Square 1:1 aspect ratio, high detail, no text, no logos, no
watermarks, no captions, no speech bubbles, no comic panel borders, no UI
elements, no modern objects anywhere in the image.
```

## Personaggio — Lupo Solitario (usare SEMPRE, identico, quando è in scena)

```
The hero, Lone Wolf: a lean, battle-hardened young warrior in his early
twenties, short dark brown hair, weathered but resolute face, wears a
hooded grey-green traveling cloak over dark leather-and-mail armor, a
longsword at his hip. Northern-European fantasy warrior archetype, grounded
and non-modern, no armor insignia or logos, no anachronistic gear.
```

## Bestiario — coerenza tra le immagini (usare la voce pertinente alla scena)

```
Kraan: a massive black-scaled, bat-winged flying beast with a reptilian
head, glowing red eyes and taloned claws — a flying beast ridden by
Darklord officers.

Giak: a small, hunched goblin-orc soldier with sallow greenish-grey skin,
crude black leather-and-iron armor, wielding a serrated spear or crude
blade.

Vordak: an undead officer of the Darklords — gaunt, withered face, hollow
eyes, flowing blood-red robes and cloak, often mounted on a Kraan.

Drakkar: a reptilian humanoid warrior, grey-green scaled skin, armored,
wielding crude weapons.

Gurgaz: a massive reptilian swamp-troll — scaled hide, hunched brutish
frame, dwelling in marshland.

Tigerwolf: a huge striped wolf-like beast used as a mount and hunting
predator by Darklord forces.
```

## Dimensione scelta

**Quadrata 1:1** (consigliata 1024×1024). Motivi: è già la dimensione delle
uniche due immagini attuali che si possono generare bene su tutti i
generatori (ChatGPT/DALL·E, Nano Banana, Midjourney di default), non serve
scegliere ogni volta un formato diverso, e nella UI del gioco l'immagine è a
`width: 100%` senza un contenitore con proporzioni fisse — quindi il quadrato
si adatta bene sia su mobile che desktop senza tagli strani. Le icone di
Arti Ramas e Armi (vedi sotto) usano lo stesso formato per uniformità.

## Ritratti di riferimento (`riferimenti/`) — coerenza tra un'immagine e l'altra

Nessuno strumento (ChatGPT, Nano Banana) garantisce da solo la stessa
identica "faccia" di un personaggio/creatura da un prompt all'altro con il
solo testo. Per questo, PRIMA di generare le scene, genera un ritratto di
riferimento per ogni soggetto ricorrente — sono già pronti in
`riferimenti/`: `ritratto-lupo-solitario.txt` e uno per ciascuna creatura
del bestiario (Kraan, Giak, Vordak, Drakkar, Gurgaz, Tigerwolf). Sono
inquadrature "a figura intera", pose neutre e ben illuminate, pensate per
essere riutilizzate come immagine-guida, non come illustrazione finale.

Ogni prompt di scena in `book01/` inizia con una riga
**"Base da riutilizzare: ..."** che elenca quali ritratti servono per quella
scena specifica. Se il tuo strumento supporta l'input "testo + immagine"
(Nano Banana/Gemini lo supporta), allega i ritratti indicati insieme al
prompt della scena. Se usi uno strumento solo-testo (es. ChatGPT in chat
senza upload), la riga serve comunque come promemoria di quali soggetti
devono restare visivamente coerenti tra loro — copia anche le descrizioni
testuali del personaggio/bestiario già incluse più sotto nel file, che sono
lo stesso identico testo usato per generare il ritratto.

Quando aggiungi una nuova creatura ricorrente in un libro futuro, crea prima
il suo ritratto in `riferimenti/`, aggiungi la voce al bestiario qui sopra,
poi scrivi i prompt di scena che la usano.

## Icone per la creazione del personaggio (`creazione-personaggio/`)

Le 10 Arti Ramas (`arti-ramas/`) e le 10 Armi (`armi/`) usate nella schermata
di creazione del personaggio hanno il proprio stile-icona dedicato (soggetto
singolo, centrato, sfondo scuro sfumato, nessuna scena) invece dello stile
"illustrazione narrativa" usato per le sezioni. Vedi il blocco più sotto e i
file già pronti in `creazione-personaggio/arti-ramas/*.txt` e
`creazione-personaggio/armi/*.txt`. Queste icone non hanno bisogno di un
ritratto di riferimento (sono soggetti singoli e isolati, non personaggi che
compaiono in più scene diverse).

```
Dark-fantasy painterly RPG icon illustration, semi-realistic, consistent
with a digital-painting book-illustration style (not flat vector, not flat
game-UI icon, not photographic, not comic line art). Single subject
centered and fully visible, isolated against a softly vignetted dark
background (deep charcoal-to-black gradient with faint atmospheric
texture, no scene or environment details). Dramatic rim lighting and a
subtle warm glow around the subject separating it from the background.
Desaturated cold palette accented with warm ember/gold highlights,
consistent with the series' established dark-fantasy look. Square 1:1
aspect ratio, high detail, no text, no numbers, no logos, no watermark, no
border or frame, no UI elements.
```

## Come sono organizzati i file

- `00-stile-base.md` → questo file (riferimento/editing, non va incollato di
  peso da nessuna parte).
- `riferimenti/ritratto-*.txt` → un ritratto di riferimento per Lupo
  Solitario e per ogni creatura del bestiario. Generali per primi.
- `book01/_indice.md` → elenco di tutte le sezioni scelte per il Libro 1,
  con stato (sostituzione di un'immagine esistente o aggiunta nuova), quali
  ritratti di riferimento usare, e descrizione breve in italiano.
- `book01/NNN-slug.txt` → un file per immagine, **pronto da copiare e
  incollare per intero** nel generatore (riga "Base da riutilizzare" +
  stile base + personaggio/bestiario pertinenti + scena specifica già
  uniti). Non serve assemblare nulla a mano.
- `creazione-personaggio/arti-ramas/*.txt` e `creazione-personaggio/armi/*.txt`
  → un'icona per ogni Arte Ramas e ogni Arma, stile icona dedicato (vedi
  sopra), pronte da copiare e incollare.
- Dopo aver generato un'immagine di sezione, salvala come
  `public/img/book01/secNNN.png` (sostituendo l'eventuale file esistente)
  e verifica che il campo `"image"` della sezione corrispondente in
  `data/books/01-flight-from-the-dark.json` punti a quel percorso. Le icone
  di Arti Ramas/Armi non hanno ancora un punto di aggancio nel codice (il
  componente `character-creator.js` oggi usa solo emoji) — se vuoi che
  vengano mostrate davvero in-app, va aggiunto un riferimento al file
  immagine in `character-creator.js`/`book2-transition.js`/`book3-transition.js`
  al posto (o affianco) dell'emoji.
