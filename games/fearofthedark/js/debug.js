class Debug {
    constructor() {
        this.enabled = false;
        this.showHitboxes = false;
        this.showFPS = false;
        this.showInfo = false;
        this.lastTime = performance.now();
        this.frames = 0;
        this.fps = 0;

        // Aggiungi controlli per il debug
        window.addEventListener('keydown', (e) => {
            if (e.code === 'F3') {
                this.enabled = !this.enabled;
            }
            if (this.enabled) {
                switch(e.code) {
                    case 'KeyH': // Toggle hitboxes
                        this.showHitboxes = !this.showHitboxes;
                        break;
                    case 'KeyF': // Toggle FPS
                        this.showFPS = !this.showFPS;
                        break;
                    case 'KeyI': // Toggle info
                        this.showInfo = !this.showInfo;
                        break;
                }
            }
        });
    }

    update() {
        if (!this.enabled) return;

        this.frames++;
        const currentTime = performance.now();
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frames;
            this.frames = 0;
            this.lastTime = currentTime;
        }
    }

    draw(ctx, game) {
        if (!this.enabled) return;

        if (this.showFPS) {
            ctx.font = '16px Arial';
            ctx.fillStyle = 'yellow';
            ctx.fillText(`FPS: ${this.fps}`, 10, 20);
        }

        if (this.showInfo) {
            const player = game.player;
            const info = [
                `Position: (${Math.round(player.x)}, ${Math.round(player.y)})`,
                `Velocity: (${player.velocityX.toFixed(2)}, ${player.velocityY.toFixed(2)})`,
                `Animation: ${player.sprite.currentAnimation}`,
                `Frame: ${player.sprite.currentFrame}`,
                `HP: ${player.hp}/${player.maxHp}`,
                `MP: ${player.mp}/${player.maxMp}`,
                `Jumping: ${player.isJumping}`,
                `Direction: ${player.direction}`
            ];

            ctx.font = '14px Arial';
            ctx.fillStyle = 'yellow';
            info.forEach((text, i) => {
                ctx.fillText(text, 10, 50 + i * 20);
            });
        }
    }
} 