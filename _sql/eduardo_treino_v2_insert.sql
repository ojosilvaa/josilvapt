-- ══════════════════════════════════════════════════════
-- EDUARDO — Substituir treinos (v2: 10 sessões A/B)
-- Colar no Supabase SQL Editor e clicar Run
-- ══════════════════════════════════════════════════════

-- 1. APAGAR TREINOS ANTIGOS DO EDUARDO (exercicios apagam em cascade)
DELETE FROM treinos
WHERE aluno_id = (SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1);


-- ══════════════════════════════════════════════════════
-- SEMANA A — FOCO SUPERIOR
-- ══════════════════════════════════════════════════════

-- A1: Peito + Tríceps (Segunda)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'A1 — Peito + Tríceps',
  'Semana A | Segunda | Aquec: Supino máquina 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Abdominal infra c/ caneleira 3x15'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A1 — Peito + Tríceps' LIMIT 1),1,'Supino máquina sentado',4,'8-10','Progressão de carga — foco em bater repetições com qualidade'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A1 — Peito + Tríceps' LIMIT 1),2,'Supino inclinado halter',4,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A1 — Peito + Tríceps' LIMIT 1),3,'Cross polia alta',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A1 — Peito + Tríceps' LIMIT 1),4,'Tríceps corda polia alta',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A1 — Peito + Tríceps' LIMIT 1),5,'Francês halter inclinado',3,'10-12',NULL);


-- A2: Costas + Bíceps (Terça)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'A2 — Costas + Bíceps',
  'Semana A | Terça | Aquec: Remada curvada 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Abdominal supra 3x20'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A2 — Costas + Bíceps' LIMIT 1),1,'Remada curvada barra (pegada pronada)',4,'10-12','LOMBAR NEUTRA OBRIGATÓRIA. Monitorar dor lombar a cada sessão'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A2 — Costas + Bíceps' LIMIT 1),2,'Puxada pronada (barra larga)',4,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A2 — Costas + Bíceps' LIMIT 1),3,'Remada cavalinho (pegada neutra)',3,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A2 — Costas + Bíceps' LIMIT 1),4,'Face pull cabo',3,'15-20','OBRIGATÓRIO — postura e saúde do ombro'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A2 — Costas + Bíceps' LIMIT 1),5,'Rosca direta barra W',3,'10-12',NULL);


-- A3: Perna Leve + Ombro (Quarta)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'A3 — Perna Leve + Ombro',
  'Semana A | Quarta | Aquec: Leg press 45° 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Oblíquo cabo 3x15 cada lado'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A3 — Perna Leve + Ombro' LIMIT 1),1,'Leg press 45°',3,'12-15','Amplitude controlada — não fechar além de 90°. Monitorar joelho direito'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A3 — Perna Leve + Ombro' LIMIT 1),2,'Mesa flexora',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A3 — Perna Leve + Ombro' LIMIT 1),3,'Desenvolvimento máquina',3,'10-12','Pegada neutra para reduzir carga cervical'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A3 — Perna Leve + Ombro' LIMIT 1),4,'Elevação lateral halter',4,'15-20',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A3 — Perna Leve + Ombro' LIMIT 1),5,'Panturrilha no leg press',3,'15-20',NULL);


-- A4: Peito + Costas (Sexta)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'A4 — Peito + Costas',
  'Semana A | Sexta | Aquec: Supino articulado 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Abdominal infra c/ caneleira 3x15'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A4 — Peito + Costas' LIMIT 1),1,'Supino articulado máquina (anilhas)',4,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A4 — Peito + Costas' LIMIT 1),2,'Puxada neutra (triângulo)',4,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A4 — Peito + Costas' LIMIT 1),3,'Cross polia alta',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A4 — Peito + Costas' LIMIT 1),4,'Remada curvada barra (pegada pronada)',3,'10-12','LOMBAR NEUTRA OBRIGATÓRIA. Monitorar dor lombar'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A4 — Peito + Costas' LIMIT 1),5,'Face pull cabo',3,'15-20','OBRIGATÓRIO — postura e saúde do ombro');


-- A5: Ombro + Braços (Sábado)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'A5 — Ombro + Braços',
  'Semana A | Sábado | Aquec: Desenvolvimento máquina 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Abdominal supra 3x20'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A5 — Ombro + Braços' LIMIT 1),1,'Desenvolvimento máquina',3,'10-12','Pegada neutra'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A5 — Ombro + Braços' LIMIT 1),2,'Elevação lateral cabo',4,'15-20',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A5 — Ombro + Braços' LIMIT 1),3,'Posterior ombro máquina',3,'15-20',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A5 — Ombro + Braços' LIMIT 1),4,'Rosca martelo halter',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='A5 — Ombro + Braços' LIMIT 1),5,'Tríceps polia pegada invertida',3,'12-15',NULL);


-- ══════════════════════════════════════════════════════
-- SEMANA B — FOCO INFERIOR
-- ══════════════════════════════════════════════════════

-- B1: Perna Pesada (Segunda)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'B1 — Perna Pesada',
  'Semana B | Segunda | Aquec: Leg press 45° 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Abdominal infra c/ caneleira 3x15'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B1 — Perna Pesada' LIMIT 1),1,'Leg press 45°',5,'10-12','Sessão de foco — progredir carga. Monitorar joelho direito'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B1 — Perna Pesada' LIMIT 1),2,'Cadeira extensora',4,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B1 — Perna Pesada' LIMIT 1),3,'Mesa flexora',4,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B1 — Perna Pesada' LIMIT 1),4,'Stiff halter (amplitude controlada)',3,'12-15','LOMBAR NEUTRA. Amplitude até a tensão — não forçar além do conforto'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B1 — Perna Pesada' LIMIT 1),5,'Panturrilha no leg press',4,'15-20',NULL);


-- B2: Costas + Bíceps (Terça)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'B2 — Costas + Bíceps',
  'Semana B | Terça | Aquec: Remada curvada 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Oblíquo cabo 3x15 cada lado'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B2 — Costas + Bíceps' LIMIT 1),1,'Remada curvada barra (pegada pronada)',3,'10-12','LOMBAR NEUTRA OBRIGATÓRIA. Monitorar dor lombar'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B2 — Costas + Bíceps' LIMIT 1),2,'Puxada pronada (barra larga)',3,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B2 — Costas + Bíceps' LIMIT 1),3,'Remada máquina (pegada pronada)',3,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B2 — Costas + Bíceps' LIMIT 1),4,'Face pull cabo',3,'15-20','OBRIGATÓRIO — postura e saúde do ombro'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B2 — Costas + Bíceps' LIMIT 1),5,'Rosca concentrada halter',3,'12-15',NULL);


-- B3: Perna + Glúteo (Quarta)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'B3 — Perna + Glúteo',
  'Semana B | Quarta | Aquec: Leg press 45° 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Abdominal infra c/ caneleira 3x15'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B3 — Perna + Glúteo' LIMIT 1),1,'Leg press 45°',4,'10-12','Monitorar joelho direito'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B3 — Perna + Glúteo' LIMIT 1),2,'Búlgaro halter',3,'10-12','MONITORAR JOELHO DIREITO — se dor, substituir por cadeira extensora unilateral'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B3 — Perna + Glúteo' LIMIT 1),3,'Cadeira adutora',3,'15-20',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B3 — Perna + Glúteo' LIMIT 1),4,'Elevação pélvica máquina',4,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B3 — Perna + Glúteo' LIMIT 1),5,'Panturrilha no leg press',3,'15-20',NULL);


-- B4: Peito + Tríceps (Sexta)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'B4 — Peito + Tríceps',
  'Semana B | Sexta | Aquec: Supino máquina 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Abdominal supra 3x20'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B4 — Peito + Tríceps' LIMIT 1),1,'Supino máquina sentado',3,'8-10','Semana B — volume reduzido. Manter qualidade'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B4 — Peito + Tríceps' LIMIT 1),2,'Supino inclinado halter',3,'10-12',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B4 — Peito + Tríceps' LIMIT 1),3,'Cross polia alta',2,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B4 — Peito + Tríceps' LIMIT 1),4,'Tríceps corda polia alta',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B4 — Peito + Tríceps' LIMIT 1),5,'Tríceps testa barra W',3,'10-12',NULL);


-- B5: Perna + Ombro (Sábado)
INSERT INTO treinos (aluno_id, nome, descricao) VALUES (
  (SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1),
  'B5 — Perna + Ombro',
  'Semana B | Sábado | Aquec: Cadeira extensora 1x15(50%)+1x10(70%) | Final: Prancha 3xfalha + Oblíquo cabo 3x15 cada lado'
);
INSERT INTO exercicios (treino_id, ordem, nome, series, reps, obs) VALUES
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B5 — Perna + Ombro' LIMIT 1),1,'Cadeira extensora',4,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B5 — Perna + Ombro' LIMIT 1),2,'Mesa flexora',3,'12-15',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B5 — Perna + Ombro' LIMIT 1),3,'Desenvolvimento máquina',3,'10-12','Pegada neutra'),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B5 — Perna + Ombro' LIMIT 1),4,'Elevação lateral halter',3,'15-20',NULL),
((SELECT id FROM treinos WHERE aluno_id=(SELECT id FROM alunos WHERE nome='Eduardo' ORDER BY criado_em DESC LIMIT 1) AND nome='B5 — Perna + Ombro' LIMIT 1),5,'Posterior ombro máquina',3,'15-20',NULL);
