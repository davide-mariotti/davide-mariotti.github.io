// Book 3 -> Book 4 Transition - carries the character forward into The Chasm of
// Doom, following that book's "Game Rules" / "Equipment" pages: re-roll Gold
// Crowns (+10), choose 1 extra Kai Discipline, choose UP TO SIX equipment items
// (not just two, like Books 2/3 - Book 4's equipment table explicitly allows
// picking as many as six), and automatically receive the Map of the Southlands
// and a Badge of Rank.
import { getRandomDestinyNumber } from './destiny-table.js';
import { gameState } from '../game-state.js';
import { UIHelpers } from '../utils/ui-helpers.js';
import { KAI_ARTS, WEAPONS, weaponIconHTML, itemIconHTML } from './character-creator.js';

const MAX_EQUIPMENT_PICKS = 6;

const BOOK4_EQUIPMENT = [
  { type: 'weapon', name: 'Martello' },
  { type: 'weapon', name: 'Daga' },
  { type: 'potion', name: 'Pozione di Laumspur', count: 2 },
  { type: 'weapon', name: 'Spada' },
  { type: 'weapon', name: 'Lancia' },
  { type: 'meal', count: 5 },
  { type: 'weapon', name: 'Mazza' },
  { type: 'special', name: 'Cotta di Maglia', bonus: { resistenza: 4 } },
  { type: 'special', name: 'Scudo', bonus: { combattivita: 2 } }
];

export class Book4Transition {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.currentStep = 'intro';
    this.weaponMastery = null;
    this.selectedArt = null;
    this.chosenEquipment = [];
  }

  render() {
    const container = document.createElement('div');
    container.className = 'book4-transition';
    container.innerHTML = this.getStepHTML();
    this.attachEventListeners(container);
    return container;
  }

  updateView(container) {
    container.innerHTML = this.getStepHTML();
    this.attachEventListeners(container);
  }

  getStepHTML() {
    switch (this.currentStep) {
      case 'intro': return this.getIntroHTML();
      case 'gold': return this.getGoldHTML();
      case 'kai-art': return this.getKaiArtHTML();
      case 'equipment': return this.getEquipmentHTML();
      case 'summary': return this.getSummaryHTML();
      default: return '';
    }
  }

  getIntroHTML() {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">⛰️ Il Baratro della Perdizione</h2>
        </div>
        <div>
          <h3 style="text-align: center;">La Storia Finora...</h3>
          <div class="section-text">
            <p>Ruanon è una remota provincia mineraria a sud della tua terra natale, Sommerlund. Incastonata tra le cupe vette delle montagne di Durncrag e Maaken, la popolazione di questa provincia ha da tempo prosperato grazie al lavoro nelle sue ricche miniere, vivendo e godendo della propria ricchezza sotto la protezione del loro signore: il Barone Vanalund.</p>
            <p>L'oro e le gemme estratte a Ruanon costituiscono un'importante fonte di reddito per la tua patria. Il convoglio di carri, scortato da una robusta guardia armata, che lascia la provincia per raggiungere la capitale è diventato una routine mensile regolare; una routine mai interrotta fino a un mese fa, quando improvvisamente ogni contatto con Ruanon è cessato. Una truppa di cento cavalieri della Guardia Reale fu immediatamente inviata per scoprire che fine avesse fatto il convoglio scomparso. Il loro comandante, il Capitano D'Val, ricevette l'ordine di fare rapporto al Re non appena stabilito un contatto, ma né lui né i suoi uomini hanno fatto ritorno: anche loro sono scomparsi senza lasciare traccia.</p>
            <p>Il Re ha convocato te, Lupo Solitario, ultimo dei cavalieri Ramas, alla sua cittadella di Holmgard. La tua missione è ritrovare il Capitano D'Val e i suoi uomini, scoprire cosa sia accaduto al convoglio scomparso, e svelare il velo di mistero che ora avvolge Ruanon. Il Re ha radunato una compagnia di Ranger di Frontiera, un'unità di esploratori scelti, tutti abili cavalieri ed esperti di sopravvivenza. Ha ordinato a questi cinquanta uomini di accompagnarti, nella speranza che, sotto la tua guida, possano riuscire dove la forza più numerosa e visibile ha fallito.</p>
            <p>Mentre tu e i tuoi uomini entrate nell'Armeria Reale per equipaggiarvi in vista della lunga cavalcata che vi attende, scorgi un corvo nero appollaiato su un davanzale in alto sopra di voi. Vola via, ma non prima che un brivido ti percorra la schiena: a Holmgard, il corvo è un uccello di cattivo presagio.</p>
          </div>
          <p class="text-muted" style="text-align: center; margin-top: 1.5rem;">Il tuo Registro di Guerra - Combattività, Resistenza, Arti Ramas, Armi e Oggetti Speciali - resta invariato. Prima di partire, però, aggiornerai l'equipaggiamento per il nuovo viaggio: questa volta potrai scegliere fino a sei nuovi oggetti, non solo due.</p>
          <button class="btn btn-primary btn-large btn-block" id="continue-gold" style="margin-top: 1.5rem;">
            Continua →
          </button>
        </div>
      </div>
    `;
  }

  getGoldHTML() {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">💰 Corone d'Oro</h2>
        </div>
        <div style="text-align: center;">
          <p class="text-muted">Lancia il Destino e aggiungi 10 Corone d'Oro al tuo Registro di Guerra.</p>
          <div class="destiny-display" style="margin: 2rem 0;">
            <div class="stat-value" style="font-size: 3rem;" id="gold-roll">?</div>
          </div>
          <button class="btn btn-primary btn-large btn-block" id="roll-gold" ${this.goldRolled ? 'disabled' : ''}>
            ${this.goldRolled ? 'Corone Assegnate' : '🎲 Lancia per le Corone'}
          </button>
          <div id="gold-result" style="margin-top: 1.5rem;"></div>
          <div id="gold-complete" style="display: ${this.goldRolled ? 'block' : 'none'}; margin-top: 2rem;">
            <button class="btn btn-success btn-large btn-block" id="continue-kaiart">
              Continua →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getKaiArtHTML() {
    const state = gameState.getState();
    const owned = state.character.artiRamas;
    const available = KAI_ARTS.filter(art => !owned.includes(art.name));

    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">🧙 Nuova Arte Ramas</h2>
          <p class="text-muted">Scegli 1 nuova Arte Ramas da aggiungere alle tue conoscenze</p>
        </div>
        <div class="kai-arts-grid">
          ${available.map(art => `
            <div class="kai-art-card ${this.selectedArt === art.name ? 'selected' : ''}"
                 data-art="${art.name}">
              <img class="kai-art-emoji" src="${art.image}" alt="${art.name}">
              <div class="kai-art-name">${art.name}</div>
              <div class="kai-art-desc">${art.description}</div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 2rem;">
          <button class="btn btn-success btn-large btn-block" id="continue-equipment"
                  ${!this.selectedArt ? 'disabled' : ''}>
            Continua →
          </button>
        </div>
      </div>
      <style>
        .kai-arts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .kai-art-card {
          background: rgba(139, 92, 246, 0.1);
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .kai-art-card:hover {
          background: rgba(139, 92, 246, 0.2);
          transform: translateY(-4px);
        }
        .kai-art-card.selected {
          background: rgba(139, 92, 246, 0.3);
          border-color: var(--color-primary);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        }
        .kai-art-emoji { display: block; width: 110px; height: 110px; object-fit: contain; margin: 0 auto 0.75rem; border-radius: 12px; }
        .kai-art-name { font-weight: 700; margin-bottom: 0.5rem; }
        .kai-art-desc { font-size: 0.875rem; color: var(--text-muted); }
      </style>
    `;
  }

  getEquipmentHTML() {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">🎒 Nuovo Equipaggiamento</h2>
          <p class="text-muted">Scegli fino a 6 oggetti (${this.chosenEquipment.length}/${MAX_EQUIPMENT_PICKS})</p>
        </div>
        <div class="equipment-grid">
          ${BOOK4_EQUIPMENT.map((item, idx) => `
            <div class="kai-art-card ${this.chosenEquipment.includes(idx) ? 'selected' : ''}" data-idx="${idx}">
              <div class="kai-art-name">${this.equipmentLabel(item)}</div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 2rem;">
          <button class="btn btn-success btn-large btn-block" id="continue-summary"
                  ${this.chosenEquipment.length === 0 ? 'disabled' : ''}>
            Continua →
          </button>
        </div>
      </div>
      <style>
        .equipment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
      </style>
    `;
  }

  equipmentLabel(item) {
    if (item.type === 'meal') return `🍖 Pasti (x${item.count})`;
    if (item.type === 'potion') return `${itemIconHTML(item.name) || '🧪'} ${item.name}${item.count ? ` (x${item.count})` : ''}`;
    if (item.type === 'special') {
      const bonusKey = Object.keys(item.bonus)[0];
      const bonusLabel = bonusKey === 'resistenza' ? 'Resistenza' : 'Combattività';
      return `${itemIconHTML(item.name) || '✨'} ${item.name} (+${item.bonus[bonusKey]} ${bonusLabel})`;
    }
    return `${weaponIconHTML(item.name)} ${item.name}`;
  }

  getSummaryHTML() {
    const state = gameState.getState();
    const c = state.character;
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">📋 Pronto per Il Baratro della Perdizione</h2>
        </div>
        <div>
          <div class="stat-row"><span class="stat-label">⚔️ Combattività</span><span class="stat-value">${c.combattivita}</span></div>
          <div class="stat-row"><span class="stat-label">❤️ Resistenza</span><span class="stat-value">${c.resistenza}/${c.resistenzaMax}</span></div>
          <div class="stat-row"><span class="stat-label">💰 Corone d'Oro</span><span class="stat-value">${c.corone}</span></div>
          <div class="stat-row"><span class="stat-label">🍖 Pasti</span><span class="stat-value">${c.pasti}</span></div>

          <h4 style="margin-top: 2rem;">🧙 Arti Ramas</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
            ${c.artiRamas.map(art => {
      const artData = KAI_ARTS.find(a => a.name === art);
      return `<span class="inventory-item">${artData ? `<img class="weapon-icon-small" src="${artData.image}" alt="${art}">` : ''} ${art}</span>`;
    }).join('')}
          </div>

          <h4 style="margin-top: 2rem;">⚔️ Armi</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
            ${c.armi.map(w => `<span class="inventory-item">${weaponIconHTML(w)} ${w}</span>`).join('')}
          </div>

          <h4 style="margin-top: 2rem;">✨ Oggetti Speciali</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
            ${c.oggettiSpeciali.map(item => `<span class="inventory-item">${itemIconHTML(item) || '✨'} ${item}</span>`).join('')}
          </div>

          <button class="btn btn-success btn-large btn-block" id="begin-book4" style="margin-top: 2rem;">
            🚀 Inizia il Libro 4
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners(container) {
    const continueGold = container.querySelector('#continue-gold');
    if (continueGold) {
      continueGold.addEventListener('click', () => {
        this.currentStep = 'gold';
        this.updateView(container);
      });
    }

    const rollGold = container.querySelector('#roll-gold');
    if (rollGold) {
      rollGold.addEventListener('click', () => this.rollGold(container));
    }

    const continueKaiArt = container.querySelector('#continue-kaiart');
    if (continueKaiArt) {
      continueKaiArt.addEventListener('click', () => {
        this.currentStep = 'kai-art';
        this.updateView(container);
      });
    }

    const artCards = container.querySelectorAll('.kai-art-card[data-art]');
    artCards.forEach(card => {
      card.addEventListener('click', () => this.selectKaiArt(card, container));
    });

    const continueEquipment = container.querySelector('#continue-equipment');
    if (continueEquipment) {
      continueEquipment.addEventListener('click', async () => {
        if (this.selectedArt === 'Scherma' && !this.weaponMastery) {
          await this.pickWeaponMastery();
        }
        this.currentStep = 'equipment';
        this.updateView(container);
      });
    }

    const equipmentCards = container.querySelectorAll('.kai-art-card[data-idx]');
    equipmentCards.forEach(card => {
      card.addEventListener('click', () => this.toggleEquipment(card, container));
    });

    const continueSummary = container.querySelector('#continue-summary');
    if (continueSummary) {
      continueSummary.addEventListener('click', async () => {
        await this.applySelections();
        this.currentStep = 'summary';
        this.updateView(container);
      });
    }

    const beginBook4 = container.querySelector('#begin-book4');
    if (beginBook4) {
      beginBook4.addEventListener('click', () => {
        if (this.onComplete) this.onComplete();
      });
    }
  }

  rollGold(container) {
    if (this.goldRolled) return;
    this.goldRolled = true;

    const btn = container.querySelector('#roll-gold');
    if (btn) btn.disabled = true;

    const roll = getRandomDestinyNumber();
    const total = roll + 10;

    const display = container.querySelector('#gold-roll');
    const result = container.querySelector('#gold-result');

    this.animateRoll(display, roll, () => {
      gameState.addCorone(total);
      const state = gameState.getState();
      result.innerHTML = `<h3 style="color: var(--color-success);">+${total} Corone d'Oro (totale: ${state.character.corone})</h3>`;
      container.querySelector('#gold-complete').style.display = 'block';
    });
  }

  selectKaiArt(card, container) {
    this.selectedArt = card.dataset.art;
    container.querySelectorAll('.kai-art-card[data-art]').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    const continueBtn = container.querySelector('#continue-equipment');
    if (continueBtn) continueBtn.disabled = false;
  }

  pickWeaponMastery() {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal">
          <div class="modal-header"><h2>⚔️ Seleziona Arma per Scherma</h2></div>
          <p>In quale arma sei maestro? (+2 Combattività quando la usi)</p>
          <div class="weapon-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 1rem;">
            ${WEAPONS.map(w => `<button class="btn btn-outline weapon-select-btn" data-weapon="${w}">${weaponIconHTML(w)} ${w}</button>`).join('')}
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelectorAll('.weapon-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.weaponMastery = btn.dataset.weapon;
          modal.remove();
          resolve();
        });
      });
    });
  }

  toggleEquipment(card, container) {
    const idx = parseInt(card.dataset.idx);
    const pos = this.chosenEquipment.indexOf(idx);

    if (pos > -1) {
      this.chosenEquipment.splice(pos, 1);
      card.classList.remove('selected');
    } else if (this.chosenEquipment.length < MAX_EQUIPMENT_PICKS) {
      this.chosenEquipment.push(idx);
      card.classList.add('selected');
    }

    const header = container.querySelector('.card-header p');
    if (header) header.textContent = `Scegli fino a 6 oggetti (${this.chosenEquipment.length}/${MAX_EQUIPMENT_PICKS})`;

    const continueBtn = container.querySelector('#continue-summary');
    if (continueBtn) continueBtn.disabled = this.chosenEquipment.length === 0;
  }

  async applySelections() {
    // New Kai Discipline
    gameState.updateStats({ artiRamas: [...gameState.getState().character.artiRamas, this.selectedArt] });
    if (this.weaponMastery) {
      gameState.updateStats({ weaponMastery: this.weaponMastery });
    }

    // Chosen equipment
    for (const idx of this.chosenEquipment) {
      const item = BOOK4_EQUIPMENT[idx];
      if (item.type === 'weapon') {
        if (!gameState.addWeapon(item.name)) {
          await this.swapWeapon(item.name);
        }
      } else if (item.type === 'meal') {
        gameState.addPasti(item.count);
      } else if (item.type === 'potion') {
        for (let i = 0; i < (item.count || 1); i++) {
          gameState.addToZaino(item.name);
        }
      } else if (item.type === 'special') {
        gameState.addOggettoSpeciale(item.name);
        if (item.bonus.resistenza) {
          const state = gameState.getState();
          gameState.updateStats({
            resistenza: state.character.resistenza + item.bonus.resistenza,
            resistenzaMax: state.character.resistenzaMax + item.bonus.resistenza
          });
        }
        if (item.bonus.combattivita) {
          const state = gameState.getState();
          gameState.updateStats({ combattivita: state.character.combattivita + item.bonus.combattivita });
        }
      }
    }

    // Automatic Special Items granted at the start of Book 4
    gameState.addOggettoSpeciale('Mappa delle Terre del Sud');
    gameState.addOggettoSpeciale('Distintivo di Grado');
  }

  swapWeapon(newWeapon) {
    return new Promise((resolve) => {
      const currentWeapons = gameState.getState().character.armi;
      const content = `
        <p class="modal-text">Hai già 2 armi (${currentWeapons.join(', ')}). Devi scartarne una per prendere <strong>${newWeapon}</strong>.</p>
        <div class="modal-actions" style="flex-direction: column; gap: 1rem;">
          <button class="btn btn-warning btn-large" data-action="swap1">Scarta ${currentWeapons[0]} e prendi ${newWeapon}</button>
          <button class="btn btn-warning btn-large" data-action="swap2">Scarta ${currentWeapons[1]} e prendi ${newWeapon}</button>
          <button class="btn btn-outline btn-large" data-action="cancel">Non prendere ${newWeapon}</button>
        </div>
      `;
      UIHelpers.showModal(content, {
        title: 'Zaino Armi Pieno',
        buttons: {
          '[data-action="swap1"]': (e, modal) => {
            gameState.removeWeapon(currentWeapons[0]);
            gameState.addWeapon(newWeapon);
            modal.remove();
            resolve();
          },
          '[data-action="swap2"]': (e, modal) => {
            gameState.removeWeapon(currentWeapons[1]);
            gameState.addWeapon(newWeapon);
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

  animateRoll(element, finalValue, callback) {
    let count = 0;
    const interval = setInterval(() => {
      element.textContent = Math.floor(Math.random() * 10);
      count++;
      if (count > 10) {
        clearInterval(interval);
        element.textContent = finalValue;
        if (callback) callback();
      }
    }, 100);
  }
}
