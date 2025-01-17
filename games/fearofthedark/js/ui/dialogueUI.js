class DialogueUI {
    constructor() {
        this.createDialogueBox();
    }

    createDialogueBox() {
        this.dialogueBox = document.createElement('div');
        this.dialogueBox.className = 'dialogue-box';
        this.dialogueBox.style.display = 'none';
        
        this.speakerName = document.createElement('div');
        this.speakerName.className = 'speaker-name';
        
        this.dialogueText = document.createElement('div');
        this.dialogueText.className = 'dialogue-text';
        
        this.optionsContainer = document.createElement('div');
        this.optionsContainer.className = 'dialogue-options';
        
        this.dialogueBox.appendChild(this.speakerName);
        this.dialogueBox.appendChild(this.dialogueText);
        this.dialogueBox.appendChild(this.optionsContainer);
        
        document.getElementById('game-screen').appendChild(this.dialogueBox);
    }

    showDialogue(node) {
        this.dialogueBox.style.display = 'block';
        this.speakerName.textContent = node.speaker;
        this.dialogueText.textContent = node.text;
        
        this.optionsContainer.innerHTML = '';
        node.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'dialogue-option';
            button.textContent = option.text;
            button.addEventListener('click', () => {
                window.game.dialogueSystem.selectOption(index);
            });
            this.optionsContainer.appendChild(button);
        });
    }

    hideDialogue() {
        this.dialogueBox.style.display = 'none';
    }
} 