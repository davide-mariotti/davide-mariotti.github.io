// ironman/training-data.js — Piano Ironman 70.3 Cervia
// Preparazione: 04 gen 2027 → 19 set 2027
// Sport: swim=🏊 bike=🚴 run=🏃 brick=🔱 rest=💤 core=💪
// Zone: Z1=recupero Z2=aerobico Z3=tempo Z4=soglia Z5=VO2max

const IM_PLAN = [
  // ─── FASE 1 — MACROCICLO 1 (Settimana 1) ───────────────────────────
  {
    week: 'IM-W01', phase: 'base', faseLabel: 'MACROCICLO 1', dateRange: '04 gen – 10 gen', note: 'Prima settimana: focus su prendere le misure, nessuna fretta.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 45\' tecnica Z2', durationMin: 45, swimM: 2300 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 60\' Z2', durationMin: 60, runKm: 10 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 70\' Z2', durationMin: 70, bikeKm: 31 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 45\' (18\' drill + 4×100 Z2 + 19\' drill) | Corsa 30\' Z2', durationMin: 75, swimM: 2300, runKm: 5 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 50\' Z2', durationMin: 50, runKm: 8 },
      { day: 'SAB', sport: 'bike', title: 'Bici', desc: 'Bici outdoor 105\' Z2', durationMin: 105, bikeKm: 46 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' Z2', durationMin: 75, runKm: 13 },
    ]
  },

  // ─── FASE 1 — MACROCICLO 1 (Settimana 2) ───────────────────────────
  {
    week: 'IM-W02', phase: 'base', faseLabel: 'MACROCICLO 1', dateRange: '11 gen – 17 gen', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 50\' tecnica Z2', durationMin: 50, swimM: 2500 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 60\' (28\' Z2 + 4×20" Z4 rec 40" + 28\' Z2)', durationMin: 60, runKm: 10 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 75\' Z2', durationMin: 75, bikeKm: 33 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 50\' (20\' drill + 5×100 Z2 + 20\' drill) | Corsa 35\' Z2', durationMin: 85, swimM: 2500, runKm: 6 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 55\' Z2', durationMin: 55, runKm: 9 },
      { day: 'SAB', sport: 'bike', title: 'Bici', desc: 'Bici outdoor 120\' Z2', durationMin: 120, bikeKm: 53 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' Z2', durationMin: 80, runKm: 13 },
    ]
  },

  // ─── FASE 1 — MACROCICLO 1 (Settimana 3) ───────────────────────────
  {
    week: 'IM-W03', phase: 'base', faseLabel: 'MACROCICLO 1', dateRange: '18 gen – 24 gen', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 50\' tecnica Z2', durationMin: 50, swimM: 2500 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 65\' (29\' Z2 + 6×20" Z4 rec 40" + 30\' Z2)', durationMin: 65, runKm: 11 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' Z2', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 55\' (21\' drill + 6×100 Z2 + 22\' drill) | Corsa 40\' Z2', durationMin: 95, swimM: 2800, runKm: 7 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 60\' Z2', durationMin: 60, runKm: 10 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 120\' Z2 + brick: Corsa 15\' Z2', durationMin: 135, bikeKm: 53, runKm: 3 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 90\' Z2', durationMin: 90, runKm: 15 },
    ]
  },

  // ─── FASE 1 — MACROCICLO 1 (Settimana 4) ───────────────────────────
  {
    week: 'IM-W04', phase: 'recovery', faseLabel: 'MACROCICLO 1', dateRange: '25 gen – 31 gen', note: 'Settimana di scarico: volume −30%, intensità invariata.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 40\' solo tecnica Z1 ', durationMin: 40, swimM: 2000 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 45\' Z2', durationMin: 45, runKm: 8 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 50\' Z2', durationMin: 50, bikeKm: 22 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 40\' 4×100 Z2 | Corsa 25\' Z2', durationMin: 65, swimM: 2000, runKm: 4 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'bike', title: 'Bici', desc: 'Bici outdoor 90\' Z2', durationMin: 90, bikeKm: 40 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 60\' Z2', durationMin: 60, runKm: 10 },
    ]
  },

  // ─── FASE 1 — MACROCICLO 1 (Settimana 5) ───────────────────────────
  {
    week: 'IM-W05', phase: 'base', faseLabel: 'MACROCICLO 1', dateRange: '01 feb – 07 feb', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 55\' (25\' Z2 + 4×50 Z3 + 26\' Z2)', durationMin: 55, swimM: 2800 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 70\' (24\' Z2 + 3×5\' Z3 rec 2\' + 25\' Z2)', durationMin: 70, runKm: 12 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' Z2', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 55\' (20\' drill + 6×100 Z2 rec 20" + 21\' drill) | Corsa 40\' Z2', durationMin: 95, swimM: 2800, runKm: 7 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 60\' (27\' Z2 + 4×30" Z4 rec 1\' + 27\' Z2)', durationMin: 60, runKm: 10 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 135\' Z2 + brick: Corsa 20\' Z2', durationMin: 155, bikeKm: 60, runKm: 3 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 95\' Z2', durationMin: 95, runKm: 16 },
    ]
  },

  // ─── FASE 1 — MACROCICLO 1 (Settimana 6) ───────────────────────────
  {
    week: 'IM-W06', phase: 'base', faseLabel: 'MACROCICLO 1', dateRange: '08 feb – 14 feb', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 55\' (24\' Z2 + 6×50 Z3 + 25\' Z2)', durationMin: 55, swimM: 2800 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 70\' (20\' Z2 + 3×8\' Z3 rec 2\' + 20\' Z2)', durationMin: 70, runKm: 12 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' Z2', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 60\' (20\' drill + 8×100 Z2 rec 20" + 21\' drill) | Corsa 40\' Z2', durationMin: 100, swimM: 3000, runKm: 7 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 65\' (29\' Z2 + 4×30" Z4 rec 1\' + 30\' Z2)', durationMin: 65, runKm: 11 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 140\' Z2 + brick: Corsa 20\' Z2', durationMin: 160, bikeKm: 62, runKm: 3 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 100\' Z2', durationMin: 100, runKm: 17 },
    ]
  },

  // ─── FASE 1 — MACROCICLO 1 (Settimana 7) ───────────────────────────
  {
    week: 'IM-W07', phase: 'base', faseLabel: 'MACROCICLO 1', dateRange: '15 feb – 21 feb', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 60\' (27\' Z2 + 4×75 Z3 + 27\' Z2)', durationMin: 60, swimM: 3000 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' (19\' Z2 + 3×10\' Z3 rec 2\' + 20\' Z2)', durationMin: 75, runKm: 13 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (28\' Z2 + 3×5\' Z3 rec 3\' + 28\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 60\' (21\' drill + 8×100 Z2 rec 15" + 21\' drill) | Corsa 45\' Z2', durationMin: 105, swimM: 3000, runKm: 8 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 65\' (28\' Z2 + 6×30" Z4 rec 1\' + 28\' Z2)', durationMin: 65, runKm: 11 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 150\' Z2 + brick: Corsa 20\' Z2', durationMin: 170, bikeKm: 66, runKm: 3 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 105\' Z2', durationMin: 105, runKm: 18 },
    ]
  },

  // ─── FASE 1 — MACROCICLO 1 (Settimana 8) ───────────────────────────
  {
    week: 'IM-W08', phase: 'recovery', faseLabel: 'MACROCICLO 1', dateRange: '22 feb – 28 feb', note: 'Settimana di scarico: volume −30%, intensità invariata.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 45\' solo tecnica Z1 ', durationMin: 45, swimM: 2300 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 50\' Z2', durationMin: 50, runKm: 8 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 55\' Z2', durationMin: 55, bikeKm: 24 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 45\' 5×100 Z2 | Corsa 30\' Z2', durationMin: 75, swimM: 2300, runKm: 5 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'bike', title: 'Bici', desc: 'Bici outdoor 105\' Z2', durationMin: 105, bikeKm: 46 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 70\' Z2', durationMin: 70, runKm: 12 },
    ]
  },

  // ─── FASE 1 — MACROCICLO 1 (Settimana 9) ───────────────────────────
  {
    week: 'IM-W09', phase: 'base', faseLabel: 'MACROCICLO 1', dateRange: '01 mar – 07 mar', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 60\' (25\' Z2 + 6×75 Z3 + 26\' Z2)', durationMin: 60, swimM: 3000 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' (19\' Z2 + 3×10\' Z3 rec 2\' + 20\' Z2)', durationMin: 75, runKm: 13 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (24\' Z2 + 4×5\' Z3 rec 3\' + 24\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 65\' (21\' drill + 10×100 Z2 rec 15" + 21\' drill) | Corsa 45\' Z2', durationMin: 110, swimM: 3300, runKm: 8 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 70\' (30\' Z2 + 6×30" Z4 rec 1\' + 31\' Z2)', durationMin: 70, runKm: 12 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 150\' Z2 + brick: Corsa 25\' Z2', durationMin: 175, bikeKm: 66, runKm: 4 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 110\' Z2', durationMin: 110, runKm: 18 },
    ]
  },

  // ─── FASE 1 — MACROCICLO 1 (Settimana 10) ───────────────────────────
  {
    week: 'IM-W10', phase: 'base', faseLabel: 'MACROCICLO 1', dateRange: '08 mar – 14 mar', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 60\' (25\' Z2 + 2×200 Z3 rec 30" + 26\' Z2)', durationMin: 60, swimM: 3000 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' (17\' Z2 + 4×8\' Z3 rec 2\' + 18\' Z2)', durationMin: 75, runKm: 13 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (22\' Z2 + 4×6\' Z3 rec 3\' + 22\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 65\' (21\' drill + 10×100 Z2 rec 10" + 22\' drill) | Corsa 45\' Z2', durationMin: 110, swimM: 3300, runKm: 8 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 70\' (30\' Z2 + 6×30" Z4 rec 1\' + 31\' Z2)', durationMin: 70, runKm: 12 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 165\' Z2 + brick: Corsa 25\' Z2', durationMin: 190, bikeKm: 73, runKm: 4 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 115\' Z2', durationMin: 115, runKm: 19 },
    ]
  },

  // ─── FASE 1 — MACROCICLO 1 (Settimana 11) ───────────────────────────
  {
    week: 'IM-W11', phase: 'base', faseLabel: 'MACROCICLO 1', dateRange: '15 mar – 21 mar', note: 'Settimana di carico massimo del blocco base.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 65\' (25\' Z2 + 3×200 Z3 rec 30" + 26\' Z2)', durationMin: 65, swimM: 3300 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (16\' Z2 + 4×10\' Z3 rec 2\' + 16\' Z2)', durationMin: 80, runKm: 15 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (17\' Z2 + 5×6\' Z3 rec 3\' + 18\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 70\' (22\' drill + 12×100 Z2 rec 10" + 22\' drill) | Corsa 50\' Z2', durationMin: 120, swimM: 3500, runKm: 8 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' (31\' Z2 + 8×30" Z4 rec 1\' + 32\' Z2)', durationMin: 75, runKm: 13 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 180\' Z2 + brick: Corsa 25\' Z2', durationMin: 205, bikeKm: 80, runKm: 4 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 120\' Z2', durationMin: 120, runKm: 20 },
    ]
  },

  // ─── FASE 1 — MACROCICLO 1 (Settimana 12) ───────────────────────────
  {
    week: 'IM-W12', phase: 'recovery', faseLabel: 'MACROCICLO 1', dateRange: '22 mar – 28 mar', note: 'Scarico finale del blocco base. Pronti per il Build.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 45\' solo tecnica Z1 ', durationMin: 45, swimM: 2300 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 50\' Z2', durationMin: 50, runKm: 8 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 55\' Z2', durationMin: 55, bikeKm: 24 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 45\' 6×100 Z2 | Corsa 30\' Z2', durationMin: 75, swimM: 2300, runKm: 5 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'bike', title: 'Bici', desc: 'Bici outdoor 120\' Z2', durationMin: 120, bikeKm: 53 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' Z2', durationMin: 75, runKm: 13 },
    ]
  },

  // ─── FASE 2 — MACROCICLO 2 (Settimana 13) ───────────────────────────
  {
    week: 'IM-W13', phase: 'build', faseLabel: 'MACROCICLO 2', dateRange: '29 mar – 04 apr', note: 'Prima settimana Build: si introduce il lavoro a Z4 strutturato e le progressioni.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 60\' (25\' Z2 + 4×100 Z3 rec 20" + 26\' Z2)', durationMin: 60, swimM: 3000 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' (22\' Z2 + 3×8\' Z3 rec 2\' + 23\' Z2)', durationMin: 75, runKm: 13 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (18\' Z2 + 4×8\' Z3 rec 3\' + 18\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 70\' (26\' drill + 8×100 Z3 rec 15" + 26\' drill) | Corsa 45\' Z2', durationMin: 115, swimM: 3500, runKm: 8 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 70\' (29\' Z2 + 4×1\' Z4 rec 2\' + 29\' Z2)', durationMin: 70, runKm: 12 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 165\' Z2 + brick: Corsa 25\' Z2', durationMin: 190, bikeKm: 73, runKm: 4 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 110\' Z2', durationMin: 110, runKm: 18 },
    ]
  },

  // ─── FASE 2 — MACROCICLO 2 (Settimana 14) ───────────────────────────
  {
    week: 'IM-W14', phase: 'build', faseLabel: 'MACROCICLO 2', dateRange: '05 apr – 11 apr', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 65\' (25\' Z2 + 6×100 Z3 rec 15" + 26\' Z2)', durationMin: 65, swimM: 3300 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' (19\' Z2 + 3×10\' Z3 rec 2\' + 20\' Z2)', durationMin: 75, runKm: 13 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (12\' Z2 + 5×8\' Z3 rec 3\' + 13\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 70\' (23\' drill + 10×100 Z3 rec 15" + 24\' drill) | Corsa 50\' Z2', durationMin: 120, swimM: 3500, runKm: 8 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 70\' (27\' Z2 + 5×1\' Z4 rec 2\' + 28\' Z2)', durationMin: 70, runKm: 12 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 180\' Z2/Z3 + brick: Corsa 25\' Z2', durationMin: 205, bikeKm: 80, runKm: 4 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 115\' Z2', durationMin: 115, runKm: 19 },
    ]
  },

  // ─── FASE 2 — MACROCICLO 2 (Settimana 15) ───────────────────────────
  {
    week: 'IM-W15', phase: 'build', faseLabel: 'MACROCICLO 2', dateRange: '12 apr – 18 apr', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 65\' (25\' Z2 + 3×200 Z3 rec 30" + 26\' Z2)', durationMin: 65, swimM: 3300 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (20\' Z2 + 4×8\' Z3 rec 2\' + 20\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (16\' Z2 + 3×12\' Z3 rec 4\' + 16\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 70\' (22\' drill + 12×100 Z3 rec 10" + 22\' drill) | Corsa 50\' Z2', durationMin: 120, swimM: 3500, runKm: 8 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' (30\' Z2 + 5×1\' Z4 rec 2\' + 30\' Z2)', durationMin: 75, runKm: 13 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 180\' Z2/Z3 + brick: Corsa 30\' Z2', durationMin: 210, bikeKm: 80, runKm: 5 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 120\' Z2', durationMin: 120, runKm: 20 },
    ]
  },

  // ─── FASE 2 — MACROCICLO 2 (Settimana 16) ───────────────────────────
  {
    week: 'IM-W16', phase: 'recovery', faseLabel: 'MACROCICLO 2', dateRange: '19 apr – 25 apr', note: 'Scarico: volume −30%. Mantieni un tocco di qualità (1 seduta Z3 corta).', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 45\' (18\' Z2 + 4×100 Z2 + 19\' Z2)', durationMin: 45, swimM: 2300 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 50\' Z2', durationMin: 50, runKm: 8 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 60\' Z2', durationMin: 60, bikeKm: 27 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 50\' 6×100 Z2 rec 20" | Corsa 30\' Z2', durationMin: 80, swimM: 2500, runKm: 5 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 120\' Z2 + brick: Corsa 15\' Z2', durationMin: 135, bikeKm: 53, runKm: 3 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' Z2', durationMin: 80, runKm: 13 },
    ]
  },

  // ─── FASE 2 — MACROCICLO 2 (Settimana 17) ───────────────────────────
  {
    week: 'IM-W17', phase: 'build', faseLabel: 'MACROCICLO 2', dateRange: '26 apr – 02 mag', note: 'Inizia il lavoro a ritmo gara (Z3 sostenuto = pace 70.3).', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 70\' (26\' Z2 + 4×200 Z3 rec 30" + 26\' Z2)', durationMin: 70, swimM: 3500 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (22\' Z2 + 2×15\' Z3 rec 3\' + 22\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (17\' Z2 + 2×18\' Z3 rec 5\' + 17\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 75\' (26\' drill + 10×100 Z3 rec 10" + 27\' drill) | Corsa 50\' Z2', durationMin: 125, swimM: 3800, runKm: 8 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' (28\' Z2 + 6×1\' Z4 rec 2\' + 29\' Z2)', durationMin: 75, runKm: 13 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 180\' Z2/Z3 + brick: Corsa 30\' Z2/Z3', durationMin: 210, bikeKm: 80, runKm: 5 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 120\' Z2', durationMin: 120, runKm: 20 },
    ]
  },

  // ─── FASE 2 — MACROCICLO 2 (Settimana 18) ───────────────────────────
  {
    week: 'IM-W18', phase: 'build', faseLabel: 'MACROCICLO 2', dateRange: '03 mag – 09 mag', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 70\' (24\' Z2 + 5×200 Z3 rec 25" + 24\' Z2)', durationMin: 70, swimM: 3500 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (19\' Z2 + 2×18\' Z3 rec 3\' + 19\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (11\' Z2 + 3×15\' Z3 rec 4\' + 12\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 75\' (24\' drill + 12×100 Z3 rec 10" + 25\' drill) | Corsa 55\' Z2', durationMin: 130, swimM: 3800, runKm: 9 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' (28\' Z2 + 6×1\' Z4 rec 2\' + 29\' Z2)', durationMin: 75, runKm: 13 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 195\' Z2/Z3 + brick: Corsa 30\' Z3', durationMin: 225, bikeKm: 86, runKm: 5 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 125\' Z2', durationMin: 125, runKm: 21 },
    ]
  },

  // ─── FASE 2 — MACROCICLO 2 (Settimana 19) ───────────────────────────
  {
    week: 'IM-W19', phase: 'build', faseLabel: 'MACROCICLO 2', dateRange: '10 mag – 16 mag', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 75\' (27\' Z2 + 3×300 Z3 rec 30" + 28\' Z2)', durationMin: 75, swimM: 3800 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (19\' Z2 + 3×12\' Z3 rec 2\' + 19\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (7\' Z2 + 3×18\' Z3 rec 4\' + 7\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 75\' (24\' drill + 3×400 Z3 rec 40" + 25\' drill) | Corsa 55\' Z2', durationMin: 130, swimM: 3800, runKm: 9 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (31\' Z2 + 3×3\' Z4 rec 3\' + 31\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 195\' Z2/Z3 + brick: Corsa 35\' Z3', durationMin: 230, bikeKm: 86, runKm: 6 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 130\' Z2', durationMin: 130, runKm: 22 },
    ]
  },

  // ─── FASE 2 — MACROCICLO 2 (Settimana 20) ───────────────────────────
  {
    week: 'IM-W20', phase: 'recovery', faseLabel: 'MACROCICLO 2', dateRange: '17 mag – 23 mag', note: 'Secondo scarico: lascia passare la fatica accumulata.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 45\' (18\' Z2 + 4×100 Z2 + 19\' Z2)', durationMin: 45, swimM: 2300 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 50\' Z2', durationMin: 50, runKm: 8 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 60\' Z2', durationMin: 60, bikeKm: 27 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 50\' 6×100 Z2 rec 20" | Corsa 30\' Z2', durationMin: 80, swimM: 2500, runKm: 5 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 120\' Z2 + brick: Corsa 20\' Z2', durationMin: 140, bikeKm: 53, runKm: 3 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' Z2', durationMin: 80, runKm: 13 },
    ]
  },

  // ─── FASE 2 — MACROCICLO 2 (Settimana 21) ───────────────────────────
  {
    week: 'IM-W21', phase: 'build', faseLabel: 'MACROCICLO 2', dateRange: '24 mag – 30 mag', note: 'Ingresso del lavoro a Z4 prolungato e prime simulazioni parziali di gara.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 75\' (24\' Z2 + 4×300 Z3 rec 30" + 25\' Z2)', durationMin: 75, swimM: 3800 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (17\' Z2 + 2×20\' Z3 rec 3\' + 17\' Z2)', durationMin: 80, runKm: 15 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (15\' Z2 + 2×20\' Z3 rec 5\' + 15\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 80\' (23\' drill + 4×400 Z3 rec 30" + 23\' drill) | Corsa 55\' Z2', durationMin: 135, swimM: 4000, runKm: 9 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (28\' Z2 + 4×3\' Z4 rec 3\' + 28\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 210\' Z2/Z3 + brick: Corsa 35\' Z3', durationMin: 245, bikeKm: 93, runKm: 6 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 130\' Z2', durationMin: 130, runKm: 22 },
    ]
  },

  // ─── FASE 2 — MACROCICLO 2 (Settimana 22) ───────────────────────────
  {
    week: 'IM-W22', phase: 'build', faseLabel: 'MACROCICLO 2', dateRange: '31 mag – 06 giu', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 75\' (21\' Z2 + 5×300 Z3 rec 25" + 22\' Z2)', durationMin: 75, swimM: 3800 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (14\' Z2 + 3×15\' Z3 rec 2\' + 15\' Z2)', durationMin: 80, runKm: 15 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (7\' Z2 + 3×18\' Z3 rec 4\' + 7\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 80\' (19\' drill + 5×400 Z3 rec 25" + 19\' drill) | Corsa 60\' Z2', durationMin: 140, swimM: 4000, runKm: 10 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (28\' Z2 + 4×3\' Z4 rec 3\' + 28\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 210\' Z2/Z3 + brick: Corsa 40\' Z3', durationMin: 250, bikeKm: 93, runKm: 7 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 135\' Z2', durationMin: 135, runKm: 23 },
    ]
  },

  // ─── FASE 2 — MACROCICLO 2 (Settimana 23) ───────────────────────────
  {
    week: 'IM-W23', phase: 'build', faseLabel: 'MACROCICLO 2', dateRange: '07 giu – 13 giu', note: 'Settimana di carico massimo del Build. Simulazione parziale il sabato.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 75\' (27\' Z2 + 2×500 Z3 rec 40" + 27\' Z2)', durationMin: 75, swimM: 3800 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (10\' Z2 + 3×18\' Z3 rec 2\' + 10\' Z2)', durationMin: 80, runKm: 15 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (4\' Z2 + 4×15\' Z3 rec 3\' + 4\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 80\' (19\' drill + 5×400 Z3 rec 20" + 19\' drill) | Corsa 60\' Z2', durationMin: 140, swimM: 4000, runKm: 10 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (25\' Z2 + 5×3\' Z4 rec 3\' + 25\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 225\' Z2/Z3 + brick: Corsa 40\' Z3 (sim. parziale)', durationMin: 265, bikeKm: 99, runKm: 7 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 135\' Z2', durationMin: 135, runKm: 23 },
    ]
  },

  // ─── FASE 2 — MACROCICLO 2 (Settimana 24) ───────────────────────────
  {
    week: 'IM-W24', phase: 'recovery', faseLabel: 'MACROCICLO 2', dateRange: '14 giu – 20 giu', note: 'Scarico finale Build. Ripristino completo prima del macrociclo Peak.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 50\' (21\' Z2 + 4×100 Z2 + 21\' Z2)', durationMin: 50, swimM: 2500 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 50\' Z2', durationMin: 50, runKm: 8 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 60\' Z2', durationMin: 60, bikeKm: 27 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 55\' 6×100 Z2 rec 20" | Corsa 30\' Z2', durationMin: 85, swimM: 2800, runKm: 5 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 135\' Z2 + brick: Corsa 20\' Z2', durationMin: 155, bikeKm: 60, runKm: 3 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 85\' Z2', durationMin: 85, runKm: 14 },
    ]
  },

  // ─── FASE 3 — MACROCICLO 3 (Settimana 25) ───────────────────────────
  {
    week: 'IM-W25', phase: 'peak', faseLabel: 'MACROCICLO 3', dateRange: '21 giu – 27 giu', note: 'Prima settimana Peak: intensità Z4 strutturata, brick più specifico.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 75\' (20\' Z2 + 4×400 Z3 rec 25" + 21\' Z2)', durationMin: 75, swimM: 3800 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (22\' Z2 + 4×6\' Z4 rec 3\' + 22\' Z2)', durationMin: 80, runKm: 15 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (11\' Z2 + 3×15\' Z3/Z4 rec 4\' + 12\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 80\' (15\' drill + 6×400 Z3 rec 20" + 15\' drill) | Corsa 60\' Z2', durationMin: 140, swimM: 4000, runKm: 10 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (25\' Z2 + 5×3\' Z4 rec 3\' + 25\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 210\' Z2/Z3 + brick: Corsa 40\' Z3', durationMin: 250, bikeKm: 93, runKm: 7 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 130\' Z2', durationMin: 130, runKm: 22 },
    ]
  },

  // ─── FASE 3 — MACROCICLO 3 (Settimana 26) ───────────────────────────
  {
    week: 'IM-W26', phase: 'peak', faseLabel: 'MACROCICLO 3', dateRange: '28 giu – 04 lug', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 75\' (16\' Z2 + 5×400 Z3 rec 20" + 17\' Z2)', durationMin: 75, swimM: 3800 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (18\' Z2 + 4×8\' Z4 rec 3\' + 18\' Z2)', durationMin: 80, runKm: 15 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (4\' Z2 + 4×15\' Z3/Z4 rec 3\' + 4\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 80\' (19\' drill + 2×1000 Z3 rec 1\' + 19\' drill) | Corsa 60\' Z2', durationMin: 140, swimM: 4000, runKm: 10 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (25\' Z2 + 5×3\' Z4 rec 3\' + 25\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 225\' Z2/Z3 + brick: Corsa 40\' Z3', durationMin: 265, bikeKm: 99, runKm: 7 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 135\' Z2', durationMin: 135, runKm: 23 },
    ]
  },

  // ─── FASE 3 — MACROCICLO 3 (Settimana 27) ───────────────────────────
  {
    week: 'IM-W27', phase: 'peak', faseLabel: 'MACROCICLO 3', dateRange: '05 lug – 11 lug', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 80\' (24\' Z2 + 3×500 Z3 rec 30" + 24\' Z2)', durationMin: 80, swimM: 4000 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (18\' Z2 + 5×6\' Z4 rec 2\'30" + 19\' Z2)', durationMin: 80, runKm: 15 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (10\' Z2 + 2×25\' Z3 rec 5\' + 10\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 80\' (15\' drill + 3×800 Z3 rec 40" + 15\' drill) | Corsa 60\' Z2', durationMin: 140, swimM: 4000, runKm: 10 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (22\' Z2 + 6×3\' Z4 rec 3\' + 22\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 225\' Z2/Z3 + brick: Corsa 45\' Z3 (sim. parziale)', durationMin: 270, bikeKm: 99, runKm: 8 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 135\' Z2', durationMin: 135, runKm: 23 },
    ]
  },

  // ─── FASE 3 — MACROCICLO 3 (Settimana 28) ───────────────────────────
  {
    week: 'IM-W28', phase: 'recovery', faseLabel: 'MACROCICLO 3', dateRange: '12 lug – 18 lug', note: 'Scarico: volume −30%. Mantieni 1 seduta di qualità per disciplina.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 50\' (21\' Z2 + 4×100 Z2 + 21\' Z2)', durationMin: 50, swimM: 2500 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 55\' (17\' Z2 + 3×5\' Z3 rec 2\' + 17\' Z2)', durationMin: 55, runKm: 10 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 60\' (19\' Z2 + 2×8\' Z3 rec 3\' + 19\' Z2)', durationMin: 60, bikeKm: 27 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 55\' 5×200 Z3 rec 30" | Corsa 30\' Z2', durationMin: 85, swimM: 2800, runKm: 5 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 135\' Z2 + brick: Corsa 20\' Z2', durationMin: 155, bikeKm: 60, runKm: 3 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 85\' Z2', durationMin: 85, runKm: 14 },
    ]
  },

  // ─── FASE 3 — MACROCICLO 3 (Settimana 29) ───────────────────────────
  {
    week: 'IM-W29', phase: 'peak', faseLabel: 'MACROCICLO 3', dateRange: '19 lug – 25 lug', note: 'Simulazione lunga il sabato: la più vicina alle distanze di gara dell\'intero piano.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 80\' (19\' Z2 + 4×500 Z3 rec 25" + 19\' Z2)', durationMin: 80, swimM: 4000 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (13\' Z2 + 5×8\' Z4 rec 2\'30" + 14\' Z2)', durationMin: 80, runKm: 15 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (5\' Z2 + 2×30\' Z3 rec 5\' + 5\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 80\' (9\' drill + 3×1000 Z3 rec 45" + 9\' drill) | Corsa 60\' Z2', durationMin: 140, swimM: 4000, runKm: 10 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' Z2 — gambe fresche per sabato', durationMin: 75, runKm: 13 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 240\' Z2/Z3 + brick: Corsa 50\' Z3 (sim. gara completa)', durationMin: 290, bikeKm: 106, runKm: 9 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 120\' Z2 — recupero attivo', durationMin: 120, runKm: 20 },
    ]
  },

  // ─── FASE 3 — MACROCICLO 3 (Settimana 30) ───────────────────────────
  {
    week: 'IM-W30', phase: 'peak', faseLabel: 'MACROCICLO 3', dateRange: '26 lug – 01 ago', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 80\' (19\' Z2 + 2×1000 Z3 rec 50" + 19\' Z2)', durationMin: 80, swimM: 4000 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (14\' Z2 + 4×10\' Z4 rec 3\' + 14\' Z2)', durationMin: 80, runKm: 15 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (4\' Z2 + 3×20\' Z3 rec 4\' + 4\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 80\' (7\' drill + 4×800 Z3 rec 30" + 7\' drill) | Corsa 60\' Z2', durationMin: 140, swimM: 4000, runKm: 10 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (25\' Z2 + 5×3\' Z4 rec 3\' + 25\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 225\' Z2/Z3 + brick: Corsa 45\' Z3', durationMin: 270, bikeKm: 99, runKm: 8 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 135\' Z2', durationMin: 135, runKm: 23 },
    ]
  },

  // ─── FASE 3 — MACROCICLO 3 (Settimana 31) ───────────────────────────
  {
    week: 'IM-W31', phase: 'peak', faseLabel: 'MACROCICLO 3', dateRange: '02 ago – 08 ago', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 80\' (15\' Z2 + 3×800 Z3 rec 25" + 16\' Z2)', durationMin: 80, swimM: 4000 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (15\' Z2 + 4×10\' Z4 rec 2\'30" + 15\' Z2)', durationMin: 80, runKm: 15 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (4\' Z2 + 4×18\' Z3/Z4 rec 3\' + 4\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 80\' (9\' drill + 5×600 Z3 rec 20" + 9\' drill) | Corsa 60\' Z2', durationMin: 140, swimM: 4000, runKm: 10 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (22\' Z2 + 6×3\' Z4 rec 3\' + 22\' Z2)', durationMin: 80, runKm: 14 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 240\' Z2/Z3 + brick: Corsa 45\' Z3', durationMin: 285, bikeKm: 106, runKm: 8 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 135\' Z2', durationMin: 135, runKm: 23 },
    ]
  },

  // ─── FASE 3 — MACROCICLO 3 (Settimana 32) ───────────────────────────
  {
    week: 'IM-W32', phase: 'recovery', faseLabel: 'MACROCICLO 3', dateRange: '09 ago – 15 ago', note: 'Secondo scarico Peak. Recupero profondo prima delle ultime 2 settimane di carico.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 50\' (21\' Z2 + 4×100 Z2 + 21\' Z2)', durationMin: 50, swimM: 2500 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 55\' (17\' Z2 + 2×8\' Z3 rec 2\' + 18\' Z2)', durationMin: 55, runKm: 10 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 60\' (16\' Z2 + 2×10\' Z3 rec 4\' + 16\' Z2)', durationMin: 60, bikeKm: 27 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 55\' 4×200 Z3 rec 30" | Corsa 30\' Z2', durationMin: 85, swimM: 2800, runKm: 5 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 140\' Z2 + brick: Corsa 20\' Z2', durationMin: 160, bikeKm: 62, runKm: 3 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 85\' Z2', durationMin: 85, runKm: 14 },
    ]
  },

  // ─── FASE 3 — MACROCICLO 3 (Settimana 33) ───────────────────────────
  {
    week: 'IM-W33', phase: 'peak', faseLabel: 'MACROCICLO 3', dateRange: '16 ago – 22 ago', note: 'Penultima settimana di carico: seduta di riferimento veloce il martedì (test forma).', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 80\' (9\' Z2 + 3×1000 Z3 rec 40" + 9\' Z2)', durationMin: 80, swimM: 4000 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 75\': 20\' Z2 + 30\' Z3/Z4 (test forma) + 25\' Z2', durationMin: 75, runKm: 14 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (5\' Z2 + 2×30\' Z3 rec 5\' + 5\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 80\' (9\' drill + 2×1500 Z3 rec 1\' + 9\' drill) | Corsa 60\' Z2', durationMin: 140, swimM: 4000, runKm: 10 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' Z2 — gambe fresche per sabato', durationMin: 75, runKm: 13 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 240\' Z2/Z3 + brick: Corsa 50\' Z3', durationMin: 290, bikeKm: 106, runKm: 9 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 130\' Z2', durationMin: 130, runKm: 22 },
    ]
  },

  // ─── FASE 3 — MACROCICLO 3 (Settimana 34) ───────────────────────────
  {
    week: 'IM-W34', phase: 'peak', faseLabel: 'MACROCICLO 3', dateRange: '23 ago – 29 ago', note: 'Ultima settimana Peak: carico alto ma controllato. Da domenica inizia il Taper.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 80\' (7\' Z2 + 4×800 Z3 rec 20" + 8\' Z2)', durationMin: 80, swimM: 4000 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 80\' (13\' Z2 + 5×8\' Z4 rec 2\'30" + 14\' Z2)', durationMin: 80, runKm: 15 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 80\' (4\' Z2 + 3×20\' Z3 rec 4\' + 4\' Z2)', durationMin: 80, bikeKm: 35 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 80\' (9\' drill + 3×1000 Z3 rec 30" + 9\' drill) | Corsa 60\' Z2', durationMin: 140, swimM: 4000, runKm: 10 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 75\' Z2 — gambe fresche per sabato', durationMin: 75, runKm: 13 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 210\' Z2/Z3 + brick: Corsa 40\' Z3', durationMin: 250, bikeKm: 93, runKm: 7 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 105\' Z2 — ultima lunga, poi inizia il Taper', durationMin: 105, runKm: 18 },
    ]
  },

  // ─── FASE 4 — MACROCICLO 4 (Settimana 35) ───────────────────────────
  {
    week: 'IM-W35', phase: 'taper', faseLabel: 'MACROCICLO 4', dateRange: '30 ago – 05 set', note: 'Volume −30% rispetto al Peak. Mantieni l\'intensità nelle sedute chiave: il corpo si ricorda della qualità, non della quantità.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 60\' (21\' Z2 + 4×200 Z3 rec 25" + 21\' Z2)', durationMin: 60, swimM: 3000 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 60\' (16\' Z2 + 3×6\' Z4 rec 3\' + 17\' Z2)', durationMin: 60, runKm: 11 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 70\' (16\' Z2 + 2×15\' Z3 rec 4\' + 16\' Z2)', durationMin: 70, bikeKm: 31 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 60\' (13\' drill + 4×400 Z3 rec 25" + 13\' drill) | Corsa 45\' Z2', durationMin: 105, swimM: 3000, runKm: 8 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 55\' (21\' Z2 + 4×1\' Z4 rec 2\' + 22\' Z2)', durationMin: 55, runKm: 9 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 150\' Z2 + brick: Corsa 25\' Z2/Z3', durationMin: 175, bikeKm: 66, runKm: 5 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 90\' Z2', durationMin: 90, runKm: 15 },
    ]
  },

  // ─── FASE 4 — MACROCICLO 4 (Settimana 36) ───────────────────────────
  {
    week: 'IM-W36', phase: 'taper', faseLabel: 'MACROCICLO 4', dateRange: '06 set – 12 set', note: 'Volume −50% rispetto al Peak. Sedute brevi e precise. Niente di nuovo: routine, riposo, alimentazione.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto', desc: 'Nuoto 50\' (20\' Z2 + 4×100 Z3 rec 20" + 21\' Z2)', durationMin: 50, swimM: 2500 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 45\' (13\' Z2 + 3×3\' Z4 rec 3\' + 14\' Z2)', durationMin: 45, runKm: 8 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 50\' (11\' Z2 + 2×10\' Z3 rec 4\' + 11\' Z2)', durationMin: 50, bikeKm: 22 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Corsa', desc: 'Nuoto 45\' (15\' drill + 6×100 Z3 rec 20" + 16\' drill) | Corsa 30\' Z2', durationMin: 75, swimM: 2300, runKm: 5 },
      { day: 'VEN', sport: 'run', title: 'Corsa', desc: 'Corsa 40\' (15\' Z2 + 3×1\' Z4 rec 2\' + 16\' Z2)', durationMin: 40, runKm: 7 },
      { day: 'SAB', sport: 'brick', title: 'BRICK', desc: 'Bici outdoor 105\' Z2 + brick: Corsa 15\' Z2', durationMin: 120, bikeKm: 46, runKm: 3 },
      { day: 'DOM', sport: 'run', title: 'Corsa', desc: 'Corsa 60\' Z2 — ultima lunga', durationMin: 60, runKm: 10 },
    ]
  },

  // ─── FASE 4 — MACROCICLO 4 (Settimana 37) ───────────────────────────
  {
    week: 'IM-W37', phase: 'taper', faseLabel: 'MACROCICLO 4', dateRange: '13 set – 19 set', note: 'Settimana di gara. Volume minimo, intensità presente ma breve. Logistica, riposo, idratazione.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto + Riposo', desc: 'Nuoto 35\' Z2 — scioglimento gambe | Riposo pomeriggio', durationMin: 35, swimM: 1800 },
      { day: 'MAR', sport: 'run', title: 'Corsa', desc: 'Corsa 30\' (12\' Z2 + 4×20" Z4 rec 1\' — tenere il passo sveglio + 13\' Z2)', durationMin: 30, runKm: 5 },
      { day: 'MER', sport: 'bike', title: 'Bici', desc: 'Bici rullo 35\' (13\' Z2 + 3×1\' Z3 rec 2\' — attivazione + 13\' Z2)', durationMin: 35, bikeKm: 15 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto + Riposo', desc: 'Nuoto 25\' Z1 — solo tecnica, nessuno sforzo | Viaggio / logistica gara', durationMin: 25, swimM: 1300 },
      { day: 'VEN', sport: 'swim', title: 'Nuoto + Bici', desc: 'Nuoto 15\' Z1 nel lago/mare di gara — prova muta e orientamento | Bici 20\' Z1 — verifica cambio e meccanica', durationMin: 35, swimM: 800 },
      { day: 'SAB', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo completo — pasta party, idratazione, transizioni pronte', durationMin: 0 },
      { day: 'DOM', sport: 'race', title: '🏅 GARA: IRONMAN 70.3', desc: 'GARA — Ironman 70.3', durationMin: 0 },
    ]
  },

]; // END IM_PLAN

const IM_PLAN_START = new Date('2027-01-04T00:00:00');
const IM_RACE_DATE = new Date('2027-09-19T00:00:00');
const IM_RACE_NAME = 'Ironman 70.3 Cervia';
