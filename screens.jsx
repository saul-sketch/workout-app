// screens.jsx — Week + Workout screens (program-aware)
const { useState: useS, useEffect: useE, useRef: useR, useMemo } = React;

// Helper to update the active program immutably
function updateActiveProgram(data, updater) {
  const pid = data.activeProgramId;
  return {
    ...data,
    programs: data.programs.map(p => p.id === pid ? updater(p) : p),
  };
}

// ═══════════════════════════════════════════════════════════
// WEEK SCREEN
// ═══════════════════════════════════════════════════════════
function WeekScreen({ data, setData, goToWorkout, editDay, goToPrograms }) {
  const curIdx = todayIdx();
  const program = activeProgram(data);
  const routine = program.routine || {};
  const pct = programProgress(program);
  const week = programWeek(program);

  return (
    <div style={{ padding: '8px 20px 100px' }}>
      {/* Program banner */}
      <button onClick={goToPrograms} style={{
        width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
        background: 'var(--bg2)', borderRadius: 14, padding: '10px 14px',
        fontFamily: 'inherit', marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--accent)' }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Programa activo · Sem {week}/{program.durationWeeks}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{program.name}</div>
        </div>
        <div style={{ width: 60, height: 6, background: 'var(--bg1)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${pct*100}%`, height: '100%', background: 'var(--accent)' }}/>
        </div>
        <span style={{ color: 'var(--fg-dim)' }}>{Icon.chev(16)}</span>
      </button>

      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>
        Esta semana
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 800, margin: '4px 0 20px', letterSpacing: -1 }}>
        Tu rutina
      </h1>

      {routine[curIdx] && routine[curIdx].exercises.length > 0 ? (
        <button onClick={() => goToWorkout(curIdx)} style={{
          width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
          background: 'var(--accent)', color: '#fff',
          borderRadius: 24, padding: 24, marginBottom: 16,
          fontFamily: 'inherit',
          boxShadow: '0 8px 24px -6px var(--accent-shadow)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, opacity: 0.85, textTransform: 'uppercase' }}>
            HOY · {DAYS_FULL[curIdx]}
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, margin: '6px 0 2px', letterSpacing: -0.5 }}>
            {routine[curIdx].name}
          </div>
          <div style={{ fontSize: 15, opacity: 0.9, marginBottom: 18 }}>
            {routine[curIdx].exercises.length} ejercicios · {routine[curIdx].exercises.reduce((a,e)=>a+e.sets,0)} series
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.2)', padding: '10px 16px',
            borderRadius: 100, fontSize: 15, fontWeight: 700,
          }}>
            Empezar workout {Icon.chev(16)}
          </div>
        </button>
      ) : (
        <div style={{
          background: 'var(--bg2)', borderRadius: 24, padding: 24, marginBottom: 16,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: 'var(--fg-dim)' }}>
            HOY · {DAYS_FULL[curIdx]}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, margin: '8px 0 4px' }}>Día de descanso</div>
          <div style={{ fontSize: 14, color: 'var(--fg-dim)' }}>Recupera bien 💪</div>
        </div>
      )}

      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 28, marginBottom: 10 }}>
        Resto de la semana
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[0,1,2,3,4,5,6].filter(i => i !== curIdx).map(i => {
          const day = routine[i];
          const isRest = !day || day.exercises.length === 0;
          return (
            <div key={i} style={{
              background: 'var(--bg1)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--bg2)', color: 'var(--fg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                color: 'var(--fg-dim)',
              }}>{DAYS[i]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: isRest ? 'var(--fg-dim)' : 'var(--fg)' }}>
                  {day ? day.name : 'Descanso'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-dim)', marginTop: 2 }}>
                  {isRest ? 'Descanso' : `${day.exercises.length} ejercicios · ${day.exercises.reduce((a,e)=>a+e.sets,0)} series`}
                </div>
              </div>
              <button onClick={() => editDay(i)} style={{
                width: 36, height: 36, borderRadius: 10, border: 'none',
                background: 'var(--bg2)', color: 'var(--fg-dim)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{Icon.pencil(16)}</button>
              {!isRest && (
                <button onClick={() => goToWorkout(i)} style={{
                  width: 36, height: 36, borderRadius: 10, border: 'none',
                  background: 'var(--accent)', color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{Icon.chev(16)}</button>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={() => editDay(curIdx)} style={{
        width: '100%', padding: '14px', borderRadius: 14,
        background: 'transparent', border: '1.5px dashed var(--border)',
        color: 'var(--fg-dim)', cursor: 'pointer', fontSize: 14, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: 'inherit', marginTop: 16,
      }}>{Icon.pencil(14)} Editar rutina del día</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// WORKOUT SCREEN
// ═══════════════════════════════════════════════════════════
function WorkoutScreen({ data, setData, dayIdx, onBack, openTimer }) {
  const program = activeProgram(data);
  const day = program.routine[dayIdx];
  const dateKey = dateForDayIdx(dayIdx);

  const initSession = () => {
    const s = {};
    day.exercises.forEach(ex => {
      const prev = lastSession(data.history, ex.id);
      const existingToday = (data.history[ex.id] || []).find(e => e.date === dateKey);
      if (existingToday) {
        s[ex.id] = existingToday.sets.map(set => ({ ...set, done: true }));
      } else {
        s[ex.id] = Array.from({ length: ex.sets }, (_, i) => ({
          reps: prev?.sets[i]?.reps || 0,
          weight: prev?.sets[i]?.weight ?? ex.targetWeight ?? 0,
          done: false,
        }));
      }
    });
    return s;
  };
  const [session, setSession] = useS(initSession);
  const [expanded, setExpanded] = useS(day.exercises[0]?.id || null);

  const updateSet = (exId, idx, patch) => {
    setSession(prev => ({
      ...prev,
      [exId]: prev[exId].map((s, i) => i === idx ? { ...s, ...patch } : s),
    }));
  };
  const addSet = (exId) => {
    setSession(prev => {
      const last = prev[exId][prev[exId].length - 1] || { reps: 0, weight: 0 };
      return { ...prev, [exId]: [...prev[exId], { reps: last.reps, weight: last.weight, done: false }] };
    });
  };
  const removeSet = (exId, idx) => {
    setSession(prev => ({ ...prev, [exId]: prev[exId].filter((_, i) => i !== idx) }));
  };
  const toggleDone = (exId, idx) => {
    const cur = session[exId][idx];
    const newDone = !cur.done;
    updateSet(exId, idx, { done: newDone });
    if (newDone) openTimer(data.settings.restSeconds);
    const newData = { ...data };
    const existingIdx = (newData.history[exId] || []).findIndex(e => e.date === dateKey);
    const updatedSets = session[exId].map((s, i) => i === idx ? { ...s, done: newDone } : s);
    const completedSets = updatedSets.filter(s => s.done).map(s => ({ reps: s.reps, weight: s.weight }));
    if (!newData.history[exId]) newData.history[exId] = [];
    if (completedSets.length === 0) {
      if (existingIdx >= 0) newData.history[exId].splice(existingIdx, 1);
    } else {
      const entry = { date: dateKey, sets: completedSets };
      if (existingIdx >= 0) newData.history[exId][existingIdx] = entry;
      else newData.history[exId].push(entry);
    }
    setData(newData);
  };

  const totalSets = Object.values(session).flat().length;
  const doneSets = Object.values(session).flat().filter(s => s.done).length;
  const progress = totalSets > 0 ? doneSets / totalSets : 0;

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--bg0)', padding: '8px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <button onClick={onBack} style={{
            width: 40, height: 40, borderRadius: 12, border: 'none',
            background: 'var(--bg2)', color: 'var(--fg)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.chev(20, 'l')}</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>
              {DAYS_FULL[dayIdx]}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>{day.name}</div>
          </div>
          <div style={{
            padding: '6px 12px', borderRadius: 100,
            background: 'var(--bg2)', fontSize: 13, fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
          }}>{doneSets}/{totalSets}</div>
        </div>
        <div style={{ height: 4, background: 'var(--bg2)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress * 100}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{ padding: '8px 20px' }}>
        {day.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id} ex={ex}
            sets={session[ex.id]}
            lastSess={lastSession(data.history, ex.id)}
            expanded={expanded === ex.id}
            onToggle={() => setExpanded(expanded === ex.id ? null : ex.id)}
            onUpdateSet={(i, p) => updateSet(ex.id, i, p)}
            onToggleDone={(i) => toggleDone(ex.id, i)}
            onAddSet={() => addSet(ex.id)}
            onRemoveSet={(i) => removeSet(ex.id, i)}
            unit={data.settings.unit}
          />
        ))}
        {doneSets === totalSets && totalSets > 0 && (
          <div style={{ marginTop: 20, background: 'var(--bg2)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🔥</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>¡Workout completado!</div>
            <div style={{ fontSize: 14, color: 'var(--fg-dim)', marginTop: 4 }}>{totalSets} series en el bote</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExerciseCard({ ex, sets, lastSess, expanded, onToggle, onUpdateSet, onToggleDone, onAddSet, onRemoveSet, unit }) {
  const doneCount = sets.filter(s => s.done).length;
  const allDone = doneCount === sets.length && sets.length > 0;
  return (
    <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 20, marginBottom: 12, overflow: 'hidden' }}>
      <button onClick={onToggle} style={{
        width: '100%', border: 'none', background: 'transparent', cursor: 'pointer',
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: 'inherit', textAlign: 'left',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: allDone ? 'var(--accent)' : 'var(--bg2)',
          color: allDone ? '#fff' : 'var(--fg-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
        }}>{allDone ? Icon.check(18) : `${doneCount}/${sets.length}`}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg)' }}>{ex.name}</div>
          <div style={{ fontSize: 13, color: 'var(--fg-dim)', marginTop: 2 }}>
            {ex.sets} × {ex.targetReps || '—'} {ex.targetWeight ? `· ${ex.targetWeight} ${unit}` : ''}
          </div>
        </div>
        {ex.youtube && (
          <a href={ex.youtube} target="_blank" onClick={e => e.stopPropagation()} style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--bg2)', color: '#ff0000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none',
          }}>{Icon.yt(18)}</a>
        )}
        <div style={{ color: 'var(--fg-dim)', marginLeft: 2 }}>{Icon.chev(18, expanded ? 'u' : 'd')}</div>
      </button>
      {expanded && (
        <div style={{ padding: '0 16px 16px' }}>
          {lastSess && (
            <div style={{ fontSize: 12, color: 'var(--fg-dim)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 700 }}>{formatDate(lastSess.date)}:</span>
              {lastSess.sets.map((s,i) => (
                <span key={i} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {s.reps}×{s.weight}{i<lastSess.sets.length-1?',':''}
                </span>
              ))}
            </div>
          )}
          <div style={{
            display: 'grid', gridTemplateColumns: '32px 1fr 1fr 44px',
            gap: 8, fontSize: 11, fontWeight: 700, color: 'var(--fg-dim)',
            textTransform: 'uppercase', letterSpacing: 0.8, padding: '0 4px 8px',
          }}>
            <span style={{textAlign:'center'}}>#</span>
            <span style={{textAlign:'center'}}>Reps</span>
            <span style={{textAlign:'center'}}>Peso ({unit})</span>
            <span></span>
          </div>
          {sets.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 44px', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: s.done ? 'var(--accent)' : 'var(--bg2)',
                color: s.done ? '#fff' : 'var(--fg-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
              }}>{i+1}</div>
              <MiniInput value={s.reps} onChange={v => onUpdateSet(i, {reps: v})} step={1} />
              <MiniInput value={s.weight} onChange={v => onUpdateSet(i, {weight: v})} step={5} />
              <button onClick={() => onToggleDone(i)} style={{
                width: 44, height: 44, borderRadius: 12, border: 'none',
                background: s.done ? 'var(--accent)' : 'var(--bg2)',
                color: s.done ? '#fff' : 'var(--fg-dim)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{Icon.check(20)}</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={onAddSet} style={{
              flex: 1, padding: 12, borderRadius: 12, border: 'none',
              background: 'var(--bg2)', color: 'var(--fg)', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>{Icon.plus(16)} Añadir serie</button>
            {sets.length > 1 && (
              <button onClick={() => onRemoveSet(sets.length - 1)} style={{
                padding: '12px 16px', borderRadius: 12, border: 'none',
                background: 'var(--bg2)', color: 'var(--fg-dim)', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{Icon.minus(16)}</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniInput({ value, onChange, step = 1 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: 44, background: 'var(--bg2)', borderRadius: 12, overflow: 'hidden' }}>
      <button onClick={() => onChange(Math.max(0, (value||0) - step))} style={{
        width: 34, height: '100%', border: 'none', background: 'transparent',
        color: 'var(--fg-dim)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{Icon.minus(14)}</button>
      <input type="number" value={value || ''} onChange={e => onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))} style={{
        flex: 1, width: 0, textAlign: 'center', border: 'none', outline: 'none',
        background: 'transparent', fontSize: 17, fontWeight: 700, color: 'var(--fg)',
        fontVariantNumeric: 'tabular-nums', fontFamily: 'inherit',
        MozAppearance: 'textfield', appearance: 'textfield',
      }}/>
      <button onClick={() => onChange((value||0) + step)} style={{
        width: 34, height: '100%', border: 'none', background: 'transparent',
        color: 'var(--fg)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{Icon.plus(14)}</button>
    </div>
  );
}

Object.assign(window, { WeekScreen, WorkoutScreen, updateActiveProgram });
