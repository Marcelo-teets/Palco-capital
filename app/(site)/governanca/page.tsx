import type { Metadata } from "next";
import { AnalysisCta } from "@/components/site/AnalysisCta";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Governança",
  description: "Princípios de governança, decisão humana, rastreabilidade e proteção de dados da Palco Capital.",
};

const principles = [
  ["Alçadas humanas", "Modelos e agentes assistem a análise; não substituem a decisão formal da autoridade competente."],
  ["Rastreabilidade", "Dados, regras, alertas, exceções e decisões materiais devem deixar evidência verificável."],
  ["Privilégio mínimo", "Acesso é separado por função. O formulário público pode inserir uma solicitação, mas não ler o banco."],
  ["Política versionada", "Limites e critérios são controlados. Mudanças materiais exigem registro e aprovação adequada."],
  ["Exceção explícita", "Desvios não são escondidos em automações: devem ser justificados, escalados e decididos."],
  ["Privacidade por desenho", "Coletamos o necessário para a triagem e usamos canais próprios para diligência sensível."],
] as const;

export default function GovernancaPage() {
  return (
    <>
      <PageHero
        eyebrow="Governança"
        title="Velocidade sem abandonar responsabilidade."
        description="Crédito exige julgamento, memória decisória e limites. Nossa arquitetura separa automação, análise e autoridade para que cada uma cumpra seu papel."
        aside={<><strong>Princípio central</strong><p>Nenhum resultado do simulador ou formulário equivale a decisão, contrato ou desembolso.</p></>}
      />
      <section className="section">
        <div className="site-shell">
          <div className="editorial-grid">
            {principles.map(([title, description], index) => (
              <article className="editorial-card card-span-4" key={title}>
                <span className="number-label">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--rule">
        <div className="site-shell section-heading">
          <div><p className="eyebrow">Estado operacional</p><h2 className="section-title">Transparência também é dizer “ainda não”.</h2></div>
          <div className="lead-copy">
            <p>A plataforma e a triagem estão em evolução. Funding, contratos definitivos, fluxos bancários e decisões de política pendentes precisam estar concluídos antes de operações reais em escala.</p>
            <p className="callout">As informações públicas descrevem a tese e o processo pretendido. Não constituem oferta pública de crédito, recomendação ou aconselhamento financeiro.</p>
          </div>
        </div>
      </section>
      <AnalysisCta />
    </>
  );
}
