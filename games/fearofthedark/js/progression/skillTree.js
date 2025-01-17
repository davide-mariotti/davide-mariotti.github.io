class SkillTree {
    constructor(character) {
        this.character = character;
        this.skills = this.initializeSkills();
        this.unlockedSkills = new Set();
    }

    initializeSkills() {
        const skills = {
            WARRIOR: {
                'powerStrike': {
                    name: 'Colpo Potente',
                    description: 'Un potente colpo che infligge 150% di danno',
                    damage: 1.5,
                    mpCost: 20,
                    cooldown: 5000,
                    requirements: []
                },
                'whirlwind': {
                    name: 'Vortice',
                    description: 'Attacco rotante che colpisce tutti i nemici vicini',
                    damage: 1.2,
                    mpCost: 35,
                    cooldown: 8000,
                    requirements: ['powerStrike']
                }
                // ... altre abilità
            },
            MAGE: {
                'fireball': {
                    name: 'Palla di Fuoco',
                    description: 'Lancia una palla di fuoco che infligge danno magico',
                    damage: 2.0,
                    mpCost: 30,
                    cooldown: 3000,
                    requirements: []
                }
                // ... altre abilità
            },
            THIEF: {
                'shadowStrike': {
                    name: 'Colpo Oscuro',
                    description: 'Un rapido colpo dalle ombre',
                    damage: 1.8,
                    mpCost: 25,
                    cooldown: 4000,
                    requirements: []
                }
                // ... altre abilità
            }
        };

        return skills[this.character.class] || {};
    }

    canUnlockSkill(skillId) {
        const skill = this.skills[skillId];
        if (!skill) return false;

        // Controlla i requisiti
        return skill.requirements.every(req => this.unlockedSkills.has(req));
    }

    unlockSkill(skillId) {
        if (!this.canUnlockSkill(skillId)) return false;
        if (this.character.skillPoints <= 0) return false;

        this.unlockedSkills.add(skillId);
        this.character.skillPoints--;
        return true;
    }

    hasSkill(skillId) {
        return this.unlockedSkills.has(skillId);
    }

    getSkillInfo(skillId) {
        return this.skills[skillId];
    }
} 