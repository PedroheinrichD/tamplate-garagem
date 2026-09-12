import { requireUser } from "@/lib/auth";
import { getSiteConfig } from "@/lib/site-config";
import { SiteConfigForm } from "@/components/admin/SiteConfigForm";

export const dynamic = "force-dynamic";

export default async function AdminConfigPage() {
  await requireUser();
  const c = await getSiteConfig();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">
          Dados da loja
        </h1>
        <p className="mt-1 text-[0.9rem] text-fg-dim">
          Alimenta o rodapé, a página de contato e a seção &ldquo;Passa na
          loja&rdquo;. Fallback para <code className="text-fg">src/lib/site.ts</code>{" "}
          nos campos vazios.
        </p>
      </div>
      <SiteConfigForm
        values={{
          name: c.name,
          shortName: c.shortName,
          tagline: c.tagline,
          soldCount: c.soldCount,
          yearsActive: c.yearsActive,
          instagramHandle: c.instagram.handle,
          instagramUrl: c.instagram.url,
          whatsappNumber: c.whatsapp.number,
          whatsappMessage: c.whatsapp.defaultMessage,
          email: c.email,
          addressStreet: c.address.street,
          addressDistrict: c.address.district,
          addressCity: c.address.city,
          addressState: c.address.state,
          addressZip: c.address.zip,
          mapsUrl: c.address.mapsUrl,
          hours: c.hours,
        }}
      />
    </div>
  );
}
