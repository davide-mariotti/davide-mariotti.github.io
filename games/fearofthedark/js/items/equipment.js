class EquipmentItem extends Item {
    constructor(x, y, type, rarity, equipType) {
        super(x, y, type, rarity);
        this.equipType = equipType;
        this.durability = 100;
        this.maxDurability = 100;
        this.broken = false;
        this.enchantmentLevel = 0;
        this.maxEnchantLevel = 5;
        this.stats = this.generateStats();
        this.specialEffects = this.generateSpecialEffects();
    }

    generateSpecialEffects() {
        const effects = [];
        if (this.rarity === 'rare') {
            effects.push(this.getRandomEffect('rare'));
        } else if (this.rarity === 'epic') {
            effects.push(this.getRandomEffect('rare'));
            effects.push(this.getRandomEffect('epic'));
        } else if (this.rarity === 'legendary') {
            effects.push(this.getRandomEffect('rare'));
            effects.push(this.getRandomEffect('epic'));
            effects.push(this.getRandomEffect('legendary'));
        }
        return effects;
    }

    getRandomEffect(tier) {
        const effectsByTier = {
            rare: [VampirismEffect, SpeedEffect],
            epic: [CriticalEffect, RegenerationEffect],
            legendary: [BerserkerEffect, InvulnerabilityEffect]
        };

        const EffectClass = effectsByTier[tier][Math.floor(Math.random() * effectsByTier[tier].length)];
        return new EffectClass();
    }

    takeDamage() {
        if (this.broken) return;
        this.durability--;
        if (this.durability <= 0) {
            this.broken = true;
            this.stats = {}; // Rimuove tutti i bonus quando rotto
        }
    }

    repair(amount) {
        this.durability = Math.min(this.maxDurability, this.durability + amount);
        if (this.durability > 0) {
            this.broken = false;
            this.stats = this.generateStats(); // Ripristina i bonus
        }
    }

    enchant() {
        if (this.enchantmentLevel >= this.maxEnchantLevel) return false;
        
        this.enchantmentLevel++;
        // Aumenta le statistiche base del 10% per ogni livello
        Object.keys(this.stats).forEach(stat => {
            this.stats[stat] = Math.round(this.stats[stat] * (1 + (this.enchantmentLevel * 0.1)));
        });
        
        return true;
    }

    getDescription() {
        let desc = super.getDescription();
        desc += `\nDurabilità: ${this.durability}/${this.maxDurability}`;
        if (this.broken) desc += '\n[ROTTO]';
        if (this.enchantmentLevel > 0) {
            desc += `\nPotenziamento: +${this.enchantmentLevel}`;
        }
        if (this.specialEffects.length > 0) {
            desc += '\nEffetti Speciali:\n';
            this.specialEffects.forEach(effect => {
                desc += `- ${effect.name}: ${effect.description}\n`;
            });
        }
        return desc;
    }
} 