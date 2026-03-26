/**
 * Converte gradi in radianti.
 */
function toRad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Calcola la distanza tra due coordinate GPS in km (formula Haversine).
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Estrae il valore di un'estensione Garmin da un trackpoint dato il localName del tag.
 * Gestisce tutti i namespace (ns3:, gpxtpx:, ecc.)
 */
function getExtValue(trkpt, localName) {
    const extensions = trkpt.querySelector('extensions');
    if (!extensions) return null;
    for (const el of extensions.querySelectorAll('*')) {
        if (el.localName === localName) return el.textContent.trim();
    }
    return null;
}

function getHR(trkpt) {
    const raw = getExtValue(trkpt, 'hr');
    if (raw === null) return null;
    const val = parseInt(raw, 10);
    return (val > 30 && val < 250) ? val : null;
}

function getCadence(trkpt) {
    const raw = getExtValue(trkpt, 'cad');
    if (raw === null) return null;
    const val = parseInt(raw, 10);
    // Garmin GPX salva cadenza in strides/min → *2 per steps/min
    return (val > 0 && val < 150) ? val * 2 : null;
}

function getTemp(trkpt) {
    const raw = getExtValue(trkpt, 'atemp');
    if (raw === null) return null;
    const val = parseFloat(raw);
    return (val > -50 && val < 60) ? val : null;
}

/**
 * Calcola passo (decimal e formattato) da distanza e secondi.
 */
function calcPace(distKm, durationSec) {
    if (distKm <= 0) return { decimal: 0, formatted: '--:--' };
    const dec = (durationSec / 60) / distKm;
    const min = Math.floor(dec);
    const sec = Math.round((dec - min) * 60);
    return { decimal: parseFloat(dec.toFixed(4)), formatted: `${min}:${String(sec).padStart(2, '0')}` };
}

/**
 * Parsa un file GPX Garmin ed estrae il massimo di informazioni disponibili.
 * @param {string} xmlString - Contenuto del file GPX
 * @param {string} fileName  - Nome del file (fallback per il nome sessione)
 * @returns {Object} sessione completa con tutti i dati estratti
 */
export function parseGPX(xmlString, fileName = 'Corsa') {
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(xmlString, 'application/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) throw new Error('File GPX non valido o corrotto.');

    const trkpts = doc.querySelectorAll('trkpt');
    if (trkpts.length < 2) throw new Error('Nessun trackpoint trovato. Il file deve essere un\'attività GPS registrata.');

    // ── Metadati base ────────────────────────────────────────────────────────
    const name =
        doc.querySelector('trk name')?.textContent?.trim() ||
        doc.querySelector('metadata name')?.textContent?.trim() ||
        fileName.replace(/\.gpx$/i, '');

    const activityType = doc.querySelector('trk type')?.textContent?.trim() || null;

    const startTimeStr =
        doc.querySelector('metadata time')?.textContent ||
        trkpts[0].querySelector('time')?.textContent;
    const startTime = startTimeStr ? new Date(startTimeStr) : new Date();

    // ── Coordinate di partenza ───────────────────────────────────────────────
    const startLat = parseFloat(trkpts[0].getAttribute('lat'));
    const startLon = parseFloat(trkpts[0].getAttribute('lon'));

    // ── Accumulatori ─────────────────────────────────────────────────────────
    let totalDistance = 0;
    let elevGain = 0, elevLoss = 0;
    let altMin = Infinity, altMax = -Infinity;

    let hrSum = 0, hrMin = 999, hrMax = 0, hrCount = 0;
    let cadSum = 0, cadMax = 0, cadCount = 0;
    let tempSum = 0, tempMin = 999, tempMax = -999, tempCount = 0;
    let speedMax = 0;

    // ── Splits per km ────────────────────────────────────────────────────────
    const splits = [];
    let splitDist = 0, splitStartTime = startTime;
    let splitHrSum = 0, splitHrCount = 0, splitElevGain = 0;
    let kmCounter = 1;

    let prevLat = null, prevLon = null, prevEle = null, prevTime = null;

    trkpts.forEach(pt => {
        const lat = parseFloat(pt.getAttribute('lat'));
        const lon = parseFloat(pt.getAttribute('lon'));
        const ele = parseFloat(pt.querySelector('ele')?.textContent ?? 0);
        const timeStr = pt.querySelector('time')?.textContent;
        const ptTime = timeStr ? new Date(timeStr) : null;

        const hr = getHR(pt);
        const cad = getCadence(pt);
        const temp = getTemp(pt);

        // ── HR ───────────────────────────────────────────────────────────────
        if (hr !== null) {
            hrSum += hr; hrMax = Math.max(hrMax, hr); hrMin = Math.min(hrMin, hr); hrCount++;
            splitHrSum += hr; splitHrCount++;
        }
        // ── Cadenza ──────────────────────────────────────────────────────────
        if (cad !== null) { cadSum += cad; cadMax = Math.max(cadMax, cad); cadCount++; }
        // ── Temperatura ──────────────────────────────────────────────────────
        if (temp !== null) {
            tempSum += temp; tempMin = Math.min(tempMin, temp); tempMax = Math.max(tempMax, temp); tempCount++;
        }
        // ── Altitudine ───────────────────────────────────────────────────────
        if (!isNaN(ele)) { altMin = Math.min(altMin, ele); altMax = Math.max(altMax, ele); }

        if (prevLat !== null) {
            const segDist = haversineDistance(prevLat, prevLon, lat, lon);

            // Filtra salti GPS irrealistici (> 200m tra due punti = glitch)
            if (segDist < 0.2) {
                totalDistance += segDist;
                splitDist += segDist;

                // ── Velocità massima ─────────────────────────────────────────
                if (ptTime && prevTime) {
                    const segSec = (ptTime - prevTime) / 1000;
                    if (segSec > 0) {
                        const segSpeedKmh = (segDist / segSec) * 3600;
                        if (segSpeedKmh < 50) speedMax = Math.max(speedMax, segSpeedKmh);
                    }
                }

                // ── Chiudi split ogni km ─────────────────────────────────────
                if (splitDist >= 1.0) {
                    const splitEndTime = ptTime || prevTime;
                    const splitSec = splitEndTime ? (splitEndTime - splitStartTime) / 1000 : 0;
                    const { formatted: splitPace } = calcPace(splitDist, splitSec);
                    splits.push({
                        km: kmCounter,
                        distance: parseFloat(splitDist.toFixed(3)),
                        duration: Math.round(splitSec),
                        pace: splitPace,
                        hrAvg: splitHrCount > 0 ? Math.round(splitHrSum / splitHrCount) : null,
                        elevGain: Math.round(splitElevGain)
                    });
                    kmCounter++;
                    splitDist = 0; splitStartTime = ptTime || splitStartTime;
                    splitHrSum = 0; splitHrCount = 0; splitElevGain = 0;
                }
            }

            // ── Dislivello ───────────────────────────────────────────────────
            if (prevEle !== null && !isNaN(ele)) {
                const diff = ele - prevEle;
                if (diff > 0.5) { elevGain += diff; splitElevGain += diff; }
                else if (diff < -0.5) elevLoss += Math.abs(diff);
            }
        }

        prevLat = lat; prevLon = lon; prevEle = ele; prevTime = ptTime;
    });

    // ── Durata totale ────────────────────────────────────────────────────────
    const lastTimeStr = trkpts[trkpts.length - 1].querySelector('time')?.textContent;
    const endTime = lastTimeStr ? new Date(lastTimeStr) : null;
    const durationSec = endTime ? Math.max(0, (endTime - startTime) / 1000) : 0;

    // ── Metriche aggregate ───────────────────────────────────────────────────
    const pace = calcPace(totalDistance, durationSec);
    const speedAvg = durationSec > 0 ? parseFloat((totalDistance / (durationSec / 3600)).toFixed(2)) : 0;

    return {
        // ── Identificativi ──────────────────────────────────────
        name,
        activityType,                                               // es. "running", "trail running"
        date: startTime.toISOString(),
        createdAt: new Date().toISOString(),

        // ── Distanza & Durata ────────────────────────────────────
        distance: parseFloat(totalDistance.toFixed(2)),             // km
        duration: Math.round(durationSec),                          // secondi

        // ── Passo ────────────────────────────────────────────────
        paceDecimal: pace.decimal,                                  // min/km (per grafici)
        paceFormatted: pace.formatted,                              // "5:23"

        // ── Frequenza Cardiaca ───────────────────────────────────
        hrAvg: hrCount > 0 ? Math.round(hrSum / hrCount) : null,
        hrMax: hrMax > 0 ? hrMax : null,
        hrMin: hrMin < 999 && hrMin > 30 ? hrMin : null,

        // ── Velocità ─────────────────────────────────────────────
        speedAvg,                                                   // km/h media
        speedMax: parseFloat(speedMax.toFixed(2)),                  // km/h massima

        // ── Dislivello & Altitudine ──────────────────────────────
        elevGain: Math.round(elevGain),
        elevLoss: Math.round(elevLoss),
        altMin: altMin !== Infinity ? Math.round(altMin) : null,    // m s.l.m. minima
        altMax: altMax !== -Infinity ? Math.round(altMax) : null,   // m s.l.m. massima

        // ── Cadenza ──────────────────────────────────────────────
        cadAvg: cadCount > 0 ? Math.round(cadSum / cadCount) : null, // passi/min
        cadMax: cadMax > 0 ? cadMax : null,

        // ── Temperatura ──────────────────────────────────────────
        tempAvg: tempCount > 0 ? parseFloat((tempSum / tempCount).toFixed(1)) : null, // °C
        tempMin: tempCount > 0 && tempMin < 999 ? parseFloat(tempMin.toFixed(1)) : null,
        tempMax: tempCount > 0 && tempMax > -999 ? parseFloat(tempMax.toFixed(1)) : null,

        // ── Posizione ────────────────────────────────────────────
        startLat: isNaN(startLat) ? null : parseFloat(startLat.toFixed(6)),
        startLon: isNaN(startLon) ? null : parseFloat(startLon.toFixed(6)),

        // ── Splits per km ────────────────────────────────────────
        splits,                                                     // [{km, distance, duration, pace, hrAvg, elevGain}]
        totalSplits: splits.length
    };
}

/** Formatta i secondi in "Xh XXm" o "XXm XXs". */
export function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
    return `${m}m ${String(s).padStart(2, '0')}s`;
}

/** Formatta una stringa ISO in data italiana breve. */
export function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('it-IT', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}
