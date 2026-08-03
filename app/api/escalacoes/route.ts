import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supaGet, supaPatch } from "@/lib/supabase";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const allowedStatuses = new Set(["pendente", "resolvido", "aprovado", "reprovado"]);

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const data = await supaGet(
      "escalacoes",
      "?status=eq.pendente&order=created_at.asc",
    );
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const decisao = typeof body.decisao === "string" ? body.decisao.trim().slice(0, 4000) : "";
    const requestedStatus = typeof body.status === "string" ? body.status.trim() : "";
    const status = allowedStatuses.has(requestedStatus) ? requestedStatus : "resolvido";

    if (!uuidPattern.test(id)) {
      return NextResponse.json(
        { error: "ID de escalação inválido." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const data = await supaPatch("escalacoes", `?id=eq.${id}`, {
      status,
      decisao_chairman: decisao || null,
      resolved_at: new Date().toISOString(),
    });

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
