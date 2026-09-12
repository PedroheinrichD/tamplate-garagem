import type { ReactNode } from "react";
import {
  ShieldCheck,
  SealCheck,
  FileText,
  SteeringWheel,
  Storefront,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

function Cell({
  icon,
  title,
  children,
  className = "",
  tint = false,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
  tint?: boolean;
}) {
  return (
    <div
      data-reveal-item
      className={`flex flex-col gap-3 rounded border border-border p-6 md:p-8 ${
        tint
          ? "bg-[radial-gradient(120%_120%_at_0%_0%,rgba(194,42,34,0.14),transparent_60%)] bg-surface"
          : "bg-surface"
      } ${className}`}
    >
      <span className="text-accent [&>svg]:size-6">{icon}</span>
      <h3 className="font-display text-lg font-semibold text-fg">{title}</h3>
      <p className="text-[0.92rem] leading-relaxed text-fg-dim">{children}</p>
    </div>
  );
}

export function WhyUs() {
  return (
    <section className="py-16 md:py-24">
      <Container width="wide">
        <SectionIntro
          kicker="Por que a Benevento's"
          titleLines={["Seminovo sem", "letra miúda."]}
          lead="O que a gente faz para você assinar tranquilo e não voltar reclamando depois."
        />

        <Reveal stagger className="mt-12">
          <div className="grid gap-4 md:grid-cols-4 md:grid-rows-3">
            <Cell
              tint
              icon={<ShieldCheck weight="light" />}
              title="Todo carro com laudo cautelar"
              className="md:col-span-2 md:row-span-2"
            >
              Antes de entrar no pátio, cada veículo passa por vistoria de
              estrutura, motor, chassi e histórico de sinistro. O laudo segue
              junto na venda, sem você precisar pedir.
            </Cell>
            <Cell
              icon={<SealCheck weight="light" />}
              title="Garantia de motor e câmbio"
              className="md:col-span-2"
            >
              Você sai coberto justamente nos itens que mais pesam no bolso se
              der problema.
            </Cell>
            <Cell icon={<FileText weight="light" />} title="Documentação com a gente">
              Transferência e comunicação de venda por nossa conta.
            </Cell>
            <Cell
              icon={<SteeringWheel weight="light" />}
              title="Test drive sem relógio"
            >
              Pegue a chave e sinta o carro no trânsito de verdade.
            </Cell>
            <Cell
              tint
              icon={<Storefront weight="light" />}
              title="Loja física, de porta aberta"
              className="md:col-span-4"
            >
              A Benevento&rsquo;s não é um perfil de anúncios. Tem endereço,
              equipe fixa e {site.yearsActive} anos de rua. Venha tomar um café
              e ver os carros de perto.
            </Cell>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
