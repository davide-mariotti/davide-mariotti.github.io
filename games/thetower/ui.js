class UI {
    constructor(scene, tower) {
        this.scene = scene;
        this.tower = tower;

        // Statistiche della torre (in alto a sinistra)
        this.towerHealthText = this.scene.add.text(10, 10, '', { fontSize: '16px', fill: '#ffffff' });
        this.towerDamageText = this.scene.add.text(10, 30, '', { fontSize: '16px', fill: '#ffffff' });
        this.towerShootRatioText = this.scene.add.text(10, 50, '', { fontSize: '16px', fill: '#ffffff' });

        // Informazioni di gioco (in basso a sinistra)
        this.coinsText = this.scene.add.text(10, 435, '', { fontSize: '16px', fill: '#ffffff' });
        this.expText = this.scene.add.text(10, 455, '', { fontSize: '16px', fill: '#ffffff' });
        this.levelText = this.scene.add.text(10, 475, '', { fontSize: '16px', fill: '#ffffff' });

        // Aggiungi l'indicatore del floor
        this.floorText = this.scene.add.text(490, 490, '', { fontSize: '16px', fill: '#ffffff' });
        this.floorText.setOrigin(1, 1);

        // Aggiungi il contatore di kill
        this.killCountText = this.scene.add.text(490, 10, '', { fontSize: '16px', fill: '#ffffff' });
        this.killCountText.setOrigin(1, 0);

        this.bossWarningText = this.scene.add.text(250, 50, '', { fontSize: '24px', fill: '#ff0000' });
        this.bossWarningText.setOrigin(0.5);
        this.bossWarningText.setVisible(false);
    }

    update(coins, exp, level, floor, killCount) {
        // Aggiorna statistiche della torre
        this.towerHealthText.setText(`Tower Health: ${this.tower.health.toFixed(1)}/${this.tower.maxHealth.toFixed(1)}`);
        this.towerDamageText.setText(`Tower Damage: ${this.tower.damage.toFixed(1)}`);
        this.towerShootRatioText.setText(`Atk Rate: ${(1000 / this.tower.attackRate).toFixed(2)}/s`);

        // Aggiorna informazioni di gioco
        this.coinsText.setText(`Coins: ${coins}`);
        const nextLevelExp = getNextLevelExp(level);
        this.expText.setText(`EXP: ${exp}/${nextLevelExp}`);
        this.levelText.setText(`Tower lvl: ${level}`);

        // Aggiorna l'indicatore del floor
        this.floorText.setText(`Floor: ${floor}`);

        // Aggiorna il contatore di kill
        this.killCountText.setText(`Kills: ${killCount}`);

        // Mostra l'avviso del boss
        if (floor % 10 === 9) {
            this.bossWarningText.setText('Boss incoming!');
            this.bossWarningText.setVisible(true);
        } else if (floor % 10 === 0) {
            this.bossWarningText.setText('Boss floor!');
            this.bossWarningText.setVisible(true);
        } else {
            this.bossWarningText.setVisible(false);
        }
    }
}
