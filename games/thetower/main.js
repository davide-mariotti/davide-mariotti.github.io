// games/thetower/main.js
const config = {
    type: Phaser.AUTO,
    width: 500,
    height: 500,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

let tower, enemies, marketplace, ui;
let coins = 0;
let exp = 0;
let level = 1;
let enemyCount = 0;
const EXP_PER_ENEMY = 1;
const BASE_LEVEL_UP_EXP = 10;
const EXP_MULTIPLIER = 1.2;
const ENEMIES_PER_FLOOR = 20; // Aggiungi questa riga
let currentFloor = 1;
let enemiesDefeated = 0;
let gameOverShown = false;
let debugConsole;
let killCount = 0;
let bossSpawned = false;

function saveGameState() {
    const gameState = {
        coins: coins,
        upgrades: {
            health: tower.maxHealth,
            damage: tower.damage,
            attackRate: tower.attackRate
        }
    };
    localStorage.setItem('towerDefenseGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('towerDefenseGameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        coins = gameState.coins || 0;
        tower.maxHealth = gameState.upgrades.health;
        tower.health = tower.maxHealth;
        tower.damage = gameState.upgrades.damage;
        tower.attackRate = gameState.upgrades.attackRate;
    }
}

function preload() {
    this.load.image('tower', 'img/tower.png');
    this.load.image('enemy', 'img/enemy.png');
    this.load.image('boss', 'img/boss.png');  // Aggiungi questa riga
    this.load.image('projectile', 'img/projectile.png');
}

function create() {
    // Resetta le variabili globali
    gameOverShown = false;
    enemies = this.physics.add.group();
    tower = new Tower(this, enemies);
    marketplace = new Marketplace(this, tower, enemies);
    ui = new UI(this, tower);
    debugConsole = new DebugConsole(this, tower, enemies);

    // Carica lo stato del gioco salvato
    loadGameState();

    // Ricrea il timer per generare nemici
    if (this.enemySpawnTimer) {
        this.enemySpawnTimer.remove();
    }
    this.enemySpawnTimer = this.time.addEvent({
        delay: 5000 / currentFloor,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    // Ricrea gli eventi
    this.events.removeAllListeners('gameOver');
    this.events.removeAllListeners('updateUI');
    this.events.on('gameOver', showGameOver, this);
    this.events.on('updateUI', updateUI, this);

    // Aggiungi il bordo al gioco
    this.add.rectangle(0, 0, 500, 500, 0xffffff, 0).setOrigin(0, 0).setStrokeStyle(2, 0xffffff);

    // Aggiungi un listener per la combinazione di tasti Ctrl+Shift+D
    this.input.keyboard.on('keydown-D', (event) => {
        if (event.ctrlKey && event.shiftKey) {
            debugConsole.toggle();
        }
    });

    // Aggiorna l'interfaccia utente
    updateUI();

    killCount = 0;
}

function update(time, delta) {
    if ((debugConsole && debugConsole.isVisible) || (marketplace && marketplace.isVisible)) {
        return;
    }

    if (tower.health > 0) {
        tower.update(time, delta);

        enemies.getChildren().forEach(enemySprite => {
            const enemy = enemySprite.getData('enemyObject');
            if (enemy && enemy.update) {
                enemy.update(time);
            }
        });

        // Check if level up is possible
        if (exp >= getNextLevelExp(level)) {
            levelUp();
        }
    }

    if (tower.health <= 0 && !gameOverShown) {
        this.events.emit('gameOver');
    }

    updateUI();
}

function spawnEnemy() {
    const isBossFloor = currentFloor % 10 === 0;
    
    if (isBossFloor && bossSpawned) {
        return; // Non generare più nemici se il boss è già stato generato
    }

    const isBoss = isBossFloor && !bossSpawned;
    const enemy = new Enemy(this, enemies, tower, currentFloor, isBoss);
    
    if (isBoss) {
        bossSpawned = true;
        debugLogger.log(`Boss spawned on floor ${currentFloor}`);
    }

    enemyCount++;

    if (enemyCount >= ENEMIES_PER_FLOOR || (isBossFloor && bossSpawned)) {
        enemyCount = 0;
        currentFloor++;
        bossSpawned = false;
        this.events.emit('updateUI');
    }

    // Adjust spawn rate based on floor
    this.enemySpawnTimer.delay = Math.max(1000, 5000 / Math.sqrt(currentFloor));
}

function getNextLevelExp(currentLevel) {
    return Math.floor(BASE_LEVEL_UP_EXP * Math.pow(EXP_MULTIPLIER, currentLevel - 1));
}

function levelUp() {
    level++;
    exp -= getNextLevelExp(level - 1);
    tower.levelUp();
    updateUI();
}

function showGameOver() {
    if (gameOverShown) return;
    gameOverShown = true;

    this.physics.pause();
    
    // If debug console is visible, hide it
    if (debugConsole && debugConsole.isVisible) {
        debugConsole.toggle();
    }

    // Se il marketplace è visibile, nascondilo
    if (marketplace && marketplace.isVisible) {
        marketplace.hide();
    }

    const gameOverText = this.add.text(250, 200, 'Game Over', { fontSize: '32px', fill: '#ffffff' });
    gameOverText.setOrigin(0.5);

    const marketplaceButton = this.add.text(250, 250, 'Go to Marketplace', { fontSize: '24px', fill: '#ffffff' });
    marketplaceButton.setOrigin(0.5);
    marketplaceButton.setInteractive({ useHandCursor: true });
    marketplaceButton.on('pointerdown', () => {
        if (this.autoplayTimer) {
            this.autoplayTimer.remove();
        }
        gameOverText.destroy();
        marketplaceButton.destroy();
        marketplace.show();
    });

    // Aggiungi un timer per il restart automatico
    this.autoplayTimer = this.time.delayedCall(5000, () => {
        gameOverText.destroy();
        marketplaceButton.destroy();
        resetGame.call(this);
    }, [], this);

    // Aggiungi un testo per il conto alla rovescia
    const countdownText = this.add.text(250, 300, 'Autoplay in 5...', { fontSize: '18px', fill: '#ffffff' });
    countdownText.setOrigin(0.5);

    // Aggiorna il testo del conto alla rovescia ogni secondo
    this.time.addEvent({
        delay: 1000,
        repeat: 4,
        callback: () => {
            const remainingTime = Math.ceil((this.autoplayTimer.delay - this.autoplayTimer.elapsed) / 1000);
            countdownText.setText(`Autoplay in ${remainingTime}...`);
            if (remainingTime <= 0) {
                countdownText.destroy();
            }
        }
    });
}

function resetGame() {
    debugLogger.clear();

    // Rimuovi il timer di autoplay se esiste
    if (this.autoplayTimer) {
        this.autoplayTimer.remove();
    }

    // Salva le monete attuali e gli upgrade acquistati
    const currentCoins = coins;
    const boughtUpgrades = {
        health: tower.maxHealth,
        damage: tower.damage,
        attackRate: tower.attackRate
    };

    // Remove all existing enemies
    enemies.clear(true, true);
    
    // Reset global variables
    coins = currentCoins;
    exp = 0;
    level = 1;
    currentFloor = 1;
    enemiesDefeated = 0;
    killCount = 0;
    bossSpawned = false;

    // Reset the tower with bought upgrades
    tower.reset(boughtUpgrades);

    // Recreate the enemy spawn timer
    if (this.enemySpawnTimer) {
        this.enemySpawnTimer.remove();
    }
    this.enemySpawnTimer = this.time.addEvent({
        delay: 5000 / currentFloor,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    // Update the user interface
    updateUI();

    // Resume the game
    this.physics.resume();
    this.time.paused = false;
    if (this.enemySpawnTimer) {
        this.enemySpawnTimer.paused = false;
    }

    gameOverShown = false;
    this.events.removeListener('gameOver');
    this.events.on('gameOver', showGameOver, this);

    debugLogger.log("Game reset. Stats:", {
        coins: coins,
        towerHealth: tower.health,
        towerMaxHealth: tower.maxHealth,
        towerDamage: tower.damage,
        towerAttackRate: tower.attackRate
    });
}

function updateUI() {
    ui.update(coins, exp, level, currentFloor, killCount);
}

window.addEventListener('beforeunload', saveGameState);
