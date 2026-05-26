"use client";

import { useEffect, useMemo, useState } from "react";

type Lead = {
  id?: string | number;
  nome?: string | null;
  nome_produtor?: string | null;
  empresa?: string | null;
  email?: string | null;
  telefone?: string | null;
  evento?: string | null;
  tipo_evento?: string | null;
  data_evento?: string | null;
  receita_estimada?: number | null;
  valor_ingressos?: number | null;
  cidade?: string | null;
  estado?: string | null;
  status?: string | null;
  origem?: string | null;
  created_at?: string | null;
};

type LoadState = "loading" | "ready" | "error";

const statusOptions = ["todos", "novo", "em_analise", "qualificado", "escalado", "declinado"];

function formatCurrency(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function normalizeStatus(status?: string | null) {
  return status || "sem_status";
}

function statusClass(status?: string | null) {
  switch (normalizeStatus(status)) {
    case "novo":
      return "border-[#D8C08A]/40 bg-[#D8C08A]/10 text-[#D8C08A]";
    case "em_analise":
      return "border-sky-300/30 bg-sky-400/10 text-sky-200";
    case "qualificado":
      return "border-emerald-300/30 bg-emerald-400/10 text-emerald-200";
    case "escalado":
      return "border-orange-300/30 bg-orange-400/10 text-orange-200";
    case "declinado":
      return "border-red-300/30 bg-red-400/10 text-red-200";
    default:
      return "border-[#F7F7F4]/15 bg-[#F7F7F4]/5 text-[#F7F7F4]/60";
  }
}

function displayName(lead: Lead) {
  return lead.nome || lead.nome_produtor || "Responsável não informado";
}

function getLeadAmount(lead: Lead) {
  return lead.valor_ingressos ?? lead.receita_estimada ?? null;
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadLeads() {
      setState("loading");
      setError("");
      try {
        const response = await fetch("/api/leads?limit=100", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Erro ao carregar leads");
        setLeads(Array.isArray(data) ? data : []);
        setState("ready");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setState("error");
      }
    }

    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const statusMatch = statusFilter === "todos" || normalizeStatus(lead.status) === statusFilter;
      const text = [lead.nome, lead.nome_produtor, lead.empresa, lead.email, lead.telefone, lead.evento, lead.cidade, lead.estado, lead.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const textMatch = !term || text.includes(term);
      return statusMatch && textMatch;
    });
  }, [leads, search, statusFilter]);

  const metrics = useMemo(() => {
    const volume = leads.reduce((sum, lead) => sum + (getLeadAmount(lead) || 0), 0);
    const novo = leads.filter((lead) => normalizeStatus(lead.status) === "novo").length;
    const escalado = leads.filter((lead) => normalizeStatus(lead.status) === "escalado").length;
    const semEvento = leads.filter((lead) => !lead.evento).length;
    return { total: leads.length, novo, escalado, semEvento, volume };
  }, [leads]);

  return (
    <main className="min-h-screen bg-[#0B1F33] px-6 py-10 text-[#F7F7F4]">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-6 border-b border-[#F7F7F4]/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <a href="/" className="text-sm text-[#D8C08A] hover:text-[#F7F7F4]">← Voltar para landing</a>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.28em] text-[#D8C08A]">Palco Capital Admin</p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl">Triagem de leads</h1>
            <p className="mt-4 max-w-3xl text-[#F7F7F4]/55">
              Primeira visão operacional para leitura, busca e priorização dos leads capturados no formulário público.
            </p>
          </div>
          <div className="rounded-2xl border border-[#F7F7F4]/10 bg-[#F7F7F4]/5 px-5 py-4 text-sm text-[#F7F7F4]/60">
            Fonte: <span className="text-[#F7F7F4]">GET /api/leads</span>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <Metric title="Total de leads" value={String(metrics.total)} />
          <Metric title="Novos" value={String(metrics.novo)} />
          <Metric title="Escalados" value={String(metrics.escalado)} />
          <Metric title="Volume informado" value={formatCurrency(metrics.volume)} />
        </section>

        <section className="mb-6 grid gap-4 rounded-3xl border border-[#F7F7F4]/10 bg-[#F7F7F4]/5 p-5 md:grid-cols-[1fr_220px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por produtor, empresa, evento, cidade, e-mail ou status"
            className="input-dark rounded-xl px-4 py-3 text-sm"
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="input-dark rounded-xl px-4 py-3 text-sm">
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status === "todos" ? "Todos os status" : status}</option>
            ))}
          </select>
        </section>

        {state === "loading" && <EmptyState title="Carregando leads" description="Consultando a API interna da Palco Capital." />}
        {state === "error" && <EmptyState title="Erro ao carregar leads" description={error || "Tente novamente em instantes."} />}
        {state === "ready" && filteredLeads.length === 0 && (
          <EmptyState title="Nenhum lead encontrado" description="Ajuste os filtros ou aguarde novas solicitações pela landing." />
        )}

        {state === "ready" && filteredLeads.length > 0 && (
          <section className="overflow-hidden rounded-3xl border border-[#F7F7F4]/10 bg-[#F7F7F4]/5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead className="border-b border-[#F7F7F4]/10 text-xs uppercase tracking-[0.18em] text-[#F7F7F4]/38">
                  <tr>
                    <th className="px-5 py-4 font-medium">Lead</th>
                    <th className="px-5 py-4 font-medium">Evento</th>
                    <th className="px-5 py-4 font-medium">Local/Data</th>
                    <th className="px-5 py-4 font-medium">Volume</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Origem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F7F7F4]/8">
                  {filteredLeads.map((lead, index) => (
                    <tr key={lead.id || `${lead.email}-${index}`} className="hover:bg-[#F7F7F4]/5">
                      <td className="px-5 py-5 align-top">
                        <div className="font-medium text-[#F7F7F4]">{displayName(lead)}</div>
                        <div className="mt-1 text-[#F7F7F4]/45">{lead.empresa || "Empresa/CNPJ não informado"}</div>
                        <div className="mt-2 text-xs text-[#F7F7F4]/35">{lead.email || "sem e-mail"} · {lead.telefone || "sem telefone"}</div>
                      </td>
                      <td className="px-5 py-5 align-top">
                        <div className="text-[#F7F7F4]">{lead.evento || "Evento não informado"}</div>
                        <div className="mt-1 text-xs text-[#F7F7F4]/40">{lead.tipo_evento || "tipo pendente"}</div>
                      </td>
                      <td className="px-5 py-5 align-top text-[#F7F7F4]/55">
                        <div>{[lead.cidade, lead.estado].filter(Boolean).join("/") || "Local pendente"}</div>
                        <div className="mt-1 text-xs text-[#F7F7F4]/35">{formatDate(lead.data_evento)}</div>
                      </td>
                      <td className="px-5 py-5 align-top font-mono text-[#D8C08A]">{formatCurrency(getLeadAmount(lead))}</td>
                      <td className="px-5 py-5 align-top">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${statusClass(lead.status)}`}>{normalizeStatus(lead.status)}</span>
                      </td>
                      <td className="px-5 py-5 align-top text-[#F7F7F4]/45">
                        <div>{lead.origem || "—"}</div>
                        <div className="mt-1 text-xs text-[#F7F7F4]/30">{formatDate(lead.created_at)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <p className="mt-6 text-xs text-[#F7F7F4]/35">
          MVP interno sem autenticação. Antes de produção, esta rota deve ser protegida por login/permissão.
        </p>
      </div>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#F7F7F4]/10 bg-[#F7F7F4]/5 p-5">
      <div className="text-xs uppercase tracking-[0.18em] text-[#F7F7F4]/38">{title}</div>
      <div className="mt-3 font-serif text-3xl text-[#D8C08A]">{value}</div>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-[#F7F7F4]/10 bg-[#F7F7F4]/5 p-10 text-center">
      <h2 className="font-serif text-3xl text-[#F7F7F4]">{title}</h2>
      <p className="mt-3 text-[#F7F7F4]/48">{description}</p>
    </div>
  );
}
