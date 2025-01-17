class QuestUI {
    constructor(player) {
        this.player = player;
        this.isOpen = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyJ') {
                this.toggleQuestLog();
            }
        });

        document.addEventListener('questActivated', (e) => {
            this.showQuestNotification(e.detail, 'new');
        });

        document.addEventListener('questCompleted', (e) => {
            this.showQuestNotification(e.detail, 'completed');
        });

        document.getElementById('close-quests').addEventListener('click', () => {
            this.toggleQuestLog();
        });
    }

    toggleQuestLog() {
        this.isOpen = !this.isOpen;
        const questScreen = document.getElementById('quest-screen');
        questScreen.style.display = this.isOpen ? 'flex' : 'none';
        
        if (this.isOpen) {
            this.updateQuestLog();
        }
    }

    updateQuestLog() {
        const activeQuests = document.querySelector('.active-quests');
        const completedQuests = document.querySelector('.completed-quests');
        
        activeQuests.innerHTML = '<h3>Quest Attive</h3>';
        completedQuests.innerHTML = '<h3>Quest Completate</h3>';

        // Mostra quest attive
        window.game.questManager.getActiveQuests().forEach(quest => {
            activeQuests.appendChild(this.createQuestElement(quest));
        });

        // Mostra quest completate
        window.game.questManager.getCompletedQuests().forEach(quest => {
            completedQuests.appendChild(this.createQuestElement(quest, true));
        });
    }

    createQuestElement(quest, isCompleted = false) {
        const element = document.createElement('div');
        element.className = `quest-entry ${quest.type} ${isCompleted ? 'completed' : ''}`;
        
        let content = `
            <h4>${quest.title}</h4>
            <p>${quest.description}</p>
        `;

        if (!isCompleted) {
            content += '<div class="objectives">';
            quest.objectives.forEach(obj => {
                const progress = Math.floor(obj.getProgress() * 100);
                content += `
                    <div class="objective ${obj.isCompleted ? 'completed' : ''}">
                        <span>${obj.description}</span>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text">${obj.currentAmount}/${obj.requiredAmount}</span>
                    </div>
                `;
            });
            content += '</div>';
        }

        content += '<div class="rewards">';
        quest.rewards.forEach(reward => {
            content += `<div class="reward">${reward.getDescription()}</div>`;
        });
        content += '</div>';

        element.innerHTML = content;
        return element;
    }

    showQuestNotification(quest, type) {
        const notification = document.createElement('div');
        notification.className = `quest-notification ${type}`;
        
        notification.innerHTML = `
            <h3>${type === 'new' ? 'Nuova Quest' : 'Quest Completata'}</h3>
            <h4>${quest.title}</h4>
            ${type === 'completed' ? '<div class="rewards">' + 
                quest.rewards.map(r => `<div class="reward">${r.getDescription()}</div>`).join('') + 
                '</div>' : ''}
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 1000);
        }, 4000);
    }
} 