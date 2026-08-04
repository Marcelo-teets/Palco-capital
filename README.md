# Palco Capital

Plataforma de crédito privado e antecipação de recebíveis para o mercado de eventos ao vivo no Brasil.

A Palco Capital nasce para resolver um problema recorrente de produtores, casas de show, festivais, turnês, artistas, operadores e demais participantes da cadeia de live entertainment: o evento tem venda, contratos, agenda e potencial econômico, mas o capital de giro costuma chegar tarde ou com alto atrito operacional.

O MVP combina landing page, captação de leads, banco Supabase, rotas executivas, agentes iniciais e futura mesa de crédito para estruturar operações com base em evidências, recebíveis, dados do evento e governança humana.

> Status: MVP em estruturação. O produto, contratos, política de crédito e régua jurídica ainda dependem de validação operacional, jurídica e de risco antes de uso em produção plena.

---

## Tese do produto

A Palco Capital atua como uma plataforma tech-enabled de originação, análise e estruturação de crédito para eventos ao vivo, com foco inicial em antecipação de recebíveis de ingressos e, quando aplicável, outras fontes de receita vinculadas ao evento.

O foco não é apenas capturar formulário. O objetivo é montar uma esteira completa:

1. identificar o evento e o responsável econômico;
2. confirmar CNPJ, evidências públicas e fonte de recebíveis;
3. estimar potencial de receita;
4. classificar risco;
5. definir se existe apetite de crédito;
6. escalar exceções para decisão humana;
7. acompanhar operação, documentação, desembolso e liquidação.

---

## Público-alvo inicial

- Produtores de eventos.
- Casas de show e venues.
- Festivais.
- Turnês.
- Artistas e escritórios artísticos.
- Agências e operadores de produção.
- Bares e espaços com programação recorrente.
- Operadores privados com evento e fluxo econômico identificáveis.

Fora do foco inicial: entes públicos enquanto o enquadramento específico estiver
em revisão, crédito ao consumidor e casos sem vínculo claro com evento,
bilheteria, contrato ou recebível mapeável.

---

## Stack atual

- Next.js / React / TypeScript.
- Supabase para persistência.
- API routes no próprio app.
- Vercel como destino natural de deploy.
- Claude/LLM para agentes executivos e análise assistida.
- GitHub como fonte de verdade de backlog, documentação, issues e PRs.

---

## Módulos em operação no MVP

- Site institucional com oito rotas públicas e metadados próprios.
- Simulador educacional de ciclo de caixa.
- Formulário de lead em três etapas com validação de CNPJ.
- API `POST /api/leads` para cadastro de leads.
- API `GET /api/leads` para consulta inicial.
- API executiva de dashboard.
- API do Agente CEO.
- Estrutura inicial de logs de agentes.
- Integração Supabase via helper em `lib/supabase.ts`.

---

## Variáveis de ambiente esperadas

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
ANTHROPIC_API_KEY=
```

Regras de segurança:

- `SUPABASE_SERVICE_KEY` nunca deve ser exposta no client.
- Dados sensíveis de leads, análise e crédito devem ficar restritos ao backend/Supabase.
- Qualquer decisão automática precisa registrar racional, score, fonte de dados e responsável.

---

## Estrutura de documentação

A pasta `docs/` concentra a base viva do projeto:

- `docs/01_visao_produto.md` — visão do produto e ICP.
- `docs/02_arquitetura.md` — arquitetura técnica e fluxo de dados.
- `docs/03_backlog.md` — backlog inicial PALCO-001 a PALCO-010.
- `docs/04_modelo_dados.md` — entidades, campos e extensões necessárias.
- `docs/05_go_no_go.md` — checklist mínimo de produção.
- `docs/06_agentes.md` — desenho dos agentes e governança.

---

## Backlog inicial

| ID | Tema | Prioridade | Resultado esperado |
|---|---|---:|---|
| PALCO-001 | Fundação do projeto | P0 | README, docs e governança GitHub-first |
| PALCO-002 | Identidade institucional | P0 | Landing com visual mais banco de investimento |
| PALCO-003 | Área admin | P0 | Tela interna de leads e pipeline |
| PALCO-004 | Intake de leads | P0 | Formulário com CNPJ, evento, evidências e origem |
| PALCO-005 | Score inicial | P0 | Pré-análise 0-1000 com flags de risco |
| PALCO-006 | Mesa de crédito | P1 | Visão de análise, decisão, exceções e histórico |
| PALCO-007 | Operações | P1 | Checklist de documentos, desembolso e liquidação |
| PALCO-008 | Dashboard executivo | P1 | KPIs de funil, carteira, risco e conversão |
| PALCO-009 | Agente CEO | P1 | Copiloto com contexto real do banco |
| PALCO-010 | Produção | P0 | Env vars, deploy, logs e checklist Go/No-Go |

---

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois acesse:

```bash
http://localhost:3000
```

Rotas públicas: `/`, `/como-funciona`, `/produtos`, `/para-quem`,
`/governanca`, `/faq`, `/solicitar` e `/legal`. A área `/admin` permanece
separada e exige autenticação própria.

Antes de abrir PR técnica, validar:

```bash
npm run lint
npm run build
```

---

## Convenção de trabalho

- Branches: `gpt/<feature-slug>`.
- Commits pequenos: `docs:`, `feat:`, `fix:`, `chore:`.
- PRs revisáveis, preferencialmente por módulo.
- Não misturar refatoração visual, schema e feature crítica na mesma PR.
- Toda alteração relevante deve atualizar docs ou issue correspondente.

---

## Próxima entrega recomendada

Concluir os bloqueios operacionais descritos em `docs/STATUS_2026-08-04.md` antes
de tratar o site ou o formulário como disponibilidade de crédito em produção plena.
