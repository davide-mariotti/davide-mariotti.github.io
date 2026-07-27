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

function fakeState({ artiRamas = [], zaino = [], oggettiSpeciali = [], armi = [], corone = 0, lastCombatSummary = null } = {}) {
  return {
    character: { artiRamas, zaino, oggettiSpeciali, armi, corone },
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

test('parseDestinyRange: handles every phrasing used across the translated books', () => {
  assert.deepEqual(reader.parseDestinyRange('Numero 0-3'), { min: 0, max: 3 });
  assert.deepEqual(reader.parseDestinyRange('Numero da 0 a 3'), { min: 0, max: 3 });
  assert.deepEqual(reader.parseDestinyRange('Se il numero è 5'), { min: 5, max: 5 });
  assert.equal(reader.parseDestinyRange('Se vinci il combattimento'), null);
});

test('isDestinyTest: true only when every choice describes a Destiny Table range', () => {
  assert.equal(reader.isDestinyTest([{ text: 'Numero 0-4' }, { text: 'Numero 5-9' }]), true);
  assert.equal(reader.isDestinyTest([{ text: 'Numero 0-4' }, { text: 'Se hai una spada' }]), false);
  assert.equal(reader.isDestinyTest([{ text: 'Numero 0-9' }]), false, 'a single choice is not a real branching test');
});
