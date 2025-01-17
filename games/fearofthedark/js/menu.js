class MenuManager {
    constructor() {
        this.initializeMenuListeners();
        this.initializeCharacterCreation();
    }

    initializeMenuListeners() {
        document.getElementById('new-game').addEventListener('click', () => {
            this.showCharacterCreation();
        });

        document.getElementById('load-game').addEventListener('click', () => {
            console.log('Caricamento partita');
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
} 