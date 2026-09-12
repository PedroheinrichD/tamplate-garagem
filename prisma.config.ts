import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Prisma 7 nao carrega .env automaticamente quando existe prisma.config.ts.
// Node 20.12+ tem process.loadEnvFile nativo. Em producao (Vercel etc.) nao
// ha arquivo .env: as env vars ja vem injetadas em process.env pela plataforma.
if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

// Migrations / CLI usam a conexao SESSION (5432, suporta DDL). Em dev o
// DATABASE_URL pode ja ser a session; em producao ele e a transaction (6543),
// entao preferimos DIRECT_URL quando existir.
const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!migrationUrl) {
  throw new Error("Defina DIRECT_URL (ou DATABASE_URL) no .env.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Usado por migrate / db execute / db pull / studio. Nao vai para o client.
  datasource: {
    url: migrationUrl,
  },
});
