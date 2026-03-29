/* ========================================================
   training.js — Piano di allenamento Maratona 35 settimane
   Fonte dati: training schedule.xlsx
   ======================================================== */

'use strict';

/* ----------------------------------------------------------
   DATA EMBEDDED FROM EXCEL
   ---------------------------------------------------------- */
const PLAN = [
  { week:'W01',  d1km:15, d1desc:'15km FL',           d2km:10, d2desc:"R (400m): 2.5km WU / 8×(400m @4'20\" + 90s rest @6'30\") / 1.5km CD",         d3km:11, d3desc:'11km FL',  d4km:24, d4desc:"25km totali: tutti @ 6'20\"/km.",                                     totKm:60, phase:'base' },
  { week:'W02',  d1km:15, d1desc:'15km FL',           d2km:10, d2desc:"FM (10km): 1km WU / 8km @ 4'50\" / 1km CD",                                    d3km:11, d3desc:'11km FL',  d4km:25, d4desc:"25km totali: 20km @ 6'20\" + ultimi 5km @ 5'25\"/km",                  totKm:61, phase:'base' },
  { week:'W03',  d1km:16, d1desc:'16km FL',           d2km:10, d2desc:"R (600m): 2.5km WU / 6×(600m @4'25\" + 2' rest @6'30\") / 1.5km CD",          d3km:10, d3desc:'10km FL',  d4km:26, d4desc:"26km totali: tutti @ 6'20\"/km.",                                     totKm:62, phase:'base' },
  { week:'W04',  d1km:9,  d1desc:'9km FL',            d2km:6,  d2desc:"R (Fartlek): 2km WU / 5×(300m @4'30\" + 200m rest @6'00\") / 1.5km CD",                 d3km:10, d3desc:'10km FL', d4km:15, d4desc:"(Scarico): 15km totali: 10km @ 6'25\" + ultimi 5km @ 5'25\"/km.",                   totKm:40,  phase:'recovery' },
  { week:'W05',  d1km:16, d1desc:'16km FL',           d2km:10, d2desc:"R (800m): 2.0km WU / 6×(800m @4'30\" + 90s rest @6'30\") / 2km CD",           d3km:11, d3desc:'11km FL',  d4km:26, d4desc:"26km totali: 21km @ 6'20\" + ultimi 5km @ 5'15\"/km.",                 totKm:63, phase:'base' },
  { week:'W06',  d1km:16, d1desc:'16km FL',           d2km:10, d2desc:"FM (10km): 1km WU / 8km @ 4'50\" / 1km CD",                                    d3km:11, d3desc:'11km FL',  d4km:27, d4desc:"26km totali: tutti @ 6'20\"/km.",                                     totKm:64, phase:'base' },
  { week:'W07',  d1km:17, d1desc:'17km FL',           d2km:10, d2desc:"R (400m): 2.5km WU / 10×(400m @4'20\" + 60s rest @6'30\") / 1.5km CD",        d3km:11, d3desc:'11km FL',  d4km:27, d4desc:"27km totali: 20km @ 6'20\" + ultimi 7km @ 5'15\"/km.",                 totKm:65, phase:'base' },
  { week:'W08',  d1km:9,  d1desc:'9km FL',            d2km:7,  d2desc:"R (Fartlek): 2km WU / 7×(300m @4'30\" + 200m rest @6'00\") / 1.5km CD",                 d3km:9,  d3desc:'9km FL',   d4km:16, d4desc:"(Scarico): 16km totali: 11km @ 6'25\" + ultimi 5km @ 5'25\"/km.",                   totKm:41,  phase:'recovery' },
  { week:'W09',  d1km:17, d1desc:'17km FL',           d2km:11, d2desc:"R (1000m): 2.5km WU / 5×(1000m @4'30\" + 2' rest @6'30\") / 1.5km CD",        d3km:11, d3desc:'11km FL',  d4km:27, d4desc:"27km totali: tutti @ 6'20\"/km.",                                     totKm:66, phase:'base' },
  { week:'W10',  d1km:17, d1desc:'17km FL',           d2km:11, d2desc:"FM (11km): 1km WU / 9km @ 4'50\" / 1km CD",                                    d3km:11, d3desc:'11km FL',  d4km:28, d4desc:"28km Progressivo: 10km @ 6'25\" + 10km @ 5'50\" + 8km @ 5'10\".",       totKm:67, phase:'base' },
  { week:'W11',  d1km:17, d1desc:'17km FL',           d2km:11, d2desc:"R (800m): 2.5km WU / 7×(800m @4'30\" + 90s rest @6'30\") / 1.5km CD",         d3km:12, d3desc:'12km FL',  d4km:28, d4desc:"28km totali: tutti @ 6'20\"/km.",                                     totKm:68, phase:'base' },
  { week:'W12',  d1km:10, d1desc:'10km FL',           d2km:7,  d2desc:"R (400m): 2km WU / 6×(400m @4'25\" + 200m rest @6'00\") / 1.4km CD",                   d3km:9,  d3desc:'9km FL',   d4km:17, d4desc:"(Scarico): 17km totali: 12km @ 6'25\" + ultimi 5km @ RMa (4'55\").",                totKm:43,  phase:'recovery' },
  { week:'W13',  d1km:17, d1desc:'17km FL',           d2km:11, d2desc:"R (1000m): 2.0km WU / 6×(1000m @4'35\" + 2' rest @6'30\") / 1.5km CD",        d3km:13, d3desc:'13km FL',  d4km:29, d4desc:"29km totali: 24km @ 6'20\" + ultimi 5km @ RMa (4'55\").",               totKm:70, phase:'build' },
  { week:'W14',  d1km:17, d1desc:'17km FL',           d2km:11, d2desc:"FM (11km): 1km WU / 9km @ 4'45\" / 1km CD",                                    d3km:14, d3desc:'14km FL',  d4km:29, d4desc:"29km totali: tutti @ 6'20\"/km.",                                     totKm:71, phase:'build' },
  { week:'W15',  d1km:17, d1desc:'17km FL',           d2km:12, d2desc:"R (1500m): 2.0km WU / 5×(1500m @4'40\" + 2' rest @6'30\") / 1.5km CD",        d3km:14, d3desc:'14km FL',  d4km:30, d4desc:"30km totali: 20km @ 6'20\" + ultimi 10km @ 5'25\"/km.",                totKm:73, phase:'build' },
  { week:'W16',  d1km:10, d1desc:'10km FL',           d2km:8,  d2desc:"R (Allunghi): 5km FL / 8×(100m @4'20\" + 100m rest @6'15\") / 1.4km CD",               d3km:10, d3desc:'10km FL', d4km:18, d4desc:"(Scarico): 18km totali: 12km @ 6'25\" + ultimi 6km @ 5'25\"/km.",                   totKm:46,  phase:'recovery' },
  { week:'W17',  d1km:17, d1desc:'17km FL',           d2km:12, d2desc:"R (2000m): 2.0km WU / 3×(2000m @4'40\" + 3' rest @6'30\") / 2.0km CD",        d3km:14, d3desc:'14km FL',  d4km:30, d4desc:"30km totali: 20km @ 6'20\" + 10km @ RMa (4'55\").",                    totKm:73, phase:'build' },
  { week:'W18',  d1km:17, d1desc:'17km FL',           d2km:12, d2desc:"FM (12km): 1km WU / 10km @ 4'50\" / 1km CD",                                   d3km:15, d3desc:'15km FL',  d4km:30, d4desc:"30km totali: tutti @ 6'20\"/km.",                                     totKm:74, phase:'build' },
  { week:'W19',  d1km:17, d1desc:'17km FL',           d2km:14, d2desc:"R (1000m): 3.0km WU / 7×(1000m @4'35\" + 2' rest @6'30\") / 2.0km CD",        d3km:14, d3desc:'14km FL',  d4km:31, d4desc:"31km Progressivo: 11km @ 6'20\" + 10km @ 5'40\" + 10km @ 5'05\".",       totKm:76, phase:'build' },
  { week:'W20',  d1km:11, d1desc:'11km FL',           d2km:8,  d2desc:"R (Fartlek): 2km WU / 5×(400m @4'35\" + 200m rest @6'00\") / 3km CD",                  d3km:10, d3desc:'10km FL', d4km:19, d4desc:"(Scarico): 19km totali: 13km @ 6'25\" + ultimi 6km @ RMa (4'55\").",                totKm:48,  phase:'recovery' },
  { week:'W21',  d1km:17, d1desc:'17km FL',           d2km:14, d2desc:"FM (12km): 2km WU / 10km @ 4'45\" / 2km CD",                                   d3km:14, d3desc:'14km FL',  d4km:31, d4desc:"31km totali: 10km FL + 11km @ RMa (4'55\") + 10km FL.",                 totKm:76, phase:'build' },
  { week:'W22',  d1km:17, d1desc:'17km FL',           d2km:14, d2desc:"R (1000m): 3.0km WU / 8×(1000m @4'35\" + 2' rest @6'30\") / 3.0km CD",        d3km:14, d3desc:'14km FL',  d4km:32, d4desc:"32km totali: tutti @ 6'20\"/km.",                                     totKm:77, phase:'build' },
  { week:'W23',  d1km:17, d1desc:'17km FL',           d2km:14, d2desc:"FM (13km): 1.5km WU / 11km @ 4'50\" / 1.5km CD",                               d3km:15, d3desc:'15km FL',  d4km:32, d4desc:"32km totali: 20km @ 6'20\" + 12km @ 5'25\"/km.",                        totKm:78, phase:'build' },
  { week:'W24',  d1km:12, d1desc:'12km FL',           d2km:9,  d2desc:"R (Allunghi): 6km FL / 10×(100m @4'20\" + 100m rest @6'15\") / 1km CD",                d3km:11, d3desc:'11km FL', d4km:19, d4desc:"(Scarico): 19km totali: 13km @ 6'25\" + ultimi 6km @ 5'25\"/km.",                   totKm:51,  phase:'recovery' },
  { week:'W25',  d1km:17, d1desc:'17km FL',           d2km:14, d2desc:"R (2000m): 2.5km WU / 4×(2000m @4'40\" + 3' rest @6'30\") / 3.5km CD",        d3km:15, d3desc:'15km FL',  d4km:32, d4desc:"32km totali: 17km FL @ 6'20\" + 15km @ RMa (4'55\").",                  totKm:78, phase:'build' },
  { week:'W26',  d1km:17, d1desc:'17km FL',           d2km:15, d2desc:"FM (14km): 2km WU / 11km @ 4'45\" / 2km CD",                                   d3km:15, d3desc:'15km FL',  d4km:33, d4desc:"33km totali: tutti @ 6'15\"/km",                                       totKm:80, phase:'build' },
  { week:'W27',  d1km:17, d1desc:'17km FL',           d2km:16, d2desc:"R (3000m): 3.0km WU / 3×(3000m @4'45\" + 3' rest @6'30\") / 4.0km CD",        d3km:15, d3desc:'15km FL',  d4km:33, d4desc:"33km totali: 18km FL + 15km @ RMa (4'55\").",                           totKm:81, phase:'build' },
  { week:'W28',  d1km:12, d1desc:'12km FL',           d2km:10, d2desc:"R (Fartlek): 2.5km WU / 8×(400m @4'35\" + 200m rest @6'00\") / 2.7km CD",              d3km:11, d3desc:'11km FL', d4km:20, d4desc:"(Scarico): 20km totali: 13km @ 6'25\" + ultimi 7km @ RMa (4'55\").",                totKm:53,  phase:'recovery' },
  { week:'W29',  d1km:17, d1desc:'17km FL',           d2km:16, d2desc:"FM (14km): 2km WU / 12km @ 4'45\" / 2km CD",                                   d3km:15, d3desc:'15km FL',  d4km:33, d4desc:"33km totali: 13km FL + 20km @ RMa (4'55\").",                           totKm:81, phase:'peak' },
  { week:'W30',  d1km:17, d1desc:'17km FL',           d2km:16, d2desc:"R (4000m): 2.5km WU / 3×(4000m @4'55\" + 3' rest @6'30\") / 1.5km CD",        d3km:16, d3desc:'16km FL',  d4km:34, d4desc:"34km totali: 14km FL + 20km @ RMa (4'55\").",                           totKm:83, phase:'peak' },
  { week:'W31',  d1km:17, d1desc:'17km FL',           d2km:17, d2desc:"FM (15km): 2km WU / 13km @ 4'45\" / 2km CD",                                   d3km:15, d3desc:'15km FL',  d4km:36, d4desc:"36km totali: 16km FL @ 6'15\" + 20km @ RMa (4'55\").",                  totKm:85, phase:'peak' },
  { week:'W32',  d1km:16, d1desc:'16km FL',           d2km:10, d2desc:"FM (10km): 1km WU / 8km @ 4'45\" / 1km CD",                                    d3km:15, d3desc:'15km FL',  d4km:29, d4desc:"29km totali: 19km FL @ 6'20\" + 10km @ RMa (4'55\").",                  totKm:70,  phase:'taper' },
  { week:'W33',  d1km:14, d1desc:'14km FL',           d2km:10, d2desc:"R (Allunghi): 8km FL + 5×(100m @4'15\" + 100m rest @6'15\") / 1km CD",                 d3km:13, d3desc:'13km FL',  d4km:20, d4desc:"20km totali: 10km FL @ 6'20\" + 10km @ RMa (4'55\").",                  totKm:57,  phase:'taper' },
  { week:'W34',  d1km:11, d1desc:'11km FL',           d2km:9,  d2desc:"FM (9km): 2.5km WU / 4km @ 4'55\" / 2.5km CD",                                 d3km:10, d3desc:'10km FL', d4km:16, d4desc:"16km totali: tutti @ 6'25\"/km (Sgambata facile).",                      totKm:46,  phase:'taper' },
  { week:'W35',  d1km:9,  d1desc:'9km FL',            d2km:9,  d2desc:"R (Allunghi): 7km FL + 5×(100m @4'15\" + 100m rest @6'15\") / 1km CD",                 d3km:0,  d3desc:'OFF',      d4km:42, d4desc:"🏅 MARATONA (42.195km): Primi 5km @ 5'05\", poi costante @ 4'53\"-4'55\".",  totKm:60,  phase:'race' },
];

/* ----------------------------------------------------------
   HELPERS — SESSION TYPE
   ---------------------------------------------------------- */

function sessionType(desc) {
  if (!desc || desc === 'OFF') return 'off';
  const u = desc.toUpperCase();
  if (u.startsWith('R (') || u.startsWith('R(')) return 'reps';
  if (u.startsWith('FM ')) return 'tempo';
  return 'easy';
}

function sessionIcon(type) {
  return { reps: '⚡', tempo: '🔥', off: '🛌', easy: '🏃' }[type] || '🏃';
}

function sessionLabel(type) {
  return { reps: 'Ripetute', tempo: 'Fondo Medio', off: 'Riposo', easy: 'Fondo Lento' }[type] || 'Fondo Lento';
}

function phaseName(p) {
  return { recovery: '🟡 Scarico', taper: '🟣 Taper', race: '🔴 Gara', build: '🟢 Build', base: '⚪ Base', peak: '🟠 Picco' }[p] || '🟢 Build';
}

function phaseClass(p) {
  return 'phase-' + (p || 'build');
}

/* ----------------------------------------------------------
   WEEK DATE HELPERS
   ---------------------------------------------------------- */

const PLAN_START = new Date('2026-03-30T00:00:00');

/** Monday date for a given plan week index (0-based). */
function weekStartDate(idx) {
  const d = new Date(PLAN_START);
  d.setDate(d.getDate() + idx * 7);
  return d;
}

const SHORT_MONTHS = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
function fmtShort(d) {
  return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
}

/** Returns "lun DD MMM – dom DD MMM" for a given week index. */
function weekDateRange(idx) {
  const start = weekStartDate(idx);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${fmtShort(start)} – ${fmtShort(end)}`;
}

/* ----------------------------------------------------------
   MARATHON TARGET TIME
   ---------------------------------------------------------- */

/**
 * Parse the race week description to compute an estimated finish time (seconds).
 * Handles "Xkm @ M'SS"" named segments + "@ M'SS"-M'SS"" range for the remainder.
 */
function computeMarathonTargetTime() {
  const raceWeek = PLAN[PLAN.length - 1];
  const desc = raceWeek.d4desc;
  const totalDist = 42.195;
  let totalTime = 0;
  let coveredDist = 0;

  // Named segments: "Xkm @ M'SS""
  const segMatches = [...desc.matchAll(/(\d+(?:\.\d+)?)\s*km\s*@\s*(\d+)'(\d+)"/g)];
  for (const m of segMatches) {
    const dist = parseFloat(m[1]);
    const secs = parseInt(m[2]) * 60 + parseInt(m[3]);
    totalTime += dist * secs;
    coveredDist += dist;
  }

  // Range pace for rest: "@ M'SS"-M'SS""
  if (coveredDist < totalDist) {
    const rangeMatch = desc.match(/@\s*(\d+)'(\d+)"-(\d+)'(\d+)"/);
    if (rangeMatch) {
      const s1 = parseInt(rangeMatch[1]) * 60 + parseInt(rangeMatch[2]);
      const s2 = parseInt(rangeMatch[3]) * 60 + parseInt(rangeMatch[4]);
      totalTime += (totalDist - coveredDist) * ((s1 + s2) / 2);
    }
  }

  return totalTime > 0 ? Math.round(totalTime) : null;
}

/** Format total seconds as "Xh MM'" */
function fmtTime(totalSecs) {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  return `${h}h ${String(m).padStart(2, '0')}'`;
}

/* ----------------------------------------------------------
   LOAD TREND (rolling 4-week comparison)
   ---------------------------------------------------------- */

/**
 * Compare week[idx] volume to the previous week.
 * Se la settimana corrente non è di scarico, ignora la settimana di scarico precedente e usa
 * l'ultima settimana di carico per fare un confronto reale.
 */
function weekLoadTrend(idx) {
  if (idx === 0) return null;
  
  let compIdx = idx - 1;
  if (PLAN[compIdx].phase === 'recovery' && PLAN[idx].phase !== 'recovery') {
    while (compIdx > 0 && PLAN[compIdx].phase === 'recovery') compIdx--;
  }

  const prevKm = PLAN[compIdx].totKm;
  const ratio = (PLAN[idx].totKm - prevKm) / prevKm;
  const changePct = Math.round(ratio * 100);
  let trend;
  if (ratio > 0.15) trend = 'high';
  else if (ratio > 0.05) trend = 'up';
  else if (ratio < -0.10) trend = 'down';
  else trend = 'stable';
  
  return { prevKm, changePct, trend, compWeeklyTarget: compIdx === idx - 1 ? 'precedente' : PLAN[compIdx].week };
}

/** Build the load-trend badge HTML for a week card (empty string if stable). */
function buildTrendBadge(t) {
  if (!t || t.trend === 'stable') return '';
  const cfg = {
    high: { icon: '⚠️', label: 'Carico alto' },
    up: { icon: '↑', label: 'In crescita' },
    down: { icon: '↓', label: 'Scarico' },
  };
  const { icon, label } = cfg[t.trend];
  const sign = t.changePct > 0 ? '+' : '';
  const compLabel = t.compWeeklyTarget === 'precedente' ? 'settimana precedente' : `settimana ${t.compWeeklyTarget}`;
  return `<span class="load-trend-badge trend-${t.trend}" title="${label}: ${sign}${t.changePct}% vs ${compLabel} (${t.prevKm}km)">${icon} ${sign}${t.changePct}%</span>`;
}

/* ----------------------------------------------------------
   SMART KM SPLIT PARSING
   ---------------------------------------------------------- */

function parseD2Splits(d2km, d2desc) {
  const type = sessionType(d2desc);

  if (type === 'easy' || type === 'off') {
    return { easyKm: d2km || 0, fastKm: 0, medioKm: 0 };
  }

  const wuMatch = d2desc.match(/(\d+(?:\.\d+)?)\s*km\s*WU/i);
  const cdMatch = d2desc.match(/(\d+(?:\.\d+)?)\s*km\s*CD/i);
  const wu = wuMatch ? parseFloat(wuMatch[1]) : 0;
  const cd = cdMatch ? parseFloat(cdMatch[1]) : 0;
  const qualityKm = Math.max(0, (d2km || 0) - wu - cd);

  if (type === 'reps') return { easyKm: round1(wu + cd), fastKm: round1(qualityKm), medioKm: 0 };
  if (type === 'tempo') return { easyKm: round1(wu + cd), fastKm: 0, medioKm: round1(qualityKm) };

  return { easyKm: d2km || 0, fastKm: 0, medioKm: 0 };
}

function parseD4Splits(d4km, d4desc) {
  if (!d4desc || !d4km) return { easyKm: 0, medioKm: 0 };

  if (/MARATONA/i.test(d4desc)) return { easyKm: 0, medioKm: d4km };

  let medioKm = 0;

  const rmaMatches = [...d4desc.matchAll(/(\d+(?:\.\d+)?)\s*km\s*@\s*RMa/gi)];
  if (rmaMatches.length > 0) {
    for (const m of rmaMatches) medioKm += parseFloat(m[1]);
    return { easyKm: Math.max(0, d4km - medioKm), medioKm: round1(medioKm) };
  }

  const paceMatches = [...d4desc.matchAll(/(\d+(?:\.\d+)?)\s*km\s*@\s*(\d+)'(\d+)"/g)];
  for (const m of paceMatches) {
    const secs = parseInt(m[2]) * 60 + parseInt(m[3]);
    if (secs <= 340) medioKm += parseFloat(m[1]);
  }

  return { easyKm: round1(Math.max(0, d4km - medioKm)), medioKm: round1(medioKm) };
}

function round1(n) { return Math.round(n * 10) / 10; }

/* Compute splits for every week */
PLAN.forEach((w, idx) => {
  const d2s = parseD2Splits(w.d2km, w.d2desc);
  const d4s = parseD4Splits(w.d4km, w.d4desc);
  w.splits = {
    easyKm: round1((w.d1km || 0) + (w.d3km || 0) + d2s.easyKm + d4s.easyKm),
    fastKm: round1(d2s.fastKm),
    medioKm: round1(d2s.medioKm + d4s.medioKm),
  };
});

/* ----------------------------------------------------------
   GLOBALS
   ---------------------------------------------------------- */

const maxKm = Math.max(...PLAN.map(w => w.totKm));
const totalKm = PLAN.reduce((s, w) => s + w.totKm, 0);

// Marathon date = Sunday of W35 (last week, day 6)
const MARATHON_DATE = weekStartDate(PLAN.length - 1);
MARATHON_DATE.setDate(MARATHON_DATE.getDate() + 6);

function getCurrentWeekIdx() {
  const daysSince = (new Date() - PLAN_START) / 86400000;
  const idx = Math.floor(daysSince / 7);
  return Math.max(0, Math.min(PLAN.length - 1, idx));
}
const currentIdx = getCurrentWeekIdx();

/* ----------------------------------------------------------
   SUMMARY CARDS
   ---------------------------------------------------------- */

document.getElementById('total-km').textContent = totalKm.toLocaleString('it-IT');
document.getElementById('peak-km').textContent = maxKm + ' km';
const curW = PLAN[currentIdx];
document.getElementById('current-week-label').textContent = curW ? curW.week : '—';

// [FEATURE 3] Countdown to marathon
const countdownEl = document.getElementById('marathon-countdown');
if (countdownEl) {
  const now = new Date();
  const msLeft = MARATHON_DATE - now;
  if (msLeft > 0) {
    const daysLeft = Math.ceil(msLeft / 86400000);
    countdownEl.textContent = daysLeft + ' gg';
  } else {
    countdownEl.textContent = '🏅';
    const labelEl = countdownEl.closest('.stat-card')?.querySelector('.stat-label');
    if (labelEl) labelEl.textContent = 'Maratona completata!';
  }
}

// [DATA] Marathon target time
const marathonTimeEl = document.getElementById('marathon-target-time');
if (marathonTimeEl) {
  const secs = computeMarathonTargetTime();
  marathonTimeEl.textContent = secs ? fmtTime(secs) : '—';
}

/* ----------------------------------------------------------
   CHARTS
   ---------------------------------------------------------- */

const C = {
  green: 'rgba(46,204,113,0.9)',
  amber: 'rgba(251,191,36,0.9)',
  purple: 'rgba(167,139,250,0.9)',
  red: 'rgba(248,113,113,0.9)',
  blue: 'rgba(96,165,250,0.9)',
  grid: 'rgba(255,255,255,0.06)',
  tick: 'rgba(255,255,255,0.4)',
};

Chart.defaults.color = C.tick;
Chart.defaults.font.family = 'Inter, sans-serif';

/**
 * Slightly dim a rgba(...) color string by reducing alpha.
 * Works for patterns like rgba(R,G,B,A)
 */
function dimColor(color) {
  return color.replace(/[\d.]+\)$/, a => `${(parseFloat(a) * 0.45).toFixed(2)})`)
    .replace('0.9)', '0.4)').replace('0.85)', '0.4)').replace('0.75)', '0.4)');
}

/* [FEATURE 4] Stacked bar chart — easy / medio / fast layers */
let volumeChart;
(function () {
  const ctx = document.getElementById('chart-volume').getContext('2d');

  const mk = (base, isNow) => isNow ? base : dimColor(base);

  volumeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: PLAN.map(w => w.week),
      datasets: [
        {
          label: '🏃 Fondo Lento',
          data: PLAN.map(w => w.splits.easyKm),
          backgroundColor: PLAN.map((w, i) => mk('rgba(46,204,113,0.75)', i === currentIdx)),
          borderColor: 'transparent',
          borderWidth: 0,
          stack: 'km',
        },
        {
          label: '🔥 Medio/RMa',
          data: PLAN.map(w => w.splits.medioKm),
          backgroundColor: PLAN.map((w, i) => mk('rgba(251,191,36,0.85)', i === currentIdx)),
          borderColor: 'transparent',
          borderWidth: 0,
          stack: 'km',
        },
        {
          label: '⚡ Veloci (Rep)',
          data: PLAN.map(w => w.splits.fastKm),
          backgroundColor: PLAN.map((w, i) => mk('rgba(249,115,22,0.85)', i === currentIdx)),
          borderColor: 'transparent',
          borderWidth: 0,
          stack: 'km',
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { font: { size: 10 }, padding: 12, boxWidth: 10, boxHeight: 10 }
        },
        tooltip: {
          backgroundColor: 'rgba(5,15,8,0.95)',
          borderColor: 'rgba(46,204,113,0.3)',
          borderWidth: 1,
          callbacks: {
            title: ([ctx]) => {
              const w = PLAN[ctx.dataIndex];
              return `${w.week} — ${phaseName(w.phase)} · ${w.totKm} km tot`;
            },
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} km`
          }
        }
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: { size: 9 }, maxRotation: 45 } },
        y: { stacked: true, grid: { color: C.grid }, ticks: { font: { size: 10 } }, beginAtZero: true }
      },
      // [FEATURE 1/6 partial] Click on bar → open modal
      onClick: (evt, elements) => {
        if (elements.length > 0) openWeekModal(elements[0].index);
      },
      onHover: (evt, elements) => {
        evt.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
      },
    }
  });
})();

/* Distribution doughnut — uses computed splits */
(function () {
  const ctx = document.getElementById('chart-distribution').getContext('2d');

  const easyTotal = round1(PLAN.reduce((s, w) => s + w.splits.easyKm, 0));
  const fastTotal = round1(PLAN.reduce((s, w) => s + w.splits.fastKm, 0));
  const medioTotal = round1(PLAN.reduce((s, w) => s + w.splits.medioKm, 0));

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['🏃 Fondo Lento', '⚡ Veloci (Rep)', '🔥 Medio (FM/RMa)'],
      datasets: [{
        data: [easyTotal, fastTotal, medioTotal],
        backgroundColor: ['rgba(34,139,34,0.75)', 'rgba(249,115,22,0.8)', 'rgba(251,191,36,0.8)'],
        borderColor: ['rgba(46,204,113,0.6)', 'rgba(253,186,116,0.6)', 'rgba(252,211,77,0.6)'],
        borderWidth: 1.5,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      cutout: '62%',
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 10 }, padding: 10, boxWidth: 10 } },
        tooltip: {
          backgroundColor: 'rgba(5,15,8,0.95)',
          borderColor: 'rgba(46,204,113,0.3)',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` ${ctx.parsed} km (${Math.round(ctx.parsed / totalKm * 100)}%)`
          }
        }
      }
    }
  });
})();

/* ----------------------------------------------------------
   WEEK CARDS GRID
   ---------------------------------------------------------- */

const grid = document.getElementById('weeks-grid');

PLAN.forEach((w, idx) => {
  const phase = w.phase || 'build';
  const isNow = idx === currentIdx;
  const sp = w.splits;
  const totalSplit = sp.easyKm + sp.fastKm + sp.medioKm;
  const trend = weekLoadTrend(idx);

  const pctEasy = totalSplit ? Math.round(sp.easyKm / totalSplit * 100) : 100;
  const pctFast = totalSplit ? Math.round(sp.fastKm / totalSplit * 100) : 0;
  const pctMedio = totalSplit ? Math.round(sp.medioKm / totalSplit * 100) : 0;

  const col = document.createElement('div');
  col.className = `col-6 col-md-4 col-lg-3 weeks-grid-item`;
  col.dataset.phase = phase;

  col.innerHTML = `
    <div class="week-card ${phaseClass(phase)}${isNow ? ' is-current' : ''}"
         data-week-idx="${idx}" role="button" tabindex="0"
         aria-label="Settimana ${w.week}: ${w.totKm} km">
      <span class="phase-tag">${phaseName(phase).split(' ')[1]}</span>
      <span class="week-number">
        ${w.week}${isNow ? '<span class="current-badge">In corso</span>' : ''}
      </span>
      <span class="week-km">${w.totKm}</span>
      <span class="week-km-label">km totali</span>
      <span class="week-date-range">${weekDateRange(idx)}</span>
      ${buildTrendBadge(trend)}

      <div class="week-sessions mt-2 d-flex flex-nowrap gap-1" style="overflow:-moz-hidden-unscrollable; overflow: hidden;">
        <span class="ws-badge easy px-1" title="${w.d1desc}">🏃 ${w.d1km}</span>
        <span class="ws-badge ${w.d2desc.startsWith('FM') ? 'tempo' : 'reps'} px-1" title="${w.d2desc}">${w.d2desc.startsWith('FM') ? '🔥' : '⚡'} ${w.d2km}</span>
        ${w.d3km > 0 ? `<span class="ws-badge easy px-1" title="${w.d3desc}">🏃 ${w.d3km}</span>` : `<span class="ws-badge off px-1" title="Riposo">💤 OFF</span>`}
        <span class="ws-badge ${w.phase === 'race' ? 'race' : 'long'} px-1" title="${w.d4desc}">${w.phase === 'race' ? '🏅' : '🪨'} ${w.d4km}</span>
      </div>

      <div class="km-bar-wrap">
        <div class="split-bar">
          ${pctEasy ? `<div class="split-seg seg-easy"  style="width:${pctEasy}%"  title="Fondo Lento: ${sp.easyKm}km"></div>` : ''}
          ${pctFast ? `<div class="split-seg seg-fast"  style="width:${pctFast}%"  title="Veloci: ${sp.fastKm}km"></div>` : ''}
          ${pctMedio ? `<div class="split-seg seg-medio" style="width:${pctMedio}%" title="Medio: ${sp.medioKm}km"></div>` : ''}
        </div>
      </div>
    </div>
  `;

  grid.appendChild(col);
});

/* [FEATURE 2] Auto-scroll to current week card */
requestAnimationFrame(() => {
  const currentCard = grid.querySelector('.is-current');
  if (currentCard) {
    currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

/* ----------------------------------------------------------
   PHASE FILTER
   ---------------------------------------------------------- */

document.querySelectorAll('.trn-phase-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.trn-phase-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const phase = btn.dataset.phase;
    document.querySelectorAll('.weeks-grid-item').forEach(item => {
      item.classList.toggle('hidden', phase !== 'all' && item.dataset.phase !== phase);
    });
  });
});

/* ----------------------------------------------------------
   WEEK DETAIL MODAL
   ---------------------------------------------------------- */

const weekModal = new bootstrap.Modal(document.getElementById('weekModal'));
const modalTitle = document.getElementById('weekModalLabel');
const modalBody = document.getElementById('weekModalBody');
const btnPrev = document.getElementById('modal-btn-prev');
const btnNext = document.getElementById('modal-btn-next');

let activeModalIdx = currentIdx;

/* [FEATURE 5] Colored pace tags — classify by pace (M'SS" → seconds) */
function paceTagClass(paceStr) {
  const m = paceStr.match(/^(\d+)'(\d+)"$/);
  if (!m) return '';
  const secs = parseInt(m[1]) * 60 + parseInt(m[2]);
  if (secs <= 280) return 'orange'; // ≤ 4'40" → fast/reps (orange)
  if (secs <= 340) return 'amber';  // ≤ 5'40" → medio/tempo (yellow/amber)
  return '';                        // > 5'40" → easy (green default)
}

function buildSessionBlock(icon, typeClass, typeLabel, km, desc) {
  if (!desc || desc === 'OFF' || km === 0) {
    return `
      <div class="session-detail-block">
        <span class="sdb-type"><span class="sdb-icon">🛌</span> Riposo</span>
        <span class="sdb-km off">—</span>
        <p class="sdb-desc opacity-50">Giornata di recupero</p>
      </div>`;
  }

  // [FEATURE 5] Only tag M'SS" pace patterns, not percentages like @80%
  const richDesc = desc.replace(/@\s*(\d+'?\d*"?(?:\/km)?)/g, (match, raw) => {
    const paceStr = raw.trim().replace(/\/km$/i, ''); // strip optional /km suffix
    // Only properly coloured if it looks like M'SS"
    if (/^\d+'\d+"$/.test(paceStr)) {
      const cls = paceTagClass(paceStr);
      return `<span class="pace-tag${cls ? ' ' + cls : ''}">${paceStr}</span>`;
    }
    // Fallback: wrap as-is (e.g. @80%, @RMa...)
    return `<span class="pace-tag">${paceStr}</span>`;
  });

  return `
    <div class="session-detail-block">
      <span class="sdb-type"><span class="sdb-icon">${icon}</span> ${typeLabel}</span>
      <span class="sdb-km ${typeClass}">${km} km</span>
      <p class="sdb-desc">${richDesc}</p>
    </div>`;
}

function buildSplitSummary(sp) {
  const total = sp.easyKm + sp.fastKm + sp.medioKm;
  if (!total) return '';
  const bars = [
    { label: '🏃 Fondo Lento', km: sp.easyKm, cls: 'seg-easy', color: 'rgba(34,139,34,0.7)' },
    { label: '⚡ Veloci', km: sp.fastKm, cls: 'seg-fast', color: 'rgba(249,115,22,0.7)' },
    { label: '🔥 Medio/RMa', km: sp.medioKm, cls: 'seg-medio', color: 'rgba(251,191,36,0.7)' },
  ].filter(b => b.km > 0);

  const legendHtml = bars.map(b => {
    const pct = Math.round(b.km / total * 100);
    return `
      <div class="d-flex align-items-center gap-2 small" style="min-width:160px">
        <div style="width:10px;height:10px;border-radius:50%;background:${b.color};flex-shrink:0;"></div>
        <span class="opacity-75">${b.label}</span>
        <span class="ms-auto fw-bold">${b.km} km <span class="opacity-50">(${pct}%)</span></span>
      </div>`;
  }).join('');

  return `
    <div class="glass-panel mb-3 py-3 px-3">
      <div class="small opacity-50 text-uppercase fw-bold mb-2" style="letter-spacing:1px;font-size:.65rem;">Distribuzione km settimana</div>
      <div class="split-bar mb-3" style="height:14px;">
        ${bars.map(b => {
    const pct = Math.round(b.km / total * 100);
    return `<div class="split-seg ${b.cls}" style="width:${pct}%" title="${b.label}: ${b.km}km"></div>`;
  }).join('')}
      </div>
      <div class="d-flex flex-column gap-1">${legendHtml}</div>
    </div>`;
}

grid.addEventListener('click', e => {
  const card = e.target.closest('[data-week-idx]');
  if (card) openWeekModal(parseInt(card.dataset.weekIdx, 10));
});

grid.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    const card = e.target.closest('[data-week-idx]');
    if (card) { e.preventDefault(); openWeekModal(parseInt(card.dataset.weekIdx, 10)); }
  }
});

function openWeekModal(idx) {
  const w = PLAN[idx];
  if (!w) return;

  activeModalIdx = idx;

  const phase = w.phase || 'build';
  const isNow = idx === currentIdx;
  const d2type = sessionType(w.d2desc);
  const longType = phase === 'race' ? 'race' : 'long';
  const sp = w.splits;

  const completedKm = PLAN.slice(0, idx).reduce((s, ww) => s + ww.totKm, 0);
  const progressPct = Math.round(completedKm / totalKm * 100);
  const dateRange = weekDateRange(idx);

  // [FEATURE 1] Update prev/next button states
  if (btnPrev) btnPrev.disabled = idx === 0;
  if (btnNext) btnNext.disabled = idx === PLAN.length - 1;

  // [VISUAL] Phase-based accent on modal content
  const modalContent = document.querySelector('#weekModal .modal-content');
  if (modalContent) {
    modalContent.className = modalContent.className.replace(/\bphase-modal-\S+/g, '').trim();
    modalContent.classList.add(`phase-modal-${phase}`);
  }

  modalTitle.innerHTML = `
    ${phaseName(phase)} — ${w.week}
    ${isNow ? '<span class="current-badge ms-2">In corso</span>' : ''}
    <span class="ms-2 opacity-40 small">(Settimana ${idx + 1}/35)</span>
  `;

  modalBody.innerHTML = `
    <div class="modal-date-range mb-2">${dateRange}</div>

    <div class="modal-stat-row">
      <div class="modal-stat-pill">📏 <span class="msp-val">${w.totKm} km</span> totali</div>
      <div class="modal-stat-pill">🏃 <span class="msp-val">${sp.easyKm}</span> lenti</div>
      ${sp.fastKm ? `<div class="modal-stat-pill">⚡ <span class="msp-val">${sp.fastKm}</span> veloci</div>` : ''}
      ${sp.medioKm ? `<div class="modal-stat-pill">🔥 <span class="msp-val">${sp.medioKm}</span> medio</div>` : ''}
      ${(() => { const t = weekLoadTrend(idx); if (!t || t.trend === 'stable') return ''; const cfg = { high: ['⚠️', 'trend-high'], up: ['↑', 'trend-up'], down: ['↓', 'trend-down'] }; const [icon, cls] = cfg[t.trend]; const sign = t.changePct > 0 ? '+' : ''; const compName = t.compWeeklyTarget === 'precedente' ? 'prec.' : t.compWeeklyTarget; return `<div class="modal-stat-pill modal-trend-pill ${cls}">${icon} <span class="msp-val">${sign}${t.changePct}%</span> vs ${compName} (${t.prevKm}km)</div>`; })()}
    </div>

    <div class="progress-section">
      <span class="small opacity-50">Avanzamento piano: <strong>${progressPct}%</strong> dei ${totalKm} km completata prima di questa settimana</span>
      <div class="trn-progress-bar mt-1">
        <div class="trn-progress-fill" style="width:${progressPct}%"></div>
      </div>
    </div>

    ${buildSplitSummary(sp)}

    <div class="row g-3">
      <div class="col-12 col-md-6">
        <h6 class="small opacity-50 text-uppercase mb-2">🏃 Day 1 — Fondo Lento</h6>
        ${buildSessionBlock('🏃', 'easy', 'Fondo Lento', w.d1km, w.d1desc)}
      </div>
      <div class="col-12 col-md-6">
        <h6 class="small opacity-50 text-uppercase mb-2">${sessionIcon(d2type)} Day 2 — ${sessionLabel(d2type)}</h6>
        ${buildSessionBlock(sessionIcon(d2type), d2type, sessionLabel(d2type), w.d2km, w.d2desc)}
      </div>
      <div class="col-12 col-md-6">
        <h6 class="small opacity-50 text-uppercase mb-2">🏃 Day 3 — Fondo Lento</h6>
        ${buildSessionBlock('🏃', 'easy', 'Fondo Lento', w.d3km, w.d3desc)}
      </div>
      <div class="col-12 col-md-6">
        <h6 class="small opacity-50 text-uppercase mb-2">🏅 Day 4 — ${phase === 'race' ? 'Gara' : 'Lungo'}</h6>
        ${buildSessionBlock('🏅', longType, phase === 'race' ? 'Maratona' : 'Lungo', w.d4km, w.d4desc)}
      </div>
    </div>
  `;

  weekModal.show();
}

/* [FEATURE 1] Modal prev/next navigation */
if (btnPrev) btnPrev.addEventListener('click', () => { if (activeModalIdx > 0) openWeekModal(activeModalIdx - 1); });
if (btnNext) btnNext.addEventListener('click', () => { if (activeModalIdx < PLAN.length - 1) openWeekModal(activeModalIdx + 1); });

/* [FEATURE 6] Keyboard navigation — ← → inside open modal */
document.addEventListener('keydown', e => {
  const isOpen = document.getElementById('weekModal').classList.contains('show');
  if (!isOpen) return;
  if (e.key === 'ArrowLeft') { e.preventDefault(); if (activeModalIdx > 0) openWeekModal(activeModalIdx - 1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); if (activeModalIdx < PLAN.length - 1) openWeekModal(activeModalIdx + 1); }
  // Escape is handled natively by Bootstrap
});
