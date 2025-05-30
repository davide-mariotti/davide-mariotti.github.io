// Import questions and dares
import { truthQuestions } from './questions.js';
import { dareChallenges } from './dares.js';

// DOM Elements
const card = document.getElementById('card');
const question = document.getElementById('question');
const truthBtn = document.getElementById('truthBtn');
const dareBtn = document.getElementById('dareBtn');
const resetBtn = document.getElementById('resetBtn');
const truthCount = document.getElementById('truthCount');
const dareCount = document.getElementById('dareCount');
const truthTotal = document.getElementById('truthTotal');
const dareTotal = document.getElementById('dareTotal');

// Initialize counters
truthTotal.textContent = truthQuestions.length;
dareTotal.textContent = dareChallenges.length;

// Initialize used questions and dares from sessionStorage or create new Sets
let usedQuestions = new Set(JSON.parse(sessionStorage.getItem('usedQuestions') || '[]'));
let usedDares = new Set(JSON.parse(sessionStorage.getItem('usedDares') || '[]'));

// Update counters and button states
function updateUI() {
    truthCount.textContent = usedQuestions.size;
    dareCount.textContent = usedDares.size;
    
    // Disable buttons if all questions/dares are used
    truthBtn.disabled = usedQuestions.size >= truthQuestions.length;
    dareBtn.disabled = usedDares.size >= dareChallenges.length;
    
    // Update button styles
    if (truthBtn.disabled) {
        truthBtn.classList.add('disabled');
    } else {
        truthBtn.classList.remove('disabled');
    }
    
    if (dareBtn.disabled) {
        dareBtn.classList.add('disabled');
    } else {
        dareBtn.classList.remove('disabled');
    }
}

// Initialize UI on load
updateUI();

// Animation function
function animateCard() {
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 100);
}

// Save used questions/dares to sessionStorage
function saveToSessionStorage() {
    sessionStorage.setItem('usedQuestions', JSON.stringify([...usedQuestions]));
    sessionStorage.setItem('usedDares', JSON.stringify([...usedDares]));
    updateUI();
}

// Get random item from array
function getRandomItem(array, usedSet) {
    const availableItems = array.filter((_, index) => !usedSet.has(index));
    
    if (availableItems.length === 0) {
        return null; // No more items available
    }
    
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const originalIndex = array.indexOf(availableItems[randomIndex]);
    usedSet.add(originalIndex);
    saveToSessionStorage();
    return availableItems[randomIndex];
}

// Show truth question
function showTruth() {
    if (usedQuestions.size >= truthQuestions.length) {
        question.textContent = 'Hai già usato tutte le domande di verità!';
        return;
    }
    
    animateCard();
    const randomQuestion = getRandomItem(truthQuestions, usedQuestions);
    if (randomQuestion) {
        question.textContent = randomQuestion;
    }
}

// Show dare challenge
function showDare() {
    if (usedDares.size >= dareChallenges.length) {
        question.textContent = 'Hai già usato tutti gli obblighi!';
        return;
    }
    
    animateCard();
    const randomDare = getRandomItem(dareChallenges, usedDares);
    if (randomDare) {
        question.textContent = randomDare;
    }
}

// Reset used questions and dares
function resetGame() {
    if (confirm('Sei sicuro di voler resettare tutte le domande? Questo azzererà il contatore e permetterà di rivedere tutte le domande.')) {
        usedQuestions.clear();
        usedDares.clear();
        saveToSessionStorage();
        question.textContent = 'Domande resettate! Scegli tra Verità o Obbligo!';
        animateCard();
    }
}

// Event Listeners
truthBtn.addEventListener('click', showTruth);
dareBtn.addEventListener('click', showDare);
resetBtn.addEventListener('click', resetGame);

// Initial message
question.textContent = 'Scegli tra Verità o Obbligo!';
