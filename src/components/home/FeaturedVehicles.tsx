import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Reveal } from "@/components/motion/Reveal";
import { VehicleImage } from "@/components/vehicle/VehicleImage";
import { countVehicles, getFeaturedVehicles } from "@/lib/vehicles";
import { formatMileage, formatPrice, formatYear } from "@/lib/vehicle-format";

export async function FeaturedVehicles() {
  const [featured, total] = await Promise.all([
    getFeaturedVehicles(3),
    countVehicles(),
  ]);
  if (featured.length === 0) return null;

  const [hero, ...rest] = featured;

  return (
    <section className="py-16 md:py-24">
      <Container width="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionIntro
            kicker="Seleção da semana"
            titleLines={["Destaques do estoque"]}
            lead="Seminovos revisados, com procedência conferida e prontos para transferência."
          />
          <Reveal variant="fade-up">
            <Link
              href="/estoque"
              className="group inline-flex items-center gap-2 text-[0.95rem] text-fg-dim hover:text-fg"
            >
              Ver os {total} veículos
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <Reveal variant="rise" className="lg:col-span-7">
            <Link
              href={`/estoque/${hero.id}`}
              className="group flex h-full flex-col overflow-hidden rounded border border-border bg-surface transition-colors duration-300 hover:border-border-strong"
            >
              <div className="overflow-hidden">
                <div className="transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-[1.03]">
                  <VehicleImage
                    photo={hero.photos[0]}
                    label={`${hero.brand} ${hero.model} ${hero.version}`}
                    ratio="16 / 10"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="rounded-none border-0"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-5 p-7">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-2xl font-semibold text-fg">
                    {hero.brand} {hero.model}
                  </h3>
                  <p className="text-[0.9rem] text-muted">{hero.version}</p>
                </div>
                <ul className="flex flex-col gap-2 text-[0.9rem] text-fg-dim">
                  {hero.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <Check
                        size={16}
                        weight="bold"
                        className="mt-0.5 shrink-0 text-accent"
                      />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-end justify-between border-t border-border pt-5">
                  <div className="flex flex-col">
                    <span className="text-[0.7rem] text-muted">
                      {formatYear(hero)} · {formatMileage(hero.mileage)}
                    </span>
                    <span className="font-display text-2xl font-semibold text-fg tnum">
                      {formatPrice(hero.price)}
                    </span>
                  </div>
                  <span className="text-[0.9rem] text-accent group-hover:text-accent-hover">
                    Ver detalhes
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-5">
            {rest.map((v) => (
              <Reveal key={v.id} variant="fade-up" className="flex-1">
                <Link
                  href={`/estoque/${v.id}`}
                  className="group flex h-full items-stretch overflow-hidden rounded border border-border bg-surface transition-colors duration-300 hover:border-border-strong"
                >
                  <div className="relative w-[46%] shrink-0 overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-[1.04]">
                      <VehicleImage
                        photo={v.photos[0]}
                        label={`${v.brand} ${v.model}`}
                        ratio="1 / 1"
                        sizes="(max-width: 1024px) 46vw, 23vw"
                        className="h-full w-full rounded-none border-0"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-5">
                    <h3 className="font-display text-lg font-semibold leading-tight text-fg">
                      {v.brand} {v.model}
                    </h3>
                    <p className="line-clamp-1 text-[0.8rem] text-muted">
                      {v.version}
                    </p>
                    <p className="text-[0.78rem] text-fg-dim tnum">
                      {formatYear(v)} · {formatMileage(v.mileage)}
                    </p>
                    <span className="mt-auto font-display text-lg font-semibold text-fg tnum">
                      {formatPrice(v.price)}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
