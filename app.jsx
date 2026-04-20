// app.jsx — main app shell, timer, tweaks
const { useState: useSa, useEffect: useEa, useRef: useRa } = React;

// ═══════════════════════════════════════════════════════════
// REST TIMER
// ═══════════════════════════════════════════════════════════
function RestTimer({ seconds, onClose, defaultSeconds }) {
  const [remaining, setRemaining] = useSa(seconds);
  const [paused, setPaused] = useSa(false);

  useEa(() => { setRemaining(seconds); setPaused(false); }, [seconds]);

  useEa(() => {
    if (paused) return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(id); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [paused]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = defaultSeconds > 0 ? remaining / defaultSeconds : 0;
  const circ = 2 * Math.PI * 60;

  return (
    <div style={{
      position: 'fixed', left: 'max(16px, calc(50% - 280px))', right: 'max(16px, calc(50% - 280px))', bottom: 'calc(90px + env(safe-area-inset-bottom))', zIndex: 80,
      background: 'var(--fg)', color: 'var(--bg0)',
      borderRadius: 24, padding: 16,
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 12px 40px -8px rgba(0,0,0,0.4)',
    }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4"/>
        <circle cx="36" cy="36" r="30" fill="none" stroke="var(--accent)" strokeWidth="4"
          strokeDasharray={2 * Math.PI * 30}
          strokeDashoffset={2 * Math.PI * 30 * (1 - pct)}
          transform="rotate(-90 36 36)" strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s linear' }}/>
        <text x="36" y="41" textAnchor="middle" fontSize="17" fontWeight="800" fill="currentColor" fontFamily="inherit">
          {mins}:{secs.toString().padStart(2,'0')}
        </text>
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>
          Descanso
        </div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>
          {remaining === 0 ? '¡Listo para la siguiente serie!' : 'Recupera fuerza'}
        </div>
      </div>
      <button onClick={() => setPaused(p => !p)} style={{
        width: 40, height: 40, borderRadius: 12, border: 'none',
        background: 'rgba(255,255,255,0.12)', color: 'inherit', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{paused ? Icon.play(14) : Icon.pause(14)}</button>
      <button onClick={onClose} style={{
        width: 40, height: 40, borderRadius: 12, border: 'none',
        background: 'rgba(255,255,255,0.12)', color: 'inherit', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{Icon.close(18)}</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TWEAKS PANEL
// ═══════════════════════════════════════════════════════════
const ACCENT_OPTIONS = [
  { id: 'orange', name: 'Naranja', color: '#FF4D2E' },
  { id: 'green',  name: 'Verde',   color: '#10B981' },
  { id: 'blue',   name: 'Azul',    color: '#2E6BFF' },
  { id: 'pink',   name: 'Fucsia',  color: '#EC4899' },
  { id: 'violet', name: 'Violeta', color: '#7C3AED' },
];

function TweaksPanel({ tweaks, setTweaks, onReset }) {
  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16, zIndex: 1000,
      background: '#fff', color: '#000',
      borderRadius: 16, padding: 16, width: 260,
      boxShadow: '0 20px 50px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
        Tweaks
      </div>

      {/* Accent */}
      <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
        Color de acento
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {ACCENT_OPTIONS.map(o => (
          <button key={o.id} onClick={() => setTweaks({ ...tweaks, accent: o.id })} style={{
            width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
            background: o.color,
            boxShadow: tweaks.accent === o.id ? `0 0 0 2px #fff, 0 0 0 4px ${o.color}` : 'none',
          }} />
        ))}
      </div>

      {/* Theme */}
      <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
        Tema
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, background: '#f2f2f2', borderRadius: 10, padding: 3 }}>
        {['light','dark'].map(t => (
          <button key={t} onClick={() => setTweaks({ ...tweaks, theme: t })} style={{
            flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: tweaks.theme === t ? '#fff' : 'transparent',
            color: '#000', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            boxShadow: tweaks.theme === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}>{t === 'light' ? '☀️ Claro' : '🌙 Oscuro'}</button>
        ))}
      </div>

      {/* Density */}
      <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
        Densidad
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, background: '#f2f2f2', borderRadius: 10, padding: 3 }}>
        {['compact','cozy'].map(d => (
          <button key={d} onClick={() => setTweaks({ ...tweaks, density: d })} style={{
            flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: tweaks.density === d ? '#fff' : 'transparent',
            color: '#000', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            boxShadow: tweaks.density === d ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}>{d === 'compact' ? 'Compacto' : 'Espacioso'}</button>
        ))}
      </div>

      {/* Corner radius */}
      <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
        Bordes ({tweaks.radius}px)
      </div>
      <input type="range" min="6" max="24" step="2" value={tweaks.radius}
        onChange={e => setTweaks({ ...tweaks, radius: parseInt(e.target.value) })}
        style={{ width: '100%', marginBottom: 14, accentColor: 'var(--accent)' }}/>

      <button onClick={onReset} style={{
        width: '100%', padding: 10, borderRadius: 10, border: '1px solid #eee',
        background: '#fafafa', color: '#e0332a', cursor: 'pointer',
        fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
      }}>↺ Reiniciar datos demo</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "orange",
  "theme": "light",
  "density": "cozy",
  "radius": 16
}/*EDITMODE-END*/;

function App() {
  const [data, setDataState] = useSa(() => loadData());
  const [syncStatus, setSyncStatus] = useSa('idle'); // idle | syncing | synced | offline
  const setData = (d) => {
    setDataState(d);
    saveData(d);
    setSyncStatus('syncing');
    pushRemoteDebounced(d, (ok) => setSyncStatus(ok ? 'synced' : 'offline'));
  };

  // Initial remote pull: if server has valid data, replace local
  useEa(() => {
    fetchRemote().then(remote => {
      const isValid = remote && remote.data && Array.isArray(remote.data.programs) && remote.data.programs.length > 0;
      if (isValid) {
        setDataState(remote.data);
        saveData(remote.data);
        setSyncStatus('synced');
      } else {
        // No valid remote yet: push local (seed or cache) to establish it
        pushRemote(data).then(ok => setSyncStatus(ok ? 'synced' : 'offline'));
      }
    }).catch(() => setSyncStatus('offline'));
    // eslint-disable-next-line
  }, []);

  const [tab, setTab] = useSa(() => localStorage.getItem('wa_tab') || 'week');
  useEa(() => localStorage.setItem('wa_tab', tab), [tab]);

  const [workoutDay, setWorkoutDay] = useSa(null);
  const [editingDay, setEditingDay] = useSa(null);
  const [editingProgram, setEditingProgram] = useSa(null);
  const [timerSeconds, setTimerSeconds] = useSa(null);
  const [moreView, setMoreView] = useSa('progress'); // progress | programs

  // Tweaks
  const [tweaks, setTweaksState] = useSa(() => {
    try {
      const saved = localStorage.getItem('wa_tweaks');
      if (saved) return { ...TWEAK_DEFAULTS, ...JSON.parse(saved) };
    } catch (e) {}
    return TWEAK_DEFAULTS;
  });
  const setTweaks = (t) => {
    setTweaksState(t);
    localStorage.setItem('wa_tweaks', JSON.stringify(t));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: t }, '*');
  };
  const [tweaksOpen, setTweaksOpen] = useSa(false);

  useEa(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Apply CSS variables based on tweaks
  const cssVars = (() => {
    const accent = ACCENT_OPTIONS.find(a => a.id === tweaks.accent)?.color || '#FF4D2E';
    const dark = tweaks.theme === 'dark';
    // Tint by parsing hex
    const hex = accent.replace('#','');
    const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    const tint = dark ? `rgba(${r},${g},${b},0.15)` : `rgba(${r},${g},${b},0.1)`;
    const shadow = `rgba(${r},${g},${b},0.45)`;
    return {
      '--accent': accent,
      '--accent-tint': tint,
      '--accent-shadow': shadow,
      '--bg0': dark ? '#0a0a0a' : '#fff',
      '--bg1': dark ? '#161616' : '#fff',
      '--bg2': dark ? '#242424' : '#F4F4F3',
      '--fg': dark ? '#fff' : '#0a0a0a',
      '--fg-dim': dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)',
      '--border': dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
      '--radius': tweaks.radius + 'px',
      '--pad': tweaks.density === 'compact' ? '10px' : '14px',
    };
  })();

  const resetData = () => {
    if (confirm('¿Reiniciar datos demo? Se perderá tu progreso.')) {
      localStorage.removeItem('workout_app_v3');
      setDataState(loadData());
    }
  };

  return (
    <>
      <div style={{
        minHeight: '100vh',
        ...cssVars,
        background: cssVars['--bg0'],
        color: cssVars['--fg'],
        fontFamily: "Inter, -apple-system, system-ui, sans-serif",
        WebkitFontSmoothing: 'antialiased',
      }}>
        <div style={{
          maxWidth: 560, margin: '0 auto',
          minHeight: '100vh', position: 'relative',
          paddingBottom: 'calc(90px + env(safe-area-inset-bottom))',
          paddingTop: 'env(safe-area-inset-top)',
        }}>
          {workoutDay !== null ? (
            <WorkoutScreen
              data={data}
              setData={setData}
              dayIdx={workoutDay}
              onBack={() => setWorkoutDay(null)}
              openTimer={(s) => setTimerSeconds(s)}
            />
          ) : (
            <>
              {tab === 'week' && <WeekScreen data={data} setData={setData} goToWorkout={setWorkoutDay} editDay={setEditingDay} goToPrograms={() => { setTab('more'); setMoreView('programs'); }}/>}
              {tab === 'extras' && <ExtrasScreen data={data} setData={setData} />}
              {tab === 'diet' && <DietScreen data={data} setData={setData} />}
              {tab === 'peptides' && <PeptidesScreen data={data} setData={setData} />}
              {tab === 'more' && (
                <MoreScreen view={moreView} setView={setMoreView} data={data} setData={setData} openEditProgram={setEditingProgram}/>
              )}
            </>
          )}

          {editingDay !== null && (
            <EditDaySheet
              data={data} setData={setData}
              dayIdx={editingDay}
              onClose={() => setEditingDay(null)}
            />
          )}

          {editingProgram !== null && (
            <EditProgramSheet
              data={data} setData={setData}
              programId={editingProgram}
              onClose={() => setEditingProgram(null)}
            />
          )}
        </div>

        {workoutDay === null && <TabBar tab={tab} setTab={setTab} />}

        {timerSeconds !== null && (
          <RestTimer
            seconds={timerSeconds}
            defaultSeconds={data.settings.restSeconds}
            onClose={() => setTimerSeconds(null)}
          />
        )}

        <SyncIndicator status={syncStatus} />
      </div>

      {tweaksOpen && (
        <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} onReset={resetData} />
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
