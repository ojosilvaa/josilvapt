-- ══════════════════════════════════════════════════════
-- EDUARDO — Upper/Lower 5 dias (v3, Fase 1)
-- Substitui treinos anteriores do Eduardo
-- Colar no Supabase SQL Editor e clicar Run
-- ══════════════════════════════════════════════════════

-- 1. ATUALIZAR ALUNO (plano e obs reflectem v3)
UPDATE alunos
SET
  plano    = 'Upper/Lower 5x — Fase 1',
  obs      = 'Hérnia cervical e lombar (sem laudo). Dor joelho direito em passadas. SEM carga axial na coluna. SEM passadas livres. SEM terra convencional. Búlgaro: monitorar joelho. Remada curvada: lombar neutra obrigatória. 35 anos, 181 cm, 96.2 kg. Avançado — treina desde os 16 anos. Recomposição corporal.'
WHERE id = (SELECT id FROM alunos WHERE nome = 'Eduardo' ORDER BY criado_em DESC LIMIT 1);


-- 2. APAGAR TREINOS ANTIGOS (exercicios apagam em cascade)
DELETE FROM treinos
WHERE aluno_id = (SELECT id FROM alunos WHERE nome = 'Eduardo' ORDER BY criado_em DESC LIMIT 1);


-- ══════════════════════════════════════════════════════
-- TREINOS
-- ══════════════════════════════════════════════════════

-- Upper A | Segunda — Peito + Costas + Ombro
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome = 'Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'Upper A — Peito + Costas + Ombro',
  'Segunda | Aquec: Supino máquina 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Abdominal infra c/ caneleira 3x15 | Descanso: 90s multiarticulares, 60s isolados'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper A — Peito + Costas + Ombro' LIMIT 1),1,'Supino máquina sentado',4,'8-10','Foco em progressão de carga | RIR 1 | 90s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper A — Peito + Costas + Ombro' LIMIT 1),2,'Remada curvada barra (pegada pronada)',4,'10-12','LOMBAR NEUTRA OBRIGATÓRIA | RIR 2 | 90s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper A — Peito + Costas + Ombro' LIMIT 1),3,'Supino inclinado halter',3,'10-12','RIR 2 | 90s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper A — Peito + Costas + Ombro' LIMIT 1),4,'Puxada pronada (barra larga)',3,'10-12','RIR 2 | 90s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper A — Peito + Costas + Ombro' LIMIT 1),5,'Elevação lateral halter',4,'15-20','RIR 2 | 60s descanso');


-- Lower A | Terça — Quad + Posterior + Glúteo
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome = 'Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'Lower A — Quad + Posterior + Glúteo',
  'Terça | Aquec: Leg press 45° 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Abdominal infra c/ caneleira 3x15 | Descanso: 90s multiarticulares, 60s isolados'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Lower A — Quad + Posterior + Glúteo' LIMIT 1),1,'Leg press 45°',5,'10-12','Foco em progressão de carga. Monitorar joelho direito | RIR 1 | 90s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Lower A — Quad + Posterior + Glúteo' LIMIT 1),2,'Cadeira extensora',3,'12-15','RIR 2 | 60s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Lower A — Quad + Posterior + Glúteo' LIMIT 1),3,'Mesa flexora',4,'12-15','RIR 2 | 60s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Lower A — Quad + Posterior + Glúteo' LIMIT 1),4,'Elevação pélvica máquina',4,'12-15','RIR 2 | 60s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Lower A — Quad + Posterior + Glúteo' LIMIT 1),5,'Panturrilha no leg press',4,'15-20','RIR 1 | 60s descanso');


-- Upper B | Quarta — Peito + Costas + Braços
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome = 'Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'Upper B — Peito + Costas + Braços',
  'Quarta | Aquec: Supino articulado 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Abdominal supra 3x20 | Descanso: 90s multiarticulares, 60s isolados'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper B — Peito + Costas + Braços' LIMIT 1),1,'Supino articulado máquina (anilhas)',3,'10-12','RIR 2 | 90s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper B — Peito + Costas + Braços' LIMIT 1),2,'Puxada neutra (triângulo)',3,'10-12','RIR 2 | 90s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper B — Peito + Costas + Braços' LIMIT 1),3,'Cross polia alta',3,'12-15','RIR 2 | 60s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper B — Peito + Costas + Braços' LIMIT 1),4,'Rosca direta barra W',3,'10-12','RIR 2 | 60s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper B — Peito + Costas + Braços' LIMIT 1),5,'Tríceps corda polia alta',3,'12-15','RIR 2 | 60s descanso');


-- Lower B | Sexta — Quad + Posterior + Panturrilha
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome = 'Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'Lower B — Quad + Posterior + Panturrilha',
  'Sexta | Aquec: Leg press 45° 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Abdominal oblíquo cabo 3x15 cada lado | Descanso: 90s multiarticulares, 60s isolados'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Lower B — Quad + Posterior + Panturrilha' LIMIT 1),1,'Leg press 45°',4,'10-12','Monitorar joelho direito | RIR 2 | 90s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Lower B — Quad + Posterior + Panturrilha' LIMIT 1),2,'Búlgaro halter',3,'10-12','MONITORAR JOELHO DIREITO — se dor substituir por extensora unilateral | RIR 2 | 90s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Lower B — Quad + Posterior + Panturrilha' LIMIT 1),3,'Stiff halter (amplitude controlada)',3,'12-15','LOMBAR NEUTRA. Amplitude até a tensão | RIR 2 | 90s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Lower B — Quad + Posterior + Panturrilha' LIMIT 1),4,'Cadeira adutora',3,'15-20','RIR 2 | 60s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Lower B — Quad + Posterior + Panturrilha' LIMIT 1),5,'Panturrilha no leg press',4,'15-20','RIR 1 | 60s descanso');


-- Upper C | Sábado — Ombro + Costas + Braços
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome = 'Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'Upper C — Ombro + Costas + Braços',
  'Sábado | Aquec: Desenvolvimento máquina 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Abdominal supra 3x20 | Descanso: 90s multiarticulares, 60s isolados'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper C — Ombro + Costas + Braços' LIMIT 1),1,'Desenvolvimento máquina',3,'10-12','Pegada neutra para reduzir carga cervical | RIR 2 | 90s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper C — Ombro + Costas + Braços' LIMIT 1),2,'Face pull cabo',3,'15-20','OBRIGATÓRIO — postura e saúde do ombro | RIR 2 | 60s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper C — Ombro + Costas + Braços' LIMIT 1),3,'Remada cavalinho (pegada neutra)',3,'10-12','RIR 2 | 90s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper C — Ombro + Costas + Braços' LIMIT 1),4,'Rosca martelo halter',3,'12-15','RIR 2 | 60s descanso'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='Upper C — Ombro + Costas + Braços' LIMIT 1),5,'Francês halter inclinado',3,'10-12','RIR 2 | 60s descanso');

-- ══════════════════════════════════════════════════════
-- FIM DO SCRIPT
-- ══════════════════════════════════════════════════════
