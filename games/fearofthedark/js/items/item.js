class Item {
    constructor(x, y, type, rarity) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.type = type;
        this.rarity = rarity;
        this.velocityY = -5; // Salto iniziale quando viene droppato
        this.velocityX = (Math.random() - 0.5) * 4; // Movimento casuale orizzontale
        this.isCollected = false;
        
        // Carica sprite
        this.sprite = new Image();
        this.sprite.src = `assets/images/items/${type}.png`;
        
        // Effetto fluttuante
        this.floatOffset = 0;
        this.floatSpeed = 0.05;

        this.stackable = false;
        this.maxStack = 1;
        this.quantity = 1;
    }

    update() {
        if (this.isCollected) return;

        // Applica gravità
        this.velocityY += window.game.physics.gravity * 0.5;
        
        // Aggiorna posizione
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Effetto fluttuante
        this.floatOffset = Math.sin(Date.now() * this.floatSpeed) * 5;
    }

    draw(ctx) {
        if (this.isCollected) return;
        
        if (this.sprite.complete) {
            ctx.save();
            // Effetto luminoso basato sulla rarità
            ctx.shadowColor = this.getRarityColor();
            ctx.shadowBlur = 10;
            ctx.drawImage(this.sprite, this.x, this.y + this.floatOffset, this.width, this.height);
            ctx.restore();
        }
    }

    collect(player) {
        this.isCollected = true;
        this.applyEffect(player);
    }

    applyEffect(player) {
        // Implementato nelle sottoclassi
    }

    getRarityColor() {
        switch(this.rarity) {
            case 'common': return '#ffffff';
            case 'uncommon': return '#2ecc71';
            case 'rare': return '#3498db';
            case 'epic': return '#9b59b6';
            case 'legendary': return '#f1c40f';
            default: return '#ffffff';
        }
    }

    getDescription() {
        let desc = `${this.type} (${this.rarity})\n`;
        if (this.stackable) {
            desc += `Quantità: ${this.quantity}\n`;
        }
        return desc;
    }

    canStackWith(item) {
        return this.stackable && 
               item.stackable && 
               this.type === item.type && 
               this.rarity === item.rarity;
    }

    addToStack(quantity) {
        if (!this.stackable) return 0;
        const spaceLeft = this.maxStack - this.quantity;
        const addAmount = Math.min(quantity, spaceLeft);
        this.quantity += addAmount;
        return addAmount;
    }

    removeFromStack(quantity) {
        if (!this.stackable) return 0;
        const removeAmount = Math.min(quantity, this.quantity);
        this.quantity -= removeAmount;
        return removeAmount;
    }

    split(amount) {
        if (!this.stackable || amount >= this.quantity) return null;
        
        const newItem = new this.constructor(this.x, this.y, this.type, this.rarity);
        newItem.quantity = amount;
        this.quantity -= amount;
        return newItem;
    }
} 