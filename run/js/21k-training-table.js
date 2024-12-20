// Costanti per i tipi di allenamento
const WORKOUT_TYPES = {
    EASY: 'Easy Run',
    TEMPO: 'Tempo Run',
    INTERVALS: 'Intervals',
    LONG: 'Long Run',
    RECOVERY: 'Recovery Run'
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

// Funzione per generare il piano di allenamento
function generateTrainingPlan() {
    const targetTime = document.getElementById('targetTime').value;
    if (!targetTime) {
        alert('Inserisci il tempo obiettivo per la mezza maratona');
        return;
    }

    const targetPace = calculateTargetPace(targetTime);
    const paces = calculatePaces(targetPace);
    const weeks = 14;
    const trainingPlan = [];

    // Base settimanale di km per il lungo
    let longRunBase = 14;
    
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
                            distance: 6,
                            description: `${WORKOUT_TYPES.EASY} 6km @${paces.easy}`
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
                                distance: 8,
                                description: `${WORKOUT_TYPES.TEMPO} 8km: 2km @${paces.easy} + 4km @${paces.tempo} + 2km @${paces.easy}`
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
    const headers = ['Week', 'Monday', 'Tuesday', 'Thursday', 'Saturday', 'Total Km'];
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
        
        // Aggiungi classe per settimane di recupero
        if (week.week === 5 || week.week === 10) {
            row.className = 'recovery-week';
        }
        
        // Numero settimana
        const weekCell = row.insertCell();
        weekCell.textContent = `Week ${week.week}${week.week === 5 || week.week === 10 ? ' (Recovery)' : ''}`;

        // Allenamenti
        week.workouts.forEach(workout => {
            const cell = row.insertCell();
            cell.textContent = workout.description;
        });

        // Km totali settimanali
        const totalCell = row.insertCell();
        totalCell.textContent = `${week.totalKm} km`;
        totalKm += week.totalKm;
    });

    // Riga totale km
    const totalRow = tbody.insertRow();
    const totalCell = totalRow.insertCell();
    totalCell.colSpan = 5;
    totalCell.textContent = 'Total Kilometers';
    const grandTotalCell = totalRow.insertCell();
    grandTotalCell.textContent = `${Math.round(totalKm * 2) / 2} km`;

    // Inserisci la tabella nel DOM
    const container = document.getElementById('trainingPlan');
    container.innerHTML = '';
    container.appendChild(table);
}