class Camera {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
        
        // Limiti dello scrolling
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
    }

    follow(target, level) {
        // Aggiorna i limiti della camera basati sulla dimensione del livello
        this.maxX = (level.width * level.tileSize) - this.width;
        this.maxY = (level.height * level.tileSize) - this.height;

        // Centra la camera sul target (player)
        this.x = target.x - this.width / 2;
        this.y = target.y - this.height / 2;

        // Mantieni la camera entro i limiti del livello
        this.x = Math.max(this.minX, Math.min(this.x, this.maxX));
        this.y = Math.max(this.minY, Math.min(this.y, this.maxY));
    }

    apply(ctx) {
        ctx.save();
        ctx.translate(-Math.floor(this.x), -Math.floor(this.y));
    }

    restore(ctx) {
        ctx.restore();
    }
} 