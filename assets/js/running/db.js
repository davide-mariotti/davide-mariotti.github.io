import { db } from './firebase-config.js';
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    query,
    orderBy,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

/**
 * Salva una sessione parsed su Firestore per l'utente corrente.
 * Struttura: users/{userId}/sessions/{sessionId}
 * @returns {string} ID del documento creato
 */
export async function saveSession(userId, sessionData) {
    const sessionsRef = collection(db, 'users', userId, 'sessions');
    const docRef = await addDoc(sessionsRef, {
        ...sessionData,
        savedAt: serverTimestamp()
    });
    return docRef.id;
}

/**
 * Carica tutte le sessioni dell'utente, ordinate per data discendente.
 * @returns {Array<Object>} lista sessioni con id incluso
 */
export async function getUserSessions(userId) {
    const sessionsRef = collection(db, 'users', userId, 'sessions');
    const q = query(sessionsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Elimina una sessione specifica dell'utente.
 */
export async function deleteSession(userId, sessionId) {
    const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
    await deleteDoc(sessionRef);
}

/**
 * Carica una singola sessione per ID (per la pagina dettaglio).
 */
export async function getSession(userId, sessionId) {
    const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
    const snap = await getDoc(sessionRef);
    if (!snap.exists()) throw new Error('Sessione non trovata.');
    return { id: snap.id, ...snap.data() };
}

