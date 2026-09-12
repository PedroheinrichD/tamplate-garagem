import type { Metadata } from "next";
import {
  MapPin,
  Clock,
  WhatsappLogo,
  InstagramLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { ContactForm } from "@/components/contato/ContactForm";
import { getSiteConfig, whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Benevento's Veículos: WhatsApp, endereço, horário de funcionamento e Instagram.",
};

export default async function ContatoPage() {
  const site = await getSiteConfig();
  const waHref = whatsappLink(site.whatsapp.number, site.whatsapp.defaultMessage);
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-28">
      <Container width="wide">
        <div className="flex max-w-2xl flex-col gap-4">
          <SplitLines
            as="h1"
            immediate
            lines={["Fala com a gente."]}
            className="text-[clamp(1.9rem,7.5vw,4rem)] font-semibold text-fg"
          />
          <Reveal variant="fade-up" delay={0.1}>
            <p className="text-[1.05rem] text-fg-dim">
              Respondemos mais rápido pelo WhatsApp, mas o formulário abaixo
              também cai lá.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal variant="fade-up">
            <ContactForm />
          </Reveal>

          <div className="flex flex-col gap-8">
            <Reveal stagger>
              <ul className="flex flex-col gap-5">
                <li data-reveal-item className="flex items-start gap-3">
                  <MapPin size={20} weight="light" className="mt-0.5 shrink-0 text-accent" />
                  <div className="text-[0.95rem] text-fg-dim">
                    <p className="text-fg">Endereço</p>
                    {site.address.street} · {site.address.district}
                    <br />
                    {site.address.city} - {site.address.state}, {site.address.zip}
                  </div>
                </li>
                <li data-reveal-item className="flex items-start gap-3">
                  <Clock size={20} weight="light" className="mt-0.5 shrink-0 text-accent" />
                  <div className="text-[0.95rem] text-fg-dim">
                    <p className="text-fg">Horário</p>
                    {site.hours.map((h) => (
                      <span key={h.days} className="block">
                        {h.days}: {h.time}
                      </span>
                    ))}
                  </div>
                </li>
                <li data-reveal-item className="flex items-start gap-3">
                  <WhatsappLogo size={20} weight="fill" className="mt-0.5 shrink-0 text-accent" />
                  <div className="text-[0.95rem] text-fg-dim">
                    <p className="text-fg">WhatsApp</p>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-fg"
                    >
                      {site.whatsapp.display}
                    </a>
                  </div>
                </li>
                <li data-reveal-item className="flex items-start gap-3">
                  <InstagramLogo size={20} weight="light" className="mt-0.5 shrink-0 text-accent" />
                  <div className="text-[0.95rem] text-fg-dim">
                    <p className="text-fg">Instagram</p>
                    <a
                      href={site.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-fg"
                    >
                      {site.instagram.handle}
                    </a>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal variant="scale">
              <a
                href={site.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {/* TODO: incorporar mapa real da loja */}
                <Placeholder label="Mapa da loja" ratio="4 / 3" />
              </a>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
