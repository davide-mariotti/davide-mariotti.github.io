class QuestReward {
    constructor(type, amount) {
        this.type = type;
        this.amount = amount;
    }

    give(player) {
        switch(this.type) {
            case 'experience':
                player.character.levelSystem.addExperience(this.amount);
                break;
            case 'gold':
                player.addGold(this.amount);
                break;
            case 'item':
                player.inventory.addItem(this.amount); // amount è l'oggetto in questo caso
                break;
        }
    }

    getDescription() {
        switch(this.type) {
            case 'experience':
                return `${this.amount} XP`;
            case 'gold':
                return `${this.amount} Oro`;
            case 'item':
                return `${this.amount.name}`;
            default:
                return '';
        }
    }
} 