// Screen Manager - Manages different app screens

export class ScreenManager {
    constructor(appElement) {
        this.app = appElement;
        this.currentScreen = null;
    }

    showLoadingScreen(message = 'Caricamento...') {
        this.currentScreen = 'loading';
        this.app.innerHTML = `
      <div class="loading-screen">
        <div class="spinner"></div>
        <p>${message}</p>
      </div>
    `;
    }

    showErrorScreen(message) {
        this.currentScreen = 'error';
        this.app.innerHTML = `
      <div class="loading-screen">
        <div style="font-size: 4rem;">❌</div>
        <h2>${message}</h2>
        <button class="btn btn-primary" onclick="location.reload()">
          Ricarica
        </button>
      </div>
    `;
    }

    showAuthScreen(onGoogleSignIn) {
        this.currentScreen = 'auth';
        this.app.innerHTML = `
      <div class="auth-screen">
        <div class="auth-card card">
          <div class="auth-logo">🐺</div>
          <h1 class="auth-title">Lupo Solitario</h1>
          <p class="auth-subtitle">Fuga dalle Tenebre</p>
          <p class="text-muted">Accedi con Google per salvare le tue avventure nel cloud</p>
          <button class="btn btn-primary btn-large btn-block" id="google-signin-btn">
            <span style="font-size: 1.5rem;">🔐</span>
            Accedi con Google
          </button>
        </div>
      </div>
    `;

        const signInBtn = this.app.querySelector('#google-signin-btn');
        signInBtn.addEventListener('click', onGoogleSignIn);
    }

    showContinueOrNewScreen(onContinue, onNewGame, onLogout) {
        this.currentScreen = 'continue-or-new';
        this.app.innerHTML = `
      <div class="auth-screen">
        <div class="card" style="max-width: 500px;">
          <div style="text-align: center;">
            <div style="font-size: 4rem;">🐺</div>
            <h2>Bentornato!</h2>
            <p class="text-muted">Hai un salvataggio esistente. Vuoi continuare?</p>
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">
              <button class="btn btn-primary btn-large" id="continue-btn">
                ▶️ Continua Partita
              </button>
              <button class="btn btn-secondary" id="new-game-btn">
                🆕 Nuova Partita
              </button>
              <button class="btn btn-outline" id="logout-btn">
                🚪 Esci
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

        this.app.querySelector('#continue-btn').addEventListener('click', onContinue);
        this.app.querySelector('#new-game-btn').addEventListener('click', onNewGame);
        this.app.querySelector('#logout-btn').addEventListener('click', onLogout);
    }

    showGameHeader(onSave, onMenu) {
        return `
      <div class="app-header">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
          <h1 style="margin: 0;">🐺 Lupo Solitario</h1>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-small" id="save-btn" title="Salva">💾</button>
            <button class="btn btn-small" id="menu-btn" title="Menu">☰</button>
          </div>
        </div>
      </div>
    `;
    }

    clear() {
        this.app.innerHTML = '';
        this.currentScreen = null;
    }
}
