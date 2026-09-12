import "server-only";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma Client (Prisma 7 + driver adapter pg / PostgreSQL do Supabase).
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
    "DATABASE_URL não definida. Configure a conexão do Supabase no .env.",
  );
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
    adapter: new PrismaPg(connectionString),
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
