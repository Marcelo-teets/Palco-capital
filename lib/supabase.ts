const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SUPABASE_PUBLISHABLE_KEY = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)?.trim();
const SUPABASE_SERVICE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY
)?.trim();

type AccessMode = "public" | "service";

function requiredValue(name: string, value?: string) {
  if (!value || value.includes("your-") || value.includes("example")) {
    throw new Error(`${name} não está configurado corretamente.`);
  }
  return value;
}

function credentials(mode: AccessMode) {
  const url = requiredValue("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL);
  const key =
    mode === "public"
      ? requiredValue(
          "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
          SUPABASE_PUBLISHABLE_KEY,
        )
      : requiredValue("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_KEY);

  return { url, key };
}

export async function supaFetch(
  path: string,
  opts: RequestInit = {},
  mode: AccessMode = "service",
) {
  const { url, key } = credentials(mode);
  const headers = new Headers(opts.headers);

  headers.set("apikey", key);
  headers.set("Authorization", `Bearer ${key}`);
  headers.set("Content-Type", "application/json");
  if (!headers.has("Prefer")) headers.set("Prefer", "return=representation");

  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...opts,
    cache: opts.cache ?? "no-store",
    headers,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error (${res.status}): ${err}`);
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

export async function supaPublicPost(table: string, body: object) {
  return supaFetch(
    table,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: { Prefer: "return=minimal" },
    },
    "public",
  );
}

export async function supaPatch(table: string, query: string, body: object) {
  return supaFetch(`${table}${query}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function logAgente(data: {
  agente: string;
  acao: string;
  entidade?: string;
  entidade_id?: string;
  input?: object;
  output?: object;
  tokens?: number;
  duracao_ms?: number;
  sucesso?: boolean;
  erro?: string;
}) {
  try {
    await supaPost("agent_logs", {
      agent_name: data.agente,
      action: data.acao,
      entity_type: data.entidade,
      entity_id: data.entidade_id,
      input: data.input,
      output: data.output,
      tokens_usados: data.tokens,
      duracao_ms: data.duracao_ms,
      sucesso: data.sucesso ?? true,
      erro: data.erro,
      status: data.sucesso !== false ? "ok" : "erro",
    });
  } catch (e) {
    console.error("Log error:", e);
  }
}
