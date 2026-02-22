import { Shield, Lock, EyeOff, Database, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const getPrivacyFeatures = (language: "en" | "nl") => {
  const content = {
    en: [
      {
        icon: Globe,
        title: "Sovereign EU Infrastructure",
        description:
          "Built on an independent, EU-owned and operated core. Your data stays exclusively within EU data centers, ensuring full GDPR compliance and zero exposure to the US CLOUD Act.",
      },
      {
        icon: Lock,
        title: "End-to-End Encryption",
        description: "AES-256 encryption from upload to download.",
      },
      {
        icon: EyeOff,
        title: "Zero-Knowledge",
        description: "We cannot read or access your files.",
      },
      {
        icon: Database,
        title: "No Commercial Data Mining",
        description: "Your files are never used for AI training or advertising.",
      },
    ],
    nl: [
      {
        icon: Globe,
        title: "Soevereine EU Infrastructuur",
        description:
          "Gebouwd op een onafhankelijke, EU-eigendom en beheerde kern. Uw data blijft exclusief binnen EU datacenters, wat volledige AVG-naleving en nul blootstelling aan de US CLOUD Act garandeert.",
      },
      {
        icon: Lock,
        title: "End-to-End Encryptie",
        description: "AES-256 encryptie van upload tot download.",
      },
      {
        icon: EyeOff,
        title: "Zero-Knowledge",
        description: "Wij kunnen uw bestanden niet lezen of benaderen.",
      },
      {
        icon: Database,
        title: "Geen Commerciële Data Mining",
        description: "Uw bestanden worden nooit gebruikt voor AI-training of advertenties.",
      },
    ],
  };
  return content[language];
};

const getCertifications = (language: "en" | "nl") => {
  const content = {
    en: [
      { name: "Sovereign EU Cloud", image: "/assets/sovereign-eu-cloud-logo.png", subtitle: "Independent, secure infrastructure" },
      { name: "GDPR", image: "/assets/gdpr-logo.png", subtitle: "Compliant" },
      { name: "ISO 27001", image: "/assets/iso27001-logo.png", subtitle: "Certified Infrastructure" },
    ],
    nl: [
      { name: "Soevereine EU Cloud", image: "/assets/sovereign-eu-cloud-logo.png", subtitle: "Onafhankelijke, veilige infrastructuur" },
      { name: "AVG", image: "/assets/gdpr-logo.png", subtitle: "Conform" },
      { name: "ISO 27001", image: "/assets/iso27001-logo.png", subtitle: "Gecertificeerde Infrastructuur" },
    ],
  };
  return content[language];
};

const sectionContent = {
  en: {
    badge: "Worldwide Reach, EU Protection",
    title: "Send files worldwide.",
    titleHighlight: "Data safe in the EU.",
    subtitle:
      "No surveillance, no commercial data mining, no compromises. Built from the ground up to protect your data.",
  },
  nl: {
    badge: "Wereldwijd Bereik, EU Bescherming",
    title: "Verstuur bestanden wereldwijd.",
    titleHighlight: "Data veilig in de EU.",
    subtitle:
      "Geen surveillance, geen commerciële data mining, geen compromissen. Vanaf de grond opgebouwd om uw data te beschermen.",
  },
};

export const PrivacySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const privacyFeatures = getPrivacyFeatures(language);
  const certifications = getCertifications(language);
  const content = sectionContent[language];

  return (
    <section className="py-16 lg:py-20 px-4 relative overflow-hidden" ref={sectionRef}>
      {/* EU Flag Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/assets/eu-flag-background.png')` }} />
      <div className="absolute inset-0 bg-background/70" />

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-primary font-semibold text-sm">{content.badge}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {content.title}<br /><span className="text-primary">{content.titleHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-14">
          {privacyFeatures.map((feature) => (
            <Card
              key={feature.title}
              className="p-6 bg-background/90 backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Certifications */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {certifications.map((cert) => (
            <div
              key={cert.name}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border hover:border-primary/30 transition-colors"
            >
              <img src={cert.image} alt={cert.name} className="h-10 w-10 object-contain" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{cert.name}</span>
                <span className="text-xs text-muted-foreground">{cert.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
