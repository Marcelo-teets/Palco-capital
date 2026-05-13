import { NextRequest, NextResponse } from "next/server";
import { supaGet, supaPost } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") || "50";
    let q = `?order=created_at.desc&limit=${limit}`;
    if (status) q += `&status=eq.${status}`;
    const data = await supaGet("leads", q);
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const [record] = await supaPost("leads", {
      nome_produtor: body.nome,
      nome: body.nome,
      empresa: body.empresa,
      email: body.email,
      telefone: body.telefone,
      evento: body.evento,
      tipo_evento: body.tipo_evento || "outro",
      data_evento: body.data_evento || null,
      receita_estimada: body.valor_ingressos ? parseFloat(body.valor_ingressos) : null,
      valor_ingressos: body.valor_ingressos ? parseFloat(body.valor_ingressos) : null,
      como_conheceu: body.como_conheceu || null,
      cidade: body.cidade || null,
      estado: body.estado || null,
      status: "novo",
      origem: body.origem || "site",
    });
    return NextResponse.json(record, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
