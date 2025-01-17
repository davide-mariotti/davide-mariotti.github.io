class TradingUI {
    constructor(player) {
        this.player = player;
        this.currentMerchant = null;
        this.isOpen = false;
        this.selectedItem = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('close-trading').addEventListener('click', () => {
            this.closeTradingWindow();
        });

        // Gestione quantità
        document.getElementById('quantity-decrease').addEventListener('click', () => {
            const input = document.getElementById('quantity-input');
            input.value = Math.max(1, parseInt(input.value) - 1);
            this.updateTotalPrice();
        });

        document.getElementById('quantity-increase').addEventListener('click', () => {
            const input = document.getElementById('quantity-input');
            input.value = Math.min(99, parseInt(input.value) + 1);
            this.updateTotalPrice();
        });

        document.getElementById('quantity-input').addEventListener('change', () => {
            this.updateTotalPrice();
        });

        // Bottoni di acquisto/vendita
        document.getElementById('buy-button').addEventListener('click', () => {
            this.executePurchase();
        });

        document.getElementById('sell-button').addEventListener('click', () => {
            this.executeSale();
        });
    }

    openTradingWindow(merchant) {
        this.currentMerchant = merchant;
        this.isOpen = true;
        document.getElementById('trading-screen').style.display = 'flex';
        document.getElementById('merchant-name').textContent = merchant.name;
        this.updateMerchantInventory();
        this.updatePlayerInventory();
        this.updateGoldDisplay();
    }

    closeTradingWindow() {
        this.isOpen = false;
        this.currentMerchant = null;
        this.selectedItem = null;
        document.getElementById('trading-screen').style.display = 'none';
    }

    updateMerchantInventory() {
        const container = document.querySelector('.merchant-inventory');
        container.innerHTML = '';

        this.currentMerchant.inventory.forEach(({ item, quantity }) => {
            const element = this.createItemElement(item, quantity, true);
            container.appendChild(element);
        });
    }

    updatePlayerInventory() {
        const container = document.querySelector('.player-inventory');
        container.innerHTML = '';

        this.player.inventory.items.forEach(item => {
            if (item) {
                const element = this.createItemElement(item, item.quantity, false);
                container.appendChild(element);
            }
        });
    }

    createItemElement(item, quantity, isMerchantItem) {
        const element = document.createElement('div');
        element.className = `trade-item ${item.rarity}`;
        
        const price = isMerchantItem ? 
            this.currentMerchant.getBuyPrice(item) : 
            this.currentMerchant.getSellPrice(item);

        element.innerHTML = `
            <img src="assets/images/items/${item.type}.png" alt="${item.type}">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-quantity">x${quantity}</span>
                <span class="item-price">${price} Oro</span>
            </div>
        `;

        element.addEventListener('click', () => {
            this.selectItem(item, isMerchantItem);
            document.querySelectorAll('.trade-item').forEach(el => 
                el.classList.remove('selected'));
            element.classList.add('selected');
        });

        return element;
    }

    selectItem(item, isMerchantItem) {
        this.selectedItem = { item, isMerchantItem };
        this.updateItemDetails();
        this.updateTotalPrice();
    }

    updateItemDetails() {
        const details = document.querySelector('.item-details');
        if (!this.selectedItem) {
            details.innerHTML = '<p>Seleziona un oggetto</p>';
            return;
        }

        const { item, isMerchantItem } = this.selectedItem;
        const price = isMerchantItem ? 
            this.currentMerchant.getBuyPrice(item) : 
            this.currentMerchant.getSellPrice(item);

        details.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.getDescription()}</p>
            <div class="price-info">
                <span>Prezzo: ${price} Oro</span>
            </div>
        `;
    }

    updateTotalPrice() {
        if (!this.selectedItem) return;

        const quantity = parseInt(document.getElementById('quantity-input').value);
        const { item, isMerchantItem } = this.selectedItem;
        const price = isMerchantItem ? 
            this.currentMerchant.getBuyPrice(item) : 
            this.currentMerchant.getSellPrice(item);

        document.getElementById('total-price').textContent = price * quantity;
    }

    updateGoldDisplay() {
        document.getElementById('player-gold').textContent = this.player.gold;
        document.getElementById('merchant-gold').textContent = this.currentMerchant.gold;
    }

    executePurchase() {
        if (!this.selectedItem || !this.selectedItem.isMerchantItem) return;

        const quantity = parseInt(document.getElementById('quantity-input').value);
        const success = window.game.tradingSystem.buyFromMerchant(
            this.currentMerchant.id,
            this.selectedItem.item.type,
            quantity,
            this.player
        );

        if (success) {
            window.game.audioManager.playSound('coin');
            this.updateMerchantInventory();
            this.updatePlayerInventory();
            this.updateGoldDisplay();
            this.selectedItem = null;
            this.updateItemDetails();
        } else {
            alert('Non puoi permetterti questo acquisto!');
        }
    }

    executeSale() {
        if (!this.selectedItem || this.selectedItem.isMerchantItem) return;

        const quantity = parseInt(document.getElementById('quantity-input').value);
        const success = window.game.tradingSystem.sellToMerchant(
            this.currentMerchant.id,
            this.selectedItem.item,
            quantity,
            this.player
        );

        if (success) {
            window.game.audioManager.playSound('coin');
            this.updateMerchantInventory();
            this.updatePlayerInventory();
            this.updateGoldDisplay();
            this.selectedItem = null;
            this.updateItemDetails();
        } else {
            alert('Il mercante non può permettersi questo acquisto!');
        }
    }
} 