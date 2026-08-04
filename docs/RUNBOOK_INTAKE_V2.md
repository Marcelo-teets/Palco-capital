# Runbook — Intake público v2

## Objetivo

Manter o formulário público, a API Next.js e a policy RLS do Supabase alinhados. O fluxo deve aceitar solicitações legítimas sem conceder leitura, alteração ou exclusão de leads ao papel anônimo.

## Contrato obrigatório

O navegador envia os dados para `POST /api/leads`. A API valida e normaliza a entrada e define no servidor:

- `origem = site_intake_v2`;
- `status = novo`;
- `consentimento_lgpd = true`;
- `consentimento_em = horário do servidor`.

A policy `anon_insert_leads` exige os mesmos valores e também valida:

- CNPJ com 14 dígitos;
- e-mail em formato mínimo válido;
- nome, empresa e evento com tamanho aceitável;
- data do evento não anterior a ontem;
- valor solicitado entre zero e R$ 50 milhões.

## Regra de segurança

O papel `anon` possui somente `INSERT` em `public.leads`. Ele não pode consultar, atualizar ou excluir registros. Leituras e decisões administrativas passam pelas APIs protegidas e pelo `service_role` no servidor.

## Validação antes do merge

Execute:

```bash
npm ci
npm run check:intake
npm run lint
npm run build
```

O workflow `.github/workflows/quality.yml` repete essas verificações em todo PR e push para `main`.

## Smoke test do banco

O teste deve ser executado dentro de uma transação reversível:

1. iniciar `BEGIN`;
2. assumir temporariamente o papel `anon`;
3. inserir um lead sintético compatível com o contrato v2;
4. restaurar o papel original;
5. confirmar que o registro existe dentro da transação;
6. executar `ROLLBACK`.

Nunca deixe dados sintéticos em produção.

## Diagnóstico de falhas

### HTTP 400 no formulário

Verifique a mensagem retornada pela API. As causas mais comuns são CNPJ incompleto, e-mail inválido, data antiga, valor fora do limite ou ausência de consentimento.

### Erro RLS no Supabase

Compare estes três arquivos:

- `app/page.tsx`;
- `app/api/leads/route.ts`;
- `supabase/migrations/20260804133926_palco_110_hardening_policy_anon_insert_leads.sql`.

Os nomes dos campos, origem, status e consentimento precisam coincidir.

### API administrativa indisponível

`GET /api/leads` é uma rota interna. Enquanto `PALCO_ADMIN_API_TOKEN` e `SUPABASE_SERVICE_ROLE_KEY` não estiverem configurados no Vercel, ela deve falhar de forma fechada.

## Alteração do contrato

Qualquer mudança de campo obrigatório deve seguir esta ordem:

1. migration aditiva e compatível;
2. API preparada para o novo campo;
3. interface atualizada;
4. policy RLS atualizada;
5. verificação `check:intake` atualizada;
6. smoke test com rollback;
7. deploy e revisão dos logs.
