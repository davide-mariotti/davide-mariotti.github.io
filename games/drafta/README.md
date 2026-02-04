# ⚽ DRAFTA - L'Arte della Guerra (Fanta-Calcistica) ⚔️

> *Stanco dei fogli Excel che si rompono alla terza chiamata? Stufo di urlare "A QUANTO STIAMO?" ogni 5 minuti? Benvenuto nel futuro (distopico) delle aste.*

**Drafta** non è solo un'app. È uno strumento di tortura psicologica per i tuoi amici di lega, travestito da software gestionale. Progettata per gestire aste live in tempo reale, senza pietà e senza calcolatrici.

---

## 🚀 Perché Drafta? (Le Feature che ti cambiano la vita)

### ⚡ **Real-Time Estremo (Grazie Google)**
Usiamo **Firebase Firestore** per sincronizzare ogni singolo bit. Se il tuo amico clicca "Pick" su Lukaku, tu lo vedi prima ancora che lui se ne penta. Latenza? Non pervenuta (si spera).

### 💂 **Gestione Rose Draconiana**
Basta difensori messi in attacco "per sbaglio". Drafta sa contare:
- **3 Portieri, 8 Difensori, 8 Centrocampisti, 6 Attaccanti**.
- Non puoi comprare il settimo attaccante. Non puoi. Mettiti l'anima in pace.
- **Blocco Portieri**: Compri il primo portiere della Juve? Il sistema ti suggerisce (o impone, se sei Host cattivo) di prendere gli altri due.

### 🧠 **Cervellone Import/Export**
- **Importa Rose**: Hai un file CSV brutto e sporco con le rose parziali? Buttalo dentro! Drafta crea la stanza, assegna i giocatori, calcola i crediti spesi e ti mette in pista.
- **Export CSV**: A fine asta (o quando vi arrendete), scarica un file CSV pulito, profumato e pronto per il sito di leghe.

### ⚖️ **L'Ordine dei Turni (Democrazia Algoritmica)**
Chi chiama il prossimo giocatore? Non si tira a caso (o forse sì, se vuoi).
Abbiamo implementato un **Popup Intelligente** per le leghe importate:
1.  🏷️ **Strict (Il Rigoroso)**: Chi ha meno Portieri chiama. A pari merito? Chi ha meno Difensori. E via così. P>D>C>A. Perfetto per chi ha l'OCD.
2.  🔢 **Free (Il Democratico)**: Chi ha meno giocatori in totale chiama. Semplice.
3.  💎 **Value (Il Capitalista)**: Chi ha speso meno chiama. I poveri prima!

---

## 🤓 L'Angolo del Nerd (Tech Stack)

Sotto il cofano non c'è React, non c'è Angular, non c'è Svelte. C'è **Puro, Sporco, Vanilla JavaScript**.
Perché? Perché ci piace soffrire e avere il controllo totale sul DOM (o quasi).

-   **Frontend**: HTML5, CSS3 (Variabili CSS, Grid, Flexbox e tante imprecazioni).
-   **Backend**: Firebase (Auth, Firestore per il DB NoSQL).
-   **Assets**: Immagini giocatori pescate dinamicamente (sperando che l'URL non cambi mai).
-   **PWA Ready**: Funziona su mobile come se fosse nativa. Installala e sentiti un hacker.

---

## 🛠️ Istruzioni per l'Uso

1.  **Entra**: Login con Google (comodo, veloce, ci rubiamo solo l'anima).
2.  **Crea o Importa**:
    *   *Nuova Asta*: Parti da zero. Tabula rasa.
    *   *Importa Rose*: Carica quel file CSV e prega. Il sistema riconosce le squadre e ti fa entrare automaticamente (sì, abbiamo fixato il bug dell'auto-join, tranquillo).
3.  **Il Draft**:
    *   **Host**: Tu sei Dio. Puoi forzare pick, resettare turni, mostrare password.
    *   **Utenti**: Voi subite. Cliccate "Pick" quando tocca a voi.
4.  **Conflitti**: Se due cliccano insieme? Vince Firestore. La verità sta nel cloud.

---

## 📜 Disclaimer

*L'autore non si assume responsabilità per amicizie rovinate, crediti spesi per giocatori rotti, o crash del server durante l'asta per Haaland. Drafta responsabilmente.*

> *Made con ❤️ (e tanta caffeina) da Davide Mariotti.*
