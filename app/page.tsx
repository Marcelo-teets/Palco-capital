"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

const emptyForm = {
  nome: "",
  cargo: "",
  empresa: "",
  tipo_organizacao: "",
  cnpj: "",
  email: "",
  telefone: "",
  tempo_operacao: "",
  eventos_12m: "",
  evento: "",
  tipo_evento: "",
  data_evento: "",
  cidade: "",
  estado: "",
  venue: "",
  valor_ingressos: "",
  receita_esperada: "",
  valor_solicitado: "",
  plataforma_ingressos: "",
  link_venda: "",
  urgencia: "",
  destino_recurso: "",
  como_conheceu: "",
  consentimento_lgpd: false,
};

const processSteps = [
  ["1", "Contexto", "Dados da empresa, do evento e da necessidade de capital."],
  ["2", "Elegibilidade", "Validação de CNPJ, bilheteria, evidências e fonte de pagamento."],
  ["3", "Crédito", "Análise de risco, histórico, documentação e capacidade de pagamento."],
  ["4", "Estruturação", "Condições, formalização e fluxo operacional da operação."],
];

const fieldClass = "input-dark w-full rounded-xl px-4 py-3 text-sm";

export default function Home() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(emptyForm);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const nextValue =
      event.target instanceof HTMLInputElement && event.target.type === "checkbox"
        ? event.target.checked
        : value;

    setForm((current) => ({ ...current, [name]: nextValue }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Não foi possível enviar a solicitação.");
      }

      setStatus("success");
      setMessage(
        result.message ||
          "Recebemos sua solicitação. A equipe seguirá com a triagem de elegibilidade.",
      );
      setForm(emptyForm);
    } catch (error: unknown) {
      setStatus("error");
      setMessage((error as Error).message);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1F33] text-[#F7F7F4]">
      <nav className="sticky top-0 z-50 border-b border-[#F7F7F4]/10 bg-[#0B1F33]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#inicio" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#B08A43]/70 font-serif text-xl text-[#D8C08A]">
              P
            </span>
            <span className="font-serif text-xl">Palco Capital</span>
          </a>
          <a href="#solicitacao" className="btn-gold rounded-lg px-5 py-2 text-sm">
            Solicitar análise
          </a>
        </div>
      </nav>

      <section id="inicio" className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#D8C08A]">
              Crédito para entretenimento ao vivo
            </p>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">
              Capital para o ciclo de caixa do seu evento.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#F7F7F4]/60">
              A Palco Capital estrutura antecipação de recebíveis e capital de giro
              para produtores, festivais, casas de show e operadores de eventos no Brasil.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#solicitacao" className="btn-gold rounded-xl px-7 py-4 text-center">
                Iniciar solicitação
              </a>
              <a href="#processo" className="btn-outline rounded-xl px-7 py-4 text-center">
                Entender o processo
              </a>
            </div>
          </div>

          <div className="card-glass rounded-3xl p-7 md:p-9">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#D8C08A]">
              O que analisamos
            </p>
            <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#F7F7F4]/60">
              <p>Recebíveis de bilheteria e contratos relacionados ao evento.</p>
              <p>Histórico do produtor, local, artistas, vendas e execução operacional.</p>
              <p>Valor solicitado, prazo, destino do recurso e mecanismos de controle.</p>
            </div>
            <div className="mt-7 rounded-2xl border border-[#B08A43]/25 bg-[#B08A43]/10 p-5 text-sm text-[#D8C08A]">
              A solicitação não representa aprovação. Toda operação depende de análise,
              documentação e decisão interna.
            </div>
          </div>
        </div>
      </section>

      <section id="processo" className="border-y border-[#F7F7F4]/10 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#D8C08A]">
              Processo
            </p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">
              Uma esteira simples e auditável
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {processSteps.map(([number, title, description]) => (
              <article key={number} className="card-glass rounded-2xl p-6">
                <span className="font-mono text-xs text-[#D8C08A]">0{number}</span>
                <h3 className="mt-4 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#F7F7F4]/50">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="solicitacao" className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#D8C08A]">
              Originação
            </p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">
              Solicite uma análise de elegibilidade
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#F7F7F4]/50">
              Preencha os dados abaixo. Campos marcados como obrigatórios são necessários
              para a validação inicial da oportunidade.
            </p>
          </div>

          {status === "success" ? (
            <div className="card-glass rounded-3xl p-10 text-center">
              <h3 className="font-serif text-3xl text-[#D8C08A]">Solicitação recebida</h3>
              <p className="mt-4 text-[#F7F7F4]/60">{message}</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="btn-outline mt-7 rounded-xl px-6 py-3"
              >
                Enviar nova solicitação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-glass space-y-9 rounded-3xl p-6 md:p-9">
              <fieldset>
                <legend className="mb-5 font-serif text-2xl">Responsável e empresa</legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="nome" value={form.nome} onChange={handleChange} required placeholder="Nome completo *" className={fieldClass} />
                  <input name="cargo" value={form.cargo} onChange={handleChange} placeholder="Cargo" className={fieldClass} />
                  <input name="empresa" value={form.empresa} onChange={handleChange} required placeholder="Razão social ou nome da empresa *" className={fieldClass} />
                  <select name="tipo_organizacao" value={form.tipo_organizacao} onChange={handleChange} className={fieldClass}>
                    <option value="">Tipo de organização</option>
                    <option value="produtora">Produtora</option>
                    <option value="venue">Casa de show / venue</option>
                    <option value="festival">Festival</option>
                    <option value="agencia">Agência</option>
                    <option value="outro">Outro</option>
                  </select>
                  <input name="cnpj" value={form.cnpj} onChange={handleChange} required inputMode="numeric" placeholder="CNPJ com 14 dígitos *" className={fieldClass} />
                  <input name="telefone" value={form.telefone} onChange={handleChange} required placeholder="WhatsApp *" className={fieldClass} />
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="E-mail *" className={`${fieldClass} md:col-span-2`} />
                  <select name="tempo_operacao" value={form.tempo_operacao} onChange={handleChange} className={fieldClass}>
                    <option value="">Tempo de operação</option>
                    <option value="menos_1_ano">Menos de 1 ano</option>
                    <option value="1_a_3_anos">1 a 3 anos</option>
                    <option value="3_a_5_anos">3 a 5 anos</option>
                    <option value="mais_5_anos">Mais de 5 anos</option>
                  </select>
                  <select name="eventos_12m" value={form.eventos_12m} onChange={handleChange} className={fieldClass}>
                    <option value="">Eventos realizados nos últimos 12 meses</option>
                    <option value="0">Nenhum</option>
                    <option value="1_a_3">1 a 3</option>
                    <option value="4_a_10">4 a 10</option>
                    <option value="mais_10">Mais de 10</option>
                  </select>
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-5 font-serif text-2xl">Evento</legend>
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="evento" value={form.evento} onChange={handleChange} required placeholder="Nome do evento *" className={fieldClass} />
                  <select name="tipo_evento" value={form.tipo_evento} onChange={handleChange} className={fieldClass}>
                    <option value="">Tipo de evento</option>
                    <option value="show">Show</option>
                    <option value="festival">Festival</option>
                    <option value="turne">Turnê</option>
                    <option value="venue">Operação recorrente de venue</option>
                    <option value="corporativo">Corporativo</option>
                    <option value="outro">Outro</option>
                  </select>
                  <input name="data_evento" type="date" value={form.data_evento} onChange={handleChange} required className={fieldClass} />
                  <input name="venue" value={form.venue} onChange={handleChange} placeholder="Local / venue" className={fieldClass} />
                  <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className={fieldClass} />
                  <input name="estado" value={form.estado} onChange={handleChange} maxLength={2} placeholder="UF" className={fieldClass} />
                  <input name="plataforma_ingressos" value={form.plataforma_ingressos} onChange={handleChange} placeholder="Plataforma de ingressos" className={fieldClass} />
                  <input name="link_venda" type="url" value={form.link_venda} onChange={handleChange} placeholder="Link de venda ou evidência pública" className={fieldClass} />
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-5 font-serif text-2xl">Operação pretendida</legend>
                <div className="grid gap-4 md:grid-cols-3">
                  <input name="valor_ingressos" type="number" min="0" max="50000000" value={form.valor_ingressos} onChange={handleChange} placeholder="Receita já vendida (R$)" className={fieldClass} />
                  <input name="receita_esperada" type="number" min="0" max="50000000" value={form.receita_esperada} onChange={handleChange} placeholder="Receita esperada (R$)" className={fieldClass} />
                  <input name="valor_solicitado" type="number" min="0" max="50000000" value={form.valor_solicitado} onChange={handleChange} placeholder="Valor solicitado (R$)" className={fieldClass} />
                  <select name="urgencia" value={form.urgencia} onChange={handleChange} className={fieldClass}>
                    <option value="">Quando precisa do recurso?</option>
                    <option value="ate_7_dias">Até 7 dias</option>
                    <option value="8_a_15_dias">8 a 15 dias</option>
                    <option value="16_a_30_dias">16 a 30 dias</option>
                    <option value="mais_30_dias">Mais de 30 dias</option>
                  </select>
                  <input name="como_conheceu" value={form.como_conheceu} onChange={handleChange} placeholder="Como conheceu a Palco Capital?" className={`${fieldClass} md:col-span-2`} />
                  <textarea name="destino_recurso" value={form.destino_recurso} onChange={handleChange} rows={3} placeholder="Como o recurso será utilizado?" className={`${fieldClass} md:col-span-3`} />
                </div>
              </fieldset>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#F7F7F4]/10 bg-[#102842]/60 p-5 text-sm leading-relaxed text-[#F7F7F4]/60">
                <input
                  name="consentimento_lgpd"
                  type="checkbox"
                  checked={form.consentimento_lgpd}
                  onChange={handleChange}
                  required
                  className="mt-1 h-4 w-4 accent-[#B08A43]"
                />
                <span>
                  Autorizo a Palco Capital a utilizar os dados informados para analisar esta
                  solicitação e entrar em contato sobre a operação. *
                </span>
              </label>

              {status === "error" && (
                <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-gold w-full rounded-xl py-4 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? "Enviando..." : "Enviar para triagem"}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-[#F7F7F4]/10 px-6 py-10 text-center text-xs text-[#F7F7F4]/35">
        © 2026 Palco Capital. Crédito privado para o mercado brasileiro de eventos ao vivo.
      </footer>
    </main>
  );
}
