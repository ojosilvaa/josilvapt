// ═══════════════════════════════════════════════════════════
//  ALUNO V3 — Apple Health direction · Supabase live
// ═══════════════════════════════════════════════════════════

const PARAMS   = new URLSearchParams(location.search);
const ALUNO_ID = PARAMS.get('id');
const SB_URL   = 'https://oelbocimyfwwzkzbyswg.supabase.co';
const SB_KEY   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbGJvY2lteWZ3d3premJ5c3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMDI2OTksImV4cCI6MjA5MzU3ODY5OX0.S2V54XWWnF58lTQNkvFU9JL1-toCQxacICvtITYL_3E';

// ── i18n ─────────────────────────────────────────────────
const I18N = {
  pt: {
    'loading':'A CARREGAR…','ring-sub':'Sessão','reg_start':'Marca uma série para começar',
    'sucesso':'Sessão registada!','sucesso_sub':'Excelente trabalho. Até ao próximo treino!',
    'evo_kicker':'Resumo · 90 dias','evo_title':'A tua evolução,<br><em>visualizada.</em>',
    'kpi_sessoes':'Sessões','kpi_streak':'Streak','kpi_volume':'Volume kg','recorde':'recorde',
    'evo_chart_title':'Progressão de carga','sel_ex':'Selecione um exercício…',
    'evo_cmp':'Composição corporal','evo_pr':'Recordes pessoais','evo_no_pr':'Ainda sem recordes. Treina mais sessões!',
    'evo_heat':'Atividade · 13 semanas','heat_less':'Menos','heat_more':'Mais',
    'n_meta_sub':'da tua meta','n_prot':'Proteína','n_carb':'Carbo','n_gord':'Gordura',
    'water':'copos água','n_meals':'Refeições','n_no_meal':'Sem refeições hoje.',
    'pf_level':'Nível atual','streak_days':'dias','streak_active':'streak ativo',
    'pf_conquistas':'Conquistas','pt_msg':'Mensagem','pt_call':'Ligar','pf_orient':'Orientações da semana',
    'nav_treino':'Treino','nav_evolucao':'Evolução','nav_nutricao':'Nutrição','nav_perfil':'Perfil',
    'sem_treinos':'Sem treinos atribuídos ainda.','sem_ex':'Treino vazio.',
    'reg_complete':'Registar sessão completa →','reg_partial':'Registar (PCT%)',
    'reg_saving':'A guardar…','reg_default':'REGISTAR SESSÃO',
    'mantem':'mantém carga','obj_prefix':'Objetivo · ',
    'orient_default':[
      ['Hidratação','3 L de água por dia, 500 ml pré-treino.'],
      ['Sono','mínimo 7 h. Evita ecrãs 30 min antes de dormir.'],
      ['Proteína','1.8 g/kg de peso corporal — dividida em 4 refeições.'],
      ['Descanso entre séries','90s nos compostos, 60s nos isolados.'],
    ],
    'badges':[
      {ico:'🔥',l:'Streak 7d',u:'7 dias seguidos'},
      {ico:'💪',l:'10 sessões',u:'10 sessões'},
      {ico:'🏆',l:'50 sessões',u:'50 sessões'},
      {ico:'🥇',l:'100 sessões',u:'100 sessões'},
      {ico:'⚡',l:'Streak 14d',u:'14 dias seguidos'},
      {ico:'🎯',l:'Streak 30d',u:'30 dias seguidos'},
      {ico:'📈',l:'PR x 3',u:'3 recordes'},
      {ico:'👑',l:'PR x 10',u:'10 recordes'},
      {ico:'⭐',l:'Mês perfeito',u:'12 sessões no mês'},
    ],
    'days':['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
    'months':['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  },
  en: {
    'loading':'LOADING…','ring-sub':'Session','reg_start':'Tap a set to start',
    'sucesso':'Session saved!','sucesso_sub':'Great work. See you next time!',
    'evo_kicker':'Summary · 90 days','evo_title':'Your evolution,<br><em>visualised.</em>',
    'kpi_sessoes':'Sessions','kpi_streak':'Streak','kpi_volume':'Volume kg','recorde':'record',
    'evo_chart_title':'Load progression','sel_ex':'Select an exercise…',
    'evo_cmp':'Body composition','evo_pr':'Personal records','evo_no_pr':'No records yet. Train more!',
    'evo_heat':'Activity · 13 weeks','heat_less':'Less','heat_more':'More',
    'n_meta_sub':'of your goal','n_prot':'Protein','n_carb':'Carb','n_gord':'Fat',
    'water':'water cups','n_meals':'Meals','n_no_meal':'No meals today.',
    'pf_level':'Current level','streak_days':'days','streak_active':'active streak',
    'pf_conquistas':'Achievements','pt_msg':'Message','pt_call':'Call','pf_orient':'Week guidelines',
    'nav_treino':'Workout','nav_evolucao':'Progress','nav_nutricao':'Nutrition','nav_perfil':'Profile',
    'sem_treinos':'No workouts assigned yet.','sem_ex':'Empty workout.',
    'reg_complete':'Register full session →','reg_partial':'Register (PCT%)',
    'reg_saving':'Saving…','reg_default':'REGISTER SESSION',
    'mantem':'same load','obj_prefix':'Goal · ',
    'orient_default':[
      ['Hydration','3 L water per day, 500 ml pre-workout.'],
      ['Sleep','minimum 7 h. Avoid screens 30 min before bed.'],
      ['Protein','1.8 g/kg body weight — split in 4 meals.'],
      ['Rest between sets','90s on compounds, 60s on isolation.'],
    ],
    'badges':[
      {ico:'🔥',l:'7d streak',u:'7 days'},
      {ico:'💪',l:'10 sessions',u:'10 sessions'},
      {ico:'🏆',l:'50 sessions',u:'50 sessions'},
      {ico:'🥇',l:'100 sessions',u:'100 sessions'},
      {ico:'⚡',l:'14d streak',u:'14 days'},
      {ico:'🎯',l:'30d streak',u:'30 days'},
      {ico:'📈',l:'PR x 3',u:'3 records'},
      {ico:'👑',l:'PR x 10',u:'10 records'},
      {ico:'⭐',l:'Perfect month',u:'12 sessions'},
    ],
    'days':['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    'months':['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  }
};
let LANG = (() => { try { return localStorage.getItem('aluno_lang') || 'pt'; } catch(e){ return 'pt'; } })();
function T(k){ return I18N[LANG][k] !== undefined ? I18N[LANG][k] : k; }

// ── STATE ────────────────────────────────────────────────
let aluno = null, alunoObjetivo = '';
let treinos = [], exerciciosPorTreino = {}, currentTreinoId = null;
let cargas = {}, doneSet = {};
let sessoes = [], allCargasHist = null;
let pesoCached = 0, perimetriaHist = [];

// ── STORAGE HELPERS ──────────────────────────────────────
const lc = (k, d = null) => { try { const v = localStorage.getItem('alunoV3_' + ALUNO_ID + '_' + k); return v ? JSON.parse(v) : d; } catch(e){ return d; } };
const sc = (k, v) => { try { localStorage.setItem('alunoV3_' + ALUNO_ID + '_' + k, JSON.stringify(v)); } catch(e){} };

// ── UTILS ────────────────────────────────────────────────
const toast = msg => {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
};
const formatDate = d => {
  if (!d) return '—';
  const p = d.split('T')[0].split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d;
};
const todayISO = () => new Date().toISOString().split('T')[0];
const initials = name => (name || '?').split(' ').filter(Boolean).slice(0,2).map(p => p[0]).join('').toUpperCase();
const daysAgo = isoDate => {
  if (!isoDate) return 999;
  const ms = new Date() - new Date(isoDate);
  return Math.floor(ms / 86400000);
};

// ── SUPABASE ─────────────────────────────────────────────
async function sb(path, opts = {}) {
  try {
    const r = await fetch(SB_URL + '/rest/v1/' + path, {
      headers: {
        'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json', 'Prefer': 'return=representation',
        ...(opts.headers || {})
      },
      ...opts
    });
    if (!r.ok) return null;
    const ct = r.headers.get('content-type');
    return ct && ct.includes('json') ? await r.json() : [];
  } catch(e) { return null; }
}

// ═══════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════
async function init(){
  applyI18n();
  applyAccentFromStorage();

  if (!ALUNO_ID) {
    document.getElementById('treino-loading').innerHTML =
      '<div class="empty"><div class="empty-icon">🔗</div>Link inválido. Pede ao teu PT o link correto.</div>';
    return;
  }

  const arr = await sb(`alunos?id=eq.${ALUNO_ID}&select=nome,ativo,objetivo`);
  aluno = arr && arr[0];
  if (!aluno || !aluno.ativo) {
    document.getElementById('treino-loading').innerHTML =
      '<div class="empty"><div class="empty-icon">⚠️</div>Acesso indisponível. Fala com o teu PT.</div>';
    return;
  }
  alunoObjetivo = aluno.objetivo || '';
  document.title = aluno.nome.split(' ')[0] + ' · Jo Silva PT';

  cargas  = lc('cargas', {});
  const stored = lc('doneSet', {});
  doneSet = {};
  Object.keys(stored).forEach(k => doneSet[k] = new Set(stored[k]));

  setupNav();
  setupAccentPicker();
  setupLangToggle();
  setupWaterDots();

  sessoes = await sb(`sessoes?aluno_id=eq.${ALUNO_ID}&order=data.desc&limit=200`) || [];
  perimetriaHist = await sb(`perimetria?aluno_id=eq.${ALUNO_ID}&order=data.asc&limit=20`) || [];

  // Carregar histórico de cargas no arranque
  if (sessoes.length) {
    const sids = sessoes.map(s => s.id);
    allCargasHist = await sb(
      `sessao_cargas?sessao_id=in.(${sids.join(',')})&select=*,sessoes(data)&order=sessoes(data).desc`
    ) || [];
  } else {
    allCargasHist = [];
  }

  await loadTreinos();
  renderPerfil();
}

// ═══════════════════════════════════════════════════════════
//  TREINOS
// ═══════════════════════════════════════════════════════════
async function loadTreinos(){
  treinos = await sb(`treinos?aluno_id=eq.${ALUNO_ID}&order=criado_em.asc`) || [];
  const loading = document.getElementById('treino-loading');
  if (!treinos.length){
    loading.innerHTML = `<div class="empty"><div class="empty-icon">📋</div>${T('sem_treinos')}</div>`;
    return;
  }
  loading.style.display = 'none';

  const chips = document.getElementById('treino-chips');
  chips.innerHTML = treinos.map((t,i) =>
    `<button class="chip${i===0?' on':''}" data-tid="${t.id}">${t.nome}</button>`
  ).join('');
  chips.addEventListener('click', ev => {
    const c = ev.target.closest('.chip'); if (!c) return;
    chips.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === c));
    selectTreino(c.dataset.tid);
  }, { once: false });

  await selectTreino(treinos[0].id);
}

async function selectTreino(id){
  currentTreinoId = id;
  if (!exerciciosPorTreino[id]){
    exerciciosPorTreino[id] = await sb(`exercicios?treino_id=eq.${id}&order=ordem.asc`) || [];
  }

  // ── PRÉ-PREENCHER cargas com o último valor registado
  // Só preenche se o aluno ainda não tiver tocado naquele exercício nesta sessão
  for (const ex of exerciciosPorTreino[id]){
    if (!doneSet[ex.id]) doneSet[ex.id] = new Set();

    // Se não há carga local guardada (ou é 0), preencher com a última do histórico
    if (!cargas[ex.id]) {
      const ultima = lastCargaFor(ex.id);
      if (ultima) {
        cargas[ex.id] = ultima;
      }
    }
  }
  // Persistir cargas pré-preenchidas
  sc('cargas', cargas);

  renderTreino();
}

function renderTreino(){
  const t   = treinos.find(x => x.id === currentTreinoId);
  const exs = exerciciosPorTreino[currentTreinoId] || [];
  if (!t) return;

  const now = new Date();
  const kicker = LANG==='pt'
    ? `Hoje · ${now.getDate()} ${T('months')[now.getMonth()]}`
    : `Today · ${T('months')[now.getMonth()]} ${now.getDate()}`;
  document.getElementById('t-kicker').textContent = kicker;

  document.getElementById('t-label').textContent = t.descricao || (LANG==='pt'?'Treino':'Workout');
  document.getElementById('t-name').textContent  = t.nome || '';
  document.getElementById('t-meta').innerHTML =
    `<span class="meta-item"><span class="meta-num">${exs.length}</span> ${LANG==='pt'?'exercícios':'exercises'}</span>` +
    `<span class="meta-item"><span class="meta-num">~${Math.max(15, exs.length*10)}</span> min</span>`;

  const list = document.getElementById('ex-list');
  if (!exs.length){
    list.innerHTML = `<div class="empty">${T('sem_ex')}</div>`;
    document.getElementById('btn-reg').style.display = 'none';
    return;
  }
  document.getElementById('btn-reg').style.display = '';

  list.innerHTML = '';
  exs.forEach((ex, i) => {
    const series  = parseInt(ex.series) || 3;
    const reps    = ex.reps || '10-12';
    const c       = cargas[ex.id] || 0;
    const prev    = lastCargaFor(ex.id);
    const d       = (prev != null && c) ? +(c - prev).toFixed(1) : 0;
    const done    = (doneSet[ex.id] || new Set()).size;
    const complete = done >= series;

    const el = document.createElement('div');
    el.className = 'ex in' + (complete ? ' done' : '');
    el.style.animationDelay = (.05 + i*.06) + 's';

    const cargaStr = c > 0 ? c : '—';
    const deltaCls = d === 0 ? 'flat' : (d < 0 ? 'dn' : '');

    // Delta: se a carga atual é igual à última → "mantém carga"
    // se ainda não mexeu e há histórico → mostra "última: Xkg"
    // se não há histórico → "—"
    const deltaTxt = prev == null
      ? '—'
      : c === 0
        ? `Última: ${prev} kg`
        : d === 0 ? T('mantem')
        : (d > 0 ? '↑ +' : '↓ ') + Math.abs(d) + ' kg';

    el.innerHTML = `
      <div class="ex-head">
        <div class="ex-num">${String(i+1).padStart(2,'0')}</div>
        <div class="ex-info">
          <div class="ex-name">${escapeHTML(ex.nome || '')}</div>
          <div class="ex-meta">${series} ${LANG==='pt'?'séries':'sets'} · ${reps} reps</div>
          ${ex.obs ? `<div class="ex-obs">${escapeHTML(ex.obs)}</div>` : ''}
        </div>
      </div>
      <div class="carga-block">
        <button class="carga-btn" data-act="-" data-id="${ex.id}">−</button>
        <div class="carga-mid">
          <div class="carga-val">${cargaStr}${c > 0 ? '<span class="kg">kg</span>' : ''}</div>
          <div class="carga-delta ${deltaCls}">${deltaTxt}</div>
        </div>
        <button class="carga-btn" data-act="+" data-id="${ex.id}">+</button>
      </div>
      <div class="sets">${Array.from({length: series}, (_,k) =>
        `<button class="set-pip ${doneSet[ex.id].has(k)?'on':''}" data-set="${k}" data-id="${ex.id}">${doneSet[ex.id].has(k)?'✓':k+1}</button>`
      ).join('')}</div>
    `;
    list.appendChild(el);
  });

  if (!list.dataset.bound){
    list.addEventListener('click', onExListClick);
    list.dataset.bound = '1';
  }

  updateRing();
}

function onExListClick(ev){
  const btn = ev.target.closest('[data-act]');
  if (btn){
    const id = btn.dataset.id;
    const delta = btn.dataset.act === '+' ? 2.5 : -2.5;
    cargas[id] = Math.max(0, Math.round(((cargas[id]||0) + delta) * 10) / 10);
    sc('cargas', cargas);
    renderTreino();
    return;
  }
  const pip = ev.target.closest('[data-set]');
  if (pip){
    const id = pip.dataset.id;
    const k  = +pip.dataset.set;
    if (!doneSet[id]) doneSet[id] = new Set();
    if (doneSet[id].has(k)) doneSet[id].delete(k);
    else doneSet[id].add(k);
    const out = {};
    Object.keys(doneSet).forEach(k => out[k] = [...doneSet[k]]);
    sc('doneSet', out);
    renderTreino();
  }
}

function lastCargaFor(exId){
  if (!allCargasHist) return null;
  const rows = allCargasHist.filter(r => r.exercicio_id === exId);
  if (!rows.length) return null;
  return parseFloat(rows[0].carga_kg) || null;
}

function updateRing(){
  const exs = exerciciosPorTreino[currentTreinoId] || [];
  if (!exs.length) return;
  const total = exs.reduce((s,e) => s + (parseInt(e.series)||3), 0);
  const done  = exs.reduce((s,e) => s + ((doneSet[e.id]||new Set()).size), 0);
  const pct   = total ? done/total : 0;
  const C = 276.5;
  document.getElementById('ring-fill').style.strokeDashoffset = C*(1-pct);
  document.getElementById('ring-pct').textContent = Math.round(pct*100)+'%';

  const btn = document.getElementById('btn-reg');
  if (done === 0){
    btn.disabled = true; btn.classList.remove('ready');
    btn.textContent = T('reg_start');
  } else if (done >= total){
    btn.disabled = false; btn.classList.add('ready');
    btn.textContent = T('reg_complete');
  } else {
    btn.disabled = false; btn.classList.remove('ready');
    btn.textContent = T('reg_partial').replace('PCT', Math.round(pct*100));
  }
}

// ── REGISTAR SESSÃO ────────────────────────────────────
async function registrar(){
  const t = treinos.find(x => x.id === currentTreinoId);
  const exs = exerciciosPorTreino[currentTreinoId] || [];
  const btn = document.getElementById('btn-reg');
  btn.textContent = T('reg_saving'); btn.disabled = true;

  const sessaoData = {
    aluno_id: ALUNO_ID, treino_id: currentTreinoId,
    treino_nome: t?.nome || '', data: todayISO()
  };

  const sesRes = await sb('sessoes', { method:'POST', body: JSON.stringify(sessaoData) });
  if (sesRes && sesRes[0]){
    const sessaoId = sesRes[0].id;
    const payload = exs
      .filter(e => cargas[e.id])
      .map(e => ({ sessao_id: sessaoId, exercicio_id: e.id, carga_kg: cargas[e.id] }));
    if (payload.length){
      await sb('sessao_cargas', { method:'POST', body: JSON.stringify(payload) });
    }
    sessoes.unshift({ ...sesRes[0], treino_nome: t?.nome });
    // Recarregar histórico para delta ficar atualizado
    const sids = sessoes.map(s => s.id);
    allCargasHist = await sb(
      `sessao_cargas?sessao_id=in.(${sids.join(',')})&select=*,sessoes(data)&order=sessoes(data).desc`
    ) || [];
    toast(T('sucesso'));
  } else {
    toast('Sem conexão — vamos tentar mais tarde.');
  }

  // Reset séries feitas mas manter as cargas para a próxima sessão
  exs.forEach(e => doneSet[e.id] = new Set());
  const out = {};
  Object.keys(doneSet).forEach(k => out[k] = [...doneSet[k]]);
  sc('doneSet', out);

  const banner = document.getElementById('success-banner');
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 4500);

  btn.textContent = T('reg_default');
  renderTreino();
}

// ═══════════════════════════════════════════════════════════
//  EVOLUÇÃO
// ═══════════════════════════════════════════════════════════
async function renderEvolucao(){
  document.getElementById('kpi-sessoes').textContent = sessoes.length;
  const last30 = sessoes.filter(s => daysAgo(s.data) <= 30).length;
  document.getElementById('kpi-sessoes-d').textContent = `+${last30} ${LANG==='pt'?'em 30 dias':'in 30 days'}`;

  const streak = computeStreak();
  document.getElementById('kpi-streak').textContent = streak;
  document.getElementById('kpi-streak-d').textContent = streak > 0 ? T('recorde') : '—';

  const vol = allCargasHist.reduce((s,c) => s + (parseFloat(c.carga_kg)||0), 0);
  document.getElementById('kpi-volume').textContent = Math.round(vol).toLocaleString('pt-PT');
  document.getElementById('kpi-volume-d').textContent = `${allCargasHist.length} ${LANG==='pt'?'registos':'records'}`;

  const sel = document.getElementById('evo-select');
  if (sel.options.length <= 1){
    for (const t of treinos){
      if (!exerciciosPorTreino[t.id]){
        exerciciosPorTreino[t.id] = await sb(`exercicios?treino_id=eq.${t.id}&order=ordem.asc`) || [];
      }
    }
    Object.values(exerciciosPorTreino).flat().forEach(ex => {
      const o = document.createElement('option');
      o.value = ex.id; o.textContent = ex.nome; sel.appendChild(o);
    });
    sel.addEventListener('change', () => buildChart(sel.value));
    const withHist = Object.values(exerciciosPorTreino).flat().find(ex =>
      allCargasHist.some(c => c.exercicio_id === ex.id)
    );
    if (withHist){ sel.value = withHist.id; buildChart(withHist.id); }
  } else if (sel.value){
    buildChart(sel.value);
  }

  renderPRs();
  renderHeatmap();
}

function renderPRs(){
  const el = document.getElementById('pr-list');
  if (!allCargasHist || !allCargasHist.length){
    el.innerHTML = `<div class="empty">${T('evo_no_pr')}</div>`;
    return;
  }
  const groups = {};
  allCargasHist.forEach(c => {
    if (!groups[c.exercicio_id]) groups[c.exercicio_id] = [];
    groups[c.exercicio_id].push(c);
  });
  const exNames = {};
  Object.values(exerciciosPorTreino).flat().forEach(ex => exNames[ex.id] = ex.nome);

  const prs = [];
  Object.entries(groups).forEach(([exId, rows]) => {
    if (!exNames[exId]) return;
    const sorted = rows.slice().sort((a,b) => parseFloat(b.carga_kg) - parseFloat(a.carga_kg));
    const top = sorted[0];
    const second = sorted[1];
    const delta = second ? +(parseFloat(top.carga_kg) - parseFloat(second.carga_kg)).toFixed(1) : 0;
    prs.push({
      name: exNames[exId],
      val: parseFloat(top.carga_kg),
      delta,
      date: top.sessoes?.data || ''
    });
  });
  prs.sort((a,b) => b.val - a.val);
  const top5 = prs.slice(0,5);
  if (!top5.length){ el.innerHTML = `<div class="empty">${T('evo_no_pr')}</div>`; return; }
  el.innerHTML = top5.map(p => `
    <div class="pr-row">
      <div class="pr-ico">●</div>
      <div class="pr-mid">
        <div class="pr-name">${escapeHTML(p.name)}</div>
        <div class="pr-date">${formatDate(p.date)}</div>
      </div>
      <div>
        <div class="pr-val">${p.val} kg</div>
        ${p.delta > 0 ? `<div class="pr-delta">+${p.delta} kg</div>` : ''}
      </div>
    </div>`).join('');
}

function renderHeatmap(){
  const grid = document.getElementById('heat-grid');
  const cells = 13 * 7;
  const today = new Date(); today.setHours(0,0,0,0);
  const dayCount = {};
  sessoes.forEach(s => {
    const d = s.data; if (!d) return;
    dayCount[d] = (dayCount[d] || 0) + 1;
  });
  let html = '';
  for (let i = cells - 1; i >= 0; i--){
    const d = new Date(today); d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    const n = dayCount[iso] || 0;
    const lvl = n === 0 ? 0 : n === 1 ? 2 : n === 2 ? 3 : 4;
    html += `<div class="heat-cell${lvl?' l'+lvl:''}" title="${iso}: ${n}"></div>`;
  }
  grid.innerHTML = html;
}

// ── chart ────────────────────────────────────────────────
function buildChart(exId){
  if (!exId || !allCargasHist) return;
  const rows = allCargasHist
    .filter(c => c.exercicio_id === exId && c.sessoes?.data)
    .slice()
    .sort((a,b) => new Date(a.sessoes.data) - new Date(b.sessoes.data));
  const d = rows.map(r => parseFloat(r.carga_kg) || 0).filter(v => v > 0);
  const W = 320, H = 140;
  const pathLine = document.getElementById('chart-line');
  const pathArea = document.getElementById('chart-area');
  const g = document.getElementById('chart-dots');
  const ax = document.getElementById('x-axis');

  if (d.length < 2){
    pathLine.setAttribute('d',''); pathArea.setAttribute('d','');
    g.innerHTML = ''; ax.innerHTML = '';
    document.getElementById('chart-val').textContent = d[0] || '—';
    document.getElementById('chart-delta').textContent = LANG==='pt'?'Mais dados em breve':'More data soon';
    document.getElementById('chart-delta').className = 'chart-stat-d flat';
    return;
  }

  const min = Math.min(...d) - 2;
  const max = Math.max(...d) + 2;
  const xs = d.map((_,i) => 12 + i * ((W-24)/(d.length-1)));
  const ys = d.map(v => 10 + (1 - (v-min)/(max-min)) * (H-30));
  const line = xs.map((x,i) => (i?'L':'M') + x.toFixed(1) + ' ' + ys[i].toFixed(1)).join(' ');
  const area = line + ` L${xs[xs.length-1].toFixed(1)} ${H} L${xs[0].toFixed(1)} ${H} Z`;
  pathArea.setAttribute('d', area);
  pathLine.setAttribute('d', line);
  const len = pathLine.getTotalLength();
  pathLine.style.transition = 'none';
  pathLine.style.strokeDasharray = len;
  pathLine.style.strokeDashoffset = len;
  requestAnimationFrame(() => {
    pathLine.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)';
    pathLine.style.strokeDashoffset = 0;
  });

  g.innerHTML = '';
  const accentCol = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#FFD96B';
  xs.forEach((x,i) => {
    const r = i === xs.length-1 ? 5 : 2.5;
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx', x); c.setAttribute('cy', ys[i]); c.setAttribute('r', r);
    c.setAttribute('fill', accentCol);
    c.setAttribute('opacity', i === xs.length-1 ? 1 : .55);
    if (i === xs.length-1) c.setAttribute('filter', `drop-shadow(0 0 6px ${accentCol})`);
    g.appendChild(c);
  });

  const labels = rows.map(r => {
    const dt = new Date(r.sessoes.data);
    return `${dt.getDate()}/${dt.getMonth()+1}`;
  });
  const step = Math.max(1, Math.ceil(labels.length/6));
  ax.innerHTML = labels.map((l,i) => (i%step===0 || i===labels.length-1) ? `<span>${l}</span>` : '<span></span>').join('');

  document.getElementById('chart-val').textContent = d[d.length-1];
  const delta = +(d[d.length-1] - d[0]).toFixed(1);
  const dEl = document.getElementById('chart-delta');
  if (delta > 0){
    dEl.textContent = `+${delta} kg ${LANG==='pt'?'em':'in'} ${d.length} ${LANG==='pt'?'sessões':'sessions'}`;
    dEl.className = 'chart-stat-d';
  } else if (delta < 0){
    dEl.textContent = `${delta} kg ${LANG==='pt'?'em':'in'} ${d.length}`;
    dEl.className = 'chart-stat-d dn';
  } else {
    dEl.textContent = `${LANG==='pt'?'Estável em':'Stable over'} ${d.length} ${LANG==='pt'?'sessões':'sessions'}`;
    dEl.className = 'chart-stat-d flat';
  }
}

function computeStreak(){
  if (!sessoes.length) return 0;
  const dates = [...new Set(sessoes.map(s => s.data))].sort().reverse();
  let streak = 0;
  let d = new Date(); d.setHours(0,0,0,0);
  for (let i = 0; i < dates.length; i++){
    const sd = new Date(dates[i]); sd.setHours(0,0,0,0);
    const diff = Math.round((d - sd) / 86400000);
    if (diff <= 1){ streak++; d = new Date(sd); d.setDate(d.getDate() - 1); }
    else if (diff <= 2 && i === 0){ continue; }
    else break;
  }
  return streak;
}

// ═══════════════════════════════════════════════════════════
//  NUTRIÇÃO
// ═══════════════════════════════════════════════════════════
async function renderNutricao(){
  const hoje = todayISO();
  const refs = await sb(`refeicoes?aluno_id=eq.${ALUNO_ID}&data=eq.${hoje}&order=criado_em.asc`) || [];
  const peso = parseFloat(perimetriaHist[perimetriaHist.length-1]?.peso) || 70;
  const meta = calcDailyKcal(peso, alunoObjetivo);
  const metaP = Math.round(peso * 1.8);
  const metaC = Math.round(meta * 0.45 / 4);
  const metaG = Math.round(meta * 0.25 / 9);

  const kcal = refs.reduce((s,r) => s + (+r.calorias||0), 0);
  const prot = refs.reduce((s,r) => s + (parseFloat(r.proteina)||0), 0);
  const carb = refs.reduce((s,r) => s + (parseFloat(r.carboidratos)||0), 0);
  const gord = refs.reduce((s,r) => s + (parseFloat(r.gordura)||0), 0);

  const now = new Date();
  document.getElementById('n-kicker').textContent = LANG==='pt'
    ? `Hoje · ${now.getDate()} ${T('months')[now.getMonth()]}`
    : `Today · ${T('months')[now.getMonth()]} ${now.getDate()}`;
  document.getElementById('n-kcal').textContent      = Math.round(kcal).toLocaleString('pt-PT');
  document.getElementById('n-kcal-meta').textContent = meta.toLocaleString('pt-PT');
  const pct = meta ? Math.round((kcal/meta)*100) : 0;
  document.getElementById('n-pct').textContent       = pct + '%';

  document.getElementById('n-prot').textContent   = Math.round(prot);
  document.getElementById('n-prot-m').textContent = metaP;
  document.getElementById('n-carb').textContent   = Math.round(carb);
  document.getElementById('n-carb-m').textContent = metaC;
  document.getElementById('n-gord').textContent   = Math.round(gord);
  document.getElementById('n-gord-m').textContent = metaG;

  const C = 276.5;
  const setR = (id, val) => {
    const el = document.getElementById(id);
    el.style.transition = 'none';
    el.style.strokeDashoffset = C;
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)';
      el.style.strokeDashoffset = C * (1 - Math.min(1, val));
    });
  };
  setR('m-p', prot/metaP);
  setR('m-c', carb/metaC);
  setR('m-g', gord/metaG);

  const ml = document.getElementById('meals-list');
  if (!refs.length){
    ml.innerHTML = `<div class="empty">${T('n_no_meal')}</div>`;
  } else {
    ml.innerHTML = refs.map((r,i) => {
      const hora = r.criado_em ? new Date(r.criado_em).toTimeString().slice(0,5) : '—';
      const tipo = r.tipo || (LANG==='pt'?'Refeição':'Meal');
      return `
      <div class="meal in" style="animation-delay:${.06 + i*.06}s">
        <div class="meal-head">
          <span class="meal-time">${hora}</span>
          <span class="meal-name">${escapeHTML(tipo)}</span>
          <span class="meal-kcal">${Math.round(+r.calorias||0)}<small>kcal</small></span>
        </div>
        <div class="meal-macros">
          <span>P <b>${Math.round(parseFloat(r.proteina)||0)}g</b></span>
          <span>C <b>${Math.round(parseFloat(r.carboidratos)||0)}g</b></span>
          <span>G <b>${Math.round(parseFloat(r.gordura)||0)}g</b></span>
        </div>
      </div>`;
    }).join('');
  }
}

function calcDailyKcal(peso, obj){
  const base = peso * 30;
  if (/secar|cut|emagre/i.test(obj || '')) return Math.round(base * 0.85 / 50) * 50;
  if (/hipertrof|bulk|massa/i.test(obj || '')) return Math.round(base * 1.15 / 50) * 50;
  return Math.round(base / 50) * 50;
}

// ═══════════════════════════════════════════════════════════
//  PERFIL
// ═══════════════════════════════════════════════════════════
function renderPerfil(){
  if (!aluno) return;
  document.getElementById('pf-avatar').textContent = initials(aluno.nome);
  document.getElementById('pf-name').textContent   = aluno.nome;
  const meta = alunoObjetivo
    ? `${LANG==='pt'?'Plano':'Plan'} · <em>${escapeHTML(alunoObjetivo)}</em>`
    : (LANG==='pt'?'Em treino com Jo Silva':'Training with Jo Silva');
  document.getElementById('pf-meta').innerHTML = meta;

  renderBiometria();

  const total = sessoes.length;
  const xp = total * 50;
  let lvl = 1, cumul = 0;
  while (xp >= cumul + 200*lvl){ cumul += 200*lvl; lvl++; }
  const intoLvl  = xp - cumul;
  const lvlReq   = 200 * lvl;
  document.getElementById('pf-lvl').textContent     = lvl;
  document.getElementById('pf-xp').textContent      = intoLvl.toLocaleString('pt-PT');
  document.getElementById('pf-xp-max').textContent  = lvlReq.toLocaleString('pt-PT');
  document.getElementById('lvl-from').textContent   = (LANG==='pt'?'Nv ':'Lv ') + lvl;
  document.getElementById('lvl-to').textContent     = (LANG==='pt'?'Nv ':'Lv ') + (lvl+1);
  document.getElementById('lvl-to-sub').textContent =
    `${(lvlReq - intoLvl).toLocaleString('pt-PT')} XP ${LANG==='pt'?'para':'to'} ${(LANG==='pt'?'Nv ':'Lv ')}${lvl+1}`;
  const xpFill = document.getElementById('xp-fill');
  xpFill.style.transition = 'none'; xpFill.style.width = '0%';
  requestAnimationFrame(() => {
    xpFill.style.transition = 'width 1.6s cubic-bezier(.4,0,.2,1)';
    xpFill.style.width = (intoLvl / lvlReq * 100).toFixed(1) + '%';
  });

  const streak = computeStreak();
  document.getElementById('streak-days').textContent = streak;
  document.getElementById('streak-sub').innerHTML = streak >= 7
    ? `${T('streak_active')} · <b>${LANG==='pt'?'em chamas':'on fire'}</b>`
    : (streak ? T('streak_active') : (LANG==='pt'?'Começa hoje':'Start today'));

  const last30 = sessoes.filter(s => daysAgo(s.data) <= 30).length;
  const unlocked = [
    streak >= 7, total >= 10, total >= 50, total >= 100,
    streak >= 14, streak >= 30, false, false, last30 >= 12,
  ];
  const grid = document.getElementById('badge-grid');
  grid.innerHTML = T('badges').map((b,i) => `
    <div class="badge ${unlocked[i] ? 'on' : 'locked'}">
      <div class="badge-ico">${b.ico}</div>
      <div class="badge-lbl">${b.l}</div>
      <div class="badge-sub">${unlocked[i] ? (LANG==='pt'?'desbloqueado':'unlocked') : b.u}</div>
    </div>
  `).join('');
  document.getElementById('badges-count').textContent = unlocked.filter(Boolean).length + ' / 9';

  document.getElementById('orient-list').innerHTML = T('orient_default').map(([title, txt], i) => `
    <div class="orient-row">
      <div class="orient-num">${String(i+1).padStart(2,'0')}</div>
      <div class="orient-text"><b>${title}:</b> ${txt}</div>
    </div>
  `).join('');
}

// ── BIOMETRIA ─────────────────────────────────────────────
function renderBiometria(){
  const old = document.getElementById('bio-card');
  if (old) old.remove();

  const p = perimetriaHist.length ? perimetriaHist[perimetriaHist.length - 1] : null;
  if (!p) return;

  const m          = p.medidas || {};
  const peso       = parseFloat(p.peso)         || 0;
  const gordura    = parseFloat(p.gordura)       || 0;
  const massaMagra = parseFloat(p.massa_magra)   || 0;
  const altura     = m.altura_cm                 || 0;
  const imc        = m.imc || (altura ? +(peso / ((altura/100)**2)).toFixed(1) : 0);
  const massaGorda = m.massa_gorda_kg            || +(peso * gordura / 100).toFixed(1);
  const tmb        = m.tmb_kcal                  || 0;
  const visceralNivel = m.gordura_visceral_nivel || 0;

  const imcLabel = imc < 18.5
    ? (LANG==='pt'?'Abaixo peso':'Underweight')
    : imc < 25 ? (LANG==='pt'?'Normal':'Normal')
    : imc < 30 ? (LANG==='pt'?'Sobrepeso':'Overweight')
    : (LANG==='pt'?'Obesidade':'Obese');

  const dataFmt = p.data ? (() => {
    const [y,mo,d] = p.data.split('-');
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    return `${d} ${months[+mo-1]} ${y}`;
  })() : '—';

  const pt = LANG === 'pt';

  const card = document.createElement('div');
  card.id = 'bio-card';
  card.className = 'bio-card in';
  card.style.animationDelay = '.04s';

  card.innerHTML = `
    <div class="bio-title">${pt?'Avaliação física':'Physical assessment'} · <span style="color:var(--gold)">${dataFmt}</span></div>
    <div class="bio-kpis">
      <div class="bio-kpi accent">
        <div class="bio-kpi-v">${peso}<span>kg</span></div>
        <div class="bio-kpi-l">${pt?'Peso':'Weight'}</div>
      </div>
      <div class="bio-kpi">
        <div class="bio-kpi-v">${altura}<span>cm</span></div>
        <div class="bio-kpi-l">${pt?'Altura':'Height'}</div>
      </div>
      <div class="bio-kpi">
        <div class="bio-kpi-v">${imc}</div>
        <div class="bio-kpi-l">IMC · ${imcLabel}</div>
      </div>
    </div>
    <div class="bio-divider">${pt?'Composição corporal':'Body composition'}</div>
    <div class="bio-row">
      <span class="bio-row-l">${pt?'Gordura corporal':'Body fat'}</span>
      <span class="bio-row-r">${gordura}%</span>
    </div>
    <div class="bio-row">
      <span class="bio-row-l">${pt?'Massa magra':'Lean mass'}</span>
      <span class="bio-row-r">${massaMagra} kg</span>
    </div>
    <div class="bio-row">
      <span class="bio-row-l">${pt?'Massa gorda':'Fat mass'}</span>
      <span class="bio-row-r">${massaGorda} kg</span>
    </div>
    ${tmb ? `<div class="bio-row">
      <span class="bio-row-l">TMB</span>
      <span class="bio-row-r">${tmb} kcal</span>
    </div>` : ''}
    ${visceralNivel ? `<div class="bio-row">
      <span class="bio-row-l">${pt?'Gordura visceral':'Visceral fat'}</span>
      <span class="bio-row-r">${pt?'Nível':'Level'} ${visceralNivel}</span>
    </div>` : ''}
    <div class="bio-divider">${pt?'Perímetros (cm)':'Measurements (cm)'}</div>
    <div class="bio-grid">
      ${[
        [pt?'Ombro':'Shoulder',          m.ombro_cm],
        [pt?'Peito':'Chest',             m.peito_cm],
        [pt?'Cintura':'Waist',           m.cintura_cm],
        [pt?'Abdómen':'Abdomen',         m.abdomen_cm],
        [pt?'Quadril':'Hip',             m.quadril_cm],
        [pt?'Braço (rel.)':'Arm rel.',   m.braco_relaxado_dir_cm],
        [pt?'Braço (cont.)':'Arm cont.', m.braco_contraido_dir_cm],
        [pt?'Coxa D':'Thigh R',          m.coxa_dir_cm],
        [pt?'Coxa E':'Thigh L',          m.coxa_esq_cm],
        [pt?'Panturrilha':'Calf',        m.panturrilha_dir_cm],
      ].filter(([,v]) => v != null).map(([l,v]) => `
        <div class="bio-row">
          <span class="bio-row-l">${l}</span>
          <span class="bio-row-r">${v}</span>
        </div>
      `).join('')}
    </div>
  `;

  const levelCard = document.querySelector('.level-card');
  levelCard.parentNode.insertBefore(card, levelCard);
}

// ═══════════════════════════════════════════════════════════
//  NAV / ACCENT / LANG / WATER
// ═══════════════════════════════════════════════════════════
const ORDER = ['treino','evolucao','nutricao','perfil'];
let currentScreen = 'treino';

function go(name){
  if (name === currentScreen) return;
  currentScreen = name;
  const idx = ORDER.indexOf(name);
  document.querySelectorAll('.screen').forEach(s => {
    const i = ORDER.indexOf(s.dataset.screen);
    s.dataset.state = i === idx ? 'active' : (i < idx ? 'prev' : 'next');
  });
  document.querySelectorAll('.bnav-item').forEach(n =>
    n.classList.toggle('on', n.dataset.screen === name));

  if (name === 'evolucao') renderEvolucao();
  if (name === 'nutricao') renderNutricao();
  if (name === 'perfil')   renderPerfil();
}

function setupNav(){
  document.querySelectorAll('.bnav-item').forEach(b =>
    b.addEventListener('click', () => go(b.dataset.screen)));
  document.getElementById('btn-reg').addEventListener('click', registrar);
}

const PALETTES = {
  gold:  ['#FFD96B', '#E5B23A', 'rgba(255,217,107,.35)'],
  green: ['#5FE3D3', '#3EB8A8', 'rgba(95,227,211,.4)'],
  red:   ['#FF6B6B', '#E54444', 'rgba(255,107,107,.4)'],
  blue:  ['#5FA8FF', '#3E82E5', 'rgba(95,168,255,.4)'],
};
function setAccent(name){
  const [c1, c2, glow] = PALETTES[name] || PALETTES.gold;
  document.documentElement.style.setProperty('--gold', c1);
  document.documentElement.style.setProperty('--gold-2', c2);
  document.documentElement.style.setProperty('--gold-glow', glow);
  document.querySelectorAll('#chart-dots circle').forEach((c, i, arr) => {
    c.setAttribute('fill', c1);
    if (i === arr.length - 1) c.setAttribute('filter', `drop-shadow(0 0 6px ${c1})`);
  });
  document.querySelectorAll('#g-area stop').forEach(s => s.setAttribute('stop-color', c1));
  document.querySelectorAll('.color-swatch').forEach(x =>
    x.classList.toggle('on', x.dataset.accent === name));
  try { localStorage.setItem('alunoV3_accent', name); } catch(e){}
}
function applyAccentFromStorage(){
  let saved = null; try { saved = localStorage.getItem('alunoV3_accent'); } catch(e){}
  if (saved && PALETTES[saved]) setAccent(saved);
}
function setupAccentPicker(){
  document.querySelectorAll('.color-swatch').forEach(s =>
    s.addEventListener('click', () => setAccent(s.dataset.accent)));
}

function setupLangToggle(){
  document.querySelectorAll('.lang-toggle [data-lang]').forEach(l =>
    l.addEventListener('click', () => {
      LANG = l.dataset.lang;
      try { localStorage.setItem('aluno_lang', LANG); } catch(e){}
      applyI18n();
      renderTreino();
      renderPerfil();
      if (currentScreen === 'evolucao') renderEvolucao();
      if (currentScreen === 'nutricao') renderNutricao();
    }));
}
function applyI18n(){
  document.documentElement.lang = LANG === 'en' ? 'en' : 'pt-PT';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    const v = T(k);
    if (typeof v === 'string') el.innerHTML = v;
  });
  document.querySelectorAll('.lang-toggle [data-lang]').forEach(s =>
    s.classList.toggle('on', s.dataset.lang === LANG));
}

function setupWaterDots(){
  const today = todayISO();
  const stored = lc('water_' + today, 0);
  const dots = document.querySelectorAll('#water-dots .water-dot');
  dots.forEach((d,i) => d.classList.toggle('on', i < stored));
  document.getElementById('water-count').textContent = stored;
  document.getElementById('water-dots').addEventListener('click', ev => {
    const d = ev.target.closest('.water-dot'); if (!d) return;
    const idx = [...dots].indexOf(d);
    const wasOn = d.classList.contains('on');
    const target = wasOn ? idx : (idx + 1);
    dots.forEach((dd,i) => dd.classList.toggle('on', i < target));
    document.getElementById('water-count').textContent = target;
    sc('water_' + today, target);
  });
}

function escapeHTML(s){
  return String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

init();
