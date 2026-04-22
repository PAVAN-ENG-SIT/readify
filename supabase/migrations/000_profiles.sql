-- ═══════════════════════════════════════════════════════════
-- READIFY — 000 Profiles Migration (Layer 2)
-- ═══════════════════════════════════════════════════════════

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  avatar_url text,
  timezone text default 'UTC',
  reading_preferences jsonb default '{}'::jsonb,
  onboarded boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Trigger for handling new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if it exists first
drop trigger if exists on_auth_user_created on auth.users;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
