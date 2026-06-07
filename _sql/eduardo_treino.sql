-- ============================================================
-- PERSONAL TRAINER WEBAPP — SUPABASE / POSTGRESQL
-- Schema + Dados iniciais
-- Criado em: Maio 2025
-- ============================================================


-- ============================================================
-- 1. TABELA: ALUNOS
-- ============================================================

CREATE TABLE IF NOT EXISTS alunos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  idade INTEGER,
  sexo TEXT,
  altura_cm NUMERIC(5,2),
  peso_kg NUMERIC(5,2),
  profissao TEXT,
  nivel_atividade_diaria TEXT,
  objetivo_principal TEXT,
  objetivo_secundario TEXT,
  nivel_experiencia TEXT,
  dias_treino_semana INTEGER,
  historico_treino TEXT,
  lesoes TEXT,
  condicoes_saude TEXT,
  qualidade_sono TEXT,
  nivel_estresse TEXT,
  qualidade_alimentacao TEXT,
  consome_alcool TEXT,
  fuma TEXT,
  refeicoes_por_dia INTEGER,
  consome_agua_litros NUMERIC(4,1),
  tempo_sessao_minutos INTEGER,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 2. TABELA: AVALIACOES (Composição Corporal)
-- ============================================================

CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  data_avaliacao DATE NOT NULL,
  peso_kg NUMERIC(5,2),
  imc NUMERIC(4,1),
  percentual_gordura NUMERIC(4,1),
  gordura_kg NUMERIC(5,2),
  massa_magra_kg NUMERIC(5,2),
  gordura_visceral INTEGER,
  tmb_kcal INTEGER,
  -- Perímetros (cm)
  perimetro_ombro NUMERIC(5,1),
  perimetro_cintura NUMERIC(5,1),
  perimetro_quadril NUMERIC(5,1),
  perimetro_peito NUMERIC(5,1),
  perimetro_abdomen NUMERIC(5,1),
  perimetro_braco_esq NUMERIC(5,1),
  perimetro_braco_dir NUMERIC(5,1),
  perimetro_braco_flex_esq NUMERIC(5,1),
  perimetro_braco_flex_dir NUMERIC(5,1),
  perimetro_coxa_esq NUMERIC(5,1),
  perimetro_coxa_dir NUMERIC(5,1),
  perimetro_panturrilha_esq NUMERIC(5,1),
  perimetro_panturrilha_dir NUMERIC(5,1),
  perimetro_antebraco_esq NUMERIC(5,1),
  perimetro_antebraco_dir NUMERIC(5,1),
  -- Testes físicos
  teste_flexao INTEGER,
  teste_abdominal INTEGER,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 3. TABELA: PLANOS DE TREINO
-- ============================================================

CREATE TABLE IF NOT EXISTS planos_treino (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  objetivo TEXT,
  divisao TEXT,
  fase TEXT,
  data_inicio DATE,
  data_fim DATE,
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 4. TABELA: SESSÕES DE TREINO
-- ============================================================

CREATE TABLE IF NOT EXISTS sessoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_id UUID REFERENCES planos_treino(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  dia_semana TEXT,
  grupos_musculares TEXT,
  aquecimento TEXT,
  finalizador TEXT,
  observacoes TEXT,
  ordem INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 5. TABELA: EXERCÍCIOS DAS SESSÕES
-- ============================================================

CREATE TABLE IF NOT EXISTS exercicios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sessao_id UUID REFERENCES sessoes(id) ON DELETE CASCADE,
  ordem INTEGER,
  nome TEXT NOT NULL,
  series INTEGER,
  repeticoes_min INTEGER,
  repeticoes_max INTEGER,
  rir INTEGER,
  descanso_segundos INTEGER,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 6. TABELA: MEDIDAS PERIÓDICAS (Reavaliações)
-- ============================================================

CREATE TABLE IF NOT EXISTS reavaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  avaliacao_id UUID REFERENCES avaliacoes(id),
  data_reavaliacao DATE NOT NULL,
  peso_kg NUMERIC(5,2),
  percentual_gordura NUMERIC(4,1),
  massa_magra_kg NUMERIC(5,2),
  gordura_visceral INTEGER,
  mudanca_visual TEXT,
  aumento_forca TEXT,
  melhora_execucao TEXT,
  melhora_condicionamento TEXT,
  adesao_treino TEXT,
  adesao_dieta TEXT,
  qualidade_sono TEXT,
  nivel_fadiga TEXT,
  dores_articulares TEXT,
  feedback_aluno TEXT,
  resultado_geral TEXT,
  ajustes_necessarios TEXT,
  proxima_fase TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- INSERÇÃO DOS DADOS — EDUARDO
-- ============================================================

-- 1. ALUNO
INSERT INTO alunos (
  nome, idade, sexo, altura_cm, peso_kg,
  profissao, nivel_atividade_diaria,
  objetivo_principal, objetivo_secundario,
  nivel_experiencia, dias_treino_semana,
  historico_treino, lesoes,
  qualidade_sono, nivel_estresse,
  qualidade_alimentacao, consome_alcool, fuma,
  refeicoes_por_dia, consome_agua_litros,
  tempo_sessao_minutos, observacoes
) VALUES (
  'Eduardo', 35, 'Masculino', 181, 96.2,
  'Trabalho sedentário', 'Sedentário',
  'Recomposição corporal (secar e hipertrofiar)', 'Não perder massa muscular',
  'Avançado', 5,
  'Treina desde os 16 anos. Consistente desde dezembro de 2024.',
  'Hérnia cervical e lombar (sem laudo). Dor no joelho direito em passadas.',
  'Boa', 'Médio',
  'Boa com ajustes necessários', 'Fim de semana — ~1,5L vinho + 1L cerveja', '5 a 10 cigarros de maconha',
  4, 5.0,
  60,
  'Exercícios sem carga axial na coluna (sem barra sobre ombros/costas). Sem passadas/afundos. Sem terra convencional. Monitorar joelho direito e resposta lombar. Encaminhar para avaliação médica das hérnias.'
);


-- 2. AVALIAÇÃO INICIAL
INSERT INTO avaliacoes (
  aluno_id, data_avaliacao,
  peso_kg, imc, percentual_gordura, gordura_kg, massa_magra_kg,
  gordura_visceral, tmb_kcal,
  perimetro_ombro, perimetro_cintura, perimetro_quadril,
  perimetro_peito, perimetro_abdomen,
  perimetro_braco_esq, perimetro_braco_dir,
  perimetro_braco_flex_esq, perimetro_braco_flex_dir,
  perimetro_coxa_esq, perimetro_coxa_dir,
  perimetro_panturrilha_esq, perimetro_panturrilha_dir,
  perimetro_antebraco_esq, perimetro_antebraco_dir,
  teste_flexao, teste_abdominal,
  observacoes
) VALUES (
  (SELECT id FROM alunos WHERE nome = 'Eduardo' LIMIT 1),
  '2025-05-01',
  96.2, 29.4, 29.6, 28.5, 67.7,
  12, 1959,
  128, 104, 114,
  109, 90.5,
  38, 37.5,
  40.5, 40.5,
  65, 64.5,
  40, 39,
  30, 30,
  40, 130,
  'Balança Omron BF511. Gordura visceral elevada (normal até 9). Avaliação inicial — referência para reavaliação em 45 dias.'
);


-- 3. PLANO DE TREINO
INSERT INTO planos_treino (
  aluno_id, nome, objetivo, divisao, fase,
  data_inicio, data_fim, ativo, observacoes
) VALUES (
  (SELECT id FROM alunos WHERE nome = 'Eduardo' LIMIT 1),
  'Plano Eduardo — Fase 1 | Recomposição Corporal',
  'Redução de gordura com preservação máxima de massa magra',
  'Push/Pull/Legs (PPL Modificado) — 5 dias',
  'Fase 1 — 45 dias',
  '2025-05-01', '2025-06-15',
  TRUE,
  'Protocolo conservador para hérnias cervical e lombar. Sem carga axial na coluna. Sem passadas. Sem terra convencional. Cardio LISS 4-5x/semana 30-40min pós-treino ou manhã.'
);


-- ============================================================
-- 4. SESSÕES E EXERCÍCIOS
-- ============================================================

-- SESSÃO: PUSH A (Segunda)
INSERT INTO sessoes (plano_id, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Push A', 'Segunda-feira', 'Peito, Ombro, Tríceps',
  '5 min esteira leve + rotação de ombros + prancha 1x1min',
  'Prancha 3x45seg + Elevação de pernas 3x15',
  1
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'Push A' LIMIT 1), 1, 'Supino inclinado halter', 4, 10, 12, 2, 150, 'Pegada que permita conforto no ombro'),
((SELECT id FROM sessoes WHERE nome = 'Push A' LIMIT 1), 2, 'Crucifixo máquina (peck deck)', 3, 12, 15, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Push A' LIMIT 1), 3, 'Cross cabos baixo para cima', 3, 12, 15, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Push A' LIMIT 1), 4, 'Desenvolvimento máquina', 3, 10, 12, 2, 120, 'Pegada neutra para reduzir carga cervical'),
((SELECT id FROM sessoes WHERE nome = 'Push A' LIMIT 1), 5, 'Elevação lateral cabo ou halter', 4, 15, 20, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'Push A' LIMIT 1), 6, 'Tríceps corda (polia alta)', 3, 12, 15, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Push A' LIMIT 1), 7, 'Tríceps barra reta (polia)', 3, 12, 15, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Push A' LIMIT 1), 8, 'Francês halter inclinado', 3, 10, 12, 2, 90, NULL);


-- SESSÃO: PULL A (Terça)
INSERT INTO sessoes (plano_id, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Pull A', 'Terça-feira', 'Costas, Bíceps',
  'Band pull-apart 2x15 + remada com elástico leve 2x15',
  'Crunch máquina 3x15 + Oblíquo cabo 3x15 cada lado',
  2
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'Pull A' LIMIT 1), 1, 'Puxada frente (pegada aberta)', 4, 10, 12, 2, 150, NULL),
((SELECT id FROM sessoes WHERE nome = 'Pull A' LIMIT 1), 2, 'Remada curvada halter unilateral', 4, 10, 12, 2, 120, 'Exercício favorito. Coluna neutra, apoio no banco'),
((SELECT id FROM sessoes WHERE nome = 'Pull A' LIMIT 1), 3, 'Remada cavalinho máquina', 3, 10, 12, 2, 120, NULL),
((SELECT id FROM sessoes WHERE nome = 'Pull A' LIMIT 1), 4, 'Puxada triângulo (pegada neutra)', 3, 12, 15, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Pull A' LIMIT 1), 5, 'Remada inversa máquina', 3, 12, 15, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Pull A' LIMIT 1), 6, 'Rosca direta barra W', 3, 10, 12, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Pull A' LIMIT 1), 7, 'Rosca martelo halter', 3, 12, 15, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Pull A' LIMIT 1), 8, 'Rosca concentrada', 3, 12, 15, 2, 60, NULL);


-- SESSÃO: LEGS A (Quarta)
INSERT INTO sessoes (plano_id, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Legs A', 'Quarta-feira', 'Quadríceps, Posterior, Glúteo, Panturrilha',
  '5 min bike leve + mobilidade de quadril 2x10 cada lado',
  'Prancha lateral 3x30seg cada lado + Abdominal infra 3x15',
  3
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'Legs A' LIMIT 1), 1, 'Leg press 45°', 4, 12, 15, 2, 150, 'Amplitude controlada — não fechar além de 90°. Monitorar joelho direito'),
((SELECT id FROM sessoes WHERE nome = 'Legs A' LIMIT 1), 2, 'Cadeira extensora', 4, 15, 20, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Legs A' LIMIT 1), 3, 'Leg press horizontal', 3, 12, 15, 2, 120, 'Variação de posição de pés para estímulo diferente'),
((SELECT id FROM sessoes WHERE nome = 'Legs A' LIMIT 1), 4, 'Mesa flexora', 4, 12, 15, 2, 120, NULL),
((SELECT id FROM sessoes WHERE nome = 'Legs A' LIMIT 1), 5, 'Stiff halter (amplitude controlada)', 3, 12, 15, 2, 120, 'Lombar neutra. Amplitude até a tensão — não forçar além do conforto. Monitorar lombar'),
((SELECT id FROM sessoes WHERE nome = 'Legs A' LIMIT 1), 6, 'Cadeira adutora', 3, 15, 20, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Legs A' LIMIT 1), 7, 'Panturrilha no leg press', 4, 15, 20, 1, 60, 'Sem máquina específica — usar leg press');


-- SESSÃO: PUSH B (Sexta)
INSERT INTO sessoes (plano_id, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Push B', 'Sexta-feira', 'Peito, Ombro, Tríceps (variação)',
  '5 min esteira leve + rotação de ombros',
  'Prancha 3x1min',
  4
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'Push B' LIMIT 1), 1, 'Supino reto máquina', 4, 10, 12, 2, 150, NULL),
((SELECT id FROM sessoes WHERE nome = 'Push B' LIMIT 1), 2, 'Crossover cabo (paralelo, neutro)', 3, 12, 15, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Push B' LIMIT 1), 3, 'Flexão de braço', 3, 15, 20, 1, 90, 'Máximo de reps com qualidade — teto 20'),
((SELECT id FROM sessoes WHERE nome = 'Push B' LIMIT 1), 4, 'Elevação lateral halter', 4, 15, 20, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'Push B' LIMIT 1), 5, 'Desenvolvimento halter sentado', 3, 10, 12, 2, 120, 'Pegada neutra (palmas se olhando). Se desconforto cervical, trocar por desenvolvimento máquina'),
((SELECT id FROM sessoes WHERE nome = 'Push B' LIMIT 1), 6, 'Posterior de ombro máquina', 3, 15, 20, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Push B' LIMIT 1), 7, 'Tríceps mergulho paralela', 3, 8, 12, 2, 120, NULL),
((SELECT id FROM sessoes WHERE nome = 'Push B' LIMIT 1), 8, 'Tríceps testa barra W', 3, 10, 12, 2, 90, NULL);


-- SESSÃO: PULL B (Sábado)
INSERT INTO sessoes (plano_id, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Pull B', 'Sábado', 'Costas, Bíceps (variação)',
  'Band pull-apart 2x15',
  'Crunch 3x20 + Elevação de pernas 3x15',
  5
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'Pull B' LIMIT 1), 1, 'Puxada inversa (supinada)', 4, 10, 12, 2, 150, NULL),
((SELECT id FROM sessoes WHERE nome = 'Pull B' LIMIT 1), 2, 'Remada aberta máquina', 4, 10, 12, 2, 120, NULL),
((SELECT id FROM sessoes WHERE nome = 'Pull B' LIMIT 1), 3, 'Remada curvada halter bilateral', 3, 10, 12, 2, 120, 'Coluna neutra obrigatório'),
((SELECT id FROM sessoes WHERE nome = 'Pull B' LIMIT 1), 4, 'Pullover máquina ou cabo', 3, 12, 15, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Pull B' LIMIT 1), 5, 'Face pull cabo', 3, 15, 20, 2, 90, 'OBRIGATÓRIO — não remover. Saúde do ombro e postura'),
((SELECT id FROM sessoes WHERE nome = 'Pull B' LIMIT 1), 6, 'Rosca direta halter unilateral', 3, 12, 15, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'Pull B' LIMIT 1), 7, 'Rosca 21 barra W', 3, 21, 21, 1, 90, '7 reps parcial baixo + 7 parcial cima + 7 completas');


-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
