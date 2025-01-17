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
                path: 'assets/images/characters/warrior/berserker/',
                animations: {
                    idle: { frames: 1, speed: 5 },
                    walk: { frames: 4, speed: 8 },
                    run: { frames: 6, speed: 6 },
                    jump: { frames: 3, speed: 5 },
                    attack1: { frames: 5, speed: 4 },
                    attack2: { frames: 6, speed: 4 },
                    attack3: { frames: 6, speed: 4 },
                    runattack: { frames: 6, speed: 4 },
                    defend: { frames: 4, speed: 5 },
                    protect: { frames: 4, speed: 5 },
                    hurt: { frames: 3, speed: 3 },
                    dead: { frames: 7, speed: 10 }
                }
            },
            Knight: {
                path: 'assets/images/characters/warrior/knight/',
                animations: {
                    idle: { frames: 1, speed: 5 },
                    walk: { frames: 4, speed: 8 },
                    run: { frames: 6, speed: 6 },
                    jump: { frames: 3, speed: 5 },
                    attack1: { frames: 5, speed: 4 },
                    attack2: { frames: 6, speed: 4 },
                    attack3: { frames: 6, speed: 4 },
                    runattack: { frames: 6, speed: 4 },
                    defend: { frames: 4, speed: 5 },
                    protect: { frames: 4, speed: 5 },
                    hurt: { frames: 3, speed: 3 },
                    dead: { frames: 7, speed: 10 }
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
                path: 'assets/images/characters/mage/ice-fire/',
                animations: {
                    idle: { frames: 1, speed: 5 },
                    walk: { frames: 4, speed: 8 },
                    run: { frames: 6, speed: 6 },
                    jump: { frames: 3, speed: 5 },
                    attack1: { frames: 5, speed: 4 },
                    attack2: { frames: 6, speed: 4 },
                    charge: { frames: 4, speed: 5 },
                    fireball: { frames: 8, speed: 4 },
                    flamejet: { frames: 8, speed: 4 },
                    hurt: { frames: 3, speed: 3 },
                    dead: { frames: 7, speed: 10 }
                }
            },
            'Wind/Healer': {
                path: 'assets/images/characters/mage/wind-healer/',
                animations: {
                    idle: { frames: 1, speed: 5 },
                    walk: { frames: 4, speed: 8 },
                    run: { frames: 6, speed: 6 },
                    jump: { frames: 3, speed: 5 },
                    attack1: { frames: 5, speed: 4 },
                    attack2: { frames: 6, speed: 4 },
                    charge1: { frames: 4, speed: 5 },
                    charge2: { frames: 4, speed: 5 },
                    magicarrow: { frames: 8, speed: 4 },
                    magicsphere: { frames: 8, speed: 4 },
                    hurt: { frames: 3, speed: 3 },
                    dead: { frames: 7, speed: 10 }
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
                path: 'assets/images/characters/thief/rogue/',
                animations: {
                    idle: { frames: 1, speed: 5 },
                    walk: { frames: 4, speed: 8 },
                    run: { frames: 6, speed: 6 },
                    jump: { frames: 3, speed: 5 },
                    attack1: { frames: 5, speed: 4 },
                    attack2: { frames: 6, speed: 4 },
                    blade: { frames: 5, speed: 4 },
                    cast: { frames: 4, speed: 5 },
                    kunai: { frames: 4, speed: 5 },
                    hurt: { frames: 3, speed: 3 },
                    dead: { frames: 7, speed: 10 }
                }
            },
            Archer: {
                path: 'assets/images/characters/thief/archer/',
                animations: {
                    idle: { frames: 1, speed: 5 },
                    walk: { frames: 4, speed: 8 },
                    run: { frames: 6, speed: 6 },
                    jump: { frames: 3, speed: 5 },
                    attack1: { frames: 5, speed: 4 },
                    attack2: { frames: 6, speed: 4 },
                    cast: { frames: 4, speed: 5 },
                    spine: { frames: 5, speed: 4 },
                    eating: { frames: 4, speed: 5 },
                    hurt: { frames: 3, speed: 3 },
                    dead: { frames: 7, speed: 10 }
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

        this.levelSystem = new LevelSystem(this);
        this.skillTree = new SkillTree(this);
        this.skillPoints = 0;
        
        // Aggiungi statistiche base
        this.stats = {
            hp: 100,
            mp: 50,
            attack: 10,
            defense: 5,
            speed: 8,
            magic: 10
        };
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
        // Converti da camelCase a kebab-case
        const fileName = animationName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        return Utils.getAssetPath(`${this.spriteInfo.path}${fileName}.png`);
    }
} 