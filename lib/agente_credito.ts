import { callClaude } from "./claude";
import { supaGet, supaPost, supaPatch, logAgente } from "./supabase";

const SYSTEM = `Você é o Agente de Crédito da Palco Capital, fintech de antecipação de recebíveis para produtores de eventos brasileiros, lastreada em venda de ingressos.

Sua função: analisar operações e decidir APROVAR, REPROVAR ou ESCALAR ao Chairman.

Regras:
- Valor ≤ R$500.000 → você decide autonomamente
- Valor > R$500.000 → escale ao Chairman
- LTV máximo aceitável: 80% (valor_solicitado / receita_ingressos)

Scoring (0-1000):
+ 200 pts: ingressos vendidos > 60% da capacidade ou receita > R$200k
+ 150 pts: produtor com histórico (empresa estabelecida, não "novo")
+ 150 pts: plataforma reconhecida (Sympla, Ingresse, Eventbrite, Ticket360)
+ 100 pts: data do evento > 60 dias
+ 200 pts: LTV < 60% | +100 pts se LTV 60-80% | 0 pts se LTV > 80%
+ 100 pts: email corporativo (não gmail/hotmail/yahoo)
+ 100 pts: CNPJ informado

Aprovação autônoma: score ≥ 450 e valor ≤ R$500k e LTV ≤ 80%

Responda APENAS JSON válido, sem markdown, sem texto antes ou depois:
{"score":0-1000,"ltv":decimal,"taxa_sugerida":decimal,"decisao":"aprovado"|"reprovado"|"escalado","aprovado_por":"agente_credito"|"escalado_chairman","flags_risco":["flag"],"justificativa":"texto","condicoes":"texto ou null"}`;

export async function analisarCredito(leadId: string) {
  const t0 = Date.now();

  const leads = await supaGet("leads", `?id=eq.${leadId}`);
  const lead = leads?.[0];
  if (!lead) throw new Error(`Lead ${leadId} não encontrado`);

  const receita = parseFloat(lead.receita_estimada || lead.valor_ingressos || 0);
  const valorSolicitado = Math.round(receita * 0.70);
  const ltv = receita > 0 ? valorSolicitado / receita : 0;

  const prompt = `Analise esta operação:
Produtor: ${lead.nome_produtor || lead.nome}
Empresa: ${lead.empresa || "Não informado"}
Email: ${lead.email}
Evento: ${lead.evento || lead.tipo_evento || "Não informado"}
Data do evento: ${lead.data_evento || "Não informado"}
Cidade/Estado: ${lead.cidade || "—"}, ${lead.estado || "—"}
Receita de ingressos (garantia): R$ ${receita.toLocaleString("pt-BR")}
Valor solicitado (70% da receita): R$ ${valorSolicitado.toLocaleString("pt-BR")}
Plataforma de ingressos: ${lead.plataforma_ingresso || "Não informado"}
CNPJ informado: ${lead.cnpj ? "Sim" : "Não"}
Origem do lead: ${lead.origem || "site"}
Score anterior: ${lead.score || "Sem score"}`;

  const { text, tokens, duracao_ms } = await callClaude(SYSTEM, [{ role: "user", content: prompt }], 500);

  let analise: Record<string, unknown>;
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    analise = JSON.parse(clean);
  } catch {
    throw new Error("JSON inválido do agente: " + text.substring(0, 200));
  }

  const escalado = analise.decisao === "escalado" || valorSolicitado > 500000;

  // Salvar análise
  const [analiseRecord] = await supaPost("analises_credito", {
    lead_id: leadId,
    nome_evento: lead.evento || lead.tipo_evento,
    data_evento: lead.data_evento || null,
    valor_solicitado: valorSolicitado,
    taxa_juros: analise.taxa_sugerida,
    score_credito: analise.score,
    ltv: analise.ltv,
    taxa_sugerida: analise.taxa_sugerida,
    decisao: analise.decisao,
    flags_risco: analise.flags_risco,
    escalado_chairman: escalado,
    analista: "agente_credito_v1",
    parecer: analise.justificativa,
    status: analise.decisao === "reprovado" ? "reprovado" : "em_analise",
  });

  // Atualizar lead
  await supaPatch("leads", `?id=eq.${leadId}`, {
    score: analise.score,
    status: analise.decisao === "reprovado" ? "descartado" : "qualificado",
    notas: analise.justificativa,
  });

  // Escalar ao Chairman
  if (escalado) {
    await supaPost("escalacoes", {
      tipo: "aprovacao_credito",
      analise_id: analiseRecord?.id,
      descricao: `${lead.empresa || lead.nome_produtor} — R$ ${valorSolicitado.toLocaleString("pt-BR")}. Score: ${analise.score}/1000. ${analise.justificativa}`,
      valor_envolvido: valorSolicitado,
      urgencia: valorSolicitado > 1000000 ? "alta" : "normal",
      status: "pendente",
    });
  }

  await logAgente({
    agente: "agente_credito",
    acao: "analise_credito",
    entidade: "lead",
    entidade_id: leadId,
    input: { lead_id: leadId, valor: valorSolicitado, ltv },
    output: analise as object,
    tokens,
    duracao_ms: Date.now() - t0,
  });

  return { analise, analise_id: analiseRecord?.id, escalado, valorSolicitado };
}
