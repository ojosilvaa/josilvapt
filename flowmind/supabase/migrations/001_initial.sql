-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  monthly_income decimal(10,2) default 1500,
  currency text default 'EUR',
  locale text default 'pt-PT',
  onboarding_completed boolean default false,
  goal_type text,
  created_at timestamptz default now()
);

-- TRANSACTIONS
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount decimal(10,2) not null check (amount > 0),
  description text not null,
  category text not null,
  subcategory text,
  source text default 'manual' check (source in ('manual', 'ocr', 'voice', 'auto')),
  date date not null default current_date,
  emotional_state text check (emotional_state in ('happy', 'neutral', 'guilty', 'impulsive', 'anxious')),
  emotional_note text,
  is_income boolean default false,
  created_at timestamptz default now()
);

-- GOALS
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  target_amount decimal(10,2) not null,
  current_amount decimal(10,2) default 0,
  deadline date,
  goal_type text default 'other',
  color text default '#00C896',
  is_completed boolean default false,
  created_at timestamptz default now()
);

-- GOAL DEPOSITS
create table public.goal_deposits (
  id uuid default uuid_generate_v4() primary key,
  goal_id uuid references public.goals(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount decimal(10,2) not null,
  note text,
  created_at timestamptz default now()
);

-- MONTHLY BUDGETS
create table public.budgets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category text not null,
  limit_amount decimal(10,2) not null,
  month int not null check (month between 1 and 12),
  year int not null,
  created_at timestamptz default now(),
  unique(user_id, category, month, year)
);

-- DEBTS
create table public.debts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  total_amount decimal(10,2) not null,
  remaining_amount decimal(10,2) not null,
  monthly_payment decimal(10,2) not null,
  interest_rate decimal(5,2) default 0,
  due_day int check (due_day between 1 and 31),
  debt_type text default 'other',
  priority int default 1,
  is_paid boolean default false,
  created_at timestamptz default now()
);

-- BILLS (contas recorrentes)
create table public.bills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  amount decimal(10,2) not null,
  due_day int not null check (due_day between 1 and 31),
  recurrence text default 'monthly',
  icon text default '💳',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- GAMIFICATION
create table public.gamification (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  xp int default 0,
  level int default 1,
  streak int default 0,
  longest_streak int default 0,
  last_active_date date,
  badges text[] default '{}',
  created_at timestamptz default now()
);

-- NOTIFICATIONS
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- INDEXES
create index idx_transactions_user_date on public.transactions(user_id, date desc);
create index idx_transactions_category on public.transactions(user_id, category);
create index idx_goals_user on public.goals(user_id);
create index idx_debts_user on public.debts(user_id);
create index idx_gamification_user on public.gamification(user_id);

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;
alter table public.goal_deposits enable row level security;
alter table public.budgets enable row level security;
alter table public.debts enable row level security;
alter table public.bills enable row level security;
alter table public.gamification enable row level security;
alter table public.notifications enable row level security;

-- RLS POLICIES
create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users manage own transactions" on public.transactions for all using (auth.uid() = user_id);
create policy "Users manage own goals" on public.goals for all using (auth.uid() = user_id);
create policy "Users manage own goal deposits" on public.goal_deposits for all using (auth.uid() = user_id);
create policy "Users manage own budgets" on public.budgets for all using (auth.uid() = user_id);
create policy "Users manage own debts" on public.debts for all using (auth.uid() = user_id);
create policy "Users manage own bills" on public.bills for all using (auth.uid() = user_id);
create policy "Users manage own gamification" on public.gamification for all using (auth.uid() = user_id);
create policy "Users manage own notifications" on public.notifications for all using (auth.uid() = user_id);

-- TRIGGER: criar perfil e gamification ao registar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Utilizador'), new.email);
  insert into public.gamification (user_id, last_active_date)
  values (new.id, current_date);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- TRIGGER: atualizar streak
create or replace function public.update_streak(p_user_id uuid)
returns void as $$
declare
  v_last_date date;
  v_streak int;
begin
  select last_active_date, streak into v_last_date, v_streak
  from public.gamification where user_id = p_user_id;
  if v_last_date = current_date - 1 then
    update public.gamification
    set streak = streak + 1, last_active_date = current_date,
        longest_streak = greatest(longest_streak, streak + 1)
    where user_id = p_user_id;
  elsif v_last_date < current_date - 1 then
    update public.gamification
    set streak = 1, last_active_date = current_date
    where user_id = p_user_id;
  end if;
end;
$$ language plpgsql security definer;
