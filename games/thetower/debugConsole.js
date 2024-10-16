class DebugConsole {
    constructor(scene, tower, enemies) {
        this.scene = scene;
        this.tower = tower;
        this.enemies = enemies;
        this.isVisible = false;
        this.container = null;
        this.inputs = [];
        this.createConsole();
    }

    createConsole() {
        this.container = this.scene.add.container(250, 250);
        this.container.setVisible(false);

        const background = this.scene.add.rectangle(0, 0, 400, 350, 0x444444);
        background.setOrigin(0.5);
        background.setStrokeStyle(2, 0xffffff);
        this.container.add(background);

        const title = this.scene.add.text(0, -145, 'Debug Console', { fontSize: '24px', fill: '#ffffff' });
        title.setOrigin(0.5);
        this.container.add(title);

        this.createInputField('Coins', -180, -100);
        this.createInputField('Tower Max HP', -180, -60);
        this.createInputField('Tower HP', -180, -20);
        this.createInputField('Tower DMG', -180, 20);
        this.createInputField('Tower ATK Rate', -180, 60);
        this.createInputField('Floor', -180, 100);

        const resetButton = this.scene.add.text(0, 140, 'Reset Game', { fontSize: '20px', fill: '#ffffff' });
        resetButton.setOrigin(0.5);
        resetButton.setInteractive({ useHandCursor: true });
        resetButton.on('pointerdown', () => this.resetGame());
        this.container.add(resetButton);

        const closeButton = this.scene.add.text(180, -165, 'X', { fontSize: '20px', fill: '#ffffff' });
        closeButton.setInteractive({ useHandCursor: true });
        closeButton.on('pointerdown', () => this.toggle());
        this.container.add(closeButton);
    }

    createInputField(label, x, y) {
        const text = this.scene.add.text(x, y, `${label}: `, { fontSize: '16px', fill: '#ffffff' });
        this.container.add(text);

        const input = document.createElement('input');
        input.style.position = 'absolute';
        input.style.width = '80px';
        input.style.display = 'none';
        input.style.backgroundColor = '#666666';
        input.style.color = '#ffffff';
        input.style.border = '1px solid #ffffff';
        input.style.padding = '2px';

        const updateInputPosition = () => {
            const gameCanvas = this.scene.game.canvas;
            const boundingRect = gameCanvas.getBoundingClientRect();
            input.style.left = `${boundingRect.left + this.container.x + x + text.width + 10}px`;
            input.style.top = `${boundingRect.top + this.container.y + y - 10}px`;
        };

        const updateInputValue = () => {
            let value;
            switch(label) {
                case 'Coins': value = coins; break;
                case 'Tower Max HP': value = this.tower.maxHealth; break;
                case 'Tower HP': value = this.tower.health; break;
                case 'Tower DMG': value = this.tower.damage; break;
                case 'Tower ATK Rate': value = this.tower.attackRate; break;
                case 'Floor': value = currentFloor; break;
            }
            input.value = value.toFixed(2);
        };

        window.addEventListener('resize', updateInputPosition);
        updateInputPosition();
        updateInputValue();

        input.addEventListener('change', (e) => {
            let value = parseFloat(e.target.value);
            switch(label) {
                case 'Coins':
                    coins = Math.floor(value);
                    break;
                case 'Tower Max HP':
                    this.tower.maxHealth = value;
                    this.tower.health = Math.min(this.tower.health, this.tower.maxHealth);
                    break;
                case 'Tower HP':
                    this.tower.health = Math.min(value, this.tower.maxHealth);
                    break;
                case 'Tower DMG':
                    this.tower.damage = value;
                    break;
                case 'Tower ATK Rate':
                    this.tower.attackRate = value;
                    break;
                case 'Floor':
                    currentFloor = Math.floor(value);
                    bossSpawned = false;
                    break;
            }
            updateInputValue();
            this.scene.events.emit('updateUI');
        });

        document.body.appendChild(input);
        this.inputs.push({ input, updatePosition: updateInputPosition, updateValue: updateInputValue });
    }

    toggle() {
        this.isVisible = !this.isVisible;
        this.container.setVisible(this.isVisible);
        this.inputs.forEach(({ input, updatePosition, updateValue }) => {
            input.style.display = this.isVisible ? 'block' : 'none';
            if (this.isVisible) {
                updatePosition();
                updateValue();
            }
        });

        // Pausa o riprendi il gioco
        if (this.isVisible) {
            this.pauseGame();
        } else {
            this.resumeGame();
        }
    }

    pauseGame() {
        this.scene.physics.pause();
        this.scene.time.paused = true;
        if (this.scene.enemySpawnTimer) {
            this.scene.enemySpawnTimer.paused = true;
        }
        // Pause all enemies
        this.enemies.getChildren().forEach(enemy => {
            const enemyObject = enemy.getData('enemyObject');
            if (enemyObject) {
                enemyObject.pause();
            }
        });
    }

    resumeGame() {
        this.scene.physics.resume();
        this.scene.time.paused = false;
        if (this.scene.enemySpawnTimer) {
            this.scene.enemySpawnTimer.paused = false;
        }
        // Resume all enemies
        this.enemies.getChildren().forEach(enemy => {
            const enemyObject = enemy.getData('enemyObject');
            if (enemyObject) {
                enemyObject.resume();
            }
        });

        // Check if the tower's health is 0 when resuming
        if (this.tower.health <= 0) {
            this.scene.events.emit('gameOver');
        }
    }

    destroy() {
        this.inputs.forEach(({ input }) => input.remove());
        window.removeEventListener('resize', this.updateAllInputPositions);
        this.container.destroy();
        // Assicurati che il gioco riprenda se la console viene distrutta mentre è visibile
        if (this.isVisible) {
            this.resumeGame();
        }
    }

    updateAllInputPositions = () => {
        this.inputs.forEach(({ updatePosition }) => updatePosition());
    }

    updateAllInputValues = () => {
        this.inputs.forEach(({ updateValue }) => updateValue());
    }

    resetGame() {
        const confirmReset = confirm("Warning! You are about to reset the game. You will lose all progress saved in the browser. Do you want to continue?");
        
        if (confirmReset) {
            coins = 0;
            exp = 0;
            level = 1;
            currentFloor = 1;
            enemiesDefeated = 0;
            killCount = 0;
            this.tower.maxHealth = 10;
            this.tower.health = 10;
            this.tower.damage = 1;
            this.tower.attackRate = 2000;
            this.updateAllInputValues();
            this.scene.events.emit('updateUI');
            
            // Remove saved data from localStorage
            localStorage.removeItem('towerDefenseGameState');
            
            // Resume the game after reset
            this.resumeGame();
            this.scene.events.emit('resetGame');
            
            alert("The game has been reset. All progress has been erased.");
        }
    }
}
