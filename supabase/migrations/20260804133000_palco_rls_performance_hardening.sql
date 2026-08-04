-- PALCO-008 — RLS and performance hardening.
-- Centralizes admin authorization, removes obsolete permissive policies,
-- applies least-privilege grants to active credit flows and adds missing FK indexes.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated, service_role;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select coalesce(
    exists (
      select 1
      from public.admin_allowlist a
      where lower(a.email) = lower((select auth.jwt() ->> 'email'))
    ),
    false
  );
$function$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated, service_role;

-- Replace every allowlist-backed admin SELECT policy with one centralized check.
do $admin_policies$
declare
  r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and cmd = 'SELECT'
      and roles @> array['authenticated']::name[]
      and (
        policyname ilike '%admin%read%'
        or qual ilike '%admin_allowlist%'
      )
  loop
    execute format('drop policy %I on %I.%I', r.policyname, r.schemaname, r.tablename);
    execute format(
      'create policy %I on %I.%I for select to authenticated using ((select private.is_admin()))',
      r.policyname,
      r.schemaname,
      r.tablename
    );
  end loop;
end
$admin_policies$;

-- Replace legacy PUBLIC-targeted service_role policies with a canonical role-scoped policy.
create temporary table _palco_legacy_service_tables on commit drop as
select distinct schemaname, tablename
from pg_policies
where schemaname = 'public'
  and cmd = 'ALL'
  and roles = array['public']::name[]
  and qual ilike '%auth.role()%'
  and qual ilike '%service_role%';

do $drop_legacy_service$
declare
  r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and cmd = 'ALL'
      and roles = array['public']::name[]
      and qual ilike '%auth.role()%'
      and qual ilike '%service_role%'
  loop
    execute format('drop policy %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;

  for r in select schemaname, tablename from _palco_legacy_service_tables
  loop
    execute format('drop policy if exists service_role_all on %I.%I', r.schemaname, r.tablename);
    execute format(
      'create policy service_role_all on %I.%I for all to service_role using (true) with check (true)',
      r.schemaname,
      r.tablename
    );
  end loop;
end
$drop_legacy_service$;

-- Direct Chairman writes were tied to a non-canonical JWT role claim.
-- Administrative mutations now use protected server-side APIs and service_role.
do $drop_chairman$
declare
  r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and policyname ilike 'Chairman full access %'
  loop
    execute format('drop policy %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end
$drop_chairman$;

-- Least-privilege grants on the active credit path.
do $active_grants$
declare
  t text;
begin
  foreach t in array array[
    'admin_allowlist','leads','eventos','analises_credito','contratos','desembolsos',
    'recebiveis','kyc_triagens','reputacao_checagens','reputacao_ocorrencias',
    'reputacao_jobs','produtores','escalacoes','operacoes','documentos'
  ]
  loop
    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant select on table public.%I to authenticated', t);
    execute format('grant all on table public.%I to service_role', t);
  end loop;
end
$active_grants$;

grant insert on table public.leads to anon;

-- Remove duplicate indexes proven identical by the Supabase advisor.
drop index if exists public.leads_created_at_idx;
drop index if exists public.leads_status_idx;

-- Cover active foreign-key paths that currently lack a leading-column index.
create index if not exists idx_analises_evento_id on public.analises_credito(evento_id);
create index if not exists idx_analises_label_id on public.analises_credito(label_id);
create index if not exists idx_analises_produtor_id on public.analises_credito(produtor_id);
create index if not exists idx_contratos_analise_id on public.contratos(analise_id);
create index if not exists idx_desembolsos_contrato_id on public.desembolsos(contrato_id);
create index if not exists idx_documentos_lead_id on public.documentos(lead_id);
create index if not exists idx_documentos_operacao_id on public.documentos(operacao_id);
create index if not exists idx_escalacoes_contrato_id on public.escalacoes(contrato_id);
create index if not exists idx_eventos_lead_id on public.eventos(lead_id);
create index if not exists idx_eventos_venue_id on public.eventos(venue_id);
create index if not exists idx_kyc_produtor_id on public.kyc_triagens(produtor_id);
create index if not exists idx_operacoes_lead_id on public.operacoes(lead_id);
create index if not exists idx_produtores_lead_origem_id on public.produtores(lead_origem_id);
create index if not exists idx_produtores_pessoa_id on public.produtores(pessoa_id);
create index if not exists idx_recebiveis_operacao_id on public.recebiveis(operacao_id);
create index if not exists idx_rep_check_label_id on public.reputacao_checagens(label_id);
create index if not exists idx_rep_jobs_checagem_id on public.reputacao_jobs(checagem_id);

-- Structural assertions make the migration fail closed.
do $assertions$
declare
  missing_indexes integer;
  invalid_grants integer;
begin
  if exists (
    select 1 from pg_policies
    where schemaname='public'
      and cmd='ALL'
      and roles=array['public']::name[]
      and qual ilike '%auth.role()%'
      and qual ilike '%service_role%'
  ) then
    raise exception 'Legacy PUBLIC service_role policy remains';
  end if;

  if exists (
    select 1 from pg_policies
    where schemaname='public' and policyname ilike 'Chairman full access %'
  ) then
    raise exception 'Obsolete Chairman direct-write policy remains';
  end if;

  if exists (
    select 1 from pg_policies
    where schemaname='public'
      and cmd='SELECT'
      and roles @> array['authenticated']::name[]
      and (policyname ilike '%admin%read%' or qual ilike '%admin_allowlist%')
      and qual not ilike '%private.is_admin%'
  ) then
    raise exception 'An admin SELECT policy was not centralized';
  end if;

  select count(*) into invalid_grants
  from information_schema.role_table_grants
  where table_schema='public'
    and table_name in (
      'admin_allowlist','leads','eventos','analises_credito','contratos','desembolsos',
      'recebiveis','kyc_triagens','reputacao_checagens','reputacao_ocorrencias',
      'reputacao_jobs','produtores','escalacoes','operacoes','documentos'
    )
    and (
      (grantee='anon' and not (table_name='leads' and privilege_type='INSERT'))
      or (grantee='authenticated' and privilege_type <> 'SELECT')
    );
  if invalid_grants > 0 then
    raise exception 'Unexpected anon/authenticated grants remain: %', invalid_grants;
  end if;

  if not has_table_privilege('anon','public.leads','INSERT')
     or has_table_privilege('anon','public.leads','SELECT') then
    raise exception 'Public intake privileges are inconsistent';
  end if;

  select count(*) into missing_indexes
  from (values
    ('idx_analises_evento_id'),('idx_analises_label_id'),('idx_analises_produtor_id'),
    ('idx_contratos_analise_id'),('idx_desembolsos_contrato_id'),
    ('idx_documentos_lead_id'),('idx_documentos_operacao_id'),
    ('idx_escalacoes_contrato_id'),('idx_eventos_lead_id'),('idx_eventos_venue_id'),
    ('idx_kyc_produtor_id'),('idx_operacoes_lead_id'),
    ('idx_produtores_lead_origem_id'),('idx_produtores_pessoa_id'),
    ('idx_recebiveis_operacao_id'),('idx_rep_check_label_id'),('idx_rep_jobs_checagem_id')
  ) as expected(index_name)
  where to_regclass('public.' || expected.index_name) is null;
  if missing_indexes > 0 then
    raise exception 'Expected indexes missing: %', missing_indexes;
  end if;

  if to_regclass('public.leads_created_at_idx') is not null
     or to_regclass('public.leads_status_idx') is not null then
    raise exception 'Duplicate leads indexes remain';
  end if;
end
$assertions$;
