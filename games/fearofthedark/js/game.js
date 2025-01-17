class Game {
    constructor() {
        this.menuManager = new MenuManager();
        this.character = null;
        this.player = null;
        this.level = null;
        this.physics = new Physics();
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.initialize();
    }

    initialize() {
        console.log('Gioco inizializzato');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    startGame(character) {
        this.character = character;
        document.getElementById('character-creation').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        // Inizializza il livello e il player
        this.level = new Level(25, 19); // 800/32 = 25 tiles di larghezza, 600/32 = 19 tiles di altezza
        this.player = new Player(100, 100, character);
        
        // Avvia il game loop
        this.gameLoop();
    }

    gameLoop() {
        // Pulisci il canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Aggiorna e disegna il livello
        this.level.draw(this.ctx);
        
        // Aggiorna e disegna il player
        this.player.update();
        this.player.draw(this.ctx);
        
        // Continua il loop
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Avvia il gioco quando la pagina è completamente caricata
window.addEventListener('load', () => {
    window.game = new Game();
}); 