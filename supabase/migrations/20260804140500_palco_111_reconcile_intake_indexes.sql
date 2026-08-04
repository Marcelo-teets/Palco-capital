-- PALCO-111: reconcile indexes after the intake-v2 migration and cover
-- the remaining foreign keys in active public modules.

-- PALCO-110 introduced the canonical idx_leads_cnpj. Remove the older duplicate.
drop index if exists public.leads_cnpj_idx;

create index if not exists idx_agentes_departamento_codigo
  on public.agentes(departamento_codigo);
create index if not exists idx_agentes_reporta_a
  on public.agentes(reporta_a);
create index if not exists idx_cnpj_enrich_jobs_lead_id
  on public.cnpj_enrich_jobs(lead_id);
create index if not exists idx_grupos_economicos_pessoa_lider_id
  on public.grupos_economicos(pessoa_lider_id);
create index if not exists idx_interacoes_lead_id
  on public.interacoes(lead_id);
create index if not exists idx_pld_ocorrencias_analise_id
  on public.pld_ocorrencias(analise_id);
create index if not exists idx_pld_ocorrencias_lead_id
  on public.pld_ocorrencias(lead_id);
create index if not exists idx_pld_ocorrencias_produtor_id
  on public.pld_ocorrencias(produtor_id);
create index if not exists idx_prospects_lead_id
  on public.prospects(lead_id);
create index if not exists idx_prospects_produtor_id
  on public.prospects(produtor_id);
create index if not exists idx_sinais_bilheteria_prospect_id
  on public.sinais_bilheteria(prospect_id);
create index if not exists idx_sinais_sociais_artista_id
  on public.sinais_sociais(artista_id);
create index if not exists idx_sinais_sociais_lead_id
  on public.sinais_sociais(lead_id);
create index if not exists idx_sinais_sociais_produtor_id
  on public.sinais_sociais(produtor_id);
create index if not exists idx_social_collect_jobs_prospect_id
  on public.social_collect_jobs(prospect_id);
create index if not exists idx_socios_kyc_triagem_id
  on public.socios(kyc_triagem_id);
create index if not exists idx_videos_comerciais_estrategia_codigo
  on public.videos_comerciais(estrategia_codigo);
create index if not exists idx_videos_comerciais_lead_id
  on public.videos_comerciais(lead_id);

do $assertions$
declare
  missing_indexes integer;
begin
  if to_regclass('public.leads_cnpj_idx') is not null then
    raise exception 'Duplicate legacy CNPJ index remains';
  end if;

  select count(*) into missing_indexes
  from (values
    ('idx_agentes_departamento_codigo'),
    ('idx_agentes_reporta_a'),
    ('idx_cnpj_enrich_jobs_lead_id'),
    ('idx_grupos_economicos_pessoa_lider_id'),
    ('idx_interacoes_lead_id'),
    ('idx_pld_ocorrencias_analise_id'),
    ('idx_pld_ocorrencias_lead_id'),
    ('idx_pld_ocorrencias_produtor_id'),
    ('idx_prospects_lead_id'),
    ('idx_prospects_produtor_id'),
    ('idx_sinais_bilheteria_prospect_id'),
    ('idx_sinais_sociais_artista_id'),
    ('idx_sinais_sociais_lead_id'),
    ('idx_sinais_sociais_produtor_id'),
    ('idx_social_collect_jobs_prospect_id'),
    ('idx_socios_kyc_triagem_id'),
    ('idx_videos_comerciais_estrategia_codigo'),
    ('idx_videos_comerciais_lead_id')
  ) as expected(index_name)
  where to_regclass('public.' || expected.index_name) is null;

  if missing_indexes > 0 then
    raise exception 'Expected public FK indexes missing: %', missing_indexes;
  end if;
end
$assertions$;
