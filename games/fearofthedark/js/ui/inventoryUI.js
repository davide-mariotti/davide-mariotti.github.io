class InventoryUI {
    constructor(player) {
        this.player = player;
        this.inventory = player.inventory;
        this.isOpen = false;
        this.draggedItem = null;
        this.draggedElement = null;
        this.setupEventListeners();
        this.createInventorySlots();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyI') {
                this.toggleInventory();
            }
        });

        document.getElementById('close-inventory').addEventListener('click', () => {
            this.toggleInventory();
        });

        // Gestione tooltip
        document.querySelectorAll('.inventory-slot, .equip-slot').forEach(slot => {
            slot.addEventListener('mouseover', (e) => this.showTooltip(e));
            slot.addEventListener('mouseout', () => this.hideTooltip());
            slot.addEventListener('click', (e) => this.handleSlotClick(e));
        });

        // Gestione drag and drop
        document.querySelectorAll('.inventory-slot, .equip-slot').forEach(slot => {
            slot.addEventListener('dragstart', (e) => this.handleDragStart(e));
            slot.addEventListener('dragend', (e) => this.handleDragEnd(e));
            slot.addEventListener('dragover', (e) => this.handleDragOver(e));
            slot.addEventListener('drop', (e) => this.handleDrop(e));
            slot.setAttribute('draggable', 'true');
        });

        // Previeni il trascinamento dell'immagine di default
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
    }

    createInventorySlots() {
        const grid = document.querySelector('.inventory-grid');
        grid.innerHTML = '';
        
        for (let i = 0; i < this.inventory.size; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.index = i;
            grid.appendChild(slot);
        }
    }

    toggleInventory() {
        this.isOpen = !this.isOpen;
        document.getElementById('inventory-screen').style.display = 
            this.isOpen ? 'flex' : 'none';
        
        if (this.isOpen) {
            this.updateUI();
        }
    }

    updateUI() {
        // Aggiorna slots inventario
        this.inventory.items.forEach((item, index) => {
            const slot = document.querySelector(`.inventory-slot[data-index="${index}"]`);
            this.updateSlot(slot, item);
        });

        // Aggiorna slots equipaggiamento
        Object.entries(this.inventory.equipment).forEach(([slot, item]) => {
            const equipSlot = document.querySelector(`.equip-slot[data-slot="${slot}"]`);
            this.updateSlot(equipSlot, item);
        });

        // Aggiorna statistiche
        const stats = this.player.getEffectiveStats();
        Object.entries(stats).forEach(([stat, value]) => {
            const element = document.getElementById(`stat-${stat}`);
            if (element) element.textContent = value;
        });
    }

    updateSlot(slot, item) {
        slot.innerHTML = '';
        if (item) {
            const img = document.createElement('img');
            img.src = item.sprite.src;
            img.style.width = '100%';
            img.style.height = '100%';
            slot.appendChild(img);
            slot.classList.add(item.rarity);

            if (item.stackable && item.quantity > 1) {
                const quantity = document.createElement('div');
                quantity.className = 'item-quantity';
                quantity.textContent = item.quantity;
                slot.appendChild(quantity);
            }
        }
    }

    showTooltip(e) {
        const slot = e.currentTarget;
        const item = this.getItemFromSlot(slot);
        if (!item) return;

        const tooltip = document.querySelector('.item-tooltip');
        tooltip.innerHTML = item.getDescription();
        tooltip.style.display = 'block';
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
    }

    hideTooltip() {
        document.querySelector('.item-tooltip').style.display = 'none';
    }

    handleSlotClick(e) {
        const slot = e.currentTarget;
        const item = this.getItemFromSlot(slot);

        if (slot.classList.contains('equip-slot') && item) {
            this.inventory.unequipItem(slot.dataset.slot);
        } else if (slot.classList.contains('inventory-slot') && item) {
            const equipType = item.equipType;
            if (equipType) {
                this.inventory.equipItem(item, equipType);
            }
        }

        // Gestione shift+click per splittare gli stack
        if (e.shiftKey && item && item.stackable && item.quantity > 1) {
            const splitAmount = Math.floor(item.quantity / 2);
            const newItem = item.split(splitAmount);
            if (newItem) {
                this.inventory.addItem(newItem);
                this.updateUI();
            }
        }

        this.updateUI();
    }

    getItemFromSlot(slot) {
        if (slot.classList.contains('equip-slot')) {
            return this.inventory.equipment[slot.dataset.slot];
        } else {
            return this.inventory.items[slot.dataset.index];
        }
    }

    handleDragStart(e) {
        const slot = e.currentTarget;
        const item = this.getItemFromSlot(slot);
        if (!item) return;

        this.draggedItem = item;
        this.draggedElement = slot;
        
        // Crea un'immagine fantasma personalizzata per il drag
        const ghost = slot.cloneNode(true);
        ghost.style.position = 'absolute';
        ghost.style.top = '-1000px';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 32, 32);
        setTimeout(() => document.body.removeChild(ghost), 0);

        slot.classList.add('dragging');
        this.hideTooltip();
    }

    handleDragEnd(e) {
        const slot = e.currentTarget;
        slot.classList.remove('dragging');
        this.draggedItem = null;
        this.draggedElement = null;
    }

    handleDragOver(e) {
        e.preventDefault();
        const slot = e.currentTarget;
        
        if (this.canDropItem(this.draggedItem, slot)) {
            slot.classList.add('drop-target');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const slot = e.currentTarget;
        const slotIndex = parseInt(slot.dataset.slot) - 1;
        const item = window.game.menuManager.inventoryUI.draggedItem;

        if (item && this.canAssignToHotbar(item)) {
            this.assignToSlot(slotIndex, item);
            window.game.audioManager.playSound('equip');
            this.updateUI();
        }
    }

    canDropItem(item, targetSlot) {
        if (!item) return false;

        if (targetSlot.classList.contains('equip-slot')) {
            return this.inventory.canEquip(item, targetSlot.dataset.slot);
        }

        return targetSlot.classList.contains('inventory-slot');
    }

    swapItems(sourceSlot, targetSlot) {
        if (sourceSlot.classList.contains('inventory-slot') && 
            targetSlot.classList.contains('inventory-slot')) {
            // Scambio tra slot dell'inventario
            const sourceIndex = parseInt(sourceSlot.dataset.index);
            const targetIndex = parseInt(targetSlot.dataset.index);
            const temp = this.inventory.items[targetIndex];
            this.inventory.items[targetIndex] = this.inventory.items[sourceIndex];
            this.inventory.items[sourceIndex] = temp;
        } else if (sourceSlot.classList.contains('inventory-slot') && 
                   targetSlot.classList.contains('equip-slot')) {
            // Equipaggia oggetto
            const sourceIndex = parseInt(sourceSlot.dataset.index);
            const targetEquipSlot = targetSlot.dataset.slot;
            const currentEquipped = this.inventory.equipment[targetEquipSlot];
            
            this.inventory.equipment[targetEquipSlot] = this.inventory.items[sourceIndex];
            this.inventory.items[sourceIndex] = currentEquipped;
        } else if (sourceSlot.classList.contains('equip-slot') && 
                   targetSlot.classList.contains('inventory-slot')) {
            // Rimuovi equipaggiamento
            const sourceEquipSlot = sourceSlot.dataset.slot;
            const targetIndex = parseInt(targetSlot.dataset.index);
            const currentItem = this.inventory.items[targetIndex];
            
            this.inventory.items[targetIndex] = this.inventory.equipment[sourceEquipSlot];
            this.inventory.equipment[sourceEquipSlot] = currentItem;
        }
    }
} 