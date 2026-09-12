import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Prisma Client (Prisma 7 + driver adapter @prisma/adapter-mariadb, que fala
 * o protocolo MySQL). Conecta no MySQL da Aiven - nenhum servidor MariaDB
 * envolvido, é só o nome do driver oficial da Prisma para esse wire protocol.
 *
 * - `import "server-only"` faz o build quebrar se este arquivo for importado
 *   de um Client Component. A DATABASE_URL nunca chega ao browser.
 * - Singleton com cache no globalThis para não abrir uma conexão nova a cada
 *   hot reload em dev.
 * - `omit` global: os campos administrativos de Vehicle NUNCA saem numa query
 *   comum. Só um contexto admin, passando `omit: { <campo>: false }`
 *   explicitamente na query, consegue lê-los.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL não definida. Configure a conexão do MySQL/Aiven no .env.",
  );
}

/**
 * CA da Aiven: em dev, lido do arquivo `certs/ca.pem` (gitignored). Em
 * produção (Vercel etc.) não existe filesystem persistente com esse arquivo,
 * então lê de `DB_CA_CERT` (env var "Secret" com o PEM colado inteiro - a
 * Vercel preserva as quebras de linha; se vier com `\n` escapado em vez de
 * quebra real, desescapamos).
 */
function readCaCert(): string {
  const fromEnv = process.env.DB_CA_CERT;
  if (fromEnv) return fromEnv.includes("\\n") ? fromEnv.replace(/\\n/g, "\n") : fromEnv;

  const caPath = join(process.cwd(), "certs", "ca.pem");
  try {
    return readFileSync(caPath, "utf8");
  } catch {
    throw new Error(
      `Certificado CA da Aiven não encontrado. Defina DB_CA_CERT no .env (produção) ou salve o arquivo em ${caPath} (dev local).`,
    );
  }
}

/**
 * A Aiven exige TLS. O driver `mariadb` só aceita um CA customizado via
 * objeto de config (não dá pra passar `ca` numa connection string simples),
 * então parseamos a URL e montamos o PoolConfig manualmente.
 */
function buildPoolConfig(raw: string) {
  const url = new URL(raw);
  const ca = readCaCert();
  return {
    host: url.hostname,
    port: Number(url.port),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    ssl: { ca, rejectUnauthorized: true },
    // Default do driver (~1s) é curto demais pro round-trip até a Aiven.
    connectTimeout: 15000,
  };
}

/** Campos de Vehicle exclusivamente administrativos - fora de toda query por padrão. */
export const VEHICLE_ADMIN_FIELDS = {
  licensePlate: true,
  renavam: true,
  chassis: true,
  fipeCode: true,
  purchaseCost: true,
  internalNotes: true,
} as const;

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaMariaDb(buildPoolConfig(connectionString)),
    omit: {
      vehicle: VEHICLE_ADMIN_FIELDS,
    },
  });

type AppPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma?: AppPrismaClient;
};

export const prisma: AppPrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
