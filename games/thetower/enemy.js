class Enemy {
    constructor(scene, group, tower, floor) {
        this.scene = scene;
        this.tower = tower;
        this.floor = floor;

        this.health = 5 * floor;
        this.damage = 0.1 * floor; // Aumenta il danno base
        this.speed = 50 * (1 + (floor - 1) * 0.1);

        const baseSize = 6;
        const sizeIncrease = (floor - 1) * 0.5; // Aumenta di 0.5 per ogni livello oltre il primo
        const size = baseSize + sizeIncrease;

        const spawnPosition = this.getRandomSpawnPosition();
        this.sprite = scene.physics.add.sprite(spawnPosition.x, spawnPosition.y, 'enemy')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(size, size);

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
            coins += this.floor;
            exp += this.floor;
            killCount++; // Incrementa il contatore di kill
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
