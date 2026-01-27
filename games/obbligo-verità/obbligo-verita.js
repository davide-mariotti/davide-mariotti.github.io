/**
 * Obbligo o Verità - Logic
 * Modernized for Digital Forest Theme
 */

import { truthQuestions } from './questions.js';
import { dareChallenges } from './dares.js';

// DOM Elements
const card = document.getElementById('card');
const questionContainer = document.getElementById('question');
const truthBtn = document.getElementById('truthBtn');
const dareBtn = document.getElementById('dareBtn');
const resetBtn = document.getElementById('resetBtn');
const truthCount = document.getElementById('truthCount');
const dareCount = document.getElementById('dareCount');
const truthTotal = document.getElementById('truthTotal');
const dareTotal = document.getElementById('dareTotal');

// State
let usedQuestions = new Set(JSON.parse(sessionStorage.getItem('obbligo_usedQuestions') || '[]'));
let usedDares = new Set(JSON.parse(sessionStorage.getItem('obbligo_usedDares') || '[]'));

// Init
function init() {
    truthTotal.textContent = truthQuestions.length;
    dareTotal.textContent = dareChallenges.length;
    updateUI();
}

function updateUI() {
    truthCount.textContent = usedQuestions.size;
    dareCount.textContent = usedDares.size;

    truthBtn.disabled = usedQuestions.size >= truthQuestions.length;
    dareBtn.disabled = usedDares.size >= dareChallenges.length;
}

function animate() {
    card.classList.add('fade-in');
    setTimeout(() => card.classList.remove('fade-in'), 500);
}

function save() {
    sessionStorage.setItem('obbligo_usedQuestions', JSON.stringify([...usedQuestions]));
    sessionStorage.setItem('obbligo_usedDares', JSON.stringify([...usedDares]));
    updateUI();
}

function getRandomItem(array, usedSet) {
    const available = array.filter((_, idx) => !usedSet.has(idx));
    if (available.length === 0) return null;

    const randomItem = available[Math.floor(Math.random() * available.length)];
    const originalIndex = array.indexOf(randomItem);
    usedSet.add(originalIndex);
    save();
    return randomItem;
}

function showTruth() {
    const q = getRandomItem(truthQuestions, usedQuestions);
    if (q) {
        questionContainer.textContent = q;
        animate();
    }
}

function showDare() {
    const d = getRandomItem(dareChallenges, usedDares);
    if (d) {
        questionContainer.textContent = d;
        animate();
    }
}

function reset() {
    if (confirm('Resettare tutte le domande?')) {
        usedQuestions.clear();
        usedDares.clear();
        save();
        questionContainer.textContent = 'Destino resettato. Scegli di nuovo!';
        animate();
    }
}

// Event Listeners
truthBtn.addEventListener('click', showTruth);
dareBtn.addEventListener('click', showDare);
resetBtn.addEventListener('click', reset);

init();
