-- PALCO-006 — Sanitized structural inventory.
-- This script returns metadata and counts only. It does not return table rows,
-- migration statements, allowlist emails, Vault secrets or operational payloads.

-- 1. Object counts by application schema.
with object_counts as (
  select n.nspname as schema_name,
         count(*) filter (where c.relkind='r')::int as tables,
         count(*) filter (where c.relkind in ('v','m'))::int as views,
         count(*) filter (where c.relkind='S')::int as sequences,
         count(*) filter (where c.relkind='i')::int as indexes
  from pg_namespace n
  left join pg_class c on c.relnamespace=n.oid
  where n.nspname in ('public','private','arquivo_morto_lastro')
  group by n.nspname
), function_counts as (
  select n.nspname as schema_name,
         count(*)::int as functions,
         count(*) filter (where p.prosecdef)::int as security_definer,
         count(*) filter (where exists (
           select 1
           from unnest(coalesce(p.proconfig,array[]::text[])) cfg
           where cfg like 'search_path=%'
         ))::int as fixed_search_path
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname in ('public','private','arquivo_morto_lastro')
    and p.prokind='f'
  group by n.nspname
), policy_counts as (
  select schemaname as schema_name, count(*)::int as policies
  from pg_policies
  where schemaname in ('public','private','arquivo_morto_lastro')
  group by schemaname
), trigger_counts as (
  select n.nspname as schema_name, count(*)::int as triggers
  from pg_trigger t
  join pg_class c on c.oid=t.tgrelid
  join pg_namespace n on n.oid=c.relnamespace
  where not t.tgisinternal
    and n.nspname in ('public','private','arquivo_morto_lastro')
  group by n.nspname
)
select o.schema_name, o.tables, o.views, o.sequences, o.indexes,
       coalesce(f.functions,0) as functions,
       coalesce(f.security_definer,0) as security_definer,
       coalesce(f.fixed_search_path,0) as fixed_search_path,
       coalesce(p.policies,0) as policies,
       coalesce(t.triggers,0) as triggers
from object_counts o
left join function_counts f using(schema_name)
left join policy_counts p using(schema_name)
left join trigger_counts t using(schema_name)
order by o.schema_name;

-- 2. Migration registry summary. Statements are intentionally not returned.
select
  count(*)::int as migration_count,
  min(version) as first_version,
  max(version) as latest_version,
  count(*) filter (where name is not null and btrim(name) <> '')::int as named_migrations,
  count(*) filter (
    where statements is not null and cardinality(statements) > 0
  )::int as migrations_with_statements
from supabase_migrations.schema_migrations;

-- 3. Extensions and installation schemas.
select extname, extversion, n.nspname as schema_name
from pg_extension e
join pg_namespace n on n.oid=e.extnamespace
where extname <> 'plpgsql'
order by extname;

-- 4. Cron registry. Commands are intentionally excluded because they may
-- contain private endpoints, headers or operational payloads.
select jobname, schedule, active
from cron.job
order by jobname;
