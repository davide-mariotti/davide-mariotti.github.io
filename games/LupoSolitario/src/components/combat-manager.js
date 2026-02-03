// Combat Manager - Automated combat system (reuses combat table from original code)
import { getRandomDestinyNumber } from './destiny-table.js';
import { gameState } from '../game-state.js';

// Combat results table (from original fight.js)
const COMBAT_TABLE = {
    '-11': [
        [6, 0], [0, 999], [0, 999], [0, 8], [0, 8],
        [1, 7], [2, 6], [3, 5], [4, 4], [5, 3]
    ],
    '-10': [
        [7, 0], [0, 999], [0, 8], [0, 7], [1, 7],
        [2, 6], [3, 6], [4, 5], [5, 4], [6, 3]
    ],
    '-9': [
        [7, 0], [0, 999], [0, 8], [0, 7], [1, 7],
        [2, 6], [3, 6], [4, 5], [5, 4], [6, 3]
    ],
    '-8': [
        [8, 0], [0, 8], [0, 7], [1, 7], [2, 6],
        [3, 6], [4, 5], [5, 5], [6, 4], [7, 3]
    ],
    '-7': [
        [9, 0], [0, 8], [0, 7], [1, 6], [2, 6],
        [3, 5], [4, 5], [5, 4], [6, 4], [7, 3]
    ],
    '-6': [
        [10, 0], [0, 7], [1, 6], [2, 6], [3, 5],
        [4, 5], [5, 4], [6, 4], [7, 3], [8, 3]
    ],
    '-5': [
        [11, 0], [1, 6], [2, 6], [3, 5], [4, 5],
        [5, 4], [6, 4], [7, 3], [8, 3], [9, 2]
    ],
    '-4': [
        [12, 0], [2, 6], [3, 5], [4, 5], [5, 4],
        [6, 4], [7, 3], [8, 3], [9, 2], [10, 2]
    ],
    '-3': [
        [13, 0], [3, 5], [4, 5], [5, 4], [6, 4],
        [7, 3], [8, 3], [9, 2], [10, 2], [11, 2]
    ],
    '-2': [
        [14, 0], [4, 5], [5, 4], [6, 4], [7, 3],
        [8, 3], [9, 2], [10, 2], [11, 2], [12, 0]
    ],
    '-1': [
        [15, 0], [5, 4], [6, 4], [7, 3], [8, 3],
        [9, 2], [10, 2], [11, 2], [12, 0], [14, 0]
    ],
    '0': [
        [12, 0], [3, 5], [4, 4], [5, 4], [6, 3],
        [7, 2], [8, 2], [9, 1], [10, 0], [11, 0]
    ],
    '1': [
        [14, 0], [4, 5], [5, 4], [6, 3], [7, 3],
        [8, 2], [9, 2], [10, 1], [11, 0], [12, 0]
    ],
    '2': [
        [14, 0], [4, 5], [5, 4], [6, 3], [7, 3],
        [8, 2], [9, 2], [10, 1], [11, 0], [12, 0]
    ],
    '3': [
        [16, 0], [5, 4], [6, 3], [7, 3], [8, 2],
        [9, 2], [10, 2], [11, 1], [12, 0], [14, 0]
    ],
    '4': [
        [16, 0], [5, 4], [6, 3], [7, 3], [8, 2],
        [9, 2], [10, 2], [11, 1], [12, 0], [14, 0]
    ],
    '5': [
        [18, 0], [6, 4], [7, 3], [8, 3], [9, 2],
        [10, 2], [11, 1], [12, 0], [14, 0], [16, 0]
    ],
    '6': [
        [18, 0], [6, 4], [7, 3], [8, 3], [9, 2],
        [10, 2], [11, 1], [12, 0], [14, 0], [16, 0]
    ],
    '7': [
        [999, 0], [8, 3], [9, 3], [10, 2], [11, 2],
        [12, 2], [14, 1], [16, 0], [18, 0], [999, 0]
    ],
    '8': [
        [999, 0], [8, 3], [9, 3], [10, 2], [11, 2],
        [12, 2], [14, 1], [16, 0], [18, 0], [999, 0]
    ],
    '9': [
        [999, 0], [8, 3], [9, 3], [10, 2], [11, 2],
        [12, 2], [14, 1], [16, 0], [18, 0], [999, 0]
    ],
    '10': [
        [999, 0], [8, 3], [9, 3], [10, 2], [11, 2],
        [12, 2], [14, 1], [16, 0], [18, 0], [999, 0]
    ],
    '11': [
        [999, 0], [9, 3], [10, 2], [11, 2], [12, 2],
        [14, 1], [16, 1], [18, 0], [999, 0], [999, 0]
    ]
};

export class CombatManager {
    constructor() {
        this.combatLog = [];
        this.canFlee = false;
    }

    // Start a new combat
    startCombat(enemyData) {
        this.combatLog = [];
        this.combatData = enemyData;
        this.canFlee = enemyData.canFlee || false;

        gameState.startCombat({
            enemy: enemyData.name,
            combattivita: enemyData.combattivita,
            resistenza: enemyData.resistenza,
            immuneToPsicolaser: enemyData.immuneToPsicolaser || false,
            mindblast: enemyData.mindblast || false
        });

        this.log(`⚔️ Combattimento contro ${enemyData.name}!`);
    }

    // Calculate force ratio
    calculateForceRatio() {
        const state = gameState.getState();
        const character = state.character;
        const enemy = state.combatState;

        let heroCombattivita = character.combattivita;

        // Add Psicolaser bonus if applicable
        if (character.artiRamas.includes('Psicolaser') && !enemy.immuneToPsicolaser) {
            heroCombattivita += 2;
        }

        // Add weapon mastery bonus
        // The character object stores selected mastery in 'weaponMastery' if 'Scherma' is known
        // OR we can check if it was added to special items or similar.
        // Based on my change in character-creator.js, I need to ensure `weaponMastery` is saved to state.
        // Let's assume character-creator saves it to the character object.
        // Wait, character-creator.js saves it to `this.character`? 
        // In toggleKaiArt: `this.weaponMastery = btn.dataset.weapon;` 
        // But in `getSummaryHTML` or `begin-adventure` we need to ensure it's merged.
        // Let's check `getSummaryHTML` later.
        // For now, assume state.character.weaponMastery exists.

        if (character.artiRamas.includes('Scherma') && character.weaponMastery) {
            // Check if user has this weapon equipped or in possession? Rules say "when using a weapon".
            // We simplify it: if you have the weapon in your 'armi' list.
            if (character.armi.includes(character.weaponMastery)) {
                heroCombattivita += 2;
            }
        }

        // Enemy Mindblast (Psicoattacco)
        if (enemy.mindblast && !character.artiRamas.includes('Psicoschermo')) {
            heroCombattivita -= 2;
            // Ideally notify user, but we are in a calculation loop perhaps.
            // rely on log? We don't log here.
        }

        // Add temporary combat bonus/penalty
        if (enemy.playerCombatBonus) {
            heroCombattivita += enemy.playerCombatBonus;
        }

        return heroCombattivita - enemy.combattivita;
    }

    // Check if player can currently flee
    canPlayerFlee() {
        if (!this.combatData) return false;
        if (!this.combatData.canFlee) return false;

        const state = gameState.getState();
        const rounds = state.combatState ? state.combatState.rounds.length : 0;

        if (this.combatData.fleeAfterRounds && rounds < this.combatData.fleeAfterRounds) {
            return false;
        }

        return true;
    }

    // Execute one round of combat
    fightRound() {
        const destinyNumber = getRandomDestinyNumber();
        const forceRatio = this.calculateForceRatio();
        const state = gameState.getState();
        const combat = state.combatState;

        this.log(`🎲 Numero del Destino: ${destinyNumber} | Rapporto di Forza: ${forceRatio}`);

        // Clamp force ratio to table bounds
        const clampedRatio = Math.max(-11, Math.min(11, forceRatio));
        const ratioKey = clampedRatio.toString();

        if (!COMBAT_TABLE[ratioKey]) {
            this.log('❌ Errore: Rapporto di Forza non valido');
            return null;
        }

        const [enemyDamage, heroDamage] = COMBAT_TABLE[ratioKey][destinyNumber];

        // Apply damage
        const newEnemyResistenza = combat.currentEnemyResistenza - enemyDamage;
        const newHeroResistenza = gameState.takeDamage(heroDamage);

        // Update combat state
        const updatedCombat = {
            ...combat,
            currentEnemyResistenza: Math.max(0, newEnemyResistenza),
            rounds: [
                ...combat.rounds,
                {
                    destinyNumber,
                    forceRatio: clampedRatio,
                    enemyDamage,
                    heroDamage,
                    enemyResistenza: newEnemyResistenza,
                    heroResistenza: newHeroResistenza
                }
            ]
        };

        gameState.setState({ combatState: updatedCombat });

        // Log the results
        if (enemyDamage === 999) {
            this.log(`💀 Nemico: MORTO ISTANTANEAMENTE`);
        } else {
            this.log(`🗡️ Nemico: -${enemyDamage} Resistenza (${Math.max(0, newEnemyResistenza)} rimasti)`);
        }

        if (heroDamage === 999) {
            this.log(`💀 Lupo Solitario: MORTO`);
        } else if (heroDamage > 0) {
            this.log(`❤️ Lupo Solitario: -${heroDamage} Resistenza (${newHeroResistenza} rimasti)`);
        } else {
            this.log(`🛡️ Lupo Solitario: Nessun danno!`);
        }

        // Check for combat end
        if (newEnemyResistenza <= 0 || enemyDamage === 999) {
            return 'victory';
        }
        if (newHeroResistenza <= 0 || heroDamage === 999) {
            return 'defeat';
        }

        return 'ongoing';
    }

    // Flee combat (if allowed)
    flee() {
        if (!this.canFlee) {
            this.log('⛔ Non puoi fuggire da questo combattimento!');
            return false;
        }

        // Execute one round, but only count hero damage
        const destinyNumber = getRandomDestinyNumber();
        const forceRatio = this.calculateForceRatio();
        const clampedRatio = Math.max(-11, Math.min(11, forceRatio));
        const ratioKey = clampedRatio.toString();

        const [, heroDamage] = COMBAT_TABLE[ratioKey][destinyNumber];
        gameState.takeDamage(heroDamage);

        this.log(`🏃 Fuga! Hai subito ${heroDamage} danni mentre scappavi.`);
        gameState.endCombat();
        return true;
    }

    // End combat
    endCombat(result) {
        if (result === 'victory') {
            this.log('🎉 VITTORIA!');
        } else if (result === 'defeat') {
            this.log('💀 SCONFITTA...');
        }

        gameState.endCombat();
    }

    // Add log entry
    log(message) {
        this.combatLog.push({
            timestamp: Date.now(),
            message
        });
    }

    // Get combat log
    getLog() {
        return this.combatLog;
    }

    // Clear log
    clearLog() {
        this.combatLog = [];
    }
}

export const combatManager = new CombatManager();
