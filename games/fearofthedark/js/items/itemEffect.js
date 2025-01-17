class ItemEffect {
    constructor(name, description, tier) {
        this.name = name;
        this.description = description;
        this.tier = tier; // rare, epic, legendary
    }

    apply(player) {
        // Implementato nelle sottoclassi
    }

    remove(player) {
        // Implementato nelle sottoclassi
    }
}

class VampirismEffect extends ItemEffect {
    constructor() {
        super('Vampirismo', 'Ruba 5% di vita con ogni colpo', 'rare');
        this.lifeStealPercent = 0.05;
    }

    apply(player, damage) {
        const healing = Math.round(damage * this.lifeStealPercent);
        player.heal(healing);
    }
}

class SpeedEffect extends ItemEffect {
    constructor() {
        super('Velocità', 'Aumenta la velocità del 10%', 'rare');
        this.speedBonus = 0.1;
    }

    apply(player) {
        player.speed *= (1 + this.speedBonus);
    }

    remove(player) {
        player.speed /= (1 + this.speedBonus);
    }
}

class CriticalEffect extends ItemEffect {
    constructor() {
        super('Critico', 'Aumenta danno critico del 50%', 'epic');
        this.critBonus = 0.5;
    }

    apply(player, damage) {
        if (Math.random() < 0.2) { // 20% di probabilità di colpo critico
            return damage * (1 + this.critBonus);
        }
        return damage;
    }
}

class RegenerationEffect extends ItemEffect {
    constructor() {
        super('Rigenerazione', 'Rigenera HP nel tempo', 'epic');
        this.healAmount = 1;
        this.interval = 1000; // 1 secondo
        this.timerId = null;
    }

    apply(player) {
        this.timerId = setInterval(() => {
            player.heal(this.healAmount);
        }, this.interval);
    }

    remove() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    }
}

class BerserkerEffect extends ItemEffect {
    constructor() {
        super('Furia', 'Aumenta danno con HP bassi', 'legendary');
        this.maxBonus = 1.0; // 100% di danno extra a HP bassi
    }

    apply(player, damage) {
        const hpPercent = player.hp / player.maxHp;
        const bonus = this.maxBonus * (1 - hpPercent);
        return damage * (1 + bonus);
    }
}

class InvulnerabilityEffect extends ItemEffect {
    constructor() {
        super('Invulnerabilità', 'Chance di evitare danni', 'legendary');
        this.chance = 0.15; // 15% di chance di evitare danni
    }

    apply(player, damage) {
        if (Math.random() < this.chance) {
            return 0;
        }
        return damage;
    }
} 