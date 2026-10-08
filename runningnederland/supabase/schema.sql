-- Voorgestelde tabel voor RunningNederland.
-- Heb je al een tabel "events" met andere kolomnamen? Dan hoef je deze niet uit te voeren:
-- pas dan alleen fromRow/toRow aan in src/lib/events.ts.

create table if not exists public.events (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  date          date not null,
  start_time    time,
  place         text not null,
  province      text not null,
  categories    text[] not null default '{}',
  distances     numeric[] not null default '{}',   -- in km, bv. {5,10,21.1}
  price_min     numeric,
  price_max     numeric,
  is_free       boolean not null default false,
  is_kids       boolean not null default false,
  is_relay      boolean not null default false,
  is_certified  boolean not null default false,
  featured      boolean not null default false,    -- uitlichten op de homepage
  cancelled     boolean not null default false,
  editie        text,
  website       text,
  description   text,
  organizer     text,
  image_url     text,
  lat           double precision,
  lng           double precision,
  created_at    timestamptz not null default now()
);

create index if not exists events_date_idx on public.events (date);

-- Beveiliging: iedereen mag lezen, alleen ingelogde beheerders mogen schrijven.
alter table public.events enable row level security;

drop policy if exists "Iedereen mag evenementen lezen" on public.events;
create policy "Iedereen mag evenementen lezen" on public.events
  for select using (true);

drop policy if exists "Ingelogde beheerders mogen schrijven" on public.events;
create policy "Ingelogde beheerders mogen schrijven" on public.events
  for all to authenticated using (true) with check (true);
-- Tip: zet in Supabase → Authentication → Providers "Allow new users to sign up" UIT,
-- en maak je eigen beheerdersaccount aan via Authentication → Users → Add user.
