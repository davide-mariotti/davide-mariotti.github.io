// Accesso ai dati per dashboard.html e piano.html.
// - In locale (file://) legge data/<atleta>/… scaricati da fetch.py, senza login.
// - Online (GitHub Pages) chiede il login Google e legge Firestore: le regole, applicate dai server
//   Firebase, lasciano passare solo gli account autorizzati per quell'atleta.
// L'atleta si sceglie con ?a=<nome-cognome>; senza, si torna all'elenco atleti (index.html).
// La config web di Firebase è pubblica per design.
const FIREBASE = {
  apiKey: 'AIzaSyDr6D5FM32_hvfN3bZD-yb4cpA8A8P2B4c',
  authDomain: 'garmin-dm.firebaseapp.com',
  projectId: 'garmin-dm',
  appId: '1:270149966300:web:0e144792bdb22ee7865719',
};
const SDK = 'https://www.gstatic.com/firebasejs/10.8.0/';
const ATHLETE = (new URLSearchParams(location.search).get('a') || '').replace(/[^a-z0-9-]/gi, '');
const PLAN_OWNER = 'davide-mariotti';  // il piano gare esiste solo per lui
if (!ATHLETE) location.replace('index.html');
const LOCAL = location.protocol === 'file:';
const SAMPLE = ATHLETE === 'sample';  // atleta demo: dati finti generati da sample.js, senza login

const loadScript = src => new Promise((ok, ko) => {
  const s = document.createElement('script');
  s.src = src; s.onload = ok; s.onerror = ko;
  document.head.append(s);
});
const gunzip = chunks => new Response(new Blob(chunks).stream().pipeThrough(new DecompressionStream('gzip'))).text();

let fb = null;
async function firebase() {
  if (!fb) {
    const [app, auth, db] = await Promise.all(['app', 'auth', 'firestore'].map(m => import(`${SDK}firebase-${m}.js`)));
    const a = app.initializeApp(FIREBASE);
    fb = { auth: auth.getAuth(a), db: db.getFirestore(a), A: auth, F: db };
  }
  return fb;
}
async function read(...path) {
  const { db, F } = await firebase();
  const snap = await F.getDoc(F.doc(db, ...path));
  return snap.exists() ? snap.data() : null;
}

// schermata a tutta pagina con un messaggio e un pulsante
function gate(text, label, action) {
  document.querySelector('.gate')?.remove();
  const el = document.createElement('div');
  el.className = 'gate';
  el.innerHTML = '<div class="gate-card"><img class="logo" src="../assets/icons/logo/dm-icon.svg" alt=""><h2>Garmin Dashboard</h2><p></p><button class="btn"></button><p class="err"></p></div>';
  el.querySelector('p').textContent = text;
  const btn = el.querySelector('button');
  btn.textContent = label;
  btn.hidden = !label;
  btn.onclick = async () => {
    btn.disabled = true;
    try { await action(); } catch (e) { el.querySelector('.err').textContent = e.message; btn.disabled = false; }
  };
  document.body.append(el);
  return el;
}
async function signedIn() {
  const { auth, A } = await firebase();
  const user = await new Promise(res => { const off = A.onAuthStateChanged(auth, u => { off(); res(u); }); });
  return user || new Promise(res => {
    const el = gate('Accedi con il tuo account Google per vedere la dashboard.', 'Accedi con Google', async () => {
      const r = await A.signInWithPopup(auth, new A.GoogleAuthProvider());
      el.remove(); res(r.user);
    });
  });
}
async function signOut() {
  const { auth, A } = await firebase();
  await A.signOut(auth);
  location.reload();
}

window.ATHLETE = ATHLETE;
window.garminSignOut = LOCAL || SAMPLE ? null : signOut;

window.garminData = async () => {
  if (LOCAL || SAMPLE) { await loadScript(SAMPLE ? 'sample.js' : `data/${ATHLETE}/garmin.js`).catch(() => {}); return window.GARMIN || null; }
  gate('Caricamento…');
  const user = await signedIn();
  const loading = gate('Caricamento dei dati…');
  try {
    const meta = await read('athletes', ATHLETE);
    if (!meta) throw new Error('nessun dato pubblicato per questa dashboard.');
    const parts = await Promise.all([...Array(meta.parts).keys()].map(i => read('athletes', ATHLETE, 'blobs', `garmin-${i}`)));
    window.GARMIN = JSON.parse(await gunzip(parts.map(p => p.d.toUint8Array())));
    loading.remove();
    return window.GARMIN;
  } catch (e) {
    gate(e.code === 'permission-denied' ? `L'account ${user.email} non è autorizzato a vedere questa dashboard.` : `Errore nel caricamento: ${e.message}`,
      'Esci e cambia account', signOut);
    throw e;
  }
};

window.garminActivity = async id => {
  if (SAMPLE) return window.sampleActivity(id);
  if (LOCAL) { await loadScript(`data/${ATHLETE}/act/${id}.js`).catch(() => {}); return window.ACT?.[id] || null; }
  const doc = await read('athletes', ATHLETE, 'acts', String(id)).catch(() => null);
  return doc ? JSON.parse(await gunzip([doc.d.toUint8Array()])) : null;
};

// analisi a blocchi (analisi.py): privata come i dati, online sta su Firestore
window.garminAnalysis = async () => {
  if (SAMPLE) return null;
  if (LOCAL) { await loadScript(`data/${ATHLETE}/analisi.js`).catch(() => {}); return window.ANALISI || null; }
  const doc = await read('athletes', ATHLETE, 'blobs', 'analysis').catch(() => null);
  return doc ? (window.ANALISI = JSON.parse(await gunzip([doc.d.toUint8Array()]))) : null;
};

// piano gare: solo di PLAN_OWNER; online sta su Firestore perché piano.js non è nella repo pubblica
window.garminPlan = async () => {
  if (window.PLAN || ATHLETE !== PLAN_OWNER) return window.PLAN || null;
  if (LOCAL) { await loadScript('piano.js').catch(() => {}); return window.PLAN || null; }
  const doc = await read('athletes', PLAN_OWNER, 'blobs', 'plan').catch(() => null);
  if (!doc) return null;
  const url = URL.createObjectURL(new Blob([await gunzip([doc.d.toUint8Array()])], { type: 'text/javascript' }));
  await loadScript(url).catch(() => {});
  URL.revokeObjectURL(url);
  return window.PLAN || null;
};
