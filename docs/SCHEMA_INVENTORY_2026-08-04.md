# Palco Capital — Inventário sanitizado do banco

Data de referência: **04/08/2026**  
Projeto Supabase: `apsiwkvpcmhpjxzhqsya`

## Objetivo

Registrar a estrutura de produção sem copiar dados de clientes, credenciais, tokens, conteúdo de documentos ou valores operacionais. Este inventário é a primeira etapa do PALCO-006 e não substitui um baseline DDL reproduzível.

## Histórico de migrations

| Métrica | Resultado |
|---|---:|
| Migrations registradas em produção | 127 |
| Primeira versão | `20260509234853` |
| Versão mais recente no levantamento | `20260804134814` |
| Migrations com nome | 127 |
| Migrations com statements registrados | 127 |

A instância de produção permanece como fonte operacional até o tie-out final entre baseline, migrations versionadas e ambiente reconstruído.

## Objetos por schema

| Schema | Tabelas | Views | Índices | Funções | Security definer | Search path fixo | Policies | Triggers |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `public` | 63 | 40 | 196 | 95 | 53 | 95 | 113 | 21 |
| `private` | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 0 |
| `arquivo_morto_lastro` | 8 | 0 | 8 | 1 | 0 | 0 | 11 | 2 |

### Leitura do inventário

- O schema `public` contém a plataforma operacional principal.
- O schema `private` contém a função centralizada de autorização administrativa.
- O schema `arquivo_morto_lastro` está em quarentena: não deve ser usado como base de novas funcionalidades nem removido antes da decisão formal sobre retenção e descarte.
- Todas as funções do schema `public` possuem `search_path` fixo no levantamento.

## Extensões instaladas

| Extensão | Versão | Schema |
|---|---|---|
| `pg_cron` | 1.6.4 | `pg_catalog` |
| `pg_net` | 0.20.0 | `public` |
| `pg_stat_statements` | 1.11 | `extensions` |
| `pgcrypto` | 1.3 | `extensions` |
| `supabase_vault` | 0.3.1 | `vault` |
| `uuid-ossp` | 1.1 | `extensions` |

`pg_net` permanece em `public`. Sua movimentação deve ser ensaiada isoladamente porque pode afetar funções, crons ou chamadas HTTP existentes.

## Cron jobs ativos

| Job | Schedule configurado |
|---|---|
| `palco_aging_diario` | `0 12 * * *` |
| `palco_cadencia_diaria` | `0 11 * * *` |
| `palco_calibracao_mensal` | `0 13 1 * *` |
| `palco_classificacao_diaria` | `15 9 * * *` |
| `palco_cnpj_enriquecimento` | `*/5 * * * *` |
| `palco_dq_diario` | `0 9 * * *` |
| `palco_kyc_diario` | `30 8 * * *` |
| `palco_monitoramento_diario` | `0 10 * * *` |
| `palco_orq_consumidor` | `*/5 * * * *` |
| `palco_orq_produtores` | `*/15 * * * *` |
| `palco_reputacao_revalidacao` | `0 13 * * *` |
| `palco_sinais_horario` | `0 * * * *` |
| `palco_sla_escalacoes` | `30 11 * * *` |

Os horários acima reproduzem as expressões cadastradas no banco. A interpretação de timezone deve ser validada na configuração do ambiente antes da reconstrução.

## Exclusões obrigatórias do baseline público

O baseline versionado não pode conter:

- linhas de clientes, leads, produtores, operações, recebíveis ou documentos;
- e-mails da allowlist administrativa;
- segredos do Vault;
- tokens, chaves de API ou service role;
- endpoints privados, payloads de terceiros ou conteúdo de logs;
- seeds que identifiquem contrapartes reais;
- statements históricos que incluam dados operacionais embutidos.

## Lacunas ainda abertas

1. Gerar DDL sanitizado de tabelas, constraints, enums, views, funções, triggers e RLS.
2. Separar extensões e cron jobs em etapa posterior à criação dos objetos-base.
3. Identificar migrations históricas com efeitos de dados e convertê-las em seeds privados ou procedimentos fora do repositório.
4. Reconstruir o ambiente em instância isolada.
5. Executar tie-out estrutural e funcional.
6. Documentar promoção e rollback.

## Critério para considerar o baseline concluído

Um ambiente vazio deve conseguir reproduzir, sem dados reais:

- schemas e extensões necessárias;
- 63 tabelas públicas e suas constraints;
- 40 views com dependências válidas;
- funções, triggers e RLS necessários;
- cron jobs desativados por padrão e ativados apenas após configuração dos segredos;
- intake público funcional;
- APIs internas fechadas sem credenciais;
- smoke tests do motor de crédito e da orquestração.
