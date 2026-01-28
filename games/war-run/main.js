/**
 * WAR RUN - Army Runner Game
 * Inspired by Last War
 * Assets by Pixel Frog (Tiny Swords)
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const soldierCountEl = document.getElementById('soldier-count');
const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('best-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const startBestScoreEl = document.getElementById('start-best-score');
const goBestScoreEl = document.getElementById('go-best-score');
const startBtn = document.getElementById('start-btn');
const retryBtn = document.getElementById('retry-btn');

// Game Constants
const GAME_WIDTH = 400;
const GAME_HEIGHT = 700;
const SCROLL_SPEED = 0.6;
const SOLDIER_RADIUS = 10;
const MAX_SOLDIERS = 600;
const SHOOT_INTERVAL = 300;
const HORIZON_Y = 200;

// Assets
const IMAGES = {
    soldier: new Image(),
    enemy: new Image(),
    boss: new Image(),
    obstacle: new Image(),
    cloud: new Image(),
    tower: new Image(),
    tilesetGrass: new Image(),
    tilesetRoad: new Image()
};
IMAGES.soldier.src = 'img/Units/Blue Units/Warrior/Warrior_Run.png';
IMAGES.enemy.src = 'img/Units/Red Units/Warrior/Warrior_Run.png';
IMAGES.boss.src = 'img/Units/Black Units/Warrior/Warrior_Idle.png';
IMAGES.obstacle.src = 'img/Terrain/Decorations/Rocks/Rock1.png';
IMAGES.cloud.src = 'img/Terrain/Decorations/Clouds/Clouds_01.png';
IMAGES.tower.src = 'img/Buildings/Blue Buildings/Tower.png';
IMAGES.tilesetGrass.src = 'img/Terrain/Tileset/Tilemap_color1.png';
IMAGES.tilesetRoad.src = 'img/Terrain/Tileset/Tilemap_color4.png';

// Texture System
let WORLD_TEXTURE = null;
let textureOffset = 0;
let texturesLoaded = 0;

function createPatternFromImage(img) {
    if (!img.complete || img.naturalWidth === 0) return null;
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64; pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    pCtx.drawImage(img, 64, 64, 64, 64, 0, 0, 64, 64);
    return pCtx.createPattern(pCanvas, 'repeat');
}

function createWorldTexture() {
    const tempK = document.createElement('canvas');
    tempK.width = 512;
    tempK.height = 64;
    const tCtx = tempK.getContext('2d');

    // Draw Grass Pattern
    const pG = createPatternFromImage(IMAGES.tilesetGrass);
    tCtx.fillStyle = pG || '#14532d';
    tCtx.fillRect(0, 0, 512, 64);

    // Draw Road in Center (Width 256)
    const pR = createPatternFromImage(IMAGES.tilesetRoad);
    if (pR) {
        tCtx.fillStyle = pR;
        tCtx.fillRect(128, 0, 256, 64);

        // Road Borders
        tCtx.fillStyle = '#451a03';
        tCtx.fillRect(128, 0, 10, 64);
        tCtx.fillRect(374, 0, 10, 64);
    } else {
        tCtx.fillStyle = '#78350f';
        tCtx.fillRect(128, 0, 256, 64);
    }
    WORLD_TEXTURE = tempK;
}

const checkLoad = () => { texturesLoaded++; if (texturesLoaded >= 2) createWorldTexture(); };
IMAGES.tilesetGrass.onload = checkLoad;
IMAGES.tilesetRoad.onload = checkLoad;


// Game State
let gameState = 'START';
let score = 0;
let level = 1;
let levelProgress = 0;
let bestScore = parseInt(localStorage.getItem('warRunBestScore')) || 0;
let soldiers = [];
let projectiles = [];
let gates = [];
let enemies = [];
let obstacles = [];
let particles = [];
let floatingTexts = [];
let decors = [];
let activeBoss = null;
let screenShake = 0;
let lastTime = 0;
let lastShotTime = 0;
let playerX = GAME_WIDTH / 2;
let moveTargetX = playerX;
let spawnTimer = 0;
let globalFrameTimer = 0;

// Audio System
class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }
    init() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
    shoot() { this.playTone(400, 'square', 0.1, 0.05); }
    hit() { this.playTone(200, 'sawtooth', 0.1, 0.05); }
    kill() { this.playTone(100, 'lowpass', 0.3, 0.1); }
    gatePositive() { this.playTone(600, 'sine', 0.3, 0.1); }
    gateNegative() { this.playTone(200, 'sawtooth', 0.3, 0.1); }
    bossSpawn() {
        this.playTone(100, 'sawtooth', 1.0, 0.3);
        setTimeout(() => this.playTone(80, 'sawtooth', 1.0, 0.3), 200);
    }
    bossCharge() {
        this.playTone(150, 'square', 0.5, 0.2);
    }
    gameOver() {
        this.playTone(150, 'sawtooth', 1.0, 0.2);
        setTimeout(() => this.playTone(100, 'sawtooth', 1.0, 0.2), 400);
    }
    levelUp() {
        this.playTone(500, 'sine', 0.2, 0.2);
        setTimeout(() => this.playTone(700, 'sine', 0.4, 0.2), 200);
    }
}
const audio = new SoundManager();

// Resize with HiDPI
function resize() {
    const scale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);

    // HiDPI Scaling
    const dpr = window.devicePixelRatio || 1;

    // Physical resolution
    canvas.width = GAME_WIDTH * dpr;
    canvas.height = GAME_HEIGHT * dpr;

    // CSS Display resolution
    canvas.style.width = `${GAME_WIDTH * scale}px`;
    canvas.style.height = `${GAME_HEIGHT * scale}px`;

    // Normalize coordinate system to logical pixels
    ctx.scale(dpr, dpr);

    // Quality settings: Scaling enabled for smooth look
    ctx.imageSmoothingEnabled = true;
}
window.addEventListener('resize', resize);
resize();

// Input
function inputStart(clientX) {
    audio.init();
    if (audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume();
    if (gameState === 'PLAYING') handleInput(clientX);
}
function inputMove(clientX) {
    if (gameState === 'PLAYING') handleInput(clientX);
}

function handleInput(clientX) {
    const rect = canvas.getBoundingClientRect();
    // Correct Input Mappig for HiDPI
    const scaleX = GAME_WIDTH / rect.width;
    const screenX = (clientX - rect.left) * scaleX;

    const playerPlaneY = GAME_HEIGHT - 100;
    const s = getScale(playerPlaneY);
    if (s > 0.1) {
        moveTargetX = GAME_WIDTH / 2 + (screenX - GAME_WIDTH / 2) / s;
    } else {
        moveTargetX = GAME_WIDTH / 2;
    }
}

canvas.addEventListener('mousedown', (e) => inputStart(e.clientX));
canvas.addEventListener('mousemove', (e) => { if (e.buttons === 1) inputMove(e.clientX); });
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); inputStart(e.touches[0].clientX); }, { passive: false });
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); inputMove(e.touches[0].clientX); }, { passive: false });


// 3D Projection Engine
function getScale(y) {
    if (y < HORIZON_Y) return 0.1;
    return 0.1 + 0.9 * ((y - HORIZON_Y) / (GAME_HEIGHT - HORIZON_Y));
}

function project(worldX, worldY) {
    const scale = getScale(worldY);
    const sx = GAME_WIDTH / 2 + (worldX - GAME_WIDTH / 2) * scale;
    const sy = worldY;
    return { x: sx, y: sy, scale: scale };
}

// Logic Classes
class Soldier {
    constructor(offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.frameOffset = Math.floor(Math.random() * 6);
    }
    draw(baseX, baseY, globalFrame) {
        const worldX = baseX + this.offsetX;
        const worldY = baseY + this.offsetY;
        const p = project(worldX, worldY);

        if (IMAGES.soldier.complete && IMAGES.soldier.naturalWidth !== 0) {
            const frame = (globalFrame + this.frameOffset) % 6;
            const srcSize = 192;
            const size = 64 * p.scale;

            ctx.drawImage(IMAGES.soldier, frame * srcSize, 0, srcSize, srcSize, p.x - size / 2, p.y - size / 2, size, size);
        } else {
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath(); ctx.arc(p.x, p.y, SOLDIER_RADIUS * p.scale, 0, Math.PI * 2); ctx.fill();
        }
    }
}

class Boss {
    constructor() {
        this.x = GAME_WIDTH / 2;
        this.y = HORIZON_Y;
        this.targetY = 250;
        this.width = 160;
        this.height = 160;
        this.metricsValue = 500 + (level * 500);
        this.hp = this.metricsValue;
        this.maxHp = this.metricsValue;
        this.state = 'ENTERING';
        this.chargeTimer = 0;
    }
    update(dt) {
        if (this.state === 'ENTERING') {
            this.y += 0.5;
            if (this.y > this.targetY) this.state = 'FIGHTING';
        }
        else if (this.state === 'FIGHTING') {
            this.x = GAME_WIDTH / 2 + Math.sin(Date.now() / 1500) * 100;

            this.chargeTimer += dt;
            if (this.chargeTimer > 5000) {
                if (Math.random() < 0.5) {
                    this.state = 'CHARGING';
                    audio.bossCharge();
                    spawnFloatingText(this.x, this.y, "CHARGE!", "#ef4444");
                }
                this.chargeTimer = 0;
            }
        }
        else if (this.state === 'CHARGING') {
            this.y += 3;
            this.x += (playerX - this.x) * 0.02;

            if (this.y > GAME_HEIGHT - 130) {
                this.state = 'RETREATING';
                screenShake = 30;
                removeSoldiers(10);
                spawnFloatingText(this.x, this.y, "CRUSH!", "#ef4444");
                spawnParticles(this.x, this.y, 20, '#ef4444');
            }
        }
        else if (this.state === 'RETREATING') {
            this.y -= 2;
            if (this.y <= this.targetY) {
                this.y = this.targetY;
                this.state = 'FIGHTING';
                this.chargeTimer = 0;
            }
        }
    }
    draw() {
        const p = project(this.x, this.y);

        const w = this.width * p.scale;
        const h = this.height * p.scale;

        if (IMAGES.boss.complete && IMAGES.boss.naturalWidth !== 0) {
            const frame = Math.floor(Date.now() / 150) % 6;
            const srcSize = 192;
            ctx.drawImage(IMAGES.boss, frame * srcSize, 0, srcSize, srcSize, p.x - w / 2, p.y - h / 2, w, h);
        } else {
            ctx.fillStyle = '#7f1d1d';
            ctx.fillRect(p.x - w / 2, p.y - h / 2, w, h);
        }

        if (p.scale > 0.2) {
            const hpPct = Math.max(0, this.hp / this.maxHp);
            const barW = 100 * p.scale;
            const barH = 10 * p.scale;
            ctx.fillStyle = 'black'; ctx.fillRect(p.x - barW / 2, p.y - h / 2 - 20 * p.scale, barW, barH);
            ctx.fillStyle = '#ef4444'; ctx.fillRect(p.x - barW / 2, p.y - h / 2 - 20 * p.scale, barW * hpPct, barH);
        }
    }
}

function initGame() {
    score = 0;
    level = 1;
    levelProgress = 0;
    soldiers = [];
    projectiles = [];
    gates = [];
    enemies = [];
    obstacles = [];
    particles = [];
    floatingTexts = [];
    decors = [];
    activeBoss = null;
    playerX = GAME_WIDTH / 2;
    activeBoss = null;
    textureOffset = 0;

    // Initial World Texture
    if (!WORLD_TEXTURE && texturesLoaded >= 2) createWorldTexture();

    for (let i = 0; i < 10; i++) spawnDecor(true);

    addSoldiers(1);
    updateUI();
    updateBestScoreUI();
}

function updateUI() {
    soldierCountEl.textContent = soldiers.length;
    scoreEl.textContent = `LVL ${level} | ${Math.floor(score)}`;
    bestScoreEl.textContent = Math.floor(bestScore);
    soldierCountEl.style.color = soldiers.length >= MAX_SOLDIERS ? '#ef4444' : '#fff';
}

function updateBestScoreUI() {
    startBestScoreEl.textContent = Math.floor(bestScore);
    goBestScoreEl.textContent = Math.floor(bestScore);
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Logical clear

    if (gameState === 'PLAYING') {
        globalFrameTimer += deltaTime;
        const globalFrame = Math.floor(globalFrameTimer / 100);

        update(deltaTime, globalFrame);
        updateEffects(deltaTime);
        drawEffects();
        draw(globalFrame);
    } else {
        draw(0);
    }

    if (screenShake > 0) {
        ctx.save();
        const dx = (Math.random() - 0.5) * screenShake;
        const dy = (Math.random() - 0.5) * screenShake;
        ctx.translate(dx, dy);
        screenShake *= 0.9;
        if (screenShake < 0.5) screenShake = 0;
    }
    if (screenShake > 0.5) ctx.restore();

    requestAnimationFrame(gameLoop);
}

function update(dt, globalFrame) {
    const dx = (moveTargetX - playerX);
    playerX += dx * 0.1;
    playerX = Math.max(40, Math.min(GAME_WIDTH - 40, playerX));

    lastShotTime += dt;
    if (lastShotTime > SHOOT_INTERVAL) {
        shoot();
        lastShotTime = 0;
    }

    const clean = (arr) => { for (let i = arr.length - 1; i >= 0; i--) if (arr[i].y > GAME_HEIGHT + 100) arr.splice(i, 1); }
    clean(gates);
    clean(enemies);
    clean(obstacles);
    clean(decors);

    if (Math.random() < 0.02) spawnDecor();

    textureOffset -= 2;

    if (!activeBoss) {
        spawnTimer += dt;
        levelProgress += dt * 0.02;
        score += dt * 0.01;

        if (levelProgress > 2000 + (level * 500)) {
            spawnBoss();
        } else if (spawnTimer > 1500 - (Math.min(1000, level * 50))) {
            const r = Math.random();
            if (r < 0.5) spawnGate();
            else if (r < 0.8) spawnEnemy();
            else spawnObstacle();
            spawnTimer = 0;
        }
    } else {
        activeBoss.update(dt);
    }

    checkCollisions();
    updateCombat();
    updateUI();
}

function spawnBoss() {
    activeBoss = new Boss();
    audio.bossSpawn();
    spawnFloatingText(GAME_WIDTH / 2, GAME_HEIGHT / 2, `BOSS FIGHT!`, "#ef4444");
    enemies = [];
    obstacles = [];
    gates = [];
}

function updateCombat() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].y -= 8;
        if (projectiles[i].y < HORIZON_Y) {
            projectiles.splice(i, 1);
            continue;
        }

        if (activeBoss && (activeBoss.state === 'FIGHTING' || activeBoss.state === 'CHARGING')) {
            if (Math.abs(projectiles[i].y - activeBoss.y) < activeBoss.height / 2 &&
                Math.abs(projectiles[i].x - activeBoss.x) < activeBoss.width / 2) {

                activeBoss.hp--;
                projectiles.splice(i, 1);
                spawnParticles(activeBoss.x, activeBoss.y, 1, '#fbbf24');

                if (activeBoss.hp <= 0) {
                    spawnParticles(activeBoss.x, activeBoss.y, 50, '#ef4444');
                    spawnFloatingText(activeBoss.x, activeBoss.y, "VICTORY!", "#22c55e");
                    score += 1000 * level;
                    level++;
                    levelProgress = 0;
                    activeBoss = null;
                    screenShake = 20;
                    audio.levelUp();
                }
                continue;
            }
        }

        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (Math.hypot(projectiles[i].x - enemy.x, projectiles[i].y - enemy.y) < enemy.radius + 5) {
                enemy.hp--;
                projectiles.splice(i, 1);
                spawnParticles(enemy.x, enemy.y, 3, '#fbbf24');
                audio.hit();
                if (enemy.hp <= 0) {
                    spawnParticles(enemy.x, enemy.y, 15, '#ef4444');
                    spawnFloatingText(enemy.x, enemy.y, '+10', '#fff');
                    enemies.splice(j, 1);
                    score += 10;
                    audio.kill();
                }
                break;
            }
        }
    }

    const move = (arr, speedMult = 1.0) => arr.forEach(e => {
        const s = getScale(e.y);
        if (e.isCloud) {
            e.x += 0.2;
            if (e.x > GAME_WIDTH + 100) e.x = -100;
        } else {
            e.y += SCROLL_SPEED * (0.2 + s * 1.5) * speedMult;
        }
    });
    move(enemies);
    move(obstacles);
    move(gates);
    move(decors);

    const checkHit = (entity, isObstacle) => {
        if (entity.y < GAME_HEIGHT - 120) return;

        const dist = Math.hypot(playerX - entity.x, (GAME_HEIGHT - 100) - entity.y);
        const hitDist = isObstacle ? entity.width / 2 + 10 : 30;

        if (dist < hitDist) {
            if (soldiers.length > 0) {
                soldiers.pop();
                if (!isObstacle) enemies = enemies.filter(e => e !== entity);
                else obstacles = obstacles.filter(o => o !== entity);

                screenShake = 10;
                spawnParticles(playerX, GAME_HEIGHT - 100, 10, '#3b82f6');
                audio.hit();
                updateUI();
                updateFormation();
                if (soldiers.length === 0) gameOver();
            }
        }
    }
    enemies.forEach(e => checkHit(e, false));
    obstacles.forEach(o => checkHit(o, true));
}

function checkCollisions() {
    const playerY = GAME_HEIGHT - 100;
    for (let i = gates.length - 1; i >= 0; i--) {
        const g = gates[i];
        if (g.y > playerY - 30 && g.y < playerY + 30) {
            if (playerX > g.x - g.width / 2 && playerX < g.x + g.width / 2) {
                applyGateEffect(g);
                gates.splice(i, 1);
            }
        }
    }
}

function applyGateEffect(gate) {
    let count = soldiers.length;
    let newCount = count;
    switch (gate.type) {
        case '+': newCount += gate.value; break;
        case '-': newCount -= gate.value; break;
        case 'x': newCount *= gate.value; break;
        case '/': newCount = Math.floor(newCount / gate.value); break;
    }
    newCount = Math.floor(newCount);
    if (newCount > MAX_SOLDIERS) newCount = MAX_SOLDIERS;
    newCount >= count ? audio.gatePositive() : audio.gateNegative();
    if (newCount <= 0) {
        soldiers = [];
        gameOver();
    } else {
        newCount > count ? addSoldiers(newCount - count) : removeSoldiers(count - newCount);
    }
}

function removeSoldiers(amount) {
    for (let i = 0; i < amount; i++) if (soldiers.length > 0) soldiers.pop();
    updateFormation();
    if (soldiers.length === 0) gameOver();
    updateUI();
}

function gameOver() {
    gameState = 'GAMEOVER';
    audio.gameOver();
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('warRunBestScore', bestScore);
        updateBestScoreUI();
    }
    finalScoreEl.textContent = "LVL " + level + " - " + Math.floor(score);
    gameOverScreen.classList.remove('hidden');
}

function shoot() {
    const shooterCount = Math.min(soldiers.length, 5);
    for (let i = 0; i < shooterCount; i++) {
        const spread = (i - (shooterCount - 1) / 2) * 10;
        projectiles.push({ x: playerX + spread, y: GAME_HEIGHT - 110 });
    }
    audio.shoot();
}

function spawnGate() {
    const pair = Math.random() > 0.4;
    const spawnY = HORIZON_Y + 10;
    const w = (GAME_WIDTH - 50) / 2;

    if (pair) {
        createGate(GAME_WIDTH / 2 - w / 2 - 10, spawnY, w);
        createGate(GAME_WIDTH / 2 + w / 2 + 10, spawnY, w);
    } else {
        createGate(Math.random() * (GAME_WIDTH - 100) + 50, spawnY, 120);
    }
}

function createGate(x, y, width) {
    const roll = Math.random();
    let type = '+'; let value = 1; let isPositive = false;
    if (roll > 0.6) {
        isPositive = true;
        if (Math.random() > 0.8) { type = 'x'; value = 2; }
        else { type = '+'; value = 5 + Math.floor(Math.random() * 15 * level); }
    } else {
        isPositive = false;
        if (Math.random() > 0.7) { type = '/'; value = 2; }
        else { type = '-'; value = 10 + Math.floor(Math.random() * 20); }
    }
    gates.push({ x, y, type, value, width, height: 60, color: isPositive ? '#3b82f6' : '#ef4444' });
}

function spawnEnemy() {
    enemies.push({
        x: Math.random() * (GAME_WIDTH - 60) + 30,
        y: HORIZON_Y,
        radius: 20,
        hp: 10 + (level * 5),
        frameOffset: Math.floor(Math.random() * 6)
    });
}

function spawnObstacle() {
    obstacles.push({
        x: Math.random() * (GAME_WIDTH - 80) + 40,
        y: HORIZON_Y,
        width: 50,
        height: 50,
        color: '#64748b'
    });
}

function spawnDecor(initial = false) {
    const isCloud = Math.random() > 0.7;

    if (isCloud) {
        // SKY AREA only
        const y = initial ? Math.random() * HORIZON_Y : -50;
        decors.push({
            x: Math.random() * GAME_WIDTH,
            y: y,
            isCloud: true,
            width: 80, height: 40
        });
    } else {
        // GROUND AREA (Towers)
        const spawnY = HORIZON_Y + 10;
        const isLeft = Math.random() > 0.5;
        const x = isLeft ? -150 : GAME_WIDTH + 150;

        decors.push({
            x: x,
            y: spawnY,
            isCloud: false,
            width: 64, height: 128
        });
    }
}

function updateFormation() {
    let count = 0;
    let row = 0;
    while (count < soldiers.length) {
        const colsInRow = row + 1;
        const rowWidth = (colsInRow - 1) * 12;
        const startX = -rowWidth / 2;
        for (let c = 0; c < colsInRow; c++) {
            if (count >= soldiers.length) break;
            soldiers[count].offsetX = startX + c * 12;
            soldiers[count].offsetY = row * 12;
            count++;
        }
        row++;
    }
}

function addSoldiers(count) {
    if (soldiers.length >= MAX_SOLDIERS) return;
    const available = MAX_SOLDIERS - soldiers.length;
    const toAdd = Math.min(count, available);
    for (let i = 0; i < toAdd; i++) soldiers.push(new Soldier(0, 0));
    updateFormation();
    updateUI();
}

function spawnParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10,
            life: 1.0, color: color
        });
    }
}
function spawnFloatingText(x, y, text, color) {
    floatingTexts.push({ x: x, y: y, text: text, color: color, life: 1.0, dy: -2 });
}
function updateEffects(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.life -= 0.05;
        if (p.life <= 0) particles.splice(i, 1);
    }
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const t = floatingTexts[i];
        t.y += t.dy; t.life -= 0.02;
        if (t.life <= 0) floatingTexts.splice(i, 1);
    }
}
function drawEffects() {
    particles.forEach(pt => {
        const p = project(pt.x, pt.y);
        ctx.fillStyle = pt.color; ctx.globalAlpha = pt.life;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    ctx.font = 'bold 20px Outfit'; ctx.textAlign = 'center';
    floatingTexts.forEach(t => {
        const p = project(t.x, t.y);
        ctx.fillStyle = t.color; ctx.globalAlpha = t.life;
        ctx.fillText(t.text, p.x, p.y); ctx.globalAlpha = 1.0;
    });
}

// SCANLINE RENDERER FOR PSEUDO-3D LANDSCAPE
function drawLandscape() {
    if (!WORLD_TEXTURE) return;

    // Sky Background (Full Screen)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    skyGrad.addColorStop(0, '#0f172a');
    skyGrad.addColorStop(0.5, '#38bdf8');
    skyGrad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Landscape Scanline Loop
    for (let y = GAME_HEIGHT; y > HORIZON_Y; y -= 1) {
        const scale = getScale(y);
        const z = (GAME_HEIGHT - HORIZON_Y) / (y - HORIZON_Y);

        const sampleY = ((-z * 100) + textureOffset) % 64;
        const sY = sampleY < 0 ? 64 + sampleY : sampleY;

        const dw = 512 * scale * 1.5;
        const dx = GAME_WIDTH / 2 - dw / 2;

        // Draw 1px strip with 3px height (Heavy overlap seal)
        ctx.drawImage(
            WORLD_TEXTURE,
            0, sY, 512, 1,
            Math.floor(dx), y, dw, 3
        );
    }
}


function draw(globalFrame) {
    if (gameState === 'PLAYING' || gameState === 'GAMEOVER') {
        drawLandscape();

        // Decor
        decors.forEach(d => {
            if (d.isCloud) {
                ctx.globalAlpha = 0.8;
                ctx.drawImage(IMAGES.cloud, d.x, d.y, d.width, d.height);
                ctx.globalAlpha = 1.0;
            } else {
                const p = project(d.x, d.y);
                const w = d.width * p.scale;
                const h = d.height * p.scale;
                if (IMAGES.tower.complete && IMAGES.tower.naturalWidth !== 0) {
                    ctx.drawImage(IMAGES.tower, p.x - w / 2, p.y - h, w, h);
                }
            }
        });

        gates.forEach(g => {
            const p = project(g.x, g.y);
            const w = g.width * p.scale;
            const h = g.height * p.scale;

            ctx.fillStyle = g.color + '80';
            ctx.fillRect(p.x - w / 2, p.y - h / 2, w, h);
            ctx.strokeStyle = g.color; ctx.lineWidth = 2;
            ctx.strokeRect(p.x - w / 2, p.y - h / 2, w, h);

            const fontSize = Math.max(0, 30 * p.scale);
            if (fontSize > 1) {
                ctx.fillStyle = 'white'; ctx.font = `700 ${fontSize}px Outfit`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(`${g.type}${g.value}`, p.x, p.y);
            }
        });

        enemies.forEach(e => {
            const p = project(e.x, e.y);
            const size = 60 * p.scale;

            if (IMAGES.enemy.complete && IMAGES.enemy.naturalWidth !== 0) {
                const frame = (globalFrame + e.frameOffset) % 6;
                const srcSize = 192;
                ctx.drawImage(IMAGES.enemy, frame * srcSize, 0, srcSize, srcSize, p.x - size / 2, p.y - size / 2, size, size);
            } else {
                ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(p.x, p.y, e.radius * p.scale, 0, Math.PI * 2); ctx.fill();
            }
        });

        obstacles.forEach(o => {
            const p = project(o.x, o.y);
            const w = o.width * p.scale;
            const h = o.height * p.scale;
            if (IMAGES.obstacle.complete && IMAGES.obstacle.naturalWidth !== 0) {
                ctx.drawImage(IMAGES.obstacle, p.x - w / 2, p.y - h / 2, w, h);
            } else {
                ctx.fillStyle = o.color; ctx.fillRect(p.x - w / 2, p.y - h / 2, w, h);
            }
        });

        if (activeBoss) activeBoss.draw();

        for (let i = soldiers.length - 1; i >= 0; i--) {
            soldiers[i].draw(playerX, GAME_HEIGHT - 100, globalFrame);
        }

        ctx.fillStyle = '#fbbf24';
        projectiles.forEach(pr => {
            const p = project(pr.x, pr.y);
            ctx.beginPath(); ctx.arc(p.x, p.y, 4 * Math.max(0.1, p.scale), 0, Math.PI * 2); ctx.fill();
        });
    } else {
        // Start Screen Background
        drawLandscape();
    }
}

startBtn.addEventListener('click', () => {
    audio.init();
    if (audio.ctx) audio.ctx.resume();
    gameState = 'PLAYING'; startScreen.classList.add('hidden'); initGame();
});
retryBtn.addEventListener('click', () => {
    audio.init();
    if (audio.ctx) audio.ctx.resume();
    gameState = 'PLAYING'; gameOverScreen.classList.add('hidden'); initGame();
});
updateBestScoreUI();
requestAnimationFrame(gameLoop);
