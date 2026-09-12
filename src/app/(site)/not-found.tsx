import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center py-24">
      <Container width="wide">
        <div className="flex max-w-lg flex-col gap-5">
          <p className="font-display text-6xl font-semibold text-fg">404</p>
          <h1 className="font-display text-2xl font-semibold text-fg">
            Essa página saiu do pátio
          </h1>
          <p className="text-[1rem] text-fg-dim">
            O link pode ter mudado ou o veículo já foi vendido. Dá uma olhada no
            estoque atual.
          </p>
          <div className="pt-2">
            <ButtonLink href="/estoque" size="lg">
              Ver estoque
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
