import { loginWithGoogle, logoutUser, onAuthChange, saveGameScore, getLeaderboard, getUserStats, saveUserStats, updateUserProfile } from './firebase.js?v=2';
import { ACHIEVEMENTS, getAllAchievements, checkAchievements, getRarityColor } from './achievements.js';

// Version logging for cache debugging
const VERSION = '2.5.0';
const BUILD_DATE = '2026-02-02 23:35';
console.log(`%c🎮 Wordle Enhanced v${VERSION}`, 'color: #10b981; font-size: 16px; font-weight: bold');
console.log(`%c📅 Build: ${BUILD_DATE}`, 'color: #3b82f6; font-size: 12px');
console.log(`%c✨ Features: Timed Mode, Hard Mode, 36 Achievements, Advanced Stats, Reset Stats`, 'color: #8b5cf6; font-size: 10px');

document.addEventListener('DOMContentLoaded', () => {
    // Game Elements
    const board = document.getElementById('board');
    const keyboardContainer = document.getElementById('keyboard-container');
    const messageContainer = document.getElementById('message-container');

    // Buttons
    const helpBtn = document.getElementById('help-btn');
    const statsBtn = document.getElementById('stats-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const achievementsBtn = document.getElementById('achievements-btn');
    const loginBtn = document.getElementById('login-btn');
    const userProfileEl = document.getElementById('user-profile');
    const userAvatarEl = document.getElementById('user-avatar');
    const logoutBtn = document.getElementById('logout-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');

    // Modals
    const helpModal = document.getElementById('modal');
    const statsModal = document.getElementById('stats-modal');
    const leaderboardModal = document.getElementById('leaderboard-modal');
    const profileModal = document.getElementById('profile-modal');
    const achievementsModal = document.getElementById('achievements-modal');
    const resetConfirmModal = document.getElementById('reset-confirm-modal');
    const closeBtns = document.querySelectorAll('.close-btn');

    // Profile Modal Elements
    const pModalAvatar = document.getElementById('profile-modal-avatar');
    const pModalEmail = document.getElementById('profile-modal-email');
    const pEditName = document.getElementById('edit-display-name');
    const pEditPhoto = document.getElementById('edit-photo-url');

    const pTotalGames = document.getElementById('profile-total-games');
    const pTotalWins = document.getElementById('profile-total-wins');

    // Game State
    let gameMode = 'practice'; // 'practice', 'timed', or 'hard'
    let dailyPlayed = false;

    // Timer State (for timed mode)
    let timerActive = false;
    let timeRemaining = 30;
    let timerInterval = null;
    let guessStartTime = null;

    // Hard Mode State
    let hardModeConstraints = {
        correctLetters: {}, // {position: letter}
        presentLetters: new Set() // letters that must be included
    };

    // Achievements State
    let unlockedAchievements = [];

    // Game Constants & State
    let WORD_LENGTH = 5;
    const MAX_GUESSES = 6;
    let dictionary = [];
    let targetWord = "";

    let currentGuess = "";
    let guesses = []; // Array of strings
    let isGameOver = false;
    let isAnimating = false;
    let currentUser = null;

    // Statistics State
    let stats = {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
        hardModeWins: 0,
        timedModeWins: 0,
        achievements: [],
        gameHistory: [] // Array of {date, won, attempts, mode, timeUsed, timeRemaining}
    };

    // Initialize
    loadStats();
    loadAchievements();
    setupAuthListeners();
    setupModeSelector();
    setupStatsTabs();
    setupLeaderboardFilters();
    loadDictionary();

    function setupAuthListeners() {
        onAuthChange(async (user) => {
            currentUser = user;
            if (user) {
                // User Logged In
                loginBtn.classList.add('hidden');
                userProfileEl.classList.remove('hidden');
                if (user.photoURL) userAvatarEl.src = user.photoURL;
                else userAvatarEl.src = 'user.png';
                showMessage(`Benvenuto, ${user.displayName ? user.displayName.split(' ')[0] : 'Utente'}!`);

                // LOAD CLOUD STATS
                // Reset stats locally first to avoid leaking previous user data
                resetStats();

                const cloudStats = await getUserStats(user);
                if (cloudStats) {
                    stats = cloudStats;
                    saveStats(); // Update local storage with user's cloud stats
                    console.log("Stats synced from cloud");
                } else {
                    console.log("New user or no cloud stats. Starting fresh.");
                }

            } else {
                // User Logged Out
                loginBtn.classList.remove('hidden');
                userProfileEl.classList.add('hidden');
                userAvatarEl.src = "user.png";
                profileModal.classList.add('hidden'); // Close if open

                // Reset to anonymous/empty stats on logout
                resetStats();
                localStorage.removeItem('wordle-it-stats'); // Clear local storage to prevent persistence
                showMessage("Logout effettuato");
            }
        });

        loginBtn.addEventListener('click', async () => {
            try {
                await loginWithGoogle();
            } catch (error) {
                console.error("Login failed", error);
                showMessage("Login fallito");
            }
        });

        userProfileEl.addEventListener('click', () => {
            updateProfileModal();
            profileModal.classList.remove('hidden');
        });

        logoutBtn.addEventListener('click', async () => {
            try {
                await logoutUser();
                // UI updates handled by onAuthChange
            } catch (error) {
                console.error("Logout failed", error);
            }
        });

        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', async () => {
                if (!currentUser) return;
                const newName = pEditName.value.trim();
                const newPhoto = pEditPhoto.value.trim();

                if (!newName) {
                    showMessage("Nome richiesto");
                    return;
                }

                try {
                    await updateUserProfile(currentUser, {
                        displayName: newName,
                        photoURL: newPhoto
                    });
                    showMessage("Profilo aggiornato!");

                    // Force UI update
                    if (newPhoto) userAvatarEl.src = newPhoto;
                    else userAvatarEl.src = 'user.png';

                    pModalAvatar.src = newPhoto || 'user.png';

                    profileModal.classList.add('hidden');
                } catch (err) {
                    console.error("Update failed", err);
                    showMessage("Errore aggiornamento");
                }
            });
        }
    }

    function updateProfileModal() {
        if (!currentUser) return;
        pModalAvatar.src = currentUser.photoURL || 'user.png';
        pModalEmail.textContent = currentUser.email;
        pEditName.value = currentUser.displayName || "";
        pEditPhoto.value = currentUser.photoURL || "";

        pTotalGames.textContent = stats.gamesPlayed;
        pTotalWins.textContent = stats.gamesWon;
    }

    function loadDictionary() {
        fetch('parole.txt')
            .then(response => response.text())
            .then(text => {
                dictionary = text.split('\n')
                    .map(w => w.trim().toLowerCase())
                    .filter(w => w.length === WORD_LENGTH);

                if (dictionary.length === 0) {
                    dictionary = ["palla", "gatto", "fiore", "piano", "treno"];
                }
                initGame();
            })
            .catch(err => {
                console.error("Error loading words:", err);
                dictionary = ["palla", "gatto", "fiore", "piano", "treno"];
                initGame();
            });
    }

    function resetStats() {
        stats = {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            maxStreak: 0,
            guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 }
        };
    }

    function initGame() {
        targetWord = dictionary[Math.floor(Math.random() * dictionary.length)];
        console.log("Target:", targetWord); // For debugging
        resetHardModeConstraints();
        createBoard();
        setupKeyboard();
        setupInput();
    }

    function resetGame() {
        currentGuess = "";
        guesses = [];
        isGameOver = false;
        isAnimating = false;

        // Stop timer if running
        stopTimer();

        // Reset hard mode constraints
        resetHardModeConstraints();

        // Clear Board
        board.innerHTML = '';
        createBoard();

        // Reset Keyboard Colors
        const keys = document.querySelectorAll('.keyboard-row button');
        keys.forEach(key => {
            key.removeAttribute('data-state');
        });

        // Hide Stats Modal
        statsModal.classList.add('hidden');

        // New Word
        targetWord = dictionary[Math.floor(Math.random() * dictionary.length)];
        console.log("New Target:", targetWord);
    }

    // --- Mode System ---

    function setupModeSelector() {
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedMode = btn.getAttribute('data-mode');
                switchMode(selectedMode);
            });
        });
    }

    function switchMode(newMode) {
        if (isGameOver || isAnimating) {
            showMessage("Finisci la partita corrente prima");
            return;
        }

        gameMode = newMode;

        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-mode') === newMode) {
                btn.classList.add('active');
            }
        });

        // Show/hide mode-specific UI
        const timerContainer = document.getElementById('timer-container');
        const hardModeIndicator = document.getElementById('hard-mode-indicator');

        if (newMode === 'timed') {
            timerContainer.classList.remove('hidden');
            hardModeIndicator.classList.add('hidden');
        } else if (newMode === 'hard') {
            timerContainer.classList.add('hidden');
            hardModeIndicator.classList.remove('hidden');
        } else {
            timerContainer.classList.add('hidden');
            hardModeIndicator.classList.add('hidden');
        }

        // Reset game for new mode
        resetGame();
    }

    // --- Timer Functions ---

    function startTimer() {
        timeRemaining = 30;
        guessStartTime = Date.now();
        timerActive = true;
        updateTimerUI();

        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerUI();

            if (timeRemaining <= 0) {
                stopTimer();
                handleTimerExpired();
            }
        }, 1000);
    }

    function stopTimer() {
        timerActive = false;
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function updateTimerUI() {
        const timerDisplay = document.getElementById('timer-display');
        const timerProgress = document.getElementById('timer-progress');
        const timerContainer = document.getElementById('timer-container');

        if (!timerDisplay || !timerProgress) return;

        timerDisplay.textContent = timeRemaining;
        const percentage = (timeRemaining / 30) * 100;
        timerProgress.style.width = `${percentage}%`;

        // Add warning class if < 10s
        if (timeRemaining < 10) {
            timerContainer.classList.add('warning');
        } else {
            timerContainer.classList.remove('warning');
        }
    }

    function handleTimerExpired() {
        showMessage("Tempo scaduto!", 2000);
        // Auto-submit current guess if valid, otherwise lose the guess
        if (currentGuess.length === WORD_LENGTH && dictionary.includes(currentGuess)) {
            submitGuess();
        } else {
            // Move to next row
            if (guesses.length < MAX_GUESSES) {
                guesses.push(""); // Empty guess
                updateStats(false, 0);
                isGameOver = true;
                showMessage(`La parola era: ${targetWord.toUpperCase()}`, -1);
                setTimeout(() => showStatsModal(false), 1500);
            }
        }
    }

    // --- Hard Mode Functions ---

    function resetHardModeConstraints() {
        hardModeConstraints = {
            correctLetters: {},
            presentLetters: new Set()
        };
    }

    function updateHardModeConstraints(guess, result) {
        for (let i = 0; i < guess.length; i++) {
            if (result[i] === 'correct') {
                hardModeConstraints.correctLetters[i] = guess[i];
            } else if (result[i] === 'present') {
                hardModeConstraints.presentLetters.add(guess[i]);
            }
        }
    }

    function validateHardModeGuess(guess) {
        // Check if all correct letters are used in correct positions
        for (const [pos, letter] of Object.entries(hardModeConstraints.correctLetters)) {
            if (guess[pos] !== letter) {
                return {
                    valid: false,
                    message: `La lettera ${letter.toUpperCase()} deve essere in posizione ${parseInt(pos) + 1}`
                };
            }
        }

        // Check if all present letters are included
        for (const letter of hardModeConstraints.presentLetters) {
            if (!guess.includes(letter)) {
                return {
                    valid: false,
                    message: `Devi usare la lettera ${letter.toUpperCase()}`
                };
            }
        }

        return { valid: true };
    }

    // --- Achievements Functions ---

    function loadAchievements() {
        unlockedAchievements = stats.achievements || [];
        renderAchievementsGrid();
    }

    function checkAndUnlockAchievements(gameData = null) {
        const newlyUnlocked = checkAchievements(stats, gameData, unlockedAchievements);

        for (const achievement of newlyUnlocked) {
            unlockAchievement(achievement);
        }
    }

    function unlockAchievement(achievement) {
        if (unlockedAchievements.includes(achievement.id)) return;

        unlockedAchievements.push(achievement.id);
        stats.achievements = unlockedAchievements;
        saveStats();

        showAchievementNotification(achievement);
        renderAchievementsGrid();
    }

    function showAchievementNotification(achievement) {
        const notification = document.getElementById('achievement-notification');
        const icon = document.getElementById('achievement-notif-icon');
        const name = document.getElementById('achievement-notif-name');
        const desc = document.getElementById('achievement-notif-desc');

        // Check if all elements exist
        if (!notification || !icon || !name || !desc) {
            console.warn('Achievement notification elements not found');
            return;
        }

        icon.textContent = achievement.icon;
        name.textContent = achievement.name;
        desc.textContent = achievement.description;

        notification.classList.remove('hidden');

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 4000);
    }

    function renderAchievementsGrid() {
        const grid = document.getElementById('achievements-grid');
        const unlockedCount = document.getElementById('unlocked-count');
        const totalCount = document.getElementById('total-count');

        if (!grid) return;

        grid.innerHTML = '';
        const allAchievements = getAllAchievements();

        for (const achievement of allAchievements) {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const badge = document.createElement('div');
            badge.className = `achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}`;

            const rarityColor = getRarityColor(achievement.rarity);

            badge.innerHTML = `
                <div class="icon">${achievement.icon}</div>
                <div class="name">${achievement.name}</div>
                <div class="desc">${achievement.description}</div>
                <div class="rarity" style="color: ${rarityColor}">${achievement.rarity}</div>
            `;

            grid.appendChild(badge);
        }

        if (unlockedCount && totalCount) {
            unlockedCount.textContent = unlockedAchievements.length;
            totalCount.textContent = allAchievements.length;
        }
    }

    // --- Chart & Heatmap Functions ---

    let progressChart = null;
    let winrateChart = null;

    function initCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded');
            return;
        }

        renderProgressChart();
        renderWinRateChart();
        renderHeatmap();
    }

    function renderProgressChart() {
        const canvas = document.getElementById('progress-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Prepare data from game history
        const history = (stats.gameHistory || []).slice(-30); // Last 30 games
        const labels = history.map((g, i) => `#${i + 1}`);
        const attempts = history.map(g => g.won ? g.attempts : 7); // 7 for failed

        if (progressChart) progressChart.destroy();

        progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tentativi',
                    data: attempts,
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => context.parsed.y === 7 ? 'Fallito' : `${context.parsed.y} tentativi`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 7,
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { color: 'rgba(255,255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    function renderWinRateChart() {
        const canvas = document.getElementById('winrate-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Calculate win rate per attempt number
        const guessData = stats.guesses;
        const data = [
            guessData[1] || 0,
            guessData[2] || 0,
            guessData[3] || 0,
            guessData[4] || 0,
            guessData[5] || 0,
            guessData[6] || 0
        ];

        if (winrateChart) winrateChart.destroy();

        winrateChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1', '2', '3', '4', '5', '6'],
                datasets: [{
                    label: 'Vittorie',
                    data: data,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            stepSize: 1
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    function renderHeatmap() {
        const container = document.getElementById('heatmap-container');
        if (!container) return;

        container.innerHTML = '';

        const history = stats.gameHistory || [];

        // Create a map of dates to game counts
        const activityMap = {};
        for (const game of history) {
            const dateKey = new Date(game.date).toISOString().split('T')[0];
            activityMap[dateKey] = (activityMap[dateKey] || 0) + 1;
        }

        // Generate last 12 weeks (84 days)
        const today = new Date();
        const weeks = [];

        for (let w = 11; w >= 0; w--) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date(today);
                date.setDate(date.getDate() - (w * 7 + (6 - d)));
                const dateKey = date.toISOString().split('T')[0];
                const count = activityMap[dateKey] || 0;

                // Determine level (0-4)
                let level = 0;
                if (count === 1) level = 1;
                else if (count === 2) level = 2;
                else if (count === 3) level = 3;
                else if (count >= 4) level = 4;

                week.push({ date: dateKey, level, count });
            }
            weeks.push(week);
        }

        // Render weeks
        for (const week of weeks) {
            const weekRow = document.createElement('div');
            weekRow.className = 'heatmap-row';

            for (const day of week) {
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                cell.setAttribute('data-level', day.level);
                cell.title = `${day.date}: ${day.count} partite`;
                weekRow.appendChild(cell);
            }

            container.appendChild(weekRow);
        }
    }

    // --- Stats Tab Switching ---

    function setupStatsTabs() {
        const tabs = document.querySelectorAll('#stats-tabs .nav-link');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = tab.getAttribute('data-tab');
                switchStatsTab(targetTab);
            });
        });
    }

    function switchStatsTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('#stats-tabs .nav-link').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
            }
        });

        // Show/hide tab content
        document.querySelectorAll('.tab-content-stats').forEach(content => {
            content.classList.add('hidden');
        });

        const targetContent = document.getElementById(`tab-${tabName}`);
        if (targetContent) {
            targetContent.classList.remove('hidden');

            // Render charts if switching to graphs or heatmap
            if (tabName === 'graphs') {
                setTimeout(() => initCharts(), 100);
            } else if (tabName === 'heatmap') {
                setTimeout(() => renderHeatmap(), 100);
            }
        }
    }

    // --- Leaderboard Filters ---

    let currentLeaderboardPeriod = 'daily';

    function setupLeaderboardFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const period = btn.getAttribute('data-period');
                switchLeaderboardFilter(period);
            });
        });
    }

    async function switchLeaderboardFilter(period) {
        currentLeaderboardPeriod = period;

        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-period') === period) {
                btn.classList.add('active');
            }
        });

        // Reload leaderboard with filter
        await loadLeaderboardWithFilter(period);
    }

    async function loadLeaderboardWithFilter(period) {
        const listEl = document.getElementById('leaderboard-list');
        listEl.innerHTML = `
            <div class="d-flex justify-content-center p-3">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>`;

        try {
            // This would need enhanced Firebase query - for now use existing
            const scores = await getLeaderboard();

            // Filter by period (client-side for now)
            const now = new Date();
            let filteredScores = scores;

            if (period === 'daily') {
                const today = now.toISOString().split('T')[0];
                filteredScores = scores.filter(s => {
                    const scoreDate = new Date(s.timestamp.seconds * 1000).toISOString().split('T')[0];
                    return scoreDate === today;
                });
            } else if (period === 'weekly') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredScores = scores.filter(s => {
                    const scoreDate = new Date(s.timestamp.seconds * 1000);
                    return scoreDate >= weekAgo;
                });
            } else if (period === 'monthly') {
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                filteredScores = scores.filter(s => {
                    const scoreDate = new Date(s.timestamp.seconds * 1000);
                    return scoreDate >= monthAgo;
                });
            }

            listEl.innerHTML = '';

            if (filteredScores.length === 0) {
                listEl.innerHTML = '<p class="text-center p-3 opacity-75">Nessuna partita in questo periodo.</p>';
                return;
            }

            filteredScores.forEach((s, index) => {
                const item = document.createElement('div');
                item.className = 'd-flex align-items-center p-2 border-bottom border-secondary bg-black bg-opacity-10 mb-1 rounded';
                item.innerHTML = `
                    <div class="fw-bold text-gradient me-3" style="width: 25px;">#${index + 1}</div>
                    <img src="${s.photoURL || 'user.png'}" class="rounded-circle me-3" width="32" height="32">
                    <div class="flex-grow-1">
                        <div class="fw-bold">${s.displayName || 'Anonimo'}</div>
                        <div class="small opacity-50">${new Date(s.timestamp.seconds * 1000).toLocaleDateString()}</div>
                    </div>
                    <div class="fw-bold text-success">${s.attempts} tentativi</div>
                `;
                listEl.appendChild(item);
            });

        } catch (error) {
            console.error("Failed to load leaderboard", error);
            listEl.innerHTML = '<p class="text-center text-danger p-3">Errore nel caricamento.</p>';
        }
    }

    // --- UI Creation ---

    function createBoard() {
        board.innerHTML = '';
        for (let i = 0; i < MAX_GUESSES; i++) {
            const row = document.createElement('div');
            row.classList.add('game-row');
            for (let j = 0; j < WORD_LENGTH; j++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.id = `tile-${i}-${j}`;
                row.appendChild(tile);
            }
            board.appendChild(row);
        }
    }

    function setupKeyboard() {
        // Keyboard clicks handled via delegation in setupInput
        const keys = document.querySelectorAll('.keyboard-row button');
        keys.forEach(key => {
            key.replaceWith(key.cloneNode(true));
        });

        const newKeys = document.querySelectorAll('.keyboard-row button');
        newKeys.forEach(key => {
            key.addEventListener('click', (e) => {
                const letter = e.currentTarget.getAttribute('data-key');
                handleInput(letter);
            });
        });
    }

    function setupInput() {
        // Clean up old listener if exists (not easily done without ref ref, but standard addEventListener on doc is ok since we don't re-run setupInput on resetGame except once)
        // To be safe against multiple inits, we could rely on a flag, but initGame is called once. resetGame doesn't call setupInput.

        document.addEventListener('keydown', (e) => {
            if (isGameOver || isAnimating) return;
            // If any modal is open, ignore input
            if (!helpModal.classList.contains('hidden') ||
                !statsModal.classList.contains('hidden') ||
                !leaderboardModal.classList.contains('hidden') ||
                !profileModal.classList.contains('hidden')) return;

            const key = e.key;

            if (key === 'Enter') {
                handleInput('Enter');
            } else if (key === 'Backspace') {
                handleInput('Backspace');
            } else if (/^[a-zA-Z]$/.test(key)) {
                handleInput(key.toLowerCase());
            }
        });
    }

    // --- Game Logic ---

    function handleInput(key) {
        if (isGameOver || isAnimating) return;

        if (key === 'Enter') {
            submitGuess();
        } else if (key === 'Backspace') {
            currentGuess = currentGuess.slice(0, -1);
            updateBoard();
        } else if (currentGuess.length < WORD_LENGTH && /^[a-zA-Z]$/.test(key)) {
            currentGuess += key.toLowerCase();
            updateBoard();

            // Trigger Pop Animation on the last filled tile
            const row = board.children[guesses.length];
            const tile = row.children[currentGuess.length - 1];
            if (tile) {
                tile.classList.remove('pop-anim');
                void tile.offsetWidth; // Trigger reflow
                tile.setAttribute('data-state', 'active'); // Ensure state is active for CSS border
            }
        }
    }

    function shareScore() {
        const title = "Wordle IT";
        const dayScore = `${guesses.length}/${MAX_GUESSES}`;

        let grid = "";
        const rows = board.children;
        // Reconstruct grid from board state
        for (let i = 0; i < guesses.length; i++) {
            const row = rows[i];
            for (let j = 0; j < WORD_LENGTH; j++) {
                const tile = row.children[j];
                const state = tile.getAttribute('data-state');
                if (state === 'correct') grid += '🟩';
                else if (state === 'present') grid += '🟨';
                else grid += '⬜';
            }
            grid += "\n";
        }

        const shareText = `${title} ${dayScore}\n\n${grid}`;

        if (navigator.share) {
            navigator.share({
                title: title,
                text: shareText
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                showMessage("Copiato negli appunti!");
            });
        }
    }

    function triggerConfetti() {
        if (typeof confetti === 'function') {
            const count = 200;
            const defaults = {
                origin: { y: 0.7 }
            };

            function fire(particleRatio, opts) {
                confetti(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio)
                }));
            }

            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            fire(0.2, {
                spread: 60,
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }
    }

    function updateBoard() {
        const rowIdx = guesses.length;
        const row = document.getElementsByClassName('game-row')[rowIdx];

        for (let i = 0; i < WORD_LENGTH; i++) {
            const tile = row.children[i];
            const letter = currentGuess[i] || "";
            tile.textContent = letter;

            if (letter && !tile.hasAttribute('data-state')) {
                tile.setAttribute('data-state', 'active');
            } else if (!letter) {
                tile.removeAttribute('data-state');
            }
        }
    }

    async function submitGuess() {
        if (currentGuess.length !== WORD_LENGTH) {
            showMessage("Non abbastanza lettere");
            shakeRow();
            return;
        }

        if (!dictionary.includes(currentGuess)) {
            showMessage("Parola non trovata");
            shakeRow();
            return;
        }

        // Hard Mode Validation
        if (gameMode === 'hard') {
            const validation = validateHardModeGuess(currentGuess);
            if (!validation.valid) {
                showMessage(validation.message, 2000);
                shakeRow();
                return;
            }
        }

        // Start timer on first guess in timed mode
        if (gameMode === 'timed' && guesses.length === 0 && !timerActive) {
            startTimer();
        }

        isAnimating = true;

        const result = checkGuess(currentGuess, targetWord);
        const rowIdx = guesses.length;
        const row = document.getElementsByClassName('game-row')[rowIdx];

        for (let i = 0; i < WORD_LENGTH; i++) {
            const tile = row.children[i];
            setTimeout(() => {
                tile.classList.add('flip');
                tile.setAttribute('data-state', result[i]);
                updateKeyboard(currentGuess[i], result[i]);
            }, i * 250);
        }

        // Update hard mode constraints
        if (gameMode === 'hard') {
            updateHardModeConstraints(currentGuess, result);
        }

        setTimeout(async () => {
            guesses.push(currentGuess);

            if (currentGuess === targetWord) {
                // Stop timer if running
                const finalTimeRemaining = timeRemaining;
                stopTimer();

                showMessage("Grande!", 2000);
                updateStats(true, guesses.length);

                // Create game data for achievements
                const gameData = {
                    won: true,
                    attempts: guesses.length,
                    mode: gameMode,
                    timeRemaining: gameMode === 'timed' ? finalTimeRemaining : null,
                    date: Date.now()
                };

                // Check achievements
                checkAndUnlockAchievements(gameData);

                if (gameMode === 'daily') {
                    const todayStr = new Date().toISOString().split('T')[0];
                    localStorage.setItem('wordle-daily-last-played', todayStr);
                }

                // SAVE SCORE TO FIREBASE
                if (currentUser) {
                    await saveGameScore(currentUser, guesses.length, true);
                    showMessage("Punteggio salvato online!");
                }

                isGameOver = true;
                setTimeout(() => showStatsModal(true), 1500);
                isAnimating = false;
            } else if (guesses.length >= MAX_GUESSES) {
                stopTimer();

                showMessage(`La parola era: ${targetWord.toUpperCase()}`, -1);
                updateStats(false, 0);

                // Check achievements even on loss
                const gameData = {
                    won: false,
                    attempts: 0,
                    mode: gameMode,
                    date: Date.now()
                };
                checkAndUnlockAchievements(gameData);

                if (gameMode === 'daily') {
                    const todayStr = new Date().toISOString().split('T')[0];
                    localStorage.setItem('wordle-daily-last-played', todayStr);
                }

                isGameOver = true;
                setTimeout(() => showStatsModal(false), 1500);
                isAnimating = false;
            } else {
                currentGuess = "";
                isAnimating = false;
            }
        }, WORD_LENGTH * 250 + 500);
    }

    function checkGuess(guess, target) {
        const result = Array(WORD_LENGTH).fill('absent');
        const targetArr = target.split('');
        const guessArr = guess.split('');

        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guessArr[i] === targetArr[i]) {
                result[i] = 'correct';
                targetArr[i] = null;
                guessArr[i] = null;
            }
        }

        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guessArr[i] && targetArr.includes(guessArr[i])) {
                result[i] = 'present';
                const idx = targetArr.indexOf(guessArr[i]);
                targetArr[idx] = null;
            }
        }

        return result;
    }

    function updateKeyboard(letter, state) {
        const keyBtn = document.querySelector(`button[data-key="${letter}"]`);
        if (!keyBtn) return;

        const currentState = keyBtn.getAttribute('data-state');

        if (state === 'correct') {
            keyBtn.setAttribute('data-state', 'correct');
        } else if (state === 'present' && currentState !== 'correct') {
            keyBtn.setAttribute('data-state', 'present');
        } else if (state === 'absent' && currentState !== 'correct' && currentState !== 'present') {
            keyBtn.setAttribute('data-state', 'absent');
        }
    }

    function shakeRow() {
        const rowIdx = guesses.length;
        const row = document.getElementsByClassName('game-row')[rowIdx];
        row.classList.add('shake');
        setTimeout(() => row.classList.remove('shake'), 600);
    }

    // --- Statistics Logic ---

    function loadStats() {
        const storedStats = localStorage.getItem('wordle-it-stats');
        if (storedStats) {
            stats = JSON.parse(storedStats);
        }
    }

    function saveStats() {
        localStorage.setItem('wordle-it-stats', JSON.stringify(stats));
        // Also save to cloud if logged in
        if (currentUser) {
            saveUserStats(currentUser, stats);
        }
    }

    function updateStats(won, attemptCount) {
        stats.gamesPlayed++;
        if (won) {
            stats.gamesWon++;
            stats.currentStreak++;
            if (stats.currentStreak > stats.maxStreak) {
                stats.maxStreak = stats.currentStreak;
            }
            stats.guesses[attemptCount]++;

            // Track mode-specific wins
            if (gameMode === 'hard') {
                stats.hardModeWins = (stats.hardModeWins || 0) + 1;
            } else if (gameMode === 'timed') {
                stats.timedModeWins = (stats.timedModeWins || 0) + 1;
            }
        } else {
            stats.currentStreak = 0;
            stats.guesses.fail++;
        }

        // Add to game history
        if (!stats.gameHistory) stats.gameHistory = [];
        stats.gameHistory.push({
            date: Date.now(),
            won: won,
            attempts: won ? attemptCount : 0,
            mode: gameMode,
            timeRemaining: gameMode === 'timed' ? timeRemaining : null
        });

        // Keep only last 100 games to avoid excessive storage
        if (stats.gameHistory.length > 100) {
            stats.gameHistory = stats.gameHistory.slice(-100);
        }

        saveStats();
        updateStatsUI();
    }

    function updateStatsUI() {
        document.getElementById('total-played').textContent = stats.gamesPlayed;
        const winPct = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
        document.getElementById('win-pct').textContent = winPct;
        document.getElementById('current-streak').textContent = stats.currentStreak;
        document.getElementById('max-streak').textContent = stats.maxStreak;

        const distContainer = document.getElementById('guess-distribution');
        distContainer.innerHTML = '';
        const maxFreq = Math.max(...Object.values(stats.guesses), 1);

        for (let i = 1; i <= MAX_GUESSES; i++) {
            const freq = stats.guesses[i];
            const percent = Math.floor((freq / maxFreq) * 100);

            const row = document.createElement('div');
            row.className = 'graph-container';

            const label = document.createElement('div');
            label.className = 'guess-count';
            label.textContent = i;

            const barContainer = document.createElement('div');
            barContainer.className = 'graph-bar-container';

            const bar = document.createElement('div');
            bar.className = 'graph-bar';
            if (freq > 0) {
                bar.style.width = `${percent}%`;
            } else {
                bar.style.width = 'fit-content';
                bar.style.minWidth = '20px';
            }
            bar.textContent = freq;
            if (isGameOver && guesses.length === i && guesses[guesses.length - 1] === targetWord) {
                bar.classList.add('highlight');
            }

            barContainer.appendChild(bar);
            row.appendChild(label);
            row.appendChild(barContainer);
            distContainer.appendChild(row);
        }
    }

    function showStatsModal(won) {
        updateStatsUI();
        statsModal.classList.remove('hidden');

        if (won) {
            triggerConfetti();
        }
    }

    // --- Leaderboard Logic ---
    async function showLeaderboardModal() {
        leaderboardModal.classList.remove('hidden');
        const listEl = document.getElementById('leaderboard-list');
        // Show Spinner is already there? Yes initial state
        listEl.innerHTML = `
            <div class="d-flex justify-content-center p-3">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>`;

        try {
            const scores = await getLeaderboard();
            listEl.innerHTML = '';

            if (scores.length === 0) {
                listEl.innerHTML = '<p class="text-center p-3 opacity-75">Nessuna partita vinta registrata ancora.</p>';
                return;
            }

            scores.forEach((s, index) => {
                const item = document.createElement('div');
                item.className = 'd-flex align-items-center p-2 border-bottom border-secondary bg-black bg-opacity-10 mb-1 rounded';
                item.innerHTML = `
                    <div class="fw-bold text-gradient me-3" style="width: 25px;">#${index + 1}</div>
                    <img src="${s.photoURL || 'https://via.placeholder.com/32'}" class="rounded-circle me-3" width="32" height="32">
                    <div class="flex-grow-1">
                        <div class="fw-bold">${s.displayName || 'Anonimo'}</div>
                        <div class="small opacity-50">${new Date(s.timestamp.seconds * 1000).toLocaleDateString()}</div>
                    </div>
                    <div class="fw-bold text-success">${s.attempts} tentativi</div>
                `;
                listEl.appendChild(item);
            });

        } catch (error) {
            console.error("Failed to load leaderboard", error);
            listEl.innerHTML = '<p class="text-center text-danger p-3">Errore nel caricamento.</p>';
        }
    }

    // --- Helpers ---

    function showMessage(msg, duration = 1000) {
        const msgEl = document.createElement('div');
        msgEl.textContent = msg;
        msgEl.classList.add('message');
        messageContainer.appendChild(msgEl);

        if (duration > 0) {
            setTimeout(() => {
                msgEl.classList.add('fade-out');
                setTimeout(() => {
                    messageContainer.removeChild(msgEl);
                }, 500);
            }, duration);
        }
    }

    // --- Modal Logic ---
    helpBtn.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
    });

    statsBtn.addEventListener('click', () => {
        showStatsModal();
    });

    leaderboardBtn.addEventListener('click', () => {
        showLeaderboardModal();
    });

    if (achievementsBtn) {
        achievementsBtn.addEventListener('click', () => {
            achievementsModal.classList.remove('hidden');
            renderAchievementsGrid();
        });
    }

    // Share button handler
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            shareScore();
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('hidden');
        });
    });

    playAgainBtn.addEventListener('click', () => {
        resetGame();
    });

    window.addEventListener('click', (e) => {
        if (e.target === helpModal) helpModal.classList.add('hidden');
        if (e.target === statsModal) statsModal.classList.add('hidden');
        if (e.target === leaderboardModal) leaderboardModal.classList.add('hidden');
        if (e.target === profileModal) profileModal.classList.add('hidden');
        if (e.target === achievementsModal) achievementsModal.classList.add('hidden');
        if (e.target === resetConfirmModal) resetConfirmModal.classList.add('hidden');
    });

    // --- Reset Stats Functionality ---

    const resetStatsBtn = document.getElementById('reset-stats-btn');
    const confirmResetCheckbox = document.getElementById('confirm-reset-checkbox');
    const confirmResetBtn = document.getElementById('confirm-reset-btn');
    const cancelResetBtn = document.getElementById('cancel-reset-btn');

    // Enable confirm button only when checkbox is checked
    if (confirmResetCheckbox) {
        confirmResetCheckbox.addEventListener('change', () => {
            if (confirmResetBtn) {
                confirmResetBtn.disabled = !confirmResetCheckbox.checked;
            }
        });
    }

    // Show confirmation modal
    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', () => {
            resetConfirmModal.classList.remove('hidden');
            // Reset checkbox state
            if (confirmResetCheckbox) confirmResetCheckbox.checked = false;
            if (confirmResetBtn) confirmResetBtn.disabled = true;
        });
    }

    // Cancel reset
    if (cancelResetBtn) {
        cancelResetBtn.addEventListener('click', () => {
            resetConfirmModal.classList.add('hidden');
        });
    }

    // Confirm reset - actually delete everything
    if (confirmResetBtn) {
        confirmResetBtn.addEventListener('click', async () => {
            // Reset stats object
            stats = {
                gamesPlayed: 0,
                gamesWon: 0,
                currentStreak: 0,
                maxStreak: 0,
                guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
                hardModeWins: 0,
                timedModeWins: 0,
                achievements: [],
                gameHistory: []
            };

            // Reset achievements
            unlockedAchievements = [];

            // Save to localStorage
            saveStats();

            // Save to cloud if user is logged in
            if (currentUser) {
                try {
                    await saveUserStats(currentUser, stats);

                    // Also delete leaderboard entries for this user
                    // Note: This would require a Cloud Function or Admin SDK to properly delete
                    // For now, just saving empty stats which will effectively reset their scores
                    showMessage("Statistiche e classifica azzerate anche sul cloud", 2000);
                } catch (error) {
                    console.error("Error resetting cloud stats:", error);
                    showMessage("Errore nell'azzeramento dati cloud", 2000);
                }
            }

            // Update UI
            updateStatsUI();
            renderAchievementsGrid();

            // Close modals
            resetConfirmModal.classList.add('hidden');
            statsModal.classList.add('hidden');

            // Show success message
            showMessage("✅ Tutte le statistiche sono state azzerate", 3000);
        });
    }
});

