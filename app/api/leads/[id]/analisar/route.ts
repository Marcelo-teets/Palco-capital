import { NextRequest, NextResponse } from "next/server";
import { analisarCredito } from "@/lib/agente_credito";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const resultado = await analisarCredito(id);
    return NextResponse.json({ success: true, ...resultado });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
