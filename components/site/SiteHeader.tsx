import Link from "next/link";

const navigation = [
  ["Como funciona", "/como-funciona"],
  ["Produtos", "/produtos"],
  ["Para quem", "/para-quem"],
  ["Governança", "/governanca"],
  ["FAQ", "/faq"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell site-header__row">
        <Link href="/" className="brand" aria-label="Palco Capital — página inicial">
          <span className="brand__mark" aria-hidden="true">P</span>
          <span>Palco Capital</span>
        </Link>

        <nav className="site-nav" aria-label="Navegação principal">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
          <Link className="button-primary" href="/solicitar">Solicitar análise</Link>
        </nav>

        <details className="mobile-menu">
          <summary>Menu</summary>
          <nav aria-label="Navegação móvel">
            {navigation.map(([label, href]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
            <Link href="/solicitar">Solicitar análise</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
