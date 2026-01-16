'use client'
import { Hero } from "@/components/greensecure/Hero";
import { HowItWorks } from "@/components/greensecure/HowItWorks";
import { ProtectionLevelSection } from "@/components/greensecure/ProtectionLevelSection";
import { CertificateSection } from "@/components/greensecure/CertificateSection";
import { ClientPortalSection } from "@/components/greensecure/ClientPortalSection";
import { PricingSection } from "@/components/greensecure/PricingSection";
import { FAQSection } from "@/components/greensecure/FAQSection";
import { FinalCTA } from "@/components/greensecure/FinalCTA";
import { Footer } from "@/components/greensecure/Footer";
import { PrivacySection } from "@/components/greensecure/PrivacySection";

const Home = () => {
  return (
    <main className="min-h-screen space-y-8 sm:space-y-12 lg:space-y-16">
      <Hero />
      <HowItWorks />
      <section id="privacy">
        <PrivacySection />
      </section>
      <ProtectionLevelSection />
      <section id="pricing">
        <PricingSection />
      </section>
      <CertificateSection />
      <ClientPortalSection />
      <FAQSection />
      <FinalCTA />
    </main>
  );
};

export default Home;
