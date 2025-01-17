class SkillUI {
    constructor(player) {
        this.player = player;
        this.isOpen = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyK') {
                this.toggleSkillTree();
            }
        });

        document.addEventListener('levelUp', (e) => {
            this.showLevelUpNotification(e.detail);
        });
    }

    toggleSkillTree() {
        this.isOpen = !this.isOpen;
        const skillScreen = document.getElementById('skill-screen');
        skillScreen.style.display = this.isOpen ? 'flex' : 'none';
        
        if (this.isOpen) {
            this.updateSkillTree();
        }
    }

    updateSkillTree() {
        const container = document.querySelector('.skill-tree');
        container.innerHTML = '';

        Object.entries(this.player.character.skillTree.skills).forEach(([skillId, skill]) => {
            const skillElement = this.createSkillElement(skillId, skill);
            container.appendChild(skillElement);
        });
    }

    createSkillElement(skillId, skill) {
        const element = document.createElement('div');
        element.className = `skill-node ${this.player.character.skillTree.hasSkill(skillId) ? 'unlocked' : ''}`;
        element.innerHTML = `
            <img src="assets/images/skills/${skillId}.png" alt="${skill.name}">
            <div class="skill-tooltip">
                <h3>${skill.name}</h3>
                <p>${skill.description}</p>
                <p>Costo MP: ${skill.mpCost}</p>
                <p>Cooldown: ${skill.cooldown/1000}s</p>
            </div>
        `;

        if (this.player.character.skillTree.canUnlockSkill(skillId) && 
            !this.player.character.skillTree.hasSkill(skillId)) {
            element.addEventListener('click', () => {
                if (this.player.character.skillTree.unlockSkill(skillId)) {
                    this.updateSkillTree();
                    window.game.audioManager.playSound('skillUnlock');
                }
            });
        }

        return element;
    }

    showLevelUpNotification(detail) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <h2>Level Up!</h2>
            <p>Hai raggiunto il livello ${detail.level}</p>
            <p>Punti abilità disponibili: ${detail.skillPoints}</p>
            <button class="menu-button">Apri Skill Tree</button>
        `;

        document.body.appendChild(notification);
        
        notification.querySelector('button').addEventListener('click', () => {
            this.toggleSkillTree();
            notification.remove();
        });

        setTimeout(() => notification.remove(), 5000);
    }
} 