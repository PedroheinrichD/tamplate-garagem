import { Check } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { formatPrice } from "@/lib/vehicle-format";

const checklist = [
  "CNH válida",
  "Comprovante de renda",
  "Comprovante de residência",
  "Entrada a partir de 20% do valor",
];

export function Financing() {
  return (
    <section id="financiamento" className="scroll-mt-24 py-16 md:py-24">
      <Container width="wide">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="order-1 flex flex-col gap-6 lg:order-2">
            <SplitLines
              lines={["Financiamento aprovado", "sem sair da loja."]}
              className="text-[clamp(1.6rem,6vw,3rem)] font-semibold text-fg"
            />
            <Reveal variant="fade-up">
              <p className="max-w-md text-[1.05rem] leading-relaxed text-fg-dim">
                A gente simula com os principais bancos na hora e você fecha a
                entrada e a parcela que cabem no seu mês.
              </p>
            </Reveal>
            <Reveal stagger>
              <ul className="flex flex-col gap-3">
                {checklist.map((item) => (
                  <li
                    key={item}
                    data-reveal-item
                    className="flex items-center gap-3 text-[0.95rem] text-fg-dim"
                  >
                    <Check
                      size={16}
                      weight="bold"
                      className="shrink-0 text-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal variant="fade-up">
              <div className="pt-2">
                <WhatsappCta message="Olá! Quero simular um financiamento.">
                  Simular meu financiamento
                </WhatsappCta>
              </div>
            </Reveal>
          </div>

          <Reveal variant="scale" className="order-2 lg:order-1">
            <figure className="rounded border border-border bg-surface p-8">
              <figcaption className="text-[0.8rem] text-muted">
                Exemplo ilustrativo · Fiat Argo Drive 2022
              </figcaption>
              <dl className="mt-6 flex flex-col divide-y divide-border">
                <div className="flex items-center justify-between py-4">
                  <dt className="text-fg-dim">Valor do veículo</dt>
                  <dd className="font-display text-lg font-semibold text-fg tnum">
                    {formatPrice(67900)}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-4">
                  <dt className="text-fg-dim">Entrada</dt>
                  <dd className="font-display text-lg font-semibold text-fg tnum">
                    {formatPrice(20000)}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-4">
                  <dt className="text-fg-dim">Saldo em 48x</dt>
                  <dd className="font-display text-lg font-semibold text-accent tnum">
                    a partir de {formatPrice(1290)}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-[0.78rem] leading-relaxed text-muted">
                Simulação apenas para referência. A parcela final depende da
                análise de crédito e da taxa vigente do banco.
              </p>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
