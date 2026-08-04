import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <div className="site-footer__grid">
          <div>
            <Link href="/" className="brand" aria-label="Palco Capital — página inicial">
              <span className="brand__mark" aria-hidden="true">P</span>
              <span>Palco Capital</span>
            </Link>
            <p style={{ maxWidth: "30rem", color: "rgba(247,247,244,.58)", lineHeight: 1.7, fontSize: ".86rem" }}>
              Capital estruturado para o ciclo de caixa do entretenimento ao vivo brasileiro.
            </p>
          </div>
          <nav className="site-footer__links" aria-label="Institucional">
            <span className="eyebrow">Institucional</span>
            <Link href="/como-funciona">Como funciona</Link>
            <Link href="/produtos">Produtos</Link>
            <Link href="/para-quem">Para quem</Link>
            <Link href="/governanca">Governança</Link>
          </nav>
          <nav className="site-footer__links" aria-label="Informações">
            <span className="eyebrow">Informações</span>
            <Link href="/faq">Perguntas frequentes</Link>
            <Link href="/legal">Legal e privacidade</Link>
            <Link href="/solicitar">Solicitar análise</Link>
            <a href="mailto:privacidade@palco.capital">privacidade@palco.capital</a>
          </nav>
        </div>
        <div className="site-footer__legal">
          <p>© 2026 Palco Capital. Todos os direitos reservados.</p>
          <p>
            A simulação e o envio de dados não representam proposta, promessa ou aprovação de crédito.
            Toda operação está sujeita a elegibilidade, documentação, análise de risco, disponibilidade de
            capital, formalização jurídica e decisão humana competente.
          </p>
        </div>
      </div>
    </footer>
  );
}
