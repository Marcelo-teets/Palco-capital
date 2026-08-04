import type { Metadata } from "next";
import { AnalysisCta } from "@/components/site/AnalysisCta";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Estruturas de antecipação de bilheteria e capital para o ciclo financeiro de eventos ao vivo.",
};

export default function ProdutosPage() {
  return (
    <>
      <PageHero
        eyebrow="Produtos"
        title="Capital com fonte de pagamento definida."
        description="A oferta inicial prioriza recebíveis de bilheteria identificáveis. Outras estruturas só avançam quando lastro, controles e enquadramento estiverem claros."
        aside={<><span className="status-label">Política vigente</span><p>LTV máximo de referência: 70% no perfil geral e 60% para primeiro evento ou artista sem histórico conhecido.</p></>}
      />
      <section className="section">
        <div className="site-shell">
          <div className="prose-section">
            <div><span className="status-label">Foco inicial</span><h2 style={{ marginTop: "1rem" }}>Antecipação de bilheteria</h2></div>
            <div className="prose-section__body">
              <p>Estrutura para transformar parte de vendas elegíveis em caixa antes da realização do evento.</p>
              <ul>
                <li>Recebíveis identificáveis e verificáveis.</li>
                <li>Conta, plataforma e fluxo de liquidação compatíveis com os controles definidos.</li>
                <li>Valor sujeito a LTV, concentração, histórico, documentação e cenários de estresse.</li>
                <li>Condições finais definidas somente após decisão de crédito e formalização.</li>
              </ul>
            </div>
          </div>
          <div className="prose-section">
            <div><span className="status-label">Em estruturação</span><h2 style={{ marginTop: "1rem" }}>Capital de giro do evento</h2></div>
            <div className="prose-section__body">
              <p>Possíveis estruturas para cachês, locação, mídia e fornecedores, condicionadas a fonte de pagamento mapeada e documentação suficiente.</p>
              <p>A disponibilidade pública deste produto não está declarada. Casos recebidos entram apenas em avaliação exploratória, sem compromisso de oferta.</p>
            </div>
          </div>
          <div className="prose-section">
            <div><span className="status-label">Fora do escopo</span><h2 style={{ marginTop: "1rem" }}>O que não fazemos agora</h2></div>
            <div className="prose-section__body">
              <ul>
                <li>Crédito sem vínculo demonstrável com evento, contrato ou recebível.</li>
                <li>Promessa de aprovação instantânea ou taxa padronizada sem diligência.</li>
                <li>Operações com ente público enquanto o enquadramento específico permanecer em revisão.</li>
                <li>Casos cuja documentação, legalidade ou fonte dos recursos não possam ser verificadas.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <AnalysisCta />
    </>
  );
}
