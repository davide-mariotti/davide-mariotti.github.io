import { gameState } from '../game-state.js';
import { combatManager } from './combat-manager.js';
import { UIHelpers } from '../utils/ui-helpers.js';
import { saveManager } from '../save-manager.js';
import { getRandomDestinyNumber } from './destiny-table.js';

export class StoryReader {
  constructor(bookData) {
    this.bookData = bookData;
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

    // Show choices, Destiny Test, or Death Message
    if (!inCombat) {
      if (section.isDeathSection) {
        html += this.renderDeathSection();
      } else if (section.choices && section.choices.length > 0) {
        if (this.isDestinyTest(section.choices)) {
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
        this.navigateToSection(nextSection, section);
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

  async navigateToSection(sectionNumber, currentSection) {
    // Handle section effects (items, stat changes, etc.)
    if (currentSection.effects) {
      try {
        await this.applyEffects(currentSection.effects);
      } catch (error) {
        console.error('Error applying effects:', error);
        UIHelpers.showToast('⚠️ Errore nell\'applicare gli effetti', 'warning');
      }
    }

    // Check for combat
    const nextSection = this.bookData.sections[sectionNumber];
    if (nextSection && nextSection.combat) {
      // Start combat
      combatManager.startCombat(nextSection.combat);
    }

    gameState.goToSection(sectionNumber);
  }

  checkRequirements(requirements, state) {
    if (!requirements) return true;

    // Check various requirements
    if (requirements.kaiArt) {
      return state.character.artiRamas.includes(requirements.kaiArt);
    }
    if (requirements.item) {
      return state.character.zaino.includes(requirements.item) ||
        state.character.oggettiSpeciali.includes(requirements.item);
    }
    if (requirements.minGold) {
      return state.character.corone >= requirements.minGold;
    }

    return true;
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

    // Direct endurance loss
    if (effects.loseEndurance) {
      gameState.takeDamage(effects.loseEndurance);
      UIHelpers.showToast(`💔 Persi ${effects.loseEndurance} punti Resistenza`, 'error');
      await this.checkDeath();
    }

    // Must eat or lose endurance
    if (effects.mustEatOrLoseEndurance) {
      // Check for Caccia (Hunting)
      // TODO: Check if current section is in a "Wasteland" where Hunting doesn't work.
      // For now, assuming it works everywhere.
      if (gameState.hasKaiArt('Caccia')) {
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

    // Damage
    if (effects.damage) {
      gameState.takeDamage(effects.damage);
      UIHelpers.showToast(`💔 Subiti ${effects.damage} danni`, 'error');
      await this.checkDeath();
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

    if (result === 'victory') {
      setTimeout(() => {
        combatManager.endCombat('victory');
        UIHelpers.showAlert('🎉 Hai vinto il combattimento!', 'Vittoria!');

        // Auto-navigate to victory section if possible
        const state = gameState.getState();
        const currentSection = this.bookData.sections[state.currentSection];
        const fleeSection = currentSection.combat ? currentSection.combat.fleeSection : -1;

        // Find choices that are NOT the flee section
        const victoryChoices = currentSection.choices.filter(c => c.section !== fleeSection);

        if (victoryChoices.length === 1) {
          this.navigateToSection(victoryChoices[0].section, currentSection);
        } else if (victoryChoices.length > 0) {
          // If multiple victory paths, just refresh to show them (but filtering logic currently in render might show flee too)
          // Best to render choices here or rely on standard render but we can't hide flee easily without logic update
          // For now, auto-nav if 1 choice is safest
          this.navigateToSection(victoryChoices[0].section, currentSection);
        }
      }, 1000);
    } else if (result === 'defeat') {
      setTimeout(async () => {
        combatManager.endCombat('defeat');
        await UIHelpers.showAlert('💀 Sei stato sconfitto... L\'avventura finisce qui.', 'Game Over');

        // Reset game and reload
        await saveManager.deleteSave('autosave');
        gameState.resetGame();
        window.location.reload();
      }, 1000);
    }
  }

  fleeCombat() {
    if (!combatManager.canPlayerFlee()) {
      UIHelpers.showToast('Non puoi ancora fuggire!', 'warning');
      return;
    }

    if (combatManager.flee()) {
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
    choices.forEach(choice => {
      const canChoose = this.checkRequirements(choice.requirements, state);
      html += `
          <button class="btn btn-secondary btn-large choice-btn" 
                  data-section="${choice.section}"
                  ${!canChoose ? 'disabled' : ''}>
            ${choice.text}
          </button>
        `;
    });
    html += `</div>`;
    return html;
  }

  isDestinyTest(choices) {
    // Detect if ALL choices look like "Numero X-Y:" or similar pattern
    const rangeRegex = /(?:Numero|Se esce|Esca)\s*(\d)-(\d)/i;
    // Also support single number checks if needed, but usually ranges
    return choices.length > 1 && choices.every(c => rangeRegex.test(c.text));
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

        // Final roll
        const roll = getRandomDestinyNumber();
        display.textContent = roll;

        // Find matching choice
        const rangeRegex = /(?:Numero|Se esce|Esca)\s*(\d)-(\d)/i;
        const matchedChoice = section.choices.find(choice => {
          const match = choice.text.match(rangeRegex);
          if (match) {
            const min = parseInt(match[1]);
            const max = parseInt(match[2]);
            return roll >= min && roll <= max;
          }
          return false;
        });

        if (matchedChoice) {
          message.innerHTML = `<span style="color: var(--color-success); font-weight: bold;">Risultato: ${roll}</span>. ${matchedChoice.text}`;

          setTimeout(() => {
            this.navigateToSection(matchedChoice.section, section);
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
      await UIHelpers.showAlert('💀 Sei morto per le ferite riportate... L\'avventura finisce qui.', 'Game Over');
      await saveManager.deleteSave('autosave');
      gameState.resetGame();
      window.location.reload();
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
