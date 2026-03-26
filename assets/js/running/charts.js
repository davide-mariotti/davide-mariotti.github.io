/**
 * charts.js — Rendering grafici con Chart.js (caricato come globale nell'HTML).
 * Dipende da window.Chart globale.
 */

const CHART_COLORS = {
    primary: '#228b22',
    secondary: '#2ecc71',
    primaryFade: 'rgba(34, 139, 34, 0.6)',
    secondaryFade: 'rgba(46, 204, 113, 0.15)',
    grid: 'rgba(255, 255, 255, 0.06)',
    tick: 'rgba(255, 255, 255, 0.6)'
};

function paceLabel(v) {
    const min = Math.floor(v);
    const sec = Math.round((v - min) * 60);
    return `${min}:${String(sec).padStart(2, '0')}`;
}

/**
 * Renderizza un bar chart con il volume km/settimana (ultime 12 settimane).
 */
export function renderWeeklyVolume(sessions, canvasId = 'chart-weekly') {
    const ctx = document.getElementById(canvasId);
    if (!ctx || !window.Chart) return;

    const weeks = [];
    const volumes = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
        const wStart = new Date(now);
        wStart.setDate(now.getDate() - (i + 1) * 7);
        wStart.setHours(0, 0, 0, 0);

        const wEnd = new Date(now);
        wEnd.setDate(now.getDate() - i * 7);
        wEnd.setHours(0, 0, 0, 0); // esclusivo: inizio del periodo successivo

        const label = `${wStart.getDate()}/${wStart.getMonth() + 1}`;
        const vol = sessions
            .filter(s => {
                const d = new Date(s.date);
                return d >= wStart && d < wEnd; // < strict: no overlap tra settimane
            })
            .reduce((sum, s) => sum + (s.distance || 0), 0);

        weeks.push(label);
        volumes.push(parseFloat(vol.toFixed(1)));
    }

    if (window._chartWeekly) window._chartWeekly.destroy();

    window._chartWeekly = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeks,
            datasets: [{
                label: 'km',
                data: volumes,
                backgroundColor: CHART_COLORS.primaryFade,
                borderColor: CHART_COLORS.secondary,
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(5, 20, 10, 0.9)',
                    borderColor: CHART_COLORS.primary,
                    borderWidth: 1,
                    titleColor: CHART_COLORS.secondary,
                    bodyColor: '#fff',
                    callbacks: {
                        label: c => `${c.parsed.y} km`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: CHART_COLORS.grid },
                    ticks: { color: CHART_COLORS.tick, font: { size: 10 } }
                },
                y: {
                    grid: { color: CHART_COLORS.grid },
                    ticks: {
                        color: CHART_COLORS.tick,
                        callback: v => `${v} km`
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// =====================================================================
//  NUOVI GRAFICI v2
// =====================================================================

const TOOLTIP_STYLE = {
    backgroundColor: 'rgba(5, 20, 10, 0.9)',
    borderColor: CHART_COLORS.primary,
    borderWidth: 1,
    titleColor: CHART_COLORS.secondary,
    bodyColor: '#fff'
};

/** Trend cadenza media per sessione con linea di riferimento 170 spm. */
export function renderCadenceTrend(sessions, canvasId = 'chart-cadence') {
    const ctx = document.getElementById(canvasId);
    if (!ctx || !window.Chart) return;
    const recent = [...sessions].filter(s => s.cadAvg > 0).reverse().slice(-20);
    if (recent.length < 1) {
        ctx.style.display = 'none';
        ctx.closest('.chart-panel')?.querySelector('.chart-empty')?.classList.remove('d-none');
        return;
    }
    const labels = recent.map(s => { const d = new Date(s.date); return `${d.getDate()}/${d.getMonth() + 1}`; });
    if (window._chartCadence) window._chartCadence.destroy();
    window._chartCadence = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'Cadenza', data: recent.map(s => s.cadAvg), borderColor: CHART_COLORS.secondary, backgroundColor: CHART_COLORS.secondaryFade, pointBackgroundColor: CHART_COLORS.primary, pointRadius: 4, tension: 0.3, fill: true },
                { label: 'Ottimale', data: new Array(labels.length).fill(170), borderColor: 'rgba(255,200,80,0.5)', borderDash: [5, 5], pointRadius: 0, fill: false }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: true,
            plugins: { legend: { display: false }, tooltip: { ...TOOLTIP_STYLE, callbacks: { label: c => c.datasetIndex === 0 ? `🦵 ${c.parsed.y} spm` : `📍 ${c.parsed.y} spm (ref)` } } },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.tick, font: { size: 10 } } },
                y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.tick, callback: v => `${v}` } }
            }
        }
    });
}

/** Trend FC media per sessione (ultime 20). */
export function renderHRTrend(sessions, canvasId = 'chart-hr') {
    const ctx = document.getElementById(canvasId);
    if (!ctx || !window.Chart) return;
    const recent = [...sessions].filter(s => s.hrAvg > 0).reverse().slice(-20);
    if (recent.length < 2) {
        ctx.style.display = 'none';
        ctx.closest('.chart-panel')?.querySelector('.chart-empty')?.classList.remove('d-none');
        return;
    }
    const labels = recent.map(s => { const d = new Date(s.date); return `${d.getDate()}/${d.getMonth() + 1}`; });
    if (window._chartHR) window._chartHR.destroy();
    window._chartHR = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: 'FC media', data: recent.map(s => s.hrAvg), borderColor: '#e74c3c', backgroundColor: 'rgba(231,76,60,0.12)', pointBackgroundColor: '#c0392b', pointRadius: 4, tension: 0.3, fill: true }] },
        options: {
            responsive: true, maintainAspectRatio: true,
            plugins: { legend: { display: false }, tooltip: { ...TOOLTIP_STYLE, callbacks: { label: c => `❤️ ${c.parsed.y} bpm` } } },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.tick, font: { size: 10 } } },
                y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.tick, callback: v => `${v}` } }
            }
        }
    });
}

/** Scatter: FC media vs passo. Mostra efficienza aerobica nel tempo. */
export function renderHRvsPace(sessions, canvasId = 'chart-hrpace') {
    const ctx = document.getElementById(canvasId);
    if (!ctx || !window.Chart) return;
    const data = sessions.filter(s => s.hrAvg > 0 && s.paceDecimal > 0).map(s => ({ x: s.paceDecimal, y: s.hrAvg }));
    if (data.length < 2) {
        ctx.style.display = 'none';
        ctx.closest('.chart-panel')?.querySelector('.chart-empty')?.classList.remove('d-none');
        return;
    }
    if (window._chartHRPace) window._chartHRPace.destroy();
    window._chartHRPace = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: [{ data, backgroundColor: CHART_COLORS.primaryFade, borderColor: CHART_COLORS.secondary, pointRadius: 6, pointHoverRadius: 8 }] },
        options: {
            responsive: true, maintainAspectRatio: true,
            plugins: { legend: { display: false }, tooltip: { ...TOOLTIP_STYLE, callbacks: { label: c => `${paceLabel(c.parsed.x)}/km · ❤️ ${c.parsed.y} bpm` } } },
            scales: {
                x: { title: { display: true, text: 'Passo', color: 'rgba(255,255,255,0.5)', font: { size: 10 } }, grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.tick, font: { size: 10 }, callback: v => paceLabel(v) } },
                y: { title: { display: true, text: 'FC (bpm)', color: 'rgba(255,255,255,0.5)', font: { size: 10 } }, grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.tick } }
            }
        }
    });
}

/** Bar chart splits per km (pagina dettaglio). Verde = più veloce della media, arancione = più lento. */
export function renderSplitsChart(splits, canvasId = 'chart-splits') {
    const ctx = document.getElementById(canvasId);
    if (!ctx || !window.Chart || !splits?.length) return;
    const paces = splits.map(s => {
        const parts = s.pace.split(':').map(Number);
        return parseFloat((parts[0] + (parts[1] || 0) / 60).toFixed(4));
    });
    const avg = paces.reduce((a, b) => a + b, 0) / paces.length;
    if (window._chartSplits) window._chartSplits.destroy();
    window._chartSplits = new Chart(ctx, {
        data: {
            labels: splits.map(s => `km ${s.km}`),
            datasets: [
                { type: 'bar', label: 'Passo', data: paces, backgroundColor: paces.map(p => p <= avg ? 'rgba(46,204,113,0.75)' : 'rgba(255,120,60,0.65)'), borderWidth: 0, borderRadius: 4, order: 2 },
                { type: 'line', label: 'Media', data: new Array(splits.length).fill(avg), borderColor: 'rgba(255,200,80,0.7)', borderDash: [4, 4], pointRadius: 0, fill: false, order: 1 }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false }, tooltip: { ...TOOLTIP_STYLE, callbacks: { label: c => c.datasetIndex === 1 ? `Media: ${paceLabel(c.parsed.y)}/km` : `${paceLabel(c.parsed.y)}/km` } } },
            scales: {
                y: { reverse: true, grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.tick, callback: v => paceLabel(v) } },
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.tick, font: { size: 10 } } }
            }
        }
    });
}
/**
 * Renderizza un line chart con il trend del passo medio (ultime 20 sessioni).
 */
export function renderPaceTrend(sessions, canvasId = 'chart-pace') {
    const ctx = document.getElementById(canvasId);
    if (!ctx || !window.Chart) return;

    // Ultime 20 sessioni in ordine cronologico
    const recent = [...sessions]
        .filter(s => s.paceDecimal && s.paceDecimal > 0)
        .reverse()
        .slice(-20);

    if (recent.length < 2) {
        ctx.parentElement.querySelector('.chart-empty')?.classList.remove('d-none');
        return;
    }

    const labels = recent.map(s => {
        const d = new Date(s.date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
    });

    const paces = recent.map(s => s.paceDecimal);

    if (window._chartPace) window._chartPace.destroy();

    window._chartPace = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Passo (min/km)',
                data: paces,
                borderColor: CHART_COLORS.secondary,
                backgroundColor: CHART_COLORS.secondaryFade,
                pointBackgroundColor: CHART_COLORS.primary,
                pointBorderColor: CHART_COLORS.secondary,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.35,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(5, 20, 10, 0.9)',
                    borderColor: CHART_COLORS.primary,
                    borderWidth: 1,
                    titleColor: CHART_COLORS.secondary,
                    bodyColor: '#fff',
                    callbacks: {
                        label: c => `⏱ ${paceLabel(c.parsed.y)} /km`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: CHART_COLORS.grid },
                    ticks: { color: CHART_COLORS.tick, font: { size: 10 } }
                },
                y: {
                    reverse: true, // passo più basso = più veloce = meglio (in alto)
                    grid: { color: CHART_COLORS.grid },
                    ticks: {
                        color: CHART_COLORS.tick,
                        callback: v => paceLabel(v)
                    }
                }
            }
        }
    });
}
