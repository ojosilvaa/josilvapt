// Admin screens — dashboard, workout builder, measurements.

const { useState: useStateA, useEffect: useEffectA } = React;

// ── DASHBOARD ───────────────────────────────────────────────────
function AdminDashboard() {
  const d = DATA.dashboard;
  const deltaSess = d.sessoesSemana - d.sessoesAnt;
  const deltaRec = ((d.receita - d.receitaAnt) / d.receitaAnt * 100);

  return (
    <div className="adm-page">
      <header className="adm-hero">
        <div>
          <div className="kicker">PAINEL · QUI 15 OUT</div>
          <h1 className="adm-h">Bom dia, <span style={{ color: 'var(--accent)' }}>Jo</span>.</h1>
          <div className="hero-sub">{d.feedbacksNovos} feedbacks novos · 4 sessões marcadas hoje</div>
        </div>
        <div className="adm-hero-cta">
          <button className="btn-primary">+ Novo aluno</button>
          <button className="btn-ghost">Gerar treino IA</button>
        </div>
      </header>

      <div className="kpi-grid">
        <Stagger step={90}>
          <div className="kpi">
            <div className="kpi-l">ATIVOS</div>
            <div className="kpi-v"><CountUp to={d.ativos} /><span className="kpi-of">/ {d.total}</span></div>
            <div className="kpi-bar"><XPBar value={d.ativos} max={d.total} height={4} color="var(--accent)" /></div>
            <div className="kpi-d">82% taxa de retenção</div>
          </div>
          <div className="kpi">
            <div className="kpi-l">SESSÕES · SEMANA</div>
            <div className="kpi-v"><CountUp to={d.sessoesSemana} /></div>
            <div className="kpi-d up">↑ {deltaSess} vs semana anterior</div>
          </div>
          <div className="kpi">
            <div className="kpi-l">RECEITA · MÊS</div>
            <div className="kpi-v">€<CountUp to={Math.round(d.receita)} /></div>
            <div className="kpi-d up">↑ {deltaRec.toFixed(1)}%</div>
          </div>
          <div className="kpi feedback-kpi">
            <div className="kpi-l">FEEDBACKS NOVOS</div>
            <div className="kpi-v"><CountUp to={d.feedbacksNovos} /></div>
            <div className="kpi-d">★ 4.8 média da semana</div>
          </div>
        </Stagger>
      </div>

      <div className="adm-cols">
        <section className="card flex-1">
          <div className="card-h"><span className="card-t">Atividade em tempo real</span><span className="live-dot">● AO VIVO</span></div>
          <div className="activity">
            <Stagger step={60}>
              {DATA.atividade.map((a, i) => (
                <div key={i} className="act-row">
                  <Avatar name={a.aluno} size={36} hue={a.hue} />
                  <div className="act-mid">
                    <div className="act-l"><b>{a.aluno}</b> {a.acao}</div>
                    <div className="act-t">{a.tempo}</div>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="card flex-1">
          <div className="card-h"><span className="card-t">Aderência por aluno</span></div>
          <div className="ader-list">
            {DATA.alunos.filter(a => a.ativo).slice(0, 6).map((a, i) => (
              <div key={i} className="ader-row">
                <Avatar name={a.nome} size={28} hue={a.hue} />
                <div className="ader-name">{a.nome.split(' ')[0]}</div>
                <div className="ader-bar"><XPBar value={a.aderencia} max={100} height={5}
                  color={a.aderencia > 80 ? 'var(--accent)' : a.aderencia > 60 ? 'var(--accent-3)' : 'var(--danger)'} />
                </div>
                <div className="ader-pct"><CountUp to={a.aderencia} suffix="%" /></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card">
        <div className="card-h">
          <span className="card-t">Alunos</span>
          <div className="adm-tabs">
            <button className="adm-tab active">Todos · {DATA.alunos.length}</button>
            <button className="adm-tab">Ativos · {DATA.alunos.filter(a => a.ativo).length}</button>
            <button className="adm-tab">Inativos · {DATA.alunos.filter(a => !a.ativo).length}</button>
          </div>
        </div>
        <div className="al-table">
          <div className="al-thead">
            <div>Aluno</div><div>Plano</div><div>Última sessão</div><div>Aderência</div><div>Estado</div>
          </div>
          {DATA.alunos.map((a, i) => (
            <div key={i} className="al-row">
              <div className="al-c1"><Avatar name={a.nome} size={32} hue={a.hue} /> <span>{a.nome}</span></div>
              <div>{a.plano}</div>
              <div>{a.ultima}</div>
              <div className="al-aderencia">
                <div className="ader-bar"><XPBar value={a.aderencia} max={100} height={4}
                  color={a.aderencia > 80 ? 'var(--accent)' : a.aderencia > 60 ? 'var(--accent-3)' : 'var(--danger)'} /></div>
                <span>{a.aderencia}%</span>
              </div>
              <div><span className={'pill ' + (a.ativo ? 'pill-on' : 'pill-off')}>{a.ativo ? '● ativo' : '○ inativo'}</span></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── WORKOUT BUILDER ─────────────────────────────────────────────
function AdminBuilder() {
  const [exs, setExs] = useStateA([
    { id: 1, nome: 'Supino reto barra', series: 4, reps: '6–8', obs: 'Tempo 2-1-2' },
    { id: 2, nome: 'Supino inclinado halteres', series: 3, reps: '8–10', obs: '' },
    { id: 3, nome: 'Crucifixo máquina', series: 3, reps: '12', obs: 'Cadência lenta' },
    { id: 4, nome: 'Tríceps polia corda', series: 4, reps: '10–12', obs: '' },
  ]);
  const [selected, setSelected] = useStateA(0);

  const BIBLIOTECA = [
    'Supino reto barra', 'Supino inclinado halteres', 'Crucifixo máquina',
    'Puxada alta', 'Remada baixa neutra', 'Pull-over polia',
    'Agachamento livre', 'Leg press 45°', 'Cadeira extensora', 'Stiff',
    'Tríceps polia corda', 'Tríceps francês', 'Rosca alternada', 'Rosca martelo',
    'Elevação lateral', 'Desenvolvimento militar', 'Panturrilha em pé',
  ];

  const addExercise = (nome) => {
    setExs(p => [...p, { id: Date.now(), nome, series: 3, reps: '10', obs: '' }]);
  };
  const remove = (id) => setExs(p => p.filter(e => e.id !== id));
  const updateField = (id, k, v) => setExs(p => p.map(e => e.id === id ? { ...e, [k]: v } : e));

  return (
    <div className="adm-page">
      <header className="adm-hero">
        <div>
          <div className="kicker">CRIAR TREINO · MARIANA COSTA</div>
          <h1 className="adm-h">Treino <span style={{ color: 'var(--accent)' }}>A</span> · Peito + Tríceps</h1>
          <div className="hero-sub">{exs.length} exercícios · {exs.reduce((s, e) => s + e.series, 0)} séries totais · ~52 min</div>
        </div>
        <div className="adm-hero-cta">
          <button className="btn-ghost">Pré-visualizar</button>
          <button className="btn-primary">Guardar treino</button>
        </div>
      </header>

      <div className="builder-grid">
        <section className="card builder-main">
          <div className="card-h">
            <span className="card-t">Exercícios</span>
            <span className="card-sub">arrasta para reordenar</span>
          </div>
          <div className="bex-list">
            {exs.map((e, i) => (
              <div key={e.id} className={'bex-card' + (selected === i ? ' sel' : '')}
                onClick={() => setSelected(i)}>
                <div className="bex-handle">⋮⋮</div>
                <div className="bex-num">{String(i+1).padStart(2,'0')}</div>
                <div className="bex-mid">
                  <div className="bex-nome">{e.nome}</div>
                  <div className="bex-meta">{e.series} séries · {e.reps} reps{e.obs && ' · ' + e.obs}</div>
                </div>
                <div className="bex-fields">
                  <input className="num-input" value={e.series} onChange={ev => updateField(e.id, 'series', +ev.target.value || 0)} />
                  <input className="num-input wide" value={e.reps} onChange={ev => updateField(e.id, 'reps', ev.target.value)} />
                </div>
                <button className="x-btn" onClick={(ev) => { ev.stopPropagation(); remove(e.id); }}>×</button>
              </div>
            ))}
          </div>
          <button className="add-row-btn" onClick={() => addExercise('Novo exercício')}>+ Adicionar exercício</button>
        </section>

        <section className="card builder-side">
          <div className="card-h">
            <span className="card-t">Biblioteca</span>
            <input className="sel" placeholder="pesquisar..." style={{ width: 130 }} />
          </div>
          <div className="lib-list">
            {BIBLIOTECA.map((nome, i) => (
              <button key={i} className="lib-row" onClick={() => addExercise(nome)}>
                <span>{nome}</span><span className="lib-add">+</span>
              </button>
            ))}
          </div>
        </section>

        <section className="card builder-ai">
          <div className="card-h"><span className="card-t">⚡ Gerar com IA</span></div>
          <div className="ai-body">
            <div className="ai-row"><span>Objetivo</span><b>Hipertrofia</b></div>
            <div className="ai-row"><span>Frequência</span><b>4×/semana</b></div>
            <div className="ai-row"><span>Foco</span><b>Membros superiores</b></div>
            <div className="ai-row"><span>Duração</span><b>50–60 min</b></div>
            <button className="btn-primary" style={{ width: '100%', marginTop: 12 }}>Gerar 3 treinos →</button>
          </div>
        </section>
      </div>
    </div>
  );
}

// ── PHYSICAL ASSESSMENT ─────────────────────────────────────────
function AdminMedidas() {
  const [aluno] = useStateA('Mariana Costa');
  const valores = { peso: 69.1, gordura: 22.4, massaMagra: 53.6, agua: 56.2 };
  const peri = { Cintura: 77, Peito: 95, 'Coxa D': 57, 'Coxa E': 56.5, 'Braço D': 31, 'Braço E': 30.5, Quadril: 96, Panturrilha: 36 };
  const prev = { Cintura: 78.5, Peito: 94, 'Coxa D': 56, 'Coxa E': 55.5, 'Braço D': 30.5, 'Braço E': 30, Quadril: 96.5, Panturrilha: 35.5 };

  return (
    <div className="adm-page">
      <header className="adm-hero">
        <div>
          <div className="kicker">AVALIAÇÃO FÍSICA · {aluno.toUpperCase()}</div>
          <h1 className="adm-h">15 OUT 2025 · <span style={{ color: 'var(--accent)' }}>3ª pesagem</span></h1>
          <div className="hero-sub">4 semanas desde a última · −0.8kg · −1.5cm cintura</div>
        </div>
        <div className="adm-hero-cta">
          <button className="btn-ghost">Histórico</button>
          <button className="btn-primary">Guardar avaliação</button>
        </div>
      </header>

      <div className="comp-grid">
        <div className="comp-tile">
          <Ring value={valores.peso} max={100} size={120} stroke={10}
            label={valores.peso.toFixed(1)} sub="kg · peso" color="var(--accent)" />
          <div className="comp-d up">↓ 0.8 kg</div>
        </div>
        <div className="comp-tile">
          <Ring value={valores.gordura} max={40} size={120} stroke={10}
            label={valores.gordura.toFixed(1)} sub="% · gordura" color="var(--accent-2)" />
          <div className="comp-d up">↓ 1.4%</div>
        </div>
        <div className="comp-tile">
          <Ring value={valores.massaMagra} max={70} size={120} stroke={10}
            label={valores.massaMagra.toFixed(1)} sub="kg · massa magra" color="var(--accent-3)" />
          <div className="comp-d up">↑ 0.6 kg</div>
        </div>
        <div className="comp-tile">
          <Ring value={valores.agua} max={70} size={120} stroke={10}
            label={valores.agua.toFixed(1)} sub="% · água" color="var(--accent)" />
          <div className="comp-d neutral">— neutro</div>
        </div>
      </div>

      <section className="card">
        <div className="card-h">
          <span className="card-t">Perímetros · cm</span>
          <span className="card-sub">vs. avaliação anterior</span>
        </div>
        <div className="peri-grid">
          {Object.entries(peri).map(([k, v]) => {
            const p = prev[k];
            const d = v - p;
            return (
              <div key={k} className="peri-tile">
                <div className="peri-l">{k}</div>
                <div className="peri-v"><CountUp to={v} decimals={1} /></div>
                <div className={'peri-d ' + (k === 'Cintura' ? (d < 0 ? 'up' : 'dn') : (d > 0 ? 'up' : 'dn'))}>
                  {d > 0 ? '+' : ''}{d.toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <div className="card-h"><span className="card-t">Notas da avaliação</span></div>
        <textarea className="textarea" rows="3" defaultValue="Mariana mostra ganho consistente em massa magra. Cintura −1.5cm em 4 semanas confirma défice calórico controlado. Próxima fase: introduzir ciclo de força progressiva no Treino C."></textarea>
      </section>
    </div>
  );
}

Object.assign(window, { AdminDashboard, AdminBuilder, AdminMedidas });
