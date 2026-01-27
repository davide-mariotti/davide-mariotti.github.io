/**
 * Non Ho Mai - Logic
 * Modernized for Digital Forest Theme
 */

let questions = [];
let usedQuestions = new Set(JSON.parse(sessionStorage.getItem('usedQuestions') || '[]'));
let questionCount = Number(sessionStorage.getItem('questionCount') || 0);
let gameStartTime = sessionStorage.getItem('gameStartTime') ? new Date(sessionStorage.getItem('gameStartTime')) : null;
let timerInterval = null;
let isFirstLoad = true;
let currentCategory = 'tutte';

const dom = {
    question: document.getElementById('question'),
    nextBtn: document.getElementById('nextQuestion'),
    resetBtn: document.getElementById('resetButton'),
    count: document.getElementById('questionCount'),
    timer: document.getElementById('gameTimer'),
    select: document.getElementById('categorySelect'),
    audio: document.getElementById('clickSound')
};

// State Persistence
const saveState = () => {
    sessionStorage.setItem('usedQuestions', JSON.stringify([...usedQuestions]));
    sessionStorage.setItem('questionCount', questionCount);
    if (gameStartTime) sessionStorage.setItem('gameStartTime', gameStartTime.toISOString());
};

// Reset Logic
function resetGame() {
    if (confirm('Sei sicuro di voler resettare il gioco?')) {
        usedQuestions.clear();
        questionCount = 0;
        gameStartTime = null;
        isFirstLoad = true;

        sessionStorage.clear();
        clearInterval(timerInterval);

        dom.count.textContent = '0';
        dom.timer.textContent = '00:00';
        dom.question.textContent = 'Gioco resettato. Premi NEXT!';
        dom.select.value = 'tutte';
        currentCategory = 'tutte';
    }
}

// Category Handling
function initCategories() {
    if (typeof categories === 'undefined') return;

    Object.entries(categories).forEach(([key, category]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = category.name;
        dom.select.appendChild(option);
    });

    dom.select.addEventListener('change', () => {
        currentCategory = dom.select.value;
        usedQuestions.clear();
        saveState();
    });
}

// Timer
function updateTimer() {
    if (!gameStartTime) return;
    const diff = Math.floor((new Date() - gameStartTime) / 1000);
    const min = Math.floor(diff / 60).toString().padStart(2, '0');
    const sec = (diff % 60).toString().padStart(2, '0');
    dom.timer.textContent = `${min}:${sec}`;
}

// Main Logic
async function loadQuestions() {
    try {
        const response = await fetch('non-ho-mai-domande.txt');
        const text = await response.text();
        questions = text.split('\n').filter(q => q.trim() !== '');
    } catch (e) {
        dom.question.textContent = 'Errore caricamento domande.';
    }
}

function displayNewQuestion() {
    if (!gameStartTime) {
        gameStartTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Filter logic
    let filter = currentCategory === 'tutte' ? questions : questions.filter(q => q.startsWith(`[${currentCategory}]`));
    let available = filter.filter(q => !usedQuestions.has(q));

    if (available.length === 0) {
        usedQuestions.clear();
        available = filter;
    }

    if (available.length === 0) {
        dom.question.textContent = 'Nessuna domanda in questa categoria.';
        return;
    }

    const q = available[Math.floor(Math.random() * available.length)];
    usedQuestions.add(q);
    questionCount++;

    // UI Update
    dom.count.textContent = questionCount;
    dom.question.textContent = q.replace(/^\[[^\]]+\]\s*/, '');

    // Animation
    dom.question.classList.add('fade-in');
    setTimeout(() => dom.question.classList.remove('fade-in'), 500);

    // Audio
    if (!isFirstLoad) dom.audio.play().catch(() => { });
    isFirstLoad = false;

    saveState();
}

// Bootstrap
async function init() {
    await loadQuestions();
    initCategories();

    dom.nextBtn.addEventListener('click', displayNewQuestion);
    dom.resetBtn.addEventListener('click', resetGame);

    // Restore session
    if (questionCount > 0) {
        dom.count.textContent = questionCount;
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }
}

init();
