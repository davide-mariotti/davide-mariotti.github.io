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
  item: 'string',
  minGold: 'number',
  maxRounds: 'number',
  minRounds: 'number',
  tookDamage: 'boolean'
};

const EFFECT_FIELDS = {
  addItem: 'string',
  canAddItems: 'string[]',
  canAddWeapon: 'string',
  canAddMeals: 'number',
  addGold: 'number',
  removeGold: 'number',
  removeItem: 'string',
  loseEndurance: 'number',
  psicoschermoPreventsLoss: 'boolean',
  mustEatOrLoseEndurance: 'number',
  restoreEndurance: 'number|full',
  loseAllWeapons: 'boolean',
  loseRandomWeapon: 'boolean',
  loseAllItems: 'boolean'
};

const COMBAT_MODIFIER_TYPES = new Set(['firstRound', 'noKaiArt', 'noPlayerLossRounds']);

function checkCombatModifiers(modifiers, path, errors) {
  modifiers.forEach((mod, i) => {
    if (!COMBAT_MODIFIER_TYPES.has(mod.type)) {
      errors.push(`${path}[${i}]: unknown combatModifiers type "${mod.type}"`);
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
  psicolaserBonusOverride: 'number', // reduced Psicolaser bonus for partially-immune enemies (default is +2), see Book 3 section 137
  psicoschermoPreventsLoss: 'boolean',
  canFlee: 'boolean',
  canFleeDamage: 'boolean', // documents that fleeing costs Endurance - always true, see combat-manager.js flee()
  fleeSection: 'number',
  fleeAfterRounds: 'number',
  undead: 'boolean',
  combatModifiers: 'object[]'
};

const CHOICE_FIELDS = {
  text: 'string',
  section: 'number|null', // null only valid together with isDeathSection: true (inline death, no "turn to" target)
  requirements: 'object',
  effects: 'object',
  isDeathSection: 'boolean'
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
  playerCombatPenalty: 'number'
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

    if (section.effects) checkFields(section.effects, EFFECT_FIELDS, `${path}.effects`, errors);

    const combats = Array.isArray(section.combat) ? section.combat : (section.combat ? [section.combat] : []);
    combats.forEach((c, i) => {
      checkFields(c, COMBAT_FIELDS, `${path}.combat[${i}]`, errors);
      if (c.fleeSection !== undefined) checkSectionRef(c.fleeSection, `${path}.combat[${i}].fleeSection`);
      if (c.combatModifiers) checkCombatModifiers(c.combatModifiers, `${path}.combat[${i}].combatModifiers`, errors);
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
      if (choice.requirements) checkFields(choice.requirements, REQUIREMENT_FIELDS, `${path}.choices[${i}].requirements`, errors);
      if (choice.effects) checkFields(choice.effects, EFFECT_FIELDS, `${path}.choices[${i}].effects`, errors);
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
