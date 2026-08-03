import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { callClaude } from "@/lib/claude";
import { supaGet, logAgente } from "@/lib/supabase";

const SYSTEM_CEO = `Você é o Agente CEO da Palco Capital, plataforma brasileira de crédito privado para eventos ao vivo.

Reporte ao Chairman. Limite autônomo: R$500k. Acima: escala.
Coordene: Comercial, Crédito, Operações, Financeiro e Tecnologia.
Responda em português, de forma executiva e direta. Máximo 250 palavras.`;

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const t0 = Date.now();
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];

    if (!messages.length) {
      return NextResponse.json(
        { error: "messages é obrigatório." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const [pipeline, escalacoes] = await Promise.all([
      supaGet("vw_pipeline_resumo", "").catch(() => []),
      supaGet("escalacoes", "?status=eq.pendente").catch(() => []),
    ]);

    const ctx = `\nCONTEXTO ATUAL (${new Date().toLocaleString("pt-BR")}):\nPipeline: ${JSON.stringify(pipeline)}\nEscalações pendentes: ${escalacoes?.length || 0}`;
    const { text, tokens, duracao_ms } = await callClaude(
      SYSTEM_CEO + ctx,
      messages,
    );

    await logAgente({
      agente: "agente_ceo",
      acao: "chat",
      input: { msgs: messages.length },
      output: { len: text.length },
      tokens,
      duracao_ms: Date.now() - t0,
    });

    return NextResponse.json(
      { text, tokens, duracao_ms },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
