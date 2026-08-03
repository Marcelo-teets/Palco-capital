import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supaGet } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const [financeiro, pipeline, escalacoes, logs] = await Promise.all([
      supaGet("vw_dashboard_financeiro", "").catch(() => null),
      supaGet("vw_pipeline_resumo", ""),
      supaGet("escalacoes", "?status=eq.pendente"),
      supaGet("agent_logs", "?order=created_at.desc&limit=20"),
    ]);

    return NextResponse.json(
      {
        financeiro,
        pipeline,
        escalacoes: escalacoes?.length || 0,
        logs,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
