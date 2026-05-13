import { NextResponse } from "next/server";
import { callClaude } from "@/lib/claude";
import { supaGet, logAgente } from "@/lib/supabase";

export async function GET() {
  const t0 = Date.now();
  try {
    const [pipeline, financeiro, escalacoes, leads] = await Promise.all([
      supaGet("vw_pipeline_resumo", ""),
      supaGet("vw_dashboard_financeiro", "").catch(() => null),
      supaGet("escalacoes", "?status=eq.pendente"),
      supaGet("leads", "?order=created_at.desc&limit=10"),
    ]);

    const prompt = `Gere um relatório executivo diário da Palco Capital. Seja direto, use bullets, máximo 400 palavras.
Pipeline: ${JSON.stringify(pipeline)}
Financeiro: ${JSON.stringify(financeiro)}
Escalações pendentes: ${escalacoes?.length || 0}
Leads recentes: ${leads?.slice(0,5).map((l: {nome_produtor: string; status: string; receita_estimada: number}) => `${l.nome_produtor} — ${l.status} — R$${l.receita_estimada?.toLocaleString("pt-BR")}`).join(" | ")}`;

    const { text, tokens, duracao_ms } = await callClaude(
      "Você é o Agente CEO da Palco Capital. Gere relatórios executivos precisos e acionáveis em português.",
      [{ role: "user", content: prompt }], 1000
    );

    await logAgente({ agente: "agente_ceo", acao: "relatorio_diario", output: { chars: text.length }, tokens, duracao_ms: Date.now() - t0 });
    return NextResponse.json({ relatorio: text, dados: { pipeline, financeiro, escalacoes } });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
