// Character Creator Component
import { getRandomDestinyNumber } from './destiny-table.js';
import { gameState } from '../game-state.js';

export const KAI_ARTS = [
  {
    name: 'Mimetismo',
    emoji: '🎭',
    image: 'public/img/arti-ramas/mimetismo.png',
    description: 'Ti permette di adattarti all\'ambiente circostante e nasconderti'
  },
  {
    name: 'Caccia',
    emoji: '🏹',
    image: 'public/img/arti-ramas/caccia.png',
    description: 'Ti permette di procurarti cibo in natura. Non devi consumare Pasti quando richiesto.'
  },
  {
    name: 'Sesto Senso',
    emoji: '👁️',
    image: 'public/img/arti-ramas/sesto-senso.png',
    description: 'Ti avverte di pericoli imminenti e rivela la natura di oggetti strani'
  },
  {
    name: 'Orientamento',
    emoji: '🧭',
    image: 'public/img/arti-ramas/orientamento.png',
    description: 'Ti permette di scegliere sempre il percorso giusto'
  },
  {
    name: 'Guarigione',
    emoji: '💊',
    image: 'public/img/arti-ramas/guarigione.png',
    description: 'Recuperi 1 punto Resistenza per ogni sezione senza combattimento'
  },
  {
    name: 'Scherma',
    emoji: '⚔️',
    image: 'public/img/arti-ramas/scherma.png',
    description: 'Maestria con un\'arma specifica: +2 Combattività quando la usi'
  },
  {
    name: 'Psicoschermo',
    emoji: '🛡️',
    image: 'public/img/arti-ramas/psicoschermo.png',
    description: 'Protegge dagli attacchi Psicolaser dei nemici'
  },
  {
    name: 'Psicolaser',
    emoji: '⚡',
    image: 'public/img/arti-ramas/psicolaser.png',
    description: 'Attacca i nemici con la forza della mente: +2 Combattività'
  },
  {
    name: 'Affinità animale',
    emoji: '🐺',
    image: 'public/img/arti-ramas/affinita-animale.png',
    description: 'Comunica con gli animali e comprendi le loro intenzioni'
  },
  {
    name: 'Telecinesi',
    emoji: '🔮',
    image: 'public/img/arti-ramas/telecinesi.png',
    description: 'Muovi piccoli oggetti con la concentrazione mentale'
  }
];

export const WEAPONS = [
  'Pugnale', 'Lancia', 'Mazza', 'Daga', 'Martello',
  'Spada', 'Ascia', 'Spada', 'Asta', 'Spadone'
];

// Maps a weapon's display name to its icon - used anywhere a weapon is shown
// with an image instead of (or alongside) the generic ⚔️ emoji.
export const WEAPON_IMAGES = {
  'Pugnale': 'public/img/weapon/pugnale.png',
  'Daga': 'public/img/weapon/daga.png',
  'Lancia': 'public/img/weapon/lancia.png',
  'Mazza': 'public/img/weapon/mazza.png',
  'Martello': 'public/img/weapon/martello.png',
  'Spada': 'public/img/weapon/spada.png',
  'Spada Corta': 'public/img/weapon/spada-corta.png',
  'Ascia': 'public/img/weapon/ascia.png',
  'Asta': 'public/img/weapon/asta.png',
  'Spadone': 'public/img/weapon/spadone.png'
};

// <img> tag for a weapon icon, or '' if the weapon has no known icon (safe to
// splice directly into a template string).
export function weaponIconHTML(weaponName) {
  const src = WEAPON_IMAGES[weaponName];
  return src ? `<img class="weapon-icon-small" src="${src}" alt="${weaponName}">` : '';
}

// Maps a Backpack/Special Item's display name to its icon. Only the items
// actually granted during character creation and book transitions have real
// artwork - the game also has hundreds of one-off narrative item names (found
// deep in the books) that fall back to a generic icon wherever this is used.
export const ITEM_IMAGES = {
  'Elmo': 'public/img/oggetti/elmo.png',
  'Cotta di Maglia': 'public/img/oggetti/cotta-di-maglia.png',
  'Scudo': 'public/img/oggetti/scudo.png',
  'Giubba di Cuoio Imbottito': 'public/img/oggetti/giubba-di-cuoio-imbottito.png',
  'Mappa di Sommerlund': 'public/img/oggetti/mappa.png',
  'Mappa': 'public/img/oggetti/mappa.png',
  'Mappa di Kalte': 'public/img/oggetti/mappa.png',
  'Mappa delle Terre del Sud': 'public/img/oggetti/mappa.png',
  'Sigillo di Hammerdal': 'public/img/oggetti/sigillo-di-hammerdal.png',
  'Pozione Magica': 'public/img/oggetti/pozione-magica.png',
  'Pozione Curativa': 'public/img/oggetti/pozione-curativa.png',
  'Pozione di Laumspur': 'public/img/oggetti/pozione-di-laumspur.png'
};

// <img> tag for a known item icon, or '' if this item has no dedicated
// artwork (the vast majority of narrative item names - callers should fall
// back to a generic emoji in that case).
export function itemIconHTML(itemName) {
  const src = ITEM_IMAGES[itemName];
  return src ? `<img class="weapon-icon-small" src="${src}" alt="${itemName}">` : '';
}

const STARTING_ITEMS = [
  { type: 'weapon', name: 'Spada' },
  { type: 'special', name: 'Elmo', bonus: { resistenza: 2 } },
  { type: 'meal', count: 2 },
  { type: 'special', name: 'Cotta di Maglia', bonus: { resistenza: 4 } },
  { type: 'weapon', name: 'Mazza' },
  { type: 'potion', name: 'Pozione Magica' },
  { type: 'weapon', name: 'Asta' },
  { type: 'weapon', name: 'Lancia' },
  { type: 'gold', amount: 12 },
  { type: 'weapon', name: 'Spadone' }
];

export class CharacterCreator {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.character = {
      combattivita: 0,
      resistenza: 0,
      resistenzaMax: 0,
      artiRamas: [],
      armi: ['Ascia'], // Starting weapon
      zaino: [],
      corone: 0,
      pasti: 1, // Starting meal
      oggettiSpeciali: ['Mappa di Sommerlund']
    };
    this.weaponMastery = null;
    this.currentStep = 'intro';
  }

  render() {
    const container = document.createElement('div');
    container.className = 'character-creator';
    container.innerHTML = this.getStepHTML();
    this.attachEventListeners(container);
    return container;
  }

  getStepHTML() {
    switch (this.currentStep) {
      case 'intro':
        return this.getIntroHTML();
      case 'combat-stats':
        return this.getCombatStatsHTML();
      case 'kai-arts':
        return this.getKaiArtsHTML();
      case 'starting-item':
        return this.getStartingItemHTML();
      case 'summary':
        return this.getSummaryHTML();
      default:
        return '';
    }
  }

  getIntroHTML() {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">🐺 Creazione del Personaggio</h2>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 4rem; margin: 2rem 0;">⚔️</div>
          <h3>Benvenuto, giovane Ramas!</h3>
          <p class="text-muted">Sei l'ultimo sopravvissuto del monastero di Ramas.</p>
          <p class="text-muted">È tempo di determinare le tue abilità per l'avventura che ti attende.</p>
          <button class="btn btn-primary btn-large btn-block" id="start-creation">
            Inizia Creazione
          </button>
        </div>
      </div>
    `;
  }

  getCombatStatsHTML() {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">💪 Statistiche di Combattimento</h2>
        </div>
        <div>
          <div class="stat-section">
            <h3>⚔️ Combattività</h3>
            <p class="text-muted">Lancia il Destino e aggiungi 10</p>
            <div class="destiny-display" style="text-align: center; margin: 2rem 0;">
              <div class="stat-value" style="font-size: 3rem;" id="combat-roll">?</div>
            </div>
            <button class="btn btn-primary btn-large btn-block" id="roll-combat">
              🎲 Lancia per Combattività
            </button>
            <div id="combat-result" style="margin-top: 1rem; text-align: center;"></div>
          </div>

          <div class="stat-section" id="resistance-section" style="display: none; margin-top: 2rem;">
            <h3>❤️ Resistenza</h3>
            <p class="text-muted">Lancia il Destino e aggiungi 20</p>
            <div class="destiny-display" style="text-align: center; margin: 2rem 0;">
              <div class="stat-value" style="font-size: 3rem;" id="resistance-roll">?</div>
            </div>
            <button class="btn btn-primary btn-large btn-block" id="roll-resistance">
              🎲 Lancia per Resistenza
            </button>
            <div id="resistance-result" style="margin-top: 1rem; text-align: center;"></div>
          </div>

          <div id="stats-complete" style="display: none; margin-top: 2rem;">
            <button class="btn btn-success btn-large btn-block" id="continue-to-arts">
              Continua →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getKaiArtsHTML() {
    const isEasy = gameState.getState().easyMode;
    const recommendedArts = ['Sesto Senso', 'Mimetismo', 'Guarigione', 'Caccia', 'Scherma'];

    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">🧙 Arti Kai Ramas</h2>
          <p class="text-muted">Scegli 5 Arti Kai (${this.character.artiRamas.length}/5)</p>
          ${isEasy ? `<p style="color: #22c55e; font-weight: 600; margin-top: 0.5rem;">💡 Easy Mode: Le 5 Arti consigliate per vincere sono evidenziate in verde (Sesto Senso, Mimetismo, Guarigione, Caccia, Scherma).</p>` : ''}
        </div>
        <div class="kai-arts-grid">
          ${KAI_ARTS.map((art, index) => {
            const isRec = isEasy && recommendedArts.includes(art.name);
            return `
            <div class="kai-art-card ${this.character.artiRamas.includes(art.name) ? 'selected' : ''} ${isRec ? 'easy-mode-art-recommendation' : ''}"
                 data-art="${art.name}">
              <img class="kai-art-emoji" src="${art.image}" alt="${art.name}">
              <div class="kai-art-name">
                ${art.name}
                ${isRec ? '<span class="easy-mode-badge" style="font-size: 0.65rem; margin-left: 4px;">💡 Easy</span>' : ''}
              </div>
              <div class="kai-art-desc">${art.description}</div>
            </div>
          `;
          }).join('')}
        </div>
        <div style="margin-top: 2rem;">
          <button class="btn btn-success btn-large btn-block" id="continue-to-item" 
                  ${this.character.artiRamas.length !== 5 ? 'disabled' : ''}>
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
        .kai-art-emoji {
          display: block;
          width: 110px;
          height: 110px;
          object-fit: contain;
          margin: 0 auto 0.75rem;
          border-radius: 12px;
        }
        .kai-art-name {
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .kai-art-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
      </style>
    `;
  }

  getStartingItemHTML() {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">🎁 Oggetto Iniziale</h2>
        </div>
        <div style="text-align: center;">
          <p class="text-muted">Tra le rovine del monastero trovi...</p>
          
          <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 1rem; margin: 1rem 0; text-align: left;">
            <h4 style="margin-bottom: 0.5rem; text-align: center;">Tabella del Destino: Equipaggiamento</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem; font-size: 0.9rem;">
              ${STARTING_ITEMS.map((item, idx) => {
      let name = item.name;
      if (item.type === 'meal') name = 'Pasti';
      else if (item.type === 'gold') name = 'Corone d\'Oro';

      return `
                <div style="padding: 0.25rem 0.5rem; background: rgba(255,255,255,0.05); border-radius: 4px;">
                  <strong style="color: var(--color-primary);">${idx}</strong>: ${item.type === 'weapon' ? weaponIconHTML(name) + ' ' : itemIconHTML(name) + ' '}${name}
                  ${item.count ? `(x${item.count})` : ''}
                  ${item.amount ? `(${item.amount})` : ''}
                  ${item.bonus ? `(+${Object.values(item.bonus)[0]})` : ''}
                </div>
              `}).join('')}
            </div>
          </div>

          <div class="destiny-display" style="margin: 2rem 0;">
            <div class="stat-value" style="font-size: 3rem;" id="item-roll">?</div>
          </div>
          <button class="btn btn-primary btn-large btn-block" id="roll-item" ${this.startingItemRolled ? 'disabled' : ''}>
            ${this.startingItemRolled ? 'Oggetto Assegnato' : '🎲 Scopri cosa hai trovato'}
          </button>
          <div id="item-result" style="margin-top: 2rem;"></div>
          <div id="item-complete" style="display: ${this.startingItemRolled ? 'block' : 'none'}; margin-top: 2rem;">
            <button class="btn btn-success btn-large btn-block" id="finish-creation">
              Completa Creazione →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getSummaryHTML() {
    return `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">📋 Riepilogo Personaggio</h2>
        </div>
        <div>
          <div class="stat-row">
            <span class="stat-label">⚔️ Combattività</span>
            <span class="stat-value">${this.character.combattivita}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">❤️ Resistenza</span>
            <span class="stat-value">${this.character.resistenza}/${this.character.resistenzaMax}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">💰 Corone d'Oro</span>
            <span class="stat-value">${this.character.corone}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">🍖 Pasti</span>
            <span class="stat-value">${this.character.pasti}</span>
          </div>
          
          <h4 style="margin-top: 2rem;">🧙 Arti Kai Ramas</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
            ${this.character.artiRamas.map(art => {
      const artData = KAI_ARTS.find(a => a.name === art);
      return `<span class="inventory-item"><img class="weapon-icon-small" src="${artData?.image}" alt="${art}"> ${art}</span>`;
    }).join('')}
          </div>

          <h4 style="margin-top: 2rem;">⚔️ Armi</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
            ${this.character.armi.map(weapon =>
      `<span class="inventory-item">${weaponIconHTML(weapon)} ${weapon}</span>`
    ).join('')}
          </div>

          ${this.character.zaino.length > 0 ? `
            <h4 style="margin-top: 2rem;">🎒 Zaino</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
              ${this.character.zaino.map(item =>
      `<span class="inventory-item">${itemIconHTML(item) || '🎒'} ${item}</span>`
    ).join('')}
            </div>
          ` : ''}

          ${this.character.oggettiSpeciali.length > 0 ? `
            <h4 style="margin-top: 2rem;">✨ Oggetti Speciali</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
              ${this.character.oggettiSpeciali.map(item =>
      `<span class="inventory-item">${itemIconHTML(item) || '✨'} ${item}</span>`
    ).join('')}
            </div>
          ` : ''}

          <button class="btn btn-success btn-large btn-block" id="begin-adventure" style="margin-top: 2rem;">
            🚀 Inizia l'Avventura!
          </button>
        </div>
      </div>
    `;
  }

  attachEventListeners(container) {
    // Intro
    const startBtn = container.querySelector('#start-creation');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        // Roll initial gold
        this.character.corone = getRandomDestinyNumber();
        this.currentStep = 'combat-stats';
        this.updateView(container);
      });
    }

    // Combat stats
    const rollCombatBtn = container.querySelector('#roll-combat');
    if (rollCombatBtn) {
      rollCombatBtn.addEventListener('click', () => this.rollCombat(container));
    }

    const rollResistanceBtn = container.querySelector('#roll-resistance');
    if (rollResistanceBtn) {
      rollResistanceBtn.addEventListener('click', () => this.rollResistance(container));
    }

    const continueToArtsBtn = container.querySelector('#continue-to-arts');
    if (continueToArtsBtn) {
      continueToArtsBtn.addEventListener('click', () => {
        this.currentStep = 'kai-arts';
        this.updateView(container);
      });
    }

    // Kai Arts
    const artCards = container.querySelectorAll('.kai-art-card');
    artCards.forEach(card => {
      card.addEventListener('click', () => this.toggleKaiArt(card, container));
    });

    const continueToItemBtn = container.querySelector('#continue-to-item');
    if (continueToItemBtn) {
      continueToItemBtn.addEventListener('click', () => {
        this.currentStep = 'starting-item';
        this.updateView(container);
      });
    }

    // Starting item
    const rollItemBtn = container.querySelector('#roll-item');
    if (rollItemBtn) {
      rollItemBtn.addEventListener('click', () => this.rollStartingItem(container));
    }

    const finishBtn = container.querySelector('#finish-creation');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        this.currentStep = 'summary';
        this.updateView(container);
      });
    }

    // Summary
    const beginBtn = container.querySelector('#begin-adventure');
    if (beginBtn) {
      beginBtn.addEventListener('click', () => {
        // Include weaponMastery in character data
        if (this.weaponMastery) {
          this.character.weaponMastery = this.weaponMastery;
        }
        gameState.setCharacter(this.character);
        if (this.onComplete) this.onComplete();
      });
    }
  }

  rollCombat(container) {
    if (this.character.combattivita > 0) return;

    const btn = container.querySelector('#roll-combat');
    if (btn) btn.disabled = true;

    const roll = getRandomDestinyNumber();
    const total = roll + 10;
    this.character.combattivita = total;

    const display = container.querySelector('#combat-roll');
    const result = container.querySelector('#combat-result');

    this.animateRoll(display, roll, () => {
      result.innerHTML = `<h3 style="color: var(--color-success);">Combattività: ${total}</h3>`;
      container.querySelector('#resistance-section').style.display = 'block';
    });
  }

  rollResistance(container) {
    if (this.character.resistenzaMax > 0) return;

    const btn = container.querySelector('#roll-resistance');
    if (btn) btn.disabled = true;

    const roll = getRandomDestinyNumber();
    const total = roll + 20;
    this.character.resistenza = total;
    this.character.resistenzaMax = total;

    const display = container.querySelector('#resistance-roll');
    const result = container.querySelector('#resistance-result');

    this.animateRoll(display, roll, () => {
      result.innerHTML = `<h3 style="color: var(--color-success);">Resistenza: ${total}</h3>`;
      container.querySelector('#stats-complete').style.display = 'block';
    });
  }

  toggleKaiArt(card, container) {
    const artName = card.dataset.art;
    const index = this.character.artiRamas.indexOf(artName);

    if (index > -1) {
      this.character.artiRamas.splice(index, 1);
      card.classList.remove('selected');
    } else {
      if (this.character.artiRamas.length < 5) {
        this.character.artiRamas.push(artName);
        card.classList.add('selected');

        // Handle Scherma - prompt for weapon mastery
        if (artName === 'Scherma' && !this.weaponMastery) {
          // Create a modal to select the weapon
          const modal = document.createElement('div');
          modal.className = 'modal-overlay';
          modal.innerHTML = `
               <div class="modal">
                 <div class="modal-header">
                   <h2>⚔️ Seleziona Arma per Scherma</h2>
                 </div>
                 <p>In quale arma sei maestro? (+2 Combattività quando la usi)</p>
                 <div class="weapon-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 1rem;">
                    ${WEAPONS.map((w, i) => `<button class="btn btn-outline weapon-select-btn" data-weapon="${w}">${weaponIconHTML(w)} ${w}</button>`).join('')}
                 </div>
               </div>
             `;
          document.body.appendChild(modal);

          modal.querySelectorAll('.weapon-select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              this.weaponMastery = btn.dataset.weapon;
              // Add to character object property? Handled in summary? 
              // Ideally we should tell the user.
              const message = document.createElement('div');
              message.className = 'kai-art-desc';
              message.style.color = "var(--color-success)";
              message.innerText = `Maestria: ${this.weaponMastery}`;
              card.appendChild(message);

              modal.remove();
            });
          });
        }
      }
    }

    // Update continue button
    const continueBtn = container.querySelector('#continue-to-item');
    if (continueBtn) {
      continueBtn.disabled = this.character.artiRamas.length !== 5;
    }

    // Update header count
    const header = container.querySelector('.card-header p');
    if (header) {
      header.textContent = `Scegli 5 Arti Kai (${this.character.artiRamas.length}/5)`;
    }
  }

  rollStartingItem(container) {
    if (this.startingItemRolled) return;
    this.startingItemRolled = true;

    const btn = container.querySelector('#roll-item');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Oggetto Assegnato';
    }

    const roll = getRandomDestinyNumber();
    const item = STARTING_ITEMS[roll];

    const display = container.querySelector('#item-roll');
    const result = container.querySelector('#item-result');

    this.animateRoll(display, roll, () => {
      let resultHTML = '<div class="card" style="background: rgba(16, 185, 129, 0.1); border-color: var(--color-success);">';

      if (item.type === 'weapon') {
        this.character.armi.push(item.name);
        resultHTML += `<h3>${weaponIconHTML(item.name)} ${item.name}</h3><p>Aggiunta alle tue armi!</p>`;
      } else if (item.type === 'special') {
        this.character.oggettiSpeciali.push(item.name);
        if (item.bonus) {
          if (item.bonus.resistenza) {
            this.character.resistenza += item.bonus.resistenza;
            this.character.resistenzaMax += item.bonus.resistenza;
            resultHTML += `<h3>${itemIconHTML(item.name)} ${item.name}</h3><p>+${item.bonus.resistenza} Resistenza bonus!</p>`;
          }
        }
      } else if (item.type === 'meal') {
        this.character.pasti += item.count;
        resultHTML += `<h3>🍖 ${item.count} Pasti</h3><p>Aggiunti al tuo zaino!</p>`;
      } else if (item.type === 'potion') {
        this.character.zaino.push(item.name);
        resultHTML += `<h3>${itemIconHTML(item.name)} ${item.name}</h3><p>Aggiunta allo zaino!</p>`;
      } else if (item.type === 'gold') {
        this.character.corone += item.amount;
        resultHTML += `<h3>💰 ${item.amount} Corone d'Oro</h3><p>Totale: ${this.character.corone}</p>`;
      }

      resultHTML += '</div>';
      result.innerHTML = resultHTML;
      container.querySelector('#item-complete').style.display = 'block';
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

  updateView(container) {
    container.innerHTML = this.getStepHTML();
    this.attachEventListeners(container);
  }
}
