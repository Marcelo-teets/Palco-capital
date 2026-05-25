<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Palco Capital — Regras do Projeto

## Idioma e tom

- Responder e documentar em PT-BR claro.
- Usar tom institucional, executivo e objetivo.
- Evitar linguagem excessivamente promocional, informal ou “startup demais”.
- Posicionamento visual e textual deve lembrar crédito estruturado, private credit e investment banking.

## Fonte de verdade

- GitHub é a fonte de verdade para código, documentação, backlog, issues e PRs.
- Supabase é a fonte de verdade para dados operacionais.
- Issues devem usar prefixo `PALCO-###`.
- Branches devem seguir `gpt/<feature-slug>`.
- PRs devem ser pequenos, revisáveis e com escopo claro.

## Segurança

- Nunca expor `SUPABASE_SERVICE_KEY` no client.
- Nunca hardcodar chaves de API, tokens ou segredos.
- Decisões de crédito devem registrar racional, score, dados usados e responsável.
- Aprovações automáticas acima de limite autônomo ou com flags críticas devem escalar para decisão humana.

## Produto

- Foco Brasil e mercado de eventos ao vivo.
- ICP inicial: produtores, venues, festivais, turnês, artistas, agências, operadores, escolas, clubes, igrejas e prefeituras com eventos economicamente mapeáveis.
- Fora do foco inicial: RH, ONGs e casos sem vínculo claro com evento, bilheteria, contrato ou recebível.
- Capturar sempre que possível: CNPJ, evento, cidade/UF, data, fonte de recebível, plataforma de ingressos, evidência pública e responsável econômico.

## Crédito e governança

- Não afirmar aprovação garantida.
- Não afirmar “zero risco” ou “sem burocracia” em contexto de decisão de crédito.
- Usar linguagem como “análise inicial”, “sujeito à elegibilidade”, “dependente de documentação” e “condicionado à política de crédito”.
- Cada análise deve separar dado observado, dado inferido e estimativa.

## Front-end

- Identidade preferencial: azul-marinho profundo, off-white, cinza institucional e uso moderado de acento metálico.
- Evitar roxo como cor dominante.
- Priorizar whitespace, grid limpo, tipografia editorial e experiência de boutique financeira.
- Não remover captação de leads sem substituir por fluxo equivalente.

## Qualidade

Antes de PR técnica relevante:

```bash
npm run lint
npm run build
```

Se a alteração for apenas documentação, deixar isso claro no PR.