// Array to store all questions
let questions = [];
let usedQuestions = new Set();
let isButtonCooldown = false;
const COOLDOWN_TIME = 5000; // 5 seconds in milliseconds
let isFirstLoad = true;

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
    if (usedQuestions.size >= questions.length) {
        usedQuestions.clear(); // Reset if all questions have been used
    }

    let availableQuestions = questions.filter((_, index) => !usedQuestions.has(index));
    let randomIndex = Math.floor(Math.random() * availableQuestions.length);
    let question = availableQuestions[randomIndex];
    
    // Find the original index of the selected question
    let originalIndex = questions.indexOf(question);
    usedQuestions.add(originalIndex);
    
    return question;
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
    
    const nextButton = document.getElementById('nextQuestion');
    nextButton.addEventListener('click', displayNewQuestion);
    
    // Clear the initial question text
    const questionElement = document.getElementById('question');
    questionElement.textContent = '';
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);
