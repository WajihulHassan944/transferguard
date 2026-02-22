import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Fingerprint,
  Mail,
  MapPin,
  Clock,
  Hash,
  Monitor,
  FileCheck,
  Smartphone,
  Camera,
  ScanFace,
  Scale,
  Lock,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

const getFeatures = (language: "en" | "nl") => {
  const content = {
    en: {
      professional: [
        { icon: Mail, text: "Two-Factor Email Verification" },
        { icon: Lock, text: "End-to-End Encryption (E2EE)" },
        { icon: Smartphone, text: "SMS 2FA Authentication (Worldwide)" },
        { icon: MapPin, text: "IP Address & Location Logging" },
        { icon: Clock, text: "Sectigo Qualified Timestamp" },
        { icon: Hash, text: "SHA-256 File Hash Integrity" },
        { icon: Monitor, text: "Device & OS Fingerprinting" },
        { icon: FileCheck, text: "Adobe Sealed PDF" },
      ],
      legal: [
        { icon: Shield, text: "Everything in Certified Delivery +" },
        { icon: Lock, text: "End-to-End Encryption (E2EE)" },
        { icon: Fingerprint, text: "Biometric ID Verification" },
        { icon: FileCheck, text: "Government ID Document Scan" },
        { icon: Camera, text: "Live Selfie Facial Match" },
        { icon: ScanFace, text: "AI Liveness Detection" },
        { icon: Scale, text: "Designed for Court Admissibility" },
      ],
    },
    nl: {
      professional: [
        { icon: Mail, text: "Twee-Factor Email Verificatie" },
        { icon: Lock, text: "End-to-End Encryptie (E2EE)" },
        { icon: Smartphone, text: "SMS 2FA Authenticatie (Wereldwijd)" },
        { icon: MapPin, text: "IP-Adres & Locatie Logging" },
        { icon: Clock, text: "Sectigo Gekwalificeerde Tijdstempel" },
        { icon: Hash, text: "SHA-256 Bestandshash Integriteit" },
        { icon: Monitor, text: "Apparaat & OS Fingerprinting" },
        { icon: FileCheck, text: "Adobe Verzegelde PDF" },
      ],
      legal: [
        { icon: Shield, text: "Alles in Geverifieerd Downloadbewijs +" },
        { icon: Lock, text: "End-to-End Encryptie (E2EE)" },
        { icon: Fingerprint, text: "Biometrische ID Verificatie" },
        { icon: FileCheck, text: "Overheids-ID Document Scan" },
        { icon: Camera, text: "Live Selfie Gezichtsherkenning" },
        { icon: ScanFace, text: "AI Levendigheidsdetectie" },
        { icon: Scale, text: "Ontworpen voor Juridische Toelaatbaarheid" },
      ],
    },
  };
  return content[language];
};

const sectionContent = {
  en: {
    title: "Legal certainty.",
    titleHighlight: "Choose your level.",
    professionalPlan: "Certified Delivery",
    legalPlan: "Verified Identity",
    identityVerified: "IDENTITY VERIFIED",
    professionalTitle: "Verified Download Proof",
    professionalDesc:
      "Prove exactly when, where, and how your file was downloaded. Every download generates a tamper-proof audit trail sealed with an Adobe-trusted certificate.",
    selectProfessional: "Select Certified Delivery",
    legalTitle: "Identity-Verified Delivery",
    legalDesc:
      "Know exactly who downloaded your documents. Biometric verification combined with a digital signature creates an irrefutable chain of evidence — from sender to verified recipient.",
    selectLegal: "Select Verified Identity",
    forTeams: "For teams",
  },
  nl: {
    title: "Kies zelf de mate van",
    titleHighlight: "juridische zekerheid.",
    professionalPlan: "Certified Delivery",
    legalPlan: "Verified Identity",
    identityVerified: "IDENTITEIT GEVERIFIEERD",
    professionalTitle: "Geverifieerd Downloadbewijs",
    professionalDesc:
      "Bewijs precies wanneer, waar en hoe uw bestand is gedownload. Elke download genereert een fraudebestendige audit trail verzegeld met een Adobe-vertrouwd certificaat.",
    selectProfessional: "Selecteer Certified Delivery",
    legalTitle: "Identiteit-Geverifieerde Levering",
    legalDesc:
      "Weet precies wie uw documenten heeft gedownload. Biometrische verificatie gecombineerd met een digitale handtekening creëert een onweerlegbare bewijsketen — van verzender tot geverifieerde ontvanger.",
    selectLegal: "Selecteer Verified Identity",
    forTeams: "Voor teams",
  },
};

export const ProtectionLevelSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const { language } = useLanguage();

  const features = getFeatures(language);
  const content = sectionContent[language];

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        <h2
          className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 scroll-animate ${isVisible ? "is-visible" : ""}`}
        >
          {content.title}
          <span className="text-primary"> {content.titleHighlight}</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Professional Plan */}
          <div className="flex flex-col">
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-5 py-2.5 rounded-full border border-primary/20">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                {content.professionalPlan}
              </span>
            </div>

            <Card
              className={`relative p-6 bg-background border-l-4 border-l-primary border-t border-r border-b border-border flex flex-col h-full rounded-xl scroll-animate card-hover ${isVisible ? "is-visible" : ""}`}
              style={{ transitionDelay: "150ms" }}
            >
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-primary" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-center mb-1">{content.professionalTitle}</h3>
              <p className="text-xs text-primary font-medium text-center mb-4">{content.forTeams}</p>
              <p className="text-muted-foreground text-center mb-5 text-sm leading-relaxed">
                {content.professionalDesc}
              </p>

              <ul className="space-y-2.5 flex-1">
                {features.professional.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground text-sm">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12 text-base font-medium"
                >
                  <Link href="/checkout?plan=professional">{content.selectProfessional}</Link>
                </Button>
              </div>
            </Card>
          </div>

          {/* Legal Plan */}
          <div className="flex flex-col">
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-100 px-5 py-2.5 rounded-full border border-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                {content.legalPlan}
              </span>
            </div>

            <Card
              className={`relative p-6 bg-background border-2 border-emerald-400 flex flex-col h-full rounded-xl overflow-visible scroll-animate-right card-hover card-hover-green ${isVisible ? "is-visible" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex justify-center mb-5 mt-2">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Fingerprint className="h-7 w-7 text-emerald-600" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-center mb-2">{content.legalTitle}</h3>
              <p className="text-muted-foreground text-center mb-5 text-sm leading-relaxed">{content.legalDesc}</p>

              <ul className="space-y-2.5 flex-1">
                {features.legal.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <span className="text-foreground text-sm">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-cta hover:bg-cta/90 text-white rounded-lg h-12 text-base font-medium"
                >
                  <Link href="/signup/pro?plan=legal">{content.selectLegal}</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
