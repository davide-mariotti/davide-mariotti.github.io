class Marketplace {
    constructor(scene, tower, enemies) {
        this.scene = scene;
        this.tower = tower;
        this.enemies = enemies;
        this.upgrades = {
            health: { baseCost: 10, costMultiplier: 1.5, value: 5 },
            damage: { baseCost: 15, costMultiplier: 1.5, value: 1 },
            attackRate: { baseCost: 20, costMultiplier: 1.5, value: 100 }
        };
        this.panel = null;
        this.isVisible = false;
        this.upgradeButtons = {};
    }

    show() {
        this.isVisible = true;
        this.pauseGame();
        if (this.panel) {
            this.panel.setVisible(true);
            this.updateUpgradeButtons();
            return;
        }

        this.panel = this.scene.add.container(250, 250);

        const background = this.scene.add.rectangle(0, 0, 400, 300, 0x000000, 0.8);
        background.setOrigin(0.5);
        this.panel.add(background);

        const title = this.scene.add.text(0, -120, 'Marketplace', { fontSize: '24px', fill: '#ffffff' });
        title.setOrigin(0.5);
        this.panel.add(title);

        this.createUpgradeButton('health', -150, -50, () => this.buyUpgrade('health'));
        this.createUpgradeButton('damage', -150, 0, () => this.buyUpgrade('damage'));
        this.createUpgradeButton('attackRate', -150, 50, () => this.buyUpgrade('attackRate'));

        const restartButton = this.scene.add.text(0, 100, 'Restart Game', { fontSize: '20px', fill: '#ffffff' });
        restartButton.setOrigin(0.5);
        restartButton.setInteractive({ useHandCursor: true });
        restartButton.on('pointerdown', () => {
            this.hide();
            resetGame.call(this.scene);
        });
        this.panel.add(restartButton);
    }

    hide() {
        this.isVisible = false;
        this.resumeGame();
        if (this.panel) {
            this.panel.setVisible(false);
        }
    }

    pauseGame() {
        this.scene.physics.pause();
        this.scene.time.paused = true;
        if (this.scene.enemySpawnTimer) {
            this.scene.enemySpawnTimer.paused = true;
        }
        // Pause all enemies
        this.enemies.getChildren().forEach(enemy => {
            const enemyObject = enemy.getData('enemyObject');
            if (enemyObject) {
                enemyObject.pause();
            }
        });
    }

    resumeGame() {
        this.scene.physics.resume();
        this.scene.time.paused = false;
        if (this.scene.enemySpawnTimer) {
            this.scene.enemySpawnTimer.paused = false;
        }
        // Resume all enemies
        this.enemies.getChildren().forEach(enemy => {
            const enemyObject = enemy.getData('enemyObject');
            if (enemyObject) {
                enemyObject.resume();
            }
        });
    }

    createUpgradeButton(type, x, y, callback) {
        const upgrade = this.upgrades[type];
        const cost = this.getUpgradeCost(type);
        const button = this.scene.add.text(x, y, `Upgrade ${type} (${cost} coins)`, { fontSize: '18px', fill: '#ffffff' });
        button.setOrigin(0, 0.5);
        button.setInteractive({ useHandCursor: true });
        button.on('pointerdown', callback);
        this.panel.add(button);
        this.upgradeButtons[type] = button;
    }

    updateUpgradeButtons() {
        for (const type in this.upgradeButtons) {
            const cost = this.getUpgradeCost(type);
            this.upgradeButtons[type].setText(`Upgrade ${type} (${cost} coins)`);
        }
    }

    getUpgradeCost(type) {
        const upgrade = this.upgrades[type];
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, this.getUpgradeLevel(type)));
    }

    buyUpgrade(type) {
        const cost = this.getUpgradeCost(type);
        if (coins >= cost) {
            coins -= cost;
            switch(type) {
                case 'health':
                    this.tower.upgradeHealth(this.upgrades[type].value);
                    break;
                case 'damage':
                    this.tower.upgradeDamage(this.upgrades[type].value);
                    break;
                case 'attackRate':
                    this.tower.upgradeAttackRate(this.upgrades[type].value);
                    break;
            }
            debugLogger.log(`Upgraded ${type} to: ${this.tower[type]}`);
            this.scene.events.emit('updateUI');
            saveGameState();
            this.updateUpgradeButtons();
        } else {
            debugLogger.log('Not enough coins.');
        }
    }

    getUpgradeLevel(type) {
        switch(type) {
            case 'health':
                return Math.floor((this.tower.maxHealth - 10) / this.upgrades.health.value);
            case 'damage':
                return Math.floor((this.tower.damage - 1) / this.upgrades.damage.value);
            case 'attackRate':
                return Math.floor((2000 - this.tower.attackRate) / this.upgrades.attackRate.value);
        }
    }
}
