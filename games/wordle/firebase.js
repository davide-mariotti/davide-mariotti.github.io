// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    setDoc,
    doc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsm6eBLzFZYkw8lxUSKUBkrxxZlk6Ytrw",
    authDomain: "wordle-dm.firebaseapp.com",
    projectId: "wordle-dm",
    storageBucket: "wordle-dm.firebasestorage.app",
    messagingSenderId: "29159589489",
    appId: "1:29159589489:web:6738d75567de387fb7bdd0",
    measurementId: "G-R070GKEH8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Auth Functions
export function loginWithGoogle() {
    return signInWithPopup(auth, provider);
}

export function logoutUser() {
    return signOut(auth);
}

export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

export async function updateUserProfile(user, { displayName, photoURL }) {
    if (!user) return;
    try {
        await updateProfile(user, {
            displayName: displayName,
            photoURL: photoURL
        });

        // Also update Firestore user record
        await setDoc(doc(db, "wordle_users", user.uid), {
            displayName: displayName,
            photoURL: photoURL,
            lastUpdated: serverTimestamp()
        }, { merge: true });

        console.log("Profile updated");
    } catch (e) {
        console.error("Error updating profile:", e);
        throw e;
    }
}

// Firestore Functions

/**
 * Save user persistent stats
 * @param {object} user - User object
 * @param {object} stats - Stats object
 */
export async function saveUserStats(user, stats) {
    if (!user) return;
    try {
        await setDoc(doc(db, "wordle_users", user.uid), {
            stats: stats,
            lastUpdated: serverTimestamp(),
            displayName: user.displayName,
            photoURL: user.photoURL
        }, { merge: true });
        console.log("Stats saved to cloud");
    } catch (e) {
        console.error("Error saving user stats:", e);
    }
}

/**
 * Get user persistent stats
 * @param {object} user 
 * @returns {object|null} stats
 */
export async function getUserStats(user) {
    if (!user) return null;
    try {
        const docRef = doc(db, "wordle_users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().stats;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (e) {
        console.error("Error fetching user stats:", e);
        return null;
    }
}

/**
 * Save a game score
 * @param {object} user - User object from auth
 * @param {number} attempts - Number of guesses (1-6), or other score metric
 * @param {boolean} won - Whether the game was won
 */
export async function saveGameScore(user, attempts, won) {
    if (!user) return;

    try {
        await addDoc(collection(db, "wordle_scores"), {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            attempts: attempts,
            won: won,
            timestamp: serverTimestamp()
        });
        console.log("Score saved!");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

/**
 * Get Global Leaderboard
 * Returns top 10 winners (ordered by attempts ideally, or just recent wins for now - logic depends on what we want to rank)
 * For Wordle, ranking is usually sorting by 'attempts' (ascending) for 'won' games.
 */
export async function getLeaderboard() {
    const scoresRef = collection(db, "wordle_scores");
    // Simple query: Get last 20 wins ordered by time (Active players)
    // Or: Get best scores (lowest attempts)
    const q = query(
        scoresRef,
        orderBy("attempts", "asc"),
        orderBy("timestamp", "desc"),
        limit(20)
    );

    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
        scores.push(doc.data());
    });
    return scores;
}

export { auth, db };
