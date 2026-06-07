// Mock data for the prototype — kept lean.

const DATA = {
  aluno: {
    nome: 'Mariana Costa',
    nivel: 7,
    xp: 1840,
    xpMax: 2400,
    streak: 14,
    sessoesTotais: 96,
    semanasAtivas: 22,
    diasTreinoSemana: 4,
    proxBadge: 'Centenário · 100 sessões',
  },
  treinos: [
    { id: 'A', dia: 'SEGUNDA', nome: 'Peito + Tríceps', cor: 'var(--accent)', ex: [
      { id: 1, nome: 'Supino reto barra', series: 4, reps: '6–8', carga: 60, last: 57.5, obs: 'Acelerar a fase concêntrica.' },
      { id: 2, nome: 'Supino inclinado halteres', series: 3, reps: '8–10', carga: 22, last: 20, obs: '' },
      { id: 3, nome: 'Crucifixo máquina', series: 3, reps: '12', carga: 35, last: 32, obs: 'Cadência 3-1-2.' },
      { id: 4, nome: 'Tríceps polia corda', series: 4, reps: '10–12', carga: 24, last: 22, obs: '' },
      { id: 5, nome: 'Tríceps francês', series: 3, reps: '10', carga: 14, last: 14, obs: '' },
    ]},
    { id: 'B', dia: 'QUARTA', nome: 'Costas + Bíceps', cor: 'var(--accent-2)', ex: [
      { id: 6, nome: 'Puxada alta pega aberta', series: 4, reps: '8', carga: 50, last: 47.5, obs: '' },
      { id: 7, nome: 'Remada baixa neutra', series: 4, reps: '10', carga: 55, last: 52.5, obs: '' },
      { id: 8, nome: 'Pull-over polia', series: 3, reps: '12', carga: 30, last: 28, obs: '' },
      { id: 9, nome: 'Rosca alternada', series: 3, reps: '10', carga: 14, last: 14, obs: '' },
    ]},
    { id: 'C', dia: 'SEXTA', nome: 'Pernas + Glúteo', cor: 'var(--accent-3)', ex: [
      { id: 10, nome: 'Agachamento livre', series: 5, reps: '5', carga: 80, last: 75, obs: 'Mantém o tronco firme.' },
      { id: 11, nome: 'Leg press 45°', series: 4, reps: '10', carga: 180, last: 170, obs: '' },
      { id: 12, nome: 'Cadeira extensora', series: 3, reps: '12', carga: 55, last: 50, obs: '' },
      { id: 13, nome: 'Stiff', series: 4, reps: '8', carga: 60, last: 57.5, obs: '' },
      { id: 14, nome: 'Panturrilha em pé', series: 4, reps: '15', carga: 70, last: 70, obs: '' },
    ]},
  ],
  evolucao: {
    pesoHist: [72.4, 72.0, 71.7, 71.5, 71.2, 70.8, 70.5, 70.2, 69.9, 69.6, 69.4, 69.1],
    cargaHist: { 'Supino reto barra': [45, 47.5, 50, 50, 52.5, 55, 55, 57.5, 60],
                 'Agachamento livre':  [55, 60, 62.5, 65, 70, 72.5, 75, 75, 80] },
    medidas: { cintura: [82, 80, 78.5, 77], peito: [92, 93, 94, 95], coxa: [54, 55, 56, 57] },
  },
  refeicoes: [
    { hora: '07:30', nome: 'Pequeno-almoço', kcal: 480, p: 32, c: 56, g: 14, items: ['Aveia 60g', 'Iogurte natural', 'Banana', '1 colher manteiga amendoim'] },
    { hora: '11:00', nome: 'Snack', kcal: 220, p: 18, c: 22, g: 8, items: ['Whey 30g', 'Maçã'] },
    { hora: '13:30', nome: 'Almoço', kcal: 720, p: 48, c: 70, g: 22, items: ['Peito frango 180g', 'Arroz integral 130g', 'Salada folhas', 'Azeite 1 colher'] },
    { hora: '17:00', nome: 'Snack pré-treino', kcal: 240, p: 14, c: 38, g: 4, items: ['Pão integral 2 fatias', 'Atum 80g'] },
    { hora: '20:30', nome: 'Jantar', kcal: 580, p: 42, c: 38, g: 24, items: ['Salmão 160g', 'Batata-doce 200g', 'Brócolos'] },
  ],
  macros: { kcalAlvo: 2200, kcal: 2240, pAlvo: 160, p: 154, cAlvo: 240, c: 224, gAlvo: 75, g: 72 },

  // Admin
  alunos: [
    { nome: 'Mariana Costa',   plano: 'Hipertrofia',   ativo: true,  hue: 30,  ultima: 'Hoje',    aderencia: 92 },
    { nome: 'André Pereira',   plano: 'Recomposição',  ativo: true,  hue: 220, ultima: 'Ontem',   aderencia: 78 },
    { nome: 'Sofia Ribeiro',   plano: 'Definição',     ativo: true,  hue: 320, ultima: '2d',      aderencia: 84 },
    { nome: 'Tiago Mendes',    plano: 'Força máxima',  ativo: true,  hue: 150, ultima: 'Hoje',    aderencia: 96 },
    { nome: 'Beatriz Lopes',   plano: 'Reabilitação',  ativo: true,  hue: 60,  ultima: '3d',      aderencia: 62 },
    { nome: 'Hugo Carvalho',   plano: 'Performance',   ativo: false, hue: 280, ultima: '12d',     aderencia: 28 },
    { nome: 'Inês Santos',     plano: 'Hipertrofia',   ativo: true,  hue: 200, ultima: 'Ontem',   aderencia: 88 },
    { nome: 'Rui Antunes',     plano: 'Iniciante',     ativo: true,  hue: 100, ultima: 'Hoje',    aderencia: 71 },
  ],
  dashboard: {
    ativos: 14,
    total: 17,
    sessoesSemana: 38,
    sessoesAnt: 31,
    feedbacksNovos: 6,
    receita: 1499.40,
    receitaAnt: 1399.20,
  },
  atividade: [
    { aluno: 'Mariana Costa', acao: 'completou Treino A', tempo: 'há 14 min', hue: 30 },
    { aluno: 'Tiago Mendes',  acao: 'enviou feedback ★★★★★', tempo: 'há 32 min', hue: 150 },
    { aluno: 'Sofia Ribeiro', acao: 'subiu carga · Agachamento +2.5kg', tempo: 'há 1 h', hue: 320 },
    { aluno: 'Inês Santos',   acao: 'registou pesagem · -0.4 kg', tempo: 'há 2 h', hue: 200 },
    { aluno: 'André Pereira', acao: 'sessão B concluída', tempo: 'há 4 h', hue: 220 },
  ],
  perimetros: ['Cintura', 'Peito', 'Coxa D', 'Coxa E', 'Braço D', 'Braço E', 'Quadril', 'Panturrilha'],
};

window.DATA = DATA;
