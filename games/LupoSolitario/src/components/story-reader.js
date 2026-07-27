import { gameState } from '../game-state.js';
import { combatManager } from './combat-manager.js';
import { UIHelpers } from '../utils/ui-helpers.js';
import { saveManager } from '../save-manager.js';
import { getRandomDestinyNumber } from './destiny-table.js';

export class StoryReader {
  constructor(bookData, onContinueNextBook = null) {
    this.bookData = bookData;
    this.onContinueNextBook = onContinueNextBook;
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
        html += this.renderVictorySection(state.bookNumber, this.onContinueNextBook && state.bookNumber < 4);
      } else if (section.choices && section.choices.length > 0) {
        if (this.isDestinyTest(section.choices)) {
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
      destinyBtn.addEventListener('click', () => this.handleDestinyRoll(container, section));
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
    if (nextSection && nextSection.combat) {
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
    // "lose 2 Endurance unless you have Mindshield")
    if (effects.loseEndurance) {
      const prevented = effects.psicoschermoPreventsLoss && gameState.hasKaiArt('Psicoschermo');
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
      // Check for Caccia (Hunting) - doesn't work in Book 3 (Kalte is an icy
      // wasteland, per the book's own equipment rules), but works everywhere else.
      const huntingWorks = gameState.getState().bookNumber !== 3;
      if (huntingWorks && gameState.hasKaiArt('Caccia')) {
        UIHelpers.showToast('🏹 Caccia: Hai procurato del cibo e non devi consumare un Pasto.', 'success');
        const state = gameState.getState();
        const currentSection = state.currentSection;
        const mealFlagKey = `meal_consumed_section_${currentSection}`;
        gameState.setFlag(mealFlagKey, true); // Mark as handled
        return; // Skip the rest
      }

      const state = gameState.getState();
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

    // Automatic items (e.g. from Loot)
    if (effects.loseAllItems) {
      gameState.clearEquipment();
      UIHelpers.showToast('🎒 Hai perso tutto il tuo equipaggiamento!', 'error');
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
        const fleeSection = (currentSection.combat && !Array.isArray(currentSection.combat))
          ? currentSection.combat.fleeSection
          : undefined;
        const nonFleeChoices = currentSection.choices.filter(c => c.section !== fleeSection);

        if (nonFleeChoices.length === 1) {
          this.navigateToSection(nonFleeChoices[0].section, currentSection);
        }
      }, 1000);
    } else if (result === 'defeat') {
      setTimeout(async () => {
        combatManager.endCombat('defeat');
        await this.endGame('💀 Sei stato sconfitto... L\'avventura finisce qui.', 'Game Over');
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

    if (combatManager.flee()) {
      // Fleeing can still cost enough Resistenza to kill the hero
      const died = await this.checkDeath();
      if (died) return;

      const state = gameState.getState();
      const currentSection = this.bookData.sections[state.currentSection];

      if (currentSection.combat && currentSection.combat.fleeSection) {
        this.navigateToSection(currentSection.combat.fleeSection, currentSection);
      } else {
        // Fallback if no flee section defined
        this.update(document.getElementById('story-reader'), gameState.getState());
      }
    }
  }

  // --- Helper Methods for Rendering ---

  renderStandardChoices(choices, state) {
    let html = `<div class="choices">`;
    choices.forEach((choice, index) => {
      const canChoose = this.checkRequirements(choice.requirements, state);
      html += `
          <button class="btn btn-secondary btn-large choice-btn"
                  data-section="${choice.section}" data-index="${index}"
                  ${!canChoose ? 'disabled' : ''}>
            ${choice.text}
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
    return `
      <div class="destiny-test-container" style="text-align: center; margin-top: 2rem;">
        <div class="card" style="background: rgba(139, 92, 246, 0.1); border-color: var(--color-primary);">
          <h3>🎲 Tabella del Destino</h3>
          <p>La tua sorte è nelle mani del destino...</p>
          
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
      3: '⛰️ Continua nel Libro 4: Il Baratro della Perdizione'
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
