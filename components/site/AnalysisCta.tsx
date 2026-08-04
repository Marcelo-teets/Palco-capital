import Link from "next/link";

export function AnalysisCta() {
  return (
    <section className="section section--navy">
      <div className="site-shell cta-band">
        <div>
          <p className="eyebrow">Próximo passo</p>
          <h2 className="section-title">Conte o contexto do seu evento.</h2>
          <p style={{ maxWidth: "42rem", color: "rgba(247,247,244,.62)", lineHeight: 1.7 }}>
            A triagem começa por dados objetivos do CNPJ, da operação e dos recebíveis.
            O envio leva cerca de cinco minutos e não cria obrigação de contratar.
          </p>
        </div>
        <Link href="/solicitar" className="button-primary">Solicitar análise</Link>
      </div>
    </section>
  );
}
