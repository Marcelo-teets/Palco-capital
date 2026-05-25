# 03 — Backlog Inicial

## Convenção

- Prefixo: `PALCO-###`.
- Branches: `gpt/<feature-slug>`.
- Commits: `docs:`, `feat:`, `fix:`, `chore:`.
- PRs pequenos, revisáveis e com escopo fechado.

---

## Backlog curto

| ID | Status | Prioridade | Dono lógico | Entrega |
|---|---|---:|---|---|
| PALCO-001 | Em andamento | P0 | Produto/Tech | Fundação GitHub-first, README e docs |
| PALCO-002 | A fazer | P0 | Front-end/Produto | Identidade institucional e ajuste da landing |
| PALCO-003 | A fazer | P0 | Tech/Dados | Área admin para leads e pipeline |
| PALCO-004 | A fazer | P0 | Comercial/Operações | Intake de lead com CNPJ, evento e evidências |
| PALCO-005 | A fazer | P0 | Crédito/Risco | Score inicial 0-1000 e flags |
| PALCO-006 | A fazer | P1 | Mesa de Crédito | Tela de análise, decisão e histórico |
| PALCO-007 | A fazer | P1 | Operações | Checklist de documentos, desembolso e liquidação |
| PALCO-008 | A fazer | P1 | Dados | Dashboard executivo e operacional |
| PALCO-009 | A fazer | P1 | Agentes | CEO Copilot com contexto real e logs |
| PALCO-010 | A fazer | P0 | Tech/Ops | Produção: env vars, deploy, logs e checklist |

---

## PALCO-001 — Fundação do projeto

Objetivo: substituir a base genérica do template por documentação executiva e técnica da Palco Capital.

Critérios de aceite:

- README descreve produto, tese, stack e backlog.
- `docs/` contém visão, arquitetura, backlog, dados, Go/No-Go e agentes.
- `AGENTS.md` contém regras específicas do projeto.
- Nenhuma mudança funcional arriscada é incluída nesta PR.

---

## PALCO-002 — Identidade institucional

Objetivo: transformar a landing em uma experiência mais próxima de boutique financeira/private credit.

Critérios de aceite:

- Reduz linguagem promocional.
- Evita promessa de aprovação garantida.
- Usa visual navy/off-white/cinza, com acento moderado.
- Mantém CTA e formulário.
- Adiciona disclaimers mínimos de elegibilidade.

---

## PALCO-003 — Área admin

Objetivo: criar tela interna para leitura e priorização de leads.

Critérios de aceite:

- Lista leads do Supabase.
- Permite filtrar por status.
- Mostra cidade/UF, data do evento, valor estimado e origem.
- Não expõe segredos no client.
- Está preparada para futura autenticação.

---

## PALCO-004 — Intake enriquecido

Objetivo: melhorar captura de dados para análise real de crédito.

Campos desejados:

- CNPJ;
- razão social;
- nome fantasia;
- evento;
- cidade/UF;
- data do evento;
- local/venue;
- plataforma de ingressos;
- link de venda;
- receita vendida;
- receita esperada;
- valor solicitado;
- fonte/evidência pública.

---

## PALCO-005 — Score inicial

Objetivo: criar análise inicial padronizada.

Critérios de aceite:

- Score 0-1000.
- Classificação A/B/C/D ou equivalente.
- Flags críticas: sem CNPJ, sem evidência, evento passado, receita incompatível, concentração, reputação, ausência de recebível.
- Recomenda próximo passo: avançar, pedir docs, escalar, declinar.

---

## PALCO-006 — Mesa de crédito

Objetivo: criar tela e processo para decisão humana.

Critérios de aceite:

- Mostra dados do lead, score e racional.
- Registra decisão e responsável.
- Permite comentário e histórico.
- Escala operações acima do limite autônomo.

---

## PALCO-007 — Operações

Objetivo: controlar documentação, formalização, desembolso e liquidação.

Critérios de aceite:

- Checklist por operação.
- Status operacional.
- Pendências por responsável.
- Datas críticas.
- Registro de documentos e evidências.

---

## PALCO-008 — Dashboard executivo

Objetivo: consolidar funil e risco.

KPIs iniciais:

- leads recebidos;
- leads qualificados;
- taxa de conversão;
- volume solicitado;
- volume aprovado;
- volume desembolsado;
- score médio;
- operações escaladas;
- pendências críticas.

---

## PALCO-009 — Agente CEO

Objetivo: tornar o CEO Copilot útil para gestão diária.

Critérios de aceite:

- Consulta dados reais.
- Responde com síntese executiva.
- Mostra alertas e prioridades.
- Registra logs.
- Não inventa dados ausentes.

---

## PALCO-010 — Produção

Objetivo: deixar o MVP testável em ambiente online.

Critérios de aceite:

- Variáveis de ambiente configuradas.
- Build verde.
- Rotas críticas testadas.
- Logs acessíveis.
- Checklist Go/No-Go preenchido.
- Política mínima de privacidade preparada.