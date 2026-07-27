// Combat Manager - Automated combat system (reuses combat table from original code)
import { getRandomDestinyNumber } from './destiny-table.js';
import { gameState } from '../game-state.js';

// Sword-type weapons that grant Sommerswerd proficiency via Scherma (Weaponskill)
const SOMMERSWERD_SWORD_TYPES = ['Spada Corta', 'Spada', 'Spadone'];

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
        this.enemyQueue = [];
    }

    // Start a new combat. Some sections pit the hero against multiple enemies
    // fought one after another (combat is an array in the book data) instead
    // of a single enemy (combat is an object) - normalize to a queue either way.
    startCombat(combatData) {
        this.combatLog = [];
        this.enemyQueue = Array.isArray(combatData) ? [...combatData] : [combatData];
        this.engageNextEnemy();
    }

    // Pull the next enemy off the queue and start fighting it
    engageNextEnemy() {
        const enemyData = this.enemyQueue.shift();
        this.combatData = enemyData;
        this.canFlee = enemyData.canFlee || false;

        gameState.startCombat({
            enemy: enemyData.name,
            combattivita: enemyData.combattivita,
            resistenza: enemyData.resistenza,
            immuneToPsicolaser: enemyData.immuneToPsicolaser || false,
            psicolaserBonusOverride: enemyData.psicolaserBonusOverride,
            mindblast: enemyData.mindblast || false,
            playerCombatBonus: enemyData.playerCombatBonus || 0,
            playerCombatPenalty: enemyData.playerCombatPenalty || 0,
            playerPenaltyNoItem: enemyData.playerPenaltyNoItem || null,
            psicoschermoPreventsLoss: enemyData.psicoschermoPreventsLoss || false,
            undead: enemyData.undead || false,
            combatModifiers: enemyData.combatModifiers || []
        });

        this.log(`⚔️ Combattimento contro ${enemyData.name}!`);
    }

    // Calculate force ratio
    calculateForceRatio() {
        const state = gameState.getState();
        const character = state.character;
        const enemy = state.combatState;

        let heroCombattivita = character.combattivita;

        // Add Psicolaser bonus if applicable (some enemies are only partially
        // immune and grant a reduced bonus instead of the usual +2)
        if (character.artiRamas.includes('Psicolaser') && !enemy.immuneToPsicolaser) {
            heroCombattivita += (enemy.psicolaserBonusOverride ?? 2);
        }

        // Sommerswerd (Spada del Sole): while wielding it, it IS the weapon in hand,
        // replacing the normal Scherma/weapon-equipped check below. +8 COMBAT SKILL,
        // or +10 total if Scherma mastery is in a sword-type weapon (per the book's
        // errata this +10 is a combined total, not an additional +2 on top of it).
        if (this.hasSommerswerd(character)) {
            const swordMastery = character.artiRamas.includes('Scherma') &&
                SOMMERSWERD_SWORD_TYPES.includes(character.weaponMastery);
            heroCombattivita += swordMastery ? 10 : 8;
        } else if (character.artiRamas.includes('Scherma') && character.weaponMastery) {
            // Add weapon mastery bonus (Scherma): +2 when the mastered weapon is equipped
            if (character.armi.includes(character.weaponMastery)) {
                heroCombattivita += 2;
            }
        }

        // Enemy Mindblast (Psicoattacco)
        if (enemy.mindblast && !character.artiRamas.includes('Psicoschermo')) {
            heroCombattivita -= 2;
        }

        // Add temporary combat bonus/penalty
        if (enemy.playerCombatBonus) {
            heroCombattivita += enemy.playerCombatBonus;
        }

        // Penalty applied only while the hero lacks a specific item (e.g. fighting
        // blind without a Torcia)
        if (enemy.playerPenaltyNoItem) {
            const { item, penalty } = enemy.playerPenaltyNoItem;
            const hasItem = character.zaino.includes(item) ||
                character.oggettiSpeciali.includes(item) ||
                character.armi.includes(item);
            if (!hasItem) {
                heroCombattivita += penalty;
            }
        }

        // Fixed combat penalty (e.g. fatigue, terrain), sometimes waived by Psicoschermo
        if (enemy.playerCombatPenalty) {
            const waived = enemy.psicoschermoPreventsLoss && character.artiRamas.includes('Psicoschermo');
            if (!waived) {
                heroCombattivita -= enemy.playerCombatPenalty;
            }
        }

        // Per-round conditional modifiers (surprise bonus on round 1, ongoing
        // penalty for lacking a specific Kai Discipline, etc.)
        const roundIndex = state.combatState.rounds.length;
        for (const mod of (enemy.combatModifiers || [])) {
            if (mod.type === 'firstRound' && roundIndex === 0) {
                heroCombattivita += mod.value;
            }
            if (mod.type === 'noKaiArt' && !character.artiRamas.includes(mod.name)) {
                const appliesThisRound = mod.rounds === 'subsequent' ? roundIndex >= 1 : true;
                if (appliesThisRound) heroCombattivita += mod.value;
            }
        }

        return heroCombattivita - enemy.combattivita;
    }

    // Whether the character currently possesses the Sommerswerd (Spada del Sole)
    hasSommerswerd(character) {
        return character.zaino.includes('Spada del Sole') ||
            character.oggettiSpeciali.includes('Spada del Sole');
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

        let [enemyDamage, heroDamage] = COMBAT_TABLE[ratioKey][destinyNumber];

        // Sommerswerd doubles ENDURANCE lost by undead enemies (e.g. Helghast), but never
        // the 999 "instant kill" sentinel value, which isn't an ENDURANCE point count.
        if (combat.undead && enemyDamage !== 999 && this.hasSommerswerd(state.character)) {
            enemyDamage *= 2;
        }

        // "Surprised" enemy that can't hurt the hero for its first few rounds
        const noLossMod = (combat.combatModifiers || []).find(m => m.type === 'noPlayerLossRounds');
        if (noLossMod && combat.rounds.length < noLossMod.rounds && heroDamage !== 999) {
            heroDamage = 0;
        }

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

        // Check for combat end (defeat takes priority over a simultaneous kill)
        if (newHeroResistenza <= 0 || heroDamage === 999) {
            return 'defeat';
        }
        if (newEnemyResistenza <= 0 || enemyDamage === 999) {
            const defeatedName = combat.enemy;
            if (this.enemyQueue.length > 0) {
                this.log(`🎉 ${defeatedName} sconfitto! Il prossimo nemico avanza...`);
                this.engageNextEnemy();
                return 'next-enemy';
            }
            return 'victory';
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
        this.enemyQueue = [];
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

        this.enemyQueue = [];
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
