// Aluno screens — workout, evolution, nutrition, profile.

const { useState, useEffect, useRef } = React;

// ── WORKOUT ─────────────────────────────────────────────────────
function AlunoWorkout({ layout, onBurst }) {
  const [treinoIx, setTreinoIx] = useState(0);
  const t = DATA.treinos[treinoIx];
  const [cargas, setCargas] = useState({});
  const [doneSet, setDoneSet] = useState({}); // {exId: Set of done set indices}
  const [registered, setRegistered] = useState(false);

  useEffect(() => { setCargas({}); setDoneSet({}); setRegistered(false); }, [treinoIx]);

  const totalSets = t.ex.reduce((s, e) => s + e.series, 0);
  const doneCount = Object.values(doneSet).reduce((s, x) => s + (x?.size || 0), 0);
  const pct = Math.round((doneCount / totalSets) * 100);

  const bumpCarga = (id, last, delta) => {
    setCargas(c => ({ ...c, [id]: Math.max(0, (c[id] ?? last) + delta) }));
  };
  const toggleSet = (exId, i, evt) => {
    setDoneSet(d => {
      const cur = new Set(d[exId] || []);
      cur.has(i) ? cur.delete(i) : cur.add(i);
      return { ...d, [exId]: cur };
    });
    if (evt && onBurst) onBurst(evt);
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <div className="kicker">OLÁ, MARIANA</div>
          <h1 className="hero-h">Hoje é dia <span style={{ color: 'var(--accent)' }}>{t.id}</span>.</h1>
          <div className="hero-sub">{t.dia.toLowerCase()} · {t.nome}</div>
        </div>
        <div className="hero-stats">
          <div className="streak">
            <div className="streak-num">{DATA.aluno.streak}</div>
            <div className="streak-lbl">streak<br/>dias</div>
          </div>
          <Ring value={DATA.aluno.xp} max={DATA.aluno.xpMax} size={68} stroke={6}
                color="var(--accent)" sub="XP"
                label={'L' + DATA.aluno.nivel} />
        </div>
      </header>

      <div className="ttab-row">
        {DATA.treinos.map((tr, i) => (
          <button key={tr.id} className={'ttab' + (i === treinoIx ? ' active' : '')}
            onClick={() => setTreinoIx(i)}>
            <span className="ttab-l">{tr.id}</span>
            <span className="ttab-n">{tr.dia.slice(0,3)}</span>
          </button>
        ))}
      </div>

      <div className="prog-strip">
        <div className="prog-strip-lbl">
          <span>Progresso da sessão</span>
          <span><b>{doneCount}</b> / {totalSets} séries · {pct}%</span>
        </div>
        <XPBar value={doneCount} max={totalSets} height={6} />
      </div>

      <div className="ex-list" data-layout={layout}>
        <Stagger step={70}>
          {t.ex.map((e, ix) => {
            const c = cargas[e.id] ?? e.last;
            const delta = c - e.last;
            const done = doneSet[e.id]?.size || 0;
            const complete = done >= e.series;
            return (
              <div key={e.id} className={'ex-card' + (complete ? ' done' : '')}>
                <div className="ex-top">
                  <div className="ex-num">{String(ix+1).padStart(2,'0')}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ex-nome">{e.nome}</div>
                    <div className="ex-meta">
                      <span>{e.series} séries</span>
                      <span className="dot">·</span>
                      <span>{e.reps} reps</span>
                      {e.obs && (<><span className="dot">·</span><span className="ex-obs">{e.obs}</span></>)}
                    </div>
                  </div>
                  {complete && <div className="ex-trophy">★</div>}
                </div>

                <div className="ex-bottom">
                  <div className="carga-block">
                    <button className="carga-btn" onClick={() => bumpCarga(e.id, e.last, -2.5)}>−</button>
                    <div className="carga-stack">
                      <div className="carga-val">{c}<span className="carga-kg">kg</span></div>
                      {delta !== 0 && <div className={'carga-delta ' + (delta > 0 ? 'up' : 'dn')}>
                        {delta > 0 ? '↑' : '↓'} {Math.abs(delta)} vs anterior
                      </div>}
                      {delta === 0 && <div className="carga-delta neutral">manter carga anterior</div>}
                    </div>
                    <button className="carga-btn" onClick={() => bumpCarga(e.id, e.last, 2.5)}>+</button>
                  </div>

                  <div className="sets-row">
                    {Array.from({ length: e.series }).map((_, i) => {
                      const on = doneSet[e.id]?.has(i);
                      return (
                        <button key={i} className={'set-pip' + (on ? ' on' : '')}
                          onClick={(ev) => toggleSet(e.id, i, ev)}>
                          {on ? '✓' : i+1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </Stagger>

        <button className={'btn-register' + (pct === 100 ? ' ready' : '')}
          disabled={doneCount === 0}
          onClick={(ev) => { setRegistered(true); if (onBurst) onBurst(ev); }}>
          {registered ? '✓ SESSÃO REGISTADA' : (pct === 100 ? 'REGISTAR SESSÃO COMPLETA' : `REGISTAR (${pct}%)`)}
        </button>

        {registered && (
          <div className="reward">
            <div className="reward-row"><span>+ XP ganho</span><b>+{Math.round(pct * 1.2)}</b></div>
            <div className="reward-row"><span>streak mantida</span><b>🔥 {DATA.aluno.streak + 1}</b></div>
            <div className="reward-row"><span>próximo badge</span><b>{DATA.aluno.proxBadge}</b></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── EVOLUTION ───────────────────────────────────────────────────
function MiniLine({ data, height = 80, color }) {
  const w = 280, pad = 10;
  const min = Math.min(...data), max = Math.max(...data);
  const xs = data.map((_, i) => pad + i * ((w - pad*2) / (data.length - 1)));
  const ys = data.map(v => pad + (1 - (v - min) / (max - min || 1)) * (height - pad*2));
  const d = xs.map((x, i) => (i ? 'L' : 'M') + x + ' ' + ys[i]).join(' ');
  const area = d + ` L${xs[xs.length-1]} ${height} L${pad} ${height} Z`;
  const c = color || 'var(--accent)';
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={'lg-'+(color||'a')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity=".35"/>
          <stop offset="100%" stopColor={c} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#lg-${color||'a'})`} />
      <path d={d} fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        style={{ strokeDasharray: 1000, strokeDashoffset: 0, animation: 'dash 1.6s var(--motion) both' }} />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={i === xs.length-1 ? 3.5 : 2} fill={c}
          style={{ opacity: i === xs.length-1 ? 1 : .5 }} />
      ))}
    </svg>
  );
}

function AlunoEvolucao() {
  const [exNome, setExNome] = useState('Supino reto barra');
  const hist = DATA.evolucao.cargaHist[exNome];
  const last = hist[hist.length - 1], first = hist[0];
  const gain = last - first;

  return (
    <div className="page">
      <header className="hero">
        <div>
          <div className="kicker">A TUA EVOLUÇÃO</div>
          <h1 className="hero-h">3 meses, <span style={{ color: 'var(--accent)' }}>−2.9kg</span>.<br/>+ 22% de força.</h1>
        </div>
      </header>

      <div className="stats-grid">
        <Stagger step={80}>
          {[
            ['SESSÕES', DATA.aluno.sessoesTotais, ''],
            ['SEMANAS', DATA.aluno.semanasAtivas, ''],
            ['NÍVEL',   DATA.aluno.nivel, ''],
            ['STREAK',  DATA.aluno.streak, 'd'],
          ].map(([l, v, s], i) => (
            <div key={i} className="stat-tile">
              <CountUp to={v} className="stat-v" suffix={s} />
              <div className="stat-l">{l}</div>
            </div>
          ))}
        </Stagger>
      </div>

      <section className="card">
        <div className="card-h">
          <span className="card-t">Carga · {exNome}</span>
          <select className="sel" value={exNome} onChange={e => setExNome(e.target.value)}>
            {Object.keys(DATA.evolucao.cargaHist).map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div className="big-num">
          <CountUp to={last} className="big-num-v" suffix="kg" />
          <span className="big-num-d up">+{gain.toFixed(1)} kg desde o início</span>
        </div>
        <MiniLine data={hist} height={120} />
      </section>

      <section className="card">
        <div className="card-h">
          <span className="card-t">Peso corporal</span>
          <span className="card-sub">12 semanas</span>
        </div>
        <div className="big-num">
          <CountUp to={69.1} decimals={1} className="big-num-v" suffix="kg" />
          <span className="big-num-d up">−3.3 kg total</span>
        </div>
        <MiniLine data={DATA.evolucao.pesoHist} height={120} color="var(--accent-2)" />
      </section>

      <section className="card">
        <div className="card-h"><span className="card-t">Medidas chave</span></div>
        <div className="medidas">
          {Object.entries(DATA.evolucao.medidas).map(([k, arr]) => {
            const d = arr[arr.length-1] - arr[0];
            return (
              <div key={k} className="med-row">
                <div className="med-l">
                  <div className="med-n">{k}</div>
                  <div className={'med-d ' + (d > 0 ? 'up' : 'dn')}>{d > 0 ? '+' : ''}{d.toFixed(1)} cm</div>
                </div>
                <div className="med-v">
                  <CountUp to={arr[arr.length-1]} decimals={1} suffix=" cm" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ── NUTRITION ───────────────────────────────────────────────────
function AlunoNutricao() {
  const m = DATA.macros;
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="page">
      <header className="hero">
        <div>
          <div className="kicker">NUTRIÇÃO · HOJE</div>
          <h1 className="hero-h"><span style={{ color: 'var(--accent)' }}>{m.kcal}</span> de {m.kcalAlvo} kcal</h1>
          <div className="hero-sub">faltam {Math.max(0, m.kcalAlvo - m.kcal)} kcal · 1 refeição</div>
        </div>
        <Ring value={m.kcal} max={m.kcalAlvo} size={84} stroke={8} label="102%" sub="meta" />
      </header>

      <div className="macros">
        <Stagger step={70}>
          {[
            ['Proteína',   m.p, m.pAlvo, 'g', 'var(--accent)'],
            ['Carboidrato', m.c, m.cAlvo, 'g', 'var(--accent-2)'],
            ['Gordura',    m.g, m.gAlvo, 'g', 'var(--accent-3)'],
          ].map(([k, v, max, u, c], i) => (
            <div key={i} className="macro-tile">
              <div className="macro-row">
                <span className="macro-k">{k}</span>
                <span className="macro-v"><CountUp to={v} />/{max}{u}</span>
              </div>
              <XPBar value={v} max={max} height={6} color={c} />
            </div>
          ))}
        </Stagger>
      </div>

      <div className="meal-list">
        <div className="meal-h"><span>Refeições</span><button className="add-btn">+ Adicionar</button></div>
        {DATA.refeicoes.map((r, i) => (
          <div key={i} className={'meal-card' + (expanded === i ? ' open' : '')}
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <div className="meal-top">
              <div className="meal-time">{r.hora}</div>
              <div className="meal-mid">
                <div className="meal-name">{r.nome}</div>
                <div className="meal-macro">P {r.p} · C {r.c} · G {r.g}</div>
              </div>
              <div className="meal-kcal"><CountUp to={r.kcal} /><span>kcal</span></div>
            </div>
            {expanded === i && (
              <ul className="meal-items">
                {r.items.map((it, j) => <li key={j}>• {it}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROFILE / ORIENTAÇÕES ───────────────────────────────────────
function AlunoPerfil() {
  return (
    <div className="page">
      <header className="hero">
        <div>
          <div className="kicker">O TEU PERFIL</div>
          <h1 className="hero-h">{DATA.aluno.nome}</h1>
          <div className="hero-sub">Nível {DATA.aluno.nivel} · Hipertrofia · plano mensal</div>
        </div>
        <Avatar name={DATA.aluno.nome} size={64} hue={30} />
      </header>

      <div className="card xp-card">
        <div className="card-h">
          <span className="card-t">Progresso de Nível</span>
          <span className="card-sub">{DATA.aluno.xp} / {DATA.aluno.xpMax} XP</span>
        </div>
        <XPBar value={DATA.aluno.xp} max={DATA.aluno.xpMax} height={10} />
        <div className="xp-row"><span>próximo nível em</span><b>{DATA.aluno.xpMax - DATA.aluno.xp} XP</b></div>
      </div>

      <div className="badges">
        <div className="card-t" style={{ marginBottom: 12 }}>Conquistas</div>
        <div className="badge-grid">
          {[
            ['🔥', 'Streak 14d', true],
            ['🏆', 'PR Supino', true],
            ['💪', '50 sessões', true],
            ['⚡', 'Sem falhas/mês', true],
            ['🥇', '100 sessões', false],
            ['📈', '+10% força', false],
          ].map(([ico, lbl, on], i) => (
            <div key={i} className={'badge' + (on ? ' on' : '')}>
              <div className="badge-ico">{ico}</div>
              <div className="badge-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-t" style={{ marginBottom: 14 }}>Personal Trainer</div>
        <div className="pt-row">
          <Avatar name="Jo Silva" size={56} hue={45} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 'var(--letter)' }}>JO SILVA</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>certified · cpt</div>
          </div>
        </div>
        <div className="pt-btns">
          <button className="btn-ghost">whatsapp</button>
          <button className="btn-ghost">email</button>
          <button className="btn-ghost">marcar revisão</button>
        </div>
      </div>

      <div className="card">
        <div className="card-t" style={{ marginBottom: 10 }}>Orientações da semana</div>
        <div className="orient">
          <div className="o-bullet">01</div>
          <div><b>Hidratação:</b> 3 L de água por dia, 500ml pré-treino.</div>
        </div>
        <div className="orient">
          <div className="o-bullet">02</div>
          <div><b>Sono:</b> mínimo 7 h. Evita ecrãs 30 min antes.</div>
        </div>
        <div className="orient">
          <div className="o-bullet">03</div>
          <div><b>Proteína:</b> 1.8 g/kg de peso corporal · dividida em 4 refeições.</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AlunoWorkout, AlunoEvolucao, AlunoNutricao, AlunoPerfil });
