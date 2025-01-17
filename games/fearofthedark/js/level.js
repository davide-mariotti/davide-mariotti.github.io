class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.tileSize = 32;
        this.colliders = [];
        this.platforms = [];
        
        this.generateLevel();
    }

    generateLevel() {
        // Create a more interesting level layout
        this.generateTerrain();
        this.generatePlatforms();
        this.generateColliders();
    }

    generateTerrain() {
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Ground
                if (y > this.height - 3) {
                    this.tiles[y][x] = 1;
                } 
                // Walls
                else if (x === 0 || x === this.width - 1) {
                    this.tiles[y][x] = 2;
                }
                // Empty space
                else {
                    this.tiles[y][x] = 0;
                }
            }
        }
    }

    generatePlatforms() {
        // Add some platforms at different heights
        const platformPositions = [
            { x: 5, y: this.height - 6, width: 4 },
            { x: 12, y: this.height - 8, width: 4 },
            { x: 18, y: this.height - 5, width: 3 }
        ];

        platformPositions.forEach(platform => {
            for (let x = platform.x; x < platform.x + platform.width; x++) {
                this.tiles[platform.y][x] = 3;
                this.platforms.push({
                    x: x * this.tileSize,
                    y: platform.y * this.tileSize,
                    width: this.tileSize,
                    height: this.tileSize
                });
            }
        });
    }

    generateColliders() {
        // Create colliders for all solid tiles
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.tiles[y][x] !== 0) {
                    this.colliders.push({
                        x: x * this.tileSize,
                        y: y * this.tileSize,
                        width: this.tileSize,
                        height: this.tileSize,
                        type: this.tiles[y][x]
                    });
                }
            }
        }
    }

    checkCollisions(entity) {
        let collisions = [];
        this.colliders.forEach(collider => {
            if (window.game.physics.checkCollision(entity, collider)) {
                collisions.push(collider);
            }
        });
        return collisions;
    }

    draw(ctx) {
        const colors = {
            1: '#663300', // Ground
            2: '#4d2600', // Walls
            3: '#806600'  // Platforms
        };

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tileType = this.tiles[y][x];
                if (tileType !== 0) {
                    ctx.fillStyle = colors[tileType];
                    ctx.fillRect(
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    );
                }
            }
        }
    }
} 