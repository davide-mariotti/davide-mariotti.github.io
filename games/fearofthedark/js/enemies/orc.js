class Orc extends Enemy {
    constructor(x, y, subtype = 'warrior') {
        super(x, y, 'orc', subtype);
        
        // Modifica stats in base al sottotipo
        switch(subtype) {
            case 'warrior':
                this.stats.hp = 150;
                this.stats.damage = 15;
                this.stats.defense = 8;
                this.stats.speed = 2;
                this.stats.experience = 75;
                break;
            case 'berserk':
                this.stats.hp = 120;
                this.stats.damage = 20;
                this.stats.defense = 5;
                this.stats.speed = 4;
                this.stats.experience = 100;
                break;
            case 'shaman':
                this.stats.hp = 80;
                this.stats.damage = 25;
                this.stats.defense = 3;
                this.stats.speed = 2;
                this.stats.experience = 125;
                this.attackRange = 200; // Attacco a distanza
                break;
        }
    }

    // Override del metodo attack per lo shaman
    attack(player) {
        if (this.subtype === 'shaman') {
            // Implementa attacco magico
            // ...
        } else {
            super.attack(player);
        }
    }
} 