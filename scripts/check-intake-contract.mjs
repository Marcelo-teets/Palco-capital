import { readFile } from "node:fs/promises";
import process from "node:process";

const files = {
  page: await readFile("components/site/SolicitacaoWizard.tsx", "utf8"),
  route: await readFile("app/api/leads/route.ts", "utf8"),
  validation: await readFile("lib/intake-validation.ts", "utf8"),
  policy: await readFile(
    "supabase/migrations/20260804133926_palco_110_hardening_policy_anon_insert_leads.sql",
    "utf8",
  ),
};

const checks = [
  ["Página envia para /api/leads", files.page.includes('fetch("/api/leads"')],
  [
    "Página coleta consentimento LGPD",
    files.page.includes('name="consentimento_lgpd"') &&
      files.page.includes('type="checkbox"'),
  ],
  [
    "Página exige CNPJ",
    files.page.includes('name="cnpj"') && files.page.includes("required"),
  ],
  [
    "API fixa origem v2 no servidor",
    files.route.includes('origem: "site_intake_v2"'),
  ],
  [
    "API registra consentimento e horário",
    files.route.includes("consentimento_lgpd: true") &&
      files.route.includes("consentimento_em: new Date().toISOString()"),
  ],
  [
    "API valida tamanho e dígitos verificadores do CNPJ",
    files.route.includes("cnpj.length !== 14") &&
      files.route.includes("!isValidCnpj(cnpj)") &&
      files.validation.includes("calculateDigit"),
  ],
  [
    "API não devolve erro interno do banco ao público",
    files.route.includes("Não foi possível registrar a solicitação agora") &&
      !files.route.includes("{ error: (error as Error).message },\n      { status: 400"),
  ],
  [
    "API usa chave publicável para o insert",
    files.route.includes('supaPublicPost("leads"'),
  ],
  [
    "RLS exige origem v2",
    files.policy.includes("origem = 'site_intake_v2'"),
  ],
  [
    "RLS exige consentimento",
    files.policy.includes("consentimento_lgpd = true") &&
      files.policy.includes("consentimento_em is not null"),
  ],
  [
    "RLS exige CNPJ e e-mail mínimos",
    files.policy.includes("= 14") && files.policy.includes("coalesce(email"),
  ],
];

const failures = checks.filter(([, passed]) => !passed);

for (const [label, passed] of checks) {
  console.log(`${passed ? "✓" : "✗"} ${label}`);
}

if (failures.length > 0) {
  console.error(`\nContrato do intake inválido: ${failures.length} falha(s).`);
  process.exit(1);
}

console.log("\nContrato do intake v2 validado.");
