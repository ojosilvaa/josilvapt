// Aesthetic system — 3 divergent directions × light/dark.
// All variables flow through CSS custom properties on document.documentElement.

const AESTHETICS = {
  arcade: {
    name: 'ARCADE',
    blurb: 'Gamified. Loud. Number-go-up.',
    fontDisplay: '"Bricolage Grotesque", "Space Grotesk", sans-serif',
    fontBody: '"Space Grotesk", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, monospace',
    radius: '14px',
    radiusSm: '10px',
    radiusLg: '22px',
    borderW: '1.5px',
    letter: '0em',
    btnLetter: '0.04em',
    motion: 'cubic-bezier(.2,.9,.2,1.2)',
    motionDur: '.35s',
    accent: '#ADFF4A',     // electric lime
    accent2: '#FF3D8B',    // hot magenta
    accent3: '#4ED9FF',    // electric cyan
    danger: '#FF5C5C',
    light: {
      bg: '#F3F4F6',
      bg2: '#FFFFFF',
      bg3: '#E9EBEF',
      bg4: '#DFE2E8',
      text: '#0B0E14',
      textSub: '#5A6275',
      muted: '#9099AC',
      border: '#D8DCE5',
      shade: 'rgba(11,14,20,.08)',
      onAccent: '#0B0E14',
    },
    dark: {
      bg: '#0A0D12',
      bg2: '#11151D',
      bg3: '#161B25',
      bg4: '#1E2530',
      text: '#F2F4F8',
      textSub: '#A8B0C2',
      muted: '#5A6275',
      border: '#1F2733',
      shade: 'rgba(255,255,255,.06)',
      onAccent: '#0A0D12',
    },
  },

  luxe: {
    name: 'SOFT LUXE',
    blurb: 'Editorial. Calm. Considered.',
    fontDisplay: '"Cormorant Garamond", "Tenor Sans", Georgia, serif',
    fontBody: '"Tenor Sans", "Inter", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, monospace',
    radius: '4px',
    radiusSm: '2px',
    radiusLg: '8px',
    borderW: '1px',
    letter: '0.02em',
    btnLetter: '0.22em',
    motion: 'cubic-bezier(.22,.61,.36,1)',
    motionDur: '.55s',
    accent: '#B08D5C',     // brushed bronze
    accent2: '#7A6A52',    // taupe
    accent3: '#3A3128',    // espresso
    danger: '#C44A3F',
    light: {
      bg: '#F4EFE6',
      bg2: '#FBF8F1',
      bg3: '#EDE6D8',
      bg4: '#E2DAC8',
      text: '#2A221A',
      textSub: '#6B5F4F',
      muted: '#A39684',
      border: '#D9CFBC',
      shade: 'rgba(42,34,26,.06)',
      onAccent: '#FBF8F1',
    },
    dark: {
      bg: '#1A1612',
      bg2: '#221D18',
      bg3: '#2A241E',
      bg4: '#332C24',
      text: '#F1E9DA',
      textSub: '#BFB39E',
      muted: '#7A6E5C',
      border: '#3A3128',
      shade: 'rgba(241,233,218,.04)',
      onAccent: '#1A1612',
    },
  },

  brutal: {
    name: 'BRUTALIST',
    blurb: 'Raw print. Grid. Hard edges.',
    fontDisplay: '"Archivo Black", "Anton", Impact, sans-serif',
    fontBody: '"IBM Plex Mono", "PT Mono", ui-monospace, monospace',
    fontMono: '"IBM Plex Mono", ui-monospace, monospace',
    radius: '0px',
    radiusSm: '0px',
    radiusLg: '0px',
    borderW: '2px',
    letter: '0.01em',
    btnLetter: '0.12em',
    motion: 'steps(6, end)',
    motionDur: '.25s',
    accent: '#E02A2A',     // single ink-red
    accent2: '#111111',
    accent3: '#666666',
    danger: '#E02A2A',
    light: {
      bg: '#EDEAE0',
      bg2: '#F5F2E8',
      bg3: '#E0DCD0',
      bg4: '#D2CDBE',
      text: '#0A0A0A',
      textSub: '#333333',
      muted: '#7A7A70',
      border: '#0A0A0A',
      shade: 'rgba(10,10,10,.08)',
      onAccent: '#F5F2E8',
    },
    dark: {
      bg: '#000000',
      bg2: '#0A0A0A',
      bg3: '#141414',
      bg4: '#1F1F1F',
      text: '#F5F2E8',
      textSub: '#BBBBBB',
      muted: '#666666',
      border: '#F5F2E8',
      shade: 'rgba(245,242,232,.06)',
      onAccent: '#0A0A0A',
    },
  },
};

function applyAesthetic(name, isDark) {
  const a = AESTHETICS[name];
  const p = isDark ? a.dark : a.light;
  const r = document.documentElement;
  const set = (k, v) => r.style.setProperty(k, v);
  set('--bg', p.bg);
  set('--bg2', p.bg2);
  set('--bg3', p.bg3);
  set('--bg4', p.bg4);
  set('--text', p.text);
  set('--text-sub', p.textSub);
  set('--muted', p.muted);
  set('--border', p.border);
  set('--shade', p.shade);
  set('--accent', a.accent);
  set('--accent-2', a.accent2);
  set('--accent-3', a.accent3);
  set('--on-accent', p.onAccent);
  set('--danger', a.danger);
  set('--font-display', a.fontDisplay);
  set('--font-body', a.fontBody);
  set('--font-mono', a.fontMono);
  set('--radius', a.radius);
  set('--radius-sm', a.radiusSm);
  set('--radius-lg', a.radiusLg);
  set('--border-w', a.borderW);
  set('--letter', a.letter);
  set('--btn-letter', a.btnLetter);
  set('--motion', a.motion);
  set('--motion-dur', a.motionDur);
  r.dataset.aesthetic = name;
  r.dataset.theme = isDark ? 'dark' : 'light';
}

window.AESTHETICS = AESTHETICS;
window.applyAesthetic = applyAesthetic;
