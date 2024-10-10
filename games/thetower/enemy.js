// enemy.js
class Enemy {
    constructor(scene, x, y) {
        this.scene = scene;
        this.health = 50; // Enemy health
        this.speed = 100;
        this.sprite = scene.physics.add.sprite(x, y, 'enemy');
        this.sprite.setOrigin(0.5, 0);
        this.sprite.setDisplaySize(50, 50); // Resize enemies to 50x50

        // Ensure the enemy moves towards the tower
        this.moveToTower();
    }

    update() {
        if (this.health <= 0) {
            this.destroy();
        }
    }

    moveToTower() {
        const towerX = this.scene.tower.sprite.x;
        const towerY = this.scene.tower.sprite.y;
        this.scene.physics.moveTo(this.sprite, towerX, towerY, this.speed);

        // Check for collision with the tower
        this.scene.physics.add.overlap(this.sprite, this.scene.tower.sprite, () => {
            this.attachToTower();
        });
    }

    attachToTower() {
        // Stop the enemy's movement
        this.sprite.body.stop();
        this.scene.tower.attachedEnemies.push(this); // Attach enemy to the tower
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.scene.ui.addPoints(10); // Award points for defeating the enemy
            this.destroy();
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}