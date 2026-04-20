// screens3.jsx — Programs, Diet, Peptides, Cardio, Abs screens
const { useState: useS3, useMemo: useMemo3 } = React;

// ═══════════════════════════════════════════════════════════
// PROGRAMS SCREEN
// ═══════════════════════════════════════════════════════════
function ProgramsScreen({ data, setData, openEditProgram }) {
  const active = activeProgram(data);
  const others = data.programs.filter(p => p.id !== active.id);

  const endActiveAndCreate = () => {
    if (!confirm(`¿Terminar "${active.name}" y crear un programa nuevo?`)) return;
    const newP = {
      id: newId('p'), name: 'Nuevo programa', goal: '', startDate: today(), endDate: null,
      durationWeeks: 4,
      routine: { 0:{name:'Descanso',exercises:[]},1:{name:'Descanso',exercises:[]},2:{name:'Descanso',exercises:[]},3:{name:'Descanso',exercises:[]},4:{name:'Descanso',exercises:[]},5:{name:'Descanso',exercises:[]},6:{name:'Descanso',exercises:[]} },
      cardio: [], abs: [],
      diet: { calories: 2500, protein: 180, carbs: 250, fat: 70, notes: '', meals: [] },
      peptides: [],
    };
    setData({
      ...data,
      programs: data.programs.map(p => p.id === active.id ? { ...p, endDate: today() } : p).concat([newP]),
      activeProgramId: newP.id,
    });
    openEditProgram(newP.id);
  };

  const switchTo = (pid) => {
    setData({ ...data, activeProgramId: pid });
  };

  const pct = programProgress(active);
  const week = programWeek(active);

  return (
    <div style={{ padding: '8px 20px 100px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>Tu ciclo</div>
      <h1 style={{ fontSize: 34, fontWeight: 800, margin: '4px 0 20px', letterSpacing: -1 }}>Programas</h1>

      {/* Active program hero */}
      <div style={{
        background: 'var(--accent)', color: '#fff', borderRadius: 24,
        padding: 22, marginBottom: 16,
        boxShadow: '0 8px 24px -6px var(--accent-shadow)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, opacity: 0.85, textTransform: 'uppercase' }}>
            ● Activo · Sem {week}/{active.durationWeeks}
          </div>
          <button onClick={() => openEditProgram(active.id)} style={{
            width: 32, height: 32, borderRadius: 10, border: 'none',
            background: 'rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.pencil(16)}</button>
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>{active.name}</div>
        {active.goal && <div style={{ fontSize: 14, opacity: 0.9, marginTop: 2 }}>{active.goal}</div>}
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 10, display: 'flex', gap: 16 }}>
          <span>Inicio: {formatDateShort(active.startDate)}</span>
          <span>{active.durationWeeks} semanas</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden', marginTop: 14 }}>
          <div style={{ height: '100%', width: `${pct*100}%`, background: '#fff', borderRadius: 3 }}/>
        </div>
        <div style={{ fontSize: 12, opacity: 0.9, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{Math.round(pct*100)}% completado</div>

        <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
          <MiniStat label="Workouts" value={Object.values(active.routine).filter(d => d.exercises.length).length}/>
          <MiniStat label="Cardio" value={active.cardio?.length || 0}/>
          <MiniStat label="Abs" value={active.abs?.length || 0}/>
          <MiniStat label="Péptidos" value={active.peptides?.length || 0}/>
        </div>
      </div>

      <button onClick={endActiveAndCreate} style={{
        width: '100%', padding: 14, borderRadius: 14, border: 'none',
        background: 'var(--bg2)', color: 'var(--fg)', cursor: 'pointer',
        fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        marginBottom: 28,
      }}>{Icon.check(16)} Terminar y crear programa nuevo</button>

      {others.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Programas anteriores
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {others.map(p => (
              <div key={p.id} style={{
                background: 'var(--bg1)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-dim)', marginTop: 2 }}>
                    {p.goal || 'Sin objetivo'} · {formatDateShort(p.startDate)}{p.endDate ? ` → ${formatDateShort(p.endDate)}` : ''}
                  </div>
                </div>
                <button onClick={() => openEditProgram(p.id)} style={{
                  width: 36, height: 36, borderRadius: 10, border: 'none',
                  background: 'var(--bg2)', color: 'var(--fg-dim)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{Icon.pencil(16)}</button>
                {p.endDate && (
                  <button onClick={() => {
                    if (confirm(`¿Reactivar "${p.name}" como programa activo?`)) switchTo(p.id);
                  }} style={{
                    padding: '8px 12px', borderRadius: 10, border: 'none',
                    background: 'var(--accent-tint)', color: 'var(--accent)', cursor: 'pointer',
                    fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                  }}>Activar</button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.18)', borderRadius: 10, fontSize: 12, fontWeight: 700, display: 'flex', gap: 6 }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ opacity: 0.85 }}>{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EDIT PROGRAM SHEET — meta + cardio + abs + diet targets + peptides config
// ═══════════════════════════════════════════════════════════
function EditProgramSheet({ data, setData, programId, onClose }) {
  const prog = data.programs.find(p => p.id === programId) || data.programs[0];
  const [section, setSection] = useS3('meta');
  const [draft, setDraft] = useS3(prog);

  const save = () => {
    setData({
      ...data,
      programs: data.programs.map(p => p.id === programId ? draft : p),
    });
    onClose();
  };

  const setField = (patch) => setDraft(d => ({ ...d, ...patch }));

  return (
    <Sheet open={true} onClose={onClose} title={`Editar programa`} fullHeight>
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg2)', borderRadius: 12, padding: 3, marginBottom: 18, overflow: 'auto' }}>
        {[
          {id:'meta', label:'Info'},
          {id:'cardio', label:'Cardio'},
          {id:'abs', label:'Abs'},
          {id:'diet', label:'Dieta'},
          {id:'peptides', label:'Péptidos'},
        ].map(t => (
          <button key={t.id} onClick={() => setSection(t.id)} style={{
            flex: 1, padding: '8px 10px', borderRadius: 9, border: 'none',
            background: section === t.id ? 'var(--bg1)' : 'transparent',
            color: section === t.id ? 'var(--fg)' : 'var(--fg-dim)',
            cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}>{t.label}</button>
        ))}
      </div>

      {section === 'meta' && (
        <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
          <div><Label>Nombre del programa</Label><Input value={draft.name} onChange={v => setField({name: v})} placeholder="Lean Bulk, Cut fase 2..."/></div>
          <div><Label>Objetivo</Label><Input value={draft.goal} onChange={v => setField({goal: v})} placeholder="Definición, ganancia, fuerza..."/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
            <div><Label>Inicio</Label><Input type="date" value={draft.startDate} onChange={v => setField({startDate: v})}/></div>
            <div><Label>Semanas</Label><Input type="number" value={draft.durationWeeks} onChange={v => setField({durationWeeks: parseInt(v)||1})}/></div>
          </div>
          {draft.endDate && (
            <div><Label>Fin</Label><Input type="date" value={draft.endDate} onChange={v => setField({endDate: v})}/></div>
          )}
        </div>
      )}

      {section === 'cardio' && (
        <ItemList
          items={draft.cardio || []}
          setItems={(items) => setField({cardio: items})}
          makeNew={() => ({id: newId('c'), name: '', durationMin: 20, daysPerWeek: 3, notes: ''})}
          addLabel="Añadir sesión de cardio"
          emptyText="Sin sesiones de cardio"
          renderPreview={(it) => `${it.durationMin} min · ${it.daysPerWeek}x/sem`}
          renderEdit={(it, onUpd) => (
            <>
              <div><SubLabel>Nombre</SubLabel><Input value={it.name} onChange={v => onUpd({name: v})} placeholder="Cinta, HIIT, Stairmaster..."/></div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8}}>
                <div><SubLabel>Duración (min)</SubLabel><Input type="number" value={it.durationMin} onChange={v => onUpd({durationMin: parseInt(v)||0})}/></div>
                <div><SubLabel>Días/semana</SubLabel><Input type="number" value={it.daysPerWeek} onChange={v => onUpd({daysPerWeek: parseInt(v)||0})}/></div>
              </div>
              <div><SubLabel>Notas</SubLabel><Input value={it.notes} onChange={v => onUpd({notes: v})} placeholder="Incline 12, ayunas..."/></div>
            </>
          )}
        />
      )}

      {section === 'abs' && (
        <ItemList
          items={draft.abs || []}
          setItems={(items) => setField({abs: items})}
          makeNew={() => ({id: newId('a'), name: '', sets: 3, reps: '15', notes: ''})}
          addLabel="Añadir ejercicio de abs"
          emptyText="Sin ejercicios de abs"
          renderPreview={(it) => `${it.sets} × ${it.reps}`}
          renderEdit={(it, onUpd) => (
            <>
              <div><SubLabel>Nombre</SubLabel><Input value={it.name} onChange={v => onUpd({name: v})} placeholder="Plancha, Crunch cable..."/></div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8}}>
                <div><SubLabel>Series</SubLabel><Input type="number" value={it.sets} onChange={v => onUpd({sets: parseInt(v)||1})}/></div>
                <div><SubLabel>Reps</SubLabel><Input value={it.reps} onChange={v => onUpd({reps: v})} placeholder="15 o 60s"/></div>
              </div>
            </>
          )}
        />
      )}

      {section === 'diet' && (
        <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10}}>
            <div><Label>Calorías</Label><Input type="number" value={draft.diet?.calories} onChange={v => setField({diet: {...draft.diet, calories: parseInt(v)||0}})}/></div>
            <div><Label>Proteína (g)</Label><Input type="number" value={draft.diet?.protein} onChange={v => setField({diet: {...draft.diet, protein: parseInt(v)||0}})}/></div>
            <div><Label>Carbos (g)</Label><Input type="number" value={draft.diet?.carbs} onChange={v => setField({diet: {...draft.diet, carbs: parseInt(v)||0}})}/></div>
            <div><Label>Grasas (g)</Label><Input type="number" value={draft.diet?.fat} onChange={v => setField({diet: {...draft.diet, fat: parseInt(v)||0}})}/></div>
          </div>
          <div><Label>Notas</Label><Textarea value={draft.diet?.notes} onChange={v => setField({diet: {...draft.diet, notes: v}})} placeholder="Déficit 400 kcal, 1 cheat meal..."/></div>

          <Label>Comidas planificadas</Label>
          <ItemList
            items={draft.diet?.meals || []}
            setItems={(items) => setField({diet: {...draft.diet, meals: items}})}
            makeNew={() => ({id: newId('m'), name: '', time: '', items: []})}
            addLabel="Añadir comida"
            emptyText="Sin comidas definidas"
            renderPreview={(it) => `${it.time || 'sin hora'} · ${it.items?.length || 0} items`}
            renderEdit={(it, onUpd) => (
              <>
                <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap: 8}}>
                  <div><SubLabel>Nombre</SubLabel><Input value={it.name} onChange={v => onUpd({name: v})} placeholder="Desayuno..."/></div>
                  <div><SubLabel>Hora</SubLabel><Input value={it.time} onChange={v => onUpd({time: v})} placeholder="07:30"/></div>
                </div>
                <div>
                  <SubLabel>Alimentos</SubLabel>
                  <div style={{display:'flex', flexDirection:'column', gap: 6}}>
                    {(it.items || []).map((food, idx) => (
                      <div key={idx} style={{display:'grid', gridTemplateColumns:'2fr 1fr 36px', gap: 6, alignItems:'center'}}>
                        <Input value={food.food} onChange={v => { const n = [...it.items]; n[idx] = {...n[idx], food: v}; onUpd({items: n}); }} placeholder="Avena"/>
                        <Input value={food.qty} onChange={v => { const n = [...it.items]; n[idx] = {...n[idx], qty: v}; onUpd({items: n}); }} placeholder="80g"/>
                        <button onClick={() => onUpd({items: it.items.filter((_,i)=>i!==idx)})} style={{...smallBtnStyle, color:'#e0332a'}}>{Icon.trash(14)}</button>
                      </div>
                    ))}
                    <button onClick={() => onUpd({items: [...(it.items||[]), {food:'', qty:''}]})} style={{...smallBtnStyle, background: 'var(--bg1)'}}>
                      {Icon.plus(14)} Añadir alimento
                    </button>
                  </div>
                </div>
              </>
            )}
          />
        </div>
      )}

      {section === 'peptides' && (
        <ItemList
          items={draft.peptides || []}
          setItems={(items) => setField({peptides: items})}
          makeNew={() => ({id: newId('pep'), name: '', dose: 0, unit: 'mcg', frequency: 'Diaria', time: 'AM', notes: ''})}
          addLabel="Añadir péptido"
          emptyText="Sin péptidos definidos"
          renderPreview={(it) => `${it.dose}${it.unit} · ${it.frequency}`}
          renderEdit={(it, onUpd) => (
            <>
              <div><SubLabel>Nombre</SubLabel><Input value={it.name} onChange={v => onUpd({name: v})} placeholder="BPC-157, TB-500..."/></div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8}}>
                <div><SubLabel>Dosis</SubLabel><Input type="number" value={it.dose} onChange={v => onUpd({dose: parseFloat(v)||0})}/></div>
                <div><SubLabel>Unidad</SubLabel>
                  <select value={it.unit} onChange={e => onUpd({unit: e.target.value})} style={{
                    width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
                    border: '1.5px solid var(--border)', outline: 'none',
                    background: 'var(--bg1)', color: 'var(--fg)', fontSize: 15, fontFamily: 'inherit', fontWeight: 500,
                  }}>
                    <option value="mcg">mcg</option><option value="mg">mg</option><option value="iu">IU</option>
                  </select>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8}}>
                <div><SubLabel>Frecuencia</SubLabel><Input value={it.frequency} onChange={v => onUpd({frequency: v})} placeholder="Diaria, 2x semana..."/></div>
                <div><SubLabel>Horario</SubLabel><Input value={it.time} onChange={v => onUpd({time: v})} placeholder="AM, antes dormir..."/></div>
              </div>
              <div><SubLabel>Notas</SubLabel><Input value={it.notes} onChange={v => onUpd({notes: v})} placeholder="Subcutáneo abdomen..."/></div>
            </>
          )}
        />
      )}

      <BigButton onClick={save} style={{ marginTop: 24 }}>Guardar</BigButton>
    </Sheet>
  );
}

// Generic expandable item list used for cardio/abs/peptides/meals
function ItemList({ items, setItems, makeNew, addLabel, emptyText, renderPreview, renderEdit }) {
  const [expanded, setExpanded] = useS3(null);
  const upd = (id, patch) => setItems(items.map(it => it.id === id ? {...it, ...patch} : it));
  const rm = (id) => { setItems(items.filter(it => it.id !== id)); if (expanded === id) setExpanded(null); };
  const add = () => { const it = makeNew(); setItems([...items, it]); setExpanded(it.id); };

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 8}}>
      {items.length === 0 && (
        <div style={{ color:'var(--fg-dim)', fontSize: 13, textAlign:'center', padding: 12 }}>{emptyText}</div>
      )}
      {items.map(it => (
        <div key={it.id} style={{ background:'var(--bg2)', borderRadius: 14, border: expanded===it.id ? '1.5px solid var(--accent)' : '1.5px solid transparent' }}>
          <button onClick={() => setExpanded(expanded === it.id ? null : it.id)} style={{
            width: '100%', border: 'none', background: 'transparent', cursor: 'pointer',
            padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: 'inherit', textAlign: 'left',
          }}>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontSize: 15, fontWeight: 700, color: it.name ? 'var(--fg)' : 'var(--fg-dim)'}}>{it.name || 'Nuevo'}</div>
              <div style={{fontSize: 12, color: 'var(--fg-dim)', marginTop: 1}}>{renderPreview(it)}</div>
            </div>
            <span style={{color:'var(--fg-dim)'}}>{Icon.chev(16, expanded===it.id ? 'u' : 'd')}</span>
          </button>
          {expanded === it.id && (
            <div style={{padding: '4px 14px 14px', display:'flex', flexDirection:'column', gap: 10}}>
              {renderEdit(it, (p) => upd(it.id, p))}
              <button onClick={() => rm(it.id)} style={{...smallBtnStyle, color: '#e0332a', gap: 4, padding: '8px 14px', alignSelf:'flex-end'}}>
                {Icon.trash(14)} Eliminar
              </button>
            </div>
          )}
        </div>
      ))}
      <button onClick={add} style={dashedBtn}>{Icon.plus(16)} {addLabel}</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DIET SCREEN
// ═══════════════════════════════════════════════════════════
function DietScreen({ data, setData }) {
  const prog = activeProgram(data);
  const diet = prog.diet || { calories:0, protein:0, carbs:0, fat:0, meals:[] };
  const todayKey = today();
  const log = data.dietLog?.[todayKey] || { calories: 0, protein: 0, carbs: 0, fat: 0, notes: '', checkedMeals: [] };

  const setLog = (patch) => {
    const newLog = { ...log, ...patch };
    setData({ ...data, dietLog: { ...(data.dietLog||{}), [todayKey]: newLog } });
  };
  const toggleMeal = (mealId) => {
    const checked = log.checkedMeals || [];
    setLog({ checkedMeals: checked.includes(mealId) ? checked.filter(m=>m!==mealId) : [...checked, mealId] });
  };

  const recentDays = Object.entries(data.dietLog || {})
    .sort((a,b) => b[0].localeCompare(a[0]))
    .slice(0, 7);

  return (
    <div style={{ padding: '8px 20px 100px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>
        {prog.name}
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 800, margin: '4px 0 20px', letterSpacing: -1 }}>Dieta</h1>

      {/* Macro rings */}
      <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 24, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
          Hoy · meta diaria
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <MacroRing label="kcal" value={log.calories} target={diet.calories} big/>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <MacroBar label="Proteína" value={log.protein} target={diet.protein} unit="g" />
            <MacroBar label="Carbos" value={log.carbs} target={diet.carbs} unit="g" />
            <MacroBar label="Grasas" value={log.fat} target={diet.fat} unit="g" />
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap: 8, marginTop: 14}}>
          <QuickStep label="kcal" value={log.calories} onChange={v => setLog({calories: v})} step={50}/>
          <QuickStep label="prot" value={log.protein} onChange={v => setLog({protein: v})} step={5}/>
          <QuickStep label="carb" value={log.carbs} onChange={v => setLog({carbs: v})} step={5}/>
          <QuickStep label="fat"  value={log.fat}   onChange={v => setLog({fat: v})}   step={2}/>
        </div>
      </div>

      {/* Meals checklist */}
      {diet.meals?.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Plan de comidas
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap: 8, marginBottom: 18 }}>
            {diet.meals.map(m => {
              const checked = (log.checkedMeals || []).includes(m.id);
              return (
                <div key={m.id} style={{
                  background: 'var(--bg1)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <button onClick={() => toggleMeal(m.id)} style={{
                    width: 32, height: 32, borderRadius: 10, border: 'none',
                    background: checked ? 'var(--accent)' : 'var(--bg2)',
                    color: checked ? '#fff' : 'var(--fg-dim)', cursor: 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0,
                  }}>{Icon.check(16)}</button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{fontSize: 14, fontWeight: 700, textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.5 : 1}}>
                      {m.time && <span style={{ color:'var(--fg-dim)', fontWeight: 600, marginRight: 6, fontVariantNumeric:'tabular-nums' }}>{m.time}</span>}
                      {m.name}
                    </div>
                    {m.items?.length > 0 && (
                      <div style={{fontSize: 12, color:'var(--fg-dim)', marginTop: 2}}>
                        {m.items.map(i => `${i.food}${i.qty ? ' ('+i.qty+')' : ''}`).join(' · ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Notes */}
      <Label>Notas de hoy</Label>
      <Textarea value={log.notes} onChange={v => setLog({notes: v})} placeholder="Cómo te sientes, hambre, antojos..." />

      {/* Program notes */}
      {diet.notes && (
        <div style={{ background: 'var(--bg2)', borderRadius: 14, padding: '12px 14px', marginTop: 14, fontSize: 13, color: 'var(--fg)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Del programa</div>
          {diet.notes}
        </div>
      )}

      {/* Recent days */}
      {recentDays.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 10 }}>
            Últimos 7 días
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 6}}>
            {recentDays.map(([date, l]) => (
              <div key={date} style={{
                background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 12,
                padding: '10px 14px', display:'flex', alignItems:'center', gap: 10,
              }}>
                <div style={{fontSize: 13, fontWeight: 700, minWidth: 70}}>{formatDate(date)}</div>
                <div style={{flex: 1, fontSize: 12, color: 'var(--fg-dim)', fontVariantNumeric: 'tabular-nums'}}>
                  {l.calories} kcal · P{l.protein} C{l.carbs} F{l.fat}
                </div>
                <div style={{fontSize: 11, padding:'2px 8px', borderRadius: 100, background:'var(--bg2)', color:'var(--fg-dim)', fontWeight:700}}>
                  {(l.checkedMeals||[]).length}/{diet.meals?.length || 0} ✓
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MacroRing({ label, value, target, big }) {
  const pct = target > 0 ? Math.min(1, value / target) : 0;
  const r = big ? 42 : 28;
  const size = big ? 100 : 70;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg2)" strokeWidth="7"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--accent)" strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
          transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="round"/>
      </svg>
      <div style={{ position:'absolute', inset: 0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{fontSize: big ? 16 : 13, fontWeight: 800, fontVariantNumeric:'tabular-nums', letterSpacing: -0.3}}>{value}</div>
        <div style={{fontSize: big ? 9 : 8, color: 'var(--fg-dim)', fontWeight: 700, textTransform:'uppercase', letterSpacing: 0.5}}>/{target} {label}</div>
      </div>
    </div>
  );
}

function MacroBar({ label, value, target, unit }) {
  const pct = target > 0 ? Math.min(1, value / target) : 0;
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 3, fontSize: 12 }}>
        <span style={{fontWeight: 700}}>{label}</span>
        <span style={{color:'var(--fg-dim)', fontVariantNumeric:'tabular-nums'}}>{value}/{target}{unit}</span>
      </div>
      <div style={{height: 6, background:'var(--bg2)', borderRadius: 3, overflow:'hidden'}}>
        <div style={{height: '100%', width: `${pct*100}%`, background: 'var(--accent)', borderRadius: 3}}/>
      </div>
    </div>
  );
}

function QuickStep({ label, value, onChange, step }) {
  return (
    <div style={{background:'var(--bg2)', borderRadius: 10, padding: 4}}>
      <div style={{fontSize: 9, fontWeight: 700, color:'var(--fg-dim)', textTransform:'uppercase', textAlign:'center', marginTop: 2, marginBottom: 3}}>{label}</div>
      <div style={{display:'flex', alignItems:'center', gap: 2}}>
        <button onClick={() => onChange(Math.max(0, (value||0) - step))} style={{width:24, height: 24, borderRadius: 6, border: 'none', background:'var(--bg1)', color:'var(--fg)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>{Icon.minus(12)}</button>
        <input type="number" value={value||''} onChange={e => onChange(e.target.value === '' ? 0 : parseInt(e.target.value))} style={{
          flex: 1, width: 0, textAlign:'center', border:'none', outline:'none',
          background:'transparent', fontSize: 13, fontWeight: 700, color:'var(--fg)',
          fontVariantNumeric:'tabular-nums', fontFamily:'inherit',
          MozAppearance:'textfield', appearance:'textfield',
        }}/>
        <button onClick={() => onChange((value||0) + step)} style={{width:24, height:24, borderRadius: 6, border:'none', background:'var(--bg1)', color:'var(--fg)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>{Icon.plus(12)}</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PEPTIDES SCREEN
// ═══════════════════════════════════════════════════════════
function PeptidesScreen({ data, setData }) {
  const prog = activeProgram(data);
  const peptides = prog.peptides || [];
  const todayKey = today();

  const isTakenToday = (pepId) => {
    const log = data.peptidesLog?.[pepId] || [];
    return log.some(l => l.date === todayKey && l.taken);
  };

  const toggleTaken = (pepId) => {
    const log = data.peptidesLog?.[pepId] || [];
    const todayEntry = log.find(l => l.date === todayKey);
    let newLog;
    if (todayEntry) {
      newLog = log.map(l => l.date === todayKey ? {...l, taken: !l.taken} : l);
    } else {
      const now = new Date();
      const hhmm = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
      newLog = [...log, { date: todayKey, time: hhmm, taken: true, notes: '' }];
    }
    setData({ ...data, peptidesLog: { ...(data.peptidesLog||{}), [pepId]: newLog } });
  };

  // Last 14 days for streak viz
  const days14 = Array.from({length: 14}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13-i));
    return iso(d);
  });

  return (
    <div style={{ padding: '8px 20px 100px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>
        {prog.name}
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 800, margin: '4px 0 20px', letterSpacing: -1 }}>Péptidos</h1>

      {peptides.length === 0 ? (
        <div style={{ background: 'var(--bg2)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
          <div style={{fontSize: 15, fontWeight: 700, marginBottom: 4}}>Sin péptidos</div>
          <div style={{fontSize: 13, color:'var(--fg-dim)'}}>Añade péptidos editando el programa activo.</div>
        </div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap: 10}}>
          {peptides.map(p => {
            const taken = isTakenToday(p.id);
            const log = data.peptidesLog?.[p.id] || [];
            return (
              <div key={p.id} style={{
                background: 'var(--bg1)', border: '1px solid var(--border)',
                borderRadius: 20, padding: 16,
              }}>
                <div style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 12}}>
                  <button onClick={() => toggleTaken(p.id)} style={{
                    width: 48, height: 48, borderRadius: 14, border: 'none', cursor: 'pointer',
                    background: taken ? 'var(--accent)' : 'var(--bg2)',
                    color: taken ? '#fff' : 'var(--fg-dim)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{Icon.check(22)}</button>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontSize: 16, fontWeight: 700}}>{p.name}</div>
                    <div style={{fontSize: 12, color:'var(--fg-dim)', marginTop: 2, fontVariantNumeric:'tabular-nums'}}>
                      {p.dose}{p.unit} · {p.frequency} · {p.time}
                    </div>
                  </div>
                </div>
                {/* 14-day streak */}
                <div style={{display:'flex', gap: 3, alignItems:'flex-end'}}>
                  {days14.map(d => {
                    const entry = log.find(l => l.date === d && l.taken);
                    return (
                      <div key={d} title={d} style={{
                        flex: 1, height: 22, borderRadius: 4,
                        background: entry ? 'var(--accent)' : 'var(--bg2)',
                        opacity: d === todayKey ? 1 : (entry ? 0.9 : 0.7),
                        border: d === todayKey ? '1.5px solid var(--accent)' : 'none',
                      }}/>
                    );
                  })}
                </div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize: 10, color:'var(--fg-dim)', marginTop: 4, fontWeight: 600}}>
                  <span>-14 días</span>
                  <span>Hoy</span>
                </div>
                {p.notes && <div style={{fontSize: 12, color:'var(--fg-dim)', marginTop: 10}}>{p.notes}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CARDIO + ABS COMBINED SCREEN
// ═══════════════════════════════════════════════════════════
function ExtrasScreen({ data, setData }) {
  const prog = activeProgram(data);
  const [tab, setTab] = useS3('cardio');
  const todayKey = today();

  return (
    <div style={{ padding: '8px 20px 100px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>
        {prog.name}
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 800, margin: '4px 0 20px', letterSpacing: -1 }}>Cardio & Abs</h1>

      <div style={{ display: 'flex', gap: 4, background: 'var(--bg2)', borderRadius: 12, padding: 3, marginBottom: 18 }}>
        {['cardio','abs'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '10px', borderRadius: 9, border: 'none',
            background: tab === t ? 'var(--bg1)' : 'transparent',
            color: tab === t ? 'var(--fg)' : 'var(--fg-dim)',
            cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
            textTransform: 'capitalize',
          }}>{t === 'cardio' ? 'Cardio' : 'Abs'}</button>
        ))}
      </div>

      {tab === 'cardio' ? <CardioList data={data} setData={setData} prog={prog}/> : <AbsList data={data} setData={setData} prog={prog}/>}
    </div>
  );
}

function CardioList({ data, setData, prog }) {
  const items = prog.cardio || [];
  const todayKey = today();

  const logSession = (cardioId, patch) => {
    const existing = (data.cardioLog?.[cardioId] || []).find(e => e.date === todayKey);
    const base = { date: todayKey, durationMin: 0, distanceMi: 0, notes: '' };
    const entry = existing ? { ...existing, ...patch } : { ...base, ...patch };
    const log = data.cardioLog?.[cardioId] || [];
    const newLog = existing
      ? log.map(e => e.date === todayKey ? entry : e)
      : [...log, entry];
    setData({ ...data, cardioLog: { ...(data.cardioLog||{}), [cardioId]: newLog } });
  };

  if (items.length === 0) return <EmptyState text="Sin sesiones de cardio en este programa."/>;

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 12}}>
      {items.map(c => {
        const log = data.cardioLog?.[c.id] || [];
        const todayEntry = log.find(e => e.date === todayKey);
        const recent = log.slice(-5).reverse();
        return (
          <div key={c.id} style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 20, padding: 16 }}>
            <div style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 12}}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background:'var(--accent-tint)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{Icon.flame(22)}</div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontSize: 16, fontWeight: 700}}>{c.name}</div>
                <div style={{fontSize: 12, color:'var(--fg-dim)', marginTop: 2}}>Meta: {c.durationMin} min · {c.daysPerWeek}x/sem</div>
              </div>
              {todayEntry && (
                <div style={{padding:'4px 10px', borderRadius: 100, background:'var(--accent-tint)', color:'var(--accent)', fontSize: 11, fontWeight: 700}}>
                  ✓ Hoy
                </div>
              )}
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginBottom: 10}}>
              <div>
                <SubLabel>Duración (min)</SubLabel>
                <MiniInput value={todayEntry?.durationMin || 0} onChange={v => logSession(c.id, {durationMin: v})} step={5}/>
              </div>
              <div>
                <SubLabel>Distancia (mi)</SubLabel>
                <MiniInput value={todayEntry?.distanceMi || 0} onChange={v => logSession(c.id, {distanceMi: v})} step={0.1}/>
              </div>
            </div>
            {c.notes && <div style={{fontSize: 12, color:'var(--fg-dim)', marginBottom: 8}}>{c.notes}</div>}
            {recent.length > 0 && (
              <div style={{borderTop: '1px solid var(--border)', paddingTop: 10, display:'flex', flexDirection:'column', gap: 4}}>
                {recent.map((e, i) => (
                  <div key={i} style={{display:'flex', justifyContent:'space-between', fontSize: 12}}>
                    <span style={{color:'var(--fg-dim)', fontWeight: 600}}>{formatDate(e.date)}</span>
                    <span style={{fontVariantNumeric:'tabular-nums', fontWeight: 600}}>
                      {e.durationMin} min{e.distanceMi > 0 ? ` · ${e.distanceMi} mi` : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AbsList({ data, setData, prog }) {
  const items = prog.abs || [];
  const todayKey = today();

  const logAbs = (absId, sets) => {
    const existing = (data.absLog?.[absId] || []).find(e => e.date === todayKey);
    const log = data.absLog?.[absId] || [];
    const entry = { date: todayKey, sets };
    const newLog = existing
      ? log.map(e => e.date === todayKey ? entry : e)
      : [...log, entry];
    setData({ ...data, absLog: { ...(data.absLog||{}), [absId]: newLog } });
  };

  if (items.length === 0) return <EmptyState text="Sin ejercicios de abs en este programa."/>;

  return (
    <div style={{display:'flex', flexDirection:'column', gap: 12}}>
      {items.map(a => {
        const log = data.absLog?.[a.id] || [];
        const todayEntry = log.find(e => e.date === todayKey);
        const setsArr = todayEntry?.sets || Array.from({length: a.sets}, () => ({reps: a.reps}));
        const upd = (idx, reps) => {
          const ns = setsArr.map((s,i) => i === idx ? {reps} : s);
          logAbs(a.id, ns);
        };
        return (
          <div key={a.id} style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 20, padding: 16 }}>
            <div style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 10}}>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontSize: 16, fontWeight: 700}}>{a.name}</div>
                <div style={{fontSize: 12, color:'var(--fg-dim)', marginTop: 2}}>Meta: {a.sets} × {a.reps}</div>
              </div>
              {todayEntry && (
                <div style={{padding:'4px 10px', borderRadius: 100, background:'var(--accent-tint)', color:'var(--accent)', fontSize: 11, fontWeight: 700}}>✓ Hoy</div>
              )}
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(60px, 1fr))', gap: 6}}>
              {setsArr.map((s, i) => (
                <div key={i} style={{background:'var(--bg2)', borderRadius: 10, padding: '6px 8px'}}>
                  <div style={{fontSize: 9, color:'var(--fg-dim)', fontWeight: 700, textAlign:'center', marginBottom: 2}}>S{i+1}</div>
                  <input value={s.reps} onChange={e => upd(i, e.target.value)} style={{
                    width: '100%', textAlign:'center', border:'none', outline:'none',
                    background:'transparent', fontSize: 15, fontWeight: 700, color:'var(--fg)',
                    fontVariantNumeric:'tabular-nums', fontFamily:'inherit',
                  }}/>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ background: 'var(--bg2)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
      <div style={{fontSize: 13, color:'var(--fg-dim)'}}>{text}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MORE SCREEN — tabs for Progress / Programs
// ═══════════════════════════════════════════════════════════
function MoreScreen({ view, setView, data, setData, openEditProgram }) {
  return (
    <div>
      <div style={{ padding: '12px 20px 4px', display: 'flex', gap: 6, background: 'var(--bg0)', overflowX: 'auto' }}>
        {[
          {id:'weight', label:'Peso', icon: Icon.scale(16)},
          {id:'progress', label:'Progreso', icon: Icon.chart(16)},
          {id:'programs', label:'Programas', icon: Icon.program(16)},
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            padding: '9px 14px', borderRadius: 100, border: 'none',
            background: view === t.id ? 'var(--fg)' : 'var(--bg2)',
            color: view === t.id ? 'var(--bg0)' : 'var(--fg)',
            cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', flexShrink: 0,
          }}>{t.icon} {t.label}</button>
        ))}
      </div>
      {view === 'weight' && <WeightScreen data={data} setData={setData} />}
      {view === 'progress' && <ProgressScreen data={data} />}
      {view === 'programs' && <ProgramsScreen data={data} setData={setData} openEditProgram={openEditProgram}/>}
    </div>
  );
}

Object.assign(window, { ProgramsScreen, EditProgramSheet, DietScreen, PeptidesScreen, ExtrasScreen, MoreScreen });
