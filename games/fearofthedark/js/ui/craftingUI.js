class CraftingUI {
    constructor(player) {
        this.player = player;
        this.isOpen = false;
        this.selectedRecipe = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyR') {
                this.toggleCrafting();
            }
        });

        document.getElementById('close-crafting').addEventListener('click', () => {
            this.toggleCrafting();
        });
    }

    toggleCrafting() {
        this.isOpen = !this.isOpen;
        const craftingScreen = document.getElementById('crafting-screen');
        craftingScreen.style.display = this.isOpen ? 'flex' : 'none';
        
        if (this.isOpen) {
            this.updateRecipeList();
        }
    }

    updateRecipeList() {
        const recipeList = document.querySelector('.recipe-list');
        recipeList.innerHTML = '';

        const availableRecipes = window.game.craftingSystem.getAvailableRecipes(this.player);
        
        availableRecipes.forEach(recipe => {
            const element = this.createRecipeElement(recipe);
            recipeList.appendChild(element);
        });
    }

    createRecipeElement(recipe) {
        const element = document.createElement('div');
        element.className = `recipe-item ${recipe.result.rarity}`;
        
        const desc = recipe.getDescription();
        element.innerHTML = `
            <h3>${desc.name}</h3>
            <div class="recipe-ingredients">
                ${desc.ingredients.map(ing => `<div class="ingredient">${ing}</div>`).join('')}
            </div>
            <div class="recipe-reward">
                <span>Ricompensa EXP: ${desc.expReward}</span>
            </div>
        `;

        element.addEventListener('click', () => {
            this.selectRecipe(recipe);
        });

        return element;
    }

    selectRecipe(recipe) {
        this.selectedRecipe = recipe;
        this.updateRecipeDetails();
    }

    updateRecipeDetails() {
        const details = document.querySelector('.recipe-details');
        if (!this.selectedRecipe) {
            details.innerHTML = '<p>Seleziona una ricetta</p>';
            return;
        }

        const desc = this.selectedRecipe.getDescription();
        details.innerHTML = `
            <h2>${desc.name}</h2>
            <div class="ingredients-required">
                <h3>Ingredienti Richiesti:</h3>
                ${desc.ingredients.map(ing => `
                    <div class="ingredient-item">
                        <span>${ing}</span>
                        <span class="ingredient-count">
                            ${this.player.inventory.countItem(ing.split('x ')[1])}/${ing.split('x ')[0]}
                        </span>
                    </div>
                `).join('')}
            </div>
            <div class="craft-result">
                <h3>Risultato:</h3>
                <div class="result-item ${desc.result.rarity}">
                    ${desc.name}
                </div>
            </div>
            <button class="craft-button" ${window.game.craftingSystem.canCraft(this.selectedRecipe.id, this.player.inventory) ? '' : 'disabled'}>
                Crafta
            </button>
        `;

        details.querySelector('.craft-button').addEventListener('click', () => {
            if (window.game.craftingSystem.craft(this.selectedRecipe.id, this.player)) {
                this.updateRecipeList();
                this.updateRecipeDetails();
                window.game.audioManager.playSound('craft');
            }
        });
    }
} 