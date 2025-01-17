class Sprite {
    constructor(character, frameHeight = 128) {
        this.character = character;
        this.frameHeight = frameHeight;
        this.currentFrame = 0;
        this.frameCount = 0;
        this.animations = {};
        this.currentAnimation = 'idle';
        this.placeholderSprite = this.createPlaceholderSprite();
        
        this.loadAnimations().catch(error => {
            console.error('Error loading animations:', error);
        });
    }

    createPlaceholderSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = this.frameHeight;
        canvas.height = this.frameHeight;
        const ctx = canvas.getContext('2d');

        const colors = {
            'WARRIOR': '#ff0000',
            'MAGE': '#0000ff',
            'THIEF': '#00ff00'
        };
        const baseColor = colors[this.character.characterClass] || '#ffffff';

        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, this.frameHeight, this.frameHeight);
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.frameHeight, this.frameHeight);

        return canvas;
    }

    async loadAnimations() {
        for (const [animName, animInfo] of Object.entries(this.character.spriteInfo.animations)) {
            try {
                const image = new Image();
                const url = this.character.getSpriteUrl(animName);
                image.src = url;
                
                await new Promise((resolve, reject) => {
                    image.onload = () => {
                        const frameWidth = this.frameHeight;
                        this.animations[animName] = {
                            image: image,
                            frames: animInfo.frames,
                            speed: animInfo.speed,
                            frameWidth: frameWidth
                        };
                        resolve();
                    };
                    image.onerror = () => {
                        console.warn(`Failed to load sprite: ${animName} for ${this.character.subclass}`);
                        this.animations[animName] = {
                            image: this.placeholderSprite,
                            frames: 1,
                            speed: animInfo.speed,
                            frameWidth: this.frameHeight
                        };
                        resolve();
                    };
                });
            } catch (error) {
                console.error(`Error loading animation ${animName}:`, error);
            }
        }
    }

    update() {
        const animation = this.animations[this.currentAnimation];
        if (animation) {
            this.frameCount++;
            if (this.frameCount >= animation.speed) {
                this.frameCount = 0;
                this.currentFrame = (this.currentFrame + 1) % animation.frames;
            }
        }
    }

    draw(ctx, x, y, direction = 1) {
        const animation = this.animations[this.currentAnimation];
        if (!animation) {
            // Se l'animazione non è ancora caricata, usa il placeholder
            ctx.save();
            if (direction === -1) {
                ctx.scale(-1, 1);
                x = -x - 64;
            }
            ctx.drawImage(this.placeholderSprite, x, y);
            ctx.restore();
            return;
        }

        ctx.save();
        if (direction === -1) {
            ctx.scale(-1, 1);
            x = -x - 64;
        }
        ctx.drawImage(
            animation.image,
            this.currentFrame * animation.frameWidth, 0,
            animation.frameWidth, this.frameHeight,
            x, y,
            animation.frameWidth, this.frameHeight
        );
        ctx.restore();
    }
} 