create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Pejuang PTN',
  target_ptn text,
  target_major text,
  target_score numeric(6,2) check (target_score is null or (target_score >= 0 and target_score <= 1000)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tryout_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  score numeric(6,2) not null check (score >= 0 and score <= 1000),
  taken_on date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_key text not null check (char_length(quiz_key) between 1 and 100),
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  accuracy numeric(5,2) generated always as ((score::numeric / total::numeric) * 100) stored,
  created_at timestamptz not null default now()
);

create index if not exists tryout_attempts_user_date_idx on public.tryout_attempts(user_id, taken_on desc, created_at desc);
create index if not exists quiz_attempts_user_date_idx on public.quiz_attempts(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.tryout_attempts enable row level security;
alter table public.quiz_attempts enable row level security;

drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = id);
create policy profiles_update_own on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists tryout_select_own on public.tryout_attempts;
drop policy if exists tryout_insert_own on public.tryout_attempts;
drop policy if exists tryout_delete_own on public.tryout_attempts;
create policy tryout_select_own on public.tryout_attempts for select using (auth.uid() = user_id);
create policy tryout_insert_own on public.tryout_attempts for insert with check (auth.uid() = user_id);
create policy tryout_delete_own on public.tryout_attempts for delete using (auth.uid() = user_id);

drop policy if exists quiz_select_own on public.quiz_attempts;
drop policy if exists quiz_insert_own on public.quiz_attempts;
create policy quiz_select_own on public.quiz_attempts for select using (auth.uid() = user_id);
create policy quiz_insert_own on public.quiz_attempts for insert with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles(id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Pejuang PTN'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
