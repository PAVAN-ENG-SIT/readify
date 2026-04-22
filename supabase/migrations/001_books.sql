-- ═══════════════════════════════════════════════════════════
-- READIFY — 001 Books Migration (Layer 3)
-- ═══════════════════════════════════════════════════════════

create table if not exists public.books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text,
  cover_url text,
  total_pages integer,
  total_chapters integer,
  chapter_titles text[] default '{}',
  description text,
  genre text[] default '{}',
  isbn text,
  source text default 'google',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.user_books (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  book_id uuid references public.books on delete cascade not null,
  status text default 'paused' check (status in ('reading', 'completed', 'paused', 'abandoned')),
  current_page integer default 0,
  current_chapter integer default 0,
  progress_percent numeric default 0,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  unique(user_id, book_id)
);

alter table public.books enable row level security;
alter table public.user_books enable row level security;

create policy "Books are viewable by everyone." on public.books
  for select using (true);
create policy "Users can insert books." on public.books
  for insert with check (true);

create policy "Users can view their own user_books." on public.user_books
  for select using (auth.uid() = user_id);
create policy "Users can insert their own user_books." on public.user_books
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own user_books." on public.user_books
  for update using (auth.uid() = user_id);
create policy "Users can delete their own user_books." on public.user_books
  for delete using (auth.uid() = user_id);
