-- ══════════════════════════════════════════════════════
-- EDUARDO — Medidas corporais (Bioimpedância OMRON BF511)
-- Colar no Supabase SQL Editor e clicar Run
-- Data: 2026-05-11
-- ══════════════════════════════════════════════════════

INSERT INTO perimetria (aluno_id, data, peso, gordura, massa_magra, obs, medidas)
VALUES (
  (SELECT id FROM alunos WHERE nome = 'Eduardo' ORDER BY criado_em DESC LIMIT 1),
  '2026-05-11',
  96.2,
  29.6,
  67.7,
  'Bioimpedância OMRON BF511. Gordura visceral nível 12.',
  '{
    "bio_imc": 29.4,
    "bio_gord_abs": 28.5,
    "bio_gord_visc": 12,
    "bio_tmb": 1959,
    "ombro": 128,
    "torax": 109,
    "cintura": 104,
    "abdomen": 90.5,
    "quadril": 114,
    "braco_e": 38,
    "braco_d": 37.5,
    "braco_flex_e": 40.5,
    "braco_flex_d": 40.5,
    "coxa_e": 65,
    "coxa_d": 64.5,
    "panturrilha_e": 40,
    "panturrilha_d": 39,
    "antebraco_e": 30,
    "antebraco_d": 30
  }'::jsonb
);
