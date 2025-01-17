class ConsumableItem extends Item {
    constructor(x, y, type, rarity) {
        super(x, y, type, rarity);
        this.stackable = true;
        this.maxStack = 99;
        
        // Definisci effetti in base al tipo
        switch(type) {
            case 'healthPotion':
                this.healAmount = 30 + (this.getRarityMultiplier() * 10);
                break;
            case 'manaPotion':
                this.manaAmount = 20 + (this.getRarityMultiplier() * 8);
                break;
            case 'strengthPotion':
                this.strengthBonus = 5 + (this.getRarityMultiplier() * 2);
                this.duration = 10000; // 10 secondi
                break;
        }
    }

    getRarityMultiplier() {
        switch(this.rarity) {
            case 'common': return 1;
            case 'uncommon': return 1.5;
            case 'rare': return 2;
            case 'epic': return 2.5;
            case 'legendary': return 3;
            default: return 1;
        }
    }

    applyEffect(player) {
        if (this.quantity <= 0) return;
        
        switch(this.type) {
            case 'healthPotion':
                player.heal(this.healAmount);
                window.game.audioManager.playSound('heal');
                break;
            case 'manaPotion':
                player.restoreMp(this.manaAmount);
                window.game.audioManager.playSound('mana');
                break;
            case 'strengthPotion':
                player.addTemporaryBuff('strength', this.strengthBonus, this.duration);
                window.game.audioManager.playSound('buff');
                break;
        }
        
        this.quantity--;
        return this.quantity <= 0;
    }
} 