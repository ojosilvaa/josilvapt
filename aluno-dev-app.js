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
  applyAccentFromStorage();

  const hideLoader = () => {
    const ls = document.getElementById('loading-screen');
    if (ls) { ls.style.transition = 'opacity .4s'; ls.style.opacity = '0'; setTimeout(() => ls.style.display = 'none', 420); }
  };

  if (!ALUNO_ID) {
    hideLoader();
    document.getElementById('treino-loading').innerHTML =
      '<div class="empty"><div class="empty-icon">🔗</div>Link inválido. Pede ao teu PT o link correto.</div>';
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
  setupAccentPicker();
  setupLangToggle();
  setupWaterDots();

  sessoes = await sb(`sessoes?aluno_id=eq.${ALUNO_ID}&order=data.desc&limit=200`) || [];
  perimetriaHist = await sb(`perimetria?aluno_id=eq.${ALUNO_ID}&order=data.asc&limit=20`) || [];

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
  const peso = parseFloat(perimetriaHist[perimetriaHist.length-1]?.peso) || 70;
  const meta = calcDailyKcal(peso, alunoObjetivo);
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
  const getNome = r => r.dados?.nome || r.tipo || (LANG==='pt'?'Refeição':'Meal');

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
  document.getElementById('n-pct').textContent       = pct + '%';

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

  // macro values + percentage text
  document.getElementById('n-val-prot').textContent = Math.round(prot) + 'g';
  document.getElementById('n-pct-prot').textContent = metaP ? Math.round(prot/metaP*100) + '%' : '0%';
  document.getElementById('n-val-carb').textContent = Math.round(carb) + 'g';
  document.getElementById('n-pct-carb').textContent = metaC ? Math.round(carb/metaC*100) + '%' : '0%';
  document.getElementById('n-val-gord').textContent = Math.round(gord) + 'g';
  document.getElementById('n-pct-gord').textContent = metaG ? Math.round(gord/metaG*100) + '%' : '0%';

  // mini rings (C = 2π×22 ≈ 138)
  const C = 138;
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
  setR('n-ring-prot', metaP ? prot/metaP : 0);
  setR('n-ring-carb', metaC ? carb/metaC : 0);
  setR('n-ring-gord', metaG ? gord/metaG : 0);

  const ml = document.getElementById('meal-list');
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

function calcDailyKcal(peso, obj){
  const base = peso * 30;
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
      `<div class="nut-cat" onclick="nutSearchCat('${c.replace(/'/g,"\\'")}'">${c} <span>›</span></div>`
    ).join('');
  } else {
    const term = nutTerm.toLowerCase();
    const res = ALIMENTOS_DB.filter(a =>
      a.nome.toLowerCase().includes(term) || a.cat.toLowerCase().includes(term)
    ).slice(0, 40);
    resList.innerHTML = res.length
      ? res.map(a => `<div class="nut-item" onclick="nutEscolher('${escapeHTML(a.nome).replace(/'/g,"\\'")}')">
          <span>${escapeHTML(a.nome)}</span>
          <span class="nut-item-kcal">${a.kcal} kcal/100g</span>
        </div>`).join('')
      : `<div class="empty" style="padding:16px">Nenhum resultado.</div>`;
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
    aluno_id:     ALUNO_ID,
    data:         todayISO(),
    tipo:         dados.nome,
    calorias:     dados.kcal,
    proteina:     dados.prot,
    carboidratos: dados.carb,
    gordura:      dados.gord,
    dados:        dados,
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
function renderPerfil(){
  if (!aluno) return;
  document.getElementById('pf-avatar').textContent = initials(aluno.nome);
  document.getElementById('pf-name').textContent   = aluno.nome;

  const idade = calcIdade(aluno.data_nascimento);
  const idadeStr = idade ? `${idade} ${LANG==='pt'?'anos':'years old'} · ` : '';
  const metaStr = alunoObjetivo
    ? `${idadeStr}<em>${escapeHTML(alunoObjetivo)}</em>`
    : `${idadeStr}${LANG==='pt'?'Em treino com Jo Silva':'Training with Jo Silva'}`;
  document.getElementById('pf-meta').innerHTML = metaStr;

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
    <div class="bio-row"><span class="bio-row-l">${pt?'Gordura corporal':'Body fat'}</span><span class="bio-row-r">${gordura}%</span></div>
    <div class="bio-row"><span class="bio-row-l">${pt?'Massa magra':'Lean mass'}</span><span class="bio-row-r">${massaMagra} kg</span></div>
    <div class="bio-row"><span class="bio-row-l">${pt?'Massa gorda':'Fat mass'}</span><span class="bio-row-r">${massaGorda} kg</span></div>
    ${tmb ? `<div class="bio-row"><span class="bio-row-l">TMB</span><span class="bio-row-r">${tmb} kcal</span></div>` : ''}
    ${visceralNivel ? `<div class="bio-row"><span class="bio-row-l">${pt?'Gordura visceral':'Visceral fat'}</span><span class="bio-row-r">${pt?'Nível':'Level'} ${visceralNivel}</span></div>` : ''}
    <div class="bio-divider">${pt?'Perímetros (cm)':'Measurements (cm)'}</div>
    <div class="bio-grid">
      ${[
        [pt?'Ombro':'Shoulder',m.ombro_cm],[pt?'Peito':'Chest',m.peito_cm],
        [pt?'Cintura':'Waist',m.cintura_cm],[pt?'Abdómen':'Abdomen',m.abdomen_cm],
        [pt?'Quadril':'Hip',m.quadril_cm],[pt?'Braço (rel.)':'Arm rel.',m.braco_relaxado_dir_cm],
        [pt?'Braço (cont.)':'Arm cont.',m.braco_contraido_dir_cm],[pt?'Coxa D':'Thigh R',m.coxa_dir_cm],
        [pt?'Coxa E':'Thigh L',m.coxa_esq_cm],[pt?'Panturrilha':'Calf',m.panturrilha_dir_cm],
      ].filter(([,v]) => v != null).map(([l,v]) => `
        <div class="bio-row"><span class="bio-row-l">${l}</span><span class="bio-row-r">${v}</span></div>
      `).join('')}
    </div>
  `;

  const levelCard = document.querySelector('.level-card');
  levelCard.parentNode.insertBefore(card, levelCard);
}

// ═══════════════════════════════════════════════════════════
//  NAV / ACCENT / LANG / WATER (100% original)
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
  // FAB nutrição — mostrar/ocultar conforme screen
  document.querySelectorAll('.bnav-item').forEach(b =>
    b.addEventListener('click', () => {
      const fab = document.getElementById('nut-fab');
      if (fab) fab.style.display = b.dataset.screen === 'nutricao' ? 'flex' : 'none';
    }));
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
