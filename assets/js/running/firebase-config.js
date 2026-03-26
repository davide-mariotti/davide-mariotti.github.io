import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyC58mSlEutcqs5UUXBMhHloDHz7sl4aQok",
    authDomain: "runstats-dm.firebaseapp.com",
    projectId: "runstats-dm",
    storageBucket: "runstats-dm.firebasestorage.app",
    messagingSenderId: "84676864953",
    appId: "1:84676864953:web:d1dcff85eb8d0056066468",
    measurementId: "G-1VX17B49PW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
