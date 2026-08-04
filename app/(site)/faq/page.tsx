import type { Metadata } from "next";
import { AnalysisCta } from "@/components/site/AnalysisCta";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description: "Respostas sobre elegibilidade, análise, taxas, prazos, dados e operação da Palco Capital.",
};

const questions = [
  ["Enviar o formulário garante aprovação?", "Não. O envio apenas cria uma solicitação para triagem. Aprovação depende de elegibilidade, diligência, análise de risco, disponibilidade de capital, decisão humana e formalização."],
  ["Existe uma taxa fixa?", "Não publicamos uma taxa única porque risco, prazo, estrutura, controles e custos variam por operação. O simulador permite escolher uma taxa apenas para compreender a mecânica; ela não é cotação."],
  ["Quanto pode ser antecipado?", "A política vigente usa LTV máximo de referência de 70% no perfil geral e 60% para primeiro evento ou artista sem histórico. Esses tetos não são promessa: outros limites podem reduzir o valor."],
  ["Quais eventos podem ser analisados?", "Shows, festivais, turnês, programação recorrente de venues e outros eventos privados com CNPJ, evidências e fonte de pagamento verificável podem passar pela triagem."],
  ["A Palco Capital atende prefeituras ou entes públicos?", "Não no escopo atual. O enquadramento de operações com entes públicos permanece sujeito a política específica e deliberação de governança."],
  ["Que documentos são necessários?", "A triagem começa com dados objetivos e evidências públicas. Se o caso avançar, a lista segura de documentos é informada conforme estrutura, partes e risco; não envie arquivos sensíveis no link público."],
  ["Como meus dados são usados?", "Os dados são usados para triagem, análise da solicitação, prevenção a fraude, governança e contato relacionado ao caso, conforme a página Legal e Privacidade."],
  ["A análise é totalmente automatizada?", "Não. Sistemas podem organizar informações, executar regras e apontar alertas, mas decisões materiais, exceções e alçadas são humanas."],
] as const;

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Perguntas frequentes"
        title="Respostas diretas antes da solicitação."
        description="Aqui estão os limites, critérios e ressalvas mais importantes do processo."
        aside={<p>Não encontrou sua pergunta? Descreva o contexto no formulário sem incluir documentos sensíveis.</p>}
      />
      <section className="section">
        <div className="site-shell faq-list">
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <AnalysisCta />
    </>
  );
}
