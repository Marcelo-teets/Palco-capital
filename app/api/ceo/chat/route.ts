import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/claude";
import { supaGet, logAgente } from "@/lib/supabase";

const SYSTEM_CEO = `Você é o Agente CEO da Palco Capital, fintech brasileira de antecipação de recebíveis para produtores de eventos, usando venda de ingressos como garantia.

Reporte ao Chairman. Limite autônomo: R$500k. Acima: escala.
Coordene: Comercial, Crédito, Operações, Financeiro, Tech.
Responda em português, de forma executiva e direta. Máximo 250 palavras.`;

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const { messages } = await req.json();
    if (!messages?.length) return NextResponse.json({ error: "messages required" }, { status: 400 });

    // Inject live context
    const [pipeline, escalacoes] = await Promise.all([
      supaGet("vw_pipeline_resumo", "").catch(() => []),
      supaGet("escalacoes", "?status=eq.pendente").catch(() => []),
    ]);

    const ctx = `\nCONTEXTO ATUAL (${new Date().toLocaleString("pt-BR")}):\nPipeline: ${JSON.stringify(pipeline)}\nEscalações pendentes: ${escalacoes?.length || 0}`;
    const { text, tokens, duracao_ms } = await callClaude(SYSTEM_CEO + ctx, messages.slice(-12));

    await logAgente({ agente: "agente_ceo", acao: "chat", input: { msgs: messages.length }, output: { len: text.length }, tokens, duracao_ms: Date.now() - t0 });
    return NextResponse.json({ text, tokens, duracao_ms });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
