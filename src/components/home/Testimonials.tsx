import { Container } from "@/components/ui/Container";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Reveal } from "@/components/motion/Reveal";
import { getTestimonials } from "@/lib/content";

export async function Testimonials() {
  const quotes = await getTestimonials();
  if (quotes.length === 0) return null;

  return (
    <section className="bg-bg-elev py-16 md:py-24">
      <Container width="wide">
        <SectionIntro titleLines={["Quem já saiu", "daqui dirigindo."]} />
        <Reveal className="mt-12">
          <ul className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
            {quotes.map((q) => (
              <li
                key={q.author}
                className="flex min-w-[82%] snap-start flex-col justify-between gap-8 rounded border border-border bg-surface p-7 sm:min-w-[360px]"
              >
                <p className="font-display text-[1.15rem] leading-snug text-fg">
                  &ldquo;{q.quote}&rdquo;
                </p>
                <div className="flex flex-col">
                  <span className="text-[0.9rem] font-medium text-fg">
                    {q.author}
                  </span>
                  <span className="text-[0.82rem] text-muted">{q.context}</span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
