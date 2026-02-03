// Authentication Module
import { auth, googleProvider } from './firebase-config.js';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authCallbacks = [];
    }

    // Initialize auth state listener
    init() {
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.authCallbacks.forEach(callback => callback(user));
        });
    }

    // Register callback for auth state changes
    onAuthStateChange(callback) {
        this.authCallbacks.push(callback);
    }

    // Sign in with Google
    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    }

    // Sign out
    async signOut() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }
}

export const authManager = new AuthManager();
