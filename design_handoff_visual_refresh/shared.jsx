// Shared building blocks. Keep them aesthetic-agnostic — let CSS vars drive look.

const { useState, useEffect, useRef, useMemo } = React;

// ── Animated number that counts up from 0 to target on mount ─────
function CountUp({ to, dur = 900, suffix = '', prefix = '', decimals = 0, className, style }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, dur]);
  const v = decimals ? n.toFixed(decimals) : Math.round(n);
  return <span className={className} style={style}>{prefix}{v}{suffix}</span>;
}

// ── Progress ring SVG ───────────────────────────────────────────
function Ring({ value = 0, max = 100, size = 96, stroke = 8, color, track, label, sub, glow = true, delay = 0 }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  const [offset, setOffset] = useState(C);
  useEffect(() => {
    const t = setTimeout(() => setOffset(C * (1 - pct)), 80 + delay);
    return () => clearTimeout(t);
  }, [C, pct, delay]);
  const c = color || 'var(--accent)';
  const tk = track || 'var(--bg4)';
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
        {glow && (
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke} opacity={0.14} />
        )}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={tk} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,.61,.36,1)' }} />
      </svg>
      {(label || sub) && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        }}>
          {label && <div style={{
            fontFamily: 'var(--font-display)', fontSize: size * 0.28, lineHeight: 1,
            color: c, fontWeight: 700, letterSpacing: 'var(--letter)',
          }}>{label}</div>}
          {sub && <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, marginTop: 4,
            color: 'var(--muted)', letterSpacing: '.12em', textTransform: 'uppercase',
          }}>{sub}</div>}
        </div>
      )}
    </div>
  );
}

// ── XP bar with shimmer ─────────────────────────────────────────
function XPBar({ value, max, height = 8, color }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{
      position: 'relative', width: '100%', height,
      background: 'var(--bg4)', borderRadius: 999, overflow: 'hidden',
    }}>
      <div style={{
        height: '100%', width: pct + '%',
        background: color || 'var(--accent)',
        borderRadius: 999, transition: 'width 1.4s cubic-bezier(.22,.61,.36,1)',
        boxShadow: '0 0 12px var(--accent)',
      }} />
    </div>
  );
}

// ── Confetti / particle burst — anchored at a point ─────────────
function Burst({ x, y, color, count = 18 }) {
  const c = color || 'var(--accent)';
  const parts = useMemo(() => Array.from({ length: count }, (_, i) => {
    const ang = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = 60 + Math.random() * 70;
    return { dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist, s: 4 + Math.random() * 5, r: Math.random() * 360 };
  }), [count]);
  return (
    <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 9999 }}>
      {parts.map((p, i) => (
        <span key={i} style={{
          position: 'absolute', width: p.s, height: p.s, background: c,
          left: 0, top: 0, borderRadius: 2,
          animation: `burst-${i} .9s ease-out forwards`,
        }} />
      ))}
      <style>{parts.map((p, i) => `
        @keyframes burst-${i} {
          0%{transform:translate(-50%,-50%) rotate(0deg);opacity:1}
          100%{transform:translate(calc(-50% + ${p.dx}px), calc(-50% + ${p.dy}px)) rotate(${p.r}deg);opacity:0}
        }`).join('\n')}</style>
    </div>
  );
}

// ── Stagger reveal — wraps children, applies cascading fade-up ──
function Stagger({ children, delay = 0, step = 60, style }) {
  const arr = React.Children.toArray(children);
  return (
    <>{arr.map((c, i) => (
      <div key={i} style={{ animation: `fadeUp .5s var(--motion) ${delay + i * step}ms both`, ...style }}>
        {c}
      </div>
    ))}</>
  );
}

// ── Avatar — initials, gradient, dataset-driven hue ─────────────
function Avatar({ name = 'JS', size = 40, hue = 30 }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, oklch(.72 .14 ${hue}), oklch(.55 .12 ${hue + 30}))`,
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontSize: size * 0.4, fontWeight: 700,
      letterSpacing: '.04em', flexShrink: 0,
    }}>{initials}</div>
  );
}

// ── Bottom nav (mobile) ─────────────────────────────────────────
function BottomNav({ items, active, onChange }) {
  return (
    <div className="bnav">
      {items.map((it) => (
        <button key={it.id} className={'bnav-item' + (active === it.id ? ' active' : '')}
          onClick={() => onChange(it.id)}>
          <div className="bnav-icon">{it.icon}</div>
          <div className="bnav-lbl">{it.label}</div>
        </button>
      ))}
    </div>
  );
}

// ── Sidebar (desktop admin) ─────────────────────────────────────
function Sidebar({ items, active, onChange, brand }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">{brand}</div>
      <nav className="sidebar-nav">
        {items.map(it => (
          <button key={it.id} className={'side-item' + (active === it.id ? ' active' : '')}
            onClick={() => onChange(it.id)}>
            <span className="side-ico">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="side-foot-row">
          <Avatar name="Jo Silva" size={32} hue={45} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Jo Silva</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>personal · pro</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Inline icons (stroke style — works across aesthetics) ──────
const I = {
  dumbbell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9v6M21 9v6M6 6v12M18 6v12M6 12h12"/></svg>,
  chart:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3v18h18M7 14l4-4 3 3 5-6"/></svg>,
  apple:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 8c-2-2-7 0-7 5s5 8 7 8 2-1 0 0c-2 1-2 0 0 0s7-3 7-8-5-7-7-5zm0-3c0-1 1-3 3-3"/></svg>,
  user:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>,
  home:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></svg>,
  users:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><circle cx="17" cy="6" r="2.5"/><path d="M22 17c0-3-2-5-5-5"/></svg>,
  ruler:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8h18v8H3z"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/></svg>,
  flame:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3c0 5-6 5-6 11a6 6 0 0 0 12 0c0-3-2-4-2-7-1 2-2 2-2 0s-2-2-2-4z"/></svg>,
  plus:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  minus:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>,
  check:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 12l5 5L20 6"/></svg>,
  bolt:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>,
  trophy:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v3a3 3 0 0 1-3 3M7 5H4v3a3 3 0 0 0 3 3M9 17h6v3H9zM12 13v4"/></svg>,
  arrow:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  back:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>,
  cog:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>,
  egg:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3c-4 0-7 6-7 11a7 7 0 0 0 14 0c0-5-3-11-7-11z"/></svg>,
  drop:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3c-3 5-7 8-7 12a7 7 0 0 0 14 0c0-4-4-7-7-12z"/></svg>,
};

Object.assign(window, { CountUp, Ring, XPBar, Burst, Stagger, Avatar, BottomNav, Sidebar, I });
