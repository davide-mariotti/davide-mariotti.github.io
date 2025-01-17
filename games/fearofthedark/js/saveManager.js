class SaveManager {
    constructor() {
        this.maxSaveSlots = 3;
    }

    saveGame(slot, gameState) {
        try {
            const saveData = {
                timestamp: Date.now(),
                character: {
                    name: gameState.character.name,
                    characterClass: gameState.character.characterClass,
                    subclass: gameState.character.subclass,
                    level: gameState.character.level,
                    experience: gameState.character.experience,
                    hp: gameState.character.hp,
                    maxHp: gameState.character.maxHp,
                    mp: gameState.character.mp,
                    maxMp: gameState.character.maxMp,
                    stats: gameState.character.stats
                },
                position: {
                    x: gameState.player.x,
                    y: gameState.player.y
                },
                level: {
                    id: gameState.level.id,
                    name: gameState.level.name
                }
            };

            localStorage.setItem(`saveGame_${slot}`, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Error saving game:', error);
            return false;
        }
    }

    loadGame(slot) {
        try {
            const saveData = localStorage.getItem(`saveGame_${slot}`);
            if (!saveData) return null;
            return JSON.parse(saveData);
        } catch (error) {
            console.error('Error loading game:', error);
            return null;
        }
    }

    getSaveInfo(slot) {
        const saveData = this.loadGame(slot);
        if (!saveData) return null;

        return {
            slot,
            character: {
                name: saveData.character.name,
                class: saveData.character.characterClass,
                subclass: saveData.character.subclass,
                level: saveData.character.level
            },
            timestamp: saveData.timestamp,
            levelName: saveData.level.name
        };
    }

    getAllSaves() {
        const saves = [];
        for (let i = 1; i <= this.maxSaveSlots; i++) {
            const saveInfo = this.getSaveInfo(i);
            saves.push(saveInfo || { slot: i, empty: true });
        }
        return saves;
    }

    deleteSave(slot) {
        try {
            localStorage.removeItem(`saveGame_${slot}`);
            return true;
        } catch (error) {
            console.error('Error deleting save:', error);
            return false;
        }
    }

    formatSaveDate(timestamp) {
        return new Date(timestamp).toLocaleString('it-IT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
} 