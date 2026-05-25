# 05 — Checklist Go/No-Go

## Objetivo

Definir o mínimo necessário para considerar o MVP da Palco Capital testável em ambiente online, sem confundir MVP com operação plena de crédito.

---

## Go/No-Go técnico

| Item | Critério | Status |
|---|---|---|
| Build | `npm run build` executa sem erro | Pendente |
| Lint | `npm run lint` executa sem erro ou com exceções conhecidas | Pendente |
| Deploy | App online em ambiente Vercel | Pendente |
| Supabase | Variáveis de ambiente configuradas | Pendente |
| API Leads | `POST /api/leads` salva lead | Pendente |
| API Leads | `GET /api/leads` lista leads | Pendente |
| Dashboard | API executiva responde sem erro crítico | Pendente |
| Logs | Agentes registram logs básicos | Pendente |
| Segurança | Service key não aparece no client | Pendente |

---

## Go/No-Go de produto

| Item | Critério | Status |
|---|---|---|
| ICP | Público-alvo está claro | Parcial |
| Landing | Explica proposta de valor sem prometer aprovação | Pendente |
| Formulário | Captura dados mínimos de análise | Parcial |
| CNPJ | Campo e status de confirmação existem | Pendente |
| Evento | Evento, cidade, UF e data são capturados | Parcial |
| Evidência | Link/fonte pública pode ser armazenado | Pendente |
| Status | Lead possui status operacional | Parcial |
| Próximo passo | Sistema indica ação recomendada | Pendente |

---

## Go/No-Go de crédito

| Item | Critério | Status |
|---|---|---|
| Score | Modelo inicial 0-1000 definido | Pendente |
| Flags | Flags críticas padronizadas | Pendente |
| Racional | Análise registra racional | Pendente |
| Escalação | Acima de limite autônomo escala para humano | Pendente |
| Decisão | Aprovação/declínio registram responsável | Pendente |
| Evidências | Dado observado separado de inferido | Pendente |
| Política | Política mínima de elegibilidade definida | Pendente |

---

## Go/No-Go operacional

| Item | Critério | Status |
|---|---|---|
| Documentos | Checklist mínimo definido | Pendente |
| Formalização | Fluxo de contrato/cessão/trava mapeado | Pendente |
| Desembolso | Regra de liberação documentada | Pendente |
| Liquidação | Regra de acompanhamento do recebível documentada | Pendente |
| Pendências | Responsável e prazo por pendência | Pendente |
| Auditoria | Histórico de decisão e alteração | Pendente |

---

## No-Go automático

O MVP não deve ser considerado pronto para operação plena se houver qualquer um dos pontos abaixo:

- service key exposta no front-end;
- lead sem CNPJ e sem evidência mínima sendo tratado como aprovado;
- promessa comercial de aprovação garantida;
- decisão automática sem racional registrado;
- ausência de log para agentes;
- ambiente de produção sem variáveis Supabase;
- inexistência de processo humano para exceções;
- operação acima de limite sem escalação;
- ausência de política mínima de privacidade/uso de dados.

---

## Definição de MVP testável

O MVP pode ser testado comercialmente de forma controlada quando:

1. landing capta leads;
2. lead entra no Supabase;
3. time consegue ver e priorizar leads;
4. existe checklist de análise;
5. score inicial gera recomendação;
6. exceções são escaladas;
7. logs e status são registrados;
8. linguagem comercial está adequada;
9. documentação mínima está no GitHub;
10. deploy está estável.