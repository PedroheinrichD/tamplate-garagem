import Link from "next/link";
import {
  InstagramLogo,
  MapPin,
  Clock,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { getSiteConfig, whatsappLink } from "@/lib/site-config";

export async function SiteFooter() {
  const site = await getSiteConfig();
  const year = new Date().getFullYear();
  const waHref = whatsappLink(site.whatsapp.number, site.whatsapp.defaultMessage);

  return (
    <footer className="border-t border-border bg-bg-elev">
      <Container width="wide" className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <span className="flex items-baseline gap-2 font-display text-lg font-semibold text-fg">
              <span aria-hidden className="size-2 self-center bg-accent" />
              Benevento&rsquo;s
              <span className="text-[0.7rem] font-normal text-muted">
                veículos
              </span>
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-fg-dim">
              {site.tagline} Mais de {site.soldCount} carros entregues em{" "}
              {site.yearsActive} anos de loja.
            </p>
          </div>

          <nav className="flex flex-col gap-3 text-sm">
            <p className="font-display font-medium text-fg">Navegação</p>
            <Link href="/estoque" className="text-fg-dim hover:text-fg">
              Estoque completo
            </Link>
            <Link href="/#financiamento" className="text-fg-dim hover:text-fg">
              Financiamento
            </Link>
            <Link href="/#troca" className="text-fg-dim hover:text-fg">
              Avaliar meu usado
            </Link>
            <Link href="/sobre" className="text-fg-dim hover:text-fg">
              Sobre a loja
            </Link>
            <Link href="/contato" className="text-fg-dim hover:text-fg">
              Contato
            </Link>
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            <p className="font-display font-medium text-fg">Horário</p>
            {site.hours.map((h) => (
              <span key={h.days} className="flex items-start gap-2 text-fg-dim">
                <Clock size={16} weight="light" className="mt-0.5 shrink-0" />
                <span>
                  {h.days}
                  <br />
                  <span className="text-muted">{h.time}</span>
                </span>
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <p className="font-display font-medium text-fg">Contato</p>
            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-fg-dim hover:text-fg"
            >
              <MapPin size={16} weight="light" className="mt-0.5 shrink-0" />
              <span>
                {site.address.street}
                <br />
                {site.address.district}, {site.address.city} -{" "}
                {site.address.state}
              </span>
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-fg-dim hover:text-fg"
            >
              <WhatsappLogo size={16} weight="fill" className="shrink-0" />
              {site.whatsapp.display}
            </a>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-fg-dim hover:text-fg"
            >
              <InstagramLogo size={16} weight="light" className="shrink-0" />
              {site.instagram.handle}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. Todos os direitos reservados.
          </p>
          <p>
            Preços e disponibilidade sujeitos a alteração. Fotos ilustrativas.
          </p>
        </div>
      </Container>
    </footer>
  );
}
