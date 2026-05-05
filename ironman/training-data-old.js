// ironman/training-data.js — Piano Ironman 70.3 Cervia
// Preparazione: 30 nov 2026 → 19 set 2027 (41 settimane)
// Sport: swim=🏊 bike=🚴 run=🏃 brick=🔱 rest=💤 core=💪
// Zone: Z1=recupero Z2=aerobico Z3=tempo Z4=soglia Z5=VO2max

const IM_PLAN = [

// ─── FASE 0 — Recupero post-maratona ───────────────────────────
{ week:'IM-W01', phase:'recovery', faseLabel:'FASE 0', dateRange:'30 nov – 06 dic', days:[
  {day:'LUN', sport:'rest', title:'Riposo Assoluto', desc:'Recupero post-maratona', durationMin:0},
  {day:'MAR', sport:'rest', title:'Riposo Assoluto', desc:'Camminata leggera 30\'', durationMin:0},
  {day:'MER', sport:'bike', title:'Bici (Scarico)', desc:'30\' Z1 (Pianura, frullare >90 rpm)', durationMin:30},
  {day:'GIO', sport:'swim', title:'Nuoto (Tecnica)', desc:'30\' — max 500m, scivolamento e confidenza', durationMin:30, swimM:500},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'Stretching/Yoga 20\'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Scarico)', desc:'45\' Z1 (Pianura, >90 rpm)', durationMin:45},
  {day:'DOM', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
]},

{ week:'IM-W02', phase:'recovery', faseLabel:'FASE 0', dateRange:'07 dic – 13 dic', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Tecnica)', desc:'40\' — max 800m, tavoletta e pull buoy', durationMin:40, swimM:800},
  {day:'MAR', sport:'bike', title:'Bici (Base)', desc:'45\' Z1/Z2 (Agilità >90 rpm)', durationMin:45},
  {day:'MER', sport:'core', title:'Core & Mobilità', desc:'30\' esercizi a corpo libero', durationMin:30},
  {day:'GIO', sport:'swim', title:'Nuoto (Tecnica)', desc:'40\' — max 800m, focus respirazione', durationMin:40, swimM:800},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Base)', desc:'1h Z1/Z2 (Percorso piatto)', durationMin:60},
  {day:'DOM', sport:'run', title:'Corsa (Ripresa)', desc:'35\' Z1 lentissima', durationMin:35},
]},

{ week:'IM-W03', phase:'base', faseLabel:'FASE 0', dateRange:'14 dic – 20 dic', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Tecnica/Volume)', desc:'45\' — 1000m, blocchi da 50m con ampio recupero', durationMin:45, swimM:1000},
  {day:'MAR', sport:'bike', title:'Bici (Base)', desc:'1h Z2 (FC <135 bpm)', durationMin:60},
  {day:'MER', sport:'run', title:'Corsa (Recupero)', desc:'45\' Fondo Lento Z1/Z2', durationMin:45},
  {day:'GIO', sport:'swim', title:'Nuoto (Tecnica/Volume)', desc:'45\' — 1000m, blocchi da 100m', durationMin:45, swimM:1000},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Leggero)', desc:'1h 15\' Z2 (Agilità costantemente controllata)', durationMin:75},
  {day:'DOM', sport:'run', title:'Corsa (Base)', desc:'55\' Fondo Lento Z2', durationMin:55},
]},

{ week:'IM-W04', phase:'base', faseLabel:'FASE 0', dateRange:'21 dic – 27 dic', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Volume Base)', desc:'45\' — 1200m continui misti a tecnica', durationMin:45, swimM:1200},
  {day:'MAR', sport:'bike', title:'Bici (Base)', desc:'1h 15\' Z2', durationMin:75},
  {day:'MER', sport:'run', title:'Corsa (Base)', desc:'1h Fondo Lento Z2', durationMin:60},
  {day:'GIO', sport:'swim', title:'Nuoto (Volume Base)', desc:'45\' — 1200m, focus trazione e spinta', durationMin:45, swimM:1200},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Base)', desc:'1h 30\' Z2 (Pianura, simulazione posizione aero)', durationMin:90},
  {day:'DOM', sport:'run', title:'Corsa (Base)', desc:'1h 05\' Z2 + 4 allunghi morbidi da 50m', durationMin:65},
]},

// ─── FASE 1 — Base Aerobica ─────────────────────────────────────
{ week:'IM-W05', phase:'base', faseLabel:'FASE 1', dateRange:'04 gen – 10 gen', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Tecnica)', desc:'1200m: 400m risc, 8×50m tecnica, 400m defat', durationMin:40, swimM:1200},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Base)', desc:'1h 05\' Z2 (FC <145 bpm)', durationMin:65},
  {day:'MER', sport:'bike', title:'Bici (Forza)', desc:'1h 15\' — 20\' risc, 4×5\' Z3 a 70rpm rec 3\', defat', durationMin:75},
  {day:'GIO', sport:'swim', title:'Nuoto (Volume)', desc:'1200m: 10×100m passo costante rec 15\", 200m defat', durationMin:40, swimM:1200},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Aerobico)', desc:'2h Z2 (Pianura, >85rpm, posizione aero)', durationMin:120},
  {day:'DOM', sport:'run', title:'Corsa (Lungo)', desc:'1h 15\' Z2', durationMin:75},
]},

{ week:'IM-W06', phase:'base', faseLabel:'FASE 1', dateRange:'11 gen – 17 gen', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Tecnica)', desc:'1300m: 400m risc, 10×50m tecnica, 400m pull buoy', durationMin:43, swimM:1300},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Base)', desc:'1h 05\' Z2 passo costante', durationMin:65},
  {day:'MER', sport:'bike', title:'Bici (Forza)', desc:'1h 15\' — 20\' risc, 4×6\' Z3 a 70rpm rec 3\', defat', durationMin:75},
  {day:'GIO', sport:'swim', title:'Nuoto (Volume)', desc:'1300m: 2×400m continui, 5×100m veloci', durationMin:43, swimM:1300},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Aerobico)', desc:'2h 15\' Z2 (Agilità >85rpm)', durationMin:135},
  {day:'DOM', sport:'run', title:'Corsa (Lungo)', desc:'1h 25\' Z2', durationMin:85},
]},

{ week:'IM-W07', phase:'base', faseLabel:'FASE 1', dateRange:'18 gen – 24 gen', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Tecnica)', desc:'1400m: focus gambe e scivolamento', durationMin:47, swimM:1400},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Base)', desc:'1h 05\' Z2', durationMin:65},
  {day:'MER', sport:'bike', title:'Bici (Soglia)', desc:'1h 20\' — 20\' risc, 4×8\' Z3 a 80rpm rec 4\', defat', durationMin:80},
  {day:'GIO', sport:'swim', title:'Nuoto (Endurance)', desc:'1400m: 3×400m continui rec 20\", 200m sciolti', durationMin:47, swimM:1400},
  {day:'VEN', sport:'run', title:'Corsa (Recupero Attivo)', desc:'45\' Z1 lentissima', durationMin:45},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Aerobico)', desc:'2h 30\' Z2 (Mangia e bevi leggero)', durationMin:150},
  {day:'DOM', sport:'run', title:'Corsa (Lungo)', desc:'1h 30\' Z2', durationMin:90},
]},

{ week:'IM-W08', phase:'recovery', faseLabel:'FASE 1', dateRange:'25 gen – 31 gen', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Scarico)', desc:'1000m: solo tecnica e tavoletta', durationMin:33, swimM:1000},
  {day:'MAR', sport:'run', title:'Corsa (Scarico)', desc:'55\' Z1/Z2', durationMin:55},
  {day:'MER', sport:'bike', title:'Bici (Scarico)', desc:'1h Z1/Z2 (Agilità pura >95rpm)', durationMin:60},
  {day:'GIO', sport:'swim', title:'Nuoto (Volume Leggero)', desc:'1200m: frazionati facili', durationMin:40, swimM:1200},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Ridotto)', desc:'1h 30\' Z2', durationMin:90},
  {day:'DOM', sport:'run', title:'Corsa (Base)', desc:'1h Z2', durationMin:60},
]},

{ week:'IM-W09', phase:'base', faseLabel:'FASE 1', dateRange:'01 feb – 07 feb', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Volume/Forza)', desc:'1500m: 500m risc, 5×100m con palette, 500m defat', durationMin:50, swimM:1500},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Base)', desc:'1h 10\' Z2', durationMin:70},
  {day:'MER', sport:'bike', title:'Bici (Sweet Spot)', desc:'1h 20\' — 20\' risc, 3×10\' Z3 alta rec 5\', defat', durationMin:80},
  {day:'GIO', sport:'swim', title:'Nuoto (Endurance)', desc:'1500m: 500m risc, 2×500m continui rec 30\"', durationMin:50, swimM:1500},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Aerobico)', desc:'2h 30\' Z2 (Simulazione idratazione)', durationMin:150},
  {day:'DOM', sport:'run', title:'Corsa (Lungo)', desc:'1h 35\' Z2', durationMin:95},
]},

{ week:'IM-W10', phase:'base', faseLabel:'FASE 1', dateRange:'08 feb – 14 feb', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Forza)', desc:'1600m: lavori centrali con pull buoy e palette', durationMin:53, swimM:1600},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Base)', desc:'1h 10\' Z2', durationMin:70},
  {day:'MER', sport:'bike', title:'Bici (Sweet Spot)', desc:'1h 25\' — 20\' risc, 3×12\' Z3 rec 5\', defat', durationMin:85},
  {day:'GIO', sport:'swim', title:'Nuoto (Endurance)', desc:'1600m: riscaldamento + 800m continui', durationMin:53, swimM:1600},
  {day:'VEN', sport:'run', title:'Corsa (Fartlek Leggero)', desc:'50\' — 10×1\' svelto Z3 / 1\' lento Z1', durationMin:50},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Aerobico)', desc:'2h 45\' Z2', durationMin:165},
  {day:'DOM', sport:'run', title:'Corsa (Lungo)', desc:'1h 40\' Z2', durationMin:100},
]},

{ week:'IM-W11', phase:'base', faseLabel:'FASE 1', dateRange:'15 feb – 21 feb', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Forza)', desc:'1700m: lavori centrali forza', durationMin:57, swimM:1700},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Base)', desc:'1h 10\' Z2', durationMin:70},
  {day:'MER', sport:'bike', title:'Bici (Soglia)', desc:'1h 30\' — 20\' risc, 3×15\' Z3 rec 5\', defat', durationMin:90},
  {day:'GIO', sport:'swim', title:'Nuoto (Passo Gara)', desc:'1800m: 3×500m a passo target 70.3 rec 20\"', durationMin:60, swimM:1800},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Aerobico)', desc:'3h Z2 (1 gel e idratazione)', durationMin:180},
  {day:'DOM', sport:'run', title:'Corsa (Lungo)', desc:'1h 45\' Z2', durationMin:105},
]},

{ week:'IM-W12', phase:'recovery', faseLabel:'FASE 1', dateRange:'22 feb – 28 feb', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Scarico)', desc:'1200m: scioltezza', durationMin:40, swimM:1200},
  {day:'MAR', sport:'run', title:'Corsa (Scarico)', desc:'55\' Z1/Z2', durationMin:55},
  {day:'MER', sport:'bike', title:'Bici (Scarico)', desc:'1h Z1 (>90rpm)', durationMin:60},
  {day:'GIO', sport:'swim', title:'Nuoto (Scarico)', desc:'1200m: tecnica', durationMin:40, swimM:1200},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Ridotto)', desc:'1h 45\' Z2', durationMin:105},
  {day:'DOM', sport:'run', title:'Corsa (Base)', desc:'1h 05\' Z2', durationMin:65},
]},

{ week:'IM-W13', phase:'base', faseLabel:'FASE 1', dateRange:'01 mar – 07 mar', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Volume)', desc:'1800m: 6×200m passo gara Z3', durationMin:60, swimM:1800},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Base)', desc:'1h 20\' Z2', durationMin:80},
  {day:'MER', sport:'bike', title:'Bici (Forza/Soglia)', desc:'1h 30\' — 20\' risc, 4×10\' Z3/Z4 rec 3\', defat', durationMin:90},
  {day:'GIO', sport:'swim', title:'Nuoto (Endurance)', desc:'1800m: 1000m continui centrali', durationMin:60, swimM:1800},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Aerobico)', desc:'2h 45\' Z2', durationMin:165},
  {day:'DOM', sport:'run', title:'Corsa (Lungo)', desc:'1h 50\' Z2', durationMin:110},
]},

{ week:'IM-W14', phase:'base', faseLabel:'FASE 1', dateRange:'08 mar – 14 mar', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Volume/Forza)', desc:'1900m: blocchi misti palette e pull buoy', durationMin:63, swimM:1900},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Base)', desc:'1h 20\' Z2', durationMin:80},
  {day:'MER', sport:'bike', title:'Bici (Sweet Spot)', desc:'1h 35\' — 20\' risc, 2×20\' Z3 alta rec 5\', defat', durationMin:95},
  {day:'GIO', sport:'swim', title:'Nuoto (Endurance)', desc:'2000m: distanza gara frazionata 4×500m', durationMin:67, swimM:2000},
  {day:'VEN', sport:'run', title:'Corsa (Fartlek Leggero)', desc:'50\' — 10×1\' svelto Z3 / 1\' lento Z1', durationMin:50},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Aerobico)', desc:'3h Z2', durationMin:180},
  {day:'DOM', sport:'run', title:'Corsa (Lungo)', desc:'1h 55\' Z2', durationMin:115},
]},

{ week:'IM-W15', phase:'base', faseLabel:'FASE 1', dateRange:'15 mar – 21 mar', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Volume Esteso)', desc:'2000m: continui misti', durationMin:67, swimM:2000},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Base)', desc:'1h 20\' Z2', durationMin:80},
  {day:'MER', sport:'bike', title:'Bici (Soglia)', desc:'1h 40\' — 20\' risc, 3×15\' Z3/Z4 rec 5\'', durationMin:100},
  {day:'GIO', sport:'swim', title:'Nuoto (Simulazione)', desc:'2100m: 1500m continui', durationMin:70, swimM:2100},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Aerobico)', desc:'3h 15\' Z2 (Simulazione alimentazione completa)', durationMin:195},
  {day:'DOM', sport:'run', title:'Corsa (Lungo)', desc:'2h Z2', durationMin:120},
]},

{ week:'IM-W16', phase:'recovery', faseLabel:'FASE 1', dateRange:'22 mar – 28 mar', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Scarico)', desc:'1500m: agilità', durationMin:50, swimM:1500},
  {day:'MAR', sport:'run', title:'Corsa (Scarico)', desc:'1h Z1/Z2', durationMin:60},
  {day:'MER', sport:'bike', title:'Bici (Scarico)', desc:'1h Z1', durationMin:60},
  {day:'GIO', sport:'swim', title:'Nuoto (Scarico)', desc:'1500m: tecnica', durationMin:50, swimM:1500},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'bike', title:'Bici (Lungo Ridotto)', desc:'2h Z2', durationMin:120},
  {day:'DOM', sport:'run', title:'Corsa (Base)', desc:'1h 20\' Z2', durationMin:80},
]},

// ─── FASE 2 — Build + BRICK ─────────────────────────────────────
{ week:'IM-W17', phase:'build', faseLabel:'FASE 2', dateRange:'29 mar – 04 apr', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Forza/Volume)', desc:'1800m (400m risc, 6x100m con palette rec 15\", 800m continui)', durationMin:60, swimM:1800},
  {day:'MAR', sport:'run', title:'Corsa (Qualità)', desc:'1h 20\' (15\' risc, 6x1000m Z3/Z4 rec 1\'30\" cammino, defat)', durationMin:80},
  {day:'MER', sport:'bike', title:'Bici (Sweet Spot)', desc:'1h 20\' (20\' risc, 4x8\' Z3 alta rec 4\', defat)', durationMin:80},
  {day:'GIO', sport:'swim', title:'Nuoto (Passo Gara)', desc:'1900m (300m risc, 3x500m al passo 70.3 rec 20\", 100m defat)', durationMin:63, swimM:1900},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK (Bici + Corsa)', desc:'Bici: 2h Z2 con 3x10\' a ritmo gara | T2 Veloce | Corsa: 30\' a ritmo gara', durationMin:150},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h Z1 (Pianura, >90 rpm)', durationMin:60},
]},

{ week:'IM-W18', phase:'build', faseLabel:'FASE 2', dateRange:'05 apr – 11 apr', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Forza/Volume)', desc:'1900m (400m risc, 8x100m con palette rec 15\", 700m pull buoy)', durationMin:63, swimM:1900},
  {day:'MAR', sport:'run', title:'Corsa (Qualità)', desc:'1h 25\' (15\' risc, 7x1000m Z3/Z4 rec 1\'30\", defat)', durationMin:85},
  {day:'MER', sport:'bike', title:'Bici (Sweet Spot)', desc:'1h 30\' (20\' risc, 4x10\' Z3 alta rec 4\', defat)', durationMin:90},
  {day:'GIO', sport:'swim', title:'Nuoto (Passo Gara)', desc:'2000m (400m risc, 2x800m al passo 70.3 rec 30\")', durationMin:67, swimM:2000},
  {day:'VEN', sport:'run', title:'Corsa (Fondo Lento)', desc:'55\' Z1/Z2 (Recupero attivo)', durationMin:55},
  {day:'SAB', sport:'brick', title:'BRICK (Bici + Corsa)', desc:'Bici: 2h 15\' Z2 con 4x10\' a ritmo gara | T2 Veloce | Corsa: 35\' a ritmo gara', durationMin:170},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h Z1 (>90 rpm)', durationMin:60},
]},

{ week:'IM-W19', phase:'build', faseLabel:'FASE 2', dateRange:'12 apr – 18 apr', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Forza/Volume)', desc:'2000m (400m risc, 10x100m con palette rec 10\", 600m sciolti)', durationMin:67, swimM:2000},
  {day:'MAR', sport:'run', title:'Corsa (Qualità)', desc:'1h 30\' (15\' risc, 4x2000m Z3 alta rec 2\', defat)', durationMin:90},
  {day:'MER', sport:'bike', title:'Bici (Soglia)', desc:'1h 30\' (20\' risc, 3x15\' Z4 bassa rec 5\', defat)', durationMin:90},
  {day:'GIO', sport:'swim', title:'Nuoto (Simulazione)', desc:'2100m (400m risc, 1500m continui senza soste)', durationMin:70, swimM:2100},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK (Bici + Corsa)', desc:'Bici: 2h 30\' Z2 con ultimi 30\' a ritmo gara | T2 Veloce | Corsa: 40\' a ritmo gara', durationMin:190},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h 15\' Z1', durationMin:75},
]},

{ week:'IM-W20', phase:'recovery', faseLabel:'FASE 2', dateRange:'19 apr – 25 apr', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Scarico)', desc:'1500m (Solo tecnica e scioltezza)', durationMin:50, swimM:1500},
  {day:'MAR', sport:'run', title:'Corsa (Scarico)', desc:'1h 05\' Fondo Lento Z2', durationMin:65},
  {day:'MER', sport:'bike', title:'Bici (Scarico)', desc:'1h Z1/Z2 (Agilità >95 rpm)', durationMin:60},
  {day:'GIO', sport:'swim', title:'Nuoto (Volume Leggero)', desc:'1500m (Frazionati corti e facili)', durationMin:50, swimM:1500},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK Ridotto', desc:'Bici: 1h 30\' Z2 | T2 Veloce | Corsa: 25\' Z2', durationMin:115},
  {day:'DOM', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
]},

{ week:'IM-W21', phase:'build', faseLabel:'FASE 2', dateRange:'26 apr – 02 mag', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Forza Pura)', desc:'2000m (Riscaldamento + 10x100m palette/pull buoy forti)', durationMin:67, swimM:2000},
  {day:'MAR', sport:'run', title:'Corsa (Qualità)', desc:'1h 25\' (15\' risc, 8x1000m Z4 rec 1\'30\", defat)', durationMin:85},
  {day:'MER', sport:'bike', title:'Bici (Vo2Max/Soglia)', desc:'1h 25\' (20\' risc, 5x5\' Z4/Z5 rec 3\', defat)', durationMin:85},
  {day:'GIO', sport:'swim', title:'Nuoto (Passo Gara)', desc:'2200m (3x600m passo 70.3 rec 20\")', durationMin:73, swimM:2200},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK (Bici + Corsa)', desc:'Bici: 2h 30\' (3x20\' ritmo gara) | T2 Veloce | Corsa: 35\' a ritmo gara', durationMin:185},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h Z1', durationMin:60},
]},

{ week:'IM-W22', phase:'build', faseLabel:'FASE 2', dateRange:'03 mag – 09 mag', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Forza Pura)', desc:'2100m (Lavori centrali da 200m misti palette)', durationMin:70, swimM:2100},
  {day:'MAR', sport:'run', title:'Corsa (Qualità)', desc:'1h 30\' (15\' risc, 5x2000m Z3/Z4 rec 2\', defat)', durationMin:90},
  {day:'MER', sport:'bike', title:'Bici (Soglia)', desc:'1h 30\' (20\' risc, 4x10\' Z4 rec 4\', defat)', durationMin:90},
  {day:'GIO', sport:'swim', title:'Nuoto (Passo Gara)', desc:'2300m (2x1000m passo 70.3 rec 30\")', durationMin:77, swimM:2300},
  {day:'VEN', sport:'run', title:'Corsa (Fondo Lento)', desc:'1h Z1/Z2', durationMin:60},
  {day:'SAB', sport:'brick', title:'BRICK (Bici + Corsa)', desc:'Bici: 2h 45\' (4x20\' ritmo gara) | T2 Veloce | Corsa: 40\' a ritmo gara', durationMin:205},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h Z1', durationMin:60},
]},

{ week:'IM-W23', phase:'build', faseLabel:'FASE 2', dateRange:'10 mag – 16 mag', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Endurance)', desc:'2200m (400m risc, 1500m continui pull buoy)', durationMin:73, swimM:2200},
  {day:'MAR', sport:'run', title:'Corsa (Medio/Qualità)', desc:'1h 35\' (15\' risc, 3x3000m Z3 alta rec 2\'30\", defat)', durationMin:95},
  {day:'MER', sport:'bike', title:'Bici (Soglia)', desc:'1h 35\' (20\' risc, 3x15\' Z4 rec 5\', defat)', durationMin:95},
  {day:'GIO', sport:'swim', title:'Nuoto (Simulazione)', desc:'2400m (1900m continui test passo gara)', durationMin:80, swimM:2400},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK (Bici + Corsa)', desc:'Bici: 3h (Ultimi 45\' a ritmo gara target) | T2 Veloce | Corsa: 45\' a ritmo gara', durationMin:225},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h 15\' Z1', durationMin:75},
]},

{ week:'IM-W24', phase:'recovery', faseLabel:'FASE 2', dateRange:'17 mag – 23 mag', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Scarico)', desc:'1600m (Tecnica)', durationMin:53, swimM:1600},
  {day:'MAR', sport:'run', title:'Corsa (Scarico)', desc:'45\' Fondo Lento Z2', durationMin:45},
  {day:'MER', sport:'bike', title:'Bici (Scarico)', desc:'1h 15\' Z1/Z2', durationMin:75},
  {day:'GIO', sport:'swim', title:'Nuoto (Scarico)', desc:'1600m (Scioltezza)', durationMin:53, swimM:1600},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK Ridotto', desc:'Bici: 1h 45\' Z2 | T2 Veloce | Corsa: 30\' Z2', durationMin:135},
  {day:'DOM', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
]},

{ week:'IM-W25', phase:'build', faseLabel:'FASE 2', dateRange:'24 mag – 30 mag', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (OW Simulazione)', desc:'2200m (Test avvistamento boe, 4x400m rec 15\")', durationMin:73, swimM:2200},
  {day:'MAR', sport:'run', title:'Corsa (Ritmo Gara)', desc:'1h 25\' (15\' risc, 6x1500m a Ritmo 70.3 rec 1\')', durationMin:85},
  {day:'MER', sport:'bike', title:'Bici (Sweet Spot Lunga)', desc:'1h 40\' (20\' risc, 4x15\' Z3 alta rec 5\', defat)', durationMin:100},
  {day:'GIO', sport:'swim', title:'Nuoto (Endurance)', desc:'2500m (500m risc, 3x600m passo gara)', durationMin:83, swimM:2500},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK (Bici + Corsa)', desc:'Bici: 3h (Frazionati 4x20\' ritmo gara) | T2 Veloce | Corsa: 50\' a ritmo gara', durationMin:230},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h Z1', durationMin:60},
]},

{ week:'IM-W26', phase:'build', faseLabel:'FASE 2', dateRange:'31 mag – 06 giu', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (OW Simulazione)', desc:'2300m (Blocchi da 500m con sighting)', durationMin:77, swimM:2300},
  {day:'MAR', sport:'run', title:'Corsa (Ritmo Gara)', desc:'1h 35\' (15\' risc, 4x3000m a Ritmo 70.3 rec 1\'30\")', durationMin:95},
  {day:'MER', sport:'bike', title:'Bici (Sweet Spot Lunga)', desc:'1h 45\' (20\' risc, 3x20\' Z3 alta rec 5\', defat)', durationMin:105},
  {day:'GIO', sport:'swim', title:'Nuoto (Endurance)', desc:'2600m (800m / 600m / 400m / 200m rec 20\")', durationMin:87, swimM:2600},
  {day:'VEN', sport:'run', title:'Corsa (Fondo Lento)', desc:'55\' Z1/Z2', durationMin:55},
  {day:'SAB', sport:'brick', title:'BRICK (Bici + Corsa)', desc:'Bici: 3h 15\' (2x40\' a ritmo gara target) | T2 Veloce | Corsa: 55\' a ritmo gara', durationMin:250},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h 15\' Z1', durationMin:75},
]},

{ week:'IM-W27', phase:'build', faseLabel:'FASE 2', dateRange:'07 giu – 13 giu', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Endurance Max)', desc:'2400m (2000m continui)', durationMin:80, swimM:2400},
  {day:'MAR', sport:'run', title:'Corsa (Ritmo Gara)', desc:'1h 40\' (15\' risc, 2x5000m a Ritmo 70.3 rec 2\')', durationMin:100},
  {day:'MER', sport:'bike', title:'Bici (Soglia/Gara)', desc:'2h (20\' risc, 2x30\' Ritmo Gara Z3 alta rec 10\')', durationMin:120},
  {day:'GIO', sport:'swim', title:'Nuoto (Velocità Base)', desc:'2700m (Frazionati da 100m e 200m veloci)', durationMin:90, swimM:2700},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK LUNGO', desc:'Bici: 3h 30\' (Ultima ora a ritmo gara) | T2 Veloce | Corsa: 1h a ritmo gara', durationMin:270},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h 15\' Z1', durationMin:75},
]},

{ week:'IM-W28', phase:'recovery', faseLabel:'FASE 2', dateRange:'14 giu – 20 giu', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Scarico)', desc:'1800m (Scioltezza)', durationMin:60, swimM:1800},
  {day:'MAR', sport:'run', title:'Corsa (Scarico)', desc:'1h Fondo Lento Z2', durationMin:60},
  {day:'MER', sport:'bike', title:'Bici (Scarico)', desc:'1h Z1', durationMin:60},
  {day:'GIO', sport:'swim', title:'Nuoto (Tecnica)', desc:'1800m (Recupero attivo)', durationMin:60, swimM:1800},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK Ridotto', desc:'Bici: 2h Z2 | T2 Veloce | Corsa: 35\' Z2', durationMin:155},
  {day:'DOM', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
]},

// ─── FASE 3 — Picco + simulazioni gara ──────────────────────────
{ week:'IM-W29', phase:'peak', faseLabel:'FASE 3', dateRange:'21 giu – 27 giu', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (OW Sim)', desc:'2200m (Sighting e partenze veloci, 4x400m centrali)', durationMin:73, swimM:2200},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Medio)', desc:'1h 25\' (15\' risc, 8 km a Ritmo Gara 70.3, defat)', durationMin:85},
  {day:'MER', sport:'bike', title:'Bici (VO2Max)', desc:'1h 30\' (20\' risc, 5x4\' Z5 rec 4\', defat)', durationMin:90},
  {day:'GIO', sport:'swim', title:'Nuoto (Simulazione)', desc:'2400m (3x800m a ritmo gara rec 30\")', durationMin:80, swimM:2400},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK (Simulazione Gara)', desc:'Bici: 3h (Alternanza 20\' Z2 / 20\' Z3) | T2 Veloce | Corsa: 10 km a Ritmo Gara', durationMin:230},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h Z1 (Pianura, >90 rpm)', durationMin:60},
]},

{ week:'IM-W30', phase:'peak', faseLabel:'FASE 3', dateRange:'28 giu – 04 lug', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (OW Sim)', desc:'2400m (Test avvistamento, blocchi da 500m continui)', durationMin:80, swimM:2400},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Medio)', desc:'1h 35\' (15\' risc, 10 km a Ritmo Gara 70.3, defat)', durationMin:95},
  {day:'MER', sport:'bike', title:'Bici (VO2Max)', desc:'1h 35\' (20\' risc, 6x4\' Z5 rec 4\', defat)', durationMin:95},
  {day:'GIO', sport:'swim', title:'Nuoto (Passo Gara)', desc:'2500m (1000m + 800m + 700m ritmo 70.3)', durationMin:83, swimM:2500},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK (Simulazione Gara)', desc:'Bici: 3h 15\' (60 km in Z3 target) | T2 Veloce | Corsa: 12 km a Ritmo Gara', durationMin:255},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h Z1', durationMin:60},
]},

{ week:'IM-W31', phase:'peak', faseLabel:'FASE 3', dateRange:'05 lug – 11 lug', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Endurance Estrema)', desc:'2600m (1500m continui + lavori corti)', durationMin:87, swimM:2600},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Medio)', desc:'1h 45\' (15\' risc, 12 km a Ritmo Gara 70.3, defat)', durationMin:105},
  {day:'MER', sport:'bike', title:'Bici (VO2Max)', desc:'1h 40\' (20\' risc, 5x5\' Z5 rec 5\', defat)', durationMin:100},
  {day:'GIO', sport:'swim', title:'Nuoto (Test 1900m)', desc:'2700m (Risc + 1900m continui cronometrati)', durationMin:90, swimM:2700},
  {day:'VEN', sport:'run', title:'Corsa (Recupero)', desc:'45\' Z1 Lentissima', durationMin:45},
  {day:'SAB', sport:'brick', title:'BRICK LUNGO (Gara)', desc:'Bici: 3h 30\' (Simulazione ~90km e nutrizione) | T2 Veloce | Corsa: 14 km a Ritmo Gara', durationMin:280},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h 15\' Z1', durationMin:75},
]},

{ week:'IM-W32', phase:'recovery', faseLabel:'FASE 3', dateRange:'12 lug – 18 lug', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Scarico)', desc:'1800m (Tecnica e scioltezza)', durationMin:60, swimM:1800},
  {day:'MAR', sport:'run', title:'Corsa (Scarico)', desc:'55\' Z1/Z2', durationMin:55},
  {day:'MER', sport:'bike', title:'Bici (Scarico)', desc:'1h Z1/Z2 (Agilità pura)', durationMin:60},
  {day:'GIO', sport:'swim', title:'Nuoto (Volume Leggero)', desc:'1800m (Frazionati aerobici)', durationMin:60, swimM:1800},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK Ridotto', desc:'Bici: 2h Z2 | T2 Veloce | Corsa: 5 km Z2', durationMin:145},
  {day:'DOM', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
]},

{ week:'IM-W33', phase:'peak', faseLabel:'FASE 3', dateRange:'19 lug – 25 lug', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Acque Libere/Sim)', desc:'2500m (Costruzione distanza e orientamento)', durationMin:83, swimM:2500},
  {day:'MAR', sport:'run', title:'Corsa (Ritmo Gara)', desc:'1h 35\' (15\' risc, 4x2000m Ritmo Gara rec 1\')', durationMin:95},
  {day:'MER', sport:'bike', title:'Bici (Soglia)', desc:'1h 45\' (20\' risc, 4x10\' Z4 rec 5\', defat)', durationMin:105},
  {day:'GIO', sport:'swim', title:'Nuoto (Passo Gara)', desc:'2500m (5x500m rec 20\")', durationMin:83, swimM:2500},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK LUNGO (Gara)', desc:'Bici: 3h 30\' (Frazionati lunghi Z3 target) | T2 Veloce | Corsa: 15 km a Ritmo Gara', durationMin:285},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h Z1', durationMin:60},
]},

{ week:'IM-W34', phase:'peak', faseLabel:'FASE 3', dateRange:'26 lug – 01 ago', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Acque Libere/Sim)', desc:'2600m (Simulazione \"tonnara\" partenze)', durationMin:87, swimM:2600},
  {day:'MAR', sport:'run', title:'Corsa (Ritmo Gara)', desc:'1h 40\' (15\' risc, 3x3000m Ritmo Gara rec 1\'30\")', durationMin:100},
  {day:'MER', sport:'bike', title:'Bici (Soglia)', desc:'1h 45\' (20\' risc, 4x12\' Z4 rec 5\', defat)', durationMin:105},
  {day:'GIO', sport:'swim', title:'Nuoto (Passo Gara)', desc:'2600m (2x1000m forti, 600m sciolti)', durationMin:87, swimM:2600},
  {day:'VEN', sport:'run', title:'Corsa (Recupero)', desc:'50\' Z1', durationMin:50},
  {day:'SAB', sport:'brick', title:'BRICK LUNGO (Gara)', desc:'Bici: 3h 30\' (Test finale setup aerobico ~90km) | T2 Veloce | Corsa: 16 km a Ritmo Gara', durationMin:290},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h 15\' Z1', durationMin:75},
]},

{ week:'IM-W35', phase:'peak', faseLabel:'FASE 3', dateRange:'02 ago – 08 ago', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Endurance Estrema)', desc:'2800m (Risc + 2000m continui forti)', durationMin:93, swimM:2800},
  {day:'MAR', sport:'run', title:'Corsa (Fondo Medio Specifico)', desc:'1h 50\' (15\' risc, 15 km a Ritmo Gara 70.3)', durationMin:110},
  {day:'MER', sport:'bike', title:'Bici (Soglia Lunga)', desc:'2h (20\' risc, 3x15\' Z4 rec 5\', defat)', durationMin:120},
  {day:'GIO', sport:'swim', title:'Nuoto (Simulazione Finale)', desc:'2800m (Test passo su 1900m + scioltezza)', durationMin:93, swimM:2800},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'THE MONSTER BRICK (Test Gara)', desc:'Bici: 90 km ESATTI simulazione gara totale | T2 Veloce | Corsa: 18 km Ritmo Gara', durationMin:270},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h 30\' Z1', durationMin:90},
]},

{ week:'IM-W36', phase:'recovery', faseLabel:'FASE 3', dateRange:'09 ago – 15 ago', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Scarico)', desc:'1800m (Tecnica e defaticamento)', durationMin:60, swimM:1800},
  {day:'MAR', sport:'run', title:'Corsa (Scarico)', desc:'55\' Fondo Lento Z2', durationMin:55},
  {day:'MER', sport:'bike', title:'Bici (Scarico)', desc:'1h 15\' Z1/Z2', durationMin:75},
  {day:'GIO', sport:'swim', title:'Nuoto (Volume Leggero)', desc:'1800m (Agilità)', durationMin:60, swimM:1800},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK Ridotto', desc:'Bici: 2h 15\' Z2 | T2 Veloce | Corsa: 6 km Z2', durationMin:165},
  {day:'DOM', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
]},

{ week:'IM-W37', phase:'peak', faseLabel:'FASE 3', dateRange:'16 ago – 22 ago', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Acque Libere/Sim)', desc:'2500m (Sighting e boe)', durationMin:83, swimM:2500},
  {day:'MAR', sport:'run', title:'Corsa (Fartlek Specifico)', desc:'1h 25\' (15\' risc, alternanza passo gara e passo mezza)', durationMin:85},
  {day:'MER', sport:'bike', title:'Bici (Richiamo Soglia)', desc:'1h 45\' (20\' risc, 5x6\' Z4 rec 3\', defat)', durationMin:105},
  {day:'GIO', sport:'swim', title:'Nuoto (Frazionati Veloci)', desc:'2500m (10x100m oltre passo gara rec 15\")', durationMin:83, swimM:2500},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK (Richiamo Specifico)', desc:'Bici: 80 km (Ultimi 40 km a ritmo gara) | T2 Veloce | Corsa: 15 km a Ritmo Gara', durationMin:225},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h Z1', durationMin:60},
]},

{ week:'IM-W38', phase:'peak', faseLabel:'FASE 3', dateRange:'23 ago – 29 ago', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Simulazione)', desc:'2500m (Test muta o body da gara)', durationMin:83, swimM:2500},
  {day:'MAR', sport:'run', title:'Corsa (Ritmo Gara)', desc:'1h 25\' (15\' risc, 10 km a Ritmo Gara 70.3)', durationMin:85},
  {day:'MER', sport:'bike', title:'Bici (Sweet Spot)', desc:'1h 30\' (20\' risc, 3x10\' Z3 alta rec 4\', defat)', durationMin:90},
  {day:'GIO', sport:'swim', title:'Nuoto (Rifinitura)', desc:'2000m (Frazionati medi e tecnica)', durationMin:67, swimM:2000},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK (Test Alimentazione Finale)', desc:'Bici: 85 km (Focus ingestione liquidi e gel) | T2 Veloce | Corsa: 12 km a Ritmo Gara', durationMin:220},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h Z1', durationMin:60},
]},

// ─── FASE 4 — Taper + 🏅 GARA ───────────────────────────────────
{ week:'IM-W39', phase:'taper', faseLabel:'FASE 4', dateRange:'30 ago – 05 set', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Volume Ridotto)', desc:'2000m (Tecnica e richiami ritmo gara)', durationMin:67, swimM:2000},
  {day:'MAR', sport:'run', title:'Corsa (Attivazione)', desc:'50\' (15\' risc, 6 km Ritmo Gara 70.3, defat)', durationMin:50},
  {day:'MER', sport:'bike', title:'Bici (Richiamo Z4)', desc:'1h 30\' (20\' risc, 3x5\' Z4 rec 3\', defat)', durationMin:90},
  {day:'GIO', sport:'swim', title:'Nuoto (Passo Gara)', desc:'1800m (Frazionati corti e agilità)', durationMin:60, swimM:1800},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK (Richiamo)', desc:'Bici: 2h (30\' Ritmo Gara target) | T2 Veloce | Corsa: 8 km Ritmo Gara', durationMin:160},
  {day:'DOM', sport:'bike', title:'Bici (Scarico Attivo)', desc:'1h Z1', durationMin:60},
]},

{ week:'IM-W40', phase:'taper', faseLabel:'FASE 4', dateRange:'06 set – 12 set', days:[
  {day:'LUN', sport:'swim', title:'Nuoto (Scioltezza)', desc:'1500m (Solo tecnica e scivolamento)', durationMin:50, swimM:1500},
  {day:'MAR', sport:'run', title:'Corsa (Ritmo Gara)', desc:'40\' (15\' risc, 4x1000m Ritmo Gara rec 1\', defat)', durationMin:40},
  {day:'MER', sport:'bike', title:'Bici (Gara/Attivazione)', desc:'1h 15\' (20\' risc, 2x10\' Ritmo Gara rec 3\')', durationMin:75},
  {day:'GIO', sport:'swim', title:'Nuoto (Agilità)', desc:'1200m (Risc + 4x50m progressivi)', durationMin:40, swimM:1200},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'SAB', sport:'brick', title:'BRICK (Simulazione Breve)', desc:'Bici: 1h 15\' (15\' Ritmo Gara) | T2 Veloce | Corsa: 5 km Ritmo Gara', durationMin:100},
  {day:'DOM', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
]},

{ week:'IM-W41', phase:'race', faseLabel:'FASE 4', dateRange:'13 set – 19 set', days:[
  {day:'LUN', sport:'rest', title:'Riposo Assoluto', desc:'', durationMin:0},
  {day:'MAR', sport:'swim', title:'Nuoto (Attivazione)', desc:'1000m (Risc + 4x50m scattanti, 200m defat)', durationMin:33, swimM:1000},
  {day:'MER', sport:'bike', title:'Bici (Attivazione)', desc:'45\' (Pianura Z1 con 4 allunghi brevi da 30\")', durationMin:45},
  {day:'GIO', sport:'run', title:'Corsa (Attivazione)', desc:'20\' (Fondo Lento + 4 allunghi da 20\")', durationMin:20},
  {day:'VEN', sport:'rest', title:'Riposo Assoluto (Viaggio)', desc:'Check-in e viaggio verso Cervia', durationMin:0},
  {day:'SAB', sport:'brick', title:'Warm-up Pre-Gara', desc:'15\' Bici Z1 + 10\' Corsa leggerissima (attivazione muscolare)', durationMin:25},
  {day:'DOM', sport:'race', title:'🏅 GARA: IRONMAN 70.3 CERVIA', desc:'Gara Finale: 1.9km Nuoto + 90km Bici + 21.1km Corsa', durationMin:360},
]},

]; // END IM_PLAN

const IM_PLAN_START = new Date('2026-11-30T00:00:00');
const IM_RACE_DATE  = new Date('2027-09-19T00:00:00'); 
const IM_RACE_NAME  = 'Ironman 70.3 Cervia';

