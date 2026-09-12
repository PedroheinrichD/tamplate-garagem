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
// contra o CA abaixo (sslcert = caminho pro CA, nao um cert de cliente). O
// schema engine so aceita um CAMINHO DE ARQUIVO aqui (diferente do runtime em
// src/lib/db.ts, que tambem aceita o conteudo via env DB_CA_CERT) - por isso
// `prisma migrate`/`db pull`/`studio` contra o banco de producao precisam
// rodar localmente, com certs/ca.pem presente no disco (nao rodam no build
// da Vercel; o `next build` do package.json nao aciona migration nenhuma).

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
