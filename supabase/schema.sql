-- Lumina platform schema (PostgreSQL / Supabase)
-- Run this once the Supabase integration is connected. Mirrors lib/types.ts.
-- All tenant data is scoped by organization_id / workspace_id and protected
-- by the RLS policies in policies.sql.

create extension if not exists "pgcrypto";

-- ------------------------------- Identity --------------------------------

create type user_role as enum ('owner','admin','manager','editor','analyst','viewer');
create type org_plan as enum ('free','starter','growth','scale');
create type member_status as enum ('active','invited','suspended');

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  avatar_url text,
  title text,
  timezone text not null default 'UTC',
  locale text not null default 'en',
  created_at timestamptz not null default now()
);

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  plan org_plan not null default 'free',
  created_at timestamptz not null default now()
);

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  color text not null default '#7c5cff',
  created_at timestamptz not null default now()
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role user_role not null default 'viewer',
  status member_status not null default 'active',
  invited_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

-- -------------------------- Instagram integration ------------------------

create type integration_status as enum ('connected','disconnected','expired','error');

create table if not exists instagram_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  username text not null,
  display_name text not null,
  avatar_url text,
  provider text not null default 'sandbox',      -- 'meta' | 'sandbox'
  status integration_status not null default 'disconnected',
  followers int not null default 0,
  following int not null default 0,
  media_count int not null default 0,
  connected_at timestamptz,
  created_at timestamptz not null default now()
);

-- Access tokens live in their own table with RLS enabled and NO policies, so
-- only the server (service role) can read them. Encrypt before storing.
create table if not exists instagram_credentials (
  account_id uuid primary key references instagram_accounts(id) on delete cascade,
  access_token_encrypted text not null,
  token_expires_at timestamptz,
  updated_at timestamptz not null default now()
);

-- -------------------------------- Content --------------------------------

create type content_type as enum ('post','reel','story','carousel');
create type content_status as enum ('draft','in_review','approved','scheduled','published','failed');
create type media_kind as enum ('image','video','audio');

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  kind media_kind not null default 'image',
  url text not null,
  thumbnail_url text,
  name text not null,
  size_bytes bigint not null default 0,
  width int,
  height int,
  tags text[] not null default '{}',
  ai_generated boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  account_id uuid references instagram_accounts(id) on delete set null,
  type content_type not null default 'post',
  caption text not null default '',
  media_ids uuid[] not null default '{}',
  status content_status not null default 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  created_by uuid references profiles(id),
  ai_generated boolean not null default false,
  metrics jsonb,
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references content_items(id) on delete cascade,
  reviewer_id uuid references profiles(id),
  decision text not null default 'pending',
  note text,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

-- ----------------------------- Conversations -----------------------------

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references instagram_accounts(id) on delete cascade,
  channel text not null default 'dm',
  contact_handle text not null,
  contact_avatar_url text,
  last_message text,
  unread_count int not null default 0,
  assigned_to uuid references profiles(id),
  sentiment text not null default 'neutral',
  ai_handled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  direction text not null,
  author text not null,
  body text not null,
  ai_suggested boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references content_items(id) on delete cascade,
  account_id uuid references instagram_accounts(id) on delete cascade,
  author text not null,
  author_avatar_url text,
  body text not null,
  sentiment text not null default 'neutral',
  status text not null default 'new',
  likes int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------- CRM ----------------------------------

create type lead_stage as enum ('new','contacted','qualified','proposal','won','lost');

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  handle text,
  avatar_url text,
  source text not null default 'manual',
  stage lead_stage not null default 'new',
  value numeric not null default 0,
  owner_id uuid references profiles(id),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  handle text,
  email text,
  phone text,
  avatar_url text,
  lifetime_value numeric not null default 0,
  order_count int not null default 0,
  tags text[] not null default '{}',
  segment text not null default 'new',
  created_at timestamptz not null default now()
);

-- Customer / lead history (timeline of notes, messages, orders, stage changes).
create table if not exists crm_activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  lead_id uuid references leads(id) on delete cascade,
  customer_id uuid references customers(id) on delete cascade,
  kind text not null default 'note',          -- note | message | order | stage_change | call
  summary text not null,
  actor text,
  created_at timestamptz not null default now(),
  check (lead_id is not null or customer_id is not null)
);

-- ------------------------------- Commerce --------------------------------

create type order_status as enum ('pending','paid','fulfilled','shipped','cancelled','refunded');
create type product_status as enum ('active','draft','archived');

create table if not exists product_categories (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  category_id uuid references product_categories(id) on delete set null,
  name text not null,
  sku text not null,
  price numeric not null default 0,
  currency text not null default 'USD',
  stock int not null default 0,
  image_url text,
  status product_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  number text not null,
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null,
  lines jsonb not null default '[]',
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null default 0,
  currency text not null default 'USD',
  status order_status not null default 'pending',
  channel text not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists discounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  code text not null,
  type text not null default 'percentage',
  value numeric not null default 0,
  usage_count int not null default 0,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- ------------------------------- AI Agents -------------------------------

create table if not exists ai_agents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  kind text not null,
  name text not null,
  description text,
  enabled boolean not null default false,
  autonomy text not null default 'suggest',
  model text not null default 'claude-sonnet-5',
  config jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists agent_activity (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references ai_agents(id) on delete cascade,
  summary text not null,
  outcome text not null default 'pending',
  created_at timestamptz not null default now()
);

-- --------------------------- Platform / system ---------------------------

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  body text,
  kind text not null default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  actor text not null,
  action text not null,
  target text,
  ip inet,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_workspaces_org on workspaces(organization_id);
create index if not exists idx_content_workspace on content_items(workspace_id);
create index if not exists idx_orders_workspace on orders(workspace_id);
create index if not exists idx_leads_workspace on leads(workspace_id);
create index if not exists idx_conversations_account on conversations(account_id);
create index if not exists idx_crm_activities_workspace on crm_activities(workspace_id);
create index if not exists idx_memberships_user on memberships(user_id);

-- Create a profile automatically when someone signs up through Supabase Auth.
create or replace function handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (auth_user_id, full_name, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (auth_user_id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
