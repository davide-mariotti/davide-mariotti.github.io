// Atleta demo (?a=sample): un anno di dati finti generati nel browser, nello stesso formato di fetch.py.
// Fa vedere la dashboard a chi non ha un account: nessun dato reale, nessun login.
// Usa addDays, monday, daysBetween, sum, avg e TODAY_REAL di common.js. Il generatore è deterministico:
// a ogni apertura escono gli stessi numeri, solo le date scorrono con oggi.
(() => {
let seed = 1;
const rnd = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const jit = a => (rnd() * 2 - 1) * a;
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
const R = Math.round;
const NAME = 'Atleta Demo', TODAY = TODAY_REAL, FROM = addDays(TODAY, -364), YDAY = addDays(TODAY, -1);
const ZF = [112, 131, 150, 165, 178], ZMID = [121, 140, 157, 171, 183];
const DAYS = []; for (let d = FROM; d <= TODAY; d = addDays(d, 1)) DAYS.push(d);
const weekday = d => (new Date(d + 'T12:00:00Z').getUTCDay() + 6) % 7;  // 0 = lunedì
const fit = d => daysBetween(FROM, d) / 364;  // 0 → 1: la forma migliora durante l'anno
const PACE = f => ({ E: 372 - 24 * f, T: 300 - 20 * f, I: 278 - 18 * f, H: 296 - 20 * f });  // s/km

// ---------- attività: ogni seduta è una lista di giri { d metri, t secondi, hr, int } ----------
const seg = (d, pace, hr, int = 'active') => ({ d, t: d / 1000 * pace * (1 + jit(.015)), hr: hr + jit(2), int });
const laps = (km, pace, hr, int = 'active', drift = 0, len = 1) => {  // giri automatici da `len` km
  const out = [];
  for (let k = 0; k * len < km - 1e-9; k++) out.push(seg(Math.min(len, km - k * len) * 1000, pace, hr + k * drift, int));
  return out;
};
const reps = (n, d, pace, hr, rec, recPace) => Array.from({ length: n }, () => [seg(d, pace, hr), seg(rec, recPace, 146, 'recovery')]).flat();
const wu = p => laps(2, p.E, 138, 'warmup'), cd = p => laps(1.5, p.E, 146, 'cooldown');
const RUNS = {
  easy: (p, km) => ['Corsa facile', laps(km, p.E, 142, 'active', .3)],
  long: (p, km) => ['Lungo', laps(km, p.E + 10, 141, 'active', .5)],
  reps: p => ['Ripetute 6×1 km', [...wu(p), ...reps(6, 1000, p.I, 172, 400, p.E + 60), ...cd(p)]],
  tempo: p => ['Tempo 6 km', [...wu(p), ...laps(6, p.T, 164, 'active', .7), ...cd(p)]],
  fartlek: p => ['Fartlek 8×500 m', [...wu(p), ...reps(8, 500, p.I + 6, 168, 500, p.E), ...cd(p)]],
  race10: p => ['Gara 10 km', laps(10, p.T - 8, 170, 'active', .9)],
  half: p => ['Mezza maratona (gara)', laps(21.1, p.H, 165, 'active', .5)],
};
function best(segs, X) {  // tempo migliore su X metri (finestre che partono a inizio giro)
  const D = [0], T = [0];
  segs.forEach(s => { D.push(D.at(-1) + s.d); T.push(T.at(-1) + s.t); });
  if (D.at(-1) < X) return null;
  const at = d => { const i = D.findIndex(x => x >= d); return i <= 0 ? 0 : T[i - 1] + (d - D[i - 1]) / (D[i] - D[i - 1]) * (T[i] - T[i - 1]); };
  return Math.min(...D.filter(d => d + X <= D.at(-1)).map(d => at(d + X) - at(d)));
}
const ACTS = [], SEGS = {};
let nextId = 9e9;
function add(day, time, typeKey, name, segs) {
  const dist = sum(segs.map(s => s.d)), dur = sum(segs.map(s => s.t)), hr = sum(segs.map(s => s.hr * s.t)) / dur;
  const zones = ZMID.map(() => 0);
  segs.forEach(s => { const w = ZMID.map(m => Math.exp(-(((m - s.hr) / 7) ** 2))), tw = sum(w); w.forEach((x, i) => zones[i] += s.t * x / tw); });
  const load = dur / 60 * ((hr - 95) / 45) ** 2 * 1.7, spd = dist / dur;
  const a = {
    activityId: nextId++, activityName: name, startTimeLocal: `${day} ${time}:00`, activityType: { typeKey },
    distance: dist, duration: dur, movingDuration: dur * .99, averageSpeed: spd, averageHR: R(hr), maxHR: R(Math.max(...segs.map(s => s.hr)) + 5 + rnd() * 4),
    activityTrainingLoad: load, aerobicTrainingEffect: +clamp(1 + load / 60, 1, 5).toFixed(1), anaerobicTrainingEffect: +clamp((zones[3] + zones[4]) / 500, 0, 4).toFixed(1),
    calories: R(dur / 60 * (hr - 55) * .11), elevationGain: dist ? R(dist / 1000 * (3 + rnd() * 9)) : null, differenceBodyBattery: -R(load / 6 + 3),
    locationName: 'Firenze', ownerFullName: NAME, manualActivity: false,
    ...Object.fromEntries(zones.map((z, i) => [`hrTimeInZone_${i + 1}`, z])),
  };
  if (typeKey === 'running') {
    const cad = 158 + spd * 6 + jit(2), stride = spd * 60 / cad * 100, vr = 10.4 - spd * .5 + jit(.3);
    Object.assign(a, { averageRunningCadenceInStepsPerMinute: cad, avgStrideLength: stride, avgGroundContactTime: 290 - spd * 12 + jit(5), avgVerticalRatio: vr, avgVerticalOscillation: stride * vr / 100, avgPower: 92 * spd + 20 + jit(5) });
    [1000, 5000, 10000, 21098, 42195].forEach(X => { const b = best(segs, X); if (b) a[`fastestSplit_${X}`] = b; });
  }
  SEGS[a.activityId] = segs;
  ACTS.push(a);
}
const at = (h, m) => `${String(h).padStart(2, '0')}:${String(R(m + rnd() * 20)).padStart(2, '0')}`;
DAYS.forEach((d, i) => {
  if (d >= TODAY || (i > 196 && i < 210) || rnd() < .07) return;  // due settimane di pausa e qualche seduta saltata
  const p = PACE(fit(d)), wd = weekday(d), w = Math.floor(daysBetween(monday(FROM), d) / 7), ago = daysBetween(d, TODAY);
  const run = (k, ...x) => { const [name, segs] = RUNS[k](p, ...x); add(d, wd > 4 ? at(8, 20) : at(7, 0), 'running', name, segs); };
  if (wd === 0 && rnd() < .35) add(d, at(18, 30), 'strength_training', 'Forza', [{ d: 0, t: 2400 + jit(300), hr: 108 + jit(5), int: 'active' }]);
  if (wd === 1 || wd === 4) run('easy', R(7 + rnd() * 4));
  if (wd === 2) w % 4 === 3 ? run('easy', 7) : run(['reps', 'tempo', 'fartlek'][w % 3]);
  if (wd === 3 && rnd() < .4) add(d, at(19, 0), 'lap_swimming', 'Nuoto in piscina', laps(1.5 + R(rnd() * 7) / 10, 1250 + jit(60), 128, 'active', 0, .1));
  if ((wd === 3 || wd === 5) && rnd() < .35) add(d, at(9, 0), 'cycling', 'Giro in bici', laps(35 + R(rnd() * 35), 3600 / (26 + jit(2)), 128, 'active', .1, 5));
  if (wd === 6) ago >= 42 && ago < 49 ? run('half') : ago >= 140 && ago < 147 ? run('race10') : run('long', R(14 + [0, 2, 4, -3][w % 4] + 7 * fit(d)));
});

// ---------- dati giornalieri: sonno, HRV, FC a riposo e Body Battery risentono del carico del giorno prima ----------
const byDay = {};
ACTS.forEach(a => {
  const x = byDay[a.startTimeLocal.slice(0, 10)] ||= { load: 0, km: 0, kcal: 0, z: [0, 0, 0, 0, 0], max: 0 };
  x.load += a.activityTrainingLoad; x.kcal += a.calories; x.max = Math.max(x.max, a.maxHR);
  if (a.activityType.typeKey === 'running') x.km += a.distance / 1000;
  x.z = x.z.map((z, i) => z + a[`hrTimeInZone_${i + 1}`]);
});
const summaries = [], sleep = [], hrv = [], weight = [];
DAYS.forEach((d, i) => {
  const f = fit(d), wd = weekday(d), td = byDay[d] || {}, yl = byDay[addDays(d, -1)]?.load || 0;
  const rhr = R(50 - 4 * f + yl / 90 + jit(1.3));
  // sonno della notte che finisce la mattina di d (timestamp "locali" scritti come UTC, come fa Garmin)
  const sec = R(clamp(25200 + jit(3200) + (yl > 150 ? 900 : 0), 18000, 32000) / 60) * 60, awake = R(3 + rnd() * 20) * 60;
  const start = Date.parse(addDays(d, -1) + 'T23:00:00Z') + R(jit(50)) * 6e4;
  const deep = R(sec * (.16 + jit(.04)) / 60) * 60, rem = R(sec * (.21 + jit(.04)) / 60) * 60;
  const score = R(clamp(52 + (sec / 3600 - 6) * 15 + jit(6) - awake / 300, 35, 96));
  sleep.push({
    calendarDate: d, sleepScores: { overall: { value: score, qualifierKey: score >= 90 ? 'EXCELLENT' : score >= 80 ? 'GOOD' : score >= 60 ? 'FAIR' : 'POOR' } },
    sleepTimeSeconds: sec, deepSleepSeconds: deep, lightSleepSeconds: sec - deep - rem, remSleepSeconds: rem, awakeSleepSeconds: awake,
    sleepStartTimestampLocal: start, sleepEndTimestampLocal: start + (sec + awake) * 1000, sleepNeed: { actual: R(470 + yl / 6 + jit(10)) },
    avgHeartRate: rhr + 3, averageRespirationValue: +(14 + jit(.8)).toFixed(1), avgSleepStress: R(clamp(16 + jit(6) + yl / 40, 5, 40)),
  });
  const night = R(58 + 8 * f - yl / 35 + jit(7)), weekly = R(avg([...hrv.slice(-6).map(h => h.lastNightAvg), night]));
  const base = { balancedLow: R(52 + 6 * f), balancedUpper: R(70 + 7 * f) };
  base.lowUpper = base.balancedLow - 6;
  hrv.push({ calendarDate: d, lastNightAvg: night, weeklyAvg: weekly, baseline: base, status: weekly < base.lowUpper ? 'LOW' : weekly < base.balancedLow || weekly > base.balancedUpper ? 'UNBALANCED' : 'BALANCED' });
  const bbMax = R(clamp(30 + score * .55 + (night - 58) * .6 + jit(6), 20, 100)), drained = R(clamp(38 + (td.load || 0) / 3.5 + jit(10), 15, bbMax - 5));
  const stress = R(clamp(27 + jit(8) + (wd < 5 ? 4 : -3) + (score < 60 ? 5 : 0), 10, 60)), hi = clamp((stress - 20) / 150, .01, .12);
  const z = td.z || [0, 0, 0, 0, 0];
  summaries.push({
    calendarDate: d,
    heartRate: { restingValue: rhr, minValue: rhr - 3 - R(rnd() * 3), maxValue: Math.max(td.max || 0, R(118 + jit(12))) },
    bodyBattery: { minValue: bbMax - drained, maxValue: bbMax, chargedValue: R(clamp(drained + jit(8), 10, 90)), drainedValue: drained },
    movement: { steps: { value: R((6800 + jit(2600) + (td.km || 0) * 1350) * (d === TODAY ? .35 : 1)), goal: 8000 }, floorsAscended: { value: R(clamp(9 + jit(6), 0, 30)), goal: 10 } },
    stress: { avgLevel: stress, restDurationInMillis: .42 * 864e5, lowStressDurationInMillis: .18 * 864e5, mediumStressDurationInMillis: hi * 1.6 * 864e5, highStressDurationInMillis: hi * 864e5 },
    respiration: { avgValue: R(15 + jit(1)) },
    intensityMinutes: { goal: 150, moderate: R(z[1] / 60 + rnd() * 20), vigorous: R((z[2] + z[3] + z[4]) / 60) },
    calories: { burnedResting: R(1640 + jit(25)), burnedActive: R(320 + jit(120) + (td.kcal || 0)) },
  });
  if (i % 10 === 3) weight.push({ allWeightMetrics: [{ calendarDate: d, date: Date.parse(d + 'T07:30:00'), weight: R((71.8 - 1.9 * f + jit(.35)) * 10) * 100 }] });
});

// FC di ieri ogni 2 minuti e HRV dell'ultima notte ogni 5
const ySum = summaries.at(-2), yActs = ACTS.filter(a => a.startTimeLocal.startsWith(YDAY)), t0 = Date.parse(YDAY + 'T00:00:00');
const hrValues = Array.from({ length: 720 }, (_, k) => {
  const min = k * 2, h = min / 60;
  const a = yActs.find(x => { const s = +x.startTimeLocal.slice(11, 13) * 60 + +x.startTimeLocal.slice(14, 16); return min >= s && min < s + x.duration / 60; });
  return [t0 + min * 6e4, R(a ? a.averageHR + jit(7) : h < 6.8 || h > 23.2 ? ySum.heartRate.restingValue + 4 + jit(3) : 74 + 8 * Math.sin(h / 3) + jit(9))];
});
const lastHrv = hrv.at(-1);
const hrvReadings = Array.from({ length: 84 }, (_, k) => ({
  hrvValue: R(clamp(lastHrv.lastNightAvg + 10 * Math.sin(k / 9) + jit(12), 25, 140)),
  readingTimeLocal: new Date(Date.parse(YDAY + 'T23:20:00Z') + k * 3e5).toISOString().slice(0, 19) + '.0',
}));
const zone = (sport, s = 0) => ({ sport, trainingMethod: 'HR_RESERVE_BASED', ...Object.fromEntries(ZF.map((f, i) => [`zone${i + 1}Floor`, f - s])), maxHeartRateUsed: 188 - s, restingHeartRateUsed: 47, lactateThresholdHeartRateUsed: 170 - s });

window.GARMIN = {
  generated: `${TODAY}T07:00`, from: FROM,
  hrZones: [zone('DEFAULT'), zone('RUNNING'), zone('CYCLING', 8)],
  fitnessAge: { chronologicalAge: 38, fitnessAge: 31.4, components: { rhr: { value: summaries.at(-1).heartRate.restingValue }, bmi: { value: 22.4 }, vigorousDaysAvg: { value: 3 }, vigorousMinutesAvg: { value: 188 } } },
  summaries, sleep, hrv, weight, weightGoals: { userGoals: [{ goalValue: 69000 }] },
  heartRateDay: { calendarDate: YDAY, restingHeartRate: ySum.heartRate.restingValue, minHeartRate: Math.min(...hrValues.map(x => x[1])), maxHeartRate: Math.max(...hrValues.map(x => x[1])), heartRateValues: hrValues },
  hrvNight: { hrvSummary: { ...lastHrv, lastNight5MinHigh: Math.max(...hrvReadings.map(r => r.hrvValue)) }, hrvReadings },
  activities: ACTS.slice().reverse(),  // come Garmin: dalla più recente
};

// ---------- dettaglio attività (come i file act/<id>.js): serie, traccia GPS e giri ----------
const PARKS = [[43.7823, 11.2176], [43.7690, 11.2650], [43.7505, 11.2420]];
window.sampleActivity = id => {
  const a = window.GARMIN.activities.find(x => x.activityId === id), segs = SEGS[id];
  if (!a) return null;
  seed = id % 1e6;
  const run = a.activityType.typeKey === 'running', bike = a.activityType.typeKey === 'cycling', N = 600;
  const rec = { t: [], d: [], hr: [], spd: [], alt: [], cad: [], pwr: [] };
  let i = 0, ts = 0, ds = 0, hr = 92;
  for (let k = 1; k <= N; k++) {
    const t = k * a.duration / N;
    while (i < segs.length - 1 && t > ts + segs[i].t) { ts += segs[i].t; ds += segs[i].d; i++; }
    const s = segs[i], spd = s.d / s.t * (1 + jit(.05)), d = ds + Math.min(1, (t - ts) / s.t) * s.d;
    hr += (s.hr - hr) * .12 + jit(1.5);  // la FC insegue il target con un po' di ritardo
    rec.t.push(R(t)); rec.d.push(R(d)); rec.hr.push(R(hr)); rec.spd.push(+spd.toFixed(3));
    rec.alt.push(+(48 + 14 * Math.sin(d / 1300) + 6 * Math.sin(d / 410)).toFixed(1));
    rec.cad.push(run ? R(158 + spd * 6 + jit(2)) : R(86 + jit(4)));
    rec.pwr.push(run ? R(92 * spd + 20 + jit(8)) : R(165 + jit(30)));
  }
  // anello intorno a un parco di Firenze, percorso più volte se la seduta è lunga
  const [lat, lon] = PARKS[id % 3], L = Math.min(a.distance, bike ? 18000 : 3200 + rnd() * 2500), ax = L / (2 * Math.PI * .8246), by = ax * .6;
  const gps = run || bike ? rec.d.map(d => {
    const th = 2 * Math.PI * (d % L) / L, x = ax * Math.cos(th) + .12 * ax * Math.cos(3 * th), y = by * Math.sin(th) + .1 * by * Math.sin(2 * th);
    return [+(lat + y / 111320).toFixed(5), +(lon + x / (111320 * Math.cos(lat * Math.PI / 180))).toFixed(5)];
  }) : [];
  if (!a.distance) ['d', 'spd'].forEach(k => delete rec[k]);
  if (!run && !bike) ['alt', 'cad', 'pwr'].forEach(k => delete rec[k]);
  const lapList = segs.length > 1 ? segs.map(s => {
    const spd = s.d / s.t;
    return { t: s.t, d: s.d, spd, gap: spd * 1.01, hr: R(s.hr), mhr: R(s.hr + 4 + rnd() * 4), cad: run ? R(158 + spd * 6) : null, pwr: run ? R(92 * spd + 20) : null, asc: R(s.d / 1000 * 5 * rnd()), int: s.int };
  }) : [];
  return { rec, gps, laps: lapList };
};
})();
