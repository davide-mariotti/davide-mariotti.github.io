class TradingSystem {
    constructor() {
        this.merchants = new Map();
        this.initializeMerchants();
    }

    initializeMerchants() {
        this.addMerchant(new Merchant('general_store', 'Mercante Generale', 'general'));
        this.addMerchant(new Merchant('blacksmith', 'Fabbro', 'weapons'));
        this.addMerchant(new Merchant('armorer', 'Armaiolo', 'armor'));
        this.addMerchant(new Merchant('wizard', 'Mago Mercante', 'magic'));
    }

    addMerchant(merchant) {
        this.merchants.set(merchant.id, merchant);
    }

    getMerchant(id) {
        return this.merchants.get(id);
    }

    buyFromMerchant(merchantId, itemType, quantity, player) {
        const merchant = this.getMerchant(merchantId);
        if (!merchant) return false;

        const inventoryItem = merchant.inventory.find(i => i.item.type === itemType);
        if (!inventoryItem) return false;

        const price = merchant.getBuyPrice(inventoryItem.item) * quantity;
        if (player.gold < price) return false;

        const success = merchant.sellToPlayer(itemType, quantity);
        if (success) {
            player.gold -= price;
            player.inventory.addItem(inventoryItem.item.clone(), quantity);
            return true;
        }
        return false;
    }

    sellToMerchant(merchantId, item, quantity, player) {
        const merchant = this.getMerchant(merchantId);
        if (!merchant) return false;

        const price = merchant.buyFromPlayer(item, quantity);
        if (price) {
            player.gold += price;
            player.inventory.removeItem(item.type, quantity);
            return true;
        }
        return false;
    }

    restockAllMerchants() {
        this.merchants.forEach(merchant => merchant.restockInventory());
    }
} 