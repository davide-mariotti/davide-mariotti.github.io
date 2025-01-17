class DialogueSystem {
    constructor() {
        this.dialogues = new Map();
        this.currentDialogue = null;
        this.currentNode = null;
        this.onDialogueEnd = null;
        this.initializeDialogues();
    }

    initializeDialogues() {
        // Dialogo del Guaritore per la quest delle erbe
        const healerDialogue = new Dialogue('healer_quest');
        healerDialogue.addNode('start', {
            text: 'Ho bisogno di aiuto per raccogliere delle erbe medicinali. Mi aiuteresti?',
            speaker: 'Guaritore',
            options: [
                { text: 'Certo, sarò felice di aiutare', nextNode: 'accept' },
                { text: 'Mi dispiace, sono occupato', nextNode: 'reject' }
            ]
        });

        healerDialogue.addNode('accept', {
            text: 'Grazie! Ho bisogno di 5 erbe medicinali dalla foresta oscura.',
            speaker: 'Guaritore',
            options: [{ text: 'Ci penso io', nextNode: 'end' }],
            onSelect: () => {
                window.game.questManager.activateQuest('side_01');
            }
        });

        healerDialogue.addNode('reject', {
            text: 'Capisco. Torna quando avrai tempo.',
            speaker: 'Guaritore',
            options: [{ text: 'Arrivederci', nextNode: 'end' }]
        });

        this.dialogues.set('healer_quest', healerDialogue);

        // Altri dialoghi...
    }

    startDialogue(dialogueId, onEnd = null) {
        const dialogue = this.dialogues.get(dialogueId);
        if (dialogue) {
            this.currentDialogue = dialogue;
            this.currentNode = dialogue.getNode('start');
            this.onDialogueEnd = onEnd;
            window.game.dialogueUI.showDialogue(this.currentNode);
        }
    }

    selectOption(optionIndex) {
        const option = this.currentNode.options[optionIndex];
        if (option.onSelect) {
            option.onSelect();
        }

        if (option.nextNode === 'end') {
            this.endDialogue();
        } else {
            this.currentNode = this.currentDialogue.getNode(option.nextNode);
            window.game.dialogueUI.showDialogue(this.currentNode);
        }
    }

    endDialogue() {
        if (this.onDialogueEnd) {
            this.onDialogueEnd();
        }
        window.game.dialogueUI.hideDialogue();
        this.currentDialogue = null;
        this.currentNode = null;
        this.onDialogueEnd = null;
    }
}

class Dialogue {
    constructor(id) {
        this.id = id;
        this.nodes = new Map();
    }

    addNode(nodeId, nodeData) {
        this.nodes.set(nodeId, nodeData);
    }

    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }
} 