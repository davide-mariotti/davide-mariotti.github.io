// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyDmZrAr_n9Ml1qDyE0Yfd9FTJVfPE6_o-Q",
    authDomain: "luposolitario-dm.firebaseapp.com",
    projectId: "luposolitario-dm",
    storageBucket: "luposolitario-dm.firebasestorage.app",
    messagingSenderId: "281621563108",
    appId: "1:281621563108:web:24a9271c8463e9854ecef1",
    measurementId: "G-YNR6K0RSC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export { auth, db, analytics, googleProvider };
