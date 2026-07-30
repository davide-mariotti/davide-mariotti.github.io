# Conversione nuovo libro Lupo Solitario

## INPUT

* Numero libro: `<N>`
* Titolo originale inglese: `<TITOLO>`
* Sorgente HTML: `games/LupoSolitario/old-data/<CARTELLA>`
* bookId: `<0N-slug-in-inglese>`

Esempio:

* Numero libro: `5`
* Titolo: `Shadow on the Sand`
* bookId: `05-shadow-on-the-sand`

---

# OBIETTIVO

Converti il libro `<N>` di Lupo Solitario dalla sorgente HTML inglese in una versione italiana completamente giocabile, seguendo schema, terminologia, qualità e architettura già stabiliti dai libri precedenti presenti nel repository.

Lavora autonomamente fino al completamento.

Non fermarti dopo l'analisi e non chiedere conferme salvo un blocco realmente irrisolvibile.

## Regole globali

* Il repository esistente è la fonte di verità: verifica il comportamento reale nel codice, non assumere.
* Riusa primitive, convenzioni e pattern esistenti prima di modificare il motore.
* Ogni regola di gameplay esplicita nell'originale deve essere rappresentata strutturalmente quando il motore lo permette, non lasciata solamente nel testo narrativo.
* Modifica il motore solo per differenze reali introdotte dal nuovo libro e con la soluzione minima necessaria.
* Ogni nuova logica non banale richiede un test automatico.
* Mantieni terminologia, nomi, oggetti e continuità narrativa coerenti con i libri precedenti.
* Non creare infrastruttura o generalizzazioni per libri futuri non ancora implementati.
* Prima di dichiarare qualcosa "non supportato", controlla schema e implementazione reale.
* Non modificare il significato delle regole per adattarle più facilmente al motore.

---

# 1. Analisi del progetto e del nuovo libro

Prima di iniziare la traduzione leggi come fonti di verità:

* `games/LupoSolitario/scripts/validate-book.mjs`
* `games/LupoSolitario/src/game-state.js`
* `games/LupoSolitario/src/components/combat-manager.js`
* `games/LupoSolitario/src/components/story-reader.js`
* `games/LupoSolitario/src/components/character-creator.js`
* l'ultima `book*-transition.js` disponibile
* alcuni esempi reali da `games/LupoSolitario/data/books/`, soprattutto il libro precedente

Leggi inoltre le pagine di regole disponibili in:

`games/LupoSolitario/old-data/<CARTELLA>`

in particolare gli equivalenti di:

* `gamerulz.htm`
* `discplnz.htm`
* `equipmnt.htm`
* `tssf.htm`
* `cmbtrulz.htm`
* `random.htm`
* `footnotz.htm`
* `levels.htm`

Determina le differenze reali introdotte dal nuovo libro:

* regole specifiche;
* equipaggiamento iniziale;
* numero massimo di oggetti selezionabili;
* restrizioni particolari;
* nuove meccaniche;
* eventuali footnote con effetto reale sul gameplay;
* eventuali incompatibilità con il motore attuale.

Non assumere che le regole siano identiche ai libri precedenti.

---

# 2. Audit sistematico delle meccaniche

PRIMA della traduzione analizza sistematicamente tutte le `sect*.htm` alla ricerca di regole di gameplay.

Usa grep/search/script per trovare i pattern ricorrenti e poi verifica manualmente le sezioni individuate.

Riusa le primitive esistenti quando applicabili:

| Meccanica                           | Rappresentazione                                       |
| ----------------------------------- | ------------------------------------------------------ |
| Rango Kai                           | `minDisciplines`                                       |
| Soglia Resistenza                   | `minResistenza` / `maxResistenza`                      |
| Più oggetti richiesti insieme       | `requirements.items`                                   |
| Condizioni alternative              | `anyOf`                                                |
| Negazione / if-else                 | `not`                                                  |
| Modifica tiro che determina un ramo | `destinyModifier`                                      |
| Tiro che determina danno            | `loseEnduranceFromRoll`                                |
| Tiro che determina oro              | `addGoldFromRoll`                                      |
| 0 interpretato come 10              | `zeroMeansTen`                                         |
| Bonus/malus primi N round           | `combatModifiers` con `type:"firstRound"` e `rounds:N` |
| Maestria arma equipaggiata          | `weaponMasteryEquipped`                                |

Controlla almeno:

* requisiti di rango Kai;
* modificatori alla Tabella del Destino;
* modificatori derivati da Arte, oggetto o Resistenza;
* penalità/bonus di combattimento;
* penalità valide per più round;
* condizioni AND/OR/NOT;
* condizioni su più oggetti;
* soglie di Resistenza;
* quantità calcolate tramite Tabella del Destino;
* shortcut condizionali insieme a veri Destiny Test;
* nomi delle Arti Ramas.

## Destiny Test misti

Se una sezione contiene:

* 2 o più scelte basate sul risultato della Tabella del Destino;
* una o più shortcut del tipo "se possiedi X vai a Y";

le shortcut devono avere un vero `requirements` object.

Verifica il comportamento reale di `isDestinyTest` in `story-reader.js`.

## Arti Ramas

Usa esclusivamente i nomi canonici definiti da `KAI_ART_NAMES` nel validator.

Non inventare varianti, maiuscole o traduzioni alternative.

## Meccaniche non rappresentabili

Se una regola richiede realmente un nuovo sottosistema stateful o una modifica sproporzionata del motore:

1. identifica la sezione esatta;
2. descrivi il comportamento originale;
3. verifica che non esista già una primitiva utilizzabile;
4. documentala nel report finale.

Non ignorarla silenziosamente.

---

# 3. Motore e transizione

Per ogni gap reale individuato nell'audit:

1. verifica ancora che il motore non lo supporti già;
2. implementa la modifica minima necessaria;
3. aggiungi un test automatico se introduce logica non banale.

Evita refactoring non necessari.

## Transizione

Crea o aggiorna:

`src/components/book<N>-transition.js`

seguendo l'ultima transizione esistente come riferimento.

Le regole devono derivare dal NUOVO libro, non essere copiate automaticamente dal precedente.

Gestisci dove previsto:

* "La storia finora" da `tssf.htm` o equivalente;
* +10 Corone d'Oro;
* scelta della nuova Arte Ramas;
* equipaggiamento disponibile;
* limite reale di oggetti selezionabili;
* eventuali oggetti speciali automatici.

Collega la transizione ad `app.js` e alla progressione in `story-reader.js`.

Estendi il sistema solo fino al libro `<N>`.

---

# 4. Continuità narrativa e glossario

Prima della traduzione confronta:

`finale libro N-1 → storia finora libro N → transizione → sezione 1 libro N`

Leggi quindi:

* sezione `isVictory` del libro precedente;
* `tssf` del nuovo libro;
* sezione 1 del nuovo libro.

Uniforma alla terminologia già stabilita qualsiasi nome di:

* personaggio;
* luogo;
* creatura;
* organizzazione;
* oggetto.

## Glossario

Estrai inoltre i nomi propri e i termini ricorrenti del nuovo libro PRIMA di distribuire la traduzione ai subagent.

Riusa sempre la terminologia esistente per concetti fissi come:

* Lupo Solitario;
* Ramas;
* Arti Ramas;
* Registro di Guerra;
* Tabella del Destino;
* Combattività;
* Resistenza;
* Corone d'Oro;
* Zaino;
* Oggetti Speciali;
* Signori delle Tenebre;
* Spada del Sole;
* nomi delle discipline Kai.

Verifica la terminologia direttamente nei JSON dei libri precedenti.

## Spec condiviso

Crea nella scratchpad:

`book<N>-spec.md`

contenente solamente le informazioni necessarie ai traduttori:

* schema rilevante;
* glossario;
* convenzioni di traduzione;
* risultati dell'audit;
* sezioni speciali;
* rappresentazione strutturata dei pattern trovati;
* policy sulle footnote.

Questo file deve diventare la fonte condivisa dei subagent.

Non duplicare queste informazioni nei loro prompt.

---

# 5. Traduzione e strutturazione

Conta le `sect*.htm` e verifica:

* numero minimo;
* numero massimo;
* totale;
* eventuali buchi.

Dividi le sezioni in batch consecutivi di circa 25 sezioni.

Processali in parallelo tramite subagent `general-purpose`.

Ogni subagent deve ricevere solamente:

* percorso assoluto di `book<N>-spec.md`, da leggere per primo;
* range assegnato;
* percorso dei file HTML sorgente;
* eventuali sezioni speciali del proprio range;
* percorso esatto del file JSON di output nella scratchpad.

Ogni batch deve:

* tradurre fedelmente il testo;
* creare i campi strutturati necessari;
* rispettare lo spec;
* produrre esclusivamente le sezioni assegnate;
* produrre JSON valido;
* segnalare eventuali judgment call.

Non scrivere i chunk intermedi dentro `data/books/`.

Se un subagent termina prematuramente, verifica:

* esistenza del file;
* validità JSON;
* presenza di tutte le sezioni assegnate.

Rilancia solamente il batch incompleto.

---

# 6. Merge e validazione

Unisci tutti i batch nel file:

`games/LupoSolitario/data/books/<bookId>.json`

seguendo la struttura degli altri libri:

* `bookId`
* `bookNumber`
* `title`
* `originalTitle`
* `author`
* `illustrator`
* `sections`

Durante il merge verifica automaticamente:

* nessun duplicato;
* nessuna sezione mancante;
* range completo;
* JSON valido.

Poi esegui:

`node scripts/validate-book.mjs data/books/<bookId>.json`

Correggi TUTTI gli errori prima di procedere.

---

# 7. QA automatica obbligatoria

Se nel repository esistono già script di audit equivalenti, riusali.

Altrimenti crea script riutilizzabili sotto `scripts/` invece di fare controlli manuali usa-e-getta.

## 7.1 Raggiungibilità

Esegui una BFS dalla sezione 1 seguendo:

* `choices[].section`
* `combat.fleeSection`

Tutte le sezioni devono essere raggiungibili, salvo casi intenzionali presenti anche nell'originale.

Analizza ogni eccezione.

## 7.2 Link HTML ↔ JSON

Per ogni sezione estrai dall'HTML originale tutti i link:

`href="sectNNN.htm"`

Confrontali con:

* `choices[].section`
* `combat.fleeSection`

Ogni discrepanza deve essere:

* corretta;

oppure:

* compresa e documentata esplicitamente.

Non accettare discrepanze silenziose.

## 7.3 Consistenza oggetti

Estrai i nomi utilizzati nei campi relativi agli oggetti, inclusi:

* `addItem`
* `canAddItems`
* `canAddWeapon`
* `removeItem`
* `requirements.item`
* `requirements.items`

Individua varianti quasi identiche dello stesso oggetto e confrontale con l'HTML originale.

Uniforma lo stesso oggetto allo stesso nome quando necessario.

## 7.4 Destiny Test misti

Trova automaticamente sezioni contenenti:

* almeno 2 scelte riconducibili a intervalli/risultati numerici;
* altre scelte non numeriche.

Verifica che tutte le shortcut abbiano `requirements`.

## 7.5 Softlock

Ogni sezione deve avere almeno una scelta oppure uno dei flag terminali previsti dal motore, come:

* `isDeathSection`
* `isVictory`
* `isFailureEnding`

Nessuna sezione deve lasciare il giocatore senza possibilità di proseguire.

---

# 8. Controllo qualitativo manuale

Dopo i controlli automatici leggi integralmente almeno:

* sezione 1;
* sezione finale `isVictory`;
* eventuali finali alternativi;
* tutte le sezioni speciali individuate nell'audit;
* 2-3 combattimenti con regole particolari;
* alcuni campioni casuali provenienti da batch differenti.

Controlla:

* fedeltà della traduzione;
* naturalezza dell'italiano;
* terminologia;
* link;
* requirements;
* effects;
* combat;
* Destiny Test.

Verifica infine nuovamente:

`finale N-1 → transizione → sezione 1 N`

---

# 9. Test automatici

Esegui:

`npm test`

Tutti i test esistenti devono passare.

Se hai modificato il motore introducendo:

* nuovi campi;
* nuove condizioni;
* guard clause;
* nuova logica di combattimento;
* nuova logica di progressione;

aggiungi almeno un test specifico che eserciti il nuovo branch.

Non considerare il lavoro concluso con test falliti.

---

# 10. Resoconto finale

Alla fine riportami sinteticamente:

### Libro

* numero totale di sezioni;
* numero sezioni tradotte;
* file JSON finale.

### Motore

* file modificati;
* nuove logiche introdotte;
* motivo di ogni modifica.

### Transizione

* file creati/modificati;
* equipaggiamento e regole implementate.

### QA

* risultato validator;
* risultato audit raggiungibilità;
* discrepanze link trovate;
* problemi di consistenza oggetti;
* softlock trovati;
* Destiny Test problematici;
* risultato `npm test`.

### Problemi trovati

Elenca bug o incongruenze trovati e come sono stati risolti.

Se durante il lavoro trovi lo stesso bug anche nei libri precedenti, correggilo quando la causa è chiaramente la stessa e la correzione è sicura.

### Limitazioni

Indica esplicitamente:

* cosa non hai potuto verificare;
* cosa richiede controllo manuale;
* eventuali meccaniche non implementate;
* motivo tecnico.

Non dichiarare completato il lavoro finché validator, audit e test non sono terminati con successo.
