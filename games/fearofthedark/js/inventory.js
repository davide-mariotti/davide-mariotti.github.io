class Inventory {
    constructor(size = 20) {
        this.size = size;
        this.items = new Array(size).fill(null);
        this.equipment = {
            weapon: null,
            armor: null,
            helmet: null,
            boots: null,
            accessory1: null,
            accessory2: null
        };
        this.equipmentSets = {
            'Guerriero di Ferro': {
                pieces: ['Iron Helmet', 'Iron Armor', 'Iron Boots'],
                bonus: {
                    2: { defense: 10 },
                    3: { defense: 20, attack: 5 }
                }
            },
            'Mago Arcano': {
                pieces: ['Arcane Hood', 'Arcane Robe', 'Arcane Boots'],
                bonus: {
                    2: { magic: 10 },
                    3: { magic: 20, mp: 50 }
                }
            }
        };
    }

    addItem(item) {
        if (item.stackable) {
            // Cerca uno stack esistente che può contenere l'item
            for (let i = 0; i < this.size; i++) {
                const existingItem = this.items[i];
                if (existingItem && existingItem.canStackWith(item)) {
                    const added = existingItem.addToStack(item.quantity);
                    if (added === item.quantity) {
                        return true;
                    }
                    item.quantity -= added;
                }
            }
        }

        // Se non è stato possibile stackare completamente, cerca uno slot vuoto
        const emptySlot = this.items.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
            this.items[emptySlot] = item;
            return true;
        }
        return false;
    }

    removeItem(index, quantity = 1) {
        const item = this.items[index];
        if (!item) return null;

        if (item.stackable && quantity < item.quantity) {
            return item.split(quantity);
        } else {
            this.items[index] = null;
            return item;
        }
    }

    equipItem(item, slot) {
        if (!this.canEquip(item, slot)) return false;
        
        // Rimuovi l'oggetto dall'inventario
        const itemIndex = this.items.indexOf(item);
        if (itemIndex === -1) return false;
        
        // Se c'è già un oggetto equipaggiato, scambialo con quello nell'inventario
        const currentEquipped = this.equipment[slot];
        if (currentEquipped) {
            this.items[itemIndex] = currentEquipped;
        } else {
            this.items[itemIndex] = null;
        }
        
        this.equipment[slot] = item;
        return true;
    }

    unequipItem(slot) {
        const item = this.equipment[slot];
        if (!item) return false;
        
        if (this.addItem(item)) {
            this.equipment[slot] = null;
            return true;
        }
        return false; // Inventario pieno
    }

    canEquip(item, slot) {
        // Verifica se l'oggetto può essere equipaggiato in quello slot
        switch(slot) {
            case 'weapon':
                return item.type === 'weapon';
            case 'armor':
                return item.type === 'armor';
            case 'helmet':
                return item.type === 'helmet';
            case 'boots':
                return item.type === 'boots';
            case 'accessory1':
            case 'accessory2':
                return item.type === 'accessory';
            default:
                return false;
        }
    }

    getStats() {
        // Calcola le statistiche totali dagli oggetti equipaggiati
        const stats = {
            attack: 0,
            defense: 0,
            speed: 0,
            magic: 0
        };

        Object.values(this.equipment).forEach(item => {
            if (item) {
                Object.entries(item.stats).forEach(([stat, value]) => {
                    if (stats.hasOwnProperty(stat)) {
                        stats[stat] += value;
                    }
                });
            }
        });

        return stats;
    }

    getActiveSetBonuses() {
        const bonuses = {};
        Object.entries(this.equipmentSets).forEach(([setName, setData]) => {
            const equippedPieces = setData.pieces.filter(piece => 
                Object.values(this.equipment).some(item => 
                    item && item.type === piece
                )
            );
            
            Object.entries(setData.bonus).forEach(([pieceCount, bonus]) => {
                if (equippedPieces.length >= parseInt(pieceCount)) {
                    Object.entries(bonus).forEach(([stat, value]) => {
                        bonuses[stat] = (bonuses[stat] || 0) + value;
                    });
                }
            });
        });
        return bonuses;
    }
} 