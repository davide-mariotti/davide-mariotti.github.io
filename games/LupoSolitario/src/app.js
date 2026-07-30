// Main Application Controller - Refactored and modular
import { authManager } from './auth.js';
import { gameState } from './game-state.js';
import { saveManager } from './save-manager.js';
import { bookLoader } from './book-loader.js';
import { CharacterCreator } from './components/character-creator.js';
import { CharacterSheet } from './components/character-sheet.js';
import { StoryReader } from './components/story-reader.js';
import { Book2Transition } from './components/book2-transition.js';
import { Book3Transition } from './components/book3-transition.js';
import { Book4Transition } from './components/book4-transition.js';
import { Book5Transition } from './components/book5-transition.js';
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
    // Expose Easy Mode helper to browser console
    window.easyMode = (enable = null) => {
      const currentState = gameState.getState();
      const targetState = enable === null ? !currentState.easyMode : !!enable;
      gameState.setEasyMode(targetState);

      // Instantly refresh active view
      if (this.storyReader && document.getElementById('story-container')) {
        this.storyReader.update(document.getElementById('story-container'), gameState.getState());
      } else if (document.getElementById('character-creation-container')) {
        this.showCharacterCreation();
      }

      if (targetState) {
        console.log('%c🟢 EASY MODE ATTIVATA!', 'color: #22c55e; font-weight: bold; font-size: 14px;');
        console.log('%cLe scelte migliori per completare la storia sono ora evidenziate in verde.', 'color: #a7f3d0;');
      } else {
        console.log('%c🔴 EASY MODE DISATTIVATA!', 'color: #ef4444; font-weight: bold; font-size: 14px;');
      }
      return targetState ? 'Easy Mode: ON' : 'Easy Mode: OFF';
    };
    console.log('%c💡 Suggerimento: Digita easyMode() in console per attivare/disattivare la Easy Mode!', 'color: #8b5cf6; font-weight: bold;');

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
        // The save may belong to a different book than the one loaded at startup
        // (e.g. the player continued into Book 2 before saving).
        if (saveData.bookId && saveData.bookId !== this.bookData.bookId) {
          this.bookData = await bookLoader.loadBook(saveData.bookId);
        }
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

  async showBook2Transition() {
    this.screenManager.showLoadingScreen('Caricamento Libro 2...');

    try {
      const book2Data = await bookLoader.loadBook('02-fire-on-the-water');

      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="app-header">
          <div class="container">
            <h1 style="margin: 0;">🐺 Lupo Solitario</h1>
          </div>
        </div>
        <div class="app-main">
          <div class="container">
            <div id="book2-transition-container"></div>
          </div>
        </div>
      `;

      const transition = new Book2Transition(() => {
        this.bookData = book2Data;
        gameState.switchBook('02-fire-on-the-water', 2, 1);
        this.showGameScreen();
      });

      const container = document.getElementById('book2-transition-container');
      container.appendChild(transition.render());
    } catch (error) {
      console.error('Error loading Book 2:', error);
      this.screenManager.showErrorScreen('Errore nel caricamento del Libro 2');
    }
  }

  async showBook3Transition() {
    this.screenManager.showLoadingScreen('Caricamento Libro 3...');

    try {
      const book3Data = await bookLoader.loadBook('03-the-caverns-of-kalte');

      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="app-header">
          <div class="container">
            <h1 style="margin: 0;">🐺 Lupo Solitario</h1>
          </div>
        </div>
        <div class="app-main">
          <div class="container">
            <div id="book3-transition-container"></div>
          </div>
        </div>
      `;

      const transition = new Book3Transition(() => {
        this.bookData = book3Data;
        gameState.switchBook('03-the-caverns-of-kalte', 3, 1);
        this.showGameScreen();
      });

      const container = document.getElementById('book3-transition-container');
      container.appendChild(transition.render());
    } catch (error) {
      console.error('Error loading Book 3:', error);
      this.screenManager.showErrorScreen('Errore nel caricamento del Libro 3');
    }
  }

  async showBook4Transition() {
    this.screenManager.showLoadingScreen('Caricamento Libro 4...');

    try {
      const book4Data = await bookLoader.loadBook('04-the-chasm-of-doom');

      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="app-header">
          <div class="container">
            <h1 style="margin: 0;">🐺 Lupo Solitario</h1>
          </div>
        </div>
        <div class="app-main">
          <div class="container">
            <div id="book4-transition-container"></div>
          </div>
        </div>
      `;

      const transition = new Book4Transition(() => {
        this.bookData = book4Data;
        gameState.switchBook('04-the-chasm-of-doom', 4, 1);
        this.showGameScreen();
      });

      const container = document.getElementById('book4-transition-container');
      container.appendChild(transition.render());
    } catch (error) {
      console.error('Error loading Book 4:', error);
      this.screenManager.showErrorScreen('Errore nel caricamento del Libro 4');
    }
  }

  async showBook5Transition() {
    this.screenManager.showLoadingScreen('Caricamento Libro 5...');

    try {
      const book5Data = await bookLoader.loadBook('05-shadow-on-the-sand');

      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="app-header">
          <div class="container">
            <h1 style="margin: 0;">🐺 Lupo Solitario</h1>
          </div>
        </div>
        <div class="app-main">
          <div class="container">
            <div id="book5-transition-container"></div>
          </div>
        </div>
      `;

      const transition = new Book5Transition(() => {
        this.bookData = book5Data;
        gameState.switchBook('05-shadow-on-the-sand', 5, 1);
        this.showGameScreen();
      });

      const container = document.getElementById('book5-transition-container');
      container.appendChild(transition.render());
    } catch (error) {
      console.error('Error loading Book 5:', error);
      this.screenManager.showErrorScreen('Errore nel caricamento del Libro 5');
    }
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

    // Create story reader - the "continue to next book" hook depends on which
    // book is currently active (Book 1 -> 2, Book 2 -> 3; Book 3 has no sequel yet)
    const bookNumber = gameState.getState().bookNumber;
    const onContinueNextBook = bookNumber === 1 ? () => this.showBook2Transition()
      : bookNumber === 2 ? () => this.showBook3Transition()
      : bookNumber === 3 ? () => this.showBook4Transition()
      : bookNumber === 4 ? () => this.showBook5Transition()
      : null;
    this.storyReader = new StoryReader(this.bookData, onContinueNextBook);
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
