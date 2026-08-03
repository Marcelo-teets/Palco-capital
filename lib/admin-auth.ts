import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

function unauthorized(status: 401 | 503, message: string) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export function requireAdmin(req: NextRequest) {
  const configuredToken = process.env.PALCO_ADMIN_API_TOKEN?.trim();

  if (!configuredToken) {
    return unauthorized(
      503,
      "A API administrativa está bloqueada até PALCO_ADMIN_API_TOKEN ser configurado no Vercel.",
    );
  }

  const authorization = req.headers.get("authorization")?.trim() || "";
  const bearerToken = authorization.toLowerCase().startsWith("bearer ")
    ? authorization.slice(7).trim()
    : "";
  const suppliedToken = req.headers.get("x-palco-admin-token")?.trim() || bearerToken;

  if (!suppliedToken) {
    return unauthorized(401, "Autenticação administrativa obrigatória.");
  }

  const configuredDigest = digest(configuredToken);
  const suppliedDigest = digest(suppliedToken);

  if (!timingSafeEqual(configuredDigest, suppliedDigest)) {
    return unauthorized(401, "Credencial administrativa inválida.");
  }

  return null;
}
