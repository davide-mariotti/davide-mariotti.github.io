class CraftingSystem {
    constructor() {
        this.recipes = new Map();
        this.initializeRecipes();
    }

    initializeRecipes() {
        // Pozioni base
        this.addRecipe(new CraftingRecipe(
            'healthPotion',
            'Pozione Salute',
            [
                { item: 'herbRed', quantity: 2 },
                { item: 'waterFlask', quantity: 1 }
            ],
            { type: 'consumable', rarity: 'common' }
        ));

        // Equipaggiamento
        this.addRecipe(new CraftingRecipe(
            'ironSword',
            'Spada di Ferro',
            [
                { item: 'ironIngot', quantity: 3 },
                { item: 'wood', quantity: 1 }
            ],
            { type: 'equipment', equipType: 'weapon', rarity: 'common' }
        ));

        // Potenziamenti
        this.addRecipe(new CraftingRecipe(
            'enchantedGem',
            'Gemma Incantata',
            [
                { item: 'gem', quantity: 1 },
                { item: 'magicDust', quantity: 5 }
            ],
            { type: 'material', rarity: 'rare' }
        ));
    }

    addRecipe(recipe) {
        this.recipes.set(recipe.id, recipe);
    }

    canCraft(recipeId, inventory) {
        const recipe = this.recipes.get(recipeId);
        if (!recipe) return false;

        return recipe.ingredients.every(ing => {
            const count = inventory.countItem(ing.item);
            return count >= ing.quantity;
        });
    }

    craft(recipeId, player) {
        if (!this.canCraft(recipeId, player.inventory)) return false;

        const recipe = this.recipes.get(recipeId);
        
        // Rimuovi gli ingredienti
        recipe.ingredients.forEach(ing => {
            player.inventory.removeItem(ing.item, ing.quantity);
        });

        // Crea l'oggetto risultante
        const result = this.createResult(recipe);
        player.inventory.addItem(result);

        // Aggiungi esperienza
        player.character.levelSystem.addExperience(recipe.expReward);

        return true;
    }

    createResult(recipe) {
        switch(recipe.result.type) {
            case 'consumable':
                return new ConsumableItem(0, 0, recipe.id, recipe.result.rarity);
            case 'equipment':
                return new EquipmentItem(0, 0, recipe.id, recipe.result.rarity, recipe.result.equipType);
            default:
                return new Item(0, 0, recipe.id, recipe.result.rarity);
        }
    }

    getAvailableRecipes(player) {
        return Array.from(this.recipes.values())
            .filter(recipe => this.canCraft(recipe.id, player.inventory));
    }
}

class CraftingRecipe {
    constructor(id, name, ingredients, result) {
        this.id = id;
        this.name = name;
        this.ingredients = ingredients;
        this.result = result;
        this.expReward = this.calculateExpReward();
    }

    calculateExpReward() {
        const rarityMultiplier = {
            common: 1,
            uncommon: 1.5,
            rare: 2,
            epic: 3,
            legendary: 5
        };

        return Math.floor(50 * (rarityMultiplier[this.result.rarity] || 1));
    }

    getDescription() {
        return {
            name: this.name,
            ingredients: this.ingredients.map(ing => 
                `${ing.quantity}x ${ing.item}`
            ),
            result: this.result,
            expReward: this.expReward
        };
    }
} 