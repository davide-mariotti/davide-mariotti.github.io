// ironman/training-data.js — Piano Jesolo 70.3
// Preparazione: 30 nov 2026 → 02 mag 2027
// Sport: swim=🏊 bike=🚴 run=🏃 brick=🔱 rest=💤 core=💪
// Zone: Z1=recupero Z2=aerobico Z3=tempo Z4=soglia Z5=VO2max
// ☀️ M = Mattina / 🌙 S = Sera

const IM_PLAN = [

  // ─── FASE 0 — RECUPERO E TRANSIZIONE (Settimana 1) ──────────────────
  {
    week: 'IM-W01', phase: 'recovery', faseLabel: 'FASE 0 – Recupero e Transizione', dateRange: '30 nov – 06 dic', note: 'Scarico post-maratona. Nessuna fretta: solo tecnica, scioglimento e ascolto del corpo.', days: [
      { day: 'LUN', sport: 'swim', title: 'Riposo / Nuoto tecnica', desc: '☀️ riposo | 🌙 Nuoto 45\' Z1 — solo tecnica e scivolamento', durationMin: 45, swimM: 1350 },
      { day: 'MAR', sport: 'bike', title: 'Bici agilità', desc: '☀️: Bici 45\' Z1 — agilità pura >90rpm per sciogliere le gambe', durationMin: 45, bikeKm: 20 },
      { day: 'MER', sport: 'rest', title: 'Riposo / Camminata', desc: '☀️: riposo o camminata 30\'', durationMin: 30 },
      { day: 'GIO', sport: 'swim', title: 'Riposo / Nuoto respirazione', desc: '☀️ riposo | 🌙 Nuoto 45\' Z1/Z2 — esercizi respirazione e pull buoy', durationMin: 45, swimM: 1400 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'bike', title: 'Bici pianura Z1/Z2', desc: 'Bici 60\' Z1/Z2 — pianura, focus agilità', durationMin: 60, bikeKm: 26 },
      { day: 'DOM', sport: 'run', title: 'Corsa test articolazioni', desc: 'Corsa 20\' Z1 — corsa/camminata leggerissima per testare le articolazioni', durationMin: 20, runKm: 2.5 },
    ]
  },

  // ─── FASE 0 — RECUPERO E TRANSIZIONE (Settimana 2) ──────────────────
  {
    week: 'IM-W02', phase: 'recovery', faseLabel: 'FASE 0 – Recupero e Transizione', dateRange: '07 dic – 13 dic', note: 'Ripresa strutturata: volumi bassi ma regolarità su tutti e tre gli sport.', days: [
      { day: 'LUN', sport: 'run', title: 'Corsa Z2 / Nuoto frazionati', desc: '☀️ Corsa 30\' Z2 | 🌙 Nuoto 50\' Z2 — frazionati brevi con ampio recupero', durationMin: 80, runKm: 4.5, swimM: 1600 },
      { day: 'MAR', sport: 'bike', title: 'Bici agilità costante', desc: '☀️: Bici 60\' Z2 — agilità costante', durationMin: 60, bikeKm: 27 },
      { day: 'MER', sport: 'run', title: 'Corsa Z2', desc: '☀️: Corsa 40\' Z2', durationMin: 40, runKm: 6.5 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1/Z2 / Nuoto trazione', desc: '☀️ Bici 45\' Z1/Z2 | 🌙 Nuoto 50\' Z2 — focus trazione', durationMin: 95, bikeKm: 21, swimM: 1600 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (1h30 Bici + 10min Corsa)', desc: 'Bici 90\' Z2 (percorso vallonato leggero) + brick: Corsa 10\' Z2', durationMin: 100, bikeKm: 40, runKm: 1.5 },
      { day: 'DOM', sport: 'run', title: 'Corsa domenicale', desc: 'Corsa 45\' Z2', durationMin: 45, runKm: 7 },
    ]
  },

  // ─── FASE 0 — RECUPERO E TRANSIZIONE (Settimana 3) ──────────────────
  {
    week: 'IM-W03', phase: 'recovery', faseLabel: 'FASE 0 – Recupero e Transizione', dateRange: '14 dic – 20 dic', note: 'Terza settimana di recupero: si introducono i primi stimoli Z3 ma il volume rimane basso.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto blocchi 100m', desc: '☀️ Corsa 45\' Z2 | 🌙 Nuoto 60\' Z2 — blocchi da 100m', durationMin: 105, runKm: 7, swimM: 2000 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z3 intervalli', desc: '☀️: Bici 75\' Z3 — 15\' wa Z2 + 4×8\' Z3 rec 2\' Z2 + 20\' cd Z2', durationMin: 75, bikeKm: 34 },
      { day: 'MER', sport: 'run', title: 'Corsa fartlek Z4', desc: '☀️: Corsa 45\' — 15\' wa Z2 + 6×1\' Z4 rec 2\' Z2 + 10\' cd Z2', durationMin: 45, runKm: 7 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto tecnica mista', desc: '☀️ Bici 45\' Z1 | 🌙 Nuoto 60\' Z2 — esercizi misti e tecnica', durationMin: 105, bikeKm: 20, swimM: 2000 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h00 Bici + 15min Corsa)', desc: 'Bici 120\' Z2 + brick: Corsa 15\' Z2', durationMin: 135, bikeKm: 54, runKm: 2.5 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga domenicale', desc: 'Corsa 60\' Z2', durationMin: 60, runKm: 9.5 },
    ]
  },

  // ─── FASE 0 — RECUPERO E TRANSIZIONE (Settimana 4) ──────────────────
  {
    week: 'IM-W04', phase: 'recovery', faseLabel: 'FASE 0 – Recupero e Transizione', dateRange: '21 dic – 27 dic', note: 'Scarico pre-Fase 1: volume ridotto a ~7h. Corpo fresco per il primo blocco di costruzione.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto tecnica', desc: '☀️ Corsa 35\' Z2 | 🌙 Nuoto 45\' Z2 — tecnica, nessuna fretta', durationMin: 80, runKm: 5.5, swimM: 1400 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z2 agilità', desc: '☀️: Bici 55\' Z2 — agilità pura', durationMin: 55, bikeKm: 24 },
      { day: 'MER', sport: 'run', title: 'Corsa Z2 sciolta', desc: '☀️: Corsa 40\' Z2', durationMin: 40, runKm: 6.5 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto scioltissimo', desc: '☀️ Bici 40\' Z1 | 🌙 Nuoto 40\' Z1 — solo scioltezza', durationMin: 80, bikeKm: 17, swimM: 1200 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (1h30 Bici + 15min Corsa)', desc: 'Bici 90\' Z2 + brick: Corsa 15\' Z2', durationMin: 105, bikeKm: 44, runKm: 2 },
      { day: 'DOM', sport: 'run', title: 'Corsa domenicale Z2', desc: 'Corsa 55\' Z2', durationMin: 55, runKm: 8.5 },
    ]
  },


  // ─── FASE 1 — MACRO-CICLO 1 (Settimana 5) ───────────────────────────
  {
    week: 'IM-W05', phase: 'base', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '28 dic – 03 gen', note: 'Costruzione 1: primo blocco di carico strutturato. Lunga in sella il sabato con mangiare e bere in movimento.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto pull buoy', desc: '☀️ Corsa 45\' Z2 | 🌙 Nuoto 60\' Z2 — 1500m totali con pull buoy', durationMin: 105, runKm: 7, swimM: 1500 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z3 intervalli 10min', desc: '☀️: Bici 75\' Z3 — 15\' wa Z2 + 4×10\' Z3 rec 3\' Z2 + 10\' cd Z2', durationMin: 75, bikeKm: 35 },
      { day: 'MER', sport: 'run', title: 'Corsa variata 5 ripetute km', desc: '☀️: Corsa 60\' variato — 15\' wa Z2 + 5×[1km Z3 + 1km Z2] + 5\' cd Z2', durationMin: 60, runKm: 10.5 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1/Z2 / Nuoto 100m', desc: '☀️ Bici 60\' Z1/Z2 | 🌙 Nuoto 60\' Z2 — lavori da 100m', durationMin: 120, bikeKm: 27, swimM: 2000 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h15 Bici + 15min Corsa)', desc: 'Bici 135\' Z2 (pianura costante) + brick: Corsa 15\' Z2', durationMin: 150, bikeKm: 67, runKm: 2.5 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga', desc: 'Corsa 80\' Z2', durationMin: 80, runKm: 12.5 },
    ]
  },

  // ─── FASE 1 — MACRO-CICLO 1 (Settimana 6) ───────────────────────────
  {
    week: 'IM-W06', phase: 'base', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '04 gen – 10 gen', note: 'Costruzione 2: si allunga la bici del sabato e si introduce la palette in vasca.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto palette', desc: '☀️ Corsa 45\' Z2 | 🌙 Nuoto 60\' Z2 — 1600m totali, introduzione palette', durationMin: 105, runKm: 7, swimM: 1600 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z3 intervalli 15min', desc: '☀️: Bici 75\' Z3 — 15\' wa Z2 + 3×15\' Z3 rec 4\' Z2 + 10\' cd Z2', durationMin: 75, bikeKm: 36 },
      { day: 'MER', sport: 'run', title: 'Corsa variata 6 ripetute km', desc: '☀️: Corsa 70\' variato — 15\' wa Z2 + 6×[1km Z3 + 1km Z2] + 5\' cd Z2', durationMin: 70, runKm: 12 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto 200m', desc: '☀️ Bici 60\' Z1 | 🌙 Nuoto 60\' Z2 — lavori da 200m continui', durationMin: 120, bikeKm: 26, swimM: 2000 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h30 Bici + 15min Corsa)', desc: 'Bici 150\' Z2 (agilità >85rpm) + brick: Corsa 15\' Z2', durationMin: 165, bikeKm: 67, runKm: 2.5 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga', desc: 'Corsa 90\' Z2', durationMin: 90, runKm: 14 },
    ]
  },

  // ─── FASE 1 — MACRO-CICLO 1 (Settimana 7) ───────────────────────────
  {
    week: 'IM-W07', phase: 'base', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '11 gen – 17 gen', note: 'Costruzione 3 – Carico: introdotto Z4 bici ma con gestione più conservativa della corsa.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto progressioni', desc: '☀️ Corsa 50\' Z2 | 🌙 Nuoto 60\' Z2/Z3 — 1800m totali con progressioni', durationMin: 110, runKm: 8, swimM: 1800 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z4 intervalli 8min', desc: '☀️: Bici 80\' Z4 — 20\' wa Z2 + 4×8\' Z4 rec 3\' Z1 + 15\' cd Z2', durationMin: 80, bikeKm: 37 },
      { day: 'MER', sport: 'run', title: 'Corsa variata lungo 2km', desc: '☀️: Corsa 70\' variato — 15\' wa Z2 + 3×[2km Z3 + 1km Z2] + 5\' cd Z2', durationMin: 70, runKm: 12 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto 400m', desc: '☀️ Bici 60\' Z1 | 🌙 Nuoto 60\' Z2 — endurance 400m continui', durationMin: 120, bikeKm: 26, swimM: 2000 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h40 Bici + 20min Corsa)', desc: 'Bici 160\' Z2 (mangia e bevi in sella) + brick: Corsa 20\' Z2/Z3', durationMin: 180, bikeKm: 86, runKm: 3.5 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga', desc: 'Corsa 90\' Z2', durationMin: 90, runKm: 14.5 },
    ]
  },

  // ─── FASE 1 — MACRO-CICLO 1 (Settimana 8) ───────────────────────────
  {
    week: 'IM-W08', phase: 'recovery', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '18 gen – 24 gen', note: 'Scarico: volume ridotto, nessun brick il sabato. Recupero profondo prima del blocco sviluppo.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z1/Z2 / Nuoto tecnica', desc: '☀️ Corsa 40\' Z1/Z2 | 🌙 Nuoto 45\' Z1 — solo tecnica', durationMin: 85, runKm: 5.5, swimM: 1350 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z2', desc: '☀️: Bici 60\' Z2', durationMin: 60, bikeKm: 27 },
      { day: 'MER', sport: 'run', title: 'Corsa passo fluido', desc: '☀️: Corsa 45\' Z2', durationMin: 45, runKm: 7 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto scivolamento', desc: '☀️ Bici 45\' Z1 | 🌙 Nuoto 45\' Z2 — scivolamento', durationMin: 90, bikeKm: 20, swimM: 1500 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'bike', title: 'Bici Z2', desc: 'Bici 105\' Z2', durationMin: 105, bikeKm: 47 },
      { day: 'DOM', sport: 'run', title: 'Corsa Z2', desc: 'Corsa 60\' Z2', durationMin: 60, runKm: 9.5 },
    ]
  },

  // ─── FASE 1 — MACRO-CICLO 1 (Settimana 9) ───────────────────────────
  {
    week: 'IM-W09', phase: 'base', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '25 gen – 31 gen', note: 'Sviluppo Base 1: intervalli Z3 da 20min in bici, ripetute 2km in corsa, 800m continui in vasca.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto forza palette', desc: '☀️ Corsa 45\' Z2 | 🌙 Nuoto 60\' Z2/Z3 — 1800m, focus forza con palette', durationMin: 105, runKm: 7, swimM: 1800 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z3 intervalli 20min', desc: '☀️: Bici 80\' Z3 — 15\' wa Z2 + 2×20\' Z3 rec 5\' Z2 + 15\' cd Z2', durationMin: 80, bikeKm: 37 },
      { day: 'MER', sport: 'run', title: 'Corsa variata 4×2km', desc: '☀️: Corsa 75\' variato — 15\' wa Z2 + 4×[2km Z3 + 1km Z2] + 5\' cd Z2', durationMin: 75, runKm: 13 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto 800m', desc: '☀️ Bici 60\' Z1 | 🌙 Nuoto 60\' Z2 — 800m continui', durationMin: 120, bikeKm: 26, swimM: 2000 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h55 Bici + 20min Corsa)', desc: 'Bici 175\' Z2 + brick: Corsa 20\' Z2', durationMin: 195, bikeKm: 94, runKm: 3.5 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga', desc: 'Corsa 100\' Z2', durationMin: 100, runKm: 16 },
    ]
  },

  // ─── FASE 1 — MACRO-CICLO 1 (Settimana 10) ──────────────────────────
  {
    week: 'IM-W10', phase: 'base', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '01 feb – 07 feb', note: 'Sviluppo Base 2: Z4 in bici, ripetute 3km in corsa, bici del sabato 3h30 con brick progressivo.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto 200m', desc: '☀️ Corsa 50\' Z2 | 🌙 Nuoto 65\' Z2 — 2000m, blocchi da 200m', durationMin: 115, runKm: 8, swimM: 2000 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z4 intervalli 6min', desc: '☀️: Bici 85\' Z4 — 20\' wa Z2 + 5×6\' Z4 rec 3\' Z1 + 15\' cd Z2', durationMin: 85, bikeKm: 39 },
      { day: 'MER', sport: 'run', title: 'Corsa variata 2×3km', desc: '☀️: Corsa 70\' variato — 15\' wa Z2 + 2×[3km Z3 + 1km Z2] + 10\' cd Z2', durationMin: 70, runKm: 12 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1/Z2 / Nuoto passo costante', desc: '☀️ Bici 60\' Z1/Z2 | 🌙 Nuoto 60\' Z2 — passo costante', durationMin: 120, bikeKm: 27, swimM: 2000 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (3h10 Bici + 20min Corsa)', desc: 'Bici 190\' Z2 + brick: Corsa 20\' (primi 10\' Z3)', durationMin: 210, bikeKm: 100, runKm: 3.5 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga', desc: 'Corsa 105\' Z2', durationMin: 105, runKm: 16.5 },
    ]
  },

  // ─── FASE 1 — MACRO-CICLO 1 (Settimana 11) ──────────────────────────
  {
    week: 'IM-W11', phase: 'base', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '08 feb – 14 feb', note: 'Volume più specifico 70.3: ridotta la corsa lunga per limitare fatica residua.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto forza Z3', desc: '☀️ Corsa 45\' Z2 | 🌙 Nuoto 65\' Z3 — 2100m forza con palette', durationMin: 110, runKm: 7.5, swimM: 2100 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z3 intervalli 15min x3', desc: '☀️: Bici 80\' Z3 — 15\' wa + 3×15\' Z3 rec 4\' Z1 + 10\' cd', durationMin: 80, bikeKm: 36 },
      { day: 'MER', sport: 'run', title: 'Corsa variata 3×2km', desc: '☀️: Corsa 75\' variato — 15\' wa + 3×[2km Z3 + 1km Z2] + 10\' cd', durationMin: 75, runKm: 13 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto endurance', desc: '☀️ Bici 60\' Z1 | 🌙 Nuoto 65\' Z2 — 2200m aerobici', durationMin: 125, bikeKm: 26, swimM: 2200 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (3h10 Bici + 30min Corsa)', desc: 'Bici 190\' Z2 + brick: Corsa 30\' Z2/Z3', durationMin: 220, bikeKm: 105, runKm: 6 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga 1h40', desc: 'Corsa 100\' Z2', durationMin: 100, runKm: 16 },
    ]
  },

  // ─── FASE 1 — MACRO-CICLO 1 (Settimana 12) ──────────────────────────
  {
    week: 'IM-W12', phase: 'recovery', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '15 feb – 21 feb', note: 'Scarico pre-Macro 2: volume −30%, intensità minima. 4 allunghi brevi mercoledì per mantenere la reattività.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z1 / Nuoto Z1/Z2', desc: '☀️ Corsa 40\' Z1 | 🌙 Nuoto 45\' Z1/Z2', durationMin: 85, runKm: 5, swimM: 1450 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z2', desc: '☀️: Bici 60\' Z2', durationMin: 60, bikeKm: 27 },
      { day: 'MER', sport: 'run', title: 'Corsa Z2 con allunghi', desc: '☀️: Corsa 50\' Z2 con 4 allunghi da 100m', durationMin: 50, runKm: 8 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto tecnica pura', desc: '☀️ Bici 45\' Z1 | 🌙 Nuoto 45\' tecnica pura', durationMin: 90, bikeKm: 20, swimM: 1350 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 10min Corsa)', desc: 'Bici 120\' Z2 + brick: Corsa 10\' Z2', durationMin: 130, bikeKm: 54, runKm: 1.5 },
      { day: 'DOM', sport: 'run', title: 'Corsa Z2', desc: 'Corsa 70\' Z2', durationMin: 70, runKm: 11 },
    ]
  },

  // ─── FASE 2 — MACRO-CICLO 2 (Settimana 13) ──────────────────────────
  {
    week: 'IM-W13', phase: 'build', faseLabel: 'FASE 2 – Sviluppo e Combinati', dateRange: '22 feb – 28 feb', note: 'Build più specifico 70.3: ridotto il lungo run e aumentata la specificità del brick.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto tecnica', desc: '☀️ Corsa 40\' Z2 | 🌙 Nuoto 65\' Z2 — Focus bracciata', durationMin: 105, runKm: 6.5, swimM: 2200 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z3 alta 4×8min', desc: '☀️: Bici 75\' Z3 alta — 20\' wa + 4×8\' Z3+ rec 3\' Z2 + 10\' cd', durationMin: 75, bikeKm: 35 },
      { day: 'MER', sport: 'run', title: 'Corsa qualità 5×1000m Z4', desc: '☀️: Corsa 75\' qualità — 15\' wa + 5×1000m Z4 rec 2\' Z2 + 15\' cd', durationMin: 75, runKm: 12 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1/Z2 / Nuoto 3×500m gara', desc: '☀️ Bici 55\' Z1/Z2 | 🌙 Nuoto 65\' Z3 — 3×500m passo gara', durationMin: 120, bikeKm: 25, swimM: 2300 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (3h15 Bici + 45min Corsa)', desc: 'Bici 195\' Z2 (ultimi 40\' Z3) + brick: Corsa 45\' Z3', durationMin: 240, bikeKm: 105, runKm: 9 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga 1h45', desc: 'Corsa 105\' Z2', durationMin: 105, runKm: 17 },
    ]
  },

  // ─── FASE 2 — MACRO-CICLO 2 (Settimana 14) ──────────────────────────
  {
    week: 'IM-W14', phase: 'build', faseLabel: 'FASE 2 – Sviluppo e Combinati', dateRange: '01 mar – 07 mar', note: 'Incremento carichi Sabato/Domenica. Martedì e Mercoledì compatti.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto palette', desc: '☀️ Corsa 45\' Z2 | 🌙 Nuoto 70\' Z2 — Aerobico', durationMin: 115, runKm: 7, swimM: 2200 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z3/Z4 3×12min', desc: '☀️: Bici 80\' Z3/Z4 — 20\' wa + 3×12\' Z3 alta rec 4\' Z2 + 10\' cd', durationMin: 80, bikeKm: 37 },
      { day: 'MER', sport: 'run', title: 'Corsa variata 4×2km', desc: '☀️: Corsa 80\' variato — 15\' wa + 4×[2km Z3 + 1km Z2] + 10\' cd', durationMin: 80, runKm: 14 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto 2×800m Z3', desc: '☀️ Bici 60\' Z1 | 🌙 Nuoto 65\' Z3 — 2×800m rec 45\"', durationMin: 125, bikeKm: 27, swimM: 2000 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (3h10 Bici + 35min Corsa)', desc: 'Bici 190\' Z2 (ultimi 45\' Z3) + brick: Corsa 35\' Z3', durationMin: 225, bikeKm: 100, runKm: 7 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga 1h35', desc: 'Corsa 95\' Z2', durationMin: 95, runKm: 15.5 },
    ]
  },

  // ─── FASE 2 — MACRO-CICLO 2 (Settimana 15) ──────────────────────────
  {
    week: 'IM-W15', phase: 'build', faseLabel: 'FASE 2 – Sviluppo e Combinati', dateRange: '08 mar – 14 mar', note: 'Picco controllato: più focus sul brick lungo e meno corsa residua.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto 2400m', desc: '☀️ Corsa 50\' Z2 | 🌙 Nuoto 75\' Z2 — Endurance', durationMin: 125, runKm: 8, swimM: 2600 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z4 4×8min', desc: '☀️: Bici 80\' Z4 — 20\' wa + 4×8\' Z4 rec 5\' Z1 + 15\' cd', durationMin: 80, bikeKm: 38 },
      { day: 'MER', sport: 'run', title: 'Corsa qualità 3×2000m Z4', desc: '☀️: Corsa 80\' qualità — 15\' wa + 3×2000m Z4 rec 2\' Z2 + 15\' cd', durationMin: 80, runKm: 14 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto 4×500m Z3', desc: '☀️ Bici 65\' Z1 | 🌙 Nuoto 70\' Z3 — 4×500m rec 20\"', durationMin: 135, bikeKm: 28, swimM: 2500 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (3h20 Bici + 50min Corsa)', desc: 'Bici 200\' Z2 (con 3×20\' Z3) + brick: Corsa 50\' Z2/Z3 controllato', durationMin: 250, bikeKm: 105, runKm: 10 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga 1h45', desc: 'Corsa 105\' Z2', durationMin: 105, runKm: 17 },
    ]
  },

  // ─── FASE 2 — MACRO-CICLO 2 (Settimana 16) ──────────────────────────
  {
    week: 'IM-W16', phase: 'recovery', faseLabel: 'FASE 2 – Sviluppo e Combinati', dateRange: '15 mar – 21 mar', note: 'Scarico intermedio: volume ridotto, intensità minima. 5 allunghi finali mercoledì per mantenere la reattività.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z1 / Nuoto tecnica pura', desc: '☀️ Corsa 40\' Z1 | 🌙 Nuoto 45\' Z1 — tecnica pura', durationMin: 85, runKm: 5, swimM: 1350 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z2 agilità', desc: '☀️: Bici 60\' Z2 — agilità senza forzare', durationMin: 60, bikeKm: 27 },
      { day: 'MER', sport: 'run', title: 'Corsa Z2 + allunghi', desc: '☀️: Corsa 45\' Z2 con 5 allunghi finali per sciogliere', durationMin: 45, runKm: 7 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto scioltezza', desc: '☀️ Bici 45\' Z1 | 🌙 Nuoto 45\' Z2 — scioltezza', durationMin: 90, bikeKm: 20, swimM: 1500 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (1h50 Bici + 10min Corsa)', desc: 'Bici 110\' Z2 (regolare) + brick: Corsa 10\' Z2', durationMin: 120, bikeKm: 50, runKm: 1.5 },
      { day: 'DOM', sport: 'run', title: 'Corsa Z2', desc: 'Corsa 75\' Z2', durationMin: 75, runKm: 12 },
    ]
  },

  // ─── FASE 2 — MACRO-CICLO 2 (Settimana 17) ──────────────────────────
  {
    week: 'IM-W17', phase: 'build', faseLabel: 'FASE 2 – Sviluppo e Combinati', dateRange: '22 mar – 28 mar', note: 'Transizione al picco: Inseriti test ritmo gara in vasca. Infrasettimanali max 85 min.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto forza', desc: '☀️ Corsa 50\' Z2 | 🌙 Nuoto 70\' Z2 — 2400m forza braccia', durationMin: 120, runKm: 8, swimM: 2400 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z3 alta 2×20min', desc: '☀️: Bici 85\' Z3 alta — 15\' wa + 2×20\' Z3 alta rec 5\' Z1 + 25\' cd', durationMin: 85, bikeKm: 39 },
      { day: 'MER', sport: 'run', title: 'Corsa variata 3×3km', desc: '☀️: Corsa 85\' variato — 15\' wa + 3×[3km Z3 + 1km Z2] + 15\' cd', durationMin: 85, runKm: 15 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto 1500m test', desc: '☀️ Bici 60\' Z1 | 🌙 Nuoto 70\' Z3 — 1500m ritmo gara', durationMin: 130, bikeKm: 27, swimM: 2400 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (3h30 Bici + 45min Corsa)', desc: 'Bici 210\' (con 4×20\' Z3) + brick: Corsa 45\' Z3', durationMin: 255, bikeKm: 108, runKm: 9 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga 1h35', desc: 'Corsa 95\' Z2', durationMin: 95, runKm: 15.5 },
    ]
  },

  // ─── FASE 2 — MACRO-CICLO 2 (Settimana 18) ──────────────────────────
  {
    week: 'IM-W18', phase: 'build', faseLabel: 'FASE 2 – Sviluppo e Combinati', dateRange: '29 mar – 04 apr', note: 'Picco specifico 70.3: mantenuta alta la bici, ridotta la corsa lunga.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto 2500m qualità', desc: '☀️ Corsa 50\' Z2 | 🌙 Nuoto 75\' Z2/Z3 — lavori qualità e tecnica continua', durationMin: 125, runKm: 8.5, swimM: 2500 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z4 5×6min', desc: '☀️: Bici 85\' Z4 — 20\' wa + 5×6\' Z4 rec 3\' Z1 + 25\' cd', durationMin: 85, bikeKm: 40 },
      { day: 'MER', sport: 'run', title: 'Corsa qualità 4×1200m Z4', desc: '☀️: Corsa 70\' — 15\' wa + 4×1200m Z4 rec 2\' Z2 + 15\' cd', durationMin: 70, runKm: 12 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1/Z2 / Nuoto 5×400m Z3', desc: '☀️ Bici 60\' Z1/Z2 | 🌙 Nuoto 75\' Z3 — 5×400m rec 15\"', durationMin: 135, bikeKm: 28, swimM: 2600 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (3h25 Bici + 45min Corsa)', desc: 'Bici 205\' Z2/Z3 costante (test nutrizione gara) + brick: Corsa 45\' Z3 controllato', durationMin: 240, bikeKm: 100, runKm: 9 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga 1h30', desc: 'Corsa 90\' Z2', durationMin: 90, runKm: 15 },
    ]
  },

  // ─── FASE 2 — MACRO-CICLO 2 (Settimana 19) ──────────────────────────
  {
    week: 'IM-W19', phase: 'transition', faseLabel: 'FASE 2 – Transizione al Picco', dateRange: '05 apr – 11 apr', note: 'Transizione specifica: ridotto il carico run per preservare brillantezza e recupero.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto aerobico', desc: '☀️ Corsa 45\' Z2 | 🌙 Nuoto 70\' Z2 — 2500m sciolti', durationMin: 115, runKm: 8, swimM: 2500 },
      { day: 'MAR', sport: 'swim', title: 'Bici Z2/Z3 progressiva / Nuoto recupero', desc: '☀️ Bici 85\' Z2/Z3 — 30\' Z2 + 40\' Z3 + 15\' cd | 🌙 Nuoto 35\' Z1/Z2 — 1200m sciolti con tecnica e respirazione', durationMin: 120, bikeKm: 40, swimM: 1200 },
      { day: 'MER', sport: 'run', title: 'Corsa Z2 con allunghi', desc: '☀️: Corsa 60\' Z2 con 6 allunghi da 100m finali', durationMin: 60, runKm: 10 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto 1000m test', desc: '☀️ Bici 60\' Z1 | 🌙 Nuoto 70\' Z2/Z3 — focus passo gara', durationMin: 130, bikeKm: 27, swimM: 2500 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (3h30 Bici + 35min Corsa)', desc: 'Bici 210\' Z2 costante + brick: Corsa 35\' Z2/Z3', durationMin: 245, bikeKm: 98, runKm: 7 },
      { day: 'DOM', sport: 'run', title: 'Corsa lunga 1h25', desc: 'Corsa 85\' Z2', durationMin: 85, runKm: 14 },
    ]
  },

  // ─── FASE 3 — MACRO-CICLO 3 (Settimana 20) ──────────────────────────
  {
    week: 'IM-W20', phase: 'peak', faseLabel: 'FASE 3 – Specificità e Tapering', dateRange: '12 apr – 18 apr', note: 'Week di Picco Specifico: Volume ridotto (-15%) ma intensità massima su ritmo gara.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z2 / Nuoto acque libere', desc: '☀️ Corsa 40\' Z2 | 🌙 Nuoto 65\' Z2/Z3 — simulazione sighting', durationMin: 105, runKm: 6.5, swimM: 2500 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z3 ritmo gara 3×15min', desc: '☀️: Bici 75\' Z3 — 15\' wa + 3×15\' ritmo 70.3 rec 5\' Z2 + 10\' cd', durationMin: 75, bikeKm: 35 },
      { day: 'MER', sport: 'run', title: 'Corsa 8km ritmo gara', desc: '☀️: Corsa 65\' — 15\' wa + 8km ritmo gara + 10\' cd', durationMin: 65, runKm: 12 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto 1900m test', desc: '☀️ Bici 50\' Z1 | 🌙 Nuoto 60\' Z3 — 1900m ritmo gara', durationMin: 110, bikeKm: 22, swimM: 1900 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'SIMULAZIONE: 80km Bici + 15min Corsa', desc: 'Bici 180\' (80km ritmo gara) + brick: Corsa 15\' ritmo gara', durationMin: 210, bikeKm: 80, runKm: 3 },
      { day: 'DOM', sport: 'run', title: 'Corsa aerobica', desc: 'Corsa 60\' Z2', durationMin: 60, runKm: 10 },
    ]
  },

  // ─── FASE 3 — MACRO-CICLO 3 (Settimana 21) ──────────────────────────
  {
    week: 'IM-W21', phase: 'taper', faseLabel: 'FASE 3 – Specificità e Tapering', dateRange: '19 apr – 25 apr', note: 'Tapering Reale: Volume -40%. Brillantezza e recupero.', days: [
      { day: 'LUN', sport: 'swim', title: 'Corsa Z1 / Nuoto sciolto', desc: '☀️ Corsa 30\' Z1 | 🌙 Nuoto 50\' Z2 — tecnica', durationMin: 80, runKm: 4.5, swimM: 1800 },
      { day: 'MAR', sport: 'bike', title: 'Bici Z3 ritmo gara 3×8min', desc: '☀️: Bici 60\' — 20\' wa + 3×8\' ritmo gara rec 3\' Z1 + 15\' cd', durationMin: 60, bikeKm: 28 },
      { day: 'MER', sport: 'run', title: 'Corsa 4×1000m ritmo gara', desc: '☀️: Corsa 45\' — 15\' wa + 4×1000m ritmo gara rec 2\' Z1 + 10\' cd', durationMin: 45, runKm: 7.5 },
      { day: 'GIO', sport: 'swim', title: 'Bici Z1 / Nuoto 4×200m', desc: '☀️ Bici 40\' Z1 | 🌙 Nuoto 45\' Z3 — 4×200m ritmo gara', durationMin: 85, bikeKm: 18, swimM: 1600 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK Soft', desc: 'Bici 75\' Z2 (con 20\' ritmo gara) + brick: Corsa 15\' ritmo gara', durationMin: 90, bikeKm: 35, runKm: 3 },
      { day: 'DOM', sport: 'run', title: 'Corsa Z2 breve', desc: 'Corsa 45\' Z2', durationMin: 45, runKm: 7 },
    ]
  },

  // ─── FASE 3 — MACRO-CICLO 3 (Settimana 22) ──────────────────────────
  {
    week: 'IM-W22', phase: 'taper', faseLabel: 'FASE 3 – Specificità e Tapering', dateRange: '26 apr – 02 mag', note: 'Race Week: Solo attivazione. Carico carboidrati e relax.', days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto scioltissimo', desc: '🌙 Nuoto 35\' Z1 — 1000m sciolti', durationMin: 35, swimM: 1000 },
      { day: 'MAR', sport: 'bike', title: 'Bici attivazione', desc: '☀️: Bici 45\' — 30\' Z1 + 3×1\' ritmo gara', durationMin: 45, bikeKm: 20 },
      { day: 'MER', sport: 'run', title: 'Corsa attivazione', desc: '☀️: Corsa 30\' — 20\' Z1 + 4 allunghi 30\"', durationMin: 30, runKm: 4 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto progressivi', desc: '🌙 Nuoto 30\' — 4×50m progressivi', durationMin: 30, swimM: 600 },
      { day: 'VEN', sport: 'rest', title: 'Riposo — Logistica', desc: 'Riposo completo e viaggio', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'Check pre-gara', desc: 'Bici 15\' + Corsa 5\' — Check meccanico e attivazione gambe', durationMin: 20, bikeKm: 5, runKm: 1 },
      { day: 'DOM', sport: 'race', title: '🏅 GARA: Ironman 70.3 Jesolo', desc: 'Dajeeee!', durationMin: 330 },
    ]
  },

]; // END IM_PLAN

const IM_PLAN_START = new Date('2026-11-30T00:00:00');
const IM_RACE_DATE = new Date('2027-05-02T00:00:00');
const IM_RACE_NAME = 'Ironman 70.3 Jesolo';
