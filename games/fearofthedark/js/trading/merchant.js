class Merchant {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type; // general, weapons, armor, magic
        this.inventory = [];
        this.gold = 1000;
        this.buyMultiplier = 1.5;  // Il prezzo di vendita è più alto del valore base
        this.sellMultiplier = 0.5; // Il mercante compra a metà prezzo
        this.initializeInventory();
    }

    initializeInventory() {
        switch(this.type) {
            case 'general':
                this.addItem(new ConsumableItem(0, 0, 'healthPotion', 'common'), 10);
                this.addItem(new ConsumableItem(0, 0, 'manaPotion', 'common'), 10);
                break;
            case 'weapons':
                this.addItem(new EquipmentItem(0, 0, 'ironSword', 'common', 'weapon'), 1);
                this.addItem(new EquipmentItem(0, 0, 'steelSword', 'uncommon', 'weapon'), 1);
                break;
            case 'armor':
                this.addItem(new EquipmentItem(0, 0, 'leatherArmor', 'common', 'armor'), 1);
                this.addItem(new EquipmentItem(0, 0, 'ironArmor', 'uncommon', 'armor'), 1);
                break;
            case 'magic':
                this.addItem(new ConsumableItem(0, 0, 'magicScroll', 'rare'), 5);
                this.addItem(new EquipmentItem(0, 0, 'magicStaff', 'rare', 'weapon'), 1);
                break;
        }
    }

    addItem(item, quantity = 1) {
        const existingItem = this.inventory.find(i => i.item.type === item.type);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.inventory.push({ item, quantity });
        }
    }

    removeItem(itemType, quantity = 1) {
        const itemIndex = this.inventory.findIndex(i => i.item.type === itemType);
        if (itemIndex === -1) return false;

        const inventoryItem = this.inventory[itemIndex];
        if (inventoryItem.quantity < quantity) return false;

        inventoryItem.quantity -= quantity;
        if (inventoryItem.quantity <= 0) {
            this.inventory.splice(itemIndex, 1);
        }
        return true;
    }

    getBuyPrice(item) {
        return Math.floor(item.baseValue * this.buyMultiplier);
    }

    getSellPrice(item) {
        return Math.floor(item.baseValue * this.sellMultiplier);
    }

    canAfford(price) {
        return this.gold >= price;
    }

    buyFromPlayer(item, quantity = 1) {
        const price = this.getSellPrice(item) * quantity;
        if (!this.canAfford(price)) return false;

        this.gold -= price;
        this.addItem(item, quantity);
        return price;
    }

    sellToPlayer(itemType, quantity = 1) {
        const inventoryItem = this.inventory.find(i => i.item.type === itemType);
        if (!inventoryItem || inventoryItem.quantity < quantity) return false;

        const price = this.getBuyPrice(inventoryItem.item) * quantity;
        this.gold += price;
        this.removeItem(itemType, quantity);
        return price;
    }

    restockInventory() {
        this.initializeInventory();
        this.gold = 1000; // Reset gold
    }
} 