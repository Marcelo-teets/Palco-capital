import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function callClaude(system: string, messages: {role: "user"|"assistant", content: string}[], maxTokens = 1000) {
  const t0 = Date.now();
  const res = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system,
    messages,
  });
  return {
    text: (res.content[0] as {text: string}).text,
    tokens: res.usage.input_tokens + res.usage.output_tokens,
    duracao_ms: Date.now() - t0,
  };
}
