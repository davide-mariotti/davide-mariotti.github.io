// Character Sheet Component - Always visible character display
import { gameState } from '../game-state.js';
import { UIHelpers } from '../utils/ui-helpers.js';
import { KAI_ARTS, WEAPON_IMAGES, ITEM_IMAGES } from './character-creator.js';

export class CharacterSheet {
  constructor() {
    this.isCollapsed = window.innerWidth < 768; // Collapsed on mobile by default
  }

  render() {
    const container = document.createElement('div');
    container.className = `character-sheet ${this.isCollapsed ? 'collapsed' : ''}`;
    container.id = 'character-sheet';

    gameState.subscribe((state) => this.update(container, state));
    this.update(container, gameState.getState());

    return container;
  }

  update(container, state) {
    const { character } = state;

    // Update container class
    if (this.isCollapsed) {
      container.classList.add('collapsed');
    } else {
      container.classList.remove('collapsed');
    }

    container.innerHTML = `
      <div class="sheet-header">
        <button class="btn btn-small" id="toggle-sheet">
          ${this.isCollapsed ? '📋 Mostra' : '❌ Nascondi'}
        </button>
        <h3>🐺 Lupo Solitario</h3>
      </div>
      
      <div class="sheet-content ${this.isCollapsed ? 'hidden' : ''}">
        <!-- Stats -->
        <div class="stats-section">
          <div class="stat-row">
            <span class="stat-label"><span class="stat-emoji">⚔️</span> Combattività</span>
            <span class="stat-value">${character.combattivita}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label"><span class="stat-emoji">❤️</span> Resistenza</span>
            <span class="stat-value ${this.getHealthClass(character.resistenza, character.resistenzaMax)}">
              ${character.resistenza}/${character.resistenzaMax}
            </span>
          </div>
          <div class="health-bar">
            <div class="health-fill" style="width: ${(character.resistenza / character.resistenzaMax) * 100}%"></div>
          </div>
          <div class="stat-row">
            <span class="stat-label"><span class="stat-emoji">💰</span> Corone</span>
            <span class="stat-value">${character.corone}/50</span>
          </div>
          <div class="stat-row">
            <span class="stat-label"><span class="stat-emoji">🍖</span> Pasti</span>
            <span class="stat-value">${character.pasti}</span>
          </div>
          ${character.pasti > 0 ? `
            <button class="btn btn-secondary btn-small btn-block" id="consume-meal">
              🍖 Consuma Pasto
            </button>
          ` : ''}
        </div>

        <!-- Kai Arts -->
        <div class="section">
          <h4>🧙 Arti Kai</h4>
          <div class="kai-arts-list">
            ${character.artiRamas.map(art => {
      const artData = KAI_ARTS.find(a => a.name === art);
      return this.itemCardHTML({ imgSrc: artData?.image, emoji: '✨', label: art });
    }).join('')}
          </div>
        </div>

        <!-- Weapons -->
        <div class="section">
          <h4>⚔️ Armi (${character.armi.length}/2)</h4>
          <div class="weapons-list">
            ${character.armi.map((weapon, index) => this.itemCardHTML({
      imgSrc: WEAPON_IMAGES[weapon],
      emoji: '⚔️',
      label: weapon,
      removeButtonHTML: `<button class="btn-remove" data-type="weapon" data-index="${index}">×</button>`
    })).join('')}
            ${character.armi.length < 2 ? '<div class="inventory-item-empty">Slot vuoto</div>' : ''}
          </div>
        </div>

        <!-- Backpack -->
        <div class="section">
          <h4>🎒 Zaino (${character.zaino.length}/8)</h4>
          <div class="inventory-grid">
            ${character.zaino.map((item, index) => this.itemCardHTML({
      imgSrc: ITEM_IMAGES[item],
      emoji: '🎒',
      label: item,
      removeButtonHTML: `<button class="btn-remove" data-type="zaino" data-index="${index}">×</button>`
    })).join('')}
            ${Array(8 - character.zaino.length).fill(0).map(() =>
      '<div class="inventory-item-empty">Vuoto</div>'
    ).join('')}
          </div>
        </div>

        <!-- Special Items -->
        ${character.oggettiSpeciali.length > 0 ? `
          <div class="section">
            <h4>✨ Oggetti Speciali</h4>
            <div class="inventory-grid">
              ${character.oggettiSpeciali.map((item, index) => this.itemCardHTML({
      imgSrc: ITEM_IMAGES[item],
      emoji: '✨',
      label: item,
      removeButtonHTML: `<button class="btn-remove" data-type="special" data-index="${index}">×</button>`
    })).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Attach event listeners
    const toggleBtn = container.querySelector('#toggle-sheet');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.isCollapsed = !this.isCollapsed;
        this.update(container, state);
      });
    }

    const consumeMealBtn = container.querySelector('#consume-meal');
    if (consumeMealBtn) {
      consumeMealBtn.addEventListener('click', () => {
        if (gameState.consumePasto()) {
          UIHelpers.showToast('🍖 Pasto consumato!', 'success');
        }
      });
    }

    // Remove buttons
    const removeButtons = container.querySelectorAll('.btn-remove');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.dataset.type;
        const index = parseInt(e.target.dataset.index);
        this.removeItem(type, index);
      });
    });
  }

  getHealthClass(current, max) {
    const percentage = (current / max) * 100;
    if (percentage > 60) return 'health-good';
    if (percentage > 30) return 'health-warning';
    return 'health-danger';
  }

  // A compact icon-on-top, label-below card used for every inventory row
  // (Kai Arts, Weapons, Backpack, Special Items) - falls back to a generic
  // emoji for the many narrative item names that have no dedicated artwork.
  itemCardHTML({ imgSrc, emoji, label, removeButtonHTML = '' }) {
    const icon = imgSrc
      ? `<img class="inventory-item-icon" src="${imgSrc}" alt="${label}">`
      : `<span class="inventory-item-icon inventory-item-icon-emoji">${emoji}</span>`;
    return `
      <div class="inventory-item">
        ${removeButtonHTML}
        ${icon}
        <span class="inventory-item-label">${label}</span>
      </div>
    `;
  }

  async removeItem(type, index) {
    const state = gameState.getState();
    if (type === 'weapon') {
      const weapon = state.character.armi[index];
      const confirmed = await UIHelpers.confirmAsync(`Rimuovere l'arma ${weapon}?`);
      if (confirmed) {
        gameState.removeWeapon(weapon);
        UIHelpers.showToast(`Arma rimossa: ${weapon}`, 'info');
      }
    } else if (type === 'zaino') {
      const item = state.character.zaino[index];
      const confirmed = await UIHelpers.confirmAsync(`Rimuovere ${item}?`);
      if (confirmed) {
        gameState.removeFromZaino(item);
        UIHelpers.showToast(`Oggetto rimosso: ${item}`, 'info');
      }
    }
  }
}
