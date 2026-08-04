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
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 50_000_000
    ? parsed
    : null;
}

function isValidEmail(value: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return false;

  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  yesterday.setUTCHours(0, 0, 0, 0);
  return date >= yesterday;
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
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    const nome = cleanText(body.nome, 120);
    const empresa = cleanText(body.empresa, 200);
    const email = cleanText(body.email, 200).toLowerCase();
    const telefone = cleanText(body.telefone, 40);
    const cnpj = cleanText(body.cnpj, 24).replace(/\D/g, "");
    const evento = cleanText(body.evento, 200);
    const dataEvento = cleanText(body.data_evento, 10);
    const consentimentoLgpd = body.consentimento_lgpd === true;

    if (
      !nome ||
      !empresa ||
      !email ||
      !telefone ||
      !evento ||
      !dataEvento ||
      cnpj.length !== 14 ||
      !consentimentoLgpd
    ) {
      return NextResponse.json(
        {
          error:
            "Preencha os campos obrigatórios, informe um CNPJ com 14 dígitos e aceite o consentimento de uso dos dados.",
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Informe um e-mail válido." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!isValidDate(dataEvento)) {
      return NextResponse.json(
        { error: "Informe uma data de evento válida e não anterior a ontem." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const receitaVendida = cleanMoney(body.valor_ingressos);
    const receitaEsperada = cleanMoney(body.receita_esperada);
    const valorSolicitado = cleanMoney(body.valor_solicitado);
    const linkVenda = cleanText(body.link_venda, 500);
    const estado = cleanText(body.estado, 2).toUpperCase();

    await supaPublicPost("leads", {
      nome_produtor: nome,
      nome,
      cargo: cleanText(body.cargo, 120) || null,
      empresa,
      tipo_organizacao: cleanText(body.tipo_organizacao, 80) || null,
      cnpj,
      email,
      telefone,
      tempo_operacao: cleanText(body.tempo_operacao, 80) || null,
      eventos_12m: cleanText(body.eventos_12m, 80) || null,
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
      urgencia: cleanText(body.urgencia, 80) || null,
      destino_recurso: cleanText(body.destino_recurso, 240) || null,
      como_conheceu: cleanText(body.como_conheceu, 500) || null,
      consentimento_lgpd: true,
      consentimento_em: new Date().toISOString(),
      status: "novo",
      origem: "site_intake_v2",
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Solicitação recebida para triagem.",
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
}
