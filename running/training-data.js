// running/training-data.js — Piano MarIOtona
// Struttura per-giorno (come IronMarIO 70.3)
// LUN sera: 🏊 Nuoto tecnica
// MAR sera: 🏃 FL
// MER sera: 🏃 R/FM qualità
// GIO sera: 🏊 Nuoto tecnica
// VEN: 💤 Riposo
// SAB mat: 🔱 BRICK (2h bici Z2 + corsa Z2)
// DOM: 🏃 Lungo + 🚴 1h bici Z2 a sciogliere

const PLAN = [

  // ─── FASE 1 — COSTRUZIONE DI BASE (W01) ─────────────────────────────
  {
    week: 'W01', phase: 'base', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '30 mar – 05 apr',
    note: 'Prima settimana del piano. Approccio progressivo: nuoto solo tecnica (niente affanno), brick breve per abituarsi alla transizione.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto tecnica', desc: '🌙 Nuoto 40\' Z1/Z2 — solo tecnica: scivolamento, bracciata, respirazione', durationMin: 40, swimM: 900 },
      { day: 'MAR', sport: 'run',  title: '13km FL', desc: '13km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 82, runKm: 13 },
      { day: 'MER', sport: 'run',  title: 'R (400m)', desc: "R (400m): 2.9km WU / 8×(400m @4'20\" + 250m rest @6'30\") / 2.9km CD", durationMin: 70, runKm: 11 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto tecnica', desc: '🌙 Nuoto 40\' Z1/Z2 — esercizi respirazione, kick, posizione corpo', durationMin: 40, swimM: 900 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 — pianura costante, >85rpm | Brick: Corsa 25\' Z2 per imparare la transizione bici→corsa', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "25km totali: tutti @ 6'20\"/km | 🌙 Bici 60' Z2 a sciogliere le gambe", durationMin: 215, runKm: 25, bikeKm: 26 },
    ]
  },

  // ─── FASE 1 — COSTRUZIONE DI BASE (W02) ─────────────────────────────
  {
    week: 'W02', phase: 'base', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '06 apr – 12 apr',
    note: 'Secondo blocco base. Si introducono i primi progressivi nel lungo domenicale. Nuoto: focus sulla trazione.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto tecnica', desc: '🌙 Nuoto 40\' Z1/Z2 — focus trazione e pull buoy', durationMin: 40, swimM: 900 },
      { day: 'MAR', sport: 'run',  title: '12km FL', desc: '12km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 75, runKm: 12 },
      { day: 'MER', sport: 'run',  title: 'FM (12km)', desc: "FM (12km): 2km WU / 8km @ 4'45\" / 2km CD", durationMin: 75, runKm: 12 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto tecnica', desc: '🌙 Nuoto 40\' Z1/Z2 — esercizi bracciata con e senza tavola', durationMin: 40, swimM: 900 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 — pianura costante | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo Progressivo + Bici Z2', desc: "26km Progressivo: 20km @ 6'20\" + 5km @ 4'55\" RMa + 1km CD | 🌙 Bici 60' Z2 a sciogliere", durationMin: 225, runKm: 26, bikeKm: 26 },
    ]
  },

  // ─── FASE 1 — COSTRUZIONE DI BASE (W03) ─────────────────────────────
  {
    week: 'W03', phase: 'base', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '13 apr – 19 apr',
    note: 'Terza settimana: il volume cresce, le ripetute si allungano a 600m. Nuoto: prime sensazioni di scivolamento.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto tecnica', desc: '🌙 Nuoto 40\' Z1/Z2 — scivolamento e kick con tavola', durationMin: 40, swimM: 900 },
      { day: 'MAR', sport: 'run',  title: '13km FL', desc: '13km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 82, runKm: 13 },
      { day: 'MER', sport: 'run',  title: 'R (600m)', desc: "R (600m): 3.3km WU / 6×(600m @4'25\" + 300m rest @6'30\") / 3.3km CD", durationMin: 75, runKm: 12 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto tecnica', desc: '🌙 Nuoto 40\' Z1/Z2 — combinazione bracciata+kick, respiro bilaterale', durationMin: 40, swimM: 900 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2 — gambe a stacchi abituarsi al cambio', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo Progressivo + Bici Z2', desc: "27km Progressivo: 20km @ 6'20\" + 5km @ 4'55\" RMa + 2km CD | 🌙 Bici 60' Z2 a sciogliere", durationMin: 230, runKm: 27, bikeKm: 26 },
    ]
  },

  // ─── FASE 1 — COSTRUZIONE DI BASE (W04 — Scarico) ───────────────────
  {
    week: 'W04', phase: 'recovery', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '20 apr – 26 apr',
    note: 'Settimana di scarico + TEST FC MAX. Brick ridotto. Corpo fresco per il test massimale di mercoledì.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto tecnica leggera', desc: '🌙 Nuoto 35\' Z1 — solo scioltezza, nessun affanno', durationMin: 35, swimM: 800 },
      { day: 'MAR', sport: 'run',  title: '10km FL', desc: '10km FL — tutto @ 6\'25"/km, <142bpm', durationMin: 63, runKm: 10 },
      { day: 'MER', sport: 'run',  title: '🧪 TEST FC MAX', desc: "🧪 TEST FC MAX (Salita 4-6%): 3km WU FL (<142bpm) / 3×Allunghi 80m in piano / 5×300m salita: Rep1+2 @5'10\"/km (85% FC) + Rep3+4 @4'40\"/km (95% FC) + Rep5 @4'05\"/km (MASSIMALE, ~100% FC) / Recupero: discesa trotterellando @7'00\" / 2km CD @6'30\"", durationMin: 60, runKm: 9 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto tecnica leggera', desc: '🌙 Nuoto 35\' Z1 — recupero, solo tecnica morbida', durationMin: 35, swimM: 800 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK Scarico (90min Bici + 20min Corsa)', desc: 'Bici 90\' Z2 — scarico, agilità | Brick: Corsa 20\' Z2', durationMin: 110, bikeKm: 38, runKm: 3 },
      { day: 'DOM', sport: 'run',  title: 'Lungo Scarico + Bici Z2', desc: "(Scarico): 15km totali: 10km @ 6'25\" + ultimi 5km @ 5'25\"/km | 🌙 Bici 60' Z2 a sciogliere", durationMin: 155, runKm: 15, bikeKm: 26 },
    ]
  },

  // ─── FASE 1 — COSTRUZIONE DI BASE (W05) ─────────────────────────────
  {
    week: 'W05', phase: 'base', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '27 apr – 03 mag',
    note: 'Ripresa dopo il test FC. Si allunga la distanza delle ripetute a 800m. Nuoto: primi 950m.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto tecnica', desc: '🌙 Nuoto 40\' Z1/Z2 — bracciata completa, focus entrata mano', durationMin: 40, swimM: 950 },
      { day: 'MAR', sport: 'run',  title: '13km FL', desc: '13km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 82, runKm: 13 },
      { day: 'MER', sport: 'run',  title: 'R (800m)', desc: "R (800m): 3.5km WU / 6×(800m @4'30\" + 250m rest @6'30\") / 3.2km CD", durationMin: 82, runKm: 13 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto tecnica', desc: '🌙 Nuoto 40\' Z1/Z2 — frazionati corti 4×100m con ampio recupero', durationMin: 40, swimM: 950 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "26km totali: 21km @ 6'20\" + ultimi 5km @ 5'15\"/km | 🌙 Bici 60' Z2 a sciogliere", durationMin: 225, runKm: 26, bikeKm: 26 },
    ]
  },

  // ─── FASE 1 — COSTRUZIONE DI BASE (W06) ─────────────────────────────
  {
    week: 'W06', phase: 'base', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '04 mag – 10 mag',
    note: 'Fondo Medio settimanale. Il lungo domenicale è tutto a passo costante Z2. Bici sabato: mangiare e bere in sella.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto tecnica', desc: '🌙 Nuoto 40\' Z1/Z2 — coordinazione braccia-gambe, respiro ogni 3', durationMin: 40, swimM: 950 },
      { day: 'MAR', sport: 'run',  title: '13km FL', desc: '13km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 82, runKm: 13 },
      { day: 'MER', sport: 'run',  title: 'FM (13km)', desc: "FM (13km): 2.5km WU / 8km @ 4'50\" / 2.5km CD", durationMin: 82, runKm: 13 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto tecnica', desc: '🌙 Nuoto 40\' Z1/Z2 — variazione ritmo bracciata, drill alternato', durationMin: 40, swimM: 950 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 — abituarsi a mangiare e bere in movimento | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "27km totali: tutti @ 6'20\"/km | 🌙 Bici 60' Z2 a sciogliere", durationMin: 230, runKm: 27, bikeKm: 26 },
    ]
  },

  // ─── FASE 1 — COSTRUZIONE DI BASE (W07) ─────────────────────────────
  {
    week: 'W07', phase: 'base', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '11 mag – 17 mag',
    note: 'Volume settimana in crescita. Ripetute 400m con volume aumentato (10×). Il lungo domenicale raggiunge i 28km.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto tecnica', desc: '🌙 Nuoto 40\' Z1/Z2 — tecnica mista: pull buoy + bracciata libera', durationMin: 40, swimM: 950 },
      { day: 'MAR', sport: 'run',  title: '13km FL', desc: '13km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 82, runKm: 13 },
      { day: 'MER', sport: 'run',  title: 'R (400m ×10)', desc: "R (400m): 4.0km WU / 10×(400m @4'20\" + 150m rest @6'30\") / 3.5km CD", durationMin: 82, runKm: 13 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto tecnica', desc: '🌙 Nuoto 40\' Z1/Z2 — 8×50m con recupero completo, focus entrata', durationMin: 40, swimM: 950 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2 — gambe pesanti: gestisci il passo', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "28km totali: 21km @ 6'20\" + ultimi 7km @ 5'15\"/km | 🌙 Bici 60' Z2 a sciogliere", durationMin: 235, runKm: 28, bikeKm: 26 },
    ]
  },

  // ─── FASE 1 — COSTRUZIONE DI BASE (W08 — Scarico) ───────────────────
  {
    week: 'W08', phase: 'recovery', faseLabel: 'FASE 1 – Costruzione di Base', dateRange: '18 mag – 24 mag',
    note: 'Scarico: volume ridotto su tutti gli sport. Fartlek breve di mercoledì per mantenere la reattività.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — solo scioltezza e tecnica, nessuna fatica', durationMin: 35, swimM: 800 },
      { day: 'MAR', sport: 'run',  title: '11km FL', desc: '11km FL — tutto @ 6\'25"/km, <142bpm', durationMin: 70, runKm: 11 },
      { day: 'MER', sport: 'run',  title: 'R (Fartlek)', desc: "R (Fartlek): 2km WU / 7×(300m @4'30\" + 200m rest @6'00\") / 1.5km CD", durationMin: 50, runKm: 7 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — recupero attivo in acqua', durationMin: 35, swimM: 800 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK Scarico (90min Bici + 20min Corsa)', desc: 'Bici 90\' Z2 — scarico | Brick: Corsa 20\' Z2', durationMin: 110, bikeKm: 38, runKm: 3 },
      { day: 'DOM', sport: 'run',  title: 'Lungo Scarico + Bici Z2', desc: "(Scarico): 16km totali: 11km @ 6'25\" + ultimi 5km @ 5'25\"/km | 🌙 Bici 60' Z2 a sciogliere", durationMin: 160, runKm: 16, bikeKm: 26 },
    ]
  },

  // ─── FASE 2 — PROGRESSIONE (W09) ────────────────────────────────────
  {
    week: 'W09', phase: 'base', faseLabel: 'FASE 2 – Progressione', dateRange: '25 mag – 31 mag',
    note: 'Ingresso in Fase 2: ripetute da 1000m, lunghezza FL a 14km. Nuoto: i primi 1000m continui in vasca.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto tecnica/endurance', desc: '🌙 Nuoto 40\' Z2 — 5×100m con recupero 30", focus continuità bracciata', durationMin: 40, swimM: 1000 },
      { day: 'MAR', sport: 'run',  title: '14km FL', desc: '14km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 89, runKm: 14 },
      { day: 'MER', sport: 'run',  title: 'R (1000m)', desc: "R (1000m): 3.5km WU / 5×(1000m @4'30\" + 300m rest @6'30\") / 3.0km CD", durationMin: 82, runKm: 13 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto tecnica/endurance', desc: '🌙 Nuoto 40\' Z2 — 2×200m con recupero 1\', poi tecnica libera', durationMin: 40, swimM: 1000 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "27km totali: 22km @ 6'20\" + ultimi 5km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 230, runKm: 27, bikeKm: 26 },
    ]
  },

  // ─── FASE 2 — PROGRESSIONE (W10) ────────────────────────────────────
  {
    week: 'W10', phase: 'base', faseLabel: 'FASE 2 – Progressione', dateRange: '01 giu – 07 giu',
    note: 'FM con 9km a passo maratona veloce. Il lungo è progressivo su tre ritmi. La bici del sabato: più fluido e costante.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 4×150m con recupero 45", migliora la continuità', durationMin: 40, swimM: 1000 },
      { day: 'MAR', sport: 'run',  title: '14km FL', desc: '14km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 89, runKm: 14 },
      { day: 'MER', sport: 'run',  title: 'FM (13km)', desc: "FM (13km): 2km WU / 9km @ 4'50\" / 2km CD", durationMin: 82, runKm: 13 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 500m continui Z2, poi tecnica bracciata', durationMin: 40, swimM: 1000 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 — cadenza costante >85rpm | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo Progressivo + Bici Z2', desc: "28km Progressivo: 10km @ 6'25\" + 10km @ 5'50\" + 8km @ 5'10\" | 🌙 Bici 60' Z2 a sciogliere", durationMin: 235, runKm: 28, bikeKm: 26 },
    ]
  },


  // ─── FASE 2 — PROGRESSIONE (W11) ────────────────────────────────────
  {
    week: 'W11', phase: 'base', faseLabel: 'FASE 2 – Progressione', dateRange: '08 giu – 14 giu',
    note: 'Ripetute 800m con 7 serie: volume alto. Il lungo tocca i 29km con finale a RMa.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 6×100m con recupero 20", aumenta la continuità', durationMin: 40, swimM: 1050 },
      { day: 'MAR', sport: 'run',  title: '14km FL', desc: '14km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 89, runKm: 14 },
      { day: 'MER', sport: 'run',  title: 'R (800m ×7)', desc: "R (800m): 3.5km WU / 7×(800m @4'30\" + 250m rest @6'30\") / 3.2km CD", durationMin: 89, runKm: 14 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 3×200m con recupero 45"', durationMin: 40, swimM: 1050 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "29km totali: 24km @ 6'20\" + ultimi 5km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 245, runKm: 29, bikeKm: 26 },
    ]
  },

  // ─── FASE 2 — PROGRESSIONE (W12 — Build) ────────────────────────────
  {
    week: 'W12', phase: 'build', faseLabel: 'FASE 2 – Progressione', dateRange: '15 giu – 21 giu',
    note: 'Prima settimana Build. FL sale a 17km. Ripetute 1000m con 6 serie. Il lungo: 8km finali a RMa.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 2×300m con recupero 1\', tecnica continua', durationMin: 40, swimM: 1050 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'R (1000m ×6)', desc: "R (1000m): 2.0km WU / 6×(1000m @4'35\" + 300m rest @6'30\") / 3.0km CD", durationMin: 70, runKm: 11 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 4×150m con recupero 30"', durationMin: 40, swimM: 1050 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "29km totali: 21km @ 6'20\" + ultimi 8km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 245, runKm: 29, bikeKm: 26 },
    ]
  },

  // ─── FASE 2 — PROGRESSIONE (W13 — Scarico + Gara Test) ──────────────
  {
    week: 'W13', phase: 'recovery', faseLabel: 'FASE 2 – Progressione', dateRange: '22 giu – 28 giu',
    note: 'Settimana di scarico con 🏅 GARA TEST 10km domenica. Nessun brick pesante: gambe fresche per la gara.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — solo scioltezza, respiro controllato', durationMin: 35, swimM: 800 },
      { day: 'MAR', sport: 'run',  title: '12km FL', desc: '12km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 75, runKm: 12 },
      { day: 'MER', sport: 'run',  title: 'R (400m leggero)', desc: "R (400m): 2km WU / 6×(400m @4'25\" + 200m rest @6'00\") / 1.4km CD", durationMin: 50, runKm: 7 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — recupero, tecnica morbida', durationMin: 35, swimM: 800 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo completo pre-gara', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK Leggero (60min Bici + 15min Corsa)', desc: 'Bici 60\' Z1/Z2 — scioltezza pre-gara | Corsa 15\' Z1 attivazione', durationMin: 75, bikeKm: 26, runKm: 2.5 },
      { day: 'DOM', sport: 'run',  title: '🏅 GARA TEST 10km', desc: "🏅 GARA TEST (10km): 15km totali (3km WU + 10km @ 4'20\" all-out + 2km CD) | Niente bici oggi", durationMin: 90, runKm: 15 },
    ]
  },

  // ─── FASE 3 — BUILD (W14) ───────────────────────────────────────────
  {
    week: 'W14', phase: 'build', faseLabel: 'FASE 3 – Build', dateRange: '29 giu – 05 lug',
    note: 'Ingresso Fase 3 Build. FM con 9km a passo sostenuto. Il lungo torna vicino ai 30km con finale RMa.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 3×250m con recupero 45"', durationMin: 40, swimM: 1000 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'FM (11km)', desc: "FM (11km): 1km WU / 9km @ 4'45\" / 1km CD", durationMin: 70, runKm: 11 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 2×300m + 100m tecnica', durationMin: 40, swimM: 1000 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "29km totali: 23km @ 6'20\" + ultimi 6km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 245, runKm: 29, bikeKm: 26 },
    ]
  },

  // ─── FASE 3 — BUILD (W15 — Scarico/Viaggio) ─────────────────────────
  {
    week: 'W15', phase: 'recovery', faseLabel: 'FASE 3 – Build', dateRange: '06 lug – 12 lug',
    note: 'Scarico con contesto viaggio. Volume ridotto. Il lungo domenicale tiene solo 17km (incluse 7km sera post-volo).',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — tecnica, nessuna fatica', durationMin: 35, swimM: 800 },
      { day: 'MAR', sport: 'run',  title: '13km FL', desc: '13km FL — tutto @ 6\'25"/km, <142bpm', durationMin: 82, runKm: 13 },
      { day: 'MER', sport: 'run',  title: 'R (Allunghi)', desc: "R (Allunghi): 7km FL / 8×(100m @4'20\" + 100m rest @6'15\") / 1.4km CD", durationMin: 65, runKm: 10 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — recupero in acqua', durationMin: 35, swimM: 800 },
      { day: 'VEN', sport: 'rest', title: 'Riposo / Viaggio', desc: 'Riposo completo o viaggio', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK Scarico (60min Bici + 15min Corsa)', desc: 'Bici 60\' Z1/Z2 — scioltezza | Corsa 15\' Z2', durationMin: 75, bikeKm: 26, runKm: 2.5 },
      { day: 'DOM', sport: 'run',  title: 'Lungo ridotto + Bici Z2', desc: "17km totali (giovedì context) + 7km FL (domenica sera post-volo) — 24km totali | 🌙 Bici 60' Z2 a sciogliere", durationMin: 210, runKm: 24, bikeKm: 26 },
    ]
  },

  // ─── FASE 3 — BUILD (W16) ───────────────────────────────────────────
  {
    week: 'W16', phase: 'build', faseLabel: 'FASE 3 – Build', dateRange: '13 lug – 19 lug',
    note: 'Ripetute da 1500m: lavoro di soglia progressivo. Il lungo sale a 30km con 10km finali a passo sostenuto.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 5×150m con recupero 30", continuità', durationMin: 40, swimM: 1100 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'R (1500m)', desc: "R (1500m): 2.0km WU / 5×(1500m @4'40\" + 300m rest @6'30\") / 2.5km CD", durationMin: 75, runKm: 12 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 2×400m con recupero 1\'', durationMin: 40, swimM: 1100 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "30km totali: 20km @ 6'20\" + ultimi 10km @ 5'25\"/km | 🌙 Bici 60' Z2 a sciogliere", durationMin: 250, runKm: 30, bikeKm: 26 },
    ]
  },

  // ─── FASE 3 — BUILD (W17) ───────────────────────────────────────────
  {
    week: 'W17', phase: 'build', faseLabel: 'FASE 3 – Build', dateRange: '20 lug – 26 lug',
    note: 'Ripetute lunghe: 2000m × 3. Il lungo include 10km finali a RMa. Primo assaggio del volume picco.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 3×300m con recupero 45"', durationMin: 40, swimM: 1100 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'R (2000m)', desc: "R (2000m): 3.0km WU / 3×(2000m @4'40\" + 500m rest @6'30\") / 3.0km CD", durationMin: 75, runKm: 12 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 600m continui Z2, poi tecnica', durationMin: 40, swimM: 1100 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 — gestisci idratazione e nutrizione | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "30km totali: 20km @ 6'20\" + 10km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 250, runKm: 30, bikeKm: 26 },
    ]
  },

  // ─── FASE 3 — BUILD (W18) ───────────────────────────────────────────
  {
    week: 'W18', phase: 'build', faseLabel: 'FASE 3 – Build', dateRange: '27 lug – 02 ago',
    note: 'FM con 10km a passo maratona veloce. Lungo con 5km finali a RMa. La bici del sabato come recupero attivo.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 4×200m con recupero 40"', durationMin: 40, swimM: 1100 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'FM (12km)', desc: "FM (12km): 1km WU / 10km @ 4'50\" / 1km CD", durationMin: 75, runKm: 12 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 700m continui Z2', durationMin: 40, swimM: 1100 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "30km totali: 25km @ 6'20\" + ultimi 5km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 250, runKm: 30, bikeKm: 26 },
    ]
  },

  // ─── FASE 3 — BUILD (W19) ───────────────────────────────────────────
  {
    week: 'W19', phase: 'build', faseLabel: 'FASE 3 – Build', dateRange: '03 ago – 09 ago',
    note: 'Settimana più intensa della Fase 3. Ripetute 1000m × 7. Lungo progressivo su tre ritmi: 31km totali.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 4×250m con recupero 45"', durationMin: 40, swimM: 1150 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'R (1000m ×7)', desc: "R (1000m): 4.0km WU / 7×(1000m @4'30\" + 300m rest @6'30\") / 3.0km CD", durationMin: 89, runKm: 14 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 3×300m con recupero 1\'', durationMin: 40, swimM: 1150 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2 — gambe a stacchi, abituarsi', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo Progressivo + Bici Z2', desc: "31km Progressivo: 11km @ 6'20\" + 10km @ 5'40\" + 10km @ 5'05\" | 🌙 Bici 60' Z2 a sciogliere", durationMin: 255, runKm: 31, bikeKm: 26 },
    ]
  },

  // ─── FASE 3 — BUILD (W20 — Scarico) ─────────────────────────────────
  {
    week: 'W20', phase: 'recovery', faseLabel: 'FASE 3 – Build', dateRange: '10 ago – 16 ago',
    note: 'Scarico post-blocco Build. Volume ridotto su tutti e tre gli sport. Il lungo scende a 19km con finale RMa.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — scioltezza, nessuna fatica', durationMin: 35, swimM: 800 },
      { day: 'MAR', sport: 'run',  title: '11km FL', desc: '11km FL — tutto @ 6\'25"/km, <142bpm', durationMin: 70, runKm: 11 },
      { day: 'MER', sport: 'run',  title: 'R (Fartlek leggero)', desc: "R (Fartlek): 2km WU / 5×(400m @4'35\" + 200m rest @6'00\") / 3km CD", durationMin: 55, runKm: 8 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — recupero attivo in acqua', durationMin: 35, swimM: 800 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK Scarico (90min Bici + 20min Corsa)', desc: 'Bici 90\' Z2 — scarico | Brick: Corsa 20\' Z2', durationMin: 110, bikeKm: 38, runKm: 3 },
      { day: 'DOM', sport: 'run',  title: 'Lungo Scarico + Bici Z2', desc: "(Scarico): 19km totali: 13km @ 6'25\" + ultimi 6km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 175, runKm: 19, bikeKm: 26 },
    ]
  },


  // ─── FASE 3 — BUILD (W21) ───────────────────────────────────────────
  {
    week: 'W21', phase: 'build', faseLabel: 'FASE 3 – Build', dateRange: '17 ago – 23 ago',
    note: 'Inizio del blocco finale di costruzione prima del picco. FM lungo (12km). Lungo domenicale sfiora le 3 ore.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 4×250m con recupero 45"', durationMin: 40, swimM: 1150 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'FM (12km)', desc: "FM (12km): 2km WU / 10km @ 4'45\" / 2km CD", durationMin: 75, runKm: 14 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 3×300m con recupero 1\'', durationMin: 40, swimM: 1150 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "31km totali: 10km FL + 11km @ 4'55\" RMa + 10km FL | 🌙 Bici 60' Z2 a sciogliere", durationMin: 255, runKm: 31, bikeKm: 26 },
    ]
  },

  // ─── FASE 3 — BUILD (W22) ───────────────────────────────────────────
  {
    week: 'W22', phase: 'build', faseLabel: 'FASE 3 – Build', dateRange: '24 ago – 30 ago',
    note: 'Ripetute da 1000m con 8 ripetizioni. Lungo da 32km con finale a RMa.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 2×500m con recupero 1\'', durationMin: 40, swimM: 1150 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'R (1000m ×8)', desc: "R (1000m): 3.0km WU / 8×(1000m @4'30\" + 300m rest @6'30\") / 3.0km CD", durationMin: 90, runKm: 14 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 5×200m con recupero 30"', durationMin: 40, swimM: 1150 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "32km totali: 24km @ 6'20\" + ultimi 8km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 265, runKm: 32, bikeKm: 26 },
    ]
  },

  // ─── FASE 3 — BUILD (W23) ───────────────────────────────────────────
  {
    week: 'W23', phase: 'build', faseLabel: 'FASE 3 – Build', dateRange: '31 ago – 06 set',
    note: 'Fondo Medio da 13km. Lungo a ritmo FL costante con finale svelto.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 1000m continui', durationMin: 40, swimM: 1150 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'FM (13km)', desc: "FM (13km): 1.5km WU / 11km @ 4'50\" / 1.5km CD", durationMin: 80, runKm: 14 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 10×100m con recupero 20"', durationMin: 40, swimM: 1150 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "32km totali: 20km @ 6'20\" + 12km @ 5'25\"/km | 🌙 Bici 60' Z2 a sciogliere", durationMin: 265, runKm: 32, bikeKm: 26 },
    ]
  },

  // ─── FASE 3 — BUILD (W24 — Scarico) ─────────────────────────────────
  {
    week: 'W24', phase: 'recovery', faseLabel: 'FASE 3 – Build', dateRange: '07 set – 13 set',
    note: 'Scarico pre-blocco picco. Solo allunghi di mercoledì e un lungo breve domenicale.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — scioltezza, curare la tecnica', durationMin: 35, swimM: 900 },
      { day: 'MAR', sport: 'run',  title: '12km FL', desc: '12km FL — tutto @ 6\'25"/km, <142bpm', durationMin: 77, runKm: 12 },
      { day: 'MER', sport: 'run',  title: 'R (Allunghi)', desc: "R (Allunghi): 6km FL / 10×(100m @4'20\" + 100m rest @6'15\") / 1km CD", durationMin: 55, runKm: 9 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — recupero attivo in acqua', durationMin: 35, swimM: 900 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK Scarico (90min Bici + 20min Corsa)', desc: 'Bici 90\' Z2 — scarico | Brick: Corsa 20\' Z2', durationMin: 110, bikeKm: 38, runKm: 3 },
      { day: 'DOM', sport: 'run',  title: 'Lungo Scarico + Bici Z2', desc: "(Scarico): 19km totali: 13km @ 6'25\" + ultimi 6km @ 5'25\"/km | 🌙 Bici 60' Z2 a sciogliere", durationMin: 175, runKm: 19, bikeKm: 26 },
    ]
  },

  // ─── FASE 4 — PICCO (W25) ───────────────────────────────────────────
  {
    week: 'W25', phase: 'build', faseLabel: 'FASE 4 – Picco', dateRange: '14 set – 20 set',
    note: 'Inizio fase di Picco. Ripetute lunghe da 2000m (4x). Lungo da 32km con 10km finali a RMa.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 4×250m con recupero 45"', durationMin: 40, swimM: 1200 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'R (2000m ×4)', desc: "R (2000m): 2.5km WU / 4×(2000m @4'35\" + 500m rest @6'30\") / 3.5km CD", durationMin: 85, runKm: 14 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 3×300m con recupero 1\'', durationMin: 40, swimM: 1200 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "32km totali: 22km FL @ 6'20\" + 10km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 265, runKm: 32, bikeKm: 26 },
    ]
  },

  // ─── FASE 4 — PICCO (W26) ───────────────────────────────────────────
  {
    week: 'W26', phase: 'build', faseLabel: 'FASE 4 – Picco', dateRange: '21 set – 27 set',
    note: 'Fondo Medio importante (14km). Il lungo sale a 33km con finale a RMa.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 2×500m con recupero 1\'', durationMin: 40, swimM: 1200 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'FM (14km)', desc: "FM (14km): 2km WU / 11km @ 4'45\" / 2km CD", durationMin: 85, runKm: 15 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 5×200m con recupero 30"', durationMin: 40, swimM: 1200 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "33km totali: 28km @ 6'15\" + ultimi 5km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 275, runKm: 33, bikeKm: 26 },
    ]
  },

  // ─── FASE 4 — PICCO (W27) ───────────────────────────────────────────
  {
    week: 'W27', phase: 'build', faseLabel: 'FASE 4 – Picco', dateRange: '28 set – 04 ott',
    note: 'Ripetute lunghissime da 3000m (3x). Lungo da 33km con 10km a RMa.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 1200m continui', durationMin: 40, swimM: 1200 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'R (3000m ×3)', desc: "R (3000m): 3.0km WU / 3×(3000m @4'40\" + 500m rest @6'30\") / 4.0km CD", durationMin: 95, runKm: 16 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 12×100m con recupero 20"', durationMin: 40, swimM: 1200 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 25min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 25\' Z2', durationMin: 145, bikeKm: 50, runKm: 4 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "33km totali: 23km FL + 10km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 275, runKm: 33, bikeKm: 26 },
    ]
  },

  // ─── FASE 4 — PICCO (W28 — Scarico + Mezza Maratona) ────────────────
  {
    week: 'W28', phase: 'recovery', faseLabel: 'FASE 4 – Picco', dateRange: '05 ott – 11 ott',
    note: 'Scarico attivo con 🏅 GARA TEST (Mezza Maratona) domenica.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — scioltezza', durationMin: 35, swimM: 900 },
      { day: 'MAR', sport: 'run',  title: '12km FL', desc: '12km FL — tutto @ 6\'25"/km, <142bpm', durationMin: 77, runKm: 12 },
      { day: 'MER', sport: 'run',  title: 'R (Fartlek)', desc: "R (Fartlek): 2.5km WU / 8×(400m @4'35\" + 200m rest @6'00\") / 2.7km CD", durationMin: 60, runKm: 10 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — recupero', durationMin: 35, swimM: 900 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo pre-gara', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK Leggero (60min Bici + 15min Corsa)', desc: 'Bici 60\' Z1/Z2 | Corsa 15\' Z1 attivazione', durationMin: 75, bikeKm: 26, runKm: 2.5 },
      { day: 'DOM', sport: 'run',  title: '🏅 GARA TEST 21km', desc: "🏅 GARA TEST (21km): 23.1km totali (1km WU FL + 21.1km @ 4'40\" + 1km CD FL) | Niente bici oggi", durationMin: 110, runKm: 23.1 },
    ]
  },

  // ─── FASE 4 — PICCO (W29) ───────────────────────────────────────────
  {
    week: 'W29', phase: 'peak', faseLabel: 'FASE 4 – Picco', dateRange: '12 ott – 18 ott',
    note: 'Settimana di Picco 1. FM importante (14km). Lungo da 33km con ben 20km a RMa.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 4×300m con recupero 45"', durationMin: 40, swimM: 1250 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'FM (14km)', desc: "FM (14km): 2km WU / 12km @ 4'45\" / 2km CD", durationMin: 85, runKm: 16 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 5×250m con recupero 30"', durationMin: 40, swimM: 1250 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 30min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 30\' Z2', durationMin: 150, bikeKm: 50, runKm: 5 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "33km totali: 13km FL + 20km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 275, runKm: 33, bikeKm: 26 },
    ]
  },

  // ─── FASE 4 — PICCO (W30) ───────────────────────────────────────────
  {
    week: 'W30', phase: 'peak', faseLabel: 'FASE 4 – Picco', dateRange: '19 ott – 25 ott',
    note: 'Settimana di Picco 2. Ripetute al limite: 4000m × 3. Lungo da 34km con 20km a RMa.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 1250m continui', durationMin: 40, swimM: 1250 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'R (4000m ×3)', desc: "R (4000m): 2.5km WU / 3×(4000m @4'45\" + 500m rest @6'30\") / 1.5km CD", durationMin: 95, runKm: 16 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 6×200m con recupero 30"', durationMin: 40, swimM: 1250 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 30min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 30\' Z2', durationMin: 150, bikeKm: 50, runKm: 5 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "34km totali: 14km FL + 20km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 285, runKm: 34, bikeKm: 26 },
    ]
  },

  // ─── FASE 4 — PICCO (W31) ───────────────────────────────────────────
  {
    week: 'W31', phase: 'peak', faseLabel: 'FASE 4 – Picco', dateRange: '26 ott – 01 nov',
    note: 'Settimana di Picco 3. Il volume massimo del piano. FM 15km e Lungo lunghissimo da 36km con 20km a RMa.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 2×600m con recupero 1\'', durationMin: 40, swimM: 1250 },
      { day: 'MAR', sport: 'run',  title: '17km FL', desc: '17km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 107, runKm: 17 },
      { day: 'MER', sport: 'run',  title: 'FM (15km)', desc: "FM (15km): 2km WU / 13km @ 4'45\" / 2km CD", durationMin: 90, runKm: 17 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto endurance', desc: '🌙 Nuoto 40\' Z2 — 3×400m con recupero 45"', durationMin: 40, swimM: 1250 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK (2h Bici + 30min Corsa)', desc: 'Bici 120\' Z2 | Brick: Corsa 30\' Z2', durationMin: 150, bikeKm: 50, runKm: 5 },
      { day: 'DOM', sport: 'run',  title: 'Lungo + Bici Z2', desc: "36km totali: 16km FL @ 6'15\" + 20km @ 4'55\" RMa | 🌙 Bici 60' Z2 a sciogliere", durationMin: 300, runKm: 36, bikeKm: 26 },
    ]
  },

  // ─── FASE 5 — TAPERING (W32) ────────────────────────────────────────
  {
    week: 'W32', phase: 'taper', faseLabel: 'FASE 5 – Tapering', dateRange: '02 nov – 08 nov',
    note: 'Inizio Tapering. Il volume scende bruscamente ma l\'intensità resta. Lungo a 29km.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — scioltezza e recupero attivo', durationMin: 35, swimM: 900 },
      { day: 'MAR', sport: 'run',  title: '16km FL', desc: '16km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 100, runKm: 16 },
      { day: 'MER', sport: 'run',  title: 'FM (10km)', desc: "FM (10km): 1km WU / 8km @ 4'45\" / 1km CD", durationMin: 60, runKm: 10 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 35\' Z1 — tecnica morbida', durationMin: 35, swimM: 900 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo attivo / mobilità', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK Scarico (90min Bici + 20min Corsa)', desc: 'Bici 90\' Z2 | Brick: Corsa 20\' Z2', durationMin: 110, bikeKm: 38, runKm: 3 },
      { day: 'DOM', sport: 'run',  title: 'Lungo Taper + Bici Z2', desc: "29km totali: 19km FL @ 6'20\" + 10km @ 4'55\" RMa | 🌙 Bici 45' Z1/Z2 a sciogliere", durationMin: 230, runKm: 29, bikeKm: 20 },
    ]
  },

  // ─── FASE 5 — TAPERING (W33) ────────────────────────────────────────
  {
    week: 'W33', phase: 'taper', faseLabel: 'FASE 5 – Tapering', dateRange: '09 nov – 15 nov',
    note: 'Tapering profondo. Mantenere le gambe brillanti con gli allunghi. Lungo a 20km.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 30\' Z1 — relax in vasca', durationMin: 30, swimM: 800 },
      { day: 'MAR', sport: 'run',  title: '14km FL', desc: '14km FL — tutto @ 6\'20"/km, <142bpm', durationMin: 89, runKm: 14 },
      { day: 'MER', sport: 'run',  title: 'R (Allunghi)', desc: "R (Allunghi): 8km FL + 5×(100m @4'15\" + 100m rest @6'15\") / 1km CD", durationMin: 60, runKm: 10 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto leggero', desc: '🌙 Nuoto 30\' Z1 — tecnica', durationMin: 30, swimM: 800 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo', durationMin: 0 },
      { day: 'SAB', sport: 'brick', title: 'BRICK Leggero (60min Bici + 15min Corsa)', desc: 'Bici 60\' Z1/Z2 | Corsa 15\' Z1', durationMin: 75, bikeKm: 26, runKm: 2.5 },
      { day: 'DOM', sport: 'run',  title: 'Lungo Taper + Bici Z1', desc: "20km totali: 10km FL @ 6'20\" + 10km @ 4'55\" RMa | 🌙 Bici 45' Z1 a sciogliere", durationMin: 165, runKm: 20, bikeKm: 20 },
    ]
  },

  // ─── FASE 5 — TAPERING (W34) ────────────────────────────────────────
  {
    week: 'W34', phase: 'taper', faseLabel: 'FASE 5 – Tapering', dateRange: '16 nov – 22 nov',
    note: 'Penultima settimana. Volume cortissimo, FM breve per sentire il ritmo.',
    days: [
      { day: 'LUN', sport: 'swim', title: 'Nuoto scioltissimo', desc: '🌙 Nuoto 30\' Z1 — solo per muoversi', durationMin: 30, swimM: 700 },
      { day: 'MAR', sport: 'run',  title: '11km FL', desc: '11km FL — tutto @ 6\'25"/km, <142bpm', durationMin: 70, runKm: 11 },
      { day: 'MER', sport: 'run',  title: 'FM (9km)', desc: "FM (9km): 2.5km WU / 4km @ 4'55\" / 2.5km CD", durationMin: 50, runKm: 9 },
      { day: 'GIO', sport: 'swim', title: 'Nuoto scioltissimo', desc: '🌙 Nuoto 30\' Z1', durationMin: 30, swimM: 700 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo', durationMin: 0 },
      { day: 'SAB', sport: 'bike', title: 'Bici Agilità', desc: 'Bici 45\' Z1 — solo far girare le gambe', durationMin: 45, bikeKm: 20 },
      { day: 'DOM', sport: 'run',  title: 'Corsa 16km', desc: "16km totali: tutti @ 6'25\"/km | Niente bici post", durationMin: 100, runKm: 16 },
    ]
  },

  // ─── FASE 6 — GARA (W35) ────────────────────────────────────────────
  {
    week: 'W35', phase: 'race', faseLabel: 'FASE 6 – Gara', dateRange: '23 nov – 29 nov',
    note: 'RACE WEEK! Carico di carboidrati. Riposo assoluto. Tensione che sale.',
    days: [
      { day: 'LUN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Recupero totale', durationMin: 0 },
      { day: 'MAR', sport: 'run',  title: '9km FL', desc: '9km FL — tutto @ 6\'25"/km, leggero', durationMin: 55, runKm: 9 },
      { day: 'MER', sport: 'run',  title: 'R (Allunghi)', desc: "R (Allunghi): 7km FL + 5×(100m @4'15\" + 100m rest @6'15\") / 1km CD", durationMin: 50, runKm: 9 },
      { day: 'GIO', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo totale', durationMin: 0 },
      { day: 'VEN', sport: 'rest', title: 'Riposo Assoluto', desc: 'Riposo totale e carboidrati', durationMin: 0 },
      { day: 'SAB', sport: 'run',  title: 'Attivazione', desc: 'Corsa 15\' Z1 — 2 allunghi e via', durationMin: 15, runKm: 2.5 },
      { day: 'DOM', sport: 'race', title: '🏅 MARATONA FIRENZE', desc: "🏅 MARATONA (42.195km): Primi 5km @ 5'05\", poi costante @ 4'53\"-4'55\"", durationMin: 210, runKm: 42.195 },
    ]
  },

]; // END PLAN

const PLAN_START = new Date('2026-03-30T00:00:00');
const RACE_DATE   = new Date('2026-11-29T00:00:00');
const RACE_DISTANCE = 42.195;
const RACE_KEYWORD  = 'MARATONA';
const PACE_TOKEN    = 'RMa';
const RACE_NAME     = 'Maratona Firenze';
