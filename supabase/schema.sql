-- Run this in the Supabase SQL editor

-- Profiles (includes avatar_url for profile images)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
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

-- Photos from past events
create table if not exists public.event_photos (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  photo_url text not null,
  caption text,
  created_at timestamptz default now()
);

-- Bands
create table if not exists public.bands (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  genre text,
  description text,
  website text,
  created_at timestamptz default now()
);

-- RSVPs
create table if not exists public.rsvps (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  status text default 'going' check (status in ('going', 'maybe', 'not_going')),
  created_at timestamptz default now(),
  unique(event_id, user_id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_photos enable row level security;
alter table public.bands enable row level security;
alter table public.rsvps enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Events are viewable by everyone" on public.events for select using (true);
create policy "Authenticated users can create events" on public.events for insert with check (auth.uid() = user_id);
create policy "Users can update own events" on public.events for update using (auth.uid() = user_id);
create policy "Users can delete own events" on public.events for delete using (auth.uid() = user_id);

create policy "Event photos are viewable by everyone" on public.event_photos for select using (true);
create policy "Authenticated users can upload photos" on public.event_photos for insert with check (auth.uid() = user_id);
create policy "Users can delete own photos" on public.event_photos for delete using (auth.uid() = user_id);

create policy "Bands are viewable by everyone" on public.bands for select using (true);
create policy "Authenticated users can create bands" on public.bands for insert with check (auth.uid() = user_id);
create policy "Users can update own bands" on public.bands for update using (auth.uid() = user_id);
create policy "Users can delete own bands" on public.bands for delete using (auth.uid() = user_id);

create policy "RSVPs are viewable by everyone" on public.rsvps for select using (true);
create policy "Authenticated users can create rsvps" on public.rsvps for insert with check (auth.uid() = user_id);
create policy "Users can update own rsvps" on public.rsvps for update using (auth.uid() = user_id);
create policy "Users can delete own rsvps" on public.rsvps for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket for avatars and event photos (run in Supabase dashboard or SQL)
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- insert into storage.buckets (id, name, public) values ('event-photos', 'event-photos', true);
