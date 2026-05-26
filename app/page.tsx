"use client";

import { useEffect, useState } from "react";

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#0B1F33]/95 backdrop-blur-xl border-b border-[#C8A45D]/10" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C8A45D] flex items-center justify-center text-[#0B1F33] font-bold text-sm font-mono">P</div>
          <span className="font-serif text-[#F7F7F4] text-lg tracking-wide">Palco Capital</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#F7F7F4]/60">
          <a href="#como-funciona" className="hover:text-[#C8A45D] transition-colors">Processo</a>
          <a href="#diferenciais" className="hover:text-[#C8A45D] transition-colors">Tese</a>
          <a href="#simulacao" className="hover:text-[#C8A45D] transition-colors">Simulador</a>
          <a href="#cadastro" className="btn-gold px-5 py-2 rounded-lg text-sm">Solicitar análise</a>
        </div>
        <a href="#cadastro" className="md:hidden btn-gold px-4 py-2 rounded-lg text-xs">Análise</a>
      </div>
    </nav>
  );
}

function Hero() {
  const stats = [
    { value: "Eventos", label: "Shows, festivais e turnês" },
    { value: "Recebíveis", label: "Ingressos como lastro econômico" },
    { value: "Governança", label: "Crédito, evidência e contrato" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(200,164,93,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(200,164,93,0.035) 1px, transparent 1px)`,
        backgroundSize: "64px 64px"
      }} />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[680px] h-[420px] rounded-full opacity-20" style={{ background: "radial-gradient(ellipse, #C8A45D 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C8A45D]/30 bg-[#C8A45D]/8 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8A45D]" />
          <span className="text-[#C8A45D] text-xs tracking-widest uppercase font-mono">Crédito estruturado para eventos ao vivo</span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-6 text-[#F7F7F4]">
          Capital para eventos<br />
          <span className="gold-shimmer">lastreado em recebíveis.</span>
        </h1>

        <p className="text-[#F7F7F4]/58 text-lg md:text-xl max-w-3xl mx-auto mb-10 font-light leading-relaxed">
          A Palco Capital estrutura antecipações e operações de crédito para produtores, casas, festivais e turnês, com análise baseada em venda de ingressos, histórico do responsável, evidências públicas e governança de recebíveis.
        </p>

        <p className="text-[#F7F7F4]/35 text-sm max-w-2xl mx-auto mb-12 leading-relaxed">
          Toda operação é sujeita à elegibilidade, documentação, validação jurídica, política de crédito e disponibilidade de veículo financeiro adequado.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#cadastro" className="btn-gold px-8 py-4 rounded-xl text-base w-full sm:w-auto">
            Solicitar análise da operação
          </a>
          <a href="#como-funciona" className="btn-outline px-8 py-4 rounded-xl text-base w-full sm:w-auto">
            Entender o processo
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {stats.map((item) => (
            <div key={item.value} className="text-center border border-[#C8A45D]/12 rounded-2xl p-5 bg-[#0B1F33]/35">
              <div className="font-serif text-2xl text-[#C8A45D]">{item.value}</div>
              <div className="text-xs text-[#F7F7F4]/38 mt-2 tracking-wide">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComoFunciona() {
  const steps = [
    { n: "01", title: "Originação do sinal", desc: "Recebemos os dados do evento, produtora/CNPJ responsável, praça, data, canal de venda e estimativa de recebíveis." },
    { n: "02", title: "Evidência e elegibilidade", desc: "A operação é confrontada com informações declaradas, evidências públicas, histórico do responsável e qualidade do fluxo de recebíveis." },
    { n: "03", title: "Análise de crédito", desc: "A proposta passa por avaliação de risco, limites, concentração, estrutura de garantias e aderência à política de crédito." },
    { n: "04", title: "Estruturação contratual", desc: "Quando elegível, a operação segue para documentação, cessão/controle de recebíveis e demais instrumentos aplicáveis ao caso." },
    { n: "05", title: "Desembolso e monitoramento", desc: "O desembolso ocorre após aprovação e formalização. A carteira é acompanhada até liquidação dos recebíveis." },
  ];

  return (
    <section id="como-funciona" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[#C8A45D]/70 text-xs tracking-widest uppercase font-mono mb-4">Processo institucional</div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F7F7F4]">Da identificação do evento à liquidação</h2>
          <p className="text-[#F7F7F4]/42 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
            Um fluxo pensado para transformar eventos com recebíveis mapeáveis em operações analisáveis, documentáveis e monitoráveis.
          </p>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {steps.map((step) => (
            <div key={step.n} className="card-glass rounded-2xl p-5 hover:border-[#C8A45D]/30 transition-all duration-300">
              <div className="font-mono text-[#C8A45D]/45 text-xs mb-5">{step.n}</div>
              <h3 className="font-serif text-xl text-[#F7F7F4] mb-3">{step.title}</h3>
              <p className="text-[#F7F7F4]/48 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Diferenciais() {
  const items = [
    { title: "Tese especializada", desc: "Foco em produtores, casas, festivais, turnês e operadores com dinâmica real de caixa de eventos." },
    { title: "Lastro econômico claro", desc: "Avaliação dos recebíveis de ingressos, prazos de repasse, canais de venda e capacidade de controle do fluxo." },
    { title: "CNPJ e responsável", desc: "Identificação da entidade econômica por trás do evento, diferenciando informação declarada, observada e inferida." },
    { title: "Governança de crédito", desc: "Limites, exceções, concentração, documentação e trilha de decisão antes de qualquer desembolso." },
    { title: "Monitoramento", desc: "Acompanhamento de eventos, recebíveis, liquidação e sinais de risco até o encerramento da operação." },
    { title: "Estrutura flexível", desc: "Operações desenhadas caso a caso, sujeitas à disponibilidade de capital, veículo, documentação e apetite de risco." },
  ];

  return (
    <section id="diferenciais" className="py-28 px-6 relative">
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(200,164,93,0.08) 0%, transparent 60%)" }} />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[#C8A45D]/70 text-xs tracking-widest uppercase font-mono mb-4">Tese de crédito</div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F7F7F4]">Crédito para eventos exige evidência, estrutura e disciplina</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.title} className="card-glass rounded-2xl p-6 hover:border-[#C8A45D]/30 transition-all duration-300">
              <div className="w-9 h-9 rounded-full border border-[#C8A45D]/30 text-[#C8A45D] flex items-center justify-center mb-5 font-mono text-xs">•</div>
              <h3 className="font-serif text-xl text-[#F7F7F4] mb-3">{item.title}</h3>
              <p className="text-[#F7F7F4]/46 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Simulacao() {
  const [ingressos, setIngressos] = useState(200000);
  const [percentual, setPercentual] = useState(70);
  const antecipacao = Math.round(ingressos * (percentual / 100));
  const taxa = 2.5;
  const custo = Math.round(antecipacao * (taxa / 100));
  const liquido = antecipacao - custo;

  const fmt = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <section id="simulacao" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-[#C8A45D]/70 text-xs tracking-widest uppercase font-mono mb-4">Estimativa preliminar</div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F7F7F4]">Simule um intervalo de referência</h2>
          <p className="text-[#F7F7F4]/42 mt-4 text-sm max-w-2xl mx-auto leading-relaxed">
            A simulação é meramente indicativa. Valor, taxa, prazo, garantias e desembolso dependem de análise de crédito, documentação e estrutura aplicável.
          </p>
        </div>
        <div className="card-glass rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[#F7F7F4]/60 text-sm">Volume de ingressos/recebíveis mapeados</label>
                  <span className="text-[#C8A45D] font-mono text-sm">{fmt(ingressos)}</span>
                </div>
                <input type="range" min="50000" max="2000000" step="10000" value={ingressos} onChange={(event) => setIngressos(Number(event.target.value))} className="w-full accent-[#C8A45D]" />
                <div className="flex justify-between text-xs text-[#F7F7F4]/25 mt-1"><span>R$ 50k</span><span>R$ 2M</span></div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[#F7F7F4]/60 text-sm">Percentual de referência</label>
                  <span className="text-[#C8A45D] font-mono text-sm">{percentual}%</span>
                </div>
                <input type="range" min="30" max="90" step="5" value={percentual} onChange={(event) => setPercentual(Number(event.target.value))} className="w-full accent-[#C8A45D]" />
                <div className="flex justify-between text-xs text-[#F7F7F4]/25 mt-1"><span>30%</span><span>90%</span></div>
              </div>
              <div className="p-4 rounded-xl bg-[#C8A45D]/8 border border-[#C8A45D]/15">
                <div className="text-[#C8A45D]/70 text-xs mb-1">Taxa ilustrativa mensal</div>
                <div className="text-[#C8A45D] font-mono text-lg">{taxa}%</div>
                <div className="text-[#F7F7F4]/35 text-xs mt-1">Não representa proposta firme ou aprovação de crédito.</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#0B1F33]/80 border border-[#C8A45D]/10">
                <div className="text-[#F7F7F4]/42 text-xs mb-1">Valor bruto de referência</div>
                <div className="font-serif text-2xl text-[#F7F7F4]">{fmt(antecipacao)}</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0B1F33]/80 border border-[#C8A45D]/10">
                <div className="text-[#F7F7F4]/42 text-xs mb-1">Custo ilustrativo</div>
                <div className="font-serif text-2xl text-[#F7F7F4]/75">- {fmt(custo)}</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#C8A45D]/10 border border-[#C8A45D]/30">
                <div className="text-[#C8A45D]/75 text-xs mb-1">Valor líquido estimado</div>
                <div className="font-serif text-3xl text-[#C8A45D]">{fmt(liquido)}</div>
                <div className="text-[#F7F7F4]/35 text-xs mt-2">Sujeito a aprovação, formalização e condições finais.</div>
              </div>
              <a href="#cadastro" className="btn-gold w-full py-4 rounded-xl text-center block mt-4">Enviar dados para análise →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Cadastro() {
  const [form, setForm] = useState({ nome: "", empresa: "", email: "", telefone: "", evento: "", data_evento: "", valor_ingressos: "", como_conheceu: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
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
      setMsg("Recebemos seus dados. A equipe fará uma triagem inicial e retornará com os próximos passos, caso a operação seja aderente.");
      setForm({ nome: "", empresa: "", email: "", telefone: "", evento: "", data_evento: "", valor_ingressos: "", como_conheceu: "" });
    } catch {
      setStatus("error");
      setMsg("Não foi possível enviar a solicitação agora. Tente novamente ou entre em contato por outro canal.");
    }
  };

  return (
    <section id="cadastro" className="py-28 px-6 relative">
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(200,164,93,0.15) 0%, transparent 60%)" }} />
      <div className="relative max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-[#C8A45D]/70 text-xs tracking-widest uppercase font-mono mb-4">Triagem inicial</div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F7F7F4]">Solicite análise da operação</h2>
          <p className="text-[#F7F7F4]/42 mt-4 leading-relaxed">Compartilhe os dados básicos do evento para uma avaliação preliminar de elegibilidade.</p>
        </div>

        {status === "success" ? (
          <div className="card-glass rounded-3xl p-12 text-center">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="font-serif text-2xl text-[#C8A45D] mb-3">Solicitação recebida</h3>
            <p className="text-[#F7F7F4]/52">{msg}</p>
            <button onClick={() => setStatus("idle")} className="btn-outline px-6 py-3 rounded-xl mt-6 text-sm">Nova solicitação</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-glass rounded-3xl p-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-[#F7F7F4]/55 text-xs block mb-2">Nome completo *</label>
                <input name="nome" value={form.nome} onChange={handleChange} required placeholder="João Silva" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[#F7F7F4]/55 text-xs block mb-2">Empresa / CNPJ *</label>
                <input name="empresa" value={form.empresa} onChange={handleChange} required placeholder="Produtora, casa ou operador" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[#F7F7F4]/55 text-xs block mb-2">E-mail *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="joao@produtora.com" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[#F7F7F4]/55 text-xs block mb-2">WhatsApp *</label>
                <input name="telefone" value={form.telefone} onChange={handleChange} required placeholder="(11) 99999-0000" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="text-[#F7F7F4]/55 text-xs block mb-2">Nome do evento *</label>
              <input name="evento" value={form.evento} onChange={handleChange} required placeholder="Festival X · Show Y · Turnê Z" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-[#F7F7F4]/55 text-xs block mb-2">Data do evento *</label>
                <input name="data_evento" type="date" value={form.data_evento} onChange={handleChange} required className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[#F7F7F4]/55 text-xs block mb-2">Recebíveis/ingressos mapeados (R$) *</label>
                <input name="valor_ingressos" type="number" value={form.valor_ingressos} onChange={handleChange} required placeholder="Ex: 350000" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="text-[#F7F7F4]/55 text-xs block mb-2">Como conheceu a Palco Capital?</label>
              <select name="como_conheceu" value={form.como_conheceu} onChange={handleChange} className="input-dark w-full px-4 py-3 rounded-xl text-sm">
                <option value="">Selecione...</option>
                <option value="indicacao">Indicação</option>
                <option value="google">Google</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            {status === "error" && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{msg}</div>}

            <button type="submit" disabled={status === "loading"} className="btn-gold w-full py-4 rounded-xl text-base mt-2 disabled:opacity-50">
              {status === "loading" ? "Enviando..." : "Enviar para triagem →"}
            </button>
            <p className="text-[#F7F7F4]/28 text-xs text-center leading-relaxed">
              O envio não representa aprovação de crédito, proposta vinculante ou compromisso de desembolso.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#C8A45D]/10 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#C8A45D] flex items-center justify-center text-[#0B1F33] font-bold text-xs font-mono">P</div>
            <span className="font-serif text-[#F7F7F4]/75">Palco Capital</span>
          </div>
          <p className="text-[#F7F7F4]/25 text-xs text-center">© 2026 Palco Capital. Crédito estruturado e antecipação de recebíveis para eventos no Brasil.</p>
          <div className="flex gap-6 text-xs text-[#F7F7F4]/35">
            <a href="#" className="hover:text-[#C8A45D] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[#C8A45D] transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ComoFunciona />
      <Diferenciais />
      <Simulacao />
      <Cadastro />
      <Footer />
    </main>
  );
}
