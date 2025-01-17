class Physics {
    constructor() {
        this.gravity = 0.8;
        this.friction = 0.85;
        this.maxFallSpeed = 15;
        this.minMoveSpeed = 0.5;
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    resolveCollision(entity, obstacle, useHitbox = false) {
        let entityBox = useHitbox ? entity.getHitbox() : entity;
        const overlap = {
            x: Math.min(entityBox.x + entityBox.width - obstacle.x, 
                       obstacle.x + obstacle.width - entityBox.x),
            y: Math.min(entityBox.y + entityBox.height - obstacle.y, 
                       obstacle.y + obstacle.height - entityBox.y)
        };

        if (overlap.x < overlap.y) {
            if (entityBox.x < obstacle.x) {
                entity.x = obstacle.x - (useHitbox ? entity.hitboxOffsetX + entity.hitboxWidth : entity.width);
            } else {
                entity.x = obstacle.x + obstacle.width - (useHitbox ? entity.hitboxOffsetX : 0);
            }
            entity.velocityX = 0;
        } else {
            if (entityBox.y < obstacle.y) {
                entity.y = obstacle.y - (useHitbox ? entity.hitboxOffsetY + entity.hitboxHeight : entity.height);
                entity.velocityY = 0;
                entity.isJumping = false;
            } else {
                entity.y = obstacle.y + obstacle.height - (useHitbox ? entity.hitboxOffsetY : 0);
                entity.velocityY = 0;
            }
        }
    }
} 