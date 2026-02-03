// Main Application Controller - Refactored and modular
import { authManager } from './auth.js';
import { gameState } from './game-state.js';
import { saveManager } from './save-manager.js';
import { bookLoader } from './book-loader.js';
import { CharacterCreator } from './components/character-creator.js';
import { CharacterSheet } from './components/character-sheet.js';
import { StoryReader } from './components/story-reader.js';
import { ScreenManager } from './utils/screen-manager.js';
import { MenuManager } from './utils/menu-manager.js';
import { UIHelpers } from './utils/ui-helpers.js';

class App {
  constructor() {
    this.screenManager = new ScreenManager(document.getElementById('app'));
    this.menuManager = null;
    this.bookData = null;
    this.characterSheet = null;
    this.storyReader = null;
  }

  async init() {
    // Initialize auth
    authManager.init();

    // Listen for auth state changes
    authManager.onAuthStateChange(async (user) => {
      if (user) {
        await this.onUserSignedIn(user);
      } else {
        this.screenManager.showAuthScreen(async () => {
          try {
            await authManager.signInWithGoogle();
          } catch (error) {
            UIHelpers.showToast('❌ Errore durante l\'accesso', 'error');
            console.error(error);
          }
        });
      }
    });
  }

  async onUserSignedIn(user) {
    this.screenManager.showLoadingScreen('Caricamento dati...');

    try {
      await this.loadBookData();
      const hasAutoSave = await saveManager.hasAutoSave();

      if (hasAutoSave) {
        this.showContinueOrNewGameScreen();
      } else {
        this.startNewGame();
      }
    } catch (error) {
      console.error('Error loading game:', error);
      this.screenManager.showErrorScreen('Errore nel caricamento del gioco');
    }
  }

  async loadBookData() {
    // Use book-loader to load and cache book data
    this.bookData = await bookLoader.loadBook('01-flight-from-the-dark');

    // Load intro content
    const introResponse = await fetch('./data/intro-common.json');
    this.introData = await introResponse.json();
  }

  showContinueOrNewGameScreen() {
    this.screenManager.showContinueOrNewScreen(
      () => this.continueGame(),
      () => {
        UIHelpers.showConfirm(
          'Iniziare una nuova partita sovrascriverà il salvataggio automatico. Continuare?',
          () => this.startNewGame()
        );
      },
      () => authManager.signOut()
    );
  }

  async continueGame() {
    this.screenManager.showLoadingScreen('Caricamento partita salvata...');

    try {
      const saveData = await saveManager.loadGame('autosave');
      if (saveData) {
        gameState.loadState(saveData);
        this.showGameScreen();
      } else {
        this.startNewGame();
      }
    } catch (error) {
      console.error('Error loading save:', error);
      this.screenManager.showErrorScreen('Errore nel caricamento del salvataggio');
    }
  }

  startNewGame() {
    this.showCharacterCreation();
  }

  showCharacterCreation() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-header">
        <div class="container">
          <h1 style="margin: 0;">🐺 Lupo Solitario</h1>
        </div>
      </div>
      <div class="app-main">
        <div class="container">
          <div id="character-creation-container"></div>
        </div>
      </div>
    `;

    const creator = new CharacterCreator(() => {
      // Start from section 0 (introduction)
      gameState.goToSection(0);
      this.showGameScreen();
    });

    const container = document.getElementById('character-creation-container');
    container.appendChild(creator.render());
  }

  showIntroduction() {
    const app = document.getElementById('app');
    const backstory = this.introData.sections.backstory;

    app.innerHTML = `
      <div class="app-header">
        <div class="container">
          <h1 style="margin: 0;">🐺 Lupo Solitario</h1>
        </div>
      </div>
      <div class="app-main">
        <div class="container">
          <div class="card" style="max-width: 800px; margin: 2rem auto;">
            <h2>📖 ${backstory.title}</h2>
            ${backstory.content}
            <div style="margin-top: 2rem; text-align: center;">
              <button class="btn btn-primary btn-large" id="start-adventure-btn">
                ⚔️ Inizia l'Avventura
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('start-adventure-btn').addEventListener('click', () => {
      gameState.goToSection(1);
      this.showGameScreen();
    });
  }

  showGameScreen() {
    const app = document.getElementById('app');
    app.innerHTML = this.screenManager.showGameHeader() + `
      <div class="app-main">
        <div class="container">
          <div class="game-layout">
            <div id="character-sheet-container"></div>
            <div id="story-container"></div>
          </div>
        </div>
      </div>
    `;

    // Setup menu manager
    this.menuManager = new MenuManager(
      async () => await saveManager.autoSave(gameState.getState()),
      () => this.startNewGame(),
      () => authManager.signOut()
    );

    // Create character sheet
    this.characterSheet = new CharacterSheet();
    const sheetContainer = document.getElementById('character-sheet-container');
    sheetContainer.appendChild(this.characterSheet.render());

    // Create story reader
    this.storyReader = new StoryReader(this.bookData);
    const storyContainer = document.getElementById('story-container');
    storyContainer.appendChild(this.storyReader.render());

    // Attach header button handlers
    document.getElementById('save-btn').addEventListener('click', async () => {
      await saveManager.autoSave(gameState.getState());
      UIHelpers.showToast('💾 Gioco salvato!', 'success');
    });

    document.getElementById('menu-btn').addEventListener('click', () => {
      this.menuManager.show();
    });
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
