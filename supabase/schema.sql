-- Run this in the Supabase SQL editor

-- Profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Dance events
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  location text,
  start_time timestamptz not null,
  end_time timestamptz,
  dance_style text,
  image_url text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.events enable row level security;

-- Policies (basic - expand later)
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Events are viewable by everyone" on public.events for select using (true);
create policy "Authenticated users can create events" on public.events for insert with check (auth.uid() = user_id);
create policy "Users can update own events" on public.events for update using (auth.uid() = user_id);
create policy "Users can delete own events" on public.events for delete using (auth.uid() = user_id);
