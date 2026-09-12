import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Prisma 7 nao carrega .env automaticamente quando existe prisma.config.ts.
// Node 20.12+ tem process.loadEnvFile nativo. Em producao (Vercel etc.) nao
// ha arquivo .env: as env vars ja vem injetadas em process.env pela plataforma.
if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

const migrationUrl = process.env.DATABASE_URL;
if (!migrationUrl) {
  throw new Error("Defina DATABASE_URL no .env.");
}

// MySQL/Aiven exige TLS. sslaccept=strict valida o certificado do servidor
// contra o CA abaixo (sslcert = caminho pro CA, nao um cert de cliente).
// O schema engine (migrate/db pull/studio) le esses parametros direto da URL;
// o runtime (src/lib/db.ts) monta o mesmo TLS via objeto, ver detalhes la.
const url = new URL(migrationUrl);
url.searchParams.set("sslaccept", "strict");
url.searchParams.set("sslcert", "certs/ca.pem");
// Default do engine (~5s) é curto demais pro round-trip até a Aiven.
url.searchParams.set("connect_timeout", "15");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Usado por migrate / db execute / db pull / studio. Nao vai para o client.
  datasource: {
    url: url.toString(),
  },
});
