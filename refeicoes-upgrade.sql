-- ═══════════════════════════════════════════════════════════
-- Jo Silva PT — Upgrade do sistema de refeições
-- Execute no SQL Editor do Supabase Dashboard
-- ═══════════════════════════════════════════════════════════

-- ─── Adicionar tipo_refeicao à tabela refeicoes ───────────
ALTER TABLE refeicoes
  ADD COLUMN IF NOT EXISTS tipo_refeicao text DEFAULT 'Refeição';

-- ─── TABELA: refeicao_itens ───────────────────────────────
-- Armazena cada alimento individual dentro de uma refeição
CREATE TABLE IF NOT EXISTS refeicao_itens (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  refeicao_id uuid NOT NULL REFERENCES refeicoes(id) ON DELETE CASCADE,
  alimento_id uuid REFERENCES alimentos(id),
  nome        text NOT NULL,
  gramas      numeric(6,1) NOT NULL,
  calorias    numeric(6,1) NOT NULL DEFAULT 0,
  proteina    numeric(5,1) NOT NULL DEFAULT 0,
  carbo       numeric(5,1) NOT NULL DEFAULT 0,
  gordura     numeric(5,1) NOT NULL DEFAULT 0
);

-- ─── RLS: refeicao_itens ──────────────────────────────────
ALTER TABLE refeicao_itens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select" ON refeicao_itens;
DROP POLICY IF EXISTS "anon_insert" ON refeicao_itens;
DROP POLICY IF EXISTS "anon_delete" ON refeicao_itens;
DROP POLICY IF EXISTS "admin_all"   ON refeicao_itens;

CREATE POLICY "anon_select" ON refeicao_itens
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert" ON refeicao_itens
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_delete" ON refeicao_itens
  FOR DELETE TO anon USING (true);

CREATE POLICY "admin_all" ON refeicao_itens
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── RLS: refeicoes (garantir anon pode inserir/apagar) ───
DROP POLICY IF EXISTS "anon_insert" ON refeicoes;
DROP POLICY IF EXISTS "anon_delete" ON refeicoes;
DROP POLICY IF EXISTS "anon_select" ON refeicoes;

CREATE POLICY "anon_select" ON refeicoes
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert" ON refeicoes
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_delete" ON refeicoes
  FOR DELETE TO anon USING (true);

-- ─── SEED: mais alimentos (expande para ~50) ──────────────
-- Apenas insere se ainda não existem (baseado no nome)
INSERT INTO alimentos (nome, categoria, calorias_100g, proteina_100g, carbo_100g, gordura_100g)
SELECT v.nome, v.categoria, v.calorias_100g, v.proteina_100g, v.carbo_100g, v.gordura_100g
FROM (VALUES
  -- PROTEÍNAS adicionais
  ('Frango (coxa s/ pele)',    'proteína', 145.0, 18.5,  0.0,  7.4),
  ('Sardinha grelhada',        'proteína', 130.0, 21.1,  0.0,  4.4),
  ('Salmão grelhado',          'proteína', 206.0, 25.4,  0.0, 12.4),
  ('Camarão cozido',           'proteína',  99.0, 20.6,  0.0,  1.7),
  ('Peito de peru',            'proteína', 135.0, 29.0,  0.0,  1.9),
  ('Queijo cottage',           'proteína',  98.0, 11.1,  2.7,  4.5),
  ('Iogurte grego natural',    'proteína',  97.0,  9.9,  4.1,  5.2),
  ('Lentilha cozida',          'proteína', 116.0,  9.0, 20.0,  0.4),
  ('Grão de bico cozido',      'proteína', 164.0,  9.0, 27.0,  2.6),
  -- CARBOIDRATOS adicionais
  ('Pão integral (fatia)',     'carbo',    250.0,  9.5, 47.0,  2.5),
  ('Tapioca (goma crua)',      'carbo',    358.0,  0.2, 87.0,  0.0),
  ('Quinoa cozida',            'carbo',    120.0,  4.4, 21.3,  1.9),
  ('Milho cozido',             'carbo',     99.0,  3.3, 19.8,  1.2),
  ('Granola',                  'carbo',    395.0, 10.4, 65.8,  8.4),
  ('Macarrão integral cozido', 'carbo',    124.0,  5.5, 24.0,  0.8),
  -- FIBRAS adicionais
  ('Espinafre cozido',         'fibra',     23.0,  2.9,  3.6,  0.4),
  ('Chuchu cozido',            'fibra',     24.0,  0.9,  4.9,  0.3),
  ('Couve-flor cozida',        'fibra',     25.0,  2.5,  5.0,  0.3),
  ('Beterraba cozida',         'fibra',     43.0,  1.7, 10.0,  0.1),
  ('Couve refogada',           'fibra',     37.0,  3.2,  5.8,  0.7),
  ('Maçã',                    'carbo',     59.0,  0.3, 15.2,  0.2),
  ('Laranja',                  'carbo',     47.0,  1.0, 11.7,  0.2),
  ('Morango',                  'fibra',     32.0,  0.8,  7.7,  0.3),
  -- GORDURAS BOAS
  ('Amendoim torrado',         'gordura',  567.0, 25.8, 15.8, 49.9),
  ('Castanha de caju',         'gordura',  553.0, 18.2, 32.7, 43.9),
  ('Abacate',                  'gordura',  160.0,  2.0,  8.5, 14.7)
) AS v(nome, categoria, calorias_100g, proteina_100g, carbo_100g, gordura_100g)
WHERE NOT EXISTS (
  SELECT 1 FROM alimentos WHERE alimentos.nome = v.nome
);
