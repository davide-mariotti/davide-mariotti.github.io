/**
 * profile.js — Gestione profilo atleta su Firestore.
 * Struttura: users/{uid}/profile (documento singolo, non subcollection)
 */

import { db } from './firebase-config.js';
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

/** Valori di default per un nuovo profilo. */
export const profileDefaults = {
    // Gara obiettivo
    raceDistance: 42.195,       // km
    raceDate: '',               // ISO date string 'YYYY-MM-DD'
    raceTargetPace: 0,          // min/km decimal (0 = non impostato)

    // Zone FC (bpm assoluti)
    hrMax: 190,                 // FC massima personale
    hrEasyMax: 150,             // soglia massima per "fondo lento" (Z2)
    hrTempoMin: 158,            // soglia min zona tempo/FM
    hrTempoMax: 168,            // soglia max zona tempo/FM

    // Passo di riferimento fondo lento attuale
    easyPaceTarget: 0,          // min/km decimal (0 = non impostato)

    setupCompleted: false,
    updatedAt: null
};

/**
 * Carica il profilo di un utente da Firestore.
 * @param {string} uid
 * @returns {Object|null} profilo con defaults applicati, oppure null se non esiste
 */
export async function getProfile(uid) {
    const ref = doc(db, 'users', uid, 'profile', 'data');
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    // Applica defaults per campi mancanti (retrocompatibilità futura)
    return { ...profileDefaults, ...snap.data() };
}

/**
 * Salva (upsert) il profilo di un utente su Firestore.
 * @param {string} uid
 * @param {Object} data — campi parziali o completi del profilo
 */
export async function saveProfile(uid, data) {
    const ref = doc(db, 'users', uid, 'profile', 'data');
    await setDoc(ref, {
        ...data,
        updatedAt: serverTimestamp()
    }, { merge: true });
}

/**
 * Classifica una sessione in base al profilo FC dell'utente.
 * Ritorna una stringa: 'easy' | 'tempo' | 'hard' | 'long' | 'run'
 * 'run' = nessun profilo o dati insufficienti per classificare.
 *
 * La classificazione è display-only e non viene salvata su Firestore:
 * si ricalcola sempre dal profilo corrente.
 *
 * @param {Object} session
 * @param {Object|null} profile
 * @returns {string}
 */
export function classifySession(session, profile) {
    if (!profile || !profile.setupCompleted) return 'run';

    const hr = session.hrAvg;
    const dist = session.distance || 0;

    // Lungo: distanza ≥ 25km (indipendentemente dalla FC)
    if (dist >= 25) return 'long';

    if (hr && hr > 0) {
        if (hr <= profile.hrEasyMax) return 'easy';
        if (hr >= profile.hrTempoMin && hr <= profile.hrTempoMax) return 'tempo';
        if (hr > profile.hrTempoMax) return 'hard';
    }

    // Fallback distanza: se non c'è FC e la distanza è alta
    if (dist >= 20) return 'long';

    return 'run'; // non classificabile
}

/**
 * Config badge per ogni tipo sessione.
 * label, emoji, colore CSS (per lo stile inline)
 */
export const SESSION_TYPE_CONFIG = {
    easy:  { label: 'Fondo Lento', emoji: '🏃', color: 'rgba(46,204,113,0.85)',  bg: 'rgba(46,204,113,0.12)',  border: 'rgba(46,204,113,0.4)'  },
    tempo: { label: 'Fondo Medio', emoji: '🔥', color: 'rgba(251,191,36,0.9)',   bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.4)'  },
    hard:  { label: 'Duro/Rep',    emoji: '⚡', color: 'rgba(249,115,22,0.9)',   bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.4)'  },
    long:  { label: 'Lungo',       emoji: '🪨', color: 'rgba(96,165,250,0.9)',   bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.4)'  },
    run:   { label: '',            emoji: '',   color: 'transparent',           bg: 'transparent',           border: 'transparent'           },
};

/**
 * Parsa una stringa passo "M:SS" o "MM:SS" in un numero decimale min/km.
 * Ritorna 0 se non valido.
 */
export function parsePaceInput(str) {
    if (!str || typeof str !== 'string') return 0;
    const parts = str.trim().split(':');
    if (parts.length !== 2) return 0;
    const min = parseInt(parts[0], 10);
    const sec = parseInt(parts[1], 10);
    if (isNaN(min) || isNaN(sec) || sec < 0 || sec >= 60) return 0;
    return parseFloat((min + sec / 60).toFixed(4));
}

/**
 * Formatta un passo decimal in "M:SS".
 */
export function formatPaceDecimal(dec) {
    if (!dec || dec <= 0) return '';
    const min = Math.floor(dec);
    const sec = Math.round((dec - min) * 60);
    return `${min}:${String(sec).padStart(2, '0')}`;
}
