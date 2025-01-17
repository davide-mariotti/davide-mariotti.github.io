class Physics {
    constructor() {
        this.gravity = 0.8;
        this.friction = 0.8;
        this.maxFallSpeed = 15;
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    resolveCollision(entity, obstacle) {
        const overlap = {
            x: Math.min(entity.x + entity.width - obstacle.x, obstacle.x + obstacle.width - entity.x),
            y: Math.min(entity.y + entity.height - obstacle.y, obstacle.y + obstacle.height - entity.y)
        };

        if (overlap.x < overlap.y) {
            if (entity.x < obstacle.x) {
                entity.x = obstacle.x - entity.width;
            } else {
                entity.x = obstacle.x + obstacle.width;
            }
            entity.velocityX = 0;
        } else {
            if (entity.y < obstacle.y) {
                entity.y = obstacle.y - entity.height;
                entity.velocityY = 0;
                entity.isJumping = false;
            } else {
                entity.y = obstacle.y + obstacle.height;
                entity.velocityY = 0;
            }
        }
    }
} 