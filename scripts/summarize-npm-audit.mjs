import { readFile } from "node:fs/promises";
import process from "node:process";

const file = process.argv[2] || "npm-audit.json";
const raw = await readFile(file, "utf8");
const audit = JSON.parse(raw);
const vulnerabilities = Object.values(audit.vulnerabilities || {});
const counts = audit.metadata?.vulnerabilities || {};

console.log("Resumo npm audit");
console.log(
  `total=${counts.total || 0} low=${counts.low || 0} moderate=${counts.moderate || 0} high=${counts.high || 0} critical=${counts.critical || 0}`,
);

for (const vulnerability of vulnerabilities.sort((a, b) => {
  const order = { critical: 4, high: 3, moderate: 2, low: 1, info: 0 };
  return (order[b.severity] || 0) - (order[a.severity] || 0);
})) {
  const advisories = (vulnerability.via || [])
    .filter((item) => typeof item === "object")
    .map((item) => item.url || item.title)
    .filter(Boolean);

  const fix =
    vulnerability.fixAvailable === true
      ? "sim"
      : vulnerability.fixAvailable === false
        ? "não"
        : vulnerability.fixAvailable
          ? `${vulnerability.fixAvailable.name}@${vulnerability.fixAvailable.version}${vulnerability.fixAvailable.isSemVerMajor ? " (major)" : ""}`
          : "não informado";

  console.log(
    JSON.stringify({
      pacote: vulnerability.name,
      severidade: vulnerability.severity,
      direto: Boolean(vulnerability.isDirect),
      faixa: vulnerability.range,
      dependentes: vulnerability.effects || [],
      correcao: fix,
      advisories,
    }),
  );
}

if ((counts.high || 0) > 0 || (counts.critical || 0) > 0) {
  console.error("Vulnerabilidade alta ou crítica detectada.");
  process.exit(1);
}
