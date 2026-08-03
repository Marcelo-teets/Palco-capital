import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { analisarCredito } from "@/lib/agente_credito";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    if (!uuidPattern.test(id)) {
      return NextResponse.json(
        { error: "ID de lead inválido." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const resultado = await analisarCredito(id);
    return NextResponse.json(
      { success: true, ...resultado },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
