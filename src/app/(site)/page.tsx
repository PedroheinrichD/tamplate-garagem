import { Hero } from "@/components/home/Hero";
import { ProofBar } from "@/components/home/ProofBar";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { Services } from "@/components/home/Services";
import { Financing } from "@/components/home/Financing";
import { TradeIn } from "@/components/home/TradeIn";
import { WhyUs } from "@/components/home/WhyUs";
import { Testimonials } from "@/components/home/Testimonials";
import { VisitUs } from "@/components/home/VisitUs";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofBar />
      <FeaturedVehicles />
      <Services />
      <Financing />
      <TradeIn />
      <WhyUs />
      <Testimonials />
      <VisitUs />
    </>
  );
}
