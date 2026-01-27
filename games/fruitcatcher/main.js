/**
 * Fruit Catcher Game Logic
 * Modernized for Digital Forest Theme
 */

const gameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
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

const game = new Phaser.Game(gameConfig);

// Game State
let player;
let fruits;
let badObjects;
let powerups;
let cursors;
let score = 0;
let highScore = localStorage.getItem('fruitcatcher_highscore') || 0;
let timeLeft = 60;
let level = 1;
let gameOver = false;

// UI Elements
let scoreText;
let highScoreText;
let timeText;
let levelText;
let gameOverBg;
let gameOverText;
let restartButton;
let gameTimer;

function preload() {
    this.load.image('background', 'img/background.png');
    this.load.image('player', 'img/basket.png');
    this.load.image('fruit', 'img/apple.png');
    this.load.image('bad', 'img/rock.png');
    this.load.image('powerup', 'img/star.png');
}

function create() {
    // Background with slight overlay for readability
    const bg = this.add.image(400, 300, 'background').setDisplaySize(800, 600);
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.2);

    // Groups
    fruits = this.physics.add.group();
    badObjects = this.physics.add.group();
    powerups = this.physics.add.group();

    // Player
    player = this.physics.add.sprite(400, 540, 'player')
        .setCollideWorldBounds(true)
        .setDisplaySize(80, 80);

    // UI Styles
    const textStyle = {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: "'Outfit', sans-serif",
        fontWeight: '700'
    };

    scoreText = this.add.text(20, 20, `Score: ${score}`, textStyle);
    timeText = this.add.text(20, 55, `Time: ${timeLeft}`, textStyle);
    levelText = this.add.text(20, 90, `Level: ${level}`, textStyle);
    highScoreText = this.add.text(780, 20, `Best: ${highScore}`, textStyle).setOrigin(1, 0);

    // Inputs
    cursors = this.input.keyboard.createCursorKeys();

    // Overlaps
    this.physics.add.overlap(player, fruits, (p, f) => collectItem(f, 10), null, this);
    this.physics.add.overlap(player, badObjects, () => endGame.call(this), null, this);
    this.physics.add.overlap(player, powerups, (p, pow) => {
        pow.disableBody(true, true);
        player.setTint(0x10b981);
        this.time.delayedCall(3000, () => player.clearTint());
    }, null, this);

    // Timer Event
    gameTimer = this.time.addEvent({
        delay: 1000,
        callback: () => {
            if (gameOver) return;
            timeLeft--;
            timeText.setText(`Time: ${timeLeft}`);
            if (timeLeft <= 0) endGame.call(this);
        },
        callbackScope: this,
        loop: true
    });
}

function update() {
    if (gameOver) return;

    // Movement
    if (cursors.left.isDown) {
        player.setVelocityX(-400);
    } else if (cursors.right.isDown) {
        player.setVelocityX(400);
    } else {
        player.setVelocityX(0);
    }

    // Spawn Logic
    if (Phaser.Math.Between(0, 100) < 2 + level) {
        spawnItem.call(this, 'fruit', 200 + level * 20);
    }

    if (Phaser.Math.Between(0, 100) < 1 + (level * 0.5)) {
        spawnItem.call(this, 'bad', 250 + level * 25);
    }

    if (Phaser.Math.Between(0, 1000) < 2) {
        spawnItem.call(this, 'powerup', 150);
    }

    // Level up logic based on score
    if (score > level * 200) {
        level++;
        levelText.setText(`Level: ${level}`);
    }
}

function spawnItem(key, speed) {
    const x = Phaser.Math.Between(40, 760);
    const item = this.physics.add.sprite(x, -20, key);
    item.setDisplaySize(40, 40);
    item.setVelocityY(speed);

    // Auto destroy when off screen
    this.time.addEvent({
        delay: 5000,
        callback: () => { if (item.active) item.destroy(); }
    });

    if (key === 'fruit') fruits.add(item);
    else if (key === 'bad') badObjects.add(item);
    else powerups.add(item);
}

function collectItem(item, points) {
    item.disableBody(true, true);
    score += points;
    scoreText.setText(`Score: ${score}`);

    if (score > highScore) {
        highScore = score;
        highScoreText.setText(`Best: ${highScore}`);
        localStorage.setItem('fruitcatcher_highscore', highScore);
    }
}

function endGame() {
    gameOver = true;
    this.physics.pause();
    player.setTint(0xff4444);

    const { width, height } = this.scale;

    // Glassy Game Over Overlay
    gameOverBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);

    gameOverText = this.add.text(width / 2, height / 2 - 40, 'GAME OVER', {
        fontSize: '64px',
        fill: '#10b981',
        fontFamily: "'Outfit', sans-serif",
        fontWeight: '800'
    }).setOrigin(0.5);

    restartButton = this.add.text(width / 2, height / 2 + 60, 'PLAY AGAIN', {
        fontSize: '28px',
        fill: '#ffffff',
        backgroundColor: '#10b981',
        padding: { x: 30, y: 15 },
        fontFamily: "'Inter', sans-serif",
        fontWeight: '700'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    restartButton.on('pointerdown', () => {
        score = 0;
        timeLeft = 60;
        level = 1;
        gameOver = false;
        this.scene.restart();
    });

    restartButton.on('pointerover', () => restartButton.setBackgroundColor('#059669'));
    restartButton.on('pointerout', () => restartButton.setBackgroundColor('#10b981'));
}
