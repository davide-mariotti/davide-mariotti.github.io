// Costanti per i tipi di allenamento
const WORKOUT_TYPES = {
    EASY: 'Easy Run',
    TEMPO: 'Tempo Run',
    INTERVALS: 'Intervals',
    LONG: 'Long Run',
    RECOVERY: 'Recovery Run'
};

// Configurazione base dei km per livello e numero di allenamenti
const BASE_KM_CONFIG = {
    veryEasy: {
        4: {
            easyRun: 5,
            tempo: 6,
            intervals: 7,
            longBase: 12
        },
        5: {
            extraEasy: 4
        },
        6: {
            extraEasy: 4
        }
    },
    easy: {
        4: {
            easyRun: 6,
            tempo: 7,
            intervals: 8,
            longBase: 14
        },
        5: {
            extraEasy: 5
        },
        6: {
            extraEasy: 5
        }
    },
    base: {
        4: {
            easyRun: 7,
            tempo: 8,
            intervals: 9,
            longBase: 16
        },
        5: {
            extraEasy: 6
        },
        6: {
            extraEasy: 6
        }
    },
    hard: {
        4: {
            easyRun: 8,
            tempo: 9,
            intervals: 10,
            longBase: 18
        },
        5: {
            extraEasy: 7
        },
        6: {
            extraEasy: 7
        }
    },
    veryHard: {
        4: {
            easyRun: 9,
            tempo: 10,
            intervals: 11,
            longBase: 20
        },
        5: {
            extraEasy: 8
        },
        6: {
            extraEasy: 8
        }
    }
};

// Funzione per calcolare il passo target in base al tempo obiettivo
function calculateTargetPace(targetTime) {
    // Converti il tempo obiettivo in secondi
    const [hours, minutes, seconds] = targetTime.split(':').map(Number);
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    
    // Calcola il passo per km (21.0975 km)
    const pacePerKm = totalSeconds / 21.0975;
    return pacePerKm;
}

// Funzione per formattare il passo in min:sec
function formatPace(paceSeconds) {
    const minutes = Math.floor(paceSeconds / 60);
    const seconds = Math.floor(paceSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Funzione per calcolare i ritmi in base al tempo target
function calculatePaces(targetPace) {
    return {
        easy: formatPace(targetPace * 1.2),      // 20% più lento del race pace
        long: formatPace(targetPace * 1.15),     // 15% più lento del race pace
        tempo: formatPace(targetPace * 0.95),    // 5% più veloce del race pace
        interval: formatPace(targetPace * 0.9),   // 10% più veloce del race pace
        recovery: formatPace(targetPace * 1.3),   // 30% più lento del race pace
        race: formatPace(targetPace)             // race pace
    };
}

function getWorkoutDistance(baseLevel, workoutDays, workoutType, week) {
    const config = BASE_KM_CONFIG[baseLevel];
    let distance = 0;

    if (workoutType === WORKOUT_TYPES.EASY) {
        distance = config[4].easyRun;
    } else if (workoutType === WORKOUT_TYPES.TEMPO) {
        distance = config[4].tempo;
    } else if (workoutType === WORKOUT_TYPES.INTERVALS) {
        distance = config[4].intervals;
    } else if (workoutType === WORKOUT_TYPES.LONG) {
        distance = config[4].longBase;
        
        // Incremento progressivo del lungo
        if (!isRecoveryWeek && !isTaperingWeek && week < 13) {
            distance += week < 8 ? 1.5 : 1;
        }
    }

    // Aggiusta la distanza per le settimane di recupero e tapering
    if (isRecoveryWeek) {
        distance *= 0.7;
    } else if (isTaperingWeek) {
        distance *= 0.6;
    }

    return Math.round(distance * 2) / 2;
}

// Funzione per generare il piano di allenamento
function generateTrainingPlan() {
    const targetTime = document.getElementById('targetTime').value;
    const workoutDays = parseInt(document.getElementById('workoutDays').value);
    const baseLevel = document.getElementById('baseLevel').value;
    const config = BASE_KM_CONFIG[baseLevel];
    
    if (!targetTime) {
        alert('Inserisci il tempo obiettivo per la mezza maratona');
        return;
    }

    const targetPace = calculateTargetPace(targetTime);
    const paces = calculatePaces(targetPace);
    const weeks = 14;
    const trainingPlan = [];

    // Base settimanale di km per il lungo
    let longRunBase = config[4].longBase;  // Usa la configurazione per il lungo base
    
    for (let week = 1; week <= weeks; week++) {
        let weeklyKm = 0;
        const workouts = [];

        const isRecoveryWeek = week === 5 || week === 10;
        const isTaperingWeek = week >= 13;
        const isLongWeek = week % 2 === 0 && !isRecoveryWeek && !isTaperingWeek && week > 4; // Settimane pari per i lunghi più lunghi

        // Calcola il lungo del weekend
        let longRunDistance;
        if (isRecoveryWeek) {
            longRunDistance = 12; // Lungo fisso di 12km nelle settimane di recupero
        } else if (isTaperingWeek) {
            longRunDistance = longRunBase * 0.6;
        } else if (isLongWeek) {
            longRunDistance = longRunBase; // Lungo completo nelle settimane pari
        } else {
            longRunDistance = Math.min(16, longRunBase * 0.75); // Lungo più moderato nelle settimane dispari
        }

        // Incrementa la base del lungo se non è settimana di scarico o tapering
        if (!isRecoveryWeek && !isTaperingWeek && week < 13) {
            if (week < 8) {
                longRunBase += 1.5; // Incremento maggiore nelle prime settimane
            } else {
                longRunBase += 1;
            }
        }

        // Limita la distanza massima del lungo a 24km
        if (longRunBase > 24) {
            longRunBase = 24;
        }

        // Progressione più graduale dei km a ritmo gara nel lungo
        let raceKm;
        if (week <= 4) {
            raceKm = 0;  // Solo ritmo lungo
        } else if (week <= 6) {
            raceKm = 2;  // 2km finali a ritmo gara
        } else if (week <= 8) {
            raceKm = 4;  // 4km finali a ritmo gara
        } else if (week <= 10) {
            raceKm = 6;  // 6km finali a ritmo gara
        } else if (week <= 12) {
            raceKm = 8;  // 8km finali a ritmo gara
        } else {
            raceKm = 0;  // Tapering: solo ritmo lungo
        }

        // Genera gli allenamenti della settimana
        for (let day = 1; day <= 4; day++) {
            let workout;
            
            if (day === 4) { // Sabato: Lungo o Gara
                if (week === weeks) { // Ultima settimana: GARA
                    workout = {
                        type: 'GARA',
                        distance: 21.1,
                        description: `MEZZA MARATONA @${paces.race}`
                    };
                } else { // Normale lungo con progressivo
                    const distance = Math.round(longRunDistance * 2) / 2;
                    let description;

                    if (week <= 4) {
                        // Prime 4 settimane: tutto a ritmo lungo
                        description = `${WORKOUT_TYPES.LONG} ${distance}km @${paces.long}`;
                    } else if (week <= 6) {
                        // Settimane 5-6: ultimo 2km a ritmo gara
                        const baseDistance = distance - 2;
                        description = `${WORKOUT_TYPES.LONG} ${distance}km: ${baseDistance}km @${paces.long} + 2km @${paces.race}`;
                    } else if (week <= 8) {
                        // Settimane 7-8: ultimi 4km a ritmo gara
                        const baseDistance = distance - 4;
                        description = `${WORKOUT_TYPES.LONG} ${distance}km: ${baseDistance}km @${paces.long} + 4km @${paces.race}`;
                    } else if (week <= 9) {
                        // Settimana 9: ultimi 6km a ritmo gara
                        const baseDistance = distance - 6;
                        description = `${WORKOUT_TYPES.LONG} ${distance}km: ${baseDistance}km @${paces.long} + 6km @${paces.race}`;
                    } else if (week <= 11) {
                        // Settimane 10-11: ultimi 8km a ritmo gara
                        const baseDistance = distance - 8;
                        description = `${WORKOUT_TYPES.LONG} ${distance}km: ${baseDistance}km @${paces.long} + 8km @${paces.race}`;
                    } else if (week === 12) {
                        // Settimana 12: ultimi 10km a ritmo gara (ultimo lungo importante)
                        const baseDistance = distance - 10;
                        description = `${WORKOUT_TYPES.LONG} ${distance}km: ${baseDistance}km @${paces.long} + 10km @${paces.race}`;
                    } else {
                        // Settimana 13: tapering, lungo leggero
                        description = `${WORKOUT_TYPES.LONG} ${distance}km @${paces.long}`;
                    }

                    workout = {
                        type: WORKOUT_TYPES.LONG,
                        distance: distance,
                        description: description
                    };
                }
            } else if (isRecoveryWeek) {
                workout = {
                    type: WORKOUT_TYPES.EASY,
                    distance: 5,
                    description: `${WORKOUT_TYPES.EASY} 5km @${paces.easy}`
                };
            } else {
                switch (day) {
                    case 1: // Lunedì
                        workout = {
                            type: WORKOUT_TYPES.EASY,
                            distance: config[4].easyRun,  // Usa la configurazione per Easy Run
                            description: `${WORKOUT_TYPES.EASY} ${config[4].easyRun}km @${paces.easy}`
                        };
                        break;
                    case 2: // Martedì
                        if (!isTaperingWeek) {
                            const intervalDesc = week < 7 ? 
                                `${WORKOUT_TYPES.INTERVALS} 10km: 1km @${paces.easy} + 8x400m @${paces.interval} con recupero attivo 200m @${paces.recovery} + 1km @${paces.easy}` :
                                `${WORKOUT_TYPES.INTERVALS} 10km: 2km @${paces.easy} + 6x800m @${paces.interval} con recupero attivo 400m @${paces.recovery} + 2km @${paces.easy}`;
                            workout = {
                                type: WORKOUT_TYPES.INTERVALS,
                                distance: 10,
                                description: intervalDesc
                            };
                        } else {
                            workout = {
                                type: WORKOUT_TYPES.EASY,
                                distance: 5,
                                description: `${WORKOUT_TYPES.EASY} 5km @${paces.easy}`
                            };
                        }
                        break;
                    case 3: // Giovedì
                        if (!isTaperingWeek) {
                            workout = {
                                type: WORKOUT_TYPES.TEMPO,
                                distance: config[4].tempo,  // Usa la configurazione per Tempo
                                description: `${WORKOUT_TYPES.TEMPO} ${config[4].tempo}km: 2km @${paces.easy} + ${config[4].tempo-4}km @${paces.tempo} + 2km @${paces.easy}`
                            };
                        } else {
                            workout = {
                                type: WORKOUT_TYPES.EASY,
                                distance: 4,
                                description: `${WORKOUT_TYPES.EASY} 4km @${paces.easy}`
                            };
                        }
                        break;
                }
            }
            
            workouts.push(workout);
            weeklyKm += workout.distance;
        }

        // Aggiungi mercoledì e/o venerdì se richiesto
        if (workoutDays >= 5) {
            const wednesdayWorkout = {
                type: WORKOUT_TYPES.EASY,
                distance: config[5].extraEasy,  // Usa la configurazione per il giorno extra
                description: `${WORKOUT_TYPES.EASY} ${config[5].extraEasy}km @${paces.easy}`
            };
            workouts.splice(2, 0, wednesdayWorkout);
            weeklyKm += wednesdayWorkout.distance;
        }

        if (workoutDays === 6) {
            const fridayWorkout = {
                type: WORKOUT_TYPES.EASY,
                distance: config[6].extraEasy,  // Usa la configurazione per il giorno extra
                description: `${WORKOUT_TYPES.EASY} ${config[6].extraEasy}km @${paces.easy}`
            };
            workouts.splice(4, 0, fridayWorkout);
            weeklyKm += fridayWorkout.distance;
        }

        trainingPlan.push({
            week,
            workouts,
            totalKm: Math.round(weeklyKm * 2) / 2
        });
    }

    displayTrainingPlan(trainingPlan);
}

// Funzione per visualizzare il piano di allenamento
function displayTrainingPlan(plan) {
    const table = document.createElement('table');
    table.className = 'training-table';
    
    // Intestazione
    const header = table.createTHead();
    const headerRow = header.insertRow();
    const workoutDays = parseInt(document.getElementById('workoutDays').value);
    const headers = workoutDays === 6 ? 
        ['Week', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Total Km'] :
        workoutDays === 5 ?
        ['Week', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Total Km'] :
        ['Week', 'Monday', 'Tuesday', 'Thursday', 'Saturday', 'Total Km'];
    
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });

    // Corpo della tabella
    const tbody = table.createTBody();
    let totalKm = 0;

    plan.forEach(week => {
        const row = tbody.insertRow();
        
        if (week.week === 5 || week.week === 10) {
            row.className = 'recovery-week';
        }
        
        const weekCell = row.insertCell();
        weekCell.textContent = `Week ${week.week}${week.week === 5 || week.week === 10 ? ' (Recovery)' : ''}`;

        week.workouts.forEach(workout => {
            const cell = row.insertCell();
            cell.textContent = workout.description;
        });

        const totalCell = row.insertCell();
        totalCell.textContent = `${week.totalKm} km`;
        totalKm += week.totalKm;
    });

    // Riga totale km
    const totalRow = tbody.insertRow();
    const totalCell = totalRow.insertCell();
    // Calcola il colspan corretto in base al numero di giorni
    const colspanValue = {
        4: 5,  // Week + 4 giorni
        5: 6,  // Week + 5 giorni
        6: 7   // Week + 6 giorni
    }[workoutDays];
    
    totalCell.colSpan = colspanValue;
    totalCell.textContent = 'Total Kilometers';
    const grandTotalCell = totalRow.insertCell();
    grandTotalCell.textContent = `${Math.round(totalKm * 2) / 2} km`;

    // Inserisci la tabella nel DOM
    const container = document.getElementById('trainingPlan');
    container.innerHTML = '';
    container.appendChild(table);
}

function updatePace() {
    const targetTime = document.getElementById('targetTime').value;
    const [hours, minutes, seconds] = targetTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    const pacePerKm = totalMinutes / 21.0975; // Calcola il passo per km

    const paceMinutes = Math.floor(pacePerKm);
    const paceSeconds = Math.round((pacePerKm - paceMinutes) * 60);
    const paceString = `${paceMinutes}:${paceSeconds < 10 ? '0' : ''}${paceSeconds} min/km`;

    document.getElementById('racePace').textContent = `Passo gara: ${paceString}`;
}

// Chiamata iniziale per impostare il passo gara predefinito
updatePace();