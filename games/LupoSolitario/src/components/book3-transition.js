// Book 2 -> Book 3 Transition - carries the character forward into The Caverns of
// Kalte, following the "Game Rules" / "Equipment" pages of that book: re-roll Gold
// Crowns (+10), choose 1 extra Kai Discipline, choose 2 new equipment items, and
// automatically receive the Map of Kalte. Unlike the Book 1 -> 2 transition there is
// no second automatic Special Item (no Sigillo-equivalent in Book 3).
import { getRandomDestinyNumber } from './destiny-table.js';
import { gameState } from '../game-state.js';
import { UIHelpers } from '../utils/ui-helpers.js';
import { KAI_ARTS, WEAPONS, weaponIconHTML } from './character-creator.js';

const BOOK3_EQUIPMENT = [
  { type: 'weapon', name: 'Spada' },
  { type: 'weapon', name: 'Spada Corta' },
  { type: 'special', name: 'Giubba di Cuoio Imbottito', bonus: { resistenza: 2 } },
  { type: 'weapon', name: 'Lancia' },
  { type: 'weapon', name: 'Mazza' },
  { type: 'weapon', name: 'Martello' },
  { type: 'weapon', name: 'Ascia' },
  { type: 'potion', name: 'Pozione di Laumspur' },
  { type: 'weapon', name: 'Asta' },
  { type: 'meal', count: 1 },
  { type: 'weapon', name: 'Spadone' }
];

export class Book3Transition {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.currentStep = 'intro';
    this.weaponMastery = null;
    this.selectedArt = null;
    this.chosenEquipment = [];
  }

  render() {
    const container = document.createElement('div');
    container.className = 'book3-transition';
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
          <h2 class="card-title">❄️ Le Caverne di Kalte</h2>
        </div>
        <div>
          <h3 style="text-align: center;">La Storia Finora...</h3>
          <div class="section-text">
            <p>Da molti secoli, nella terra settentrionale di Sommerlund, è tradizione che i figli dei Signori Guerrieri vengano mandati al monastero di Ramas, dove apprendono le arti e le discipline dei loro nobili padri.</p>
            <p>Tu sei Lupo Solitario, e sei ora l'ultimo dei Signori Guerrieri di Sommerlund. Un anno fa, l'antico nemico del tuo popolo — i Signori delle Tenebre di Helgedad — invase improvvisamente Sommerlund e devastò completamente il monastero di Ramas. Tutti i cavalieri Ramas erano riuniti per la festa di Fehmarn, e tutti tranne te furono massacrati.</p>
            <p>Ti sei fatto strada combattendo fino a Holmgard, la capitale del tuo paese, dove il Re ti inviò in una disperata missione in cerca di aiuto. La tua impresa fu irta di grandi pericoli, poiché Sommerlund era stata tradita da uno dei suoi stessi maghi: Vonotar il Traditore. I suoi agenti cercarono di ucciderti a ogni occasione, ma la tua abilità e la tua forza sventarono i loro malvagi intenti. Tornasti a Holmgard alla testa di una grande flotta — gli alleati di Durenor — e distruggesti l'esercito dei Signori delle Tenebre che assediava la tua capitale.</p>
            <p>Gran parte di Sommerlund fu devastata dalla guerra. Le ricche terre coltivate furono rase al suolo insieme a molte città. Ma i Sommlending sono un popolo tenace, e non si lasciarono scoraggiare dall'enorme compito che li attendeva. Si dedicarono alla ricostruzione di Sommerlund, straziata dalla guerra, con una determinazione tale che ora, un anno dopo, poche cicatrici del conflitto sono ancora visibili.</p>
            <p>Per il ruolo cruciale che hai avuto nella vittoria, il Re ti ha conferito il rango e il titolo di «Conte di Fryelund», un raro onore per uno così giovane. Le rovine del monastero di Ramas e gran parte delle terre circostanti sono ora note come «Fryelund», sotto la tua protezione.</p>
            <p>I lavori di ricostruzione del monastero stavano per iniziare quando inquietanti notizie dal nord spinsero il Re a convocarti nella capitale. Molti mercanti, di ritorno dalle spedizioni commerciali estive a Kalte, raccontavano della caduta del Brumalmarc, il condottiero dei Barbari dei Ghiacci. La descrizione del mago gobbo che ha preso il posto del feroce Brumalmarc corrisponde a un solo uomo: Vonotar il Traditore.</p>
            <p>Dopo la sconfitta dei Signori delle Tenebre, Vonotar era fuggito nelle desolate distese ghiacciate di Kalte. Si era fatto strada fino alla fortezza di ghiaccio di Ikaya, dove, con l'inganno, aveva convinto il crudele Brumalmarc ad adottarlo come proprio mago. Fu un errore che sarebbe costato al condottiero barbaro la sua fortezza e la sua vita.</p>
            <p>La notizia che Vonotar è ancora vivo si diffonde come un incendio in tutto Sommerlund. Migliaia di Sommlending si radunano intorno alla capitale e chiedono che Vonotar paghi per il suo tradimento. La protesta è tale che il Re è costretto a promettere che il malvagio traditore sarà riportato a Holmgard e processato per i suoi crimini.</p>
            <p>Per te, Lupo Solitario, la promessa del Re segna l'inizio di una missione che ti metterà di fronte a un nemico odiato, nel cuore ostile delle Caverne di Kalte.</p>
          </div>
          <p class="text-muted" style="text-align: center; margin-top: 1.5rem;">Il tuo Registro di Guerra - Combattività, Resistenza, Arti Ramas, Armi e Oggetti Speciali - resta invariato. Prima di partire, però, aggiornerai l'equipaggiamento per il nuovo viaggio: a Kalte non potrai usare l'Arte Ramas della Caccia, poiché è un deserto di ghiaccio dove non c'è selvaggina.</p>
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
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
        .kai-art-emoji { display: block; width: 64px; height: 64px; object-fit: contain; margin: 0 auto 0.5rem; border-radius: 8px; }
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
          <p class="text-muted">Scegli 2 oggetti (${this.chosenEquipment.length}/2)</p>
        </div>
        <div class="equipment-grid">
          ${BOOK3_EQUIPMENT.map((item, idx) => `
            <div class="kai-art-card ${this.chosenEquipment.includes(idx) ? 'selected' : ''}" data-idx="${idx}">
              <div class="kai-art-name">${this.equipmentLabel(item)}</div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 2rem;">
          <button class="btn btn-success btn-large btn-block" id="continue-summary"
                  ${this.chosenEquipment.length !== 2 ? 'disabled' : ''}>
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
    if (item.type === 'potion') return `🧪 ${item.name}`;
    if (item.type === 'special') {
      const bonusKey = Object.keys(item.bonus)[0];
      const bonusLabel = bonusKey === 'resistenza' ? 'Resistenza' : 'Combattività';
      return `✨ ${item.name} (+${item.bonus[bonusKey]} ${bonusLabel})`;
    }
    return `${weaponIconHTML(item.name)} ${item.name}`;
  }

  getSummaryHTML() {
    const state = gameState.getState();
    const c = state.character;
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">📋 Pronto per Le Caverne di Kalte</h2>
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
            ${c.oggettiSpeciali.map(item => `<span class="inventory-item">${item}</span>`).join('')}
          </div>

          <button class="btn btn-success btn-large btn-block" id="begin-book3" style="margin-top: 2rem;">
            🚀 Inizia il Libro 3
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

    const beginBook3 = container.querySelector('#begin-book3');
    if (beginBook3) {
      beginBook3.addEventListener('click', () => {
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
    } else if (this.chosenEquipment.length < 2) {
      this.chosenEquipment.push(idx);
      card.classList.add('selected');
    }

    const header = container.querySelector('.card-header p');
    if (header) header.textContent = `Scegli 2 oggetti (${this.chosenEquipment.length}/2)`;

    const continueBtn = container.querySelector('#continue-summary');
    if (continueBtn) continueBtn.disabled = this.chosenEquipment.length !== 2;
  }

  async applySelections() {
    // New Kai Discipline
    gameState.updateStats({ artiRamas: [...gameState.getState().character.artiRamas, this.selectedArt] });
    if (this.weaponMastery) {
      gameState.updateStats({ weaponMastery: this.weaponMastery });
    }

    // Chosen equipment
    for (const idx of this.chosenEquipment) {
      const item = BOOK3_EQUIPMENT[idx];
      if (item.type === 'weapon') {
        if (!gameState.addWeapon(item.name)) {
          await this.swapWeapon(item.name);
        }
      } else if (item.type === 'meal') {
        gameState.addPasti(item.count);
      } else if (item.type === 'potion') {
        gameState.addToZaino(item.name);
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

    // Automatic Special Item granted at the start of Book 3 (no Sigillo-equivalent this time)
    gameState.addOggettoSpeciale('Mappa di Kalte');
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
