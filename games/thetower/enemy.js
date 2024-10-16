class Enemy {
    constructor(scene, group, tower, floor, isBoss = false) {
        this.scene = scene;
        this.tower = tower;
        this.floor = floor;
        this.isBoss = isBoss;

        if (isBoss) {
            this.health = 50 * Math.pow(1.2, floor / 10);
            this.damage = 0.5 * Math.pow(1.2, floor / 10);
            this.speed = 30 * (1 + (floor - 1) * 0.05);
            this.size = 20 + (floor / 10);
        } else {
            this.health = 3 * floor;
            this.damage = 0.1 * floor;
            this.speed = 50 * (1 + (floor - 1) * 0.1);
            this.size = 6 + (floor - 1) * 0.5;
        }

        const spawnPosition = this.getRandomSpawnPosition();
        this.sprite = scene.physics.add.sprite(spawnPosition.x, spawnPosition.y, isBoss ? 'boss' : 'enemy')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(this.size, this.size);

        this.sprite.setData('enemyObject', this);
        group.add(this.sprite);

        scene.physics.moveToObject(this.sprite, tower.sprite, this.speed);

        this.isAttacking = false;
        this.isPaused = false;
    }

    update(time) {
        if (this.isPaused) return;

        const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.tower.sprite.x, this.tower.sprite.y);
        if (distance < 15 && !this.isAttacking) {
            this.isAttacking = true;
            this.sprite.setVelocity(0, 0);
        }
        
        if (this.isAttacking) {
            this.tower.takeDamage(this.damage);
        }
    }

    pause() {
        this.isPaused = true;
        this.sprite.setVelocity(0, 0);
    }

    resume() {
        this.isPaused = false;
        if (!this.isAttacking) {
            this.moveTowardsTower();
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            coins += this.isBoss ? this.floor * 10 : this.floor;
            exp += this.isBoss ? this.floor * 5 : this.floor;
            killCount++;
            if (this.isBoss) {
                debugLogger.log(`Boss defeated on floor ${this.floor}!`);
            }
            this.sprite.destroy();
            this.scene.events.emit('updateUI');
            saveGameState();
        }
    }

    getRandomSpawnPosition() {
        const side = Phaser.Math.Between(0, 3);
        let position = { x: 0, y: 0 };

        switch (side) {
            case 0: // Top
                position.x = Phaser.Math.Between(0, 500);
                position.y = 0;
                break;
            case 1: // Right
                position.x = 500;
                position.y = Phaser.Math.Between(0, 500);
                break;
            case 2: // Bottom
                position.x = Phaser.Math.Between(0, 500);
                position.y = 500;
                break;
            case 3: // Left
                position.x = 0;
                position.y = Phaser.Math.Between(0, 500);
                break;
        }
        return position;
    }

    isAlive() {
        return this.health > 0;
    }

    moveTowardsTower() {
        if (!this.isAttacking) {
            const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, this.tower.sprite.x, this.tower.sprite.y);
            const velocityX = Math.cos(angle) * this.speed;
            const velocityY = Math.sin(angle) * this.speed;
            this.sprite.setVelocity(velocityX, velocityY);
        }
    }
}
