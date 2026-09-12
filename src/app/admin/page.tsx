import { requireUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await requireUser();
  const s = await getDashboardStats();

  const cards = [
    { label: "Veículos no total", value: s.vehicles },
    { label: "Disponíveis", value: s.available },
    { label: "Reservados", value: s.reserved },
    { label: "Vendidos", value: s.sold },
    { label: "Fotos", value: s.photos },
    { label: "Leads novos", value: s.leadsNew },
    { label: "Leads no total", value: s.leadsTotal },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">
          Visão geral
        </h1>
        <p className="mt-1 text-[0.9rem] text-fg-dim">
          Dados ao vivo do banco. Cadastro e edição entram nas próximas etapas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="flex flex-col gap-1 rounded border border-border bg-surface p-5"
          >
            <span className="font-display text-3xl font-semibold text-fg tnum">
              {c.value}
            </span>
            <span className="text-[0.82rem] text-muted">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
