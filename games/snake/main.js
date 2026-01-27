/**
 * Snake Game Logic
 * Modernized for Digital Forest Theme
 */

let dom_replay = document.querySelector("#replay");
let dom_score = document.querySelector("#score");
let dom_canvas = document.createElement("canvas");
let canvas_container = document.querySelector("#canvas");
canvas_container.appendChild(dom_canvas);
let CTX = dom_canvas.getContext("2d");

let W, H, scale;
let cells = 20;
let cellSize;

let snake,
  food,
  currentHue,
  isGameOver = false,
  score = 0,
  maxScore = window.localStorage.getItem("snake_highscore") || 0,
  particles = [],
  requestID;

function resizeCanvas() {
  const container = canvas_container.getBoundingClientRect();
  W = H = container.width;
  dom_canvas.style.width = `${W}px`;
  dom_canvas.style.height = `${H}px`;
  scale = window.devicePixelRatio || 1;
  dom_canvas.width = W * scale;
  dom_canvas.height = H * scale;
  CTX.scale(scale, scale);
  cellSize = W / cells;
  if (snake) snake.size = cellSize;
  if (food) food.size = cellSize;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const helpers = {
  Vec: class {
    constructor(x, y) { this.x = x; this.y = y; }
    add(v) { this.x += v.x; this.y += v.y; return this; }
  },
  isCollision(v1, v2) { return v1.x === v2.x && v1.y === v2.y; },
  drawGrid() {
    CTX.lineWidth = 0.5;
    CTX.strokeStyle = "rgba(16, 185, 129, 0.1)"; // Very subtle primary green grid
    for (let i = 1; i < cells; i++) {
      let f = (W / cells) * i;
      CTX.beginPath(); CTX.moveTo(f, 0); CTX.lineTo(f, H); CTX.stroke();
      CTX.beginPath(); CTX.moveTo(0, f); CTX.lineTo(W, f); CTX.stroke();
    }
  },
  randHue() { return ~~(Math.random() * 360); }
};

let KEY = {
  ArrowUp: false, ArrowRight: false, ArrowDown: false, ArrowLeft: false,
  resetState() {
    this.ArrowUp = false; this.ArrowRight = false; this.ArrowDown = false; this.ArrowLeft = false;
  },
  listen() {
    addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();

      let targetDir = null;
      if (e.key === "ArrowUp" && !this.ArrowDown) targetDir = "ArrowUp";
      if (e.key === "ArrowDown" && !this.ArrowUp) targetDir = "ArrowDown";
      if (e.key === "ArrowLeft" && !this.ArrowRight) targetDir = "ArrowLeft";
      if (e.key === "ArrowRight" && !this.ArrowLeft) targetDir = "ArrowRight";

      if (targetDir) {
        this.resetState();
        this[targetDir] = true;
      }
    });
  }
};

class Snake {
  constructor() {
    this.pos = new helpers.Vec(W / 2, H / 2);
    this.dir = new helpers.Vec(0, 0);
    this.delay = 7; // Slightly slower for better control
    this.size = cellSize;
    this.history = [];
    this.total = 1;
  }

  draw() {
    CTX.fillStyle = "#10b981"; // Primary Green
    CTX.shadowBlur = 10;
    CTX.shadowColor = "rgba(16, 185, 129, 0.4)";
    CTX.fillRect(this.pos.x + 1, this.pos.y + 1, this.size - 2, this.size - 2);

    CTX.shadowBlur = 0;
    for (let i = 0; i < this.history.length; i++) {
      let p = this.history[i];
      CTX.fillStyle = "rgba(16, 185, 129, " + (0.4 + (i / this.history.length) * 0.6) + ")";
      CTX.fillRect(p.x + 1, p.y + 1, this.size - 2, this.size - 2);
    }
  }

  update() {
    this.walls();
    this.draw();
    this.controls();
    if (!this.delay--) {
      // Round positions to avoid floating point issues during collision check
      const currentX = Math.round(this.pos.x / cellSize) * cellSize;
      const currentY = Math.round(this.pos.y / cellSize) * cellSize;
      const foodX = Math.round(food.pos.x / cellSize) * cellSize;
      const foodY = Math.round(food.pos.y / cellSize) * cellSize;

      if (currentX === foodX && currentY === foodY) {
        score++;
        dom_score.innerText = score.toString().padStart(2, "0");
        food.spawn();
        this.total++;
      }
      this.history[this.total - 1] = new helpers.Vec(this.pos.x, this.pos.y);
      for (let i = 0; i < this.total - 1; i++) {
        this.history[i] = this.history[i + 1];
      }
      this.pos.add(this.dir);
      this.delay = 6;
      if (this.total > 3) this.selfCollision();
    }
  }

  walls() {
    if (this.pos.x + cellSize > W) this.pos.x = 0;
    if (this.pos.y + cellSize > H) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = H - cellSize;
    if (this.pos.x < 0) this.pos.x = W - cellSize;
  }

  selfCollision() {
    for (let p of this.history) {
      if (helpers.isCollision(this.pos, p)) isGameOver = true;
    }
  }

  controls() {
    if (KEY.ArrowUp) this.dir = new helpers.Vec(0, -this.size);
    if (KEY.ArrowDown) this.dir = new helpers.Vec(0, this.size);
    if (KEY.ArrowLeft) this.dir = new helpers.Vec(-this.size, 0);
    if (KEY.ArrowRight) this.dir = new helpers.Vec(this.size, 0);
  }
}

class Food {
  constructor() {
    this.size = cellSize;
    this.spawn();
  }
  draw() {
    CTX.fillStyle = this.color;
    CTX.shadowBlur = 15;
    CTX.shadowColor = this.color;
    CTX.fillRect(this.pos.x + 2, this.pos.y + 2, this.size - 4, this.size - 4);
    CTX.shadowBlur = 0;
  }
  spawn() {
    this.pos = new helpers.Vec(
      ~~(Math.random() * cells) * cellSize,
      ~~(Math.random() * cells) * cellSize
    );
    this.color = `hsl(${helpers.randHue()}, 80%, 60%)`;
  }
}

function loop() {
  CTX.clearRect(0, 0, W, H);
  if (!isGameOver) {
    requestID = requestAnimationFrame(loop);
    helpers.drawGrid();
    snake.update();
    food.draw();
  } else {
    showGameOver();
  }
}

function showGameOver() {
  if (score > maxScore) {
    maxScore = score;
    window.localStorage.setItem("snake_highscore", maxScore);
  }
  CTX.fillStyle = "rgba(0,0,0,0.6)";
  CTX.fillRect(0, 0, W, H);

  CTX.fillStyle = "#10b981";
  CTX.textAlign = "center";
  CTX.font = "bold 40px 'Outfit', sans-serif";
  CTX.fillText("GAME OVER", W / 2, H / 2 - 20);

  CTX.fillStyle = "white";
  CTX.font = "20px 'Inter', sans-serif";
  CTX.fillText(`Score: ${score} | Best: ${maxScore}`, W / 2, H / 2 + 30);
}

function reset() {
  score = 0;
  dom_score.innerText = "00";
  snake = new Snake();
  food.spawn();
  KEY.resetState();
  isGameOver = false;
  cancelAnimationFrame(requestID);
  loop();
}

// Init
KEY.listen();
snake = new Snake();
food = new Food();
dom_replay.addEventListener("click", reset);
loop();