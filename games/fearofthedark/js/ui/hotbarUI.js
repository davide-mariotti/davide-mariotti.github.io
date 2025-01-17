class HotbarUI {
    constructor(player) {
        this.player = player;
        this.inventory = player.inventory;
        this.slots = new Array(4).fill(null); // Riferimenti agli oggetti nella hotbar
        this.cooldowns = new Map(); // Cooldown per ogni slot
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Gestione tasti numerici
        document.addEventListener('keydown', (e) => {
            const num = parseInt(e.key);
            if (num >= 1 && num <= 4) {
                this.useSlot(num - 1);
            }
        });

        // Gestione drag and drop dalla hotbar
        document.querySelectorAll('.hotbar-slot').forEach(slot => {
            slot.addEventListener('dragover', (e) => e.preventDefault());
            slot.addEventListener('drop', (e) => this.handleDrop(e));
            slot.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleDrop(e) {
        e.preventDefault();
        const slot = e.currentTarget;
        const slotIndex = parseInt(slot.dataset.slot) - 1;
        const item = window.game.menuManager.inventoryUI.draggedItem;

        if (item && this.canAssignToHotbar(item)) {
            this.assignToSlot(slotIndex, item);
            this.updateUI();
        }
    }

    handleClick(e) {
        const slot = e.currentTarget;
        const slotIndex = parseInt(slot.dataset.slot) - 1;
        this.useSlot(slotIndex);
    }

    canAssignToHotbar(item) {
        return item instanceof ConsumableItem && 
               (item.type === 'healthPotion' || item.type === 'manaPotion');
    }

    assignToSlot(slotIndex, item) {
        this.slots[slotIndex] = item;
    }

    useSlot(slotIndex) {
        const item = this.slots[slotIndex];
        if (!item) return;

        // Controlla cooldown
        const now = Date.now();
        const cooldownEnd = this.cooldowns.get(slotIndex) || 0;
        if (now < cooldownEnd) return;

        // Usa l'oggetto
        const shouldRemove = item.applyEffect(this.player);
        if (shouldRemove) {
            this.slots[slotIndex] = null;
        }

        // Applica cooldown
        this.cooldowns.set(slotIndex, now + 1000); // 1 secondo di cooldown
        this.updateUI();

        // Aggiorna visivamente il cooldown
        const slot = document.querySelector(`.hotbar-slot[data-slot="${slotIndex + 1}"]`);
        slot.classList.add('cooldown');
        setTimeout(() => {
            slot.classList.remove('cooldown');
        }, 1000);
    }

    updateUI() {
        document.querySelectorAll('.hotbar-slot').forEach((slot, index) => {
            const item = this.slots[index];
            slot.innerHTML = `<div class="hotkey">${index + 1}</div>`;
            
            if (item) {
                const img = document.createElement('img');
                img.src = item.sprite.src;
                img.style.width = '100%';
                img.style.height = '100%';
                slot.appendChild(img);

                if (item.stackable && item.quantity > 1) {
                    const quantity = document.createElement('div');
                    quantity.className = 'item-quantity';
                    quantity.textContent = item.quantity;
                    slot.appendChild(quantity);
                }
            }
        });
    }
} 