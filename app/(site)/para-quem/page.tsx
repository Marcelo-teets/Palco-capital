import type { Metadata } from "next";
import { AnalysisCta } from "@/components/site/AnalysisCta";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Para quem",
  description: "Perfis de produtores e operadores privados de eventos atendidos pela tese da Palco Capital.",
};

const profiles = [
  ["Produtoras", "Operações com agenda, orçamento, responsáveis econômicos e histórico identificáveis."],
  ["Festivais e turnês", "Projetos com múltiplas datas ou maior complexidade, avaliados com visão consolidada e por evento."],
  ["Casas de show", "Venues privados com programação recorrente e fluxo de bilheteria observável."],
  ["Agências e escritórios", "Operadores privados que estruturam eventos e conseguem demonstrar contratos e fonte de pagamento."],
] as const;

export default function ParaQuemPage() {
  return (
    <>
      <PageHero
        eyebrow="Para quem"
        title="Para quem produz, opera e assume o risco do palco."
        description="O ponto de partida é um evento real, uma organização privada identificável e uma fonte de pagamento que possa ser diligenciada."
        aside={<><strong>Brasil · operações B2B</strong><p>O intake atual exige CNPJ e não foi desenhado para crédito ao consumidor.</p></>}
      />
      <section className="section">
        <div className="site-shell">
          <div className="editorial-grid">
            {profiles.map(([title, description], index) => (
              <article className="editorial-card card-span-6" key={title}>
                <span className="number-label">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--dark">
        <div className="site-shell section-heading">
          <div><p className="eyebrow">Enquadramento</p><h2 className="section-title">Nem todo caso precisa avançar.</h2></div>
          <div style={{ color: "rgba(247,247,244,.65)", lineHeight: 1.8 }}>
            <p>A triagem verifica se há evento, responsável econômico, uso de recursos e fonte de pagamento coerentes.</p>
            <p>Entes públicos, organizações sem CNPJ elegível e demandas sem vínculo claro com entretenimento ao vivo ficam fora do escopo atual ou dependem de política específica ainda não aprovada.</p>
          </div>
        </div>
      </section>
      <AnalysisCta />
    </>
  );
}
