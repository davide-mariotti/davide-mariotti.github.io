/**
 * running.js v3 — Orchestratore dashboard RunStats.
 * Profilo atleta configurabile: classificazione sessioni, predittore intelligente,
 * trend FC su FL, widget gara personalizzato.
 */

import { onAuthChange, logout } from './auth.js';
import { parseGPX, formatDuration, formatDate } from './parser.js';
import { saveSession, getUserSessions, deleteSession } from './db.js';
import { getProfile } from './profile.js';
import { classifySession, SESSION_TYPE_CONFIG } from './profile.js';
import { renderWeeklyVolume, renderPaceTrend, renderCadenceTrend, renderHRvsPace, renderEasyHRTrend } from './charts.js';

// ================================================================
//  STATO GLOBALE
// ================================================================
let currentUser = null;
let sessionsCache = [];
let userProfile = null;
let activeFilters = { period: 'all', minDist: 0 };

// ================================================================
//  TOAST
// ================================================================
function showToast(message, type = 'success') {
    document.querySelector('.run-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = `run-toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 350); }, 3500);
}

// ================================================================
//  PASSO FORMATTER
// ================================================================
function paceStr(decimal) {
    if (!decimal || decimal <= 0) return '—';
    const min = Math.floor(decimal);
    const sec = Math.round((decimal - min) * 60);
    return `${min}:${String(sec).padStart(2, '0')}`;
}

// ================================================================
//  FILTRI
// ================================================================
function applyFilters(sessions) {
    let filtered = [...sessions];
    if (activeFilters.period !== 'all') {
        const days = { week: 7, month: 30, '3months': 90 }[activeFilters.period];
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        filtered = filtered.filter(s => new Date(s.date) >= cutoff);
    }
    if (activeFilters.minDist > 0) {
        filtered = filtered.filter(s => (s.distance || 0) >= activeFilters.minDist);
    }
    return filtered;
}

function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.filter;
            document.querySelectorAll(`.filter-btn[data-filter="${filterType}"]`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (filterType === 'period') activeFilters.period = btn.dataset.value;
            if (filterType === 'minDist') activeFilters.minDist = parseInt(btn.dataset.value, 10);
            updateFilteredView();
        });
    });
}

function updateFilteredView() {
    const filtered = applyFilters(sessionsCache);
    renderSessionList(filtered);
    renderWeeklyVolume(filtered);
    renderPaceTrend(filtered);
    renderCadenceTrend(filtered);
    renderHRvsPace(filtered);
    // Il grafico FC su FL usa SEMPRE tutte le sessioni (non filtrate per periodo)
    // perché serve vedere il trend storico completo
    renderEasyHRTrend(sessionsCache, userProfile);
}

// ================================================================
//  STAT CARDS
// ================================================================
function renderStats(sessions) {
    const totalKm = sessions.reduce((s, x) => s + (x.distance || 0), 0);
    const totalCount = sessions.length;
    const validPaces = sessions.filter(s => s.paceDecimal > 0).map(s => s.paceDecimal);
    const bestPace = validPaces.length > 0 ? Math.min(...validPaces) : null;
    const oneWeekAgo = new Date(); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekKm = sessions.filter(s => new Date(s.date) >= oneWeekAgo).reduce((a, s) => a + (s.distance || 0), 0);

    document.getElementById('stat-distance').textContent = totalKm.toFixed(1);
    document.getElementById('stat-sessions').textContent = totalCount;
    document.getElementById('stat-best-pace').textContent = bestPace ? paceStr(bestPace) : '—';
    document.getElementById('stat-week-km').textContent = weekKm.toFixed(1);
}

// ================================================================
//  WIDGET GARA OBIETTIVO — adattivo al profilo
// ================================================================
function renderRaceWidget(profile) {
    const section = document.getElementById('race-widget-section');
    if (!section) return;

    if (!profile || !profile.setupCompleted) {
        section.classList.add('d-none');
        return;
    }

    section.classList.remove('d-none');

    // Distanza label
    const distLabels = { 5: '5k', 10: '10k', 21.097: 'Mezza Maratona', 42.195: 'Maratona' };
    const distLabel = distLabels[profile.raceDistance] || `${profile.raceDistance} km`;

    // Countdown
    let countdownHtml = '';
    if (profile.raceDate) {
        const raceDate = new Date(profile.raceDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffMs = raceDate - today;
        const diffDays = Math.ceil(diffMs / 86400000);
        if (diffDays > 0) {
            countdownHtml = `<span class="race-widget-countdown">⏳ ${diffDays} giorni</span>`;
        } else if (diffDays === 0) {
            countdownHtml = `<span class="race-widget-countdown" style="color:var(--color-secondary)">🏅 Oggi!</span>`;
        } else {
            countdownHtml = `<span class="race-widget-countdown" style="opacity:0.5;">✅ Completata</span>`;
        }
    }

    // Passo target + stima tempo
    let paceHtml = '';
    if (profile.raceTargetPace > 0) {
        const targetTimeS = profile.raceTargetPace * 60 * profile.raceDistance;
        const h = Math.floor(targetTimeS / 3600);
        const m = Math.floor((targetTimeS % 3600) / 60);
        const timeStr = h > 0 ? `${h}h ${String(m).padStart(2,'0')}'` : `${m}'`;
        paceHtml = `<span class="race-widget-meta">🎯 ${paceStr(profile.raceTargetPace)}/km · <strong>${timeStr}</strong> obiettivo</span>`;
    }

    // Data formattata
    let dateHtml = '';
    if (profile.raceDate) {
        const d = new Date(profile.raceDate);
        dateHtml = `<span class="race-widget-meta">📅 ${d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>`;
    }

    section.innerHTML = `
        <div class="race-widget glass-panel">
            <div class="race-widget-header">
                <span class="race-widget-icon">🏅</span>
                <div>
                    <div class="race-widget-title">${distLabel}</div>
                    <div class="race-widget-sub">Gara Obiettivo</div>
                </div>
                ${countdownHtml}
            </div>
            <div class="race-widget-details">
                ${dateHtml}
                ${paceHtml}
            </div>
        </div>
    `;
}

// ================================================================
//  RECORD PERSONALI
// ================================================================
function computePRs(sessions) {
    if (sessions.length === 0) return null;
    const byDist = [...sessions].sort((a, b) => b.distance - a.distance);
    const byPace = [...sessions].filter(s => s.paceDecimal > 0).sort((a, b) => a.paceDecimal - b.paceDecimal);
    const byElev = [...sessions].sort((a, b) => b.elevGain - a.elevGain);
    const byCad = [...sessions].filter(s => s.cadAvg > 0).sort((a, b) => b.cadAvg - a.cadAvg);
    return {
        longestRun: byDist[0] || null,
        bestPace: byPace[0] || null,
        mostElevation: byElev[0]?.elevGain > 0 ? byElev[0] : null,
        bestCadence: byCad[0] || null
    };
}

function renderPRs(prs) {
    const container = document.getElementById('pr-section');
    if (!prs) { if (container) container.innerHTML = '<p class="small opacity-40 text-white">Nessun dato ancora.</p>'; return; }

    const cards = [
        prs.longestRun ? prCard('📏', `${prs.longestRun.distance} km`, 'Corsa più lunga', prs.longestRun.date) : null,
        prs.bestPace   ? prCard('⚡', `${prs.bestPace.paceFormatted}/km`, 'Passo migliore', prs.bestPace.date) : null,
        prs.mostElevation ? prCard('⬆️', `${prs.mostElevation.elevGain}m`, 'Più dislivello', prs.mostElevation.date) : null,
        prs.bestCadence ? prCard('🦵', `${prs.bestCadence.cadAvg} spm`, 'Cadenza avg migliore', prs.bestCadence.date) : null
    ].filter(Boolean);

    container.innerHTML = cards.join('');
}

function prCard(icon, value, label, date) {
    const dateStr = date ? new Date(date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) : '';
    return `<div class="col-6 col-md-3">
        <div class="pr-card glass-panel text-center">
            <span class="pr-icon">${icon}</span>
            <span class="pr-value">${value}</span>
            <span class="pr-label">${label}</span>
            <span class="pr-date">${dateStr}</span>
        </div>
    </div>`;
}

// ================================================================
//  ACWR — CARICO ALLENAMENTO
// ================================================================
function computeACWR(sessions) {
    const now = new Date();
    const acuteStart = new Date(now); acuteStart.setDate(now.getDate() - 7);
    const chronicStart = new Date(now); chronicStart.setDate(now.getDate() - 28);

    const acute = sessions.filter(s => new Date(s.date) >= acuteStart)
        .reduce((sum, s) => sum + (s.distance || 0), 0);
    const chronicTotal = sessions.filter(s => new Date(s.date) >= chronicStart)
        .reduce((sum, s) => sum + (s.distance || 0), 0);
    const chronic = chronicTotal / 4;
    const ratio = chronic > 0 ? parseFloat((acute / chronic).toFixed(2)) : null;
    return { acute: parseFloat(acute.toFixed(1)), chronic: parseFloat(chronic.toFixed(1)), ratio };
}

function renderACWR(acwr) {
    const container = document.getElementById('acwr-content');
    if (!acwr) return;

    let ratioColor = '#2ecc71', ratioEmoji = '✅', ratioText = 'Carico ottimale';
    if (acwr.ratio === null) {
        ratioColor = 'rgba(255,255,255,0.4)'; ratioEmoji = '❓'; ratioText = 'Dati insufficienti';
    } else if (acwr.ratio < 0.8) {
        ratioColor = '#95a5a6'; ratioEmoji = '😴'; ratioText = 'Carico basso (detraining)';
    } else if (acwr.ratio > 1.5) {
        ratioColor = '#e74c3c'; ratioEmoji = '🚨'; ratioText = 'Rischio infortuni';
    } else if (acwr.ratio > 1.3) {
        ratioColor = '#f1c40f'; ratioEmoji = '⚠️'; ratioText = 'Attenzione — carico elevato';
    }

    container.innerHTML = `
        <div class="row g-3 align-items-center">
            <div class="col-6 col-md-3">
                <div class="acwr-metric">
                    <div class="acwr-value">${acwr.acute} km</div>
                    <div class="acwr-label">⚡ Carico acuto (7gg)</div>
                </div>
            </div>
            <div class="col-6 col-md-3">
                <div class="acwr-metric">
                    <div class="acwr-value">${acwr.chronic} km</div>
                    <div class="acwr-label">📊 Carico cronico (28gg)</div>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="acwr-ratio-wrap">
                    <div class="acwr-ratio-value" style="color:${ratioColor}">
                        ${acwr.ratio !== null ? acwr.ratio : '—'}
                        <small class="ms-1" style="font-size:0.65rem;opacity:0.7;">ACWR</small>
                    </div>
                    <div class="acwr-status" style="color:${ratioColor}">${ratioEmoji} ${ratioText}</div>
                    <div class="acwr-scale">
                        <div class="acwr-scale-bar">
                            <span class="acwr-zone" style="background:#e74c3c; width:15%;">0–0.8</span>
                            <span class="acwr-zone" style="background:#2ecc71; width:35%;">0.8–1.3</span>
                            <span class="acwr-zone" style="background:#f1c40f; width:15%;">1.3–1.5</span>
                            <span class="acwr-zone" style="background:#e74c3c; width:35%;">1.5+</span>
                        </div>
                        <div class="acwr-pointer" style="left: ${Math.min(acwr.ratio ? (acwr.ratio / 2) * 100 : 0, 98)}%"></div>
                    </div>
                </div>
            </div>
        </div>`;
}

// ================================================================
//  PREDITTORE GARA — intelligente, basato su sessioni FL se profilo presente
// ================================================================
function predictRaceTimes(refPaceDecimal, refDistKm) {
    const refTimeSec = refPaceDecimal * refDistKm * 60;
    const format = (sec) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.round(sec % 60);
        return h > 0 ? `${h}h ${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"` : `${m}'${String(s).padStart(2, '0')}"`;
    };
    const riegel = (D2) => format(refTimeSec * Math.pow(D2 / refDistKm, 1.06));
    return { '5k': riegel(5), '10k': riegel(10), '21k': riegel(21.097), '42k': riegel(42.195) };
}

function renderRacePredictor(sessions, profile) {
    const section = document.getElementById('race-predictor-section');
    const btn = document.getElementById('btn-toggle-predictor');
    const content = document.getElementById('predictor-content');
    const ref = document.getElementById('predictor-ref');
    const results = document.getElementById('predictor-results');
    if (!section) return;

    let refSessions;
    let refLabel;

    if (profile && profile.setupCompleted && profile.hrEasyMax) {
        // Predittore intelligente: usa solo sessioni FL (FC sotto soglia) con dist >= 5km
        const flCandidates = [...sessions]
            .filter(s => s.paceDecimal > 0 && s.distance >= 5 && s.hrAvg > 0 && s.hrAvg <= profile.hrEasyMax)
            .slice(0, 5); // ultime 5 sessioni FL

        if (flCandidates.length >= 2) {
            refSessions = flCandidates;
            refLabel = `Basato su ${refSessions.length} sessione${refSessions.length > 1 ? 'i' : ''} Fondo Lento recente${refSessions.length > 1 ? 'i' : ''} — passo medio`;
        } else {
            // Fallback: qualsiasi sessione >= 5km
            refSessions = [...sessions].filter(s => s.paceDecimal > 0 && s.distance >= 5).slice(0, 3);
            refLabel = `Dati FL insufficienti — basato su ${refSessions.length} sessione${refSessions.length > 1 ? 'i' : ''} recente${refSessions.length > 1 ? 'i' : ''}`;
        }
    } else {
        // Nessun profilo: comportamento originale
        refSessions = [...sessions].filter(s => s.paceDecimal > 0 && s.distance >= 5).slice(0, 3);
        refLabel = `Basato su ${refSessions.length} sessione${refSessions.length > 1 ? 'i' : ''} recente${refSessions.length > 1 ? 'i' : ''} — passo medio`;
    }

    if (refSessions.length === 0) return;
    section.classList.remove('d-none');

    const avgPace = refSessions.reduce((s, x) => s + x.paceDecimal, 0) / refSessions.length;
    const avgDist = refSessions.reduce((s, x) => s + x.distance, 0) / refSessions.length;
    const predictions = predictRaceTimes(avgPace, avgDist);

    if (ref) ref.textContent = `${refLabel} ${paceStr(avgPace)}/km`;

    // Se c'è un profilo, evidenzia la gara obiettivo
    const targetDist = profile?.raceDistance;
    const distKeys = { 5: '5k', 10: '10k', 21.097: '21k', 42.195: '42k' };
    const targetKey = targetDist ? distKeys[targetDist] : null;

    results.innerHTML = [
        raceCard('5k', predictions['5k'], ['🟢', '5.000 m'], targetKey === '5k'),
        raceCard('10k', predictions['10k'], ['🔵', '10.000 m'], targetKey === '10k'),
        raceCard('21k', predictions['21k'], ['🟣', 'Mezza Maratona'], targetKey === '21k'),
        raceCard('42k', predictions['42k'], ['🟠', 'Maratona'], targetKey === '42k'),
    ].join('');

    if (btn && !btn.dataset.listenerAttached) {
        btn.dataset.listenerAttached = '1';
        btn.addEventListener('click', () => {
            const open = !content.classList.contains('d-none');
            content.classList.toggle('d-none', open);
            btn.textContent = open ? '▼ Mostra' : '▲ Nascondi';
        });
    }
}

function raceCard(dist, time, [emoji, label], isTarget = false) {
    const highlight = isTarget ? 'style="border-color:rgba(251,191,36,0.5); background:rgba(251,191,36,0.06);"' : '';
    const targetBadge = isTarget ? '<span style="font-size:0.65rem;background:rgba(251,191,36,0.2);color:rgba(251,191,36,0.9);padding:2px 6px;border-radius:50px;margin-top:4px;display:inline-block;">🎯 Obiettivo</span>' : '';
    return `<div class="col-6 col-md-3">
        <div class="race-card glass-panel text-center" ${highlight}>
            <span class="race-icon">${emoji}</span>
            <span class="race-dist">${dist}</span>
            <span class="race-time">${time}</span>
            <span class="race-label">${label}</span>
            ${targetBadge}
        </div>
    </div>`;
}

// ================================================================
//  SESSION BADGE — classificazione display-only (solo con profilo)
// ================================================================
function buildSessionTypeBadge(session, profile) {
    if (!profile || !profile.setupCompleted) return '';
    const type = classifySession(session, profile);
    const cfg = SESSION_TYPE_CONFIG[type];
    if (!cfg || !cfg.label) return '';
    return `<span class="session-type-badge" style="
        background: ${cfg.bg};
        border: 1px solid ${cfg.border};
        color: ${cfg.color};
    ">${cfg.emoji} ${cfg.label}</span>`;
}

// ================================================================
//  SESSION LIST
// ================================================================
function renderSessionCard(session) {
    const card = document.createElement('div');
    card.className = 'session-card';
    card.dataset.id = session.id;
    card.style.cursor = 'pointer';

    const hrStr = session.hrAvg ? `❤️ ${session.hrAvg} bpm` : '';
    const elevStr = session.elevGain ? `⬆️ ${session.elevGain}m` : '';
    const paceStrFmt = session.paceFormatted ? `👟 ${session.paceFormatted}/km` : '';
    const durationStr = session.duration ? `⏱ ${formatDuration(session.duration)}` : '';
    const cadStr = session.cadAvg ? `🦵 ${session.cadAvg} spm` : '';
    const tempStr = session.tempAvg !== null && session.tempAvg !== undefined ? `🌡️ ${session.tempAvg}°C` : '';

    const metas = [durationStr, paceStrFmt, hrStr, elevStr, cadStr, tempStr].filter(Boolean);
    const typeBadge = buildSessionTypeBadge(session, userProfile);

    card.innerHTML = `
        <div class="session-date-col">${formatDate(session.date)}</div>
        <div class="d-flex flex-column flex-grow-1 min-w-0">
            <div class="session-name-row">
                <span class="session-name">${session.name || 'Corsa'}</span>
                ${typeBadge}
            </div>
            <div class="session-meta">${metas.map(m => `<span class="meta-item">${m}</span>`).join('')}</div>
        </div>
        <div class="session-distance">${(session.distance || 0).toFixed(2)}<span> km</span></div>
        <button class="btn-delete" title="Elimina" aria-label="Elimina sessione">🗑️</button>
    `;

    card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete')) return;
        window.location.href = `/running/session.html?id=${session.id}`;
    });

    card.querySelector('.btn-delete').addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm(`Eliminare "${session.name || 'Corsa'}"?`)) return;
        try {
            await deleteSession(currentUser.uid, session.id);
            card.style.transition = 'opacity 0.3s, transform 0.3s';
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            setTimeout(() => card.remove(), 300);
            sessionsCache = sessionsCache.filter(s => s.id !== session.id);
            renderStats(sessionsCache);
            renderPRs(computePRs(sessionsCache));
            renderACWR(computeACWR(sessionsCache));
            updateFilteredView();
            showToast('🗑️ Sessione eliminata');
        } catch (err) {
            showToast('❌ Impossibile eliminare la sessione', 'error');
        }
    });

    return card;
}

function renderSessionList(sessions) {
    const container = document.getElementById('sessions-list');
    const emptyState = document.getElementById('empty-state');
    container.innerHTML = '';
    if (sessions.length === 0) { emptyState?.classList.remove('d-none'); return; }
    emptyState?.classList.add('d-none');
    sessions.forEach(s => container.appendChild(renderSessionCard(s)));
}

// ================================================================
//  CARICA E RENDERIZZA TUTTO
// ================================================================
async function loadAndRender() {
    const container = document.getElementById('sessions-list');
    container.innerHTML = '<div class="sessions-loading">⏳ Caricamento sessioni...</div>';
    try {
        sessionsCache = await getUserSessions(currentUser.uid);
        renderStats(sessionsCache);
        renderPRs(computePRs(sessionsCache));
        renderACWR(computeACWR(sessionsCache));
        renderRaceWidget(userProfile);
        renderRacePredictor(sessionsCache, userProfile);
        updateFilteredView();
    } catch (err) {
        console.error('Errore caricamento:', err);
        container.innerHTML = '<div class="sessions-loading">❌ Errore nel caricamento. Riprova.</div>';
    }
}

// ================================================================
//  EXPORT CSV
// ================================================================
function exportToCSV(sessions) {
    const headers = ['Nome', 'Data', 'Tipo', 'Distanza (km)', 'Durata (s)', 'Passo', 'FC Media', 'FC Max', 'FC Min', 'Cadenza Avg (spm)', 'Vel Avg (km/h)', 'Dislivello+(m)', 'Dislivello-(m)', 'Alt Min(m)', 'Alt Max(m)', 'Temp(°C)', 'Lat', 'Lon', 'Splits N'];
    const rows = sessions.map(s => [
        s.name || '', s.date ? new Date(s.date).toLocaleDateString('it-IT') : '', s.activityType || '',
        s.distance || 0, s.duration || 0, s.paceFormatted || '',
        s.hrAvg || '', s.hrMax || '', s.hrMin || '',
        s.cadAvg || '', s.speedAvg || '',
        s.elevGain || 0, s.elevLoss || 0,
        s.altMin ?? '', s.altMax ?? '',
        s.tempAvg ?? '', s.startLat ?? '', s.startLon ?? '',
        s.totalSplits || 0
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `runstats_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast('📥 CSV esportato!');
}

// ================================================================
//  UPLOAD GPX
// ================================================================
function handleFile(file) {
    if (!file || !file.name.toLowerCase().endsWith('.gpx')) {
        showToast('⚠️ Carica un file .gpx valido', 'error'); return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
        const dropZone = document.getElementById('drop-zone');
        const btnUpload = document.getElementById('btn-upload');
        try {
            dropZone.classList.add('uploading');
            if (btnUpload) btnUpload.textContent = '⏳ Analisi in corso...';
            const session = parseGPX(e.target.result, file.name);
            const sessionId = await saveSession(currentUser.uid, session);
            const newSession = { id: sessionId, ...session };
            sessionsCache = [newSession, ...sessionsCache];
            renderStats(sessionsCache);
            renderPRs(computePRs(sessionsCache));
            renderACWR(computeACWR(sessionsCache));
            renderRaceWidget(userProfile);
            renderRacePredictor(sessionsCache, userProfile);
            updateFilteredView();
            showToast(`✅ "${session.name}" importata — ${session.distance} km`);
        } catch (err) {
            showToast(`❌ ${err.message || 'Errore nel parsing del file GPX'}`, 'error');
        } finally {
            dropZone.classList.remove('uploading');
            if (btnUpload) btnUpload.textContent = '📤 Carica file GPX';
            document.getElementById('file-input').value = '';
        }
    };
    reader.readAsText(file);
}

function initUploadZone() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const btnUpload = document.getElementById('btn-upload');
    btnUpload?.addEventListener('click', () => fileInput.click());
    dropZone?.addEventListener('click', (e) => { if (e.target === btnUpload) return; fileInput.click(); });
    fileInput?.addEventListener('change', (e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); });
    dropZone?.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone?.addEventListener('drop', (e) => {
        e.preventDefault(); dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files?.[0]; if (file) handleFile(file);
    });
}

// ================================================================
//  INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    onAuthChange(async (user) => {
        if (!user) { window.location.href = '/running/login.html'; return; }
        currentUser = user;

        // Carica profilo
        try {
            userProfile = await getProfile(user.uid);
        } catch (err) {
            console.warn('Impossibile caricare profilo:', err);
            userProfile = null;
        }

        // Primo accesso senza profilo → redirect setup
        if (!userProfile || !userProfile.setupCompleted) {
            window.location.href = '/running/profile.html?first=1';
            return;
        }

        const avatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        if (avatar && user.photoURL) avatar.src = user.photoURL;
        if (userName) userName.textContent = user.displayName || user.email;

        document.getElementById('loading-section').style.display = 'none';
        document.getElementById('auth-section').style.display = 'block';

        initFilters();
        initUploadZone();

        document.getElementById('btn-logout')?.addEventListener('click', async () => {
            await logout(); window.location.href = '/running/login.html';
        });
        document.getElementById('btn-export-csv')?.addEventListener('click', () => {
            exportToCSV(applyFilters(sessionsCache));
        });
        document.getElementById('btn-edit-profile')?.addEventListener('click', () => {
            window.location.href = '/running/profile.html';
        });

        await loadAndRender();
    });
});
