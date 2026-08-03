#!/usr/bin/env node
// Validates a book JSON file against the schema the engine (story-reader.js /
// combat-manager.js) actually understands. Run before merging any new/edited
// book so schema typos (e.g. "damage" instead of "loseEndurance", or a field
// with the wrong type) are caught here instead of silently doing nothing at
// runtime.
//
// Usage:
//   node scripts/validate-book.mjs data/books/02-fire-on-the-water.json
//   node scripts/validate-book.mjs            (validates every book in data/books/)

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const REQUIREMENT_FIELDS = {
  kaiArt: 'string',
  kaiArts: 'string[]', // ALL of these Kai Disciplines must be held at once (AND) - `kaiArt` above only checks one
  item: 'string',
  items: 'string[]', // ALL of these must be held at once (AND) - `item` above only checks one
  minGold: 'number',
  minDisciplines: 'number', // Kai rank is derived from this: 5=Initiate(start), 6=Aspirant, 7=Guardian, 8=Warmarn, 9=Savant, 10=Master
  minResistenza: 'number',
  maxResistenza: 'number',
  weaponMasteryEquipped: 'boolean', // Scherma AND the mastered weapon currently equipped
  maxRounds: 'number',
  minRounds: 'number',
  tookDamage: 'boolean',
  armInjured: 'boolean', // persistent narrative injury flag (e.g. Limbdeath) - see Book 5 sections 166/2/23/162
  enemyLostMore: 'boolean', // compares lastCombatSummary.damageDealt vs damageTaken (single-round "who took more damage" outcomes)
  playerLostMore: 'boolean',
  combatTied: 'boolean',
  anyOf: 'object[]', // OR: passes if ANY nested requirements object here passes
  not: 'object' // negates a nested requirements object (e.g. "does NOT have this Kai Discipline yet")
};

// Must match KAI_ARTS in src/components/character-creator.js exactly (including
// accents/casing) - a mismatched string here means the choice can NEVER pass,
// silently, because the engine does an exact string match against artiRamas.
const KAI_ART_NAMES = new Set([
  'Mimetismo', 'Caccia', 'Sesto Senso', 'Orientamento', 'Guarigione',
  'Scherma', 'Psicoschermo', 'Psicolaser', 'Affinità animale', 'Telecinesi'
]);

const EFFECT_FIELDS = {
  addItem: 'string',
  canAddItems: 'string[]',
  canAddWeapon: 'string',
  canAddMeals: 'number',
  addGold: 'number',
  removeGold: 'number',
  addGoldFromRoll: 'object', // { modifiers?: [{value, requirements}] } - see Book 2 section 116
  removeItem: 'string',
  loseEndurance: 'number',
  waivedByKaiArt: 'string', // companion to loseEndurance: skip the loss entirely with this Kai Discipline (generalizes psicoschermoPreventsLoss), see Book 3 section 331
  waivedByItem: 'string', // companion to loseEndurance: skip the loss entirely while holding this item, see Book 3 section 150
  loseEnduranceFromRoll: 'object', // { zeroMeansTen?, modifiers?: [{value, requirements}] } - see Book 3 section 258
  psicoschermoPreventsLoss: 'boolean',
  mustEatOrLoseEndurance: 'number',
  restoreEndurance: 'number|full',
  loseAllWeapons: 'boolean',
  loseRandomWeapon: 'boolean',
  loseAllItems: 'boolean',
  loseRandomItem: 'boolean', // steals one random Zaino item, or a random weapon if Zaino is empty - see Book 1 section 144
  loseCombattivita: 'number', // PERMANENT Combat Skill reduction ("for the rest of your life") - rare, see Book 1 section 236
  restoreHalfDamageTaken: 'boolean', // heals floor(lastCombatSummary.damageTaken / 2) - see Book 5 sections 20/135/161
  restoreEnduranceFromTotalLost: 'kaiArtGated', // { kaiArt } - full recovery with the Discipline, half of ALL lifetime ENDURANCE lost without it, see Book 2 section 240
  chooseNItems: 'chooseNItems', // { count, options: [{label, type: 'item'|'weapon'|'meals', value}] } - player picks exactly `count` of the listed options, see Book 2 section 91
  shopItems: 'shopItems', // [{label, type: 'item'|'weapon'|'meals', value, cost}] - buy any/all at their own Gold Crown price, unlike chooseNItems which is free and capped, see Book 5 sections 27/211/388
  setArmInjured: 'boolean', // -3 Combattività, until clearArmInjured restores it - see Book 5 section 166
  clearArmInjured: 'boolean' // see Book 5 section 2
};

const COMBAT_MODIFIER_TYPES = new Set(['firstRound', 'noKaiArt', 'noPlayerLossRounds']);

function checkCombatModifiers(modifiers, path, errors) {
  modifiers.forEach((mod, i) => {
    if (!COMBAT_MODIFIER_TYPES.has(mod.type)) {
      errors.push(`${path}[${i}]: unknown combatModifiers type "${mod.type}"`);
    }
  });
}

// Validates a requirements object AND recurses into anyOf alternatives (which
// are themselves full requirements objects) so a typo inside an OR-branch is
// still caught, not just at the top level.
function checkRequirementsObject(reqObj, path, errors) {
  checkFields(reqObj, REQUIREMENT_FIELDS, path, errors);
  if (typeof reqObj.kaiArt === 'string' && !KAI_ART_NAMES.has(reqObj.kaiArt)) {
    errors.push(`${path}.kaiArt: "${reqObj.kaiArt}" does not match any of the 10 canonical Kai Discipline names (typo, wrong accent, or wrong casing? this choice can never pass)`);
  }
  if (Array.isArray(reqObj.anyOf)) {
    reqObj.anyOf.forEach((alt, i) => checkRequirementsObject(alt, `${path}.anyOf[${i}]`, errors));
  }
  if (reqObj.not && typeof reqObj.not === 'object') {
    checkRequirementsObject(reqObj.not, `${path}.not`, errors);
  }
}

function checkEffects(effects, path, errors) {
  checkFields(effects, EFFECT_FIELDS, path, errors);
  if (effects.loseEnduranceFromRoll && Array.isArray(effects.loseEnduranceFromRoll.modifiers)) {
    checkDestinyModifiers(effects.loseEnduranceFromRoll.modifiers, `${path}.loseEnduranceFromRoll.modifiers`, errors);
  }
  if (effects.addGoldFromRoll && Array.isArray(effects.addGoldFromRoll.modifiers)) {
    checkDestinyModifiers(effects.addGoldFromRoll.modifiers, `${path}.addGoldFromRoll.modifiers`, errors);
  }
}

// destinyModifier: [{ value: number, requirements: {...} }, ...] - each entry
// whose requirements pass adds `value` to the Destiny Table roll (see
// calculateDestinyModifier in story-reader.js). Entries stack independently.
function checkDestinyModifiers(modifiers, path, errors) {
  modifiers.forEach((mod, i) => {
    if (typeof mod.value !== 'number') {
      errors.push(`${path}[${i}].value: expected number, got ${typeOf(mod.value)}`);
    }
    if (mod.requirements !== undefined) {
      checkRequirementsObject(mod.requirements, `${path}[${i}].requirements`, errors);
    }
  });
}

const COMBAT_FIELDS = {
  name: 'string',
  combattivita: 'number',
  resistenza: 'number',
  immuneToPsicolaser: 'boolean',
  mindblast: 'boolean',
  playerCombatBonus: 'number',
  playerCombatPenalty: 'number',
  playerPenaltyNoItem: 'penaltyNoItem',
  playerBonusIfItem: 'bonusIfItem', // { item, value } - mirror of playerPenaltyNoItem, bonus applies WHILE holding the item instead of while lacking it, see Book 5 section 253
  psicolaserBonusOverride: 'number', // reduced Psicolaser bonus for partially-immune enemies (default is +2), see Book 3 section 137
  psicoschermoPreventsLoss: 'boolean',
  canFlee: 'boolean',
  canFleeDamage: 'boolean', // documents that fleeing costs Endurance - always true, see combat-manager.js flee()
  fleeSection: 'number',
  fleeSections: 'fleeChoices', // [{label, section}] - flee leads to a choice of destination instead of one fixed section, see Book 3 section 108
  fleeAfterRounds: 'number',
  loseSection: 'number', // some enemies spare the hero instead of killing him - redirect here instead of Game Over, see Book 5 section 20/135
  forceEndAfterRounds: 'number', // combat is cut short (neither side necessarily dead) after this many rounds - see forceEndSection
  forceEndSection: 'number',
  undead: 'boolean',
  combatModifiers: 'object[]',
  doubleEnemyEnduranceLoss: 'boolean', // doubles ENDURANCE lost by the enemy each round, regardless of weapon - see Book 2 section 306
  allyDamagePerRound: 'number', // a companion adds this much flat ENDURANCE loss to the enemy every round, independent of the hero's own roll - see Book 3 section 180
  enduranceLossAfterRoundsFromRoll: 'oxygenRounds', // { zeroMeansTen?, kaiArtBonus?: {kaiArt, value}, lossPerRound } - rolled once at combat start for how many rounds the hero can hold his breath before extra loss kicks in, see Book 4 sections 194/234
  playerEnduranceLossPerRound: 'enduranceLossPerRound', // { value, waivedByKaiArt? } - flat ENDURANCE loss every round (e.g. ongoing Mindblast), see Book 2 section 332
  requirements: 'object', // gates whether this combat happens at all - if it fails, bypassEffects runs instead and no fight occurs, see Book 5 section 162
  bypassEffects: 'object'
};

const DOUBLE_ROLL_OUTCOMES = new Set(['secondLess', 'secondMore', 'equal']);

const CHOICE_FIELDS = {
  text: 'string',
  section: 'number|null', // null only valid together with isDeathSection: true (inline death, no "turn to" target)
  requirements: 'object',
  effects: 'object',
  isDeathSection: 'boolean',
  outcome: 'string' // only on choices under a doubleDestinyRoll section - see DOUBLE_ROLL_OUTCOMES
};

const SECTION_FIELDS = {
  text: 'string',
  image: 'string',
  title: 'string',
  combat: 'object|object[]',
  choices: 'object[]',
  effects: 'object',
  isDeathSection: 'boolean',
  isVictory: 'boolean',
  isFailureEnding: 'boolean', // "you survive but fail the mission" - distinct from death, see Book 3 section 61
  // navigateToSection() folds these onto every enemy in the fight before combat starts
  playerCombatBonus: 'number',
  playerCombatPenalty: 'number',
  destinyModifier: 'object[]', // adjusts a Destiny Table roll before it's matched against choice ranges
  doubleDestinyRoll: 'boolean', // draw two numbers and compare them, instead of matching one roll against choice ranges
  numericPuzzle: 'numericPuzzle' // {correctSection, wrongSection} - physical-book puzzle, player jumps straight to the section they worked out
};

function typeOf(value) {
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function checkType(value, expected) {
  if (expected === 'string[]') return Array.isArray(value) && value.every(v => typeof v === 'string');
  if (expected === 'object[]') return Array.isArray(value) && value.every(v => typeof v === 'object' && v !== null);
  if (expected === 'object|object[]') {
    if (Array.isArray(value)) return value.every(v => typeof v === 'object' && v !== null);
    return typeof value === 'object' && value !== null;
  }
  if (expected === 'number|full') return typeof value === 'number' || value === 'full';
  if (expected === 'number|null') return typeof value === 'number' || value === null;
  if (expected === 'penaltyNoItem') {
    return typeof value === 'object' && value !== null &&
      typeof value.item === 'string' && typeof value.penalty === 'number';
  }
  if (expected === 'bonusIfItem') {
    return typeof value === 'object' && value !== null &&
      typeof value.item === 'string' && typeof value.value === 'number';
  }
  if (expected === 'numericPuzzle') {
    return typeof value === 'object' && value !== null &&
      typeof value.correctSection === 'number' && typeof value.wrongSection === 'number';
  }
  if (expected === 'enduranceLossPerRound') {
    return typeof value === 'object' && value !== null &&
      typeof value.value === 'number' &&
      (value.waivedByKaiArt === undefined || typeof value.waivedByKaiArt === 'string');
  }
  if (expected === 'chooseNItems') {
    return typeof value === 'object' && value !== null &&
      typeof value.count === 'number' && Array.isArray(value.options) &&
      value.options.every(o => typeof o === 'object' && o !== null &&
        typeof o.label === 'string' &&
        ['item', 'weapon', 'meals'].includes(o.type) &&
        (o.type === 'meals' ? typeof o.value === 'number' : typeof o.value === 'string'));
  }
  if (expected === 'fleeChoices') {
    return Array.isArray(value) && value.length > 0 &&
      value.every(o => typeof o === 'object' && o !== null && typeof o.label === 'string' && typeof o.section === 'number');
  }
  if (expected === 'shopItems') {
    return Array.isArray(value) && value.every(o => typeof o === 'object' && o !== null &&
      typeof o.label === 'string' && typeof o.cost === 'number' &&
      ['item', 'weapon', 'meals'].includes(o.type) &&
      (o.type === 'meals' ? typeof o.value === 'number' : typeof o.value === 'string'));
  }
  if (expected === 'kaiArtGated') {
    return typeof value === 'object' && value !== null && typeof value.kaiArt === 'string';
  }
  if (expected === 'oxygenRounds') {
    return typeof value === 'object' && value !== null && typeof value.lossPerRound === 'number' &&
      (value.zeroMeansTen === undefined || typeof value.zeroMeansTen === 'boolean') &&
      (value.kaiArtBonus === undefined || (typeof value.kaiArtBonus === 'object' && typeof value.kaiArtBonus.kaiArt === 'string' && typeof value.kaiArtBonus.value === 'number'));
  }
  return typeOf(value) === expected;
}

function checkFields(obj, whitelist, path, errors) {
  for (const [key, value] of Object.entries(obj)) {
    if (!(key in whitelist)) {
      errors.push(`${path}: unknown field "${key}" (typo? engine won't recognize this)`);
      continue;
    }
    if (!checkType(value, whitelist[key])) {
      errors.push(`${path}.${key}: expected ${whitelist[key]}, got ${typeOf(value)} (${JSON.stringify(value)})`);
    }
  }
}

function validateBook(filePath) {
  const errors = [];
  const warnings = [];

  let book;
  try {
    book = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (e) {
    return { errors: [`Invalid JSON: ${e.message}`], warnings: [] };
  }

  for (const key of ['bookId', 'bookNumber', 'title', 'sections']) {
    if (!(key in book)) errors.push(`Missing top-level field "${key}"`);
  }
  if (!book.sections) return { errors, warnings };

  const sectionKeys = new Set(Object.keys(book.sections));
  const imgDir = join(dirname(filePath), '..', '..', 'public', 'img', `book${String(book.bookNumber).padStart(2, '0')}`);

  const checkSectionRef = (target, path) => {
    if (typeof target !== 'number' && typeof target !== 'string') {
      errors.push(`${path}: section reference must be a number, got ${typeOf(target)}`);
      return;
    }
    if (!sectionKeys.has(String(target))) {
      errors.push(`${path}: references non-existent section "${target}"`);
    }
  };

  for (const [num, section] of Object.entries(book.sections)) {
    const path = `sections["${num}"]`;

    if (typeof section.text !== 'string' || section.text.length === 0) {
      errors.push(`${path}: missing or empty "text"`);
    }

    checkFields(section, SECTION_FIELDS, path, errors);

    if (section.image) {
      const imgPath = join(ROOT, section.image.replace(/^public[\\/]/, 'public/'));
      const altPath = join(imgDir, section.image.split('/').pop());
      if (!existsSync(imgPath) && !existsSync(altPath)) {
        errors.push(`${path}.image: file not found - "${section.image}"`);
      }
    }

    if (section.effects) checkEffects(section.effects, `${path}.effects`, errors);
    if (section.destinyModifier) checkDestinyModifiers(section.destinyModifier, `${path}.destinyModifier`, errors);

    if (section.numericPuzzle) {
      checkSectionRef(section.numericPuzzle.correctSection, `${path}.numericPuzzle.correctSection`);
      checkSectionRef(section.numericPuzzle.wrongSection, `${path}.numericPuzzle.wrongSection`);
    }

    if (section.doubleDestinyRoll) {
      const choices = section.choices || [];
      if (choices.length === 0) {
        errors.push(`${path}: doubleDestinyRoll is true but has no choices`);
      }
      choices.forEach((choice, i) => {
        if (!DOUBLE_ROLL_OUTCOMES.has(choice.outcome)) {
          errors.push(`${path}.choices[${i}]: doubleDestinyRoll section requires choices[].outcome to be one of secondLess/secondMore/equal, got "${choice.outcome}"`);
        }
      });
    }

    const combats = Array.isArray(section.combat) ? section.combat : (section.combat ? [section.combat] : []);
    combats.forEach((c, i) => {
      checkFields(c, COMBAT_FIELDS, `${path}.combat[${i}]`, errors);
      if (c.fleeSection !== undefined) checkSectionRef(c.fleeSection, `${path}.combat[${i}].fleeSection`);
      if (c.loseSection !== undefined) checkSectionRef(c.loseSection, `${path}.combat[${i}].loseSection`);
      if (c.forceEndSection !== undefined) checkSectionRef(c.forceEndSection, `${path}.combat[${i}].forceEndSection`);
      if (c.combatModifiers) checkCombatModifiers(c.combatModifiers, `${path}.combat[${i}].combatModifiers`, errors);
      if (c.requirements) checkRequirementsObject(c.requirements, `${path}.combat[${i}].requirements`, errors);
      if (c.bypassEffects) checkEffects(c.bypassEffects, `${path}.combat[${i}].bypassEffects`, errors);
    });

    if (section.isDeathSection && section.choices && section.choices.length > 0) {
      warnings.push(`${path}: isDeathSection but has ${section.choices.length} choices (dead ends should have none)`);
    }
    if (section.isVictory && section.choices && section.choices.length > 0) {
      warnings.push(`${path}: isVictory but has ${section.choices.length} choices (endings should have none)`);
    }
    if (section.isFailureEnding && section.choices && section.choices.length > 0) {
      warnings.push(`${path}: isFailureEnding but has ${section.choices.length} choices (endings should have none)`);
    }

    (section.choices || []).forEach((choice, i) => {
      checkFields(choice, CHOICE_FIELDS, `${path}.choices[${i}]`, errors);
      if (choice.section === null && !choice.isDeathSection) {
        errors.push(`${path}.choices[${i}].section: null is only valid together with isDeathSection: true`);
      } else if (choice.section !== undefined && choice.section !== null) {
        checkSectionRef(choice.section, `${path}.choices[${i}].section`);
      }
      if (choice.requirements) checkRequirementsObject(choice.requirements, `${path}.choices[${i}].requirements`, errors);
      if (choice.effects) checkEffects(choice.effects, `${path}.choices[${i}].effects`, errors);
    });
  }

  return { errors, warnings };
}

function main() {
  const args = process.argv.slice(2);
  const booksDir = join(ROOT, 'data', 'books');
  const targets = args.length > 0
    ? args
    : readdirSync(booksDir).filter(f => f.endsWith('.json')).map(f => join(booksDir, f));

  let hasErrors = false;

  for (const target of targets) {
    const filePath = resolve(target);
    console.log(`\n--- ${filePath} ---`);
    const { errors, warnings } = validateBook(filePath);

    if (errors.length === 0 && warnings.length === 0) {
      console.log('OK - no issues found.');
    } else {
      warnings.forEach(w => console.log(`  WARNING: ${w}`));
      errors.forEach(e => console.log(`  ERROR: ${e}`));
      if (errors.length > 0) hasErrors = true;
      console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);
    }
  }

  process.exit(hasErrors ? 1 : 0);
}

main();
