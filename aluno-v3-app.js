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
      ['Descanso entre séries','90s nos compostos, 60s nos isolados.']
    ]
  },
  en: {
    'loading':'LOADING…','ring-sub':'Session','reg_start':'Mark a set to begin',
    'sucesso':'Session saved!','sucesso_sub':'Great work. See you next time!',
    'evo_kicker':'Summary · 90 days','evo_title':'Your progress,<br><em>visualized.</em>',
    'kpi_sessoes':'Sessions','kpi_streak':'Streak','kpi_volume':'Volume kg','recorde':'record',
    'evo_chart_title':'Load progression','sel_ex':'Select an exercise…',
    'evo_cmp':'Body composition','evo_pr':'Personal records','evo_no_pr':'No records yet. Keep training!',
    'evo_heat':'Activity · 13 weeks','heat_less':'Less','heat_more':'More',
    'n_meta_sub':'of your goal','n_prot':'Protein','n_carb':'Carbs','n_gord':'Fat',
    'water':'glasses water','n_meals':'Meals','n_no_meal':'No meals today.',
    'pf_level':'Current level','streak_days':'days','streak_active':'active streak',
    'pf_conquistas':'Achievements','pt_msg':'Message','pt_call':'Call','pf_orient':'Weekly guidelines',
    'nav_treino':'Workout','nav_evolucao':'Progress','nav_nutricao':'Nutrition','nav_perfil':'Profile',
    'sem_treinos':'No workouts assigned yet.','sem_ex':'Empty workout.',
    'reg_complete':'Register complete session →','reg_partial':'Register (PCT%)',
    'reg_saving':'Saving…','reg_default':'REGISTER SESSION',
    'mantem':'keep load','obj_prefix':'Goal · ',
    'orient_default':[
      ['Hydration','3 L of water per day, 500 ml pre-workout.'],
      ['Sleep','minimum 7 h. Avoid screens 30 min before bed.'],
      ['Protein','1.8 g/kg body weight — spread over 4 meals.'],
      ['Rest between sets','90s for compounds, 60s for isolation.']
    ]
  }
};
let LANG = 'pt';
function T(k){ return (I18N[LANG]||I18N.pt)[k] ?? k; }

// ── state ─────────────────────────────────────────────────
let aluno={}, treinos=[], exerciciosByTreino={}, sessoes=[], allCargasHist=null, perimetriaHist=[];
let selectedTreino=null, cargas={}, markedSets={};
let refeicoes=[], nutMeta={kcal:2000,prot:150,carb:250,gord:60};
let currentScreen='treino', swipeStartX=0, swipeStartY=0, isSwiping=false;
const SCREENS=['treino','evolucao','nutricao','perfil'];

// ── localStorage helpers ──────────────────────────────────
function lc(k,def=null){ try{ const v=localStorage.getItem(k); return v===null?def:JSON.parse(v); }catch{return def;} }
function sc(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} }

// ── Supabase REST ─────────────────────────────────────────
async function sb(path, method='GET', body=null){
  try {
    const opts={method,headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Prefer':'return=representation'}};
    if(body) opts.body=JSON.stringify(body);
    const r=await fetch(`${SB_URL}/rest/v1/${path}`,opts);
    if(!r.ok) return null;
    const ct=r.headers.get('content-type')||'';
    if(ct.includes('json')) return await r.json();
    return null;
  } catch{ return null; }
}

// ── Helpers ───────────────────────────────────────────────
function todayISO(){ return new Date().toISOString().slice(0,10); }
function escapeHTML(s){ return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

// ═══════════════════════════════════════════════════════════
//  BASE DE DADOS DE ALIMENTOS (valores por 100g)
//  campos: nome, cat, kcal, prot, carb, gord, fibra
// ═══════════════════════════════════════════════════════════
const ALIMENTOS_DB = [
  // ── PROTEÍNAS ANIMAIS ──────────────────────────────────
  {nome:'Frango grelhado (peito)',    cat:'🥩 Proteína', kcal:165, prot:31,  carb:0,   gord:3.6,  fibra:0},
  {nome:'Frango cozido (peito)',      cat:'🥩 Proteína', kcal:154, prot:30,  carb:0,   gord:3.2,  fibra:0},
  {nome:'Frango assado (coxa)',       cat:'🥩 Proteína', kcal:209, prot:26,  carb:0,   gord:11,   fibra:0},
  {nome:'Peru grelhado (peito)',      cat:'🥩 Proteína', kcal:135, prot:30,  carb:0,   gord:1.0,  fibra:0},
  {nome:'Carne bovina patinho',       cat:'🥩 Proteína', kcal:219, prot:28,  carb:0,   gord:11,   fibra:0},
  {nome:'Carne bovina alcatra',       cat:'🥩 Proteína', kcal:185, prot:27,  carb:0,   gord:8,    fibra:0},
  {nome:'Carne bovina acém',          cat:'🥩 Proteína', kcal:202, prot:26,  carb:0,   gord:10.5, fibra:0},
  {nome:'Carne bovina filé mignon',   cat:'🥩 Proteína', kcal:170, prot:28,  carb:0,   gord:6,    fibra:0},
  {nome:'Carne bovina picanha',       cat:'🥩 Proteína', kcal:260, prot:24,  carb:0,   gord:17,   fibra:0},
  {nome:'Carne moída (magra)',        cat:'🥩 Proteína', kcal:215, prot:27,  carb:0,   gord:11,   fibra:0},
  {nome:'Porco lombo',                cat:'🥩 Proteína', kcal:175, prot:29,  carb:0,   gord:6,    fibra:0},
  {nome:'Porco pernil',               cat:'🥩 Proteína', kcal:246, prot:25,  carb:0,   gord:16,   fibra:0},
  {nome:'Atum em lata (água)',        cat:'🥩 Proteína', kcal:116, prot:26,  carb:0,   gord:1.0,  fibra:0},
  {nome:'Atum em lata (óleo)',        cat:'🥩 Proteína', kcal:198, prot:24,  carb:0,   gord:11,   fibra:0},
  {nome:'Salmão grelhado',           cat:'🥩 Proteína', kcal:208, prot:28,  carb:0,   gord:10,   fibra:0},
  {nome:'Tilápia grelhada',           cat:'🥩 Proteína', kcal:128, prot:26,  carb:0,   gord:2.7,  fibra:0},
  {nome:'Sardinha (lata água)',       cat:'🥩 Proteína', kcal:135, prot:24,  carb:0,   gord:4.5,  fibra:0},
  {nome:'Bacalhau cozido',            cat:'🥩 Proteína', kcal:105, prot:23,  carb:0,   gord:0.9,  fibra:0},
  {nome:'Camarão cozido',             cat:'🥩 Proteína', kcal:99,  prot:24,  carb:0.2, gord:0.3,  fibra:0},
  {nome:'Ovo inteiro (1 ovo = 50g)',  cat:'🥩 Proteína', kcal:155, prot:13,  carb:1.1, gord:11,   fibra:0},
  {nome:'Clara de ovo',               cat:'🥩 Proteína', kcal:52,  prot:11,  carb:0.7, gord:0.2,  fibra:0},
  {nome:'Peito de peru (fatiado)',    cat:'🥩 Proteína', kcal:107, prot:21,  carb:1.5, gord:1.7,  fibra:0},
  {nome:'Presunto (magro)',           cat:'🥩 Proteína', kcal:145, prot:20,  carb:1.0, gord:7,    fibra:0},
  {nome:'Frango (asa assada)',        cat:'🥩 Proteína', kcal:290, prot:24,  carb:0,   gord:20,   fibra:0},
  {nome:'Linguiça de frango',        cat:'🥩 Proteína', kcal:195, prot:16,  carb:2,   gord:14,   fibra:0},
  // ── PROTEÍNAS VEGETAIS ────────────────────────────────
  {nome:'Tofu firme',                 cat:'🌿 Proteína vegetal', kcal:76,  prot:8,   carb:1.9, gord:4.8,  fibra:0.3},
  {nome:'Tempeh',                     cat:'🌿 Proteína vegetal', kcal:193, prot:19,  carb:9,   gord:11,   fibra:4.1},
  {nome:'Seitan',                     cat:'🌿 Proteína vegetal', kcal:143, prot:25,  carb:7,   gord:2,    fibra:0.6},
  {nome:'Grão-de-bico cozido',        cat:'🌿 Proteína vegetal', kcal:164, prot:9,   carb:27,  gord:2.6,  fibra:7.6},
  {nome:'Lentilha cozida',            cat:'🌿 Proteína vegetal', kcal:116, prot:9,   carb:20,  gord:0.4,  fibra:7.9},
  {nome:'Feijão preto cozido',        cat:'🌿 Proteína vegetal', kcal:132, prot:9,   carb:24,  gord:0.5,  fibra:8.7},
  {nome:'Feijão carioca cozido',      cat:'🌿 Proteína vegetal', kcal:127, prot:8,   carb:23,  gord:0.5,  fibra:8},
  {nome:'Feijão branco cozido',       cat:'🌿 Proteína vegetal', kcal:139, prot:10,  carb:25,  gord:0.4,  fibra:6.3},
  {nome:'Ervilha cozida',             cat:'🌿 Proteína vegetal', kcal:84,  prot:5.4, carb:15,  gord:0.4,  fibra:5.7},
  {nome:'Edamame (soja cozida)',      cat:'🌿 Proteína vegetal', kcal:121, prot:11,  carb:9,   gord:5.2,  fibra:5.2},
  {nome:'Amendoim torrado',           cat:'🌿 Proteína vegetal', kcal:567, prot:26,  carb:16,  gord:49,   fibra:8.5},
  {nome:'Pasta de amendoim (natural)',cat:'🌿 Proteína vegetal', kcal:598, prot:25,  carb:20,  gord:51,   fibra:6},
  // ── LACTICÍNIOS ──────────────────────────────────────
  {nome:'Whey protein (pó)',          cat:'🥛 Laticínio', kcal:380, prot:80,  carb:7,   gord:4,    fibra:0},
  {nome:'Iogurte grego natural',      cat:'🥛 Laticínio', kcal:97,  prot:9,   carb:4,   gord:5,    fibra:0},
  {nome:'Iogurte grego 0% gordura',   cat:'🥛 Laticínio', kcal:59,  prot:10,  carb:4,   gord:0.4,  fibra:0},
  {nome:'Iogurte natural integral',   cat:'🥛 Laticínio', kcal:61,  prot:3.5, carb:5,   gord:3.3,  fibra:0},
  {nome:'Queijo cottage',             cat:'🥛 Laticínio', kcal:98,  prot:11,  carb:3,   gord:4.5,  fibra:0},
  {nome:'Queijo mussarela',           cat:'🥛 Laticínio', kcal:280, prot:22,  carb:2.2, gord:22,   fibra:0},
  {nome:'Queijo prato',               cat:'🥛 Laticínio', kcal:356, prot:25,  carb:1.5, gord:28,   fibra:0},
  {nome:'Queijo ricota',              cat:'🥛 Laticínio', kcal:174, prot:11,  carb:3,   gord:13,   fibra:0},
  {nome:'Leite integral',             cat:'🥛 Laticínio', kcal:61,  prot:3.2, carb:4.8, gord:3.3,  fibra:0},
  {nome:'Leite desnatado',            cat:'🥛 Laticínio', kcal:34,  prot:3.4, carb:5,   gord:0.1,  fibra:0},
  {nome:'Leite semidesnatado',        cat:'🥛 Laticínio', kcal:46,  prot:3.3, carb:4.8, gord:1.6,  fibra:0},
  {nome:'Queijo parmesão',            cat:'🥛 Laticínio', kcal:431, prot:38,  carb:4.1, gord:29,   fibra:0},
  // ── CARBOIDRATOS ─────────────────────────────────────
  {nome:'Arroz branco cozido',        cat:'🌾 Carboidrato', kcal:130, prot:2.7, carb:28,  gord:0.3,  fibra:0.4},
  {nome:'Arroz integral cozido',      cat:'🌾 Carboidrato', kcal:123, prot:2.5, carb:26,  gord:0.9,  fibra:1.8},
  {nome:'Arroz basmati cozido',       cat:'🌾 Carboidrato', kcal:121, prot:2.3, carb:26,  gord:0.2,  fibra:0.4},
  {nome:'Macarrão cozido',            cat:'🌾 Carboidrato', kcal:158, prot:5.8, carb:31,  gord:0.9,  fibra:1.8},
  {nome:'Macarrão integral cozido',   cat:'🌾 Carboidrato', kcal:149, prot:5.5, carb:29,  gord:0.8,  fibra:3.9},
  {nome:'Batata inglesa cozida',      cat:'🌾 Carboidrato', kcal:87,  prot:1.9, carb:20,  gord:0.1,  fibra:1.8},
  {nome:'Batata-doce cozida',         cat:'🌾 Carboidrato', kcal:90,  prot:2,   carb:21,  gord:0.1,  fibra:3.3},
  {nome:'Mandioca cozida',            cat:'🌾 Carboidrato', kcal:126, prot:1.1, carb:30,  gord:0.3,  fibra:1.9},
  {nome:'Tapioca (goma seca)',        cat:'🌾 Carboidrato', kcal:350, prot:0.2, carb:86,  gord:0.1,  fibra:0.9},
  {nome:'Aveia em flocos',            cat:'🌾 Carboidrato', kcal:389, prot:17,  carb:66,  gord:7,    fibra:10.6},
  {nome:'Granola (sem açúcar)',       cat:'🌾 Carboidrato', kcal:385, prot:10,  carb:60,  gord:14,   fibra:5},
  {nome:'Pão integral (fatia 30g)',   cat:'🌾 Carboidrato', kcal:265, prot:9,   carb:45,  gord:4.2,  fibra:6},
  {nome:'Pão de forma branco (30g)',  cat:'🌾 Carboidrato', kcal:280, prot:8,   carb:53,  gord:3.5,  fibra:2.3},
  {nome:'Pão francês',                cat:'🌾 Carboidrato', kcal:300, prot:8,   carb:58,  gord:3.1,  fibra:2.3},
  {nome:'Cuscuz paulista cozido',     cat:'🌾 Carboidrato', kcal:112, prot:2.5, carb:24,  gord:0.3,  fibra:1.2},
  {nome:'Quinoa cozida',              cat:'🌾 Carboidrato', kcal:120, prot:4.4, carb:21,  gord:1.9,  fibra:2.8},
  {nome:'Milho cozido',               cat:'🌾 Carboidrato', kcal:96,  prot:3.4, carb:21,  gord:1.5,  fibra:2.4},
  {nome:'Cevada cozida',              cat:'🌾 Carboidrato', kcal:123, prot:2.3, carb:28,  gord:0.4,  fibra:3.8},
  {nome:'Inhame cozido',              cat:'🌾 Carboidrato', kcal:118, prot:1.5, carb:28,  gord:0.2,  fibra:4.1},
  {nome:'Cará cozido',                cat:'🌾 Carboidrato', kcal:116, prot:1.3, carb:27,  gord:0.1,  fibra:4},
  {nome:'Biscoito de arroz',          cat:'🌾 Carboidrato', kcal:392, prot:7.5, carb:81,  gord:3,    fibra:2.5},
  {nome:'Wrap de farinha integral',   cat:'🌾 Carboidrato', kcal:290, prot:9,   carb:48,  gord:6,    fibra:5},
  // ── FRUTAS ───────────────────────────────────────────
  {nome:'Banana prata',               cat:'🍎 Fruta', kcal:89,  prot:1.1, carb:23,  gord:0.3,  fibra:2.6},
  {nome:'Banana nanica',              cat:'🍎 Fruta', kcal:92,  prot:1.2, carb:24,  gord:0.2,  fibra:2.4},
  {nome:'Maçã com casca',             cat:'🍎 Fruta', kcal:52,  prot:0.3, carb:14,  gord:0.2,  fibra:2.4},
  {nome:'Laranja',                    cat:'🍎 Fruta', kcal:47,  prot:0.9, carb:12,  gord:0.1,  fibra:2.4},
  {nome:'Manga',                      cat:'🍎 Fruta', kcal:60,  prot:0.8, carb:15,  gord:0.4,  fibra:1.6},
  {nome:'Abacaxi',                    cat:'🍎 Fruta', kcal:48,  prot:0.5, carb:13,  gord:0.1,  fibra:1.4},
  {nome:'Melancia',                   cat:'🍎 Fruta', kcal:30,  prot:0.6, carb:8,   gord:0.2,  fibra:0.4},
  {nome:'Melão',                      cat:'🍎 Fruta', kcal:34,  prot:0.8, carb:8,   gord:0.2,  fibra:0.9},
  {nome:'Morango',                    cat:'🍎 Fruta', kcal:32,  prot:0.7, carb:7.7, gord:0.3,  fibra:2},
  {nome:'Uva (verde/roxa)',           cat:'🍎 Fruta', kcal:69,  prot:0.7, carb:18,  gord:0.2,  fibra:0.9},
  {nome:'Pera',                       cat:'🍎 Fruta', kcal:57,  prot:0.4, carb:15,  gord:0.1,  fibra:3.1},
  {nome:'Pêssego',                    cat:'🍎 Fruta', kcal:39,  prot:0.9, carb:10,  gord:0.3,  fibra:1.5},
  {nome:'Abacate',                    cat:'🍎 Fruta', kcal:160, prot:2,   carb:9,   gord:15,   fibra:6.7},
  {nome:'Coco ralado (fresco)',       cat:'🍎 Fruta', kcal:354, prot:3.3, carb:15,  gord:33,   fibra:9},
  {nome:'Mamão papaia',               cat:'🍎 Fruta', kcal:43,  prot:0.5, carb:11,  gord:0.3,  fibra:1.7},
  {nome:'Kiwi',                       cat:'🍎 Fruta', kcal:61,  prot:1.1, carb:15,  gord:0.5,  fibra:3},
  {nome:'Maracujá (polpa)',           cat:'🍎 Fruta', kcal:68,  prot:2.2, carb:16,  gord:0.4,  fibra:0.4},
  {nome:'Goiaba',                     cat:'🍎 Fruta', kcal:68,  prot:2.6, carb:14,  gord:1,    fibra:5.4},
  {nome:'Caju',                       cat:'🍎 Fruta', kcal:43,  prot:0.9, carb:10,  gord:0.3,  fibra:1.7},
  {nome:'Pitaya (dragon fruit)',      cat:'🍎 Fruta', kcal:60,  prot:1.2, carb:13,  gord:0.4,  fibra:3},
  {nome:'Framboesa',                  cat:'🍎 Fruta', kcal:52,  prot:1.2, carb:12,  gord:0.7,  fibra:6.5},
  {nome:'Mirtilo (blueberry)',        cat:'🍎 Fruta', kcal:57,  prot:0.7, carb:14,  gord:0.3,  fibra:2.4},
  {nome:'Limão (suco)',               cat:'🍎 Fruta', kcal:22,  prot:0.4, carb:7,   gord:0.2,  fibra:0.3},
  {nome:'Tangerina/Mexerica',         cat:'🍎 Fruta', kcal:53,  prot:0.8, carb:13,  gord:0.3,  fibra:1.8},
  {nome:'Ameixa fresca',              cat:'🍎 Fruta', kcal:46,  prot:0.7, carb:11,  gord:0.3,  fibra:1.4},
  // ── LEGUMES E VERDURAS ───────────────────────────────
  {nome:'Brócolis cozido',            cat:'🥦 Vegetal', kcal:35,  prot:2.4, carb:7,   gord:0.4,  fibra:3.3},
  {nome:'Couve-flor cozida',          cat:'🥦 Vegetal', kcal:25,  prot:1.9, carb:5,   gord:0.3,  fibra:2},
  {nome:'Espinafre cozido',           cat:'🥦 Vegetal', kcal:23,  prot:2.9, carb:3.8, gord:0.3,  fibra:2.2},
  {nome:'Alface (folhas)',            cat:'🥦 Vegetal', kcal:15,  prot:1.4, carb:2.9, gord:0.2,  fibra:1.3},
  {nome:'Rúcula',                     cat:'🥦 Vegetal', kcal:25,  prot:2.6, carb:3.7, gord:0.7,  fibra:1.6},
  {nome:'Tomate',                     cat:'🥦 Vegetal', kcal:18,  prot:0.9, carb:3.9, gord:0.2,  fibra:1.2},
  {nome:'Cenoura crua',               cat:'🥦 Vegetal', kcal:41,  prot:0.9, carb:10,  gord:0.2,  fibra:2.8},
  {nome:'Cenoura cozida',             cat:'🥦 Vegetal', kcal:35,  prot:0.8, carb:8,   gord:0.2,  fibra:3},
  {nome:'Beterraba cozida',           cat:'🥦 Vegetal', kcal:44,  prot:1.7, carb:10,  gord:0.2,  fibra:2},
  {nome:'Abobrinha cozida',           cat:'🥦 Vegetal', kcal:17,  prot:1.2, carb:3.6, gord:0.3,  fibra:1.1},
  {nome:'Berinjela cozida',           cat:'🥦 Vegetal', kcal:35,  prot:0.8, carb:8.7, gord:0.2,  fibra:2.5},
  {nome:'Chuchu cozido',              cat:'🥦 Vegetal', kcal:19,  prot:0.8, carb:4.5, gord:0.1,  fibra:1.7},
  {nome:'Pepino',                     cat:'🥦 Vegetal', kcal:15,  prot:0.7, carb:3.6, gord:0.1,  fibra:0.5},
  {nome:'Pimentão verde',             cat:'🥦 Vegetal', kcal:20,  prot:0.9, carb:4.6, gord:0.2,  fibra:1.7},
  {nome:'Pimentão vermelho',          cat:'🥦 Vegetal', kcal:31,  prot:1,   carb:6,   gord:0.3,  fibra:2.1},
  {nome:'Couve manteiga cozida',      cat:'🥦 Vegetal', kcal:33,  prot:2.1, carb:6.6, gord:0.4,  fibra:3.8},
  {nome:'Repolho cru',                cat:'🥦 Vegetal', kcal:25,  prot:1.3, carb:6,   gord:0.1,  fibra:2.5},
  {nome:'Repolho cozido',             cat:'🥦 Vegetal', kcal:23,  prot:1,   carb:5.5, gord:0.1,  fibra:2.3},
  {nome:'Acelga cozida',              cat:'🥦 Vegetal', kcal:20,  prot:1.9, carb:4.1, gord:0.1,  fibra:1.6},
  {nome:'Alho',                       cat:'🥦 Vegetal', kcal:149, prot:6.4, carb:33,  gord:0.5,  fibra:2.1},
  {nome:'Cebola',                     cat:'🥦 Vegetal', kcal:40,  prot:1.1, carb:9.3, gord:0.1,  fibra:1.7},
  {nome:'Vagem cozida',               cat:'🥦 Vegetal', kcal:31,  prot:1.8, carb:7,   gord:0.1,  fibra:2.7},
  {nome:'Aspargo cozido',             cat:'🥦 Vegetal', kcal:22,  prot:2.2, carb:4.1, gord:0.2,  fibra:1.8},
  {nome:'Cogumelo (champignon)',       cat:'🥦 Vegetal', kcal:22,  prot:3.1, carb:3.3, gord:0.3,  fibra:1},
  {nome:'Quiabo cozido',              cat:'🥦 Vegetal', kcal:33,  prot:2,   carb:7.5, gord:0.2,  fibra:3.2},
  {nome:'Abóbora cozida',             cat:'🥦 Vegetal', kcal:26,  prot:1,   carb:7,   gord:0.1,  fibra:0.5},
  {nome:'Jiló cozido',                cat:'🥦 Vegetal', kcal:29,  prot:1.3, carb:6.4, gord:0.2,  fibra:2.4},
  {nome:'Coentro fresco',             cat:'🥦 Vegetal', kcal:23,  prot:2.1, carb:3.7, gord:0.5,  fibra:2.8},
  {nome:'Tomate cereja',              cat:'🥦 Vegetal', kcal:18,  prot:0.9, carb:3.9, gord:0.2,  fibra:1.2},
  {nome:'Alho-poró',                  cat:'🥦 Vegetal', kcal:61,  prot:1.5, carb:14,  gord:0.3,  fibra:1.8},
  {nome:'Gengibre fresco',            cat:'🥦 Vegetal', kcal:80,  prot:1.8, carb:18,  gord:0.8,  fibra:2},
  // ── GORDURAS SAUDÁVEIS ───────────────────────────────
  {nome:'Azeite de oliva',            cat:'🫒 Gordura', kcal:884, prot:0,   carb:0,   gord:100,  fibra:0},
  {nome:'Óleo de coco',               cat:'🫒 Gordura', kcal:862, prot:0,   carb:0,   gord:100,  fibra:0},
  {nome:'Óleo de girassol',           cat:'🫒 Gordura', kcal:884, prot:0,   carb:0,   gord:100,  fibra:0},
  {nome:'Manteiga',                   cat:'🫒 Gordura', kcal:717, prot:0.9, carb:0.1, gord:81,   fibra:0},
  {nome:'Margarina',                  cat:'🫒 Gordura', kcal:719, prot:0.2, carb:0.7, gord:80,   fibra:0},
  {nome:'Castanha-do-pará',           cat:'🫒 Gordura', kcal:659, prot:14,  carb:12,  gord:67,   fibra:7.5},
  {nome:'Castanha de caju',           cat:'🫒 Gordura', kcal:553, prot:18,  carb:30,  gord:44,   fibra:3.3},
  {nome:'Amêndoas',                   cat:'🫒 Gordura', kcal:579, prot:21,  carb:22,  gord:50,   fibra:12.5},
  {nome:'Nozes',                      cat:'🫒 Gordura', kcal:654, prot:15,  carb:14,  gord:65,   fibra:6.7},
  {nome:'Chia (semente)',             cat:'🫒 Gordura', kcal:486, prot:17,  carb:42,  gord:31,   fibra:34.4},
  {nome:'Linhaça dourada',            cat:'🫒 Gordura', kcal:534, prot:18,  carb:29,  gord:42,   fibra:27.3},
  {nome:'Gergelim (sésamo)',          cat:'🫒 Gordura', kcal:573, prot:18,  carb:23,  gord:50,   fibra:11.8},
  {nome:'Tahini (pasta gergelim)',    cat:'🫒 Gordura', kcal:595, prot:17,  carb:21,  gord:54,   fibra:9.3},
  {nome:'Macadâmia',                  cat:'🫒 Gordura', kcal:718, prot:7.9, carb:14,  gord:76,   fibra:8.6},
  {nome:'Pistache torrado',           cat:'🫒 Gordura', kcal:562, prot:20,  carb:28,  gord:45,   fibra:10.3},
  {nome:'Avelã',                      cat:'🫒 Gordura', kcal:628, prot:15,  carb:17,  gord:61,   fibra:9.7},
  // ── BEBIDAS ──────────────────────────────────────────
  {nome:'Água',                       cat:'💧 Bebida', kcal:0,   prot:0,   carb:0,   gord:0,    fibra:0},
  {nome:'Café preto (sem açúcar)',    cat:'💧 Bebida', kcal:2,   prot:0.3, carb:0,   gord:0,    fibra:0},
  {nome:'Leite de amêndoa',           cat:'💧 Bebida', kcal:17,  prot:0.6, carb:0.6, gord:1.5,  fibra:0.3},
  {nome:'Leite de aveia',             cat:'💧 Bebida', kcal:45,  prot:1,   carb:8,   gord:1.5,  fibra:0.5},
  {nome:'Suco de laranja natural',    cat:'💧 Bebida', kcal:45,  prot:0.7, carb:10,  gord:0.2,  fibra:0.2},
  {nome:'Suco de limão (sem açúcar)', cat:'💧 Bebida', kcal:25,  prot:0.4, carb:8,   gord:0.1,  fibra:0.3},
  {nome:'Chá verde (sem açúcar)',     cat:'💧 Bebida', kcal:1,   prot:0,   carb:0.2, gord:0,    fibra:0},
  {nome:'Leite de coco (lata)',       cat:'💧 Bebida', kcal:197, prot:2,   carb:6,   gord:21,   fibra:0},
  // ── REFEIÇÕES / PRATOS PRONTOS ───────────────────────
  {nome:'Marmita fitness (300g)',     cat:'🍱 Prato pronto', kcal:350, prot:35,  carb:30,  gord:8,    fibra:4},
  {nome:'Omelete 2 ovos',             cat:'🍱 Prato pronto', kcal:190, prot:14,  carb:1.5, gord:15,   fibra:0},
  {nome:'Vitamina de banana c/ leite',cat:'🍱 Prato pronto', kcal:120, prot:5,   carb:22,  gord:2,    fibra:1.5},
  {nome:'Açaí puro (sem adição)',     cat:'🍱 Prato pronto', kcal:70,  prot:0.9, carb:7,   gord:5,    fibra:2.2},
  {nome:'Caldo de feijão',            cat:'🍱 Prato pronto', kcal:52,  prot:3,   carb:8,   gord:1,    fibra:2.5},
  {nome:'Sopa de legumes',            cat:'🍱 Prato pronto', kcal:45,  prot:2,   carb:9,   gord:0.5,  fibra:2},
  {nome:'Pizza de frango (fatia)',    cat:'🍱 Prato pronto', kcal:270, prot:14,  carb:30,  gord:10,   fibra:1.5},
  {nome:'Hambúrguer caseiro (bovino)',cat:'🍱 Prato pronto', kcal:295, prot:24,  carb:0,   gord:22,   fibra:0},
  {nome:'Wrap de frango grelhado',   cat:'🍱 Prato pronto', kcal:210, prot:22,  carb:22,  gord:5,    fibra:2.5},
  {nome:'Bowl de açaí c/ frutas',    cat:'🍱 Prato pronto', kcal:180, prot:3,   carb:34,  gord:5,    fibra:4},
  {nome:'Strogonoff de frango',      cat:'🍱 Prato pronto', kcal:185, prot:18,  carb:8,   gord:9,    fibra:0.5},
  {nome:'Panqueca de aveia (2 un)',  cat:'🍱 Prato pronto', kcal:220, prot:10,  carb:28,  gord:7,    fibra:3},
  {nome:'Frango ao curry c/ arroz',  cat:'🍱 Prato pronto', kcal:280, prot:25,  carb:28,  gord:8,    fibra:1.5},
  {nome:'Salada caesar c/ frango',   cat:'🍱 Prato pronto', kcal:195, prot:20,  carb:8,   gord:9,    fibra:2},
  {nome:'Tapioca de frango e queijo',cat:'🍱 Prato pronto', kcal:230, prot:18,  carb:26,  gord:6,    fibra:1},
  {nome:'Omelete de claras (3)',      cat:'🍱 Prato pronto', kcal:105, prot:16,  carb:1.5, gord:4,    fibra:0},

  // ── CARNES PROCESSADAS ───────────────────────────────
  {nome:'Salsicha de frango',        cat:'🥩 Proteína', kcal:170, prot:11,  carb:3,   gord:13,   fibra:0},
  {nome:'Bacon (tiras)',             cat:'🥩 Proteína', kcal:541, prot:37,  carb:1.4, gord:42,   fibra:0},
  {nome:'Mortadela',                 cat:'🥩 Proteína', kcal:263, prot:13,  carb:4,   gord:22,   fibra:0},
  {nome:'Salame italiano',           cat:'🥩 Proteína', kcal:407, prot:24,  carb:2,   gord:34,   fibra:0},
  {nome:'Copa (fatiada)',            cat:'🥩 Proteína', kcal:270, prot:19,  carb:1,   gord:21,   fibra:0},
  {nome:'Peito de chester cozido',   cat:'🥩 Proteína', kcal:130, prot:22,  carb:0,   gord:4.5,  fibra:0},
  {nome:'Carne seca cozida',         cat:'🥩 Proteína', kcal:250, prot:43,  carb:0,   gord:8,    fibra:0},
  {nome:'Costela bovina cozida',     cat:'🥩 Proteína', kcal:291, prot:27,  carb:0,   gord:19,   fibra:0},
  {nome:'Contra-filé grelhado',      cat:'🥩 Proteína', kcal:230, prot:27,  carb:0,   gord:13,   fibra:0},
  {nome:'Músculo bovino cozido',     cat:'🥩 Proteína', kcal:218, prot:33,  carb:0,   gord:9,    fibra:0},
  {nome:'Fígado bovino cozido',      cat:'🥩 Proteína', kcal:175, prot:27,  carb:5,   gord:5,    fibra:0},
  {nome:'Frango inteiro assado',     cat:'🥩 Proteína', kcal:239, prot:27,  carb:0,   gord:14,   fibra:0},
  {nome:'Coração de frango',         cat:'🥩 Proteína', kcal:185, prot:26,  carb:0,   gord:8.5,  fibra:0},
  {nome:'Moela de frango cozida',    cat:'🥩 Proteína', kcal:154, prot:28,  carb:0,   gord:4,    fibra:0},
  {nome:'Peixe merluza cozida',      cat:'🥩 Proteína', kcal:86,  prot:18,  carb:0,   gord:1.4,  fibra:0},
  {nome:'Peixe cação grelhado',      cat:'🥩 Proteína', kcal:130, prot:22,  carb:0,   gord:4.5,  fibra:0},
  {nome:'Truta grelhada',            cat:'🥩 Proteína', kcal:190, prot:26,  carb:0,   gord:9,    fibra:0},
  {nome:'Lula grelhada',             cat:'🥩 Proteína', kcal:92,  prot:16,  carb:3.1, gord:1.4,  fibra:0},
  {nome:'Polvo cozido',              cat:'🥩 Proteína', kcal:164, prot:30,  carb:4.4, gord:2.1,  fibra:0},
  {nome:'Ostra cozida',              cat:'🥩 Proteína', kcal:69,  prot:8,   carb:4.2, gord:2.5,  fibra:0},
  {nome:'Mexilhão cozido',           cat:'🥩 Proteína', kcal:172, prot:24,  carb:7.4, gord:4.5,  fibra:0},
  {nome:'Arenque grelhado',          cat:'🥩 Proteína', kcal:203, prot:23,  carb:0,   gord:12,   fibra:0},
  {nome:'Cavala grelhada',           cat:'🥩 Proteína', kcal:205, prot:19,  carb:0,   gord:14,   fibra:0},
  {nome:'Robalo grelhado',           cat:'🥩 Proteína', kcal:124, prot:24,  carb:0,   gord:2.6,  fibra:0},
  {nome:'Dourada grelhada',          cat:'🥩 Proteína', kcal:128, prot:26,  carb:0,   gord:2.5,  fibra:0},
  {nome:'Peixe-espada grelhado',     cat:'🥩 Proteína', kcal:145, prot:21,  carb:0,   gord:6.5,  fibra:0},
  {nome:'Linguado grelhado',         cat:'🥩 Proteína', kcal:91,  prot:19,  carb:0,   gord:1.2,  fibra:0},
  {nome:'Ovo de codorna (1=10g)',    cat:'🥩 Proteína', kcal:158, prot:13,  carb:0.4, gord:11,   fibra:0},

  // ── PROTEÍNAS VEGETAIS (ampliado) ────────────────────
  {nome:'Soja texturizada seca',     cat:'🌿 Proteína vegetal', kcal:331, prot:52,  carb:34,  gord:1,    fibra:17},
  {nome:'Soja texturizada cozida',   cat:'🌿 Proteína vegetal', kcal:135, prot:17,  carb:14,  gord:1,    fibra:4.5},
  {nome:'Feijão-de-corda cozido',    cat:'🌿 Proteína vegetal', kcal:120, prot:8,   carb:21,  gord:0.5,  fibra:6.5},
  {nome:'Feijão fradinho cozido',    cat:'🌿 Proteína vegetal', kcal:116, prot:8,   carb:20,  gord:0.4,  fibra:6.3},
  {nome:'Feijão verde cozido',       cat:'🌿 Proteína vegetal', kcal:31,  prot:1.8, carb:7,   gord:0.1,  fibra:2.7},
  {nome:'Lentilha vermelha cozida',  cat:'🌿 Proteína vegetal', kcal:116, prot:9,   carb:20,  gord:0.4,  fibra:7.9},
  {nome:'Ervilha torta crua',        cat:'🌿 Proteína vegetal', kcal:42,  prot:2.8, carb:7.6, gord:0.2,  fibra:2.6},
  {nome:'Amendoim cozido (sem sal)', cat:'🌿 Proteína vegetal', kcal:318, prot:14,  carb:18,  gord:23,   fibra:6.5},
  {nome:'Pasta de amêndoa',          cat:'🌿 Proteína vegetal', kcal:614, prot:21,  carb:19,  gord:56,   fibra:10},
  {nome:'Castanha assada',           cat:'🌿 Proteína vegetal', kcal:245, prot:3.2, carb:53,  gord:2.2,  fibra:5.1},
  {nome:'Proteína de ervilha (pó)',  cat:'🌿 Proteína vegetal', kcal:370, prot:80,  carb:5,   gord:2,    fibra:2},
  {nome:'Proteína de arroz (pó)',    cat:'🌿 Proteína vegetal', kcal:360, prot:78,  carb:10,  gord:2,    fibra:1},
  {nome:'Proteína de soja (pó)',     cat:'🌿 Proteína vegetal', kcal:338, prot:90,  carb:0,   gord:0.5,  fibra:0},

  // ── LATICÍNIOS (ampliado) ────────────────────────────
  {nome:'Queijo brie',               cat:'🥛 Laticínio', kcal:334, prot:21,  carb:0.5, gord:28,   fibra:0},
  {nome:'Queijo gouda',              cat:'🥛 Laticínio', kcal:356, prot:25,  carb:2.2, gord:27,   fibra:0},
  {nome:'Queijo cheddar',            cat:'🥛 Laticínio', kcal:403, prot:25,  carb:1.3, gord:33,   fibra:0},
  {nome:'Requeijão cremoso',         cat:'🥛 Laticínio', kcal:250, prot:8.5, carb:5,   gord:22,   fibra:0},
  {nome:'Cream cheese',              cat:'🥛 Laticínio', kcal:342, prot:6,   carb:4.1, gord:34,   fibra:0},
  {nome:'Manteiga ghee',             cat:'🥛 Laticínio', kcal:876, prot:0.3, carb:0,   gord:99,   fibra:0},
  {nome:'Leite condensado',          cat:'🥛 Laticínio', kcal:321, prot:8,   carb:54,  gord:8.7,  fibra:0},
  {nome:'Iogurte de morango',        cat:'🥛 Laticínio', kcal:93,  prot:3.2, carb:17,  gord:1.5,  fibra:0},
  {nome:'Kefir integral',            cat:'🥛 Laticínio', kcal:61,  prot:3.3, carb:4.5, gord:3.5,  fibra:0},
  {nome:'Coalhada seca',             cat:'🥛 Laticínio', kcal:110, prot:7,   carb:5,   gord:7,    fibra:0},
  {nome:'Queijo minas frescal',      cat:'🥛 Laticínio', kcal:264, prot:17,  carb:3,   gord:20,   fibra:0},
  {nome:'Queijo coalho grelhado',    cat:'🥛 Laticínio', kcal:316, prot:20,  carb:3,   gord:25,   fibra:0},
  {nome:'Leite de coco (light)',     cat:'🥛 Laticínio', kcal:85,  prot:1.2, carb:3.5, gord:8,    fibra:0},

  // ── CARBOIDRATOS (ampliado) ──────────────────────────
  {nome:'Batata frita caseira',      cat:'🌾 Carboidrato', kcal:312, prot:3.5, carb:41,  gord:15,   fibra:3.5},
  {nome:'Polenta cozida',            cat:'🌾 Carboidrato', kcal:70,  prot:1.7, carb:15,  gord:0.4,  fibra:0.7},
  {nome:'Farinha de mandioca torrada',cat:'🌾 Carboidrato', kcal:363, prot:1.5, carb:88,  gord:0.3,  fibra:6.5},
  {nome:'Farinha de milho (fubá)',   cat:'🌾 Carboidrato', kcal:361, prot:7.9, carb:75,  gord:2.8,  fibra:3.7},
  {nome:'Farinha de trigo integral', cat:'🌾 Carboidrato', kcal:340, prot:13,  carb:72,  gord:2.5,  fibra:10.7},
  {nome:'Farinha de aveia',          cat:'🌾 Carboidrato', kcal:389, prot:17,  carb:66,  gord:7,    fibra:10.6},
  {nome:'Farinha de amêndoa',        cat:'🌾 Carboidrato', kcal:579, prot:21,  carb:22,  gord:50,   fibra:12.5},
  {nome:'Macarrão de arroz cozido',  cat:'🌾 Carboidrato', kcal:113, prot:2,   carb:25,  gord:0.2,  fibra:0.4},
  {nome:'Macarrão de lentilha cozido',cat:'🌾 Carboidrato',kcal:120, prot:8,   carb:22,  gord:0.5,  fibra:4},
  {nome:'Pão de queijo (50g)',       cat:'🌾 Carboidrato', kcal:150, prot:3.5, carb:20,  gord:6.5,  fibra:0.3},
  {nome:'Beiju de tapioca',          cat:'🌾 Carboidrato', kcal:140, prot:0.3, carb:35,  gord:0.1,  fibra:0.5},
  {nome:'Cuscuz nordestino cozido',  cat:'🌾 Carboidrato', kcal:112, prot:2.5, carb:24,  gord:0.3,  fibra:1.2},
  {nome:'Pipoca (sem manteiga)',     cat:'🌾 Carboidrato', kcal:375, prot:12,  carb:74,  gord:4.5,  fibra:14.5},
  {nome:'Pipoca (c/ manteiga)',      cat:'🌾 Carboidrato', kcal:430, prot:8,   carb:62,  gord:17,   fibra:9},
  {nome:'Torrada integral',          cat:'🌾 Carboidrato', kcal:340, prot:12,  carb:64,  gord:4.5,  fibra:7},
  {nome:'Biscoito cream cracker',    cat:'🌾 Carboidrato', kcal:428, prot:9,   carb:69,  gord:12,   fibra:2.5},
  {nome:'Bolacha de água e sal',     cat:'🌾 Carboidrato', kcal:410, prot:8,   carb:72,  gord:9,    fibra:2},
  {nome:'Cevadinha cozida',          cat:'🌾 Carboidrato', kcal:123, prot:2.3, carb:28,  gord:0.4,  fibra:3.8},
  {nome:'Trigo sarraceno cozido',    cat:'🌾 Carboidrato', kcal:92,  prot:3.4, carb:20,  gord:0.6,  fibra:2.7},
  {nome:'Teff cozido',               cat:'🌾 Carboidrato', kcal:101, prot:3.9, carb:20,  gord:0.7,  fibra:2.8},
  {nome:'Amaranto cozido',           cat:'🌾 Carboidrato', kcal:102, prot:3.8, carb:19,  gord:1.6,  fibra:2.1},
  {nome:'Macarrão espaguete cozido', cat:'🌾 Carboidrato', kcal:158, prot:5.8, carb:31,  gord:0.9,  fibra:1.8},
  {nome:'Macarrão parafuso cozido',  cat:'🌾 Carboidrato', kcal:155, prot:5.5, carb:30,  gord:0.9,  fibra:1.7},
  {nome:'Macarrão lasanha cozido',   cat:'🌾 Carboidrato', kcal:153, prot:5.5, carb:30,  gord:0.8,  fibra:1.8},
  {nome:'Batata baroa cozida',       cat:'🌾 Carboidrato', kcal:95,  prot:1.3, carb:22,  gord:0.1,  fibra:3.2},

  // ── FRUTAS (ampliado) ────────────────────────────────
  {nome:'Banana da terra cozida',    cat:'🍎 Fruta', kcal:109, prot:1,   carb:29,  gord:0.2,  fibra:2.3},
  {nome:'Cereja',                    cat:'🍎 Fruta', kcal:63,  prot:1.1, carb:16,  gord:0.2,  fibra:2.1},
  {nome:'Figo fresco',               cat:'🍎 Fruta', kcal:74,  prot:0.8, carb:19,  gord:0.3,  fibra:2.9},
  {nome:'Jabuticaba',                cat:'🍎 Fruta', kcal:58,  prot:0.6, carb:15,  gord:0.1,  fibra:2.1},
  {nome:'Jaca (polpa)',              cat:'🍎 Fruta', kcal:95,  prot:1.7, carb:24,  gord:0.1,  fibra:1.5},
  {nome:'Lichia',                    cat:'🍎 Fruta', kcal:66,  prot:0.8, carb:17,  gord:0.4,  fibra:1.3},
  {nome:'Nectarina',                 cat:'🍎 Fruta', kcal:44,  prot:1.1, carb:11,  gord:0.3,  fibra:1.7},
  {nome:'Carambola',                 cat:'🍎 Fruta', kcal:31,  prot:1,   carb:7,   gord:0.3,  fibra:2.8},
  {nome:'Cupuaçu (polpa)',           cat:'🍎 Fruta', kcal:49,  prot:1.4, carb:12,  gord:0.5,  fibra:2.5},
  {nome:'Graviola (polpa)',          cat:'🍎 Fruta', kcal:62,  prot:1,   carb:16,  gord:0.3,  fibra:3.3},
  {nome:'Acerola',                   cat:'🍎 Fruta', kcal:32,  prot:0.8, carb:8,   gord:0.3,  fibra:1.5},
  {nome:'Umbu',                      cat:'🍎 Fruta', kcal:41,  prot:0.5, carb:10,  gord:0.1,  fibra:2.4},
  {nome:'Buriti (polpa)',            cat:'🍎 Fruta', kcal:91,  prot:2.3, carb:12,  gord:3.2,  fibra:2.7},
  {nome:'Caqui',                     cat:'🍎 Fruta', kcal:70,  prot:0.6, carb:19,  gord:0.2,  fibra:3.6},
  {nome:'Romã (grãos)',              cat:'🍎 Fruta', kcal:83,  prot:1.7, carb:19,  gord:1.2,  fibra:4},
  {nome:'Manga palmer',              cat:'🍎 Fruta', kcal:57,  prot:0.7, carb:15,  gord:0.3,  fibra:1.8},
  {nome:'Abacaxi pérola',            cat:'🍎 Fruta', kcal:46,  prot:0.5, carb:12,  gord:0.1,  fibra:1.4},
  {nome:'Banana ouro',               cat:'🍎 Fruta', kcal:98,  prot:1.3, carb:26,  gord:0.2,  fibra:1.9},
  {nome:'Tâmara seca',               cat:'🍎 Fruta', kcal:282, prot:2.5, carb:75,  gord:0.4,  fibra:8},
  {nome:'Damasco seco',              cat:'🍎 Fruta', kcal:241, prot:3.4, carb:63,  gord:0.5,  fibra:7.3},
  {nome:'Uva passa',                 cat:'🍎 Fruta', kcal:296, prot:3.1, carb:79,  gord:0.5,  fibra:3.7},
  {nome:'Ameixa seca',               cat:'🍎 Fruta', kcal:240, prot:2.2, carb:64,  gord:0.4,  fibra:7.1},
  {nome:'Figo seco',                 cat:'🍎 Fruta', kcal:249, prot:3.3, carb:64,  gord:0.9,  fibra:9.8},
  {nome:'Coco verde (água, 250ml)',  cat:'🍎 Fruta', kcal:45,  prot:1.7, carb:9,   gord:0.2,  fibra:1.1},
  {nome:'Manga espada',              cat:'🍎 Fruta', kcal:59,  prot:0.6, carb:15,  gord:0.3,  fibra:1.6},

  // ── LEGUMES E VERDURAS (ampliado) ────────────────────
  {nome:'Batata-doce roxa cozida',   cat:'🥦 Vegetal', kcal:86,  prot:1.6, carb:20,  gord:0.1,  fibra:3},
  {nome:'Grão-de-bico assado',       cat:'🥦 Vegetal', kcal:364, prot:19,  carb:61,  gord:6,    fibra:17},
  {nome:'Broto de feijão',           cat:'🥦 Vegetal', kcal:30,  prot:3,   carb:5.9, gord:0.2,  fibra:1.8},
  {nome:'Broto de alfafa',           cat:'🥦 Vegetal', kcal:23,  prot:4,   carb:2.1, gord:0.7,  fibra:1.9},
  {nome:'Palmito cozido',            cat:'🥦 Vegetal', kcal:36,  prot:2.6, carb:6.2, gord:0.5,  fibra:1.8},
  {nome:'Alcachofra cozida',         cat:'🥦 Vegetal', kcal:53,  prot:2.9, carb:12,  gord:0.2,  fibra:5.4},
  {nome:'Aipo (salsão)',             cat:'🥦 Vegetal', kcal:14,  prot:0.7, carb:3,   gord:0.2,  fibra:1.6},
  {nome:'Alho-poró cozido',          cat:'🥦 Vegetal', kcal:31,  prot:0.8, carb:7.6, gord:0.2,  fibra:1.8},
  {nome:'Nabo cozido',               cat:'🥦 Vegetal', kcal:28,  prot:1.2, carb:6.4, gord:0.1,  fibra:1.8},
  {nome:'Rabanete',                  cat:'🥦 Vegetal', kcal:16,  prot:0.7, carb:3.4, gord:0.1,  fibra:1.6},
  {nome:'Pimentão amarelo',          cat:'🥦 Vegetal', kcal:27,  prot:1,   carb:6.3, gord:0.2,  fibra:0.9},
  {nome:'Cebolinha verde',           cat:'🥦 Vegetal', kcal:30,  prot:1.8, carb:6.5, gord:0.1,  fibra:2.6},
  {nome:'Salsinha fresca',           cat:'🥦 Vegetal', kcal:36,  prot:3,   carb:6.3, gord:0.8,  fibra:3.3},
  {nome:'Hortelã fresca',            cat:'🥦 Vegetal', kcal:70,  prot:3.7, carb:15,  gord:0.9,  fibra:8},
  {nome:'Manjericão fresco',         cat:'🥦 Vegetal', kcal:22,  prot:3.2, carb:2.7, gord:0.6,  fibra:1.6},
  {nome:'Orégano seco',              cat:'🥦 Vegetal', kcal:265, prot:9,   carb:69,  gord:4.3,  fibra:42.5},
  {nome:'Espargos grelhados',        cat:'🥦 Vegetal', kcal:22,  prot:2.2, carb:4.1, gord:0.2,  fibra:1.8},
  {nome:'Couve-de-bruxelas cozida',  cat:'🥦 Vegetal', kcal:36,  prot:2.6, carb:7.1, gord:0.5,  fibra:2.6},
  {nome:'Endívia crua',              cat:'🥦 Vegetal', kcal:17,  prot:1.3, carb:3.4, gord:0.2,  fibra:3.1},
  {nome:'Espinafre cru',             cat:'🥦 Vegetal', kcal:23,  prot:2.9, carb:3.6, gord:0.4,  fibra:2.2},
  {nome:'Rúcula crua',               cat:'🥦 Vegetal', kcal:25,  prot:2.6, carb:3.7, gord:0.7,  fibra:1.6},
  {nome:'Alface americana',          cat:'🥦 Vegetal', kcal:14,  prot:1,   carb:2.9, gord:0.2,  fibra:1.2},
  {nome:'Alface roxa',               cat:'🥦 Vegetal', kcal:16,  prot:1.3, carb:2.9, gord:0.3,  fibra:1.1},
  {nome:'Couve-flor assada',         cat:'🥦 Vegetal', kcal:31,  prot:2.5, carb:6.4, gord:0.3,  fibra:2.5},
  {nome:'Brócolis cru',              cat:'🥦 Vegetal', kcal:34,  prot:2.8, carb:7,   gord:0.4,  fibra:2.6},
  {nome:'Milho verde grelhado',      cat:'🥦 Vegetal', kcal:108, prot:3.4, carb:23,  gord:1.4,  fibra:2.9},
  {nome:'Ervilha fresca crua',       cat:'🥦 Vegetal', kcal:81,  prot:5.4, carb:14,  gord:0.4,  fibra:5.1},
  {nome:'Feijão verde cru',          cat:'🥦 Vegetal', kcal:31,  prot:1.8, carb:7,   gord:0.1,  fibra:2.7},
  {nome:'Mandioquinha cozida',       cat:'🥦 Vegetal', kcal:77,  prot:1.2, carb:18,  gord:0.1,  fibra:2},
  {nome:'Chuchu cru',                cat:'🥦 Vegetal', kcal:16,  prot:0.7, carb:3.9, gord:0.1,  fibra:1.7},
  {nome:'Cogumelo shitake',          cat:'🥦 Vegetal', kcal:34,  prot:2.2, carb:6.8, gord:0.5,  fibra:2.5},
  {nome:'Cogumelo portobello',       cat:'🥦 Vegetal', kcal:29,  prot:3.6, carb:5.1, gord:0.3,  fibra:1.3},
  {nome:'Tomate seco',               cat:'🥦 Vegetal', kcal:258, prot:14,  carb:56,  gord:3,    fibra:12.3},
  {nome:'Pimentão jalapeño',         cat:'🥦 Vegetal', kcal:29,  prot:0.9, carb:6.5, gord:0.4,  fibra:2.8},
  {nome:'Coentro em pó',             cat:'🥦 Vegetal', kcal:298, prot:12,  carb:55,  gord:17,   fibra:41.9},

  // ── GORDURAS SAUDÁVEIS (ampliado) ────────────────────
  {nome:'Óleo de abacate',           cat:'🫒 Gordura', kcal:884, prot:0,   carb:0,   gord:100,  fibra:0},
  {nome:'Óleo de linhaça',           cat:'🫒 Gordura', kcal:884, prot:0,   carb:0,   gord:100,  fibra:0},
  {nome:'Óleo de gergelim',          cat:'🫒 Gordura', kcal:884, prot:0,   carb:0,   gord:100,  fibra:0},
  {nome:'Óleo MCT',                  cat:'🫒 Gordura', kcal:884, prot:0,   carb:0,   gord:100,  fibra:0},
  {nome:'Creme de avelã (Nutella)',  cat:'🫒 Gordura', kcal:547, prot:6,   carb:57,  gord:31,   fibra:3.4},
  {nome:'Pasta de caju',             cat:'🫒 Gordura', kcal:587, prot:18,  carb:26,  gord:48,   fibra:3.3},
  {nome:'Pasta de avelã',            cat:'🫒 Gordura', kcal:628, prot:15,  carb:17,  gord:61,   fibra:9.7},
  {nome:'Amendoim salgado',          cat:'🫒 Gordura', kcal:585, prot:25,  carb:16,  gord:50,   fibra:8},
  {nome:'Mix de nuts',               cat:'🫒 Gordura', kcal:607, prot:18,  carb:18,  gord:54,   fibra:7},
  {nome:'Sementes de abóbora',       cat:'🫒 Gordura', kcal:559, prot:30,  carb:11,  gord:49,   fibra:6},
  {nome:'Sementes de girassol',      cat:'🫒 Gordura', kcal:584, prot:21,  carb:20,  gord:51,   fibra:8.6},
  {nome:'Sementes de cânhamo',       cat:'🫒 Gordura', kcal:553, prot:31,  carb:9,   gord:49,   fibra:4},
  {nome:'Creme de avelã (zero açúcar)',cat:'🫒 Gordura',kcal:480, prot:8,  carb:28,  gord:40,   fibra:6},

  // ── BEBIDAS (ampliado) ───────────────────────────────
  {nome:'Leite de soja',             cat:'💧 Bebida', kcal:41,  prot:3.3, carb:3.3, gord:1.8,  fibra:0.3},
  {nome:'Leite de caju',             cat:'💧 Bebida', kcal:36,  prot:1.2, carb:4.3, gord:1.7,  fibra:0.2},
  {nome:'Leite de macadâmia',        cat:'💧 Bebida', kcal:55,  prot:1.2, carb:1.5, gord:5.3,  fibra:0.3},
  {nome:'Bebida de coco (tetrapack)',cat:'💧 Bebida', kcal:22,  prot:0.2, carb:4.5, gord:0.3,  fibra:0},
  {nome:'Chá de gengibre',           cat:'💧 Bebida', kcal:5,   prot:0.1, carb:1.2, gord:0,    fibra:0},
  {nome:'Chá de camomila',           cat:'💧 Bebida', kcal:1,   prot:0,   carb:0.2, gord:0,    fibra:0},
  {nome:'Chá preto (sem açúcar)',    cat:'💧 Bebida', kcal:1,   prot:0,   carb:0.3, gord:0,    fibra:0},
  {nome:'Água com gás',              cat:'💧 Bebida', kcal:0,   prot:0,   carb:0,   gord:0,    fibra:0},
  {nome:'Suco verde (couve+maçã+limão)',cat:'💧 Bebida',kcal:48, prot:1.2, carb:11,  gord:0.3,  fibra:0.8},
  {nome:'Suco de maracujá (natural)',cat:'💧 Bebida', kcal:68,  prot:2.2, carb:16,  gord:0.4,  fibra:0.4},
  {nome:'Suco de manga natural',     cat:'💧 Bebida', kcal:58,  prot:0.6, carb:15,  gord:0.3,  fibra:0.4},
  {nome:'Suco de melancia',          cat:'💧 Bebida', kcal:25,  prot:0.5, carb:6,   gord:0.2,  fibra:0.2},
  {nome:'Vitamina de morango',       cat:'💧 Bebida', kcal:72,  prot:3.5, carb:12,  gord:1.5,  fibra:0.8},
  {nome:'Shake de whey chocolate',   cat:'💧 Bebida', kcal:155, prot:25,  carb:8,   gord:3,    fibra:1},
  {nome:'Shake de whey baunilha',    cat:'💧 Bebida', kcal:148, prot:25,  carb:7,   gord:2.5,  fibra:0.5},
  {nome:'Água de coco natural',      cat:'💧 Bebida', kcal:19,  prot:0.7, carb:3.7, gord:0.2,  fibra:1.1},
  {nome:'Isotónico (Gatorade)',      cat:'💧 Bebida', kcal:26,  prot:0,   carb:6.7, gord:0,    fibra:0},
  {nome:'Bebida energética (250ml)', cat:'💧 Bebida', kcal:45,  prot:0,   carb:11,  gord:0,    fibra:0},

  // ── SUPLEMENTOS ──────────────────────────────────────
  {nome:'Creatina monohidratada',    cat:'💊 Suplemento', kcal:0,   prot:0,   carb:0,   gord:0,    fibra:0},
  {nome:'BCAA (pó)',                 cat:'💊 Suplemento', kcal:320, prot:80,  carb:0,   gord:0,    fibra:0},
  {nome:'Glutamina (pó)',            cat:'💊 Suplemento', kcal:325, prot:81,  carb:0,   gord:0,    fibra:0},
  {nome:'Maltodextrina',             cat:'💊 Suplemento', kcal:378, prot:0,   carb:94,  gord:0,    fibra:0},
  {nome:'Dextrose',                  cat:'💊 Suplemento', kcal:380, prot:0,   carb:95,  gord:0,    fibra:0},
  {nome:'Whey isolado (pó)',         cat:'💊 Suplemento', kcal:360, prot:90,  carb:2,   gord:1,    fibra:0},
  {nome:'Caseína (pó)',              cat:'💊 Suplemento', kcal:370, prot:80,  carb:8,   gord:4,    fibra:1},
  {nome:'Hipercalórico (pó)',        cat:'💊 Suplemento', kcal:375, prot:15,  carb:71,  gord:4,    fibra:1},
  {nome:'Omega 3 (cápsula 1g)',      cat:'💊 Suplemento', kcal:9,   prot:0,   carb:0,   gord:1,    fibra:0},
  {nome:'Albumina (pó)',             cat:'💊 Suplemento', kcal:370, prot:87,  carb:1,   gord:0.5,  fibra:0},
  {nome:'Barra de proteína (60g)',   cat:'💊 Suplemento', kcal:220, prot:20,  carb:22,  gord:7,    fibra:2},
  {nome:'Barra de cereal (30g)',     cat:'💊 Suplemento', kcal:115, prot:2.2, carb:21,  gord:2.8,  fibra:1.4},

  // ── MOLHOS E TEMPEROS ────────────────────────────────
  {nome:'Molho de soja (shoyu)',     cat:'🧂 Tempero', kcal:53,  prot:8,   carb:5,   gord:0,    fibra:0.8},
  {nome:'Molho inglês',             cat:'🧂 Tempero', kcal:78,  prot:1.4, carb:19,  gord:0,    fibra:0},
  {nome:'Molho de tomate caseiro',   cat:'🧂 Tempero', kcal:38,  prot:1.6, carb:8,   gord:0.4,  fibra:1.5},
  {nome:'Ketchup',                   cat:'🧂 Tempero', kcal:112, prot:1.5, carb:27,  gord:0.4,  fibra:0.5},
  {nome:'Mostarda',                  cat:'🧂 Tempero', kcal:66,  prot:4.4, carb:5.3, gord:4,    fibra:3.2},
  {nome:'Maionese tradicional',      cat:'🧂 Tempero', kcal:680, prot:1.3, carb:2.4, gord:75,   fibra:0},
  {nome:'Maionese light',            cat:'🧂 Tempero', kcal:310, prot:1.5, carb:10,  gord:30,   fibra:0},
  {nome:'Azeite (colher = 10g)',     cat:'🧂 Tempero', kcal:88,  prot:0,   carb:0,   gord:10,   fibra:0},
  {nome:'Vinagre balsâmico',         cat:'🧂 Tempero', kcal:88,  prot:0.5, carb:17,  gord:0,    fibra:0},
  {nome:'Sal refinado',              cat:'🧂 Tempero', kcal:0,   prot:0,   carb:0,   gord:0,    fibra:0},
  {nome:'Açúcar branco',             cat:'🧂 Tempero', kcal:387, prot:0,   carb:100, gord:0,    fibra:0},
  {nome:'Açúcar demerara',           cat:'🧂 Tempero', kcal:380, prot:0,   carb:98,  gord:0,    fibra:0},
  {nome:'Mel de abelha',             cat:'🧂 Tempero', kcal:304, prot:0.3, carb:82,  gord:0,    fibra:0.2},
  {nome:'Adoçante sucralose',        cat:'🧂 Tempero', kcal:0,   prot:0,   carb:0,   gord:0,    fibra:0},
  {nome:'Adoçante stevia',           cat:'🧂 Tempero', kcal:0,   prot:0,   carb:0,   gord:0,    fibra:0},
  {nome:'Canela em pó',              cat:'🧂 Tempero', kcal:247, prot:4,   carb:81,  gord:1.2,  fibra:53.1},
  {nome:'Cacau em pó 100%',          cat:'🧂 Tempero', kcal:228, prot:20,  carb:58,  gord:14,   fibra:33},
  {nome:'Chocolate 70% cacau',       cat:'🧂 Tempero', kcal:598, prot:8,   carb:46,  gord:43,   fibra:10.9},
  {nome:'Molho barbecue',            cat:'🧂 Tempero', kcal:172, prot:1.4, carb:40,  gord:1.2,  fibra:0.6},
  {nome:'Creme de leite light',      cat:'🧂 Tempero', kcal:108, prot:2.8, carb:3.9, gord:9.7,  fibra:0},
  {nome:'Creme de leite integral',   cat:'🧂 Tempero', kcal:204, prot:2.4, carb:3.7, gord:20,   fibra:0},

  // ── PÃES E MASSAS ESPECIAIS ──────────────────────────
  {nome:'Pão sem glúten',            cat:'🌾 Carboidrato', kcal:253, prot:3.5, carb:52,  gord:3.5,  fibra:3},
  {nome:'Pão de banana (fatia)',     cat:'🌾 Carboidrato', kcal:195, prot:3,   carb:38,  gord:4,    fibra:1.5},
  {nome:'Pão de cenoura (fatia)',    cat:'🌾 Carboidrato', kcal:185, prot:5,   carb:36,  gord:3,    fibra:2},
  {nome:'Croissant',                 cat:'🌾 Carboidrato', kcal:406, prot:8.2, carb:45,  gord:21,   fibra:2.1},
  {nome:'Bagel integral',            cat:'🌾 Carboidrato', kcal:245, prot:10,  carb:47,  gord:1.7,  fibra:4.5},

  // ── REFEIÇÕES PRONTAS (ampliado) ─────────────────────
  {nome:'Risoto de frango',          cat:'🍱 Prato pronto', kcal:175, prot:12,  carb:24,  gord:4,    fibra:1},
  {nome:'Feijoada (porção 300g)',    cat:'🍱 Prato pronto', kcal:420, prot:28,  carb:40,  gord:14,   fibra:9},
  {nome:'Moqueca de peixe',          cat:'🍱 Prato pronto', kcal:155, prot:18,  carb:6,   gord:6.5,  fibra:1},
  {nome:'Frango ensopado',           cat:'🍱 Prato pronto', kcal:180, prot:22,  carb:6,   gord:7,    fibra:0.8},
  {nome:'Arroz com feijão (prato)',  cat:'🍱 Prato pronto', kcal:178, prot:7.5, carb:35,  gord:1.5,  fibra:4.5},
  {nome:'Salada grega',              cat:'🍱 Prato pronto', kcal:130, prot:4,   carb:9,   gord:9,    fibra:2.5},
  {nome:'Yakisoba de frango',        cat:'🍱 Prato pronto', kcal:192, prot:12,  carb:28,  gord:4.5,  fibra:2},
  {nome:'Frango grelhado + salada',  cat:'🍱 Prato pronto', kcal:185, prot:30,  carb:8,   gord:4.5,  fibra:2.5},
  {nome:'Sopa de frango c/ macarrão',cat:'🍱 Prato pronto', kcal:125, prot:9,   carb:16,  gord:2.5,  fibra:1.5},
  {nome:'Sopa de lentilha',          cat:'🍱 Prato pronto', kcal:99,  prot:6,   carb:17,  gord:1.5,  fibra:4.5},
  {nome:'Frango desfiado simples',   cat:'🍱 Prato pronto', kcal:165, prot:31,  carb:0,   gord:3.6,  fibra:0},
  {nome:'Patê de atum caseiro',      cat:'🍱 Prato pronto', kcal:148, prot:19,  carb:2,   gord:7,    fibra:0},
  {nome:'Salada de atum c/ grão',    cat:'🍱 Prato pronto', kcal:155, prot:16,  carb:14,  gord:4.5,  fibra:5},
  {nome:'Smoothie bowl proteico',    cat:'🍱 Prato pronto', kcal:280, prot:22,  carb:36,  gord:5,    fibra:4.5},
  {nome:'Mingau de aveia',           cat:'🍱 Prato pronto', kcal:150, prot:5,   carb:27,  gord:3,    fibra:2.5},
  {nome:'Panqueca proteica',         cat:'🍱 Prato pronto', kcal:185, prot:15,  carb:20,  gord:5,    fibra:2},
  {nome:'Iogurte c/ granola e fruta',cat:'🍱 Prato pronto', kcal:195, prot:9,   carb:30,  gord:5,    fibra:2.5},
  {nome:'Fruta com cottage',         cat:'🍱 Prato pronto', kcal:105, prot:8,   carb:14,  gord:2,    fibra:1.8},

  // ── DOCES E SOBREMESAS ───────────────────────────────
  {nome:'Banana com mel',            cat:'🍰 Doce', kcal:120, prot:1.2, carb:31,  gord:0.3,  fibra:2.6},
  {nome:'Mousse de chocolate light', cat:'🍰 Doce', kcal:95,  prot:3.5, carb:14,  gord:3,    fibra:1.2},
  {nome:'Pudim de leite',            cat:'🍰 Doce', kcal:155, prot:4,   carb:22,  gord:6,    fibra:0},
  {nome:'Bolo de cenoura (fatia)',   cat:'🍰 Doce', kcal:295, prot:4.5, carb:45,  gord:11,   fibra:1.5},
  {nome:'Bolo de chocolate (fatia)', cat:'🍰 Doce', kcal:352, prot:5,   carb:52,  gord:15,   fibra:2},
  {nome:'Brownie de chocolate',      cat:'🍰 Doce', kcal:466, prot:6,   carb:60,  gord:24,   fibra:2.5},
  {nome:'Gelatina zero (pronta)',    cat:'🍰 Doce', kcal:8,   prot:1.5, carb:0.3, gord:0,    fibra:0},
  {nome:'Sorvete de creme (bola)',   cat:'🍰 Doce', kcal:207, prot:3.5, carb:24,  gord:11,   fibra:0},
  {nome:'Sorvete de fruta (picolé)', cat:'🍰 Doce', kcal:75,  prot:0.4, carb:18,  gord:0.2,  fibra:0.3},
  {nome:'Brigadeiro (1un = 20g)',    cat:'🍰 Doce', kcal:96,  prot:1.4, carb:14,  gord:4.4,  fibra:0.5},
  {nome:'Tapioca doce c/ banana',    cat:'🍰 Doce', kcal:195, prot:1.5, carb:44,  gord:0.4,  fibra:1.8},
  {nome:'Crepioca doce',             cat:'🍰 Doce', kcal:185, prot:9,   carb:30,  gord:3.5,  fibra:0.8},
  {nome:'Cheesecake (fatia)',        cat:'🍰 Doce', kcal:402, prot:7,   carb:33,  gord:28,   fibra:0.5},
  {nome:'Chocolate ao leite',        cat:'🍰 Doce', kcal:535, prot:8,   carb:59,  gord:30,   fibra:3.4},
  {nome:'Chocolate amargo 85%',      cat:'🍰 Doce', kcal:598, prot:10,  carb:37,  gord:48,   fibra:14},

  // ── FAST FOOD ────────────────────────────────────────
  {nome:'Hambúrguer (fast food)',    cat:'🍔 Fast food', kcal:295, prot:15, carb:28,  gord:13,   fibra:1.5},
  {nome:'Cheeseburger (fast food)',  cat:'🍔 Fast food', kcal:360, prot:18, carb:30,  gord:18,   fibra:1.5},
  {nome:'Fritas (porção média)',     cat:'🍔 Fast food', kcal:380, prot:4,  carb:50,  gord:18,   fibra:4},
  {nome:'Pizza margherita (fatia)',  cat:'🍔 Fast food', kcal:267, prot:11, carb:32,  gord:10,   fibra:2},
  {nome:'Hot dog simples',           cat:'🍔 Fast food', kcal:290, prot:11, carb:28,  gord:15,   fibra:1.5},
  {nome:'Nuggets de frango (6un)',   cat:'🍔 Fast food', kcal:280, prot:14, carb:19,  gord:16,   fibra:0.8},
  {nome:'Sanduíche de peito peru',   cat:'🍔 Fast food', kcal:235, prot:17, carb:29,  gord:5,    fibra:2.5},

  // ── CEREAIS MATINAIS ─────────────────────────────────
  {nome:'Corn flakes (sem açúcar)',  cat:'🌾 Carboidrato', kcal:357, prot:7.5, carb:84,  gord:0.9,  fibra:2.7},
  {nome:'Muesli sem açúcar',        cat:'🌾 Carboidrato', kcal:342, prot:9,   carb:65,  gord:6,    fibra:7.5},
  {nome:'Cereal integral (farelo)',  cat:'🌾 Carboidrato', kcal:257, prot:11,  carb:70,  gord:3,    fibra:27},
  {nome:'Farelo de trigo',           cat:'🌾 Carboidrato', kcal:216, prot:16,  carb:65,  gord:4.3,  fibra:42.8},
  {nome:'Gérmen de trigo',           cat:'🌾 Carboidrato', kcal:360, prot:23,  carb:52,  gord:10,   fibra:13.2},

  // ── PEIXES E FRUTOS DO MAR ESPECIAIS ─────────────────
  {nome:'Salmão defumado',           cat:'🥩 Proteína', kcal:179, prot:25,  carb:0,   gord:8.5,  fibra:0},
  {nome:'Atum fresco grelhado',      cat:'🥩 Proteína', kcal:184, prot:30,  carb:0,   gord:6.3,  fibra:0},
  {nome:'Pargo grelhado',            cat:'🥩 Proteína', kcal:100, prot:21,  carb:0,   gord:1.4,  fibra:0},
  {nome:'Lagosta cozida',            cat:'🥩 Proteína', kcal:98,  prot:21,  carb:1.3, gord:0.6,  fibra:0},
  {nome:'Caranguejo cozido',         cat:'🥩 Proteína', kcal:97,  prot:20,  carb:0,   gord:1.5,  fibra:0},
  {nome:'Cavala grelhada',           cat:'🥩 Proteína', kcal:205, prot:19,  carb:0,   gord:14,   fibra:0},
  {nome:'Robalo grelhado',           cat:'🥩 Proteína', kcal:124, prot:24,  carb:0,   gord:2.6,  fibra:0},
  {nome:'Dourada grelhada',          cat:'🥩 Proteína', kcal:128, prot:26,  carb:0,   gord:2.5,  fibra:0},
  {nome:'Linguado grelhado',         cat:'🥩 Proteína', kcal:91,  prot:19,  carb:0,   gord:1.2,  fibra:0},
  {nome:'Truta grelhada',            cat:'🥩 Proteína', kcal:190, prot:26,  carb:0,   gord:9,    fibra:0},
  {nome:'Peixe merluza cozida',      cat:'🥩 Proteína', kcal:86,  prot:18,  carb:0,   gord:1.4,  fibra:0},

  // ── CARNES ESPECIAIS ─────────────────────────────────
  {nome:'Cordeiro grelhado',         cat:'🥩 Proteína', kcal:258, prot:25,  carb:0,   gord:17,   fibra:0},
  {nome:'Coelho ensopado',           cat:'🥩 Proteína', kcal:197, prot:29,  carb:0,   gord:8.5,  fibra:0},
  {nome:'Pato assado',               cat:'🥩 Proteína', kcal:337, prot:19,  carb:0,   gord:28,   fibra:0},
  {nome:'Avestruz (filé grelhado)',  cat:'🥩 Proteína', kcal:158, prot:29,  carb:0,   gord:3.7,  fibra:0},
  {nome:'Frango marinado limão',     cat:'🥩 Proteína', kcal:172, prot:30,  carb:2,   gord:4.5,  fibra:0},
  {nome:'Bife de frango panado',     cat:'🥩 Proteína', kcal:215, prot:22,  carb:12,  gord:8.5,  fibra:0.5},
  {nome:'Peito de frango empanado',  cat:'🥩 Proteína', kcal:230, prot:24,  carb:13,  gord:8,    fibra:0.8},
  {nome:'Carne suína grelhada',      cat:'🥩 Proteína', kcal:195, prot:27,  carb:0,   gord:9.5,  fibra:0},
  {nome:'Músculo bovino cozido',     cat:'🥩 Proteína', kcal:218, prot:33,  carb:0,   gord:9,    fibra:0},
  {nome:'Fígado bovino cozido',      cat:'🥩 Proteína', kcal:175, prot:27,  carb:5,   gord:5,    fibra:0},
  {nome:'Costela bovina cozida',     cat:'🥩 Proteína', kcal:291, prot:27,  carb:0,   gord:19,   fibra:0},
  {nome:'Contra-filé grelhado',      cat:'🥩 Proteína', kcal:230, prot:27,  carb:0,   gord:13,   fibra:0},
  {nome:'Carne seca cozida',         cat:'🥩 Proteína', kcal:250, prot:43,  carb:0,   gord:8,    fibra:0},
  {nome:'Coração de frango',         cat:'🥩 Proteína', kcal:185, prot:26,  carb:0,   gord:8.5,  fibra:0},
  {nome:'Moela de frango cozida',    cat:'🥩 Proteína', kcal:154, prot:28,  carb:0,   gord:4,    fibra:0},

  // ── SUPLEMENTOS ──────────────────────────────────────
  {nome:'Creatina monohidratada',    cat:'💊 Suplemento', kcal:0,   prot:0,   carb:0,   gord:0,    fibra:0},
  {nome:'BCAA (pó)',                 cat:'💊 Suplemento', kcal:320, prot:80,  carb:0,   gord:0,    fibra:0},
  {nome:'Glutamina (pó)',            cat:'💊 Suplemento', kcal:325, prot:81,  carb:0,   gord:0,    fibra:0},
  {nome:'Maltodextrina',             cat:'💊 Suplemento', kcal:378, prot:0,   carb:94,  gord:0,    fibra:0},
  {nome:'Dextrose',                  cat:'💊 Suplemento', kcal:380, prot:0,   carb:95,  gord:0,    fibra:0},
  {nome:'Whey isolado (pó)',         cat:'💊 Suplemento', kcal:360, prot:90,  carb:2,   gord:1,    fibra:0},
  {nome:'Caseína (pó)',              cat:'💊 Suplemento', kcal:370, prot:80,  carb:8,   gord:4,    fibra:1},
  {nome:'Hipercalórico (pó)',        cat:'💊 Suplemento', kcal:375, prot:15,  carb:71,  gord:4,    fibra:1},
  {nome:'Albumina (pó)',             cat:'💊 Suplemento', kcal:370, prot:87,  carb:1,   gord:0.5,  fibra:0},
  {nome:'Proteína de ervilha (pó)',  cat:'💊 Suplemento', kcal:370, prot:80,  carb:5,   gord:2,    fibra:2},
  {nome:'Barra de proteína (60g)',   cat:'💊 Suplemento', kcal:220, prot:20,  carb:22,  gord:7,    fibra:2},
  {nome:'Shake proteico pronto',     cat:'💊 Suplemento', kcal:160, prot:25,  carb:9,   gord:3,    fibra:1},

  // ── MOLHOS E TEMPEROS ────────────────────────────────
  {nome:'Molho de soja (shoyu)',     cat:'🧂 Tempero', kcal:53,  prot:8,   carb:5,   gord:0,    fibra:0.8},
  {nome:'Molho inglês',             cat:'🧂 Tempero', kcal:78,  prot:1.4, carb:19,  gord:0,    fibra:0},
  {nome:'Molho de tomate caseiro',   cat:'🧂 Tempero', kcal:38,  prot:1.6, carb:8,   gord:0.4,  fibra:1.5},
  {nome:'Ketchup',                   cat:'🧂 Tempero', kcal:112, prot:1.5, carb:27,  gord:0.4,  fibra:0.5},
  {nome:'Mostarda',                  cat:'🧂 Tempero', kcal:66,  prot:4.4, carb:5.3, gord:4,    fibra:3.2},
  {nome:'Maionese tradicional',      cat:'🧂 Tempero', kcal:680, prot:1.3, carb:2.4, gord:75,   fibra:0},
  {nome:'Maionese light',            cat:'🧂 Tempero', kcal:310, prot:1.5, carb:10,  gord:30,   fibra:0},
  {nome:'Vinagre balsâmico',         cat:'🧂 Tempero', kcal:88,  prot:0.5, carb:17,  gord:0,    fibra:0},
  {nome:'Açúcar branco',             cat:'🧂 Tempero', kcal:387, prot:0,   carb:100, gord:0,    fibra:0},
  {nome:'Açúcar demerara',           cat:'🧂 Tempero', kcal:380, prot:0,   carb:98,  gord:0,    fibra:0},
  {nome:'Mel de abelha',             cat:'🧂 Tempero', kcal:304, prot:0.3, carb:82,  gord:0,    fibra:0.2},
  {nome:'Canela em pó',              cat:'🧂 Tempero', kcal:247, prot:4,   carb:81,  gord:1.2,  fibra:53.1},
  {nome:'Cacau em pó 100%',          cat:'🧂 Tempero', kcal:228, prot:20,  carb:58,  gord:14,   fibra:33},
  {nome:'Chocolate 70% cacau',       cat:'🧂 Tempero', kcal:598, prot:8,   carb:46,  gord:43,   fibra:10.9},
  {nome:'Creme de leite light',      cat:'🧂 Tempero', kcal:108, prot:2.8, carb:3.9, gord:9.7,  fibra:0},
  {nome:'Creme de leite integral',   cat:'🧂 Tempero', kcal:204, prot:2.4, carb:3.7, gord:20,   fibra:0},
  {nome:'Molho barbecue',            cat:'🧂 Tempero', kcal:172, prot:1.4, carb:40,  gord:1.2,  fibra:0.6},
  {nome:'Adoçante stevia',           cat:'🧂 Tempero', kcal:0,   prot:0,   carb:0,   gord:0,    fibra:0},

  // ── LEGUMINOSAS ESPECIAIS ────────────────────────────
  {nome:'Feijão azuki cozido',       cat:'🌿 Proteína vegetal', kcal:128, prot:8,   carb:25,  gord:0.1,  fibra:7.3},
  {nome:'Feijão mungo cozido',       cat:'🌿 Proteína vegetal', kcal:105, prot:7,   carb:19,  gord:0.4,  fibra:7.6},
  {nome:'Lentilha preta cozida',     cat:'🌿 Proteína vegetal', kcal:116, prot:9,   carb:20,  gord:0.4,  fibra:8},
  {nome:'Tremoço cozido',            cat:'🌿 Proteína vegetal', kcal:119, prot:16,  carb:10,  gord:2.9,  fibra:4.6},
  {nome:'Natto (soja fermentada)',   cat:'🌿 Proteína vegetal', kcal:211, prot:18,  carb:14,  gord:11,   fibra:5.4},
  {nome:'Miso (pasta de soja)',      cat:'🌿 Proteína vegetal', kcal:199, prot:12,  carb:26,  gord:6,    fibra:5.4},
  {nome:'Soja texturizada seca',     cat:'🌿 Proteína vegetal', kcal:331, prot:52,  carb:34,  gord:1,    fibra:17},
  {nome:'Soja texturizada cozida',   cat:'🌿 Proteína vegetal', kcal:135, prot:17,  carb:14,  gord:1,    fibra:4.5},

  // ── EXTRAS (para completar 500) ───────────────────────
  {nome:'Açafrão (cúrcuma) em pó',  cat:'🧂 Tempero', kcal:312, prot:10,  carb:65,  gord:3.3,  fibra:21},
  {nome:'Páprica em pó',             cat:'🧂 Tempero', kcal:282, prot:14,  carb:54,  gord:13,   fibra:34.9},
  {nome:'Noz-moscada em pó',         cat:'🧂 Tempero', kcal:525, prot:6,   carb:49,  gord:36,   fibra:20.8},
  {nome:'Vinagre de maçã',           cat:'🧂 Tempero', kcal:22,  prot:0,   carb:0.9, gord:0,    fibra:0},
  {nome:'Farinha de coco',           cat:'🌾 Carboidrato', kcal:400, prot:20,  carb:58,  gord:15,   fibra:39},
  {nome:'Polvilho azedo',            cat:'🌾 Carboidrato', kcal:353, prot:0.3, carb:87,  gord:0.1,  fibra:0.9},
  {nome:'Polvilho doce',             cat:'🌾 Carboidrato', kcal:354, prot:0.5, carb:88,  gord:0.1,  fibra:0.9},
  {nome:'Batata chips caseira',      cat:'🌾 Carboidrato', kcal:530, prot:7,   carb:53,  gord:33,   fibra:4.8},
  {nome:'Frango cozido desfiado',    cat:'🥩 Proteína', kcal:154, prot:30,  carb:0,   gord:3.2,  fibra:0},
  {nome:'Peixe-espada grelhado',     cat:'🥩 Proteína', kcal:145, prot:21,  carb:0,   gord:6.5,  fibra:0},
  {nome:'Camarão grelhado (grande)', cat:'🥩 Proteína', kcal:120, prot:24,  carb:1,   gord:2,    fibra:0},
  {nome:'Lula frita (anéis)',        cat:'🥩 Proteína', kcal:175, prot:14,  carb:10,  gord:8,    fibra:0.5},
];

// ── Nutrição — helpers ────────────────────────────────────
function calcNutriente(alimento, gramas, campo){
  return Math.round((alimento[campo] * gramas) / 100 * 10) / 10;
}

// ═══════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════
async function init(){
  if(!ALUNO_ID){ document.body.innerHTML='<div style="color:#fff;padding:2rem;text-align:center">Link inválido.<br>Solicita o teu link ao teu PT.</div>'; return; }

  document.getElementById('loading-screen').style.display='flex';

  // Carregar dados
  aluno           = (await sb(`alunos?id=eq.${ALUNO_ID}`))?.[0] || {};
  const allTreinos= await sb(`treinos?aluno_id=eq.${ALUNO_ID}&order=criado_em.asc`) || [];
  sessoes         = await sb(`sessoes?aluno_id=eq.${ALUNO_ID}&order=data.desc&limit=200`) || [];
  perimetriaHist  = await sb(`perimetria?aluno_id=eq.${ALUNO_ID}&order=data.asc&limit=20`) || [];
  const anamnese  = (await sb(`anamnese?aluno_id=eq.${ALUNO_ID}`))?.[0]?.dados || {};

  // Histórico de cargas (para delta no treino)
  if(sessoes.length){
    const sids=sessoes.map(s=>s.id);
    allCargasHist = await sb(`sessao_cargas?sessao_id=in.(${sids.join(',')})&select=*,sessoes(data)&order=sessoes(data).desc`) || [];
  } else { allCargasHist=[]; }

  // Nutrição — carregar metas e refeições de hoje
  const cfg = (await sb(`configuracoes?aluno_id=eq.${ALUNO_ID}`))?.[0]?.dados || {};
  if(cfg.nutMeta) nutMeta = cfg.nutMeta;
  refeicoes = await sb(`refeicoes?aluno_id=eq.${ALUNO_ID}&data=eq.${todayISO()}&order=criado_em.asc`) || [];

  // Exercícios por treino
  treinos = allTreinos;
  for(const t of treinos){
    exerciciosByTreino[t.id] = await sb(`exercicios?treino_id=eq.${t.id}&order=ordem.asc`) || [];
  }

  // Setup UI
  applyLang();
  setupNav();
  setupSwipe();
  setupWaterDots();

  // Render inicial
  renderTreino();
  renderNutricao();
  renderPerfil();

  document.getElementById('loading-screen').style.display='none';
}

// ═══════════════════════════════════════════════════════════
//  NAVEGAÇÃO
// ═══════════════════════════════════════════════════════════
function setupNav(){
  document.querySelectorAll('.bnav-item').forEach(btn=>{
    btn.addEventListener('click',()=>{ goTo(btn.dataset.screen,'click'); });
  });
}

function goTo(screen, via='click'){
  if(screen===currentScreen) return;
  const from=document.querySelector(`[data-screen="${currentScreen}"]`);
  const to=document.querySelector(`[data-screen="${screen}"]`);
  if(!from||!to) return;
  const idxFrom=SCREENS.indexOf(currentScreen);
  const idxTo=SCREENS.indexOf(screen);
  const dir=idxTo>idxFrom?1:-1;

  if(via==='swipe'){
    from.style.transition='transform .32s cubic-bezier(.4,0,.2,1)';
    to.style.transition='transform .32s cubic-bezier(.4,0,.2,1)';
    to.style.transform=`translateX(${dir*100}%)`;
    to.dataset.state='active';
    requestAnimationFrame(()=>{
      from.style.transform=`translateX(${-dir*100}%)`;
      to.style.transform='translateX(0)';
    });
    setTimeout(()=>{
      from.dataset.state=dir>0?'prev':'next';
      from.style.transform=''; from.style.transition='';
      to.style.transform=''; to.style.transition='';
    },340);
  } else {
    from.style.transition='opacity .22s, transform .22s';
    from.style.opacity='0'; from.style.transform='scale(.97) translateY(8px)';
    setTimeout(()=>{
      from.dataset.state=dir>0?'prev':'next';
      from.style.opacity=''; from.style.transform=''; from.style.transition='';
      to.dataset.state='active';
      to.style.opacity='0'; to.style.transform='scale(1.02) translateY(-6px)';
      to.style.transition='opacity .22s, transform .22s';
      requestAnimationFrame(()=>{ to.style.opacity='1'; to.style.transform='scale(1) translateY(0)'; });
      setTimeout(()=>{ to.style.opacity=''; to.style.transform=''; to.style.transition=''; },240);
    },200);
  }
  currentScreen=screen;
  document.querySelectorAll('.bnav-item').forEach(b=>b.classList.toggle('active',b.dataset.screen===screen));
  if(screen==='evolucao') renderEvolucao();
  if(screen==='nutricao') renderNutricao();
}

function setupSwipe(){
  const wrap=document.getElementById('app-wrap');
  wrap.addEventListener('touchstart',e=>{ swipeStartX=e.touches[0].clientX; swipeStartY=e.touches[0].clientY; isSwiping=false; },{passive:true});
  wrap.addEventListener('touchmove',e=>{
    const dx=e.touches[0].clientX-swipeStartX;
    const dy=e.touches[0].clientY-swipeStartY;
    if(!isSwiping && Math.abs(dx)>10){ isSwiping=Math.abs(dx)>Math.abs(dy); }
  },{passive:true});
  wrap.addEventListener('touchend',e=>{
    if(!isSwiping) return;
    const dx=swipeStartX-e.changedTouches[0].clientX;
    if(Math.abs(dx)<50) return;
    const idx=SCREENS.indexOf(currentScreen);
    if(dx>0 && idx<SCREENS.length-1) goTo(SCREENS[idx+1],'swipe');
    else if(dx<0 && idx>0) goTo(SCREENS[idx-1],'swipe');
    isSwiping=false;
  },{passive:true});
}

// ═══════════════════════════════════════════════════════════
//  TREINO
// ═══════════════════════════════════════════════════════════
function renderTreino(){
  const list=document.getElementById('treino-list');
  if(!treinos.length){ list.innerHTML=`<div class="empty">${T('sem_treinos')}</div>`; return; }
  list.innerHTML=treinos.map(t=>`
    <div class="treino-card ${selectedTreino?.id===t.id?'selected':''}" onclick="selectTreino('${t.id}')">
      <div class="tc-name">${escapeHTML(t.nome)}</div>
      <div class="tc-meta">${(exerciciosByTreino[t.id]||[]).length} exercícios</div>
    </div>`).join('');
  if(selectedTreino) renderExercicios();
}

function selectTreino(id){
  selectedTreino=treinos.find(t=>t.id===id)||null;
  cargas={}; markedSets={};
  // Pré-preencher com última carga conhecida
  const exs=exerciciosByTreino[selectedTreino?.id]||[];
  exs.forEach(ex=>{
    const last=lastCargaFor(ex.id);
    if(last!=null) cargas[ex.id]=last;
  });
  renderTreino();
}

function lastCargaFor(exId){
  if(!allCargasHist) return null;
  const r=allCargasHist.find(c=>c.exercicio_id===exId);
  return r ? r.carga_kg : null;
}

function renderExercicios(){
  const exs=exerciciosByTreino[selectedTreino.id]||[];
  const wrap=document.getElementById('exercicios-wrap');
  if(!wrap) return;
  if(!exs.length){ wrap.innerHTML=`<div class="empty">${T('sem_ex')}</div>`; return; }

  const totalSets=exs.reduce((a,e)=>a+(parseInt(e.series)||3),0);
  const doneSets=Object.values(markedSets).reduce((a,v)=>a+(v||0),0);
  const pct=totalSets?Math.round(doneSets/totalSets*100):0;

  // Ring
  const DA=339.29, offset=DA-(DA*pct/100);
  document.getElementById('ring-progress').style.strokeDashoffset=offset;
  document.getElementById('ring-pct').textContent=pct+'%';
  document.getElementById('ring-label').textContent=T('ring-sub');

  wrap.innerHTML=exs.map(ex=>{
    const sets=parseInt(ex.series)||3;
    const marked=markedSets[ex.id]||0;
    const carga=cargas[ex.id]??'';
    const last=lastCargaFor(ex.id);
    const delta=last!=null&&carga!==''?(parseFloat(carga)-last).toFixed(1):null;
    const deltaHtml=delta!=null?`<span class="delta ${parseFloat(delta)>0?'up':parseFloat(delta)<0?'down':'eq'}">${parseFloat(delta)>0?'+':''}${delta}kg</span>`:'';
    const lastHtml=last!=null?`<span class="last-carga">${T('mantem')}: ${last}kg</span>`:'';
    return `<div class="ex-card ${marked>=sets?'done':''}">
      <div class="ex-top">
        <div class="ex-name">${escapeHTML(ex.nome)}</div>
        <div class="ex-meta">${ex.series}×${ex.reps}</div>
      </div>
      ${ex.obs?`<div class="ex-obs">${escapeHTML(ex.obs)}</div>`:''}
      <div class="ex-bottom">
        <div class="carga-row">
          <button class="carga-btn minus" onclick="adjCarga('${ex.id}',-2.5)">−</button>
          <input class="carga-input" type="number" step="0.5" value="${carga}" placeholder="kg"
            oninput="cargas['${ex.id}']=this.value===''?'':parseFloat(this.value)||0;renderExercicios()">
          <button class="carga-btn plus" onclick="adjCarga('${ex.id}',2.5)">+</button>
          ${deltaHtml}${lastHtml}
        </div>
        <div class="sets-row">
          ${Array.from({length:sets},(_,i)=>`
            <button class="set-dot ${i<marked?'on':''}" onclick="markSet('${ex.id}',${sets},${i})"></button>
          `).join('')}
        </div>
      </div>
    </div>`;
  }).join('');

  // Botão de registo
  const btn=document.getElementById('reg-btn');
  if(btn){
    const allDone=exs.every(e=>(markedSets[e.id]||0)>=(parseInt(e.series)||3));
    btn.textContent=allDone?T('reg_complete'):pct>0?T('reg_partial').replace('PCT',pct):T('reg_default');
    btn.disabled=pct===0;
  }
}

function adjCarga(exId, delta){
  const cur=parseFloat(cargas[exId])||0;
  cargas[exId]=Math.max(0,Math.round((cur+delta)*2)/2);
  const inp=document.querySelector(`[data-exid="${exId}"] .carga-input`);
  if(inp) inp.value=cargas[exId];
  renderExercicios();
}

function markSet(exId, total, idx){
  const cur=markedSets[exId]||0;
  markedSets[exId]=(cur===idx+1)?idx:idx+1;
  renderExercicios();
}

async function registarSessao(){
  const btn=document.getElementById('reg-btn');
  if(!btn||btn.disabled) return;
  btn.textContent=T('reg_saving'); btn.disabled=true;

  const sessao=await sb('sessoes','POST',{aluno_id:ALUNO_ID,treino_id:selectedTreino.id,treino_nome:selectedTreino.nome,data:todayISO()});
  if(sessao?.[0]){
    const sid=sessao[0].id;
    const exs=exerciciosByTreino[selectedTreino.id]||[];
    for(const ex of exs){
      if(cargas[ex.id]!==undefined && cargas[ex.id]!==''){
        await sb('sessao_cargas','POST',{sessao_id:sid,exercicio_id:ex.id,carga_kg:parseFloat(cargas[ex.id])||0});
      }
    }
    // Actualizar histórico local
    sessoes.unshift({id:sid,treino_id:selectedTreino.id,treino_nome:selectedTreino.nome,data:todayISO()});
    if(allCargasHist===null) allCargasHist=[];
    exs.forEach(ex=>{
      if(cargas[ex.id]!==undefined && cargas[ex.id]!==''){
        allCargasHist.unshift({sessao_id:sid,exercicio_id:ex.id,carga_kg:parseFloat(cargas[ex.id])||0,sessoes:{data:todayISO()}});
      }
    });
  }
  markedSets={}; cargas={};
  showToast(T('sucesso'));
  btn.textContent=T('reg_default'); btn.disabled=false;
}

// ═══════════════════════════════════════════════════════════
//  EVOLUÇÃO
// ═══════════════════════════════════════════════════════════
function renderEvolucao(){
  // KPIs
  const last90=sessoes.filter(s=>{ const d=new Date(s.data); return (new Date()-d)/(1000*86400)<=90; });
  document.getElementById('kpi-sessoes').textContent=last90.length;

  // Streak
  let streak=0, prev=null;
  [...new Set(sessoes.map(s=>s.data))].sort((a,b)=>b.localeCompare(a)).forEach(d=>{
    if(!prev){ prev=d; streak=1; return; }
    const diff=(new Date(prev)-new Date(d))/86400000;
    if(diff<=1){ streak++; prev=d; } else prev=null;
  });
  document.getElementById('kpi-streak').textContent=streak;

  // Volume
  const vol=allCargasHist?.filter(c=>{ const s=sessoes.find(x=>x.id===c.sessao_id); return s&&(new Date()-new Date(s.data))/86400000<=90; })
    .reduce((a,c)=>a+(c.carga_kg||0),0)||0;
  document.getElementById('kpi-volume').textContent=Math.round(vol/1000*10)/10+'t';

  // Selector de exercícios
  const allExs={};
  Object.values(exerciciosByTreino).flat().forEach(e=>{ allExs[e.id]=e.nome; });
  const sel=document.getElementById('ex-selector');
  if(sel && sel.options.length<=1){
    sel.innerHTML=`<option value="">${T('sel_ex')}</option>`+Object.entries(allExs).map(([id,n])=>`<option value="${id}">${escapeHTML(n)}</option>`).join('');
    sel.onchange=()=>renderChart(sel.value);
  }

  // Composição corporal
  if(perimetriaHist.length){
    const last=perimetriaHist[perimetriaHist.length-1];
    const prev2=perimetriaHist[perimetriaHist.length-2];
    document.getElementById('cmp-peso').textContent=(last.peso||'—')+'kg';
    document.getElementById('cmp-gord').textContent=(last.gordura||'—')+'%';
    document.getElementById('cmp-massa').textContent=(last.massa_magra||'—')+'kg';
    if(prev2){
      const dp=(last.peso-prev2.peso).toFixed(1);
      const dg=(last.gordura-prev2.gordura).toFixed(1);
      document.getElementById('cmp-peso-d').textContent=(dp>0?'+':'')+dp+'kg';
      document.getElementById('cmp-gord-d').textContent=(dg>0?'+':'')+dg+'%';
    }
  }

  // Heat map
  renderHeatMap();
  // PRs
  renderPRs();
}

function renderChart(exId){
  if(!exId||!allCargasHist) return;
  const pts=allCargasHist.filter(c=>c.exercicio_id===exId&&c.sessoes?.data).map(c=>({d:c.sessoes.data,v:c.carga_kg})).sort((a,b)=>a.d.localeCompare(b.d));
  if(!pts.length) return;
  const svg=document.getElementById('evo-svg');
  if(!svg) return;
  const W=320,H=140,PAD=10;
  const vals=pts.map(p=>p.v);
  const mn=Math.min(...vals), mx=Math.max(...vals)||1;
  const x=i=>PAD+(W-2*PAD)*i/(pts.length-1||1);
  const y=v=>H-PAD-(H-2*PAD)*(v-mn)/(mx-mn||1);
  const pts2=pts.map((p,i)=>`${x(i)},${y(p.v)}`).join(' ');
  document.getElementById('chart-line').setAttribute('d',`M${pts2.replace(/ /g,' L')}`);
  document.getElementById('chart-area').setAttribute('d',`M${pts2.replace(/ /g,' L')} L${x(pts.length-1)},${H} L${x(0)},${H} Z`);
  // Dots
  document.getElementById('chart-dots').innerHTML=pts.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.v)}" r="4" fill="var(--gold)"/>`).join('');
  // X-axis labels
  const ax=document.getElementById('x-axis');
  if(ax) ax.innerHTML=pts.filter((_,i)=>i===0||i===pts.length-1).map((p,i)=>`<span style="left:${i===0?'0':'auto'};right:${i===0?'auto':'0'}">${p.d.slice(5)}</span>`).join('');
  document.getElementById('chart-line').style.strokeDashoffset='0';
}

function renderHeatMap(){
  const grid=document.getElementById('heat-grid');
  if(!grid) return;
  const today=new Date(); const dayMs=86400000;
  const daysSet=new Set(sessoes.map(s=>s.data));
  let html='';
  for(let w=12;w>=0;w--){
    for(let d=0;d<=6;d++){
      const dt=new Date(today.getTime()-(w*7+d)*dayMs);
      const iso=dt.toISOString().slice(0,10);
      const has=daysSet.has(iso);
      html+=`<div class="heat-cell ${has?'l4':''}"></div>`;
    }
  }
  grid.innerHTML=html;
}

function renderPRs(){
  const list=document.getElementById('pr-list');
  if(!list||!allCargasHist) return;
  const prs={};
  allCargasHist.forEach(c=>{
    if(!prs[c.exercicio_id]||c.carga_kg>prs[c.exercicio_id]) prs[c.exercicio_id]=c.carga_kg;
  });
  const allExs={};
  Object.values(exerciciosByTreino).flat().forEach(e=>{ allExs[e.id]=e.nome; });
  const items=Object.entries(prs).map(([id,v])=>({nome:allExs[id]||id,v})).sort((a,b)=>b.v-a.v).slice(0,10);
  if(!items.length){ list.innerHTML=`<div class="empty">${T('evo_no_pr')}</div>`; return; }
  list.innerHTML=items.map(p=>`<div class="pr-item"><span class="pr-nome">${escapeHTML(p.nome)}</span><span class="pr-val">${p.v}kg <em>${T('recorde')}</em></span></div>`).join('');
}

// ═══════════════════════════════════════════════════════════
//  NUTRIÇÃO — Food Tracker com base de dados local
// ═══════════════════════════════════════════════════════════
let nutSearchTerm='', nutSearchResults=[], nutSelectedFood=null, nutQty=100;

function renderNutricao(){
  // Totais do dia
  const totais=calcTotaisDia();
  const pct=Math.min(100,Math.round(totais.kcal/nutMeta.kcal*100));

  // Anel kcal
  const DA=264;
  const ring=document.getElementById('n-ring-progress');
  if(ring) ring.style.strokeDashoffset=DA-(DA*pct/100);
  const nkcal=document.getElementById('n-kcal');
  if(nkcal) nkcal.textContent=Math.round(totais.kcal);
  const nmeta=document.getElementById('n-kcal-meta');
  if(nmeta) nmeta.textContent=nutMeta.kcal.toLocaleString();
  const npct=document.getElementById('n-pct');
  if(npct) npct.textContent=pct+'%';

  // Macros rings
  renderMacroRing('prot', totais.prot, nutMeta.prot);
  renderMacroRing('carb', totais.carb, nutMeta.carb);
  renderMacroRing('gord', totais.gord, nutMeta.gord);

  // Lista de refeições
  const ml=document.getElementById('meal-list');
  if(ml){
    if(!refeicoes.length){
      ml.innerHTML=`<div class="empty">${T('n_no_meal')}</div>`;
    } else {
      ml.innerHTML=refeicoes.map((r,i)=>{
        const d=r.dados||{};
        return `<div class="meal-item">
          <div class="meal-info">
            <div class="meal-nome">${escapeHTML(d.nome||'—')}</div>
            <div class="meal-meta">${d.gramas||0}g · ${Math.round(d.kcal||0)} kcal · P:${Math.round(d.prot||0)}g C:${Math.round(d.carb||0)}g G:${Math.round(d.gord||0)}g</div>
          </div>
          <button class="meal-del" onclick="deletarRefeicao(${i})">✕</button>
        </div>`;
      }).join('');
    }
  }
}

function renderMacroRing(key, val, meta){
  const pct=Math.min(100,Math.round(val/meta*100));
  const DA=138; // r=22 → 2π×22≈138
  const ring=document.getElementById(`n-ring-${key}`);
  if(ring) ring.style.strokeDashoffset=DA-(DA*pct/100);
  const vEl=document.getElementById(`n-val-${key}`);
  if(vEl) vEl.textContent=Math.round(val)+'g';
  const pEl=document.getElementById(`n-pct-${key}`);
  if(pEl) pEl.textContent=pct+'%';
}

function calcTotaisDia(){
  return refeicoes.reduce((acc,r)=>{
    const d=r.dados||{};
    acc.kcal+=(d.kcal||0);
    acc.prot+=(d.prot||0);
    acc.carb+=(d.carb||0);
    acc.gord+=(d.gord||0);
    return acc;
  },{kcal:0,prot:0,carb:0,gord:0});
}

// Modal de adicionar refeição
function abrirModalNutricao(){
  nutSearchTerm=''; nutSearchResults=[]; nutSelectedFood=null; nutQty=100;
  const m=document.getElementById('nut-modal');
  if(m){ m.classList.add('open'); renderNutModal(); }
}

function fecharModalNutricao(){
  const m=document.getElementById('nut-modal');
  if(m) m.classList.remove('open');
}

function renderNutModal(){
  // Pesquisa
  const inp=document.getElementById('nut-search-inp');
  if(inp && inp.value!==nutSearchTerm) inp.value=nutSearchTerm;

  // Resultados
  const resList=document.getElementById('nut-search-results');
  if(resList){
    if(nutSelectedFood){
      resList.style.display='none';
    } else {
      resList.style.display='block';
      const filtered=ALIMENTOS_DB.filter(a=>
        a.nome.toLowerCase().includes(nutSearchTerm.toLowerCase()) ||
        a.cat.toLowerCase().includes(nutSearchTerm.toLowerCase())
      ).slice(0,30);

      if(!nutSearchTerm){
        // Mostrar categorias
        const cats=[...new Set(ALIMENTOS_DB.map(a=>a.cat))];
        resList.innerHTML=cats.map(c=>`
          <div class="nut-cat-header" onclick="nutSearchCat('${c}')">${c}</div>
        `).join('');
      } else {
        resList.innerHTML=filtered.length
          ? filtered.map(a=>`<div class="nut-food-item" onclick="nutSelectFood('${escapeHTML(a.nome)}')">${escapeHTML(a.nome)} <span>${a.kcal} kcal/100g</span></div>`).join('')
          : `<div class="nut-empty">Nenhum alimento encontrado.</div>`;
      }
    }
  }

  // Detalhe do alimento selecionado
  const det=document.getElementById('nut-detail');
  if(det){
    if(!nutSelectedFood){ det.style.display='none'; return; }
    det.style.display='block';
    const f=nutSelectedFood;
    const g=nutQty;
    det.innerHTML=`
      <div class="nut-food-title">${escapeHTML(f.nome)}</div>
      <div class="nut-qty-row">
        <button class="carga-btn minus" onclick="nutAdjQty(-10)">−10g</button>
        <input class="nut-qty-inp" type="number" value="${g}" min="1" max="2000"
          oninput="nutQty=parseInt(this.value)||0;renderNutModal()">
        <button class="carga-btn plus" onclick="nutAdjQty(10)">+10g</button>
        <span class="nut-g-label">g</span>
      </div>
      <div class="nut-macros-preview">
        <div class="nmp"><span>${Math.round(calcNutriente(f,g,'kcal'))}</span><em>kcal</em></div>
        <div class="nmp"><span>${Math.round(calcNutriente(f,g,'prot')*10)/10}</span><em>Prot</em></div>
        <div class="nmp"><span>${Math.round(calcNutriente(f,g,'carb')*10)/10}</span><em>Carb</em></div>
        <div class="nmp"><span>${Math.round(calcNutriente(f,g,'gord')*10)/10}</span><em>Gord</em></div>
        <div class="nmp"><span>${Math.round(calcNutriente(f,g,'fibra')*10)/10}</span><em>Fibra</em></div>
      </div>
      <div class="nut-actions">
        <button class="btn-sec" onclick="nutSelectedFood=null;renderNutModal()">← Voltar</button>
        <button class="btn-pri" onclick="nutAdicionarRefeicao()">Adicionar</button>
      </div>`;
  }
}

function nutSearchCat(cat){
  nutSearchTerm=cat;
  const inp=document.getElementById('nut-search-inp');
  if(inp) inp.value=cat;
  renderNutModal();
}

function nutSelectFood(nome){
  nutSelectedFood=ALIMENTOS_DB.find(a=>a.nome===nome)||null;
  nutQty=100;
  renderNutModal();
}

function nutAdjQty(delta){
  nutQty=Math.max(1,nutQty+delta);
  const inp=document.getElementById('nut-qty-inp');
  if(inp) inp.value=nutQty;
  renderNutModal();
}

async function nutAdicionarRefeicao(){
  if(!nutSelectedFood||nutQty<=0) return;
  const f=nutSelectedFood; const g=nutQty;
  const dados={
    nome:`${f.nome} (${g}g)`,
    gramas:g,
    kcal:calcNutriente(f,g,'kcal'),
    prot:calcNutriente(f,g,'prot'),
    carb:calcNutriente(f,g,'carb'),
    gord:calcNutriente(f,g,'gord'),
    fibra:calcNutriente(f,g,'fibra')
  };
  const res=await sb('refeicoes','POST',{aluno_id:ALUNO_ID,data:todayISO(),dados});
  if(res?.[0]){
    refeicoes.push(res[0]);
    showToast('✓ Adicionado');
  } else {
    // Fallback offline
    refeicoes.push({id:'local_'+Date.now(),dados,data:todayISO()});
    showToast('✓ Adicionado (local)');
  }
  fecharModalNutricao();
  renderNutricao();
}

async function deletarRefeicao(idx){
  const r=refeicoes[idx];
  if(!r) return;
  if(r.id && !r.id.toString().startsWith('local_')){
    await sb(`refeicoes?id=eq.${r.id}`,'DELETE');
  }
  refeicoes.splice(idx,1);
  renderNutricao();
}

function nutOnSearch(val){
  nutSearchTerm=val;
  nutSelectedFood=null;
  renderNutModal();
}

// ═══════════════════════════════════════════════════════════
//  PERFIL
// ═══════════════════════════════════════════════════════════
function renderPerfil(){
  // Nome e avatar
  const nm=document.getElementById('pf-nome');
  if(nm) nm.textContent=aluno.nome||'Aluno';
  const av=document.getElementById('pf-avatar');
  if(av) av.textContent=(aluno.nome||'A').charAt(0).toUpperCase();

  // Biometria
  if(perimetriaHist.length){
    const last=perimetriaHist[perimetriaHist.length-1];
    const bp=document.getElementById('pf-bio-peso');
    if(bp) bp.textContent=(last.peso||'—')+'kg';
    const bg=document.getElementById('pf-bio-gord');
    if(bg) bg.textContent=(last.gordura||'—')+'%';
    const bm=document.getElementById('pf-bio-massa');
    if(bm) bm.textContent=(last.massa_magra||'—')+'kg';
  }

  // Streak para nível
  const streakEl=document.getElementById('pf-streak');
  const streak=calcStreak();
  if(streakEl) streakEl.textContent=streak+' '+T('streak_days');

  // Orientações
  const orient=document.getElementById('pf-orient-list');
  if(orient){
    const defs=T('orient_default');
    orient.innerHTML=defs.map(([t,d])=>`
      <div class="orient-item">
        <div class="orient-title">${t}</div>
        <div class="orient-desc">${d}</div>
      </div>`).join('');
  }

  // Contacto PT
  const ptTel=aluno.telefone||'';
  const msgBtn=document.getElementById('pt-msg-btn');
  const callBtn=document.getElementById('pt-call-btn');
  if(msgBtn) msgBtn.onclick=()=>{ if(ptTel) window.open(`https://wa.me/${ptTel.replace(/\D/g,'')}?text=Olá!`,'_blank'); };
  if(callBtn) callBtn.onclick=()=>{ if(ptTel) window.open(`tel:${ptTel}`,'_blank'); };
}

function calcStreak(){
  let streak=0, prev=null;
  [...new Set(sessoes.map(s=>s.data))].sort((a,b)=>b.localeCompare(a)).forEach(d=>{
    if(streak>0&&!prev) return;
    if(!prev){ prev=d; streak=1; return; }
    const diff=(new Date(prev)-new Date(d))/86400000;
    if(diff<=1){ streak++; prev=d; } else prev=null;
  });
  return streak;
}

// ═══════════════════════════════════════════════════════════
//  LANG / ÁGUA / TOAST
// ═══════════════════════════════════════════════════════════
function setLang(l){
  LANG=l; sc('lang',l);
  applyLang();
  renderNutricao(); renderPerfil();
}

function applyLang(){
  LANG=lc('lang','pt');
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.dataset.i18n, v=T(k);
    if(typeof v==='string') el.innerHTML=v;
  });
  document.querySelectorAll('.lang-toggle [data-lang]').forEach(s=>
    s.classList.toggle('on',s.dataset.lang===LANG));
}

function setupWaterDots(){
  const today=todayISO();
  const stored=lc('water_'+today,0);
  const dots=document.querySelectorAll('#water-dots .water-dot');
  dots.forEach((d,i)=>d.classList.toggle('on',i<stored));
  document.getElementById('water-count').textContent=stored;
  document.getElementById('water-dots').addEventListener('click',ev=>{
    const d=ev.target.closest('.water-dot'); if(!d) return;
    const idx=[...dots].indexOf(d);
    const wasOn=d.classList.contains('on');
    const target=wasOn?idx:(idx+1);
    dots.forEach((dd,i)=>dd.classList.toggle('on',i<target));
    document.getElementById('water-count').textContent=target;
    sc('water_'+today,target);
  });
}

function showToast(msg){
  const t=document.getElementById('toast');
  if(!t) return;
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2800);
}

// ── boot ─────────────────────────────────────────────────
init();
