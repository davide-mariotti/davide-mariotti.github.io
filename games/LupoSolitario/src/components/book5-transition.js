// Book 4 -> Book 5 Transition - carries the character forward into Shadow on the Sand,
// following that book's rules/equipment pages: roll for Gold Crowns (+10, max 50),
// choose 1 extra Kai Discipline, choose UP TO FOUR equipment items, and
// automatically receive the Map of Vassagonia (Mappa di Vassagonia).
import { getRandomDestinyNumber } from './destiny-table.js';
import { gameState } from '../game-state.js';
import { UIHelpers } from '../utils/ui-helpers.js';
import { KAI_ARTS, WEAPONS, weaponIconHTML, itemIconHTML } from './character-creator.js';

const MAX_EQUIPMENT_PICKS = 4;

const BOOK5_EQUIPMENT = [
  { type: 'weapon', name: 'Daga' },
  { type: 'potion', name: 'Pozione di Laumspur', count: 1 },
  { type: 'weapon', name: 'Spada' },
  { type: 'weapon', name: 'Lancia' },
  { type: 'meal', count: 2 },
  { type: 'weapon', name: 'Mazza' },
  { type: 'special', name: 'Scudo', bonus: { combattivita: 2 } }
];

export class Book5Transition {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.currentStep = 'intro';
    this.weaponMastery = null;
    this.selectedArt = null;
    this.chosenEquipment = [];
    this.goldRolled = false;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'book5-transition';
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
          <h2 class="card-title">☀️ Ombra sulla Sabbia</h2>
        </div>
        <div>
          <h3 style="text-align: center;">La Storia Finora...</h3>
          <div class="section-text">
            <p>Sei Lupo Solitario, l'ultimo dei cavalieri Ramas del Sommerlund e unico sopravvissuto al massacro che li ha distrutti durante una spietata guerra contro i vostri nemici giurati, i Signori delle Tenebre di Helgedad.</p>
            <p>È pieno inverno nella tua patria settentrionale e una coltre di neve alta fino al ginocchio ricopre le strade di Holmgard, la capitale, quando vieni convocato dal tuo monastero sulle colline da un messaggero recante una pergamena firmata e sigillata dalla mano di Re Ulnar. Sei sorpreso di leggere il messaggio del Re, poiché si tratta di una richiesta di aiuto per risolvere un problema urgente di grande rilevanza diplomatica. Sembra una richiesta insolita da rivolgere a un guerriero, le cui abilità sono più adatte al campo di battaglia che alle trattative con inviati stranieri. Tuttavia, obbedisci alla convocazione e, al tuo arrivo alla capitale, ogni cosa ti diventa chiara.</p>
            <p>Lo Zakhan di Vassagonia, il sovrano imperiale di questo impero desertico, ha inviato il suo messaggero più fidato per stipulare un trattato di pace tra i vostri due paesi, e ti è stato chiesto di firmare il trattato a nome della tua patria. Il motivo è facilmente comprensibile.</p>
            <p>Meno di un anno ago, un nobile rinnegato di Vassagonia di nome Barraka guidò il suo esercito di banditi all'assalto della provincia sommlending di Ruanon. Questa città mineraria e gran parte delle terre circostanti furono invase e distrutte. Molti Sommlending persero la vita, e molti altri furono ridotti in schiavitù e costretti a lavorare nelle miniere dei Monti Maaken. Quando il regolare convoglio da Ruanon non giunse alla capitale, il Re ti inviò a investigare. Ne seguì una grande battaglia in cui sconfiggesti Barraka in un duello mortale. Senza il tuo coraggio e la tua abilità, la sicurezza del Sommerlund e di tutte le Terre Libere sarebbe stata in grave pericolo.</p>
            <p>«Maestà, lo Zakhan è profondamente imbarazzato dal vile tradimento di Barraka, ed è ansioso che la nostra amicizia e la nostra fiducia siano ristabilite. Chiede che inviate il guerriero Ramas, Lupo Solitario, a firmare il trattato di pace con lui presso il Gran Palazzo di Barrakeesh», sussurra l'emissario dello Zakhan, inginocchiandosi ai piedi di Re Ulnar.</p>
            <p>Il Re si alza dal trono, riuscendo a stento a nascondere il suo disgusto per l'inviato servile. Volge lo sguardo verso di te e ti invita a seguirlo nella riservatezza di un'anticamera.</p>
            <p>«Non ho alcuna simpatia per questo regno desertico, Lupo Solitario, ma mi piace ancor meno la prospettiva di una guerra. Lo Zakhan è vecchio e debole, e non ha figli che possano rivendicare il trono alla sua morte. Barraka era solo uno dei tanti spietati nobili che attendono come sciacalli l'opportunità di prendere il potere, e temo che siano troppo impazienti per lasciare che lo Zakhan muoia di morte naturale. Il trattato potrebbe non garantirci la pace con la Vassagonia dopo la morte dello Zakhan, ma almeno ci guadagnerà tempo prezioso per rafforzare il nostro confine meridionale».</p>
            <p>Il Re ti conduce a una finestra e indica il porto, a malapena visibile attraverso la neve che cade. Una galea vassagoniana è ancorata vicino al molo.</p>
            <p>«Va' in Vassagonia, Lupo Solitario. Firma il trattato e ritorna in fretta. Anche con la promessa di pace, temo che l'ombra della guerra si abbatterà su di noi prima che l'anno sia trascorso».</p>
            <p>Dici addio a Holmgard in questo gelido giorno d'inverno, fiducioso che farai ritorno prima del disgelo. Ma mentre guardi le guglie di Holmgard scomparire tra i fiocchi di neve, non hai alcun sentore dell'ombra che ti attende in Vassagonia.</p>
          </div>
          <p class="text-muted" style="text-align: center; margin-top: 1.5rem;">Il tuo Registro di Guerra - Combattività, Resistenza, Arti Ramas, Armi e Oggetti Speciali - resta invariato. Prima di imbarcarti, però, aggiornerai l'equipaggiamento per il viaggio: potrai scegliere fino a quattro nuovi oggetti.</p>
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
          <p class="text-muted">Scegli fino a 4 oggetti (${this.chosenEquipment.length}/${MAX_EQUIPMENT_PICKS})</p>
        </div>
        <div class="equipment-grid">
          ${BOOK5_EQUIPMENT.map((item, idx) => `
            <div class="kai-art-card ${this.chosenEquipment.includes(idx) ? 'selected' : ''}" data-idx="${idx}">
              <div class="kai-art-name">${this.equipmentLabel(item)}</div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 2rem;">
          <button class="btn btn-success btn-large btn-block" id="continue-summary">
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
    if (item.type === 'meal') return `🍖 Pasti Speciali (x${item.count})`;
    if (item.type === 'potion') return `${itemIconHTML(item.name) || '🧪'} ${item.name}${item.count ? ` (x${item.count})` : ''}`;
    if (item.type === 'special') {
      const bonusKey = Object.keys(item.bonus)[0];
      const bonusLabel = bonusKey === 'resistenza' ? 'Resistenza' : 'Combattività';
      return `${itemIconHTML(item.name) || 'Scudo'} ${item.name} (+${item.bonus[bonusKey]} ${bonusLabel})`;
    }
    return `${weaponIconHTML(item.name)} ${item.name}`;
  }

  getSummaryHTML() {
    const state = gameState.getState();
    const c = state.character;
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">📋 Pronto per Ombra sulla Sabbia</h2>
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

          <button class="btn btn-success btn-large btn-block" id="begin-book5" style="margin-top: 2rem;">
            🚀 Inizia il Libro 5
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

    const beginBook5 = container.querySelector('#begin-book5');
    if (beginBook5) {
      beginBook5.addEventListener('click', () => {
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
    if (header) header.textContent = `Scegli fino a 4 oggetti (${this.chosenEquipment.length}/${MAX_EQUIPMENT_PICKS})`;
  }

  async applySelections() {
    // New Kai Discipline
    gameState.updateStats({ artiRamas: [...gameState.getState().character.artiRamas, this.selectedArt] });
    if (this.weaponMastery) {
      gameState.updateStats({ weaponMastery: this.weaponMastery });
    }

    // Chosen equipment
    for (const idx of this.chosenEquipment) {
      const item = BOOK5_EQUIPMENT[idx];
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
        if (item.bonus && item.bonus.resistenza) {
          const state = gameState.getState();
          gameState.updateStats({
            resistenza: state.character.resistenza + item.bonus.resistenza,
            resistenzaMax: state.character.resistenzaMax + item.bonus.resistenza
          });
        }
        if (item.bonus && item.bonus.combattivita) {
          const state = gameState.getState();
          gameState.updateStats({ combattivita: state.character.combattivita + item.bonus.combattivita });
        }
      }
    }

    // Automatic Special Items granted at the start of Book 5
    gameState.addOggettoSpeciale('Mappa di Vassagonia');
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
