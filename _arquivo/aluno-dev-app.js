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
    'kpi_sessoes':'Sessões','kpi_freq':'Frequência','kpi_volume':'Volume kg',
    'vol_week':'Esta semana','vol_month':'Este mês','vol_total':'Total',
    'evo_chart_title':'Progressão de carga','sel_ex':'Selecione um exercício…',
    'evo_cmp':'Composição corporal','evo_pr':'Recordes pessoais','evo_no_pr':'Ainda sem recordes. Treina mais sessões!',
    'evo_heat':'Atividade · 13 semanas','heat_less':'Menos','heat_more':'Mais',
    'n_meta_sub':'da tua meta','n_prot':'Proteína','n_carb':'Carbo','n_gord':'Gordura',
    'water':'copos água','water_save':'Guardar','n_meals':'Refeições','n_no_meal':'Sem refeições hoje.',
    'timer_label':'Treino em curso',
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
    'kpi_sessoes':'Sessions','kpi_freq':'Frequency','kpi_volume':'Volume kg',
    'vol_week':'This week','vol_month':'This month','vol_total':'Total',
    'evo_chart_title':'Load progression','sel_ex':'Select an exercise…',
    'evo_cmp':'Body composition','evo_pr':'Personal records','evo_no_pr':'No records yet. Train more!',
    'evo_heat':'Activity · 13 weeks','heat_less':'Less','heat_more':'More',
    'n_meta_sub':'of your goal','n_prot':'Protein','n_carb':'Carb','n_gord':'Fat',
    'water':'water cups','water_save':'Save','n_meals':'Meals','n_no_meal':'No meals today.',
    'timer_label':'Workout in progress',
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
let timerStart = null, timerInterval = null;
let pesoCached = 0, perimetriaHist = [];
let anamnese = null;

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
const calcIdade = dataNasc => {
  if (!dataNasc) return null;
  const hoje = new Date();
  const nasc = new Date(dataNasc);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
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
//  BASE DE DADOS DE ALIMENTOS (valores por 100g)
//  campos: nome, cat, kcal, prot, carb, gord, fibra
// ═══════════════════════════════════════════════════════════
const ALIMENTOS_DB = [
  // ── PROTEÍNAS ANIMAIS ──────────────────────────────────
  {nome:'Frango grelhado (peito)',    cat:'🥩 Proteína', kcal:165, prot:31,  carb:0,   gord:3.6,  fibra:0},
  {nome:'Frango cozido (peito)',      cat:'🥩 Proteína', kcal:154, prot:30,  carb:0,   gord:3.2,  fibra:0},
  {nome:'Frango assado (coxa)',       cat:'🥩 Proteína', kcal:209, prot:26,  carb:0,   gord:11,   fibra:0},
  {nome:'Frango cozido desfiado',     cat:'🥩 Proteína', kcal:154, prot:30,  carb:0,   gord:3.2,  fibra:0},
  {nome:'Frango marinado limão',      cat:'🥩 Proteína', kcal:172, prot:30,  carb:2,   gord:4.5,  fibra:0},
  {nome:'Frango ao forno (coxa+asa)', cat:'🥩 Proteína', kcal:250, prot:25,  carb:0,   gord:16,   fibra:0},
  {nome:'Bife de frango panado',      cat:'🥩 Proteína', kcal:215, prot:22,  carb:12,  gord:8.5,  fibra:0.5},
  {nome:'Peito de frango empanado',   cat:'🥩 Proteína', kcal:230, prot:24,  carb:13,  gord:8,    fibra:0.8},
  {nome:'Frango inteiro assado',      cat:'🥩 Proteína', kcal:239, prot:27,  carb:0,   gord:14,   fibra:0},
  {nome:'Coração de frango',          cat:'🥩 Proteína', kcal:185, prot:26,  carb:0,   gord:8.5,  fibra:0},
  {nome:'Moela de frango cozida',     cat:'🥩 Proteína', kcal:154, prot:28,  carb:0,   gord:4,    fibra:0},
  {nome:'Linguiça de frango',         cat:'🥩 Proteína', kcal:195, prot:16,  carb:2,   gord:14,   fibra:0},
  {nome:'Peru grelhado (peito)',      cat:'🥩 Proteína', kcal:135, prot:30,  carb:0,   gord:1.0,  fibra:0},
  {nome:'Peito de peru (fatiado)',    cat:'🥩 Proteína', kcal:107, prot:21,  carb:1.5, gord:1.7,  fibra:0},
  {nome:'Carne bovina patinho',       cat:'🥩 Proteína', kcal:219, prot:28,  carb:0,   gord:11,   fibra:0},
  {nome:'Carne bovina alcatra',       cat:'🥩 Proteína', kcal:185, prot:27,  carb:0,   gord:8,    fibra:0},
  {nome:'Carne bovina filé mignon',   cat:'🥩 Proteína', kcal:170, prot:28,  carb:0,   gord:6,    fibra:0},
  {nome:'Carne bovina picanha',       cat:'🥩 Proteína', kcal:260, prot:24,  carb:0,   gord:17,   fibra:0},
  {nome:'Carne moída (magra)',        cat:'🥩 Proteína', kcal:215, prot:27,  carb:0,   gord:11,   fibra:0},
  {nome:'Contra-filé grelhado',       cat:'🥩 Proteína', kcal:230, prot:27,  carb:0,   gord:13,   fibra:0},
  {nome:'Músculo bovino cozido',      cat:'🥩 Proteína', kcal:218, prot:33,  carb:0,   gord:9,    fibra:0},
  {nome:'Fígado bovino cozido',       cat:'🥩 Proteína', kcal:175, prot:27,  carb:5,   gord:5,    fibra:0},
  {nome:'Costela bovina cozida',      cat:'🥩 Proteína', kcal:291, prot:27,  carb:0,   gord:19,   fibra:0},
  {nome:'Carne seca cozida',          cat:'🥩 Proteína', kcal:250, prot:43,  carb:0,   gord:8,    fibra:0},
  {nome:'Porco lombo',                cat:'🥩 Proteína', kcal:175, prot:29,  carb:0,   gord:6,    fibra:0},
  {nome:'Porco pernil',               cat:'🥩 Proteína', kcal:246, prot:25,  carb:0,   gord:16,   fibra:0},
  {nome:'Carne suína grelhada',       cat:'🥩 Proteína', kcal:195, prot:27,  carb:0,   gord:9.5,  fibra:0},
  {nome:'Salsicha de frango',         cat:'🥩 Proteína', kcal:170, prot:11,  carb:3,   gord:13,   fibra:0},
  {nome:'Bacon (tiras)',              cat:'🥩 Proteína', kcal:541, prot:37,  carb:1.4, gord:42,   fibra:0},
  {nome:'Mortadela',                  cat:'🥩 Proteína', kcal:263, prot:13,  carb:4,   gord:22,   fibra:0},
  {nome:'Presunto (magro)',           cat:'🥩 Proteína', kcal:145, prot:20,  carb:1.0, gord:7,    fibra:0},
  {nome:'Peito de chester cozido',    cat:'🥩 Proteína', kcal:130, prot:22,  carb:0,   gord:4.5,  fibra:0},
  {nome:'Cordeiro grelhado',          cat:'🥩 Proteína', kcal:258, prot:25,  carb:0,   gord:17,   fibra:0},
  {nome:'Coelho ensopado',            cat:'🥩 Proteína', kcal:197, prot:29,  carb:0,   gord:8.5,  fibra:0},
  {nome:'Pato assado',                cat:'🥩 Proteína', kcal:337, prot:19,  carb:0,   gord:28,   fibra:0},
  {nome:'Avestruz filé grelhado',     cat:'🥩 Proteína', kcal:158, prot:29,  carb:0,   gord:3.7,  fibra:0},
  {nome:'Atum em lata (água)',        cat:'🥩 Proteína', kcal:116, prot:26,  carb:0,   gord:1.0,  fibra:0},
  {nome:'Atum em lata (óleo)',        cat:'🥩 Proteína', kcal:198, prot:24,  carb:0,   gord:11,   fibra:0},
  {nome:'Atum fresco grelhado',       cat:'🥩 Proteína', kcal:184, prot:30,  carb:0,   gord:6.3,  fibra:0},
  {nome:'Salmão grelhado',            cat:'🥩 Proteína', kcal:208, prot:28,  carb:0,   gord:10,   fibra:0},
  {nome:'Salmão defumado',            cat:'🥩 Proteína', kcal:179, prot:25,  carb:0,   gord:8.5,  fibra:0},
  {nome:'Tilápia grelhada',           cat:'🥩 Proteína', kcal:128, prot:26,  carb:0,   gord:2.7,  fibra:0},
  {nome:'Sardinha (lata água)',       cat:'🥩 Proteína', kcal:135, prot:24,  carb:0,   gord:4.5,  fibra:0},
  {nome:'Bacalhau cozido',            cat:'🥩 Proteína', kcal:105, prot:23,  carb:0,   gord:0.9,  fibra:0},
  {nome:'Bacalhau grelhado',          cat:'🥩 Proteína', kcal:105, prot:23,  carb:0,   gord:0.9,  fibra:0},
  {nome:'Peixe merluza cozida',       cat:'🥩 Proteína', kcal:86,  prot:18,  carb:0,   gord:1.4,  fibra:0},
  {nome:'Peixe-espada grelhado',      cat:'🥩 Proteína', kcal:145, prot:21,  carb:0,   gord:6.5,  fibra:0},
  {nome:'Robalo grelhado',            cat:'🥩 Proteína', kcal:124, prot:24,  carb:0,   gord:2.6,  fibra:0},
  {nome:'Dourada grelhada',           cat:'🥩 Proteína', kcal:128, prot:26,  carb:0,   gord:2.5,  fibra:0},
  {nome:'Pargo grelhado',             cat:'🥩 Proteína', kcal:100, prot:21,  carb:0,   gord:1.4,  fibra:0},
  {nome:'Truta grelhada',             cat:'🥩 Proteína', kcal:190, prot:26,  carb:0,   gord:9,    fibra:0},
  {nome:'Linguado grelhado',          cat:'🥩 Proteína', kcal:91,  prot:19,  carb:0,   gord:1.2,  fibra:0},
  {nome:'Cavala grelhada',            cat:'🥩 Proteína', kcal:205, prot:19,  carb:0,   gord:14,   fibra:0},
  {nome:'Arenque grelhado',           cat:'🥩 Proteína', kcal:203, prot:23,  carb:0,   gord:12,   fibra:0},
  {nome:'Camarão cozido',             cat:'🥩 Proteína', kcal:99,  prot:24,  carb:0.2, gord:0.3,  fibra:0},
  {nome:'Camarão grelhado (grande)',  cat:'🥩 Proteína', kcal:120, prot:24,  carb:1,   gord:2,    fibra:0},
  {nome:'Lula grelhada',              cat:'🥩 Proteína', kcal:92,  prot:16,  carb:3.1, gord:1.4,  fibra:0},
  {nome:'Lula frita (anéis)',         cat:'🥩 Proteína', kcal:175, prot:14,  carb:10,  gord:8,    fibra:0.5},
  {nome:'Polvo cozido',               cat:'🥩 Proteína', kcal:164, prot:30,  carb:4.4, gord:2.1,  fibra:0},
  {nome:'Mexilhão cozido',            cat:'🥩 Proteína', kcal:172, prot:24,  carb:7.4, gord:4.5,  fibra:0},
  {nome:'Lagosta cozida',             cat:'🥩 Proteína', kcal:98,  prot:21,  carb:1.3, gord:0.6,  fibra:0},
  {nome:'Caranguejo cozido',          cat:'🥩 Proteína', kcal:97,  prot:20,  carb:0,   gord:1.5,  fibra:0},
  {nome:'Ovo inteiro (1 ovo = 50g)',  cat:'🥩 Proteína', kcal:155, prot:13,  carb:1.1, gord:11,   fibra:0},
  {nome:'Clara de ovo',               cat:'🥩 Proteína', kcal:52,  prot:11,  carb:0.7, gord:0.2,  fibra:0},
  // ── PROTEÍNAS VEGETAIS ────────────────────────────────
  {nome:'Tofu firme',                 cat:'🌿 Prot. vegetal', kcal:76,  prot:8,   carb:1.9, gord:4.8,  fibra:0.3},
  {nome:'Tempeh',                     cat:'🌿 Prot. vegetal', kcal:193, prot:19,  carb:9,   gord:11,   fibra:4.1},
  {nome:'Seitan',                     cat:'🌿 Prot. vegetal', kcal:143, prot:25,  carb:7,   gord:2,    fibra:0.6},
  {nome:'Grão-de-bico cozido',        cat:'🌿 Prot. vegetal', kcal:164, prot:9,   carb:27,  gord:2.6,  fibra:7.6},
  {nome:'Lentilha cozida',            cat:'🌿 Prot. vegetal', kcal:116, prot:9,   carb:20,  gord:0.4,  fibra:7.9},
  {nome:'Lentilha vermelha cozida',   cat:'🌿 Prot. vegetal', kcal:116, prot:9,   carb:20,  gord:0.4,  fibra:7.9},
  {nome:'Lentilha preta cozida',      cat:'🌿 Prot. vegetal', kcal:116, prot:9,   carb:20,  gord:0.4,  fibra:8},
  {nome:'Feijão preto cozido',        cat:'🌿 Prot. vegetal', kcal:132, prot:9,   carb:24,  gord:0.5,  fibra:8.7},
  {nome:'Feijão carioca cozido',      cat:'🌿 Prot. vegetal', kcal:127, prot:8,   carb:23,  gord:0.5,  fibra:8},
  {nome:'Feijão branco cozido',       cat:'🌿 Prot. vegetal', kcal:139, prot:10,  carb:25,  gord:0.4,  fibra:6.3},
  {nome:'Feijão azuki cozido',        cat:'🌿 Prot. vegetal', kcal:128, prot:8,   carb:25,  gord:0.1,  fibra:7.3},
  {nome:'Feijão mungo cozido',        cat:'🌿 Prot. vegetal', kcal:105, prot:7,   carb:19,  gord:0.4,  fibra:7.6},
  {nome:'Ervilha cozida',             cat:'🌿 Prot. vegetal', kcal:84,  prot:5.4, carb:15,  gord:0.4,  fibra:5.7},
  {nome:'Edamame (soja cozida)',      cat:'🌿 Prot. vegetal', kcal:121, prot:11,  carb:9,   gord:5.2,  fibra:5.2},
  {nome:'Soja texturizada seca',      cat:'🌿 Prot. vegetal', kcal:331, prot:52,  carb:34,  gord:1,    fibra:17},
  {nome:'Soja texturizada cozida',    cat:'🌿 Prot. vegetal', kcal:135, prot:17,  carb:14,  gord:1,    fibra:4.5},
  {nome:'Natto (soja fermentada)',    cat:'🌿 Prot. vegetal', kcal:211, prot:18,  carb:14,  gord:11,   fibra:5.4},
  {nome:'Miso (pasta de soja)',       cat:'🌿 Prot. vegetal', kcal:199, prot:12,  carb:26,  gord:6,    fibra:5.4},
  {nome:'Amendoim torrado',           cat:'🌿 Prot. vegetal', kcal:567, prot:26,  carb:16,  gord:49,   fibra:8.5},
  {nome:'Pasta de amendoim (natural)',cat:'🌿 Prot. vegetal', kcal:598, prot:25,  carb:20,  gord:51,   fibra:6},
  {nome:'Proteína de ervilha (pó)',   cat:'🌿 Prot. vegetal', kcal:370, prot:80,  carb:5,   gord:2,    fibra:2},
  {nome:'Proteína de arroz (pó)',     cat:'🌿 Prot. vegetal', kcal:360, prot:78,  carb:10,  gord:2,    fibra:1},
  // ── LATICÍNIOS ──────────────────────────────────────
  {nome:'Whey protein (pó)',          cat:'🥛 Laticínio', kcal:380, prot:80,  carb:7,   gord:4,    fibra:0},
  {nome:'Whey isolado (pó)',          cat:'🥛 Laticínio', kcal:360, prot:90,  carb:2,   gord:1,    fibra:0},
  {nome:'Caseína (pó)',               cat:'🥛 Laticínio', kcal:370, prot:80,  carb:8,   gord:4,    fibra:1},
  {nome:'Iogurte grego natural',      cat:'🥛 Laticínio', kcal:97,  prot:9,   carb:4,   gord:5,    fibra:0},
  {nome:'Iogurte grego 0% gordura',   cat:'🥛 Laticínio', kcal:59,  prot:10,  carb:4,   gord:0.4,  fibra:0},
  {nome:'Iogurte natural integral',   cat:'🥛 Laticínio', kcal:61,  prot:3.5, carb:5,   gord:3.3,  fibra:0},
  {nome:'Kefir integral',             cat:'🥛 Laticínio', kcal:61,  prot:3.3, carb:4.5, gord:3.5,  fibra:0},
  {nome:'Queijo cottage',             cat:'🥛 Laticínio', kcal:98,  prot:11,  carb:3,   gord:4.5,  fibra:0},
  {nome:'Queijo mussarela',           cat:'🥛 Laticínio', kcal:280, prot:22,  carb:2.2, gord:22,   fibra:0},
  {nome:'Queijo prato',               cat:'🥛 Laticínio', kcal:356, prot:25,  carb:1.5, gord:28,   fibra:0},
  {nome:'Queijo ricota',              cat:'🥛 Laticínio', kcal:174, prot:11,  carb:3,   gord:13,   fibra:0},
  {nome:'Queijo minas frescal',       cat:'🥛 Laticínio', kcal:264, prot:17,  carb:3,   gord:20,   fibra:0},
  {nome:'Queijo coalho grelhado',     cat:'🥛 Laticínio', kcal:316, prot:20,  carb:3,   gord:25,   fibra:0},
  {nome:'Queijo parmesão',            cat:'🥛 Laticínio', kcal:431, prot:38,  carb:4.1, gord:29,   fibra:0},
  {nome:'Queijo cheddar',             cat:'🥛 Laticínio', kcal:403, prot:25,  carb:1.3, gord:33,   fibra:0},
  {nome:'Queijo brie',                cat:'🥛 Laticínio', kcal:334, prot:21,  carb:0.5, gord:28,   fibra:0},
  {nome:'Requeijão cremoso',          cat:'🥛 Laticínio', kcal:250, prot:8.5, carb:5,   gord:22,   fibra:0},
  {nome:'Cream cheese',               cat:'🥛 Laticínio', kcal:342, prot:6,   carb:4.1, gord:34,   fibra:0},
  {nome:'Coalhada seca',              cat:'🥛 Laticínio', kcal:110, prot:7,   carb:5,   gord:7,    fibra:0},
  {nome:'Leite integral',             cat:'🥛 Laticínio', kcal:61,  prot:3.2, carb:4.8, gord:3.3,  fibra:0},
  {nome:'Leite desnatado',            cat:'🥛 Laticínio', kcal:34,  prot:3.4, carb:5,   gord:0.1,  fibra:0},
  {nome:'Leite condensado',           cat:'🥛 Laticínio', kcal:321, prot:8,   carb:54,  gord:8.7,  fibra:0},
  {nome:'Manteiga ghee',              cat:'🥛 Laticínio', kcal:876, prot:0.3, carb:0,   gord:99,   fibra:0},
  // ── CARBOIDRATOS ────────────────────────────────────
  {nome:'Arroz branco cozido',        cat:'🌾 Carboidrato', kcal:130, prot:2.7, carb:28,  gord:0.3,  fibra:0.4},
  {nome:'Arroz integral cozido',      cat:'🌾 Carboidrato', kcal:123, prot:2.5, carb:26,  gord:0.9,  fibra:1.8},
  {nome:'Macarrão cozido',            cat:'🌾 Carboidrato', kcal:158, prot:5.8, carb:31,  gord:0.9,  fibra:1.8},
  {nome:'Macarrão integral cozido',   cat:'🌾 Carboidrato', kcal:149, prot:5.5, carb:29,  gord:0.8,  fibra:3.9},
  {nome:'Batata inglesa cozida',      cat:'🌾 Carboidrato', kcal:87,  prot:1.9, carb:20,  gord:0.1,  fibra:1.8},
  {nome:'Batata-doce cozida',         cat:'🌾 Carboidrato', kcal:90,  prot:2,   carb:21,  gord:0.1,  fibra:3.3},
  {nome:'Batata-doce roxa cozida',    cat:'🌾 Carboidrato', kcal:86,  prot:1.6, carb:20,  gord:0.1,  fibra:3},
  {nome:'Batata baroa cozida',        cat:'🌾 Carboidrato', kcal:95,  prot:1.3, carb:22,  gord:0.1,  fibra:3.2},
  {nome:'Mandioca cozida',            cat:'🌾 Carboidrato', kcal:126, prot:1.1, carb:30,  gord:0.3,  fibra:1.9},
  {nome:'Tapioca (goma seca)',        cat:'🌾 Carboidrato', kcal:350, prot:0.2, carb:86,  gord:0.1,  fibra:0.9},
  {nome:'Aveia em flocos',            cat:'🌾 Carboidrato', kcal:389, prot:17,  carb:66,  gord:7,    fibra:10.6},
  {nome:'Farelo de aveia',            cat:'🌾 Carboidrato', kcal:246, prot:17,  carb:66,  gord:7,    fibra:15.5},
  {nome:'Farelo de trigo',            cat:'🌾 Carboidrato', kcal:216, prot:16,  carb:65,  gord:4.3,  fibra:42.8},
  {nome:'Gérmen de trigo',            cat:'🌾 Carboidrato', kcal:360, prot:23,  carb:52,  gord:10,   fibra:13.2},
  {nome:'Quinoa cozida',              cat:'🌾 Carboidrato', kcal:120, prot:4.4, carb:21,  gord:1.9,  fibra:2.8},
  {nome:'Trigo sarraceno cozido',     cat:'🌾 Carboidrato', kcal:92,  prot:3.4, carb:20,  gord:0.6,  fibra:2.7},
  {nome:'Amaranto cozido',            cat:'🌾 Carboidrato', kcal:102, prot:3.8, carb:19,  gord:1.6,  fibra:2.1},
  {nome:'Cevada cozida',              cat:'🌾 Carboidrato', kcal:123, prot:2.3, carb:28,  gord:0.4,  fibra:3.8},
  {nome:'Milho cozido',               cat:'🌾 Carboidrato', kcal:96,  prot:3.4, carb:21,  gord:1.5,  fibra:2.4},
  {nome:'Inhame cozido',              cat:'🌾 Carboidrato', kcal:118, prot:1.5, carb:28,  gord:0.2,  fibra:4.1},
  {nome:'Cuscuz cozido',              cat:'🌾 Carboidrato', kcal:112, prot:2.5, carb:24,  gord:0.3,  fibra:1.2},
  {nome:'Pão integral (100g)',        cat:'🌾 Carboidrato', kcal:265, prot:9,   carb:45,  gord:4.2,  fibra:6},
  {nome:'Pão branco (100g)',          cat:'🌾 Carboidrato', kcal:280, prot:8,   carb:53,  gord:3.5,  fibra:2.3},
  {nome:'Pão francês (50g)',          cat:'🌾 Carboidrato', kcal:300, prot:8,   carb:58,  gord:3.1,  fibra:2.3},
  {nome:'Pão de queijo (50g)',        cat:'🌾 Carboidrato', kcal:150, prot:3.5, carb:20,  gord:6.5,  fibra:0.3},
  {nome:'Biscoito de arroz',          cat:'🌾 Carboidrato', kcal:392, prot:7.5, carb:81,  gord:3,    fibra:2.5},
  {nome:'Torrada integral',           cat:'🌾 Carboidrato', kcal:340, prot:12,  carb:64,  gord:4.5,  fibra:7},
  {nome:'Pipoca (sem manteiga)',      cat:'🌾 Carboidrato', kcal:375, prot:12,  carb:74,  gord:4.5,  fibra:14.5},
  {nome:'Polvilho azedo',             cat:'🌾 Carboidrato', kcal:353, prot:0.3, carb:87,  gord:0.1,  fibra:0.9},
  {nome:'Farinha de mandioca',        cat:'🌾 Carboidrato', kcal:363, prot:1.5, carb:88,  gord:0.3,  fibra:6.5},
  {nome:'Farinha de milho (fubá)',    cat:'🌾 Carboidrato', kcal:361, prot:7.9, carb:75,  gord:2.8,  fibra:3.7},
  {nome:'Farinha de trigo integral',  cat:'🌾 Carboidrato', kcal:340, prot:13,  carb:72,  gord:2.5,  fibra:10.7},
  {nome:'Farinha de coco',            cat:'🌾 Carboidrato', kcal:400, prot:20,  carb:58,  gord:15,   fibra:39},
  {nome:'Corn flakes (sem açúcar)',   cat:'🌾 Carboidrato', kcal:357, prot:7.5, carb:84,  gord:0.9,  fibra:2.7},
  {nome:'Granola (sem açúcar)',       cat:'🌾 Carboidrato', kcal:385, prot:10,  carb:60,  gord:14,   fibra:5},
  // ── FRUTAS ─────────────────────────────────────────
  {nome:'Banana prata',               cat:'🍎 Fruta', kcal:89,  prot:1.1, carb:23,  gord:0.3,  fibra:2.6},
  {nome:'Banana nanica',              cat:'🍎 Fruta', kcal:92,  prot:1.2, carb:24,  gord:0.2,  fibra:2.4},
  {nome:'Banana ouro',                cat:'🍎 Fruta', kcal:98,  prot:1.3, carb:26,  gord:0.2,  fibra:1.9},
  {nome:'Maçã com casca',             cat:'🍎 Fruta', kcal:52,  prot:0.3, carb:14,  gord:0.2,  fibra:2.4},
  {nome:'Laranja',                    cat:'🍎 Fruta', kcal:47,  prot:0.9, carb:12,  gord:0.1,  fibra:2.4},
  {nome:'Manga',                      cat:'🍎 Fruta', kcal:60,  prot:0.8, carb:15,  gord:0.4,  fibra:1.6},
  {nome:'Abacaxi',                    cat:'🍎 Fruta', kcal:48,  prot:0.5, carb:13,  gord:0.1,  fibra:1.4},
  {nome:'Melancia',                   cat:'🍎 Fruta', kcal:30,  prot:0.6, carb:8,   gord:0.2,  fibra:0.4},
  {nome:'Melão',                      cat:'🍎 Fruta', kcal:34,  prot:0.8, carb:8,   gord:0.2,  fibra:0.9},
  {nome:'Morango',                    cat:'🍎 Fruta', kcal:32,  prot:0.7, carb:7.7, gord:0.3,  fibra:2},
  {nome:'Framboesa',                  cat:'🍎 Fruta', kcal:52,  prot:1.2, carb:12,  gord:0.7,  fibra:6.5},
  {nome:'Mirtilo (blueberry)',        cat:'🍎 Fruta', kcal:57,  prot:0.7, carb:14,  gord:0.3,  fibra:2.4},
  {nome:'Uva (verde/roxa)',           cat:'🍎 Fruta', kcal:69,  prot:0.7, carb:18,  gord:0.2,  fibra:0.9},
  {nome:'Pera',                       cat:'🍎 Fruta', kcal:57,  prot:0.4, carb:15,  gord:0.1,  fibra:3.1},
  {nome:'Pêssego',                    cat:'🍎 Fruta', kcal:39,  prot:0.9, carb:10,  gord:0.3,  fibra:1.5},
  {nome:'Nectarina',                  cat:'🍎 Fruta', kcal:44,  prot:1.1, carb:11,  gord:0.3,  fibra:1.7},
  {nome:'Cereja',                     cat:'🍎 Fruta', kcal:63,  prot:1.1, carb:16,  gord:0.2,  fibra:2.1},
  {nome:'Abacate',                    cat:'🍎 Fruta', kcal:160, prot:2,   carb:9,   gord:15,   fibra:6.7},
  {nome:'Mamão papaia',               cat:'🍎 Fruta', kcal:43,  prot:0.5, carb:11,  gord:0.3,  fibra:1.7},
  {nome:'Kiwi',                       cat:'🍎 Fruta', kcal:61,  prot:1.1, carb:15,  gord:0.5,  fibra:3},
  {nome:'Maracujá (polpa)',           cat:'🍎 Fruta', kcal:68,  prot:2.2, carb:16,  gord:0.4,  fibra:0.4},
  {nome:'Goiaba',                     cat:'🍎 Fruta', kcal:68,  prot:2.6, carb:14,  gord:1,    fibra:5.4},
  {nome:'Acerola',                    cat:'🍎 Fruta', kcal:32,  prot:0.8, carb:8,   gord:0.3,  fibra:1.5},
  {nome:'Pitaya (dragon fruit)',      cat:'🍎 Fruta', kcal:60,  prot:1.2, carb:13,  gord:0.4,  fibra:3},
  {nome:'Romã (grãos)',               cat:'🍎 Fruta', kcal:83,  prot:1.7, carb:19,  gord:1.2,  fibra:4},
  {nome:'Caqui',                      cat:'🍎 Fruta', kcal:70,  prot:0.6, carb:19,  gord:0.2,  fibra:3.6},
  {nome:'Figo fresco',                cat:'🍎 Fruta', kcal:74,  prot:0.8, carb:19,  gord:0.3,  fibra:2.9},
  {nome:'Jabuticaba',                 cat:'🍎 Fruta', kcal:58,  prot:0.6, carb:15,  gord:0.1,  fibra:2.1},
  {nome:'Graviola (polpa)',           cat:'🍎 Fruta', kcal:62,  prot:1,   carb:16,  gord:0.3,  fibra:3.3},
  {nome:'Tâmara seca',                cat:'🍎 Fruta', kcal:282, prot:2.5, carb:75,  gord:0.4,  fibra:8},
  {nome:'Uva passa',                  cat:'🍎 Fruta', kcal:296, prot:3.1, carb:79,  gord:0.5,  fibra:3.7},
  {nome:'Ameixa seca',                cat:'🍎 Fruta', kcal:240, prot:2.2, carb:64,  gord:0.4,  fibra:7.1},
  {nome:'Damasco seco',               cat:'🍎 Fruta', kcal:241, prot:3.4, carb:63,  gord:0.5,  fibra:7.3},
  {nome:'Coco verde (água 250ml)',    cat:'🍎 Fruta', kcal:45,  prot:1.7, carb:9,   gord:0.2,  fibra:1.1},
  // ── VEGETAIS ───────────────────────────────────────
  {nome:'Brócolis cozido',            cat:'🥦 Vegetal', kcal:35,  prot:2.4, carb:7,   gord:0.4,  fibra:3.3},
  {nome:'Couve-flor cozida',          cat:'🥦 Vegetal', kcal:25,  prot:1.9, carb:5,   gord:0.3,  fibra:2},
  {nome:'Espinafre cozido',           cat:'🥦 Vegetal', kcal:23,  prot:2.9, carb:3.8, gord:0.3,  fibra:2.2},
  {nome:'Alface (folhas)',            cat:'🥦 Vegetal', kcal:15,  prot:1.4, carb:2.9, gord:0.2,  fibra:1.3},
  {nome:'Rúcula',                     cat:'🥦 Vegetal', kcal:25,  prot:2.6, carb:3.7, gord:0.7,  fibra:1.6},
  {nome:'Tomate',                     cat:'🥦 Vegetal', kcal:18,  prot:0.9, carb:3.9, gord:0.2,  fibra:1.2},
  {nome:'Tomate cereja',              cat:'🥦 Vegetal', kcal:18,  prot:0.9, carb:3.9, gord:0.2,  fibra:1.2},
  {nome:'Cenoura crua',               cat:'🥦 Vegetal', kcal:41,  prot:0.9, carb:10,  gord:0.2,  fibra:2.8},
  {nome:'Beterraba cozida',           cat:'🥦 Vegetal', kcal:44,  prot:1.7, carb:10,  gord:0.2,  fibra:2},
  {nome:'Abobrinha cozida',           cat:'🥦 Vegetal', kcal:17,  prot:1.2, carb:3.6, gord:0.3,  fibra:1.1},
  {nome:'Berinjela cozida',           cat:'🥦 Vegetal', kcal:35,  prot:0.8, carb:8.7, gord:0.2,  fibra:2.5},
  {nome:'Pepino',                     cat:'🥦 Vegetal', kcal:15,  prot:0.7, carb:3.6, gord:0.1,  fibra:0.5},
  {nome:'Pimentão verde',             cat:'🥦 Vegetal', kcal:20,  prot:0.9, carb:4.6, gord:0.2,  fibra:1.7},
  {nome:'Pimentão vermelho',          cat:'🥦 Vegetal', kcal:31,  prot:1,   carb:6,   gord:0.3,  fibra:2.1},
  {nome:'Pimentão amarelo',           cat:'🥦 Vegetal', kcal:27,  prot:1,   carb:6.3, gord:0.2,  fibra:0.9},
  {nome:'Couve manteiga cozida',      cat:'🥦 Vegetal', kcal:33,  prot:2.1, carb:6.6, gord:0.4,  fibra:3.8},
  {nome:'Repolho cozido',             cat:'🥦 Vegetal', kcal:23,  prot:1,   carb:5.5, gord:0.1,  fibra:2.3},
  {nome:'Cebola',                     cat:'🥦 Vegetal', kcal:40,  prot:1.1, carb:9.3, gord:0.1,  fibra:1.7},
  {nome:'Alho',                       cat:'🥦 Vegetal', kcal:149, prot:6.4, carb:33,  gord:0.5,  fibra:2.1},
  {nome:'Vagem cozida',               cat:'🥦 Vegetal', kcal:31,  prot:1.8, carb:7,   gord:0.1,  fibra:2.7},
  {nome:'Aspargo cozido',             cat:'🥦 Vegetal', kcal:22,  prot:2.2, carb:4.1, gord:0.2,  fibra:1.8},
  {nome:'Cogumelo champignon',        cat:'🥦 Vegetal', kcal:22,  prot:3.1, carb:3.3, gord:0.3,  fibra:1},
  {nome:'Cogumelo shitake',           cat:'🥦 Vegetal', kcal:34,  prot:2.2, carb:6.8, gord:0.5,  fibra:2.5},
  {nome:'Quiabo cozido',              cat:'🥦 Vegetal', kcal:33,  prot:2,   carb:7.5, gord:0.2,  fibra:3.2},
  {nome:'Abóbora cozida',             cat:'🥦 Vegetal', kcal:26,  prot:1,   carb:7,   gord:0.1,  fibra:0.5},
  {nome:'Chuchu cozido',              cat:'🥦 Vegetal', kcal:19,  prot:0.8, carb:4.5, gord:0.1,  fibra:1.7},
  {nome:'Palmito cozido',             cat:'🥦 Vegetal', kcal:36,  prot:2.6, carb:6.2, gord:0.5,  fibra:1.8},
  {nome:'Alcachofra cozida',          cat:'🥦 Vegetal', kcal:53,  prot:2.9, carb:12,  gord:0.2,  fibra:5.4},
  {nome:'Couve-de-bruxelas cozida',   cat:'🥦 Vegetal', kcal:36,  prot:2.6, carb:7.1, gord:0.5,  fibra:2.6},
  {nome:'Coentro fresco',             cat:'🥦 Vegetal', kcal:23,  prot:2.1, carb:3.7, gord:0.5,  fibra:2.8},
  {nome:'Salsinha fresca',            cat:'🥦 Vegetal', kcal:36,  prot:3,   carb:6.3, gord:0.8,  fibra:3.3},
  {nome:'Gengibre fresco',            cat:'🥦 Vegetal', kcal:80,  prot:1.8, carb:18,  gord:0.8,  fibra:2},
  {nome:'Broto de feijão',            cat:'🥦 Vegetal', kcal:30,  prot:3,   carb:5.9, gord:0.2,  fibra:1.8},
  {nome:'Mandioquinha cozida',        cat:'🥦 Vegetal', kcal:77,  prot:1.2, carb:18,  gord:0.1,  fibra:2},
  // ── GORDURAS ───────────────────────────────────────
  {nome:'Azeite de oliva',            cat:'🫒 Gordura', kcal:884, prot:0,   carb:0,   gord:100,  fibra:0},
  {nome:'Óleo de coco',               cat:'🫒 Gordura', kcal:862, prot:0,   carb:0,   gord:100,  fibra:0},
  {nome:'Óleo de abacate',            cat:'🫒 Gordura', kcal:884, prot:0,   carb:0,   gord:100,  fibra:0},
  {nome:'Manteiga',                   cat:'🫒 Gordura', kcal:717, prot:0.9, carb:0.1, gord:81,   fibra:0},
  {nome:'Manteiga ghee',              cat:'🫒 Gordura', kcal:876, prot:0.3, carb:0,   gord:99,   fibra:0},
  {nome:'Castanha-do-pará',           cat:'🫒 Gordura', kcal:659, prot:14,  carb:12,  gord:67,   fibra:7.5},
  {nome:'Castanha de caju',           cat:'🫒 Gordura', kcal:553, prot:18,  carb:30,  gord:44,   fibra:3.3},
  {nome:'Amêndoas',                   cat:'🫒 Gordura', kcal:579, prot:21,  carb:22,  gord:50,   fibra:12.5},
  {nome:'Nozes',                      cat:'🫒 Gordura', kcal:654, prot:15,  carb:14,  gord:65,   fibra:6.7},
  {nome:'Pistache torrado',           cat:'🫒 Gordura', kcal:562, prot:20,  carb:28,  gord:45,   fibra:10.3},
  {nome:'Macadâmia',                  cat:'🫒 Gordura', kcal:718, prot:7.9, carb:14,  gord:76,   fibra:8.6},
  {nome:'Avelã',                      cat:'🫒 Gordura', kcal:628, prot:15,  carb:17,  gord:61,   fibra:9.7},
  {nome:'Chia (semente)',             cat:'🫒 Gordura', kcal:486, prot:17,  carb:42,  gord:31,   fibra:34.4},
  {nome:'Linhaça dourada',            cat:'🫒 Gordura', kcal:534, prot:18,  carb:29,  gord:42,   fibra:27.3},
  {nome:'Sementes de abóbora',        cat:'🫒 Gordura', kcal:559, prot:30,  carb:11,  gord:49,   fibra:6},
  {nome:'Sementes de girassol',       cat:'🫒 Gordura', kcal:584, prot:21,  carb:20,  gord:51,   fibra:8.6},
  {nome:'Tahini (pasta gergelim)',    cat:'🫒 Gordura', kcal:595, prot:17,  carb:21,  gord:54,   fibra:9.3},
  {nome:'Pasta de amendoim natural',  cat:'🫒 Gordura', kcal:598, prot:25,  carb:20,  gord:51,   fibra:6},
  {nome:'Pasta de amêndoa',           cat:'🫒 Gordura', kcal:614, prot:21,  carb:19,  gord:56,   fibra:10},
  {nome:'Pasta de caju',              cat:'🫒 Gordura', kcal:587, prot:18,  carb:26,  gord:48,   fibra:3.3},
  // ── BEBIDAS ────────────────────────────────────────
  {nome:'Água',                       cat:'💧 Bebida', kcal:0,   prot:0,   carb:0,   gord:0,    fibra:0},
  {nome:'Água com gás',               cat:'💧 Bebida', kcal:0,   prot:0,   carb:0,   gord:0,    fibra:0},
  {nome:'Água de coco natural',       cat:'💧 Bebida', kcal:19,  prot:0.7, carb:3.7, gord:0.2,  fibra:1.1},
  {nome:'Café preto (sem açúcar)',    cat:'💧 Bebida', kcal:2,   prot:0.3, carb:0,   gord:0,    fibra:0},
  {nome:'Chá verde (sem açúcar)',     cat:'💧 Bebida', kcal:1,   prot:0,   carb:0.2, gord:0,    fibra:0},
  {nome:'Chá de gengibre',            cat:'💧 Bebida', kcal:5,   prot:0.1, carb:1.2, gord:0,    fibra:0},
  {nome:'Leite de amêndoa',           cat:'💧 Bebida', kcal:17,  prot:0.6, carb:0.6, gord:1.5,  fibra:0.3},
  {nome:'Leite de aveia',             cat:'💧 Bebida', kcal:45,  prot:1,   carb:8,   gord:1.5,  fibra:0.5},
  {nome:'Leite de soja',              cat:'💧 Bebida', kcal:41,  prot:3.3, carb:3.3, gord:1.8,  fibra:0.3},
  {nome:'Suco de laranja natural',    cat:'💧 Bebida', kcal:45,  prot:0.7, carb:10,  gord:0.2,  fibra:0.2},
  {nome:'Suco de melancia',           cat:'💧 Bebida', kcal:25,  prot:0.5, carb:6,   gord:0.2,  fibra:0.2},
  {nome:'Suco verde (couve+maçã)',    cat:'💧 Bebida', kcal:48,  prot:1.2, carb:11,  gord:0.3,  fibra:0.8},
  {nome:'Shake de whey chocolate',    cat:'💧 Bebida', kcal:155, prot:25,  carb:8,   gord:3,    fibra:1},
  {nome:'Vitamina de banana',         cat:'💧 Bebida', kcal:120, prot:5,   carb:22,  gord:2,    fibra:1.5},
  {nome:'Isotónico (Gatorade)',       cat:'💧 Bebida', kcal:26,  prot:0,   carb:6.7, gord:0,    fibra:0},
  {nome:'Leite de coco (lata)',       cat:'💧 Bebida', kcal:197, prot:2,   carb:6,   gord:21,   fibra:0},
  // ── SUPLEMENTOS ─────────────────────────────────────
  {nome:'Creatina monohidratada',     cat:'💊 Suplemento', kcal:0,   prot:0,   carb:0,   gord:0,    fibra:0},
  {nome:'BCAA (pó)',                  cat:'💊 Suplemento', kcal:320, prot:80,  carb:0,   gord:0,    fibra:0},
  {nome:'Glutamina (pó)',             cat:'💊 Suplemento', kcal:325, prot:81,  carb:0,   gord:0,    fibra:0},
  {nome:'Maltodextrina',              cat:'💊 Suplemento', kcal:378, prot:0,   carb:94,  gord:0,    fibra:0},
  {nome:'Dextrose',                   cat:'💊 Suplemento', kcal:380, prot:0,   carb:95,  gord:0,    fibra:0},
  {nome:'Hipercalórico (pó)',         cat:'💊 Suplemento', kcal:375, prot:15,  carb:71,  gord:4,    fibra:1},
  {nome:'Albumina (pó)',              cat:'💊 Suplemento', kcal:370, prot:87,  carb:1,   gord:0.5,  fibra:0},
  {nome:'Barra de proteína (60g)',    cat:'💊 Suplemento', kcal:220, prot:20,  carb:22,  gord:7,    fibra:2},
  // ── TEMPEROS E MOLHOS ───────────────────────────────
  {nome:'Azeite (colher 10g)',        cat:'🧂 Tempero', kcal:88,  prot:0,   carb:0,   gord:10,   fibra:0},
  {nome:'Mel de abelha',              cat:'🧂 Tempero', kcal:304, prot:0.3, carb:82,  gord:0,    fibra:0.2},
  {nome:'Açúcar branco',              cat:'🧂 Tempero', kcal:387, prot:0,   carb:100, gord:0,    fibra:0},
  {nome:'Açúcar demerara',            cat:'🧂 Tempero', kcal:380, prot:0,   carb:98,  gord:0,    fibra:0},
  {nome:'Adoçante stevia',            cat:'🧂 Tempero', kcal:0,   prot:0,   carb:0,   gord:0,    fibra:0},
  {nome:'Cacau em pó 100%',           cat:'🧂 Tempero', kcal:228, prot:20,  carb:58,  gord:14,   fibra:33},
  {nome:'Chocolate 70% cacau',        cat:'🧂 Tempero', kcal:598, prot:8,   carb:46,  gord:43,   fibra:10.9},
  {nome:'Canela em pó',               cat:'🧂 Tempero', kcal:247, prot:4,   carb:81,  gord:1.2,  fibra:53.1},
  {nome:'Molho de tomate caseiro',    cat:'🧂 Tempero', kcal:38,  prot:1.6, carb:8,   gord:0.4,  fibra:1.5},
  {nome:'Molho de soja (shoyu)',      cat:'🧂 Tempero', kcal:53,  prot:8,   carb:5,   gord:0,    fibra:0.8},
  {nome:'Ketchup',                    cat:'🧂 Tempero', kcal:112, prot:1.5, carb:27,  gord:0.4,  fibra:0.5},
  {nome:'Mostarda',                   cat:'🧂 Tempero', kcal:66,  prot:4.4, carb:5.3, gord:4,    fibra:3.2},
  {nome:'Maionese tradicional',       cat:'🧂 Tempero', kcal:680, prot:1.3, carb:2.4, gord:75,   fibra:0},
  {nome:'Maionese light',             cat:'🧂 Tempero', kcal:310, prot:1.5, carb:10,  gord:30,   fibra:0},
  {nome:'Creme de leite integral',    cat:'🧂 Tempero', kcal:204, prot:2.4, carb:3.7, gord:20,   fibra:0},
  {nome:'Vinagre balsâmico',          cat:'🧂 Tempero', kcal:88,  prot:0.5, carb:17,  gord:0,    fibra:0},
  // ── PRATOS PRONTOS ─────────────────────────────────
  {nome:'Arroz com feijão (prato)',   cat:'🍱 Prato pronto', kcal:178, prot:7.5, carb:35,  gord:1.5,  fibra:4.5},
  {nome:'Marmita fitness (300g)',     cat:'🍱 Prato pronto', kcal:350, prot:35,  carb:30,  gord:8,    fibra:4},
  {nome:'Frango grelhado + salada',   cat:'🍱 Prato pronto', kcal:185, prot:30,  carb:8,   gord:4.5,  fibra:2.5},
  {nome:'Omelete 2 ovos',             cat:'🍱 Prato pronto', kcal:190, prot:14,  carb:1.5, gord:15,   fibra:0},
  {nome:'Omelete de claras (3)',      cat:'🍱 Prato pronto', kcal:105, prot:16,  carb:1.5, gord:4,    fibra:0},
  {nome:'Tapioca de frango e queijo', cat:'🍱 Prato pronto', kcal:230, prot:18,  carb:26,  gord:6,    fibra:1},
  {nome:'Panqueca proteica',          cat:'🍱 Prato pronto', kcal:185, prot:15,  carb:20,  gord:5,    fibra:2},
  {nome:'Mingau de aveia',            cat:'🍱 Prato pronto', kcal:150, prot:5,   carb:27,  gord:3,    fibra:2.5},
  {nome:'Vitamina de banana c/ leite',cat:'🍱 Prato pronto', kcal:120, prot:5,   carb:22,  gord:2,    fibra:1.5},
  {nome:'Iogurte c/ granola e fruta', cat:'🍱 Prato pronto', kcal:195, prot:9,   carb:30,  gord:5,    fibra:2.5},
  {nome:'Salada caesar c/ frango',    cat:'🍱 Prato pronto', kcal:195, prot:20,  carb:8,   gord:9,    fibra:2},
  {nome:'Sopa de frango c/ macarrão', cat:'🍱 Prato pronto', kcal:125, prot:9,   carb:16,  gord:2.5,  fibra:1.5},
  {nome:'Sopa de lentilha',           cat:'🍱 Prot. vegetal', kcal:99, prot:6,   carb:17,  gord:1.5,  fibra:4.5},
  {nome:'Feijoada (porção 300g)',     cat:'🍱 Prato pronto', kcal:420, prot:28,  carb:40,  gord:14,   fibra:9},
  {nome:'Strogonoff de frango',       cat:'🍱 Prato pronto', kcal:185, prot:18,  carb:8,   gord:9,    fibra:0.5},
  {nome:'Frango ao curry c/ arroz',   cat:'🍱 Prato pronto', kcal:280, prot:25,  carb:28,  gord:8,    fibra:1.5},
  {nome:'Açaí puro (sem adição)',     cat:'🍱 Prato pronto', kcal:70,  prot:0.9, carb:7,   gord:5,    fibra:2.2},
  {nome:'Hambúrguer caseiro (bovino)',cat:'🍱 Prato pronto', kcal:295, prot:24,  carb:0,   gord:22,   fibra:0},
  // ── DOCES ──────────────────────────────────────────
  {nome:'Banana com mel',             cat:'🍰 Doce', kcal:120, prot:1.2, carb:31,  gord:0.3,  fibra:2.6},
  {nome:'Chocolate ao leite',         cat:'🍰 Doce', kcal:535, prot:8,   carb:59,  gord:30,   fibra:3.4},
  {nome:'Chocolate amargo 85%',       cat:'🍰 Doce', kcal:598, prot:10,  carb:37,  gord:48,   fibra:14},
  {nome:'Sorvete de creme (bola)',    cat:'🍰 Doce', kcal:207, prot:3.5, carb:24,  gord:11,   fibra:0},
  {nome:'Sorvete de fruta (picolé)',  cat:'🍰 Doce', kcal:75,  prot:0.4, carb:18,  gord:0.2,  fibra:0.3},
  {nome:'Gelatina zero (pronta)',     cat:'🍰 Doce', kcal:8,   prot:1.5, carb:0.3, gord:0,    fibra:0},
  {nome:'Brigadeiro (1un = 20g)',     cat:'🍰 Doce', kcal:96,  prot:1.4, carb:14,  gord:4.4,  fibra:0.5},
  {nome:'Bolo de cenoura (fatia)',    cat:'🍰 Doce', kcal:295, prot:4.5, carb:45,  gord:11,   fibra:1.5},
  {nome:'Bolo de chocolate (fatia)',  cat:'🍰 Doce', kcal:352, prot:5,   carb:52,  gord:15,   fibra:2},
  // ── FAST FOOD ───────────────────────────────────────
  {nome:'Hambúrguer (fast food)',     cat:'🍔 Fast food', kcal:295, prot:15, carb:28,  gord:13,   fibra:1.5},
  {nome:'Fritas (porção média)',      cat:'🍔 Fast food', kcal:380, prot:4,  carb:50,  gord:18,   fibra:4},
  {nome:'Pizza margherita (fatia)',   cat:'🍔 Fast food', kcal:267, prot:11, carb:32,  gord:10,   fibra:2},
  {nome:'Nuggets de frango (6un)',    cat:'🍔 Fast food', kcal:280, prot:14, carb:19,  gord:16,   fibra:0.8},
  {nome:'Hot dog simples',            cat:'🍔 Fast food', kcal:290, prot:11, carb:28,  gord:15,   fibra:1.5},
];

// ── Nutrição — state do modal ─────────────────────────
let nutTerm = '', nutSelected = null, nutQty = 100;

function calcN(a, g, campo){ return Math.round(a[campo] * g / 100 * 10) / 10; }

// ═══════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════
async function init(){
  applyI18n();
  applyThemeFromStorage();

  const hideLoader = () => {
    const ls = document.getElementById('loading-screen');
    if (ls) { ls.style.transition = 'opacity .4s'; ls.style.opacity = '0'; setTimeout(() => ls.style.display = 'none', 420); }
  };

  if (!ALUNO_ID) {
    hideLoader();
    document.getElementById('treino-loading').innerHTML = `
      <div style="padding:32px 24px;text-align:center">
        <div style="font-size:48px;margin-bottom:16px">🔗</div>
        <div style="font-size:18px;font-weight:700;margin-bottom:8px">Primeiro acesso</div>
        <div style="font-size:14px;color:var(--text-2);margin-bottom:24px;line-height:1.5">
          Cola o link que o teu PT te enviou para activar a app.
        </div>
        <input id="first-link-inp" type="url" inputmode="url"
          style="width:100%;background:var(--surface-2);border:1px solid var(--hairline);border-radius:12px;
                 padding:14px 16px;color:#fff;font-size:15px;outline:none;margin-bottom:12px"
          placeholder="https://josilvapt.vercel.app/aluno-v3.html?id=...">
        <button onclick="
          var v=document.getElementById('first-link-inp').value.trim();
          var m=v.match(/[?&]id=([a-f0-9-]{36})/i);
          if(m){try{localStorage.setItem('josilvaPT_id',m[1]);}catch(e){}location.replace('aluno-v3.html?id='+m[1]);}
          else{document.getElementById('first-link-inp').style.borderColor='var(--coral)';}"
          style="width:100%;background:var(--gold);color:#000;font-weight:700;font-size:16px;
                 padding:14px;border-radius:12px;border:none">
          ACTIVAR APP
        </button>
      </div>`;
    return;
  }

  const arr = await sb(`alunos?id=eq.${ALUNO_ID}&select=nome,ativo,objetivo,data_nascimento`);
  aluno = arr && arr[0];
  if (!aluno || !aluno.ativo) {
    hideLoader();
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
  setupThemePicker();
  setupLangToggle();
  setupWaterDots();

  sessoes = await sb(`sessoes?aluno_id=eq.${ALUNO_ID}&order=data.desc&limit=200`) || [];
  perimetriaHist = await sb(`perimetria?aluno_id=eq.${ALUNO_ID}&order=data.asc&limit=20`) || [];
  const anamRes = await sb(`anamnese?aluno_id=eq.${ALUNO_ID}&limit=1`) || [];
  anamnese = anamRes[0]?.dados || null;

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
  hideLoader();
}

// ═══════════════════════════════════════════════════════════
//  TREINOS (100% original)
// ═══════════════════════════════════════════════════════════
async function loadTreinos(){
  treinos = await sb(`treinos?aluno_id=eq.${ALUNO_ID}&order=criado_em.asc`) || [];
  treinos.sort((a, b) => {
    const na = parseInt(a.nome) || 999;
    const nb = parseInt(b.nome) || 999;
    return na - nb;
  });
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
  if (id !== currentTreinoId) timerReset(); // novo treino = reset cronómetro
  currentTreinoId = id;
  if (!exerciciosPorTreino[id]){
    exerciciosPorTreino[id] = await sb(`exercicios?treino_id=eq.${id}&order=ordem.asc`) || [];
  }

  for (const ex of exerciciosPorTreino[id]){
    if (!doneSet[ex.id]) doneSet[ex.id] = new Set();
    if (!cargas[ex.id]) {
      const ultima = lastCargaFor(ex.id);
      if (ultima) cargas[ex.id] = ultima;
    }
  }
  sc('cargas', cargas);
  renderTreino();
}

// ═══════════════════════════════════════════════════════════
//  CRONÓMETRO DE TREINO
// ═══════════════════════════════════════════════════════════
function timerFmt(ms){
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2,'0');
  return m + ':' + ss;
}
function timerStart_(){
  if (timerStart !== null) return; // já está a correr
  timerStart = Date.now();
  const pill  = document.getElementById('timer-pill');
  const disp  = document.getElementById('timer-display');
  if (pill) pill.classList.add('show');
  timerInterval = setInterval(() => {
    if (disp) disp.textContent = timerFmt(Date.now() - timerStart);
  }, 1000);
}
function timerStop(){
  clearInterval(timerInterval);
  timerInterval = null;
  const pill = document.getElementById('timer-pill');
  if (pill) pill.classList.remove('show');
}
function timerReset(){
  timerStop();
  timerStart = null;
  const disp = document.getElementById('timer-display');
  if (disp) disp.textContent = '00:00';
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
        ${ex.video_url ? `<button class="ex-video-btn" data-video="${ex.id}" title="Ver vídeo do exercício">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="2" y="5" width="13" height="14" rx="2"/>
            <path d="M15 9l5-2.5v9L15 13" stroke-linejoin="round"/>
          </svg>
        </button>` : ''}
      </div>
      ${ex.video_url ? `<div class="ex-video-wrap" id="vid-${ex.id}"></div>` : ''}
      <div class="carga-block">
        <button class="carga-btn" data-act="-" data-id="${ex.id}">−</button>
        <div class="carga-mid">
          <div class="carga-val">
            <input class="carga-inp" type="number" inputmode="decimal" step="0.5" min="0"
              value="${c > 0 ? c : ''}" placeholder="—" data-id="${ex.id}">
            <span class="kg"${c > 0 ? '' : ' style="display:none"'}>kg</span>
          </div>
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
    list.addEventListener('change', onExListChange);
    list.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' && ev.target.classList.contains('carga-inp')) {
        ev.preventDefault(); ev.target.blur();
      }
    });
    list.dataset.bound = '1';
  }

  updateRing();
}

function exVideoEmbedUrl(url){
  if (!url) return null;
  // youtu.be/ID
  let m = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}?playsinline=1&rel=0`;
  // youtube.com/watch?v=ID
  m = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}?playsinline=1&rel=0`;
  // youtube.com/shorts/ID
  m = url.match(/\/shorts\/([A-Za-z0-9_-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}?playsinline=1&rel=0`;
  // URL directa de vídeo
  return url;
}

function onExListClick(ev){
  // toggle vídeo
  const vidBtn = ev.target.closest('[data-video]');
  if (vidBtn){
    const id = vidBtn.dataset.video;
    const wrap = document.getElementById('vid-' + id);
    if (!wrap) return;
    const opening = !wrap.classList.contains('open');
    wrap.classList.toggle('open', opening);
    vidBtn.classList.toggle('active', opening);
    if (opening && !wrap.dataset.loaded){
      const ex = (exerciciosPorTreino[currentTreinoId] || []).find(x => x.id === id);
      const embedUrl = ex ? exVideoEmbedUrl(ex.video_url) : null;
      if (embedUrl){
        const ifr = document.createElement('iframe');
        ifr.src = embedUrl;
        ifr.allowFullscreen = true;
        ifr.allow = 'autoplay; fullscreen; picture-in-picture';
        ifr.loading = 'lazy';
        wrap.appendChild(ifr);
        wrap.dataset.loaded = '1';
      }
    }
    return;
  }

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
    else {
      doneSet[id].add(k);
      timerStart_(); // inicia ao marcar a 1.ª série
    }
    const out = {};
    Object.keys(doneSet).forEach(k => out[k] = [...doneSet[k]]);
    sc('doneSet', out);
    renderTreino();
  }
}

function onExListChange(ev){
  const inp = ev.target;
  if (!inp.classList.contains('carga-inp')) return;
  const id  = inp.dataset.id;
  const val = parseFloat(inp.value);
  cargas[id] = (!isNaN(val) && val > 0) ? Math.round(val * 10) / 10 : 0;
  sc('cargas', cargas);
  renderTreino();
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

async function registrar(){
  const t = treinos.find(x => x.id === currentTreinoId);
  const exs = exerciciosPorTreino[currentTreinoId] || [];
  const btn = document.getElementById('btn-reg');
  btn.textContent = T('reg_saving'); btn.disabled = true;

  const duracao_seg = timerStart !== null ? Math.round((Date.now() - timerStart) / 1000) : null;
  const sessaoData = {
    aluno_id: ALUNO_ID, treino_id: currentTreinoId,
    treino_nome: t?.nome || '', data: todayISO(),
    ...(duracao_seg !== null && { duracao_seg })
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
    const sids = sessoes.map(s => s.id);
    allCargasHist = await sb(
      `sessao_cargas?sessao_id=in.(${sids.join(',')})&select=*,sessoes(data)&order=sessoes(data).desc`
    ) || [];
    toast(T('sucesso'));
  } else {
    toast('Sem conexão — vamos tentar mais tarde.');
  }

  exs.forEach(e => doneSet[e.id] = new Set());
  const out = {};
  Object.keys(doneSet).forEach(k => out[k] = [...doneSet[k]]);
  sc('doneSet', out);

  // mostra tempo no banner e para o cronómetro
  const bannerSub = document.querySelector('#success-banner .success-sub');
  if (bannerSub && duracao_seg !== null) {
    bannerSub.textContent = timerFmt(duracao_seg * 1000) + ' · ' + (LANG==='pt' ? 'Duração do treino' : 'Workout duration');
  }
  timerReset();

  const banner = document.getElementById('success-banner');
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 4500);

  btn.textContent = T('reg_default');
  renderTreino();
}

// ═══════════════════════════════════════════════════════════
//  EVOLUÇÃO (100% original)
// ═══════════════════════════════════════════════════════════
async function renderEvolucao(){
  document.getElementById('kpi-sessoes').textContent = sessoes.length;
  const last30 = sessoes.filter(s => daysAgo(s.data) <= 30).length;
  document.getElementById('kpi-sessoes-d').textContent = `+${last30} ${LANG==='pt'?'em 30 dias':'in 30 days'}`;

  const s90 = sessoes.filter(s => daysAgo(s.data) <= 90).length;
  const freq = s90 > 0 ? (s90 / (90/7)).toFixed(1) : '0.0';
  document.getElementById('kpi-freq').textContent = freq + '×';
  document.getElementById('kpi-freq-d').textContent = LANG==='pt' ? '/ semana' : '/ week';

  // Volume split: weekly / monthly / total
  const volOf = (days) => {
    if (!allCargasHist || !sessoes.length) return 0;
    const ids = new Set(sessoes.filter(s => daysAgo(s.data) <= days).map(s => s.id));
    return allCargasHist.filter(c => ids.has(c.sessao_id)).reduce((s,c) => s + (parseFloat(c.carga_kg)||0), 0);
  };
  const volW = Math.round(volOf(7));
  const volM = Math.round(volOf(30));
  const volT = allCargasHist ? Math.round(allCargasHist.reduce((s,c)=>s+(parseFloat(c.carga_kg)||0),0)) : 0;
  // avg weekly from monthly
  const avgW = Math.round(volM / 4);
  const avgM = volT && sessoes.length > 4 ? Math.round(volT / (sessoes.length / (90/30))) : 0;
  const fmt = n => n >= 1000 ? (n/1000).toFixed(1)+'t' : n+'kg';
  const delta = (val, avg) => {
    if (!avg || !val) return ['flat','—'];
    const d = Math.round(val - avg);
    return d > 0 ? ['up', '+'+fmt(d)] : d < 0 ? ['dn', fmt(d)] : ['flat','='];
  };
  document.getElementById('vol-week').textContent = fmt(volW);
  document.getElementById('vol-month').textContent = fmt(volM);
  document.getElementById('vol-total').textContent = fmt(volT);
  const [wCls, wTxt] = delta(volW, avgW);
  const [mCls, mTxt] = delta(volM, avgM);
  const vwd = document.getElementById('vol-week-d'); vwd.textContent = wTxt; vwd.className = 'vol-sub ' + wCls;
  const vmd = document.getElementById('vol-month-d'); vmd.textContent = mTxt; vmd.className = 'vol-sub ' + mCls;
  document.getElementById('vol-total-d').textContent = (allCargasHist?.length||0) + ' reg';
  document.getElementById('vol-total-d').className = 'vol-sub flat';

  // carrega exercícios se necessário
  for (const t of treinos){
    if (!exerciciosPorTreino[t.id]){
      exerciciosPorTreino[t.id] = await sb(`exercicios?treino_id=eq.${t.id}&order=ordem.asc`) || [];
    }
  }

  const selBtn  = document.getElementById('evo-sel-btn');
  const selMenu = document.getElementById('evo-sel-menu');
  const selLbl  = document.getElementById('evo-sel-lbl');

  // fecha o menu ao clicar fora
  if (!selMenu.dataset.bound){
    selBtn.addEventListener('click', ev => {
      ev.stopPropagation();
      selBtn.classList.toggle('open');
      selMenu.classList.toggle('open');
    });
    document.addEventListener('click', () => {
      selBtn.classList.remove('open');
      selMenu.classList.remove('open');
    });
    selMenu.dataset.bound = '1';
  }

  // popula opções (só uma vez)
  if (!selMenu.children.length){
    const allExs = Object.values(exerciciosPorTreino).flat();
    allExs.forEach(ex => {
      const opt = document.createElement('div');
      opt.className = 'chart-sel-opt';
      opt.dataset.exId = ex.id;
      opt.textContent = ex.nome;
      opt.addEventListener('click', ev => {
        ev.stopPropagation();
        selMenu.querySelectorAll('.chart-sel-opt').forEach(o => o.classList.remove('on'));
        opt.classList.add('on');
        selLbl.textContent = ex.nome;
        selBtn.classList.remove('open');
        selMenu.classList.remove('open');
        buildChart(ex.id);
      });
      selMenu.appendChild(opt);
    });

    // auto-seleciona o primeiro com histórico
    const withHist = allExs.find(ex => allCargasHist.some(c => c.exercicio_id === ex.id));
    const pick = withHist || allExs[0];
    if (pick){
      const opt = selMenu.querySelector(`[data-ex-id="${pick.id}"]`);
      if (opt){ opt.classList.add('on'); selLbl.textContent = pick.nome; }
      buildChart(pick.id);
    }
  } else {
    // re-render só o gráfico com a seleção atual
    const on = selMenu.querySelector('.chart-sel-opt.on');
    if (on) buildChart(on.dataset.exId);
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
    prs.push({ name: exNames[exId], val: parseFloat(top.carga_kg), delta, date: top.sessoes?.data || '' });
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
  sessoes.forEach(s => { const d = s.data; if (!d) return; dayCount[d] = (dayCount[d] || 0) + 1; });
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

function buildChart(exId){
  if (!exId || !allCargasHist) return;
  const rows = allCargasHist
    .filter(c => c.exercicio_id === exId && c.sessoes?.data)
    .slice().sort((a,b) => new Date(a.sessoes.data) - new Date(b.sessoes.data));
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

  const labels = rows.map(r => { const dt = new Date(r.sessoes.data); return `${dt.getDate()}/${dt.getMonth()+1}`; });
  const step = Math.max(1, Math.ceil(labels.length/6));
  ax.innerHTML = labels.map((l,i) => (i%step===0 || i===labels.length-1) ? `<span>${l}</span>` : '<span></span>').join('');

  document.getElementById('chart-val').textContent = d[d.length-1];
  const delta = +(d[d.length-1] - d[0]).toFixed(1);
  const dEl = document.getElementById('chart-delta');
  if (delta > 0){ dEl.textContent = `+${delta} kg ${LANG==='pt'?'em':'in'} ${d.length} ${LANG==='pt'?'sessões':'sessions'}`; dEl.className = 'chart-stat-d'; }
  else if (delta < 0){ dEl.textContent = `${delta} kg ${LANG==='pt'?'em':'in'} ${d.length}`; dEl.className = 'chart-stat-d dn'; }
  else { dEl.textContent = `${LANG==='pt'?'Estável em':'Stable over'} ${d.length} ${LANG==='pt'?'sessões':'sessions'}`; dEl.className = 'chart-stat-d flat'; }
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
//  NUTRIÇÃO — food tracker com base de dados local (500 alimentos)
// ═══════════════════════════════════════════════════════════
async function renderNutricao(){
  const hoje = todayISO();
  const refs = await sb(`refeicoes?aluno_id=eq.${ALUNO_ID}&data=eq.${hoje}&order=criado_em.asc`) || [];
  const lastP = perimetriaHist[perimetriaHist.length - 1];
  const peso = parseFloat(lastP?.peso) || 70;
  const gorduraPct = parseFloat(lastP?.gordura) || null;
  const meta = calcDailyKcal(peso, alunoObjetivo, gorduraPct);
  const metaP = Math.round(peso * 1.8);
  const metaC = Math.round(meta * 0.45 / 4);
  const metaG = Math.round(meta * 0.25 / 9);

  // Suporta tanto colunas antigas (calorias/proteina/carboidratos/gordura)
  // como o novo formato dados JSON (caso venha do food tracker)
  const getVal = (r, campo) => {
    if (r.dados && r.dados[campo] !== undefined) return parseFloat(r.dados[campo]) || 0;
    const map = {kcal:'calorias', prot:'proteina', carb:'carboidratos', gord:'gordura'};
    return parseFloat(r[map[campo]] || r[campo]) || 0;
  };
  const getNome = r => r.descricao_usuario || (LANG==='pt'?'Refeição':'Meal');

  const kcal = refs.reduce((s,r) => s + getVal(r,'kcal'), 0);
  const prot = refs.reduce((s,r) => s + getVal(r,'prot'), 0);
  const carb = refs.reduce((s,r) => s + getVal(r,'carb'), 0);
  const gord = refs.reduce((s,r) => s + getVal(r,'gord'), 0);

  const now = new Date();
  document.getElementById('n-kicker').textContent = LANG==='pt'
    ? `Hoje · ${now.getDate()} ${T('months')[now.getMonth()]}`
    : `Today · ${T('months')[now.getMonth()]} ${now.getDate()}`;
  document.getElementById('n-kcal').textContent      = Math.round(kcal).toLocaleString('pt-PT');
  document.getElementById('n-kcal-meta').textContent = meta.toLocaleString('pt-PT');
  const pct = meta ? Math.round((kcal/meta)*100) : 0;
  const pctEl = document.getElementById('n-pct');
  pctEl.textContent = pct + '%';
  pctEl.style.color = pct === 0 ? 'var(--text-3)' : pct > 100 ? 'var(--coral)' : 'var(--green)';

  // main kcal ring
  const mainRing = document.getElementById('n-ring-progress');
  if (mainRing) {
    const DA = 264;
    mainRing.style.transition = 'none';
    mainRing.style.strokeDashoffset = DA;
    requestAnimationFrame(() => {
      mainRing.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)';
      mainRing.style.strokeDashoffset = DA * (1 - Math.min(1, meta ? kcal/meta : 0));
    });
  }

  // macro values + goal text
  document.getElementById('n-prot').textContent   = Math.round(prot);
  document.getElementById('n-prot-m').textContent = metaP;
  document.getElementById('n-carb').textContent   = Math.round(carb);
  document.getElementById('n-carb-m').textContent = metaC;
  document.getElementById('n-gord').textContent   = Math.round(gord);
  document.getElementById('n-gord-m').textContent = metaG;

  // macro rings (C = 2π×44 ≈ 276.5)
  const C = 276.5;
  const setR = (id, val) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transition = 'none';
    el.style.strokeDashoffset = C;
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';
      el.style.strokeDashoffset = C * (1 - Math.min(1, val));
    });
  };
  setR('m-p', metaP ? prot/metaP : 0);
  setR('m-c', metaC ? carb/metaC : 0);
  setR('m-g', metaG ? gord/metaG : 0);

  const ml = document.getElementById('meals-list');
  if (!refs.length){
    ml.innerHTML = `<div class="empty">${T('n_no_meal')}</div>`;
  } else {
    ml.innerHTML = refs.map((r,i) => {
      const hora = r.criado_em ? new Date(r.criado_em).toTimeString().slice(0,5) : '—';
      const nome = getNome(r);
      const rKcal = getVal(r,'kcal'); const rProt = getVal(r,'prot');
      const rCarb = getVal(r,'carb'); const rGord = getVal(r,'gord');
      return `
      <div class="meal in" style="animation-delay:${.06 + i*.06}s">
        <div class="meal-head">
          <span class="meal-time">${hora}</span>
          <span class="meal-name">${escapeHTML(nome)}</span>
          <span class="meal-kcal">${Math.round(rKcal)}<small>kcal</small></span>
        </div>
        <div class="meal-macros">
          <span>P <b>${Math.round(rProt)}g</b></span>
          <span>C <b>${Math.round(rCarb)}g</b></span>
          <span>G <b>${Math.round(rGord)}g</b></span>
        </div>
      </div>`;
    }).join('');
  }
}

function calcDailyKcal(peso, obj, gorduraPct = null){
  let pesoCalc = peso;
  if (gorduraPct && gorduraPct > 20) {
    const lean = peso * (1 - gorduraPct / 100);
    pesoCalc = (lean + lean * 1.2) / 2;
  }
  const base = pesoCalc * 30;
  if (/secar|cut|emagre/i.test(obj || '')) return Math.round(base * 0.85 / 50) * 50;
  if (/hipertrof|bulk|massa/i.test(obj || '')) return Math.round(base * 1.15 / 50) * 50;
  return Math.round(base / 50) * 50;
}

// ── Modal de adicionar refeição ───────────────────────────
function abrirModalNutricao(){
  nutTerm = ''; nutSelected = null; nutQty = 100;
  const m = document.getElementById('nut-modal');
  if (m){ m.classList.add('open'); renderNutModal(); }
}
function fecharModalNutricao(){
  const m = document.getElementById('nut-modal');
  if (m) m.classList.remove('open');
}

function renderNutModal(){
  const inp = document.getElementById('nut-search-inp');
  if (inp && inp.value !== nutTerm) inp.value = nutTerm;

  const resList = document.getElementById('nut-search-results');
  const det     = document.getElementById('nut-detail');

  if (nutSelected){
    resList.style.display = 'none';
    det.style.display = 'block';
    const f = nutSelected; const g = nutQty;
    det.innerHTML = `
      <div class="nut-food-title">${escapeHTML(f.nome)}</div>
      <div class="nut-qty-row">
        <button class="nut-adj" onclick="nutAdj(-10)">−10g</button>
        <input class="nut-qty-inp" type="number" value="${g}" min="1" max="2000"
          oninput="nutQty=parseInt(this.value)||0;renderNutModal()">
        <button class="nut-adj" onclick="nutAdj(10)">+10g</button>
        <span style="color:var(--t2);font-size:.85rem">g</span>
      </div>
      <div class="nut-macros-preview">
        <div class="nmp"><span>${Math.round(calcN(f,g,'kcal'))}</span><em>kcal</em></div>
        <div class="nmp"><span>${Math.round(calcN(f,g,'prot')*10)/10}</span><em>Prot</em></div>
        <div class="nmp"><span>${Math.round(calcN(f,g,'carb')*10)/10}</span><em>Carb</em></div>
        <div class="nmp"><span>${Math.round(calcN(f,g,'gord')*10)/10}</span><em>Gord</em></div>
        <div class="nmp"><span>${Math.round(calcN(f,g,'fibra')*10)/10}</span><em>Fibra</em></div>
      </div>
      <div class="nut-actions">
        <button class="nut-btn-sec" onclick="nutSelected=null;renderNutModal()">← Voltar</button>
        <button class="nut-btn-pri" onclick="nutGuardar()">Adicionar</button>
      </div>`;
    return;
  }

  det.style.display = 'none';
  resList.style.display = 'block';

  if (!nutTerm){
    const cats = [...new Set(ALIMENTOS_DB.map(a => a.cat))];
    resList.innerHTML = cats.map(c =>
      `<div class="nut-cat" data-cat="${escapeHTML(c)}">${escapeHTML(c)} <span>›</span></div>`
    ).join('');
  } else {
    const term = nutTerm.toLowerCase();
    const res = ALIMENTOS_DB.filter(a =>
      a.nome.toLowerCase().includes(term) || a.cat.toLowerCase().includes(term)
    ).slice(0, 40);
    const backLbl = LANG === 'pt' ? '← Categorias' : '← Categories';
    const backBtn = `<button class="nut-back" data-nut-back>${backLbl} · <em>${escapeHTML(nutTerm)}</em></button>`;
    resList.innerHTML = backBtn + (res.length
      ? res.map(a => `<div class="nut-item" data-nome="${escapeHTML(a.nome)}">
          <span>${escapeHTML(a.nome)}</span>
          <span class="nut-item-kcal">${a.kcal} kcal/100g</span>
        </div>`).join('')
      : `<div class="empty" style="padding:16px">${LANG==='pt'?'Nenhum resultado.':'No results.'}</div>`);
  }

  if (!resList.dataset.bound) {
    resList.dataset.bound = '1';
    resList.addEventListener('click', ev => {
      if (ev.target.closest('[data-nut-back]')) {
        nutTerm = '';
        const inp = document.getElementById('nut-search-inp');
        if (inp) inp.value = '';
        renderNutModal();
        return;
      }
      const cat = ev.target.closest('[data-cat]');
      if (cat) { nutSearchCat(cat.dataset.cat); return; }
      const item = ev.target.closest('[data-nome]');
      if (item) nutEscolher(item.dataset.nome);
    });
  }
}

function nutSearchCat(cat){
  nutTerm = cat;
  const inp = document.getElementById('nut-search-inp');
  if (inp) inp.value = cat;
  renderNutModal();
}
function nutEscolher(nome){
  nutSelected = ALIMENTOS_DB.find(a => a.nome === nome) || null;
  nutQty = 100;
  renderNutModal();
}
function nutAdj(delta){
  nutQty = Math.max(1, nutQty + delta);
  renderNutModal();
}
function nutOnSearch(val){
  nutTerm = val; nutSelected = null; renderNutModal();
}

async function nutGuardar(){
  if (!nutSelected || nutQty <= 0) return;
  const f = nutSelected; const g = nutQty;
  const dados = {
    nome: `${f.nome} (${g}g)`,
    gramas: g,
    kcal:  calcN(f,g,'kcal'),
    prot:  calcN(f,g,'prot'),
    carb:  calcN(f,g,'carb'),
    gord:  calcN(f,g,'gord'),
    fibra: calcN(f,g,'fibra'),
  };
  // Guardar com colunas compatíveis com schema existente + dados JSON
  const payload = {
    aluno_id:          ALUNO_ID,
    data:              todayISO(),
    tipo:              'texto',
    descricao_usuario: dados.nome,
    calorias:          Math.round(dados.kcal),
    proteina:          dados.prot,
    carboidratos:      dados.carb,
    gordura:           dados.gord,
  };
  const res = await sb('refeicoes', { method:'POST', body: JSON.stringify(payload) });
  if (res?.[0]){
    toast('✓ Adicionado');
  } else {
    toast('✓ Adicionado (local)');
  }
  fecharModalNutricao();
  renderNutricao();
}

// ═══════════════════════════════════════════════════════════
//  PERFIL (100% original)
// ═══════════════════════════════════════════════════════════
let _pfBadges = [];
let _pfLvl = 1, _pfStreak = 0;

function renderPerfil(){
  if (!aluno) return;

  // Hero
  const av = document.getElementById('pf-avatar');
  const savedPhoto = lc('profilePhoto');
  if (savedPhoto) {
    av.style.cssText = 'background-image:url(' + savedPhoto + ');background-size:cover;background-position:center;';
    av.textContent = '';
  } else {
    av.style.cssText = '';
    av.textContent = initials(aluno.nome);
  }
  document.getElementById('pf-name').textContent   = aluno.nome;
  const idade = calcIdade(aluno.data_nascimento);
  const idadeStr = idade ? `${idade} ${LANG==='pt'?'anos':'years old'} · ` : '';
  document.getElementById('pf-meta').innerHTML = alunoObjetivo
    ? `${idadeStr}<em>${escapeHTML(alunoObjetivo)}</em>`
    : `${idadeStr}${LANG==='pt'?'Em treino com Jo Silva':'Training with Jo Silva'}`;

  // Phrase
  const total = sessoes.length;
  const h = new Date().getHours();
  const saud = h < 12 ? (LANG==='pt'?'Bom dia':'Good morning') : h < 18 ? (LANG==='pt'?'Boa tarde':'Good afternoon') : (LANG==='pt'?'Boa noite':'Good evening');
  const fp = LANG==='pt' ? [
    'Cada sessão conta. Continua. 💪',
    'O teu progresso é real e visível.',
    'Consistência supera motivação.',
    total ? `${total} sessões concluídas. Incrível!` : 'A primeira sessão está à espera!',
  ] : [
    'Every session counts. Keep going. 💪',
    'Your progress is real and visible.',
    'Consistency beats motivation.',
    total ? `${total} sessions done. Incredible!` : 'Your first session awaits!',
  ];
  document.getElementById('pf-phrase').textContent = `${saud} · ${fp[Math.floor(Math.random()*fp.length)]}`;

  // XP + level
  const xp = total * 50;
  let lvl = 1, cumul = 0;
  while (xp >= cumul + 200*lvl){ cumul += 200*lvl; lvl++; }
  _pfLvl = lvl;
  _pfStreak = computeStreak();

  // Gamificação data
  const last30 = sessoes.filter(s => daysAgo(s.data) <= 30).length;
  const last90 = sessoes.filter(s => daysAgo(s.data) <= 90).length;
  const volTotal = allCargasHist ? allCargasHist.reduce((s,c)=>s+(parseFloat(c.carga_kg)||0),0) : 0;
  const numPRs = (() => {
    if (!allCargasHist) return 0;
    const groups = {};
    allCargasHist.forEach(c => { if (!groups[c.exercicio_id]) groups[c.exercicio_id]=[]; groups[c.exercicio_id].push(parseFloat(c.carga_kg)||0); });
    return Object.values(groups).filter(arr => arr.length > 1).length;
  })();
  const streak = _pfStreak;
  _pfBadges = [
    { cat:'💪', ico:'🌱', l:'Primeiro passo',   u:'1 sessão',          ok: total >= 1 },
    { cat:'💪', ico:'🔑', l:'5 sessões',         u:'5 sessões',         ok: total >= 5 },
    { cat:'💪', ico:'💪', l:'10 sessões',         u:'10 sessões',        ok: total >= 10 },
    { cat:'💪', ico:'🎯', l:'25 sessões',         u:'25 sessões',        ok: total >= 25 },
    { cat:'💪', ico:'🏆', l:'50 sessões',         u:'50 sessões',        ok: total >= 50 },
    { cat:'💪', ico:'🥇', l:'100 sessões',        u:'100 sessões',       ok: total >= 100 },
    { cat:'💪', ico:'💎', l:'200 sessões',        u:'200 sessões',       ok: total >= 200 },
    { cat:'💪', ico:'👑', l:'500 sessões',        u:'500 sessões',       ok: total >= 500 },
    { cat:'🔥', ico:'🌡️',l:'1 semana seguida',  u:'7 dias',             ok: streak >= 7 },
    { cat:'🔥', ico:'🔥', l:'2 semanas seguidas', u:'14 dias',           ok: streak >= 14 },
    { cat:'🔥', ico:'⚡', l:'1 mês seguido',      u:'30 dias',           ok: streak >= 30 },
    { cat:'🔥', ico:'🌟', l:'3 meses seguidos',  u:'90 dias',            ok: streak >= 90 },
    { cat:'🔥', ico:'🏅', l:'Mês perfeito',      u:'12 sessões/mês',    ok: last30 >= 12 },
    { cat:'🔥', ico:'🎖️',l:'Trimestre activo',  u:'24 sessões/90d',    ok: last90 >= 24 },
    { cat:'🏋️',ico:'🪨', l:'1 tonelada',        u:'1 000 kg',           ok: volTotal >= 1000 },
    { cat:'🏋️',ico:'⚓', l:'10 toneladas',       u:'10 000 kg',          ok: volTotal >= 10000 },
    { cat:'🏋️',ico:'🏗️',l:'50 toneladas',      u:'50 000 kg',          ok: volTotal >= 50000 },
    { cat:'🏋️',ico:'🚀', l:'100 toneladas',      u:'100 000 kg',         ok: volTotal >= 100000 },
    { cat:'🏋️',ico:'🌍', l:'500 toneladas',      u:'500 000 kg',         ok: volTotal >= 500000 },
    { cat:'📈', ico:'📊', l:'Primeiro recorde',  u:'1 PR',               ok: numPRs >= 1 },
    { cat:'📈', ico:'📈', l:'PR x 3',            u:'3 exercícios',       ok: numPRs >= 3 },
    { cat:'📈', ico:'👊', l:'PR x 5',            u:'5 exercícios',       ok: numPRs >= 5 },
    { cat:'📈', ico:'🦾', l:'PR x 10',           u:'10 exercícios',      ok: numPRs >= 10 },
    { cat:'📈', ico:'🧬', l:'PR em todos',       u:'Todos exerc.',       ok: numPRs >= 20 },
    { cat:'⏱️', ico:'⚡', l:'Sessão rápida',     u:'< 30 min',           ok: false },
    { cat:'⏱️', ico:'🕐', l:'Maratonista',       u:'> 90 min',           ok: false },
    { cat:'⏱️', ico:'🌅', l:'Madrugador',        u:'Treino antes 8h',    ok: false },
    { cat:'⏱️', ico:'🌙', l:'Noctívago',         u:'Treino após 21h',    ok: false },
    { cat:'🌟', ico:'🎉', l:'Bem-vindo!',        u:'Primeiro login',      ok: true },
    { cat:'🌟', ico:'🌈', l:'Personalizado',     u:'Mudou o tema',        ok: !!localStorage.getItem('josilvaPT_theme') && localStorage.getItem('josilvaPT_theme') !== 'padrao' },
    { cat:'🌟', ico:'🤖', l:'Nutricionista',     u:'Registou 1 refeição', ok: false },
    { cat:'🌟', ico:'💧', l:'Hidratado',         u:'8 copos num dia',     ok: false },
  ];

  // Update card values
  const lp = LANG==='pt'?'Nv ':'Lv ';
  document.getElementById('pfc-lvl-v').textContent = lp + lvl;
  const unlocked = _pfBadges.filter(b => b.ok).length;
  document.getElementById('pfc-bdg-v').textContent = unlocked + '/' + _pfBadges.length;
  const peso = perimetriaHist.length ? perimetriaHist[perimetriaHist.length-1].peso : null;
  document.getElementById('pfc-bio-v').textContent = peso ? peso + 'kg' : '—';

  // Show default section (nivel)
  pfSelectCard('nivel');
}

function pfSelectCard(name){
  document.querySelectorAll('.pf-card').forEach(c => c.classList.toggle('on', c.dataset.pfc === name));
  const content = document.getElementById('pf-content');
  content.innerHTML = '';

  const xp = sessoes.length * 50;
  let lvl = _pfLvl, cumul = 0;
  const streak = _pfStreak;
  while (xp > cumul + 200*lvl - 1){ cumul += 200*lvl; lvl++; } // recalc for safety
  lvl = _pfLvl;
  let c2 = 0; let l2 = 1; while (xp >= c2 + 200*l2){ c2 += 200*l2; l2++; }
  const intoLvl = xp - c2, lvlReq = 200 * l2;
  const lp = LANG==='pt'?'Nv ':'Lv ';

  const wrap = document.createElement('div');
  wrap.className = 'pfc-section';

  if (name === 'nivel'){
    wrap.innerHTML = `
      <div class="level-card in" style="margin-top:0">
        <div class="level-row">
          <div>
            <div class="level-l" data-i18n="pf_level">${LANG==='pt'?'Nível atual':'Current level'}</div>
            <div class="level-num"><em id="pf-lvl">${l2}</em></div>
          </div>
          <div style="text-align:right">
            <div class="level-l">XP</div>
            <div class="level-xp"><b id="pf-xp">${intoLvl.toLocaleString('pt-PT')}</b> / <span id="pf-xp-max">${lvlReq.toLocaleString('pt-PT')}</span></div>
          </div>
        </div>
        <div class="xp-bar"><div class="xp-fill" id="xp-fill" style="width:0%"></div></div>
        <div class="level-footer">
          <span>${lp}${l2}</span>
          <span>${(lvlReq-intoLvl).toLocaleString('pt-PT')} XP ${LANG==='pt'?'para':'to'} ${lp}${l2+1}</span>
          <span>${lp}${l2+1}</span>
        </div>
      </div>
      <div class="streak-card in" style="animation-delay:.08s">
        <div class="streak-icon">🔥</div>
        <div class="streak-mid">
          <div class="streak-num"><span>${streak}</span><small> ${LANG==='pt'?'dias':'days'}</small></div>
          <div class="streak-sub">${streak >= 7 ? (LANG==='pt'?'streak ativo · <b>em chamas</b>':'active streak · <b>on fire</b>') : (streak ? (LANG==='pt'?'streak ativo':'active streak') : (LANG==='pt'?'Começa hoje':'Start today'))}</div>
        </div>
      </div>`;
    content.appendChild(wrap);
    requestAnimationFrame(() => {
      const fill = document.getElementById('xp-fill');
      if (fill){ fill.style.transition = 'width 1.6s cubic-bezier(.4,0,.2,1)'; fill.style.width = (intoLvl/lvlReq*100).toFixed(1)+'%'; }
    });

  } else if (name === 'conquistas'){
    const cats = [...new Set(_pfBadges.map(b => b.cat))];
    const unlocked = _pfBadges.filter(b => b.ok).length;
    wrap.innerHTML = `
      <div class="badges" style="padding-top:0">
        <div class="sec-header"><div class="sec-title">${LANG==='pt'?'Conquistas':'Achievements'}</div><div class="sec-link">${unlocked} / ${_pfBadges.length}</div></div>
        <div class="badge-grid" id="badge-grid">
          ${cats.map(cat => `<div class="badge-cat-label">${cat}</div>` +
            _pfBadges.filter(b => b.cat===cat).map(b => `
              <div class="badge ${b.ok?'on':'locked'}">
                <div class="badge-ico">${b.ico}</div>
                <div class="badge-lbl">${b.l}</div>
                <div class="badge-sub">${b.ok?(LANG==='pt'?'✓ desbloqueado':'✓ unlocked'):b.u}</div>
              </div>`).join('')).join('')}
        </div>
      </div>`;
    content.appendChild(wrap);

  } else if (name === 'avaliacao'){
    renderBiometria(content);

  } else if (name === 'orient'){
    wrap.innerHTML = `
      <div class="orient" style="margin-top:0">
        <div class="orient-title">${LANG==='pt'?'Orientações da semana':'Week guidelines'}</div>
        <div>${T('orient_default').map(([title,txt],i)=>`
          <div class="orient-row">
            <div class="orient-num">${String(i+1).padStart(2,'0')}</div>
            <div class="orient-text"><b>${title}:</b> ${txt}</div>
          </div>`).join('')}
        </div>
      </div>`;
    content.appendChild(wrap);
  }
}

function renderBiometria(container){
  const old = document.getElementById('bio-card');
  if (old) old.remove();

  const p = perimetriaHist.length ? perimetriaHist[perimetriaHist.length - 1] : null;
  if (!p) return;

  const m   = p.medidas || {};
  const an  = anamnese  || {};

  const peso       = parseFloat(p.peso)       || 0;
  const gordura    = parseFloat(p.gordura)     || 0;
  const massaMagra = parseFloat(p.massa_magra) || 0;
  const massaGorda = +(peso * gordura / 100).toFixed(1);
  const altura     = an.altura_cm || m.altura_cm || 0;
  const imc        = m.bio_imc || an.imc || (altura ? +(peso/((altura/100)**2)).toFixed(1) : 0);
  const tmb        = m.bio_tmb || an.tmb_kcal || 0;
  const gordVisc   = m.bio_gord_visc || an.gordura_visceral || 0;
  const gordAbs    = m.bio_gord_abs  || 0;

  const imcLabel = imc < 18.5 ? (LANG==='pt'?'Abaixo peso':'Underweight')
    : imc < 25 ? 'Normal' : imc < 30 ? (LANG==='pt'?'Sobrepeso':'Overweight')
    : (LANG==='pt'?'Obesidade':'Obese');

  const dataFmt = p.data ? (() => {
    const [y,mo,d] = p.data.split('-');
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    return `${d} ${months[+mo-1]} ${y}`;
  })() : '—';

  const pt = LANG === 'pt';
  const row = (l,v,unit='') => v != null && v !== 0 && v !== ''
    ? `<div class="bio-row"><span class="bio-row-l">${escapeHTML(String(l))}</span><span class="bio-row-r">${escapeHTML(String(v))}${unit?'<small> '+escapeHTML(unit)+'</small>':''}</span></div>`
    : '';

  const card = document.createElement('div');
  card.id = 'bio-card'; card.className = 'bio-card in'; card.style.animationDelay = '.04s';

  card.innerHTML = `
    <div class="bio-title">${pt?'Avaliação física':'Physical assessment'} · <span style="color:var(--gold)">${dataFmt}</span></div>
    <div class="bio-kpis">
      <div class="bio-kpi accent">
        <div class="bio-kpi-v">${peso}<span>kg</span></div>
        <div class="bio-kpi-l">${pt?'Peso':'Weight'}</div>
      </div>
      <div class="bio-kpi">
        <div class="bio-kpi-v">${altura||'—'}<span>${altura?'cm':''}</span></div>
        <div class="bio-kpi-l">${pt?'Altura':'Height'}</div>
      </div>
      <div class="bio-kpi">
        <div class="bio-kpi-v">${imc||'—'}</div>
        <div class="bio-kpi-l">IMC · ${imcLabel}</div>
      </div>
    </div>

    <div class="bio-divider">${pt?'Composição corporal':'Body composition'}</div>
    ${row(pt?'Gordura corporal':'Body fat', gordura, '%')}
    ${row(pt?'Gordura abdominal':'Abdominal fat', gordAbs, '%')}
    ${row(pt?'Massa magra':'Lean mass', massaMagra, 'kg')}
    ${row(pt?'Massa gorda':'Fat mass', massaGorda, 'kg')}
    ${row('TMB', tmb, 'kcal')}
    ${row(pt?'Gordura visceral':'Visceral fat', gordVisc ? (pt?'Nível ':'Level ')+gordVisc : null)}
    ${p.obs ? `<div class="bio-obs">${escapeHTML(p.obs)}</div>` : ''}

    <div class="bio-divider">${pt?'Perímetros (cm)':'Measurements (cm)'}</div>
    ${(() => {
      const cell = (l, v) => v != null && v !== 0 && v !== ''
        ? `<div class="bio-cell"><span class="bio-cell-l">${l}</span><span class="bio-cell-r">${v}</span></div>`
        : `<div class="bio-cell empty"></div>`;
      const pair = (lL, vL, lR, vR) => {
        const hasL = vL != null && vL !== 0 && vL !== '';
        const hasR = vR != null && vR !== 0 && vR !== '';
        if (!hasL && !hasR) return '';
        if (hasL !== hasR) return `<div class="bio-pair bio-single">${cell(hasL?lL:lR, hasL?vL:vR)}</div>`;
        return `<div class="bio-pair">${cell(lL,vL)}${cell(lR,vR)}</div>`;
      };
      return `
        ${pair(pt?'Ombro':'Shoulder', m.ombro, pt?'Tórax':'Chest', m.torax)}
        ${pair(pt?'Cintura':'Waist', m.cintura, pt?'Abdómen':'Abdomen', m.abdomen)}
        ${pair(pt?'Quadril':'Hip', m.quadril, '', null)}
        ${pair(pt?'Braço E (relax.)':'Arm L (relax.)', m.braco_e, pt?'Braço D (relax.)':'Arm R (relax.)', m.braco_d)}
        ${pair(pt?'Braço E (flex.)':'Arm L (flex.)', m.braco_flex_e, pt?'Braço D (flex.)':'Arm R (flex.)', m.braco_flex_d)}
        ${pair(pt?'Antebraço E':'Forearm L', m.antebraco_e, pt?'Antebraço D':'Forearm R', m.antebraco_d)}
        ${pair(pt?'Coxa E':'Thigh L', m.coxa_e, pt?'Coxa D':'Thigh R', m.coxa_d)}
        ${pair(pt?'Panturrilha E':'Calf L', m.panturrilha_e, pt?'Panturrilha D':'Calf R', m.panturrilha_d)}
      `;
    })()}

    ${an && Object.keys(an).length ? `
    <div class="bio-divider">${pt?'Dados da anamnese':'Anamnesis'}</div>
    ${row(pt?'Idade':'Age', an.idade, pt?'anos':'years')}
    ${row(pt?'Profissão':'Profession', an.profissao)}
    ${row(pt?'Nível de actividade':'Activity level', an.nivel_atividade)}
    ${row(pt?'Nível de experiência':'Experience', an.nivel_experiencia)}
    ${row(pt?'Nível de stresse':'Stress level', an.nivel_estresse)}
    ${row(pt?'Qualidade do sono':'Sleep quality', an.qualidade_sono)}
    ${row(pt?'Água diária':'Daily water', an.agua_litros, 'L')}
    ${row(pt?'Refeições/dia':'Meals/day', an.refeicoes_por_dia)}
    ${row(pt?'Duração da sessão':'Session length', an.tempo_sessao_min, 'min')}
    ${row(pt?'Objectivo principal':'Main goal', an.objetivo_principal)}
    ${row(pt?'Objectivo secundário':'Secondary goal', an.objetivo_secundario)}
    ${row(pt?'Divisão':'Split', an.divisao)}
    ${row(pt?'Fase':'Phase', an.fase)}
    ${an.lesoes ? `<div class="bio-divider">${pt?'Lesões / restrições':'Injuries / restrictions'}</div>
      <div class="bio-obs">${escapeHTML(an.lesoes)}</div>
      ${an.restricoes ? `<div class="bio-obs" style="margin-top:6px;color:var(--coral)">${escapeHTML(an.restricoes)}</div>` : ''}` : ''}
    ${an.historico_treino ? `<div class="bio-divider">${pt?'Histórico':'History'}</div>
      <div class="bio-obs">${escapeHTML(an.historico_treino)}</div>` : ''}
    ` : ''}
  `;

  const cont = container || document.getElementById('pf-content');
  if (cont) cont.appendChild(card);
}

// ═══════════════════════════════════════════════════════════
//  NAV / ACCENT / LANG / WATER (100% original)
// ═══════════════════════════════════════════════════════════
const ORDER = ['treino','evolucao','nutricao','comunidade','perfil'];
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

  const fab = document.getElementById('nutri-fab');
  if (fab) fab.style.display = name === 'nutricao' ? 'flex' : 'none';

  if (name === 'evolucao')   renderEvolucao();
  if (name === 'nutricao')   renderNutricao();
  if (name === 'comunidade') renderComunidade();
  if (name === 'perfil')     renderPerfil();
}

function ptFloatToggle(){
  const s = document.getElementById('pt-float-sheet');
  if (s) s.classList.toggle('open');
}

function handlePfPhoto(inp){
  const f = inp.files[0]; if (!f) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 200; canvas.height = 200;
      const ctx = canvas.getContext('2d');
      const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 200, 200);
      sc('profilePhoto', canvas.toDataURL('image/jpeg', 0.82));
      renderPerfil();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(f);
}

function setupNav(){
  document.querySelectorAll('.bnav-item').forEach(b =>
    b.addEventListener('click', () => go(b.dataset.screen)));
  document.getElementById('btn-reg').addEventListener('click', registrar);
  // Cards do Perfil
  const cards = document.getElementById('pf-cards');
  if (cards && !cards.dataset.bound) {
    cards.dataset.bound = '1';
    cards.addEventListener('click', ev => {
      const c = ev.target.closest('.pf-card');
      if (c) pfSelectCard(c.dataset.pfc);
    });
  }
}

const THEMES = {
  padrao:{ emoji:'🏅', gold:'#FFD96B', g2:'#E5B23A', glow:'rgba(255,217,107,.35)', subtle:'rgba(255,217,107,.07)', bg:'#000000' },
  moon:  { emoji:'🌙', gold:'#C4B5FD', g2:'#7C3AED', glow:'rgba(196,181,253,.4)',  subtle:'rgba(196,181,253,.08)', bg:'#06061a' },
  sun:   { emoji:'☀️', gold:'#FFA827', g2:'#E08000', glow:'rgba(255,168,39,.4)',   subtle:'rgba(255,168,39,.08)',  bg:'#0d0800' },
  demon: { emoji:'👿', gold:'#BF5AF2', g2:'#7B2FBE', glow:'rgba(191,90,242,.4)',   subtle:'rgba(191,90,242,.08)',  bg:'#08000f' },
  iphone:{ emoji:'📱', gold:'#0A84FF', g2:'#0066CC', glow:'rgba(10,132,255,.4)',   subtle:'rgba(10,132,255,.08)',  bg:'#000000' },
  rain:  { emoji:'🌧️', gold:'#38BDF8', g2:'#0284C7', glow:'rgba(56,189,248,.4)',   subtle:'rgba(56,189,248,.08)',  bg:'#040810' },
  happy: { emoji:'😊', gold:'#34D399', g2:'#059669', glow:'rgba(52,211,153,.4)',   subtle:'rgba(52,211,153,.08)',  bg:'#020d07' },
  angry: { emoji:'🤬', gold:'#FF3333', g2:'#CC0000', glow:'rgba(255,51,51,.5)',    subtle:'rgba(255,51,51,.1)',    bg:'#0a0000' },
  fire:  { emoji:'🔥', gold:'#FF6B00', g2:'#CC4400', glow:'rgba(255,107,0,.45)',   subtle:'rgba(255,107,0,.09)',   bg:'#0a0400' },
  ice:   { emoji:'🧊', gold:'#67E8F9', g2:'#06B6D4', glow:'rgba(103,232,249,.4)',  subtle:'rgba(103,232,249,.08)', bg:'#00080d' },
};
let _autoTimer = null;
function _applyThemeRaw(name){
  const t = THEMES[name] || THEMES.padrao;
  const r = document.documentElement;
  r.style.setProperty('--gold', t.gold);
  r.style.setProperty('--gold-2', t.g2);
  r.style.setProperty('--gold-glow', t.glow);
  r.style.setProperty('--gold-subtle', t.subtle);
  document.body.style.background = t.bg;
  document.body.className = (document.body.className||'').replace(/\bt-\w+/g,'').trim() + ' t-' + name;
  document.querySelectorAll('#chart-dots circle').forEach((c,i,arr) => {
    c.setAttribute('fill', t.gold);
    if (i===arr.length-1) c.setAttribute('filter',`drop-shadow(0 0 6px ${t.gold})`);
  });
  document.querySelectorAll('#g-area stop').forEach(s => s.setAttribute('stop-color', t.gold));
  applyThemeFX(name);
}
function setTheme(name){
  if (_autoTimer) { clearInterval(_autoTimer); _autoTimer = null; }
  if (name === 'auto'){
    const tick = () => {
      const h = new Date().getHours();
      _applyThemeRaw(h >= 6 && h < 18 ? 'sun' : 'moon');
    };
    tick();
    _autoTimer = setInterval(tick, 60000);
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('on', b.dataset.theme === 'auto'));
    try { localStorage.setItem('josilvaPT_theme', 'auto'); } catch(e){}
    return;
  }
  _applyThemeRaw(name);
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('on', b.dataset.theme === name));
  try { localStorage.setItem('josilvaPT_theme', name); } catch(e){}
}

function applyThemeFX(name){
  const fx = document.getElementById('theme-fx');
  if (!fx) return;
  fx.innerHTML = '';
  const rand = (a,b) => Math.random() * (b - a) + a;
  const specs = {
    ice:   { cls:'fx-snow fx-p',   chars:['❄','✻','❅','❆','*'], n:18, dur:[7,16],  delay:[0,12] },
    rain:  { cls:'fx-rain fx-p',   chars:[''],                    n:32, dur:[.6,1.4], delay:[0,2.5] },
    fire:  { cls:'fx-ember fx-p',  chars:[''],                    n:22, dur:[2.5,5], delay:[0,5] },
    happy: { cls:'fx-bubble fx-p', chars:[''],                    n:14, dur:[5,11],  delay:[0,9] },
    moon:  { cls:'fx-star fx-p',   chars:[''],                    n:28, dur:[2,5],   delay:[0,4], static:true },
    sun:   { cls:'fx-ray fx-p',    chars:[''],                    n:8,  dur:[3,6],   delay:[0,3], radial:true },
  };
  const s = specs[name];
  if (!s) return;
  for (let i = 0; i < s.n; i++){
    const el = document.createElement('div');
    el.className = s.cls;
    if (s.chars && s.chars[0]) el.textContent = s.chars[Math.floor(Math.random()*s.chars.length)];
    if (s.radial){
      el.style.left = '50%'; el.style.top = '-10vh';
      el.style.transform = `rotate(${(i / s.n) * 360}deg)`;
    } else if (s.static){
      el.style.left = rand(0,100) + 'vw';
      el.style.top  = rand(0,100) + 'vh';
    } else {
      el.style.left = rand(0,100) + 'vw';
    }
    el.style.animationDuration = rand(s.dur[0], s.dur[1]) + 's';
    el.style.animationDelay    = '-' + rand(s.delay[0], s.delay[1]) + 's';
    if (name === 'ice') el.style.fontSize = rand(9, 18) + 'px';
    if (name === 'rain') el.style.height  = rand(12, 24) + 'px';
    fx.appendChild(el);
  }
}
function applyThemeFromStorage(){
  let saved = null; try { saved = localStorage.getItem('josilvaPT_theme'); } catch(e){}
  const valid = saved === 'auto' || (saved && THEMES[saved]);
  setTheme(valid ? saved : 'padrao');
}
function setupThemePicker(){
  document.querySelectorAll('.theme-btn').forEach(b =>
    b.addEventListener('click', () => setTheme(b.dataset.theme)));
}

function setLang(lang){
  LANG = lang;
  try { localStorage.setItem('aluno_lang', LANG); } catch(e){}
  applyI18n();
  renderTreino();
  renderPerfil();
  if (currentScreen === 'evolucao') renderEvolucao();
  if (currentScreen === 'nutricao') renderNutricao();
}
function setupLangToggle(){
  document.querySelectorAll('.lang-toggle [data-lang]').forEach(l =>
    l.addEventListener('click', () => setLang(l.dataset.lang)));
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

  function applyWater(n){
    document.querySelectorAll('#water-dots .water-dot')
      .forEach((d,i) => d.classList.toggle('on', i < n));
    const el = document.getElementById('water-count');
    if (el) el.textContent = n;
  }

  applyWater(lc('water_' + today, 0));

  const container = document.getElementById('water-dots');
  if (!container || container.dataset.bound) return;
  container.dataset.bound = '1';

  container.addEventListener('click', ev => {
    const dot = ev.target.closest('.water-dot');
    if (!dot) return;
    const all = [...document.querySelectorAll('#water-dots .water-dot')];
    const idx = all.indexOf(dot);
    if (idx === -1) return;
    const target = dot.classList.contains('on') ? idx : idx + 1;
    applyWater(target);
    sc('water_' + today, target);
    const btn = document.getElementById('water-save');
    if (btn) btn.classList.remove('saved');
  });

  const saveBtn = document.getElementById('water-save');
  if (saveBtn && !saveBtn.dataset.bound) {
    saveBtn.dataset.bound = '1';
    saveBtn.addEventListener('click', () => {
      const n = +(document.getElementById('water-count').textContent || 0);
      sc('water_' + today, n);
      saveBtn.classList.add('saved');
      toast(LANG === 'pt' ? `Hidratação guardada · ${n}/8` : `Hydration saved · ${n}/8`);
    });
  }
}

function escapeHTML(s){
  return String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

// ═══════════════════════════════════════════════════════════
//  COMUNIDADE
// ═══════════════════════════════════════════════════════════

let comTab = 'feed';
let comPosts = [];
let comChallenges = [];
let comPhotoB64 = null;

const avGrads = [
  'linear-gradient(135deg,#FFD96B,#E5B23A)',
  'linear-gradient(135deg,#A78BFA,#7C3AED)',
  'linear-gradient(135deg,#5FE3D3,#0891B2)',
  'linear-gradient(135deg,#FF6B6B,#DC2626)',
];
function alunoGrad(id){ let h=0; for(let i=0;i<(id||'').length;i++) h=(h*31+id.charCodeAt(i))>>>0; return avGrads[h%4]; }

function timeAgo(iso){
  if (!iso) return '';
  const m = Math.floor((Date.now()-new Date(iso))/60000);
  if (m < 1) return 'agora';
  if (m < 60) return m+'min';
  const h = Math.floor(m/60);
  if (h < 24) return h+'h';
  return Math.floor(h/24)+'d';
}

function getMondayISO(){
  const d = new Date();
  const day = d.getDay(), diff = d.getDate()-day+(day===0?-6:1);
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}

// ── Carregar dados ─────────────────────────────────────────
async function renderComunidade(){
  const content = document.getElementById('com-content');
  if (content) content.innerHTML = `<div class="loading" style="padding:32px 0 0">A carregar…</div>`;

  const now = new Date().toISOString();
  [comPosts, comChallenges] = await Promise.all([
    sb(`community_posts?expira_em=gte.${encodeURIComponent(now)}&select=*,community_reactions(post_id,aluno_id,emoji),community_comments(id,aluno_id,aluno_nome,texto,criado_em)&order=criado_em.desc&limit=40`) || [],
    sb(`community_challenges?ativo=eq.true&order=criado_em.asc`) || [],
  ]);
  comPosts = comPosts || [];
  comChallenges = comChallenges || [];

  // Setup tab clicks (once)
  const tabsEl = document.getElementById('com-tabs');
  if (tabsEl && !tabsEl.dataset.bound){
    tabsEl.dataset.bound = '1';
    tabsEl.addEventListener('click', ev => {
      const t = ev.target.closest('.com-tab');
      if (t) comSetTab(t.dataset.tab);
    });
  }

  // Delegated listener for reaction buttons (avoids inline onclick with user data)
  const contentEl = document.getElementById('com-content');
  if (contentEl && !contentEl.dataset.reactBound){
    contentEl.dataset.reactBound = '1';
    contentEl.addEventListener('click', ev => {
      const btn = ev.target.closest('.com-react-btn[data-pid]');
      if (btn) comReact(btn.dataset.pid, btn.dataset.emoji);
    });
  }

  comSetTab(comTab);
}

function comSetTab(tab){
  comTab = tab;
  document.querySelectorAll('.com-tab').forEach(t => t.classList.toggle('on', t.dataset.tab===tab));
  const content = document.getElementById('com-content');
  if (!content) return;
  content.innerHTML = '';
  if (tab==='feed')      comRenderFeed(content);
  else if (tab==='desafios') comRenderDesafios(content);
  else if (tab==='rankings') comRenderRankings(content);
}

// ── FEED ──────────────────────────────────────────────────
function comRenderFeed(container){
  const grad = alunoGrad(ALUNO_ID);
  const compose = `<div class="com-compose" onclick="comOpenModal()">
    <div class="com-compose-av" style="background:${grad}">${initials(aluno?.nome||'?')}</div>
    <div class="com-compose-ph">Partilha algo com a equipa…</div>
    <div class="com-compose-btn">Publicar</div>
  </div>`;

  if (!comPosts.length){
    container.innerHTML = compose + `<div class="empty" style="padding:32px 0">Sem publicações ainda.<br>Sê o primeiro! 💪</div>`;
    return;
  }
  container.innerHTML = compose + comPosts.map((p,i) => comPostHTML(p,i)).join('');
}

function comPostHTML(p, idx=0){
  const grad = alunoGrad(p.aluno_id);
  const reactions = p.community_reactions || [];
  const comments  = p.community_comments  || [];
  const myR = reactions.filter(r=>r.aluno_id===ALUNO_ID).map(r=>r.emoji);
  const rCnt = {};
  reactions.forEach(r => { rCnt[r.emoji]=(rCnt[r.emoji]||0)+1; });
  const emojis = ['💪','🔥','👏','😤'];
  const reactHTML = emojis.map(e => {
    const n = rCnt[e]||0, on = myR.includes(e);
    return `<button class="com-react-btn${on?' on':''}" data-pid="${escapeHTML(p.id)}" data-emoji="${escapeHTML(e)}">
      ${e}<span class="com-react-cnt">${n>0?' '+n:''}</span></button>`;
  }).join('');
  const badgeHTML = p.tipo==='checkin' ? '<div class="com-post-badge">Check-in</div>' : '';
  const expiryDays = p.expira_em ? Math.max(0, Math.ceil((new Date(p.expira_em)-Date.now())/86400000)) : 7;
  return `<div class="com-post" id="post-${p.id}" style="animation-delay:${idx*.04}s">
    <div class="com-post-head">
      <div class="com-post-av" style="background:${grad}">${initials(p.aluno_nome||'?')}</div>
      <div class="com-post-info">
        <div class="com-post-name">${escapeHTML(p.aluno_nome||'—')}</div>
        <div class="com-post-time">${timeAgo(p.criado_em)} · apaga em ${expiryDays}d</div>
      </div>
      ${badgeHTML}
    </div>
    ${p.texto ? `<div class="com-post-text">${escapeHTML(p.texto)}</div>` : ''}
    ${p.foto_url ? `<img class="com-post-photo" src="${p.foto_url}" loading="lazy" alt="">` : ''}
    <div class="com-post-foot">
      <div class="com-react-group">${reactHTML}</div>
      <button class="com-comment-toggle" onclick="comToggleComments('${p.id}')">
        💬 <span id="com-cc-${p.id}">${comments.length}</span>
      </button>
    </div>
    <div class="com-comments-wrap" id="com-cw-${p.id}">
      <div id="com-cl-${p.id}">${comCommentsHTML(comments)}</div>
      <div class="com-cmt-inp-row">
        <input class="com-cmt-inp" id="com-ci-${p.id}" placeholder="Adiciona um comentário…"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();comSendComment('${p.id}')}">
        <button class="com-cmt-send" onclick="comSendComment('${p.id}')">→</button>
      </div>
    </div>
  </div>`;
}

function comCommentsHTML(comments){
  if (!comments.length) return `<div style="padding:6px 0;color:var(--text-3);font-size:12px">Sem comentários ainda.</div>`;
  return comments.map(c => `<div class="com-comment-item">
    <div class="com-cmt-av" style="background:${alunoGrad(c.aluno_id)}">${initials(c.aluno_nome||'?')}</div>
    <div class="com-cmt-body">
      <div class="com-cmt-name">${escapeHTML(c.aluno_nome||'—')} <span>${timeAgo(c.criado_em)}</span></div>
      <div class="com-cmt-txt">${escapeHTML(c.texto)}</div>
    </div>
  </div>`).join('');
}

// ── Reações ────────────────────────────────────────────────
async function comReact(postId, emoji){
  const post = comPosts.find(p=>p.id===postId);
  if (!post || !ALUNO_ID) return;
  const reactions = post.community_reactions || [];
  const existing = reactions.find(r=>r.aluno_id===ALUNO_ID && r.emoji===emoji);
  if (existing){
    await sb(`community_reactions?post_id=eq.${postId}&aluno_id=eq.${ALUNO_ID}&emoji=eq.${encodeURIComponent(emoji)}`,
      { method:'DELETE', headers:{'Prefer':''} });
    post.community_reactions = reactions.filter(r=>!(r.aluno_id===ALUNO_ID&&r.emoji===emoji));
  } else {
    const r = await sb('community_reactions',{
      method:'POST',
      headers:{'Prefer':'resolution=ignore-duplicates,return=representation'},
      body:JSON.stringify({post_id:postId,aluno_id:ALUNO_ID,emoji})
    });
    if (r&&r[0]) post.community_reactions = [...reactions,r[0]];
    else post.community_reactions = [...reactions,{post_id:postId,aluno_id:ALUNO_ID,emoji}];
  }
  const el = document.getElementById(`post-${postId}`);
  const idx = comPosts.findIndex(p=>p.id===postId);
  if (el) el.outerHTML = comPostHTML(post, idx);
}

// ── Comentários ────────────────────────────────────────────
function comToggleComments(postId){
  const wrap = document.getElementById(`com-cw-${postId}`);
  if (wrap) wrap.classList.toggle('open');
}

async function comSendComment(postId){
  const inp = document.getElementById(`com-ci-${postId}`);
  const txt = inp?.value.trim();
  if (!txt || !aluno) return;
  inp.value = '';
  const r = await sb('community_comments',{
    method:'POST',
    body:JSON.stringify({post_id:postId,aluno_id:ALUNO_ID,aluno_nome:aluno.nome,texto:txt})
  });
  if (!r||!r[0]) return;
  const post = comPosts.find(p=>p.id===postId);
  if (post){
    if (!post.community_comments) post.community_comments=[];
    post.community_comments.push(r[0]);
    const list = document.getElementById(`com-cl-${postId}`);
    if (list) list.innerHTML = comCommentsHTML(post.community_comments);
    const cnt = document.getElementById(`com-cc-${postId}`);
    if (cnt) cnt.textContent = post.community_comments.length;
    const wrap = document.getElementById(`com-cw-${postId}`);
    if (wrap) wrap.classList.add('open');
  }
}

// ── DESAFIOS ──────────────────────────────────────────────
async function comRenderDesafios(container){
  container.innerHTML = `<div class="loading" style="padding:32px 0 0">A calcular classificações…</div>`;
  if (!comChallenges.length){
    container.innerHTML = `<div class="empty" style="padding:32px 0">Sem desafios ativos.</div>`; return;
  }
  const cutoff = new Date(Date.now()-30*86400000).toISOString().split('T')[0];
  const [alunosList, s30] = await Promise.all([
    sb('alunos?ativo=eq.true&select=id,nome')||[],
    sb(`sessoes?data=gte.${cutoff}&select=aluno_id,data`)||[]
  ]);
  const monday = getMondayISO();
  container.innerHTML = comChallenges.map(ch => comChallengeHTML(ch, alunosList||[], s30||[], monday)).join('');
}

function comChallengeHTML(ch, alunosList, s30, monday){
  const standings = comStandings(ch, alunosList, s30, monday);
  const mine = standings.find(s=>s.id===ALUNO_ID);
  const maxVal = standings[0]?.valor || ch.meta_valor;
  const daysLeft = ch.fim ? Math.max(0,Math.ceil((new Date(ch.fim)-Date.now())/86400000)) : null;
  const unit = ch.meta_tipo==='sessoes_semana'||ch.meta_tipo==='sessoes_mes' ? 'sessões' : 'dias';
  const mineBar = mine ? `<div class="com-ch-mine">
    <div class="com-ch-mine-top"><span>O teu progresso</span><b>${mine.valor} / ${ch.meta_valor} ${unit} · ${Math.round(Math.min(1,mine.valor/ch.meta_valor)*100)}%</b></div>
    <div class="xp-bar"><div class="xp-fill" style="width:${Math.round(Math.min(1,mine.valor/ch.meta_valor)*100)}%"></div></div>
  </div>` : '';
  const posIco = ['🥇','🥈','🥉'];
  const rowsHTML = standings.slice(0,6).map((s,i)=>{
    const isMe = s.id===ALUNO_ID;
    const pct = maxVal>0 ? (s.valor/maxVal*100).toFixed(0) : 0;
    return `<div class="com-ch-row${isMe?' me':''}">
      <div class="com-ch-rank">${posIco[i]||i+1}</div>
      <div class="com-ch-av" style="background:${alunoGrad(s.id)}">${initials(s.nome)}</div>
      <div class="com-ch-name">${escapeHTML(s.nome)}</div>
      <div class="com-ch-bar-wrap"><div class="com-ch-bar" style="width:${pct}%"></div></div>
      <div class="com-ch-val">${s.valor}</div>
    </div>`;
  }).join('');
  return `<div class="com-challenge">
    <div class="com-ch-head">
      <div class="com-ch-ico">${ch.emoji||'🏆'}</div>
      <div>
        <div class="com-ch-title">${escapeHTML(ch.titulo)}</div>
        <div class="com-ch-desc">${escapeHTML(ch.descricao||'')}</div>
        <div class="com-ch-meta">Meta: ${ch.meta_valor} ${unit}${daysLeft!=null?' · '+daysLeft+' dias restantes':''}</div>
      </div>
    </div>
    ${mineBar}
    ${rowsHTML ? `<div class="com-ch-rows">${rowsHTML}</div>` : ''}
  </div>`;
}

function comStandings(ch, alunosList, s30, monday){
  const cutoff30 = new Date(Date.now()-30*86400000).toISOString().split('T')[0];
  return (alunosList||[]).map(a=>{
    let v = 0;
    if (ch.meta_tipo==='sessoes_semana'){
      v = s30.filter(s=>s.aluno_id===a.id&&s.data>=monday).length;
    } else if (ch.meta_tipo==='sessoes_mes'){
      v = s30.filter(s=>s.aluno_id===a.id).length;
    } else if (ch.meta_tipo==='streak'){
      const days = [...new Set(s30.filter(s=>s.aluno_id===a.id).map(s=>s.data))].sort();
      let streak=0;
      for(let i=days.length-1;i>=0;i--){
        const gap = Math.floor((Date.now()-new Date(days[i]))/86400000);
        if(gap<=streak+1) streak++;
        else break;
      }
      v = streak;
    }
    return {id:a.id,nome:a.nome,valor:v};
  }).filter(s=>s.valor>0).sort((a,b)=>b.valor-a.valor);
}

// ── RANKINGS ──────────────────────────────────────────────
async function comRenderRankings(container){
  container.innerHTML = `<div class="loading" style="padding:32px 0 0">A calcular rankings…</div>`;
  const [alunosList, allSess] = await Promise.all([
    sb('alunos?ativo=eq.true&select=id,nome')||[],
    sb('sessoes?select=aluno_id,data&order=data.desc&limit=1000')||[]
  ]);
  const monday = getMondayISO();
  const cut30 = new Date(Date.now()-30*86400000).toISOString().split('T')[0];
  const al = alunosList||[], se = allSess||[];
  const rank = (fn) => al.map(a=>({...a,valor:fn(a)})).filter(r=>r.valor>0).sort((a,b)=>b.valor-a.valor);
  const weekly  = rank(a=>se.filter(s=>s.aluno_id===a.id&&s.data>=monday).length);
  const monthly = rank(a=>se.filter(s=>s.aluno_id===a.id&&s.data>=cut30).length);
  const alltime = rank(a=>se.filter(s=>s.aluno_id===a.id).length);
  const posIco = ['🥇','🥈','🥉'];
  const rankRow = (r,i) => {
    const isMe = r.id===ALUNO_ID;
    return `<div class="com-rank-row${isMe?' me':''}" style="animation-delay:${i*.03}s">
      <div class="com-rank-pos">${posIco[i]||i+1}</div>
      <div class="com-rank-av" style="background:${alunoGrad(r.id)}">${initials(r.nome)}</div>
      <div class="com-rank-name">${escapeHTML(r.nome)}${isMe?'<em style="color:var(--gold);font-style:normal;font-size:11px"> · tu</em>':''}</div>
      <div class="com-rank-val">${r.valor}</div>
    </div>`;
  };
  const section = (title, rows) =>
    `<div class="com-rank-ttl">${title}</div>` +
    (rows.length ? rows.slice(0,5).map(rankRow).join('') : `<div class="empty" style="padding:10px 0;font-size:13px">Sem dados ainda.</div>`);
  container.innerHTML = `<div class="com-rank-block">
    ${section('🗓️ Esta semana · Sessões', weekly)}
    ${section('📅 Últimos 30 dias · Sessões', monthly)}
    ${section('🏛️ Histórico · Total de sessões', alltime)}
  </div>`;
}

// ── Modal publicar ─────────────────────────────────────────
function comOpenModal(){
  comPhotoB64 = null;
  document.getElementById('com-textarea').value = '';
  const prev = document.getElementById('com-photo-preview');
  if (prev){ prev.style.display='none'; prev.src=''; }
  document.getElementById('com-modal').classList.add('open');
}
function comCloseModal(){
  document.getElementById('com-modal').classList.remove('open');
}
function comCheckIn(){
  const last = sessoes[0];
  const xp = sessoes.length*50;
  const txt = last
    ? `💪 Check-in de treino!\n${last.treino_nome||'Treino'} · ${formatDate(last.data)}\n🏆 ${xp.toLocaleString('pt-PT')} XP acumulado`
    : `💪 Check-in! Pronto para treinar!`;
  document.getElementById('com-textarea').value = txt;
}
function comSelectPhoto(){
  const inp = document.createElement('input');
  inp.type='file'; inp.accept='image/*';
  inp.onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await comCompressImage(file);
    if (b64.length > 900000){ toast('Foto demasiado grande. Usa uma mais pequena.'); return; }
    comPhotoB64 = b64;
    const prev = document.getElementById('com-photo-preview');
    if (prev){ prev.src=b64; prev.style.display='block'; }
  };
  inp.click();
}
function comCompressImage(file, maxW=640, q=0.45){
  return new Promise(resolve=>{
    const r = new FileReader();
    r.onload = e => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW/Math.max(img.width,img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width*scale);
        c.height= Math.round(img.height*scale);
        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        resolve(c.toDataURL('image/jpeg',q));
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(file);
  });
}
async function comPublicar(){
  const txt = document.getElementById('com-textarea').value.trim();
  if (!txt && !comPhotoB64){ toast('Escreve algo ou adiciona uma foto.'); return; }
  if (!aluno) return;
  const btn = document.querySelector('#com-modal .com-btn-pri');
  if (btn){ btn.disabled=true; btn.textContent='A publicar…'; }
  const r = await sb('community_posts',{
    method:'POST',
    body:JSON.stringify({aluno_id:ALUNO_ID,aluno_nome:aluno.nome,tipo:'post',texto:txt||null,foto_url:comPhotoB64||null})
  });
  if (btn){ btn.disabled=false; btn.textContent='Publicar'; }
  if (r&&r[0]){
    r[0].community_reactions=[]; r[0].community_comments=[];
    comPosts.unshift(r[0]);
    comCloseModal();
    if (comTab==='feed'){ const c=document.getElementById('com-content'); if(c) comRenderFeed(c); }
    toast('Publicado! 🎉');
  } else { toast('Erro ao publicar. Tenta de novo.'); }
}

init();
