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
let platforms;
let cursors;
let score = 0;
let highScore = 0; // Aggiungi questa variabile globale
let scoreText;
let highScoreText; // Aggiungi questa variabile globale
let gameOver = false;
let highestPlatform;
let gameOverText;
let restartButton;
let highestPlatformReached; // Aggiungi questa variabile globale
let difficultyLevel = 0;

function preload() {
    this.load.image('sky', 'img/sky.png');
    this.load.image('ground', 'img/platform.png');
    this.load.image('player', 'img/player.png');
}

function create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, 'sky').setDisplaySize(width, height).setScrollFactor(0).setName('sky');

    platforms = this.physics.add.staticGroup();
    
    // Piattaforma iniziale
    let initialPlatform = platforms.create(width / 2, height - 32, 'ground');
    initialPlatform.setScale(0.5, 0.5).refreshBody();
    // Rimuoviamo la tolleranza dei bordi
    initialPlatform.body.setSize(initialPlatform.displayWidth, initialPlatform.displayHeight);
    highestPlatform = initialPlatform;
    console.log('Initial platform created at:', initialPlatform.x, initialPlatform.y);

    player = this.physics.add.sprite(width / 2, height - 150, 'player');
    player.setBounce(0.2);
    // Rimuoviamo setCollideWorldBounds per permettere al giocatore di salire
    // player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms, platformCollision, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' }).setScrollFactor(0);

    // Aggiungi il testo per il record
    highScoreText = this.add.text(this.scale.width - 16, 16, 'Record: 0', { fontSize: '32px', fill: '#000' })
        .setOrigin(1, 0) // Allinea a destra
        .setScrollFactor(0);

    this.cameras.main.startFollow(player, true);
    this.cameras.main.setDeadzone(0, this.scale.height / 3);
    this.cameras.main.setBounds(0, -Infinity, this.scale.width, Infinity);

    // Impostiamo i limiti del mondo di gioco solo orizzontalmente
    this.physics.world.setBounds(0, -Infinity, this.scale.width, Infinity);

    this.generatePlatforms = generatePlatforms.bind(this);
    this.generatePlatforms(true); // Prima piattaforma
    this.generatePlatforms(); // Seconda piattaforma

    this.scale.on('resize', resize, this);
    this.endGame = endGame;
    this.restartGame = restartGame;

    // Inizializza highestPlatformReached al livello di partenza del giocatore
    highestPlatformReached = Math.floor(-player.y / 100) - 1; // Sottraiamo 1 per assicurarci che il primo salto conti
}

function update() {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.setFlipX(true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.setFlipX(false);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }

    // Aggiorna il punteggio basato sulla piattaforma più alta raggiunta
    const currentPlatformLevel = Math.floor(-player.y / 100); // Assumiamo che ogni 100 pixel sia un nuovo livello
    if (currentPlatformLevel > highestPlatformReached) {
        score += currentPlatformLevel - highestPlatformReached; // Incrementa il punteggio per ogni nuovo livello raggiunto
        highestPlatformReached = currentPlatformLevel;
        highScore = Math.max(highScore, score);
        scoreText.setText('Score: ' + score);
        highScoreText.setText('Record: ' + highScore);
    }

    // Aggiorna il livello di difficoltà
    const newDifficultyLevel = Math.floor(score / 10);
    if (newDifficultyLevel > difficultyLevel) {
        difficultyLevel = newDifficultyLevel;
        console.log('Difficulty increased to level', difficultyLevel);
    }

    // Genera una nuova piattaforma quando il giocatore si avvicina alla più alta
    if (player.y < highestPlatform.y + this.scale.height / 2) {
        this.generatePlatforms();
    }

    // Game over se il giocatore cade troppo in basso rispetto alla piattaforma più alta
    if (player.y > highestPlatform.y + this.scale.height * 1.5) {
        this.endGame();
    }

    // Game over se il giocatore esce lateralmente dallo schermo
    if (player.x < 0 || player.x > this.scale.width) {
        this.endGame();
    }

    // Muovi le piattaforme mobili
    platforms.children.entries.forEach(platform => {
        if (platform.movable) {
            platform.x += platform.direction * platform.speed;
            if (platform.x > this.scale.width - platform.displayWidth / 2 || platform.x < platform.displayWidth / 2) {
                platform.direction *= -1;
            }
            platform.body.position.x = platform.x - platform.displayWidth / 2;
        }

        // Gestisci le piattaforme che scompaiono
        if (platform.vanishing && platform.startVanishing) {
            platform.alpha -= 0.005;
            if (platform.alpha <= 0) {
                platform.destroy();
            }
        }
    });

    // Muovi il giocatore con le piattaforme mobili
    if (player.body.touching.down) {
        const platformBelow = platforms.children.entries.find(p => 
            p.body.touching.up && Math.abs(p.x - player.x) < p.width / 2
        );
        if (platformBelow && platformBelow.movable) {
            player.x += platformBelow.direction;
        }
    }

    console.log('Player position:', player.y);
    console.log('Camera position:', this.cameras.main.scrollY);
    console.log('Highest platform:', highestPlatform.y);
}

function resize(gameSize) {
    const { width, height } = gameSize;

    this.cameras.resize(width, height);

    // Aggiorna lo sfondo
    this.children.getByName('sky').setDisplaySize(width, height);

    // Aggiorna la posizione del testo del record
    if (highScoreText) {
        highScoreText.setPosition(width - 16, 16);
    }
}

function generatePlatforms(isFirst = false) {
    const { width } = this.scale;
    let y;
    if (isFirst) {
        y = player.y - 100;
    } else {
        // Aumenta la distanza tra le piattaforme con la difficoltà
        const minDistance = 100 + difficultyLevel * 5;
        const maxDistance = 150 + difficultyLevel * 5;
        y = highestPlatform.y - Phaser.Math.Between(minDistance, maxDistance);
    }
    const x = Phaser.Math.Between(50, width - 50);
    
    const platform = platforms.create(x, y, 'ground');
    
    // Riduci la dimensione delle piattaforme con la difficoltà
    const scale = Math.max(0.3, 0.5 - difficultyLevel * 0.02);
    platform.setScale(scale, scale);
    platform.refreshBody();
    
    // Rimuoviamo la tolleranza dei bordi
    platform.body.setSize(platform.displayWidth, platform.displayHeight);
    platform.body.allowGravity = false;
    platform.body.immovable = true;
    
    platform.level = Math.floor(-y / 100);

    // Aumenta la probabilità di piattaforme mobili con la difficoltà
    if (Phaser.Math.Between(0, 100) < 50 + difficultyLevel * 5) {
        platform.movable = true;
        platform.direction = 1;
        // Aumenta la velocità delle piattaforme mobili con la difficoltà
        platform.speed = 1 + difficultyLevel * 0.5;
    }

    // Aggiungi piattaforme che scompaiono a livelli di difficoltà più alti
    if (difficultyLevel >= 2 && Phaser.Math.Between(0, 100) < 20 + difficultyLevel * 2) {
        platform.vanishing = true;
        platform.alpha = 1; // Mantieni la piattaforma completamente opaca all'inizio
        platform.touched = false; // Aggiungi una flag per tracciare se la piattaforma è stata toccata
    }

    highestPlatform = platform;
    
    console.log('New platform created at:', x, y, 'with scale:', scale);
}

function endGame() {
    gameOver = true;
    this.physics.pause();
    player.setTint(0xff0000);
    
    const { width, height } = this.scale;
    
    // Crea un rettangolo semi-trasparente per lo sfondo
    const gameOverBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    gameOverBg.setScrollFactor(0);

    // Posiziona il testo "Game Over" relativo alla camera
    gameOverText = this.add.text(width / 2, height / 2 - 50, 'Game Over', { fontSize: '64px', fill: '#ffffff' });
    gameOverText.setOrigin(0.5);
    gameOverText.setScrollFactor(0);

    // Posiziona il pulsante "Restart" relativo alla camera
    restartButton = this.add.text(width / 2, height / 2 + 50, 'Restart', { 
        fontSize: '32px', 
        fill: '#ffffff', 
        backgroundColor: '#ff0000', 
        padding: { x: 20, y: 10 } 
    });
    restartButton.setOrigin(0.5);
    restartButton.setScrollFactor(0);
    restartButton.setInteractive({ useHandCursor: true });
    restartButton.on('pointerdown', () => this.restartGame());
    restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#ff0000', backgroundColor: '#ffffff' }));
    restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#ffffff', backgroundColor: '#ff0000' }));

    // Assicurati che questi elementi siano sopra tutto il resto
    gameOverBg.setDepth(100);
    gameOverText.setDepth(101);
    restartButton.setDepth(101);
}

function restartGame() {
    gameOver = false;
    score = 0;
    // Inizializza highestPlatformReached al livello di partenza del giocatore
    highestPlatformReached = Math.floor((-this.scale.height + 150) / 100) - 1;
    difficultyLevel = 0;
    
    // Rimuovi gli elementi del game over
    if (gameOverText) gameOverText.destroy();
    if (restartButton) restartButton.destroy();
    
    this.scene.restart();
}

function platformCollision(player, platform) {
    if (platform.vanishing && !platform.touched) {
        platform.touched = true;
        // Inizia la scomparsa della piattaforma dopo un breve ritardo
        this.time.delayedCall(500, () => {
            platform.startVanishing = true;
        });
    }
}