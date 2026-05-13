"use client";
import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#080F1E]/95 backdrop-blur-xl border-b border-[#C9983A]/10" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9983A] to-[#EDD48A] flex items-center justify-center text-[#080F1E] font-bold text-sm font-mono">P</div>
          <span className="font-serif text-[#F0E6C8] text-lg tracking-wide">Palco Capital</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#F0E6C8]/50">
          <a href="#como-funciona" className="hover:text-[#C9983A] transition-colors">Como funciona</a>
          <a href="#diferenciais" className="hover:text-[#C9983A] transition-colors">Diferenciais</a>
          <a href="#simulacao" className="hover:text-[#C9983A] transition-colors">Simular</a>
          <a href="#cadastro" className="btn-gold px-5 py-2 rounded-lg text-sm">Solicitar Agora</a>
        </div>
        <a href="#cadastro" className="md:hidden btn-gold px-4 py-2 rounded-lg text-xs">Solicitar</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(201,152,58,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,152,58,0.04) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
        style={{ background: "radial-gradient(ellipse, #C9983A 0%, transparent 70%)" }} />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9983A]/30 bg-[#C9983A]/8 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9983A] animate-pulse-gold" />
          <span className="text-[#C9983A] text-xs tracking-widest uppercase font-mono">Antecipação de Recebíveis</span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-6 text-[#F0E6C8]">
          Seu evento acontece.<br />
          <span className="gold-shimmer">O capital não pode esperar.</span>
        </h1>

        <p className="text-[#F0E6C8]/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          Antecipe os recebíveis de ingressos do seu evento e tenha capital imediato para produção, marketing e estrutura — sem esperar a data do show.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#cadastro" className="btn-gold px-8 py-4 rounded-xl text-base w-full sm:w-auto">
            Quero antecipar meus recebíveis
          </a>
          <a href="#simulacao" className="btn-outline px-8 py-4 rounded-xl text-base w-full sm:w-auto">
            Simular minha operação
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto">
          {[
            { value: "48h", label: "Aprovação" },
            { value: "R$500k", label: "Limite autônomo" },
            { value: "0 burocracia", label: "100% digital" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-serif text-2xl text-[#C9983A]">{s.value}</div>
              <div className="text-xs text-[#F0E6C8]/35 mt-1 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#C9983A]/40" />
        <div className="text-[#F0E6C8]/20 text-xs tracking-widest">SCROLL</div>
      </div>
    </section>
  );
}

function ComoFunciona() {
  const steps = [
    { n: "01", title: "Cadastro do evento", desc: "Informe os dados do seu evento e a plataforma de venda de ingressos. O processo é 100% online e leva menos de 5 minutos." },
    { n: "02", title: "Análise de crédito", desc: "Nossa IA analisa o volume de ingressos vendidos, histórico do produtor e dados do evento. Resposta em até 48 horas." },
    { n: "03", title: "Contrato digital", desc: "Assinatura eletrônica do contrato de cessão de recebíveis. Simples, seguro e com validade jurídica." },
    { n: "04", title: "Capital na conta", desc: "Desembolso via PIX ou TED. O valor cai diretamente na conta da sua empresa ou CNPJ." },
    { n: "05", title: "Liquidação automática", desc: "Na data do evento, os recebíveis de ingressos são liquidados automaticamente. Sem preocupação operacional." },
  ];

  return (
    <section id="como-funciona" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[#C9983A]/60 text-xs tracking-widest uppercase font-mono mb-4">Processo</div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F0E6C8]">Como funciona</h2>
        </div>
        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#C9983A]/40 via-[#C9983A]/20 to-transparent" />
          <div className="space-y-12">
            {steps.map((s, i) => (
              <div key={s.n} className={`relative flex gap-8 md:gap-12 items-start ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="md:w-1/2 flex md:justify-end">
                  <div className={`card-glass rounded-2xl p-6 max-w-sm hover:border-[#C9983A]/30 transition-all duration-300 ${i % 2 !== 0 ? "md:mr-auto" : ""}`}>
                    <div className="font-mono text-[#C9983A]/40 text-xs mb-3">{s.n}</div>
                    <h3 className="font-serif text-xl text-[#F0E6C8] mb-2">{s.title}</h3>
                    <p className="text-[#F0E6C8]/50 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-[#080F1E] border-2 border-[#C9983A] flex items-center justify-center mt-6">
                  <div className="w-2 h-2 rounded-full bg-[#C9983A]" />
                </div>
                <div className="md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Diferenciais() {
  const items = [
    { icon: "⚡", title: "Aprovação em 48h", desc: "IA analisa o risco em tempo real. Sem reuniões, sem espera, sem burocracia." },
    { icon: "🎯", title: "Lastreado em ingressos", desc: "A garantia são os recebíveis dos ingressos já vendidos. Sem exigência de imóveis ou avalistas." },
    { icon: "📱", title: "100% digital", desc: "Cadastro, análise, contrato e desembolso. Tudo pelo celular ou computador." },
    { icon: "🔒", title: "Seguro e regulado", desc: "Operações estruturadas com cessão de recebíveis e contratos com validade jurídica plena." },
    { icon: "💰", title: "Taxas competitivas", desc: "Precificação baseada no risco real do seu evento. Quanto melhor o histórico, menor a taxa." },
    { icon: "🤝", title: "Especialistas em eventos", desc: "Entendemos o ciclo de caixa de um produtor. Nossa análise considera a realidade do mercado de eventos." },
  ];

  return (
    <section id="diferenciais" className="py-28 px-6 relative">
      <div className="absolute inset-0 opacity-30" style={{
        background: "radial-gradient(ellipse at 50% 50%, rgba(201,152,58,0.08) 0%, transparent 60%)"
      }} />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[#C9983A]/60 text-xs tracking-widest uppercase font-mono mb-4">Por que nós</div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F0E6C8]">O capital que o seu evento merece</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.title} className="card-glass rounded-2xl p-6 hover:border-[#C9983A]/30 transition-all duration-300 group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{item.icon}</div>
              <h3 className="font-serif text-lg text-[#F0E6C8] mb-2">{item.title}</h3>
              <p className="text-[#F0E6C8]/45 text-sm leading-relaxed">{item.desc}</p>
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

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <section id="simulacao" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-[#C9983A]/60 text-xs tracking-widest uppercase font-mono mb-4">Simulador</div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F0E6C8]">Simule sua operação</h2>
          <p className="text-[#F0E6C8]/40 mt-4 text-sm">Estimativa sem compromisso. A taxa real depende da análise do seu evento.</p>
        </div>
        <div className="card-glass rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[#F0E6C8]/60 text-sm">Volume de ingressos vendidos</label>
                  <span className="text-[#C9983A] font-mono text-sm">{fmt(ingressos)}</span>
                </div>
                <input type="range" min="50000" max="2000000" step="10000" value={ingressos}
                  onChange={e => setIngressos(Number(e.target.value))}
                  className="w-full accent-[#C9983A]" />
                <div className="flex justify-between text-xs text-[#F0E6C8]/20 mt-1">
                  <span>R$ 50k</span><span>R$ 2M</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[#F0E6C8]/60 text-sm">Percentual a antecipar</label>
                  <span className="text-[#C9983A] font-mono text-sm">{percentual}%</span>
                </div>
                <input type="range" min="30" max="90" step="5" value={percentual}
                  onChange={e => setPercentual(Number(e.target.value))}
                  className="w-full accent-[#C9983A]" />
                <div className="flex justify-between text-xs text-[#F0E6C8]/20 mt-1">
                  <span>30%</span><span>90%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#C9983A]/8 border border-[#C9983A]/15">
                <div className="text-[#C9983A]/60 text-xs mb-1">Taxa estimada (a.m.)</div>
                <div className="text-[#C9983A] font-mono text-lg">{taxa}%</div>
                <div className="text-[#F0E6C8]/30 text-xs mt-1">Sujeito à análise de crédito</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#0F1B35]/80 border border-[#C9983A]/10">
                <div className="text-[#F0E6C8]/40 text-xs mb-1">Valor antecipado</div>
                <div className="font-serif text-2xl text-[#F0E6C8]">{fmt(antecipacao)}</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0F1B35]/80 border border-[#C9983A]/10">
                <div className="text-[#F0E6C8]/40 text-xs mb-1">Custo da operação</div>
                <div className="font-serif text-2xl text-red-400/80">- {fmt(custo)}</div>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#C9983A]/15 to-[#C9983A]/5 border border-[#C9983A]/30">
                <div className="text-[#C9983A]/70 text-xs mb-1">Você recebe</div>
                <div className="font-serif text-3xl text-[#C9983A]">{fmt(liquido)}</div>
                <div className="text-[#F0E6C8]/30 text-xs mt-2">Depósito em até 48h após aprovação</div>
              </div>
              <a href="#cadastro" className="btn-gold w-full py-4 rounded-xl text-center block mt-4">
                Solicitar esta operação →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Cadastro() {
  const [form, setForm] = useState({ nome: "", empresa: "", email: "", telefone: "", evento: "", data_evento: "", valor_ingressos: "", como_conheceu: "" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [msg, setMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setMsg("Recebemos seu cadastro! Nossa equipe entrará em contato em até 48h.");
        setForm({ nome: "", empresa: "", email: "", telefone: "", evento: "", data_evento: "", valor_ingressos: "", como_conheceu: "" });
      } else {
        throw new Error("Erro ao salvar");
      }
    } catch {
      setStatus("error");
      setMsg("Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.");
    }
  };

  return (
    <section id="cadastro" className="py-28 px-6 relative">
      <div className="absolute inset-0 opacity-20" style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(201,152,58,0.15) 0%, transparent 60%)"
      }} />
      <div className="relative max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-[#C9983A]/60 text-xs tracking-widest uppercase font-mono mb-4">Começar</div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#F0E6C8]">Solicite sua antecipação</h2>
          <p className="text-[#F0E6C8]/40 mt-4">Preencha o formulário e nossa equipe analisa sua operação em até 48 horas.</p>
        </div>

        {status === "success" ? (
          <div className="card-glass rounded-3xl p-12 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-serif text-2xl text-[#C9983A] mb-3">Cadastro recebido!</h3>
            <p className="text-[#F0E6C8]/50">{msg}</p>
            <button onClick={() => setStatus("idle")} className="btn-outline px-6 py-3 rounded-xl mt-6 text-sm">
              Nova solicitação
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-glass rounded-3xl p-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-[#F0E6C8]/50 text-xs block mb-2">Nome completo *</label>
                <input name="nome" value={form.nome} onChange={handleChange} required placeholder="João Silva" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[#F0E6C8]/50 text-xs block mb-2">Empresa / CNPJ *</label>
                <input name="empresa" value={form.empresa} onChange={handleChange} required placeholder="Sua produtora" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[#F0E6C8]/50 text-xs block mb-2">E-mail *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="joao@produtora.com" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[#F0E6C8]/50 text-xs block mb-2">WhatsApp *</label>
                <input name="telefone" value={form.telefone} onChange={handleChange} required placeholder="(11) 99999-0000" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="text-[#F0E6C8]/50 text-xs block mb-2">Nome do evento *</label>
              <input name="evento" value={form.evento} onChange={handleChange} required placeholder="Festival X · Show Y · Congresso Z" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-[#F0E6C8]/50 text-xs block mb-2">Data do evento *</label>
                <input name="data_evento" type="date" value={form.data_evento} onChange={handleChange} required className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[#F0E6C8]/50 text-xs block mb-2">Volume de ingressos vendidos (R$) *</label>
                <input name="valor_ingressos" type="number" value={form.valor_ingressos} onChange={handleChange} required placeholder="Ex: 350000" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="text-[#F0E6C8]/50 text-xs block mb-2">Como conheceu a Palco Capital?</label>
              <select name="como_conheceu" value={form.como_conheceu} onChange={handleChange} className="input-dark w-full px-4 py-3 rounded-xl text-sm">
                <option value="">Selecione...</option>
                <option value="indicacao">Indicação</option>
                <option value="google">Google</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            {status === "error" && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{msg}</div>
            )}

            <button type="submit" disabled={status === "loading"} className="btn-gold w-full py-4 rounded-xl text-base mt-2 disabled:opacity-50">
              {status === "loading" ? "Enviando..." : "Solicitar análise gratuita →"}
            </button>
            <p className="text-[#F0E6C8]/25 text-xs text-center">Sem compromisso. Análise 100% gratuita e sigilosa.</p>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#C9983A]/10 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#C9983A] to-[#EDD48A] flex items-center justify-center text-[#080F1E] font-bold text-xs font-mono">P</div>
            <span className="font-serif text-[#F0E6C8]/70">Palco Capital</span>
          </div>
          <p className="text-[#F0E6C8]/20 text-xs text-center">
            © 2025 Palco Capital. Antecipação de recebíveis para produtores de eventos no Brasil.
          </p>
          <div className="flex gap-6 text-xs text-[#F0E6C8]/30">
            <a href="#" className="hover:text-[#C9983A] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[#C9983A] transition-colors">Termos</a>
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
