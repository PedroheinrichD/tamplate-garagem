import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { EstoqueBrowser } from "@/components/vehicle/EstoqueBrowser";
import {
  getVehicles,
  getBrands,
  getBodyTypes,
  getPriceRange,
} from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Estoque de seminovos",
  description:
    "Todos os seminovos disponíveis na Benevento's Veículos. Filtre por marca, carroceria e preço.",
};

export const dynamic = "force-dynamic";

export default async function EstoquePage() {
  const [vehicles, brands, bodies, { max }] = await Promise.all([
    getVehicles(),
    getBrands(),
    getBodyTypes(),
    getPriceRange(),
  ]);
  const ceiling = Math.max(Math.ceil(max / 5000) * 5000, 5000);

  return (
    <>
      <section className="border-b border-border pb-12 pt-28 md:pt-32">
        <Container width="wide" className="flex flex-col gap-4">
          <SplitLines
            as="h1"
            immediate
            lines={["Estoque"]}
            className="text-[clamp(1.9rem,7.5vw,4rem)] font-semibold text-fg"
          />
          <Reveal variant="fade-up" delay={0.1}>
            <p className="max-w-xl text-[1.05rem] text-fg-dim">
              {vehicles.length} seminovos revisados, com procedência conferida e
              prontos para transferência.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container width="wide">
          <EstoqueBrowser
            vehicles={vehicles}
            brands={brands}
            bodies={bodies}
            priceCeiling={ceiling}
          />
        </Container>
      </section>
    </>
  );
}
