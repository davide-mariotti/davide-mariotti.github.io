// Array to store all questions
let questions = [];
let usedQuestions = new Set();
let isButtonCooldown = false;
const COOLDOWN_TIME = 5000; // 5 seconds in milliseconds
let isFirstLoad = true;
let questionCount = 0;
let gameStartTime = null;
let timerInterval = null;
let currentCategory = 'tutte';

// Function to reset the game
function resetGame() {
    if (confirm('Sei sicuro di voler resettare il gioco? Tutti i progressi verranno persi.')) {
        // Reset all game variables
        usedQuestions.clear();
        isButtonCooldown = false;
        isFirstLoad = true;
        questionCount = 0;
        gameStartTime = null;
        
        // Clear intervals
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        // Reset UI elements
        document.getElementById('questionCount').textContent = '0';
        document.getElementById('gameTimer').textContent = '00:00';
        document.getElementById('question').textContent = '';
        document.getElementById('nextQuestion').textContent = 'NEXT';
        document.getElementById('nextQuestion').disabled = false;
        
        // Reset category buttons
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.remove('active');
            btn.style.backgroundColor = '#cccccc';
        });
        
        // Set default category
        currentCategory = 'tutte';
        const defaultCategoryBtn = document.querySelector('.category-button');
        if (defaultCategoryBtn) {
            defaultCategoryBtn.classList.add('active');
            defaultCategoryBtn.style.backgroundColor = categories.tutte.color;
        }
    }
}

// Function to create category buttons
function createCategoryButtons() {
    const select = document.getElementById('categorySelect');
    
    Object.entries(categories).forEach(([key, category]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = category.name;
        select.appendChild(option);
    });
    
    select.addEventListener('change', () => {
        currentCategory = select.value;
        usedQuestions.clear();
    });
}

// Function to update timer display
function updateTimer() {
    if (!gameStartTime) return;
    
    const now = new Date();
    const diff = Math.floor((now - gameStartTime) / 1000);
    const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
    const seconds = (diff % 60).toString().padStart(2, '0');
    document.getElementById('gameTimer').textContent = `${minutes}:${seconds}`;
}

// Function to start game timer
function startGameTimer() {
    if (!gameStartTime) {
        gameStartTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// Function to update question count
function updateQuestionCount() {
    questionCount++;
    document.getElementById('questionCount').textContent = questionCount;
}

// Function to load questions from the text file
async function loadQuestions() {
    try {
        const response = await fetch('non-ho-mai-domande.txt');
        const text = await response.text();
        questions = text.split('\n').filter(question => question.trim() !== '');
    } catch (error) {
        console.error('Error loading questions:', error);
        questions = ['Errore nel caricamento delle domande'];
    }
}

// Function to get a random unused question
function getRandomQuestion() {
    // Filtra le domande per categoria
    let filteredQuestions;
    if (currentCategory === 'tutte') {
        filteredQuestions = questions;
    } else {
        const tag = `[${currentCategory}]`;
        filteredQuestions = questions.filter(q => q.startsWith(tag));
    }

    // Filtra quelle non ancora usate
    let availableQuestions = filteredQuestions.filter((q, idx) => !usedQuestions.has(q));

    // Se tutte usate, resetta
    if (availableQuestions.length === 0) {
        usedQuestions.clear();
        availableQuestions = filteredQuestions;
    }

    // Se ancora nessuna domanda disponibile (es. nessuna domanda per categoria), mostra errore
    if (availableQuestions.length === 0) {
        return 'Nessuna domanda disponibile per questa categoria.';
    }

    // Scegli una domanda casuale
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];
    usedQuestions.add(question);
    return question.replace(/^\[[^\]]+\]\s*/, ''); // Rimuove il tag dalla domanda
}

// Function to play click sound
function playClickSound() {
    const audio = document.getElementById('clickSound');
    audio.currentTime = 0; // Reset the audio to start
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Audio play failed:', error);
            // Try to play again with user interaction
            document.addEventListener('click', function playOnClick() {
                audio.play();
                document.removeEventListener('click', playOnClick);
            }, { once: true });
        });
    }
}

// Function to display a new question
function displayNewQuestion() {
    if (isButtonCooldown) return;

    const questionElement = document.getElementById('question');
    const nextButton = document.getElementById('nextQuestion');
    const question = getRandomQuestion();
    
    // Play sound only if it's not the first load
    if (!isFirstLoad) {
        playClickSound();
    }
    isFirstLoad = false;
    
    // Start game timer on first question
    startGameTimer();
    
    // Update question count
    updateQuestionCount();
    
    // Update question
    questionElement.textContent = question;
    
    // Add animation class
    questionElement.classList.add('fade-in');
    setTimeout(() => {
        questionElement.classList.remove('fade-in');
    }, 500);

    // Start cooldown
    isButtonCooldown = true;
    nextButton.disabled = true;
    
    // Update button text to show countdown
    let timeLeft = COOLDOWN_TIME / 1000;
    const countdownInterval = setInterval(() => {
        timeLeft--;
        nextButton.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            nextButton.textContent = 'NEXT';
            nextButton.disabled = false;
            isButtonCooldown = false;
        }
    }, 1000);
}

// Initialize the game
async function initGame() {
    await loadQuestions();
    createCategoryButtons();
    
    const nextButton = document.getElementById('nextQuestion');
    nextButton.addEventListener('click', displayNewQuestion);
    
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', resetGame);
    
    // Clear the initial question text
    const questionElement = document.getElementById('question');
    questionElement.textContent = '';
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);
