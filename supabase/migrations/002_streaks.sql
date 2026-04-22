-- ═══════════════════════════════════════════════════════════
-- READIFY — 002 Streaks Migration (Layer 7)
-- ═══════════════════════════════════════════════════════════

create table if not exists public.streaks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity_date date,
  streak_breaks integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.streak_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  activity_date date not null,
  pages_read integer default 0,
  duration_seconds integer default 0,
  unique(user_id, activity_date)
);

alter table public.streaks enable row level security;
alter table public.streak_logs enable row level security;

create policy "Users can view their own streaks." on public.streaks for select using (auth.uid() = user_id);
create policy "Users can view their own streak_logs." on public.streak_logs for select using (auth.uid() = user_id);
