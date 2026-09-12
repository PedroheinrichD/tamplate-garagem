import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin · Entrar",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <section className="flex min-h-[100svh] items-center py-24">
      <Container width="narrow">
        <div className="mx-auto flex max-w-sm flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-semibold text-fg">
              Painel Benevento&rsquo;s
            </h1>
            <p className="text-[0.9rem] text-fg-dim">Acesso restrito.</p>
          </div>

          <LoginForm />
        </div>
      </Container>
    </section>
  );
}
