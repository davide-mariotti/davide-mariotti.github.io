// Tests for StoryReader's pure logic (choice gating and Destiny Table text
// parsing) - shared by every book, so a regression here silently breaks
// choice-gating or Destiny Tests across the whole series at once.
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

mock.module('../src/save-manager.js', {
  exports: { saveManager: { scheduleAutoSave: () => {}, deleteSave: async () => {} } }
});

const { StoryReader } = await import('../src/components/story-reader.js');

const reader = new StoryReader({ sections: {} });

function fakeState({
  artiRamas = [], zaino = [], oggettiSpeciali = [], armi = [], corone = 0,
  resistenza = 20, weaponMastery = null, lastCombatSummary = null
} = {}) {
  return {
    character: { artiRamas, zaino, oggettiSpeciali, armi, corone, resistenza, weaponMastery },
    lastCombatSummary
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

test('isDestinyTest: false when a non-range choice has no requirements at all (ambiguous shape, e.g. Book 1 section 21\'s 3-attempt reroll) - falls back to plain buttons rather than guessing', () => {
  const choices = [
    { text: 'Primo lancio: 5-9 (eviti la palude)', section: 189 },
    { text: 'Secondo lancio: 8-9 (raggiungi terreno solido)', section: 189 },
    { text: 'Terzo lancio: 9 (ultima possibilità)', section: 312 }
  ];
  assert.equal(reader.isDestinyTest(choices), false);
});
