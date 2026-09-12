import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/db";

/**
 * Instância central do Better Auth. Painel admin com um único usuário, sem
 * autorregistro público (`disableSignUp`): o usuário admin é criado só por
 * `npm run admin:create` (grava direto via Prisma, ver scripts/create-admin.mjs).
 *
 * Reusa o mesmo `prisma` singleton de src/lib/db.ts (o `omit` global dali só
 * afeta o model Vehicle, não afeta user/session/account/verification).
 *
 * `nextCookies()` tem que ser o ÚLTIMO plugin: é ele que propaga os cookies
 * de sessão automaticamente quando `auth.api.signInEmail`/`signOut` são
 * chamados de dentro de Server Actions (src/app/actions/auth.ts).
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mysql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  plugins: [nextCookies()],
});
