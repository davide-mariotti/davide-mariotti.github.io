# 🐺 Lupo Solitario - Fuga dalle Tenebre

Moderna web app per giocare ai libri-game di Lupo Solitario con salvataggio cloud e PWA!

## ✨ Caratteristiche

- 🔐 Autenticazione Google + salvataggi cloud
- ⚔️ Combattimento automatizzato
- 🎮 Creazione personaggio completa
- 📱 Mobile-first design
- 📲 PWA installabile
- 🎨 UI moderna con glassmorphism
- 💾 Auto-save automatico

## 🚀 Quick Start

### 1. Avvia server locale

```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx http-server -p 8000
```

### 2. Apri nel browser

```
http://localhost:8000
```

### 3. Gioca!

1. Accedi con Google
2. Crea il tuo personaggio
3. Inizia l'avventura! 🐺⚔️

## 📁 Struttura Progetto

Vedi [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) per dettagli completi.

```
LupoSolitario/
├── index.html              # Main HTML
├── src/
│   ├── app.js             # Main app
│   ├── components/        # UI components
│   ├── utils/             # Utilities
│   └── styles/            # CSS
├── data/
│   ├── intro-common.json  # Contenuto comune
│   └── books/             # Dati libri
└── assets/                # Immagini
```

3. Configurare i domini autorizzati (vedi FIREBASE_SETUP.md)
4. Deployare le security rules:

```bash
firebase deploy --only firestore:rules
```

## 📱 PWA - Installa su Mobile

**iOS:** Safari → Condividi → Aggiungi a Home  
**Android:** Chrome → Menu → Aggiungi a schermata Home

## 📝 Sviluppo

### Aggiungere nuovi libri

Crea un file JSON in `data/books/`:

```json
{
  "bookId": "02-title",
  "bookNumber": 2,
  "title": "Titolo",
  "sections": { ... }
}
```

Vedi il file esistente per la struttura completa.

## 🆕 Novità v2.0

- ✅ CSS modulare separato
- ✅ JS organizzato in utilities
- ✅ Intro common JSON per tutti i libri
- ✅ Struttura più pulita e manutenibile

## 📚 Documentazione

- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Struttura dettagliata
- [walkthrough.md](.gemini/antigravity/brain/.../walkthrough.md) - Guida implementazione

## 📄 Crediti

**Autore originale:** Joe Dever  
**Illustratore:** Gary Chalk  
**Web App:** Fan-made moderna  
**Tech Stack:** Vanilla JS + Firebase + PWA

---

**Buona avventura, Lupo Solitario!** 🐺⚔️
