# Prompt immagini — Lupo Solitario

Prompt pronti da incollare in un generatore di immagini (ChatGPT/DALL·E,
Nano Banana/Gemini, ecc.) per illustrare le sezioni più importanti dei libri
e per le icone di Arti Ramas/Armi/Oggetti nella creazione del personaggio.

## Contenuto

- `00-stile-base.md` — la direzione artistica scelta (pittura dark-fantasy
  atmosferica), il blocco di stile riutilizzato ovunque, la descrizione
  fissa del personaggio e del bestiario, lo stile-icona per Arti/Armi/
  Oggetti, e il motivo della scelta del formato quadrato 1:1. Leggilo prima
  di generare qualsiasi immagine, e aggiornalo se decidi di cambiare stile
  in futuro (poi rigenera i prompt).
- `riferimenti/` — 22 ritratti di riferimento: Lupo Solitario, le 6 creature
  del bestiario "storico" dal Libro 1 (Kraan, Giak, Vordak, Drakkar, Gurgaz,
  Tigerwolf), le 5 new-entry del Libro 2 (Helghast, Zlanbeast, Vonotar,
  Rhygar, Lord Axim), le 6 new-entry del Libro 3 (Barbaro dei Ghiacci,
  Kalkoth, Baknar, Demone di Ghiaccio, Akraa'Neonor, Loi-Kymar) e le 4
  new-entry del Libro 4 (Barraka, Capitano D'Val, Elix, Madelon).
  **Generali PRIMA di tutto il resto**: sono pensati per essere riusati come
  immagine-guida quando generi le scene che contengono quel soggetto, così
  il suo aspetto resta coerente da un'immagine all'altra E tra un libro e il
  successivo (Vonotar, ad esempio, introdotto nel Libro 2, ricompare anche
  nel Libro 3 con lo stesso identico ritratto — Helghast idem).
- `book01/` — 55 prompt pronti per il Libro 1 (Fuga dalle Tenebre).
- `book02/` — 50 prompt pronti per il Libro 2 (Fuoco sulle Acque).
- `book03/` — 50 prompt pronti per il Libro 3 (Le Caverne di Kalte).
- `book04/` — 50 prompt pronti per il Libro 4 (Il Baratro della Perdizione).
  Tutte e quattro le cartelle: un file per sezione, già completo (riga "Base
  da riutilizzare" + stile + personaggio/bestiario pertinenti + scena), più
  un `_indice.md` con lo stato (sostituzione di un'immagine esistente o
  aggiunta nuova) e quali ritratti di riferimento servono per ciascuna.
- `creazione-personaggio/arti-ramas/` — 10 icone, una per Arte Ramas
  (Mimetismo, Caccia, Sesto Senso, Orientamento, Guarigione, Scherma,
  Psicoschermo, Psicolaser, Affinità Animale, Telecinesi), da usare nella
  schermata di creazione del personaggio.
- `creazione-personaggio/armi/` — 10 icone, una per arma (Pugnale, Daga,
  Lancia, Mazza, Martello, Spada, Spada Corta, Ascia, Asta, Spadone).
- `creazione-personaggio/oggetti/` — 9 icone per gli Oggetti Speciali/da
  Zaino nominati concessi dalla creazione del personaggio e dalle
  transizioni tra libri (Elmo, Cotta di Maglia, Scudo, Giubba di Cuoio
  Imbottito, Mappa, Sigillo di Hammerdal, Pozione Magica, Pozione Curativa,
  Pozione di Laumspur). Non copre i tantissimi oggetti unici che compaiono
  nel testo narrativo dei libri: per quelli l'app mostra un'emoji generica
  di riserva (🎒 nello Zaino, ✨ negli Oggetti Speciali) finché non vengono
  generate icone dedicate.
- `bookNN/` — stessa struttura per i libri successivi, quando li genererai
  (vedi "Estendere ad altri libri" sotto — Libro 2 è già un esempio reale
  di come si fa).

## Come si usa

1. **Genera nel tool solo i ritratti in `riferimenti/` che non hai ancora
   generato come immagine reale.** I file `.txt` restano lì come prompt di
   riferimento anche dopo che li hai usati — non vanno rigenerati/rilanciati
   una seconda volta solo perché esiste il file. Prima di lanciare un
   ritratto, controlla cosa hai già come immagine salvata: se hai già fatto
   Lupo Solitario e il bestiario dei Libri 1-4, quando arrivi a un libro
   nuovo dovrai generare solo i ritratti delle creature/personaggi
   VERAMENTE nuovi che quel libro introduce (vedi "Estendere ad altri
   libri" sotto).
2. Apri `book01/_indice.md`, `book02/_indice.md`, `book03/_indice.md` o
   `book04/_indice.md` e scegli quale sezione generare (o falle tutte in
   ordine). La colonna "Riferimenti da usare" ti dice quali ritratti servono
   per quella scena.
3. Apri il file `.txt` della sezione e copia **l'intero contenuto** nel
   generatore. Se lo strumento supporta testo+immagine (Nano Banana/Gemini
   sì), allega anche i ritratti di riferimento indicati nella prima riga
   del prompt ("Base da riutilizzare: ..."). Se il tuo strumento è solo
   testo, quella riga resta comunque un promemoria utile — le descrizioni
   testuali del personaggio/bestiario più sotto nello stesso file sono
   identiche a quelle usate per generare il ritratto.
4. Salva l'immagine generata come `public/img/book0N/secNNN.png`
   (sostituendo il file esistente per le sezioni segnate "Sostituzione").
5. Controlla che il campo `"image"` della sezione corrispondente in
   `data/books/0N-*.json` punti già a quel percorso (per le sezioni
   "Sostituzione" è già così; per le sezioni "Nuova" dovrai aggiungere il
   campo `"image": "public/img/book0N/secNNN.png"` alla sezione nel JSON).
6. Rilancia `node scripts/validate-book.mjs` per essere sicuro che il
   percorso dell'immagine sia corretto e il file esista.

Per le icone di Arti Ramas/Armi/Oggetti: genera dal file `.txt` in
`creazione-personaggio/arti-ramas/`, `creazione-personaggio/armi/` o
`creazione-personaggio/oggetti/`, non serve nessun ritratto di riferimento
(sono soggetti isolati, non personaggi/creature che ricorrono in più
scene). Sono già collegate nel codice (`ITEM_IMAGES`/`WEAPON_IMAGES` in
`character-creator.js`): appena salvi il file immagine al percorso giusto
(`public/img/arti-ramas/`, `public/img/weapon/`, `public/img/oggetti/`,
nomi esatti nei rispettivi `_indice.md`), appare automaticamente in-app,
senza bisogno di altre modifiche.

## Perché non tutte le ~350 sezioni per libro

Ogni libro ha circa 350 sezioni; illustrarle tutte è possibile in futuro ma
per ora questa è la selezione delle sezioni più importanti dal punto di
vista narrativo/visivo (combattimenti con nemici unici, rivelazioni,
luoghi memorabili, oggetti speciali significativi, la morte di
compagni/PNG, l'inizio e il finale). Se vuoi espandere la copertura più
avanti, usa lo stesso criterio: apri il libro, individua i momenti con un
"fotogramma" chiaro e memorabile, e crea un nuovo file `.txt` con lo stesso
schema (riga "Base da riutilizzare" se serve + stile base + personaggio/
bestiario pertinenti + scena specifica).

## Estendere ad altri libri

Per il Libro 5, 6, ecc.: crea una cartella `bookNN/`, riusa lo stesso
`00-stile-base.md` e gli stessi ritratti in `riferimenti/` (Lupo Solitario e
il bestiario già esistente restano gli stessi in tutta la serie — i Libri
2-4 hanno già dimostrato che questo funziona: Vonotar, introdotto nel Libro
2, ricompare nel Libro 3 con lo stesso identico ritratto; Helghast idem). Se
un libro introduce nuove creature/personaggi ricorrenti (appaiono in 3+
scene scelte):
1. Aggiungi la voce del bestiario in `00-stile-base.md`.
2. Genera il suo ritratto di riferimento in `riferimenti/`.
3. Scrivi i prompt di scena del nuovo libro con la riga "Base da
   riutilizzare" che lo include, esattamente come fatto per gli altri libri.

Personaggi umani nominati che compaiono SOLO in quel libro (es. Rhygar, Lord
Axim nel Libro 2; Barraka, Capitano D'Val, Madelon nel Libro 4) meritano
comunque un ritratto se ricorrono spesso — non serve che tornino in libri
futuri per giustificarlo, basta la coerenza interna al libro stesso su più
illustrazioni.
