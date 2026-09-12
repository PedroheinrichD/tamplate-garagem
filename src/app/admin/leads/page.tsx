import { requireUser } from "@/lib/auth";
import { getLeads } from "@/lib/admin";

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  CONTATO: "Contato",
  TROCA: "Troca",
  INTERESSE: "Interesse",
  FINANCIAMENTO: "Financiamento",
};
const STATUS_LABEL: Record<string, string> = {
  NEW: "Novo",
  WORKING: "Em atendimento",
  WON: "Fechado",
  LOST: "Perdido",
};

const dt = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

// Depois de 5h, um lead "novo" não puxa mais destaque em vermelho (deixa de
// ser urgente, mas o status no banco continua NEW até o admin mudar).
const NEW_HIGHLIGHT_MS = 5 * 60 * 60 * 1000;

function isFreshNew(status: string, createdAt: Date) {
  return status === "NEW" && Date.now() - createdAt.getTime() < NEW_HIGHLIGHT_MS;
}

function StatusBadge({ status, createdAt }: { status: string; createdAt: Date }) {
  const label = STATUS_LABEL[status] ?? status;
  if (isFreshNew(status, createdAt)) {
    return (
      <span className="whitespace-nowrap rounded bg-accent px-2 py-1 text-[0.72rem] font-medium text-accent-ink">
        {label}
      </span>
    );
  }
  return (
    <span className="whitespace-nowrap rounded border border-border-strong px-2 py-1 text-[0.72rem] text-fg-dim">
      {label}
    </span>
  );
}

export default async function AdminLeadsPage() {
  await requireUser();
  const leads = await getLeads(200);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">Leads</h1>
        <p className="mt-1 text-[0.9rem] text-fg-dim">
          {leads.length} registro(s). Dados administrativos — nunca expostos no
          site.
        </p>
      </div>

      {leads.length === 0 ? (
        <p className="rounded border border-border bg-surface p-6 text-[0.9rem] text-fg-dim">
          Nenhum lead ainda.
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-3 md:hidden">
            {leads.map((l) => (
              <li
                key={l.id}
                className="flex flex-col gap-3 rounded border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold text-fg">
                      {l.name}
                    </p>
                    <p className="text-[0.78rem] text-muted">
                      {KIND_LABEL[l.kind] ?? l.kind} · {dt.format(l.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={l.status} createdAt={l.createdAt} />
                </div>
                <div className="flex flex-col gap-1.5 border-t border-border pt-3 text-[0.85rem] text-fg-dim">
                  <p className="tnum">{l.phone}</p>
                  <p>
                    {l.subject ?? l.tradeCar ?? "—"}
                    {l.message ? (
                      <span className="block text-[0.78rem] text-muted">
                        {l.message}
                      </span>
                    ) : null}
                  </p>
                  {l.vehicle ? (
                    <p>
                      <span className="text-muted">Veículo: </span>
                      {l.vehicle.brand} {l.vehicle.model}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded border border-border md:block">
            <table className="w-full min-w-[720px] text-left text-[0.85rem]">
              <thead className="bg-bg-elev text-muted">
                <tr>
                  <th className="p-3 font-medium">Quando</th>
                  <th className="p-3 font-medium">Tipo</th>
                  <th className="p-3 font-medium">Nome</th>
                  <th className="p-3 font-medium">WhatsApp</th>
                  <th className="p-3 font-medium">Assunto / carro</th>
                  <th className="p-3 font-medium">Veículo</th>
                  <th className="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((l) => (
                  <tr key={l.id} className="text-fg-dim">
                    <td className="whitespace-nowrap p-3 tnum">
                      {dt.format(l.createdAt)}
                    </td>
                    <td className="p-3">{KIND_LABEL[l.kind] ?? l.kind}</td>
                    <td className="p-3 text-fg">{l.name}</td>
                    <td className="whitespace-nowrap p-3 tnum">{l.phone}</td>
                    <td className="p-3">
                      {l.subject ?? l.tradeCar ?? "—"}
                      {l.message ? (
                        <span className="block text-[0.78rem] text-muted">
                          {l.message}
                        </span>
                      ) : null}
                    </td>
                    <td className="p-3">
                      {l.vehicle
                        ? `${l.vehicle.brand} ${l.vehicle.model}`
                        : "—"}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={l.status} createdAt={l.createdAt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
