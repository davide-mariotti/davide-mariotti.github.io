class Slime extends Enemy {
    constructor(x, y, subtype = 'blue') {
        super(x, y, 'slime', subtype);
        
        // Modifica stats in base al colore
        switch(subtype) {
            case 'blue':
                this.stats.hp = 50;
                this.stats.damage = 5;
                this.stats.defense = 2;
                this.stats.speed = 1;
                this.stats.experience = 25;
                break;
            case 'red':
                this.stats.hp = 75;
                this.stats.damage = 8;
                this.stats.defense = 3;
                this.stats.speed = 1.5;
                this.stats.experience = 35;
                break;
            case 'green':
                this.stats.hp = 60;
                this.stats.damage = 6;
                this.stats.defense = 4;
                this.stats.speed = 1.2;
                this.stats.experience = 30;
                break;
        }
    }

    // Movimento specifico dello slime (salto)
    update(player) {
        if (this.isDead) return;

        // Aggiungi logica di salto casuale
        if (Math.random() < 0.02 && this.velocityY === 0) {
            this.velocityY = -8;
        }

        super.update(player);
    }
} 