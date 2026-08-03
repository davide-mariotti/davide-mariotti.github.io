import { gameState } from '../game-state.js';
import { combatManager } from './combat-manager.js';
import { UIHelpers } from '../utils/ui-helpers.js';
import { saveManager } from '../save-manager.js';
import { getRandomDestinyNumber } from './destiny-table.js';
import { WEAPONS } from './character-creator.js';

export class StoryReader {
  constructor(bookData, onContinueNextBook = null) {
    this.bookData = bookData;
    this.onContinueNextBook = onContinueNextBook;
    this.easyModeMap = {};
    if (bookData) this.buildEasyModeMap(bookData);
  }

  buildEasyModeMap(bookData) {
    if (!bookData || !bookData.sections) return;

    let victorySectionId = null;
    for (const [id, sec] of Object.entries(bookData.sections)) {
      if (sec.isVictory) {
        victorySectionId = parseInt(id);
        break;
      }
    }
    if (!victorySectionId) return;

    const dist = {};
    const bestNext = {};
    dist[victorySectionId] = 0;
    let updated = true;

    while (updated) {
      updated = false;
      for (const [sIdStr, sec] of Object.entries(bookData.sections)) {
        const sId = parseInt(sIdStr);

        let minD = Infinity;
        let best = null;

        for (const c of sec.choices || []) {
          if (c.section && dist[c.section] !== undefined) {
            if (dist[c.section] + 1 < minD) {
              minD = dist[c.section] + 1;
              best = c.section;
            }
          }
        }

        // Combat outcomes and map/code puzzles aren't buttons in a choices
        // list, but they're still real story edges - without them, any
        // section whose only way onward is a fight (win/flee/lose) or a
        // numeric puzzle looks like a dead end, and everything upstream of
        // it silently loses its distance-to-victory too. `best` stays a
        // choices-only target since that's the only thing the UI can
        // actually highlight as a clickable button.
        const combats = Array.isArray(sec.combat) ? sec.combat : (sec.combat ? [sec.combat] : []);
        for (const c of combats) {
          const targets = [c.fleeSection, c.loseSection, c.forceEndSection, ...(c.fleeSections || []).map(f => f.section)];
          for (const target of targets) {
            if (target && dist[target] !== undefined && dist[target] + 1 < minD) {
              minD = dist[target] + 1;
            }
          }
        }
        if (sec.numericPuzzle && dist[sec.numericPuzzle.correctSection] !== undefined) {
          minD = Math.min(minD, dist[sec.numericPuzzle.correctSection] + 1);
        }

        if (minD !== Infinity && (dist[sId] === undefined || minD < dist[sId])) {
          dist[sId] = minD;
          bestNext[sId] = best;
          updated = true;
        }
      }
    }

    this.easyModeDistances = dist;
    this.easyModeMap = bestNext;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'story-container';
    container.id = 'story-reader';

    gameState.subscribe((state) => this.update(container, state));
    this.update(container, gameState.getState());

    return container;
  }

  update(container, state) {
    const { currentSection, history, inCombat, combatState } = state;
    if (!this.easyModeMap || Object.keys(this.easyModeMap).length === 0) {
      this.buildEasyModeMap(this.bookData);
    }
    const section = this.bookData.sections[currentSection];

    if (!section) {
      container.innerHTML = `
        <div class="card">
          <h2>❌ Sezione non trovata</h2>
          <p>Sezione ${currentSection} non disponibile.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div class="card">
        <span class="section-number">Sezione ${currentSection}</span>
        ${section.image ? `<img src="${section.image}" alt="Illustrazione" class="section-image" style="width: 100%; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">` : ''}
        ${section.title ? `<h2>${section.title}</h2>` : ''}
        <div class="section-text">${section.text}</div>
    `;

    // Show combat if in combat
    if (inCombat && combatState) {
      html += this.renderCombat(combatState);
    }

    // Show choices, Destiny Test, or Death/Victory Message
    if (!inCombat) {
      if (section.isDeathSection) {
        html += this.renderDeathSection();
      } else if (section.isFailureEnding) {
        html += this.renderFailureEndingSection();
      } else if (section.isVictory) {
        html += this.renderVictorySection(state.bookNumber, this.onContinueNextBook && state.bookNumber < 5);
      } else if (section.numericPuzzle) {
        // A physical-book puzzle (a combination lock, a map-derived code):
        // the "correct" outcome isn't one of a fixed set of buttons, it's
        // whatever section number the player works out from clues elsewhere
        // in the book. Any other guess falls through to a single fixed
        // "wrong guess" section - see numericPuzzle.wrongSection. A section
        // can still offer regular choices alongside it (e.g. "give up
        // without trying") - those render as normal buttons above the puzzle.
        if (section.choices && section.choices.length > 0) html += this.renderStandardChoices(section.choices, state);
        html += this.renderNumericPuzzle();
      } else if (section.choices && section.choices.length > 0) {
        if (section.doubleDestinyRoll) {
          // A rarer Destiny Table variant: draw two numbers in sequence and
          // compare them to each other (rather than matching one modified
          // roll against fixed ranges) - see handleDoubleDestinyRoll.
          html += this.renderDestinyTest();
        } else if (this.isDestinyTest(section.choices)) {
          // A "bypass" choice (e.g. "if you possess the Sommerswerd, turn to
          // X") can sit alongside a real Destiny Table roll - show it as a
          // normal button; if its requirements don't pass, the player just
          // uses the roll below instead. handleDestinyRoll already ignores
          // non-range choices when matching the result, so this is safe.
          const bypassChoices = section.choices.filter(c => this.parseDestinyRange(c.text) === null);
          if (bypassChoices.length > 0) html += this.renderStandardChoices(bypassChoices, state);
          html += this.renderDestinyTest();
        } else {
          html += this.renderStandardChoices(section.choices, state);
        }
      }
    }



    html += `</div>`;
    container.innerHTML = html;

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Attach event listeners
    const choiceBtns = container.querySelectorAll('.choice-btn');
    choiceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const nextSection = parseInt(btn.dataset.section);
        const choice = section.choices[parseInt(btn.dataset.index)];
        this.navigateToSection(nextSection, section, choice);
      });
    });



    // Combat buttons
    const fightBtn = container.querySelector('#fight-btn');
    if (fightBtn) {
      fightBtn.addEventListener('click', () => this.executeCombatRound());
    }

    const fleeBtn = container.querySelector('#flee-btn');
    if (fleeBtn) {
      fleeBtn.addEventListener('click', () => this.fleeCombat());
    }

    const destinyBtn = container.querySelector('#destiny-roll-btn');
    if (destinyBtn) {
      if (section.doubleDestinyRoll) {
        destinyBtn.addEventListener('click', () => this.handleDoubleDestinyRoll(container, section));
      } else {
        destinyBtn.addEventListener('click', () => this.handleDestinyRoll(container, section));
      }
    }

    const puzzleBtn = container.querySelector('#numeric-puzzle-btn');
    if (puzzleBtn) {
      puzzleBtn.addEventListener('click', () => this.handleNumericPuzzle(container, section));
    }

    const continueNextBookBtn = container.querySelector('#continue-next-book-btn');
    if (continueNextBookBtn) {
      continueNextBookBtn.addEventListener('click', () => {
        if (this.onContinueNextBook) this.onContinueNextBook();
      });
    }

    const restartBtn = container.querySelector('#restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', async () => {
        await saveManager.deleteSave('autosave');
        gameState.resetGame();
        // Use window.location.href to force a clean reload to the root or index
        window.location.reload();
      });
    }


  }

  async navigateToSection(sectionNumber, currentSection, choice = null) {
    // Handle section effects (items, stat changes, etc.)
    if (currentSection.effects) {
      try {
        await this.applyEffects(currentSection.effects);
      } catch (error) {
        console.error('Error applying effects:', error);
        UIHelpers.showToast('⚠️ Errore nell\'applicare gli effetti', 'warning');
      }
    }

    // Some choices carry their own effects (e.g. "roll 0-4: you fall, -2 Resistenza")
    if (choice && choice.effects) {
      try {
        await this.applyEffects(choice.effects);
      } catch (error) {
        console.error('Error applying choice effects:', error);
        UIHelpers.showToast('⚠️ Errore nell\'applicare gli effetti', 'warning');
      }
    }

    // Check for combat
    const nextSection = this.bookData.sections[sectionNumber];
    // A single-enemy combat can be entirely skipped under some condition (e.g.
    // "you cannot fight with an injured arm, you fall instead") - bypassEffects
    // then substitutes for the fight. See Book 5 section 162.
    const combatSkipped = nextSection && nextSection.combat && !Array.isArray(nextSection.combat) &&
      nextSection.combat.requirements && !this.checkRequirements(nextSection.combat.requirements, gameState.getState());
    if (combatSkipped) {
      if (nextSection.combat.bypassEffects) {
        try {
          await this.applyEffects(nextSection.combat.bypassEffects);
        } catch (error) {
          console.error('Error applying combat bypass effects:', error);
          UIHelpers.showToast('⚠️ Errore nell\'applicare gli effetti', 'warning');
        }
      }
    } else if (nextSection && nextSection.combat) {
      // Some sections apply a combat bonus/penalty (terrain, surprise, etc.)
      // to the whole encounter rather than to a specific enemy - fold it into
      // every enemy in the fight so combatManager only has one mechanism to handle.
      let combatData = nextSection.combat;
      if (nextSection.playerCombatBonus) {
        const bonus = nextSection.playerCombatBonus;
        const applyBonus = (enemy) => ({ ...enemy, playerCombatBonus: (enemy.playerCombatBonus || 0) + bonus });
        combatData = Array.isArray(combatData) ? combatData.map(applyBonus) : applyBonus(combatData);
      }
      if (nextSection.playerCombatPenalty) {
        const penalty = nextSection.playerCombatPenalty;
        const applyPenalty = (enemy) => ({ ...enemy, playerCombatPenalty: (enemy.playerCombatPenalty || 0) + penalty });
        combatData = Array.isArray(combatData) ? combatData.map(applyPenalty) : applyPenalty(combatData);
      }
      combatManager.startCombat(combatData);
    }

    gameState.goToSection(sectionNumber);
  }

  // All keys present on a requirements object must pass (AND, not "first match
  // wins") - a choice can combine e.g. a Kai Discipline AND an item at once.
  // Use `anyOf: [requirements, ...]` for OR - passes if ANY alternative object
  // passes (each alternative can itself combine multiple ANDed keys).
  checkRequirements(requirements, state) {
    if (!requirements) return true;
    const character = state.character;

    if (requirements.anyOf !== undefined) {
      if (!requirements.anyOf.some(alt => this.checkRequirements(alt, state))) return false;
    }
    if (requirements.not !== undefined) {
      if (this.checkRequirements(requirements.not, state)) return false;
    }
    if (requirements.kaiArt !== undefined) {
      if (!character.artiRamas.includes(requirements.kaiArt)) return false;
    }
    // All of these Kai Disciplines must be held at once (e.g. "if you have
    // Camouflage AND Hunting") - `kaiArt` above only ever checks a single one.
    if (requirements.kaiArts !== undefined) {
      if (!requirements.kaiArts.every(art => character.artiRamas.includes(art))) return false;
    }
    if (requirements.item !== undefined) {
      const has = character.zaino.includes(requirements.item) ||
        character.oggettiSpeciali.includes(requirements.item) ||
        character.armi.includes(requirements.item);
      if (!has) return false;
    }
    // All of these items must be held at once (e.g. "if you have a Torch AND
    // a Tinderbox") - `item` above only ever checks a single name.
    if (requirements.items !== undefined) {
      const hasAll = requirements.items.every(item =>
        character.zaino.includes(item) ||
        character.oggettiSpeciali.includes(item) ||
        character.armi.includes(item)
      );
      if (!hasAll) return false;
    }
    if (requirements.minGold !== undefined) {
      if (character.corone < requirements.minGold) return false;
    }
    // Kai rank is derived from how many Disciplines you know, not tracked
    // separately - see levels.htm: 5 at start (Initiate), +1 per book
    // completed (Aspirant=6, Guardian=7, Warmarn=8, Savant=9, Master=10).
    if (requirements.minDisciplines !== undefined) {
      if (character.artiRamas.length < requirements.minDisciplines) return false;
    }
    if (requirements.minResistenza !== undefined) {
      if (character.resistenza < requirements.minResistenza) return false;
    }
    if (requirements.maxResistenza !== undefined) {
      if (character.resistenza >= requirements.maxResistenza) return false;
    }
    // "Kai Discipline of Weaponskill WITH the weapon you are now using" -
    // Scherma only helps while the mastered weapon is actually equipped.
    // Persistent narrative injury flag (e.g. Limbdeath numbing an arm) - set/
    // cleared via effects.setArmInjured/clearArmInjured, see Book 5 sections 166/2
    if (requirements.armInjured !== undefined) {
      if (!!state.flags.armInjured !== requirements.armInjured) return false;
    }
    if (requirements.weaponMasteryEquipped !== undefined) {
      const equipped = character.artiRamas.includes('Scherma') &&
        !!character.weaponMastery && character.armi.includes(character.weaponMastery);
      if (equipped !== requirements.weaponMasteryEquipped) return false;
    }
    // Gate a choice on how the combat that just ended actually went
    if (requirements.maxRounds !== undefined) {
      if (!state.lastCombatSummary || state.lastCombatSummary.rounds > requirements.maxRounds) return false;
    }
    if (requirements.minRounds !== undefined) {
      if (!state.lastCombatSummary || state.lastCombatSummary.rounds < requirements.minRounds) return false;
    }
    if (requirements.tookDamage !== undefined) {
      if (!state.lastCombatSummary) return false;
      const took = state.lastCombatSummary.damageTaken > 0;
      if (took !== requirements.tookDamage) return false;
    }
    // Compares how much Resistenza each side lost in the combat that just
    // ended (e.g. a single-round surprise clash with a 3-way outcome: "you
    // lost more" / "the enemy lost more" / "exact tie").
    if (requirements.enemyLostMore !== undefined) {
      if (!state.lastCombatSummary) return false;
      const result = state.lastCombatSummary.damageDealt > state.lastCombatSummary.damageTaken;
      if (result !== requirements.enemyLostMore) return false;
    }
    if (requirements.playerLostMore !== undefined) {
      if (!state.lastCombatSummary) return false;
      const result = state.lastCombatSummary.damageTaken > state.lastCombatSummary.damageDealt;
      if (result !== requirements.playerLostMore) return false;
    }
    if (requirements.combatTied !== undefined) {
      if (!state.lastCombatSummary) return false;
      const result = state.lastCombatSummary.damageTaken === state.lastCombatSummary.damageDealt;
      if (result !== requirements.combatTied) return false;
    }

    return true;
  }

  // Sum every applicable entry's value (they stack independently - e.g. Book 3
  // section 284 adds 2 for Caccia AND separately deducts 2 when badly wounded).
  // Each entry's `requirements` (or `anyOf` inside it) is checked with the same
  // checkRequirements used for choices, so "Discipline A OR B OR C" etc. all work.
  calculateDestinyModifier(section, state) {
    if (!section.destinyModifier) return 0;
    return section.destinyModifier.reduce((total, mod) => {
      return total + (this.checkRequirements(mod.requirements, state) ? mod.value : 0);
    }, 0);
  }

  // Pure computation shared by effects.loseEnduranceFromRoll and
  // effects.addGoldFromRoll - kept separate from the gameState/UIHelpers side
  // effects in applyEffects so it's unit-testable.
  resolveModifiedRoll(spec, roll, state) {
    const adjustedRoll = (spec.zeroMeansTen && roll === 0) ? 10 : roll;
    const modifier = (spec.modifiers || []).reduce((sum, mod) =>
      sum + (this.checkRequirements(mod.requirements, state) ? mod.value : 0), 0);
    return { total: Math.max(0, adjustedRoll + modifier), modifier };
  }

  async applyEffects(effects) {
    // Add single item
    if (effects.addItem) {
      if (gameState.addToZaino(effects.addItem)) {
        UIHelpers.showToast(`✅ Aggiunto: ${effects.addItem}`, 'success');
      } else {
        UIHelpers.showToast(`🎒 Zaino Pieno! Impossibile prendere: ${effects.addItem}`, 'error');
      }
    }

    // Add multiple items with confirmation
    if (effects.canAddItems) {
      for (const item of effects.canAddItems) {
        // A loot pile sometimes mixes weapons in with Backpack Items (e.g.
        // "search the bodies: Sword, Mace, Dagger, Backpack"). A weapon picked
        // up this way must still go through the weapon slot (with its own
        // 2-weapon swap prompt), not into the Zaino - otherwise it silently
        // never counts as "equipped" for Scherma's mastery bonus.
        if (WEAPONS.includes(item)) {
          await this.handleWeaponAcquisition(item);
          continue;
        }
        const confirmed = await UIHelpers.confirmAsync(`Vuoi prendere ${item}?`);
        if (confirmed) {
          if (gameState.addToZaino(item)) {
            UIHelpers.showToast(`✅ Preso: ${item}`, 'success');
          } else {
            UIHelpers.showToast(`🎒 Zaino Pieno! Impossibile prendere: ${item}`, 'error');
          }
        }
      }
    }

    // Add weapon with confirmation/swap
    if (effects.canAddWeapon) {
      await this.handleWeaponAcquisition(effects.canAddWeapon);
    }

    // Add meals
    if (effects.canAddMeals) {
      const added = gameState.addPasti(effects.canAddMeals);
      if (added === effects.canAddMeals) {
        UIHelpers.showToast(`🍖 Hai trovato ${effects.canAddMeals} pasti!`, 'success');
      } else if (added > 0) {
        UIHelpers.showToast(`🍖 Hai preso ${added} pasti, ma lo zaino è pieno.`, 'warning');
      } else {
        UIHelpers.showToast(`🎒 Zaino Pieno! Impossibile prendere i pasti.`, 'error');
      }
    }

    // Choose exactly N of the listed options (e.g. "pick any 2 of these 6
    // items") - ask about each in turn, stop once N have been accepted.
    if (effects.chooseNItems) {
      const { count, options } = effects.chooseNItems;
      let accepted = 0;
      for (const opt of options) {
        if (accepted >= count) break;
        const confirmed = await UIHelpers.confirmAsync(`Vuoi prendere: ${opt.label}?`);
        if (!confirmed) continue;
        if (opt.type === 'weapon') {
          await this.handleWeaponAcquisition(opt.value);
        } else if (opt.type === 'meals') {
          const added = gameState.addPasti(opt.value);
          UIHelpers.showToast(added === opt.value ? `🍖 Hai preso ${opt.value} pasti!` : `🎒 Zaino Pieno! Impossibile prendere i pasti.`, added === opt.value ? 'success' : 'error');
        } else if (gameState.addToZaino(opt.value)) {
          UIHelpers.showToast(`✅ Preso: ${opt.value}`, 'success');
        } else {
          UIHelpers.showToast(`🎒 Zaino Pieno! Impossibile prendere: ${opt.value}`, 'error');
        }
        accepted++;
      }
    }

    // A shop selling any/all of several items, each at its own Gold Crown
    // price (unlike chooseNItems, which is free and capped at N picks) - see
    // Book 5 sections 27/211/388.
    if (effects.shopItems) {
      for (const opt of effects.shopItems) {
        const confirmed = await UIHelpers.confirmAsync(`Vuoi acquistare: ${opt.label}?`);
        if (!confirmed) continue;
        if (gameState.getState().character.corone < opt.cost) {
          UIHelpers.showToast(`💰 Non hai abbastanza Corone d'Oro per: ${opt.label}`, 'error');
          continue;
        }
        gameState.removeCorone(opt.cost);
        if (opt.type === 'weapon') {
          await this.handleWeaponAcquisition(opt.value);
        } else if (opt.type === 'meals') {
          const added = gameState.addPasti(opt.value);
          UIHelpers.showToast(added === opt.value ? `🍖 Hai comprato ${opt.value} pasti!` : `🎒 Zaino Pieno! Impossibile prendere i pasti.`, added === opt.value ? 'success' : 'error');
        } else if (gameState.addToZaino(opt.value)) {
          UIHelpers.showToast(`✅ Acquistato: ${opt.value}`, 'success');
        } else {
          UIHelpers.showToast(`🎒 Zaino Pieno! Impossibile prendere: ${opt.value}`, 'error');
        }
      }
    }

    // Add gold
    if (effects.addGold) {
      gameState.addCorone(effects.addGold);
      UIHelpers.showToast(`💰 Trovate ${effects.addGold} Corone d'oro`, 'success');
    }

    // Remove gold
    if (effects.removeGold) {
      gameState.removeCorone(effects.removeGold);
      UIHelpers.showToast(`💰 Spese ${effects.removeGold} Corone d'oro`, 'warning');
    }

    // Gold gain equal to a Destiny Table roll (see resolveModifiedRoll) - e.g.
    // "pick a number and add 5, that's how many Crowns you win"
    if (effects.addGoldFromRoll) {
      const roll = getRandomDestinyNumber();
      const { total, modifier } = this.resolveModifiedRoll(effects.addGoldFromRoll, roll, gameState.getState());
      gameState.addCorone(total);
      UIHelpers.showToast(`🎲 Tabella del Destino: ${roll}${modifier ? ` (${modifier > 0 ? '+' : ''}${modifier})` : ''} - guadagni ${total} Corone d'Oro`, 'success');
    }

    // Direct endurance loss (sometimes waived entirely by a Kai Discipline, e.g.
    // "lose 2 Endurance unless you have Mindshield", or by possessing/having
    // applied an item, e.g. "lose 2 Endurance unless you applied Baknar oil" -
    // see Book 3 sections 331/150).
    if (effects.loseEndurance) {
      const character = gameState.getState().character;
      const hasItem = (item) => character.zaino.includes(item) || character.armi.includes(item) || character.oggettiSpeciali.includes(item);
      const prevented = (effects.psicoschermoPreventsLoss && gameState.hasKaiArt('Psicoschermo')) ||
        (effects.waivedByKaiArt && gameState.hasKaiArt(effects.waivedByKaiArt)) ||
        (effects.waivedByItem && hasItem(effects.waivedByItem));
      if (!prevented) {
        gameState.takeDamage(effects.loseEndurance);
        UIHelpers.showToast(`💔 Persi ${effects.loseEndurance} punti Resistenza`, 'error');
        await this.checkDeath();
      }
    }

    // Endurance loss equal to a Destiny Table roll, adjusted by the same
    // requirements-based modifiers as calculateDestinyModifier (e.g. "pick a
    // number - if you have Hunting, subtract 2 - lose that much Resistenza").
    // zeroMeansTen matches the book's own "(0 = 10)" notation on some rolls.
    if (effects.loseEnduranceFromRoll) {
      const roll = getRandomDestinyNumber();
      const { total, modifier } = this.resolveModifiedRoll(effects.loseEnduranceFromRoll, roll, gameState.getState());
      gameState.takeDamage(total);
      UIHelpers.showToast(`🎲 Tabella del Destino: ${roll}${modifier ? ` (${modifier > 0 ? '+' : ''}${modifier})` : ''} - perdi ${total} punti Resistenza`, 'error');
      await this.checkDeath();
    }

    // Erase an item from the Action Chart (e.g. handing over a Special Item)
    if (effects.removeItem) {
      gameState.removeItem(effects.removeItem);
      UIHelpers.showToast(`📜 Rimosso dal Registro di Guerra: ${effects.removeItem}`, 'info');
    }

    // Must eat or lose endurance
    if (effects.mustEatOrLoseEndurance) {
      // Check for Caccia (Hunting) - doesn't work in Book 3, nor in Book 5 section 320
      const state = gameState.getState();
      const huntingWorks = state.bookNumber !== 3 && !(state.bookNumber === 5 && state.currentSection === 320);
      if (huntingWorks && gameState.hasKaiArt('Caccia')) {
        UIHelpers.showToast('🏹 Caccia: Hai procurato del cibo e non devi consumare un Pasto.', 'success');
        const state = gameState.getState();
        const currentSection = state.currentSection;
        const mealFlagKey = `meal_consumed_section_${currentSection}`;
        gameState.setFlag(mealFlagKey, true); // Mark as handled
        return; // Skip the rest
      }

      const currentSection = state.currentSection;
      const mealFlagKey = `meal_consumed_section_${currentSection}`;

      if (gameState.getFlag(mealFlagKey)) {
        UIHelpers.showToast('ℹ️ Hai già consumato il pasto per questa sezione.', 'info');
      } else {
        if (state.character.pasti > 0) {
          const confirmed = await UIHelpers.confirmAsync(`Devi mangiare un pasto o perderai ${effects.mustEatOrLoseEndurance} punti Resistenza. Vuoi mangiare?`);
          if (confirmed) {
            gameState.consumePasto();
            UIHelpers.showToast('🍖 Hai consumato un pasto', 'info');
            gameState.setFlag(mealFlagKey, true);
          } else {
            gameState.takeDamage(effects.mustEatOrLoseEndurance);
            UIHelpers.showToast(`💔 Hai perso ${effects.mustEatOrLoseEndurance} punti Resistenza`, 'error');
            await this.checkDeath();
            gameState.setFlag(mealFlagKey, true); // Mark as handled even if took damage
          }
        } else {
          await UIHelpers.showAlert(`Non hai pasti! Perdi ${effects.mustEatOrLoseEndurance} punti Resistenza.`, 'Denutrizione');
          gameState.takeDamage(effects.mustEatOrLoseEndurance);
          await this.checkDeath();
          gameState.setFlag(mealFlagKey, true);
        }
      }
    }

    // Heal
    if (effects.health) {
      gameState.heal(effects.health);
      UIHelpers.showToast(`💚 Recuperati ${effects.health} punti Resistenza`, 'success');
    }

    // Full or partial endurance restore (e.g. "riposo presso un guaritore")
    if (effects.restoreEndurance) {
      const state = gameState.getState();
      const amount = effects.restoreEndurance === 'full'
        ? state.character.resistenzaMax
        : effects.restoreEndurance;
      gameState.heal(amount);
      UIHelpers.showToast('💚 Resistenza completamente recuperata!', 'success');
    }

    // Restore ENDURANCE based on lifetime damage taken (not just the last
    // combat): full recovery with the given Kai Discipline, half of all
    // ENDURANCE ever lost without it - see Book 2 section 240.
    if (effects.restoreEnduranceFromTotalLost) {
      const state = gameState.getState();
      if (gameState.hasKaiArt(effects.restoreEnduranceFromTotalLost.kaiArt)) {
        gameState.heal(state.character.resistenzaMax);
        UIHelpers.showToast('💚 Resistenza completamente recuperata!', 'success');
      } else {
        const amount = Math.floor((state.character.totalEnduranceLost || 0) / 2);
        gameState.heal(amount);
        UIHelpers.showToast(`💚 Recuperati ${amount} punti Resistenza`, 'success');
      }
    }

    // Damage
    if (effects.damage) {
      gameState.takeDamage(effects.damage);
      UIHelpers.showToast(`💔 Subiti ${effects.damage} danni`, 'error');
      await this.checkDeath();
    }

    // Lose all weapons only (backpack, if any, is kept)
    if (effects.loseAllWeapons) {
      gameState.clearWeapons();
      UIHelpers.showToast('⚔️ Hai perso tutte le tue armi!', 'error');
    }

    // Lose a single random weapon (e.g. a weapon breaks)
    if (effects.loseRandomWeapon) {
      const weapons = gameState.getState().character.armi;
      if (weapons.length > 0) {
        const lostWeapon = weapons[Math.floor(Math.random() * weapons.length)];
        gameState.removeWeapon(lostWeapon);
        UIHelpers.showToast(`⚔️ La tua arma si è spezzata: ${lostWeapon}`, 'error');
      }
    }

    // Lose the Backpack and everything in it - Weapons are untouched (they're
    // a separate Action Chart section); combine with loseAllWeapons for
    // sections that narrate losing both - see Book 3 section 49 / Book 4
    // sections 94/158/342 (Backpack only) vs Book 1 sections 258/294 (both).
    if (effects.loseAllItems) {
      gameState.clearZaino();
      UIHelpers.showToast('🎒 Hai perso lo Zaino e tutto il suo contenuto!', 'error');
    }

    // Lose a single random Backpack item (e.g. pickpocketed); falls back to a
    // random weapon if the Backpack is empty - see Book 1 section 144.
    if (effects.loseRandomItem) {
      const { zaino, armi } = gameState.getState().character;
      if (zaino.length > 0) {
        const lostItem = zaino[Math.floor(Math.random() * zaino.length)];
        gameState.removeFromZaino(lostItem);
        UIHelpers.showToast(`🎒 Ti hanno rubato: ${lostItem}`, 'error');
      } else if (armi.length > 0) {
        const lostWeapon = armi[Math.floor(Math.random() * armi.length)];
        gameState.removeWeapon(lostWeapon);
        UIHelpers.showToast(`⚔️ Ti hanno rubato l'arma: ${lostWeapon}`, 'error');
      }
    }

    // Permanent Combat Skill reduction ("your initial COMBAT SKILL is reduced
    // by 1 point for the rest of your life") - rare, see Book 1 section 236.
    if (effects.loseCombattivita) {
      const state = gameState.getState();
      gameState.updateStats({ combattivita: state.character.combattivita - effects.loseCombattivita });
      UIHelpers.showToast(`⚔️ Combattività ridotta permanentemente di ${effects.loseCombattivita}`, 'error');
    }

    // Persistent narrative injury (Limbdeath numbing an arm): -3 Combattività
    // until cured, at which point clearArmInjured restores it - see Book 5
    // sections 166 (set) and 2 (cure).
    if (effects.setArmInjured) {
      gameState.setFlag('armInjured', true);
      const state = gameState.getState();
      gameState.updateStats({ combattivita: state.character.combattivita - 3 });
      UIHelpers.showToast('🩹 Il tuo braccio è ora inutilizzabile: -3 Combattività', 'error');
    }
    if (effects.clearArmInjured) {
      gameState.setFlag('armInjured', false);
      const state = gameState.getState();
      gameState.updateStats({ combattivita: state.character.combattivita + 3 });
      UIHelpers.showToast('💚 Hai riacquistato l\'uso del braccio: +3 Combattività', 'success');
    }

    // Restore half the ENDURANCE lost in the combat that just ended (rounded
    // down) - a "got off lightly" outcome (quick win, evasion, spared rather
    // than killed), see Book 5 sections 20/135/161.
    if (effects.restoreHalfDamageTaken) {
      const state = gameState.getState();
      if (state.lastCombatSummary) {
        gameState.heal(Math.floor(state.lastCombatSummary.damageTaken / 2));
      }
    }
  }


  renderCombat(combat) {
    const state = gameState.getState();
    const log = combatManager.getLog();

    return `
      <div class="combat-container">
        <div class="combat-header">
          <h3>⚔️ COMBATTIMENTO</h3>
          <p>Contro: <strong>${combat.enemy}</strong></p>
        </div>

        <div class="combat-fighters">
          <div class="fighter-card">
            <div class="fighter-name">🐺 Lupo Solitario</div>
            <div class="health-bar">
              <div class="health-fill" style="width: ${(state.character.resistenza / state.character.resistenzaMax) * 100}%"></div>
              <div class="health-text">${state.character.resistenza}/${state.character.resistenzaMax}</div>
            </div>
            <p>⚔️ Combattività: ${state.character.combattivita}</p>
          </div>

          <div class="fighter-card">
            <div class="fighter-name">👹 ${combat.enemy}</div>
            <div class="health-bar">
              <div class="health-fill" style="width: ${(combat.currentEnemyResistenza / combat.resistenza) * 100}%"></div>
              <div class="health-text">${combat.currentEnemyResistenza}/${combat.resistenza}</div>
            </div>
            <p>⚔️ Combattività: ${combat.combattivita}</p>
          </div>
        </div>

        <div class="combat-log">
          ${log.map(entry => `
            <div class="combat-log-entry">${entry.message}</div>
          `).join('')}
        </div>

        <div style="display: flex; gap: 1rem;">
          <button class="btn btn-danger btn-large" id="fight-btn" style="flex: 1;">
            ⚔️ Combatti
          </button>
          ${combatManager.canFlee ? `
            <button class="btn btn-warning" id="flee-btn" ${!combatManager.canPlayerFlee() ? 'disabled' : ''}>
              🏃 Fuggi ${!combatManager.canPlayerFlee() ? '(Tra ' + (combatManager.combatData.fleeAfterRounds - (state.combatState ? state.combatState.rounds.length : 0)) + ' round)' : ''}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  executeCombatRound() {
    const result = combatManager.fightRound();

    // Force update
    this.update(document.getElementById('story-reader'), gameState.getState());

    if (result === 'next-enemy') {
      // One enemy down, another already engaged by combatManager - keep fighting
      return;
    }

    // Some fights end without either side dying, cutting the combat short
    // after a fixed number of rounds (see combatData.forceEndAfterRounds) -
    // e.g. reinforcements interrupt the fight before it's resolved.
    if (result === 'force-end') {
      setTimeout(() => {
        const forceEndSection = combatManager.combatData.forceEndSection;
        const state = gameState.getState();
        const currentSectionNum = state.currentSection;
        combatManager.endCombat('force-end');
        if (forceEndSection === currentSectionNum) {
          // The story branches on this single round's outcome via the
          // section's own choices (enemyLostMore/playerLostMore/combatTied)
          // rather than a separate destination - just stop fighting and show
          // them, instead of re-entering navigateToSection and restarting
          // the same combat forever. See Book 5 section 244.
          this.update(document.getElementById('story-reader'), gameState.getState());
        } else {
          const currentSection = this.bookData.sections[currentSectionNum];
          this.navigateToSection(forceEndSection, currentSection);
        }
      }, 1000);
      return;
    }

    if (result === 'victory') {
      setTimeout(() => {
        combatManager.endCombat('victory');
        UIHelpers.showAlert('🎉 Hai vinto il combattimento!', 'Vittoria!');

        // endCombat() already triggered a reactive re-render showing this
        // section's choices (correctly enabled/disabled per their requirements,
        // e.g. how many rounds the fight took). Only auto-advance when there's
        // truly a single way forward - "fuggi" choices only make sense mid-combat.
        const state = gameState.getState();
        const currentSection = this.bookData.sections[state.currentSection];
        const combatObj = (currentSection.combat && !Array.isArray(currentSection.combat)) ? currentSection.combat : null;
        const fleeSection = combatObj ? combatObj.fleeSection : undefined;
        const fleeSectionTargets = combatObj ? (combatObj.fleeSections || []).map(f => f.section) : [];
        const nonFleeChoices = currentSection.choices.filter(c => c.section !== fleeSection && !fleeSectionTargets.includes(c.section));

        if (nonFleeChoices.length === 1) {
          this.navigateToSection(nonFleeChoices[0].section, currentSection);
        }
      }, 1000);
    } else if (result === 'defeat') {
      setTimeout(async () => {
        // Some enemies spare the hero instead of killing him (e.g. knocked
        // unconscious rather than dead) - combatData.loseSection redirects
        // there instead of ending the game. See Book 5 sections 20/135.
        const loseSection = combatManager.combatData.loseSection;
        combatManager.endCombat('defeat');
        if (loseSection) {
          const currentSection = this.bookData.sections[gameState.getState().currentSection];
          this.navigateToSection(loseSection, currentSection);
        } else {
          await this.endGame('💀 Sei stato sconfitto... L\'avventura finisce qui.', 'Game Over');
        }
      }, 1000);
    }
  }

  // Ends the run immediately (death or an unrecoverable failure) without
  // navigating to any section - used both after a lost combat and for the rare
  // Destiny Test branch whose outcome is death with no "turn to" target at all.
  async endGame(message, title) {
    await UIHelpers.showAlert(message, title);
    await saveManager.deleteSave('autosave');
    gameState.resetGame();
    window.location.reload();
  }

  async fleeCombat() {
    if (!combatManager.canPlayerFlee()) {
      UIHelpers.showToast('Non puoi ancora fuggire!', 'warning');
      return;
    }

    // Read fleeSection from the currently engaged enemy (combatManager.combatData),
    // not from currentSection.combat directly - for a multi-enemy fight that's an
    // array, which has no .fleeSection of its own even when every enemy in it does.
    const fleeSection = combatManager.combatData && combatManager.combatData.fleeSection;
    // Some encounters let the hero pick a direction while fleeing (e.g.
    // "run north" vs "run south") instead of a single fixed destination -
    // see Book 3 section 108.
    const fleeSections = combatManager.combatData && combatManager.combatData.fleeSections;

    if (combatManager.flee()) {
      // Fleeing can still cost enough Resistenza to kill the hero
      const died = await this.checkDeath();
      if (died) return;

      const destination = fleeSections && fleeSections.length
        ? await UIHelpers.chooseAsync('Da che parte vuoi fuggire?', fleeSections.map(f => ({ label: f.label, value: f.section })))
        : fleeSection;

      if (destination) {
        const state = gameState.getState();
        const currentSection = this.bookData.sections[state.currentSection];
        this.navigateToSection(destination, currentSection);
      } else {
        // Fallback if no flee section defined
        this.update(document.getElementById('story-reader'), gameState.getState());
      }
    }
  }

  // --- Helper Methods for Rendering ---

  renderStandardChoices(choices, state) {
    let html = `<div class="choices">`;

    // Filter available choices (where character meets requirements)
    // and pick the choice leading to the shortest distance to victory
    let recommendedSection = null;
    if (state.easyMode && this.easyModeDistances) {
      let minDistance = Infinity;
      choices.forEach(choice => {
        const canChoose = this.checkRequirements(choice.requirements, state);
        if (canChoose && choice.section && this.easyModeDistances[choice.section] !== undefined) {
          const d = this.easyModeDistances[choice.section];
          if (d < minDistance) {
            minDistance = d;
            recommendedSection = choice.section;
          }
        }
      });
    }

    choices.forEach((choice, index) => {
      const canChoose = this.checkRequirements(choice.requirements, state);
      const isEasyChoice = state.easyMode && recommendedSection && choice.section === recommendedSection && canChoose;

      html += `
          <button class="btn btn-secondary btn-large choice-btn ${isEasyChoice ? 'easy-mode-choice' : ''}"
                  data-section="${choice.section}" data-index="${index}"
                  ${!canChoose ? 'disabled' : ''}>
            ${isEasyChoice ? '⭐ ' : ''}${choice.text}${isEasyChoice ? ' <span class="easy-mode-badge">💡 Easy</span>' : ''}
          </button>
        `;
    });
    html += `</div>`;
    return html;
  }

  isDestinyTest(choices) {
    const rangeChoices = choices.filter(c => this.parseDestinyRange(c.text) !== null);
    const nonRangeChoices = choices.filter(c => this.parseDestinyRange(c.text) === null);
    // A pure Destiny Table roll: 2+ choices describing a range ("Numero X-Y",
    // "Numero da X a Y", "Da X a Y", or a single "numero è N") and nothing else.
    if (nonRangeChoices.length === 0) return rangeChoices.length > 1;
    // A roll with bypass choice(s) mixed in (e.g. "if you possess the
    // Sommerswerd, turn to X" skips the roll entirely) - only treat it this
    // way when EVERY non-range choice is actually gated by `requirements`,
    // proving it's an intentional shortcut and not just an oddly-phrased
    // range the parser failed to recognize (which should fall back to
    // rendering as plain buttons, unchanged, rather than risk misreading it).
    return rangeChoices.length > 1 && nonRangeChoices.every(c => !!c.requirements);
  }

  // Extract the {min, max} roll range a choice text refers to, or null if it
  // doesn't describe one. Handles the several phrasings used across the book.
  parseDestinyRange(text) {
    let match = text.match(/(\d+)\s*-\s*(\d+)/);
    if (match) return { min: parseInt(match[1]), max: parseInt(match[2]) };

    // Min bound may be negative once a destinyModifier deduction is in play
    // (e.g. "da -3 a 3") - the max bound is never negative in practice.
    match = text.match(/\bda\s*(-?\d+)\s*a\s*(\d+)\b/i);
    if (match) return { min: parseInt(match[1]), max: parseInt(match[2]) };

    // Broadened from requiring "numero è N" - also catches the shortened
    // follow-up phrasing used when a range choice earlier in the same list
    // already established context (e.g. "Se è 0" right after "Se è da 6 a 9").
    // Note: JS regex \b treats accented letters like "è" as non-word chars,
    // so it can't anchor on "è" itself - anchor on the surrounding whitespace
    // instead (è/e is always its own separate word in this phrasing).
    match = text.match(/(?:^|\s)(?:è|e)\s+(-?\d+)\b/i);
    if (match) return { min: parseInt(match[1]), max: parseInt(match[1]) };

    // Bare "Numero N" with no è/e connector at all (e.g. "Numero 0" alongside
    // "Numero 1-4" / "Numero 5-9" in the same choice list).
    match = text.match(/\bnumero\s+(-?\d+)\b/i);
    if (match) return { min: parseInt(match[1]), max: parseInt(match[1]) };

    return null;
  }

  renderDestinyTest() {
    const state = gameState.getState();
    const recommendedSection = (state.easyMode && this.easyModeMap) ? this.easyModeMap[state.currentSection] : null;

    return `
      <div class="destiny-test-container" style="text-align: center; margin-top: 2rem;">
        <div class="card" style="background: rgba(139, 92, 246, 0.1); border-color: var(--color-primary);">
          <h3>🎲 Tabella del Destino</h3>
          <p>La tua sorte è nelle mani del destino...</p>
          ${recommendedSection ? `<div style="margin: 0.5rem 0; color: #22c55e; font-weight: 600; font-size: 0.95rem;">💡 Easy Mode: Il percorso vincente porta alla Sezione ${recommendedSection}</div>` : ''}
          
          <div class="destiny-display" style="margin: 2rem 0;">
            <div class="stat-value" style="font-size: 4rem;" id="destiny-roll-result">?</div>
          </div>

          <button class="btn btn-primary btn-large btn-block" id="destiny-roll-btn">
            Lancia il Destino
          </button>
          
          <div id="destiny-message" style="margin-top: 1rem; min-height: 1.5rem;"></div>
        </div>
      </div>
    `;
  }

  renderNumericPuzzle() {
    return `
      <div class="numeric-puzzle-container" style="text-align: center; margin-top: 2rem;">
        <div class="card" style="background: rgba(139, 92, 246, 0.1); border-color: var(--color-primary);">
          <h3>🔢 Enigma numerico</h3>
          <p>Se conosci il numero della sezione corretta, scrivilo qui sotto e conferma.</p>
          <input type="number" id="numeric-puzzle-input" class="stat-value" style="text-align: center; font-size: 2rem; width: 100%; margin: 1rem 0; background: transparent; border: 1px solid var(--color-primary); border-radius: 8px; padding: 0.5rem;" placeholder="?">
          <button class="btn btn-primary btn-large btn-block" id="numeric-puzzle-btn">
            Conferma
          </button>
        </div>
      </div>
    `;
  }

  renderDeathSection() {
    return `
      <div class="death-container" style="text-align: center; margin-top: 2rem;">
        <div class="card" style="border-color: var(--color-danger); background: rgba(220, 38, 38, 0.1);">
          <h3 style="color: var(--color-danger);">💀 GAME OVER</h3>
          <p>La tua avventura finisce qui.</p>
          <button class="btn btn-danger btn-large btn-block" id="restart-btn" style="margin-top: 1.5rem;">
            🔄 Ricomincia l'avventura
          </button>
        </div>
      </div>
    `;
  }

  renderFailureEndingSection() {
    return `
      <div class="death-container" style="text-align: center; margin-top: 2rem;">
        <div class="card" style="border-color: var(--color-warning); background: rgba(217, 119, 6, 0.1);">
          <h3 style="color: var(--color-warning);">⚠️ MISSIONE FALLITA</h3>
          <p>Sei sopravvissuto, ma non sei riuscito a completare la tua missione.</p>
          <button class="btn btn-danger btn-large btn-block" id="restart-btn" style="margin-top: 1.5rem;">
            🔄 Ricomincia l'avventura
          </button>
        </div>
      </div>
    `;
  }

  renderVictorySection(bookNumber, canContinueToNextBook) {
    const nextBookLabels = {
      1: '🌊 Continua nel Libro 2: Fuoco sulle Acque',
      2: '❄️ Continua nel Libro 3: Le Caverne di Kalte',
      3: '⛰️ Continua nel Libro 4: Il Baratro della Perdizione',
      4: '☀️ Continua nel Libro 5: Ombra sulla Sabbia'
    };
    return `
      <div class="death-container" style="text-align: center; margin-top: 2rem;">
        <div class="card" style="border-color: var(--color-success); background: rgba(16, 185, 129, 0.1);">
          <h3 style="color: var(--color-success);">🏆 VITTORIA!</h3>
          <p>Hai completato con successo la tua avventura!</p>
          ${canContinueToNextBook ? `
            <button class="btn btn-primary btn-large btn-block" id="continue-next-book-btn" style="margin-top: 1.5rem;">
              ${nextBookLabels[bookNumber]}
            </button>
          ` : ''}
          <button class="btn btn-success btn-large btn-block" id="restart-btn" style="margin-top: 1rem;">
            🔄 Ricomincia l'avventura
          </button>
        </div>
      </div>
    `;
  }

  async handleDestinyRoll(container, section) {
    const btn = container.querySelector('#destiny-roll-btn');
    if (btn) btn.disabled = true;

    const display = container.querySelector('#destiny-roll-result');
    const message = container.querySelector('#destiny-message');

    // Animation
    let count = 0;
    const interval = setInterval(() => {
      display.textContent = Math.floor(Math.random() * 10);
      count++;
      if (count > 10) {
        clearInterval(interval);

        // Final roll, adjusted by any applicable Kai Discipline/rank/Endurance
        // modifier this section declares (see calculateDestinyModifier)
        const roll = getRandomDestinyNumber();
        const modifier = this.calculateDestinyModifier(section, gameState.getState());
        const total = roll + modifier;
        display.textContent = roll;

        // Find matching choice
        const matchedChoice = section.choices.find(choice => {
          const range = this.parseDestinyRange(choice.text);
          return range && total >= range.min && total <= range.max;
        });

        if (matchedChoice) {
          const totalLabel = modifier !== 0
            ? `Risultato: ${roll} ${modifier > 0 ? '+' : ''}${modifier} = ${total}`
            : `Risultato: ${roll}`;
          message.innerHTML = `<span style="color: var(--color-success); font-weight: bold;">${totalLabel}</span>. ${matchedChoice.text}`;

          setTimeout(() => {
            // Rare case: the roll's outcome is death narrated inline, with no
            // other section to "turn to" (e.g. Book 3 section 94, drowning).
            if (matchedChoice.section === null && matchedChoice.isDeathSection) {
              this.endGame('💀 ' + matchedChoice.text, 'Game Over');
            } else {
              this.navigateToSection(matchedChoice.section, section, matchedChoice);
            }
          }, 2000);
        } else {
          message.textContent = "Errore: Nessuna corrispondenza trovata.";
          if (btn) btn.disabled = false;
        }
      }
    }, 100);
  }
  // Physical-book puzzle (combination lock, map-derived code): the player
  // works out a section number from clues elsewhere in the book and jumps
  // straight to it. Any other guess (including a blank/invalid one) falls
  // through to the book's single fixed "wrong guess" section.
  handleNumericPuzzle(container, section) {
    const input = container.querySelector('#numeric-puzzle-input');
    const guess = parseInt(input.value, 10);
    const { correctSection, wrongSection } = section.numericPuzzle;
    const target = guess === correctSection ? correctSection : wrongSection;
    this.navigateToSection(target, section);
  }

  // Rarer Destiny Table variant: draw two numbers in sequence and compare
  // them to each other, rather than matching one modified roll against fixed
  // ranges (see handleDestinyRoll). Only the first roll takes the section's
  // destinyModifier - the book always narrates the second as a plain redraw.
  // Choices are matched by an explicit `outcome` field ('secondLess' |
  // 'secondMore' | 'equal') rather than text-parsed, since the range-based
  // phrasings in parseDestinyRange don't describe a comparison between two
  // rolls.
  async handleDoubleDestinyRoll(container, section) {
    const btn = container.querySelector('#destiny-roll-btn');
    if (btn) btn.disabled = true;

    const display = container.querySelector('#destiny-roll-result');
    const message = container.querySelector('#destiny-message');

    let count = 0;
    const interval = setInterval(() => {
      display.textContent = Math.floor(Math.random() * 10);
      count++;
      if (count > 10) {
        clearInterval(interval);

        const first = getRandomDestinyNumber();
        const modifier = this.calculateDestinyModifier(section, gameState.getState());
        const firstTotal = first + modifier;
        const second = getRandomDestinyNumber();
        display.textContent = `${firstTotal} / ${second}`;

        const outcome = second < firstTotal ? 'secondLess' : (second > firstTotal ? 'secondMore' : 'equal');
        const matchedChoice = section.choices.find(choice => choice.outcome === outcome);

        if (matchedChoice) {
          const firstLabel = modifier !== 0
            ? `${first} ${modifier > 0 ? '+' : ''}${modifier} = ${firstTotal}`
            : `${firstTotal}`;
          message.innerHTML = `<span style="color: var(--color-success); font-weight: bold;">Primo numero: ${firstLabel} — Secondo numero: ${second}</span>. ${matchedChoice.text}`;

          setTimeout(() => {
            this.navigateToSection(matchedChoice.section, section, matchedChoice);
          }, 2000);
        } else {
          message.textContent = "Errore: Nessuna corrispondenza trovata.";
          if (btn) btn.disabled = false;
        }
      }
    }, 100);
  }

  async checkDeath() {
    const state = gameState.getState();
    if (state.character.resistenza <= 0) {
      await this.endGame('💀 Sei morto per le ferite riportate... L\'avventura finisce qui.', 'Game Over');
      return true;
    }
    return false;
  }
  async handleWeaponAcquisition(newWeapon) {
    const state = gameState.getState();
    const currentWeapons = state.character.armi;

    if (currentWeapons.length < 2) {
      // Logic for standard acquisition (less than 2 weapons)
      const confirmed = await UIHelpers.confirmAsync(`Vuoi prendere l'arma: ${newWeapon}?`);
      if (confirmed) {
        gameState.addWeapon(newWeapon);
        UIHelpers.showToast(`⚔️ Presa arma: ${newWeapon}`, 'success');
      }
    } else {
      // Logic for swap (already has 2 weapons)
      return new Promise((resolve) => {
        const content = `
          <p class="modal-text">Hai già 2 armi (${currentWeapons.join(', ')}). Devi scartarne una per prendere <strong>${newWeapon}</strong>.</p>
          <div class="modal-actions" style="flex-direction: column; gap: 1rem;">
            <button class="btn btn-warning btn-large" data-action="swap1">
              Scarta ${currentWeapons[0]} e prendi ${newWeapon}
            </button>
            <button class="btn btn-warning btn-large" data-action="swap2">
              Scarta ${currentWeapons[1]} e prendi ${newWeapon}
            </button>
            <button class="btn btn-outline btn-large" data-action="cancel">
              Non prendere ${newWeapon}
            </button>
          </div>
        `;

        UIHelpers.showModal(content, {
          title: 'Zaino Armi Pieno',
          buttons: {
            '[data-action="swap1"]': (e, modal) => {
              gameState.removeWeapon(currentWeapons[0]);
              gameState.addWeapon(newWeapon);
              UIHelpers.showToast(`⚔️ Scambiata ${currentWeapons[0]} con ${newWeapon}`, 'success');
              modal.remove();
              resolve();
            },
            '[data-action="swap2"]': (e, modal) => {
              gameState.removeWeapon(currentWeapons[1]);
              gameState.addWeapon(newWeapon);
              UIHelpers.showToast(`⚔️ Scambiata ${currentWeapons[1]} con ${newWeapon}`, 'success');
              modal.remove();
              resolve();
            },
            '[data-action="cancel"]': (e, modal) => {
              modal.remove();
              resolve();
            }
          }
        });
      });
    }
  }
}
