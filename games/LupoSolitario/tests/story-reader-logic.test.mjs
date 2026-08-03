// Tests for StoryReader's pure logic (choice gating and Destiny Table text
// parsing) - shared by every book, so a regression here silently breaks
// choice-gating or Destiny Tests across the whole series at once.
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

mock.module('../src/save-manager.js', {
  exports: { saveManager: { scheduleAutoSave: () => {}, deleteSave: async () => {} } }
});

// ui-helpers.js touches `document` for toasts/modals - stubbed so applyEffects
// (which calls UIHelpers.showToast) is safely callable outside a browser.
let mockChooseAsyncResult;
mock.module('../src/utils/ui-helpers.js', {
  exports: { UIHelpers: { showToast: () => {}, showAlert: async () => {}, confirmAsync: async () => true, showModal: () => {}, chooseAsync: async () => mockChooseAsyncResult } }
});

// combat-manager.js is stubbed for fleeCombat's own tests below - fleeCombat
// only ever reads combatManager.combatData/canPlayerFlee()/flee(), never the
// real combat math, so a minimal fake avoids pulling in destiny-table.js too.
let mockCombatData;
let startCombatCalls = 0;
mock.module('../src/components/combat-manager.js', {
  exports: {
    combatManager: {
      canPlayerFlee: () => true,
      get combatData() { return mockCombatData; },
      flee: () => true,
      startCombat: () => { startCombatCalls++; }
    }
  }
});

// game-state.js reads localStorage at module load time (easyMode persistence),
// which doesn't exist outside a browser - stubbed so it's importable here.
globalThis.localStorage ??= { getItem: () => null, setItem: () => {} };

const { StoryReader } = await import('../src/components/story-reader.js');
const { gameState } = await import('../src/game-state.js');

const reader = new StoryReader({ sections: {} });

function fakeState({
  artiRamas = [], zaino = [], oggettiSpeciali = [], armi = [], corone = 0,
  resistenza = 20, weaponMastery = null, lastCombatSummary = null, flags = {}
} = {}) {
  return {
    character: { artiRamas, zaino, oggettiSpeciali, armi, corone, resistenza, weaponMastery },
    lastCombatSummary,
    flags
  };
}

test('checkRequirements: no requirements always passes', () => {
  assert.equal(reader.checkRequirements(null, fakeState()), true);
  assert.equal(reader.checkRequirements(undefined, fakeState()), true);
});

test('checkRequirements: kaiArt must be in artiRamas', () => {
  assert.equal(reader.checkRequirements({ kaiArt: 'Sesto Senso' }, fakeState({ artiRamas: ['Sesto Senso'] })), true);
  assert.equal(reader.checkRequirements({ kaiArt: 'Sesto Senso' }, fakeState()), false);
});

test('checkRequirements: armInjured matches the persistent flag set/cleared by setArmInjured/clearArmInjured - see Book 5 sections 166/2', () => {
  assert.equal(reader.checkRequirements({ armInjured: true }, fakeState({ flags: { armInjured: true } })), true);
  assert.equal(reader.checkRequirements({ armInjured: true }, fakeState()), false);
  assert.equal(reader.checkRequirements({ armInjured: false }, fakeState()), true);
  assert.equal(reader.checkRequirements({ armInjured: false }, fakeState({ flags: { armInjured: true } })), false);
});

test('checkRequirements: item matches Zaino, Oggetti Speciali, or Armi', () => {
  assert.equal(reader.checkRequirements({ item: 'Sigillo' }, fakeState({ zaino: ['Sigillo'] })), true);
  assert.equal(reader.checkRequirements({ item: 'Sigillo' }, fakeState({ oggettiSpeciali: ['Sigillo'] })), true);
  assert.equal(reader.checkRequirements({ item: 'Ascia' }, fakeState({ armi: ['Ascia'] })), true);
  assert.equal(reader.checkRequirements({ item: 'Sigillo' }, fakeState()), false);
});

test('checkRequirements: combining kaiArt and item requires BOTH to pass (AND, not first-match)', () => {
  assert.equal(
    reader.checkRequirements({ kaiArt: 'Caccia', item: 'Ascia' }, fakeState({ artiRamas: ['Caccia'], armi: ['Ascia'] })),
    true
  );
  assert.equal(
    reader.checkRequirements({ kaiArt: 'Caccia', item: 'Ascia' }, fakeState({ artiRamas: ['Caccia'] })),
    false,
    'has the Kai Discipline but not the item'
  );
  assert.equal(
    reader.checkRequirements({ kaiArt: 'Caccia', item: 'Ascia' }, fakeState({ armi: ['Ascia'] })),
    false,
    'has the item but not the Kai Discipline'
  );
});

test('checkRequirements: minGold', () => {
  assert.equal(reader.checkRequirements({ minGold: 10 }, fakeState({ corone: 10 })), true);
  assert.equal(reader.checkRequirements({ minGold: 10 }, fakeState({ corone: 9 })), false);
});

test('checkRequirements: maxRounds/minRounds/tookDamage gate on the last combat summary', () => {
  const summary = { rounds: 3, damageTaken: 2 };
  assert.equal(reader.checkRequirements({ maxRounds: 4 }, fakeState({ lastCombatSummary: summary })), true);
  assert.equal(reader.checkRequirements({ maxRounds: 2 }, fakeState({ lastCombatSummary: summary })), false);
  assert.equal(reader.checkRequirements({ minRounds: 3 }, fakeState({ lastCombatSummary: summary })), true);
  assert.equal(reader.checkRequirements({ minRounds: 4 }, fakeState({ lastCombatSummary: summary })), false);
  assert.equal(reader.checkRequirements({ tookDamage: true }, fakeState({ lastCombatSummary: summary })), true);
  assert.equal(reader.checkRequirements({ tookDamage: false }, fakeState({ lastCombatSummary: { rounds: 1, damageTaken: 0 } })), true);
  assert.equal(reader.checkRequirements({ maxRounds: 4 }, fakeState()), false, 'no summary at all means the gate fails closed');
});

test('checkRequirements: enemyLostMore/playerLostMore/combatTied compare damageDealt vs damageTaken', () => {
  const enemyLostMore = { rounds: 1, damageTaken: 2, damageDealt: 5 };
  const playerLostMore = { rounds: 1, damageTaken: 5, damageDealt: 2 };
  const tied = { rounds: 1, damageTaken: 3, damageDealt: 3 };

  assert.equal(reader.checkRequirements({ enemyLostMore: true }, fakeState({ lastCombatSummary: enemyLostMore })), true);
  assert.equal(reader.checkRequirements({ enemyLostMore: true }, fakeState({ lastCombatSummary: playerLostMore })), false);
  assert.equal(reader.checkRequirements({ playerLostMore: true }, fakeState({ lastCombatSummary: playerLostMore })), true);
  assert.equal(reader.checkRequirements({ playerLostMore: true }, fakeState({ lastCombatSummary: tied })), false);
  assert.equal(reader.checkRequirements({ combatTied: true }, fakeState({ lastCombatSummary: tied })), true);
  assert.equal(reader.checkRequirements({ combatTied: true }, fakeState({ lastCombatSummary: enemyLostMore })), false);
  assert.equal(reader.checkRequirements({ enemyLostMore: true }, fakeState()), false, 'no summary at all means the gate fails closed');
});

test('checkRequirements: items requires ALL of a list at once (unlike single item)', () => {
  assert.equal(
    reader.checkRequirements({ items: ['Torcia', 'Acciarino'] }, fakeState({ zaino: ['Torcia', 'Acciarino'] })),
    true
  );
  assert.equal(
    reader.checkRequirements({ items: ['Torcia', 'Acciarino'] }, fakeState({ zaino: ['Torcia'] })),
    false,
    'missing the second item'
  );
});

test('checkRequirements: kaiArts requires ALL of a list at once (unlike single kaiArt) - see Book 5 section 79', () => {
  assert.equal(
    reader.checkRequirements({ kaiArts: ['Mimetismo', 'Caccia'] }, fakeState({ artiRamas: ['Mimetismo', 'Caccia'] })),
    true
  );
  assert.equal(
    reader.checkRequirements({ kaiArts: ['Mimetismo', 'Caccia'] }, fakeState({ artiRamas: ['Mimetismo'] })),
    false,
    'missing the second Kai Discipline'
  );
});

test('checkRequirements: minDisciplines gates on how many Kai Disciplines are known (Kai rank)', () => {
  const sixArts = ['Caccia', 'Mimetismo', 'Sesto Senso', 'Orientamento', 'Guarigione', 'Scherma'];
  assert.equal(reader.checkRequirements({ minDisciplines: 6 }, fakeState({ artiRamas: sixArts })), true, 'exactly at Aspirant rank (6)');
  assert.equal(reader.checkRequirements({ minDisciplines: 7 }, fakeState({ artiRamas: sixArts })), false, 'not yet Guardian rank (7)');
});

test('checkRequirements: minResistenza / maxResistenza', () => {
  assert.equal(reader.checkRequirements({ minResistenza: 20 }, fakeState({ resistenza: 20 })), true);
  assert.equal(reader.checkRequirements({ minResistenza: 20 }, fakeState({ resistenza: 19 })), false);
  assert.equal(reader.checkRequirements({ maxResistenza: 8 }, fakeState({ resistenza: 7 })), true, 'strictly below the threshold');
  assert.equal(reader.checkRequirements({ maxResistenza: 8 }, fakeState({ resistenza: 8 })), false, 'at the threshold does not count as "less than"');
});

test('checkRequirements: weaponMasteryEquipped needs Scherma AND the mastered weapon in hand', () => {
  const req = { weaponMasteryEquipped: true };
  assert.equal(reader.checkRequirements(req, fakeState({ artiRamas: ['Scherma'], weaponMastery: 'Ascia', armi: ['Ascia'] })), true);
  assert.equal(reader.checkRequirements(req, fakeState({ artiRamas: ['Scherma'], weaponMastery: 'Ascia', armi: ['Spada'] })), false, 'mastered weapon not currently equipped');
  assert.equal(reader.checkRequirements(req, fakeState({ weaponMastery: 'Ascia', armi: ['Ascia'] })), false, 'no Scherma at all');
});

test('checkRequirements: anyOf passes if ANY alternative requirements object passes (OR)', () => {
  const req = { anyOf: [{ kaiArt: 'Caccia' }, { kaiArt: 'Sesto Senso' }, { minDisciplines: 7 }] };
  assert.equal(reader.checkRequirements(req, fakeState({ artiRamas: ['Sesto Senso'] })), true);
  assert.equal(reader.checkRequirements(req, fakeState({ artiRamas: ['Mimetismo', 'Orientamento', 'Guarigione', 'Scherma', 'Psicoschermo', 'Psicolaser', 'Telecinesi'] })), true, 'via minDisciplines: 7');
  assert.equal(reader.checkRequirements(req, fakeState({ artiRamas: ['Mimetismo'] })), false, 'none of the alternatives hold');
});

test('checkRequirements: not negates a nested requirements object', () => {
  const req = { not: { kaiArt: 'Sesto Senso' } };
  assert.equal(reader.checkRequirements(req, fakeState()), true, 'lacks the discipline, so NOT passes');
  assert.equal(reader.checkRequirements(req, fakeState({ artiRamas: ['Sesto Senso'] })), false, 'has the discipline, so NOT fails');
});

test('checkRequirements: not composes with other keys and with anyOf (mutually exclusive branches)', () => {
  const hasArtNotRank = { kaiArt: 'Sesto Senso', not: { minDisciplines: 7 } };
  const hasArtAndRank = { kaiArt: 'Sesto Senso', minDisciplines: 7 };
  const sixArts = ['Sesto Senso', 'Mimetismo', 'Caccia', 'Orientamento', 'Guarigione', 'Scherma'];
  const sevenArts = [...sixArts, 'Psicoschermo'];
  assert.equal(reader.checkRequirements(hasArtNotRank, fakeState({ artiRamas: sixArts })), true);
  assert.equal(reader.checkRequirements(hasArtAndRank, fakeState({ artiRamas: sixArts })), false);
  assert.equal(reader.checkRequirements(hasArtNotRank, fakeState({ artiRamas: sevenArts })), false, 'now has rank 7, so the NOT branch must stop applying');
  assert.equal(reader.checkRequirements(hasArtAndRank, fakeState({ artiRamas: sevenArts })), true);
});

test('calculateDestinyModifier: sums every entry whose requirements pass, ignores the rest', () => {
  const section = {
    destinyModifier: [
      { value: 2, requirements: { kaiArt: 'Caccia' } },
      { value: -2, requirements: { maxResistenza: 8 } }
    ]
  };
  assert.equal(reader.calculateDestinyModifier(section, fakeState({ artiRamas: ['Caccia'], resistenza: 20 })), 2, 'only the Caccia bonus applies');
  assert.equal(reader.calculateDestinyModifier(section, fakeState({ artiRamas: ['Caccia'], resistenza: 5 })), 0, 'the +2 and -2 cancel out when both conditions hold');
  assert.equal(reader.calculateDestinyModifier(section, fakeState({ resistenza: 20 })), 0, 'neither condition holds');
  assert.equal(reader.calculateDestinyModifier({}, fakeState()), 0, 'a section with no destinyModifier at all');
});

test('resolveModifiedRoll: applies modifiers and the "0 = 10" override, floors at 0', () => {
  const spec = { zeroMeansTen: true, modifiers: [{ value: -2, requirements: { kaiArt: 'Caccia' } }] };
  assert.deepEqual(reader.resolveModifiedRoll(spec, 5, fakeState()), { total: 5, modifier: 0 }, 'no discipline, no modifier');
  assert.deepEqual(reader.resolveModifiedRoll(spec, 5, fakeState({ artiRamas: ['Caccia'] })), { total: 3, modifier: -2 });
  assert.deepEqual(reader.resolveModifiedRoll(spec, 0, fakeState()), { total: 10, modifier: 0 }, '0 = 10 override');
  assert.deepEqual(reader.resolveModifiedRoll(spec, 0, fakeState({ artiRamas: ['Caccia'] })), { total: 8, modifier: -2 }, '0 = 10 override, then the modifier still applies');
  assert.deepEqual(reader.resolveModifiedRoll({ modifiers: [{ value: -20, requirements: null }] }, 3, fakeState()), { total: 0, modifier: -20 }, 'never goes negative');
});

test('parseDestinyRange: handles every phrasing used across the translated books', () => {
  assert.deepEqual(reader.parseDestinyRange('Numero 0-3'), { min: 0, max: 3 });
  assert.deepEqual(reader.parseDestinyRange('Numero da 0 a 3'), { min: 0, max: 3 });
  assert.deepEqual(reader.parseDestinyRange('Se il numero è 5'), { min: 5, max: 5 });
  assert.deepEqual(reader.parseDestinyRange('Da -3 a 3'), { min: -3, max: 3 }, 'a destinyModifier deduction can push the range negative');
  assert.deepEqual(reader.parseDestinyRange('Numero 0'), { min: 0, max: 0 }, 'bare "Numero N" with no è/e connector');
  assert.deepEqual(reader.parseDestinyRange('Se è 0'), { min: 0, max: 0 }, 'shortened follow-up phrasing with no "numero" at all');
  assert.equal(reader.parseDestinyRange('Se vinci il combattimento'), null);
  assert.equal(reader.parseDestinyRange('Se possiedi la Spada del Sole'), null, 'must not false-positive on the "e" inside an unrelated word');
});

test('isDestinyTest: true when at least 2 choices describe a Destiny Table range', () => {
  assert.equal(reader.isDestinyTest([{ text: 'Numero 0-4' }, { text: 'Numero 5-9' }]), true);
  assert.equal(reader.isDestinyTest([{ text: 'Numero 0-9' }]), false, 'a single range choice is not a real branching test');
});

test('isDestinyTest: also true when a non-range "bypass" choice sits alongside 2+ range choices (e.g. "if you have the Sommerswerd, skip the roll")', () => {
  const choices = [
    { text: 'Se possiedi la Spada del Sole', section: 1, requirements: { item: 'Spada del Sole' } },
    { text: 'Numero 0-4', section: 2 },
    { text: 'Numero 5-9', section: 3 }
  ];
  assert.equal(reader.isDestinyTest(choices), true);
  assert.equal(reader.isDestinyTest([{ text: 'Numero 0-4' }, { text: 'Se hai una spada' }]), false, 'only 1 range choice - not enough to be a real roll');
});

test('applyEffects: loseCombattivita permanently lowers Combat Skill - see Book 1 section 236', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 10, resistenzaMax: 20, artiRamas: [], armi: [], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });

  await reader.applyEffects({ loseCombattivita: 1 });
  assert.equal(gameState.getState().character.combattivita, 19);
});

test('applyEffects: loseRandomItem steals one Zaino item, falling back to a weapon only if the Zaino is empty - see Book 1 section 144', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 10, resistenzaMax: 20, artiRamas: [], armi: ['Spada'], zaino: ['Torcia'], corone: 0, pasti: 0, oggettiSpeciali: [] });

  await reader.applyEffects({ loseRandomItem: true });
  let character = gameState.getState().character;
  assert.deepEqual(character.zaino, [], 'the only Zaino item is stolen');
  assert.deepEqual(character.armi, ['Spada'], 'weapon untouched while Zaino had an item');

  await reader.applyEffects({ loseRandomItem: true });
  character = gameState.getState().character;
  assert.deepEqual(character.armi, [], 'Zaino now empty, falls back to stealing the weapon');
});

test('applyEffects: setArmInjured/clearArmInjured toggle the flag and its -3/+3 Combattività - see Book 5 sections 166/2', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 20, artiRamas: [], armi: [], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });

  await reader.applyEffects({ setArmInjured: true });
  assert.equal(gameState.getState().character.combattivita, 17);
  assert.equal(gameState.getFlag('armInjured'), true);

  await reader.applyEffects({ clearArmInjured: true });
  assert.equal(gameState.getState().character.combattivita, 20);
  assert.equal(gameState.getFlag('armInjured'), false);
});

test('applyEffects: restoreHalfDamageTaken heals floor(damageTaken / 2) from the last combat', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 10, resistenzaMax: 20, artiRamas: [], armi: [], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });
  gameState.setState({ lastCombatSummary: { rounds: 2, damageTaken: 7, damageDealt: 20 } });

  await reader.applyEffects({ restoreHalfDamageTaken: true });
  assert.equal(gameState.getState().character.resistenza, 13, '10 + floor(7/2)=3');
});

test('applyEffects: restoreHalfDamageTaken is a no-op with no prior combat', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 10, resistenzaMax: 20, artiRamas: [], armi: [], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });

  await reader.applyEffects({ restoreHalfDamageTaken: true });
  assert.equal(gameState.getState().character.resistenza, 10);
});

test('applyEffects: loseEndurance is waived by waivedByKaiArt - see Book 3 section 331', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 20, artiRamas: ['Guarigione'], armi: [], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });
  await reader.applyEffects({ loseEndurance: 4, waivedByKaiArt: 'Guarigione' });
  assert.equal(gameState.getState().character.resistenza, 20, 'no loss with the Discipline');

  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 20, artiRamas: [], armi: [], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });
  await reader.applyEffects({ loseEndurance: 4, waivedByKaiArt: 'Guarigione' });
  assert.equal(gameState.getState().character.resistenza, 16, 'full loss without the Discipline');
});

test('applyEffects: loseEndurance is waived by waivedByItem - see Book 3 section 150', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 20, artiRamas: [], armi: [], zaino: ['Olio di Baknar'], corone: 0, pasti: 0, oggettiSpeciali: [] });
  await reader.applyEffects({ loseEndurance: 2, waivedByItem: 'Olio di Baknar' });
  assert.equal(gameState.getState().character.resistenza, 20, 'no loss while holding the item');

  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 20, artiRamas: [], armi: [], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });
  await reader.applyEffects({ loseEndurance: 2, waivedByItem: 'Olio di Baknar' });
  assert.equal(gameState.getState().character.resistenza, 18, 'full loss without the item');
});

test('applyEffects: loseAllItems only clears the Zaino, not Armi - Weapons are a separate Action Chart section (see Book 3 section 49, Book 4 sections 94/158/342)', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 20, artiRamas: [], armi: ['Spada'], zaino: ['Torcia', 'Corda'], corone: 5, pasti: 0, oggettiSpeciali: ['Anello'] });

  await reader.applyEffects({ loseAllItems: true });
  const character = gameState.getState().character;
  assert.deepEqual(character.zaino, [], 'Zaino is emptied');
  assert.deepEqual(character.armi, ['Spada'], 'Weapons are untouched');
  assert.deepEqual(character.oggettiSpeciali, ['Anello'], 'Special Items are untouched');
});

test('applyEffects: restoreEnduranceFromTotalLost heals fully with the Kai Discipline, half of all lifetime ENDURANCE lost without it - see Book 2 section 240', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 30, artiRamas: ['Guarigione'], armi: [], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });
  gameState.takeDamage(4); // simulates earlier damage across the adventure, not just the last fight
  gameState.takeDamage(6); // resistenza now 20-4-6=10, totalEnduranceLost=10

  await reader.applyEffects({ restoreEnduranceFromTotalLost: { kaiArt: 'Guarigione' } });
  assert.equal(gameState.getState().character.resistenza, 30, 'restored to resistenzaMax with the Discipline');

  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 30, artiRamas: [], armi: [], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });
  gameState.takeDamage(4);
  gameState.takeDamage(6);
  await reader.applyEffects({ restoreEnduranceFromTotalLost: { kaiArt: 'Guarigione' } });
  assert.equal(gameState.getState().character.resistenza, 15, '10 (current after -10) + floor(10/2)=5, without the Discipline');
});

test('fleeCombat: fleeSections lets the player pick a direction instead of one fixed destination - see Book 3 section 108', async () => {
  gameState.resetGame();
  const originalCheckDeath = reader.checkDeath;
  const originalNavigateToSection = reader.navigateToSection;
  reader.checkDeath = async () => false;
  let navigatedTo = null;
  reader.navigateToSection = (dest) => { navigatedTo = dest; };

  mockCombatData = { fleeSections: [{ label: 'Vai a Sud', section: 330 }, { label: 'Vai a Nord', section: 198 }] };
  mockChooseAsyncResult = 198;

  await reader.fleeCombat();
  assert.equal(navigatedTo, 198, 'navigates to whichever direction the player chose');

  reader.checkDeath = originalCheckDeath;
  reader.navigateToSection = originalNavigateToSection;
});

test('navigateToSection: combat.requirements failing skips the fight and runs bypassEffects instead - see Book 5 section 162', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 20, artiRamas: [], armi: [], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });
  gameState.setFlag('armInjured', true);
  startCombatCalls = 0;

  reader.bookData = {
    sections: {
      162: {
        text: 'x',
        combat: { name: 'Ragni del Vapore', combattivita: 10, resistenza: 35, requirements: { armInjured: false }, bypassEffects: { loseEndurance: 4 } },
        choices: [{ text: 'Continua', section: 114 }]
      }
    }
  };
  await reader.navigateToSection(162, { text: 'prev', choices: [] });
  assert.equal(startCombatCalls, 0, 'combat is skipped while the arm is injured');
  assert.equal(gameState.getState().character.resistenza, 16, 'bypassEffects still applies');

  gameState.setFlag('armInjured', false);
  await reader.navigateToSection(162, { text: 'prev', choices: [] });
  assert.equal(startCombatCalls, 1, 'combat runs normally once the requirement passes');

  reader.bookData = { sections: {} };
});

test('applyEffects: chooseNItems stops asking once count options are accepted - see Book 2 section 91', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 20, artiRamas: [], armi: [], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });

  await reader.applyEffects({
    chooseNItems: {
      count: 2,
      options: [
        { label: 'Asta', type: 'weapon', value: 'Asta' },
        { label: 'Coperta', type: 'item', value: 'Coperta' },
        { label: 'Cibo per 2 Pasti', type: 'meals', value: 2 },
        { label: 'Zaino', type: 'item', value: 'Zaino' }
      ]
    }
  });
  const character = gameState.getState().character;
  assert.deepEqual(character.armi, ['Asta'], 'first option accepted (weapon)');
  assert.deepEqual(character.zaino, ['Coperta'], 'second option accepted (item)');
  assert.equal(character.pasti, 0, 'third option never offered - count already reached');
});

test('applyEffects: shopItems deducts each item\'s own price and blocks purchases the hero can\'t afford - see Book 5 sections 27/211/388', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 20, artiRamas: [], armi: [], zaino: [], corone: 6, pasti: 0, oggettiSpeciali: [] });

  await reader.applyEffects({
    shopItems: [
      { label: 'Pugnale — 3 Corone', type: 'weapon', value: 'Pugnale', cost: 3 },
      { label: 'Spadone — 9 Corone', type: 'weapon', value: 'Spadone', cost: 9 }
    ]
  });
  const character = gameState.getState().character;
  assert.deepEqual(character.armi, ['Pugnale'], 'affordable item is bought');
  assert.equal(character.corone, 3, 'cost is deducted');
});

test('applyEffects: canAddItems routes weapon-named entries to the weapon slot, not the Zaino - see loot piles like Book 4 section 2', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 20, artiRamas: [], armi: [], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });

  await reader.applyEffects({ canAddItems: ['Spada', 'Pergamena'] });
  const character = gameState.getState().character;
  assert.deepEqual(character.armi, ['Spada'], 'a canonical weapon name must land in armi, not zaino');
  assert.deepEqual(character.zaino, ['Pergamena'], 'a non-weapon item still goes to zaino as before');
});

test('applyEffects: removeItem also finds and removes an equipped weapon (not just Zaino/Oggetti Speciali) - see Book 4 section 327', async () => {
  gameState.resetGame();
  gameState.setCharacter({ combattivita: 20, resistenza: 20, resistenzaMax: 20, artiRamas: [], armi: ['Spada', 'Lancia'], zaino: [], corone: 0, pasti: 0, oggettiSpeciali: [] });

  await reader.applyEffects({ removeItem: 'Spada' });
  assert.deepEqual(gameState.getState().character.armi, ['Lancia']);
});

test('isDestinyTest: false when a non-range choice has no requirements at all (ambiguous shape, e.g. Book 1 section 21\'s 3-attempt reroll) - falls back to plain buttons rather than guessing', () => {
  const choices = [
    { text: 'Primo lancio: 5-9 (eviti la palude)', section: 189 },
    { text: 'Secondo lancio: 8-9 (raggiungi terreno solido)', section: 189 },
    { text: 'Terzo lancio: 9 (ultima possibilità)', section: 312 }
  ];
  assert.equal(reader.isDestinyTest(choices), false);
});

test('buildEasyModeMap: finds the isVictory section regardless of its number (not hardcoded to 350)', () => {
  const book = {
    sections: {
      1: { choices: [{ text: 'Vai', section: 2 }] },
      2: { choices: [{ text: 'Vai', section: 400 }] },
      350: { choices: [{ text: 'Vicolo cieco', section: 999 }] }, // a plain section, NOT the ending
      400: { isVictory: true }
    }
  };
  const r = new StoryReader(book);
  r.buildEasyModeMap(book);
  assert.equal(r.easyModeDistances[400], 0);
  assert.notEqual(r.easyModeDistances[350], 0, 'section 350 must not be mistaken for the victory section');
  assert.equal(r.easyModeDistances[1], 2);
});

test('buildEasyModeMap: combat fleeSection/loseSection/forceEndSection and numericPuzzle.correctSection count as story edges, not just choices', () => {
  const book = {
    sections: {
      1: { combat: { name: 'Nemico', combattivita: 10, resistenza: 10, fleeSection: 2 } },
      2: { combat: { name: 'Nemico', combattivita: 10, resistenza: 10, loseSection: 3, forceEndSection: 4 } },
      3: { choices: [{ text: 'Continua', section: 4 }] },
      4: { numericPuzzle: { correctSection: 5, wrongSection: 4 } },
      5: { isVictory: true }
    }
  };
  const r = new StoryReader(book);
  r.buildEasyModeMap(book);
  // Every section here reaches victory only through combat/puzzle fields
  // (no section but 3 has a `choices` array) - if these fields aren't
  // treated as edges, none of them get a distance at all.
  assert.equal(r.easyModeDistances[5], 0);
  assert.equal(r.easyModeDistances[4], 1);
  assert.equal(r.easyModeDistances[3], 2);
  assert.equal(r.easyModeDistances[2], 2, 'shortest via forceEndSection (2 hops: 2->4->5), not loseSection (3 hops: 2->3->4->5)');
  assert.equal(r.easyModeDistances[1], 3);
});
