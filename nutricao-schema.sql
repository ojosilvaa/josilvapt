-- ═══ NUTRIÇÃO — executar no Supabase SQL Editor ═══

-- Refeições com análise calórica por IA
create table if not exists refeicoes (
  id             uuid primary key default gen_random_uuid(),
  aluno_id       uuid references alunos(id) on delete cascade,
  data           date not null default current_date,
  tipo           text check (tipo in ('foto','audio','texto')),
  descricao_usuario text,
  calorias       integer,
  proteina       numeric(6,1),
  carboidratos   numeric(6,1),
  gordura        numeric(6,1),
  descricao_ia   text,
  criado_em      timestamptz default now()
);
alter table refeicoes enable row level security;
create policy "allow_all_refeicoes" on refeicoes for all using (true) with check (true);

-- Configurações globais (partilha chave IA com o lado aluno)
create table if not exists configuracoes (
  chave text primary key,
  valor text
);
alter table configuracoes enable row level security;
create policy "allow_all_configuracoes" on configuracoes for all using (true) with check (true);
