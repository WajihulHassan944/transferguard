import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, UserCheck, ScanFace, FileCheck, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

const getVerificationSteps = (language: "en" | "nl") => {
  const content = {
    en: [
      {
        icon: ScanFace,
        title: "Live Selfie Capture",
        description: "Recipient takes a real-time photo to prevent fraud",
      },
      { icon: Shield, title: "Government ID Scan", description: "Passport or ID card is scanned and verified" },
      {
        icon: UserCheck,
        title: "Biometric Match",
        description: "AI compares selfie with ID photo for identity confirmation",
      },
      {
        icon: FileCheck,
        title: "Proof Generated",
        description: "Tamper-proof certificate with verified identity data",
      },
    ],
    nl: [
      {
        icon: ScanFace,
        title: "Live Selfie Opname",
        description: "Ontvanger maakt real-time foto om fraude te voorkomen",
      },
      { icon: Shield, title: "Overheids-ID Scan", description: "Paspoort of ID-kaart wordt gescand en geverifieerd" },
      {
        icon: UserCheck,
        title: "Biometrische Match",
        description: "AI vergelijkt selfie met ID-foto voor identiteitsbevestiging",
      },
      {
        icon: FileCheck,
        title: "Bewijs Gegenereerd",
        description: "Fraudebestendig certificaat met geverifieerde identiteitsdata",
      },
    ],
  };
  return content[language];
};

const sectionContent = {
  en: {
    badge: "Verified Identity Feature",
    title: "Only send privacy-sensitive documents to the",
    titleHighlight: "person",
    titleEnd: "they are specifically intended for.",
    subtitle: "Legal-grade biometric verification.",
    legalGrade: "VERIFIED IDENTITY",
    valueTitle: 'From "I didn\'t receive it" to undeniable proof',
    valueText:
      "Standard file transfers can be disputed. Our Identity-Verified Delivery uses government-issued ID combined with live biometric verification to create irrefutable evidence that the specific person received your documents.",
    eidasTitle: "EU Regulation Compliant",
    eidasItems: [
      "Biometric verification meets the highest EU standards for identity assurance.",
      "Court-admissible evidence through government ID and live selfie verification.",
      "Supports legally binding delivery proof in accordance with EU regulations.",
    ],
    trustGdpr: "GDPR Compliant",
    trustDeleted: "Data deleted after verification",
    trustEu: "EU-based processing",
    cta: "Get Identity-Verified Delivery",
  },
  nl: {
    badge: "Verified Identity Functie",
    title: "Stuur privacy gevoelige documenten alleen naar",
    titleHighlight: "diegene",
    titleEnd: "voor wie het bedoeld is.",
    subtitle: "Juridisch waterdichte, Biometrische verificatie .",
    legalGrade: "VERIFIED IDENTITY",
    valueTitle: 'Van "Ik heb het niet ontvangen" naar onweerlegbaar bewijs',
    valueText:
      "Standaard bestandsoverdrachten bieden vaak onvoldoende bewijskracht. Exclusief binnen ons Legal Plan introduceert TransferGuard de Identiteit-Geverifieerde Levering. Door de controle van een officieel overheids-ID te combineren met live biometrische verificatie, creëert u onweerlegbaar bewijs dat exact de juiste persoon uw documenten heeft ontvangen en geopend.",
    eidasTitle: "EU-Regelgeving Conform",
    eidasItems: [
      "Biometrische verificatie voldoet aan de hoogste EU-normen voor identiteitsborging.",
      "Juridisch toelaatbaar bewijs door overheids-ID en live selfie-verificatie.",
      "Ondersteunt juridisch bindend leveringsbewijs conform EU-regelgeving.",
    ],
    trustGdpr: "AVG-conform",
    trustDeleted: "Data verwijderd na verificatie",
    trustEu: "EU-gebaseerde verwerking",
    cta: "Krijg Identiteit-Geverifieerde Levering",
  },
};

export const IdentityVerificationSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const { language } = useLanguage();

  const verificationSteps = getVerificationSteps(language);
  const content = sectionContent[language];

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 bg-gradient-to-b from-background to-emerald-50/30">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 scroll-animate ${isVisible ? "is-visible" : ""}`}>
          <p className="inline-block text-xs font-semibold text-emerald-600 bg-emerald-100 px-4 py-2 rounded-full uppercase tracking-wider mb-4">
            {content.badge}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {content.title} <span className="text-emerald-600">{content.titleHighlight}</span> {content.titleEnd}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{content.subtitle}</p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-center">
          {/* Left: Image */}
          <div
            className={`relative scroll-animate-left ${isVisible ? "is-visible" : ""}`}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
              <img
                src="/assets/id-verification-hero.jpg"
                alt="ID Verification Process - Passport matched with live selfie"
                className="w-full h-auto object-contain"
              />
              <div className="absolute hidden sm:block top-4 right-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {content.legalGrade}
              </div>
            </div>
            <div className="absolute -z-10 top-4 left-4 w-full h-full bg-emerald-200/30 rounded-2xl" />
          </div>

          {/* Right: Content */}
          <div
            className={`space-y-8 scroll-animate-right ${isVisible ? "is-visible" : ""}`}
            style={{ transitionDelay: "250ms" }}
          >
            {/* Value proposition */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">{content.valueTitle}</h3>
              <p className="text-muted-foreground leading-relaxed">{content.valueText}</p>
            </div>

            {/* Verification steps */}
            <div className={`grid sm:grid-cols-2 gap-4 stagger-children ${isVisible ? "is-visible" : ""}`}>
              {verificationSteps.map((step, index) => (
                <Card
                  key={index}
                  className="p-4 bg-background border-l-4 border-l-emerald-500 card-hover card-hover-emerald"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <step.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                {content.trustGdpr}
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                {content.trustDeleted}
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                {content.trustEu}
              </span>
            </div>

            {/* CTA */}
            <div className="flex justify-center sm:justify-start">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg group"
              >
                <Link href="/checkout?plan=legal">
                  {content.cta}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
