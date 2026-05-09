-- Tabela de feedbacks pós-sessão
create table if not exists feedbacks (
  id uuid primary key default gen_random_uuid(),
  sessao_id uuid references sessoes(id) on delete cascade,
  aluno_id uuid references alunos(id) on delete cascade,
  estrelas integer check (estrelas between 1 and 5),
  humor text,
  esforco text,
  mensagem text,
  lido boolean default false,
  data date,
  criado_em timestamptz default now()
);

alter table feedbacks enable row level security;

create policy "allow_all_feedbacks"
  on feedbacks for all
  using (true)
  with check (true);
