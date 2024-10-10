// tower.js
class Tower {
    constructor(scene) {
        this.scene = scene;
        this.damage = 10;
        this.range = 200;
        this.fireRate = 1000;
        this.lastFired = 0;
        this.health = 100; // Tower health
        this.sprite = scene.physics.add.sprite(scene.cameras.main.centerX, scene.cameras.main.height - 50, 'tower');
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setDisplaySize(100, 100); // Resize tower to 100x100
        this.upgradeCost = {
            damage: 20,
            range: 30,
            fireRate: 25
        };
        this.attachedEnemies = []; // Array to keep track of attached enemies
    }

    update() {
        if (this.health > 0) {
            this.handleAttachedEnemies();
            const nearestEnemy = this.findNearestEnemy();
            if (nearestEnemy) {
                this.shoot(nearestEnemy);
            }
        } else {
            this.sprite.destroy(); // Destroy tower if health is 0
            clearInterval(enemySpawnInterval); // Stop spawning enemies
        }
    }

    handleAttachedEnemies() {
        this.attachedEnemies.forEach(enemy => {
            if (enemy.health > 0) {
                this.takeDamage(1); // Tower takes damage from attached enemies
            } else {
                this.attachedEnemies = this.attachedEnemies.filter(e => e !== enemy); // Remove dead enemies
            }
        });
    }

    findNearestEnemy() {
        let nearest = null;
        let minDistance = Infinity;
        this.scene.enemies.children.each(enemy => {
            const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, enemy.x, enemy.y);
            if (distance < this.range && distance < minDistance) {
                minDistance = distance;
                nearest = enemy;
            }
        });
        return nearest;
    }

    shoot(enemy) {
        const now = Date.now();
        if (now - this.lastFired > this.fireRate) {
            enemy.takeDamage(this.damage);
            this.lastFired = now;

            // Create a visual effect for the attack
            const projectile = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'projectile');
            this.scene.physics.add.existing(projectile);
            projectile.setDisplaySize(20, 20); // Resize projectile to 20x20 for better visibility
            this.scene.physics.moveTo(projectile, enemy.x, enemy.y, 300); // Move projectile towards enemy

            // Destroy the projectile after a short time
            setTimeout(() => {
                projectile.destroy();
            }, 500);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            console.log('Tower destroyed!');
        }
    }

    upgrade(attribute) {
        if (this.scene.ui.points >= this.upgradeCost[attribute]) {
            switch (attribute) {
                case 'damage':
                    this.damage += 5; // Increase damage
                    break;
                case 'range':
                    this.range += 50; // Increase range
                    break;
                case 'fireRate':
                    this.fireRate = Math.max(100, this.fireRate - 100); // Decrease fire rate (increase firing speed)
                    break;
                default:
                    console.log('Invalid upgrade attribute');
                    return;
            }
            this.scene.ui.points -= this.upgradeCost[attribute]; // Deduct points
            this.scene.ui.update(); // Update UI
            console.log(`${attribute} upgraded! New value: ${this[attribute]}`);
        } else {
            console.log('Not enough points to upgrade!');
        }
    }
}