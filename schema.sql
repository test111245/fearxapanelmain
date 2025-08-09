-- Add to previous schema: server_keys table
create table if not exists server_keys (
  key text primary key,
  user_name text,
  status text default 'pending',
  server_name text,
  created_at timestamptz default now(),
  connected_at timestamptz
);
alter table server_keys enable row level security;
create policy "read keys" on server_keys for select to authenticated using (true);
create policy "write keys" on server_keys for insert to service_role using (true);
create policy "update keys" on server_keys for update to service_role using (true);
