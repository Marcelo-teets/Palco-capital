import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, description, aside }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="site-shell page-hero__grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-title">{title}</h1>
          <p className="lead-copy" style={{ marginTop: "2rem" }}>{description}</p>
        </div>
        {aside ? <aside className="page-hero__aside">{aside}</aside> : <div />}
      </div>
    </section>
  );
}
