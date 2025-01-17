class MenuManager {
    constructor() {
        this.saveManager = new SaveManager();
        this.settings = new Settings();
        this.bindingInProgress = false;
        this.setupEventListeners();
        this.updateSettingsUI();
        this.initializeMenuListeners();
        this.initializeCharacterCreation();
    }

    initializeMenuListeners() {
        document.getElementById('new-game').addEventListener('click', () => {
            this.showCharacterCreation();
        });

        document.getElementById('load-game').addEventListener('click', () => {
            this.showLoadScreen();
        });

        document.getElementById('settings').addEventListener('click', () => {
            console.log('Apertura impostazioni');
        });
    }

    initializeCharacterCreation() {
        const classSelect = document.getElementById('char-class');
        const subclassSelect = document.getElementById('char-subclass');
        const createButton = document.getElementById('create-character');

        // Aggiorna le sottoclassi quando viene selezionata una classe
        classSelect.addEventListener('change', () => {
            const selectedClass = classSelect.value;
            this.updateSubclasses(selectedClass);
            this.updateCharacterPreview(selectedClass);
        });

        // Gestisce la creazione del personaggio
        createButton.addEventListener('click', () => {
            const name = document.getElementById('char-name').value;
            const characterClass = classSelect.value;
            const subclass = subclassSelect.value;

            if (!name) {
                alert('Inserisci un nome per il tuo personaggio!');
                return;
            }

            const character = new Character(name, characterClass, subclass);
            window.game.startGame(character);
        });

        // Inizializza le sottoclassi per la classe predefinita
        this.updateSubclasses(classSelect.value);
        this.updateCharacterPreview(classSelect.value);
    }

    showCharacterCreation() {
        document.getElementById('menu-screen').style.display = 'none';
        document.getElementById('character-creation').style.display = 'block';
    }

    updateSubclasses(characterClass) {
        const subclassSelect = document.getElementById('char-subclass');
        const subclasses = CHARACTER_CLASSES[characterClass].subclasses;
        
        subclassSelect.innerHTML = '';
        subclasses.forEach(subclass => {
            const option = document.createElement('option');
            option.value = subclass;
            option.textContent = subclass;
            subclassSelect.appendChild(option);
        });
    }

    updateCharacterPreview(characterClass) {
        const stats = CHARACTER_CLASSES[characterClass].baseStats;
        const description = CHARACTER_CLASSES[characterClass].description;
        const statsContainer = document.getElementById('stats-container');
        const descriptionText = document.getElementById('class-description-text');

        // Aggiorna la descrizione
        descriptionText.textContent = description;

        // Aggiorna le statistiche
        statsContainer.innerHTML = '';
        Object.entries(stats).forEach(([stat, value]) => {
            const statBar = document.createElement('div');
            statBar.innerHTML = `
                <label>${this.formatStatName(stat)}: ${value}</label>
                <div class="stat-bar">
                    <div class="stat-fill" style="width: ${(value / 20) * 100}%"></div>
                </div>
            `;
            statsContainer.appendChild(statBar);
        });
    }

    formatStatName(stat) {
        const statNames = {
            hp: 'Vita',
            mp: 'Mana',
            strength: 'Forza',
            intelligence: 'Intelligenza',
            dexterity: 'Destrezza'
        };
        return statNames[stat] || stat;
    }

    setupEventListeners() {
        // Settings button nel menu principale
        document.getElementById('settings').addEventListener('click', () => {
            document.getElementById('menu-screen').style.display = 'none';
            document.getElementById('settings-screen').style.display = 'block';
        });

        // Gestione controlli
        document.querySelectorAll('.bind-button').forEach(button => {
            button.addEventListener('click', (e) => this.startBinding(e.target));
        });

        // Gestione audio
        document.querySelectorAll('.volume-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const type = e.target.dataset.volume;
                this.settings.audio[type] = parseInt(e.target.value) / 100;
                this.settings.saveSettings();
            });
        });

        // Gestione UI
        document.querySelectorAll('[data-ui]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const option = e.target.dataset.ui;
                this.settings.ui[option] = e.target.checked;
                this.settings.saveSettings();
                this.applyUISettings();
            });
        });

        // Pulsanti del menu impostazioni
        document.getElementById('save-settings').addEventListener('click', () => {
            this.settings.saveSettings();
            this.showMessage('Impostazioni salvate!');
        });

        document.getElementById('reset-settings').addEventListener('click', () => {
            if (confirm('Sei sicuro di voler ripristinare le impostazioni predefinite?')) {
                localStorage.removeItem('gameSettings');
                this.settings = new Settings();
                this.updateSettingsUI();
                this.showMessage('Impostazioni ripristinate!');
            }
        });

        document.getElementById('back-to-menu').addEventListener('click', () => {
            document.getElementById('settings-screen').style.display = 'none';
            document.getElementById('menu-screen').style.display = 'flex';
        });

        // Listener per il binding dei tasti
        window.addEventListener('keydown', (e) => {
            if (this.bindingInProgress) {
                e.preventDefault();
                this.completeBinding(e.code);
            }
        });

        document.getElementById('back-from-load').addEventListener('click', () => {
            document.getElementById('load-screen').style.display = 'none';
            document.getElementById('menu-screen').style.display = 'flex';
        });
    }

    startBinding(button) {
        if (this.bindingInProgress) return;
        
        this.bindingInProgress = true;
        this.currentBindingButton = button;
        button.classList.add('listening');
        button.textContent = 'Premi un tasto...';
    }

    completeBinding(keyCode) {
        if (!this.bindingInProgress) return;

        const action = this.currentBindingButton.dataset.action;
        this.settings.controls[action] = keyCode;
        this.currentBindingButton.textContent = this.getKeyDisplayName(keyCode);
        this.currentBindingButton.classList.remove('listening');
        this.bindingInProgress = false;
        this.settings.saveSettings();
    }

    updateSettingsUI() {
        // Aggiorna i pulsanti dei controlli
        for (const [action, key] of Object.entries(this.settings.controls)) {
            const button = document.querySelector(`.bind-button[data-action="${action}"]`);
            if (button) {
                button.textContent = this.getKeyDisplayName(key);
            }
        }

        // Aggiorna gli slider del volume
        for (const [type, value] of Object.entries(this.settings.audio)) {
            const slider = document.querySelector(`.volume-slider[data-volume="${type}"]`);
            if (slider) {
                slider.value = value * 100;
            }
        }

        // Aggiorna le checkbox dell'UI
        for (const [option, value] of Object.entries(this.settings.ui)) {
            const checkbox = document.querySelector(`[data-ui="${option}"]`);
            if (checkbox) {
                checkbox.checked = value;
            }
        }
    }

    getKeyDisplayName(keyCode) {
        const keyNames = {
            'Space': 'Spazio',
            'ShiftLeft': 'Shift',
            'ArrowLeft': '←',
            'ArrowRight': '→',
            'ArrowUp': '↑',
            'ArrowDown': '↓'
        };
        return keyNames[keyCode] || keyCode.replace('Key', '');
    }

    showMessage(text, duration = 2000) {
        const message = document.createElement('div');
        message.className = 'settings-message';
        message.textContent = text;
        document.querySelector('.settings-container').appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, duration);
    }

    applyUISettings() {
        const gameUI = document.getElementById('game-ui');
        if (gameUI) {
            gameUI.style.display = this.settings.ui.showHUD ? 'block' : 'none';
        }
        
        if (window.game && window.game.debug) {
            window.game.debug.showFPS = this.settings.ui.showFPS;
        }
    }

    showLoadScreen() {
        document.getElementById('menu-screen').style.display = 'none';
        document.getElementById('load-screen').style.display = 'block';
        this.updateSaveSlots();
    }

    updateSaveSlots() {
        const container = document.querySelector('.save-slots');
        container.innerHTML = '';
        
        const saves = this.saveManager.getAllSaves();
        saves.forEach(save => {
            const slot = document.createElement('div');
            slot.className = `save-slot ${save.empty ? 'empty' : ''}`;
            
            if (save.empty) {
                slot.innerHTML = `
                    <div class="save-info">
                        <h3>Slot ${save.slot} - Vuoto</h3>
                    </div>
                `;
            } else {
                slot.innerHTML = `
                    <div class="save-info">
                        <h3>Slot ${save.slot}</h3>
                        <p>${save.character.name} - ${save.character.subclass} Liv.${save.character.level}</p>
                        <p>Salvato il: ${this.saveManager.formatSaveDate(save.timestamp)}</p>
                        <p>Zona: ${save.levelName}</p>
                    </div>
                    <div class="save-actions">
                        <button class="save-slot-button load" data-slot="${save.slot}">Carica</button>
                        <button class="save-slot-button delete" data-slot="${save.slot}">Elimina</button>
                    </div>
                `;

                slot.querySelector('.load').addEventListener('click', () => {
                    this.loadGameFromSlot(save.slot);
                });

                slot.querySelector('.delete').addEventListener('click', () => {
                    if (confirm('Sei sicuro di voler eliminare questo salvataggio?')) {
                        this.saveManager.deleteSave(save.slot);
                        this.updateSaveSlots();
                    }
                });
            }
            
            container.appendChild(slot);
        });
    }

    loadGameFromSlot(slot) {
        const saveData = this.saveManager.loadGame(slot);
        if (saveData) {
            const character = new Character(
                saveData.character.name,
                saveData.character.characterClass,
                saveData.character.subclass
            );
            
            // Ripristina lo stato del personaggio
            Object.assign(character, saveData.character);
            
            // Avvia il gioco con il personaggio caricato
            window.game.startGame(character, saveData);
        }
    }
} 