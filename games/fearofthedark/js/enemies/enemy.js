class Enemy {
    constructor(x, y, type, subtype) {
        this.x = x;
        this.y = y;
        this.width = 128;
        this.height = 128;
        this.type = type;
        this.subtype = subtype;
        this.velocityX = 0;
        this.velocityY = 0;
        this.direction = -1; // -1 sinistra, 1 destra
        this.isAttacking = false;
        this.isHurt = false;
        this.isDead = false;
        this.currentAction = 'idle';
        this.lastAttackTime = 0;
        this.attackCooldown = 1000;
        this.detectionRange = 300;
        this.attackRange = 100;
        
        // Stats di base
        this.stats = {
            hp: 100,
            damage: 10,
            defense: 5,
            speed: 3,
            experience: 50
        };

        // Carica gli sprite
        this.loadSprites();

        this.dropTable = {
            common: {
                chance: 0.4,
                items: ['healthPotion', 'manaPotion']
            },
            uncommon: {
                chance: 0.25,
                items: ['strengthPotion']
            },
            rare: {
                chance: 0.15,
                items: ['healthPotion', 'manaPotion', 'strengthPotion']
            },
            epic: {
                chance: 0.15,
                items: ['healthPotion', 'manaPotion', 'strengthPotion']
            },
            legendary: {
                chance: 0.05,
                items: ['healthPotion', 'manaPotion', 'strengthPotion']
            }
        };
    }

    loadSprites() {
        this.sprites = {};
        const actions = ['idle', 'walk', 'run', 'attack1', 'attack2', 'attack3', 'hurt', 'dead', 'jump', 'runattack'];
        const basePath = `assets/images/enemies/${this.type}/${this.subtype}/`;

        actions.forEach(action => {
            this.sprites[action] = new Image();
            this.sprites[action].src = basePath + action + '.png';
        });
    }

    update(player) {
        if (this.isDead) {
            this.setAnimation('dead');
            return;
        }

        if (this.isHurt) {
            this.setAnimation('hurt');
            return;
        }

        const distanceToPlayer = Math.abs(player.x - this.x);
        const direction = player.x > this.x ? 1 : -1;

        // Comportamento base del nemico
        if (distanceToPlayer < this.attackRange && !this.isAttacking) {
            this.attack(player);
        } else if (distanceToPlayer < this.detectionRange) {
            this.direction = direction;
            this.velocityX = this.stats.speed * this.direction;
            this.setAnimation('walk');
        } else {
            this.velocityX = 0;
            this.setAnimation('idle');
        }

        // Applica movimento
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    attack(player) {
        const now = Date.now();
        if (now - this.lastAttackTime > this.attackCooldown) {
            this.isAttacking = true;
            this.setAnimation('attack1');
            
            // Applica danno al player
            const damage = Math.max(1, this.stats.damage - player.defense);
            player.takeDamage(damage);
            
            this.lastAttackTime = now;
            
            // Reset dell'attacco
            setTimeout(() => {
                this.isAttacking = false;
            }, 500);
        }
    }

    takeDamage(amount) {
        if (this.isHurt || this.isDead) return;

        this.stats.hp -= amount;
        this.isHurt = true;

        if (this.stats.hp <= 0) {
            this.die();
        } else {
            setTimeout(() => {
                this.isHurt = false;
            }, 400);
        }
    }

    die() {
        this.isDead = true;
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Genera drop
        this.generateDrops();
        
        return this.stats.experience;
    }

    generateDrops() {
        // Controlla ogni rarità per possibili drop
        Object.entries(this.dropTable).forEach(([rarity, data]) => {
            if (Math.random() < data.chance) {
                const itemType = data.items[Math.floor(Math.random() * data.items.length)];
                const item = new ConsumableItem(this.x, this.y, itemType, rarity);
                window.game.level.items.push(item);
            }
        });
    }

    setAnimation(action) {
        if (this.currentAction !== action) {
            this.currentAction = action;
            this.currentFrame = 0;
        }
    }

    draw(ctx) {
        const sprite = this.sprites[this.currentAction];
        if (!sprite || !sprite.complete) return;

        ctx.save();
        if (this.direction === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, -this.x - this.width, this.y, this.width, this.height);
        } else {
            ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }
} 