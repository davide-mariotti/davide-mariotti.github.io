class LevelSystem {
    constructor(character) {
        this.character = character;
        this.level = 1;
        this.experience = 0;
        this.skillPoints = 0;
        
        // Punti esperienza necessari per livello
        this.expToLevel = level => Math.floor(100 * Math.pow(1.5, level - 1));
        
        // Statistiche base che aumentano per livello
        this.baseStats = {
            hp: 10,
            mp: 5,
            attack: 2,
            defense: 2,
            speed: 1,
            magic: 2
        };
        
        // Bonus statistiche per classe
        this.classBonus = {
            WARRIOR: { hp: 1.2, attack: 1.3, defense: 1.2, speed: 0.8, mp: 0.7, magic: 0.6 },
            MAGE: { hp: 0.8, attack: 0.7, defense: 0.7, speed: 0.9, mp: 1.3, magic: 1.4 },
            THIEF: { hp: 0.9, attack: 1.1, defense: 0.8, speed: 1.3, mp: 0.8, magic: 0.8 }
        };
    }

    addExperience(amount) {
        this.experience += amount;
        while (this.experience >= this.expToLevel(this.level)) {
            this.levelUp();
        }
    }

    levelUp() {
        this.experience -= this.expToLevel(this.level);
        this.level++;
        this.skillPoints += 2;
        
        // Aumenta le statistiche base
        Object.entries(this.baseStats).forEach(([stat, value]) => {
            const classMultiplier = this.classBonus[this.character.class][stat];
            const increase = Math.floor(value * classMultiplier);
            this.character[`max${stat.charAt(0).toUpperCase() + stat.slice(1)}`] += increase;
            this.character[stat] += increase;
        });

        // Effetto visivo e sonoro
        if (window.game.player) {
            window.game.player.effects.push(new VisualEffect(
                window.game.player.x + window.game.player.width/2,
                window.game.player.y + window.game.player.height/2,
                'levelup'
            ));
            window.game.audioManager.playSound('levelup');
        }

        // Evento di level up
        document.dispatchEvent(new CustomEvent('levelUp', { 
            detail: { level: this.level, skillPoints: this.skillPoints }
        }));
    }

    getNextLevelExp() {
        return this.expToLevel(this.level);
    }

    getExpProgress() {
        return this.experience / this.expToLevel(this.level);
    }
} 