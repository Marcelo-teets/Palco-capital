begin;

-- Views must enforce the caller's permissions and the RLS policies of base tables.
alter view public.v_produtores_track_record set (security_invoker = true);
alter view public.v_pipeline_credito set (security_invoker = true);
alter view public.v_carteira_ativa set (security_invoker = true);
alter view public.v_metricas_motor set (security_invoker = true);
alter view public.v_alertas_credito set (security_invoker = true);
alter view public.vw_carteira_monitoramento set (security_invoker = true);
alter view public.vw_funil_comercial set (security_invoker = true);
alter view public.vw_notificacoes_retidas set (security_invoker = true);
alter view public.vw_migracoes_inventario set (security_invoker = true);
alter view public.vw_pipeline_resumo set (security_invoker = true);
alter view public.vw_portfolio_ativo set (security_invoker = true);
alter view public.v_concentracao_risco set (security_invoker = true);

-- Internal queue and funding data were RLS-enabled without policies.
revoke all on table public.agente_tarefas from anon, public;
revoke all on table public.fontes_funding from anon, public;
grant select on table public.agente_tarefas to authenticated;
grant select on table public.fontes_funding to authenticated;
grant all on table public.agente_tarefas to service_role;
grant all on table public.fontes_funding to service_role;

drop policy if exists svc_all_agente_tarefas on public.agente_tarefas;
create policy svc_all_agente_tarefas
on public.agente_tarefas
for all
to service_role
using (true)
with check (true);

drop policy if exists admin_read_agente_tarefas on public.agente_tarefas;
create policy admin_read_agente_tarefas
on public.agente_tarefas
for select
to authenticated
using (
  (select auth.jwt() ->> 'email') in (
    select email from public.admin_allowlist
  )
);

drop policy if exists svc_all_fontes_funding on public.fontes_funding;
create policy svc_all_fontes_funding
on public.fontes_funding
for all
to service_role
using (true)
with check (true);

drop policy if exists admin_read_fontes_funding on public.fontes_funding;
create policy admin_read_fontes_funding
on public.fontes_funding
for select
to authenticated
using (
  (select auth.jwt() ->> 'email') in (
    select email from public.admin_allowlist
  )
);

-- SECURITY DEFINER functions remain available to trusted server and cron roles,
-- but are no longer callable through PostgREST by anon/authenticated users.
do $hardening$
declare
  fn record;
begin
  for fn in
    select p.oid::regprocedure as signature
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
  loop
    execute format(
      'revoke execute on function %s from public, anon, authenticated',
      fn.signature
    );
    execute format(
      'grant execute on function %s to service_role',
      fn.signature
    );
  end loop;
end
$hardening$;

alter default privileges in schema public
  revoke execute on functions from public, anon, authenticated;
alter default privileges in schema public
  grant execute on functions to service_role;

-- Keep the legacy schema quarantined without dropping it before ADR-016.
drop policy if exists anon_insert_leads on arquivo_morto_lastro.leads;
revoke usage on schema arquivo_morto_lastro from public, anon, authenticated;
revoke all on all tables in schema arquivo_morto_lastro from public, anon, authenticated;
revoke all on all sequences in schema arquivo_morto_lastro from public, anon, authenticated;
revoke execute on all functions in schema arquivo_morto_lastro from public, anon, authenticated;

commit;
