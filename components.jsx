// components.jsx — shared UI
const { useState, useEffect, useRef } = React;

// ─── Icons ──────────────────────────────────────────────
const Icon = {
  plus: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  minus: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/></svg>,
  check: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>,
  chev: (s=20, dir='r') => {
    const rot = dir === 'l' ? 180 : dir === 'd' ? 90 : dir === 'u' ? -90 : 0;
    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transform:`rotate(${rot}deg)`}}><path d="M9 6l6 6-6 6"/></svg>;
  },
  calendar: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>,
  chart: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18M6 16v-4M11 16V8M16 16v-7M21 16v-3"/></svg>,
  dumbbell: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6v12M3 9v6M18 6v12M21 9v6M6 12h12"/></svg>,
  settings: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  play: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  pause: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>,
  pencil: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>,
  trash: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>,
  flame: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s-4 5-4 9a4 4 0 008 0c0-1.5-.7-3-1.5-4.5.5 1 .5 2 .5 3a2 2 0 01-2 2c-.5 0-1-.3-1-1 0-2 2-4 2-6 0-1-1-2-2-2z"/></svg>,
  trophy: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a6 6 0 0012 0V3H6v6zM6 5H3v3a3 3 0 003 3M18 5h3v3a3 3 0 01-3 3M12 15v4M8 21h8"/></svg>,
  yt: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 00-1.75-1.77C18.25 5 12 5 12 5s-6.25 0-7.85.43A2.5 2.5 0 002.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 001.75 1.77C5.75 19 12 19 12 19s6.25 0 7.85-.43a2.5 2.5 0 001.75-1.77C22 15.2 22 12 22 12s0-3.2-.4-4.8zM10 15V9l5.2 3-5.2 3z"/></svg>,
  close: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  link: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  drag: (s=18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>,
  sparkle: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/></svg>,
  apple: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6c0-2 2-4 4-4-0.3 2-2 4-4 4zM7 21c-2 0-4-3-4-8s2-7 4-7c1 0 2 1 3 1s2-1 3-1c2 0 4 2 4 7s-2 8-4 8c-1 0-2-1-3-1s-2 1-3 1z"/></svg>,
  pill: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="8" width="20" height="8" rx="4" transform="rotate(-45 12 12)"/><path d="M8.5 8.5l7 7"/></svg>,
  program: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>,
  more: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>,
  scale: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M7 10c1.5-1 3.5-1 5 0M12 10c1.5-1 3.5-1 5 0M12 14v2"/></svg>,
};

// ─── Primary button ─────────────────────────────────────
function BigButton({ children, onClick, variant = 'primary', icon, disabled, style = {} }) {
  const variants = {
    primary: { bg: 'var(--accent)', fg: '#fff' },
    secondary: { bg: 'var(--bg2)', fg: 'var(--fg)' },
    ghost: { bg: 'transparent', fg: 'var(--fg)' },
    danger: { bg: 'var(--bg2)', fg: '#e0332a' },
  };
  const v = variants[variant];
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{
      appearance: 'none', border: 'none', outline: 'none',
      background: v.bg, color: v.fg,
      padding: '16px 20px', borderRadius: 16,
      fontSize: 17, fontWeight: 600, fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'transform 0.1s, opacity 0.15s',
      width: '100%', boxSizing: 'border-box',
      ...style,
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {icon}
      {children}
    </button>
  );
}

// ─── Stepper input (for reps/weight) ────────────────────
function Stepper({ value, onChange, step = 1, min = 0, suffix }) {
  const dec = () => onChange(Math.max(min, (value || 0) - step));
  const inc = () => onChange((value || 0) + step);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0,
      background: 'var(--bg2)', borderRadius: 14, padding: 4,
      height: 56,
    }}>
      <button onClick={dec} style={{
        width: 48, height: 48, borderRadius: 10, border: 'none',
        background: 'var(--bg1)', color: 'var(--fg)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{Icon.minus(18)}</button>
      <div style={{
        flex: 1, textAlign: 'center', fontSize: 22, fontWeight: 700,
        fontVariantNumeric: 'tabular-nums', color: 'var(--fg)',
      }}>
        <input
          type="number"
          value={value || ''}
          onChange={e => onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
          style={{
            width: '100%', textAlign: 'center', border: 'none', outline: 'none',
            background: 'transparent', fontSize: 22, fontWeight: 700, color: 'inherit',
            fontVariantNumeric: 'tabular-nums', fontFamily: 'inherit',
            MozAppearance: 'textfield', appearance: 'textfield',
          }}
        />
        {suffix && <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-dim)', marginLeft: 2 }}>{suffix}</span>}
      </div>
      <button onClick={inc} style={{
        width: 48, height: 48, borderRadius: 10, border: 'none',
        background: 'var(--bg1)', color: 'var(--fg)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{Icon.plus(18)}</button>
    </div>
  );
}

// ─── Bottom sheet ────────────────────────────────────────
function Sheet({ open, onClose, title, children, fullHeight }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) setTimeout(() => setVisible(true), 10);
    else setVisible(false);
  }, [open]);
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        opacity: visible ? 1 : 0, transition: 'opacity 0.25s',
      }} />
      <div style={{
        position: 'relative',
        background: 'var(--bg1)',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        maxHeight: fullHeight ? '92%' : '80%',
        minHeight: fullHeight ? '92%' : undefined,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px 12px', flexShrink: 0,
        }}>
          <div style={{ width: 40 }} />
          <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 16, border: 'none',
            background: 'var(--bg2)', color: 'var(--fg)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.close(18)}</button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 32px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Tab bar ─────────────────────────────────────────────
function TabBar({ tab, setTab }) {
  const tabs = [
    { id: 'week', label: 'Semana', icon: Icon.calendar(22) },
    { id: 'extras', label: 'Cardio', icon: Icon.flame(22) },
    { id: 'diet', label: 'Dieta', icon: Icon.apple(22) },
    { id: 'peptides', label: 'Péptidos', icon: Icon.pill(22) },
    { id: 'more', label: 'Más', icon: Icon.more(22) },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg1)',
      borderTop: '1px solid var(--border)',
      paddingTop: 8, paddingBottom: 28,
      display: 'flex', justifyContent: 'space-around',
      zIndex: 10,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          border: 'none', background: 'transparent',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          color: tab === t.id ? 'var(--accent)' : 'var(--fg-dim)',
          cursor: 'pointer', padding: '6px 6px', flex: 1,
          transition: 'color 0.15s',
          fontFamily: 'inherit',
        }}>
          {t.icon}
          <span style={{ fontSize: 10, fontWeight: 600 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Status bar (minimal, phone-style) ──────────────────
function StatusBar() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 28px 8px', fontSize: 15, fontWeight: 600,
      color: 'var(--fg)',
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="5" y="5" width="3" height="6" rx="0.5"/><rect x="10" y="2" width="3" height="9" rx="0.5"/><rect x="15" y="0" width="3" height="11" rx="0.5"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M8 2C10 2 12 3 13.5 4.5l1-1C12.5 1.5 10.3 0.5 8 0.5S3.5 1.5 1.5 3.5l1 1C4 3 6 2 8 2zM8 5c1.2 0 2.3 0.5 3 1.3l1-1C10.8 4.2 9.5 3.5 8 3.5S5.2 4.2 4 5.3l1 1c0.7-0.8 1.8-1.3 3-1.3zM8 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/></svg>
        <svg width="25" height="11" viewBox="0 0 25 11"><rect x="0.5" y="0.5" width="21" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.5" fill="none"/><rect x="2" y="2" width="18" height="7" rx="1.5" fill="currentColor"/><path d="M23 4v3c0.6-0.2 1-0.8 1-1.5S23.6 4.2 23 4z" fill="currentColor" opacity="0.4"/></svg>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, BigButton, Stepper, Sheet, TabBar, StatusBar });
