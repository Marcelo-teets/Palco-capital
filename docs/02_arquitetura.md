# 02 — Arquitetura

## Visão geral

A arquitetura atual é um MVP full-stack em Next.js, com Supabase como camada de dados e rotas API internas para leads, dashboard e agentes.

```text
Usuário / Lead
   ↓
Landing Next.js
   ↓
/api/leads
   ↓
Supabase
   ↓
Agentes / APIs internas
   ↓
Dashboard / Mesa / CEO Copilot
```

---

## Camadas

### 1. Front-end

Responsável por:

- apresentar a Palco Capital;
- captar leads;
- explicar proposta de valor;
- futuramente suportar área admin, pipeline e mesa de crédito.

Tecnologia:

- Next.js App Router;
- React;
- TypeScript;
- CSS global em `app/globals.css`.

---

### 2. API interna

Rotas já iniciadas:

- `POST /api/leads` — cria lead;
- `GET /api/leads` — lista leads;
- `GET /api/dashboard` — consolida dados executivos;
- `/api/ceo/chat` — agente CEO com contexto Supabase;
- demais rotas de análise e escalação conforme evolução do repo.

Regras:

- API deve concentrar segredos e chamadas server-side;
- front-end nunca deve acessar service key;
- respostas devem carregar status, erro e contexto suficientes para debug.

---

### 3. Dados

Supabase é a camada transacional inicial.

Entidades esperadas:

- leads;
- análises de crédito;
- escalacoes;
- logs de agentes;
- eventos;
- empresas/CNPJs;
- documentos;
- operações;
- recebíveis;
- histórico de decisões.

---

### 4. Agentes

Agentes devem operar como copilotos e automações assistidas, não como decisores finais irrestritos.

Agentes iniciais:

- CEO;
- Crédito;
- Comercial;
- Operações;
- Financeiro;
- Dados;
- Jurídico/Risco.

Cada agente deve registrar:

- entrada recebida;
- dados consultados;
- saída gerada;
- racional;
- status;
- necessidade de escalação.

---

## Fluxo alvo de lead

1. Lead preenche formulário.
2. Sistema salva lead em Supabase.
3. Enriquecimento busca CNPJ, evento, fonte e evidência.
4. Score inicial classifica oportunidade.
5. Operações com flags críticas são escaladas.
6. Mesa de crédito decide próximo passo.
7. Dashboard consolida funil, risco e conversão.

---

## Pontos críticos de arquitetura

- Garantir variáveis de ambiente corretas em produção.
- Criar área admin protegida.
- Evitar service key no client.
- Criar schema evolutivo para CNPJ/eventos/evidências.
- Registrar logs de agentes em tabela própria.
- Separar lead comercial de operação aprovada.
- Manter decisões auditáveis.

---

## Próximas melhorias técnicas

- Adicionar testes mínimos de API.
- Criar página `/admin` protegida.
- Criar pipeline visual de leads.
- Expandir schema de leads com CNPJ e evidências.
- Criar endpoint de score desacoplado.
- Criar views Supabase para dashboard executivo.
- Padronizar respostas de erro das APIs.