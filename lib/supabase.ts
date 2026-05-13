const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function supaFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error: ${err}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function supaGet(table: string, query = "") {
  return supaFetch(`${table}${query}`);
}

export async function supaPost(table: string, body: object) {
  return supaFetch(table, { method: "POST", body: JSON.stringify(body) });
}

export async function supaPatch(table: string, query: string, body: object) {
  return supaFetch(`${table}${query}`, { method: "PATCH", body: JSON.stringify(body) });
}

export async function logAgente(data: {
  agente: string; acao: string; entidade?: string;
  entidade_id?: string; input?: object; output?: object;
  tokens?: number; duracao_ms?: number; sucesso?: boolean; erro?: string;
}) {
  try {
    await supaPost("agent_logs", {
      agent_name: data.agente, action: data.acao,
      entity_type: data.entidade, entity_id: data.entidade_id,
      input: data.input, output: data.output,
      tokens_usados: data.tokens, duracao_ms: data.duracao_ms,
      sucesso: data.sucesso ?? true, erro: data.erro,
      status: data.sucesso !== false ? "ok" : "erro",
    });
  } catch (e) { console.error("Log error:", e); }
}
