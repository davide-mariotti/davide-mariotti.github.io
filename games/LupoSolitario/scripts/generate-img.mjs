# Creazione prompt immagini — Lupo Solitario Libro `<N>`

## INPUT

* Numero libro: `<N>`
* bookId: `<0N-slug-in-inglese>`
* JSON definitivo: `games/LupoSolitario/data/books/<bookId>.json`
* Sorgente originale: `games/LupoSolitario/old-data/<CARTELLA>`

# OBIETTIVO

Prepara la pipeline di prompt per le illustrazioni del libro `<N>` seguendo esattamente la direzione artistica, la struttura e le convenzioni già utilizzate per i libri precedenti.

NON generare immagini reali.

Il tuo compito termina con la preparazione dei prompt `.txt`, degli eventuali nuovi ritratti di riferimento e dell'indice del libro.

---

# 1. Studia il sistema esistente

Leggi integralmente:

* `scripts/promptimg/00-stile-base.md`
* `scripts/promptimg/README.md`

Esamina inoltre:

* `scripts/promptimg/book*/`
* `scripts/promptimg/riferimenti/`

Usa i libri precedenti come fonte di verità per:

* direzione artistica;
* struttura dei prompt;
* descrizione di Lupo Solitario;
* bestiario;
* formato dei ritratti;
* riga `Base da riutilizzare`;
* struttura degli `_indice.md`;
* criterio utilizzato per scegliere quali sezioni illustrare.

Non reinventare il formato.

---

# 2. Analizza il nuovo libro

Leggi il JSON definitivo:

`data/books/<bookId>.json`

e usa gli HTML originali quando servono dettagli visivi aggiuntivi.

Individua gli eventi e le ambientazioni più importanti dal punto di vista narrativo e visivo.

Dai priorità a:

* apertura del libro;
* finale;
* combattimenti con nemici unici;
* boss;
* luoghi memorabili;
* rivelazioni;
* momenti narrativi importanti;
* incontri con personaggi rilevanti;
* morti o eventi drammatici;
* creature caratteristiche;
* oggetti speciali importanti;
* scene che definiscono visivamente il nuovo libro.

Non creare un'immagine per tutte le ~350 sezioni.

Segui lo stesso criterio di selezione spiegato nel README e utilizzato per i libri precedenti.

Come ordine di grandezza punta a circa **50 sezioni**, adattando il numero quando il contenuto del libro lo giustifica.

---

# 3. Seleziona le sezioni

Crea inizialmente una lista delle sezioni candidate.

Per ogni candidata annota:

* numero sezione;
* evento principale;
* importanza narrativa;
* valore visivo;
* personaggi presenti;
* creature presenti;
* eventuali riferimenti già esistenti.

Riduci poi la selezione alle sezioni realmente meritevoli di illustrazione.

Evita immagini quasi duplicate dello stesso evento, luogo o combattimento.

Distribuisci le immagini lungo tutto il libro invece di concentrarle solamente in una parte.

---

# 4. Analizza i riferimenti esistenti

Prima di creare qualsiasi nuovo ritratto controlla:

`scripts/promptimg/riferimenti/`

e il bestiario presente in:

`scripts/promptimg/00-stile-base.md`

NON creare nuovamente un riferimento per:

* Lupo Solitario;
* personaggi già presenti;
* creature già presenti;
* bestie già descritte;
* soggetti che dispongono già di un ritratto utilizzabile.

I riferimenti esistenti devono essere RIUTILIZZATI citandoli nella riga:

`Base da riutilizzare: ...`

Non riscrivere né rigenerare riferimenti già disponibili.

---

# 5. Nuovi personaggi e creature

Identifica personaggi o creature realmente nuovi introdotti nel libro `<N>`.

Crea un nuovo ritratto di riferimento solamente quando è utile mantenere consistenza visiva tra più scene.

Come criterio generale, un nuovo riferimento è giustificato se il soggetto:

* compare in almeno 3 delle scene selezionate;

oppure:

* è un personaggio nominato molto importante la cui identità visiva deve rimanere coerente.

Non creare ritratti per comparse o creature presenti in una sola scena, salvo casi narrativamente eccezionali.

## Per ogni nuovo riferimento

### 1. Aggiorna il bestiario

Aggiungi la relativa descrizione in:

`scripts/promptimg/00-stile-base.md`

seguendo esattamente il formato delle voci esistenti.

Usa il tag appropriato:

* `(Libro N)` se rilevante solamente per questo libro;
* `(Libro N+)` se destinato a ricorrere anche successivamente.

Non dichiarare una ricorrenza futura se non è nota dal materiale disponibile.

### 2. Crea il ritratto

Crea:

`scripts/promptimg/riferimenti/ritratto-<nome>.txt`

seguendo esattamente la struttura dei ritratti esistenti:

* blocco di stile reference portrait;
* descrizione fisica;
* abbigliamento/equipaggiamento;
* caratteristiche distintive;
* atmosfera coerente con la direzione artistica.

Il prompt deve essere sufficientemente specifico da produrre un'identità visiva stabile nelle scene successive.

---

# 6. Crea i prompt delle scene

Crea:

`scripts/promptimg/book<N>/`

e al suo interno un `.txt` per ogni sezione selezionata.

Segui naming convention e struttura dei libri precedenti.

Ogni file deve essere completamente autonomo e pronto da copiare nel generatore di immagini.

Deve contenere, nello stesso formato già usato nel progetto:

1. `Base da riutilizzare: ...`
2. riferimenti visivi pertinenti;
3. blocco di stile;
4. descrizione di Lupo Solitario quando presente;
5. descrizioni pertinenti dal bestiario;
6. descrizione precisa della scena.

## Base da riutilizzare

Inserisci solamente i ritratti realmente presenti nella scena.

Esempio concettuale:

`Base da riutilizzare: Lupo Solitario, ritratto-<personaggio>`

Non citare riferimenti inutilizzati.

## Descrizione della scena

Derivala dal contenuto reale della sezione.

Specifica quando rilevante:

* ambiente;
* momento della giornata;
* condizioni atmosferiche;
* posizione dei personaggi;
* azione;
* espressioni;
* nemici;
* armi;
* elementi architettonici;
* elementi narrativamente importanti;
* inquadratura utile;
* atmosfera.

Mantieni fedeltà al testo.

Non aggiungere elementi fantasy generici che contraddicano l'ambientazione o la scena.

## Continuità visiva

Quando un soggetto possiede un riferimento, il prompt della scena deve basarsi su quel riferimento invece di reinterpretarne liberamente l'aspetto.

Mantieni inoltre coerenti:

* abbigliamento;
* equipaggiamento;
* caratteristiche fisiche;
* design delle creature;
* epoca;
* estetica generale.

---

# 7. Crea l'indice

Crea:

`scripts/promptimg/book<N>/_indice.md`

seguendo il formato degli altri libri.

Per ogni sezione illustrata indica almeno:

* numero sezione;
* descrizione breve in italiano;
* riferimenti da utilizzare;
* stato dell'immagine.

Mantieni la stessa convenzione già presente nel repository per distinguere:

* prompt preparato;
* immagine da generare;
* immagine sostituita/completata.

---

# 8. Aggiorna README

Aggiorna:

`scripts/promptimg/README.md`

inserendo `book<N>/` nell'elenco dei contenuti.

Indica:

* numero totale di prompt scene creati;
* eventuali nuovi ritratti di riferimento;
* nuovo totale dei riferimenti, se il README mantiene questo conteggio.

Mantieni struttura e stile del README esistente.

---

# 9. Controllo qualità

Prima di considerare concluso il lavoro verifica automaticamente o manualmente che:

### File

* ogni sezione presente nell'indice abbia il relativo `.txt`;
* ogni `.txt` abbia una voce nell'indice;
* non esistano prompt duplicati;
* i nomi file rispettino le convenzioni.

### Riferimenti

* ogni riferimento citato da `Base da riutilizzare` esista realmente;
* nessun riferimento già esistente sia stato duplicato;
* ogni nuovo ritratto sia effettivamente utilizzato;
* le descrizioni del bestiario siano coerenti con i prompt.

### Contenuto

Leggi integralmente un campione comprendente almeno:

* apertura;
* finale;
* 2-3 combattimenti;
* 2-3 scene narrative;
* scene con nuovi riferimenti.

Verifica:

* fedeltà alla sezione;
* continuità visiva;
* assenza di contraddizioni;
* qualità e precisione del prompt.

---

# 10. Limite del task

NON generare immagini reali.

NON aggiungere automaticamente il campo `"image"` alle sezioni del JSON del libro.

La generazione delle immagini tramite ChatGPT, Nano Banana o altro strumento esterno e il successivo salvataggio dei PNG in:

`public/img/book<N>/`

restano un passaggio separato.

Questo task termina con la preparazione completa dei prompt.

---

# 11. Resoconto finale

Riporta:

### Scene

* numero totale di prompt creati;
* sezioni selezionate;
* criterio generale di selezione.

### Riferimenti

* riferimenti esistenti riutilizzati;
* nuovi personaggi/creature aggiunti;
* nuovi file `ritratto-*.txt`.

Se non è stato necessario creare nuovi riferimenti, dichiaralo esplicitamente.

### File

* cartella `book<N>/` creata;
* `_indice.md` aggiornato;
* modifiche a `00-stile-base.md`;
* modifiche a `README.md`.

### Controlli

* eventuali riferimenti mancanti;
* duplicazioni trovate e corrette;
* problemi o ambiguità visive riscontrate.

Non dichiarare completato il lavoro finché indice, prompt, riferimenti e README non sono coerenti tra loro.
