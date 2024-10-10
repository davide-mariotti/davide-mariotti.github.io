// main.js
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0,
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

let enemySpawnInterval;

function preload() {
    // Load assets here (e.g., tower and enemy sprites)
    this.load.image('tower', 'img/tower.png');
    this.load.image('enemy', 'img/enemy.png');
    this.load.image('projectile', 'img/projectile.png'); // Load projectile image for tower attacks
}

function create() {
    this.tower = new Tower(this);
    this.enemies = this.physics.add.group();
    this.ui = new UI(this);
    enemySpawnInterval = setInterval(() => spawnEnemies(this), 2000); // Spawn enemies every 2 seconds
}

function update() {
    this.tower.update();
    this.enemies.children.each(enemy => enemy.update(), this);
}

function spawnEnemies(scene) {
    const side = Phaser.Math.Between(0, 3); // Randomly choose a side to spawn from
    let x, y;

    switch (side) {
        case 0: // Top
            x = Phaser.Math.Between(0, scene.cameras.main.width);
            y = 0;
            break;
        case 1: // Bottom
            x = Phaser.Math.Between(0, scene.cameras.main.width);
            y = scene.cameras.main.height;
            break;
        case 2: // Left
            x = 0;
            y = Phaser.Math.Between(0, scene.cameras.main.height);
            break;
        case 3: // Right
            x = scene.cameras.main.width;
            y = Phaser.Math.Between(0, scene.cameras.main.height);
            break;
    }

    const enemy = new Enemy(scene, x, y);
    scene.enemies.add(enemy); // Ensure the enemy is added to the physics group
}