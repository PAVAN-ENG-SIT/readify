-- ═══════════════════════════════════════════════════════════
-- READIFY — 004 Contracts Migration (Layer 6)
-- ═══════════════════════════════════════════════════════════

create table if not exists public.reading_contracts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  status text default 'active' check (status in ('active', 'completed', 'broken', 'paused')),
  commitment_days integer default 30,
  daily_target_pages integer,
  daily_target_minutes integer,
  enforcement_mode text default 'soft' check (enforcement_mode in ('soft', 'strict')),
  start_date timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, book_id)
);

alter table public.reading_contracts enable row level security;

create policy "Users can view their own contracts." on public.reading_contracts
  for select using (auth.uid() = user_id);
create policy "Users can insert their own contracts." on public.reading_contracts
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own contracts." on public.reading_contracts
  for update using (auth.uid() = user_id);
