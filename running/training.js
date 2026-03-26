/* ========================================================
   training.js — Piano di allenamento Maratona 35 settimane
   Fonte dati: training schedule.xlsx
   ======================================================== */

'use strict';

/* ----------------------------------------------------------
   DATA EMBEDDED FROM EXCEL
   Columns: week, d1km, d1desc, d2km, d2desc, d3km, d3desc, d4km, d4desc, totKm
   ---------------------------------------------------------- */
const PLAN = [
  { week:'W01',  d1km:13, d1desc:'13km FL',           d2km:10, d2desc:"R (800m): 2.5km WU / 6×(800m @4'30\" + 90s rest @6'30\") / 2.3km CD",         d3km:13, d3desc:'13km FL',  d4km:24, d4desc:"25km totali: tutti @ 5'50\"/km.",                                     totKm:60 },
  { week:'W02',  d1km:13, d1desc:'13km FL',           d2km:10, d2desc:"R (1000m): 2.5km WU / 5×(1000m @4'35\" + 2' rest @6'30\") / 1.8km CD",        d3km:13, d3desc:'13km FL',  d4km:25, d4desc:"25km totali: 20km @ 5'50\" + ultimi 5km @ 5'20\"/km",                  totKm:61 },
  { week:'W03',  d1km:13, d1desc:'14km FL',           d2km:10, d2desc:"R (1500m): 2.0km WU / 4×(1500m @4'40\" + 3' rest @6'30\") / 1.5km CD",        d3km:13, d3desc:'13km FL',  d4km:26, d4desc:"26km totali: tutti @ 5'50\"/km.",                                     totKm:62 },
  { week:'W04',  d1km:9,  d1desc:'9km FL',            d2km:6,  d2desc:"6km FL: 6km totali a 5'50\". Inizia i primi 2km a 6'10\" per scaldarti.",      d3km:10, d3desc:'10km FL', d4km:15, d4desc:"(Scarico): 15km totali: tutti @ 5'55\"/km.",                            totKm:40,  phase:'recovery' },
  { week:'W05',  d1km:14, d1desc:'14km FL',           d2km:10, d2desc:"FM (10km): 1km WU / 8km @ 5'15\" / 1km CD",                                    d3km:13, d3desc:'13km FL',  d4km:26, d4desc:"26km totali: 21km @ 5'50\" + ultimi 5km @ 5'10\"/km.",                 totKm:63 },
  { week:'W06',  d1km:14, d1desc:'14km FL',           d2km:10, d2desc:"R (400m): 2.5km WU / 10×(400m @4'20\" + 60s rest @6'30\") / 2.8km CD",        d3km:13, d3desc:'14km FL',  d4km:27, d4desc:"26km totali: tutti @ 5'50\"/km.",                                     totKm:64 },
  { week:'W07',  d1km:14, d1desc:'14km FL',           d2km:10, d2desc:"FM (10km): 1km WU / 8km @ 5'10\" / 1km CD",                                    d3km:14, d3desc:'14km FL',  d4km:27, d4desc:"27km totali: 20km @ 5'50\" + ultimi 7km @ 5'15\"/km.",                 totKm:65 },
  { week:'W08',  d1km:9,  d1desc:'9km FL',            d2km:7,  d2desc:"7km FL: 7km totali a 5'55\". Primi 2km molto blandi.",                          d3km:9,  d3desc:'9km FL',   d4km:16, d4desc:"(Scarico): 16km totali: tutti @ 5'55\"/km.",                            totKm:41,  phase:'recovery' },
  { week:'W09',  d1km:14, d1desc:'15km FL',           d2km:11, d2desc:"R (1000m): 2.5km WU / 6×(1000m @4'35\" + 2' rest @6'30\") / 1.8km CD",        d3km:14, d3desc:'14km FL',  d4km:27, d4desc:"27km totali: tutti @ 5'50\"/km.",                                     totKm:66 },
  { week:'W10',  d1km:14, d1desc:'15km FL',           d2km:11, d2desc:"FM (11km): 1km WU / 9km @ 5'15\" / 1km CD",                                    d3km:14, d3desc:'14km FL',  d4km:28, d4desc:"28km Progressivo: 10km @ 5'55\" + 10km @ 5'35\" + 8km @ 5'15\".",       totKm:67 },
  { week:'W11',  d1km:15, d1desc:'15km FL',           d2km:11, d2desc:"R (2000m): 2.5km WU / 3×(2000m @4'45\" + 3' rest @6'30\") / 1.5km CD",        d3km:14, d3desc:'14km FL',  d4km:28, d4desc:"28km totali: tutti @ 5'50\"/km.",                                     totKm:68 },
  { week:'W12',  d1km:10, d1desc:'10km FL',           d2km:7,  d2desc:"7km FL: 7km totali a 6'00\". Focus sul recupero muscolare.",                    d3km:9,  d3desc:'9km FL',   d4km:17, d4desc:"(Scarico): 17km totali: tutti @ 5'55\"/km.",                            totKm:43,  phase:'recovery' },
  { week:'W13',  d1km:15, d1desc:'15km FL',           d2km:11, d2desc:"FM (11km): 1km WU / 9km @ 5'10\" / 1km CD",                                    d3km:15, d3desc:'15km FL',  d4km:29, d4desc:"29km totali: 24km @ 5'50\" + ultimi 5km @ RMa (5'00\").",               totKm:70 },
  { week:'W14',  d1km:16, d1desc:'16km FL',           d2km:11, d2desc:"R (800m): 2.5km WU / 8×(800m @4'30\" + 90s rest @6'30\") / 1.5km CD",         d3km:15, d3desc:'15km FL',  d4km:29, d4desc:"29km totali: tutti @ 5'50\"/km.",                                     totKm:71 },
  { week:'W15',  d1km:16, d1desc:'16km FL',           d2km:12, d2desc:"R (1500m): 2.0km WU / 5×(1500m @4'40\" + 3' rest @6'30\") / 1.5km CD",        d3km:15, d3desc:'15km FL',  d4km:30, d4desc:"30km totali: 20km @ 5'50\" + ultimi 10km @ 5'20\"/km.",                totKm:73 },
  { week:'W16',  d1km:10, d1desc:'10km FL',           d2km:8,  d2desc:"8km FL: 8km totali a 6'00\".",                                                  d3km:10, d3desc:'10km FL', d4km:18, d4desc:"(Scarico): 18km totali: tutti @ 5'55\"/km.",                            totKm:46,  phase:'recovery' },
  { week:'W17',  d1km:16, d1desc:'16km FL',           d2km:12, d2desc:"FM (12km): 1km WU / 10km @ 5'15\" / 1km CD",                                   d3km:15, d3desc:'15km FL',  d4km:30, d4desc:"30km totali: 20km @ 5'50\" + 10km @ RMa (5'00\").",                    totKm:73 },
  { week:'W18',  d1km:16, d1desc:'16km FL',           d2km:12, d2desc:"R (1000m): 2.0km WU / 7×(1000m @4'35\" + 2' rest @6'30\") / 2.0km CD",        d3km:16, d3desc:'16km FL',  d4km:30, d4desc:"30km totali: tutti @ 5'50\"/km.",                                     totKm:74 },
  { week:'W19',  d1km:17, d1desc:'17km FL',           d2km:12, d2desc:"R (2000m): 2.0km WU / 4×(2000m @4'45\" + 3' rest @6'30\") / 1.0km CD",        d3km:16, d3desc:'16km FL',  d4km:31, d4desc:"31km Progressivo: 11km @ 5'50\" + 10km @ 5'30\" + 10km @ 5'10\".",       totKm:76 },
  { week:'W20',  d1km:11, d1desc:'11km FL',           d2km:8,  d2desc:"8km FL: 8km totali a 6'05\".",                                                  d3km:10, d3desc:'10km FL', d4km:19, d4desc:"(Scarico): 19km totali: tutti @ 5'55\"/km.",                            totKm:48,  phase:'recovery' },
  { week:'W21',  d1km:17, d1desc:'17km FL',           d2km:12, d2desc:"FM (12km): 1km WU / 10km @ 5'10\" / 1km CD",                                   d3km:16, d3desc:'16km FL',  d4km:31, d4desc:"31km totali: 10km FL + 11km @ RMa (5'00\") + 10km FL.",                 totKm:76 },
  { week:'W22',  d1km:17, d1desc:'17km FL',           d2km:12, d2desc:"R (400m): 2.5km WU / 12×(400m @4'20\" + 60s rest @6'30\") / 3.0km CD",        d3km:16, d3desc:'16km FL',  d4km:32, d4desc:"32km totali: tutti @ 5'50\"/km.",                                     totKm:77 },
  { week:'W23',  d1km:17, d1desc:'17km FL',           d2km:13, d2desc:"FM (13km): 1km WU / 11km @ 5'15\" / 1km CD",                                   d3km:16, d3desc:'16km FL',  d4km:32, d4desc:"32km totali: 20km @ 5'50\" + 12km @ 5'20\"/km.",                        totKm:78 },
  { week:'W24',  d1km:12, d1desc:'12km FL',           d2km:9,  d2desc:"9km FL: 9km totali a 6'05\".",                                                  d3km:11, d3desc:'11km FL', d4km:19, d4desc:"(Scarico): 19km totali: tutti @ 5'55\"/km.",                            totKm:51,  phase:'recovery' },
  { week:'W25',  d1km:17, d1desc:'17km FL',           d2km:13, d2desc:"R (1500m): 1.5km WU / 6×(1500m @4'40\" + 3' rest @6'30\") / 1.5km CD",        d3km:16, d3desc:'16km FL',  d4km:32, d4desc:"32km totali: 17km FL @ 5'50\" + 15km @ RMa (5'00\").",                  totKm:78 },
  { week:'W26',  d1km:17, d1desc:'17km FL',           d2km:13, d2desc:"FM (14km): 1km WU / 11km @ 5'10\" / 1km CD",                                   d3km:17, d3desc:'17km FL',  d4km:33, d4desc:"33km totali: tutti @ 5'45\"/km",                                       totKm:80 },
  { week:'W27',  d1km:17, d1desc:'17km FL',           d2km:14, d2desc:"R (1000m): 2.0km WU / 8×(1000m @4'35\" + 2' rest @6'30\") / 2.5km CD",        d3km:17, d3desc:'17km FL',  d4km:33, d4desc:"33km totali: 18km FL + 15km @ RMa (5'00\").",                           totKm:81 },
  { week:'W28',  d1km:12, d1desc:'12km FL',           d2km:10, d2desc:"10km FL: 10km totali a 6'00\".",                                                d3km:11, d3desc:'11km FL', d4km:20, d4desc:"(Scarico): 20km totali: tutti @ 5'55\"/km.",                            totKm:53,  phase:'recovery' },
  { week:'W29',  d1km:17, d1desc:'17km FL',           d2km:14, d2desc:"FM (14km): 1km WU / 12km @ 5'10\" / 1km CD",                                   d3km:17, d3desc:'17km FL',  d4km:33, d4desc:"33km totali: 13km FL + 20km @ RMa (5'00\").",                           totKm:81 },
  { week:'W30',  d1km:17, d1desc:'17km FL',           d2km:15, d2desc:"R (2000m): 2km WU / 5×(2000m @4'45\" + 3' rest @6'30\") / 2km CD",            d3km:17, d3desc:'17km FL',  d4km:34, d4desc:"34km totali: 14km FL + 20km @ RMa (5'00\").",                           totKm:83 },
  { week:'W31',  d1km:17, d1desc:'17km FL',           d2km:15, d2desc:"FM (16km): 1km WU / 13km @ 5'15\" / 1km CD",                                   d3km:17, d3desc:'17km FL',  d4km:36, d4desc:"36km totali: 16km FL @ 5'45\" + 20km @ RMa (5'00\").",                  totKm:85 },
  { week:'W32',  d1km:16, d1desc:'16km FL',           d2km:10, d2desc:"FM (10km): 1km WU / 8km @ 5'10\" / 1km CD",                                    d3km:15, d3desc:'15km FL',  d4km:29, d4desc:"29km totali: 19km FL @ 5'50\" + 10km @ RMa (5'00\").",                  totKm:70,  phase:'taper' },
  { week:'W33',  d1km:14, d1desc:'14km FL',           d2km:10, d2desc:"10km FL + Allunghi: 8km FL (@5'50\") / 5×(100m scatto @80%) / 1.5km CD",       d3km:13, d3desc:'13km FL',  d4km:20, d4desc:"20km totali: 10km FL @ 5'50\" + 10km @ RMa (5'00\").",                  totKm:57,  phase:'taper' },
  { week:'W34',  d1km:11, d1desc:'11km FL',           d2km:9,  d2desc:"9km FL: 9km totali a 6'15\" (Molto lento, solo per far girare le gambe)",       d3km:10, d3desc:'10km FL', d4km:16, d4desc:"16km totali: tutti @ 5'55\"/km (Sgambata facile).",                      totKm:46,  phase:'taper' },
  { week:'W35',  d1km:9,  d1desc:'9km FL',            d2km:9,  d2desc:"9km FL + Allunghi: 7km FL (@6'00\") / 5×(100m scatto @80%) / 1.5km CD",        d3km:0,  d3desc:'OFF',      d4km:42, d4desc:"🏅 MARATONA (42.195km): Primi 5km @ 5'05\", poi costante @ 4'58\"-5'00\".",  totKm:60,  phase:'race' },
];

/* Assign phase where not explicitly set */
PLAN.forEach(w => {
  if (!w.phase) w.phase = 'build';
});

/* ----------------------------------------------------------
   HELPERS
   ---------------------------------------------------------- */

/** Determine session type from description */
function sessionType(desc) {
  if (!desc || desc === 'OFF') return 'off';
  const u = desc.toUpperCase();
  if (u.startsWith('R (') || u.startsWith('R(')) return 'reps';
  if (u.startsWith('FM ')) return 'tempo';
  return 'easy';
}

function sessionIcon(type) {
  switch(type) {
    case 'reps':  return '⚡';
    case 'tempo': return '🔥';
    case 'off':   return '🛌';
    case 'easy':  
    default:      return '🏃';
  }
}

function sessionLabel(type) {
  switch(type) {
    case 'reps':  return 'Ripetute';
    case 'tempo': return 'Fondo Medio';
    case 'off':   return 'Riposo';
    case 'easy':
    default:      return 'Fondo Lento';
  }
}

function phaseName(p) {
  switch(p) {
    case 'recovery': return '🟡 Scarico';
    case 'taper':    return '🟣 Taper';
    case 'race':     return '🔴 Gara';
    default:         return '🟢 Build';
  }
}

function phaseClass(p) {
  return 'phase-' + (p || 'build');
}

/* Week number index (1-based) */
function weekNumber(w) {
  return PLAN.indexOf(w) + 1;
}

/* Determine current week based on today (plan started March 26 2026, W35 = race day) */
// Race day = W35. We detect today's week index assuming the plan starts on a specific Monday.
// Strategy: the user views this now (March 2026), so calculate from W01 start date.
// The Excel does not have dates. We'll infer: the race (W35) is some unknown future date.
// We'll just mark today's approximate week by picking the week closest to "now" assuming
// the plan started from the date the file was shared (approx ~March 26 2026).
// Plan starts W01 = March 30 2026 (Monday after March 26).
const PLAN_START = new Date('2026-03-30T00:00:00');

function getCurrentWeekIdx() {
  const now = new Date();
  const daysSinceStart = (now - PLAN_START) / (1000 * 60 * 60 * 24);
  const weekIdx = Math.floor(daysSinceStart / 7);
  if (weekIdx < 0) return 0;
  if (weekIdx >= PLAN.length) return PLAN.length - 1;
  return weekIdx;
}

const maxKm = Math.max(...PLAN.map(w => w.totKm));
const totalKm = PLAN.reduce((s, w) => s + w.totKm, 0);
const currentIdx = getCurrentWeekIdx();

/* ----------------------------------------------------------
   BUILD SUMMARY CARDS
   ---------------------------------------------------------- */
document.getElementById('total-km').textContent = totalKm.toLocaleString('it-IT');
document.getElementById('peak-km').textContent = maxKm + ' km';
const curW = PLAN[currentIdx];
document.getElementById('current-week-label').textContent = curW ? curW.week : '—';

/* ----------------------------------------------------------
   CHARTS
   ---------------------------------------------------------- */

const chartColor = {
  green: 'rgba(46,204,113,0.9)',
  greenFill: 'rgba(46,204,113,0.18)',
  amber: 'rgba(251,191,36,0.9)',
  purple: 'rgba(167,139,250,0.9)',
  red: 'rgba(248,113,113,0.9)',
  grid: 'rgba(255,255,255,0.06)',
  tick: 'rgba(255,255,255,0.4)',
};

function barColor(w) {
  switch(w.phase) {
    case 'recovery': return chartColor.amber;
    case 'taper':    return chartColor.purple;
    case 'race':     return chartColor.red;
    default:         return chartColor.green;
  }
}

Chart.defaults.color = chartColor.tick;
Chart.defaults.font.family = 'Inter, sans-serif';

/* Volume chart */
(function() {
  const ctx = document.getElementById('chart-volume').getContext('2d');
  const labels = PLAN.map(w => w.week);
  const data   = PLAN.map(w => w.totKm);
  const bgColors = PLAN.map(w => barColor(w));
  const borderColors = bgColors.map(c => c.replace('0.9)', '1)'));

  /* Highlight current week */
  const highlightBg = bgColors.map((c, i) => i === currentIdx ? c : c.replace('0.9)', '0.55)'));
  const highlightBorder = borderColors.map((c, i) => i === currentIdx ? '#2ecc71' : 'transparent');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'km/settimana',
        data,
        backgroundColor: highlightBg,
        borderColor: highlightBorder,
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(5,15,8,0.95)',
          borderColor: 'rgba(46,204,113,0.3)',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` ${ctx.parsed.y} km totali`,
            title: ([ctx]) => {
              const w = PLAN[ctx.dataIndex];
              return `${w.week} — ${phaseName(w.phase)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 9 }, maxRotation: 45 }
        },
        y: {
          grid: { color: chartColor.grid },
          ticks: { font: { size: 10 } },
          beginAtZero: true,
        }
      }
    }
  });
})();

/* Distribution doughnut */
(function() {
  const ctx = document.getElementById('chart-distribution').getContext('2d');

  /* Easy: d1 + d3 for all weeks */
  const easyKm  = PLAN.reduce((s, w) => s + (w.d1km||0) + (w.d3km||0), 0);
  const repKm   = PLAN.filter(w => sessionType(w.d2desc) === 'reps').reduce((s,w) => s + (w.d2km||0), 0);
  const tempoKm = PLAN.filter(w => sessionType(w.d2desc) === 'tempo').reduce((s,w) => s + (w.d2km||0), 0);
  const longKm  = PLAN.reduce((s, w) => s + (w.d4km||0), 0);

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Fondo Lento', 'Ripetute', 'Fondo Medio', 'Lungo'],
      datasets: [{
        data: [easyKm, repKm, tempoKm, longKm],
        backgroundColor: [
          'rgba(34,139,34,0.75)',
          'rgba(59,130,246,0.8)',
          'rgba(168,85,247,0.8)',
          'rgba(245,158,11,0.8)',
        ],
        borderColor: [
          'rgba(46,204,113,0.6)',
          'rgba(96,165,250,0.6)',
          'rgba(192,132,252,0.6)',
          'rgba(251,191,36,0.6)',
        ],
        borderWidth: 1.5,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 10 }, padding: 12, boxWidth: 10 }
        },
        tooltip: {
          backgroundColor: 'rgba(5,15,8,0.95)',
          borderColor: 'rgba(46,204,113,0.3)',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` ${ctx.parsed} km (${Math.round(ctx.parsed/totalKm*100)}%)`
          }
        }
      }
    }
  });
})();

/* ----------------------------------------------------------
   BUILD WEEK CARDS GRID
   ---------------------------------------------------------- */
const grid = document.getElementById('weeks-grid');

PLAN.forEach((w, idx) => {
  const phase = w.phase || 'build';
  const isCurrentWeek = idx === currentIdx;

  const d2type = sessionType(w.d2desc);
  const kmPct  = Math.round((w.totKm / maxKm) * 100);

  const col = document.createElement('div');
  col.className = 'col-6 col-md-4 col-lg-3 weeks-grid-item';
  col.dataset.phase = phase;

  col.innerHTML = `
    <div class="week-card ${phaseClass(phase)}${isCurrentWeek ? ' is-current' : ''}" 
         data-week-idx="${idx}" role="button" tabindex="0"
         aria-label="Settimana ${w.week}: ${w.totKm} km">
      <span class="phase-tag">${phaseName(phase).split(' ')[1]}</span>
      <span class="week-number">
        ${w.week}${isCurrentWeek ? '<span class="current-badge">In corso</span>' : ''}
      </span>
      <span class="week-km">${w.totKm}</span>
      <span class="week-km-label">km totali</span>
      <div class="week-sessions">
        ${w.d1km ? `<span class="ws-badge easy">🏃 ${w.d1km}km</span>` : ''}
        ${w.d2km ? `<span class="ws-badge ${d2type}">${sessionIcon(d2type)} ${w.d2km}km</span>` : ''}
        ${w.d3km ? `<span class="ws-badge easy">🏃 ${w.d3km}km</span>` : ''}
        ${w.d4km ? `<span class="ws-badge ${phase === 'race' ? 'race' : 'long'}">🏅 ${w.d4km}km</span>` : ''}
      </div>
      <div class="km-bar-wrap">
        <div class="km-bar">
          <div class="km-bar-fill" style="width:${kmPct}%"></div>
        </div>
      </div>
    </div>
  `;

  grid.appendChild(col);
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
      if (phase === 'all' || item.dataset.phase === phase) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ----------------------------------------------------------
   WEEK DETAIL MODAL
   ---------------------------------------------------------- */
const weekModal    = new bootstrap.Modal(document.getElementById('weekModal'));
const modalTitle   = document.getElementById('weekModalLabel');
const modalBody    = document.getElementById('weekModalBody');

function buildSessionBlock(icon, typeClass, typeLabel, km, desc) {
  if (!desc || desc === 'OFF') {
    return `
      <div class="session-detail-block">
        <span class="sdb-type"><span class="sdb-icon">🛌</span> Riposo</span>
        <span class="sdb-km off">—</span>
        <p class="sdb-desc opacity-50">Giornata di recupero</p>
      </div>`;
  }

  /* Extract pace tags from description */
  const pacePat = /[@][\s]*([\d'":]+(?:\/km)?)/g;
  let richDesc = desc.replace(pacePat, match => {
    const val = match.replace('@', '').trim();
    return `<span class="pace-tag">${val}</span>`;
  });

  return `
    <div class="session-detail-block">
      <span class="sdb-type"><span class="sdb-icon">${icon}</span> ${typeLabel}</span>
      <span class="sdb-km ${typeClass}">${km} km</span>
      <p class="sdb-desc">${richDesc}</p>
    </div>`;
}

grid.addEventListener('click', e => {
  const card = e.target.closest('[data-week-idx]');
  if (!card) return;
  openWeekModal(parseInt(card.dataset.weekIdx, 10));
});

grid.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    const card = e.target.closest('[data-week-idx]');
    if (card) {
      e.preventDefault();
      openWeekModal(parseInt(card.dataset.weekIdx, 10));
    }
  }
});

function openWeekModal(idx) {
  const w = PLAN[idx];
  if (!w) return;

  const phase    = w.phase || 'build';
  const isNow    = idx === currentIdx;
  const weekNum  = idx + 1;
  const d2type   = sessionType(w.d2desc);
  const longType = phase === 'race' ? 'race' : 'long';

  /* Monthly progress */
  const completedKm = PLAN.slice(0, idx).reduce((s, ww) => s + ww.totKm, 0);
  const progressPct = Math.round((completedKm / totalKm) * 100);

  modalTitle.innerHTML = `
    ${phaseName(phase)} — ${w.week}
    ${isNow ? '<span class="current-badge ms-2">In corso</span>' : ''}
    <span class="ms-2 opacity-40 small">(Settimana ${weekNum}/35)</span>
  `;

  modalBody.innerHTML = `
    <!-- Stats pills -->
    <div class="modal-stat-row">
      <div class="modal-stat-pill">📏 <span class="msp-val">${w.totKm} km</span> totali</div>
      <div class="modal-stat-pill">🗓️ <span class="msp-val">4</span> sessioni</div>
      <div class="modal-stat-pill">📈 <span class="msp-val">${weekNum}/35</span> settimane</div>
      <div class="modal-stat-pill">🏆 <span class="msp-val">${Math.round(w.totKm/maxKm*100)}%</span> del picco</div>
    </div>

    <!-- Progress -->
    <div class="progress-section">
      <span class="small opacity-50">Progressione piano: <strong>${progressPct}%</strong> dei ${totalKm} km completata prima di questa settimana</span>
      <div class="trn-progress-bar mt-1">
        <div class="trn-progress-fill" style="width:${progressPct}%"></div>
      </div>
    </div>

    <!-- Session blocks 2-col -->
    <div class="row g-3">
      <div class="col-12 col-md-6">
        <h6 class="small opacity-50 text-uppercase letter-spacing mb-2">👟 Day 1 — Fondo Lento</h6>
        ${buildSessionBlock('🏃', 'easy', 'Fondo Lento', w.d1km, w.d1desc)}
      </div>
      <div class="col-12 col-md-6">
        <h6 class="small opacity-50 text-uppercase letter-spacing mb-2">${sessionIcon(d2type)} Day 2 — ${sessionLabel(d2type)}</h6>
        ${buildSessionBlock(sessionIcon(d2type), d2type, sessionLabel(d2type), w.d2km, w.d2desc)}
      </div>
      <div class="col-12 col-md-6">
        <h6 class="small opacity-50 text-uppercase letter-spacing mb-2">🏃 Day 3 — Fondo Lento</h6>
        ${buildSessionBlock('🏃', 'easy', 'Fondo Lento', w.d3km, w.d3desc)}
      </div>
      <div class="col-12 col-md-6">
        <h6 class="small opacity-50 text-uppercase letter-spacing mb-2">🏅 Day 4 — ${phase === 'race' ? 'Gara' : 'Lungo'}</h6>
        ${buildSessionBlock('🏅', longType, phase === 'race' ? 'Maratona' : 'Lungo', w.d4km, w.d4desc)}
      </div>
    </div>
  `;

  weekModal.show();
}
