class QuestObjective {
    constructor(description, requiredAmount = 1) {
        this.description = description;
        this.requiredAmount = requiredAmount;
        this.currentAmount = 0;
        this.isCompleted = false;
    }

    update(amount = 1) {
        if (this.isCompleted) return;
        
        this.currentAmount = Math.min(this.currentAmount + amount, this.requiredAmount);
        if (this.currentAmount >= this.requiredAmount) {
            this.complete();
        }
    }

    complete() {
        this.isCompleted = true;
        this.currentAmount = this.requiredAmount;
    }

    getProgress() {
        return this.currentAmount / this.requiredAmount;
    }
}

class KillObjective extends QuestObjective {
    constructor(enemyType, amount) {
        super(`Sconfiggi ${amount} ${enemyType}`, amount);
        this.enemyType = enemyType;
    }
}

class CollectObjective extends QuestObjective {
    constructor(itemType, amount) {
        super(`Raccogli ${amount} ${itemType}`, amount);
        this.itemType = itemType;
    }
}

class ExploreObjective extends QuestObjective {
    constructor(location) {
        super(`Esplora ${location}`);
        this.location = location;
    }
} 