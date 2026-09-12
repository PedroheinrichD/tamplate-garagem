import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretRight, Check } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Gallery } from "@/components/vehicle/Gallery";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { VehicleInterestForm } from "@/components/vehicle/VehicleInterestForm";
import { WhatsappCta } from "@/components/ui/WhatsappCta";
import { getVehicleBySlug, getRelatedVehicles } from "@/lib/vehicles";
import { formatPrice, formatMileage, formatYear } from "@/lib/vehicle-format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/estoque/[id]">): Promise<Metadata> {
  const { id } = await params;
  const v = await getVehicleBySlug(id);
  if (!v) return { title: "Veículo não encontrado" };
  return {
    title: `${v.brand} ${v.model} ${v.version} ${v.year}`,
    description: `${v.brand} ${v.model} ${v.year}, ${formatMileage(v.mileage)}, ${formatPrice(v.price)}. ${v.description}`,
  };
}

const STATUS_LABEL: Record<string, string> = {
  reservado: "Reservado",
  vendido: "Vendido",
};

export default async function VehiclePage({
  params,
}: PageProps<"/estoque/[id]">) {
  const { id } = await params;
  const vehicle = await getVehicleBySlug(id);
  if (!vehicle) notFound();

  const related = await getRelatedVehicles(id, 3);

  const specGroups: { title: string; rows: [string, string][] }[] = [
    {
      title: "Ficha técnica",
      rows: [
        ["Ano", formatYear(vehicle)],
        ["Quilometragem", formatMileage(vehicle.mileage)],
        ["Combustível", vehicle.fuel],
        ["Câmbio", vehicle.transmission],
        ["Carroceria", vehicle.body],
        ["Portas", String(vehicle.doors)],
      ],
    },
    {
      title: "Detalhes",
      rows: [
        ["Cor", vehicle.color],
        ["Final de placa", String(vehicle.plateEnd)],
        ["Situação", STATUS_LABEL[vehicle.status] ?? "Disponível"],
      ],
    },
  ];

  const interestMsg = `Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.version} (${vehicle.year}), ${formatPrice(vehicle.price)}. Ainda está disponível?`;

  return (
    <>
      <Container width="wide" className="pt-24 md:pt-28">
        <nav className="flex items-center gap-1.5 text-[0.82rem] text-muted">
          <Link href="/estoque" className="hover:text-fg">
            Estoque
          </Link>
          <CaretRight size={12} />
          <span className="text-fg-dim">
            {vehicle.brand} {vehicle.model}
          </span>
        </nav>
      </Container>

      <section className="py-8 md:py-12">
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <Gallery
              name={`${vehicle.brand} ${vehicle.model}`}
              photos={vehicle.photos}
            />

            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="flex flex-col gap-6 rounded border border-border bg-surface p-7">
                <div className="flex flex-col gap-1">
                  {vehicle.status !== "disponivel" ? (
                    <span className="mb-1 inline-flex w-fit rounded bg-accent px-2 py-0.5 text-[0.7rem] font-medium text-accent-ink">
                      {STATUS_LABEL[vehicle.status]}
                    </span>
                  ) : null}
                  <h1 className="font-display text-2xl font-semibold text-fg">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <p className="text-[0.9rem] text-muted">{vehicle.version}</p>
                </div>

                <div className="flex flex-col border-y border-border py-4">
                  <span className="text-[0.72rem] text-muted">à vista</span>
                  <span className="font-display text-3xl font-semibold text-fg tnum">
                    {formatPrice(vehicle.price)}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[0.86rem]">
                  {specGroups[0].rows.map(([k, val]) => (
                    <div key={k} className="flex flex-col">
                      <dt className="text-muted">{k}</dt>
                      <dd className="text-fg-dim">{val}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-col gap-3">
                  <WhatsappCta
                    size="lg"
                    variant="solid"
                    className="w-full"
                    owner={1}
                    message={interestMsg}
                  >
                    Tenho interesse
                  </WhatsappCta>
                  <WhatsappCta
                    size="lg"
                    className="w-full"
                    owner={0}
                    message={`Olá! Quero simular o financiamento do ${vehicle.brand} ${vehicle.model} ${vehicle.year}.`}
                  >
                    Simular financiamento
                  </WhatsappCta>
                </div>

                <div className="border-t border-border pt-5">
                  <VehicleInterestForm vehicleSlug={vehicle.id} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <Container width="wide">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
            <div className="flex flex-col gap-10">
              {specGroups.map((group) => (
                <div key={group.title} className="flex flex-col gap-4">
                  <h2 className="font-display text-lg font-semibold text-fg">
                    {group.title}
                  </h2>
                  <dl className="flex flex-col divide-y divide-border">
                    {group.rows.map(([k, val]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between py-2.5 text-[0.9rem]"
                      >
                        <dt className="text-muted">{k}</dt>
                        <dd className="text-fg-dim">{val}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <h2 className="font-display text-lg font-semibold text-fg">
                  Sobre este carro
                </h2>
                <p className="text-[1rem] leading-relaxed text-fg-dim">
                  {vehicle.description}
                </p>
                <ul className="flex flex-col gap-2 pt-1">
                  {vehicle.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-[0.92rem] text-fg-dim"
                    >
                      <Check
                        size={16}
                        weight="bold"
                        className="mt-0.5 shrink-0 text-accent"
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="font-display text-lg font-semibold text-fg">
                  Equipamentos
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {vehicle.features.map((f) => (
                    <li
                      key={f}
                      className="rounded border border-border bg-bg-elev px-3 py-1.5 text-[0.82rem] text-fg-dim"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-border py-20 md:py-24">
          <Container width="wide">
            <h2 className="mb-10 font-display text-2xl font-semibold text-fg">
              Parecidos com este
            </h2>
            <Reveal stagger>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((v) => (
                  <div key={v.id} data-reveal-item>
                    <VehicleCard vehicle={v} />
                  </div>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>
      ) : null}
    </>
  );
}
