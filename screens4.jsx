// screens4.jsx — Weight tracker + QuickLogSheet for body weight
const { useState: useSw, useMemo: useMemoW, useRef: useRw } = React;

// ═══════════════════════════════════════════════════════════
// WEIGHT SCREEN — global, not per-program
// ═══════════════════════════════════════════════════════════
function WeightScreen({ data, setData }) {
  const unit = data.settings.unit || 'lb';
  const log = (data.weightLog || []).slice().sort((a,b) => a.date.localeCompare(b.date));
  const [range, setRange] = useSw('8w'); // 4w | 8w | 3m | all
  const [logOpen, setLogOpen] = useSw(false);
  const [editEntry, setEditEntry] = useSw(null);

  const filtered = useMemoW(() => {
    if (range === 'all') return log;
    const days = range === '4w' ? 28 : range === '8w' ? 56 : 90;
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
    const cutIso = iso(cutoff);
    return log.filter(e => e.date >= cutIso);
  }, [log, range]);

  const latest = log[log.length - 1];
  const first = log[0];
  const week = filtered.length > 0 ? filtered.find(e => {
    const d = new Date(); d.setDate(d.getDate() - 7);
    return e.date >= iso(d);
  }) : null;
  const totalDelta = latest && first ? latest.weight - first.weight : 0;
  const weekDelta = latest && week && week !== latest ? latest.weight - week.weight : 0;

  const weeklyAvgs = useMemoW(() => {
    // bucket by ISO week
    const buckets = {};
    filtered.forEach(e => {
      const d = new Date(e.date + 'T00:00');
      const day = d.getDay(); // 0=sun
      const diff = day === 0 ? 6 : day - 1;
      d.setDate(d.getDate() - diff);
      const key = iso(d);
      if (!buckets[key]) buckets[key] = [];
      buckets[key].push(e.weight);
    });
    return Object.entries(buckets).map(([weekStart, weights]) => ({
      weekStart,
      avg: weights.reduce((a,b)=>a+b,0) / weights.length,
      count: weights.length,
    })).sort((a,b) => a.weekStart.localeCompare(b.weekStart));
  }, [filtered]);

  return (
    <div style={{ padding: '8px 20px 100px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>
        Peso corporal
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 800, margin: '4px 0 16px', letterSpacing: -1 }}>Mi peso</h1>

      {/* Current weight hero card */}
      <div style={{
        background: 'var(--accent)', color: '#fff', borderRadius: 24,
        padding: 22, marginBottom: 14,
        boxShadow: '0 8px 24px -6px var(--accent-shadow)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, opacity: 0.85, textTransform: 'uppercase' }}>
              Peso actual
            </div>
            {latest ? (
              <>
                <div style={{ fontSize: 46, fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums', letterSpacing: -1.5, lineHeight: 1 }}>
                  {latest.weight.toFixed(1)}
                  <span style={{ fontSize: 18, opacity: 0.85, fontWeight: 600, marginLeft: 6 }}>{unit}</span>
                </div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 6 }}>{formatDate(latest.date)}</div>
              </>
            ) : (
              <div style={{ fontSize: 16, marginTop: 8, opacity: 0.85 }}>Sin registros aún</div>
            )}
          </div>
          <button onClick={() => { setEditEntry(null); setLogOpen(true); }} style={{
            padding: '10px 16px', borderRadius: 14, border: 'none',
            background: 'rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer',
            fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>{Icon.plus(16)} Log</button>
        </div>
        {latest && (
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <DeltaPill label="Semana" delta={weekDelta} unit={unit}/>
            <DeltaPill label="Total" delta={totalDelta} unit={unit}/>
            <div style={{
              padding: '8px 12px', borderRadius: 100,
              background: 'rgba(255,255,255,0.18)', fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ opacity: 0.85 }}>Registros</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{log.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Range toggle */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg2)', borderRadius: 12, padding: 3, marginBottom: 14 }}>
        {[
          {id:'4w', label:'4 sem'},
          {id:'8w', label:'8 sem'},
          {id:'3m', label:'3 meses'},
          {id:'all', label:'Todo'},
        ].map(r => (
          <button key={r.id} onClick={() => setRange(r.id)} style={{
            flex: 1, padding: '8px', borderRadius: 9, border: 'none',
            background: range === r.id ? 'var(--bg1)' : 'transparent',
            color: range === r.id ? 'var(--fg)' : 'var(--fg-dim)',
            cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
          }}>{r.label}</button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 20, padding: 16, marginBottom: 14 }}>
        <WeightChart points={filtered} unit={unit} onPointClick={(e) => { setEditEntry(e); setLogOpen(true); }}/>
      </div>

      {/* Weekly averages */}
      {weeklyAvgs.length > 1 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Promedio semanal
          </div>
          <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 16, padding: 12, marginBottom: 16 }}>
            {weeklyAvgs.slice().reverse().map((w, i) => {
              const prev = weeklyAvgs[weeklyAvgs.length - 1 - i - 1];
              const delta = prev ? w.avg - prev.avg : 0;
              return (
                <div key={w.weekStart} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 6px',
                  borderBottom: i < weeklyAvgs.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>
                    Sem {formatDateShort(w.weekStart)}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {w.avg.toFixed(1)} {unit}
                  </div>
                  {delta !== 0 && (
                    <div style={{
                      padding: '3px 8px', borderRadius: 100,
                      background: delta > 0 ? 'rgba(20,160,80,0.12)' : 'rgba(224,51,42,0.1)',
                      color: delta > 0 ? '#14a050' : '#e0332a',
                      fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                      minWidth: 48, textAlign: 'center',
                    }}>{delta > 0 ? '+' : ''}{delta.toFixed(1)}</div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Entries list */}
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
        Historial ({log.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {log.length === 0 && (
          <div style={{ color: 'var(--fg-dim)', fontSize: 14, padding: 20, textAlign: 'center' }}>
            Aún no hay registros. Toca "+ Log" para empezar.
          </div>
        )}
        {log.slice().reverse().map((e, i) => {
          const prev = log[log.length - 1 - i - 1];
          const delta = prev ? e.weight - prev.weight : 0;
          return (
            <button key={e.date} onClick={() => { setEditEntry(e); setLogOpen(true); }} style={{
              width: '100%', textAlign: 'left', cursor: 'pointer',
              background: 'var(--bg1)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{formatDate(e.date)}</div>
                {e.notes && <div style={{ fontSize: 12, color: 'var(--fg-dim)', marginTop: 2 }}>{e.notes}</div>}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.3 }}>
                {e.weight.toFixed(1)} <span style={{ fontSize: 11, color: 'var(--fg-dim)', fontWeight: 600 }}>{unit}</span>
              </div>
              {delta !== 0 && (
                <div style={{
                  padding: '3px 8px', borderRadius: 100,
                  background: delta > 0 ? 'rgba(20,160,80,0.12)' : 'rgba(224,51,42,0.1)',
                  color: delta > 0 ? '#14a050' : '#e0332a',
                  fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                  minWidth: 52, textAlign: 'center',
                }}>{delta > 0 ? '+' : ''}{delta.toFixed(1)}</div>
              )}
            </button>
          );
        })}
      </div>

      {logOpen && (
        <WeightLogSheet
          data={data} setData={setData}
          entry={editEntry}
          onClose={() => { setLogOpen(false); setEditEntry(null); }}
        />
      )}
    </div>
  );
}

function DeltaPill({ label, delta, unit }) {
  const up = delta > 0;
  const zero = Math.abs(delta) < 0.05;
  return (
    <div style={{
      padding: '8px 12px', borderRadius: 100,
      background: 'rgba(255,255,255,0.18)',
      fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{ opacity: 0.85 }}>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {zero ? '±0' : `${up?'+':''}${delta.toFixed(1)}`} {unit}
      </span>
    </div>
  );
}

// Chart with raw points + 7-day moving average
function WeightChart({ points, unit, onPointClick }) {
  if (points.length === 0) {
    return <div style={{ color: 'var(--fg-dim)', fontSize: 14, padding: 30, textAlign: 'center' }}>Sin datos en este rango</div>;
  }
  const weights = points.map(p => p.weight);
  const maxY = Math.max(...weights);
  const minY = Math.min(...weights);
  const yRange = Math.max(maxY - minY, 2);
  const yBase = minY - yRange * 0.2;
  const yTop = maxY + yRange * 0.2;
  const W = 320, H = 180, pad = { l: 32, r: 10, t: 16, b: 22 };
  const chartW = W - pad.l - pad.r, chartH = H - pad.t - pad.b;

  // time-based x
  const t0 = new Date(points[0].date + 'T00:00').getTime();
  const tN = new Date(points[points.length-1].date + 'T00:00').getTime();
  const tSpan = Math.max(tN - t0, 86400000);
  const xAt = (dateStr) => {
    const t = new Date(dateStr + 'T00:00').getTime();
    return pad.l + ((t - t0) / tSpan) * chartW;
  };
  const yAt = (v) => pad.t + chartH - ((v - yBase) / (yTop - yBase)) * chartH;

  // 7-day moving average
  const moving = points.map((p, i) => {
    const pTime = new Date(p.date + 'T00:00').getTime();
    const window = points.filter(q => {
      const qt = new Date(q.date + 'T00:00').getTime();
      return qt >= pTime - 6*86400000 && qt <= pTime;
    });
    return { date: p.date, avg: window.reduce((a,b) => a + b.weight, 0) / window.length };
  });

  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.date)} ${yAt(p.weight)}`).join(' ');
  const avgD = moving.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.date)} ${yAt(p.avg)}`).join(' ');
  const areaD = points.length > 0 ? lineD + ` L ${xAt(points[points.length-1].date)} ${pad.t + chartH} L ${xAt(points[0].date)} ${pad.t + chartH} Z` : '';

  // X-axis month labels
  const monthLabels = [];
  let lastMonth = '';
  points.forEach(p => {
    const d = new Date(p.date + 'T00:00');
    const m = d.toLocaleDateString('es', { month: 'short' });
    if (m !== lastMonth) { monthLabels.push({ x: xAt(p.date), label: m }); lastMonth = m; }
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 8, fontSize: 11, fontWeight: 600, color: 'var(--fg-dim)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 2, background: 'var(--accent)' }}/> Raw
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 2, background: 'var(--fg)', opacity: 0.4, borderRadius: 1 }}/> Media 7d
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={pad.t + chartH*f} y2={pad.t + chartH*f} stroke="var(--border)" strokeWidth="1"/>
            <text x={pad.l - 6} y={pad.t + chartH*f + 3} fontSize="9" textAnchor="end" fill="var(--fg-dim)" fontWeight="600">
              {(yTop - (yTop - yBase) * f).toFixed(0)}
            </text>
          </g>
        ))}
        {points.length >= 2 && <path d={areaD} fill="url(#weightGrad)"/>}
        {points.length >= 2 && <path d={avgD} fill="none" stroke="var(--fg)" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.4" strokeLinejoin="round"/>}
        <path d={lineD} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        {points.map((p, i) => (
          <circle key={i} cx={xAt(p.date)} cy={yAt(p.weight)} r="4"
            fill="var(--accent)" stroke="var(--bg1)" strokeWidth="2"
            style={{ cursor: 'pointer' }}
            onClick={() => onPointClick && onPointClick(p)}>
            <title>{p.date}: {p.weight.toFixed(1)} {unit}</title>
          </circle>
        ))}
        {monthLabels.map((m, i) => (
          <text key={i} x={m.x} y={H - 6} fontSize="9" textAnchor="middle" fill="var(--fg-dim)" fontWeight="600">
            {m.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function WeightLogSheet({ data, setData, entry, onClose }) {
  const [date, setDate] = useSw(entry?.date || today());
  const [weight, setWeight] = useSw(entry?.weight || '');
  const [notes, setNotes] = useSw(entry?.notes || '');
  const unit = data.settings.unit || 'lb';
  const isEdit = !!entry;

  const save = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) { alert('Introduce un peso válido'); return; }
    const log = data.weightLog || [];
    let newLog;
    if (isEdit) {
      newLog = log.map(e => e.date === entry.date ? { date, weight: w, notes } : e);
    } else {
      // replace if same date exists
      const existing = log.findIndex(e => e.date === date);
      const newEntry = { date, weight: w, notes };
      if (existing >= 0) {
        newLog = log.map((e,i) => i === existing ? newEntry : e);
      } else {
        newLog = [...log, newEntry];
      }
    }
    setData({ ...data, weightLog: newLog });
    onClose();
  };

  const remove = () => {
    if (!confirm('¿Eliminar este registro?')) return;
    setData({ ...data, weightLog: (data.weightLog || []).filter(e => e.date !== entry.date) });
    onClose();
  };

  const stepWeight = (delta) => {
    const cur = parseFloat(weight) || 0;
    const next = Math.max(0, cur + delta);
    setWeight(next.toFixed(1));
  };

  // quick presets based on last entry
  const lastW = (data.weightLog || []).slice().sort((a,b)=>b.date.localeCompare(a.date))[0];

  return (
    <Sheet open={true} onClose={onClose} title={isEdit ? 'Editar registro' : 'Log de peso'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <Label>Fecha</Label>
          <Input type="date" value={date} onChange={setDate}/>
        </div>

        <div>
          <Label>Peso ({unit})</Label>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'var(--bg2)', borderRadius: 16, padding: 6, gap: 6,
          }}>
            <button onClick={() => stepWeight(-0.5)} style={bigStepBtn}>{Icon.minus(20)}</button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <input
                type="number" step="0.1"
                value={weight} onChange={e => setWeight(e.target.value)}
                placeholder="0.0"
                style={{
                  width: '100%', textAlign: 'center', border: 'none', outline: 'none',
                  background: 'transparent', fontSize: 36, fontWeight: 800, color: 'var(--fg)',
                  fontVariantNumeric: 'tabular-nums', fontFamily: 'inherit', letterSpacing: -1,
                  MozAppearance: 'textfield', appearance: 'textfield',
                }}
              />
            </div>
            <button onClick={() => stepWeight(0.5)} style={bigStepBtn}>{Icon.plus(20)}</button>
          </div>
          {lastW && !isEdit && (
            <div style={{ fontSize: 12, color: 'var(--fg-dim)', marginTop: 6, textAlign: 'center' }}>
              Último: <span style={{fontVariantNumeric:'tabular-nums', fontWeight: 700, color:'var(--fg)'}}>{lastW.weight.toFixed(1)} {unit}</span>
              {' '}·{' '}
              <button onClick={() => setWeight(lastW.weight.toFixed(1))} style={{
                border: 'none', background: 'transparent', color: 'var(--accent)',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', padding: 0,
              }}>Usar último</button>
            </div>
          )}
        </div>

        <div>
          <Label>Notas (opcional)</Label>
          <Input value={notes} onChange={setNotes} placeholder="Mañana en ayunas, post-entreno..."/>
        </div>

        <BigButton onClick={save}>{isEdit ? 'Guardar cambios' : 'Guardar registro'}</BigButton>

        {isEdit && (
          <button onClick={remove} style={{
            width: '100%', padding: 12, borderRadius: 12, border: 'none',
            background: 'transparent', color: '#e0332a', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>{Icon.trash(14)} Eliminar registro</button>
        )}
      </div>
    </Sheet>
  );
}

const bigStepBtn = {
  width: 54, height: 54, borderRadius: 12, border: 'none',
  background: 'var(--bg1)', color: 'var(--fg)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'inherit', flexShrink: 0,
};

Object.assign(window, { WeightScreen });
