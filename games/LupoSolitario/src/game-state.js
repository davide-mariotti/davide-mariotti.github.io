// Game State Manager - Central game state with reactive updates
import { saveManager } from './save-manager.js';

class GameState {
    constructor() {
        this.listeners = [];
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            bookId: '01-flight-from-the-dark',
            bookNumber: 1,
            currentSection: 1,
            easyMode: localStorage.getItem('lupo_easy_mode') === 'true',
            history: [1], // Section history for back button
            character: {
                combattivita: 0,
                resistenza: 0,
                resistenzaMax: 0,
                artiRamas: [], // Max 5
                armi: [], // Max 2
                zaino: [], // Max 8 items including meals
                corone: 0, // Max 50
                pasti: 0,
                oggettiSpeciali: [] // No limit
            },
            inCombat: false,
            combatState: null,
            lastCombatSummary: null,
            flags: {}
        };
    }

    // Subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notify all listeners of state change
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
        // Schedule auto-save
        saveManager.scheduleAutoSave(this.state);
    }

    // Update state
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notifyListeners();
    }

    setEasyMode(enabled) {
        localStorage.setItem('lupo_easy_mode', enabled ? 'true' : 'false');
        this.setState({ easyMode: !!enabled });
    }

    // Load state from save
    loadState(savedState) {
        this.state = savedState;
        this.notifyListeners();
    }

    // Character methods
    setCharacter(character) {
        this.setState({ character: { ...this.state.character, ...character } });
    }

    updateStats(stats) {
        this.setState({
            character: { ...this.state.character, ...stats }
        });
    }

    takeDamage(damage) {
        const newResistenza = Math.max(0, this.state.character.resistenza - damage);
        this.updateStats({ resistenza: newResistenza });
        return newResistenza;
    }

    heal(amount) {
        const newResistenza = Math.min(
            this.state.character.resistenzaMax,
            this.state.character.resistenza + amount
        );
        this.updateStats({ resistenza: newResistenza });
        return newResistenza;
    }

    // Inventory methods
    addToZaino(item) {
        // Limit is 8 items inclusive of Meals
        const currentItems = this.state.character.zaino.length;
        const currentMeals = this.state.character.pasti;

        if (currentItems + currentMeals >= 8) {
            return false; // Zaino full
        }
        const zaino = [...this.state.character.zaino, item];
        this.updateStats({ zaino });
        return true;
    }

    removeFromZaino(item) {
        const zaino = this.state.character.zaino.filter(i => i !== item);
        this.updateStats({ zaino });
    }

    // Remove a named item from wherever it currently lives (Zaino or Oggetti
    // Speciali) - used when the story hands an item over/erases it from the
    // Action Chart (e.g. surrendering the Seal of Hammerdal to the King).
    removeItem(item) {
        if (this.state.character.zaino.includes(item)) {
            this.removeFromZaino(item);
        } else if (this.state.character.oggettiSpeciali.includes(item)) {
            const oggettiSpeciali = this.state.character.oggettiSpeciali.filter(i => i !== item);
            this.updateStats({ oggettiSpeciali });
        }
    }

    addWeapon(weapon) {
        if (this.state.character.armi.length >= 2) {
            return false; // Already have 2 weapons
        }
        const armi = [...this.state.character.armi, weapon];
        this.updateStats({ armi });
        return true;
    }

    removeWeapon(weapon) {
        const armi = this.state.character.armi.filter(w => w !== weapon);
        this.updateStats({ armi });
    }

    clearWeapons() {
        this.updateStats({ armi: [] });
    }

    clearEquipment() {
        this.updateStats({
            armi: [],
            zaino: []
        });
    }

    addOggettoSpeciale(item) {
        const oggettiSpeciali = [...this.state.character.oggettiSpeciali, item];
        this.updateStats({ oggettiSpeciali });
    }

    addCorone(amount) {
        const corone = Math.min(50, this.state.character.corone + amount);
        this.updateStats({ corone });
    }

    removeCorone(amount) {
        const corone = Math.max(0, this.state.character.corone - amount);
        this.updateStats({ corone });
    }

    addPasti(amount) {
        const currentItems = this.state.character.zaino.length;
        const currentMeals = this.state.character.pasti;
        const availableSpace = 8 - (currentItems + currentMeals);

        if (availableSpace <= 0) {
            return 0; // No space
        }

        const amountToAdd = Math.min(amount, availableSpace);
        const pasti = currentMeals + amountToAdd;
        this.updateStats({ pasti });
        return amountToAdd;
    }

    consumePasto() {
        if (this.state.character.pasti > 0) {
            this.updateStats({ pasti: this.state.character.pasti - 1 });
            return true;
        }
        return false;
    }

    hasKaiArt(artName) {
        return this.state.character.artiRamas.includes(artName);
    }

    // Flag methods
    setFlag(key, value) {
        const flags = { ...this.state.flags, [key]: value };
        this.setState({ flags });
    }

    getFlag(key) {
        return this.state.flags[key];
    }

    // Navigation methods
    goToSection(sectionNumber, addToHistory = true) {
        // Healing Logic (Guarigione)
        if (this.hasKaiArt('Guarigione')) {
            // Heal 1 EP if the previous section did NOT have combat
            // We check a flag 'sectionHadCombat' which is reset on navigation
            if (!this.state.flags.sectionHadCombat) {
                // Only heal if not full health
                if (this.state.character.resistenza < this.state.character.resistenzaMax) {
                    this.heal(1);
                    // Optional: notify UI, but might be spammy. 
                    // UIHelpers.showToast('💚 Guarigione: +1 Resistenza', 'success'); 
                    // We can't access UIHelpers here easily without circular dependency usually, 
                    // but GameState is low level. We'll skip toast or rely on listener.
                }
            }
        }

        // Reset combat flag for the new section
        this.setFlag('sectionHadCombat', false);

        if (addToHistory) {
            this.setState({
                currentSection: sectionNumber,
                history: [...this.state.history, sectionNumber]
            });
        } else {
            this.setState({ currentSection: sectionNumber });
        }
    }

    goBack() {
        if (this.state.history.length > 1) {
            const newHistory = [...this.state.history];
            newHistory.pop(); // Remove current section
            const previousSection = newHistory[newHistory.length - 1];
            this.setState({
                currentSection: previousSection,
                history: newHistory
            });
        }
    }

    canGoBack() {
        return this.state.history.length > 1;
    }

    // Combat methods
    startCombat(combatData) {
        this.setFlag('sectionHadCombat', true);
        this.setState({
            inCombat: true,
            combatState: {
                ...combatData,
                currentEnemyResistenza: combatData.resistenza,
                rounds: []
            }
        });
    }

    endCombat() {
        // Keep a small summary of the fight just ended (rounds, damage taken) around
        // after combatState is cleared, so post-victory choices can be gated on it.
        const combat = this.state.combatState;
        const lastCombatSummary = combat ? {
            rounds: combat.rounds.length,
            damageTaken: combat.rounds.reduce((sum, r) => sum + (r.heroDamage || 0), 0),
            damageDealt: combat.rounds.reduce((sum, r) => sum + (r.enemyDamage || 0), 0)
        } : this.state.lastCombatSummary;

        this.setState({
            inCombat: false,
            combatState: null,
            lastCombatSummary
        });
    }

    resetGame() {
        this.state = this.getInitialState();
        this.notifyListeners();
    }

    // Switch to a different book, keeping the character (stats/disciplines/equipment)
    // exactly as it is - used for the Book 1 -> Book 2 continuation flow.
    switchBook(bookId, bookNumber, startSection) {
        this.setState({
            bookId,
            bookNumber,
            currentSection: startSection,
            history: [startSection],
            inCombat: false,
            combatState: null,
            lastCombatSummary: null,
            flags: {}
        });
    }

    // Get current state
    getState() {
        return this.state;
    }
}

export const gameState = new GameState();
if (typeof window !== 'undefined') {
    window.gameState = gameState;
}
