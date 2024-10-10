// Configurazione di Phaser
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        width: '100%',
        height: '100%'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let fruits;
let badObjects;
let cursors;
let score = 0;
let scoreText;
let gameTimer;
let timeLeft = 60;
let timeText;
let level = 1;
let levelText;

let gameOver = false;
let gameOverText;
let restartButton;

let highScore = 0; // Make sure this is at the top of your file with other global variables

let gameOverBg; // Add this at the top of your file with other global variables

function preload() {
    this.load.image('background', 'img/background.png');
    this.load.image('player', 'img/basket.png');
    this.load.image('fruit', 'img/apple.png');
    this.load.image('bad', 'img/rock.png');
    this.load.image('powerup', 'img/star.png');
}

function create() {
    // Aggiungi sfondo
    this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Cesto del giocatore
    player = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height * 0.9, 'player')
        .setCollideWorldBounds(true);

    // Adatta la dimensione del player
    player.setDisplaySize(this.cameras.main.width * 0.1, this.cameras.main.width * 0.1);

    // Frutti
    fruits = this.physics.add.group({
        key: 'fruit',
        repeat: 5, // Numero di frutti iniziali
        setXY: { x: 12, y: 0, stepX: 150 }
    });

    // Oggetti da evitare
    badObjects = this.physics.add.group();

    // Punteggio
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' })
        .setScrollFactor(0);

    // Add or update the high score text with white color
    highScoreText = this.add.text(this.scale.width - 16, 16, 'Record: ' + highScore, { fontSize: '32px', fill: '#ffffff' })
        .setOrigin(1, 0) // Align to right
        .setScrollFactor(0);

    // Timer
    timeText = this.add.text(16, 50, 'Time: ' + timeLeft, { fontSize: '32px', fill: '#ffffff' })
        .setScrollFactor(0);

    levelText = this.add.text(16, 84, 'Level: ' + level, { fontSize: '32px', fill: '#ffffff' })
        .setScrollFactor(0);

    // Power-ups
    this.powerups = this.physics.add.group();
    this.physics.add.overlap(player, this.powerups, collectPowerup, null, this);

    // Collisioni
    this.physics.add.overlap(player, fruits, collectFruit, null, this);
    this.physics.add.overlap(player, badObjects, hitBadObject, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    // Gestisci il ridimensionamento
    this.scale.on('resize', resize, this);

    this.endGame = endGame;
}

function update() {
    if (gameOver) {
        return;
    }

    // Movimenti del cesto
    if (cursors.left.isDown) {
        player.setVelocityX(-this.cameras.main.width * 0.3);
    } else if (cursors.right.isDown) {
        player.setVelocityX(this.cameras.main.width * 0.3);
    } else {
        player.setVelocityX(0);
    }

    // Aggiungi nuovi frutti e oggetti da evitare casualmente
    if (Phaser.Math.Between(0, 100) < 2) {
        const fruit = fruits.create(Phaser.Math.Between(0, this.cameras.main.width), 0, 'fruit');
        fruit.setDisplaySize(this.cameras.main.width * 0.05, this.cameras.main.width * 0.05);
        fruit.setVelocityY(this.cameras.main.height * 0.3);
    }

    if (Phaser.Math.Between(0, 100) < 1) {
        const bad = badObjects.create(Phaser.Math.Between(0, this.cameras.main.width), 0, 'bad');
        bad.setDisplaySize(this.cameras.main.width * 0.05, this.cameras.main.width * 0.05);
        bad.setVelocityY(this.cameras.main.height * 0.3);
    }

    // Aggiungi power-up casualmente
    if (Phaser.Math.Between(0, 1000) < 1) {
        const powerup = this.powerups.create(Phaser.Math.Between(0, 800), 0, 'powerup');
        powerup.setVelocityY(150);
    }

    // Aumenta la difficoltà in base al livello
    if (Phaser.Math.Between(0, 100) < 1 + level) {
        const bad = badObjects.create(Phaser.Math.Between(0, 800), 0, 'bad');
        bad.setVelocityY(200 + level * 20);
    }
}

function resize(gameSize, baseSize, displaySize, resolution) {
    if (this.cameras.main) {
        this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
    }

    if (player) {
        player.setPosition(gameSize.width / 2, gameSize.height * 0.9);
        player.setDisplaySize(gameSize.width * 0.1, gameSize.width * 0.1);
    }

    if (scoreText) scoreText.setFontSize(gameSize.width * 0.04);
    if (timeText) timeText.setFontSize(gameSize.width * 0.04);
    if (levelText) levelText.setFontSize(gameSize.width * 0.04);
}

// Funzione per raccogliere frutti
function collectFruit(player, fruit) {
    fruit.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    
    // Update high score if current score is higher
    if (score > highScore) {
        highScore = score;
        highScoreText.setText('Record: ' + highScore);
    }
}

// Funzione per colpire oggetti sbagliati
function hitBadObject(player, badObject) {
    this.endGame();
}

// Funzione per il timer
function updateTimer() {
    timeLeft--;
    timeText.setText('Time: ' + timeLeft);
    if (timeLeft <= 0) {
        this.endGame();
    }
}

// Funzione per il power-up
function collectPowerup(player, powerup) {
    powerup.disableBody(true, true);
    // Implementa l'effetto del power-up, ad esempio:
    player.setScale(1.2);
    this.time.delayedCall(5000, () => player.setScale(1), [], this);
}

// Funzione per il game over
function endGame() {
    gameOver = true;
    this.physics.pause();
    player.setTint(0xff0000);
    
    // Update high score if final score is higher
    if (score > highScore) {
        highScore = score;
        highScoreText.setText('Record: ' + highScore);
    }
    
    const { width, height } = this.scale;
    
    gameOverBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    gameOverBg.setScrollFactor(0);

    gameOverText = this.add.text(width / 2, height / 2 - 50, 'Game Over', { fontSize: '64px', fill: '#ffffff' });
    gameOverText.setOrigin(0.5);
    gameOverText.setScrollFactor(0);

    restartButton = this.add.text(width / 2, height / 2 + 50, 'Restart', { 
        fontSize: '32px', 
        fill: '#ffffff', 
        backgroundColor: '#228b22', 
        padding: { x: 20, y: 10 } 
    });
    restartButton.setOrigin(0.5);
    restartButton.setScrollFactor(0);
    restartButton.setInteractive({ useHandCursor: true });
    restartButton.on('pointerdown', () => restartGame.call(this));
    restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#ffffff', backgroundColor: '#006400' }));
    restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#ffffff', backgroundColor: '#228b22' }));

    gameOverBg.setDepth(100);
    gameOverText.setDepth(101);
    restartButton.setDepth(101);
}

function restartGame() {
    gameOver = false;
    score = 0;
    timeLeft = 60; // Reset the timer if you're using one
    level = 1; // Reset the level if you're using levels
    
    // Remove game over elements
    if (gameOverText) gameOverText.destroy();
    if (restartButton) restartButton.destroy();
    if (gameOverBg) gameOverBg.destroy(); // Remove the black background

    // Reset player position and size
    player.setPosition(this.scale.width / 2, this.scale.height * 0.9);
    player.setScale(1); // Reset to original size
    player.clearTint();
    
    // Clear existing fruits and bad objects
    fruits.clear(true, true);
    badObjects.clear(true, true);
    
    // Reset texts
    scoreText.setText('Score: 0');
    timeText.setText('Time: ' + timeLeft);
    levelText.setText('Level: 1');
    
    // Restart physics
    this.physics.resume();
    
    // Restart the game timer if you're using one
    if (gameTimer) gameTimer.remove();
    gameTimer = this.time.addEvent({ delay: 1000, callback: updateTimer, callbackScope: this, loop: true });
    
    // Don't reset highScore, just update the text
    highScoreText.setText('Record: ' + highScore);
}
