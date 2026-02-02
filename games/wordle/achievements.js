// Achievements Configuration
export const ACHIEVEMENTS = {
    FIRST_WIN: {
        id: 'first_win',
        name: 'Prima Vittoria',
        description: 'Vinci la tua prima partita',
        icon: '🎉',
        rarity: 'common',
        check: (stats, gameData) => stats.gamesWon >= 1
    },
    PERFECT_GAME: {
        id: 'perfect',
        name: 'Perfetto!',
        description: 'Indovina al primo tentativo',
        icon: '💎',
        rarity: 'legendary',
        check: (stats, gameData) => gameData && gameData.won && gameData.attempts === 1
    },
    WEEK_STREAK: {
        id: 'streak_7',
        name: 'Una Settimana',
        description: 'Mantieni uno streak di 7 giorni',
        icon: '🔥',
        rarity: 'rare',
        check: (stats) => stats.currentStreak >= 7
    },
    MONTH_STREAK: {
        id: 'streak_30',
        name: 'Un Mese',
        description: 'Mantieni uno streak di 30 giorni',
        icon: '🏆',
        rarity: 'legendary',
        check: (stats) => stats.currentStreak >= 30
    },
    SPEED_DEMON: {
        id: 'speed',
        name: 'Velocissimo',
        description: 'Vinci in modalità timed con 20+ secondi rimasti',
        icon: '⚡',
        rarity: 'rare',
        check: (stats, gameData) => gameData && gameData.mode === 'timed' && gameData.won && gameData.timeRemaining >= 20
    },
    UNDER_PRESSURE: {
        id: 'clutch',
        name: 'Sangue Freddo',
        description: 'Vinci in modalità timed con meno di 5 secondi',
        icon: '🧊',
        rarity: 'epic',
        check: (stats, gameData) => gameData && gameData.mode === 'timed' && gameData.won && gameData.timeRemaining < 5 && gameData.timeRemaining >= 0
    },
    VETERAN: {
        id: 'veteran',
        name: 'Veterano',
        description: 'Gioca 100 partite',
        icon: '🎖️',
        rarity: 'rare',
        check: (stats) => stats.gamesPlayed >= 100
    },
    MASTER: {
        id: 'master',
        name: 'Maestro',
        description: 'Vinci 50 partite',
        icon: '👑',
        rarity: 'epic',
        check: (stats) => stats.gamesWon >= 50
    },
    HARD_MODE_WIN: {
        id: 'hard_win',
        name: 'Difficoltà Superata',
        description: 'Vinci una partita in modalità Hard',
        icon: '💪',
        rarity: 'rare',
        check: (stats, gameData) => gameData && gameData.mode === 'hard' && gameData.won
    },
    HARD_MODE_MASTER: {
        id: 'hard_master',
        name: 'Maestro Hard',
        description: 'Vinci 20 partite in modalità Hard',
        icon: '🔱',
        rarity: 'legendary',
        check: (stats) => (stats.hardModeWins || 0) >= 20
    },
    EFFICIENT: {
        id: 'efficient',
        name: 'Efficiente',
        description: 'Vinci con 3 tentativi o meno per 5 volte',
        icon: '🎯',
        rarity: 'epic',
        check: (stats) => {
            const quick = (stats.guesses[1] || 0) + (stats.guesses[2] || 0) + (stats.guesses[3] || 0);
            return quick >= 5;
        }
    },
    LUCKY: {
        id: 'lucky',
        name: 'Fortunato',
        description: 'Vinci al sesto tentativo',
        icon: '🍀',
        rarity: 'common',
        check: (stats, gameData) => gameData && gameData.won && gameData.attempts === 6
    },
    COMEBACK: {
        id: 'comeback',
        name: 'Ritorno',
        description: 'Vinci dopo aver perso una partita',
        icon: '↩️',
        rarity: 'common',
        check: (stats, gameData) => {
            // This will be checked with game history
            return gameData && gameData.isComeback;
        }
    },
    CONSISTENT: {
        id: 'consistent',
        name: 'Costante',
        description: 'Mantieni un 80%+ di vittorie con almeno 20 partite',
        icon: '📈',
        rarity: 'epic',
        check: (stats) => {
            if (stats.gamesPlayed < 20) return false;
            const winRate = (stats.gamesWon / stats.gamesPlayed) * 100;
            return winRate >= 80;
        }
    },
    NIGHT_OWL: {
        id: 'night_owl',
        name: 'Gufo Notturno',
        description: 'Vinci una partita dopo le 23:00',
        icon: '🦉',
        rarity: 'common',
        check: (stats, gameData) => {
            if (!gameData || !gameData.won || !gameData.date) return false;
            const hour = new Date(gameData.date).getHours();
            return hour >= 23 || hour < 6;
        }
    },
    EARLY_BIRD: {
        id: 'early_bird',
        name: 'Mattiniero',
        description: 'Vinci una partita prima delle 7:00',
        icon: '🌅',
        rarity: 'common',
        check: (stats, gameData) => {
            if (!gameData || !gameData.won || !gameData.date) return false;
            const hour = new Date(gameData.date).getHours();
            return hour >= 5 && hour < 7;
        }
    },
    QUICK_LEARNER: {
        id: 'quick_learner',
        name: 'Apprendimento Rapido',
        description: 'Vinci 3 partite consecutive',
        icon: '🧠',
        rarity: 'rare',
        check: (stats, gameData) => {
            if (!stats.gameHistory || stats.gameHistory.length < 3) return false;
            const lastThree = stats.gameHistory.slice(-3);
            return lastThree.every(g => g.won);
        }
    },
    NO_HINTS: {
        id: 'no_hints',
        name: 'Intuizione Pura',
        description: 'Vinci usando solo 10 lettere totali o meno',
        icon: '💡',
        rarity: 'epic',
        check: (stats, gameData) => {
            // This would need to track total unique letters used
            // For now, approximate with winning in 2 attempts
            return gameData && gameData.won && gameData.attempts <= 2;
        }
    },
    TIMED_MASTER: {
        id: 'timed_master',
        name: 'Maestro del Tempo',
        description: 'Vinci 10 partite in modalità Timed',
        icon: '⏰',
        rarity: 'rare',
        check: (stats) => (stats.timedModeWins || 0) >= 10
    },
    TRIPLE_THREAT: {
        id: 'triple_threat',
        name: 'Tripletta',
        description: 'Vinci almeno una partita in ogni modalità',
        icon: '⭐',
        rarity: 'rare',
        check: (stats) => {
            const practiceWins = stats.gamesWon - (stats.hardModeWins || 0) - (stats.timedModeWins || 0);
            return practiceWins > 0 && (stats.hardModeWins || 0) > 0 && (stats.timedModeWins || 0) > 0;
        }
    },
    UNSTOPPABLE: {
        id: 'unstoppable',
        name: 'Inarrestabile',
        description: 'Vinci 5 partite di fila senza perdere',
        icon: '🔥',
        rarity: 'epic',
        check: (stats, gameData) => {
            if (!stats.gameHistory || stats.gameHistory.length < 5) return false;
            const lastFive = stats.gameHistory.slice(-5);
            return lastFive.every(g => g.won);
        }
    },
    COLLECTOR: {
        id: 'collector',
        name: 'Collezionista',
        description: 'Sblocca 10 achievement',
        icon: '🎖️',
        rarity: 'epic',
        check: (stats) => (stats.achievements || []).length >= 10
    },
    DEDICATION: {
        id: 'dedication',
        name: 'Dedizione',
        description: 'Gioca per 7 giorni diversi',
        icon: '📅',
        rarity: 'rare',
        check: (stats) => {
            if (!stats.gameHistory || stats.gameHistory.length < 7) return false;
            const uniqueDays = new Set();
            stats.gameHistory.forEach(game => {
                const dateKey = new Date(game.date).toISOString().split('T')[0];
                uniqueDays.add(dateKey);
            });
            return uniqueDays.size >= 7;
        }
    },
    FLAWLESS_WEEK: {
        id: 'flawless_week',
        name: 'Settimana Perfetta',
        description: 'Vinci tutte le partite in 7 giorni consecutivi',
        icon: '💯',
        rarity: 'legendary',
        check: (stats) => {
            if (!stats.gameHistory || stats.gameHistory.length < 7) return false;

            // Check if there are games in last 7 days and all are wins
            const now = Date.now();
            const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
            const recentGames = stats.gameHistory.filter(g => g.date >= sevenDaysAgo);

            if (recentGames.length < 7) return false;

            // Check for games on each of the last 7 days
            const gameDays = new Set();
            recentGames.forEach(game => {
                const dateKey = new Date(game.date).toISOString().split('T')[0];
                gameDays.add(dateKey);
            });

            return gameDays.size >= 7 && recentGames.every(g => g.won);
        }
    },
    SPEEDRUNNER: {
        id: 'speedrunner',
        name: 'Speedrunner',
        description: 'Vinci in modalità Timed con 25+ secondi rimasti',
        icon: '⚡',
        rarity: 'rare',
        check: (stats, gameData) => {
            return gameData && gameData.mode === 'timed' && gameData.won && (gameData.timeRemaining >= 25);
        }
    },
    CLOSE_CALL: {
        id: 'close_call',
        name: 'Per un Soffio',
        description: 'Vinci in modalità Timed con meno di 3 secondi',
        icon: '😰',
        rarity: 'epic',
        check: (stats, gameData) => {
            return gameData && gameData.mode === 'timed' && gameData.won && gameData.timeRemaining < 3 && gameData.timeRemaining >= 0;
        }
    },
    COMEBACK_KID: {
        id: 'comeback_kid',
        name: 'Rimonta',
        description: 'Vinci dopo aver avuto una serie di 3+ sconfitte',
        icon: '💪',
        rarity: 'rare',
        check: (stats, gameData) => {
            if (!gameData || !gameData.won || !stats.gameHistory || stats.gameHistory.length < 4) return false;
            const lastFour = stats.gameHistory.slice(-4);
            return !lastFour[0].won && !lastFour[1].won && !lastFour[2].won && lastFour[3].won;
        }
    },
    OVERACHIEVER: {
        id: 'overachiever',
        name: 'Superstar',
        description: 'Sblocca 15 achievement',
        icon: '⭐',
        rarity: 'legendary',
        check: (stats) => (stats.achievements || []).length >= 15
    },
    WEEKEND_WARRIOR: {
        id: 'weekend_warrior',
        name: 'Guerriero del Weekend',
        description: 'Vinci una partita di sabato o domenica',
        icon: '🎮',
        rarity: 'common',
        check: (stats, gameData) => {
            if (!gameData || !gameData.won || !gameData.date) return false;
            const day = new Date(gameData.date).getDay();
            return day === 0 || day === 6; // Sunday or Saturday
        }
    },
    MIDWEEK_CHAMPION: {
        id: 'midweek_champion',
        name: 'Campione Infrasettimanale',
        description: 'Vinci una partita di mercoledì',
        icon: '🐪',
        rarity: 'common',
        check: (stats, gameData) => {
            if (!gameData || !gameData.won || !gameData.date) return false;
            const day = new Date(gameData.date).getDay();
            return day === 3; // Wednesday
        }
    },
    CENTURION: {
        id: 'centurion',
        name: 'Centurione',
        description: 'Vinci 100 partite totali',
        icon: '💯',
        rarity: 'legendary',
        check: (stats) => stats.gamesWon >= 100
    },
    GRAND_MASTER: {
        id: 'grand_master',
        name: 'Gran Maestro',
        description: 'Raggiungi il 90%+ di vittorie con 30+ partite',
        icon: '👑',
        rarity: 'legendary',
        check: (stats) => {
            if (stats.gamesPlayed < 30) return false;
            const winRate = (stats.gamesWon / stats.gamesPlayed) * 100;
            return winRate >= 90;
        }
    },
    SHARP_MIND: {
        id: 'sharp_mind',
        name: 'Mente Acuta',
        description: 'Vinci 5 volte con 3 tentativi o meno',
        icon: '🎯',
        rarity: 'rare',
        check: (stats) => {
            const quickWins = (stats.guesses[1] || 0) + (stats.guesses[2] || 0) + (stats.guesses[3] || 0);
            return quickWins >= 5;
        }
    },
    PERSISTENCE: {
        id: 'persistence',
        name: 'Perseveranza',
        description: 'Gioca 50 partite totali',
        icon: '🏃',
        rarity: 'rare',
        check: (stats) => stats.gamesPlayed >= 50
    },
    TIME_LORD: {
        id: 'time_lord',
        name: 'Signore del Tempo',
        description: 'Vinci 25 partite in modalità Timed',
        icon: '⏳',
        rarity: 'epic',
        check: (stats) => (stats.timedModeWins || 0) >= 25
    },
    HARD_MODE_LEGEND: {
        id: 'hard_legend',
        name: 'Leggenda Hard',
        description: 'Vinci 50 partite in modalità Hard',
        icon: '🔱',
        rarity: 'legendary',
        check: (stats) => (stats.hardModeWins || 0) >= 50
    }
};

// Get all achievements as array
export function getAllAchievements() {
    return Object.values(ACHIEVEMENTS);
}

// Check which achievements should be unlocked based on current stats and game data
export function checkAchievements(stats, gameData = null, currentAchievements = []) {
    const newlyUnlocked = [];

    for (const achievement of getAllAchievements()) {
        // Skip if already unlocked
        if (currentAchievements.includes(achievement.id)) continue;

        // Check if condition is met
        if (achievement.check(stats, gameData)) {
            newlyUnlocked.push(achievement);
        }
    }

    return newlyUnlocked;
}

// Get rarity color
export function getRarityColor(rarity) {
    const colors = {
        common: '#9CA3AF',
        rare: '#3B82F6',
        epic: '#A855F7',
        legendary: '#F59E0B'
    };
    return colors[rarity] || colors.common;
}
