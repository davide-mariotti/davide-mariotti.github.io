// Utility functions for time and pace calculations
const utils = {
    // Convert time string (HH:MM:SS) to seconds
    timeToSeconds: (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    },

    // Convert seconds to time string (HH:MM:SS)
    secondsToTime: (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // Calculate pace in min/km from time and distance
    calculatePace: (timeStr, distance) => {
        const seconds = utils.timeToSeconds(timeStr);
        const paceSeconds = seconds / distance;
        return utils.secondsToTime(paceSeconds);
    },

    // Calculate target paces based on race time
    calculateTargetPaces: (raceTime, distance) => {
        const racePace = utils.timeToSeconds(utils.calculatePace(raceTime, distance));
        
        return {
            easy: utils.secondsToTime(racePace * 1.2), // 20% slower than race pace
            tempo: utils.secondsToTime(racePace * 1.1), // 10% slower than race pace
            interval: utils.secondsToTime(racePace * 0.9), // 10% faster than race pace
            recovery: utils.secondsToTime(racePace * 1.3) // 30% slower than race pace
        };
    }
};

// Training plan generator
class TrainingPlanGenerator {
    constructor(config) {
        this.weeks = config.weeks;
        this.sessionsPerWeek = config.sessionsPerWeek;
        this.initialVolume = config.initialVolume;
        this.raceTime = config.raceTime;
        this.distance = config.distance;
        this.targetPaces = utils.calculateTargetPaces(config.raceTime, config.distance);
    }

    // Calculate weekly volume with progression
    calculateWeeklyVolume(week) {
        let volume = this.initialVolume;
        for (let i = 1; i < week; i++) {
            if (i % 4 === 0) {
                // Recovery week (30% reduction)
                volume *= 0.7;
            } else {
                // Normal progression (10% increase)
                volume *= 1.1;
            }
        }
        return Math.round(volume * 10) / 10; // Round to 1 decimal place
    }

    // Generate training sessions for a week
    generateWeeklySessions(week) {
        const weeklyVolume = this.calculateWeeklyVolume(week);
        const sessions = [];
        
        // Calculate 80/20 split
        const easyVolume = weeklyVolume * 0.8;
        const hardVolume = weeklyVolume * 0.2;

        // Distribute easy runs
        const easySessions = Math.ceil(this.sessionsPerWeek * 0.8);
        const easyDistance = easyVolume / easySessions;
        
        for (let i = 0; i < easySessions; i++) {
            sessions.push({
                type: 'Easy Run',
                distance: Math.round(easyDistance * 10) / 10,
                pace: this.targetPaces.easy,
                duration: utils.secondsToTime(utils.timeToSeconds(this.targetPaces.easy) * easyDistance)
            });
        }

        // Add hard sessions (intervals and tempo)
        const hardSessions = this.sessionsPerWeek - easySessions;
        const hardDistance = hardVolume / hardSessions;

        for (let i = 0; i < hardSessions; i++) {
            const isInterval = i % 2 === 0;
            sessions.push({
                type: isInterval ? 'Interval Training' : 'Tempo Run',
                distance: Math.round(hardDistance * 10) / 10,
                pace: isInterval ? this.targetPaces.interval : this.targetPaces.tempo,
                duration: utils.secondsToTime(utils.timeToSeconds(isInterval ? this.targetPaces.interval : this.targetPaces.tempo) * hardDistance)
            });
        }

        return sessions;
    }

    // Generate complete training plan
    generatePlan() {
        const plan = [];
        for (let week = 1; week <= this.weeks; week++) {
            plan.push({
                week: week,
                volume: this.calculateWeeklyVolume(week),
                sessions: this.generateWeeklySessions(week)
            });
        }
        return plan;
    }
}

// Export for use in other files
window.TrainingPlanGenerator = TrainingPlanGenerator;
window.utils = utils;
