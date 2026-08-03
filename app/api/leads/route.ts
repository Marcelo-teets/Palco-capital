import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supaGet, supaPublicPost } from "@/lib/supabase";

const allowedStatuses = new Set([
  "novo",
  "cadastro_incompleto",
  "em_analise",
  "qualificado",
  "escalado",
  "declinado",
  "aprovado",
]);

function cleanText(value: unknown, maxLength = 240) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanMoney(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const requestedStatus = cleanText(searchParams.get("status"), 40);
    const requestedLimit = Number(searchParams.get("limit") || 50);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 200)
      : 50;

    let query = `?order=created_at.desc&limit=${limit}`;
    if (allowedStatuses.has(requestedStatus)) {
      query += `&status=eq.${encodeURIComponent(requestedStatus)}`;
    }

    const data = await supaGet("leads", query);
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

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const nome = cleanText(body.nome, 160);
    const empresa = cleanText(body.empresa, 200);
    const email = cleanText(body.email, 200).toLowerCase();
    const telefone = cleanText(body.telefone, 40);
    const evento = cleanText(body.evento, 200);
    const dataEvento = cleanText(body.data_evento, 10);

    if (!nome || !empresa || !email || !telefone || !evento || !dataEvento) {
      return NextResponse.json(
        { error: "Preencha nome, empresa, e-mail, telefone, evento e data do evento." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const receitaVendida = cleanMoney(body.valor_ingressos);
    const receitaEsperada = cleanMoney(body.receita_esperada);
    const valorSolicitado = cleanMoney(body.valor_solicitado);
    const linkVenda = cleanText(body.link_venda, 500);
    const estado = cleanText(body.estado, 2).toUpperCase();
    const cnpj = cleanText(body.cnpj, 24).replace(/\D/g, "");

    await supaPublicPost("leads", {
      nome_produtor: nome,
      nome,
      empresa,
      email,
      telefone,
      cnpj: cnpj || null,
      evento,
      tipo_evento: cleanText(body.tipo_evento, 60) || "outro",
      data_evento: dataEvento,
      cidade: cleanText(body.cidade, 120) || null,
      estado: estado || null,
      uf: estado || null,
      venue: cleanText(body.venue, 200) || null,
      plataforma_ingresso:
        cleanText(body.plataforma_ingressos, 120) || null,
      link_venda: linkVenda || null,
      evidencia_url: linkVenda || null,
      receita_estimada: receitaEsperada ?? receitaVendida,
      valor_ingressos: receitaVendida,
      receita_vendida: receitaVendida,
      receita_esperada: receitaEsperada,
      valor_solicitado: valorSolicitado,
      como_conheceu: cleanText(body.como_conheceu, 80) || null,
      status: "novo",
      origem: "site",
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Solicitação recebida para triagem.",
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
}
