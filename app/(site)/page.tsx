import Link from "next/link";
import { AnalysisCta } from "@/components/site/AnalysisCta";
import { SimuladorCaixa } from "@/components/site/SimuladorCaixa";

const process = [
  ["01", "Contexto", "CNPJ, evento, necessidade de capital e fonte de pagamento."],
  ["02", "Elegibilidade", "Validação de evidências, bilheteria, histórico e aderência à política."],
  ["03", "Crédito", "Análise de risco, documentos, estrutura e capacidade de liquidação."],
  ["04", "Formalização", "Condições finais, decisão humana e controles da operação."],
] as const;

export default function HomePage() {
  return (
    <>
      <section className="page-hero">
        <div className="site-shell page-hero__grid">
          <div>
            <p className="eyebrow">Crédito para entretenimento ao vivo</p>
            <h1 className="display-title">O evento acontece depois. O caixa precisa chegar antes.</h1>
            <p className="lead-copy" style={{ marginTop: "2rem" }}>
              A Palco Capital estrutura antecipação de recebíveis e capital de giro para produtores,
              festivais, casas de show e operadores privados de eventos no Brasil.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", marginTop: "2rem" }}>
              <Link href="/solicitar" className="button-primary">Solicitar análise</Link>
              <Link href="/como-funciona" className="button-secondary">Entender o processo</Link>
            </div>
          </div>
          <aside className="page-hero__aside">
            <p className="eyebrow">Tese de crédito</p>
            <p>Recebíveis identificáveis, evidências verificáveis e governança humana em cada decisão material.</p>
            <p style={{ marginBottom: 0 }}>
              O cadastro inicia uma triagem. Não é proposta, garantia de prazo ou aprovação de crédito.
            </p>
          </aside>
        </div>
      </section>

      <section className="section" aria-labelledby="tese-title">
        <div className="site-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Por que existimos</p>
              <h2 id="tese-title" className="section-title">Um descasamento previsível.</h2>
            </div>
            <p className="lead-copy">
              Cachês, locação, mídia e produção vencem antes da realização. A receita, porém, pode estar
              contratada ou já vendida. Estruturamos capital sobre esse ciclo — sem tratar todo evento como igual.
            </p>
          </div>
          <div className="editorial-grid" style={{ marginTop: "3.5rem" }}>
            <article className="editorial-card card-span-4">
              <span className="number-label">01 · EVIDÊNCIA</span>
              <h3>O lastro precisa ser observável.</h3>
              <p>Bilheteria, contratos, histórico, calendário e partes envolvidas sustentam a análise.</p>
            </article>
            <article className="editorial-card card-span-4">
              <span className="number-label">02 · ESPECIALIZAÇÃO</span>
              <h3>Evento não é crédito genérico.</h3>
              <p>Prazo curto, concentração de data e risco de execução exigem leitura própria do setor.</p>
            </article>
            <article className="editorial-card card-span-4">
              <span className="number-label">03 · CONTROLE</span>
              <h3>Tecnologia assiste. Pessoas decidem.</h3>
              <p>Automação organiza evidências e alertas; alçadas e exceções permanecem sob governança humana.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--dark" aria-labelledby="process-title">
        <div className="site-shell">
          <p className="eyebrow">Processo</p>
          <h2 id="process-title" className="section-title">Uma esteira curta, documentada e auditável.</h2>
          <div className="editorial-grid" style={{ marginTop: "3.5rem", color: "rgba(247,247,244,.2)" }}>
            {process.map(([number, title, description]) => (
              <article key={number} className="editorial-card card-span-3" style={{ color: "var(--paper)" }}>
                <span className="number-label">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <Link href="/como-funciona" className="button-primary" style={{ marginTop: "2rem" }}>
            Ver critérios e etapas
          </Link>
        </div>
      </section>

      <section className="section section--navy" aria-labelledby="simulator-title">
        <div className="site-shell">
          <div className="section-heading" style={{ marginBottom: "3rem" }}>
            <div>
              <p className="eyebrow">Simulador de caixa</p>
              <h2 id="simulator-title" className="section-title">Dimensione uma hipótese.</h2>
            </div>
            <p style={{ color: "rgba(247,247,244,.62)", lineHeight: 1.75, margin: 0 }}>
              Ajuste bilheteria, valor, prazo e uma taxa escolhida por você. O resultado serve apenas para
              entender a mecânica — condições reais dependem da análise integral da operação.
            </p>
          </div>
          <SimuladorCaixa />
        </div>
      </section>

      <section className="section" aria-labelledby="products-title">
        <div className="site-shell">
          <p className="eyebrow">Produtos</p>
          <h2 id="products-title" className="section-title">Começamos pelo recebível mais visível.</h2>
          <div className="editorial-grid" style={{ marginTop: "3.5rem" }}>
            <article className="editorial-card card-span-6">
              <span className="status-label">Foco inicial</span>
              <h3>Antecipação de bilheteria</h3>
              <p>Estrutura baseada em vendas identificáveis e mecanismos de pagamento vinculados ao evento.</p>
              <Link href="/produtos" style={{ display: "inline-block", marginTop: "1.5rem", color: "var(--brass)", fontWeight: 700, fontSize: ".78rem" }}>
                Conhecer o produto →
              </Link>
            </article>
            <article className="editorial-card card-span-6">
              <span className="status-label">Em estruturação</span>
              <h3>Capital de giro do evento</h3>
              <p>Possíveis estruturas para despesas de produção, sempre condicionadas a fonte de pagamento clara e controles adequados.</p>
              <Link href="/produtos" style={{ display: "inline-block", marginTop: "1.5rem", color: "var(--brass)", fontWeight: 700, fontSize: ".78rem" }}>
                Ver escopo e limites →
              </Link>
            </article>
          </div>
        </div>
      </section>

      <AnalysisCta />
    </>
  );
}
