-- ============================================================
-- PERSONAL TRAINER WEBAPP — SUPABASE / POSTGRESQL
-- Plano Eduardo — 10 Treinos (Semana A + Semana B)
-- Versão 2 | Maio 2025
-- ============================================================
-- INSTRUÇÕES:
-- 1. Execute primeiro o bloco DROP (se necessário limpar dados anteriores)
-- 2. Execute o bloco CREATE TABLE
-- 3. Execute os INSERTs na ordem
-- ============================================================


-- ============================================================
-- OPCIONAL: LIMPAR DADOS ANTERIORES
-- ============================================================

DROP TABLE IF EXISTS reavaliacoes CASCADE;
DROP TABLE IF EXISTS exercicios CASCADE;
DROP TABLE IF EXISTS sessoes CASCADE;
DROP TABLE IF EXISTS planos_treino CASCADE;
DROP TABLE IF EXISTS avaliacoes CASCADE;
DROP TABLE IF EXISTS alunos CASCADE;


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
-- 2. TABELA: AVALIACOES
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
-- 4. TABELA: SESSOES
-- ============================================================

CREATE TABLE IF NOT EXISTS sessoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_id UUID REFERENCES planos_treino(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  semana TEXT,
  dia_semana TEXT,
  grupos_musculares TEXT,
  aquecimento TEXT,
  finalizador TEXT,
  observacoes TEXT,
  ordem INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 5. TABELA: EXERCICIOS
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
-- 6. TABELA: REAVALIACOES
-- ============================================================

CREATE TABLE IF NOT EXISTS reavaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES alunos(id) ON DELETE CASCADE,
  data_reavaliacao DATE NOT NULL,
  peso_kg NUMERIC(5,2),
  percentual_gordura NUMERIC(4,1),
  massa_magra_kg NUMERIC(5,2),
  gordura_visceral INTEGER,
  mudanca_visual TEXT,
  aumento_forca TEXT,
  melhora_execucao TEXT,
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
-- DADOS — ALUNO EDUARDO
-- ============================================================

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
  'Boa com ajustes', '~1,5L vinho + 1L cerveja no fim de semana', '5 a 10 cigarros de maconha',
  4, 5.0, 60,
  'Sem carga axial na coluna. Sem passadas livres. Sem terra convencional. Búlgaro: monitorar joelho direito. Remada curvada: monitorar lombar. Encaminhar para avaliação médica das hérnias.'
);


-- ============================================================
-- AVALIAÇÃO INICIAL
-- ============================================================

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
  teste_flexao, teste_abdominal, observacoes
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


-- ============================================================
-- PLANO DE TREINO
-- ============================================================

INSERT INTO planos_treino (
  aluno_id, nome, objetivo, divisao, fase,
  data_inicio, data_fim, ativo, observacoes
) VALUES (
  (SELECT id FROM alunos WHERE nome = 'Eduardo' LIMIT 1),
  'Plano Eduardo — Fase 1 | Recomposição Corporal',
  'Redução de gordura com preservação máxima de massa magra',
  '10 treinos alternados — Semana A (foco superior) / Semana B (foco inferior)',
  'Fase 1 — 45 dias',
  '2025-05-01', '2025-06-15',
  TRUE,
  'Sem carga axial na coluna. Sem passadas. Sem terra convencional. Descanso: 90s multiarticulares, 60s isolados. Aquecimento específico no primeiro exercício de cada sessão (2 séries: 50% e 70% da carga).'
);


-- ============================================================
-- SEMANA A — FOCO SUPERIOR
-- ============================================================

-- A1: SEGUNDA | Peito + Tríceps
INSERT INTO sessoes (plano_id, semana, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Semana A', 'A1 — Peito + Tríceps', 'Segunda-feira', 'Peito, Tríceps',
  'Aquecimento específico no supino máquina: 1x15 (50% carga) + 1x10 (70% carga)',
  'Prancha 3x falha + Abdominal infra c/ caneleira 3x15',
  1
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'A1 — Peito + Tríceps' LIMIT 1), 1, 'Supino máquina sentado', 4, 8, 10, 1, 90, 'Progressão de carga — foco em bater repetições com qualidade'),
((SELECT id FROM sessoes WHERE nome = 'A1 — Peito + Tríceps' LIMIT 1), 2, 'Supino inclinado halter', 4, 10, 12, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'A1 — Peito + Tríceps' LIMIT 1), 3, 'Cross polia alta', 3, 12, 15, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'A1 — Peito + Tríceps' LIMIT 1), 4, 'Tríceps corda polia alta', 3, 12, 15, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'A1 — Peito + Tríceps' LIMIT 1), 5, 'Francês halter inclinado', 3, 10, 12, 2, 60, NULL);


-- A2: TERÇA | Costas + Bíceps
INSERT INTO sessoes (plano_id, semana, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Semana A', 'A2 — Costas + Bíceps', 'Terça-feira', 'Costas, Bíceps',
  'Aquecimento específico na remada curvada: 1x15 (50% carga) + 1x10 (70% carga)',
  'Prancha 3x falha + Abdominal supra 3x20',
  2
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'A2 — Costas + Bíceps' LIMIT 1), 1, 'Remada curvada barra (pegada pronada)', 4, 10, 12, 2, 90, 'LOMBAR NEUTRA OBRIGATÓRIA. Monitorar dor lombar a cada sessão'),
((SELECT id FROM sessoes WHERE nome = 'A2 — Costas + Bíceps' LIMIT 1), 2, 'Puxada pronada (barra larga)', 4, 10, 12, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'A2 — Costas + Bíceps' LIMIT 1), 3, 'Remada cavalinho (pegada neutra)', 3, 10, 12, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'A2 — Costas + Bíceps' LIMIT 1), 4, 'Face pull cabo', 3, 15, 20, 2, 60, 'Obrigatório — postura e saúde do ombro'),
((SELECT id FROM sessoes WHERE nome = 'A2 — Costas + Bíceps' LIMIT 1), 5, 'Rosca direta barra W', 3, 10, 12, 2, 60, NULL);


-- A3: QUARTA | Perna leve + Ombro
INSERT INTO sessoes (plano_id, semana, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Semana A', 'A3 — Perna Leve + Ombro', 'Quarta-feira', 'Quadríceps, Posterior, Ombro, Panturrilha',
  'Aquecimento específico no leg press 45°: 1x15 (50% carga) + 1x10 (70% carga)',
  'Prancha 3x falha + Abdominal oblíquo cabo 3x15 cada lado',
  3
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'A3 — Perna Leve + Ombro' LIMIT 1), 1, 'Leg press 45°', 3, 12, 15, 2, 90, 'Amplitude controlada — não fechar além de 90°. Monitorar joelho direito'),
((SELECT id FROM sessoes WHERE nome = 'A3 — Perna Leve + Ombro' LIMIT 1), 2, 'Mesa flexora', 3, 12, 15, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'A3 — Perna Leve + Ombro' LIMIT 1), 3, 'Desenvolvimento máquina', 3, 10, 12, 2, 90, 'Pegada neutra para reduzir carga cervical'),
((SELECT id FROM sessoes WHERE nome = 'A3 — Perna Leve + Ombro' LIMIT 1), 4, 'Elevação lateral halter', 4, 15, 20, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'A3 — Perna Leve + Ombro' LIMIT 1), 5, 'Panturrilha no leg press', 3, 15, 20, 1, 60, NULL);


-- A4: SEXTA | Peito + Costas
INSERT INTO sessoes (plano_id, semana, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Semana A', 'A4 — Peito + Costas', 'Sexta-feira', 'Peito, Costas',
  'Aquecimento específico no supino articulado: 1x15 (50% carga) + 1x10 (70% carga)',
  'Prancha 3x falha + Abdominal infra c/ caneleira 3x15',
  4
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'A4 — Peito + Costas' LIMIT 1), 1, 'Supino articulado máquina (anilhas)', 4, 10, 12, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'A4 — Peito + Costas' LIMIT 1), 2, 'Puxada neutra (triângulo)', 4, 10, 12, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'A4 — Peito + Costas' LIMIT 1), 3, 'Cross polia alta', 3, 12, 15, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'A4 — Peito + Costas' LIMIT 1), 4, 'Remada curvada barra (pegada pronada)', 3, 10, 12, 2, 90, 'LOMBAR NEUTRA OBRIGATÓRIA. Monitorar dor lombar'),
((SELECT id FROM sessoes WHERE nome = 'A4 — Peito + Costas' LIMIT 1), 5, 'Face pull cabo', 3, 15, 20, 2, 60, 'Obrigatório — postura e saúde do ombro');


-- A5: SÁBADO | Ombro + Braços
INSERT INTO sessoes (plano_id, semana, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Semana A', 'A5 — Ombro + Braços', 'Sábado', 'Ombro, Bíceps, Tríceps',
  'Aquecimento específico no desenvolvimento máquina: 1x15 (50% carga) + 1x10 (70% carga)',
  'Prancha 3x falha + Abdominal supra 3x20',
  5
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'A5 — Ombro + Braços' LIMIT 1), 1, 'Desenvolvimento máquina', 3, 10, 12, 2, 90, 'Pegada neutra'),
((SELECT id FROM sessoes WHERE nome = 'A5 — Ombro + Braços' LIMIT 1), 2, 'Elevação lateral cabo', 4, 15, 20, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'A5 — Ombro + Braços' LIMIT 1), 3, 'Posterior ombro máquina', 3, 15, 20, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'A5 — Ombro + Braços' LIMIT 1), 4, 'Rosca martelo halter', 3, 12, 15, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'A5 — Ombro + Braços' LIMIT 1), 5, 'Tríceps polia pegada invertida', 3, 12, 15, 2, 60, NULL);


-- ============================================================
-- SEMANA B — FOCO INFERIOR
-- ============================================================

-- B1: SEGUNDA | Perna pesada
INSERT INTO sessoes (plano_id, semana, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Semana B', 'B1 — Perna Pesada', 'Segunda-feira', 'Quadríceps, Posterior, Panturrilha',
  'Aquecimento específico no leg press 45°: 1x15 (50% carga) + 1x10 (70% carga)',
  'Prancha 3x falha + Abdominal infra c/ caneleira 3x15',
  6
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'B1 — Perna Pesada' LIMIT 1), 1, 'Leg press 45°', 5, 10, 12, 1, 90, 'Sessão de foco — progredir carga. Monitorar joelho direito'),
((SELECT id FROM sessoes WHERE nome = 'B1 — Perna Pesada' LIMIT 1), 2, 'Cadeira extensora', 4, 12, 15, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'B1 — Perna Pesada' LIMIT 1), 3, 'Mesa flexora', 4, 12, 15, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'B1 — Perna Pesada' LIMIT 1), 4, 'Stiff halter (amplitude controlada)', 3, 12, 15, 2, 90, 'LOMBAR NEUTRA. Amplitude até a tensão — não forçar além do conforto'),
((SELECT id FROM sessoes WHERE nome = 'B1 — Perna Pesada' LIMIT 1), 5, 'Panturrilha no leg press', 4, 15, 20, 1, 60, NULL);


-- B2: TERÇA | Costas + Bíceps
INSERT INTO sessoes (plano_id, semana, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Semana B', 'B2 — Costas + Bíceps', 'Terça-feira', 'Costas, Bíceps',
  'Aquecimento específico na remada curvada: 1x15 (50% carga) + 1x10 (70% carga)',
  'Prancha 3x falha + Abdominal oblíquo cabo 3x15 cada lado',
  7
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'B2 — Costas + Bíceps' LIMIT 1), 1, 'Remada curvada barra (pegada pronada)', 3, 10, 12, 2, 90, 'LOMBAR NEUTRA OBRIGATÓRIA. Monitorar dor lombar'),
((SELECT id FROM sessoes WHERE nome = 'B2 — Costas + Bíceps' LIMIT 1), 2, 'Puxada pronada (barra larga)', 3, 10, 12, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'B2 — Costas + Bíceps' LIMIT 1), 3, 'Remada máquina (pegada pronada)', 3, 10, 12, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'B2 — Costas + Bíceps' LIMIT 1), 4, 'Face pull cabo', 3, 15, 20, 2, 60, 'Obrigatório — postura e saúde do ombro'),
((SELECT id FROM sessoes WHERE nome = 'B2 — Costas + Bíceps' LIMIT 1), 5, 'Rosca concentrada halter', 3, 12, 15, 2, 60, NULL);


-- B3: QUARTA | Perna + Glúteo
INSERT INTO sessoes (plano_id, semana, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Semana B', 'B3 — Perna + Glúteo', 'Quarta-feira', 'Quadríceps, Glúteo, Panturrilha',
  'Aquecimento específico no leg press 45°: 1x15 (50% carga) + 1x10 (70% carga)',
  'Prancha 3x falha + Abdominal infra c/ caneleira 3x15',
  8
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'B3 — Perna + Glúteo' LIMIT 1), 1, 'Leg press 45°', 4, 10, 12, 2, 90, 'Monitorar joelho direito'),
((SELECT id FROM sessoes WHERE nome = 'B3 — Perna + Glúteo' LIMIT 1), 2, 'Búlgaro halter', 3, 10, 12, 2, 90, 'MONITORAR JOELHO DIREITO — se dor, substituir por cadeira extensora unilateral'),
((SELECT id FROM sessoes WHERE nome = 'B3 — Perna + Glúteo' LIMIT 1), 3, 'Cadeira adutora', 3, 15, 20, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'B3 — Perna + Glúteo' LIMIT 1), 4, 'Elevação pélvica máquina', 4, 12, 15, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'B3 — Perna + Glúteo' LIMIT 1), 5, 'Panturrilha no leg press', 3, 15, 20, 1, 60, NULL);


-- B4: SEXTA | Peito + Tríceps
INSERT INTO sessoes (plano_id, semana, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Semana B', 'B4 — Peito + Tríceps', 'Sexta-feira', 'Peito, Tríceps',
  'Aquecimento específico no supino máquina: 1x15 (50% carga) + 1x10 (70% carga)',
  'Prancha 3x falha + Abdominal supra 3x20',
  9
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'B4 — Peito + Tríceps' LIMIT 1), 1, 'Supino máquina sentado', 3, 8, 10, 2, 90, 'Semana B — volume reduzido. Manter qualidade'),
((SELECT id FROM sessoes WHERE nome = 'B4 — Peito + Tríceps' LIMIT 1), 2, 'Supino inclinado halter', 3, 10, 12, 2, 90, NULL),
((SELECT id FROM sessoes WHERE nome = 'B4 — Peito + Tríceps' LIMIT 1), 3, 'Cross polia alta', 2, 12, 15, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'B4 — Peito + Tríceps' LIMIT 1), 4, 'Tríceps corda polia alta', 3, 12, 15, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'B4 — Peito + Tríceps' LIMIT 1), 5, 'Tríceps testa barra W', 3, 10, 12, 2, 60, NULL);


-- B5: SÁBADO | Perna + Ombro
INSERT INTO sessoes (plano_id, semana, nome, dia_semana, grupos_musculares, aquecimento, finalizador, ordem)
VALUES (
  (SELECT id FROM planos_treino WHERE nome LIKE '%Eduardo%' LIMIT 1),
  'Semana B', 'B5 — Perna + Ombro', 'Sábado', 'Quadríceps, Posterior, Ombro',
  'Aquecimento específico na cadeira extensora: 1x15 (50% carga) + 1x10 (70% carga)',
  'Prancha 3x falha + Abdominal oblíquo cabo 3x15 cada lado',
  10
);

INSERT INTO exercicios (sessao_id, ordem, nome, series, repeticoes_min, repeticoes_max, rir, descanso_segundos, observacoes) VALUES
((SELECT id FROM sessoes WHERE nome = 'B5 — Perna + Ombro' LIMIT 1), 1, 'Cadeira extensora', 4, 12, 15, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'B5 — Perna + Ombro' LIMIT 1), 2, 'Mesa flexora', 3, 12, 15, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'B5 — Perna + Ombro' LIMIT 1), 3, 'Desenvolvimento máquina', 3, 10, 12, 2, 90, 'Pegada neutra'),
((SELECT id FROM sessoes WHERE nome = 'B5 — Perna + Ombro' LIMIT 1), 4, 'Elevação lateral halter', 3, 15, 20, 2, 60, NULL),
((SELECT id FROM sessoes WHERE nome = 'B5 — Perna + Ombro' LIMIT 1), 5, 'Posterior ombro máquina', 3, 15, 20, 2, 60, NULL);


-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
