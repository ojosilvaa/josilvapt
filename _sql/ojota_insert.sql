-- ══════════════════════════════════════════════════════
-- OJOTA — Inserir no schema do Jo Silva PT
-- Colar no Supabase SQL Editor e clicar Run
-- ══════════════════════════════════════════════════════

-- 1. ALUNO
INSERT INTO alunos (nome, email, telefone, objetivo, modalidade, plano, obs, ativo)
VALUES (
  'Ojota',
  '',
  '',
  'Recomposição corporal (secar e hipertrofiar)',
  'Musculação',
  'PPL 5x/semana',
  'Hérnia cervical e lombar. Dor joelho direito em passadas. SEM carga axial na coluna, SEM passadas/afundos, SEM terra convencional. 35 anos, 190cm, 80kg. Avançado — treina desde os 16 anos. Cardio LISS 4-5x/sem 30-40min.',
  true
);


-- ══════ TREINOS ══════

-- Push A (Segunda)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1),
  'Push A',
  'Segunda | Peito, Ombro, Tríceps | Aquec: 5min esteira + rotação ombros + prancha 1x1min | Final: Prancha 3x45seg + Elevação pernas 3x15'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push A' LIMIT 1),1,'Supino inclinado halter',4,'10-12','Pegada que permita conforto no ombro'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push A' LIMIT 1),2,'Crucifixo máquina (peck deck)',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push A' LIMIT 1),3,'Cross cabos baixo para cima',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push A' LIMIT 1),4,'Desenvolvimento máquina',3,'10-12','Pegada neutra para reduzir carga cervical'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push A' LIMIT 1),5,'Elevação lateral cabo ou halter',4,'15-20',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push A' LIMIT 1),6,'Tríceps corda (polia alta)',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push A' LIMIT 1),7,'Tríceps barra reta (polia)',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push A' LIMIT 1),8,'Francês halter inclinado',3,'10-12',NULL);


-- Pull A (Terça)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1),
  'Pull A',
  'Terça | Costas, Bíceps | Aquec: Band pull-apart 2x15 + remada elástico 2x15 | Final: Crunch máquina 3x15 + Oblíquo cabo 3x15 cada lado'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull A' LIMIT 1),1,'Puxada frente (pegada aberta)',4,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull A' LIMIT 1),2,'Remada curvada halter unilateral',4,'10-12','Coluna neutra, apoio no banco'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull A' LIMIT 1),3,'Remada cavalinho máquina',3,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull A' LIMIT 1),4,'Puxada triângulo (pegada neutra)',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull A' LIMIT 1),5,'Remada inversa máquina',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull A' LIMIT 1),6,'Rosca direta barra W',3,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull A' LIMIT 1),7,'Rosca martelo halter',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull A' LIMIT 1),8,'Rosca concentrada',3,'12-15',NULL);


-- Legs A (Quarta)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1),
  'Legs A',
  'Quarta | Quadríceps, Posterior, Glúteo, Panturrilha | Aquec: 5min bike + mobilidade quadril 2x10 | Final: Prancha lateral 3x30seg + Abdominal infra 3x15'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Legs A' LIMIT 1),1,'Leg press 45°',4,'12-15','Amplitude controlada — não fechar além de 90°. Monitorar joelho direito'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Legs A' LIMIT 1),2,'Cadeira extensora',4,'15-20',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Legs A' LIMIT 1),3,'Leg press horizontal',3,'12-15','Variação de posição de pés para estímulo diferente'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Legs A' LIMIT 1),4,'Mesa flexora',4,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Legs A' LIMIT 1),5,'Stiff halter (amplitude controlada)',3,'12-15','Lombar neutra. Amplitude até a tensão — não forçar além do conforto'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Legs A' LIMIT 1),6,'Cadeira adutora',3,'15-20',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Legs A' LIMIT 1),7,'Panturrilha no leg press',4,'15-20','Usar leg press para panturrilha');


-- Push B (Sexta)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1),
  'Push B',
  'Sexta | Peito, Ombro, Tríceps (variação) | Aquec: 5min esteira + rotação ombros | Final: Prancha 3x1min'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push B' LIMIT 1),1,'Supino reto máquina',4,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push B' LIMIT 1),2,'Crossover cabo (paralelo, neutro)',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push B' LIMIT 1),3,'Flexão de braço',3,'15-20','Máximo de reps com qualidade — teto 20'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push B' LIMIT 1),4,'Elevação lateral halter',4,'15-20',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push B' LIMIT 1),5,'Desenvolvimento halter sentado',3,'10-12','Pegada neutra. Se desconforto cervical, trocar por desenvolvimento máquina'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push B' LIMIT 1),6,'Posterior de ombro máquina',3,'15-20',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push B' LIMIT 1),7,'Tríceps mergulho paralela',3,'8-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Push B' LIMIT 1),8,'Tríceps testa barra W',3,'10-12',NULL);


-- Pull B (Sábado)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1),
  'Pull B',
  'Sábado | Costas, Bíceps (variação) | Aquec: Band pull-apart 2x15 | Final: Crunch 3x20 + Elevação pernas 3x15'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull B' LIMIT 1),1,'Puxada inversa (supinada)',4,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull B' LIMIT 1),2,'Remada aberta máquina',4,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull B' LIMIT 1),3,'Remada curvada halter bilateral',3,'10-12','Coluna neutra obrigatório'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull B' LIMIT 1),4,'Pullover máquina ou cabo',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull B' LIMIT 1),5,'Face pull cabo',3,'15-20','OBRIGATÓRIO — saúde do ombro e postura'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull B' LIMIT 1),6,'Rosca direta halter unilateral',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1) AND nome='Pull B' LIMIT 1),7,'Rosca 21 barra W',3,'21','7 reps parcial baixo + 7 parcial cima + 7 completas');


-- ══════ AVALIAÇÃO FÍSICA ══════
INSERT INTO perimetria (aluno_id, data, peso, gordura, massa_magra, medidas, obs)
VALUES (
  (SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1),
  '2025-05-01',
  80,
  29.6,
  67.7,
  '{"ombro":128,"cintura":104,"quadril":114,"peito":109,"abdomen":90.5,"braco_esq":38,"braco_dir":37.5,"braco_flex_esq":40.5,"braco_flex_dir":40.5,"coxa_esq":65,"coxa_dir":64.5,"panturrilha_esq":40,"panturrilha_dir":39,"antebraco_esq":30,"antebraco_dir":30}',
  'Avaliação inicial. 190cm, 80kg. Reavaliação em 45 dias.'
);


-- ══════ ANAMNESE ══════
INSERT INTO anamnese (aluno_id, dados, atualizado_em)
VALUES (
  (SELECT id FROM alunos WHERE nome='Ojota' ORDER BY criado_em DESC LIMIT 1),
  '{"idade":35,"sexo":"Masculino","altura_cm":190,"peso_kg":80,"profissao":"Trabalho sedentário","nivel_atividade":"Sedentário","objetivo_principal":"Recomposição corporal (secar e hipertrofiar)","objetivo_secundario":"Não perder massa muscular","nivel_experiencia":"Avançado","historico_treino":"Treina desde os 16 anos. Consistente desde dezembro de 2024.","lesoes":"Hérnia cervical e lombar (sem laudo). Dor no joelho direito em passadas.","qualidade_sono":"Boa","nivel_estresse":"Médio","qualidade_alimentacao":"Boa com ajustes necessários","alcool":"Fim de semana — ~1.5L vinho + 1L cerveja","tabaco":"5 a 10 cigarros de maconha","refeicoes_por_dia":4,"agua_litros":5,"tempo_sessao_min":60,"restricoes":"Sem carga axial na coluna. Sem passadas/afundos. Sem terra convencional. Monitorar joelho direito e lombar.","divisao":"PPL Modificado 5 dias","fase":"Fase 1 — 45 dias","data_inicio":"2025-05-01","data_fim":"2025-06-15","imc":22.2,"gordura_visceral":12,"tmb_kcal":1850}',
  NOW()
);
