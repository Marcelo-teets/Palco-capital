# Site institucional v2 — decisão de implementação

## Objetivo

Transformar os materiais de estratégia, protótipo, design e intake em uma
experiência pública coerente com a arquitetura Next.js já publicada, sem alterar
silenciosamente política de crédito ou controles do Supabase.

## Avaliação das fontes

| Fonte | Contribuição aproveitada | Decisão de implementação |
|---|---|---|
| Estado do projeto | Arquitetura ativa, políticas vigentes e bloqueios externos | Tratado como referência operacional principal |
| Design system | Paleta, tipografia, grid editorial e regras de acessibilidade | Aplicado ao site público com tokens globais |
| Protótipo HTML | Arquitetura de informação, textos e fluxo de três etapas | Portado para rotas reais do Next.js; acesso direto ao banco descartado |
| Simulador TSX | Mecânica educacional de caixa, LTV e prazo | Refeito como componente acessível, sem HTML injetado e sem promessa de taxa |
| Cliente de leads TS | Campos e validações de origem | Mantida a API server-side; aproveitada a validação completa de CNPJ |
| Proposta de migration | Contrato esperado do intake | Não reaplicada: produção já contém versão mais restritiva e índices reconciliados |
| Brief de geração | Conteúdo das oito páginas e tom institucional | Usado como referência editorial, não como stack paralela |
| README anexado | Mapa de componentes do protótipo | Adaptado à estrutura do repositório existente |
| Snapshot privado de recuperação | Histórico, ADRs e riscos pendentes | Consultado, mas não versionado no repositório público |

As duas cópias da proposta SQL são idênticas e foram avaliadas como uma única
fonte. Nenhum backup privado, segredo ou inventário interno foi incorporado ao
GitHub.

## Arquitetura aplicada

- `app/(site)`: oito rotas públicas com header e footer compartilhados;
- `components/site`: componentes server-side por padrão e duas ilhas client-side
  para simulador e formulário;
- `POST /api/leads`: única fronteira pública de escrita;
- `lib/intake-validation.ts`: validações puras compartilhadas pelo navegador e
  pelo servidor;
- `/admin`: mantido fora do layout público e sem alteração de autorização.

As fontes Archivo, Bodoni Moda e IBM Plex Mono são empacotadas localmente. O
Next.js foi atualizado de 16.2.6 para 16.3.0, com React 19.2.8, após a auditoria
apontar correções de segurança na versão estável mais recente.

## Regras preservadas

- LTV máximo de referência de 70% no perfil geral e 60% para primeiro evento ou
  artista sem histórico;
- papel anônimo limitado a inserir um intake válido, sem leitura, atualização ou
  exclusão;
- decisão de crédito, alçadas e exceções permanecem humanas;
- entidades públicas permanecem fora do escopo atual enquanto a política
  específica estiver pendente;
- cenário severo de stress e demais deliberações pendentes não foram alterados.

## Critérios de aceite

1. oito rotas respondem e possuem metadados adequados;
2. navegação funciona em desktop e mobile;
3. simulador explicita hipóteses e ausência de oferta;
4. intake valida campos por etapa e repete a validação no servidor;
5. erros internos não são expostos ao visitante;
6. `check:intake`, lint e build passam;
7. smoke test do Supabase usa transação com rollback;
8. preview Vercel é revisado antes da promoção para produção.
