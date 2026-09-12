import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: { default: "Painel", template: "Admin · %s" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Sem sessão: só renderiza o conteúdo (a página de login). O middleware já
  // barra as outras rotas /admin.
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-[100svh]">
      <AdminHeader userEmail={user.email ?? ""} signOutAction={signOut} />
      <main className="py-10">
        <Container width="wide">{children}</Container>
      </main>
    </div>
  );
}
