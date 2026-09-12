import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin · Entrar",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <section className="flex min-h-[100svh] items-center py-24">
      <Container width="narrow">
        <div className="mx-auto flex max-w-sm flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-semibold text-fg">
              Painel Benevento&rsquo;s
            </h1>
            <p className="text-[0.9rem] text-fg-dim">
              Acesso restrito. Autenticação pelo Supabase Auth.
            </p>
          </div>

          {configured ? (
            <LoginForm />
          ) : (
            <div className="rounded border border-border bg-surface p-6 text-[0.9rem] text-fg-dim">
              Supabase Auth ainda não configurado. Preencha{" "}
              <code className="text-fg">NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
              <code className="text-fg">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no{" "}
              <code className="text-fg">.env</code> e crie o usuário admin
              (Dashboard do Supabase ou <code className="text-fg">npm run admin:create</code>).
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
