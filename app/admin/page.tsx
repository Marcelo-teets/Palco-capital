"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Lead = {
  id?: string;
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

type LoadState = "locked" | "loading" | "ready" | "error";

const statusOptions = [
  "todos",
  "novo",
  "cadastro_incompleto",
  "em_analise",
  "qualificado",
  "escalado",
  "declinado",
  "aprovado",
];

function formatCurrency(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
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

function displayName(lead: Lead) {
  return lead.nome || lead.nome_produtor || "Responsável não informado";
}

function getLeadAmount(lead: Lead) {
  return lead.valor_ingressos ?? lead.receita_estimada ?? null;
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [state, setState] = useState<LoadState>("locked");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [search, setSearch] = useState("");

  async function loadLeads(adminToken: string) {
    setState("loading");
    setError("");

    try {
      const response = await fetch("/api/leads?limit=100", {
        cache: "no-store",
        headers: { "x-palco-admin-token": adminToken },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Erro ao carregar leads");

      sessionStorage.setItem("palco_admin_token", adminToken);
      setToken(adminToken);
      setLeads(Array.isArray(data) ? data : []);
      setState("ready");
    } catch (err) {
      sessionStorage.removeItem("palco_admin_token");
      setToken("");
      setLeads([]);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setState("error");
    }
  }

  useEffect(() => {
    const savedToken = sessionStorage.getItem("palco_admin_token");
    if (savedToken) {
      setTokenInput(savedToken);
      void loadLeads(savedToken);
    }
  }, []);

  function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = tokenInput.trim();
    if (!value) {
      setError("Informe o token administrativo.");
      setState("error");
      return;
    }
    void loadLeads(value);
  }

  function handleLogout() {
    sessionStorage.removeItem("palco_admin_token");
    setToken("");
    setTokenInput("");
    setLeads([]);
    setError("");
    setState("locked");
  }

  const filteredLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const statusMatch =
        statusFilter === "todos" || normalizeStatus(lead.status) === statusFilter;
      const text = [
        lead.nome,
        lead.nome_produtor,
        lead.empresa,
        lead.email,
        lead.telefone,
        lead.evento,
        lead.cidade,
        lead.estado,
        lead.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return statusMatch && (!term || text.includes(term));
    });
  }, [leads, search, statusFilter]);

  const metrics = useMemo(() => {
    const volume = leads.reduce((sum, lead) => sum + (getLeadAmount(lead) || 0), 0);
    return {
      total: leads.length,
      novos: leads.filter((lead) => normalizeStatus(lead.status) === "novo").length,
      escalados: leads.filter((lead) => normalizeStatus(lead.status) === "escalado").length,
      volume,
    };
  }, [leads]);

  const isUnlocked = Boolean(token) && state !== "error";

  return (
    <main className="min-h-screen bg-[#0B1F33] px-6 py-10 text-[#F7F7F4]">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-6 border-b border-[#F7F7F4]/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <a href="/" className="text-sm text-[#D8C08A] hover:text-[#F7F7F4]">
              ← Voltar para landing
            </a>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.28em] text-[#D8C08A]">
              Palco Capital Admin
            </p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl">Triagem de leads</h1>
            <p className="mt-4 max-w-3xl text-[#F7F7F4]/55">
              Área interna protegida. O token é mantido apenas durante a sessão desta aba.
            </p>
          </div>
          {isUnlocked && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-[#F7F7F4]/15 px-5 py-3 text-sm text-[#F7F7F4]/70 hover:border-[#D8C08A]/50 hover:text-[#D8C08A]"
            >
              Encerrar sessão
            </button>
          )}
        </header>

        {!isUnlocked && (
          <section className="mx-auto max-w-xl rounded-3xl border border-[#F7F7F4]/10 bg-[#F7F7F4]/5 p-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#D8C08A]">
              Acesso restrito
            </p>
            <h2 className="mt-3 font-serif text-3xl">Desbloquear painel</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#F7F7F4]/50">
              Use o mesmo valor configurado em <code>PALCO_ADMIN_API_TOKEN</code> no Vercel.
            </p>
            <form onSubmit={handleUnlock} className="mt-6 space-y-4">
              <input
                type="password"
                autoComplete="current-password"
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                placeholder="Token administrativo"
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
              />
              <button type="submit" className="btn-gold w-full rounded-xl py-3">
                Entrar
              </button>
            </form>
            {error && <p className="mt-4 text-sm text-red-200">{error}</p>}
          </section>
        )}

        {isUnlocked && (
          <>
            <section className="mb-8 grid gap-4 md:grid-cols-4">
              <Metric title="Total de leads" value={String(metrics.total)} />
              <Metric title="Novos" value={String(metrics.novos)} />
              <Metric title="Escalados" value={String(metrics.escalados)} />
              <Metric title="Volume informado" value={formatCurrency(metrics.volume)} />
            </section>

            <section className="mb-6 grid gap-4 rounded-3xl border border-[#F7F7F4]/10 bg-[#F7F7F4]/5 p-5 md:grid-cols-[1fr_220px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por produtor, empresa, evento, cidade, e-mail ou status"
                className="input-dark rounded-xl px-4 py-3 text-sm"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="input-dark rounded-xl px-4 py-3 text-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "todos" ? "Todos os status" : status}
                  </option>
                ))}
              </select>
            </section>

            {state === "loading" && (
              <EmptyState title="Carregando leads" description="Consultando a API interna." />
            )}
            {state === "ready" && filteredLeads.length === 0 && (
              <EmptyState title="Nenhum lead encontrado" description="Ajuste os filtros ou aguarde novas solicitações." />
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
                            <div className="font-medium">{displayName(lead)}</div>
                            <div className="mt-1 text-[#F7F7F4]/45">{lead.empresa || "Empresa não informada"}</div>
                            <div className="mt-2 text-xs text-[#F7F7F4]/35">{lead.email || "sem e-mail"} · {lead.telefone || "sem telefone"}</div>
                          </td>
                          <td className="px-5 py-5 align-top">
                            <div>{lead.evento || "Evento não informado"}</div>
                            <div className="mt-1 text-xs text-[#F7F7F4]/40">{lead.tipo_evento || "tipo pendente"}</div>
                          </td>
                          <td className="px-5 py-5 align-top text-[#F7F7F4]/55">
                            <div>{[lead.cidade, lead.estado].filter(Boolean).join("/") || "Local pendente"}</div>
                            <div className="mt-1 text-xs text-[#F7F7F4]/35">{formatDate(lead.data_evento)}</div>
                          </td>
                          <td className="px-5 py-5 align-top font-mono text-[#D8C08A]">{formatCurrency(getLeadAmount(lead))}</td>
                          <td className="px-5 py-5 align-top">{normalizeStatus(lead.status)}</td>
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
          </>
        )}
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
      <h2 className="font-serif text-3xl">{title}</h2>
      <p className="mt-3 text-[#F7F7F4]/48">{description}</p>
    </div>
  );
}
