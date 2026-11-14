-- Lakes Dance tables for shared Supabase project
-- Run this in the SQL Editor of KristineMK72's Project
-- (Safe to run alongside existing tables like party_rsvps)

-- Profiles
create table if not exists public.lakes_profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

-- Dance events
create table if not exists public.lakes_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.lakes_profiles(id) on delete cascade,
  title text not null,
  description text,
  location text,
  start_time timestamptz not null,
  end_time timestamptz,
  dance_style text,
  image_url text,
  created_at timestamptz default now()
);

-- Photos from past events
create table if not exists public.lakes_event_photos (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.lakes_events(id) on delete cascade,
  user_id uuid references public.lakes_profiles(id) on delete cascade,
  photo_url text not null,
  caption text,
  created_at timestamptz default now()
);

-- Bands
create table if not exists public.lakes_bands (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.lakes_profiles(id) on delete cascade,
  name text not null,
  genre text,
  description text,
  website text,
  created_at timestamptz default now()
);

-- RSVPs
create table if not exists public.lakes_rsvps (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.lakes_events(id) on delete cascade,
  user_id uuid references public.lakes_profiles(id) on delete cascade,
  status text default 'going' check (status in ('going', 'maybe', 'not_going')),
  created_at timestamptz default now(),
  unique(event_id, user_id)
);

-- Enable RLS
alter table public.lakes_profiles enable row level security;
alter table public.lakes_events enable row level security;
alter table public.lakes_event_photos enable row level security;
alter table public.lakes_bands enable row level security;
alter table public.lakes_rsvps enable row level security;

-- Policies
create policy "Public lakes profiles are viewable by everyone" on public.lakes_profiles for select using (true);
create policy "Users can insert own lakes profile" on public.lakes_profiles for insert with check (auth.uid() = id);
create policy "Users can update own lakes profile" on public.lakes_profiles for update using (auth.uid() = id);

create policy "Lakes events are viewable by everyone" on public.lakes_events for select using (true);
create policy "Authenticated users can create lakes events" on public.lakes_events for insert with check (auth.uid() = user_id);
create policy "Users can update own lakes events" on public.lakes_events for update using (auth.uid() = user_id);
create policy "Users can delete own lakes events" on public.lakes_events for delete using (auth.uid() = user_id);

create policy "Lakes event photos are viewable by everyone" on public.lakes_event_photos for select using (true);
create policy "Authenticated users can upload lakes photos" on public.lakes_event_photos for insert with check (auth.uid() = user_id);
create policy "Users can delete own lakes photos" on public.lakes_event_photos for delete using (auth.uid() = user_id);

create policy "Lakes bands are viewable by everyone" on public.lakes_bands for select using (true);
create policy "Authenticated users can create lakes bands" on public.lakes_bands for insert with check (auth.uid() = user_id);
create policy "Users can update own lakes bands" on public.lakes_bands for update using (auth.uid() = user_id);
create policy "Users can delete own lakes bands" on public.lakes_bands for delete using (auth.uid() = user_id);

create policy "Lakes RSVPs are viewable by everyone" on public.lakes_rsvps for select using (true);
create policy "Authenticated users can create lakes rsvps" on public.lakes_rsvps for insert with check (auth.uid() = user_id);
create policy "Users can update own lakes rsvps" on public.lakes_rsvps for update using (auth.uid() = user_id);
create policy "Users can delete own lakes rsvps" on public.lakes_rsvps for delete using (auth.uid() = user_id);

-- Auto-create lakes profile on signup
create or replace function public.handle_new_lakes_user()
returns trigger as $$
begin
  insert into public.lakes_profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Only create the trigger if it doesn't already exist
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created_lakes') then
    create trigger on_auth_user_created_lakes
      after insert on auth.users
      for each row execute procedure public.handle_new_lakes_user();
  end if;
end $$;
