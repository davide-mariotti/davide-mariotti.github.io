class Game {
    constructor() {
        this.menuManager = new MenuManager();
        this.character = null;
        this.player = null;
        this.level = null;
        this.physics = new Physics();
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.debug = new Debug();
        window.debug = this.debug;
        this.initialize();
        this.isPaused = false;
        this.setupPauseMenu();
        this.camera = new Camera(800, 600); // Dimensioni del canvas
        this.currentLevel = 1;
        this.hotbarUI = null;
        this.audioManager = new AudioManager();
        this.skillUI = null;
        this.questManager = new QuestManager();
        this.questUI = null;
        this.dialogueSystem = new DialogueSystem();
        this.dialogueUI = new DialogueUI();
        this.craftingSystem = new CraftingSystem();
        this.craftingUI = null;
        this.tradingSystem = new TradingSystem();
        this.tradingUI = null;
    }

    initialize() {
        console.log('Gioco inizializzato');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    startGame(character, saveData = null) {
        this.character = character;
        document.getElementById('character-creation').style.display = 'none';
        document.getElementById('load-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        // Crea il livello con il numero corrente
        this.level = new Level(19, this.currentLevel);
        
        // Se c'è un saveData, usa la posizione salvata, altrimenti usa quella di default
        const startX = saveData ? saveData.position.x : 100;
        const startY = saveData ? saveData.position.y : 100;
        
        // Crea il player
        this.player = new Player(startX, startY, character);
        
        // Inizializza le UI
        this.hotbarUI = new HotbarUI(this.player);
        this.skillUI = new SkillUI(this.player);
        this.questUI = new QuestUI(this.player);
        this.craftingUI = new CraftingUI(this.player);
        this.tradingUI = new TradingUI(this.player);
        
        // Attiva la prima quest principale
        this.questManager.activateQuest('main_01');
        
        // Avvia il game loop
        this.gameLoop();
    }

    getGameState() {
        return {
            character: this.character,
            player: this.player,
            level: {
                id: 1, // Per ora abbiamo solo un livello
                name: 'Level 1'
            }
        };
    }

    saveGame(slot) {
        const gameState = this.getGameState();
        const success = this.menuManager.saveManager.saveGame(slot, gameState);
        if (success) {
            console.log(`Gioco salvato nello slot ${slot}`);
        } else {
            console.error(`Errore nel salvataggio nello slot ${slot}`);
        }
        return success;
    }

    setupPauseMenu() {
        // Gestione tasto ESC per la pausa
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && this.player) {
                this.togglePause();
            }
        });

        // Pulsanti del menu di pausa
        document.getElementById('resume-game').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('save-game').addEventListener('click', () => {
            document.querySelector('.pause-container').style.display = 'none';
            document.querySelector('.save-container').style.display = 'block';
            this.showSaveSlots();
        });

        document.getElementById('quit-game').addEventListener('click', () => {
            if (confirm('Sei sicuro di voler uscire? I progressi non salvati andranno persi.')) {
                this.quitGame();
            }
        });

        document.getElementById('back-to-pause').addEventListener('click', () => {
            document.querySelector('.save-container').style.display = 'none';
            document.querySelector('.pause-container').style.display = 'block';
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseMenu = document.getElementById('pause-menu');
        pauseMenu.style.display = this.isPaused ? 'flex' : 'none';
        
        // Resetta la visualizzazione del menu di pausa
        document.querySelector('.pause-container').style.display = 'block';
        document.querySelector('.save-container').style.display = 'none';
    }

    showSaveSlots() {
        const container = document.querySelector('#pause-menu .save-slots');
        container.innerHTML = '';
        
        const saves = this.menuManager.saveManager.getAllSaves();
        saves.forEach(save => {
            const slot = document.createElement('div');
            slot.className = `save-slot ${save.empty ? 'empty' : ''}`;
            
            if (save.empty) {
                slot.innerHTML = `
                    <div class="save-info">
                        <h3>Slot ${save.slot} - Vuoto</h3>
                        <button class="save-slot-button save" data-slot="${save.slot}">Salva</button>
                    </div>
                `;
            } else {
                slot.innerHTML = `
                    <div class="save-info">
                        <h3>Slot ${save.slot}</h3>
                        <p>${save.character.name} - ${save.character.subclass} Liv.${save.character.level}</p>
                        <p>Salvato il: ${this.menuManager.saveManager.formatSaveDate(save.timestamp)}</p>
                        <button class="save-slot-button save" data-slot="${save.slot}">Sovrascrivi</button>
                    </div>
                `;
            }

            slot.querySelector('.save').addEventListener('click', (e) => {
                const slotNum = e.target.dataset.slot;
                if (!save.empty && !confirm('Vuoi sovrascrivere questo salvataggio?')) {
                    return;
                }
                if (this.saveGame(slotNum)) {
                    alert('Partita salvata con successo!');
                    this.togglePause();
                }
            });
            
            container.appendChild(slot);
        });
    }

    quitGame() {
        this.isPaused = false;
        this.player = null;
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('pause-menu').style.display = 'none';
        document.getElementById('menu-screen').style.display = 'flex';
    }

    nextLevel() {
        this.currentLevel++;
        this.level = new Level(19, this.currentLevel);
        this.player.x = 100; // Reset della posizione del player
        this.player.y = 100;
    }

    gameLoop() {
        if (!this.isPaused) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Aggiorna la camera
            this.camera.follow(this.player, this.level);
            
            // Applica la trasformazione della camera
            this.camera.apply(this.ctx);
            
            // Aggiorna e disegna il livello
            this.level.update(this.player);
            this.level.draw(this.ctx);
            
            // Controlla collisioni con i nemici
            this.level.checkEnemyCollisions(this.player);
            
            // Aggiorna e disegna il player
            this.player.update();
            this.player.draw(this.ctx);
            
            // Ripristina il contesto
            this.camera.restore(this.ctx);
            
            // Disegna l'UI sopra tutto
            this.drawUI();
            if (this.hotbarUI) {
                this.hotbarUI.updateUI();
            }
            
            // Aggiorna le quest
            this.questManager.update(this.player);
        }
        requestAnimationFrame(() => this.gameLoop());
    }

    drawUI() {
        // Disegna il debug se attivo
        this.debug.update();
        this.debug.draw(this.ctx, this);

        // Disegna l'indicatore di livello
        ctx.save();
        ctx.fillStyle = '#ffd700';
        ctx.font = '20px Arial';
        ctx.fillText(`Livello ${this.currentLevel}`, 10, 30);
        ctx.restore();

        // Controlla se il player ha raggiunto la fine del livello
        if (this.player && this.level) {
            const endX = (this.level.width - 7) * this.level.tileSize; // Posizione della piattaforma finale
            if (this.player.x >= endX) {
                this.showLevelComplete();
            }
        }
    }

    showLevelComplete() {
        this.isPaused = true;
        
        // Crea e mostra il messaggio di completamento livello
        const message = document.createElement('div');
        message.className = 'level-complete';
        message.innerHTML = `
            <h2>Livello ${this.currentLevel} Completato!</h2>
            <button class="menu-button" id="next-level">Continua</button>
        `;
        
        document.getElementById('game-screen').appendChild(message);
        
        document.getElementById('next-level').addEventListener('click', () => {
            message.remove();
            this.isPaused = false;
            this.nextLevel();
        }, { once: true }); // L'evento viene rimosso dopo il primo click
    }
}

// Avvia il gioco quando la pagina è completamente caricata
window.addEventListener('load', () => {
    window.game = new Game();
}); 