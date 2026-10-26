# Analisi di un atleta, da gara a gara

Procedura per rifare (o aggiornare) l'analisi che compare nella pagina **Analisi** della dashboard (`analisi.html?a=<atleta>`).
Va rilanciata **dopo ogni gara** (si aggiunge un blocco) e, se serve, a metà di un blocco lungo.
L'obiettivo è un giudizio da allenatore: sincero, concreto, con i numeri, senza giri di parole.

Tutti i dati e il commento sono **privati** (`data/<atleta>/`, mai nella repo pubblica). Nella repo stanno solo questo file, `analisi.py` e `analisi.html`.

---

## File

| File | Cosa contiene | Chi lo scrive |
|---|---|---|
| `data/<atleta>/gare.json` | Le gare che chiudono i blocchi: `{"races": [{"date", "name", "km"}]}` | a mano, una riga per gara |
| `data/<atleta>/vo2max.json` | VO2max Garmin nel tempo: `{"points": [["AAAA-MM-GG", 50.1], …]}` | dal connettore MCP `garmin` (solo per l'account collegato) |
| `data/<atleta>/analisi-coach.json` | Il commento: sintesi, verdetto, giudizio per blocco, priorità, numeri da guardare | Claude, dopo aver letto i numeri |
| `data/<atleta>/analisi.js` | Risultato di `analisi.py` (numeri + commento), letto dalla pagina e pubblicato su Firestore | `analisi.py` |
| `analisi.py` | Calcolo dei blocchi e riassunto leggibile | codice versionato |
| `analisi.html` | La pagina | codice versionato |

## Procedura

1. **Dati aggiornati.** `.venv\Scripts\python fetch.py --athlete <atleta>` (incrementale; i dettagli FIT/GPX servono per i giri).
2. **Gare.** Aggiungi la gara nuova a `gare.json` (data, nome, km ufficiali). La gara è la corsa più lunga di quel giorno. Chiedi all'atleta com'è andata: se era malato o accompagnava qualcuno, scrivi `"effort": "invalid"` e una `note`.
3. **VO2max** (se l'atleta è quello collegato al connettore MCP). `mcp__garmin__get_vo2max_trend` accetta al massimo 90 giorni: chiedi finestre consecutive dall'ultimo punto salvato a oggi e aggiungi a `vo2max.json` un valore ogni 2–3 settimane, solo dei giorni ricalcolati (non `carried_forward`). I primi 1–2 mesi di un orologio nuovo sono di calibrazione: escludili e scrivilo in `note`.
4. **Calcolo.** `.venv\Scripts\python analisi.py <atleta>` e leggi il riassunto stampato (blocchi, gare, FC a passo fisso per periodo).
5. **Controlli di senso** (sezione sotto) prima di credere a qualsiasi tendenza.
6. **Commento.** Scrivi o aggiorna `analisi-coach.json` (struttura e regole sotto) e rilancia `analisi.py`: unisce il commento ai numeri.
7. **Verifica la pagina** in locale: `analisi.html?a=<atleta>` come file, screenshot a 1440 e 390 px (vedi `CLAUDE.md`, "Note tecniche"), nessun errore console.
8. **Pubblica.** `.venv\Scripts\python publish.py <atleta>` carica anche l'analisi (`athletes/<atleta>/blobs/analysis`). In GitHub Actions il file non c'è e resta online l'ultima versione pubblicata.
9. **Registro.** Una riga datata nel `CLAUDE.md` con le conclusioni principali; se l'analisi cambia le attese sulle gare, aggiorna anche il piano (con conferma dell'atleta) e il registro delle decisioni.

## Come sono definiti i blocchi

- Un blocco va dal giorno dopo una gara al giorno della gara successiva (la gara è dentro il blocco che chiude). Il primo parte dalla prima corsa; dopo l'ultima gara c'è il blocco **in corso**.
- Le gare sono escluse dalle statistiche di allenamento (zone, giri, lunghi) e analizzate a parte.
- Le **zone** sono quelle attuali dell'atleta per tutti i blocchi, così i blocchi sono confrontabili.

## Le metriche e come leggerle

| Metrica | Come si calcola | Come si legge |
|---|---|---|
| **FC a passo fisso** (la più importante) | Mediana della FC dei giri "a regime" in 6 fasce di passo corretto per la pendenza (6:15–6:40 … 4:30–4:55), per periodo. Blocchi oltre 20 settimane divisi in due al primo del mese più vicino a metà | Più bassa = più efficiente. Differenze di 1–2 bpm sono rumore; 3+ bpm con n ≥ 20 sono reali. Confronta **stessa stagione** (estate con estate) |
| Passo a FC fissa | Retta velocità ~ FC sui giri a regime | Solo indicativa: se il blocco ha corso quasi tutto allo stesso passo la retta si appiattisce e dà passi troppo ottimistici a FC bassa. Usa la FC a passo fisso per le conclusioni |
| Tempo nelle zone | Serie FC dei FIT, zone attuali, solo allenamenti | Quanto lavoro facile, medio e duro. Tanta Z3 = "zona grigia" |
| Deriva cardiaca (decoupling) | Efficienza (velocità/FC) seconda metà vs prima, solo lunghi ≥ 70' con FC media ≤ 155 e velocità costante tra le metà (±4%) | < 3% ottimo, 3–5% buono, > 5% base aerobica da costruire |
| VO2max Garmin | Dal connettore | Guarda la tendenza su 4–6 settimane. Scende quando mancano uscite a intensità medio-alta, anche se la base migliora |
| VDOT gara | Formula Daniels/Gilbert sul tempo ufficiale | Il confronto più oggettivo tra gare di distanze diverse, **solo se la gara è a tutta** (vedi "Lo sforzo delle gare"). Una maratona vale di solito 1–2 punti meno della mezza della stessa forma |
| Forma di corsa | Mediane su uscite pianeggianti (≤ 10 m/km) a passo facile reale 5:45–6:45, e in gara | Confronta sempre a parità di passo. Cadenza alta e contatto breve = corsa più leggera; rapporto verticale < 9% buono. In gara: velocità = cadenza × lunghezza del passo, quindi se il passo si accorcia a parità di cadenza manca spinta (forza, freschezza) |
| Corpo e recupero | FC a riposo, HRV, sonno, stress, peso (mediane del blocco) | FC a riposo in salita e HRV in discesa per settimane = fatica o malattia. Il peso pesa: ~2–3 s/km per kg |
| Carico prima della gara | Km nei 7/14/28 giorni prima, lungo più lungo nelle 6 settimane | Senza scarico (settimana gara oltre il 60% del picco) la gara non misura la forma vera |

## Lo sforzo delle gare

Una gara misura la forma solo se è corsa a tutta. `analisi.py` confronta la FC media con la soglia (Garmin):
- **a tutta**: almeno il 98% della soglia in mezza (Davide: ~170 bpm, 101%, chiusura a 175), almeno il 92% in maratona;
- **controllata**: sotto quelle soglie. Il VDOT della gara è un **minimo**: la forma vera era più alta. Indizio forte: FC che scende negli ultimi 5 km;
- **non indicativa** (`"effort": "invalid"` in `gare.json`): malattia nei giorni prima, gara corsa accompagnando qualcuno, crisi evidente.

Per stimare il potenziale di una gara controllata usa la FC a passo fisso del periodo e il riferimento a tutta della stessa distanza (10 bpm in più valgono indicativamente 15–20 s/km in mezza). **Calibra il piano solo su gare a tutta e su test a tutta**; le gare controllate alzano il minimo, non fissano la forma.

Errori già fatti (26/10/2026): il personale di mezza di marzo 2026 (FC 160, 95% della soglia, in calo nel finale) era stato letto come una gara a tutta con la fascia che leggeva male; Pisa 2026 (post-febbre, da accompagnatore) come un calo di forma. Chiedi sempre all'atleta prima di concludere.

## Controlli di senso (trappole già incontrate)

1. **FC in ritardo dopo un cambio di ritmo.** I giri subito dopo un'accelerazione hanno FC bassa e passo alto: per questo contano solo i giri a regime (il giro prima allo stesso passo ±6%, niente primo giro, niente recuperi, almeno 3 minuti).
2. **Passo corretto per la pendenza sulle colline.** Una corsa collinare lenta può risultare "a passo facile" con la cadenza delle salite: per la forma di corsa usa solo uscite pianeggianti e il passo reale.
3. **Progressivi e lunghi con blocchi veloci** falsano la deriva: si misura solo sui lunghi a velocità costante.
4. **Stagione.** Il caldo alza la FC di 5–10 bpm a parità di passo: confronta estate con estate e inverno con inverno prima di parlare di progresso o regresso.
5. **Pochi dati.** Con n < 10 una cella non dimostra niente: dillo.
6. **Sensore.** FC media di gara che *scende* nella seconda metà a parità di passo, o salti improvvisi tra mesi senza motivo, fanno pensare a una lettura sbagliata della fascia: segnalalo, non costruirci sopra conclusioni.
7. **Specificità.** Prima di dire "peggiorato a ritmo gara", conta quanti giri a quel ritmo ci sono nel periodo: si migliora in quello che si allena.
8. **Triangola.** Una tendenza è vera solo se la confermano almeno due misure indipendenti (es. FC a passo fisso + VO2max + una gara).

## Come scrivere il commento

`analisi-coach.json`:

```json
{
  "updated": "AAAA-MM-GG",
  "headline": "una frase che dice dove è l'atleta oggi",
  "verdict": [{ "title": "affermazione netta", "text": "i numeri che la dimostrano" }],
  "blocks": { "B1": { "title": "…", "good": ["…"], "bad": ["…"], "text": "giudizio in 2–3 frasi" } },
  "priorities": [{ "title": "cosa fare", "text": "come e con quale obiettivo misurabile" }],
  "watch": [{ "metric": "…", "now": "…", "target": "…" }]
}
```

Regole:
- **Sincero e concreto.** Ogni affermazione con il suo numero (e la sua n se è una mediana). Niente complimenti generici, niente "ottimo lavoro".
- **Distingui i livelli.** Motore lento (FC a passo facile), resistenza alla velocità di gara (FC a 5:00–5:35, VO2max, gare), forma di corsa, corpo e recupero. Spesso vanno in direzioni diverse: dillo.
- **Spiega il perché** con quello che è cambiato nell'allenamento: distribuzione delle zone, giri a ritmo gara, frequenza, lunghi, forza, sonno, peso, scarico.
- **Dì cosa è incerto** (pochi dati, sensore, caldo) invece di nasconderlo.
- **Priorità in ordine**, poche e azionabili, ciascuna con un obiettivo misurabile e una data; i "numeri da guardare" sono quelli che la prossima analisi deve controllare.
- **Confronta con l'analisi precedente**: gli obiettivi di `watch` sono stati raggiunti? Scrivilo nel verdetto.
- Italiano, frasi corte, tono da allenatore che parla all'atleta (seconda persona).

## Nuovo atleta

Crea `data/<atleta>/gare.json` con almeno una gara e lancia la procedura. Senza il connettore MCP sul suo account `vo2max.json` resta assente: la pagina mostra il resto. La pagina è dietro login come la dashboard (regole Firestore: `athletes/<atleta>/{doc=**}`).
