// screens2.jsx — Progress, Exercises, EditDay, Programs, Diet, Peptides, Cardio+Abs
const { useState: useS2, useMemo: useMemo2 } = React;

// ═══════════════════════════════════════════════════════════
// PROGRESS SCREEN
// ═══════════════════════════════════════════════════════════
function ProgressScreen({ data }) {
  const [selectedEx, setSelectedEx] = useS2(null);
  const program = activeProgram(data);

  const allExercises = useMemo2(() => {
    const map = {};
    data.programs.forEach(prog => {
      Object.values(prog.routine).forEach(day => {
        day.exercises?.forEach(ex => { map[ex.id] = ex; });
      });
    });
    return Object.values(map).filter(ex => (data.history[ex.id] || []).length > 0);
  }, [data]);

  const stats = useMemo2(() => {
    let totalVol = 0, totalSets = 0, totalWorkouts = new Set();
    Object.entries(data.history).forEach(([id, entries]) => {
      entries.forEach(e => {
        totalWorkouts.add(e.date);
        e.sets.forEach(s => { totalVol += s.reps * s.weight; totalSets++; });
      });
    });
    return { totalVol, totalSets, totalWorkouts: totalWorkouts.size };
  }, [data]);

  if (selectedEx) {
    return <ExerciseProgressDetail ex={selectedEx} data={data} onBack={() => setSelectedEx(null)} />;
  }

  return (
    <div style={{ padding: '8px 20px 100px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>
        {program.name}
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 800, margin: '4px 0 20px', letterSpacing: -1 }}>Progreso</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <StatCard label="Workouts" value={stats.totalWorkouts} />
        <StatCard label="Series" value={stats.totalSets} />
      </div>
      <div style={{
        background: 'var(--accent)', color: '#fff', borderRadius: 20,
        padding: '20px 22px', marginBottom: 28,
        boxShadow: '0 8px 24px -6px var(--accent-shadow)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1 }}>Volumen total</div>
        <div style={{ fontSize: 32, fontWeight: 800, margin: '4px 0 0', fontVariantNumeric: 'tabular-nums', letterSpacing: -1 }}>
          {stats.totalVol.toLocaleString()} <span style={{ fontSize: 16, opacity: 0.8, fontWeight: 600 }}>{data.settings.unit}</span>
        </div>
        <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Reps × peso acumulado</div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
        Ejercicios con historial
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {allExercises.length === 0 && (
          <div style={{ color: 'var(--fg-dim)', fontSize: 14, padding: 20, textAlign: 'center' }}>
            Aún no hay sesiones registradas.
          </div>
        )}
        {allExercises.map(ex => {
          const entries = data.history[ex.id] || [];
          const first = entries[0], last = entries[entries.length - 1];
          const firstBest = first ? Math.max(...first.sets.map(s => s.weight)) : 0;
          const lastBest = last ? Math.max(...last.sets.map(s => s.weight)) : 0;
          const delta = lastBest - firstBest;
          return (
            <button key={ex.id} onClick={() => setSelectedEx(ex)} style={{
              width: '100%', textAlign: 'left', cursor: 'pointer',
              background: 'var(--bg1)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{ex.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-dim)', marginTop: 2 }}>
                  {entries.length} {entries.length === 1 ? 'sesión' : 'sesiones'} · {lastBest} {data.settings.unit} top
                </div>
              </div>
              {delta !== 0 && (
                <div style={{
                  padding: '4px 10px', borderRadius: 100,
                  background: delta > 0 ? 'rgba(20,160,80,0.12)' : 'rgba(224,51,42,0.1)',
                  color: delta > 0 ? '#14a050' : '#e0332a',
                  fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                }}>{delta > 0 ? '+' : ''}{delta} {data.settings.unit}</div>
              )}
              <span style={{ color: 'var(--fg-dim)' }}>{Icon.chev(18)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5 }}>{value}</div>
    </div>
  );
}

function ExerciseProgressDetail({ ex, data, onBack }) {
  const entries = data.history[ex.id] || [];
  const pr = personalRecord(data.history, ex.id);
  const unit = data.settings.unit;
  const points = entries.map(e => ({
    date: e.date,
    topWeight: Math.max(...e.sets.map(s => s.weight)),
  }));
  const maxY = Math.max(...points.map(p => p.topWeight), 1);
  const minY = Math.min(...points.map(p => p.topWeight), maxY);
  const yRange = Math.max(maxY - minY, 10);
  const yBase = Math.max(0, minY - yRange * 0.15);
  const yTop = maxY + yRange * 0.15;
  const W = 320, H = 140, pad = { l: 28, r: 8, t: 12, b: 20 };
  const chartW = W - pad.l - pad.r, chartH = H - pad.t - pad.b;
  const xAt = (i) => pad.l + (points.length <= 1 ? chartW / 2 : (i / (points.length - 1)) * chartW);
  const yAt = (v) => pad.t + chartH - ((v - yBase) / (yTop - yBase)) * chartH;
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(p.topWeight)}`).join(' ');
  const areaD = points.length > 0 ? pathD + ` L ${xAt(points.length-1)} ${pad.t + chartH} L ${xAt(0)} ${pad.t + chartH} Z` : '';

  return (
    <div style={{ padding: '8px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 12, border: 'none',
          background: 'var(--bg2)', color: 'var(--fg)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icon.chev(20, 'l')}</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>Progreso</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>{ex.name}</div>
        </div>
      </div>
      {pr && (
        <div style={{
          background: 'var(--bg1)', border: '1px solid var(--border)',
          borderRadius: 20, padding: 18, marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'var(--accent-tint)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.trophy(24)}</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>Récord personal</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.4 }}>
              {pr.weight} {unit} <span style={{ color: 'var(--fg-dim)', fontWeight: 600, fontSize: 16 }}>× {pr.reps}</span>
            </div>
          </div>
        </div>
      )}
      <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 20, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Peso máximo por sesión
        </div>
        {points.length >= 1 ? (
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
              <g key={i}>
                <line x1={pad.l} x2={W - pad.r} y1={pad.t + chartH*f} y2={pad.t + chartH*f} stroke="var(--border)" strokeWidth="1" />
                <text x={pad.l - 4} y={pad.t + chartH*f + 3} fontSize="9" textAnchor="end" fill="var(--fg-dim)" fontWeight="600">
                  {Math.round(yTop - (yTop - yBase) * f)}
                </text>
              </g>
            ))}
            {points.length >= 2 && <path d={areaD} fill="url(#chartGrad)" />}
            <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
            {points.map((p, i) => (
              <circle key={i} cx={xAt(i)} cy={yAt(p.topWeight)} r="4" fill="var(--accent)" stroke="var(--bg1)" strokeWidth="2"/>
            ))}
          </svg>
        ) : <div style={{ color: 'var(--fg-dim)', fontSize: 14, padding: 20, textAlign: 'center' }}>Sin datos</div>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
        Historial ({entries.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entries.slice().reverse().map((e, i) => {
          const top = Math.max(...e.sets.map(s => s.weight));
          return (
            <div key={i} style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 16, padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{formatDate(e.date)}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-dim)', fontVariantNumeric: 'tabular-nums' }}>{e.date}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {e.sets.map((s, j) => (
                  <div key={j} style={{
                    fontSize: 13, fontVariantNumeric: 'tabular-nums',
                    background: s.weight === top ? 'var(--accent-tint)' : 'var(--bg2)',
                    color: s.weight === top ? 'var(--accent)' : 'var(--fg)',
                    padding: '4px 10px', borderRadius: 8, fontWeight: 600,
                  }}>{s.reps} × {s.weight}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EDIT DAY SHEET
// ═══════════════════════════════════════════════════════════
function EditDaySheet({ data, setData, dayIdx, onClose }) {
  const program = activeProgram(data);
  const day = program.routine[dayIdx] || { name: '', exercises: [] };
  const [name, setName] = useS2(day.name);
  const [exercises, setExercises] = useS2(day.exercises);
  const [editingEx, setEditingEx] = useS2(null);

  const save = () => {
    const newData = updateActiveProgram(data, p => ({
      ...p,
      routine: { ...p.routine, [dayIdx]: { name: name || 'Descanso', exercises } },
    }));
    setData(newData);
    onClose();
  };
  const addExercise = () => {
    const ex = { id: newId('ex'), name: '', sets: 3, youtube: '', targetReps: '8-10', targetWeight: 0 };
    setExercises([...exercises, ex]);
    setEditingEx(ex.id);
  };
  const updateEx = (id, patch) => setExercises(exs => exs.map(e => e.id === id ? { ...e, ...patch } : e));
  const removeEx = (id) => {
    setExercises(exs => exs.filter(e => e.id !== id));
    if (editingEx === id) setEditingEx(null);
  };
  const moveEx = (id, dir) => {
    setExercises(exs => {
      const i = exs.findIndex(e => e.id === id); if (i < 0) return exs;
      const j = i + dir; if (j < 0 || j >= exs.length) return exs;
      const arr = exs.slice(); [arr[i], arr[j]] = [arr[j], arr[i]]; return arr;
    });
  };

  return (
    <Sheet open={true} onClose={onClose} title={`Editar ${DAYS_FULL[dayIdx]}`} fullHeight>
      <div style={{ marginBottom: 16 }}>
        <Label>Nombre de la rutina</Label>
        <Input value={name} onChange={setName} placeholder="Ej: Push, Piernas, Descanso..." />
      </div>
      <Label>Ejercicios ({exercises.length})</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {exercises.map((ex, i) => (
          <ExerciseEditRow key={ex.id} ex={ex}
            editing={editingEx === ex.id}
            onToggle={() => setEditingEx(editingEx === ex.id ? null : ex.id)}
            onUpdate={(p) => updateEx(ex.id, p)}
            onRemove={() => removeEx(ex.id)}
            onMoveUp={i > 0 ? () => moveEx(ex.id, -1) : null}
            onMoveDown={i < exercises.length - 1 ? () => moveEx(ex.id, 1) : null}
            unit={data.settings.unit}
          />
        ))}
      </div>
      <button onClick={addExercise} style={dashedBtn}>{Icon.plus(16)} Añadir ejercicio</button>
      <BigButton onClick={save} style={{ marginTop: 16 }}>Guardar cambios</BigButton>
    </Sheet>
  );
}

const dashedBtn = {
  width: '100%', padding: 14, borderRadius: 14,
  background: 'transparent', border: '1.5px dashed var(--border)',
  color: 'var(--fg)', cursor: 'pointer',
  fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
};

function ExerciseEditRow({ ex, editing, onToggle, onUpdate, onRemove, onMoveUp, onMoveDown, unit }) {
  return (
    <div style={{ background: 'var(--bg2)', borderRadius: 14, border: editing ? '1.5px solid var(--accent)' : '1.5px solid transparent' }}>
      <button onClick={onToggle} style={{
        width: '100%', border: 'none', background: 'transparent', cursor: 'pointer',
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'inherit', textAlign: 'left',
      }}>
        <div style={{ color: 'var(--fg-dim)', flexShrink: 0 }}>{Icon.drag(16)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: ex.name ? 'var(--fg)' : 'var(--fg-dim)' }}>
            {ex.name || 'Nuevo ejercicio'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-dim)', marginTop: 1 }}>
            {ex.sets} × {ex.targetReps || '—'} {ex.targetWeight ? `· ${ex.targetWeight} ${unit}` : ''}
            {ex.youtube && <span style={{color:'#ff0000', marginLeft: 6}}>YT</span>}
          </div>
        </div>
        <span style={{ color: 'var(--fg-dim)' }}>{Icon.chev(16, editing ? 'u' : 'd')}</span>
      </button>
      {editing && (
        <div style={{ padding: '4px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div><SubLabel>Nombre</SubLabel><Input value={ex.name} onChange={v => onUpdate({ name: v })} placeholder="Press de banca, Sentadilla..." /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <div><SubLabel>Series</SubLabel><Input type="number" value={ex.sets} onChange={v => onUpdate({ sets: parseInt(v)||1 })} /></div>
            <div><SubLabel>Reps</SubLabel><Input value={ex.targetReps} onChange={v => onUpdate({ targetReps: v })} placeholder="8-10" /></div>
            <div><SubLabel>Peso ({unit})</SubLabel><Input type="number" value={ex.targetWeight} onChange={v => onUpdate({ targetWeight: parseFloat(v)||0 })} /></div>
          </div>
          <div><SubLabel>YouTube (opcional)</SubLabel><Input value={ex.youtube} onChange={v => onUpdate({ youtube: v })} placeholder="https://youtube.com/..." /></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {onMoveUp && <button onClick={onMoveUp} style={smallBtnStyle}>{Icon.chev(14,'u')}</button>}
            {onMoveDown && <button onClick={onMoveDown} style={smallBtnStyle}>{Icon.chev(14,'d')}</button>}
            <div style={{ flex: 1 }} />
            <button onClick={onRemove} style={{...smallBtnStyle, color: '#e0332a', gap: 4, padding: '8px 14px'}}>{Icon.trash(14)} Eliminar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const smallBtnStyle = {
  border: 'none', background: 'var(--bg1)', color: 'var(--fg)',
  padding: 8, borderRadius: 8, cursor: 'pointer',
  fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function Label({ children }) {
  return <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>{children}</div>;
}
function SubLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 }}>{children}</div>;
}
function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
      width: '100%', boxSizing: 'border-box',
      padding: '12px 14px', borderRadius: 12,
      border: '1.5px solid var(--border)', outline: 'none',
      background: 'var(--bg1)', color: 'var(--fg)',
      fontSize: 15, fontFamily: 'inherit', fontWeight: 500,
    }} />
  );
}
function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{
      width: '100%', boxSizing: 'border-box',
      padding: '12px 14px', borderRadius: 12,
      border: '1.5px solid var(--border)', outline: 'none',
      background: 'var(--bg1)', color: 'var(--fg)',
      fontSize: 15, fontFamily: 'inherit', fontWeight: 500, resize: 'vertical',
    }} />
  );
}

Object.assign(window, { ProgressScreen, EditDaySheet, Label, SubLabel, Input, Textarea, dashedBtn, smallBtnStyle });
