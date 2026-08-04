"use client";

import Link from "next/link";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { isValidCnpj, isValidOptionalUrl } from "@/lib/intake-validation";

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
  plataforma_ingressos: "",
  link_venda: "",
  valor_ingressos: "",
  receita_esperada: "",
  valor_solicitado: "",
  urgencia: "",
  destino_recurso: "",
  como_conheceu: "",
  consentimento_lgpd: false,
};

type FormData = typeof emptyForm;
type InputEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

const stepLabels = ["Empresa", "Evento", "Operação"];

function formatCnpj(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

export function SolicitacaoWizard() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<FormData>(emptyForm);

  function handleChange(event: InputEvent) {
    const { name } = event.target;
    let value: string | boolean = event.target.value;

    if (event.target instanceof HTMLInputElement) {
      if (event.target.type === "checkbox") value = event.target.checked;
      if (name === "cnpj") value = formatCnpj(event.target.value);
      if (name === "telefone") value = formatPhone(event.target.value);
    }

    setForm((current) => ({ ...current, [name]: value }));
    setStatus("idle");
    setMessage("");
  }

  function currentStepIsValid() {
    const controls = formRef.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea",
    );
    if (!controls) return false;

    for (const control of controls) {
      control.setCustomValidity("");
      if (control.name === "cnpj" && !isValidCnpj(control.value)) {
        control.setCustomValidity("Informe um CNPJ válido, incluindo os dígitos verificadores.");
      }
      if (control.name === "link_venda" && !isValidOptionalUrl(control.value)) {
        control.setCustomValidity("Informe um endereço iniciado por https:// ou http://.");
      }
      if (!control.checkValidity()) {
        control.reportValidity();
        return false;
      }
    }
    return true;
  }

  function nextStep() {
    if (!currentStepIsValid()) return;
    setStep((current) => Math.min(current + 1, 2));
    window.scrollTo({ top: formRef.current?.offsetTop ?? 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentStepIsValid()) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string; message?: string };

      if (!response.ok) throw new Error(result.error || "Não foi possível enviar a solicitação.");

      setStatus("success");
      setMessage(result.message || "Solicitação recebida para triagem.");
      setForm(emptyForm);
    } catch (error: unknown) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar a solicitação.");
    }
  }

  if (status === "success") {
    return (
      <div className="form-shell form-body" role="status">
        <p className="eyebrow">Solicitação recebida</p>
        <h2 className="section-title" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
          Obrigado pelo contexto.
        </h2>
        <p className="message-success" style={{ marginTop: "2rem" }}>{message}</p>
        <p style={{ maxWidth: "42rem", color: "var(--navy-700)", lineHeight: 1.7 }}>
          O cadastro entrou na fila de elegibilidade. A equipe poderá solicitar evidências adicionais;
          nenhuma análise concluída ou aprovação está implícita nesta confirmação.
        </p>
        <button
          type="button"
          className="button-secondary"
          onClick={() => { setStatus("idle"); setStep(0); }}
        >
          Enviar outra solicitação
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="form-shell" noValidate>
      <div className="form-progress" aria-label="Progresso da solicitação">
        {stepLabels.map((label, index) => (
          <div
            key={label}
            className="form-progress__item"
            data-active={index === step}
            data-complete={index < step}
            aria-current={index === step ? "step" : undefined}
          >
            0{index + 1} · {label}
          </div>
        ))}
      </div>

      <div className="form-body">
        {step === 0 && (
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="font-serif" style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
              Responsável e organização
            </legend>
            <div className="form-grid">
              <Field label="Nome completo" name="nome" value={form.nome} onChange={handleChange} required autoComplete="name" />
              <Field label="Cargo" name="cargo" value={form.cargo} onChange={handleChange} autoComplete="organization-title" />
              <Field label="Empresa / razão social" name="empresa" value={form.empresa} onChange={handleChange} required autoComplete="organization" />
              <SelectField label="Tipo de organização" name="tipo_organizacao" value={form.tipo_organizacao} onChange={handleChange} required>
                <option value="">Selecione</option>
                <option value="produtora">Produtora</option>
                <option value="venue">Casa de show / venue</option>
                <option value="festival">Festival</option>
                <option value="agencia">Agência / escritório</option>
                <option value="outro">Outro operador privado</option>
              </SelectField>
              <Field label="CNPJ" name="cnpj" value={form.cnpj} onChange={handleChange} required inputMode="numeric" autoComplete="off" placeholder="00.000.000/0000-00" hint="Validamos também os dois dígitos verificadores." />
              <Field label="WhatsApp" name="telefone" value={form.telefone} onChange={handleChange} required inputMode="tel" autoComplete="tel" />
              <Field label="E-mail corporativo" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
              <SelectField label="Tempo de operação" name="tempo_operacao" value={form.tempo_operacao} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="menos_1_ano">Menos de 1 ano</option>
                <option value="1_a_3_anos">1 a 3 anos</option>
                <option value="3_a_5_anos">3 a 5 anos</option>
                <option value="mais_5_anos">Mais de 5 anos</option>
              </SelectField>
              <SelectField label="Eventos nos últimos 12 meses" name="eventos_12m" value={form.eventos_12m} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="0">Nenhum</option>
                <option value="1_a_3">1 a 3</option>
                <option value="4_a_10">4 a 10</option>
                <option value="mais_10">Mais de 10</option>
              </SelectField>
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="font-serif" style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
              Evento e bilheteria
            </legend>
            <div className="form-grid">
              <Field label="Nome do evento" name="evento" value={form.evento} onChange={handleChange} required />
              <SelectField label="Tipo de evento" name="tipo_evento" value={form.tipo_evento} onChange={handleChange} required>
                <option value="">Selecione</option>
                <option value="show">Show</option>
                <option value="festival">Festival</option>
                <option value="turne">Turnê</option>
                <option value="venue">Operação recorrente de venue</option>
                <option value="corporativo">Corporativo privado</option>
                <option value="outro">Outro</option>
              </SelectField>
              <Field label="Data do evento" name="data_evento" type="date" value={form.data_evento} onChange={handleChange} required />
              <Field label="Local / venue" name="venue" value={form.venue} onChange={handleChange} />
              <Field label="Cidade" name="cidade" value={form.cidade} onChange={handleChange} required />
              <Field label="UF" name="estado" value={form.estado} onChange={handleChange} required maxLength={2} placeholder="SP" />
              <Field label="Plataforma de ingressos" name="plataforma_ingressos" value={form.plataforma_ingressos} onChange={handleChange} required />
              <Field label="Link de venda ou evidência pública" name="link_venda" type="url" value={form.link_venda} onChange={handleChange} placeholder="https://" hint="Opcional. Não envie documento confidencial neste campo." />
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="font-serif" style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
              Necessidade de capital
            </legend>
            <div className="form-grid">
              <Field label="Bilheteria já vendida (R$)" name="valor_ingressos" type="number" min="0" max="50000000" step="0.01" value={form.valor_ingressos} onChange={handleChange} required inputMode="decimal" />
              <Field label="Receita total esperada (R$)" name="receita_esperada" type="number" min="0" max="50000000" step="0.01" value={form.receita_esperada} onChange={handleChange} required inputMode="decimal" />
              <Field label="Valor solicitado (R$)" name="valor_solicitado" type="number" min="1" max="50000000" step="0.01" value={form.valor_solicitado} onChange={handleChange} required inputMode="decimal" />
              <SelectField label="Quando precisa do recurso?" name="urgencia" value={form.urgencia} onChange={handleChange} required>
                <option value="">Selecione</option>
                <option value="ate_7_dias">Até 7 dias</option>
                <option value="8_a_15_dias">8 a 15 dias</option>
                <option value="16_a_30_dias">16 a 30 dias</option>
                <option value="mais_30_dias">Mais de 30 dias</option>
              </SelectField>
              <div className="field-group field-group--full">
                <label className="field-label" htmlFor="destino_recurso">Como o recurso será utilizado? *</label>
                <textarea id="destino_recurso" name="destino_recurso" className="field" value={form.destino_recurso} onChange={handleChange} required maxLength={240} />
              </div>
              <Field full label="Como conheceu a Palco Capital?" name="como_conheceu" value={form.como_conheceu} onChange={handleChange} />
              <label className="checkbox-row field-group--full">
                <input
                  name="consentimento_lgpd"
                  type="checkbox"
                  checked={form.consentimento_lgpd}
                  onChange={handleChange}
                  required
                />
                <span>
                  Autorizo o uso dos dados informados para triagem, análise desta solicitação e contato
                  sobre a operação, conforme a <Link href="/legal" style={{ textDecoration: "underline" }}>Política de Privacidade</Link>. *
                </span>
              </label>
            </div>
          </fieldset>
        )}

        {status === "error" && <p className="message-error" role="alert" style={{ marginTop: "1.5rem" }}>{message}</p>}

        <div className="form-actions">
          {step > 0 ? (
            <button type="button" className="button-secondary" onClick={() => setStep((current) => current - 1)}>
              Voltar
            </button>
          ) : <span />}
          {step < 2 ? (
            <button type="button" className="button-primary" onClick={nextStep}>Continuar</button>
          ) : (
            <button type="submit" className="button-primary" disabled={status === "loading"}>
              {status === "loading" ? "Enviando…" : "Enviar para triagem"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (event: InputEvent) => void;
  type?: string;
  required?: boolean;
  full?: boolean;
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "url" | "search" | "decimal" | "none";
  min?: string;
  max?: string;
  step?: string;
  maxLength?: number;
};

function Field({ label, name, value, onChange, full, hint, ...props }: FieldProps) {
  const id = `field-${name}`;
  return (
    <div className={`field-group${full ? " field-group--full" : ""}`}>
      <label className="field-label" htmlFor={id}>{label}{props.required ? " *" : ""}</label>
      <input id={id} name={name} value={value} onChange={onChange} className="field" {...props} />
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (event: InputEvent) => void;
  required?: boolean;
  children: React.ReactNode;
};

function SelectField({ label, name, value, onChange, required, children }: SelectFieldProps) {
  const id = `field-${name}`;
  return (
    <div className="field-group">
      <label className="field-label" htmlFor={id}>{label}{required ? " *" : ""}</label>
      <select id={id} name={name} value={value} onChange={onChange} required={required} className="field">
        {children}
      </select>
    </div>
  );
}
