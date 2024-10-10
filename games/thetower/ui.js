// ui.js
class UI {
    constructor(scene) {
        this.scene = scene;
        this.points = 0; // Initialize points
        this.createUpgradeMenu();
        this.createHealthText();
    }

    createUpgradeMenu() {
        // Create UI elements for upgrades
        this.text = this.scene.add.text(10, 10, 'Points: 0', { fontSize: '32px', fill: '#fff' });

        // Create upgrade buttons
        this.createUpgradeButton('Damage Upgrade', 10, 50, 'damage');
        this.createUpgradeButton('Range Upgrade', 10, 100, 'range');
        this.createUpgradeButton('Fire Rate Upgrade', 10, 150, 'fireRate');
    }

    createUpgradeButton(label, x, y, attribute) {
        const button = this.scene.add.text(x, y, label, { fontSize: '24px', fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => this.handleUpgrade(attribute));

        // Add hover effects
        button.on('pointerover', () => button.setStyle({ fill: '#ff0' }));
        button.on('pointerout', () => button.setStyle({ fill: '#0f0' }));
    }

    createHealthText() {
        this.towerHealthText = this.scene.add.text(10, 200, 'Tower HP: 100', { fontSize: '24px', fill: '#fff' });
    }

    update() {
        this.text.setText('Points: ' + this.points);
        if (this.scene.tower) {
            this.towerHealthText.setText('Tower HP: ' + this.scene.tower.health);
        }
    }

    handleUpgrade(attribute) {
        // Call the tower's upgrade method
        this.scene.tower.upgrade(attribute);
    }

    addPoints(amount) {
        this.points += amount; // Method to add points when enemies are defeated
        this.update(); // Update UI
    }
}