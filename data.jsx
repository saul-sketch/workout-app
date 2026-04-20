// data.jsx — state + persistence + seed data (v3: Saúl Lozano real program active)
const STORAGE_KEY = 'workout_app_v3';
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DAYS_FULL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const iso = (d) => d.toISOString().slice(0, 10);

// Shape:
// {
//   programs: [{
//     id, name, goal, startDate, endDate (null = active, date = ended), durationWeeks,
//     routine: { 0..6: { name, exercises: [...] } },
//     cardio: [{id, name, durationMin, daysPerWeek, notes}],
//     abs:    [{id, name, sets, reps, notes}],
//     diet: {
//       calories, protein, carbs, fat, notes,
//       meals: [{id, name, time, items: [{food, qty}]}]
//     },
//     peptides: [{id, name, dose, unit, frequency, time, notes}],
//   }],
//   activeProgramId,
//   history: { exerciseId: [{date, sets:[{reps,weight}]}] },
//   cardioLog: { cardioId: [{date, durationMin, distanceMi, notes}] },
//   absLog: { absId: [{date, sets:[{reps}]}] },
//   dietLog: { 'YYYY-MM-DD': { calories, protein, carbs, fat, notes, checkedMeals:[mealIds] } },
//   peptidesLog: { peptideId: [{date, time, taken, notes}] },
//   weightLog: [{date, weight, notes}],
//   settings: { unit, restSeconds }
// }

function seedData() {
  const today = new Date();
  const d = (n) => { const x = new Date(today); x.setDate(today.getDate()+n); return iso(x); };

  // ═══════════════════════════════════════════════════════════
  // ARCHIVED DEMO 1 — "Cut fase 1"
  // ═══════════════════════════════════════════════════════════
  const cutFase1 = {
    id: 'p1',
    name: 'Cut fase 1',
    goal: 'Definición / Pérdida de grasa',
    startDate: d(-42),
    endDate: d(-22),
    durationWeeks: 3,
    routine: {
      0: { name: 'Push', exercises: [
        { id: 'p1ex1', name: 'Press de banca', sets: 4, youtube: '', targetReps: '6-8', targetWeight: 150 },
        { id: 'p1ex2', name: 'Press militar', sets: 3, youtube: '', targetReps: '8-10', targetWeight: 90 },
      ]},
      1: { name: 'Pull', exercises: [
        { id: 'p1ex3', name: 'Dominadas', sets: 4, youtube: '', targetReps: '6-8', targetWeight: 0 },
      ]},
      2: { name: 'Piernas', exercises: [] },
      3: { name: 'Descanso', exercises: [] },
      4: { name: 'Upper', exercises: [] },
      5: { name: 'Lower', exercises: [] },
      6: { name: 'Descanso', exercises: [] },
    },
    cardio: [
      { id: 'p1c1', name: 'Caminata inclinada', durationMin: 30, daysPerWeek: 5, notes: 'Incline 12, 3.2 mph' },
    ],
    abs: [
      { id: 'p1a1', name: 'Crunch cable', sets: 3, reps: '15', notes: '' },
    ],
    diet: {
      calories: 2400, protein: 200, carbs: 240, fat: 70, notes: 'Déficit moderado ~400 kcal',
      meals: [],
    },
    peptides: [
      { id: 'p1pep1', name: 'Semaglutide', dose: 0.25, unit: 'mg', frequency: 'Semanal', time: 'Domingo AM', notes: 'Primera fase' },
    ],
  };

  // ═══════════════════════════════════════════════════════════
  // ARCHIVED DEMO 2 — "Lean Bulk" (previously active, ahora archivado)
  // ═══════════════════════════════════════════════════════════
  const leanBulk = {
    id: 'p2',
    name: 'Lean Bulk',
    goal: 'Ganancia magra',
    startDate: d(-21),
    endDate: d(-1),
    durationWeeks: 3,
    routine: {
      0: { name: 'Push', exercises: [
        { id: 'ex1', name: 'Press de banca', sets: 4, youtube: 'https://youtube.com/watch?v=rT7DgCr-3pg', targetReps: '6-8', targetWeight: 155 },
        { id: 'ex2', name: 'Press inclinado mancuerna', sets: 3, youtube: 'https://youtube.com/watch?v=8iPEnn-ltC8', targetReps: '8-10', targetWeight: 55 },
        { id: 'ex3', name: 'Press militar', sets: 3, youtube: 'https://youtube.com/watch?v=2yjwXTZQDDI', targetReps: '8-10', targetWeight: 95 },
        { id: 'ex4', name: 'Elevaciones laterales', sets: 3, youtube: '', targetReps: '12-15', targetWeight: 20 },
        { id: 'ex5', name: 'Extensión tríceps polea', sets: 3, youtube: '', targetReps: '10-12', targetWeight: 50 },
      ]},
      1: { name: 'Pull', exercises: [
        { id: 'ex6', name: 'Dominadas', sets: 4, youtube: 'https://youtube.com/watch?v=eGo4IYlbE5g', targetReps: '6-8', targetWeight: 0 },
        { id: 'ex7', name: 'Remo con barra', sets: 4, youtube: 'https://youtube.com/watch?v=FWJR5Ve8bnQ', targetReps: '8-10', targetWeight: 135 },
        { id: 'ex8', name: 'Jalón al pecho', sets: 3, youtube: '', targetReps: '10-12', targetWeight: 120 },
        { id: 'ex9', name: 'Curl bíceps barra', sets: 3, youtube: '', targetReps: '10-12', targetWeight: 65 },
      ]},
      2: { name: 'Piernas', exercises: [
        { id: 'ex11', name: 'Sentadilla', sets: 4, youtube: 'https://youtube.com/watch?v=ultWZbUMPL8', targetReps: '6-8', targetWeight: 205 },
        { id: 'ex12', name: 'Peso muerto rumano', sets: 3, youtube: '', targetReps: '8-10', targetWeight: 175 },
        { id: 'ex13', name: 'Prensa de piernas', sets: 3, youtube: '', targetReps: '10-12', targetWeight: 360 },
        { id: 'ex14', name: 'Curl femoral', sets: 3, youtube: '', targetReps: '12-15', targetWeight: 90 },
      ]},
      3: { name: 'Descanso', exercises: [] },
      4: { name: 'Upper', exercises: [
        { id: 'ex16', name: 'Press inclinado barra', sets: 4, youtube: '', targetReps: '6-8', targetWeight: 135 },
        { id: 'ex17', name: 'Remo mancuerna', sets: 3, youtube: '', targetReps: '8-10', targetWeight: 60 },
      ]},
      5: { name: 'Lower', exercises: [
        { id: 'ex20', name: 'Sentadilla frontal', sets: 4, youtube: '', targetReps: '6-8', targetWeight: 155 },
        { id: 'ex21', name: 'Peso muerto', sets: 3, youtube: 'https://youtube.com/watch?v=op9kVnSso6Q', targetReps: '5', targetWeight: 245 },
      ]},
      6: { name: 'Descanso', exercises: [] },
    },
    cardio: [
      { id: 'c1', name: 'Caminata matinal', durationMin: 20, daysPerWeek: 5, notes: 'Ayunas, incline 8' },
      { id: 'c2', name: 'HIIT bicicleta', durationMin: 15, daysPerWeek: 2, notes: 'Post entreno, 30s on / 30s off' },
    ],
    abs: [
      { id: 'a1', name: 'Plancha', sets: 3, reps: '60s', notes: '' },
      { id: 'a2', name: 'Rueda abdominal', sets: 3, reps: '10-12', notes: '' },
      { id: 'a3', name: 'Crunch cable', sets: 3, reps: '12-15', notes: '' },
    ],
    diet: {
      calories: 3000, protein: 210, carbs: 340, fat: 85, notes: 'Superávit ~300 kcal · 1 cheat meal fin de semana',
      meals: [
        { id: 'm1', name: 'Desayuno', time: '07:30', items: [{food: 'Avena 80g', qty:'1'}, {food:'Huevos', qty:'4'}, {food:'Plátano', qty:'1'}] },
        { id: 'm2', name: 'Mid-morning', time: '10:30', items: [{food:'Whey', qty:'1 scoop'}, {food:'Almendras', qty:'30g'}] },
        { id: 'm3', name: 'Almuerzo', time: '13:30', items: [{food:'Pollo', qty:'200g'}, {food:'Arroz', qty:'150g'}, {food:'Vegetales', qty:'1 taza'}] },
        { id: 'm4', name: 'Pre-workout', time: '17:00', items: [{food:'Tostada integral', qty:'2'}, {food:'Pavo', qty:'100g'}] },
        { id: 'm5', name: 'Cena', time: '20:30', items: [{food:'Salmón', qty:'180g'}, {food:'Papa', qty:'250g'}, {food:'Brócoli', qty:'1 taza'}] },
      ],
    },
    peptides: [
      { id: 'pep1', name: 'BPC-157', dose: 250, unit: 'mcg', frequency: 'Diaria', time: 'AM', notes: 'Subcutáneo abdomen' },
      { id: 'pep2', name: 'TB-500', dose: 2, unit: 'mg', frequency: '2x semana', time: 'Lun/Jue AM', notes: 'Recuperación hombro' },
      { id: 'pep3', name: 'Ipamorelin', dose: 300, unit: 'mcg', frequency: 'Diaria', time: 'Antes dormir', notes: 'Con estómago vacío' },
    ],
  };

  // ═══════════════════════════════════════════════════════════
  // ACTIVE — "Saúl Lozano v3" (Plan Dr. Aristóteles Lima · 19.04.2026)
  // ═══════════════════════════════════════════════════════════
  const saulV3 = {
    id: 'saul_v3',
    name: 'Saúl Lozano v3',
    goal: 'Plan Dr. Aristóteles Lima · 2,201 kcal · 5 días',
    startDate: d(0),
    endDate: null,
    durationWeeks: 12,
    routine: {
      // LUNES · Treino A · Pecho · Hombro · Tríceps
      0: { name: 'Treino A · Pecho/Hombro/Tríceps', exercises: [
        { id: 'sv3_a1', name: 'Aperturas inclinadas con mancuernas', sets: 5, youtube: 'https://www.youtube.com/watch?v=idAvu2HvqSQ', targetReps: '15·12·10·8·8', targetWeight: 0 },
        { id: 'sv3_a2', name: 'Press inclinado con mancuernas', sets: 4, youtube: 'https://www.youtube.com/watch?v=hChjZQhX1Ls', targetReps: '12-15', targetWeight: 0 },
        { id: 'sv3_a3', name: 'Aperturas en polea media + Pec Deck (bi-set)', sets: 4, youtube: 'https://www.youtube.com/watch?v=YjRHTZyTT4A', targetReps: '10+10 (2s pico)', targetWeight: 0 },
        { id: 'sv3_a4', name: 'Cruce de poleas (crossover)', sets: 3, youtube: 'https://www.youtube.com/watch?v=taI4XduLpTk', targetReps: '10+10 (2s pico)', targetWeight: 0 },
        { id: 'sv3_a5', name: 'Elevaciones laterales sentado con mancuernas', sets: 5, youtube: 'https://www.youtube.com/watch?v=PzsCCjuwFlQ', targetReps: '10', targetWeight: 0 },
        { id: 'sv3_a6', name: 'Extensión de tríceps con cuerda en polea', sets: 5, youtube: 'https://www.youtube.com/watch?v=kiuVA0gs3EI', targetReps: '10-12', targetWeight: 0 },
      ]},
      // MARTES · Treino B · Espalda · Deltoide posterior
      1: { name: 'Treino B · Espalda/Deltoide posterior', exercises: [
        { id: 'sv3_b1', name: 'Jalón al pecho agarre supino', sets: 4, youtube: 'https://www.youtube.com/watch?v=SwBtM9jBgHE', targetReps: '10+10 (2s pico)', targetWeight: 0 },
        { id: 'sv3_b2', name: 'Jalón al pecho con triángulo (agarre cerrado)', sets: 4, youtube: 'https://www.youtube.com/watch?v=VOhbP1OvENM', targetReps: '10-12', targetWeight: 0 },
        { id: 'sv3_b3', name: 'Jalón al pecho agarre neutro', sets: 4, youtube: 'https://www.youtube.com/watch?v=lueEJGjTuPQ', targetReps: '10 (2s pico)', targetWeight: 0 },
        { id: 'sv3_b4', name: 'Remo sentado en polea agarre abierto', sets: 4, youtube: 'https://www.youtube.com/watch?v=UCXxvVItLoM', targetReps: '10-12', targetWeight: 0 },
        { id: 'sv3_b5', name: 'Pullover con cuerda en polea', sets: 4, youtube: 'https://www.youtube.com/watch?v=ZEPbUa7EhRQ', targetReps: '15 (+2 drops final)', targetWeight: 0 },
        { id: 'sv3_b6', name: 'Pájaros en polea (aperturas inversas)', sets: 5, youtube: 'https://www.youtube.com/watch?v=2ZdDm_LDcgE', targetReps: '10', targetWeight: 0 },
      ]},
      // MIÉRCOLES · OFF
      2: { name: 'Descanso', exercises: [] },
      // JUEVES · Treino C · Pierna completa
      3: { name: 'Treino C · Pierna completa', exercises: [
        { id: 'sv3_c1', name: 'Peso muerto sumo', sets: 4, youtube: 'https://www.youtube.com/watch?v=XsrD5y8EIKU', targetReps: '15·12·10·8', targetWeight: 0 },
        { id: 'sv3_c2', name: 'Sentadilla con barra', sets: 4, youtube: 'https://www.youtube.com/watch?v=ultWZbUMPL8', targetReps: '15·12·10·8', targetWeight: 0 },
        { id: 'sv3_c3', name: 'Prensa de piernas 45°', sets: 3, youtube: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', targetReps: '6+6+10 (ecc/conc 4s)', targetWeight: 0 },
        { id: 'sv3_c4', name: 'Sentadilla hack (máquina)', sets: 4, youtube: 'https://www.youtube.com/watch?v=EdtaJRBqwes', targetReps: '10-12', targetWeight: 0 },
        { id: 'sv3_c5', name: 'Peso muerto rumano (stiff)', sets: 4, youtube: 'https://www.youtube.com/watch?v=7j0PGqPjdh0', targetReps: '15·12·10·8', targetWeight: 0 },
        { id: 'sv3_c6', name: 'Extensión cuádriceps + Curl femoral (bi-set)', sets: 4, youtube: 'https://www.youtube.com/watch?v=YyvSfVjQeL0', targetReps: '15', targetWeight: 0 },
      ]},
      // VIERNES · Treino D · Hombros bi-sets
      4: { name: 'Treino D · Hombros (bi-sets)', exercises: [
        { id: 'sv3_d1', name: 'Press hombros máquina + Elevación frontal (bi-set)', sets: 3, youtube: 'https://www.youtube.com/watch?v=Wqq43dKW1TU', targetReps: '12-15', targetWeight: 0 },
        { id: 'sv3_d2', name: 'Press hombros mancuernas + Elevación lateral (bi-set)', sets: 3, youtube: 'https://www.youtube.com/watch?v=qEwKCR5JCog', targetReps: '12-15', targetWeight: 0 },
        { id: 'sv3_d3', name: 'Press militar de pie + Pájaros mancuernas (bi-set)', sets: 3, youtube: 'https://www.youtube.com/watch?v=2yjwXTZQDDI', targetReps: '10-12', targetWeight: 0 },
        { id: 'sv3_d4', name: 'Elevaciones laterales simultáneas en polea', sets: 3, youtube: 'https://www.youtube.com/watch?v=Z5FA9aq3L6A', targetReps: '10+10 (2s pico)', targetWeight: 0 },
      ]},
      // SÁBADO · Treino E · Espalda · Bíceps
      5: { name: 'Treino E · Espalda/Bíceps', exercises: [
        { id: 'sv3_e1', name: 'Peso muerto parcial (rack pull)', sets: 6, youtube: 'https://www.youtube.com/watch?v=iaRiUipwCMI', targetReps: '20·15·12·10·8·8', targetWeight: 0 },
        { id: 'sv3_e2', name: 'Remo inclinado con barra (agarre prono)', sets: 4, youtube: 'https://www.youtube.com/watch?v=vT2GjY_Umpw', targetReps: '10-12 (2s pico)', targetWeight: 0 },
        { id: 'sv3_e3', name: 'Remo inclinado con barra supino (Yates)', sets: 4, youtube: 'https://www.youtube.com/watch?v=9efgcAjQe7E', targetReps: '10-12 (2s baja)', targetWeight: 0 },
        { id: 'sv3_e4', name: 'Remo a una mano con mancuerna (serrucho)', sets: 4, youtube: 'https://www.youtube.com/watch?v=roCP6wCXPqo', targetReps: '15·12·10·8', targetWeight: 0 },
        { id: 'sv3_e5', name: 'Remo sentado en polea con triángulo', sets: 4, youtube: 'https://www.youtube.com/watch?v=GZbfZ033f74', targetReps: '10-12', targetWeight: 0 },
        { id: 'sv3_e6', name: 'Curl de bíceps con barra Z', sets: 5, youtube: 'https://www.youtube.com/watch?v=p0nMr5bKG2w', targetReps: '10-12', targetWeight: 0 },
      ]},
      // DOMINGO · OFF
      6: { name: 'Descanso', exercises: [] },
    },
    cardio: [
      { id: 'sv3_card1', name: 'Zona 2 · post-entreno', durationMin: 30, daysPerWeek: 5, notes: '130 bpm · continuo sin pausa · cinta / elíptica / bici / stair master · ideal post-pesas (+ opcional en días OFF)' },
    ],
    abs: [
      // Circuito A
      { id: 'sv3_abs_a1', name: 'Crunch arrodillado en polea con cuerda', sets: 4, reps: '12-15', notes: 'Circuito A' },
      { id: 'sv3_abs_a2', name: 'Abdominales en el piso (crunch)', sets: 1, reps: '60 (cluster 10s)', notes: 'Circuito A · 60 reps totales con descansos de 10s' },
      { id: 'sv3_abs_a3', name: 'Plancha', sets: 4, reps: '60s', notes: 'Circuito A · isométrico' },
      // Circuito B · Oblicuos
      { id: 'sv3_abs_b1', name: 'Rotación de torso en polea (leñador)', sets: 3, reps: '12-15', notes: 'Circuito B · oblicuos · peso liviano' },
      { id: 'sv3_abs_b2', name: 'Crunch arrodillado con rotación lateral', sets: 3, reps: '12-15', notes: 'Circuito B · oblicuos' },
      { id: 'sv3_abs_b3', name: 'Plancha lateral', sets: 3, reps: '30s', notes: 'Circuito B · isométrico · cada lado' },
      // Circuito C · Abdomen inferior
      { id: 'sv3_abs_c1', name: 'Elevación de piernas colgado en barra', sets: 4, reps: '12-15', notes: 'Circuito C · abdomen inferior' },
      { id: 'sv3_abs_c2', name: 'Abdominal "vela" (V-up) en banco declinado', sets: 4, reps: '12-15', notes: 'Circuito C · abdomen inferior' },
      { id: 'sv3_abs_c3', name: 'Plancha', sets: 4, reps: '60s', notes: 'Circuito C · isométrico' },
    ],
    diet: {
      calories: 2201,
      protein: 149,
      carbs: 293,
      fat: 48,
      notes: '3-4L agua/día · sodio 1-2g · ketchup/mostaza/BBQ zero ok · bebidas zero ok · jugo de limón o parchita · 5 entrenamientos/semana · cardio 30min post-entreno a 130bpm',
      meals: [
        { id: 'sv3_pre', name: 'Pre-Entrenamiento', time: 'PRE', items: [
          { food: 'Pan blanco (o tortitas de arroz 40g)', qty: '2 rebanadas' },
          { food: 'Plátano (banana)', qty: '1 unid' },
          { food: 'Miel', qty: '20g' },
        ]},
        { id: 'sv3_intra', name: 'Intra-Entrenamiento', time: 'INTRA', items: [
          { food: 'Karbolyn en agua', qty: '30g' },
        ]},
        { id: 'sv3_m1', name: 'Comida 1 · Huevos + carb + queso + fruta', time: 'REF 01', items: [
          { food: 'Huevos enteros (base fija)', qty: '2 unid' },
          { food: 'Carb · elige: avena, pan, tortitas, tapioca, cuscús, pita', qty: '80g ó 2-4u' },
          { food: 'Queso · elige: cottage, ricotta, fresco, crema light', qty: '50g' },
          { food: 'Fruta · elige: piña, papaya, fresa, banana, manzana, mango', qty: '200g ó 1u' },
        ]},
        { id: 'sv3_m2', name: 'Comida 2 · Proteína + carb + ensalada', time: 'REF 02', items: [
          { food: 'Proteína · elige: alcatra, contrafilete, filet mignon, pollo, salmón', qty: '150g' },
          { food: 'Carb · elige: arroz, pasta, yuca, papa, camote, calabaza, arroz+frijoles', qty: '150g (300g papa)' },
          { food: 'Ensalada variada (brócoli, lechuga, zanahoria, hojas verdes…)', qty: 'libre' },
        ]},
        { id: 'sv3_m3', name: 'Comida 3 · Whey + fruta + grasa', time: 'REF 03', items: [
          { food: 'Whey Protein (base fija)', qty: '30g' },
          { food: 'Fruta · elige: piña, papaya, fresa, banana, manzana, mango…', qty: '200g ó 1u' },
          { food: 'Grasa · elige: nueces, chocolate 70%, mantequilla de maní', qty: '30g' },
        ]},
        { id: 'sv3_m4', name: 'Comida 4 · Proteína + carb + ensalada + suplementos', time: 'REF 04', items: [
          { food: 'Proteína · elige: pollo, filet mignon, pescado', qty: '150-180g' },
          { food: 'Carb · elige: arroz, pasta, yuca, papa, camote, calabaza', qty: '150g (300g papa)' },
          { food: 'Ensalada variada', qty: 'libre' },
          { food: 'Multivitamínico (Opti-Men)', qty: '1 dosis' },
          { food: 'Omega-3 de 1g', qty: '2 cáps' },
        ]},
      ],
    },
    peptides: [
      { id: 'sv3_pep1', name: 'BPC-157', dose: 1, unit: 'mg', frequency: 'Diaria', time: 'AM', notes: 'Reparación tisular y recuperación' },
      { id: 'sv3_pep2', name: 'TB-500', dose: 5, unit: 'mg', frequency: 'Semanal', time: 'AM', notes: 'Recuperación profunda de tejidos · 1x/semana' },
      { id: 'sv3_pep3', name: 'GHK-Cu', dose: 2, unit: 'mg', frequency: 'Diaria', time: 'AM', notes: 'Antienvejecimiento y regeneración celular' },
      { id: 'sv3_pep4', name: 'Tesamorelina', dose: 1, unit: 'mg', frequency: 'Diaria', time: 'Antes dormir', notes: 'Análogo de GHRH' },
    ],
  };

  return {
    programs: [cutFase1, leanBulk, saulV3],
    activeProgramId: 'saul_v3',
    // Historia preservada de los programas demo archivados
    history: {
      ex1: [
        { date: d(-35), sets: [{reps:8,weight:145},{reps:7,weight:145},{reps:6,weight:145},{reps:5,weight:145}] },
        { date: d(-28), sets: [{reps:8,weight:150},{reps:7,weight:150},{reps:6,weight:150},{reps:6,weight:150}] },
        { date: d(-22), sets: [{reps:8,weight:155},{reps:7,weight:155},{reps:6,weight:155},{reps:5,weight:155}] },
      ],
      ex2: [
        { date: d(-35), sets: [{reps:10,weight:50},{reps:9,weight:50},{reps:8,weight:50}] },
        { date: d(-28), sets: [{reps:10,weight:52.5},{reps:9,weight:52.5},{reps:8,weight:52.5}] },
        { date: d(-22), sets: [{reps:10,weight:55},{reps:9,weight:55},{reps:8,weight:55}] },
      ],
      ex6: [
        { date: d(-30), sets: [{reps:6,weight:0},{reps:5,weight:0},{reps:4,weight:0},{reps:4,weight:0}] },
        { date: d(-23), sets: [{reps:8,weight:0},{reps:6,weight:0},{reps:5,weight:0},{reps:4,weight:0}] },
      ],
      ex7: [
        { date: d(-30), sets: [{reps:10,weight:125},{reps:9,weight:125},{reps:8,weight:125},{reps:7,weight:125}] },
        { date: d(-23), sets: [{reps:10,weight:135},{reps:9,weight:135},{reps:8,weight:135},{reps:7,weight:135}] },
      ],
      ex11: [
        { date: d(-25), sets: [{reps:8,weight:195},{reps:7,weight:195},{reps:6,weight:195},{reps:5,weight:195}] },
      ],
    },
    cardioLog: {
      c1: [
        { date: d(-24), durationMin: 22, distanceMi: 1.2, notes: '' },
        { date: d(-22), durationMin: 20, distanceMi: 1.1, notes: '' },
      ],
      c2: [
        { date: d(-23), durationMin: 15, distanceMi: 0, notes: 'RPE 8' },
      ],
    },
    absLog: {
      a1: [
        { date: d(-24), sets:[{reps:'60s'},{reps:'55s'},{reps:'45s'}] },
      ],
      a3: [
        { date: d(-22), sets:[{reps:15},{reps:13},{reps:12}] },
      ],
    },
    dietLog: {
      [d(-24)]: { calories: 2950, protein: 205, carbs: 330, fat: 82, notes: 'Limpio', checkedMeals:['m1','m2','m3','m4','m5'] },
      [d(-23)]: { calories: 3100, protein: 215, carbs: 355, fat: 88, notes: '', checkedMeals:['m1','m2','m3','m5'] },
      [d(-22)]: { calories: 2880, protein: 200, carbs: 320, fat: 80, notes: 'Faltó pre-workout', checkedMeals:['m1','m2','m3','m5'] },
    },
    peptidesLog: {
      pep1: [
        { date: d(-24), time: '07:00', taken: true, notes: '' },
        { date: d(-23), time: '07:15', taken: true, notes: '' },
        { date: d(-22), time: '07:05', taken: true, notes: '' },
      ],
      pep3: [
        { date: d(-23), time: '22:30', taken: true, notes: '' },
        { date: d(-22), time: '22:45', taken: true, notes: '' },
      ],
    },
    // Peso corporal es global (no cambia al cambiar de programa) — 7 registros en 4 semanas
    weightLog: [
      { date: d(-28), weight: 178.4, notes: '' },
      { date: d(-21), weight: 179.2, notes: '' },
      { date: d(-14), weight: 180.6, notes: 'Buen apetito' },
      { date: d(-10), weight: 181.0, notes: '' },
      { date: d(-7),  weight: 181.8, notes: '' },
      { date: d(-4),  weight: 182.4, notes: '' },
      { date: d(-1),  weight: 182.9, notes: '' },
    ],
    settings: { unit: 'lb', restSeconds: 60 },
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return seedData();
}
function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

function activeProgram(data) {
  return data.programs.find(p => p.id === data.activeProgramId) || data.programs[0];
}

function todayIdx() {
  const js = new Date().getDay();
  return js === 0 ? 6 : js - 1;
}
function dateForDayIdx(dayIdx) {
  const today = new Date();
  const curIdx = todayIdx();
  const diff = dayIdx - curIdx;
  const d = new Date(today);
  d.setDate(today.getDate() + diff);
  return iso(d);
}
function lastSession(history, exId) {
  const entries = history[exId];
  if (!entries || entries.length === 0) return null;
  return entries[entries.length - 1];
}
function personalRecord(history, exId) {
  const entries = history[exId];
  if (!entries || entries.length === 0) return null;
  let best = null;
  entries.forEach(s => s.sets.forEach(set => {
    if (!best || set.weight > best.weight || (set.weight === best.weight && set.reps > best.reps)) {
      best = set;
    }
  }));
  return best;
}
function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr + 'T00:00');
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.round((today - d) / 86400000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  if (diff < 7) return `Hace ${diff} días`;
  if (diff < 14) return 'Semana pasada';
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}
function formatDateShort(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr + 'T00:00');
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}
function newId(prefix = 'x') {
  return prefix + Math.random().toString(36).slice(2, 9);
}
function today() { return iso(new Date()); }

// Program status
function programStatus(p) {
  if (p.endDate) return 'completed';
  return 'active';
}
function programProgress(p) {
  if (!p.startDate) return 0;
  const start = new Date(p.startDate + 'T00:00').getTime();
  const total = (p.durationWeeks || 4) * 7 * 86400000;
  const elapsed = Date.now() - start;
  return Math.max(0, Math.min(1, elapsed / total));
}
function programWeek(p) {
  if (!p.startDate) return 1;
  const start = new Date(p.startDate + 'T00:00').getTime();
  const elapsed = Date.now() - start;
  return Math.max(1, Math.min(p.durationWeeks || 4, Math.floor(elapsed / (7*86400000)) + 1));
}

Object.assign(window, {
  DAYS, DAYS_FULL, loadData, saveData, activeProgram,
  todayIdx, dateForDayIdx, lastSession, personalRecord,
  formatDate, formatDateShort, newId, today,
  programStatus, programProgress, programWeek, iso,
});
