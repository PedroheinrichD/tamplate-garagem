import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre a loja",
  description:
    "A Benevento's Veículos é uma loja de rua de seminovos, com laudo cautelar em todo carro e mais de 700 vendas em 3 anos.",
};

const values = [
  {
    title: "Carro que a gente venderia para a própria família",
    body: "Se não passar no laudo cautelar e na nossa checagem, não entra no pátio. Simples assim.",
  },
  {
    title: "Preço na cara, sem jogo de proposta",
    body: "O valor anunciado é o valor de venda. A negociação é sobre entrada, troca e prazo, não sobre descobrir quanto você aguenta pagar.",
  },
  {
    title: "Pós-venda que atende o telefone",
    body: "Deu algo errado na primeira semana? Liga que a gente resolve. É assim que se constrói o terceiro carro com o mesmo cliente.",
  },
];

export default function SobrePage() {
  return (
    <>
      <section className="pt-28 md:pt-36">
        <Container width="wide">
          <div className="flex max-w-3xl flex-col gap-6">
            <SplitLines
              as="h1"
              immediate
              lines={["Uma loja de rua,", "não um perfil de anúncios."]}
              className="text-[clamp(1.9rem,7.5vw,4.2rem)] font-semibold leading-[1.03] text-fg"
            />
            <Reveal variant="fade-up" delay={0.15}>
              <p className="text-[1.1rem] leading-relaxed text-fg-dim">
                A Benevento&rsquo;s Veículos nasceu para resolver a compra de
                seminovo do jeito que a gente gostaria de ser atendido: carro
                conferido, conversa direta e documento em ordem. Em{" "}
                {site.yearsActive} anos foram mais de {site.soldCount} carros
                entregues.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container width="wide">
          <Reveal variant="rise">
            {/* TODO: foto real da loja / equipe / fachada */}
            <Placeholder
              label="Fachada da loja Benevento's Veículos"
              ratio="16 / 9"
            />
          </Reveal>
        </Container>
      </section>

      <section className="pb-8 md:pb-16">
        <Container width="wide">
          <div className="grid gap-4 md:grid-cols-3">
            {values.map((v) => (
              <Reveal key={v.title} variant="fade-up">
                <div className="flex h-full flex-col gap-3 rounded border border-border bg-surface p-7">
                  <h2 className="font-display text-lg font-semibold text-fg">
                    {v.title}
                  </h2>
                  <p className="text-[0.92rem] leading-relaxed text-fg-dim">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container width="wide">
          <div className="flex flex-col items-start gap-6 rounded border border-border bg-bg-elev p-10 md:p-14">
            <SplitLines
              lines={["Vem ver de perto."]}
              className="text-[clamp(1.6rem,5.5vw,2.8rem)] font-semibold text-fg"
            />
            <Reveal variant="fade-up">
              <p className="max-w-lg text-[1.02rem] text-fg-dim">
                Estamos em {site.address.city} - {site.address.state}. Chega sem
                agendar, dá uma volta no estoque e faz um test drive.
              </p>
            </Reveal>
            <Reveal variant="fade-up">
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/estoque" size="lg">
                  Ver estoque
                </ButtonLink>
                <WhatsappCta size="lg" owner={0}>Falar no WhatsApp</WhatsappCta>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
