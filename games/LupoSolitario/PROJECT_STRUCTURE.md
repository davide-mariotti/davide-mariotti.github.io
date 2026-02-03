# 📁 Struttura del Progetto - Lupo Solitario

## 🎯 Nuova Organizzazione

### 📂 `/src` - Codice Sorgente

#### **Core Files**
- `app.js` - Controller principale (ora modulare e snello!)
- `firebase-config.js` - Configurazione Firebase
- `auth.js` - Gestione autenticazione
- `game-state.js` - Stato di gioco centralizzato
- `save-manager.js` - Gestione salvataggi cloud

#### **`/components`** - Componenti UI
- `character-creator.js` - Wizard creazione personaggio
- `character-sheet.js` - Scheda personaggio
- `story-reader.js` - Lettore sezioni
- `combat-manager.js` - Sistema combattimento
- `destiny-table.js` - Tabella del destino

#### **`/utils`** - Utilities (NUOVO! 🎉)
- `ui-helpers.js` - Toast, modal, conferme
- `screen-manager.js` - Gestione schermate
- `menu-manager.js` - Menu di gioco

#### **`/styles`** - CSS
- `main.css` - Design system e componenti
- `layout.css` - Layout e responsive (SEPARATO! 🎨)

---

## 📊 `/data` - Dati di Gioco

### **Struttura Dati**

```
data/
├── intro-common.json      # Intro e regole comuni a tutti i libri
└── books/
    ├── 01-flight-from-the-dark.json
    ├── 02-...
    └── ...
```

### **`intro-common.json`** ✨
Contiene:
- 📖 Backstory (Storia di Lupo Solitario)
- 📝 Regole del gioco
- 🧙 Descrizioni Arti Kai
- ⚔️ Regole di combattimento
- 🎒 Equipaggiamento

### **`books/XX-title.json`**
Struttura libro:
```json
{
  "bookId": "01-flight-from-the-dark",
  "bookNumber": 1,
  "title": "Fuga dalle Tenebre",
  "sections": {
    "1": {
      "title": "...",
      "text": "...",
      "combat": { ... },
      "effects": { ... },
      "choices": [ ... ]
    }
  }
}
```

---

## 🗂️ `/assets` - Risorse Statiche

```
assets/
├── css/           # CSS vecchio (Bootstrap, etc)
├── scss/          # SCSS vecchio
├── js/            # JS vecchio (main.js, fight.js, etc)
└── img/           # Immagini e icone
```

> ⚠️ **Nota:** I file in `/assets/js` e `/assets/css` NON sono più usati dalla nuova app!
> Sono mantenuti solo come backup/riferimento.

---

## 📋 File Principali Root

- `index.html` - HTML principale (SPA)
- `manifest.json` - PWA manifest
- `service-worker.js` - Service worker
- `firestore.rules` - Regole sicurezza Firestore
- `README.md` - Documentazione
- `FIREBASE_SETUP.md` - Guida configurazione
- `.gitignore` - Esclusioni Git

---

## 🗄️ Backup e File Vecchi

### **Cartelle `.OLD`**
- `00-intro.OLD/` - HTML intro vecchio (BACKUP)
- `01-flight-from-the-dark.OLD/` - HTML sezioni vecchie (BACKUP)

> 💡 **Questi file NON sono più usati** ma sono conservati per referenza.
> Puoi eliminarli quando hai completato la conversione in JSON.

---

## 🔄 Migrazioni Completate

### ✅ CSS
- ❌ **Prima:** CSS inline in `index.html` (100+ righe)
- ✅ **Ora:** CSS separato in `src/styles/layout.css`

### ✅ JavaScript
- ❌ **Prima:** `app.js` monolitico (250+ righe)
- ✅ **Ora:** Modulare con utilities separate:
  - `app.js` (170 righe)
  - `utils/ui-helpers.js` (100 righe)
  - `utils/screen-manager.js` (100 righe)
  - `utils/menu-manager.js` (80 righe)

### ✅ Contenuti
- ❌ **Prima:** HTML sparsi in cartelle separate
- ✅ **Ora:** JSON strutturati in `/data`

---

## 📝 Prossimi Passi

1. **Converti sezioni libro 1**
   - Trasforma HTML da `01-flight-from-the-dark.OLD/` in JSON
   - Popola `data/books/01-flight-from-the-dark.json`

2. **Elimina vecchi backup** (opzionale)
   ```bash
   rm -rf 00-intro.OLD
   rm -rf 01-flight-from-the-dark.OLD
   rm -rf assets/js/main.js
   rm -rf assets/js/fight.js
   ```

3. **Aggiungi più libri**
   - Crea nuovi JSON in `data/books/`
   - Segui la stessa struttura

---

## 🎯 Vantaggi della Nuova Struttura

✨ **Modularità:** Ogni file ha una responsabilità chiara  
📦 **Riusabilità:** Utilities comuni separati  
🎨 **Manutenibilità:** CSS organizzato per funzione  
📊 **Scalabilità:** Facile aggiungere nuovi libri  
🔍 **Leggibilità:** Meno righe per file, più facile da navigare  

---

**Buona organizzazione = Buon codice!** 🚀📁
