import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  isValidCnpj,
  isValidEmail,
  isValidEventDate,
  isValidOptionalUrl,
  isValidUf,
  onlyDigits,
} from "@/lib/intake-validation";
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

const allowedOrganizationTypes = new Set([
  "produtora",
  "venue",
  "festival",
  "agencia",
  "outro",
]);

const allowedEventTypes = new Set([
  "show",
  "festival",
  "turne",
  "venue",
  "corporativo",
  "outro",
]);

const allowedUrgencies = new Set([
  "ate_7_dias",
  "8_a_15_dias",
  "16_a_30_dias",
  "mais_30_dias",
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
  const requestId = crypto.randomUUID();

  try {
    const contentType = req.headers.get("content-type") || "";
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (!contentType.toLowerCase().startsWith("application/json") || contentLength > 32_768) {
      return NextResponse.json(
        { error: "Formato de solicitação inválido." },
        { status: 415, headers: { "Cache-Control": "no-store" } },
      );
    }

    const body = (await req.json()) as Record<string, unknown>;

    const nome = cleanText(body.nome, 120);
    const empresa = cleanText(body.empresa, 200);
    const email = cleanText(body.email, 200).toLowerCase();
    const telefone = cleanText(body.telefone, 40);
    const cnpj = onlyDigits(cleanText(body.cnpj, 24));
    const tipoOrganizacao = cleanText(body.tipo_organizacao, 80);
    const evento = cleanText(body.evento, 200);
    const tipoEvento = cleanText(body.tipo_evento, 60);
    const dataEvento = cleanText(body.data_evento, 10);
    const cidade = cleanText(body.cidade, 120);
    const estado = cleanText(body.estado, 2).toUpperCase();
    const plataformaIngressos = cleanText(body.plataforma_ingressos, 120);
    const urgencia = cleanText(body.urgencia, 80);
    const destinoRecurso = cleanText(body.destino_recurso, 240);
    const consentimentoLgpd = body.consentimento_lgpd === true;

    if (
      !nome ||
      !empresa ||
      !email ||
      !telefone ||
      !tipoOrganizacao ||
      !evento ||
      !tipoEvento ||
      !dataEvento ||
      !cidade ||
      !estado ||
      !plataformaIngressos ||
      !urgencia ||
      !destinoRecurso ||
      cnpj.length !== 14 ||
      !consentimentoLgpd
    ) {
      return NextResponse.json(
        {
          error:
            "Preencha todos os campos obrigatórios e aceite o consentimento de uso dos dados.",
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

    if (!isValidCnpj(cnpj)) {
      return NextResponse.json(
        { error: "Informe um CNPJ válido, incluindo os dígitos verificadores." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!isValidEventDate(dataEvento)) {
      return NextResponse.json(
        { error: "Informe uma data de evento válida e não anterior a ontem." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const receitaVendida = cleanMoney(body.valor_ingressos);
    const receitaEsperada = cleanMoney(body.receita_esperada);
    const valorSolicitado = cleanMoney(body.valor_solicitado);
    const linkVenda = cleanText(body.link_venda, 500);

    if (
      !allowedOrganizationTypes.has(tipoOrganizacao) ||
      !allowedEventTypes.has(tipoEvento) ||
      !allowedUrgencies.has(urgencia) ||
      !isValidUf(estado)
    ) {
      return NextResponse.json(
        { error: "Revise o tipo de organização, o tipo de evento, a urgência e a UF." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!isValidOptionalUrl(linkVenda)) {
      return NextResponse.json(
        { error: "O link de venda deve começar por https:// ou http://." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (
      onlyDigits(telefone).length < 10 ||
      receitaVendida === null ||
      receitaEsperada === null ||
      valorSolicitado === null ||
      valorSolicitado <= 0 ||
      (receitaVendida <= 0 && receitaEsperada <= 0)
    ) {
      return NextResponse.json(
        { error: "Revise o telefone e os valores financeiros informados." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    await supaPublicPost("leads", {
      nome_produtor: nome,
      nome,
      cargo: cleanText(body.cargo, 120) || null,
      empresa,
      razao_social: empresa,
      nome_fantasia: empresa,
      tipo_organizacao: tipoOrganizacao,
      cnpj,
      email,
      telefone,
      tempo_operacao: cleanText(body.tempo_operacao, 80) || null,
      eventos_12m: cleanText(body.eventos_12m, 80) || null,
      evento,
      tipo_evento: tipoEvento,
      data_evento: dataEvento,
      cidade,
      estado,
      uf: estado,
      venue: cleanText(body.venue, 200) || null,
      plataforma_ingresso: plataformaIngressos,
      link_venda: linkVenda || null,
      evidencia_url: linkVenda || null,
      receita_estimada: receitaEsperada ?? receitaVendida,
      valor_ingressos: receitaVendida,
      receita_vendida: receitaVendida,
      receita_esperada: receitaEsperada,
      valor_solicitado: valorSolicitado,
      urgencia,
      destino_recurso: destinoRecurso,
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
    console.error(`[intake:${requestId}] Falha ao registrar solicitação`, error);
    return NextResponse.json(
      {
        error: "Não foi possível registrar a solicitação agora. Tente novamente mais tarde.",
        requestId,
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
