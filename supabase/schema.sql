-- True Count: one row of saved progress per signed-in user.
-- Run once in the Supabase SQL editor for the project named in config.js.
create table if not exists public.progress (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Newer projects do not expose new tables to the API automatically.
grant select, insert, update on public.progress to authenticated;

create policy "read own progress" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own progress" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own progress" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
