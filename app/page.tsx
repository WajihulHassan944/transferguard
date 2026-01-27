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
