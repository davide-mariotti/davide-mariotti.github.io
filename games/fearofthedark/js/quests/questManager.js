class QuestManager {
    constructor() {
        this.quests = new Map();
        this.activeQuests = new Set();
        this.completedQuests = new Set();
        this.initializeQuests();
    }

    initializeQuests() {
        // Quest principale
        const mainQuest = new Quest(
            'main_01',
            'L\'Inizio del Viaggio',
            'Scopri il mistero della foresta oscura'
        );
        mainQuest.addObjective(new KillObjective('Slime', 3));
        mainQuest.addObjective(new ExploreObjective('Foresta Oscura'));
        mainQuest.addReward(new QuestReward('experience', 100));
        mainQuest.addReward(new QuestReward('gold', 50));
        
        this.addQuest(mainQuest);

        // Quest secondaria
        const sideQuest = new Quest(
            'side_01',
            'Raccolta di Erbe',
            'Raccogli erbe medicinali per il guaritore',
            'side'
        );
        sideQuest.addObjective(new CollectObjective('Erba Medicinale', 5));
        sideQuest.addReward(new QuestReward('experience', 50));
        sideQuest.addReward(new QuestReward('item', new ConsumableItem(0, 0, 'healthPotion', 'rare')));
        
        this.addQuest(sideQuest);
    }

    addQuest(quest) {
        this.quests.set(quest.id, quest);
    }

    activateQuest(questId) {
        const quest = this.quests.get(questId);
        if (quest && !this.activeQuests.has(questId)) {
            quest.activate();
            this.activeQuests.add(questId);
        }
    }

    update(player) {
        this.activeQuests.forEach(questId => {
            const quest = this.quests.get(questId);
            quest.update(player);
            
            if (quest.isCompleted) {
                this.activeQuests.delete(questId);
                this.completedQuests.add(questId);
            }
        });
    }

    getAvailableQuests() {
        return Array.from(this.quests.values())
            .filter(quest => !this.activeQuests.has(quest.id) && 
                           !this.completedQuests.has(quest.id));
    }

    getActiveQuests() {
        return Array.from(this.activeQuests)
            .map(id => this.quests.get(id));
    }

    getCompletedQuests() {
        return Array.from(this.completedQuests)
            .map(id => this.quests.get(id));
    }
} 