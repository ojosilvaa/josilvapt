-- RLS policies for Jo Silva PT
-- Run this in the Supabase SQL editor.
-- Authenticated = admin (personal trainer logged in via Supabase Auth)
-- Anon = aluno accessing via link (no login)

-- ─── ALUNOS ───────────────────────────────────────────────────────────────
alter table alunos enable row level security;

drop policy if exists "admin_all" on alunos;
drop policy if exists "anon_select" on alunos;

create policy "admin_all" on alunos
  for all to authenticated using (true) with check (true);

create policy "anon_select" on alunos
  for select to anon using (true);

-- ─── TREINOS ──────────────────────────────────────────────────────────────
alter table treinos enable row level security;

drop policy if exists "admin_all" on treinos;
drop policy if exists "anon_select" on treinos;

create policy "admin_all" on treinos
  for all to authenticated using (true) with check (true);

create policy "anon_select" on treinos
  for select to anon using (true);

-- ─── EXERCICIOS ───────────────────────────────────────────────────────────
alter table exercicios enable row level security;

drop policy if exists "admin_all" on exercicios;
drop policy if exists "anon_select" on exercicios;

create policy "admin_all" on exercicios
  for all to authenticated using (true) with check (true);

create policy "anon_select" on exercicios
  for select to anon using (true);

-- ─── SESSOES ──────────────────────────────────────────────────────────────
alter table sessoes enable row level security;

drop policy if exists "admin_all" on sessoes;
drop policy if exists "anon_select" on sessoes;
drop policy if exists "anon_insert" on sessoes;

create policy "admin_all" on sessoes
  for all to authenticated using (true) with check (true);

create policy "anon_select" on sessoes
  for select to anon using (true);

create policy "anon_insert" on sessoes
  for insert to anon with check (true);

-- ─── SESSAO_CARGAS ────────────────────────────────────────────────────────
alter table sessao_cargas enable row level security;

drop policy if exists "admin_all" on sessao_cargas;
drop policy if exists "anon_select" on sessao_cargas;
drop policy if exists "anon_insert" on sessao_cargas;

create policy "admin_all" on sessao_cargas
  for all to authenticated using (true) with check (true);

create policy "anon_select" on sessao_cargas
  for select to anon using (true);

create policy "anon_insert" on sessao_cargas
  for insert to anon with check (true);

-- ─── FEEDBACKS ────────────────────────────────────────────────────────────
alter table feedbacks enable row level security;

drop policy if exists "admin_all" on feedbacks;
drop policy if exists "anon_insert" on feedbacks;

create policy "admin_all" on feedbacks
  for all to authenticated using (true) with check (true);

create policy "anon_insert" on feedbacks
  for insert to anon with check (true);

-- ─── PERIMETRIA ───────────────────────────────────────────────────────────
alter table perimetria enable row level security;

drop policy if exists "admin_all" on perimetria;

create policy "admin_all" on perimetria
  for all to authenticated using (true) with check (true);

-- ─── ANAMNESE ─────────────────────────────────────────────────────────────
alter table anamnese enable row level security;

drop policy if exists "admin_all" on anamnese;

create policy "admin_all" on anamnese
  for all to authenticated using (true) with check (true);
