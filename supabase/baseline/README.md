# Baseline do Supabase

Este diretório concentra artefatos sanitizados para reconstrução da estrutura do banco da Palco Capital.

## Estado atual

- O inventário estrutural está em `schema_inventory.sql`.
- A instância de produção continua sendo a fonte operacional.
- Ainda não existe um baseline DDL completo validado em ambiente isolado.
- Nenhum arquivo deste diretório pode conter dados reais ou segredos.

## Ordem de construção

### Fase 1 — Inventário

1. Executar `schema_inventory.sql` em produção.
2. Comparar o resultado com `docs/SCHEMA_INVENTORY_2026-08-04.md`.
3. Registrar diferenças de quantidade e explicar alterações esperadas.

### Fase 2 — DDL sanitizado

Extrair e ordenar:

1. schemas e extensões;
2. enums e tipos;
3. tabelas, colunas, defaults e identities;
4. primary keys, unique constraints, checks e foreign keys;
5. índices não implícitos;
6. funções;
7. triggers;
8. views, respeitando dependências;
9. grants e RLS;
10. cron jobs desativados por padrão.

### Fase 3 — Reconstrução isolada

Somente após confirmação de custo/ambiente:

1. criar banco vazio;
2. aplicar baseline;
3. aplicar migrations posteriores ao corte;
4. configurar segredos fora do SQL versionado;
5. executar smoke tests;
6. comparar inventários entre origem e reconstrução.

### Fase 4 — Tie-out

O tie-out deve verificar:

- objetos ausentes ou adicionais;
- assinaturas e propriedades das funções;
- `security definer`, grants e `search_path`;
- definições das views;
- policies por tabela, papel e comando;
- triggers e funções associadas;
- índices de foreign keys;
- jobs, schedules e estado ativo/inativo;
- comportamento do intake público e das APIs internas.

## Regras de segurança

Nunca versionar:

- dumps de dados;
- inserts de clientes ou operações;
- e-mails administrativos;
- secrets do Vault;
- service role ou tokens;
- comandos de cron que contenham headers, endpoints privados ou payloads sensíveis;
- logs de produção.

## Estratégia de ativação

Em uma reconstrução, cron jobs e integrações externas devem nascer desativados. A ativação ocorre somente após:

1. segredos configurados;
2. domínio e callbacks validados;
3. smoke tests aprovados;
4. aprovação explícita para executar efeitos externos.

## Rollback

O baseline não deve ser aplicado diretamente sobre produção. Em ambiente vazio, o rollback preferencial é destruir e reconstruir a instância isolada. Migrations posteriores precisam de plano de rollback próprio ou estratégia forward-fix documentada.
