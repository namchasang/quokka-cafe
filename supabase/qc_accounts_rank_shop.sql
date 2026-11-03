-- Quokka Cafe: accounts (Google sign-in), cloud save, world ranking and shop / gift codes
-- Moved over from Magpie Madness (Nov 2026). Run once in the Quokka Cafe Supabase project:
--   Supabase -> SQL Editor -> New query -> paste this file -> Run.  Safe to run again.
-- Also needed (dashboard, not SQL):
--   Authentication -> Sign In / Providers -> Google: ON (client ID + secret from Google Cloud; the same OAuth client
--   as Roo Road / Magpie works if you add this project's callback URL https://xhrptgpzifqscydroiuv.supabase.co/auth/v1/callback)
--   Authentication -> URL Configuration -> Redirect URLs: add https://namchasang.github.io/quokka-cafe/**
create extension if not exists pgcrypto with schema extensions;

-- one row per signed-in player
create table if not exists public.qc_accounts (
  user_id uuid primary key references auth.users on delete cascade,
  nick text check (nick is null or char_length(nick) between 1 and 16),
  owned jsonb not null default '{}'::jsonb,          -- {"supporter":true,"island":true,"pass":true}
  updated_at timestamptz not null default now()
);
alter table public.qc_accounts enable row level security;
drop policy if exists "qc own account" on public.qc_accounts;
create policy "qc own account" on public.qc_accounts for select to authenticated using (user_id = auth.uid());

-- cloud save, one per slot (1-6)
create table if not exists public.qc_cloud (
  user_id uuid not null references auth.users on delete cascade,
  slot int not null check (slot between 1 and 6),
  save jsonb not null check (pg_column_size(save) < 900000),
  day int,
  saved_at timestamptz not null default now(),
  primary key (user_id, slot)
);
alter table public.qc_cloud enable row level security;
drop policy if exists "qc own cloud" on public.qc_cloud;
create policy "qc own cloud" on public.qc_cloud for select to authenticated using (user_id = auth.uid());

-- world ranking (public to read, written only through qc_rank_submit)
create table if not exists public.qc_rank (
  user_id uuid primary key references auth.users on delete cascade,
  nick text not null check (char_length(nick) between 1 and 16),
  island text check (island is null or char_length(island) <= 24),
  best_day int not null default 0,
  served int not null default 0,
  days int not null default 0,
  supporter boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.qc_rank enable row level security;
drop policy if exists "qc ranking is public" on public.qc_rank;
create policy "qc ranking is public" on public.qc_rank for select using (true);

-- codes sold on Payhip (shop packs) or given away (Perth Pass for Magpie Madness buyers). Only SHA-256 hashes are stored.
create table if not exists public.qc_codes (
  hash text primary key,
  kind text not null check (kind in ('pass','pack')),
  item text not null,
  max_devices int not null default 3,
  devices jsonb not null default '[]'::jsonb,
  note text,
  created_at timestamptz not null default now()
);
alter table public.qc_codes enable row level security;   -- no policies: only the functions below can read it

create or replace function public.qc_norm(p text) returns text language sql immutable as
$$ select upper(regexp_replace(coalesce(p,''), '[^A-Za-z0-9]', '', 'g')) $$;

create or replace function public.qc_redeem_code(p_code text, p_device text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare c text := qc_norm(p_code); h text; r qc_codes%rowtype; dev text := left(coalesce(p_device,''), 64);
begin
  if c !~ '^QC[PS][A-Z0-9]{10}$' or dev = '' then return jsonb_build_object('ok', false, 'reason', 'bad'); end if;
  h := encode(extensions.digest('qc-code|' || c, 'sha256'), 'hex');
  select * into r from qc_codes where hash = h for update;
  if not found then return jsonb_build_object('ok', false, 'reason', 'bad'); end if;
  if not (r.devices ? dev) then
    if jsonb_array_length(r.devices) >= r.max_devices then return jsonb_build_object('ok', false, 'reason', 'limit'); end if;
    update qc_codes set devices = devices || to_jsonb(dev) where hash = h;
  end if;
  if auth.uid() is not null then
    insert into qc_accounts (user_id, owned) values (auth.uid(), jsonb_build_object(r.item, true))
      on conflict (user_id) do update set owned = qc_accounts.owned || jsonb_build_object(r.item, true), updated_at = now();
  end if;
  return jsonb_build_object('ok', true, 'kind', r.kind, 'item', r.item);
end $$;

create or replace function public.qc_me()
returns jsonb language plpgsql security definer set search_path = public as $$
declare a qc_accounts%rowtype; s jsonb;
begin
  if auth.uid() is null then return null; end if;
  insert into qc_accounts (user_id) values (auth.uid()) on conflict do nothing;
  select * into a from qc_accounts where user_id = auth.uid();
  select coalesce(jsonb_agg(jsonb_build_object('slot', slot, 'day', day, 'saved_at', saved_at) order by slot), '[]'::jsonb) into s from qc_cloud where user_id = auth.uid();
  return jsonb_build_object('nick', a.nick, 'owned', a.owned, 'saves', s);
end $$;

create or replace function public.qc_set_nick(p_nick text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare n text := left(regexp_replace(trim(coalesce(p_nick,'')), '[^A-Za-z0-9 _.\-]', '', 'g'), 16);
begin
  if auth.uid() is null or n = '' then return jsonb_build_object('ok', false); end if;
  insert into qc_accounts (user_id, nick) values (auth.uid(), n) on conflict (user_id) do update set nick = n, updated_at = now();
  update qc_rank set nick = n where user_id = auth.uid();
  return jsonb_build_object('ok', true, 'nick', n);
end $$;

create or replace function public.qc_cloud_save(p_slot int, p_save jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or p_slot not between 1 and 6 or jsonb_typeof(p_save) <> 'object' then return jsonb_build_object('ok', false); end if;
  insert into qc_cloud (user_id, slot, save, day, saved_at) values (auth.uid(), p_slot, p_save, nullif(p_save->>'day','')::int, now())
    on conflict (user_id, slot) do update set save = excluded.save, day = excluded.day, saved_at = now();
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.qc_cloud_load(p_slot int)
returns jsonb language sql security definer set search_path = public as $$
  select jsonb_build_object('save', save, 'day', day, 'saved_at', saved_at) from qc_cloud where user_id = auth.uid() and slot = p_slot
$$;

create or replace function public.qc_rank_submit(p_island text, p_best_day int, p_served int, p_days int)
returns jsonb language plpgsql security definer set search_path = public as $$
declare a qc_accounts%rowtype; n text;
begin
  if auth.uid() is null then return jsonb_build_object('ok', false); end if;
  select * into a from qc_accounts where user_id = auth.uid();
  n := coalesce(a.nick, 'Quokka fan');
  -- light sanity limits: one café day can't earn more than this
  if p_best_day < 0 or p_best_day > 60000 or p_served < 0 or p_served > 2000000 or p_days < 0 or p_days > 100000 then
    return jsonb_build_object('ok', false, 'reason', 'range'); end if;
  insert into qc_rank (user_id, nick, island, best_day, served, days, supporter)
    values (auth.uid(), n, left(p_island, 24), p_best_day, p_served, p_days, coalesce((a.owned->>'supporter')::boolean, false))
    on conflict (user_id) do update set nick = n, island = left(p_island, 24), best_day = greatest(qc_rank.best_day, excluded.best_day),
      served = greatest(qc_rank.served, excluded.served), days = greatest(qc_rank.days, excluded.days), supporter = excluded.supporter, updated_at = now();
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.qc_rank_top(p_by text default 'best_day', p_limit int default 20)
returns table (nick text, island text, best_day int, served int, days int, supporter boolean, me boolean)
language sql security definer set search_path = public as $$
  select nick, island, best_day, served, days, supporter, user_id = auth.uid()
  from qc_rank order by case when p_by = 'served' then served when p_by = 'days' then days else best_day end desc, updated_at
  limit least(greatest(p_limit, 1), 50)
$$;

revoke execute on function public.qc_me(), public.qc_set_nick(text), public.qc_cloud_save(int, jsonb), public.qc_cloud_load(int), public.qc_rank_submit(text, int, int, int) from public, anon;
grant execute on function public.qc_redeem_code(text, text), public.qc_rank_top(text, int) to anon, authenticated;
grant execute on function public.qc_me(), public.qc_set_nick(text), public.qc_cloud_save(int, jsonb), public.qc_cloud_load(int), public.qc_rank_submit(text, int, int, int) to authenticated;
