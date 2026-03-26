import { auth, db } from './firebase-config.js';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import {
    doc,
    setDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

const provider = new GoogleAuthProvider();

/**
 * Avvia il login con Google tramite popup.
 * Salva il profilo utente su Firestore al primo accesso.
 */
export async function loginWithGoogle() {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Salva/aggiorna profilo utente su Firestore
    await setDoc(doc(db, 'users', user.uid), {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp()
    }, { merge: true });

    return user;
}

/** Disconnette l'utente corrente. */
export async function logout() {
    await signOut(auth);
}

/**
 * Registra un observer sull'auth state.
 * @param {Function} callback - Chiamato con (user | null)
 */
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

/** Ritorna l'utente corrente (sincrono, può essere null). */
export function getCurrentUser() {
    return auth.currentUser;
}
