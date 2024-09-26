// Constants
const CELL_COLORS = {
  PATH: "rgba(144, 238, 144, 0.5)",
  WALL: "#000000",
  END: "rgba(44, 159, 69, 0.8)"
};

// Utility functions
const rand = (max) => Math.floor(Math.random() * max);
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Image processing
function changeBrightness(factor, sprite) {
  const canvas = document.createElement("canvas");
  canvas.width = sprite.width;
  canvas.height = sprite.height;
  const ctx = canvas.getContext("2d");
  
  ctx.drawImage(sprite, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
      data[i] *= factor;     // red
      data[i + 1] *= factor; // green
      data[i + 2] *= factor; // blue
  }

  ctx.putImageData(imageData, 0, 0);
  const newSprite = new Image();
  newSprite.src = canvas.toDataURL();
  return newSprite;
}

// Game logic
class Maze {
  constructor(width, height) {
      this.width = width;
      this.height = height;
      this.map = this.generateMap();
      this.setStartEnd();
      this.resetVisited(); // Add this line
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
        n: {y: -1, x: 0, o: "s"},
        s: {y: 1, x: 0, o: "n"},
        e: {y: 0, x: 1, o: "w"},
        w: {y: 0, x: -1, o: "e"}
    };

    const dirs = ["n", "s", "e", "w"];
    let pos = {x: 0, y: 0};
    let visited = 1;
    const totalCells = this.width * this.height;
    
    while (visited < totalCells) {
        const shuffledDirs = shuffle(dirs);
        let moved = false;

        for (let i = 0; i < shuffledDirs.length; i++) {
            const dir = shuffledDirs[i];
            const nextPos = {
                x: pos.x + modDir[dir].x,
                y: pos.y + modDir[dir].y
            };

            if (this.isValidPosition(nextPos) && !map[nextPos.y][nextPos.x].visited) {
                map[pos.y][pos.x][dir] = true;
                map[nextPos.y][nextPos.x][modDir[dir].o] = true;
                map[nextPos.y][nextPos.x].visited = true;
                map[nextPos.y][nextPos.x].priorPos = {...pos};
                pos = {...nextPos};
                visited++;
                moved = true;
                break;
            }
        }

        if (!moved) {
            pos = {...map[pos.y][pos.x].priorPos};
        }
    }

    return map;
}

  isValidPosition(pos) {
      return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
  }

  setStartEnd() {
      const cornerOptions = [
          {x: 0, y: 0},
          {x: 0, y: this.height - 1},
          {x: this.width - 1, y: 0},
          {x: this.width - 1, y: this.height - 1}
      ];
      [this.startCoord, this.endCoord] = shuffle(cornerOptions).slice(0, 2);
  }

  resetVisited() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.map[y][x].visited = false;
      }
    }
  }
}

class Player {
    constructor(maze, cellSize, onComplete, sprite) {
        this.maze = maze;
        this.cellSize = cellSize;
        this.onComplete = onComplete;
        this.sprite = sprite;
        this.position = { ...maze.startCoord };
        this.moves = 0;
        this.maze.map[this.position.y][this.position.x].visited = true; // Mark start position as visited

        this.bindControls();
    }

    move(direction) {
        const cell = this.maze.map[this.position.y][this.position.x];
        if (cell[direction]) {
            this.moves++;
            switch(direction) {
                case 'n': this.position.y--; break;
                case 's': this.position.y++; break;
                case 'e': this.position.x++; break;
                case 'w': this.position.x--; break;
            }
            
            this.maze.map[this.position.y][this.position.x].visited = true;
            redrawMaze(); // This function will be defined globally
            
            this.checkVictory();
        }
    }

    checkVictory() {
        if (this.position.x === this.maze.endCoord.x && this.position.y === this.maze.endCoord.y) {
            this.onComplete(this.moves);
            this.unbindControls();
        }
    }

    draw(ctx) {
        const offset = this.cellSize / 50;
        ctx.drawImage(
            this.sprite,
            0,
            0,
            this.sprite.width,
            this.sprite.height,
            this.position.x * this.cellSize + offset,
            this.position.y * this.cellSize + offset,
            this.cellSize - offset * 2,
            this.cellSize - offset * 2
        );
    }

    bindControls() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        $("#view").swipe({
            swipe: this.handleSwipe.bind(this),
            threshold: 0
        });
    }

    unbindControls() {
        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
        $("#view").swipe("destroy");
    }

    handleKeyDown(e) {
        switch (e.keyCode) {
            case 37: case 65: this.move('w'); break; // left, A
            case 38: case 87: this.move('n'); break; // up, W
            case 39: case 68: this.move('e'); break; // right, D
            case 40: case 83: this.move('s'); break; // down, S
        }
    }

    handleSwipe(event, direction) {
        switch (direction) {
            case "left": this.move('w'); break;
            case "up": this.move('n'); break;
            case "right": this.move('e'); break;
            case "down": this.move('s'); break;
        }
    }
}

// Global variables and functions
let maze, player;
let mazeCanvas, ctx;
let sprite, finishSprite;

function redrawMaze() {
    ctx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
    
    // Draw maze
    ctx.strokeStyle = CELL_COLORS.WALL;
    ctx.lineWidth = player.cellSize / 40;

    for (let y = 0; y < maze.height; y++) {
        for (let x = 0; x < maze.width; x++) {
            const cell = maze.map[y][x];
            const cellX = x * player.cellSize;
            const cellY = y * player.cellSize;

            if (cell.visited) {
                ctx.fillStyle = CELL_COLORS.PATH;
                ctx.fillRect(cellX, cellY, player.cellSize, player.cellSize);
            }

            ctx.beginPath();
            if (!cell.n) ctx.moveTo(cellX, cellY), ctx.lineTo(cellX + player.cellSize, cellY);
            if (!cell.s) ctx.moveTo(cellX, cellY + player.cellSize), ctx.lineTo(cellX + player.cellSize, cellY + player.cellSize);
            if (!cell.e) ctx.moveTo(cellX + player.cellSize, cellY), ctx.lineTo(cellX + player.cellSize, cellY + player.cellSize);
            if (!cell.w) ctx.moveTo(cellX, cellY), ctx.lineTo(cellX, cellY + player.cellSize);
            ctx.stroke();
        }
    }

    // Draw end sprite
    const offset = player.cellSize / 50;
    ctx.drawImage(
        finishSprite,
        2,
        2,
        finishSprite.width,
        finishSprite.height,
        maze.endCoord.x * player.cellSize + offset,
        maze.endCoord.y * player.cellSize + offset,
        player.cellSize - offset * 2,
        player.cellSize - offset * 2
    );

    // Draw player
    player.draw(ctx);
}

function makeMaze() {
    const diffSelect = document.getElementById("diffSelect");
    const difficulty = parseInt(diffSelect.value);
    const cellSize = mazeCanvas.width / difficulty;

    maze = new Maze(difficulty, difficulty);
    player = new Player(maze, cellSize, displayVictoryMess, sprite);

    redrawMaze();

    document.getElementById("mazeContainer").style.opacity = "100";
}

// Game initialization and management
function initGame() {
  mazeCanvas = document.getElementById("mazeCanvas");
  ctx = mazeCanvas.getContext("2d");
  resizeCanvas();
  loadSprites(() => {
      makeMaze();
  });
}

function resizeCanvas() {
  const view = document.getElementById("view");
  const size = Math.min(view.offsetWidth, view.offsetHeight) - 20;
  mazeCanvas.width = size;
  mazeCanvas.height = size;
}

function loadSprites(callback) {
  let loaded = 0;
  const onLoad = () => {
      loaded++;
      if (loaded === 2) callback();
  };

  sprite = loadImage("./img/alien.png", () => {
      sprite = changeBrightness(1.2, sprite);
      onLoad();
  });

  finishSprite = loadImage("./img/spaceship.png", () => {
      finishSprite = changeBrightness(1.1, finishSprite);
      onLoad();
  });
}

function loadImage(src, onload) {
  const img = new Image();
  img.onload = onload;
  img.src = src + "?" + new Date().getTime();
  return img;
}

function displayVictoryMess(moves) {
  document.getElementById("moves").textContent = `You Moved ${moves} Steps.`;
  toggleVisibility("Message-Container");
}

function toggleVisibility(id) {
  const element = document.getElementById(id);
  if (element.style.visibility === "visible") {
      element.style.visibility = "hidden";
      makeMaze(); // Automatically start a new maze when hiding the message
  } else {
      element.style.visibility = "visible";
  }
}

window.onload = initGame;
window.onresize = () => {
  resizeCanvas();
  if (maze) {
      const cellSize = mazeCanvas.width / maze.width;
      player.cellSize = cellSize;
      ctx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
      redrawMaze();
  }
};