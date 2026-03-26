/**
 * session.js — Logica pagina dettaglio sessione singola.
 * Legge ?id=... dall'URL, carica da Firestore, renderizza splits, mappa, zone FC.
 */

import { onAuthChange } from './auth.js';
import { getSession } from './db.js';
import { formatDuration, formatDate } from './parser.js';
import { renderSplitsChart } from './charts.js';

// ================================================================
// UTILITIES
// ================================================================
function paceDecToStr(dec) {
    if (!dec || dec <= 0) return '--:--';
    const min = Math.floor(dec);
    const sec = Math.round((dec - min) * 60);
    return `${min}:${String(sec).padStart(2, '0')}`;
}

function statCard(icon, value, label) {
    return `<div class="col-6 col-md-4 col-lg-2">
        <div class="stat-card glass-panel">
            <span class="stat-icon">${icon}</span>
            <span class="stat-value">${value}</span>
            <span class="stat-label">${label}</span>
        </div>
    </div>`;
}

// ================================================================
// RENDER HERO
// ================================================================
function renderHero(session) {
    document.getElementById('s-name').textContent = session.name || 'Corsa';

    const type = session.activityType ? `🏷️ ${session.activityType} · ` : '';
    document.getElementById('s-meta').textContent = `${type}📅 ${formatDate(session.date)}`;

    document.getElementById('s-distance').innerHTML =
        `${(session.distance || 0).toFixed(2)} <small>km</small>`;

    const durStr = session.duration ? formatDuration(session.duration) : '—';
    const paceStr = session.paceFormatted ? `👟 ${session.paceFormatted}/km` : '—';
    document.getElementById('s-duration-pace').textContent = `⏱ ${durStr} · ${paceStr}`;
}

// ================================================================
// RENDER STATS GRID
// ================================================================
function renderStatsGrid(session) {
    const grid = document.getElementById('stats-grid');
    const cards = [
        session.hrAvg   ? statCard('❤️', session.hrAvg, 'FC media') : '',
        session.hrMax   ? statCard('🔴', session.hrMax, 'FC massima') : '',
        session.hrMin   ? statCard('💙', session.hrMin, 'FC minima') : '',
        session.cadAvg  ? statCard('🦵', `${session.cadAvg}`, 'cad. avg (spm)') : '',
        session.speedAvg ? statCard('⚡', `${session.speedAvg}`, 'km/h media') : '',
        session.speedMax ? statCard('🚀', `${session.speedMax}`, 'km/h max') : '',
        session.elevGain ? statCard('⬆️', `${session.elevGain}m`, 'dislivello +') : '',
        session.elevLoss ? statCard('⬇️', `${session.elevLoss}m`, 'dislivello -') : '',
        session.altMax !== null && session.altMax !== undefined ? statCard('⛰️', `${session.altMax}m`, 'altitudine max') : '',
        session.tempAvg !== null && session.tempAvg !== undefined ? statCard('🌡️', `${session.tempAvg}°C`, 'temperatura') : '',
    ].filter(Boolean);

    grid.innerHTML = cards.join('');
}

// ================================================================
// RENDER SPLITS TABLE
// ================================================================
function renderSplitsTable(splits, avgPaceDecimal) {
    if (!splits || splits.length === 0) {
        document.getElementById('splits-empty')?.classList.remove('d-none');
        document.getElementById('splits-table')?.classList.add('d-none');
        return;
    }

    const tbody = document.getElementById('splits-tbody');
    const avgDec = avgPaceDecimal || 0;

    tbody.innerHTML = splits.map(s => {
        const splitDec = (() => {
            const parts = s.pace.split(':').map(Number);
            return parts[0] + (parts[1] || 0) / 60;
        })();
        const isFaster = avgDec > 0 && splitDec <= avgDec;
        const rowClass = isFaster ? 'split-fast' : 'split-slow';
        const indicator = isFaster ? '🟢' : '🔴';

        return `<tr class="${rowClass}">
            <td>${indicator} <strong>km ${s.km}</strong></td>
            <td>${s.pace}/km</td>
            <td>${s.hrAvg ? s.hrAvg + ' bpm' : '—'}</td>
            <td>${s.elevGain ? '+' + s.elevGain + 'm' : '—'}</td>
            <td>${s.duration ? formatDuration(s.duration) : '—'}</td>
        </tr>`;
    }).join('');
}

// ================================================================
// RENDER HR ZONES
// ================================================================
const HR_ZONES = [
    { name: 'Z1 Recupero',   min: 0,    max: 0.60, color: '#3498db' },
    { name: 'Z2 Aerobico',   min: 0.60, max: 0.70, color: '#2ecc71' },
    { name: 'Z3 Tempo',      min: 0.70, max: 0.80, color: '#f1c40f' },
    { name: 'Z4 Soglia',     min: 0.80, max: 0.90, color: '#e67e22' },
    { name: 'Z5 Anaerobico', min: 0.90, max: 1.00, color: '#e74c3c' }
];

function renderHRZones(session) {
    if (!session.hrAvg || !session.hrMax || !session.splits?.length) {
        document.getElementById('hr-zones-empty')?.classList.remove('d-none');
        document.getElementById('hr-zones-bar')?.classList.add('d-none');
        document.getElementById('hr-zones-legend')?.classList.add('d-none');
        return;
    }

    // Stima HR max reale (session hrMax ≈ 95% del vero max)
    const estimatedMax = Math.round(session.hrMax / 0.95);
    document.getElementById('hr-zones-ref').textContent = `(FC max stimata: ${estimatedMax} bpm)`;

    const zoneTimes = HR_ZONES.map(z => ({ ...z, duration: 0 }));

    session.splits.forEach(split => {
        if (!split.hrAvg) return;
        const pct = split.hrAvg / estimatedMax;
        const zone = zoneTimes.find(z => pct >= z.min && pct < z.max) || zoneTimes[4];
        zone.duration += split.duration || 0;
    });

    const total = zoneTimes.reduce((s, z) => s + z.duration, 0);
    zoneTimes.forEach(z => { z.pct = total > 0 ? Math.round((z.duration / total) * 100) : 0; });

    // Barra stacked
    const bar = document.getElementById('hr-zones-bar');
    bar.innerHTML = zoneTimes
        .filter(z => z.pct > 0)
        .map(z => `<div class="hz-segment" style="width:${z.pct}%; background:${z.color};" title="${z.name}: ${z.pct}%"></div>`)
        .join('');

    // Legenda
    const legend = document.getElementById('hr-zones-legend');
    legend.innerHTML = zoneTimes.map(z => `
        <span class="hz-legend-item">
            <span class="hz-dot" style="background:${z.color}"></span>
            <span>${z.name} <strong>${z.pct}%</strong></span>
        </span>
    `).join('');
}

// ================================================================
// RENDER MAP (Leaflet)
// ================================================================
function renderMap(lat, lon) {
    if (!lat || !lon) {
        document.getElementById('map-empty')?.classList.remove('d-none');
        document.getElementById('session-map')?.classList.add('d-none');
        return;
    }

    if (typeof L === 'undefined') return;

    const map = L.map('session-map', { zoomControl: true, scrollWheelZoom: false })
        .setView([lat, lon], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(map);

    // Marker animato verde
    const icon = L.divIcon({
        className: '',
        html: '<div style="width:16px;height:16px;background:#2ecc71;border:3px solid #228b22;border-radius:50%;box-shadow:0 0 10px #2ecc71;"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
    L.marker([lat, lon], { icon }).addTo(map).bindPopup('🏁 Punto di partenza');
}

// ================================================================
// INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    const sessionId = new URLSearchParams(window.location.search).get('id');
    if (!sessionId) { window.location.href = '/running/'; return; }

    onAuthChange(async (user) => {
        if (!user) { window.location.href = '/running/login.html'; return; }

        try {
            const session = await getSession(user.uid, sessionId);

            document.getElementById('loading-section').style.display = 'none';
            document.getElementById('session-content').style.display = 'block';

            // Aggiorna titolo pagina
            document.title = `RunStats | ${session.name || 'Sessione'}`;

            renderHero(session);
            renderStatsGrid(session);

            if (session.splits?.length > 0) {
                renderSplitsChart(session.splits, 'chart-splits');
                renderSplitsTable(session.splits, session.paceDecimal);
            } else {
                document.getElementById('splits-chart-empty')?.classList.remove('d-none');
                document.getElementById('splits-empty')?.classList.remove('d-none');
            }

            renderHRZones(session);
            renderMap(session.startLat, session.startLon);

        } catch (err) {
            console.error('Errore caricamento sessione:', err);
            document.getElementById('loading-section').style.display = 'none';
            document.getElementById('error-section')?.classList.remove('d-none');
        }
    });
});
