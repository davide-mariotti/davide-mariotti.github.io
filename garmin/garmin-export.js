// Esporta le sedute di piano.js nel formato di mcp__garmin__schedule_workouts.
// Uso: node garmin-export.js 2026-11-30 2026-12-27 > export.json   (date incluse)
// I ritmi usano PLAN.BASE (piano.js), non la calibrazione salvata nel browser.
const vm = require('vm'), fs = require('fs');
global.window = global; global.addEventListener = () => {};
for (const f of ['common.js', 'piano.js']) vm.runInThisContext(fs.readFileSync(`${__dirname}/${f}`, 'utf8'));
const [from, to] = process.argv.slice(2);
if (!from || !to) { console.error('Uso: node garmin-export.js AAAA-MM-GG AAAA-MM-GG'); process.exit(1); }
const out = window.PLAN.sessions().filter(s => s.date >= from && s.date <= to)
  .map(s => ({ calendar_date: s.date, workout_data: window.PLAN.toGarmin(s) }));
console.error(`${out.length} sedute (VDOT ${window.PLAN.BASE.vdot}): ${out.map(o => o.workout_data.workoutName).join(' | ')}`);
process.stdout.write(JSON.stringify(out));
