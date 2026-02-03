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
        if (this.state.character.zaino.length >= 8) {
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

    addCorone(amount) {
        const corone = Math.min(50, this.state.character.corone + amount);
        this.updateStats({ corone });
    }

    removeCorone(amount) {
        const corone = Math.max(0, this.state.character.corone - amount);
        this.updateStats({ corone });
    }

    addPasti(amount) {
        const pasti = this.state.character.pasti + amount;
        this.updateStats({ pasti });
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
        this.setState({
            inCombat: false,
            combatState: null
        });
    }

    resetGame() {
        this.state = this.getInitialState();
        this.notifyListeners();
    }

    // Get current state
    getState() {
        return this.state;
    }
}

export const gameState = new GameState();
