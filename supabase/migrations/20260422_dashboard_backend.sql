create extension if not exists pgcrypto;

create table if not exists public.dashboard_user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'affiliate')),
  display_name text,
  status text not null default 'active' check (status in ('active', 'disabled')),
  requires_2fa boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.affiliate_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  referral_code text not null unique,
  status text not null default 'active' check (status in ('active', 'paused', 'blocked')),
  payout_method text,
  payout_details text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.referral_settings (
  id text primary key default 'default',
  enabled boolean not null default true,
  play_store_url text,
  app_store_url text,
  fallback_landing_url text,
  referral_base_route text not null default '/r',
  commission_type text not null default 'fixed' check (commission_type in ('fixed', 'percent')),
  commission_value numeric not null default 5,
  app_launch_state text not null default 'prelaunch' check (app_launch_state in ('prelaunch', 'live')),
  notification_enabled boolean not null default true,
  default_timezone text not null default 'UTC',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.referral_settings (id)
values ('default')
on conflict (id) do nothing;

create table if not exists public.referral_clicks (
  id uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid not null references auth.users(id) on delete cascade,
  referral_code text not null,
  destination_url text not null,
  source_url text,
  platform text not null default 'web',
  country text,
  ip_address text,
  user_agent text,
  clicked_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.referral_conversions (
  id uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid not null references auth.users(id) on delete cascade,
  referral_code text not null,
  referred_user_id uuid references auth.users(id) on delete set null,
  subscription_plan text,
  conversion_amount numeric not null default 0,
  status text not null default 'lead' check (status in ('lead', 'trial', 'paid', 'cancelled')),
  converted_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.affiliate_earnings (
  id uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid not null references auth.users(id) on delete cascade,
  conversion_id uuid references public.referral_conversions(id) on delete set null,
  year_month text not null,
  gross_amount numeric not null default 0,
  net_amount numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.affiliate_payouts (
  id uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid not null references auth.users(id) on delete cascade,
  affiliate_name text not null,
  month text not null,
  gross_amount numeric not null default 0,
  net_amount numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  paid_at timestamptz,
  note text not null default '',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  expo_push_token text unique,
  fcm_token text unique,
  platform text not null default 'expo',
  timezone text,
  active boolean not null default true,
  last_seen_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notification_templates (
  id text primary key,
  key text not null unique,
  title text not null,
  body text not null,
  emphasis_text text,
  audience text not null default 'all_users',
  send_hour_local integer not null default 9,
  enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.notification_templates (id, key, title, body, emphasis_text, audience, send_hour_local, enabled)
values
  ('morning_safe_limit', 'morning_safe_limit', 'Your safe limit for today', 'Your target for today is ready. Stay within your safe limit.', 'Today''s target is ready', 'all_users', 9, true),
  ('night_check_summary', 'night_check_summary', 'Your spending summary for tonight', 'Check whether you stayed under budget or overspent today.', 'Daily check-out summary', 'all_users', 21, true)
on conflict (id) do nothing;

create table if not exists public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  template_key text not null,
  title text not null,
  body text not null,
  emphasis_text text,
  status text not null default 'scheduled' check (status in ('scheduled', 'queued', 'sent', 'delivered', 'failed')),
  timezone text,
  scheduled_for timestamptz,
  sent_at timestamptz,
  delivery_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_activity_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null,
  session_count integer not null default 0,
  last_active_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, activity_date)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists referral_clicks_affiliate_idx on public.referral_clicks (affiliate_user_id, clicked_at desc);
create index if not exists referral_conversions_affiliate_idx on public.referral_conversions (affiliate_user_id, converted_at desc);
create index if not exists affiliate_earnings_affiliate_idx on public.affiliate_earnings (affiliate_user_id, year_month desc);
create index if not exists affiliate_payouts_affiliate_idx on public.affiliate_payouts (affiliate_user_id, month desc);
create index if not exists notification_logs_status_idx on public.notification_logs (status, scheduled_for desc);
create index if not exists user_activity_daily_user_idx on public.user_activity_daily (user_id, activity_date desc);

alter table public.dashboard_user_roles enable row level security;
alter table public.affiliate_profiles enable row level security;
alter table public.referral_settings enable row level security;
alter table public.referral_clicks enable row level security;
alter table public.referral_conversions enable row level security;
alter table public.affiliate_earnings enable row level security;
alter table public.affiliate_payouts enable row level security;
alter table public.push_tokens enable row level security;
alter table public.notification_templates enable row level security;
alter table public.notification_logs enable row level security;
alter table public.user_activity_daily enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "dashboard_user_roles_owner_select" on public.dashboard_user_roles;
create policy "dashboard_user_roles_owner_select" on public.dashboard_user_roles
  for select using (auth.uid() = user_id);

drop policy if exists "affiliate_profiles_owner_select" on public.affiliate_profiles;
create policy "affiliate_profiles_owner_select" on public.affiliate_profiles
  for select using (auth.uid() = user_id);

drop policy if exists "affiliate_profiles_owner_update" on public.affiliate_profiles;
create policy "affiliate_profiles_owner_update" on public.affiliate_profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "affiliate_earnings_owner_select" on public.affiliate_earnings;
create policy "affiliate_earnings_owner_select" on public.affiliate_earnings
  for select using (auth.uid() = affiliate_user_id);

drop policy if exists "affiliate_payouts_owner_select" on public.affiliate_payouts;
create policy "affiliate_payouts_owner_select" on public.affiliate_payouts
  for select using (auth.uid() = affiliate_user_id);

drop policy if exists "push_tokens_owner_all" on public.push_tokens;
create policy "push_tokens_owner_all" on public.push_tokens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "notification_logs_owner_select" on public.notification_logs;
create policy "notification_logs_owner_select" on public.notification_logs
  for select using (auth.uid() = user_id);

drop policy if exists "user_activity_daily_owner_select" on public.user_activity_daily;
create policy "user_activity_daily_owner_select" on public.user_activity_daily
  for select using (auth.uid() = user_id);
