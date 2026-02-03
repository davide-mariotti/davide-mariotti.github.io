// UI Utilities - Toast notifications and modal helpers

export class UIHelpers {
    static showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    static showModal(content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2>${options.title || ''}</h2>
          <button class="modal-close" data-action="close">×</button>
        </div>
        <div class="modal-content">
          ${content}
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        // Close handlers
        const closeBtn = modal.querySelector('[data-action="close"]');
        closeBtn.addEventListener('click', () => modal.remove());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Custom button handlers
        if (options.buttons) {
            Object.entries(options.buttons).forEach(([selector, handler]) => {
                const btn = modal.querySelector(selector);
                if (btn) {
                    btn.addEventListener('click', (e) => {
                        handler(e, modal);
                    });
                }
            });
        }

        return modal;
    }

    static showConfirm(message, onConfirm, onCancel) {
        const content = `
      <p class="modal-text">${message}</p>
      <div class="modal-actions">
        <button class="btn btn-success btn-large" data-action="confirm">Conferma</button>
        <button class="btn btn-outline btn-large" data-action="cancel">Annulla</button>
      </div>
    `;

        return this.showModal(content, {
            buttons: {
                '[data-action="confirm"]': (e, modal) => {
                    if (onConfirm) onConfirm();
                    modal.remove();
                },
                '[data-action="cancel"]': (e, modal) => {
                    if (onCancel) onCancel();
                    modal.remove();
                }
            }
        });
    }

    static confirmAsync(message) {
        return new Promise((resolve) => {
            this.showConfirm(
                message,
                () => resolve(true),
                () => resolve(false)
            );
        });
    }

    static showAlert(message, title = 'Attenzione') {
        return new Promise((resolve) => {
            const content = `
                <p class="modal-text">${message}</p>
                <div class="modal-actions" style="justify-content: center;">
                    <button class="btn btn-primary btn-large" data-action="ok">OK</button>
                </div>
            `;

            this.showModal(content, {
                title: title,
                buttons: {
                    '[data-action="ok"]': (e, modal) => {
                        modal.remove();
                        resolve();
                    }
                }
            });
        });
    }

    static showLoading(message = 'Caricamento...') {
        const loading = document.createElement('div');
        loading.className = 'loading-screen';
        loading.id = 'global-loading';
        loading.innerHTML = `
      <div class="spinner"></div>
      <p>${message}</p>
    `;
        document.body.appendChild(loading);
        return loading;
    }

    static hideLoading() {
        const loading = document.getElementById('global-loading');
        if (loading) loading.remove();
    }
}
