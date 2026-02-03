# 🔥 Guida Setup Firebase - Lupo Solitario

## 📋 Checklist Setup

- [ ] 1. Creare progetto Firebase
- [ ] 2. Attivare Authentication (Google)
- [ ] 3. Attivare Firestore Database
- [ ] 4. Configurare security rules
- [ ] 5. Aggiungere domini autorizzati
- [ ] 6. (Opzionale) Attivare Analytics

---

## 1️⃣ Creare Progetto Firebase

### Accedi alla Console
👉 https://console.firebase.google.com/

### Crea Nuovo Progetto
1. Click su **"Aggiungi progetto"** (o "Add project")
2. Nome progetto: **"lupo-solitario"** (o quello che preferisci)
3. **Google Analytics:** Opzionale (consigliato ✅)
4. Click **"Crea progetto"**

---

## 2️⃣ Attivare Authentication

### Passo 1: Vai su Authentication
1. Nel menu laterale: **Build** → **Authentication**
2. Click **"Get started"**

### Passo 2: Attiva Google Sign-In
1. Tab **"Sign-in method"**
2. Click su **"Google"**
3. **Attiva** lo switch in alto
4. Configura:
   - **Nome pubblico del progetto:** "Lupo Solitario"
   - **Email di supporto:** La tua email
5. Click **"Salva"**

### ✅ Verifiche
- [ ] Google provider è **Abilitato** (verde)
- [ ] Email di supporto configurata

---

## 3️⃣ Attivare Firestore Database

### Passo 1: Crea Database
1. Menu laterale: **Build** → **Firestore Database**
2. Click **"Create database"**

### Passo 2: Scegli Modalità
**⚠️ IMPORTANTE:** Scegli **"Start in production mode"**
- NON test mode!
- Useremo le nostre regole custom

### Passo 3: Scegli Location
Scegli il server più vicino:
- **Europa:** `europe-west1` (Belgio) - CONSIGLIATO 🇪🇺
- **Europa:** `europe-west3` (Frankfurt)
- **Europa:** `europe-west2` (London)

Click **"Abilita"**

### ✅ Verifiche
- [ ] Database creato
- [ ] Modalità: Production
- [ ] Location: Europa

---

## 4️⃣ Configurare Security Rules

### Passo 1: Vai alle Rules
1. Firestore Database → Tab **"Rules"**
2. Vedrai l'editor delle regole

### Passo 2: Sostituisci le Regole

**Copia e incolla queste regole:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regola generale:nega tutto di default
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Users collection - ogni utente può accedere solo ai propri dati
    match /users/{userId} {
      // Permetti lettura e scrittura solo all'utente autenticato
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcollection: saves (salvataggi di gioco)
      match /saves/{saveId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Subcollection: profile (profilo utente)
      match /profile/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Passo 3: Pubblica
Click **"Pubblica"** (o "Publish")

### 🔒 Cosa fanno queste regole?

✅ **Sicurezza garantita:**
- Ogni utente può accedere SOLO ai propri dati
- Utenti non autenticati: nessun accesso
- Impossibile leggere dati di altri utenti

✅ **Struttura permessa:**
```
users/
  {userId}/           ← Solo se userId == auth.uid
    saves/
      autosave/       ← Salvataggio automatico
      save1/          ← Salvataggio manuale 1
      save2/          ← Salvataggio manuale 2
    profile/          ← Profilo utente (futuro)
```

### ✅ Verifiche
- [ ] Regole pubblicate
- [ ] Nessun errore nell'editor
- [ ] Match `users/{userId}` visibile

---

## 5️⃣ Domini Autorizzati

### Passo 1: Vai su Authentication Settings
1. **Authentication** → Tab **"Settings"**
2. Scorri fino a **"Authorized domains"**

### Passo 2: Aggiungi Domini

**Domini da autorizzare:**

✅ **Già presenti (default):**
- `localhost`
- `*.firebaseapp.com`

🆕 **Se usi altri domini, aggiungi:**
- Il tuo dominio custom (es: `luposolitario.com`)
- `127.0.0.1` (se serve per testing)

### ✅ Verifiche
- [ ] `localhost` presente
- [ ] Domini Firebase presenti
- [ ] (Opzionale) Domini custom aggiunti

---

## 6️⃣ Configurazione App Web

### Configura le credenziali nel codice

File: `src/firebase-config.js`

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDRiOA-aHGHaWQqHC_Mn5fHGqtc0f3Cqa4",
  ...
};
```

### 🛡️ Sicurezza: Restrizione Dominio
Poiché le chiavi saranno pubbliche su GitHub, **DEVI** proteggerle restringendo l'uso al tuo dominio.

#### 1. Google Cloud Console (API Key)
1. Vai su [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials)
2. Seleziona la tua **API Key** (usata in `apiKey`)
3. Sotto "Application restrictions", scegli **Websites (HTTP referrers)**
4. Aggiungi i tuoi domini:
   - `https://davide-mariotti.github.io/*`
   - `http://localhost:8000/*` (per sviluppo locale)
5. Salva.

#### 2. Firebase Authentication (Auth Domains)
1. Vai su **Firebase Console > Authentication > Settings > Authorized domains**
2. Aggiungi: `davide-mariotti.github.io`

✅ **Ora le tue chiavi sono sicure anche se pubbliche!**
Solo le richieste provenienti da questi domini saranno accettate.

---

## 7️⃣ (Opzionale) Analytics

### Se hai abilitato Analytics

1. **Analytics** nel menu laterale
2. Configurazione automatica
3. Nessuna azione richiesta!

Il codice nel progetto già include Analytics:
```javascript
import { getAnalytics } from "firebase/analytics";
const analytics = getAnalytics(app);
```

---

## 8️⃣ Deployment Regole (CLI - Opzionale)

### Se hai Firebase CLI installato:

```bash
# Login
firebase login

# Inizializza progetto (se non fatto)
firebase init firestore

# Deploy solo le regole
firebase deploy --only firestore:rules
```

### Non hai Firebase CLI?
✅ Non serve! Le regole le hai già pubblicate dalla console (step 4)

---

## ✅ Checklist Finale

### Verifica che tutto sia attivo:

**Authentication:**
- [ ] Google provider: Abilitato ✅
- [ ] Email supporto: Configurata ✅

**Firestore:**
- [ ] Database creato ✅
- [ ] Modalità: Production ✅
- [ ] Location: Europa ✅
- [ ] Rules: Pubblicate ✅

**Domini:**
- [ ] localhost autorizzato ✅
- [ ] Firebase domains autorizzati ✅

**App:**
- [ ] firebase-config.js creato e configurato ✅

---

## 🧪 Test del Setup

### 1. Avvia l'app in locale

```bash
python -m http.server 8000
# oppure
npx http-server -p 8000
```

### 2. Apri nel browser

```
http://localhost:8000
```

### 3. Testa Login

1. Click **"Accedi con Google"**
2. Scegli account Google
3. Autorizza l'app
4. ✅ Dovresti vedere la schermata di creazione personaggio

### 4. Verifica Firestore

1. **Console Firebase** → **Firestore Database**
2. Dopo aver creato un personaggio, dovresti vedere:
   ```
   users/
     {tuo-user-id}/
       saves/
         autosave/
   ```

---

## ❌ Troubleshooting

### Errore: "auth/unauthorized-domain"
**Soluzione:** Aggiungi il dominio in Authentication → Settings → Authorized domains

### Errore: "permission-denied" su Firestore
**Soluzione:** Verifica che le rules siano pubblicate (step 4)

### Login non funziona
**Soluzione:** 
1. Verifica Google provider abilitato
2. Verifica email di supporto configurata
3. Controlla console browser per errori

### Dati non si salvano
**Soluzione:**
1. Verifica di essere autenticato
2. Controlla Firestore rules
3. Guarda console browser per errori

---

## 📊 Costi Firebase

### Piano Gratuito (Spark)

**Firestore:**
- ✅ 50,000 letture/giorno
- ✅ 20,000 scritture/giorno
- ✅ 20,000 cancellazioni/giorno
- ✅ 1 GB storage

**Authentication:**
- ✅ Illimitato (gratuito)

**Per questo progetto:**
- ✅ Piano gratuito è ABBONDANTE
- ✅ Probabilmente non supererai mai i limiti
- ✅ Nessun costo previsto

---

## 🎯 Riepilogo Veloce

1. **Console:** https://console.firebase.google.com/
2. **Attiva:**
   - Authentication → Google ✅
   - Firestore → Production mode ✅
3. **Pubblica rules** (da step 4) ✅
4. **Testa:** Login + Salvataggio ✅

**Done!** 🎉

---

**Il tuo Firebase è pronto per Lupo Solitario!** 🐺🔥
