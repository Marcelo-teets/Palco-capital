import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Legal e privacidade",
  description: "Avisos legais, termos de uso e informações de privacidade do site Palco Capital.",
};

export default function LegalPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal e privacidade"
        title="Informação clara sobre limites e dados."
        description="Este documento público orienta o uso do site e do intake. Instrumentos definitivos de cada operação, quando aplicáveis, prevalecem sobre conteúdo institucional."
        aside={<><strong>Versão: 4 de agosto de 2026</strong><p>Conteúdo preliminar sujeito a revisão jurídica antes do início de operações reais em escala.</p></>}
      />
      <section className="section">
        <div className="site-shell">
          <div className="prose-section">
            <h2>1. Natureza do site</h2>
            <div className="prose-section__body">
              <p>O site apresenta a tese, o processo pretendido e um canal de solicitação. Nenhum conteúdo constitui oferta pública, recomendação financeira, compromisso de funding, aprovação ou contrato.</p>
              <p>Simulações são educacionais e usam hipóteses escolhidas pelo visitante. Custos, limites e condições reais somente podem ser definidos após análise e formalização.</p>
            </div>
          </div>
          <div className="prose-section">
            <h2>2. Dados coletados</h2>
            <div className="prose-section__body">
              <p>No intake, podemos coletar identificação do responsável, contato, CNPJ e informações sobre organização, evento, bilheteria e necessidade de capital.</p>
              <p>Não envie senhas, dados bancários completos, documentos pessoais, segredos comerciais ou arquivos confidenciais no campo de link público.</p>
            </div>
          </div>
          <div className="prose-section">
            <h2>3. Finalidades</h2>
            <div className="prose-section__body">
              <ul>
                <li>Receber e organizar a solicitação.</li>
                <li>Validar dados mínimos, elegibilidade e prevenção a fraude.</li>
                <li>Entrar em contato sobre a solicitação.</li>
                <li>Manter rastreabilidade, segurança e governança do processo.</li>
                <li>Cumprir obrigações legais e resguardar direitos.</li>
              </ul>
            </div>
          </div>
          <div className="prose-section">
            <h2>4. Compartilhamento e proteção</h2>
            <div className="prose-section__body">
              <p>Dados podem ser tratados por provedores de infraestrutura e profissionais necessários à análise, sob controles compatíveis com sua função. O acesso deve seguir privilégio mínimo e finalidade legítima.</p>
              <p>O formulário público não possui permissão para consultar, alterar ou excluir registros do banco. Dados sensíveis de diligência devem usar canal seguro definido após a triagem.</p>
            </div>
          </div>
          <div className="prose-section">
            <h2>5. Retenção e direitos</h2>
            <div className="prose-section__body">
              <p>Dados são mantidos pelo período necessário às finalidades informadas, obrigações legais, prevenção a fraude e defesa de direitos. O titular pode solicitar confirmação de tratamento, acesso, correção e demais direitos aplicáveis.</p>
              <p>Solicitações podem ser enviadas ao canal do encarregado: <a href="mailto:privacidade@palco.capital" style={{ color: "var(--brass)", textDecoration: "underline" }}>privacidade@palco.capital</a>. Não inclua documentos sensíveis na primeira mensagem.</p>
            </div>
          </div>
          <div className="prose-section">
            <h2>6. Atualizações</h2>
            <div className="prose-section__body">
              <p>Esta página pode mudar para refletir evolução operacional, jurídica e tecnológica. A data da versão será atualizada quando houver alteração material.</p>
              <p className="callout">Antes de contratar ou operar crédito real, a Palco Capital deve concluir validação jurídica, contratos, funding, fluxos bancários e controles operacionais aplicáveis.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
