-- Run this in Supabase SQL Editor
create table if not exists players (
  id bigserial primary key,
  license text,
  steam text,
  discord text,
  rockstar text,
  name text,
  first_seen timestamptz default now(),
  last_seen timestamptz default now(),
  trust_score numeric default 50
);

create table if not exists events (
  id bigserial primary key,
  player_id bigint references players(id) on delete set null,
  server_name text,
  code text not null,
  severity text default 'info',
  detail jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_events_created_at on events(created_at desc);

create table if not exists bans (
  id bigserial primary key,
  player_id bigint references players(id) on delete cascade,
  reason text,
  created_by text,
  created_at timestamptz default now(),
  revoked_at timestamptz
);

-- Enable Realtime for these tables (Dashboard > Database > Replication in Supabase)
-- Then add Row Level Security policies:

alter table players enable row level security;
alter table events enable row level security;
alter table bans enable row level security;

-- Policies: allow read to authenticated users
create policy "read players" on players for select to authenticated using (true);
create policy "read events" on events for select to authenticated using (true);
create policy "read bans" on bans for select to authenticated using (true);

-- Writes are done from server via service role; no public insert.
