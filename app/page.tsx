"use client";

import { useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

const processSteps = [
  ["01", "Cadastro e contexto", "Empresa, evento, data, cidade, volume de recebíveis e necessidade de capital."],
  ["02", "Elegibilidade", "Triagem de CNPJ, evidências públicas, plataforma de ingressos e fonte de pagamento."],
  ["03", "Análise de crédito", "Avaliação de risco, timing, concentração, histórico, documentos e política de crédito."],
  ["04", "Estruturação", "Condições, formalização e fluxo operacional de recebíveis quando houver aderência."],
];

const thesisCards = [
  ["Live entertainment", "Foco no ciclo de caixa de produtores, casas de show, festivais, turnês e operadores de eventos."],
  ["Recebíveis mapeáveis", "A análise parte de bilheteria, contratos, plataformas de venda, evidências e responsável econômico."],
  ["Governança", "Oportunidades relevantes ou com flags críticas seguem para decisão humana e registro de racional."],
  ["Processo auditável", "Cada etapa deve preservar dados observados, inferências, estimativas, status e próximos passos."],
];

const formatCurrency = (value: number) => value.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function Home() {
  const [volume, setVolume] = useState(250000);
  const [advancePct, setAdvancePct] = useState(60);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    evento: "",
    data_evento: "",
    valor_ingressos: "",
    como_conheceu: "",
  });

  const advanceAmount = Math.round(volume * (advancePct / 100));
  const indicativeCost = Math.round(advanceAmount * 0.025);
  const indicativeNet = advanceAmount - indicativeCost;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const resetForm = () => setForm({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    evento: "",
    data_evento: "",
    valor_ingressos: "",
    como_conheceu: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Erro ao salvar lead");

      setStatus("success");
      setMessage("Recebemos sua solicitação. A próxima etapa é a triagem de elegibilidade com base nos dados informados.");
      resetForm();
    } catch {
      setStatus("error");
      setMessage("Não foi possível enviar sua solicitação agora. Revise os dados e tente novamente.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1F33] text-[#F7F7F4]">
      <nav className="fixed top-0 z-50 w-full border-b border-[#F7F7F4]/10 bg-[#0B1F33]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#B08A43]/70 font-mono text-sm font-semibold text-[#F7F7F4]">P</span>
            <span className="font-serif text-lg tracking-wide">Palco Capital</span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-[#F7F7F4]/62 md:flex">
            <a href="#processo" className="hover:text-[#D8C08A]">Processo</a>
            <a href="#tese" className="hover:text-[#D8C08A]">Tese</a>
            <a href="#estimativa" className="hover:text-[#D8C08A]">Estimativa</a>
            <a href="#cadastro" className="btn-gold rounded-lg px-5 py-2">Solicitar análise</a>
          </div>
        </div>
      </nav>

      <section id="top" className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(rgba(247,247,244,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(247,247,244,0.04) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
        <div className="relative mx-auto max-w-6xl py-20">
          <div className="mb-8 inline-flex rounded-full border border-[#B08A43]/35 bg-[#B08A43]/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-[#D8C08A]">
            Crédito privado para eventos ao vivo
          </div>
          <h1 className="max-w-5xl font-serif text-5xl leading-tight text-[#F7F7F4] md:text-7xl">
            Capital estruturado para o ciclo de caixa do seu evento.
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[#F7F7F4]/62 md:text-xl">
            A Palco Capital analisa operações de antecipação de recebíveis e capital de giro para produtores, venues, festivais e operadores de live entertainment no Brasil.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#cadastro" className="btn-gold rounded-xl px-8 py-4 text-center">Solicitar análise de elegibilidade</a>
            <a href="#processo" className="btn-outline rounded-xl px-8 py-4 text-center">Conhecer o processo</a>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[["48h", "Triagem inicial, sujeita à qualidade dos dados"], ["CNPJ + evidência", "Base mínima para avaliação da oportunidade"], ["Humano no loop", "Exceções e flags críticas são escaladas"]].map(([value, label]) => (
              <div key={value} className="card-glass rounded-2xl p-5">
                <div className="font-serif text-3xl text-[#D8C08A]">{value}</div>
                <div className="mt-2 text-sm text-[#F7F7F4]/48">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="processo" className="px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#D8C08A]">Processo de análise</p>
            <h2 className="mt-4 font-serif text-4xl text-[#F7F7F4] md:text-5xl">Da originação à decisão de crédito</h2>
            <p className="mt-5 text-[#F7F7F4]/50">A esteira separa oportunidade comercial, elegibilidade, análise de crédito, estruturação e acompanhamento operacional.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {processSteps.map(([number, title, description]) => (
              <div key={number} className="card-glass rounded-2xl p-6">
                <div className="font-mono text-xs text-[#D8C08A]/80">{number}</div>
                <h3 className="mt-4 font-serif text-xl text-[#F7F7F4]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#F7F7F4]/50">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tese" className="px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#D8C08A]">Tese operacional</p>
            <h2 className="mt-4 font-serif text-4xl text-[#F7F7F4] md:text-5xl">Lastro, evidência e governança</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {thesisCards.map(([title, description]) => (
              <div key={title} className="card-glass rounded-2xl p-7">
                <div className="mb-5 h-px w-12 bg-[#B08A43]" />
                <h3 className="font-serif text-2xl text-[#F7F7F4]">{title}</h3>
                <p className="mt-3 leading-relaxed text-[#F7F7F4]/52">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="estimativa" className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#D8C08A]">Estimativa preliminar</p>
            <h2 className="mt-4 font-serif text-4xl text-[#F7F7F4] md:text-5xl">Dimensione uma operação potencial</h2>
            <p className="mt-4 text-sm text-[#F7F7F4]/48">Simulação demonstrativa. Condições finais dependem de documentação, política de crédito e aprovação interna.</p>
          </div>
          <div className="card-glass grid gap-10 rounded-3xl p-8 md:grid-cols-2 md:p-12">
            <div className="space-y-8">
              <div>
                <div className="mb-3 flex justify-between text-sm"><span className="text-[#F7F7F4]/60">Volume bruto de recebíveis</span><span className="font-mono text-[#D8C08A]">{formatCurrency(volume)}</span></div>
                <input type="range" min="50000" max="2000000" step="10000" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="w-full accent-[#B08A43]" />
              </div>
              <div>
                <div className="mb-3 flex justify-between text-sm"><span className="text-[#F7F7F4]/60">Percentual indicativo</span><span className="font-mono text-[#D8C08A]">{advancePct}%</span></div>
                <input type="range" min="30" max="80" step="5" value={advancePct} onChange={(event) => setAdvancePct(Number(event.target.value))} className="w-full accent-[#B08A43]" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#F7F7F4]/10 bg-[#102842]/70 p-5"><p className="text-xs text-[#F7F7F4]/45">Valor potencial</p><p className="font-serif text-3xl text-[#F7F7F4]">{formatCurrency(advanceAmount)}</p></div>
              <div className="rounded-2xl border border-[#F7F7F4]/10 bg-[#102842]/70 p-5"><p className="text-xs text-[#F7F7F4]/45">Custo demonstrativo</p><p className="font-serif text-3xl text-[#F7F7F4]/80">{formatCurrency(indicativeCost)}</p></div>
              <div className="rounded-2xl border border-[#B08A43]/35 bg-[#B08A43]/10 p-5"><p className="text-xs text-[#D8C08A]/80">Líquido indicativo</p><p className="font-serif text-4xl text-[#D8C08A]">{formatCurrency(indicativeNet)}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="cadastro" className="px-6 py-28">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#D8C08A]">Originação</p>
            <h2 className="mt-4 font-serif text-4xl text-[#F7F7F4] md:text-5xl">Solicite uma análise de elegibilidade</h2>
            <p className="mt-4 text-[#F7F7F4]/48">A análise depende da confirmação do evento, CNPJ, recebíveis e documentação.</p>
          </div>
          {status === "success" ? (
            <div className="card-glass rounded-3xl p-10 text-center"><h3 className="font-serif text-3xl text-[#D8C08A]">Solicitação recebida</h3><p className="mt-4 text-[#F7F7F4]/55">{message}</p><button onClick={() => setStatus("idle")} className="btn-outline mt-6 rounded-xl px-6 py-3 text-sm">Nova solicitação</button></div>
          ) : (
            <form onSubmit={handleSubmit} className="card-glass space-y-5 rounded-3xl p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <input name="nome" value={form.nome} onChange={handleChange} required placeholder="Nome completo" className="input-dark rounded-xl px-4 py-3 text-sm" />
                <input name="empresa" value={form.empresa} onChange={handleChange} required placeholder="Empresa / CNPJ" className="input-dark rounded-xl px-4 py-3 text-sm" />
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="E-mail" className="input-dark rounded-xl px-4 py-3 text-sm" />
                <input name="telefone" value={form.telefone} onChange={handleChange} required placeholder="WhatsApp" className="input-dark rounded-xl px-4 py-3 text-sm" />
              </div>
              <input name="evento" value={form.evento} onChange={handleChange} required placeholder="Nome do evento" className="input-dark w-full rounded-xl px-4 py-3 text-sm" />
              <div className="grid gap-5 md:grid-cols-2">
                <input name="data_evento" type="date" value={form.data_evento} onChange={handleChange} required className="input-dark rounded-xl px-4 py-3 text-sm" />
                <input name="valor_ingressos" type="number" value={form.valor_ingressos} onChange={handleChange} required placeholder="Volume de ingressos / recebíveis (R$)" className="input-dark rounded-xl px-4 py-3 text-sm" />
              </div>
              <select name="como_conheceu" value={form.como_conheceu} onChange={handleChange} className="input-dark w-full rounded-xl px-4 py-3 text-sm">
                <option value="">Como chegou até a Palco Capital?</option>
                <option value="indicacao">Indicação</option>
                <option value="google">Google</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="outro">Outro</option>
              </select>
              {status === "error" && <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{message}</div>}
              <button type="submit" disabled={status === "loading"} className="btn-gold w-full rounded-xl py-4 disabled:opacity-50">{status === "loading" ? "Enviando..." : "Enviar para triagem →"}</button>
              <p className="text-center text-xs text-[#F7F7F4]/32">Envio sem compromisso. Sujeito à elegibilidade, documentação, análise de crédito e aprovação interna.</p>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-[#F7F7F4]/10 px-6 py-10 text-center text-xs text-[#F7F7F4]/35">
        © 2026 Palco Capital. Crédito privado e antecipação de recebíveis para eventos no Brasil.
      </footer>
    </main>
  );
}
