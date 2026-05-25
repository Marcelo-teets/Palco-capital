# 04 — Modelo de Dados

## Objetivo

Definir a base mínima de entidades para transformar leads de eventos em oportunidades analisáveis de crédito.

O modelo deve permitir rastrear:

- quem é o responsável econômico;
- qual é o evento;
- qual é o CNPJ;
- qual recebível sustenta a operação;
- quais evidências existem;
- qual foi a análise;
- quem decidiu;
- qual é o status operacional.

---

## Entidade: leads

Campos já usados ou esperados no MVP:

- `id`;
- `nome`;
- `nome_produtor`;
- `empresa`;
- `email`;
- `telefone`;
- `evento`;
- `tipo_evento`;
- `data_evento`;
- `cidade`;
- `estado`;
- `receita_estimada`;
- `valor_ingressos`;
- `como_conheceu`;
- `origem`;
- `status`;
- `created_at`.

Campos recomendados para próxima evolução:

- `cnpj`;
- `razao_social`;
- `nome_fantasia`;
- `valor_solicitado`;
- `plataforma_ingressos`;
- `link_venda`;
- `link_evento`;
- `venue`;
- `evidencia_url`;
- `cnpj_status` — confirmado, inferido, pendente;
- `evidencia_status` — forte, média, fraca, ausente;
- `observacoes_comerciais`.

---

## Entidade: eventos

Campos sugeridos:

- `id`;
- `lead_id`;
- `nome_evento`;
- `tipo_evento`;
- `data_inicio`;
- `data_fim`;
- `cidade`;
- `estado`;
- `venue`;
- `capacidade_estimativa`;
- `status_evento`;
- `fonte_principal_url`;
- `created_at`.

---

## Entidade: empresas

Campos sugeridos:

- `id`;
- `cnpj`;
- `razao_social`;
- `nome_fantasia`;
- `situacao_cadastral`;
- `cnae_principal`;
- `uf`;
- `municipio`;
- `fonte_cnpj`;
- `ultima_atualizacao`.

---

## Entidade: evidencias

Serve para não misturar dado observado com inferência.

Campos sugeridos:

- `id`;
- `lead_id`;
- `evento_id`;
- `empresa_id`;
- `tipo` — site, plataforma, diário oficial, contrato, mídia, rede social, outro;
- `url`;
- `descricao`;
- `forca` — forte, média, fraca;
- `dado_observado`;
- `dado_inferido`;
- `created_at`.

---

## Entidade: analises_credito

Campos sugeridos:

- `id`;
- `lead_id`;
- `score`;
- `rating`;
- `limite_recomendado`;
- `valor_solicitado`;
- `receita_estimada`;
- `receita_confirmada`;
- `flags`;
- `racional`;
- `recomendacao` — avançar, pedir documentos, escalar, declinar;
- `modelo_versao`;
- `created_at`.

---

## Entidade: escalacoes

Campos sugeridos:

- `id`;
- `lead_id`;
- `analise_id`;
- `motivo`;
- `prioridade`;
- `status`;
- `responsavel`;
- `prazo`;
- `decisao`;
- `created_at`;
- `updated_at`.

---

## Entidade: operacoes

Campos sugeridos:

- `id`;
- `lead_id`;
- `empresa_id`;
- `evento_id`;
- `valor_aprovado`;
- `valor_desembolsado`;
- `taxa`;
- `prazo`;
- `garantia`;
- `status_operacao`;
- `data_aprovacao`;
- `data_desembolso`;
- `data_liquidacao_prevista`.

---

## Entidade: recebiveis

Campos sugeridos:

- `id`;
- `operacao_id`;
- `tipo_recebivel` — ingresso, A&B, contrato, patrocínio, outro;
- `plataforma`;
- `valor_bruto`;
- `valor_liquido_estimado`;
- `valor_confirmado`;
- `data_prevista_recebimento`;
- `status_trava`;
- `evidencia_url`.

---

## Entidade: agent_logs

Campos sugeridos:

- `id`;
- `agent_name`;
- `action`;
- `input_ref`;
- `output_summary`;
- `status`;
- `error`;
- `created_at`.

---

## Regras de modelagem

- CNPJ e evento devem ser entidades separadas quando o produto amadurecer.
- Um CNPJ pode ter vários eventos.
- Um evento pode gerar vários recebíveis.
- Um lead não é necessariamente uma operação.
- Toda análise precisa ser versionada.
- Toda inferência precisa ter fonte ou flag de baixa confiança.
- Operações acima de limite ou com flags críticas devem gerar escalação.