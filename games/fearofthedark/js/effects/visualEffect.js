class VisualEffect {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.frame = 0;
        this.maxFrames = 8;
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.isFinished = false;
        this.animationSpeed = 0.2;
        this.frameCounter = 0;
        
        // Carica sprite
        this.sprite = new Image();
        this.sprite.src = `assets/images/effects/${type}.png`;
    }

    update() {
        this.frameCounter += this.animationSpeed;
        if (this.frameCounter >= 1) {
            this.frame++;
            this.frameCounter = 0;
            
            if (this.frame >= this.maxFrames) {
                this.isFinished = true;
            }
        }
    }

    draw(ctx) {
        if (this.sprite.complete && !this.isFinished) {
            ctx.save();
            ctx.globalAlpha = 1 - (this.frame / this.maxFrames);
            ctx.drawImage(
                this.sprite,
                this.frame * this.frameWidth, 0,
                this.frameWidth, this.frameHeight,
                this.x - this.frameWidth/2, this.y - this.frameHeight/2,
                this.frameWidth, this.frameHeight
            );
            ctx.restore();
        }
    }
} 