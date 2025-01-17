class Player {
    constructor(x, y, character) {
        this.x = x;
        this.y = y;
        this.character = character;
        this.width = 128;
        this.height = 128;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 8;
        this.runSpeed = 12;
        this.jumpForce = -15;
        this.isJumping = false;
        this.direction = 1; // 1 right, -1 left
        this.currentAction = 'idle';
        this.isAttacking = false;
        this.isDefending = false;
        this.isHurt = false;
        this.isDead = false;
        this.attackCombo = 0;
        this.lastAttackTime = 0;
        this.comboResetTime = 1000; // 1 secondo per resettare il combo
        
        // Load character sprite
        this.sprite = new Sprite(character);
        
        // Input handling
        this.keys = {};
        this.settings = window.game.menuManager.settings;
        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);

        // Stato del personaggio
        this.hp = character.hp;
        this.maxHp = character.maxHp;
        this.mp = character.mp;
        this.maxMp = character.maxMp;
        this.isInvulnerable = false;
        this.invulnerabilityTime = 1000; // 1 secondo di invulnerabilità dopo il danno
        this.hurtTime = 400; // Durata dell'animazione di danno
        
        // Dimensioni e offset della hitbox
        this.hitboxWidth = 64;
        this.hitboxHeight = 64;
        this.hitboxOffsetX = 0;
        this.hitboxOffsetY = 64; // Offset per posizionare la hitbox nella metà inferiore
        
        // Riferimento all'UI
        this.updateUI();

        this.inventory = new Inventory();
        this.temporaryBuffs = new Map(); // Per pozioni ed effetti temporanei
        this.effects = [];
    }

    // Metodo per ottenere la hitbox corrente
    getHitbox() {
        return {
            x: this.x + this.hitboxOffsetX,
            y: this.y + this.hitboxOffsetY,
            width: this.hitboxWidth,
            height: this.hitboxHeight
        };
    }

    update() {
        const physics = window.game.physics;
        const controls = this.settings.controls;

        // Non aggiornare i movimenti se il personaggio è morto
        if (this.isDead) {
            this.setAnimation('dead');
            return;
        }

        // Non aggiornare i movimenti se il personaggio è ferito
        if (this.isHurt) {
            this.setAnimation('hurt');
            return;
        }

        // Gestione attacchi
        if (this.keys[controls.attack] && !this.isAttacking && !this.isDefending) {
            this.isAttacking = true;
            const now = Date.now();
            if (now - this.lastAttackTime > this.comboResetTime) {
                this.attackCombo = 0;
            }
            this.attackCombo = (this.attackCombo + 1) % 3;
            this.lastAttackTime = now;
            this.setAnimation(`attack${this.attackCombo + 1}`);
            setTimeout(() => {
                this.isAttacking = false;
            }, 500);
            return;
        }

        // Gestione difesa
        if (this.keys[controls.defend] && !this.isAttacking) {
            this.isDefending = true;
            this.setAnimation('defend');
            return;
        } else {
            this.isDefending = false;
        }

        // Abilità speciali
        if (this.keys[controls.special] && !this.isAttacking && !this.isDefending) {
            switch(this.character.subclass) {
                case 'Berserker':
                case 'Knight':
                    this.setAnimation('protect');
                    break;
                case 'Ice/Fire Mage':
                    this.setAnimation(Math.random() < 0.5 ? 'fireball' : 'flamejet');
                    break;
                case 'Wind/Healer':
                    this.setAnimation(Math.random() < 0.5 ? 'magicarrow' : 'magicsphere');
                    break;
                case 'Rogue':
                    this.setAnimation(Math.random() < 0.5 ? 'blade' : 'kunai');
                    break;
                case 'Archer':
                    this.setAnimation('spine');
                    break;
            }
            return;
        }

        // Movimento orizzontale
        let wasMoving = Math.abs(this.velocityX) > physics.minMoveSpeed;
        
        if (this.keys[controls.left]) {
            this.velocityX = -(this.keys[controls.run] ? this.runSpeed : this.speed);
            this.direction = -1;
            this.setAnimation(this.keys[controls.run] ? 'run' : 'walk');
        } else if (this.keys[controls.right]) {
            this.velocityX = (this.keys[controls.run] ? this.runSpeed : this.speed);
            this.direction = 1;
            this.setAnimation(this.keys[controls.run] ? 'run' : 'walk');
        } else {
            this.velocityX *= physics.friction;
            if (Math.abs(this.velocityX) < physics.minMoveSpeed) {
                this.velocityX = 0;
                if (!this.isJumping && wasMoving) {
                    this.setAnimation('idle');
                }
            }
        }

        // Salto
        if (this.keys[controls.jump] && !this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
            this.setAnimation('jump');
        }

        // Applica gravità
        this.velocityY += physics.gravity;
        if (this.velocityY > physics.maxFallSpeed) {
            this.velocityY = physics.maxFallSpeed;
        }

        // Test movimento orizzontale
        let nextPositionX = this.getHitbox();
        nextPositionX.x += this.velocityX;
        let horizontalCollisions = window.game.level.checkCollisions(nextPositionX);
        
        if (horizontalCollisions.length === 0) {
            this.x += this.velocityX;
        } else {
            horizontalCollisions.forEach(collider => {
                physics.resolveCollision(this, collider, true);
            });
        }

        // Test movimento verticale
        let nextPositionY = this.getHitbox();
        nextPositionY.y += this.velocityY;
        let verticalCollisions = window.game.level.checkCollisions(nextPositionY);
        
        if (verticalCollisions.length === 0) {
            this.y += this.velocityY;
        } else {
            verticalCollisions.forEach(collider => {
                physics.resolveCollision(this, collider, true);
            });
        }

        // Aggiorna sprite
        this.sprite.update();

        // Aggiorna effetti visivi
        this.effects = this.effects.filter(effect => {
            effect.update();
            return !effect.isFinished;
        });
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
        // Disegna lo sprite
        if (this.isInvulnerable && !this.isDead) {
            const currentTime = Date.now();
            if (Math.floor(currentTime / 100) % 2 === 0) {
                this.sprite.draw(ctx, this.x, this.y, this.direction);
            }
        } else {
            this.sprite.draw(ctx, this.x, this.y, this.direction);
        }

        // Debug: visualizza la hitbox (rimuovere in produzione)
        if (window.debug) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            const hitbox = this.getHitbox();
            ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
        }

        // Disegna effetti
        this.effects.forEach(effect => effect.draw(ctx));
    }

    takeDamage(amount) {
        if (this.isInvulnerable || this.isDead) return;

        // Riduce il danno se si sta difendendo
        if (this.isDefending) {
            amount = Math.floor(amount * 0.5);
        }

        this.hp = Math.max(0, this.hp - amount);
        this.isHurt = true;
        this.isInvulnerable = true;

        // Aggiorna l'UI
        this.updateUI();

        // Gestisce la morte
        if (this.hp <= 0) {
            this.die();
            return;
        }

        // Timer per l'animazione di danno
        setTimeout(() => {
            this.isHurt = false;
        }, this.hurtTime);

        // Timer per l'invulnerabilità
        setTimeout(() => {
            this.isInvulnerable = false;
        }, this.invulnerabilityTime);
    }

    heal(amount) {
        const oldHp = this.hp;
        this.hp = Math.min(this.maxHp, this.hp + amount);
        if (this.hp > oldHp) {
            // Effetto di guarigione
            this.effects.push(new VisualEffect(this.x + this.width/2, this.y + this.height/2, 'heal'));
            // Mostra numero di cura
            this.showFloatingText(`+${this.hp - oldHp}`, '#2ecc71');
        }
    }

    useMp(amount) {
        if (this.mp < amount) return false;
        
        this.mp -= amount;
        this.updateUI();
        return true;
    }

    restoreMp(amount) {
        const oldMp = this.mp;
        this.mp = Math.min(this.maxMp, this.mp + amount);
        if (this.mp > oldMp) {
            // Effetto di ripristino mana
            this.effects.push(new VisualEffect(this.x + this.width/2, this.y + this.height/2, 'mana'));
            // Mostra numero di mana
            this.showFloatingText(`+${this.mp - oldMp}`, '#3498db');
        }
    }

    die() {
        this.isDead = true;
        this.hp = 0;
        this.updateUI();
        // Qui potremmo aggiungere logica per il game over
    }

    updateUI() {
        const hpBar = document.querySelector('.hp-bar .stat-fill');
        const mpBar = document.querySelector('.mp-bar .stat-fill');
        const hpText = document.querySelector('.hp-bar .stat-text');
        const mpText = document.querySelector('.mp-bar .stat-text');

        if (hpBar && hpText) {
            const hpPercentage = (this.hp / this.maxHp) * 100;
            hpBar.style.width = `${hpPercentage}%`;
            hpText.textContent = `HP: ${this.hp}/${this.maxHp}`;
        }

        if (mpBar && mpText) {
            const mpPercentage = (this.mp / this.maxMp) * 100;
            mpBar.style.width = `${mpPercentage}%`;
            mpText.textContent = `MP: ${this.mp}/${this.maxMp}`;
        }
    }

    addTemporaryBuff(stat, amount, duration) {
        this.temporaryBuffs.set(stat, {
            amount,
            endTime: Date.now() + duration
        });
    }

    getEffectiveStats() {
        // Statistiche base
        const stats = { ...this.stats };
        
        // Aggiungi statistiche dell'equipaggiamento
        const equipStats = this.inventory.getStats();
        Object.entries(equipStats).forEach(([stat, value]) => {
            if (stats.hasOwnProperty(stat)) {
                stats[stat] += value;
            }
        });

        // Aggiungi buff temporanei
        this.temporaryBuffs.forEach((buff, stat) => {
            if (Date.now() < buff.endTime) {
                if (stats.hasOwnProperty(stat)) {
                    stats[stat] += buff.amount;
                }
            } else {
                this.temporaryBuffs.delete(stat);
            }
        });

        return stats;
    }

    showFloatingText(text, color) {
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        floatingText.style.color = color;
        floatingText.style.left = `${this.x + this.width/2}px`;
        floatingText.style.top = `${this.y}px`;
        
        document.getElementById('game-screen').appendChild(floatingText);
        
        setTimeout(() => {
            floatingText.remove();
        }, 1000);
    }
} 