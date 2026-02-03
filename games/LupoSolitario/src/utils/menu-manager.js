// Menu Manager - Game menu handling

import { UIHelpers } from '../utils/ui-helpers.js';

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

        // View saves (not implemented yet)
        modal.querySelector('#view-saves-btn').addEventListener('click', () => {
            UIHelpers.showToast('📋 Funzione in arrivo!', 'info');
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
}
