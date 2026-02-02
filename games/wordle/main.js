import { loginWithGoogle, logoutUser, onAuthChange, saveGameScore, getLeaderboard, getUserStats, saveUserStats, updateUserProfile } from './firebase.js?v=2';

document.addEventListener('DOMContentLoaded', () => {
    // Game Elements
    const board = document.getElementById('board');
    const keyboardContainer = document.getElementById('keyboard-container');
    const messageContainer = document.getElementById('message-container');

    // Buttons
    const helpBtn = document.getElementById('help-btn');
    const statsBtn = document.getElementById('stats-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
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
    const closeBtns = document.querySelectorAll('.close-btn');

    // Profile Modal Elements
    const pModalAvatar = document.getElementById('profile-modal-avatar');
    const pModalEmail = document.getElementById('profile-modal-email');
    const pEditName = document.getElementById('edit-display-name');
    const pEditPhoto = document.getElementById('edit-photo-url');

    const pTotalGames = document.getElementById('profile-total-games');
    const pTotalWins = document.getElementById('profile-total-wins');

    // Game State
    let gameMode = 'practice'; // 'practice' or 'daily'
    let dailyPlayed = false;

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
        guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 }
    };

    // Initialize
    loadStats();
    setupAuthListeners();
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
        createBoard();
        setupKeyboard();
        setupInput();
    }

    function resetGame() {
        currentGuess = "";
        guesses = [];
        isGameOver = false;
        isAnimating = false;

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

        setTimeout(async () => {
            guesses.push(currentGuess);

            if (currentGuess === targetWord) {
                showMessage("Grande!", 2000);
                updateStats(true, guesses.length);

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
                showMessage(`La parola era: ${targetWord.toUpperCase()}`, -1);
                updateStats(false, 0);

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
        } else {
            stats.currentStreak = 0;
            stats.guesses.fail++;
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
        renderGuessDistribution();

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
    });
});

