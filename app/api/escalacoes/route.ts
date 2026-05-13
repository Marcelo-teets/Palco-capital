import { NextRequest, NextResponse } from "next/server";
import { supaGet, supaPatch } from "@/lib/supabase";

export async function GET() {
  try {
    const data = await supaGet("escalacoes", "?status=eq.pendente&order=created_at.asc");
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, decisao, status } = await req.json();
    const data = await supaPatch("escalacoes", `?id=eq.${id}`, {
      status: status || "resolvido",
      decisao_chairman: decisao || null,
      resolved_at: new Date().toISOString(),
    });
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
