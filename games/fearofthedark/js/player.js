class Player {
    constructor(x, y, character) {
        this.x = x;
        this.y = y;
        this.character = character;
        this.width = 128;
        this.height = 128;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = -15;
        this.gravity = 0.8;
        this.isJumping = false;
        this.direction = 1; // 1 right, -1 left
        this.currentAction = 'idle';
        
        // Load character sprite
        this.sprite = new Sprite(character);
        
        // Input handling
        this.keys = {};
        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);
    }

    update() {
        const physics = window.game.physics;

        // Horizontal movement
        if (this.keys['ArrowLeft']) {
            this.velocityX = -this.speed;
            this.direction = -1;
            this.setAnimation('walk');
        } else if (this.keys['ArrowRight']) {
            this.velocityX = this.speed;
            this.direction = 1;
            this.setAnimation('walk');
        } else {
            this.velocityX *= physics.friction;
            if (Math.abs(this.velocityX) < 0.1) {
                this.velocityX = 0;
                this.setAnimation('idle');
            }
        }

        // Running
        if (this.keys['ShiftLeft'] && (this.keys['ArrowLeft'] || this.keys['ArrowRight'])) {
            this.velocityX *= 1.5;
            this.setAnimation('run');
        }

        // Jumping
        if (this.keys['Space'] && !this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
            this.setAnimation('jump');
        }

        // Attack
        if (this.keys['KeyX']) {
            this.setAnimation('attack1');
        }

        // Special ability based on class/subclass
        if (this.keys['KeyC']) {
            switch(this.character.subclass) {
                case 'Berserker':
                    this.setAnimation('attack2');
                    break;
                case 'Knight':
                    this.setAnimation('shield');
                    break;
                case 'Ice/Fire Mage':
                    this.setAnimation('fireSpell');
                    break;
                case 'Wind/Healer':
                    this.setAnimation('heal');
                    break;
                case 'Rogue':
                    this.setAnimation('stealth');
                    break;
                case 'Archer':
                    this.setAnimation('aim');
                    break;
            }
        }

        // Apply gravity
        this.velocityY += physics.gravity;
        if (this.velocityY > physics.maxFallSpeed) {
            this.velocityY = physics.maxFallSpeed;
        }

        // Update position
        const nextPosition = {
            x: this.x + this.velocityX,
            y: this.y + this.velocityY,
            width: this.width,
            height: this.height
        };

        // Check collisions
        const collisions = window.game.level.checkCollisions(nextPosition);
        
        if (collisions.length > 0) {
            collisions.forEach(collider => {
                physics.resolveCollision(this, collider);
            });
        } else {
            this.x = nextPosition.x;
            this.y = nextPosition.y;
        }

        // Update sprite
        this.sprite.update();
    }

    setAnimation(animationName) {
        if (this.sprite.currentAnimation !== animationName && 
            this.sprite.animations[animationName]) {
            this.sprite.currentAnimation = animationName;
            this.sprite.currentFrame = 0;
            this.sprite.frameCount = 0;
        }
    }

    draw(ctx) {
        this.sprite.draw(ctx, this.x, this.y, this.direction);
    }
} 