import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

// Footer/VisitUs/contato leem `configuracoes` do banco (editável no admin);
// renderiza a cada request para refletir na hora.
export const dynamic = "force-dynamic";

/**
 * Shell do site público: smooth scroll (Lenis/GSAP) + header + footer.
 * O /admin fica fora deste grupo e não carrega nada disso.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
