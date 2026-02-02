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
