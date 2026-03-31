// Data for Mezza Maratona AP
const PLAN = [
  { week:'W01', d1km:5, d1desc:'5km FL', d2km:5, d2desc:"FM (5km): 1km WU / 3km @ 5'50\" / 1km CD", d3km:0, d3desc:'OFF', d4km:10, d4desc:"Lungo 10km totali: tutti @ 6'30\"/km.", totKm:20, phase:'base' },
  { week:'W02', d1km:6, d1desc:'6km FL', d2km:5, d2desc:"R (400m): 1km WU / 4×(400m @ 5'00\" + 1'30\" rest) / 1km CD", d3km:0, d3desc:'OFF', d4km:10, d4desc:"Lungo 10km totali: 8km @ 6'30\" + 2km @ 6'00\".", totKm:21, phase:'base' },
  { week:'W03', d1km:6, d1desc:'6km FL', d2km:6, d2desc:"FM (6km): 1.5km WU / 3km @ 5'50\" / 1.5km CD", d3km:0, d3desc:'OFF', d4km:11, d4desc:"11km totali: tutti @ 6'30\"/km.", totKm:23, phase:'base' },
  { week:'W04', d1km:5, d1desc:'5km FL', d2km:4, d2desc:"FL (4km) Rigenerante", d3km:0, d3desc:'OFF', d4km:7, d4desc:"(Scarico): 7km @ 6'30\"/km.", totKm:16, phase:'recovery' },
  
  { week:'W05', d1km:7, d1desc:'7km FL', d2km:6, d2desc:"R (400m): 2km WU / 5×(400m @ 5'00\" + 1'30\" rest) / 1km CD", d3km:0, d3desc:'OFF', d4km:11, d4desc:"11km totali: 9km @ 6'30\" + 2km @ 6'00\".", totKm:24, phase:'base' },
  { week:'W06', d1km:7, d1desc:'7km FL', d2km:6, d2desc:"FM (6km): 1km WU / 4km @ 5'50\" / 1km CD", d3km:0, d3desc:'OFF', d4km:12, d4desc:"12km totali: tutti @ 6'30\"/km.", totKm:25, phase:'base' },
  { week:'W07', d1km:8, d1desc:'8km FL', d2km:6, d2desc:"R (Fartlek): 1.5km WU / 5×(200m @ 4'40\" + 300m @ 6'30\") / 2km CD", d3km:0, d3desc:'OFF', d4km:13, d4desc:"13km totali: 10km @ 6'30\" + 3km @ 6'00\".", totKm:27, phase:'base' },
  { week:'W08', d1km:6, d1desc:'6km FL', d2km:5, d2desc:"FL (5km) Rigenerante", d3km:0, d3desc:'OFF', d4km:8, d4desc:"(Scarico): 8km @ 6'30\"/km.", totKm:19, phase:'recovery' },
  
  { week:'W09', d1km:8, d1desc:'8km FL', d2km:7, d2desc:"FM (7km): 1km WU / 5km @ 5'50\" / 1km CD", d3km:0, d3desc:'OFF', d4km:13, d4desc:"13km totali: tutti @ 6'30\"/km.", totKm:28, phase:'base' },
  { week:'W10', d1km:8, d1desc:'8km FL', d2km:7, d2desc:"R (800m): 1.5km WU / 4×(800m @ 5'05\" + 2' rest) / 1km CD", d3km:0, d3desc:'OFF', d4km:14, d4desc:"14km Progressivo: 8km @ 6'30\" + 4km @ 6'00\" + 2km @ 5'40\".", totKm:29, phase:'base' },
  { week:'W11', d1km:9, d1desc:'9km FL', d2km:7, d2desc:"FM (7km): 1km WU / 5km @ 5'45\" / 1km CD", d3km:0, d3desc:'OFF', d4km:15, d4desc:"15km totali: tutti @ 6'30\"/km.", totKm:31, phase:'base' },
  { week:'W12', d1km:5, d1desc:'5km FL', d2km:4, d2desc:"R (Allunghi): 3km FL + 4x(100m @ 4'30\" + 100m @ 6'30\") + 0.2km FL", d3km:0, d3desc:'OFF', d4km:12.1, d4desc:"🏅 GARA TEST (10km): 12.1km totali (1km WU + 10km gara + 1.1km CD).", totKm:21.1, phase:'recovery' },
  
  { week:'W13', d1km:9, d1desc:'9km FL', d2km:8, d2desc:"R (800m): 2km WU / 5×(800m @ 5'05\" + 2' rest) / 1km CD", d3km:0, d3desc:'OFF', d4km:15, d4desc:"15km totali: 12km @ 6'30\" + 3km @ 6'00\".", totKm:32, phase:'build' },
  { week:'W14', d1km:9, d1desc:'9km FL', d2km:8, d2desc:"FM (8km): 1km WU / 6km @ 5'45\" / 1km CD", d3km:0, d3desc:'OFF', d4km:16, d4desc:"16km totali: tutti @ 6'30\"/km.", totKm:33, phase:'build' },
  { week:'W15', d1km:10, d1desc:'10km FL', d2km:8, d2desc:"R (1000m): 2km WU / 4×(1000m @ 5'10\" + 2' rest) / 1km CD", d3km:0, d3desc:'OFF', d4km:17, d4desc:"17km Progressivo: 10km @ 6'30\" + 5km @ 6'00\" + 2km @ RMez (5'30\").", totKm:35, phase:'build' },
  { week:'W16', d1km:7, d1desc:'7km FL', d2km:6, d2desc:"R (Allunghi): 4km FL + 6x(100m @ 4'30\" + 100m @ 6'30\") + 0.8km FL", d3km:0, d3desc:'OFF', d4km:11, d4desc:"(Scarico): 11km totali @ 6'30\"/km.", totKm:24, phase:'recovery' },
  
  { week:'W17', d1km:10, d1desc:'10km FL', d2km:9, d2desc:"FM (9km): 1km WU / 7km @ 5'45\" / 1km CD", d3km:0, d3desc:'OFF', d4km:17, d4desc:"17km totali: 14km @ 6'30\" + 3km @ RMez (5'30\").", totKm:36, phase:'build' },
  { week:'W18', d1km:10, d1desc:'10km FL', d2km:9, d2desc:"R (1000m): 2km WU / 5×(1000m @ 5'10\" + 2' rest) / 1km CD", d3km:0, d3desc:'OFF', d4km:18, d4desc:"18km totali: tutti @ 6'30\"/km.", totKm:37, phase:'build' },
  { week:'W19', d1km:11, d1desc:'11km FL', d2km:9, d2desc:"FM (9km): 1km WU / 7km @ 5'40\" / 1km CD", d3km:0, d3desc:'OFF', d4km:19, d4desc:"19km Progressivo: 10km @ 6'30\" + 7km @ 6'00\" + 2km @ RMez (5'30\").", totKm:39, phase:'build' },
  { week:'W20', d1km:8, d1desc:'8km FL', d2km:6, d2desc:"R (Fartlek): 2km WU + 6x(200m @ 4'40\" + 300m @ 6'30\") + 1km CD", d3km:0, d3desc:'OFF', d4km:13, d4desc:"(Scarico): 13km @ 6'30\"/km.", totKm:27, phase:'recovery' },
  
  { week:'W21', d1km:11, d1desc:'11km FL', d2km:10, d2desc:"R (1000m): 2km WU / 6×(1000m @ 5'10\" + 2' rest) / 1km CD", d3km:0, d3desc:'OFF', d4km:19, d4desc:"19km (Lungo Picco 1): tutti @ 6'30\"/km.", totKm:40, phase:'peak' },
  { week:'W22', d1km:11, d1desc:'11km FL', d2km:10, d2desc:"FM (10km): 1km WU / 8km @ 5'40\" / 1km CD", d3km:0, d3desc:'OFF', d4km:20, d4desc:"20km (Lungo Picco 2): 15km @ 6'30\" + 5km @ 6'00\".", totKm:41, phase:'peak' },
  { week:'W23', d1km:12, d1desc:'12km FL', d2km:10, d2desc:"R (2000m): 2km WU / 3×(2000m @ 5'20\" + 3' rest) / 1km CD", d3km:0, d3desc:'OFF', d4km:20, d4desc:"20km (Lungo Master RM): 15km @ 6'30\" + 5km @ RMez (5'30\"). Il test definitivo.", totKm:42, phase:'peak' },
  { week:'W24', d1km:9, d1desc:'9km FL', d2km:8, d2desc:"FM (8km): 1km WU / 6km @ 5'45\" / 1km CD", d3km:0, d3desc:'OFF', d4km:15, d4desc:"15km (Scarico/Semi-Taper): tutti @ 6'30\"/km.", totKm:32, phase:'recovery' },
  
  { week:'W25', d1km:8, d1desc:'8km FL', d2km:6, d2desc:"R (Allunghi): 4km FL + 8x(100m @ 4'30\" + 100m @ 6'30\") + 0.4km FL", d3km:0, d3desc:'OFF', d4km:14, d4desc:"14km totali (Taper): tutti @ 6'30\"/km.", totKm:28, phase:'taper' },
  { week:'W26', d1km:6, d1desc:'6km FL', d2km:6, d2desc:"FM (6km): 2km FL + 2km @ RMez (5'30\") + 2km FL", d3km:0, d3desc:'OFF', d4km:21.1, d4desc:"🏅 MEZZA MARATONA (21.097km): Goditela tutta, punta costante @ 5'30\" / km.", totKm:33.1, phase:'race' }
];

const PLAN_START = new Date('2026-04-13T00:00:00');
const RACE_DISTANCE = 21.097;
const RACE_KEYWORD = 'MEZZA MARATONA';
const PACE_TOKEN = 'RMez';
const RACE_NAME = 'Mezza Maratona';
