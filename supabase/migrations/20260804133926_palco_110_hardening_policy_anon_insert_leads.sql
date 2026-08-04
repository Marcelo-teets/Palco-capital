-- PALCO-110: restringe o insert público aos campos mínimos do intake v2.
drop policy if exists anon_insert_leads on public.leads;

create policy anon_insert_leads
  on public.leads for insert to anon
  with check (
    origem = 'site_intake_v2'
    and status = 'novo'
    and consentimento_lgpd = true
    and consentimento_em is not null
    and length(regexp_replace(coalesce(cnpj, ''), '\D', '', 'g')) = 14
    and coalesce(email, '') ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and length(coalesce(nome_produtor, '')) between 2 and 120
    and length(coalesce(empresa, '')) between 2 and 200
    and length(coalesce(evento, '')) between 2 and 200
    and data_evento >= (current_date - 1)
    and coalesce(valor_solicitado, 0) between 0 and 50000000
  );

create index if not exists idx_leads_cnpj        on public.leads (cnpj);
create index if not exists idx_leads_status_data on public.leads (status, created_at desc);
create index if not exists idx_leads_data_evento on public.leads (data_evento);
