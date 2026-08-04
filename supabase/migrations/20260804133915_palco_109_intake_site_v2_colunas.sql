-- PALCO-109: colunas exigidas pelo formulário público v2 do site institucional.
-- Todas nullable: não quebram inserts existentes nem o intake legado.
alter table public.leads
  add column if not exists cargo              text,
  add column if not exists tipo_organizacao   text,
  add column if not exists tempo_operacao     text,
  add column if not exists eventos_12m        text,
  add column if not exists urgencia           text,
  add column if not exists destino_recurso    text,
  add column if not exists consentimento_lgpd boolean not null default false,
  add column if not exists consentimento_em   timestamptz;

comment on column public.leads.consentimento_lgpd is
  'Consentimento LGPD coletado no formulário público. Exigido pela policy anon_insert_leads.';
