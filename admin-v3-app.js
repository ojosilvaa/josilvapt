// ═══════════════════════════════════════════════════════════
//  ADMIN V3  ·  Jo Silva PT
//  Supabase REST · Vanilla JS · no build step
// ═══════════════════════════════════════════════════════════

// ── CONSTANTS ────────────────────────────────────────────
const SB_URL = 'https://oelbocimyfwwzkzbyswg.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbGJvY2lteWZ3d3premJ5c3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMDI2OTksImV4cCI6MjA5MzU3ODY5OX0.S2V54XWWnF58lTQNkvFU9JL1-toCQxacICvtITYL_3E';

const GRADS = [
  'linear-gradient(135deg,#FFD96B,#E5B23A)',
  'linear-gradient(135deg,#5DCA9A,#3aab7b)',
  'linear-gradient(135deg,#FF6B6B,#e04444)',
  'linear-gradient(135deg,#a78bfa,#7c3aed)'
];

const PERI_CAMPOS = [
  {id:'pescoco',label:'Pescoço'},{id:'ombro',label:'Ombro'},{id:'torax',label:'Tórax'},
  {id:'cintura',label:'Cintura'},{id:'abdomen',label:'Abdômen'},{id:'quadril',label:'Quadril'},
  {id:'coxa_d',label:'Coxa D'},{id:'coxa_e',label:'Coxa E'},
  {id:'joelho_d',label:'Joelho D'},{id:'joelho_e',label:'Joelho E'},
  {id:'panturrilha_d',label:'Pant. D'},{id:'panturrilha_e',label:'Pant. E'},
  {id:'braco_d',label:'Braço D'},{id:'braco_e',label:'Braço E'},
  {id:'braco_flex_d',label:'Braço Flex. D'},{id:'braco_flex_e',label:'Braço Flex. E'},
  {id:'antebraco_d',label:'Antebr. D'},{id:'antebraco_e',label:'Antebr. E'}
];

const DAYS_PT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const DAYS_EN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ── STATE ─────────────────────────────────────────────────
let BASE_URL = 'https://ojosilvaa.github.io/josilvapt/aluno-v3.html';
let currentLang = localStorage.getItem('lang') || 'pt';
let currentAlunoId = null;
let currentTreinoId = null;
let exerciciosList = [];
let evoChartInst = null;
let editingMedidaId = null;
let _medidasCache = [];
let _alunosCache = [];
let agendaWeekOffset = 0; // 0=current week
let perioCiclo = 4;
let editingChallengeId = null;

// ── i18n ──────────────────────────────────────────────────
const LANG = {
  pt: {
    nav_dash:'Dashboard',nav_alunos:'Alunos',nav_agenda:'Agenda',nav_feedbacks:'Feedbacks',nav_config:'Config',
    login_err_fill:'Preenche email e senha.',login_err_inv:'Credenciais inválidas.',login_err_conn:'Erro de conexão.',
    badge_ativo:'ATIVO',badge_inativo:'INATIVO',
    t_aluno_criado:'ALUNO CRIADO!',t_nome_obrig:'NOME É OBRIGATÓRIO!',
    t_inativado:'ALUNO INATIVADO',t_ativado:'ALUNO ATIVADO',t_excluido_aluno:'ALUNO EXCLUÍDO',
    t_link_copiado:'LINK COPIADO!',t_treino_salvo:'TREINO SALVO!',t_treino_excluido:'TREINO EXCLUÍDO',
    t_treino_nome_obrig:'NOME DO TREINO É OBRIGATÓRIO!',t_treino_ex_obrig:'ADICIONE PELO MENOS 1 EXERCÍCIO!',
    t_treino_err:'ERRO AO SALVAR',t_data_obrig:'DATA É OBRIGATÓRIA!',t_aval_salva:'AVALIAÇÃO SALVA!',
    t_excluido:'EXCLUÍDO',t_ficha_salva:'FICHA SALVA!',t_todos_lidos:'TODOS MARCADOS COMO LIDOS',
    t_url_salva:'URL SALVA!',t_chave_salva:'CHAVE IA GUARDADA!',t_conn_err:'ERRO DE CONEXÃO',
    t_perio_salva:'PERIODIZAÇÃO SALVA!',t_msg_enviada:'MENSAGEM ENVIADA!',t_msg_vazia:'ESCREVE UMA MENSAGEM!',
    t_challenge_salvo:'DESAFIO CRIADO!',t_challenge_excluido:'DESAFIO EXCLUÍDO',
    t_challenge_atualizado:'DESAFIO ATUALIZADO!',
    fb_resp_vazia:'ESCREVE UMA RESPOSTA!',fb_resp_enviada:'RESPOSTA ENVIADA!',
    confirm_excluir_aluno:'Tem certeza? Todos os dados serão excluídos.',
    confirm_excluir_treino:'Excluir este treino?',confirm_excluir_medida:'Excluir esta avaliação?',
    confirm_excluir_challenge:'Excluir este desafio?',
    days:DAYS_PT,
    novo_treino:'NOVO TREINO',editar_treino:'EDITAR TREINO',
    ev_sel_ex:'Selecione exercício...',
    ev_nenhuma:'Nenhuma sessão registrada.',
    treinos_empty:'Nenhum treino criado. Toque no ＋.',
    alunos_empty:'Nenhum aluno. Toque no ＋ para adicionar.',
    fb_nenhum:'Nenhum feedback dos alunos ainda.',
    med_nova_aval:'NOVA AVALIAÇÃO',med_editar_aval:'EDITAR AVALIAÇÃO',
    med_nenhuma:'Nenhuma avaliação registrada.',
    fb_novo:'NOVO',fb_lido:'LIDO',fb_esforco:'Esforço: ',
    fb_responder:'RESPONDER',fb_editar_resp:'EDITAR RESPOSTA',fb_enviar:'ENVIAR',
    fb_resp_ph:'Escreve a tua resposta...',
    phase_acum:'Acumulação',phase_intens:'Intensificação',phase_deload:'Deload',
    semana:'Semana',
    alerta_dias:'dias sem treinar',
    sess_semana:'Sessões esta semana',
    no_alertas:'Todos os alunos treinaram recentemente.',
    agenda_semana:'Semana',
  },
  en: {
    nav_dash:'Dashboard',nav_alunos:'Students',nav_agenda:'Schedule',nav_feedbacks:'Feedbacks',nav_config:'Settings',
    login_err_fill:'Enter email and password.',login_err_inv:'Invalid credentials.',login_err_conn:'Connection error.',
    badge_ativo:'ACTIVE',badge_inativo:'INACTIVE',
    t_aluno_criado:'STUDENT CREATED!',t_nome_obrig:'NAME IS REQUIRED!',
    t_inativado:'STUDENT DEACTIVATED',t_ativado:'STUDENT ACTIVATED',t_excluido_aluno:'STUDENT DELETED',
    t_link_copiado:'LINK COPIED!',t_treino_salvo:'WORKOUT SAVED!',t_treino_excluido:'WORKOUT DELETED',
    t_treino_nome_obrig:'WORKOUT NAME IS REQUIRED!',t_treino_ex_obrig:'ADD AT LEAST 1 EXERCISE!',
    t_treino_err:'ERROR SAVING',t_data_obrig:'DATE IS REQUIRED!',t_aval_salva:'ASSESSMENT SAVED!',
    t_excluido:'DELETED',t_ficha_salva:'PROFILE SAVED!',t_todos_lidos:'ALL MARKED AS READ',
    t_url_salva:'URL SAVED!',t_chave_salva:'AI KEY SAVED!',t_conn_err:'CONNECTION ERROR',
    t_perio_salva:'PERIODIZATION SAVED!',t_msg_enviada:'MESSAGE SENT!',t_msg_vazia:'WRITE A MESSAGE!',
    t_challenge_salvo:'CHALLENGE CREATED!',t_challenge_excluido:'CHALLENGE DELETED',
    t_challenge_atualizado:'CHALLENGE UPDATED!',
    fb_resp_vazia:'WRITE A REPLY!',fb_resp_enviada:'REPLY SENT!',
    confirm_excluir_aluno:'Are you sure? All data will be deleted.',
    confirm_excluir_treino:'Delete this workout?',confirm_excluir_medida:'Delete this assessment?',
    confirm_excluir_challenge:'Delete this challenge?',
    days:DAYS_EN,
    novo_treino:'NEW WORKOUT',editar_treino:'EDIT WORKOUT',
    ev_sel_ex:'Select exercise...',
    ev_nenhuma:'No sessions logged.',
    treinos_empty:'No workouts. Tap ＋.',
    alunos_empty:'No students. Tap ＋ to add one.',
    fb_nenhum:'No student feedback yet.',
    med_nova_aval:'NEW ASSESSMENT',med_editar_aval:'EDIT ASSESSMENT',
    med_nenhuma:'No assessments recorded.',
    fb_novo:'NEW',fb_lido:'READ',fb_esforco:'Effort: ',
    fb_responder:'REPLY',fb_editar_resp:'EDIT REPLY',fb_enviar:'SEND',
    fb_resp_ph:'Write your reply...',
    phase_acum:'Accumulation',phase_intens:'Intensification',phase_deload:'Deload',
    semana:'Week',
    alerta_dias:'days without training',
    sess_semana:'Sessions this week',
    no_alertas:'All students trained recently.',
    agenda_semana:'Week',
  }
};
const T = key => (LANG[currentLang] || LANG.pt)[key] ?? LANG.pt[key] ?? key;

function setLang(l) {
  currentLang = l;
  localStorage.setItem('lang', l);
  document.getElementById('lang-pt-btn').style.opacity = l === 'pt' ? '1' : '.4';
  document.getElementById('lang-en-btn').style.opacity = l === 'en' ? '1' : '.4';
}

// ── STORAGE ───────────────────────────────────────────────
const lc = (k, d) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; } catch(e) { return d; } };
const sc = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} };

function loadConfig() {
  // Força sempre o URL correcto, ignorando cache antigo
  const stored = lc('base_url', '');
  if (!stored || stored.includes('aluno.html') || !stored.includes('aluno-v3')) {
    sc('base_url', 'https://ojosilvaa.github.io/josilvapt/aluno-v3.html');
  }
  BASE_URL = lc('base_url', 'https://ojosilvaa.github.io/josilvapt/aluno-v3.html');
  const b = document.getElementById('cfg-base-url');
  if (b) b.value = BASE_URL;
}

// ── UTILS ─────────────────────────────────────────────────
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

// Decodes the Supabase JWT to extract the logged-in PT's UUID
const getCurrentPtId = () => {
  try {
    const tok = getToken();
    if (!tok) return null;
    return JSON.parse(atob(tok.split('.')[1])).sub || null;
  } catch(e) { return null; }
};

const toast = msg => {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
};

const initials = name => (name || '?').split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();

const formatDate = d => {
  if (!d) return '—';
  const p = d.split('T')[0].split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d;
};

const todayISO = () => new Date().toISOString().split('T')[0];

const daysAgo = isoDate => {
  if (!isoDate) return 999;
  return Math.floor((Date.now() - new Date(isoDate)) / 86400000);
};

const avClass = (name, i) => {
  const idx = (name || '').charCodeAt(0) % 4;
  return `av-${idx}`;
};

const avStyle = name => {
  const idx = (name || '').charCodeAt(0) % 4;
  return `background:${GRADS[idx]}`;
};

// Monday-based week start
function getWeekStart(offset = 0) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7) + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function weekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// ── TOKEN ─────────────────────────────────────────────────
function getToken() { return sessionStorage.getItem('sb_access_token'); }
function getRefresh() { return localStorage.getItem('sb_refresh_token'); }

async function refreshSession() {
  const rt = getRefresh();
  if (!rt) return false;
  try {
    const r = await fetch(SB_URL + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: rt })
    });
    if (!r.ok) { localStorage.removeItem('sb_refresh_token'); return false; }
    const d = await r.json();
    sessionStorage.setItem('sb_access_token', d.access_token);
    localStorage.setItem('sb_refresh_token', d.refresh_token);
    return true;
  } catch(e) { return false; }
}

// ── SUPABASE ──────────────────────────────────────────────
async function sbFetch(path, opts = {}) {
  const doReq = async token => fetch(SB_URL + '/rest/v1/' + path, {
    headers: {
      'apikey': SB_KEY,
      'Authorization': 'Bearer ' + (token || SB_KEY),
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(opts.headers || {})
    },
    ...opts
  });
  try {
    let r = await doReq(getToken());
    if (r.status === 401) {
      const ok = await refreshSession();
      if (ok) r = await doReq(getToken());
      else if (!r.ok) return null;
    }
    if (!r.ok) { console.error(await r.text()); return null; }
    const ct = r.headers.get('content-type');
    return ct && ct.includes('json') ? await r.json() : [];
  } catch(e) { console.error(e); toast(T('t_conn_err')); return null; }
}

// ── AUTH ──────────────────────────────────────────────────
async function recuperarSenha() {
  const email = document.getElementById('login-email').value.trim().toLowerCase() || 'ptjuklebson@gmail.com';
  const err = document.getElementById('login-err');
  err.style.color = '';
  err.textContent = 'A enviar email de recuperação...';
  try {
    const r = await fetch(SB_URL + '/auth/v1/recover', {
      method: 'POST',
      headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (r.ok) {
      err.style.color = 'var(--green, #5DCA9A)';
      err.textContent = `✓ Email enviado para ${email} — verifica a caixa de entrada`;
    } else {
      err.textContent = 'Erro ao enviar email. Tenta novamente.';
    }
  } catch(e) { err.textContent = 'Erro de ligação.'; }
}

async function doLogin() {
  let user = document.getElementById('login-email').value.trim().toLowerCase();
  const senha = document.getElementById('login-senha').value;
  const err = document.getElementById('login-err');
  err.textContent = '';
  if (!user || !senha) { err.textContent = T('login_err_fill'); return; }
  // normaliza username para email
  if (!user.includes('@')) {
    if (user === 'josilva') user = 'josilva@crm.local';
    else user = user + '@crm.local';
  }
  try {
    const r = await fetch(SB_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'apikey': SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user, password: senha })
    });
    const d = await r.json();
    if (!r.ok || d.error) { err.textContent = T('login_err_inv'); return; }
    sessionStorage.setItem('sb_access_token', d.access_token);
    localStorage.setItem('sb_refresh_token', d.refresh_token);
    showApp();
  } catch(e) { err.textContent = T('login_err_conn'); }
}

function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  loadConfig();
  setLang(currentLang);
  renderDash();
}

async function logout() {
  const token = getToken();
  if (token) {
    try {
      await fetch(SB_URL + '/auth/v1/logout', {
        method: 'POST',
        headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
      });
    } catch(e) {}
  }
  sessionStorage.removeItem('sb_access_token');
  localStorage.removeItem('sb_refresh_token');
  location.reload();
}

// ── NAVIGATION ────────────────────────────────────────────
function goTab(tab) {
  document.querySelectorAll('.screen').forEach(s => { s.style.display = 'none'; s.classList.remove('active'); });
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
  const screen = document.getElementById('screen-' + tab);
  if (screen) { screen.style.display = 'block'; screen.classList.add('active'); }
  const navBtn = document.getElementById('nav-' + tab);
  if (navBtn) navBtn.classList.add('active');
  if (tab === 'dash') renderDash();
  if (tab === 'alunos') { openView('lista'); renderAlunos(); }
  if (tab === 'agenda') renderAgenda();
  if (tab === 'feedbacks') renderFeedbacks();
  if (tab === 'config') { loadConfig(); renderChallenges(); }
  window.scrollTo(0, 0);
}

// ── ALUNOS VIEWS ─────────────────────────────────────────
function openView(view) {
  ['lista', 'novo', 'detalhe'].forEach(v => {
    const el = document.getElementById('view-' + v);
    if (el) el.style.display = 'none';
  });
  const el = document.getElementById('view-' + view);
  if (el) el.style.display = 'block';
  if (view === 'lista') renderAlunos();
  window.scrollTo(0, 0);
}

// ── DASHBOARD ─────────────────────────────────────────────
async function renderDash() {
  const [alunos, sessoes, feedbacks] = await Promise.all([
    sbFetch('alunos?select=id,nome,ativo,criado_em&order=nome.asc') || [],
    sbFetch('sessoes?select=id,aluno_id,data,treino_nome,alunos(nome)&order=data.desc&limit=200') || [],
    sbFetch('feedbacks?lido=eq.false&select=id') || []
  ]);

  const alunosArr = alunos || [];
  const sessoesArr = sessoes || [];
  const fbCount = (feedbacks || []).length;

  _alunosCache = alunosArr;

  // Badge
  const badge = document.getElementById('feedback-badge');
  if (badge) { badge.textContent = fbCount; badge.style.display = fbCount > 0 ? 'flex' : 'none'; }

  // Week range for this week (Mon-Sun)
  const weekStart = getWeekStart(0);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 6); weekEnd.setHours(23, 59, 59, 999);

  const sesSemana = sessoesArr.filter(s => {
    if (!s.data) return false;
    const d = new Date(s.data);
    return d >= weekStart && d <= weekEnd;
  });

  const ativos = alunosArr.filter(a => a.ativo).length;

  // Onboarding card — show only if zero students
  const obCard = document.getElementById('dash-onboarding');
  if (obCard) {
    obCard.style.display = alunosArr.length === 0 ? 'block' : 'none';
    if (alunosArr.length === 0) {
      // Calculate trial days remaining from subscricoes (stored as JWT claim or just use 14)
      try {
        const tok = getToken();
        if (tok) {
          const payload = JSON.parse(atob(tok.split('.')[1]));
          const createdAt = payload.iat ? new Date(payload.iat * 1000) : new Date();
          const trialEnd = new Date(createdAt.getTime() + 14 * 24 * 60 * 60 * 1000);
          const daysLeft = Math.max(0, Math.ceil((trialEnd - Date.now()) / 86400000));
          const el = document.getElementById('ob-trial-days');
          if (el) el.textContent = daysLeft;
        }
      } catch(e) {}
    }
  }

  // Stats
  document.getElementById('dash-stats').innerHTML = `
    <div class="stat-card"><div class="stat-val">${alunosArr.length}</div><div class="stat-lbl">Total Alunos</div></div>
    <div class="stat-card"><div class="stat-val">${ativos}</div><div class="stat-lbl">Ativos</div></div>
    <div class="stat-card"><div class="stat-val">${sesSemana.length}</div><div class="stat-lbl">${T('sess_semana')}</div></div>
    <div class="stat-card"><div class="stat-val">${fbCount}</div><div class="stat-lbl">Feedbacks novos</div></div>`;

  // Alertas — alunos without session in 5+ days
  const lastSessaoByAluno = {};
  sessoesArr.forEach(s => {
    if (!lastSessaoByAluno[s.aluno_id] || s.data > lastSessaoByAluno[s.aluno_id]) {
      lastSessaoByAluno[s.aluno_id] = s.data;
    }
  });

  const alertas = alunosArr.filter(a => a.ativo).filter(a => {
    const last = lastSessaoByAluno[a.id];
    return daysAgo(last) >= 5;
  }).sort((a, b) => daysAgo(lastSessaoByAluno[b.id]) - daysAgo(lastSessaoByAluno[a.id]));

  const alertasEl = document.getElementById('dash-alertas');
  if (!alertas.length) {
    alertasEl.innerHTML = `<div style="padding:12px 14px;background:var(--surface-1);border:1px solid var(--hairline);border-radius:14px;font-size:13px;color:var(--text-3);font-weight:500">✓ ${T('no_alertas')}</div>`;
  } else {
    alertasEl.innerHTML = alertas.map(a => {
      const days = daysAgo(lastSessaoByAluno[a.id]);
      return `<div class="alerta-item" onclick="goTab('alunos');openAluno('${a.id}')">
        <div class="av av-sm" style="${avStyle(a.nome)}">${esc(initials(a.nome))}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(a.nome)}</div>
        </div>
        <span class="alerta-pill">${days === 999 ? 'sem treino' : days + ' ' + T('alerta_dias')}</span>
      </div>`;
    }).join('');
  }

  // Weekly activity grid
  renderWeekGrid(sessoesArr, alunosArr, 0, 'dash-week-grid');

  // Recent feedbacks
  const fbRecent = await sbFetch('feedbacks?order=criado_em.desc&limit=3&select=*,alunos(nome)') || [];
  const fbEl = document.getElementById('dash-fbs-recent');
  if (!fbRecent.length) {
    fbEl.innerHTML = `<div class="empty" style="padding:20px;font-size:13px">${T('fb_nenhum')}</div>`;
  } else {
    fbEl.innerHTML = fbRecent.map(f => renderFbCard(f, true)).join('');
  }
}

function renderWeekGrid(sessoesArr, alunosArr, offset, containerId) {
  const weekStart = getWeekStart(offset);
  const container = document.getElementById(containerId);
  if (!container) return;

  const days = T('days'); // ['Dom','Seg',...]
  // We show Mon-Sun, Mon = index 1 in JS
  // Build cols for Mon(1) to Sun(0+7=7)
  const cols = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
    const isoDay = d.toISOString().split('T')[0];
    // sessions on this day
    const daySess = sessoesArr.filter(s => s.data && s.data.split('T')[0] === isoDay);
    const uniqueAlunos = [...new Map(daySess.map(s => [s.aluno_id, s])).values()];
    const dayName = days[(d.getDay())]; // getDay returns 0=Sun
    cols.push({ dayName, dayNum: d.getDate(), alunos: uniqueAlunos, isoDay });
  }

  container.innerHTML = cols.map(col => `
    <div class="week-col">
      <div class="week-day-lbl">${col.dayName}</div>
      <div class="week-avatars">
        ${col.alunos.slice(0, 4).map(s => {
          const a = alunosArr.find(x => x.id === s.aluno_id);
          const name = a ? a.nome : (s.alunos?.nome || '?');
          return `<div class="week-mini-av" style="${avStyle(name)}" title="${name}" onclick="goTab('alunos');openAluno('${s.aluno_id}')">${initials(name)}</div>`;
        }).join('')}
        ${col.alunos.length > 4 ? `<div style="font-size:9px;color:var(--text-3);font-weight:700;margin-top:2px">+${col.alunos.length - 4}</div>` : ''}
      </div>
    </div>`).join('');
}

// ── ALUNOS LIST ───────────────────────────────────────────
let _alunosAll = [];

async function renderAlunos() {
  const alunos = await sbFetch('alunos?order=nome.asc') || [];
  _alunosAll = alunos;
  _alunosCache = alunos;
  renderAlunoCards(alunos);
}

function filterAlunos(q) {
  const filtered = _alunosAll.filter(a => a.nome.toLowerCase().includes(q.toLowerCase()));
  renderAlunoCards(filtered);
}

async function renderAlunoCards(alunos) {
  const el = document.getElementById('alunos-list');
  if (!el) return;
  if (!alunos.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">👤</div>${T('alunos_empty')}</div>`;
    return;
  }

  // Get last sessions for inactive badge
  const ids = alunos.map(a => `'${a.id}'`).join(',');
  let sessoes = [];
  if (ids.length) {
    sessoes = await sbFetch(`sessoes?aluno_id=in.(${alunos.map(a => a.id).join(',')})&select=aluno_id,data&order=data.desc&limit=400`) || [];
  }
  const lastByAluno = {};
  sessoes.forEach(s => { if (!lastByAluno[s.aluno_id]) lastByAluno[s.aluno_id] = s.data; });

  el.innerHTML = alunos.map((a, i) => {
    const last = lastByAluno[a.id];
    const inactive5 = daysAgo(last) >= 5;
    return `<div class="aluno-card" style="animation:fadeUp .3s ease ${i * 0.06}s both" onclick="openAluno('${a.id}')">
      <div class="av" style="${avStyle(a.nome)}">${esc(initials(a.nome))}</div>
      <div class="aluno-info">
        <div class="aluno-nome">${esc(a.nome)}</div>
        <div class="aluno-sub">${esc([a.objetivo, a.modalidade].filter(Boolean).join(' · '))}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="badge ${a.ativo ? 'badge-green' : 'badge-gray'}">${a.ativo ? T('badge_ativo') : T('badge_inativo')}</span>
          ${a.plano ? `<span class="badge badge-gold">${a.plano}</span>` : ''}
          ${inactive5 && a.ativo ? `<span class="badge badge-coral">${daysAgo(last) === 999 ? 'sem treino' : daysAgo(last) + 'd sem treinar'}</span>` : ''}
        </div>
      </div>
      <div class="chevron"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></div>
    </div>`;
  }).join('');
}

async function criarAluno() {
  const nome = document.getElementById('na-nome').value.trim();
  if (!nome) { toast(T('t_nome_obrig')); return; }
  const data = {
    nome,
    email: document.getElementById('na-email').value,
    telefone: document.getElementById('na-tel').value,
    objetivo: document.getElementById('na-obj').value,
    modalidade: document.getElementById('na-mod').value,
    plano: document.getElementById('na-plano').value,
    obs: document.getElementById('na-obs').value,
    ativo: true,
    pt_id: getCurrentPtId()
  };
  const res = await sbFetch('alunos', { method: 'POST', body: JSON.stringify(data) });
  if (res) {
    toast(T('t_aluno_criado'));
    ['na-nome', 'na-email', 'na-tel', 'na-obs'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    ['na-obj', 'na-mod', 'na-plano'].forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
    openView('lista');
  }
}

async function openAluno(id) {
  currentAlunoId = id;
  const alunos = await sbFetch(`alunos?id=eq.${id}`) || [];
  const a = alunos[0]; if (!a) return;

  const avEl = document.getElementById('det-avatar');
  avEl.textContent = initials(a.nome);
  avEl.className = 'av av-lg';
  avEl.style.background = GRADS[a.nome.charCodeAt(0) % 4];

  document.getElementById('det-nome').textContent = a.nome;
  document.getElementById('det-sub').textContent = [a.objetivo, a.modalidade, a.plano].filter(Boolean).join(' · ');
  document.getElementById('det-link-url').textContent = `${BASE_URL}?id=${id}`;

  openView('detalhe');
  showTab('treinos');
}

function copyLink() {
  const url = document.getElementById('det-link-url').textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => toast(T('t_link_copiado')));
  } else {
    const t = document.createElement('textarea');
    t.value = url; document.body.appendChild(t); t.select(); document.execCommand('copy');
    document.body.removeChild(t); toast(T('t_link_copiado'));
  }
}

async function toggleAtivo() {
  const alunos = await sbFetch(`alunos?id=eq.${currentAlunoId}`) || [];
  const a = alunos[0]; if (!a) return;
  await sbFetch(`alunos?id=eq.${currentAlunoId}`, { method: 'PATCH', body: JSON.stringify({ ativo: !a.ativo }) });
  toast(a.ativo ? T('t_inativado') : T('t_ativado'));
  openAluno(currentAlunoId);
}

async function deletarAluno() {
  if (!confirm(T('confirm_excluir_aluno'))) return;
  await sbFetch(`sessao_cargas?sessao_id=in.(select id from sessoes where aluno_id=eq.${currentAlunoId})`, { method: 'DELETE' });
  await sbFetch(`sessoes?aluno_id=eq.${currentAlunoId}`, { method: 'DELETE' });
  await sbFetch(`exercicios?treino_id=in.(select id from treinos where aluno_id=eq.${currentAlunoId})`, { method: 'DELETE' });
  await sbFetch(`treinos?aluno_id=eq.${currentAlunoId}`, { method: 'DELETE' });
  await sbFetch(`perimetria?aluno_id=eq.${currentAlunoId}`, { method: 'DELETE' });
  await sbFetch(`anamnese?aluno_id=eq.${currentAlunoId}`, { method: 'DELETE' });
  await sbFetch(`periodizacao?aluno_id=eq.${currentAlunoId}`, { method: 'DELETE' }).catch(() => {});
  await sbFetch(`mensagens_pt?aluno_id=eq.${currentAlunoId}`, { method: 'DELETE' }).catch(() => {});
  await sbFetch(`alunos?id=eq.${currentAlunoId}`, { method: 'DELETE' });
  toast(T('t_excluido_aluno')); openView('lista');
}

// ── DETAIL TABS ───────────────────────────────────────────
function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#det-tabs .tab').forEach(t => t.classList.remove('active'));
  const content = document.getElementById('tab-' + tab);
  if (content) content.classList.add('active');
  // find matching tab button
  const tabMap = ['treinos', 'evolucao', 'medidas', 'periodizacao', 'perfil'];
  const idx = tabMap.indexOf(tab);
  const tabBtns = document.querySelectorAll('#det-tabs .tab');
  if (tabBtns[idx]) tabBtns[idx].classList.add('active');
  // Show/hide FAB
  const fab = document.getElementById('fab-treino');
  if (fab) fab.style.display = tab === 'treinos' ? 'flex' : 'none';
  // Load
  if (tab === 'treinos') renderTreinos();
  if (tab === 'evolucao') renderEvolucao();
  if (tab === 'medidas') renderMedidas();
  if (tab === 'periodizacao') renderPeriodizacao();
  if (tab === 'perfil') renderPerfil();
}

// ── TREINOS ───────────────────────────────────────────────
function showNovoTreino() {
  document.getElementById('novo-treino-form').style.display = 'block';
  document.getElementById('form-treino-title').textContent = T('novo_treino');
  document.getElementById('nt-nome').value = '';
  document.getElementById('nt-desc').value = '';
  exerciciosList = []; renderExList(); currentTreinoId = null;
  document.getElementById('novo-treino-form').scrollIntoView({ behavior: 'smooth' });
}

function cancelarTreino() {
  document.getElementById('novo-treino-form').style.display = 'none';
  currentTreinoId = null;
}

function addExercicio() {
  exerciciosList.push({ nome: '', obs: '', series: '3', reps: '10-12', video_url: '' });
  renderExList();
}

function renderExList() {
  const el = document.getElementById('ex-list');
  if (!exerciciosList.length) {
    el.innerHTML = `<div style="font-size:13px;color:var(--text-3);padding:12px 0;font-weight:500">Nenhum exercício adicionado ainda.</div>`;
    return;
  }
  el.innerHTML = exerciciosList.map((ex, i) => `
    <div class="ex-card">
      <button class="ex-del" onclick="exerciciosList.splice(${i},1);renderExList()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="ex-num-lbl">EX ${String(i + 1).padStart(2, '0')}</div>
      <div class="form-group" style="margin:0 0 8px"><input class="form-inp" placeholder="Nome do exercício" value="${esc(ex.nome || '')}" oninput="exerciciosList[${i}].nome=this.value"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
        <div><label class="form-label">Séries</label><input class="form-inp" placeholder="3" value="${esc(ex.series || '3')}" oninput="exerciciosList[${i}].series=this.value"></div>
        <div><label class="form-label">Reps</label><input class="form-inp" placeholder="10-12" value="${esc(ex.reps || '10-12')}" oninput="exerciciosList[${i}].reps=this.value"></div>
      </div>
      <div class="form-group" style="margin:0 0 8px"><input class="form-inp" placeholder="Observações (opcional)" value="${esc(ex.obs || '')}" oninput="exerciciosList[${i}].obs=this.value"></div>
      <div class="form-group" style="margin:0"><input class="form-inp" placeholder="Link do vídeo YouTube (opcional)" value="${esc(ex.video_url || '')}" oninput="exerciciosList[${i}].video_url=this.value"></div>
    </div>`).join('');
}

async function salvarTreino() {
  const nome = document.getElementById('nt-nome').value.trim();
  if (!nome) { toast(T('t_treino_nome_obrig')); return; }
  const exValidos = exerciciosList.filter(e => e.nome.trim());
  if (!exValidos.length) { toast(T('t_treino_ex_obrig')); return; }
  let treinoId = currentTreinoId;
  if (treinoId) {
    await sbFetch(`treinos?id=eq.${treinoId}`, { method: 'PATCH', body: JSON.stringify({ nome, descricao: document.getElementById('nt-desc').value }) });
    await sbFetch(`exercicios?treino_id=eq.${treinoId}`, { method: 'DELETE' });
  } else {
    const ex = await sbFetch(`treinos?aluno_id=eq.${currentAlunoId}&select=ordem&order=ordem.desc&limit=1`) || [];
    const nextOrdem = (ex[0]?.ordem || 0) + 1;
    const res = await sbFetch('treinos', { method: 'POST', body: JSON.stringify({ aluno_id: currentAlunoId, nome, descricao: document.getElementById('nt-desc').value, ordem: nextOrdem }) });
    if (!res || !res[0]) { toast(T('t_treino_err')); return; }
    treinoId = res[0].id;
  }
  for (let i = 0; i < exValidos.length; i++) {
    await sbFetch('exercicios', { method: 'POST', body: JSON.stringify({ treino_id: treinoId, ordem: i + 1, nome: exValidos[i].nome.trim(), obs: exValidos[i].obs || '', series: exValidos[i].series, reps: exValidos[i].reps, video_url: exValidos[i].video_url || null }) });
  }
  toast(T('t_treino_salvo')); cancelarTreino(); renderTreinos();
}

async function renderTreinos() {
  const treinos = await sbFetch(`treinos?aluno_id=eq.${currentAlunoId}&order=ordem.asc`) || [];
  const el = document.getElementById('treinos-list');
  if (!treinos.length) { el.innerHTML = `<div class="empty"><div class="empty-icon">📋</div>${T('treinos_empty')}</div>`; return; }
  el.innerHTML = treinos.map(t => `
    <div class="treino-card">
      <div class="treino-nome">${esc(t.nome)}</div>
      <div class="treino-sub">${esc(t.descricao || '')}</div>
      <div class="treino-actions">
        <button class="btn btn-sm btn-outline-gold" style="flex:1" onclick="editarTreino('${t.id}')">EDITAR</button>
        <button class="btn btn-sm btn-danger" onclick="deletarTreino('${t.id}')">EXCLUIR</button>
      </div>
    </div>`).join('');
}

async function editarTreino(id) {
  currentTreinoId = id;
  const treinos = await sbFetch(`treinos?id=eq.${id}`) || [];
  const t = treinos[0]; if (!t) return;
  const exs = await sbFetch(`exercicios?treino_id=eq.${id}&order=ordem.asc`) || [];
  document.getElementById('novo-treino-form').style.display = 'block';
  document.getElementById('form-treino-title').textContent = T('editar_treino');
  document.getElementById('nt-nome').value = t.nome;
  document.getElementById('nt-desc').value = t.descricao || '';
  exerciciosList = exs.map(e => ({ nome: e.nome, obs: e.obs || '', series: e.series || '3', reps: e.reps || '10-12', video_url: e.video_url || '' }));
  renderExList();
  document.getElementById('novo-treino-form').scrollIntoView({ behavior: 'smooth' });
}

async function deletarTreino(id) {
  if (!confirm(T('confirm_excluir_treino'))) return;
  await sbFetch(`exercicios?treino_id=eq.${id}`, { method: 'DELETE' });
  await sbFetch(`treinos?id=eq.${id}`, { method: 'DELETE' });
  toast(T('t_treino_excluido')); renderTreinos();
}

// ── EVOLUÇÃO ─────────────────────────────────────────────
async function renderEvolucao() {
  const sessoes = await sbFetch(`sessoes?aluno_id=eq.${currentAlunoId}&order=data.desc`) || [];
  const ids = sessoes.map(s => s.id);
  const todas_cargas = ids.length
    ? await sbFetch(`sessao_cargas?sessao_id=in.(${ids.join(',')})&select=*,exercicios(nome,treinos(nome))&order=sessoes(data).asc`) || []
    : [];

  const maxCarga = todas_cargas.length ? Math.max(...todas_cargas.map(c => c.carga_kg || 0)) : 0;

  // Stats
  let streak = 0, maxS = 0, cur = 0;
  if (sessoes.length) {
    const sorted = [...sessoes].sort((a, b) => new Date(a.data) - new Date(b.data));
    cur = 1; maxS = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diffDays = Math.round((new Date(sorted[i].data) - new Date(sorted[i-1].data)) / 86400000);
      if (diffDays <= 2) { cur++; if (cur > maxS) maxS = cur; }
      else cur = 1;
    }
    streak = maxS;
  }

  const exMap = {};
  todas_cargas.forEach(c => { if (c.exercicios) exMap[c.exercicio_id] = c.exercicios.nome; });

  document.getElementById('det-stats').innerHTML = `
    <div class="stat-card"><div class="stat-val">${sessoes.length}</div><div class="stat-lbl">Sessões</div></div>
    <div class="stat-card"><div class="stat-val">${sessoes.length ? formatDate(sessoes[0].data) : '—'}</div><div class="stat-lbl" style="font-size:9px">Última sessão</div></div>
    <div class="stat-card"><div class="stat-val">${streak}</div><div class="stat-lbl">Melhor streak</div></div>
    <div class="stat-card"><div class="stat-val">${maxCarga ? maxCarga.toFixed(1) : '—'}</div><div class="stat-lbl">Maior carga kg</div></div>`;

  const sel = document.getElementById('ev-select');
  sel.innerHTML = `<option value="">${T('ev_sel_ex')}</option>`;
  Object.entries(exMap).forEach(([id, nome]) => {
    const o = document.createElement('option'); o.value = id; o.textContent = nome; sel.appendChild(o);
  });

  // Session history
  const hist = document.getElementById('sessoes-hist');
  if (!sessoes.length) { hist.innerHTML = `<div class="empty">${T('ev_nenhuma')}</div>`; }
  else {
    hist.innerHTML = sessoes.slice(0, 20).map(s => {
      const cargas = todas_cargas.filter(c => c.sessao_id === s.id);
      const max = cargas.length ? Math.max(...cargas.map(c => c.carga_kg || 0)) : 0;
      return `<div class="hist-item">
        <div><div class="hist-label">${s.treino_nome || 'Treino'}</div><div class="hist-sub">${formatDate(s.data)}</div></div>
        <div class="hist-val">${max ? max.toFixed(1) + 'kg' : '—'}</div>
      </div>`;
    }).join('');
  }

  renderFotosAluno();
}

async function renderEvoChart() {
  const exId = document.getElementById('ev-select').value; if (!exId) return;
  const sessoes = await sbFetch(`sessoes?aluno_id=eq.${currentAlunoId}&order=data.asc`) || [];
  if (!sessoes.length) return;
  const ids = sessoes.map(s => s.id).join(',');
  const cargas = await sbFetch(`sessao_cargas?exercicio_id=eq.${exId}&sessao_id=in.(${ids})&select=*,sessoes(data)&order=sessoes(data).asc`) || [];
  if (evoChartInst) { evoChartInst.destroy(); evoChartInst = null; }
  if (!cargas.length) return;
  const ctx = document.getElementById('evoChart').getContext('2d');
  evoChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels: cargas.map(c => formatDate(c.sessoes?.data || '')),
      datasets: [{ label: 'Carga (kg)', data: cargas.map(c => c.carga_kg), borderColor: '#FFD96B', backgroundColor: 'rgba(255,217,107,0.08)', pointBackgroundColor: '#FFD96B', pointRadius: 5, tension: 0.3, fill: true }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: 'rgba(255,255,255,.38)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,.06)' } },
        y: { ticks: { color: 'rgba(255,255,255,.38)', font: { size: 10 }, callback: v => v + 'kg' }, grid: { color: 'rgba(255,255,255,.06)' } }
      }
    }
  });
}

// ── COMPARATIVO ───────────────────────────────────────────
async function renderComparativo() {
  const dateA = document.getElementById('cmp-date-a').value;
  const dateB = document.getElementById('cmp-date-b').value;
  const el = document.getElementById('cmp-result');
  if (!dateA || !dateB) { el.innerHTML = ''; return; }

  const avs = await sbFetch(`perimetria?aluno_id=eq.${currentAlunoId}&order=data.desc`) || [];
  const findNearest = (target) => avs.reduce((best, av) => {
    if (!best) return av;
    return Math.abs(new Date(av.data) - new Date(target)) < Math.abs(new Date(best.data) - new Date(target)) ? av : best;
  }, null);

  const medA = findNearest(dateA);
  const medB = findNearest(dateB);
  if (!medA || !medB) { el.innerHTML = `<div style="font-size:13px;color:var(--text-3);text-align:center;padding:12px">Dados insuficientes para comparação.</div>`; return; }

  const fields = [
    { key: 'peso', label: 'Peso', unit: 'kg', src: 'root' },
    { key: 'gordura', label: '% Gordura', unit: '%', src: 'root' },
    { key: 'massa_magra', label: 'Massa Magra', unit: 'kg', src: 'root' },
    ...PERI_CAMPOS.map(c => ({ key: c.id, label: c.label, unit: 'cm', src: 'medidas' }))
  ];

  const getVal = (med, f) => {
    if (f.src === 'root') return parseFloat(med[f.key]) || null;
    return parseFloat(med.medidas?.[f.key]) || null;
  };

  const rows = fields.filter(f => getVal(medA, f) !== null || getVal(medB, f) !== null).map(f => {
    const vA = getVal(medA, f); const vB = getVal(medB, f);
    if (vA === null && vB === null) return '';
    const diff = (vA !== null && vB !== null) ? (vB - vA).toFixed(1) : null;
    let cls = 'flat', sign = '';
    if (diff !== null) {
      const n = parseFloat(diff);
      if (n < 0) { cls = 'pos'; sign = ''; } // down = good for fat/perimeters
      else if (n > 0) { cls = 'neg'; sign = '+'; }
      if (f.key === 'massa_magra') { cls = n > 0 ? 'pos' : (n < 0 ? 'neg' : 'flat'); }
    }
    return `<div class="hist-item">
      <div class="hist-label">${f.label}</div>
      <div style="display:flex;align-items:center;gap:10px">
        ${diff !== null ? `<span class="cmp-delta-badge ${cls}">${sign}${diff}${f.unit}</span>` : ''}
        <div style="display:flex;gap:6px;align-items:baseline">
          <span style="font-size:12px;color:var(--text-3);font-weight:600">${vA !== null ? vA + f.unit : '—'}</span>
          <span style="font-size:11px;color:var(--text-3)">→</span>
          <span class="hist-val" style="font-size:16px">${vB !== null ? vB + f.unit : '—'}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:11px;color:var(--text-3);font-weight:700;letter-spacing:.08em">
      <span>DE ${formatDate(medA.data)}</span><span>PARA ${formatDate(medB.data)}</span>
    </div>
    ${rows || '<div class="empty" style="padding:12px">Sem dados comuns para comparar.</div>'}`;
}

// ── MEDIDAS ───────────────────────────────────────────────
async function renderMedidas() {
  document.getElementById('peri-inputs').innerHTML = PERI_CAMPOS.map(c => `
    <div class="peri-item">
      <div class="peri-lbl">${c.label}</div>
      <input class="peri-inp" type="number" step="0.1" id="pm-${c.id}" placeholder="—">
      <div class="peri-unit">cm</div>
    </div>`).join('');
  if (!editingMedidaId) document.getElementById('pm-data').value = todayISO();

  const avs = await sbFetch(`perimetria?aluno_id=eq.${currentAlunoId}&order=data.desc`) || [];
  _medidasCache = avs;
  const el = document.getElementById('medidas-hist');
  if (!avs.length) { el.innerHTML = `<div class="empty">${T('med_nenhuma')}</div>`; return; }

  el.innerHTML = avs.map((av, idx) => {
    const prev = avs[idx + 1];
    const med = av.medidas || {};
    const bioCards = [
      av.peso ? `<div class="stat-card" style="flex:1;min-width:70px;padding:10px"><div class="stat-val" style="font-size:18px;font-family:'JetBrains Mono',monospace">${av.peso}</div><div class="stat-lbl">Peso kg</div></div>` : '',
      med.bio_imc ? `<div class="stat-card" style="flex:1;min-width:70px;padding:10px"><div class="stat-val" style="font-size:18px;font-family:'JetBrains Mono',monospace">${med.bio_imc}</div><div class="stat-lbl">IMC</div></div>` : '',
      av.gordura ? `<div class="stat-card" style="flex:1;min-width:70px;padding:10px"><div class="stat-val" style="font-size:18px;font-family:'JetBrains Mono',monospace">${av.gordura}%</div><div class="stat-lbl">Gordura</div></div>` : '',
      av.massa_magra ? `<div class="stat-card" style="flex:1;min-width:70px;padding:10px"><div class="stat-val" style="font-size:18px;font-family:'JetBrains Mono',monospace">${av.massa_magra}</div><div class="stat-lbl">Massa Magra</div></div>` : '',
      med.bio_gord_visc ? `<div class="stat-card" style="flex:1;min-width:70px;padding:10px"><div class="stat-val" style="font-size:18px;font-family:'JetBrains Mono',monospace">${med.bio_gord_visc}</div><div class="stat-lbl">Visceral</div></div>` : '',
      med.bio_tmb ? `<div class="stat-card" style="flex:1;min-width:70px;padding:10px"><div class="stat-val" style="font-size:18px;font-family:'JetBrains Mono',monospace">${med.bio_tmb}</div><div class="stat-lbl">TMB kcal</div></div>` : '',
    ].filter(Boolean).join('');

    return `<div class="card" style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="card-title" style="margin:0">${formatDate(av.data)}</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm btn-outline-gold" onclick="editarMedida('${av.id}')">EDITAR</button>
          <button class="btn btn-sm btn-danger" onclick="deletarMedida('${av.id}')">✕</button>
        </div>
      </div>
      ${bioCards ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">${bioCards}</div>` : ''}
      ${PERI_CAMPOS.filter(c => med[c.id]).map(c => {
        const cur = med[c.id]; const prevV = prev?.medidas?.[c.id];
        let delta = '', cls = 'zero';
        if (prevV !== undefined) { const d = (cur - prevV).toFixed(1); delta = (d > 0 ? '+' : '') + d + 'cm'; cls = d < 0 ? 'pos' : (d > 0 ? 'neg' : 'zero'); }
        return `<div class="hist-item">
          <div class="hist-label">${c.label}</div>
          <div style="display:flex;align-items:center;gap:10px">
            ${delta ? `<span class="pchange ${cls}">${delta}</span>` : ''}
            <div class="hist-val">${cur}cm</div>
          </div>
        </div>`;
      }).join('')}
      ${av.obs ? `<div style="margin-top:10px;font-size:13px;color:var(--text-2);padding:10px;border-left:3px solid var(--gold);background:var(--surface-1);border-radius:0 8px 8px 0;line-height:1.5">${esc(av.obs)}</div>` : ''}
    </div>`;
  }).join('');
}

function editarMedida(id) {
  const av = _medidasCache.find(x => x.id === id); if (!av) return;
  editingMedidaId = av.id;
  const med = av.medidas || {};
  document.getElementById('pm-id').value = av.id;
  document.getElementById('pm-data').value = av.data;
  document.getElementById('pm-peso').value = av.peso || '';
  document.getElementById('pm-imc').value = med.bio_imc || '';
  document.getElementById('pm-gord').value = av.gordura || '';
  document.getElementById('pm-gord-abs').value = med.bio_gord_abs || '';
  document.getElementById('pm-massa').value = av.massa_magra || '';
  document.getElementById('pm-gord-visc').value = med.bio_gord_visc || '';
  document.getElementById('pm-tmb').value = med.bio_tmb || '';
  document.getElementById('pm-obs').value = av.obs || '';
  PERI_CAMPOS.forEach(c => { const el = document.getElementById('pm-' + c.id); if (el) el.value = med[c.id] || ''; });
  document.getElementById('pm-card-title').textContent = T('med_editar_aval');
  document.getElementById('pm-btn-cancel').style.display = '';
  window.scrollTo(0, 0);
}

function cancelarEditarMedida() {
  editingMedidaId = null;
  document.getElementById('pm-id').value = '';
  document.getElementById('pm-data').value = todayISO();
  ['peso', 'imc', 'gord', 'gord-abs', 'massa', 'gord-visc', 'tmb', 'obs'].forEach(f => { const el = document.getElementById('pm-' + f); if (el) el.value = ''; });
  PERI_CAMPOS.forEach(c => { const el = document.getElementById('pm-' + c.id); if (el) el.value = ''; });
  document.getElementById('pm-card-title').textContent = T('med_nova_aval');
  document.getElementById('pm-btn-cancel').style.display = 'none';
}

async function salvarMedida() {
  const data = document.getElementById('pm-data').value;
  if (!data) { toast(T('t_data_obrig')); return; }
  const medidas = {};
  PERI_CAMPOS.forEach(c => { const v = document.getElementById('pm-' + c.id)?.value; if (v) medidas[c.id] = parseFloat(v); });
  const imc = document.getElementById('pm-imc').value; if (imc) medidas.bio_imc = parseFloat(imc);
  const gordAbs = document.getElementById('pm-gord-abs').value; if (gordAbs) medidas.bio_gord_abs = parseFloat(gordAbs);
  const gordVisc = document.getElementById('pm-gord-visc').value; if (gordVisc) medidas.bio_gord_visc = parseFloat(gordVisc);
  const tmb = document.getElementById('pm-tmb').value; if (tmb) medidas.bio_tmb = parseFloat(tmb);
  const payload = {
    aluno_id: currentAlunoId, data,
    peso: document.getElementById('pm-peso').value || null,
    gordura: document.getElementById('pm-gord').value || null,
    massa_magra: document.getElementById('pm-massa').value || null,
    obs: document.getElementById('pm-obs').value, medidas
  };
  if (editingMedidaId) {
    await sbFetch(`perimetria?id=eq.${editingMedidaId}`, { method: 'PATCH', body: JSON.stringify(payload) });
    cancelarEditarMedida();
  } else {
    await sbFetch('perimetria', { method: 'POST', body: JSON.stringify(payload) });
  }
  toast(T('t_aval_salva')); renderMedidas();
}

async function deletarMedida(id) {
  if (!confirm(T('confirm_excluir_medida'))) return;
  await sbFetch(`perimetria?id=eq.${id}`, { method: 'DELETE' });
  if (editingMedidaId === id) cancelarEditarMedida();
  toast(T('t_excluido')); renderMedidas();
}

// ── PERIODIZAÇÃO ──────────────────────────────────────────
function setCiclo(n) {
  perioCiclo = n;
  document.getElementById('ciclo-3-btn').className = `btn btn-sm${n === 3 ? ' btn-gold' : ''}`;
  document.getElementById('ciclo-4-btn').className = `btn btn-sm${n === 4 ? ' btn-gold' : ''}`;
  renderPhaseBar();
}

function renderPhaseBar() {
  const el = document.getElementById('perio-phase-bar');
  if (!el) return;
  const dataInicio = document.getElementById('perio-data-inicio')?.value;
  const today = new Date();

  const phases = perioCiclo === 3
    ? [T('phase_acum'), T('phase_intens'), T('phase_deload')]
    : [T('phase_acum'), T('phase_acum'), T('phase_intens'), T('phase_deload')];

  let currentWeekIdx = -1;
  if (dataInicio) {
    const start = new Date(dataInicio);
    const weeksElapsed = Math.floor((today - start) / (7 * 86400000));
    currentWeekIdx = weeksElapsed % perioCiclo;
  }

  el.innerHTML = `<div style="font-size:11px;color:var(--text-3);font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">FASES DO CICLO</div>
    <div class="phase-bar">
      ${phases.map((p, i) => `
        <div class="phase-item${currentWeekIdx === i ? ' current-phase' : ''}">
          <div class="phase-week">${T('semana')} ${i + 1}</div>
          <div class="phase-name">${p}</div>
        </div>`).join('')}
    </div>`;
}

async function renderPeriodizacao() {
  // Load existing periodizacao
  let perio = null;
  try {
    const res = await sbFetch(`periodizacao?aluno_id=eq.${currentAlunoId}&order=criado_em.desc&limit=1`) || [];
    perio = res[0] || null;
  } catch(e) {}

  if (perio) {
    perioCiclo = perio.semanas_ciclo || 4;
    if (document.getElementById('perio-data-inicio')) document.getElementById('perio-data-inicio').value = perio.data_inicio || '';
    if (document.getElementById('perio-tipo-deload')) document.getElementById('perio-tipo-deload').value = perio.tipo_deload || 'volume';
    if (document.getElementById('perio-overload')) document.getElementById('perio-overload').checked = perio.overload_ativo || false;
    if (document.getElementById('perio-notas')) document.getElementById('perio-notas').value = perio.notas || '';
  }

  setCiclo(perioCiclo);

  // Banner
  const bannerEl = document.getElementById('perio-banner');
  if (perio && perio.data_inicio) {
    const start = new Date(perio.data_inicio);
    const today = new Date();
    const weeksElapsed = Math.floor((today - start) / (7 * 86400000));
    const currentIdx = weeksElapsed % perioCiclo;
    const isDeloadWeek = currentIdx === perioCiclo - 1;
    const isOverload = perio.overload_ativo;
    if (isDeloadWeek) {
      bannerEl.innerHTML = `<div class="deload-banner">🟢 SEMANA DE DELOAD · ${perio.tipo_deload?.toUpperCase() || ''}</div>`;
    } else if (isOverload) {
      bannerEl.innerHTML = `<div class="overload-banner">⚡ SEMANA DE OVERLOAD</div>`;
    } else {
      bannerEl.innerHTML = '';
    }
  } else {
    bannerEl.innerHTML = '';
  }

  // Messages list
  let msgs = [];
  try {
    msgs = await sbFetch(`mensagens_pt?aluno_id=eq.${currentAlunoId}&order=criado_em.desc&limit=10`) || [];
  } catch(e) {}

  const msgsEl = document.getElementById('perio-msgs-list');
  if (msgs.length) {
    msgsEl.innerHTML = `<div style="font-size:11px;font-weight:700;color:var(--text-3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px">MENSAGENS ENVIADAS</div>` +
      msgs.map(m => `<div style="padding:10px 0;border-bottom:1px solid var(--hairline)">
        <div style="font-size:13px;color:var(--text-2);line-height:1.5">${esc(m.texto)}</div>
        <div style="font-size:10px;color:var(--text-3);margin-top:4px;font-family:'JetBrains Mono',monospace">${formatDate(m.criado_em)} · ${m.lida ? '✓ lida' : 'não lida'}</div>
      </div>`).join('');
  } else {
    msgsEl.innerHTML = '';
  }
}

async function salvarPeriodizacao() {
  const dataInicio = document.getElementById('perio-data-inicio').value;
  const tipoDeload = document.getElementById('perio-tipo-deload').value;
  const overload = document.getElementById('perio-overload').checked;
  const notas = document.getElementById('perio-notas').value;

  const payload = {
    aluno_id: currentAlunoId,
    semanas_ciclo: perioCiclo,
    data_inicio: dataInicio || null,
    tipo_deload: tipoDeload,
    overload_ativo: overload,
    notas
  };

  try {
    const exists = await sbFetch(`periodizacao?aluno_id=eq.${currentAlunoId}&limit=1`) || [];
    if (exists.length) {
      await sbFetch(`periodizacao?aluno_id=eq.${currentAlunoId}`, { method: 'PATCH', body: JSON.stringify(payload) });
    } else {
      await sbFetch('periodizacao', { method: 'POST', body: JSON.stringify(payload) });
    }
    toast(T('t_perio_salva'));
    renderPeriodizacao();
  } catch(e) {
    toast(T('t_conn_err'));
  }
}

async function enviarMensagemPT() {
  const texto = document.getElementById('perio-msg').value.trim();
  if (!texto) { toast(T('t_msg_vazia')); return; }
  try {
    await sbFetch('mensagens_pt', { method: 'POST', body: JSON.stringify({ aluno_id: currentAlunoId, texto, lida: false }) });
    document.getElementById('perio-msg').value = '';
    toast(T('t_msg_enviada'));
    renderPeriodizacao();
  } catch(e) {
    toast(T('t_conn_err'));
  }
}

// ── PERFIL ────────────────────────────────────────────────
async function renderPerfil() {
  const res = await sbFetch(`anamnese?aluno_id=eq.${currentAlunoId}`) || [];
  const dados = res[0]?.dados || {};
  ['nome', 'nasc', 'altura', 'prof', 'email', 'tel', 'doencas', 'med', 'lesoes', 'dores', 'obj', 'nivel', 'sono', 'stress', 'alim', 'obs'].forEach(f => {
    const el = document.getElementById('pf-' + f);
    if (el && dados[f] !== undefined) el.value = dados[f];
  });
  // Nutrition targets
  if (dados.kcal_alvo !== undefined) document.getElementById('pf-kcal').value = dados.kcal_alvo || '';
  if (dados.prot_alvo !== undefined) document.getElementById('pf-prot').value = dados.prot_alvo || '';
  if (dados.carbo_alvo !== undefined) document.getElementById('pf-carbo').value = dados.carbo_alvo || '';
  if (dados.gord_alvo !== undefined) document.getElementById('pf-gord').value = dados.gord_alvo || '';
}

async function salvarPerfil() {
  const campos = ['nome', 'nasc', 'altura', 'prof', 'email', 'tel', 'doencas', 'med', 'lesoes', 'dores', 'obj', 'nivel', 'sono', 'stress', 'alim', 'obs'];
  const dados = {};
  campos.forEach(f => { const el = document.getElementById('pf-' + f); if (el) dados[f] = el.value; });
  // Nutrition
  const kcal = document.getElementById('pf-kcal')?.value;
  const prot = document.getElementById('pf-prot')?.value;
  const carbo = document.getElementById('pf-carbo')?.value;
  const gord = document.getElementById('pf-gord')?.value;
  if (kcal) dados.kcal_alvo = parseInt(kcal);
  if (prot) dados.prot_alvo = parseInt(prot);
  if (carbo) dados.carbo_alvo = parseInt(carbo);
  if (gord) dados.gord_alvo = parseInt(gord);

  const existe = await sbFetch(`anamnese?aluno_id=eq.${currentAlunoId}`) || [];
  if (existe.length) {
    await sbFetch(`anamnese?aluno_id=eq.${currentAlunoId}`, { method: 'PATCH', body: JSON.stringify({ dados, atualizado_em: new Date().toISOString() }) });
  } else {
    await sbFetch('anamnese', { method: 'POST', body: JSON.stringify({ aluno_id: currentAlunoId, dados, atualizado_em: new Date().toISOString() }) });
  }
  toast(T('t_ficha_salva'));
}

// ── AGENDA ────────────────────────────────────────────────
function agendaPrevWeek() { agendaWeekOffset--; renderAgenda(); }
function agendaNextWeek() { agendaWeekOffset++; renderAgenda(); }

async function renderAgenda() {
  const weekStart = getWeekStart(agendaWeekOffset);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 6); weekEnd.setHours(23, 59, 59, 999);
  const wn = weekNumber(weekStart);

  const label = document.getElementById('agenda-week-label');
  if (label) {
    const startStr = `${weekStart.getDate().toString().padStart(2,'0')}/${(weekStart.getMonth()+1).toString().padStart(2,'0')}`;
    const endStr = `${weekEnd.getDate().toString().padStart(2,'0')}/${(weekEnd.getMonth()+1).toString().padStart(2,'0')}`;
    label.textContent = `${T('agenda_semana')} ${wn} · ${startStr}–${endStr}`;
  }

  const weekStartISO = weekStart.toISOString().split('T')[0];
  const weekEndISO = weekEnd.toISOString().split('T')[0];

  const [sessoes, alunos] = await Promise.all([
    sbFetch(`sessoes?data=gte.${weekStartISO}&data=lte.${weekEndISO}&order=data.desc&select=*,alunos(nome)`) || [],
    sbFetch('alunos?select=id,nome&order=nome.asc') || []
  ]);

  const sessoesArr = sessoes || [];
  const alunosArr = alunos || [];

  // Calendar grid
  const days = T('days');
  const calEl = document.getElementById('agenda-cal-grid');
  const today = new Date(); today.setHours(0,0,0,0);

  const cols = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
    const isoDay = d.toISOString().split('T')[0];
    const daySess = sessoesArr.filter(s => s.data && s.data.split('T')[0] === isoDay);
    const uniqueAlunos = [...new Map(daySess.map(s => [s.aluno_id, s])).values()];
    const isToday = d.getTime() === today.getTime();
    const dayName = days[d.getDay()];
    cols.push({ dayName, dayNum: d.getDate(), alunos: uniqueAlunos, isoDay, isToday });
  }

  calEl.innerHTML = `<div class="cal-grid">${cols.map(col => `
    <div class="cal-col${col.isToday ? ' today' : ''}">
      <div class="cal-day-name">${col.dayName}</div>
      <div class="cal-day-num">${col.dayNum}</div>
      <div class="cal-avatars">
        ${col.alunos.slice(0, 5).map(s => {
          const a = alunosArr.find(x => x.id === s.aluno_id);
          const name = a ? a.nome : (s.alunos?.nome || '?');
          return `<div class="cal-mini-av" style="${avStyle(name)}" title="${name}" onclick="goTab('alunos');openAluno('${s.aluno_id}')">${initials(name)}</div>`;
        }).join('')}
        ${col.alunos.length > 5 ? `<div style="font-size:8px;color:var(--text-3);font-weight:700">+${col.alunos.length - 5}</div>` : ''}
      </div>
    </div>`).join('')}
  </div>`;

  // Sessions list below calendar
  const listEl = document.getElementById('agenda-sessions-list');
  if (!sessoesArr.length) {
    listEl.innerHTML = `<div class="empty">Nenhuma sessão esta semana.</div>`;
    return;
  }

  // Group by date descending
  const grouped = {};
  sessoesArr.forEach(s => {
    const d = s.data?.split('T')[0];
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(s);
  });

  const fbMap = {};
  const sessIds = sessoesArr.map(s => s.id);
  if (sessIds.length) {
    const fbList = await sbFetch(`feedbacks?sessao_id=in.(${sessIds.join(',')})&select=sessao_id,estrelas`) || [];
    fbList.forEach(f => { fbMap[f.sessao_id] = f.estrelas; });
  }

  listEl.innerHTML = Object.keys(grouped).sort((a, b) => b.localeCompare(a)).map(date => `
    <div style="margin-bottom:16px">
      <div style="font-size:11px;font-weight:700;color:var(--text-3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;padding:0 2px">${formatDate(date)}</div>
      ${grouped[date].map(s => {
        const stars = fbMap[s.id];
        const alunoName = s.alunos?.nome || '—';
        return `<div class="card" style="padding:12px 14px;margin-bottom:8px;cursor:pointer" onclick="goTab('alunos');openAluno('${s.aluno_id}')">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="av av-sm" style="${avStyle(alunoName)}">${initials(alunoName)}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:14px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${alunoName}</div>
              <div style="font-size:12px;color:var(--text-3);font-weight:500;margin-top:1px">${s.treino_nome || '—'}</div>
            </div>
            ${stars ? `<div style="color:var(--gold);font-size:14px">${'★'.repeat(stars)}</div>` : ''}
          </div>
        </div>`;
      }).join('')}
    </div>`).join('');
}

// ── FEEDBACKS ─────────────────────────────────────────────
async function loadFeedbackBadge() {
  const feedbacks = await sbFetch('feedbacks?lido=eq.false&select=id') || [];
  const badge = document.getElementById('feedback-badge');
  if (badge) { badge.textContent = feedbacks.length; badge.style.display = feedbacks.length > 0 ? 'flex' : 'none'; }
}

function renderFbCard(f, compact = false) {
  const stars = f.estrelas ? '★'.repeat(f.estrelas) + '☆'.repeat(5 - f.estrelas) : '';
  return `<div class="fb-card ${!f.lido ? 'unread' : ''}" onclick="${compact ? "goTab('feedbacks')" : `markLido('${f.id}')`}">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
      <div>
        <div style="font-size:15px;font-weight:700;color:var(--text)">${esc(f.alunos?.nome || '—')}</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:2px;font-family:'JetBrains Mono',monospace">${formatDate(f.data)}</div>
      </div>
      ${!f.lido ? `<span class="badge badge-gold">${T('fb_novo')}</span>` : `<span class="badge badge-gray">${T('fb_lido')}</span>`}
    </div>
    ${stars ? `<div class="fb-stars">${stars.split('').map(c => `<span class="${c === '★' ? 'fb-star-on' : 'fb-star-off'}">${c}</span>`).join('')}</div>` : ''}
    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:${f.mensagem ? '10px' : '0'}">
      ${f.humor ? `<span style="font-size:26px">${esc(f.humor)}</span>` : ''}
      ${f.esforco ? `<span class="badge badge-gray">${T('fb_esforco')}${esc(f.esforco)}</span>` : ''}
    </div>
    ${f.mensagem ? `<div style="font-size:14px;color:var(--text-2);line-height:1.55;border-left:3px solid var(--gold);padding-left:10px;margin-top:4px">"${esc(f.mensagem)}"</div>` : ''}
    ${!compact && f.resposta ? `<div style="margin-top:12px;padding:10px 12px;background:rgba(93,202,154,.07);border-left:3px solid var(--green);border-radius:0 8px 8px 0">
      <div style="font-size:10px;font-weight:700;color:var(--green);letter-spacing:.1em;margin-bottom:5px">PERSONAL</div>
      <div style="font-size:13px;color:var(--text-2);line-height:1.55">${esc(f.resposta)}</div>
    </div>` : ''}
    ${!compact ? `<div style="margin-top:12px" onclick="event.stopPropagation()">
      <button onclick="toggleResposta('${f.id}')" style="background:none;border:1px solid ${f.resposta ? 'rgba(93,202,154,.4)' : 'var(--hairline)'};color:${f.resposta ? 'var(--green)' : 'var(--text-3)'};font-size:12px;font-weight:700;letter-spacing:.05em;padding:7px 16px;border-radius:8px">${f.resposta ? T('fb_editar_resp') : T('fb_responder')}</button>
    </div>
    <div id="resp-area-${f.id}" style="display:none;margin-top:12px" onclick="event.stopPropagation()">
      <textarea id="resp-txt-${f.id}" placeholder="${T('fb_resp_ph')}" style="width:100%;background:var(--surface-1);border:1px solid var(--hairline);color:var(--text);padding:12px;border-radius:10px;font-size:14px;resize:none;min-height:80px;outline:none;line-height:1.5" onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--hairline)'">${esc(f.resposta || '')}</textarea>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button onclick="enviarResposta('${f.id}','${f.aluno_id}')" style="background:var(--green);color:#000;border:none;font-size:13px;font-weight:700;padding:10px 0;border-radius:10px;flex:1;cursor:pointer">${T('fb_enviar')}</button>
        <button onclick="toggleResposta('${f.id}')" style="background:var(--surface-2);color:var(--text-2);border:1px solid var(--hairline);font-size:13px;font-weight:700;padding:10px 16px;border-radius:10px;cursor:pointer">✕</button>
      </div>
    </div>` : ''}
  </div>`;
}

async function renderFeedbacks() {
  const feedbacks = await sbFetch('feedbacks?order=criado_em.desc&limit=60&select=*,alunos(nome)') || [];
  const unread = feedbacks.filter(f => !f.lido).length;
  const badge = document.getElementById('feedback-badge');
  if (badge) { badge.textContent = unread; badge.style.display = unread > 0 ? 'flex' : 'none'; }

  const el = document.getElementById('feedbacks-list');
  if (!feedbacks.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">★</div>${T('fb_nenhum')}</div>`;
    return;
  }
  el.innerHTML = feedbacks.map(f => renderFbCard(f, false)).join('');
}

async function markLido(id) {
  await sbFetch(`feedbacks?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ lido: true }) });
  renderFeedbacks();
}

async function marcarTodosLidos() {
  await sbFetch('feedbacks?lido=eq.false', { method: 'PATCH', body: JSON.stringify({ lido: true }) });
  toast(T('t_todos_lidos'));
  renderFeedbacks();
}

function toggleResposta(id) {
  const area = document.getElementById('resp-area-' + id);
  if (!area) return;
  const open = area.style.display === 'none';
  area.style.display = open ? 'block' : 'none';
  if (open) { const ta = document.getElementById('resp-txt-' + id); if (ta) ta.focus(); }
}

async function enviarResposta(id, alunoId) {
  const ta = document.getElementById('resp-txt-' + id);
  if (!ta) return;
  const resposta = ta.value.trim();
  if (!resposta) { toast(T('fb_resp_vazia')); return; }
  const ok = await sbFetch(`feedbacks?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ resposta, resposta_em: new Date().toISOString(), lido: true }) });
  if (!ok) { toast(T('t_conn_err')); return; }
  try {
    await fetch(SB_URL + '/functions/v1/send-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (getToken() || SB_KEY), 'apikey': SB_KEY },
      body: JSON.stringify({ aluno_id: alunoId, title: 'Jo Silva PT', body: resposta.substring(0, 100) })
    });
  } catch(e) {}
  toast(T('fb_resp_enviada'));
  renderFeedbacks();
}

// ── CONFIG ────────────────────────────────────────────────
function salvarBaseUrl() {
  BASE_URL = document.getElementById('cfg-base-url').value.trim();
  sc('base_url', BASE_URL);
  toast(T('t_url_salva'));
}


// ── COMMUNITY CHALLENGES ──────────────────────────────────
async function renderChallenges() {
  let challenges = [];
  try {
    challenges = await sbFetch('community_challenges?order=criado_em.desc') || [];
  } catch(e) {}

  const el = document.getElementById('challenges-list');
  if (!challenges.length) {
    el.innerHTML = `<div style="font-size:13px;color:var(--text-3);font-weight:500;padding:8px 0">Nenhum desafio criado ainda.</div>`;
    return;
  }

  const metaLabels = { sessoes_semana: 'sess/semana', sessoes_mes: 'sess/mês', streak: 'dias streak' };

  el.innerHTML = challenges.map(c => `
    <div class="challenge-card">
      <div class="c-head">
        <div class="c-emoji">${c.emoji || '🏆'}</div>
        <div>
          <div class="c-title">${esc(c.titulo || '—')}</div>
          <span class="badge ${c.ativo ? 'badge-green' : 'badge-gray'}">${c.ativo ? 'ATIVO' : 'INATIVO'}</span>
        </div>
      </div>
      <div class="c-desc">${esc(c.descricao || '')}</div>
      <div class="c-meta">
        <span class="badge badge-gold">Meta: ${c.meta_valor} ${metaLabels[c.meta_tipo] || c.meta_tipo}</span>
        ${c.fim ? `<span class="badge badge-gray">Até ${formatDate(c.fim)}</span>` : ''}
        <div style="margin-left:auto;display:flex;gap:6px">
          <button class="btn btn-sm btn-outline-gold" onclick="editChallenge('${c.id}')">EDITAR</button>
          <button class="btn btn-sm btn-danger" onclick="deletarChallenge('${c.id}')">✕</button>
        </div>
      </div>
    </div>`).join('');
}

function openNewChallenge() {
  editingChallengeId = null;
  document.getElementById('new-challenge-form').style.display = 'block';
  ['ch-titulo', 'ch-desc', 'ch-emoji', 'ch-meta-val'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const fim = document.getElementById('ch-fim'); if (fim) fim.value = '';
  const ativo = document.getElementById('ch-ativo'); if (ativo) ativo.checked = true;
  document.getElementById('new-challenge-form').scrollIntoView({ behavior: 'smooth' });
}

function closeNewChallenge() {
  document.getElementById('new-challenge-form').style.display = 'none';
  editingChallengeId = null;
}

async function editChallenge(id) {
  let challenges = [];
  try { challenges = await sbFetch(`community_challenges?id=eq.${id}`) || []; } catch(e) {}
  const c = challenges[0]; if (!c) return;
  editingChallengeId = id;
  document.getElementById('ch-titulo').value = c.titulo || '';
  document.getElementById('ch-desc').value = c.descricao || '';
  document.getElementById('ch-emoji').value = c.emoji || '';
  document.getElementById('ch-meta-tipo').value = c.meta_tipo || 'sessoes_semana';
  document.getElementById('ch-meta-val').value = c.meta_valor || '';
  document.getElementById('ch-fim').value = c.fim || '';
  document.getElementById('ch-ativo').checked = c.ativo !== false;
  document.getElementById('new-challenge-form').style.display = 'block';
  document.getElementById('new-challenge-form').scrollIntoView({ behavior: 'smooth' });
}

async function salvarChallenge() {
  const titulo = document.getElementById('ch-titulo').value.trim();
  if (!titulo) { toast('TÍTULO É OBRIGATÓRIO!'); return; }
  const payload = {
    titulo,
    descricao: document.getElementById('ch-desc').value,
    emoji: document.getElementById('ch-emoji').value || '🏆',
    meta_tipo: document.getElementById('ch-meta-tipo').value,
    meta_valor: parseInt(document.getElementById('ch-meta-val').value) || 1,
    fim: document.getElementById('ch-fim').value || null,
    ativo: document.getElementById('ch-ativo').checked,
    ...(editingChallengeId ? {} : { pt_id: getCurrentPtId() })
  };

  try {
    if (editingChallengeId) {
      await sbFetch(`community_challenges?id=eq.${editingChallengeId}`, { method: 'PATCH', body: JSON.stringify(payload) });
      toast(T('t_challenge_atualizado'));
    } else {
      await sbFetch('community_challenges', { method: 'POST', body: JSON.stringify(payload) });
      toast(T('t_challenge_salvo'));
    }
    closeNewChallenge();
    renderChallenges();
  } catch(e) {
    toast(T('t_conn_err'));
  }
}

async function deletarChallenge(id) {
  if (!confirm(T('confirm_excluir_challenge'))) return;
  try {
    await sbFetch(`community_challenges?id=eq.${id}`, { method: 'DELETE' });
    toast(T('t_challenge_excluido'));
    renderChallenges();
  } catch(e) {
    toast(T('t_conn_err'));
  }
}

// ── FOTOS EVOLUÇÃO ────────────────────────────────────────
async function renderFotosAluno() {
  const grid = document.getElementById('fotos-aluno-grid');
  if (!grid || !currentAlunoId) return;
  grid.innerHTML = '<div style="grid-column:1/-1;color:var(--text-3);font-size:12px;font-weight:500">A carregar fotos...</div>';
  try {
    const r = await fetch(`${SB_URL}/storage/v1/object/list/fotos-evolucao`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix: currentAlunoId + '/', limit: 100, offset: 0 })
    });
    if (!r.ok) { grid.innerHTML = ''; return; }
    const files = await r.json();
    if (!Array.isArray(files) || !files.length) {
      grid.innerHTML = '<div style="grid-column:1/-1" class="empty">Aluno sem fotos ainda.</div>';
      return;
    }
    files.sort((a, b) => b.name.localeCompare(a.name));
    grid.innerHTML = files.map(f => {
      const url = `${SB_URL}/storage/v1/object/public/fotos-evolucao/${currentAlunoId}/${f.name}`;
      const parts = f.name.split('_');
      const lbl = (parts[1] || '').charAt(0).toUpperCase() + (parts[1] || '').slice(1);
      const dateStr = parts[0] || '';
      const fullPath = `${currentAlunoId}/${f.name}`;
      return `<div>
        <div style="position:relative;border-radius:10px;overflow:hidden;background:var(--surface-2);cursor:pointer" onclick="openFotoLightboxAdmin('${url}','${lbl} · ${formatDate(dateStr)}')">
          <img src="${url}" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block" loading="lazy">
          <button style="position:absolute;top:4px;right:4px;width:22px;height:22px;background:rgba(0,0,0,.75);border-radius:50%;color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center;line-height:1;border:none;cursor:pointer" onclick="deletarFotoAdmin('${fullPath}',event)">×</button>
        </div>
        <div style="font-size:10px;color:var(--text-3);text-align:center;margin-top:4px;line-height:1.3;font-weight:500">${lbl}<br>${formatDate(dateStr)}</div>
      </div>`;
    }).join('');
  } catch(e) { grid.innerHTML = ''; }
}

async function deletarFotoAdmin(path, e) {
  e.stopPropagation();
  if (!confirm('Apagar esta foto?')) return;
  await fetch(`${SB_URL}/storage/v1/object/fotos-evolucao/${path}`, {
    method: 'DELETE',
    headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }
  });
  await renderFotosAluno();
}

function openFotoLightboxAdmin(url, lbl) {
  const lb = document.getElementById('admin-foto-lightbox');
  lb.querySelector('img').src = url;
  lb.querySelector('.foto-lb-lbl').textContent = lbl;
  lb.style.display = 'flex';
}

// ── SERVICE WORKER ────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// ── INIT ──────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  setLang(currentLang);
  loadConfig();

  const show = () => {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    loadConfig();
    setLang(currentLang);
    renderDash();
  };

  if (getToken()) { show(); }
  else if (getRefresh()) { const ok = await refreshSession(); if (ok) show(); }

  document.getElementById('login-email').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('login-senha').focus(); });
  document.getElementById('login-senha').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  document.getElementById('btn-login-go').addEventListener('click', doLogin);

  // Phase bar updates when date changes
  const dataInicio = document.getElementById('perio-data-inicio');
  if (dataInicio) dataInicio.addEventListener('change', renderPhaseBar);
});

/*
 * ══════════════════════════════════════════════════════
 * SQL TABLES — run once in Supabase SQL Editor:
 * ══════════════════════════════════════════════════════
 *
 * CREATE TABLE IF NOT EXISTS periodizacao (
 *   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   aluno_id uuid REFERENCES alunos(id) ON DELETE CASCADE,
 *   semanas_ciclo int DEFAULT 4,
 *   data_inicio date,
 *   tipo_deload text DEFAULT 'volume',
 *   overload_ativo bool DEFAULT false,
 *   notas text,
 *   criado_em timestamptz DEFAULT now()
 * );
 *
 * CREATE TABLE IF NOT EXISTS mensagens_pt (
 *   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   aluno_id uuid REFERENCES alunos(id) ON DELETE CASCADE,
 *   texto text,
 *   lida bool DEFAULT false,
 *   criado_em timestamptz DEFAULT now()
 * );
 *
 * -- RLS: allow_all on both tables (same as other tables in the project)
 * ALTER TABLE periodizacao ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "allow_all" ON periodizacao FOR ALL USING (true) WITH CHECK (true);
 * ALTER TABLE mensagens_pt ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "allow_all" ON mensagens_pt FOR ALL USING (true) WITH CHECK (true);
 */
