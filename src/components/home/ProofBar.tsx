import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

const stats = [
  { value: `+${site.soldCount}`, label: "veículos vendidos" },
  { value: `${site.yearsActive} anos`, label: "de loja aberta" },
  { value: "Troca e financiamento", label: "resolvidos aqui mesmo" },
];

export function ProofBar() {
  return (
    <section className="border-y border-border bg-bg-elev">
      <Container width="wide" className="py-10">
        <Reveal stagger>
          <dl className="grid gap-8 sm:grid-cols-3 sm:divide-x sm:divide-border">
            {stats.map((s) => (
              <div
                key={s.label}
                data-reveal-item
                className="flex flex-col gap-1 sm:items-center sm:px-6 sm:text-center"
              >
                <dt className="font-display text-2xl font-semibold text-fg sm:text-[1.7rem]">
                  {s.value}
                </dt>
                <dd className="text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
