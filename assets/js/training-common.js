/**
 * assets/js/training-common.js
 * Logica condivisa per i piani di allenamento (Ironman e Maratona)
 */

let currentWeekIdx = -1;
let volumeChart = null;
let sportDistChart = null;

// Gestione Globals per supportare entrambi i piani
const getPlan = () => typeof IM_PLAN !== 'undefined' ? IM_PLAN : (typeof PLAN !== 'undefined' ? PLAN : []);
const getPlanStart = () => typeof IM_PLAN_START !== 'undefined' ? IM_PLAN_START : (typeof PLAN_START !== 'undefined' ? PLAN_START : new Date());
const getRaceDate = () => typeof IM_RACE_DATE !== 'undefined' ? IM_RACE_DATE : (typeof RACE_DATE !== 'undefined' ? RACE_DATE : new Date());
const isIronman = () => typeof IM_PLAN !== 'undefined';

// Configurazione Sport
const SPORT_CONFIG = {
    'swim': { icon: '🏊', label: 'Nuoto', color: '#38bdf8' },
    'bike': { icon: '🚴', label: 'Bici', color: '#4ade80' },
    'run': { icon: '🏃', label: 'Corsa', color: '#f59e0b' },
    'brick': { icon: '🔱', label: 'Brick', color: '#a78bfa' },
    'rest': { icon: '🛌', label: 'Riposo', color: '#475569' },
    'race': { icon: '🏅', label: 'GARA', color: '#ef4444' }
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    // Calcola totali per ogni settimana
    processPlanData();

    // Renderizza UI
    updateStats();
    renderCharts();
    toggleChartUnit(); // set initial labels/styles
    renderWeeksGrid();

    // Modal navigation
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('weekModal').classList.contains('show')) return;
        if (e.key === 'ArrowLeft') prevWeek();
        if (e.key === 'ArrowRight') nextWeek();
    });
});

// Configurazione Andature/Velocità Medie per stime (usate se km non specificati)
const PACE_CONFIG = {
    'run': {
        z1: 7.0, // min/km
        z2: 6.25, // media tra 6:00 e 6:30
        z3: 5.25, // media tra 5:00 e 5:30
        z4: 4.25, // media tra 4:00 e 4:30
        z5: 4.0
    },
    'bike': {
        z1: 21.5, // km/h
        z2: 26.5,
        z3: 31.5,
        z4: 35.0,
        z5: 40.0
    },
    'swim': {
        base: 2.0 // min / 100m (stima 2:00/100m)
    }
};

/**
 * Elabora i dati del piano calcolando totali, zone e distanze
 */
function processPlanData() {
    const plan = getPlan();
    
    plan.forEach((week, idx) => {
        let totals = {
            swimMin: 0, bikeMin: 0, runMin: 0, brickMin: 0, otherMin: 0,
            totMin: 0,
            swimM: 0, bikeKm: 0, runKm: 0,
            z1: 0, z2: 0, z3: 0, z4: 0, z5: 0
        };

        week.days.forEach(day => {
            const min = day.durationMin || 0;
            totals.totMin += min;

            // 1. Parsing Zone
            const zones = parseZonesFromDesc(day.desc, min, day.sport);
            totals.z1 += zones.z1;
            totals.z2 += zones.z2;
            totals.z3 += zones.z3;
            totals.z4 += zones.z4;
            totals.z5 += zones.z5;
            day.computedZones = zones;

            // 2. Suddivisione Minuti Multi-Sport
            let swimM = 0, bikeM = 0, runM = 0;

            // Helper: estrae minuti di un'attività dal testo, supporta formato "Sport NN'" con separatore | e prefisso emoji
            const extractMin = (desc, keyword) => {
                const re = new RegExp('(?:^|\\|)[^|]*' + keyword + '[^\\d]*(\\d+)[\'\'`]', 'i');
                const m = desc.match(re);
                return m ? parseInt(m[1]) : 0;
            };

            if (day.sport === 'brick') {
                bikeM = min * 0.8; runM = min * 0.2;
                const bm = extractMin(day.desc, 'bici');
                if (bm) bikeM = bm;
                const rm = extractMin(day.desc, 'corsa');
                if (rm) runM = rm;
            } else if (day.sport === 'swim') {
                swimM = min;
                const rm = extractMin(day.desc, 'corsa');
                if (rm) { runM = rm; swimM -= rm; }
                const bm = extractMin(day.desc, 'bici');
                if (bm) { bikeM = bm; swimM -= bm; }
            } else if (day.sport === 'bike') {
                bikeM = min;
                const rm = extractMin(day.desc, 'corsa');
                if (rm) { runM = rm; bikeM -= rm; }
                const sm = extractMin(day.desc, 'nuoto');
                if (sm) { swimM = sm; bikeM -= sm; }
            } else if (day.sport === 'run') {
                runM = min;
                const sm = extractMin(day.desc, 'nuoto');
                if (sm) { swimM = sm; runM -= sm; }
                const bm = extractMin(day.desc, 'bici');
                if (bm) { bikeM = bm; runM -= bm; }
            } else if (day.sport === 'race') {
                if (isIronman()) {
                    // Stima tempi gara Ironman 70.3
                    const raceSwimMin = 38, raceBikeMin = 154, raceRunMin = 108, transMin = 15;
                    const raceTotMin = raceSwimMin + raceBikeMin + raceRunMin + transMin;
                    totals.totMin -= min; 
                    totals.totMin += raceTotMin;
                    swimM = raceSwimMin;
                    bikeM = raceBikeMin;
                    runM = raceRunMin;
                    totals.swimM += 1900;
                    totals.bikeKm += 90;
                    totals.runKm += 21.1;
                    day.swimM = 1900;
                    day.bikeKm = 90;
                    day.runKm = 21.1;
                    totals.z3 += (raceTotMin - transMin);
                    totals.z1 += transMin;
                    day.computedZones = { z1: transMin, z2: 0, z3: (raceTotMin - transMin), z4: 0, z5: 0 };
                    day.durationMin = raceTotMin; 
                } else {
                    // Stima tempi gara Maratona
                    const raceTotMin = 210; // stima 3h30
                    totals.totMin -= min; 
                    totals.totMin += raceTotMin;
                    runM = raceTotMin;
                    totals.runKm += 42.195;
                    day.runKm = 42.195;
                    totals.z3 += raceTotMin;
                    day.computedZones = { z1: 0, z2: 0, z3: raceTotMin, z4: 0, z5: 0 };
                    day.durationMin = raceTotMin; 
                }
            }

            totals.swimMin += Math.max(0, swimM);
            totals.bikeMin += Math.max(0, bikeM);
            totals.runMin += Math.max(0, runM);

            const accounted = Math.max(0, swimM) + Math.max(0, bikeM) + Math.max(0, runM);
            if (min > accounted) {
                totals.otherMin += (min - accounted);
            }

            // 3. Calcolo Distanze
            let textDist = extractTextDistance(day.desc, day.sport);

            if (swimM > 0) {
                let sDist = day.swimM || (day.sport === 'swim' && textDist ? textDist : (swimM / PACE_CONFIG.swim.base * 100));
                totals.swimM += sDist;
                day.swimM = Math.round(sDist);
            }
            if (bikeM > 0) {
                const brickDist = extractBrickDistances(day.desc);
                let bDist = day.bikeKm || brickDist.bikeKm || estimateKm(bikeM, zones, 'bike');
                totals.bikeKm += bDist;
                day.bikeKm = Math.round(bDist * 10) / 10;
            }
            if (runM > 0) {
                const brickDist = extractBrickDistances(day.desc);
                let rDist = day.runKm || brickDist.runKm || estimateKm(runM, zones, 'run');
                totals.runKm += rDist;
                day.runKm = Math.round(rDist * 10) / 10;
            }

            day.computedDist = textDist || day.runKm || day.swimM || day.bikeKm;
        });

        week.totals = totals;
    });
}

function extractTextDistance(desc, sport) {
    const text = desc.toLowerCase();
    const multMatch = text.match(/(\d+)\s*[x*]\s*(\d+)\s*m/);
    if (multMatch) {
        const totalM = parseInt(multMatch[1]) * parseInt(multMatch[2]);
        return (sport === 'swim') ? totalM : totalM / 1000;
    }
    const kmMatch = text.match(/(\d+(?:[.,]\d+)?)\s*km/i);
    if (kmMatch) return parseFloat(kmMatch[1].replace(',', '.'));
    const mMatch = text.match(/(\d{2,})\s*m(?!\w)/i);
    if (mMatch) {
        const val = parseInt(mMatch[1]);
        if (sport === 'swim') return val;
        return val / 1000;
    }
    return null;
}

function extractBrickDistances(desc) {
    const res = { bikeKm: 0, runKm: 0 };
    const bike = desc.match(/bici:\s*(\d+(?:[.,]\d+)?)\s*km/i);
    const run = desc.match(/corsa:\s*(\d+(?:[.,]\d+)?)\s*km/i);
    if (bike) res.bikeKm = parseFloat(bike[1].replace(',', '.'));
    if (run) res.runKm = parseFloat(run[1].replace(',', '.'));
    return res;
}

function estimateKm(min, zones, sport) {
    if (min <= 0) return 0;
    if (sport === 'bike') {
        let avgSpeed = 0;
        if (zones.z3 > 0) avgSpeed = PACE_CONFIG.bike.z3;
        else if (zones.z2 > 0) avgSpeed = PACE_CONFIG.bike.z2;
        else avgSpeed = PACE_CONFIG.bike.z1;
        return (min / 60) * avgSpeed;
    } else {
        let avgPace = 0;
        if (zones.z4 > 0) avgPace = PACE_CONFIG.run.z4;
        else if (zones.z3 > 0) avgPace = PACE_CONFIG.run.z3;
        else if (zones.z2 > 0) avgPace = PACE_CONFIG.run.z2;
        else avgPace = PACE_CONFIG.run.z1;
        return min / avgPace;
    }
}

function parseZonesFromDesc(desc, totalMin, sport) {
    let zones = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 };
    if (!totalMin || totalMin <= 0) return zones;

    let cleanText = desc.toLowerCase().replace(/\\'/g, "'");
    cleanText = cleanText.replace(/ritmo\s*gara\s*(?:70\.3)?/g, 'z3');
    cleanText = cleanText.replace(/target\s*gara/g, 'z3');

    let fullSessionRegex = new RegExp('(?:corsa|bici|nuoto|nuotata|uscita)[^\\d]*' + totalMin + '[\'"]?\\s*(?:target|ritmo)?\\s*gara?\\s*z?([1-5])', 'i');
    let fullMatch = cleanText.match(fullSessionRegex);
    if (!fullMatch) {
        if (cleanText.length < 25) {
            fullMatch = cleanText.match(/(?:corsa|bici|nuoto|nuotata|uscita)[^z]*z([1-5])/i);
        }
    }
    
    if (fullMatch) {
        let zoneNum = parseInt(fullMatch[1]);
        zones[`z${zoneNum}`] = totalMin;
        return zones;
    }

    let sumFound = 0;
    let foundSpecific = false;

    const intPattern = /(\d+)\s*[x×*]\s*(\d+)(['"])\s*z(\d)(?:\/z\d)?\s*(?:rec\s*(\d+)(['"])?(?:(\d+)")?)?/gi;
    let match;
    while ((match = intPattern.exec(cleanText)) !== null) {
        let reps = parseInt(match[1]);
        let workVal = parseInt(match[2]);
        let workUnit = match[3];
        let workMin = workUnit === "'" ? workVal : workVal / 60;
        let workZone = parseInt(match[4]);

        zones[`z${workZone}`] += workMin * reps;
        sumFound += workMin * reps;
        foundSpecific = true;

        if (match[5]) {
            let recVal1 = parseInt(match[5]);
            let recUnit1 = match[6];
            if (!recUnit1) recUnit1 = recVal1 > 10 ? '"' : "'";
            let recMin = 0;
            if (recUnit1 === "'") {
                recMin += recVal1;
                if (match[7]) recMin += parseInt(match[7]) / 60;
            } else {
                recMin += recVal1 / 60;
            }
            zones.z1 += recMin * reps;
            sumFound += recMin * reps;
        }
        cleanText = cleanText.replace(match[0], '');
    }

    const mPattern = /(?:(\d+)\s*[x×*]\s*)?(\d{2,})\s*m?\s*z(\d)/gi;
    while ((match = mPattern.exec(cleanText)) !== null) {
        const reps = match[1] ? parseInt(match[1]) : 1;
        const dist = parseInt(match[2]);
        const z = parseInt(match[3]);
        if (z >= 1 && z <= 5 && (sport === 'swim' || cleanText.includes('nuoto'))) {
            const m = (reps * dist) / 100 * 2;
            zones[`z${z}`] += m;
            sumFound += m;
            foundSpecific = true;
            cleanText = cleanText.replace(match[0], '');
        }
    }

    const simplePattern = /(\d+)(['"])\s*z(\d)/gi;
    while ((match = simplePattern.exec(cleanText)) !== null) {
        let workVal = parseInt(match[1]);
        let workUnit = match[2];
        let workMin = workUnit === "'" ? workVal : workVal / 60;
        let workZone = parseInt(match[3]);

        if (workMin === totalMin) continue;

        zones[`z${workZone}`] += workMin;
        sumFound += workMin;
        foundSpecific = true;
    }

    if (foundSpecific) {
        if (sumFound < totalMin) {
            zones.z2 += (totalMin - sumFound);
        }
    } else {
        if (sport === 'swim' && cleanText.includes('tecnica z1')) {
            zones.z1 = totalMin;
        } else if (cleanText.includes('z5') || cleanText.includes('vo2max')) {
            zones.z5 = totalMin * 0.2; zones.z2 = totalMin * 0.8;
        } else if (cleanText.includes('z4') || cleanText.includes('soglia')) {
            zones.z4 = totalMin * 0.3; zones.z2 = totalMin * 0.7;
        } else if (cleanText.includes('z3') || cleanText.includes('ritmo gara')) {
            zones.z3 = totalMin * 0.4; zones.z2 = totalMin * 0.6;
        } else if (cleanText.includes('z1') || cleanText.includes('scarico') || cleanText.includes('tecnica')) {
            zones.z1 = totalMin;
        } else {
            zones.z2 = totalMin;
        }
    }
    return zones;
}

function updateStats() {
    let totalMin = 0;
    let peakMin = 0;
    let totalSwimM = 0, totalBikeKm = 0, totalRunKm = 0;
    const plan = getPlan();

    plan.forEach(w => {
        totalMin += w.totals.totMin;
        if (w.totals.totMin > peakMin) peakMin = w.totals.totMin;
        totalSwimM += w.totals.swimM;
        totalBikeKm += w.totals.bikeKm;
        totalRunKm += w.totals.runKm;
    });

    document.getElementById('stat-weeks').textContent = plan.length;
    document.getElementById('stat-hours').textContent = Math.round(totalMin / 60) + 'h';
    document.getElementById('stat-peak').textContent = Math.round(peakMin / 60) + 'h';
    document.getElementById('stat-swim-km').textContent = (totalSwimM / 1000).toFixed(1);
    document.getElementById('stat-bike-km').textContent = Math.round(totalBikeKm).toLocaleString();
    document.getElementById('stat-run-km').textContent = Math.round(totalRunKm).toLocaleString();

    const now = new Date();
    const diff = getRaceDate() - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById('stat-countdown').textContent = days > 0 ? days + 'd' : 'GARA!';

    const currentIdx = getCurrentWeekIdx();
    document.getElementById('stat-current').textContent = currentIdx >= 0 ? plan[currentIdx].week : 'N/A';
}

function getCurrentWeekIdx() {
    const now = new Date();
    const diffTime = now - getPlanStart();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekIdx = Math.floor(diffDays / 7);
    const plan = getPlan();

    if (weekIdx >= 0 && weekIdx < plan.length) return weekIdx;
    return -1;
}

function renderCharts() {
    const plan = getPlan();
    const labels = plan.map(w => w.week.replace(/IM-|W/, ''));

    const ctxVol = document.getElementById('volumeChart').getContext('2d');
    volumeChart = new Chart(ctxVol, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Nuoto', data: plan.map(w => (w.totals.swimMin / 60).toFixed(1)), backgroundColor: SPORT_CONFIG.swim.color },
                { label: 'Bici', data: plan.map(w => (w.totals.bikeMin / 60).toFixed(1)), backgroundColor: SPORT_CONFIG.bike.color },
                { label: 'Corsa', data: plan.map(w => (w.totals.runMin / 60).toFixed(1)), backgroundColor: SPORT_CONFIG.run.color },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true, grid: { display: false } },
                y: { stacked: true, title: { display: true, text: 'Ore' } }
            },
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, color: '#94a3b8' } }
            }
        }
    });

    let totalSwim = 0, totalBike = 0, totalRun = 0;
    plan.forEach(w => {
        totalSwim += w.totals.swimMin;
        totalBike += w.totals.bikeMin;
        totalRun += w.totals.runMin;
    });

    const ctxDist = document.getElementById('sportDistributionChart').getContext('2d');
    sportDistChart = new Chart(ctxDist, {
        type: 'doughnut',
        data: {
            labels: ['Nuoto', 'Bici', 'Corsa'],
            datasets: [{
                data: [totalSwim, totalBike, totalRun],
                backgroundColor: [SPORT_CONFIG.swim.color, SPORT_CONFIG.bike.color, SPORT_CONFIG.run.color],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, color: '#94a3b8' } }
            },
            cutout: '70%'
        }
    });
}

function toggleChartUnit() {
    const isKm = document.getElementById('chartUnitToggle').checked;
    const lblOre = document.getElementById('label-ore');
    const lblKm = document.getElementById('label-km');
    const plan = getPlan();

    if (isKm) {
        lblOre.classList.remove('fw-bold', 'text-white');
        lblOre.classList.add('text-secondary');
        lblKm.classList.add('fw-bold', 'text-white');
        lblKm.classList.remove('text-secondary');

        document.getElementById('volChartTitle').innerHTML = '<i class="bi bi-bar-chart-fill me-2"></i>Volume Settimanale (km)';
        document.getElementById('distChartTitle').innerHTML = '<i class="bi bi-pie-chart-fill me-2"></i>Distribuzione Sport (km)';
    } else {
        lblKm.classList.remove('fw-bold', 'text-white');
        lblKm.classList.add('text-secondary');
        lblOre.classList.add('fw-bold', 'text-white');
        lblOre.classList.remove('text-secondary');

        document.getElementById('volChartTitle').innerHTML = '<i class="bi bi-bar-chart-fill me-2"></i>Volume Settimanale (Ore)';
        document.getElementById('distChartTitle').innerHTML = '<i class="bi bi-pie-chart-fill me-2"></i>Distribuzione Sport (Ore)';
    }

    if (!volumeChart || !sportDistChart) return;

    volumeChart.data.datasets[0].data = isKm ? plan.map(w => (w.totals.swimM / 1000).toFixed(1)) : plan.map(w => (w.totals.swimMin / 60).toFixed(1));
    volumeChart.data.datasets[1].data = isKm ? plan.map(w => w.totals.bikeKm.toFixed(1)) : plan.map(w => (w.totals.bikeMin / 60).toFixed(1));
    volumeChart.data.datasets[2].data = isKm ? plan.map(w => w.totals.runKm.toFixed(1)) : plan.map(w => (w.totals.runMin / 60).toFixed(1));
    volumeChart.options.scales.y.title.text = isKm ? 'km' : 'Ore';
    volumeChart.update();

    let totalSwim = 0, totalBike = 0, totalRun = 0;
    plan.forEach(w => {
        if (isKm) {
            totalSwim += (w.totals.swimM / 1000);
            totalBike += w.totals.bikeKm;
            totalRun += w.totals.runKm;
        } else {
            totalSwim += w.totals.swimMin;
            totalBike += w.totals.bikeMin;
            totalRun += w.totals.runMin;
        }
    });

    sportDistChart.data.datasets[0].data = isKm
        ? [totalSwim.toFixed(1), totalBike.toFixed(0), totalRun.toFixed(0)]
        : [totalSwim, totalBike, totalRun];
    sportDistChart.update();
}

function renderWeeksGrid() {
    const grid = document.getElementById('weeks-grid');
    grid.innerHTML = '';
    const currentIdx = getCurrentWeekIdx();
    const plan = getPlan();

    plan.forEach((week, idx) => {
        const card = document.createElement('div');
        card.className = `col-12 col-sm-6 col-lg-4 col-xl-3 weeks-grid-item phase-${week.phase}`;
        card.dataset.phase = week.phase;

        const isCurrent = idx === currentIdx;
        const timeStr = formatMin(week.totals.totMin);

        const runKm = week.totals.runKm.toFixed(0);
        const bikeKm = week.totals.bikeKm.toFixed(0);
        const swimKm = (week.totals.swimM / 1000).toFixed(1);

        card.innerHTML = `
            <div class="week-card ${isCurrent ? 'is-current' : ''} phase-${week.phase}" onclick="openWeek(${idx})">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="phase-tag">${week.phase}</span>
                    <div class="d-flex align-items-center gap-2">
                        <span class="week-date-range">${week.dateRange}</span>
                        <span class="week-number">${week.week}${isCurrent ? '<span class="current-badge">NOW</span>' : ''}</span>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-baseline mb-2">
                    <div class="d-flex align-items-baseline gap-1">
                        <span class="week-hours">${timeStr}</span>
                    </div>
                </div>
                
                <div class="split-bar mb-2">
                    ${renderSplitSeg(week.totals.swimMin, week.totals.totMin, 'swim', swimKm > 0 ? `🏊 ${swimKm}km` : '')}
                    ${renderSplitSeg(week.totals.bikeMin, week.totals.totMin, 'bike', bikeKm > 0 ? `🚴 ${bikeKm}km` : '')}
                    ${renderSplitSeg(week.totals.runMin, week.totals.totMin, 'run', runKm > 0 ? `🏃 ${runKm}km` : '')}
                    ${renderSplitSeg(week.totals.otherMin, week.totals.totMin, 'rest', '')}
                </div>

                <div class="day-badges">
                    ${week.days.map(d => {
            const sports = getDaySports(d);
            const mainSport = sports[0];
            const subSport = sports[1] || null;

            return `
                        <div class="day-badge ${d.sport}" title="${d.title}">
                            <div class="db-day">${d.day.charAt(0)}</div>
                            <div class="db-icon">
                                ${SPORT_CONFIG[mainSport] ? SPORT_CONFIG[mainSport].icon : '❓'}
                                ${subSport && SPORT_CONFIG[subSport] ? '<span class="sub-icon">' + SPORT_CONFIG[subSport].icon + '</span>' : ''}
                            </div>
                        </div>`;
        }).join('')}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderSplitSeg(min, total, sport, kmStr = '') {
    if (min <= 0) return '';
    const perc = (min / total) * 100;
    return `<div class="split-seg seg-${sport}" style="width: ${perc}%" title="${kmStr}">${perc > 12 ? kmStr : ''}</div>`;
}

function filterPhase(phase) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === phase || (phase === 'all' && btn.textContent === 'Tutte')) {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('.weeks-grid-item').forEach(card => {
        if (phase === 'all' || card.dataset.phase === phase) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function openWeek(idx) {
    const plan = getPlan();
    if (idx < 0 || idx >= plan.length) return;
    currentWeekIdx = idx;
    const week = plan[idx];
    const year = getRaceDate().getFullYear();

    document.getElementById('modalWeekLabel').textContent = `Settimana ${week.week}`;
    document.getElementById('modalDateRange').textContent = `${week.dateRange} ${year}`;

    const statsRow = document.getElementById('modalStatRow');
    statsRow.innerHTML = `
        <div class="modal-stat-pill pill-swim"><span class="msp-label" style="color: var(--im-swim)">${SPORT_CONFIG.swim.icon}</span> <span class="msp-val">${(week.totals.swimM / 1000).toFixed(1)}km</span></div>
        <div class="modal-stat-pill pill-bike"><span class="msp-label" style="color: var(--im-bike)">${SPORT_CONFIG.bike.icon}</span> <span class="msp-val">${week.totals.bikeKm.toFixed(0)}km</span></div>
        <div class="modal-stat-pill pill-run"><span class="msp-label" style="color: var(--im-run)">${SPORT_CONFIG.run.icon}</span> <span class="msp-val">${week.totals.runKm.toFixed(1)}km</span></div>
        <div class="modal-stat-pill"><span class="msp-label">⏱️</span> <span class="msp-val">${formatMin(week.totals.totMin)}</span></div>
    `;

    document.getElementById('modalTotalMin').textContent = formatMin(week.totals.totMin);

    const zoneBar = document.getElementById('modalZoneBar');
    const t = week.totals;
    zoneBar.innerHTML = `
        ${renderZoneSeg(t.z1, t.totMin, 1)}
        ${renderZoneSeg(t.z2, t.totMin, 2)}
        ${renderZoneSeg(t.z3, t.totMin, 3)}
        ${renderZoneSeg(t.z4, t.totMin, 4)}
        ${renderZoneSeg(t.z5, t.totMin, 5)}
    `;

    const getRaceTableHtml = () => {
        if (isIronman()) {
            return `
            <div class="mt-2 race-estimate-table">
                <table class="w-100" style="font-size: 0.75rem; border-collapse: collapse;">
                    <thead>
                        <tr style="color: rgba(255,255,255,0.4); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em;">
                            <th style="padding: 3px 6px; text-align: left;">Frazione</th>
                            <th style="padding: 3px 6px; text-align: center; color: #86efac;">🎯 Ottimistico</th>
                            <th style="padding: 3px 6px; text-align: center; color: #fcd34d;">🛡️ Conservativo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-top: 1px solid rgba(255,255,255,0.06);">
                            <td style="padding: 4px 6px; color: var(--im-swim);">🏊 Nuoto 1.9km</td>
                            <td style="padding: 4px 6px; text-align: center; color: #86efac;">35min</td>
                            <td style="padding: 4px 6px; text-align: center; color: #fcd34d;">42min</td>
                        </tr>
                        <tr style="border-top: 1px solid rgba(255,255,255,0.06);">
                            <td style="padding: 4px 6px; color: var(--im-bike);">🚴 Bici 90km</td>
                            <td style="padding: 4px 6px; text-align: center; color: #86efac;">2h 30m</td>
                            <td style="padding: 4px 6px; text-align: center; color: #fcd34d;">2h 45m</td>
                        </tr>
                        <tr style="border-top: 1px solid rgba(255,255,255,0.06);">
                            <td style="padding: 4px 6px; color: var(--im-run);">🏃 Corsa 21.1km</td>
                            <td style="padding: 4px 6px; text-align: center; color: #86efac;">1h 45m</td>
                            <td style="padding: 4px 6px; text-align: center; color: #fcd34d;">1h 55m</td>
                        </tr>
                        <tr style="border-top: 1px solid rgba(255,255,255,0.06);">
                            <td style="padding: 4px 6px; color: #cbd5e1;">🔄 Transizioni (T1+T2)</td>
                            <td style="padding: 4px 6px; text-align: center; color: #86efac;">10min</td>
                            <td style="padding: 4px 6px; text-align: center; color: #fcd34d;">20min</td>
                        </tr>
                        <tr style="border-top: 2px solid rgba(255,255,255,0.12); font-weight: 700;">
                            <td style="padding: 5px 6px;">⏱️ Totale stimato</td>
                            <td style="padding: 5px 6px; text-align: center; color: #86efac; font-size: 0.85rem;">~5h 00m</td>
                            <td style="padding: 5px 6px; text-align: center; color: #fcd34d; font-size: 0.85rem;">~5h 42m</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
        } else {
            return `
            <div class="mt-2 race-estimate-table">
                <table class="w-100" style="font-size: 0.75rem; border-collapse: collapse;">
                    <thead>
                        <tr style="color: rgba(255,255,255,0.4); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em;">
                            <th style="padding: 3px 6px; text-align: left;">Frazione</th>
                            <th style="padding: 3px 6px; text-align: center; color: #86efac;">🎯 Ottimistico</th>
                            <th style="padding: 3px 6px; text-align: center; color: #fcd34d;">🛡️ Conservativo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-top: 1px solid rgba(255,255,255,0.06);">
                            <td style="padding: 4px 6px; color: var(--im-run);">🏃 Corsa 42.195km</td>
                            <td style="padding: 4px 6px; text-align: center; color: #86efac;">3h 15m</td>
                            <td style="padding: 4px 6px; text-align: center; color: #fcd34d;">3h 30m</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
        }
    };

    const sessionsDiv = document.getElementById('modalSessions');
    sessionsDiv.innerHTML = `<div class="sessions-grid">${week.days.map(day => `
        <div class="session-detail-block${day.day === 'DOM' ? ' session-full' : ''}">
            <div class="d-flex justify-content-between align-items-start mb-1">
                <span class="sdb-sport" style="color: ${SPORT_CONFIG[day.sport].color}">
                    ${SPORT_CONFIG[day.sport].icon} ${SPORT_CONFIG[day.sport].label} <strong>${day.day}</strong>
                </span>
                <span class="sdb-meta">${day.durationMin > 0 ? formatMin(day.durationMin) : 'Riposo'}</span>
            </div>
            <div class="sdb-title">${day.title}</div>
            <div class="sdb-desc">${highlightZones(day.desc)}</div>
            ${(day.swimM || day.bikeKm || day.runKm) ? '<div class="mt-1 text-info opacity-100" style="font-size:0.85rem;">Distanza: ' + [day.swimM ? '🏊 ' + day.swimM + 'm' : null, day.bikeKm ? '🚴 ' + day.bikeKm + 'km' : null, day.runKm ? '🏃 ' + day.runKm + 'km' : null].filter(Boolean).join(' &nbsp;|&nbsp; ') + '</div>' : ''}
            ${day.sport === 'race' ? getRaceTableHtml() : ''}
        </div>
    `).join('')}</div>`;

    const modal = new bootstrap.Modal(document.getElementById('weekModal'));
    modal.show();
}

function renderZoneSeg(min, total, z) {
    if (min <= 0) return '';
    const perc = (min / total) * 100;
    return `<div class="zone-seg seg-z${z}" style="width: ${perc}%" title="Z${z}: ${formatMin(min)}"></div>`;
}

function formatMin(min) {
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    if (h > 0) {
        return `${h}h${m.toString().padStart(2, '0')}`;
    }
    return `${m}min`;
}

function getDaySports(day) {
    if (!day.desc || !day.desc.includes('|')) return [day.sport];

    const parts = day.desc.split('|');
    return parts.map(p => {
        const text = p.toLowerCase();
        if (text.includes('nuoto')) return 'swim';
        if (text.includes('bici')) return 'bike';
        if (text.includes('corsa')) return 'run';
        if (text.includes('brick') || text.includes('combinato')) return 'brick';
        if (text.includes('riposo')) return 'rest';
        return day.sport;
    });
}

function highlightZones(text) {
    return text.replace(/\bZ([1-5])\b|ritmo\s*gara\s*(?:70\.3)?/gi, (match) => {
        const zMatch = match.match(/[1-5]/);
        const z = zMatch ? zMatch[0] : '3';
        return `<span class="zone-tag z${z}">${match}</span>`;
    });
}

function prevWeek() {
    if (currentWeekIdx > 0) {
        bootstrap.Modal.getInstance(document.getElementById('weekModal')).hide();
        setTimeout(() => openWeek(currentWeekIdx - 1), 150);
    }
}

function nextWeek() {
    const plan = getPlan();
    if (currentWeekIdx < plan.length - 1) {
        bootstrap.Modal.getInstance(document.getElementById('weekModal')).hide();
        setTimeout(() => openWeek(currentWeekIdx + 1), 150);
    }
}
