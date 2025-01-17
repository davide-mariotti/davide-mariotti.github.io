// Character classes definition
const CHARACTER_CLASSES = {
    WARRIOR: {
        name: 'Warrior',
        subclasses: ['Berserker', 'Knight'],
        baseStats: {
            hp: 120,
            mp: 30,
            strength: 15,
            intelligence: 5,
            dexterity: 8
        },
        description: 'Melee combat specialist with high durability.',
        sprites: {
            Berserker: {
                path: 'assets/characters/warrior/berserker/',
                animations: {
                    idle: { frames: 1, speed: 5 },
                    walk: { frames: 4, speed: 8 },
                    run: { frames: 6, speed: 6 },
                    jump: { frames: 3, speed: 5 },
                    attack1: { frames: 5, speed: 4 },
                    attack2: { frames: 6, speed: 4 },
                    death: { frames: 7, speed: 10 }
                }
            },
            Knight: {
                path: 'assets/characters/warrior/knight/',
                animations: {
                    idle: { frames: 1, speed: 5 },
                    walk: { frames: 4, speed: 8 },
                    run: { frames: 6, speed: 6 },
                    jump: { frames: 3, speed: 5 },
                    attack1: { frames: 5, speed: 4 },
                    attack2: { frames: 6, speed: 4 },
                    shield: { frames: 4, speed: 5 },
                    death: { frames: 7, speed: 10 }
                }
            }
        }
    },
    MAGE: {
        name: 'Mage',
        subclasses: ['Ice/Fire Mage', 'Wind/Healer'],
        baseStats: {
            hp: 70,
            mp: 100,
            strength: 4,
            intelligence: 15,
            dexterity: 6
        },
        description: 'Master of arcane arts with powerful spells.',
        sprites: {
            'Ice/Fire Mage': {
                path: 'assets/characters/mage/ice_fire/',
                animations: {
                    idle: { frames: 1, speed: 5 },
                    walk: { frames: 4, speed: 8 },
                    run: { frames: 6, speed: 6 },
                    jump: { frames: 3, speed: 5 },
                    cast: { frames: 4, speed: 5 },
                    fireSpell: { frames: 8, speed: 4 },
                    iceSpell: { frames: 8, speed: 4 },
                    death: { frames: 7, speed: 10 }
                }
            },
            'Wind/Healer': {
                path: 'assets/characters/mage/wind_healer/',
                animations: {
                    idle: { frames: 1, speed: 5 },
                    walk: { frames: 4, speed: 8 },
                    run: { frames: 6, speed: 6 },
                    jump: { frames: 3, speed: 5 },
                    cast: { frames: 4, speed: 5 },
                    heal: { frames: 8, speed: 4 },
                    windSpell: { frames: 8, speed: 4 },
                    death: { frames: 7, speed: 10 }
                }
            }
        }
    },
    THIEF: {
        name: 'Thief',
        subclasses: ['Rogue', 'Archer'],
        baseStats: {
            hp: 90,
            mp: 50,
            strength: 8,
            intelligence: 8,
            dexterity: 15
        },
        description: 'Agile and deadly, specializing in stealth attacks.',
        sprites: {
            Rogue: {
                path: 'assets/characters/thief/rogue/',
                animations: {
                    idle: { frames: 1, speed: 5 },
                    walk: { frames: 4, speed: 8 },
                    run: { frames: 6, speed: 6 },
                    jump: { frames: 3, speed: 5 },
                    attack1: { frames: 5, speed: 4 },
                    stealth: { frames: 4, speed: 6 },
                    backstab: { frames: 5, speed: 4 },
                    death: { frames: 7, speed: 10 }
                }
            },
            Archer: {
                path: 'assets/characters/thief/archer/',
                animations: {
                    idle: { frames: 1, speed: 5 },
                    walk: { frames: 4, speed: 8 },
                    run: { frames: 6, speed: 6 },
                    jump: { frames: 3, speed: 5 },
                    aim: { frames: 3, speed: 4 },
                    shoot: { frames: 5, speed: 4 },
                    dodge: { frames: 4, speed: 5 },
                    death: { frames: 7, speed: 10 }
                }
            }
        }
    }
};

class Character {
    constructor(name, characterClass, subclass) {
        this.name = name;
        this.characterClass = characterClass;
        this.subclass = subclass;
        this.level = 1;
        this.experience = 0;
        this.inventory = [];
        
        // Initialize base stats from chosen class
        const baseStats = CHARACTER_CLASSES[characterClass].baseStats;
        this.hp = baseStats.hp;
        this.maxHp = baseStats.hp;
        this.mp = baseStats.mp;
        this.maxMp = baseStats.mp;
        this.stats = {
            strength: baseStats.strength,
            intelligence: baseStats.intelligence,
            dexterity: baseStats.dexterity
        };

        // Get sprite information
        this.spriteInfo = CHARACTER_CLASSES[characterClass].sprites[subclass];
    }

    levelUp() {
        this.level++;
        const statGrowth = this.getStatGrowth();
        this.maxHp += statGrowth.hp;
        this.maxMp += statGrowth.mp;
        this.hp = this.maxHp;
        this.mp = this.maxMp;
        
        Object.keys(this.stats).forEach(stat => {
            this.stats[stat] += statGrowth[stat];
        });
    }

    getStatGrowth() {
        const growthRates = {
            WARRIOR: {
                hp: 15,
                mp: 5,
                strength: 3,
                intelligence: 1,
                dexterity: 1
            },
            MAGE: {
                hp: 8,
                mp: 15,
                strength: 1,
                intelligence: 3,
                dexterity: 1
            },
            THIEF: {
                hp: 10,
                mp: 8,
                strength: 2,
                intelligence: 1,
                dexterity: 3
            }
        };
        
        return growthRates[this.characterClass];
    }

    getAnimationInfo(animationName) {
        return this.spriteInfo.animations[animationName];
    }

    getSpriteUrl(animationName) {
        return `${this.spriteInfo.path}${animationName}.png`;
    }
} 