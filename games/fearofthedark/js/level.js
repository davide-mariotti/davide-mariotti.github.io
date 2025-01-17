class Level {
    constructor(height, levelNumber = 1) {
        this.height = height;
        this.levelNumber = levelNumber;
        this.width = 100 + (levelNumber * 50); // Livelli progressivamente più lunghi
        this.tileSize = 32;
        this.tiles = [];
        
        this.TILE_TYPES = {
            EMPTY: 0,
            WALL: 1,
            FLOOR: 2,
            PLATFORM: 3,
            SPIKE: 4,
            LADDER: 5
        };

        // Proprietà per la generazione delle sezioni
        this.sectionWidth = 25; // Larghezza di ogni sezione
        this.sections = Math.ceil(this.width / this.sectionWidth);
        this.difficulty = levelNumber; // La difficoltà aumenta con il numero del livello
        
        this.enemies = [];
        this.deadEnemies = [];
        this.spawnPoints = [];
        
        this.ENEMY_TYPES = {
            ORC: ['warrior', 'berserk', 'shaman'],
            SLIME: ['blue', 'red', 'green']
        };
        
        this.items = [];
        
        this.generate();
    }

    generate() {
        // Inizializza la mappa con spazio vuoto
        this.tiles = Array(this.height).fill().map(() => 
            Array(this.width).fill(this.TILE_TYPES.EMPTY)
        );

        // Genera il livello sezione per sezione
        for (let section = 0; section < this.sections; section++) {
            this.generateSection(section);
        }

        // Crea i muri di confine
        this.createBoundaries();
        
        // Aggiungi la piattaforma finale
        this.createEndPlatform();

        // Genera punti di spawn per i nemici
        this.generateSpawnPoints();
        
        // Spawna i nemici iniziali
        this.spawnEnemies();
    }

    generateSection(sectionIndex) {
        const startX = sectionIndex * this.sectionWidth;
        const endX = Math.min(startX + this.sectionWidth, this.width);
        
        // Crea il terreno base
        const groundHeight = Math.floor(this.height * 0.8);
        for (let x = startX; x < endX; x++) {
            for (let y = groundHeight; y < this.height; y++) {
                this.tiles[y][x] = this.TILE_TYPES.WALL;
            }
        }

        // Aggiungi piattaforme con difficoltà crescente
        const platformCount = 2 + Math.floor(this.difficulty * 0.5);
        for (let i = 0; i < platformCount; i++) {
            const platformWidth = 3 + Math.floor(Math.random() * 4);
            const platformX = startX + Math.floor(Math.random() * (this.sectionWidth - platformWidth));
            const platformY = Math.floor(this.height * 0.3) + Math.floor(Math.random() * (groundHeight - Math.floor(this.height * 0.3)));
            
            for (let x = platformX; x < platformX + platformWidth; x++) {
                if (x < this.width) {
                    this.tiles[platformY][x] = this.TILE_TYPES.PLATFORM;
                }
            }
        }
    }

    createBoundaries() {
        // Muri laterali
        for (let y = 0; y < this.height; y++) {
            this.tiles[y][0] = this.TILE_TYPES.WALL;
            this.tiles[y][this.width - 1] = this.TILE_TYPES.WALL;
        }
    }

    createEndPlatform() {
        // Piattaforma finale più grande e riconoscibile
        const platformWidth = 5;
        const platformX = this.width - platformWidth - 2;
        const platformY = Math.floor(this.height * 0.6);
        
        for (let x = platformX; x < platformX + platformWidth; x++) {
            this.tiles[platformY][x] = this.TILE_TYPES.PLATFORM;
        }
    }

    generateSpawnPoints() {
        // Crea punti di spawn ogni X tiles
        const spawnInterval = 20;
        for (let x = spawnInterval; x < this.width - spawnInterval; x += spawnInterval) {
            // Trova il punto più alto del terreno per lo spawn
            for (let y = 0; y < this.height - 1; y++) {
                if (this.tiles[y + 1][x] === this.TILE_TYPES.WALL || 
                    this.tiles[y + 1][x] === this.TILE_TYPES.PLATFORM) {
                    this.spawnPoints.push({ x: x * this.tileSize, y: y * this.tileSize });
                    break;
                }
            }
        }
    }

    spawnEnemies() {
        const enemiesPerSpawnPoint = Math.min(3, 1 + Math.floor(this.difficulty / 3));
        
        this.spawnPoints.forEach(point => {
            for (let i = 0; i < enemiesPerSpawnPoint; i++) {
                if (Math.random() < 0.7) { // 70% di probabilità di spawn
                    const enemy = this.createRandomEnemy(point.x, point.y);
                    if (enemy) this.enemies.push(enemy);
                }
            }
        });
    }

    createRandomEnemy(x, y) {
        const roll = Math.random();
        let type, subtype;

        if (roll < 0.6) { // 60% slime
            type = 'SLIME';
            subtype = this.ENEMY_TYPES.SLIME[Math.floor(Math.random() * this.ENEMY_TYPES.SLIME.length)];
            return new Slime(x, y, subtype);
        } else { // 40% orc
            type = 'ORC';
            subtype = this.ENEMY_TYPES.ORC[Math.floor(Math.random() * this.ENEMY_TYPES.ORC.length)];
            return new Orc(x, y, subtype);
        }
    }

    update(player) {
        // Aggiorna i nemici vivi
        this.enemies = this.enemies.filter(enemy => !enemy.isDead);
        
        // Aggiorna ogni nemico
        this.enemies.forEach(enemy => {
            enemy.update(player);
            
            // Applica gravità
            enemy.velocityY += window.game.physics.gravity;
            
            // Gestisci collisioni con il terreno
            const collisions = this.checkCollisions(enemy);
            if (collisions.length > 0) {
                enemy.velocityY = 0;
                enemy.y = collisions[0].y - enemy.height;
            }
        });

        // Aggiorna items
        this.items = this.items.filter(item => !item.isCollected);
        this.items.forEach(item => {
            item.update();
            
            // Controlla collisioni con il terreno
            const collisions = this.checkCollisions(item);
            if (collisions.length > 0) {
                item.velocityY = 0;
                item.y = collisions[0].y - item.height;
            }

            // Controlla raccolta da parte del player
            if (window.game.physics.checkCollision(player, item)) {
                item.collect(player);
            }
        });
    }

    draw(ctx) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                
                switch (tile) {
                    case this.TILE_TYPES.WALL:
                        ctx.fillStyle = '#333';
                        break;
                    case this.TILE_TYPES.FLOOR:
                        ctx.fillStyle = '#666';
                        break;
                    case this.TILE_TYPES.PLATFORM:
                        ctx.fillStyle = '#888';
                        break;
                    default:
                        continue;
                }
                
                ctx.fillRect(
                    x * this.tileSize,
                    y * this.tileSize,
                    this.tileSize,
                    this.tileSize
                );
            }
        }

        // Disegna i nemici
        this.enemies.forEach(enemy => enemy.draw(ctx));

        // Disegna items
        this.items.forEach(item => item.draw(ctx));
    }

    removeDeadEnemies() {
        this.enemies = this.enemies.filter(enemy => !enemy.isDead);
    }

    checkEnemyCollisions(player) {
        this.enemies.forEach(enemy => {
            if (window.game.physics.checkCollision(player, enemy)) {
                if (player.isAttacking && !enemy.isDead) {
                    const damage = Math.max(1, player.stats.attack - enemy.stats.defense);
                    enemy.takeDamage(damage);
                    if (enemy.isDead) {
                        player.gainExperience(enemy.stats.experience);
                    }
                }
            }
        });
    }

    checkCollisions(entity) {
        const collisions = [];
        const tileX = Math.floor(entity.x / this.tileSize);
        const tileY = Math.floor(entity.y / this.tileSize);
        
        // Controlla i tile circostanti
        for (let y = tileY - 1; y <= tileY + 1; y++) {
            for (let x = tileX - 1; x <= tileX + 1; x++) {
                if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                    if (this.tiles[y][x] === this.TILE_TYPES.WALL || 
                        this.tiles[y][x] === this.TILE_TYPES.PLATFORM) {
                        const tile = {
                            x: x * this.tileSize,
                            y: y * this.tileSize,
                            width: this.tileSize,
                            height: this.tileSize
                        };
                        
                        if (this.physics.checkCollision(entity, tile)) {
                            collisions.push(tile);
                        }
                    }
                }
            }
        }
        
        return collisions;
    }
} 