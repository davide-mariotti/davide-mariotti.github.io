// Save Manager - Cloud saves with Firestore
import { db } from './firebase-config.js';
import { authManager } from './auth.js';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

class SaveManager {
    constructor() {
        this.autoSaveEnabled = true;
        this.autoSaveTimeout = null;
    }

    // Get user's saves collection reference
    getUserSavesRef() {
        const user = authManager.getCurrentUser();
        if (!user) throw new Error('User not authenticated');
        return collection(db, 'users', user.uid, 'saves');
    }

    // Auto-save with debouncing (wait 2 seconds after last change)
    scheduleAutoSave(gameState) {
        if (!this.autoSaveEnabled) return;

        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.autoSave(gameState);
        }, 2000);
    }

    // Auto-save to the "autosave" slot
    async autoSave(gameState) {
        try {
            await this.saveGame('autosave', gameState);
            console.log('✅ Auto-saved at', new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }

    // Save game to a specific slot
    async saveGame(saveId, gameState) {
        const user = authManager.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        const saveData = {
            ...gameState,
            timestamp: Timestamp.now(),
            userId: user.uid,
            saveId: saveId
        };

        const saveRef = doc(db, 'users', user.uid, 'saves', saveId);
        await setDoc(saveRef, saveData);

        return saveData;
    }

    // Load a specific save
    async loadGame(saveId) {
        const user = authManager.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        const saveRef = doc(db, 'users', user.uid, 'saves', saveId);
        const saveDoc = await getDoc(saveRef);

        if (!saveDoc.exists()) {
            return null;
        }

        return saveDoc.data();
    }

    // List all saves for the current user
    async listSaves() {
        const savesRef = this.getUserSavesRef();
        const q = query(savesRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    // Delete a save
    async deleteSave(saveId) {
        const user = authManager.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        const saveRef = doc(db, 'users', user.uid, 'saves', saveId);
        await deleteDoc(saveRef);
    }

    // Check if autosave exists
    async hasAutoSave() {
        const autoSave = await this.loadGame('autosave');
        return autoSave !== null;
    }
}

export const saveManager = new SaveManager();
