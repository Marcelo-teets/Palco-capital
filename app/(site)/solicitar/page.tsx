import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { SolicitacaoWizard } from "@/components/site/SolicitacaoWizard";

export const metadata: Metadata = {
  title: "Solicitar análise",
  description: "Envie os dados iniciais da empresa, evento e necessidade de capital para triagem de elegibilidade.",
};

export default function SolicitarPage() {
  return (
    <>
      <PageHero
        eyebrow="Solicitar análise"
        title="Comece pelo contexto objetivo."
        description="São três etapas: organização, evento e necessidade de capital. Use dados reais e não inclua informações sigilosas em links públicos."
        aside={<><strong>Leva cerca de 5 minutos.</strong><p>Campos com asterisco são necessários para a triagem inicial.</p></>}
      />
      <section className="section">
        <div className="site-shell" style={{ maxWidth: "62rem" }}>
          <SolicitacaoWizard />
        </div>
      </section>
    </>
  );
}
