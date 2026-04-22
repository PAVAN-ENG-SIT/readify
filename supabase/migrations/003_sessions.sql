-- ═══════════════════════════════════════════════════════════
-- READIFY — 003 Sessions Migration (Layer 4)
-- ═══════════════════════════════════════════════════════════

create table if not exists public.reading_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  status text default 'active' check (status in ('active', 'completed', 'abandoned', 'crashed')),
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone,
  pages_read integer default 0,
  start_page integer not null,
  end_page integer,
  duration_seconds integer default 0,
  idle_seconds integer default 0,
  last_heartbeat timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text,
  topic_tags text[] default '{}',
  chapter_range text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reading_sessions enable row level security;

create policy "Users can view their own sessions." on public.reading_sessions
  for select using (auth.uid() = user_id);
create policy "Users can insert their own sessions." on public.reading_sessions
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own sessions." on public.reading_sessions
  for update using (auth.uid() = user_id);
