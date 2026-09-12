// Cria (ou confirma) o usuário admin no Better Auth a partir do .env.
// Uso: npm run admin:create
// Requer no .env: DATABASE_URL, BETTER_AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
//
// Roda com disableSignUp desligado (diferente de src/lib/better-auth.ts, que
// bloqueia signup público) - só esse script, rodado manualmente, pode criar
// usuário. Não expõe rota nenhuma.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";

process.loadEnvFile(".env");

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const secret = process.env.BETTER_AUTH_SECRET;

const missing = [];
if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
if (!secret) missing.push("BETTER_AUTH_SECRET");
if (!email) missing.push("ADMIN_EMAIL");
if (!password) missing.push("ADMIN_PASSWORD");
if (missing.length) {
  console.error("Faltam variáveis no .env:", missing.join(", "));
  process.exit(1);
}

function buildPoolConfig(raw) {
  const url = new URL(raw);
  return {
    host: url.hostname,
    port: Number(url.port),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    ssl: {
      ca: readFileSync(join(process.cwd(), "certs", "ca.pem"), "utf8"),
      rejectUnauthorized: true,
    },
    connectTimeout: 15000,
  };
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(buildPoolConfig(process.env.DATABASE_URL)),
});

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mysql" }),
  secret,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
});

try {
  const result = await auth.api.signUpEmail({
    body: { name: "Admin", email, password },
  });
  console.log(`Usuário admin criado: ${result.user.email}`);
} catch (err) {
  if (err instanceof APIError && err.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
    console.log(`Usuário ${email} já existe. Nada a fazer.`);
  } else {
    console.error("Falhou:", err instanceof Error ? err.message : err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

await prisma.$disconnect();
