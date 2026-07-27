# Prompt immagini — Lupo Solitario

Prompt pronti da incollare in un generatore di immagini (ChatGPT/DALL·E,
Nano Banana/Gemini, ecc.) per illustrare le sezioni più importanti dei libri
e per le icone di Arti Ramas/Armi nella creazione del personaggio.

## Contenuto

- `00-stile-base.md` — la direzione artistica scelta (pittura dark-fantasy
  atmosferica), il blocco di stile riutilizzato ovunque, la descrizione
  fissa del personaggio e del bestiario, lo stile-icona per Arti/Armi, e il
  motivo della scelta del formato quadrato 1:1. Leggilo prima di generare
  qualsiasi immagine, e aggiornalo se decidi di cambiare stile in futuro
  (poi rigenera i prompt).
- `riferimenti/` — 7 ritratti di riferimento (Lupo Solitario + le 6
  creature del bestiario: Kraan, Giak, Vordak, Drakkar, Gurgaz, Tigerwolf).
  **Generali PRIMA di tutto il resto**: sono pensati per essere riusati come
  immagine-guida quando generi le scene che contengono quel soggetto, così
  il suo aspetto resta coerente da un'immagine all'altra.
- `book01/` — 55 prompt pronti per il Libro 1 (Fuga dalle Tenebre), uno per
  file, già completi (riga "Base da riutilizzare" + stile + personaggio/
  bestiario pertinenti + scena). `book01/_indice.md` elenca tutte le
  sezioni scelte con lo stato (sostituzione di un'immagine esistente o
  aggiunta nuova) e quali ritratti di riferimento servono per ciascuna.
- `creazione-personaggio/arti-ramas/` — 10 icone, una per Arte Ramas
  (Mimetismo, Caccia, Sesto Senso, Orientamento, Guarigione, Scherma,
  Psicoschermo, Psicolaser, Affinità Animale, Telecinesi), da usare nella
  schermata di creazione del personaggio.
- `creazione-personaggio/armi/` — 10 icone, una per arma (Pugnale, Daga,
  Lancia, Mazza, Martello, Spada, Spada Corta, Ascia, Asta, Spadone).
- `bookNN/` — stessa struttura di `book01/` per i libri successivi, quando
  li genererai.

## Come si usa

1. **Genera prima i 7 ritratti in `riferimenti/`.** Copia ogni file per
   intero nel generatore, salva le immagini da parte (non vanno nel gioco,
   servono solo come riferimento visivo per te/per lo strumento).
2. Apri `book01/_indice.md` e scegli quale sezione generare (o falle tutte
   in ordine). La colonna "Riferimenti da usare" ti dice quali ritratti
   servono per quella scena.
3. Apri il file `.txt` della sezione e copia **l'intero contenuto** nel
   generatore. Se lo strumento supporta testo+immagine (Nano Banana/Gemini
   sì), allega anche i ritratti di riferimento indicati nella prima riga
   del prompt ("Base da riutilizzare: ..."). Se il tuo strumento è solo
   testo, quella riga resta comunque un promemoria utile — le descrizioni
   testuali del personaggio/bestiario più sotto nello stesso file sono
   identiche a quelle usate per generare il ritratto.
4. Salva l'immagine generata come `public/img/book01/secNNN.png`
   (sostituendo il file esistente per le sezioni segnate "Sostituzione").
5. Controlla che il campo `"image"` della sezione corrispondente in
   `data/books/01-flight-from-the-dark.json` punti già a quel percorso
   (per le sezioni "Sostituzione" è già così; per le sezioni "Nuova" dovrai
   aggiungere il campo `"image": "public/img/book01/secNNN.png"` alla
   sezione nel JSON).
6. Rilancia `node scripts/validate-book.mjs` per essere sicuro che il
   percorso dell'immagine sia corretto e il file esista.

Per le icone di Arti Ramas/Armi: genera dal file `.txt` in
`creazione-personaggio/arti-ramas/` o `creazione-personaggio/armi/`, non
serve nessun ritratto di riferimento (sono soggetti isolati, non
personaggi/creature che ricorrono in più scene). **Nota**: oggi
`character-creator.js` mostra solo un'emoji per ogni Arte Ramas/Arma, non
un'immagine — se vuoi che le icone generate appaiano davvero nell'app,
serve anche una piccola modifica al codice per usare il file immagine al
posto (o affianco) dell'emoji. Dimmelo quando le hai generate e la faccio.

## Perché solo 55 sezioni e non tutte le ~350

Il Libro 1 ha circa 350 sezioni; illustrarle tutte è possibile in futuro ma
per ora questa è la selezione delle sezioni più importanti dal punto di
vista narrativo/visivo (combattimenti con nemici unici, rivelazioni,
luoghi memorabili, oggetti speciali significativi, la morte di
compagni/PNG, l'inizio e il finale). Se vuoi espandere la copertura più
avanti, usa lo stesso criterio: apri il libro, individua i momenti con un
"fotogramma" chiaro e memorabile, e crea un nuovo file `.txt` con lo stesso
schema (riga "Base da riutilizzare" se serve + stile base + personaggio/
bestiario pertinenti + scena specifica).

## Estendere ad altri libri

Per il Libro 2, 3, ecc.: crea una cartella `bookNN/`, riusa lo stesso
`00-stile-base.md` e gli stessi ritratti in `riferimenti/` (Lupo Solitario e
il bestiario restano gli stessi in tutta la serie). Se un libro introduce
nuove creature ricorrenti (es. i Barbari dei Ghiacci nel Libro 3):
1. Aggiungi la voce del bestiario in `00-stile-base.md`.
2. Genera il suo ritratto di riferimento in `riferimenti/`.
3. Scrivi i prompt di scena del nuovo libro con la riga "Base da
   riutilizzare" che lo include, esattamente come fatto per `book01/`.
