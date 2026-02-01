"use client";

import { Hero } from "@/components/greensecure/Hero";
import { PrivacySection } from "@/components/greensecure/PrivacySection";
import { HowItWorks } from "@/components/greensecure/HowItWorks";
import { ProtectionLevelSection } from "@/components/greensecure/ProtectionLevelSection";
import { CertificateSection } from "@/components/greensecure/CertificateSection";
import { ClientPortalSection } from "@/components/greensecure/ClientPortalSection";
import { PricingSection } from "@/components/greensecure/PricingSection";
import { FAQSection } from "@/components/greensecure/FAQSection";
import { FinalCTA } from "@/components/greensecure/FinalCTA";

import ComingSoon from "./coming-soon/page";
import { useAppSelector } from "@/redux/hooks";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ComparisonSection } from "@/components/greensecure/ComparisonSection";
import { IdentityVerificationSection } from "@/components/greensecure/IdentityVerificationSection";
import { StatsBar } from "@/components/greensecure/StatsBar";

const Home: React.FC = () => {
  const user = useAppSelector((state) => state.user);

if (!user.isHydrated) {
    return (
      <div className="auth-spinner-container">
        <div className="auth-spinner" />
      </div>
    );
  }

const role =
  typeof user.role === "string"
    ? user.role
    : Array.isArray(user.role)
    ? user.role[0]
    : null;

  // Non-admins & logged-out users see Coming Soon
  if (!user.isAuthenticated || role !== "admin") {
    return <ComingSoon />;
  }

  // Admin-only content
  return (
      <main className="min-h-screen">
      <Hero />
      <ScrollReveal>
        <ComparisonSection />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <IdentityVerificationSection />
      </ScrollReveal>
      <ScrollReveal>
        <StatsBar />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <HowItWorks />
      </ScrollReveal>
      <ScrollReveal>
        <section id="privacy">
          <PrivacySection />
        </section>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <ProtectionLevelSection />
      </ScrollReveal>
      <ScrollReveal>
        <section id="pricing">
          <PricingSection />
        </section>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <ClientPortalSection />
      </ScrollReveal>
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <FinalCTA />
      </ScrollReveal>
    </main>
  
    );
};

export default Home;
