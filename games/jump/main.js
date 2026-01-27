/**
 * Digital Jump - Enhanced Edition
 * Professional refactor with moving platforms, power-ups, and juice.
 */

const gameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 480,
    height: 800,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
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
let platforms;
let springs;
let crystals;
let bugs;
let magnets;
let cursors;
let score = 0;
let highScore = parseInt(localStorage.getItem('jumpgame_highscore') || '0');
let gameOver = false;
let cameraYMin = 800;
let difficulty = 0;
let magnetTimer = 0;

// Particles
let jumpEmitter;
let trailEmitter;
let sky_bg;
let sky_fg;

// UI
let scoreText;
let highScoreText;

function preload() {
    this.load.image('sky', 'img/sky.png');
    this.load.image('ground', 'img/platform.png');
    this.load.image('player', 'img/player.png');
    this.load.image('spring', 'img/spring.png');
    this.load.image('crystal', 'img/crystal.png');
}

function create() {
    const { width, height } = this.scale;

    // Reset State
    score = 0;
    difficulty = 0;
    gameOver = false;
    magnetTimer = 0;
    cameraYMin = height;

    // Background - Parallax Layers
    sky_bg = this.add.image(width / 2, height / 2, 'sky')
        .setDisplaySize(width * 1.5, height * 1.5)
        .setScrollFactor(0)
        .setAlpha(0.2);

    sky_fg = this.add.image(width / 2, height / 2, 'sky')
        .setDisplaySize(width * 2, height * 2)
        .setScrollFactor(0)
        .setAlpha(0.1)
        .setTint(0x065f46); // Deeper emerald for foreground trees

    // Platform Groups
    platforms = this.physics.add.group({ allowGravity: false, immovable: true });
    springs = this.physics.add.group({ allowGravity: false, immovable: true });
    crystals = this.physics.add.group({ allowGravity: false });
    bugs = this.physics.add.group({ allowGravity: false });
    magnets = this.physics.add.group({ allowGravity: false });

    // Textures Generation (Premium Procedural Assets) - Guard with existence check for scene restarts
    if (!this.textures.exists('particle_dot')) {
        const dotCanvas = document.createElement('canvas');
        dotCanvas.width = 16; dotCanvas.height = 16;
        const dotCtx = dotCanvas.getContext('2d', { willReadFrequently: true });
        dotCtx.fillStyle = '#ffffff';
        dotCtx.beginPath(); dotCtx.arc(8, 8, 8, 0, Math.PI * 2); dotCtx.fill();
        this.textures.addCanvas('particle_dot', dotCanvas);
    }

    if (!this.textures.exists('bug_premium')) {
        const bugCanvas = document.createElement('canvas');
        bugCanvas.width = 64; bugCanvas.height = 64;
        const bugCtx = bugCanvas.getContext('2d', { willReadFrequently: true });
        const bugGrad = bugCtx.createRadialGradient(32, 32, 5, 32, 32, 30);
        bugGrad.addColorStop(0, '#ff4444'); bugGrad.addColorStop(1, '#991b1b');
        bugCtx.fillStyle = bugGrad;
        bugCtx.beginPath(); bugCtx.moveTo(32, 5); bugCtx.lineTo(60, 50); bugCtx.lineTo(32, 40); bugCtx.lineTo(4, 50); bugCtx.closePath(); bugCtx.fill();
        bugCtx.strokeStyle = '#ffffff'; bugCtx.lineWidth = 2; bugCtx.stroke();
        bugCtx.fillStyle = '#ffffff'; bugCtx.beginPath(); bugCtx.arc(22, 25, 3, 0, 7); bugCtx.arc(42, 25, 3, 0, 7); bugCtx.fill(); // Eyes
        this.textures.addCanvas('bug_premium', bugCanvas);
    }

    if (!this.textures.exists('magnet_premium')) {
        const magCanvas = document.createElement('canvas');
        magCanvas.width = 64; magCanvas.height = 64;
        const magCtx = magCanvas.getContext('2d', { willReadFrequently: true });
        magCtx.strokeStyle = '#60a5fa'; magCtx.lineWidth = 8; magCtx.lineCap = 'round';
        magCtx.beginPath(); magCtx.arc(32, 32, 20, Math.PI, 0); magCtx.lineTo(52, 55); magCtx.moveTo(12, 32); magCtx.lineTo(12, 55); magCtx.stroke();
        magCtx.fillStyle = '#ef4444'; magCtx.fillRect(8, 45, 8, 10); magCtx.fillRect(48, 45, 8, 10); // Red tips
        this.textures.addCanvas('magnet_premium', magCanvas);
    }

    const manager = this.add.particles('particle_dot');
    jumpEmitter = manager.createEmitter({
        scale: { start: 0.5, end: 0 },
        alpha: { start: 0.6, end: 0 },
        speed: 100,
        lifespan: 400,
        blendMode: 'ADD',
        tint: 0x10b981,
        on: false
    });

    trailEmitter = manager.createEmitter({
        scale: { start: 0.3, end: 0 },
        alpha: { start: 0.4, end: 0 },
        speed: 20,
        lifespan: 300,
        blendMode: 'ADD',
        tint: 0x10b981,
        frequency: 50,
        on: true
    });

    // Initial Platform (Wide Base)
    const base = createPlatform.call(this, width / 2, height - 50, 2.0, 'base');

    // Initial climb
    for (let i = 0; i < 15; i++) {
        spawnPlatform.call(this);
    }

    // Player
    player = this.physics.add.sprite(width / 2, height - 150, 'player');
    player.setDisplaySize(40, 40);
    player.setTint(0x10b981);
    player.setDepth(10);

    // Collisions
    this.physics.add.collider(player, platforms, (p, plat) => {
        if (p.body.touching.down) {
            handleLanding.call(this, p, plat);
        }
    });

    this.physics.add.collider(player, springs, (p, spring) => {
        if (p.body.touching.down) {
            p.setVelocityY(-1800); // Massive boost

            // Camera effect
            this.cameras.main.flash(300, 16, 185, 129, 0.4);

            // Score bonus
            score += 50;
            updateScoreUI();

            // Animation
            this.tweens.add({
                targets: spring,
                scaleY: 0.1,
                duration: 50,
                yoyo: true,
                onComplete: () => spring.destroy()
            });
        }
    }, (p, spring) => {
        // One-way booster: only collide when falling
        return p.body.velocity.y > 0 && p.y < spring.y - spring.displayHeight / 2;
    });

    // Emerald Crystals Logic
    this.physics.add.overlap(player, crystals, (p, crystal) => {
        crystal.destroy();
        score += 25;
        updateScoreUI();
        this.cameras.main.flash(100, 255, 255, 255, 0.1);
        jumpEmitter.explode(15, crystal.x, crystal.y);
    });

    // Digital Bugs Logic
    this.physics.add.overlap(player, bugs, (p, bug) => {
        // Stomp logic: if player is falling and above bug
        if (p.body.velocity.y > 0 && p.y < bug.y) {
            bug.destroy();
            p.setVelocityY(-600);
            score += 100;
            updateScoreUI();
            jumpEmitter.explode(20, bug.x, bug.y);
            this.cameras.main.shake(200, 0.01);
        } else {
            triggerGameOver.call(this);
        }
    });

    // Magnet Power-up logic
    this.physics.add.overlap(player, magnets, (p, m) => {
        m.destroy();
        magnetTimer = 600; // ~10 seconds
        this.cameras.main.flash(500, 96, 165, 250, 0.3);
        jumpEmitter.explode(30, m.x, m.y);
        this.cameras.main.shake(200, 0.01);
    });

    // Physics World - Set to infinite Y for stable collisions at high altitudes
    this.physics.world.setBounds(0, -Infinity, width, Infinity);

    // Camera
    this.cameras.main.setBounds(0, -Infinity, width, Infinity);

    // UI
    const uiStyle = { fontFamily: "'Outfit', sans-serif", fontSize: '32px', fontWeight: '900', fill: '#ffffff' };
    scoreText = this.add.text(20, 20, '0', uiStyle).setScrollFactor(0).setDepth(200);
    highScoreText = this.add.text(width - 20, 25, `BEST: ${highScore}`, { ...uiStyle, fontSize: '14px', fill: '#10b981' })
        .setOrigin(1, 0).setScrollFactor(0).setDepth(200);

    cursors = this.input.keyboard.createCursorKeys();

    // Magnet UI
    this.magnetUI = this.add.text(20, 60, 'MAGNET: 10s', { ...uiStyle, fontSize: '18px', fill: '#60a5fa' })
        .setScrollFactor(0).setDepth(200).setVisible(false);
}

function update() {
    if (gameOver) return;

    const { width, height } = this.scale;

    // Difficulty increases with score
    difficulty = Math.floor(score / 100);

    // Left/Right Movement
    if (cursors.left.isDown) {
        player.setVelocityX(-450);
        player.setFlipX(true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(450);
        player.setFlipX(false);
    } else {
        player.setVelocityX(0);
    }

    // Wrap-around
    if (player.x < 0) player.x = width;
    else if (player.x > width) player.x = 0;

    // Camera scrolling
    if (player.y < cameraYMin) {
        cameraYMin = player.y;
        this.cameras.main.scrollY = cameraYMin - height / 2;

        // Ensure some world bounds follow camera for broadphase optimization if needed
        // but for arcade physics, just ensuring the objects are inside is enough.
    }

    // Magnet Power-up Handling
    if (magnetTimer > 0) {
        magnetTimer--;
        this.magnetUI.setVisible(true);
        this.magnetUI.setText(`MAGNET: ${(magnetTimer / 60).toFixed(1)}s`);

        // Attraction Logic
        crystals.children.iterate(crystal => {
            if (!crystal) return;
            const dist = Phaser.Math.Distance.Between(player.x, player.y, crystal.x, crystal.y);
            if (dist < 300) {
                this.physics.moveToObject(crystal, player, 600);
            }
        });
    } else {
        this.magnetUI.setVisible(false);
    }

    // Speed Trail Logic
    trailEmitter.setPosition(player.x, player.y + 10);
    if (Math.abs(player.body.velocity.y) > 400 || Math.abs(player.body.velocity.x) > 300) {
        trailEmitter.on = true;
    } else {
        trailEmitter.on = false;
    }

    // Background - Fixed to screen for stability
    sky_bg.setY(height / 2);
    sky_fg.setY(height / 2);

    // Update Bugs Movement and Wrap-around
    bugs.children.iterate(bug => {
        if (!bug || !bug.active) return;
        // Sine wave vertical movement
        bug.y += Math.sin(this.time.now / 200) * 2;

        // Manual horizontal wrap-around (since world bounds are infinite)
        if (bug.x < 0) bug.x = width;
        else if (bug.x > width) bug.x = 0;
    });

    // Platforms Logic & Cleanup
    const toRemove = [];
    platforms.children.iterate(child => {
        if (!child || !child.active) return;

        if (child.isMoving) {
            // Smooth ping-pong movement using velocity
            if (child.x > width - 80) {
                child.x = width - 81;
                child.moveDir = -1;
                child.setVelocityX(child.moveSpeed * child.moveDir * 60);
            } else if (child.x < 80) {
                child.x = 81;
                child.moveDir = 1;
                child.setVelocityX(child.moveSpeed * child.moveDir * 60);
            } else if (child.body.velocity.x === 0) {
                child.setVelocityX(child.moveSpeed * child.moveDir * 60);
            }
        }

        // Cleanup Check
        if (child.y > this.cameras.main.scrollY + height + 100) {
            toRemove.push(child);
        }
    });

    toRemove.forEach(child => {
        platforms.remove(child, true, true);
        spawnPlatform.call(this);
    });

    // PROACTIVE SPAWNING: Ensure there are always platforms ahead of the player
    let topPlatformY = 0;
    platforms.children.iterate(p => { if (p.y < topPlatformY) topPlatformY = p.y; });
    if (topPlatformY > this.cameras.main.scrollY - 1000) {
        spawnPlatform.call(this);
    }

    // Cleanup off-screen crystals
    crystals.children.iterate(child => {
        if (child && child.y > this.cameras.main.scrollY + height + 100) {
            crystals.remove(child, true, true);
        }
    });

    // Cleanup off-screen bugs
    bugs.children.iterate(bug => {
        if (bug && bug.y > this.cameras.main.scrollY + height + 100) {
            bugs.remove(bug, true, true);
        }
    });

    // Game Over Check - Immediate trigger if falling below camera view
    if (player.y > this.cameras.main.scrollY + height + 50) {
        triggerGameOver.call(this);
    }
}

function handleLanding(p, plat) {
    p.setVelocityY(-850);

    // Visual feedback
    jumpEmitter.explode(10, p.x, p.y + 20);
    this.cameras.main.shake(100, 0.005);

    // Breaking logic for fragile platforms
    if (plat.isFragile) {
        this.tweens.add({
            targets: plat,
            alpha: 0,
            y: plat.y + 20,
            duration: 100,
            onComplete: () => plat.destroy()
        });
    }

    // Scaling/Score
    const h = Math.floor(Math.abs(p.y - 800) / 10);
    if (h > score) {
        score = h;
        updateScoreUI();
    }
}

function spawnPlatform() {
    const { width, height } = this.scale;
    // Default to bottom of camera if no platforms exist
    let highestY = this.cameras.main.scrollY + height;

    if (platforms.countActive() > 0) {
        platforms.children.iterate(p => {
            if (p.active && p.y < highestY) highestY = p.y;
        });
    }

    const x = Phaser.Math.Between(80, width - 80);
    // CAP the maximum gap: Difficulty was making gaps too large (>300px) which is unreachable.
    // Max jump is ~300px. We cap gap at 260px for fair gameplay even at high difficulty.
    const gap = Phaser.Math.Between(80, Math.min(180 + (difficulty * 5), 260));
    const y = highestY - gap;

    const rand = Phaser.Math.Between(0, 100);
    let type = 'normal';

    if (rand < 20 && difficulty > 2) type = 'moving';
    else if (rand < 35 && difficulty > 4) type = 'fragile';

    const plat = createPlatform.call(this, x, y, 1.0, type);

    // Chance for a spring
    if (type === 'normal' && Phaser.Math.Between(0, 100) < 15) {
        // Precise alignment on top of the platform sprite
        const spring = springs.create(plat.x, plat.y - (plat.displayHeight / 2), 'spring');
        spring.setScale(0.3);
        spring.setOrigin(0.5, 1);

        // Sync body for dynamic group member
        spring.body.setSize(spring.displayWidth / spring.scaleX, spring.displayHeight / spring.scaleY);
        spring.body.setOffset(0, 0);
        spring.setDepth(11);
    }

    // Chance for a crystal
    if (type === 'normal' && Phaser.Math.Between(0, 100) < 25) {
        const crystal = crystals.create(plat.x, plat.y - 40, 'crystal');
        crystal.setScale(0.5);
        this.tweens.add({
            targets: crystal,
            y: crystal.y - 15,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    // Chance for a bug (flying enemy) appears after score 200
    if (difficulty > 2 && Phaser.Math.Between(0, 100) < 15) {
        const bug = bugs.create(Phaser.Math.Between(50, width - 50), y - 150, 'bug_premium');
        bug.setScale(0.6);
        bug.setVelocityX(Phaser.Math.Between(-150, 150));
        bug.setDepth(12);
        bug.setBounce(1);
    }

    // Chance for a magnet
    if (Phaser.Math.Between(0, 100) < 5) {
        const m = magnets.create(x, y - 60, 'magnet_premium');
        m.setScale(0.5);
        this.tweens.add({
            targets: m,
            scale: 0.7,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }
}

function createPlatform(x, y, scale, type) {
    const plat = platforms.create(x, y, 'ground');

    // Thinner platforms for a more elegant look
    plat.setScale(scale, 0.25);

    // Sync physics body to visual size (crucial for dynamic groups)
    plat.body.setSize(plat.width, plat.height);
    plat.body.setOffset(0, 0);
    plat.body.setImmovable(true);

    // One-way magic
    plat.body.checkCollision.down = false;
    plat.body.checkCollision.left = false;
    plat.body.checkCollision.right = false;

    // Theming & Properties
    if (type === 'moving') {
        plat.setTint(0x34d399);
        plat.isMoving = true;
        plat.moveDir = Phaser.Math.RND.pick([-1, 1]);
        plat.moveSpeed = 1.5 + (difficulty * 0.2);
        plat.setVelocityX(plat.moveSpeed * plat.moveDir * 60);
    } else if (type === 'fragile') {
        plat.setTint(0xf87171);
        plat.isFragile = true;
    } else {
        plat.setTint(0x10b981);
    }

    return plat;
}

function updateScoreUI() {
    scoreText.setText(score);
    if (score > highScore) {
        highScore = score;
        highScoreText.setText(`BEST: ${highScore}`);
        localStorage.setItem('jumpgame_highscore', highScore);
    }
}

function triggerGameOver() {
    if (gameOver) return;
    gameOver = true;

    this.cameras.main.shake(500, 0.02);
    player.setTint(0xff4444);

    const { width, height } = this.scale;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8)
        .setScrollFactor(0).setDepth(1000).setAlpha(0);

    this.tweens.add({ targets: overlay, alpha: 1, duration: 400 });

    this.add.text(width / 2, height / 2 - 40, 'ASCENSION FAILED', {
        fontFamily: "'Outfit', sans-serif", fontSize: '42px', fontWeight: '900', fill: '#10b981'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    const btn = this.add.text(width / 2, height / 2 + 60, 'RESTART ENGINE', {
        fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: '700', padding: { x: 30, y: 15 },
        backgroundColor: '#10b981', fill: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => this.scene.restart());
}