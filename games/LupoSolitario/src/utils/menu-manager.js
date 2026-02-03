// Menu Manager - Game menu handling

import { UIHelpers } from '../utils/ui-helpers.js';
import { saveManager } from '../save-manager.js';
import { gameState } from '../game-state.js';
import { authManager } from '../auth.js';

export class MenuManager {
  constructor(onSave, onNewGame, onLogout) {
    this.onSave = onSave;
    this.onNewGame = onNewGame;
    this.onLogout = onLogout;
  }

  show() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2>☰ Menu</h2>
          <button class="modal-close" id="close-menu">×</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <button class="btn btn-primary btn-block" id="save-game-btn">
            💾 Salva Partita
          </button>
          <button class="btn btn-secondary btn-block" id="view-saves-btn">
            📋 Gestisci Salvataggi
          </button>
          <button class="btn btn-warning btn-block" id="new-game-menu-btn">
            🆕 Nuova Partita
          </button>
          <button class="btn btn-danger btn-block" id="logout-menu-btn">
            🚪 Esci
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close button
    modal.querySelector('#close-menu').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    // Save game
    modal.querySelector('#save-game-btn').addEventListener('click', async () => {
      await this.onSave();
      UIHelpers.showToast('💾 Gioco salvato!', 'success');
      modal.remove();
    });

    // View saves
    modal.querySelector('#view-saves-btn').addEventListener('click', () => {
      modal.remove();
      this.showSaveManager();
    });

    // New game
    modal.querySelector('#new-game-menu-btn').addEventListener('click', () => {
      UIHelpers.showConfirm(
        'Iniziare una nuova partita? I progressi non salvati andranno persi.',
        () => {
          modal.remove();
          this.onNewGame();
        }
      );
    });

    // Logout
    modal.querySelector('#logout-menu-btn').addEventListener('click', () => {
      UIHelpers.showConfirm(
        'Uscire? Assicurati di aver salvato i progressi.',
        () => {
          this.onLogout();
        }
      );
    });
  }

  async showSaveManager() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal" style="max-width: 600px; width: 90%;">
          <div class="modal-header">
            <h2>📋 Gestione Salvataggi</h2>
            <button class="modal-close" id="close-saves">×</button>
          </div>
          <div id="saves-list" style="max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem;">
            <p style="text-align: center;">Caricamento salvataggi...</p>
          </div>
          <div style="margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
            <button class="btn btn-primary btn-block" id="create-new-save">
              ➕ Crea Nuovo Salvataggio
            </button>
          </div>
        </div>
      `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#close-saves');
    closeBtn.addEventListener('click', () => modal.remove());

    const createBtn = modal.querySelector('#create-new-save');
    createBtn.addEventListener('click', async () => {
      const saveName = prompt("Inserisci un nome per il salvataggio:");
      if (saveName) {
        const id = 'save_' + Date.now();
        // Add name to flags or metadata to store legible name
        const state = gameState.getState();
        const newState = { ...state, flags: { ...state.flags, saveName: saveName } };

        await saveManager.saveGame(id, newState);
        UIHelpers.showToast(`✅ Partita "${saveName}" salvata!`, 'success');
        this.renderSavesList(modal.querySelector('#saves-list'), modal);
      }
    });

    await this.renderSavesList(modal.querySelector('#saves-list'), modal);
  }

  async renderSavesList(container, modal) {
    try {
      const saves = await saveManager.listSaves();
      container.innerHTML = '';

      if (saves.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Nessun salvataggio trovato.</p>';
        return;
      }

      saves.forEach(save => {
        const saveName = save.flags && save.flags.saveName ? save.flags.saveName : (save.saveId === 'autosave' ? 'Salvataggio Automatico' : `Salvataggio ${new Date(save.timestamp.seconds * 1000).toLocaleDateString()}`);
        const date = new Date(save.timestamp.seconds * 1000).toLocaleString();
        const section = save.currentSection;

        const item = document.createElement('div');
        item.className = 'save-item';
        item.style.cssText = `
            background: rgba(255,255,255,0.05); 
            padding: 1rem; 
            border-radius: 8px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
          `;

        item.innerHTML = `
            <div>
              <div style="font-weight: bold;">${saveName}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Sezione: ${section} | ${date}</div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-sm btn-success load-btn">Carica</button>
              <button class="btn btn-sm btn-danger delete-btn">Elimina</button>
            </div>
          `;

        item.querySelector('.load-btn').addEventListener('click', async () => {
          UIHelpers.showConfirm(`Caricare "${saveName}"?`, () => {
            gameState.loadState(save);
            UIHelpers.showToast('✅ Partita caricata!', 'success');
            modal.remove();
            // Optionally reload or ensure the view updates
            // gameState loadState triggers listeners so it should update views but for safety we can trigger a re-render if needed
            // It's already reactive.
          });
        });

        item.querySelector('.delete-btn').addEventListener('click', async () => {
          UIHelpers.showConfirm(`Eliminare "${saveName}"?`, async () => {
            await saveManager.deleteSave(save.id);
            UIHelpers.showToast('🗑️ Salvataggio eliminato.', 'info');
            this.renderSavesList(container, modal);
          });
        });

        container.appendChild(item);
      });
    } catch (e) {
      console.error("Error listing saves", e);
      container.innerHTML = '<p style="color: var(--color-danger);">Errore nel caricamento dei salvataggi.</p>';
    }
  }
}
