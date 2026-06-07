// Main app — router, audience switcher, Tweaks panel wiring.

const { useState: useS, useEffect: useE, useRef: useR } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "arcade",
  "dark": true,
  "audience": "aluno",
  "alunoScreen": "workout",
  "adminScreen": "dashboard",
  "exLayout": "expanded",
  "density": "regular"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [bursts, setBursts] = useS([]);
  const burstId = useR(0);

  useE(() => { applyAesthetic(t.aesthetic, t.dark); }, [t.aesthetic, t.dark]);
  useE(() => { audienceCSS(t.audience); }, [t.audience]);

  const onBurst = (ev) => {
    const x = ev.clientX, y = ev.clientY;
    const id = ++burstId.current;
    setBursts(b => [...b, { id, x, y }]);
    setTimeout(() => setBursts(b => b.filter(x => x.id !== id)), 1100);
  };

  const alunoItems = [
    { id: 'workout',  label: 'Treino',     icon: I.dumbbell },
    { id: 'evolucao', label: 'Evolução',   icon: I.chart },
    { id: 'nutricao', label: 'Nutrição',   icon: I.apple },
    { id: 'perfil',   label: 'Perfil',     icon: I.user },
  ];
  const adminItems = [
    { id: 'dashboard',  label: 'Painel',      icon: I.home },
    { id: 'alunos',     label: 'Alunos',      icon: I.users },
    { id: 'builder',    label: 'Treinos',     icon: I.dumbbell },
    { id: 'medidas',    label: 'Avaliações',  icon: I.ruler },
    { id: 'feedbacks',  label: 'Feedbacks',   icon: I.bolt },
  ];

  const renderAluno = () => {
    if (t.alunoScreen === 'workout')  return <AlunoWorkout layout={t.exLayout} onBurst={onBurst} />;
    if (t.alunoScreen === 'evolucao') return <AlunoEvolucao />;
    if (t.alunoScreen === 'nutricao') return <AlunoNutricao />;
    return <AlunoPerfil />;
  };
  const renderAdmin = () => {
    if (t.adminScreen === 'dashboard') return <AdminDashboard />;
    if (t.adminScreen === 'builder')   return <AdminBuilder />;
    if (t.adminScreen === 'medidas')   return <AdminMedidas />;
    return <AdminDashboard />;
  };

  return (
    <div className="stage">
      {/* ALUNO — phone frame */}
      <div className="phone" data-screen-label="aluno">
        <div className="phone-notch" />
        <div className="phone-stat">
          <span>9:41</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>
            ALUNO · {t.aesthetic.toUpperCase()}
          </span>
          <span>●●● ■</span>
        </div>
        <div className="phone-screen" key={t.alunoScreen}>
          {renderAluno()}
        </div>
        <BottomNav items={alunoItems} active={t.alunoScreen}
          onChange={(id) => setTweak('alunoScreen', id)} />
      </div>

      {/* ADMIN — desktop frame */}
      <div className="desktop" data-screen-label="admin">
        <div className="desktop-bar">
          <div className="tl tl-r" /><div className="tl tl-y" /><div className="tl tl-g" />
          <div className="desktop-url">josilvapt.app/admin · {t.adminScreen}</div>
        </div>
        <div className="desktop-body">
          <Sidebar brand="JO SILVA · PT" items={adminItems} active={t.adminScreen}
            onChange={(id) => setTweak('adminScreen', id)} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} key={t.adminScreen}>
            {renderAdmin()}
          </div>
        </div>
      </div>

      {/* particle bursts */}
      {bursts.map(b => <Burst key={b.id} x={b.x} y={b.y} color="var(--accent)" />)}

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks" defaultPos={{ right: 16, bottom: 16 }}>
        <TweakSection label="Estética" />
        <TweakRadio label="Direção" value={t.aesthetic}
          options={[
            { value: 'arcade', label: 'Arcade' },
            { value: 'luxe',   label: 'Luxe' },
            { value: 'brutal', label: 'Brutal' },
          ]}
          onChange={v => setTweak('aesthetic', v)} />
        <TweakToggle label="Modo escuro" value={t.dark}
          onChange={v => setTweak('dark', v)} />

        <TweakSection label="Vista" />
        <TweakRadio label="Foco" value={t.audience}
          options={[
            { value: 'aluno', label: 'Aluno' },
            { value: 'admin', label: 'Admin' },
            { value: 'both',  label: 'Ambos' },
          ]}
          onChange={v => setTweak('audience', v)} />
        <TweakSelect label="Ecrã do aluno" value={t.alunoScreen}
          options={[
            { value: 'workout',  label: 'Treino de hoje' },
            { value: 'evolucao', label: 'Evolução' },
            { value: 'nutricao', label: 'Nutrição' },
            { value: 'perfil',   label: 'Perfil / Conquistas' },
          ]}
          onChange={v => setTweak('alunoScreen', v)} />
        <TweakSelect label="Ecrã do admin" value={t.adminScreen}
          options={[
            { value: 'dashboard', label: 'Painel' },
            { value: 'builder',   label: 'Construtor de treino' },
            { value: 'medidas',   label: 'Avaliação física' },
          ]}
          onChange={v => setTweak('adminScreen', v)} />

        <TweakSection label="Layout" />
        <TweakRadio label="Cards de exercício" value={t.exLayout}
          options={[
            { value: 'expanded', label: 'Expandido' },
            { value: 'compact',  label: 'Compacto' },
          ]}
          onChange={v => setTweak('exLayout', v)} />
      </TweaksPanel>
    </div>
  );
}

function audienceCSS(audience) {
  const css = document.getElementById('audience-css') || (() => {
    const s = document.createElement('style'); s.id = 'audience-css'; document.head.appendChild(s); return s;
  })();
  if (audience === 'aluno')  css.textContent = '.desktop{display:none}.stage{justify-content:center}';
  else if (audience === 'admin') css.textContent = '.phone{display:none}.stage{justify-content:center}';
  else css.textContent = '';
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
