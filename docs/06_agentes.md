# 06 — Agentes

## Objetivo

Definir como os agentes da Palco Capital devem operar no MVP: como copilotos de originação, análise, gestão e operação, sempre com logs, racional e escalação humana quando necessário.

---

## Princípios dos agentes

- Agente não substitui decisão humana crítica.
- Toda saída deve ter racional resumido.
- Toda decisão relevante deve registrar dados usados.
- Agente deve diferenciar observado, inferido e estimado.
- Agente não deve inventar dados ausentes.
- Agente deve escalar exceções.
- Agente deve operar com linguagem executiva e objetiva.

---

## Agente CEO

Função:

- consolidar visão executiva;
- responder sobre funil, risco, pendências e prioridades;
- acionar agentes especializados;
- gerar resumo para tomada de decisão.

Entradas:

- leads;
- dashboard;
- escalacoes;
- logs;
- análises de crédito.

Saídas:

- prioridades do dia;
- alertas;
- resumo executivo;
- recomendações de próximo passo.

---

## Agente Comercial

Função:

- qualificar lead;
- identificar ICP;
- sugerir abordagem;
- registrar próximos passos comerciais.

Critérios:

- evento identificável;
- CNPJ ou responsável econômico;
- potencial de recebível;
- timing;
- valor solicitado;
- fit com produto.

---

## Agente Crédito

Função:

- gerar score inicial;
- classificar risco;
- apontar flags;
- sugerir limite preliminar;
- recomendar avançar, pedir documentos, escalar ou declinar.

Não pode:

- aprovar operação sem política;
- ignorar ausência de CNPJ;
- tratar inferência fraca como fato;
- prometer desembolso.

---

## Agente Risco

Função:

- validar concentração;
- avaliar riscos de evento;
- monitorar reputação e cancelamento;
- revisar premissas de receita;
- gerar stress simples.

Flags típicas:

- evento sem evidência;
- data muito próxima;
- evento passado;
- produtor sem histórico;
- cidade/venue incompatível com receita;
- CNPJ baixado, inapto ou divergente;
- ausência de trava de recebível.

---

## Agente Operações

Função:

- controlar checklist documental;
- acompanhar formalização;
- controlar desembolso;
- monitorar liquidação;
- registrar pendências.

Checklist inicial:

- CNPJ confirmado;
- contrato/social docs;
- dados bancários;
- comprovação do evento;
- comprovação de venda ou plataforma;
- instrumento de cessão/trava quando aplicável;
- aprovação registrada.

---

## Agente Dados

Função:

- consolidar métricas;
- criar visões para dashboard;
- detectar inconsistências;
- gerar resumo executivo.

KPIs iniciais:

- leads por status;
- volume solicitado;
- volume potencial;
- score médio;
- taxa de qualificação;
- pendências críticas;
- operações escaladas.

---

## Agente Jurídico

Função:

- apoiar templates;
- apontar riscos documentais;
- sugerir política mínima de privacidade;
- revisar linguagem comercial.

Observação:

- Saídas jurídicas são apoio operacional e não substituem revisão jurídica formal.

---

## Log mínimo por agente

Cada execução deve registrar:

- nome do agente;
- ação;
- referência do lead/operação;
- resumo da entrada;
- resumo da saída;
- status;
- erro, se houver;
- timestamp.

---

## Escalação humana obrigatória

Deve escalar quando:

- valor acima do limite autônomo;
- CNPJ ausente ou divergente;
- evento sem evidência forte;
- score abaixo do limite mínimo;
- flag reputacional;
- ausência de recebível claro;
- operação fora do produto padrão;
- recomendação de declínio;
- qualquer dado crítico for inferido e não confirmado.