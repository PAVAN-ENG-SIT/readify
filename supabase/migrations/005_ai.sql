-- ═══════════════════════════════════════════════════════════
-- READIFY — 005 AI Support Migration (Layer 8)
-- ═══════════════════════════════════════════════════════════

create table if not exists public.ai_summaries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  session_id uuid references public.reading_sessions on delete set null,
  summary_text text not null,
  source_type text default 'session' check (source_type in ('session', 'book', 'insight')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_summaries enable row level security;
create policy "Users can view their own ai_summaries." on public.ai_summaries for select using (auth.uid() = user_id);
