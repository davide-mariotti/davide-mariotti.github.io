// Controlla piano.js con le regole dei piani di CLAUDE.md ("Regole dei piani"). Uso: node check-plan.js
// Prima dell'inizio del piano usa le corse vere (data/davide-mariotti/garmin.js, se c'è), poi le sedute pianificate.
// Esce con codice 1 se salta una regola ferrea; le linee guida sono solo avvisi.
const vm = require('vm'), fs = require('fs');
global.window = global; global.addEventListener = () => {};
for (const f of ['common.js', 'piano.js', 'data/davide-mariotti/garmin.js'])
  if (fs.existsSync(`${__dirname}/${f}`)) vm.runInThisContext(fs.readFileSync(`${__dirname}/${f}`, 'utf8'));
const P = window.PLAN, Z = P.zones(), S = P.sessions(Z), START = P.weeks[0].start;
const EASY = ['E', 'L', 'MZ', 'J', 'A'], HARD = ['Q', 'M', 'T', 'G'], QUALITY = ['Q', 'M'];

// corsa più lunga per giorno e km per settimana
const longest = {}, weekKm = {};
const addRun = (d, km, w = monday(d)) => { longest[d] = Math.max(longest[d] || 0, km); weekKm[w] = (weekKm[w] || 0) + km; };
(window.GARMIN?.activities || []).filter(a => isRun(a) && a.startTimeLocal < START).forEach(a => addRun(a.startTimeLocal.slice(0, 10), a.distance / 1000));
S.forEach(s => addRun(s.date, s.km, s.week.start));
const prevMax = (w, n) => Math.max(0, ...[...Array(n).keys()].map(i => weekKm[addDays(w, -7 * (i + 1))] || 0));
const pct = x => `${x > 0 ? '+' : ''}${Math.round(x * 100)}%`;
function zoneKm(steps, out = {}) {  // km per zona di una seduta
  for (const s of steps) {
    if (s.rep) { const o = zoneKm(s.steps); for (const k in o) out[k] = (out[k] || 0) + o[k] * s.rep; continue; }
    out[s[2]] = (out[s[2]] || 0) + P.estimate([s], Z).km;
  }
  return out;
}

const errors = [], warnings = [], rows = [];
let build = 0;
for (const w of P.weeks) {
  const km = weekKm[w.start] || 0, ss = S.filter(s => s.week === w), ref = prevMax(w.start, 4), ref3 = prevMax(w.start, 3);
  // 1. volume: al massimo +10% sulla settimana più alta delle 4 precedenti (dopo uno scarico si torna al livello di prima)
  if (ref && km > ref * 1.1 + 0.5) errors.push(`${w.start} volume ${nf(km)} km: ${pct(km / ref - 1)} sul massimo delle 4 settimane prima (${nf(ref)} km), limite +10%`);
  // 2. scarico (≥ 20% in meno del massimo delle 3 settimane prima) almeno ogni 4ª settimana
  const down = ref3 > 0 && km <= ref3 * 0.8;
  build = down ? 0 : build + 1;
  if (build > 3) errors.push(`${w.start} ${build}ª settimana di carico di fila: serve uno scarico ≤ ${nf(ref3 * 0.8)} km`);
  if (down && ss.filter(s => QUALITY.includes(s.type)).length > 1 && !ss.some(s => s.type === 'G')) warnings.push(`${w.start} settimana di scarico con più di una qualità`);
  // 4. sedute dure: al massimo 2 a settimana (qualità, tempo, test, gara) e mai due giorni di fila (contando anche il lungo)
  if (ss.filter(s => HARD.includes(s.type)).length > 2) errors.push(`${w.start} più di 2 sedute dure`);
  // 6. linee guida: ~80% del volume facile; soglia ≤ 10%, intervalli ≤ 8%, ripetute ≤ 5% del volume settimanale (Daniels)
  const zk = {}; ss.forEach(s => { const o = zoneKm(s.steps); for (const k in o) zk[k] = (zk[k] || 0) + o[k]; });
  const easy = EASY.reduce((a, k) => a + (zk[k] || 0), 0) / km;
  if (km && easy < 0.8 && !ss.some(s => ['G', 'T'].includes(s.type))) warnings.push(`${w.start} facile ${Math.round(easy * 100)}% del volume (riferimento 80%)`);
  for (const s of ss) {
    const o = zoneKm(s.steps);
    [['T', .10, 'soglia'], ['I', .08, 'intervalli'], ['R', .05, 'ripetute']].forEach(([k, cap, name]) => {
      if (o[k] > km * cap + 0.3) warnings.push(`${s.date} ${s.title}: ${nf(o[k], 1)} km di ${name}, ${Math.round(o[k] / km * 100)}% della settimana (Daniels: ≤ ${cap * 100}%)`);
    });
  }
  rows.push({ settimana: w.start, fase: w.phase, km: Math.round(km), 'vs max 4 sett.': ref ? pct(km / ref - 1) : '–', scarico: down ? 'sì' : '', 'facile %': km ? Math.round(easy * 100) : '–', lungo: Math.round(Math.max(0, ...ss.map(s => s.km))) });
}
// 3. lungo: nessuna seduta oltre +10% della corsa più lunga dei 30 giorni prima (Frandsen 2025); per le gare è un avviso
for (const s of S) {
  const max30 = Math.max(0, ...[...Array(30).keys()].map(i => longest[addDays(s.date, -(i + 1))] || 0));
  if (max30 && s.km > max30 * 1.1 + 0.05) (s.type === 'G' ? warnings : errors).push(`${s.date} ${s.title}: ${nf(s.km, 1)} km, ${pct(s.km / max30 - 1)} sulla corsa più lunga dei 30 giorni prima (${nf(max30, 1)} km), limite +10%`);
}
S.forEach((s, i) => { const n = S[i + 1]; if (n && daysBetween(s.date, n.date) === 1 && [...HARD, 'L'].includes(s.type) && [...HARD, 'L'].includes(n.type)) errors.push(`${s.date} e ${n.date}: due sedute dure di fila (${s.title}, ${n.title})`); });
// 5. avvicinamento alle gare: settimana prima ≤ 80% e settimana gara (senza la gara) ≤ 60% del picco delle 4 settimane precedenti, qualità mantenuta
for (const g of S.filter(s => s.type === 'G')) {
  const raceWeek = g.week.start, before = addDays(raceWeek, -7), peak = prevMax(before, 4);
  const rw = (weekKm[raceWeek] || 0) - g.km, bw = weekKm[before] || 0;
  if (bw > peak * 0.8 + 0.5) errors.push(`${g.title}: settimana prima ${nf(bw)} km, oltre l'80% del picco (${nf(peak)} km)`);
  if (rw > peak * 0.6 + 0.5) errors.push(`${g.title}: settimana gara ${nf(rw)} km senza la gara, oltre il 60% del picco (${nf(peak)} km)`);
  for (const w of [before, raceWeek]) if (!S.some(s => s.week.start === w && QUALITY.includes(s.type))) warnings.push(`${g.title}: nella settimana del ${w} manca una seduta di qualità (l'intensità va mantenuta)`);
}

console.table(rows);
console.log(errors.length ? `\nREGOLE FERREE VIOLATE (${errors.length}):\n- ${errors.join('\n- ')}` : '\nRegole ferree: tutte rispettate.');
if (warnings.length) console.log(`\nAvvisi (${warnings.length}):\n- ${warnings.join('\n- ')}`);
process.exit(errors.length ? 1 : 0);
