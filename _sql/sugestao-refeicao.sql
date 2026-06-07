-- ═══════════════════════════════════════════════════════════
-- Jo Silva PT — Módulo de Sugestão de Refeição Inteligente
-- Execute este script no SQL Editor do Supabase Dashboard
-- ═══════════════════════════════════════════════════════════

-- ─── TABELA: alimentos ────────────────────────────────────
create table if not exists alimentos (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  categoria       text not null check (categoria in ('proteína','carbo','fibra','gordura')),
  calorias_100g   numeric(6,1) not null,
  proteina_100g   numeric(5,1) not null default 0,
  carbo_100g      numeric(5,1) not null default 0,
  gordura_100g    numeric(5,1) not null default 0
);

-- ─── TABELA: receitas ─────────────────────────────────────
create table if not exists receitas (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  instrucoes    text,
  base_proteina text,
  base_carbo    text
);

-- ─── RLS: alimentos ───────────────────────────────────────
alter table alimentos enable row level security;

drop policy if exists "select_all"  on alimentos;
drop policy if exists "admin_all"   on alimentos;

create policy "select_all" on alimentos
  for select using (true);

create policy "admin_all" on alimentos
  for all to authenticated using (true) with check (true);

-- ─── RLS: receitas ────────────────────────────────────────
alter table receitas enable row level security;

drop policy if exists "select_all"  on receitas;
drop policy if exists "admin_all"   on receitas;

create policy "select_all" on receitas
  for select using (true);

create policy "admin_all" on receitas
  for all to authenticated using (true) with check (true);

-- ─── SEED: alimentos (20 alimentos comuns) ────────────────
-- Limpa dados existentes para evitar duplicados no re-run
delete from alimentos;

insert into alimentos (nome, categoria, calorias_100g, proteina_100g, carbo_100g, gordura_100g) values
  -- PROTEÍNAS
  ('Frango (peito grelhado)',   'proteína', 165.0, 31.0,  0.0, 3.6),
  ('Carne de Porco (lombo)',    'proteína', 143.0, 22.0,  0.0, 6.0),
  ('Tilápia grelhada',          'proteína',  96.0, 20.0,  0.0, 1.7),
  ('Ovo inteiro cozido',        'proteína', 155.0, 13.0,  1.1,11.0),
  ('Atum (lata, natural)',      'proteína', 116.0, 26.0,  0.0, 0.5),
  ('Carne bovina (patinho)',    'proteína', 219.0, 29.0,  0.0,11.0),
  -- CARBOIDRATOS
  ('Arroz branco cozido',       'carbo',    130.0,  2.7, 28.0, 0.3),
  ('Feijão preto cozido',       'carbo',    127.0,  8.7, 23.0, 0.5),
  ('Batata doce cozida',        'carbo',     86.0,  1.6, 20.0, 0.1),
  ('Cuscuz de milho',           'carbo',    112.0,  2.2, 24.0, 0.7),
  ('Macarrão cozido',           'carbo',    131.0,  5.0, 25.0, 1.1),
  ('Aveia em flocos',           'carbo',    389.0, 17.0, 66.0, 7.0),
  ('Banana',                    'carbo',     89.0,  1.1, 23.0, 0.3),
  ('Mandioca cozida',           'carbo',    125.0,  0.6, 30.0, 0.3),
  -- FIBRAS & LEGUMES
  ('Alface',                    'fibra',     15.0,  1.3,  2.9, 0.2),
  ('Brócolis cozido',           'fibra',     55.0,  3.7, 11.0, 0.6),
  ('Cenoura crua',              'fibra',     41.0,  0.9, 10.0, 0.2),
  ('Tomate',                    'fibra',     18.0,  0.9,  3.9, 0.2),
  ('Pepino',                    'fibra',     16.0,  0.7,  3.6, 0.1),
  ('Abobrinha cozida',          'fibra',     17.0,  1.2,  3.5, 0.2);
