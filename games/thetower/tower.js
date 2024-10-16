// games/thetower/tower.js
class Tower {
    constructor(scene, enemies) {
        this.scene = scene;
        this.enemies = enemies;
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.attackRate = 2000;
        this.damage = 1;
        this.baseSize = 10;
        this.projectileSize = 2;
        this.sprite = scene.physics.add.image(250, 250, 'tower').setOrigin(0.5, 0.5).setDisplaySize(this.baseSize, this.baseSize);
        
        this.lastAttackTime = 0;
        this.currentTarget = null;
    }

    update(time) {
        if (time - this.lastAttackTime > this.attackRate) {
            this.attack();
            this.lastAttackTime = time;
        }

        // Verifica se il bersaglio corrente è ancora valido
        if (this.currentTarget && (!this.currentTarget.active || this.currentTarget.getData('enemyObject').health <= 0)) {
            this.currentTarget = null;
        }
    }

    attack() {
        if (!this.currentTarget) {
            this.currentTarget = this.findNearestEnemy();
        }

        if (this.currentTarget) {
            const enemy = this.currentTarget.getData('enemyObject');
            const projectile = this.scene.physics.add.image(this.sprite.x, this.sprite.y, 'projectile')
                .setDisplaySize(this.projectileSize, this.projectileSize);
            this.scene.physics.moveTo(projectile, this.currentTarget.x, this.currentTarget.y, 300);

            this.scene.physics.add.overlap(projectile, this.currentTarget, (proj, enemySprite) => {
                enemy.takeDamage(this.damage);
                if (enemy.health <= 0) {
                    this.currentTarget = null;
                    enemySprite.destroy();
                    this.scene.events.emit('updateUI');
                }
                proj.destroy();
            });
        }
    }

    findNearestEnemy() {
        return this.enemies.getChildren().reduce((nearest, enemy) => {
            if (!nearest || Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, enemy.x, enemy.y) < Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, nearest.x, nearest.y)) {
                return enemy;
            }
            return nearest;
        }, null);
    }

    takeDamage(amount) {
        this.health -= amount;
        this.health = Math.max(0, Math.round(this.health * 100) / 100); // Arrotonda a due decimali
        //debugLogger.log(`Tower took damage: ${amount.toFixed(2)}, New health: ${this.health.toFixed(2)}`);
        debugLogger.log(`Tower took damage -${amount.toFixed(2)}`);
        if (this.health <= 0) {
            this.health = 0; // Assicurati che la salute non scenda sotto lo zero
            this.scene.events.emit('gameOver');
        }
    }

    reset() {
        this.health = this.maxHealth;
        this.sprite.setActive(true).setVisible(true);
    }

    upgradeHealth(value) {
        this.maxHealth += value;
        this.health = this.maxHealth;
    }

    upgradeDamage(value) {
        this.damage += value;
    }

    upgradeAttackRate(value) {
        this.attackRate = Math.max(500, this.attackRate - value);
    }

    levelUp() {
        const upgradeType = Math.floor(Math.random() * 3); // 0: health, 1: damage, 2: attack rate

        switch (upgradeType) {
            case 0:
                this.maxHealth += 0.1;
                this.health = this.maxHealth;
                debugLogger.log(`LVL Up! HP increased to ${this.maxHealth.toFixed(1)}`);
                break;
            case 1:
                this.damage += 0.1;
                debugLogger.log(`LVL Up! DMG increased to ${this.damage.toFixed(1)}`);
                break;
            case 2:
                this.attackRate = Math.max(500, this.attackRate - 10); // Diminuisce di 10ms, ma non scende sotto 500ms
                debugLogger.log(`LVL Up! ATK/rate increased to ${(1000 / this.attackRate).toFixed(2)} atk/s`);
                break;
        }

        // Aumenta leggermente le dimensioni della torre
        this.baseSize += 0.1;
        this.sprite.setDisplaySize(this.baseSize, this.baseSize);
        
        // Aumenta leggermente le dimensioni dei proiettili
        this.projectileSize += 0.02;
    }

    reset(boughtUpgrades) {
        this.maxHealth = boughtUpgrades.health;
        this.health = this.maxHealth;
        this.damage = boughtUpgrades.damage;
        this.attackRate = boughtUpgrades.attackRate;
        
        // Reset other properties that might have been changed during level ups
        this.baseSize = 10;
        this.sprite.setDisplaySize(this.baseSize, this.baseSize);
        this.projectileSize = 2;
        
        this.sprite.setActive(true).setVisible(true);
    }
}
