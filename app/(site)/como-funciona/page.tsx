import type { Metadata } from "next";
import { AnalysisCta } from "@/components/site/AnalysisCta";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Como funciona",
  description: "Conheça as etapas de elegibilidade, análise, formalização e acompanhamento da Palco Capital.",
};

const stages = [
  ["01", "Solicitação", "Você informa CNPJ, evento, bilheteria, valor, prazo e destino do recurso."],
  ["02", "Triagem de elegibilidade", "Confirmamos escopo, dados mínimos, evidências públicas e aderência inicial à política."],
  ["03", "Diligência e crédito", "Documentos, histórico, partes, recebíveis, cenários e riscos são analisados em conjunto."],
  ["04", "Estruturação", "Se houver apetite, definimos controles, condições, garantias e fluxo de liquidação."],
  ["05", "Decisão e formalização", "A alçada competente decide; a operação só existe após documentação válida e requisitos cumpridos."],
  ["06", "Acompanhamento", "Evidências e obrigações são monitoradas até a liquidação integral."],
] as const;

export default function ComoFuncionaPage() {
  return (
    <>
      <PageHero
        eyebrow="Como funciona"
        title="Do contexto à decisão, sem caixa-preta."
        description="Organizamos informações do evento em uma esteira rastreável. Automação reduz trabalho repetitivo; julgamento, exceções e alçadas continuam humanos."
        aside={<><strong>Tempo de resposta não é prometido.</strong><p>O prazo varia conforme completude, complexidade, terceiros e disponibilidade de capital.</p></>}
      />
      <section className="section">
        <div className="site-shell">
          <div className="editorial-grid">
            {stages.map(([number, title, description]) => (
              <article className="editorial-card card-span-4" key={number}>
                <span className="number-label">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--rule">
        <div className="site-shell">
          <div className="section-heading">
            <div><p className="eyebrow">O que acelera</p><h2 className="section-title">Dados consistentes desde o início.</h2></div>
            <div className="lead-copy">
              <p>Tenha em mãos CNPJ, cronograma, local, plataforma de ingressos, vendas realizadas, orçamento, contratos relevantes e destino do recurso.</p>
              <p className="callout">Nunca envie senhas, chaves de acesso ou documentos sigilosos no campo de link público. O canal seguro de diligência é definido somente após a triagem.</p>
            </div>
          </div>
        </div>
      </section>
      <AnalysisCta />
    </>
  );
}
