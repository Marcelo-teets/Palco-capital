"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function SimuladorCaixa() {
  const ticketingId = useId();
  const requestId = useId();
  const termId = useId();
  const rateId = useId();
  const profileId = useId();
  const [ticketing, setTicketing] = useState(1_200_000);
  const [requested, setRequested] = useState(500_000);
  const [term, setTerm] = useState(4);
  const [monthlyReference, setMonthlyReference] = useState(2.5);
  const [profile, setProfile] = useState<"geral" | "primeiro_evento">("geral");

  const result = useMemo(() => {
    const platformFeeReference = 0.1;
    const ltv = profile === "geral" ? 0.7 : 0.6;
    const netReceivables = ticketing * (1 - platformFeeReference);
    const policyCeiling = netReceivables * ltv;
    const amountConsidered = Math.min(requested, policyCeiling);
    const referenceCost = amountConsidered * (Math.pow(1 + monthlyReference / 100, term) - 1);
    const indicativeNet = Math.max(0, amountConsidered - referenceCost);

    return { ltv, netReceivables, policyCeiling, amountConsidered, referenceCost, indicativeNet };
  }, [monthlyReference, profile, requested, term, ticketing]);

  return (
    <div className="simulator">
      <div className="simulator__controls">
        <div className="simulator__control">
          <label className="simulator__label" htmlFor={ticketingId}>
            <span>Bilheteria já vendida</span>
            <strong>{brl.format(ticketing)}</strong>
          </label>
          <input
            id={ticketingId}
            type="range"
            min="100000"
            max="10000000"
            step="50000"
            value={ticketing}
            onChange={(event) => setTicketing(Number(event.target.value))}
          />
        </div>

        <div className="simulator__control">
          <label className="simulator__label" htmlFor={requestId}>
            <span>Valor pretendido</span>
            <strong>{brl.format(requested)}</strong>
          </label>
          <input
            id={requestId}
            type="range"
            min="50000"
            max="5000000"
            step="25000"
            value={requested}
            onChange={(event) => setRequested(Number(event.target.value))}
          />
        </div>

        <div className="simulator__control">
          <label className="simulator__label" htmlFor={termId}>
            <span>Prazo de referência</span>
            <strong>{term} {term === 1 ? "mês" : "meses"}</strong>
          </label>
          <input
            id={termId}
            type="range"
            min="1"
            max="12"
            value={term}
            onChange={(event) => setTerm(Number(event.target.value))}
          />
        </div>

        <div className="simulator__control">
          <label className="simulator__label" htmlFor={rateId}>
            <span>Custo mensal de referência</span>
            <strong>{monthlyReference.toFixed(1).replace(".", ",")}%</strong>
          </label>
          <input
            id={rateId}
            type="range"
            min="1.5"
            max="4.5"
            step="0.1"
            value={monthlyReference}
            onChange={(event) => setMonthlyReference(Number(event.target.value))}
          />
        </div>

        <div className="simulator__control">
          <label className="simulator__label" htmlFor={profileId}>Perfil de referência</label>
          <select
            id={profileId}
            value={profile}
            onChange={(event) => setProfile(event.target.value as "geral" | "primeiro_evento")}
          >
            <option value="geral">Histórico operacional conhecido</option>
            <option value="primeiro_evento">Primeiro evento ou artista sem histórico</option>
          </select>
        </div>
      </div>

      <div className="simulator__result" aria-live="polite">
        <p className="eyebrow">Resultado indicativo</p>
        <p style={{ marginTop: "1.5rem", color: "rgba(247,247,244,.55)", fontSize: ".75rem" }}>
          Valor líquido ilustrativo
        </p>
        <p className="result-value">{brl.format(result.indicativeNet)}</p>
        <div className="result-table">
          <div className="result-row"><span>Recebíveis após taxa de plataforma (10%)</span><strong>{brl.format(result.netReceivables)}</strong></div>
          <div className="result-row"><span>LTV máximo de referência</span><strong>{Math.round(result.ltv * 100)}%</strong></div>
          <div className="result-row"><span>Teto indicativo pela política</span><strong>{brl.format(result.policyCeiling)}</strong></div>
          <div className="result-row"><span>Valor considerado</span><strong>{brl.format(result.amountConsidered)}</strong></div>
          <div className="result-row"><span>Custo financeiro ilustrativo</span><strong>{brl.format(result.referenceCost)}</strong></div>
        </div>
        <p style={{ margin: "1.5rem 0", color: "rgba(247,247,244,.48)", fontSize: ".7rem", lineHeight: 1.65 }}>
          Simulação educacional, sem IOF, tributos, despesas jurídicas ou particularidades da operação.
          A taxa é escolhida por você apenas como referência e não representa oferta da Palco Capital.
        </p>
        <Link href="/solicitar" className="button-primary">Levar meu caso para análise</Link>
      </div>
    </div>
  );
}
