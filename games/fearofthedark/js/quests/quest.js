class Quest {
    constructor(id, title, description, type = 'main') {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type; // main, side, daily
        this.objectives = [];
        this.rewards = [];
        this.isCompleted = false;
        this.isActive = false;
    }

    addObjective(objective) {
        this.objectives.push(objective);
    }

    addReward(reward) {
        this.rewards.push(reward);
    }

    activate() {
        this.isActive = true;
        document.dispatchEvent(new CustomEvent('questActivated', { detail: this }));
    }

    update(player) {
        if (!this.isActive || this.isCompleted) return;

        const allCompleted = this.objectives.every(obj => obj.isCompleted);
        if (allCompleted) {
            this.complete(player);
        }
    }

    complete(player) {
        if (this.isCompleted) return;
        
        this.isCompleted = true;
        this.isActive = false;
        
        // Assegna le ricompense
        this.rewards.forEach(reward => reward.give(player));
        
        document.dispatchEvent(new CustomEvent('questCompleted', { detail: this }));
    }

    getProgress() {
        if (!this.isActive) return 0;
        const completed = this.objectives.filter(obj => obj.isCompleted).length;
        return completed / this.objectives.length;
    }
} 