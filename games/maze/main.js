/**
 * Maze Game Logic
 * Modernized for Digital Forest Theme
 */

// Configuration
const COLORS = {
    PATH: "rgba(16, 185, 129, 0.3)", // Primary green semi-transparent
    WALL: "#1a1a1a",
    TRAIL: "rgba(16, 185, 129, 0.6)"
};

// Utilities
const rand = (max) => Math.floor(Math.random() * max);
const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

// Maze Engine
class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.map = this.generateMap();
        this.setStartEnd();
    }

    generateMap() {
        const map = new Array(this.height);
        for (let y = 0; y < this.height; y++) {
            map[y] = new Array(this.width);
            for (let x = 0; x < this.width; x++) {
                map[y][x] = {
                    n: false, s: false, e: false, w: false,
                    visited: false,
                    priorPos: null
                };
            }
        }

        const modDir = {
            n: { y: -1, x: 0, o: "s" },
            s: { y: 1, x: 0, o: "n" },
            e: { y: 0, x: 1, o: "w" },
            w: { y: 0, x: -1, o: "e" }
        };

        const dirs = ["n", "s", "e", "w"];
        let pos = { x: 0, y: 0 };
        let visited = 1;
        const totalCells = this.width * this.height;

        map[0][0].visited = true;

        while (visited < totalCells) {
            const shuffledDirs = shuffle([...dirs]);
            let moved = false;

            for (const dir of shuffledDirs) {
                const nextPos = {
                    x: pos.x + modDir[dir].x,
                    y: pos.y + modDir[dir].y
                };

                if (this.isValid(nextPos) && !map[nextPos.y][nextPos.x].visited) {
                    map[pos.y][pos.x][dir] = true;
                    map[nextPos.y][nextPos.x][modDir[dir].o] = true;
                    map[nextPos.y][nextPos.x].visited = true;
                    map[nextPos.y][nextPos.x].priorPos = { ...pos };
                    pos = { ...nextPos };
                    visited++;
                    moved = true;
                    break;
                }
            }

            if (!moved) {
                pos = { ...map[pos.y][pos.x].priorPos };
            }
        }

        // Clean up visited flags for game trail
        for (let y = 0; y < this.height; y++)
            for (let x = 0; x < this.width; x++)
                map[y][x].visited = false;

        return map;
    }

    isValid(pos) {
        return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
    }

    setStartEnd() {
        const corners = [
            { x: 0, y: 0 },
            { x: 0, y: this.height - 1 },
            { x: this.width - 1, y: 0 },
            { x: this.width - 1, y: this.height - 1 }
        ];
        [this.startCoord, this.endCoord] = shuffle(corners).slice(0, 2);
    }
}

class Player {
    constructor(maze, cellSize, sprite, onComplete) {
        this.maze = maze;
        this.cellSize = cellSize;
        this.sprite = sprite;
        this.onComplete = onComplete;
        this.reset();
    }

    reset() {
        this.pos = { ...this.maze.startCoord };
        this.moves = 0;
        this.maze.map[this.pos.y][this.pos.x].visited = true;
    }

    move(dir) {
        if (gameOver) return;
        const cell = this.maze.map[this.pos.y][this.pos.x];
        if (cell[dir]) {
            this.moves++;
            switch (dir) {
                case 'n': this.pos.y--; break;
                case 's': this.pos.y++; break;
                case 'e': this.pos.x++; break;
                case 'w': this.pos.x--; break;
            }
            this.maze.map[this.pos.y][this.pos.x].visited = true;
            redrawMaze();
            this.checkVictory();
        }
    }

    checkVictory() {
        if (this.pos.x === this.maze.endCoord.x && this.pos.y === this.maze.endCoord.y) {
            this.onComplete(this.moves);
        }
    }

    draw(ctx) {
        const pad = this.cellSize * 0.1;
        ctx.drawImage(this.sprite,
            this.pos.x * this.cellSize + pad,
            this.pos.y * this.cellSize + pad,
            this.cellSize - pad * 2,
            this.cellSize - pad * 2
        );
    }
}

// Global UI handling
let maze, player, canvas, ctx;
let playerSprite, goalSprite;
let gameOver = false;

function init() {
    canvas = document.getElementById("mazeCanvas");
    ctx = canvas.getContext("2d");

    playerSprite = new Image();
    playerSprite.src = "./img/alien.png";

    goalSprite = new Image();
    goalSprite.src = "./img/spaceship.png";

    Promise.all([
        new Promise(res => playerSprite.onload = res),
        new Promise(res => goalSprite.onload = res)
    ]).then(makeMaze);

    setupInput();
}

function makeMaze() {
    const diff = parseInt(document.getElementById("diffSelect").value);
    resizeCanvas();

    const cellSize = canvas.width / diff;
    maze = new Maze(diff, diff);
    player = new Player(maze, cellSize, playerSprite, (m) => {
        gameOver = true;
        document.getElementById("moves").textContent = `Navigation successful in ${m} steps.`;
        const container = document.getElementById("Message-Container");
        container.classList.add("visible");
    });

    gameOver = false;
    redrawMaze();
}

function resizeCanvas() {
    const view = document.getElementById("view");
    const container = document.getElementById("maze-wrapper");
    const size = Math.min(view.offsetWidth, window.innerHeight * 0.6);
    canvas.width = size;
    canvas.height = size;
    if (player) player.cellSize = canvas.width / maze.width;
}

function redrawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw trail
    for (let y = 0; y < maze.height; y++) {
        for (let x = 0; x < maze.width; x++) {
            if (maze.map[y][x].visited) {
                ctx.fillStyle = COLORS.PATH;
                ctx.fillRect(x * player.cellSize, y * player.cellSize, player.cellSize, player.cellSize);
            }
        }
    }

    // Draw walls
    ctx.strokeStyle = COLORS.WALL;
    ctx.lineWidth = Math.max(2, player.cellSize / 10);
    ctx.lineCap = "round";

    for (let y = 0; y < maze.height; y++) {
        for (let x = 0; x < maze.width; x++) {
            const cell = maze.map[y][x];
            const x1 = x * player.cellSize;
            const y1 = y * player.cellSize;
            const x2 = x1 + player.cellSize;
            const y2 = y1 + player.cellSize;

            ctx.beginPath();
            if (!cell.n) { ctx.moveTo(x1, y1); ctx.lineTo(x2, y1); }
            if (!cell.s) { ctx.moveTo(x1, y2); ctx.lineTo(x2, y2); }
            if (!cell.e) { ctx.moveTo(x2, y1); ctx.lineTo(x2, y2); }
            if (!cell.w) { ctx.moveTo(x1, y1); ctx.lineTo(x1, y2); }
            ctx.stroke();
        }
    }

    // Draw goal
    const pad = player.cellSize * 0.1;
    ctx.drawImage(goalSprite,
        maze.endCoord.x * player.cellSize + pad,
        maze.endCoord.y * player.cellSize + pad,
        player.cellSize - pad * 2,
        player.cellSize - pad * 2
    );

    player.draw(ctx);
}

function setupInput() {
    window.addEventListener("keydown", (e) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
        switch (e.key) {
            case "ArrowUp": case "w": player.move('n'); break;
            case "ArrowDown": case "s": player.move('s'); break;
            case "ArrowLeft": case "a": player.move('w'); break;
            case "ArrowRight": case "d": player.move('e'); break;
        }
    });

    $("#view").swipe({
        swipe: (event, direction) => {
            switch (direction) {
                case "up": player.move('n'); break;
                case "down": player.move('s'); break;
                case "left": player.move('w'); break;
                case "right": player.move('e'); break;
            }
        },
        threshold: 20
    });
}

function toggleVisibility(id) {
    const el = document.getElementById(id);
    el.classList.remove("visible");
    makeMaze();
}

window.onload = init;
window.onresize = () => {
    if (!maze) return;
    makeMaze();
};