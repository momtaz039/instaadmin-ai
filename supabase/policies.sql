-- Row Level Security for the platform. Run AFTER schema.sql.
--
-- Model: every user belongs to one or more organizations through `memberships`
-- (role: owner | admin | manager | editor | analyst | viewer).
--   * READ  : any active member of the organization.
--   * WRITE : only the roles listed per table below (mirrors lib/rbac.ts).
--   * Server-only tables/operations (audit log writes, notifications inserts,
--     Instagram tokens, agent activity) have no client write policy — they are
--     written with the service-role key from server code.

-- ----------------------------- Helper functions -----------------------------

create or replace function auth_profile_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from profiles where auth_user_id = auth.uid()
$$;

create or replace function auth_org_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select m.organization_id
  from memberships m
  join profiles p on p.id = m.user_id
  where p.auth_user_id = auth.uid() and m.status = 'active'
$$;

create or replace function auth_workspace_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select w.id from workspaces w where w.organization_id in (select auth_org_ids())
$$;

create or replace function has_org_role(org uuid, roles user_role[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from memberships m
    join profiles p on p.id = m.user_id
    where p.auth_user_id = auth.uid()
      and m.organization_id = org
      and m.status = 'active'
      and m.role = any (roles)
  )
$$;

create or replace function workspace_org(ws uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select organization_id from workspaces where id = ws
$$;

create or replace function has_ws_role(ws uuid, roles user_role[])
returns boolean language sql stable security definer set search_path = public as $$
  select has_org_role(workspace_org(ws), roles)
$$;

create or replace function account_workspace(acc uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select workspace_id from instagram_accounts where id = acc
$$;

create or replace function content_workspace(cid uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select workspace_id from content_items where id = cid
$$;

create or replace function conversation_workspace(conv uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select a.workspace_id
  from conversations c join instagram_accounts a on a.id = c.account_id
  where c.id = conv
$$;

create or replace function agent_workspace(aid uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select workspace_id from ai_agents where id = aid
$$;

-- Bootstrap: a brand-new user has no membership yet, so creating the first
-- organization must go through this function (called as an RPC after signup).
create or replace function create_organization(org_name text, org_slug text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  pid uuid := auth_profile_id();
  new_org uuid;
begin
  if pid is null then
    raise exception 'not authenticated';
  end if;
  insert into organizations (name, slug) values (org_name, org_slug) returning id into new_org;
  insert into memberships (organization_id, user_id, role, status) values (new_org, pid, 'owner', 'active');
  insert into workspaces (organization_id, name) values (new_org, org_name);
  return new_org;
end $$;

-- --------------------------------- Enable RLS --------------------------------

alter table profiles              enable row level security;
alter table organizations         enable row level security;
alter table workspaces            enable row level security;
alter table memberships           enable row level security;
alter table instagram_accounts    enable row level security;
alter table instagram_credentials enable row level security;  -- no policies: server only
alter table media_assets          enable row level security;
alter table content_items         enable row level security;
alter table approvals             enable row level security;
alter table conversations         enable row level security;
alter table messages              enable row level security;
alter table comments              enable row level security;
alter table leads                 enable row level security;
alter table customers             enable row level security;
alter table crm_activities        enable row level security;
alter table product_categories    enable row level security;
alter table products              enable row level security;
alter table orders                enable row level security;
alter table discounts             enable row level security;
alter table ai_agents             enable row level security;
alter table agent_activity        enable row level security;
alter table notifications         enable row level security;
alter table audit_logs            enable row level security;

-- ---------------------------- Identity / org tables ---------------------------

-- Profiles: your own row, plus people who share an organization with you.
create policy profiles_select on profiles for select to authenticated
  using (
    auth_user_id = auth.uid()
    or id in (select user_id from memberships where organization_id in (select auth_org_ids()))
  );
create policy profiles_update on profiles for update to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

create policy organizations_select on organizations for select to authenticated
  using (id in (select auth_org_ids()));
create policy organizations_update on organizations for update to authenticated
  using (has_org_role(id, array['owner','admin']::user_role[]))
  with check (has_org_role(id, array['owner','admin']::user_role[]));

create policy workspaces_select on workspaces for select to authenticated
  using (organization_id in (select auth_org_ids()));
create policy workspaces_insert on workspaces for insert to authenticated
  with check (has_org_role(organization_id, array['owner','admin']::user_role[]));
create policy workspaces_update on workspaces for update to authenticated
  using (has_org_role(organization_id, array['owner','admin']::user_role[]))
  with check (has_org_role(organization_id, array['owner','admin']::user_role[]));
create policy workspaces_delete on workspaces for delete to authenticated
  using (has_org_role(organization_id, array['owner']::user_role[]));

-- Memberships: members can read the team; only owners/admins can change it.
-- Admins cannot create, edit or remove owners (no privilege escalation).
create policy memberships_select on memberships for select to authenticated
  using (organization_id in (select auth_org_ids()));
create policy memberships_insert on memberships for insert to authenticated
  with check (
    has_org_role(organization_id, array['owner','admin']::user_role[])
    and (role <> 'owner' or has_org_role(organization_id, array['owner']::user_role[]))
  );
create policy memberships_update on memberships for update to authenticated
  using (
    has_org_role(organization_id, array['owner']::user_role[])
    or (has_org_role(organization_id, array['admin']::user_role[]) and role <> 'owner')
  )
  with check (
    has_org_role(organization_id, array['owner']::user_role[])
    or (has_org_role(organization_id, array['admin']::user_role[]) and role <> 'owner')
  );
create policy memberships_delete on memberships for delete to authenticated
  using (
    has_org_role(organization_id, array['owner']::user_role[])
    or (has_org_role(organization_id, array['admin']::user_role[]) and role <> 'owner')
  );

-- Notifications: only your own (or org-wide ones); you may mark them read.
create policy notifications_select on notifications for select to authenticated
  using (
    organization_id in (select auth_org_ids())
    and (user_id is null or user_id = auth_profile_id())
  );
create policy notifications_update on notifications for update to authenticated
  using (organization_id in (select auth_org_ids()) and (user_id is null or user_id = auth_profile_id()))
  with check (organization_id in (select auth_org_ids()) and (user_id is null or user_id = auth_profile_id()));

-- Audit log: readable by owners/admins only; written by the server.
create policy audit_select on audit_logs for select to authenticated
  using (has_org_role(organization_id, array['owner','admin']::user_role[]));

-- ------------------------- Workspace-scoped tables ---------------------------
-- (table, roles allowed to insert/update/delete). Everyone in the org can read.

do $$
declare
  r record;
begin
  for r in
    select * from (values
      ('instagram_accounts', array['owner','admin','manager']),
      ('media_assets',       array['owner','admin','manager','editor']),
      ('content_items',      array['owner','admin','manager','editor']),
      ('leads',              array['owner','admin','manager']),
      ('customers',          array['owner','admin','manager']),
      ('crm_activities',     array['owner','admin','manager']),
      ('product_categories', array['owner','admin','manager']),
      ('products',           array['owner','admin','manager']),
      ('orders',             array['owner','admin','manager']),
      ('discounts',          array['owner','admin','manager']),
      ('ai_agents',          array['owner','admin','manager'])
    ) as t(tbl, roles)
  loop
    execute format(
      'create policy %I on %I for select to authenticated using (workspace_id in (select auth_workspace_ids()))',
      r.tbl || '_select', r.tbl);
    execute format(
      'create policy %I on %I for insert to authenticated with check (has_ws_role(workspace_id, %L::user_role[]))',
      r.tbl || '_insert', r.tbl, r.roles);
    execute format(
      'create policy %I on %I for update to authenticated using (has_ws_role(workspace_id, %L::user_role[])) with check (has_ws_role(workspace_id, %L::user_role[]))',
      r.tbl || '_update', r.tbl, r.roles, r.roles);
    execute format(
      'create policy %I on %I for delete to authenticated using (has_ws_role(workspace_id, %L::user_role[]))',
      r.tbl || '_delete', r.tbl, r.roles);
  end loop;
end $$;

-- ------------------------------- Child tables --------------------------------

-- Approvals: editors can request a review; managers and above decide.
create policy approvals_select on approvals for select to authenticated
  using (content_workspace(content_id) in (select auth_workspace_ids()));
create policy approvals_insert on approvals for insert to authenticated
  with check (has_ws_role(content_workspace(content_id), array['owner','admin','manager','editor']::user_role[]));
create policy approvals_update on approvals for update to authenticated
  using (has_ws_role(content_workspace(content_id), array['owner','admin','manager']::user_role[]))
  with check (has_ws_role(content_workspace(content_id), array['owner','admin','manager']::user_role[]));
create policy approvals_delete on approvals for delete to authenticated
  using (has_ws_role(content_workspace(content_id), array['owner','admin','manager']::user_role[]));

-- Inbox (conversations / messages / comments): editors and above can reply.
create policy conversations_select on conversations for select to authenticated
  using (account_workspace(account_id) in (select auth_workspace_ids()));
create policy conversations_insert on conversations for insert to authenticated
  with check (has_ws_role(account_workspace(account_id), array['owner','admin','manager','editor']::user_role[]));
create policy conversations_update on conversations for update to authenticated
  using (has_ws_role(account_workspace(account_id), array['owner','admin','manager','editor']::user_role[]))
  with check (has_ws_role(account_workspace(account_id), array['owner','admin','manager','editor']::user_role[]));
create policy conversations_delete on conversations for delete to authenticated
  using (has_ws_role(account_workspace(account_id), array['owner','admin','manager']::user_role[]));

create policy messages_select on messages for select to authenticated
  using (conversation_workspace(conversation_id) in (select auth_workspace_ids()));
create policy messages_insert on messages for insert to authenticated
  with check (has_ws_role(conversation_workspace(conversation_id), array['owner','admin','manager','editor']::user_role[]));
create policy messages_delete on messages for delete to authenticated
  using (has_ws_role(conversation_workspace(conversation_id), array['owner','admin','manager']::user_role[]));

create policy comments_select on comments for select to authenticated
  using (coalesce(account_workspace(account_id), content_workspace(content_id)) in (select auth_workspace_ids()));
create policy comments_update on comments for update to authenticated
  using (has_ws_role(coalesce(account_workspace(account_id), content_workspace(content_id)), array['owner','admin','manager','editor']::user_role[]))
  with check (has_ws_role(coalesce(account_workspace(account_id), content_workspace(content_id)), array['owner','admin','manager','editor']::user_role[]));
create policy comments_delete on comments for delete to authenticated
  using (has_ws_role(coalesce(account_workspace(account_id), content_workspace(content_id)), array['owner','admin','manager']::user_role[]));

-- Agent activity is written by the server only; members can read it.
create policy agent_activity_select on agent_activity for select to authenticated
  using (agent_workspace(agent_id) in (select auth_workspace_ids()));

-- ------------------------------- Privileges ----------------------------------
-- Defense in depth: the anonymous role gets nothing, and helper functions are
-- callable only by signed-in users.

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;

revoke execute on all functions in schema public from public, anon;
grant execute on function
  auth_profile_id(), auth_org_ids(), auth_workspace_ids(),
  has_org_role(uuid, user_role[]), workspace_org(uuid), has_ws_role(uuid, user_role[]),
  account_workspace(uuid), content_workspace(uuid), conversation_workspace(uuid),
  agent_workspace(uuid), create_organization(text, text)
to authenticated;
