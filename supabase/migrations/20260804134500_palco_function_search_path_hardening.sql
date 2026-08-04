-- PALCO-009 — Fix function search paths and normalize the user profile policy.
-- The public schema is not writable by public, anon, authenticated or service_role.
-- Fixing the path removes caller-controlled resolution while preserving current behavior.

do $fix_search_path$
declare
  fn record;
begin
  for fn in
    select p.oid::regprocedure as signature
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prokind = 'f'
      and not exists (
        select 1
        from unnest(coalesce(p.proconfig, array[]::text[])) cfg
        where cfg like 'search_path=%'
      )
  loop
    execute format(
      'alter function %s set search_path to public, extensions, pg_temp',
      fn.signature
    );
  end loop;
end
$fix_search_path$;

-- Restrict profile access to authenticated users and prevent ownership reassignment.
drop policy if exists users_own_profile on public.profiles;
create policy users_own_profile
on public.profiles
for all
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Fail closed if a public function or the profile policy remains inconsistent.
do $assertions$
declare
  missing_search_path integer;
  profile_policy_count integer;
begin
  select count(*) into missing_search_path
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.prokind = 'f'
    and not exists (
      select 1
      from unnest(coalesce(p.proconfig, array[]::text[])) cfg
      where cfg like 'search_path=%'
    );

  if missing_search_path <> 0 then
    raise exception 'Public functions without fixed search_path: %', missing_search_path;
  end if;

  select count(*) into profile_policy_count
  from pg_policies
  where schemaname='public'
    and tablename='profiles'
    and policyname='users_own_profile'
    and cmd='ALL'
    and roles=array['authenticated']::name[]
    and qual ilike '%SELECT auth.uid()%'
    and with_check ilike '%SELECT auth.uid()%';

  if profile_policy_count <> 1 then
    raise exception 'Profiles policy was not normalized';
  end if;
end
$assertions$;
