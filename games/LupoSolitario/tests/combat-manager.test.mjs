// Tests for the combat math shared by every book (COMBAT_TABLE lookups, Kai
// Discipline bonuses/penalties, the Sommerswerd, and combatModifiers). This
// logic is reused unchanged across all books, so a regression here breaks
// every book at once - worth protecting with tests as more books are added.
//
// Run with: npm test  (needs --experimental-test-module-mocks, see package.json)
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

// destiny-table.js normally returns a real random 0-9 roll. Mocked here so
// combat outcomes are deterministic and assertable exactly.
let mockRollQueue = [];
mock.module('../src/components/destiny-table.js', {
  exports: {
    getRandomDestinyNumber: () => {
      if (mockRollQueue.length === 0) throw new Error('mockRollQueue exhausted - set rolls before calling fightRound()');
      return mockRollQueue.shift();
    },
    shuffleArray: (arr) => arr
  }
});

// save-manager.js reaches out to a Firebase CDN import at module load time,
// which Node's ESM loader can't resolve. Stubbed so game-state.js is safely
// importable outside a browser.
mock.module('../src/save-manager.js', {
  exports: { saveManager: { scheduleAutoSave: () => {} } }
});

const { gameState } = await import('../src/game-state.js');
const { combatManager } = await import('../src/components/combat-manager.js');

function resetGameState(characterOverrides = {}) {
  gameState.resetGame();
  gameState.setCharacter({
    combattivita: 20,
    resistenza: 20,
    resistenzaMax: 20,
    artiRamas: [],
    armi: [],
    zaino: [],
    corone: 0,
    pasti: 0,
    oggettiSpeciali: [],
    ...characterOverrides
  });
}

test('calculateForceRatio: base ratio is simply Combattivita difference', () => {
  resetGameState({ combattivita: 20 });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10 });
  assert.equal(combatManager.calculateForceRatio(), 5);
});

test('calculateForceRatio: Psicolaser adds +2 unless the enemy is immune', () => {
  resetGameState({ combattivita: 20, artiRamas: ['Psicolaser'] });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10 });
  assert.equal(combatManager.calculateForceRatio(), 7);

  resetGameState({ combattivita: 20, artiRamas: ['Psicolaser'] });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10, immuneToPsicolaser: true });
  assert.equal(combatManager.calculateForceRatio(), 5);
});

test('calculateForceRatio: psicolaserBonusOverride reduces the bonus for partially-immune enemies', () => {
  resetGameState({ combattivita: 20, artiRamas: ['Psicolaser'] });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10, psicolaserBonusOverride: 1 });
  assert.equal(combatManager.calculateForceRatio(), 6);

  resetGameState({ combattivita: 20, artiRamas: [] });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10, psicolaserBonusOverride: 1 });
  assert.equal(combatManager.calculateForceRatio(), 5);
});

test('calculateForceRatio: Scherma +2 only when the mastered weapon is actually equipped', () => {
  resetGameState({ combattivita: 20, artiRamas: ['Scherma'], weaponMastery: 'Ascia', armi: ['Ascia'] });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10 });
  assert.equal(combatManager.calculateForceRatio(), 7);

  resetGameState({ combattivita: 20, artiRamas: ['Scherma'], weaponMastery: 'Ascia', armi: ['Mazza'] });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10 });
  assert.equal(combatManager.calculateForceRatio(), 5);
});

test('calculateForceRatio: Sommerswerd grants +8 without sword-type Scherma mastery', () => {
  resetGameState({ combattivita: 20, zaino: ['Spada del Sole'] });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10 });
  assert.equal(combatManager.calculateForceRatio(), 13);
});

test('calculateForceRatio: Sommerswerd grants +10 total with a sword-type Scherma mastery', () => {
  resetGameState({ combattivita: 20, zaino: ['Spada del Sole'], artiRamas: ['Scherma'], weaponMastery: 'Spada' });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10 });
  assert.equal(combatManager.calculateForceRatio(), 15);
});

test('calculateForceRatio: enemy Mindblast applies -2 unless the hero has Psicoschermo', () => {
  resetGameState({ combattivita: 20 });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10, mindblast: true });
  assert.equal(combatManager.calculateForceRatio(), 3);

  resetGameState({ combattivita: 20, artiRamas: ['Psicoschermo'] });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10, mindblast: true });
  assert.equal(combatManager.calculateForceRatio(), 5);
});

test('calculateForceRatio: playerPenaltyNoItem applies only while the item is missing', () => {
  resetGameState({ combattivita: 20 });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10, playerPenaltyNoItem: { item: 'Torcia', penalty: -3 } });
  assert.equal(combatManager.calculateForceRatio(), 2, 'no Torcia -> penalty applies');

  resetGameState({ combattivita: 20, zaino: ['Torcia'] });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10, playerPenaltyNoItem: { item: 'Torcia', penalty: -3 } });
  assert.equal(combatManager.calculateForceRatio(), 5, 'has Torcia -> no penalty');
});

test('calculateForceRatio: playerCombatPenalty is waived by psicoschermoPreventsLoss + Psicoschermo', () => {
  resetGameState({ combattivita: 20, artiRamas: ['Psicoschermo'] });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10, playerCombatPenalty: 4, psicoschermoPreventsLoss: true });
  assert.equal(combatManager.calculateForceRatio(), 5);

  resetGameState({ combattivita: 20 });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 10, playerCombatPenalty: 4, psicoschermoPreventsLoss: true });
  assert.equal(combatManager.calculateForceRatio(), 1);
});

test('calculateForceRatio: combatModifiers "firstRound" bonus only applies to round 1', () => {
  mockRollQueue = [5];
  resetGameState({ combattivita: 20 });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 999, combatModifiers: [{ type: 'firstRound', value: 2 }] });
  assert.equal(combatManager.calculateForceRatio(), 7);

  combatManager.fightRound();
  assert.equal(combatManager.calculateForceRatio(), 5);
});

test('calculateForceRatio: combatModifiers "firstRound" with rounds:N applies for the first N rounds, not just round 1', () => {
  mockRollQueue = [5, 5, 5];
  resetGameState({ combattivita: 20 });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 999, combatModifiers: [{ type: 'firstRound', value: -4, rounds: 2 }] });
  assert.equal(combatManager.calculateForceRatio(), 1, 'round 1 (index 0) is still penalized');

  combatManager.fightRound();
  assert.equal(combatManager.calculateForceRatio(), 1, 'round 2 (index 1) is also penalized');

  combatManager.fightRound();
  assert.equal(combatManager.calculateForceRatio(), 5, 'round 3 (index 2) is no longer penalized');
});

test('calculateForceRatio: combatModifiers "noKaiArt" penalty respects the "subsequent" rounds option', () => {
  mockRollQueue = [5];
  resetGameState({ combattivita: 20 });
  combatManager.startCombat({
    name: 'Enemy', combattivita: 15, resistenza: 999,
    combatModifiers: [{ type: 'noKaiArt', name: 'Psicoschermo', value: -2, rounds: 'subsequent' }]
  });
  assert.equal(combatManager.calculateForceRatio(), 5, 'round 1 is unaffected');

  combatManager.fightRound();
  assert.equal(combatManager.calculateForceRatio(), 3, 'round 2 onward takes the penalty');

  resetGameState({ combattivita: 20, artiRamas: ['Psicoschermo'] });
  combatManager.startCombat({
    name: 'Enemy', combattivita: 15, resistenza: 999,
    combatModifiers: [{ type: 'noKaiArt', name: 'Psicoschermo', value: -2, rounds: 'subsequent' }]
  });
  mockRollQueue = [5];
  combatManager.fightRound();
  assert.equal(combatManager.calculateForceRatio(), 5, 'owning the named art waives the penalty entirely');
});

test('fightRound: Sommerswerd doubles ENDURANCE lost by undead enemies, but only for undead', () => {
  // combattivita 15 + Sommerswerd(+8) vs 15 => ratio 8; table['8'][destinyNumber=1] = [enemyDamage 8, heroDamage 3]
  mockRollQueue = [1];
  resetGameState({ combattivita: 15, resistenza: 20, resistenzaMax: 20, zaino: ['Spada del Sole'] });
  combatManager.startCombat({ name: 'Helghast', combattivita: 15, resistenza: 30, undead: true });
  combatManager.fightRound();
  assert.equal(gameState.getState().combatState.currentEnemyResistenza, 14, '30 - (8*2)');
  assert.equal(gameState.getState().character.resistenza, 17, 'hero damage is never doubled');

  mockRollQueue = [1];
  resetGameState({ combattivita: 15, resistenza: 20, resistenzaMax: 20, zaino: ['Spada del Sole'] });
  combatManager.startCombat({ name: 'Ordinary enemy', combattivita: 15, resistenza: 30, undead: false });
  combatManager.fightRound();
  assert.equal(gameState.getState().combatState.currentEnemyResistenza, 22, '30 - 8, not doubled without undead flag');
});

test('fightRound: noPlayerLossRounds modifier zeroes hero damage only during the protected rounds', () => {
  mockRollQueue = [1, 1];
  resetGameState({ combattivita: 15, resistenza: 20, resistenzaMax: 20 });
  combatManager.startCombat({
    name: 'Surprised enemy', combattivita: 15, resistenza: 999,
    combatModifiers: [{ type: 'noPlayerLossRounds', rounds: 1 }]
  });

  combatManager.fightRound();
  assert.equal(gameState.getState().character.resistenza, 20, 'round 1 is protected');

  combatManager.fightRound();
  assert.equal(gameState.getState().character.resistenza, 15, 'round 2 takes normal damage');
});

test('endCombat: lastCombatSummary tracks damageDealt (enemy) alongside damageTaken (hero)', () => {
  // combattivita 15 + Sommerswerd(+8) vs 15 => ratio 8; table['8'][destinyNumber=1] = [enemyDamage 8, heroDamage 3]
  mockRollQueue = [1];
  resetGameState({ combattivita: 15, resistenza: 20, resistenzaMax: 20, zaino: ['Spada del Sole'] });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 30 });
  combatManager.fightRound();
  combatManager.endCombat('victory');
  assert.deepEqual(gameState.getState().lastCombatSummary, { rounds: 1, damageTaken: 3, damageDealt: 8 });
});

test('canPlayerFlee: respects fleeAfterRounds gating', () => {
  mockRollQueue = [1, 1];
  resetGameState({ combattivita: 15, resistenza: 20, resistenzaMax: 20 });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 999, canFlee: true, fleeAfterRounds: 2 });

  assert.equal(combatManager.canPlayerFlee(), false);
  combatManager.fightRound();
  assert.equal(combatManager.canPlayerFlee(), false);
  combatManager.fightRound();
  assert.equal(combatManager.canPlayerFlee(), true);
});

test('fightRound: forceEndAfterRounds cuts the combat short (neither side dead) once the round cap is reached', () => {
  // ratio 0, destinyNumber 5 -> table['0'][5] = [enemyDamage 7, heroDamage 2] - nobody dies with these HP totals
  mockRollQueue = [5, 5];
  resetGameState({ combattivita: 15, resistenza: 20, resistenzaMax: 20 });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 999, forceEndAfterRounds: 2, forceEndSection: 394 });

  assert.equal(combatManager.fightRound(), 'ongoing', 'round 1: cap not reached yet');
  assert.equal(combatManager.fightRound(), 'force-end', 'round 2: cap reached, neither side dead');
});

test('fightRound: forceEndAfterRounds does not override a real victory/defeat reached within the cap', () => {
  mockRollQueue = [1]; // ratio 8, destinyNumber 1 -> table['8'][1] = [enemyDamage 8, heroDamage 3]
  resetGameState({ combattivita: 23, resistenza: 20, resistenzaMax: 20 });
  combatManager.startCombat({ name: 'Enemy', combattivita: 15, resistenza: 8, forceEndAfterRounds: 3, forceEndSection: 394 });
  assert.equal(combatManager.fightRound(), 'victory');
});

test('multi-enemy queue: defeating one enemy automatically engages the next', () => {
  mockRollQueue = [0]; // ratio 0, destinyNumber 0 -> table['0'][0] = [enemyDamage 12, heroDamage 0]
  resetGameState({ combattivita: 15, resistenza: 20, resistenzaMax: 20 });
  combatManager.startCombat([
    { name: 'Enemy A', combattivita: 15, resistenza: 10 },
    { name: 'Enemy B', combattivita: 15, resistenza: 10 }
  ]);

  const result = combatManager.fightRound();
  assert.equal(result, 'next-enemy');
  assert.equal(gameState.getState().combatState.enemy, 'Enemy B');
});
