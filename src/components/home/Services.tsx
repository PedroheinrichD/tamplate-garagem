import type { ReactNode } from "react";
import {
  Car,
  CurrencyDollar,
  ArrowsClockwise,
  Bank,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Reveal } from "@/components/motion/Reveal";

const services: {
  title: string;
  body: string;
  icon: ReactNode;
}[] = [
  {
    title: "Compra",
    body: "Dezenas de seminovos revisados no pátio, com laudo cautelar e garantia. Você agenda, testa, aprova e leva no mesmo dia.",
    icon: <Car weight="thin" />,
  },
  {
    title: "Venda",
    body: "Traga seu carro para avaliação sem compromisso. Pagamos à vista e assumimos toda a burocracia de transferência.",
    icon: <CurrencyDollar weight="thin" />,
  },
  {
    title: "Troca",
    body: "Seu usado vira entrada. A gente avalia na hora e o valor já entra na proposta do carro novo, sem enrolação.",
    icon: <ArrowsClockwise weight="thin" />,
  },
  {
    title: "Financiamento",
    body: "Simulação com os principais bancos em minutos. Você negocia entrada e parcela e sai daqui com o carro aprovado.",
    icon: <Bank weight="thin" />,
  },
];

export function Services() {
  return (
    <section className="bg-bg-elev py-16 md:py-24">
      <Container width="wide">
        <SectionIntro
          titleLines={["Quatro formas de", "fazer negócio."]}
          lead="Comprar, vender, trocar ou financiar. Na Benevento's tudo acontece no mesmo balcão, com a mesma equipe."
        />

        <Reveal stagger className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <article
                key={s.title}
                data-reveal-item
                className="relative flex min-h-[260px] flex-col justify-end gap-3 overflow-hidden rounded border border-border bg-surface p-8 md:min-h-[320px] md:p-10"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 text-white/[0.04] [&>svg]:size-40 md:[&>svg]:size-56"
                >
                  {s.icon}
                </span>
                <h3 className="relative font-display text-2xl font-semibold text-fg md:text-3xl">
                  {s.title}
                </h3>
                <p className="relative max-w-sm text-[0.98rem] leading-relaxed text-fg-dim">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
