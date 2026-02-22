import { Scale, Clock, Shield, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CertificatePreview } from "@/components/greensecure/CertificatePreview";

const content = {
  en: {
    heading: "Your Irrefutable",
    headingHighlight: "Proof of Delivery",
    subtitle: "Every Registered File Transfer generates a Certified Audit Trail. See what Certified Delivery & Verified Identity users get.",
    viewReport: "View Full Report",
    certifiedDelivery: "Certified Delivery",
    verifiedIdentity: "Verified Identity",
    benefits: [
      {
        title: "Proof of Delivery",
        description: "Certified evidence of file transmission with timestamp and recipient ID.",
      },
      {
        title: "Full Audit Trail",
        description: "IP address, timestamp, and device info logged for every download.",
      },
      {
        title: "Identity-Verified Delivery",
        description: "Biometric ID verification proves exactly who received your documents. Strong circumstantial evidence for civil proceedings.",
      },
    ],
  },
  nl: {
    heading: "Maximaliseer uw",
    headingHighlight: "bewijskracht bij dossieroverdracht",
    subtitle: "Elke Geregistreerde Bestandsoverdracht genereert een Gecertificeerd Audit Trail. Bekijk wat gebruikers van Certified Delivery & Verified Identity ontvangen.",
    viewReport: "Bekijk Volledig Rapport",
    certifiedDelivery: "Certified Delivery",
    verifiedIdentity: "Verified Identity",
    benefits: [
      {
        title: "Bewijs van Aflevering",
        description: "Gecertificeerd bewijs van bestandsoverdracht met tijdstempel en ontvanger-ID.",
      },
      {
        title: "Volledige Audit Trail",
        description: "IP-adres, tijdstempel en apparaatinformatie vastgelegd bij elke download.",
      },
      {
        title: "Identiteits-geverifieerde Aflevering",
        description: "Biometrische ID-verificatie bewijst precies wie uw documenten heeft ontvangen. Sterk aanvullend bewijs voor civiele procedures.",
      },
    ],
  },
};

const icons = [Shield, Clock, Scale];
const legalOnly = [false, false, true];

export const CertificateSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="py-24 lg:py-32 px-4 bg-muted/30 overflow-hidden" ref={sectionRef}>
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {t.heading} <span className="text-primary">{t.headingHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          
          {/* Left: Certificate Image + Preview button */}
          <div className="relative">
            <div className="relative bg-background rounded-2xl shadow-md overflow-hidden border border-border/50">
              <img
                src="/assets/certificate-example.png"
                alt="Certified Delivery Report"
                className="w-full h-auto"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -z-10 top-4 left-4 w-full h-full bg-primary/5 rounded-2xl" />
            {/* Interactive preview button */}
            <div className="flex justify-center">
              <CertificatePreview variant="legal" />
            </div>
          </div>

          {/* Right: Benefits list */}
          <div className="space-y-5">
            {t.benefits.map((benefit, index) => (
              <Card
                key={benefit.title}
                className={`p-6 bg-background border rounded-2xl relative overflow-hidden ${
                  legalOnly[index]
                    ? "border-emerald-200/80 card-hover card-hover-green" 
                    : "border-border card-hover"
                }`}
              >
                {/* Colored accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  legalOnly[index] ? "bg-emerald-400" : "bg-primary"
                }`} />
                
                <div className="flex items-start gap-4 pl-3">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    legalOnly[index] ? "bg-emerald-100" : "bg-primary/10"
                  }`}>
                    {(() => {
                      const Icon = icons[index];
                      return <Icon className={`h-5 w-5 ${legalOnly[index] ? "text-emerald-600" : "text-primary"}`} strokeWidth={1.5} />;
                    })()}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-bold text-lg text-foreground">{benefit.title}</h3>
                      {/* Plan badge */}
                      {legalOnly[index] ? (
                        <div className="px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 flex-shrink-0">
                          <div className="flex items-center gap-1.5">
                            <Scale className="h-3 w-3 text-emerald-600" />
                            <span className="text-[11px] font-medium text-emerald-700 whitespace-nowrap">{t.verifiedIdentity}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5 flex-shrink-0">
                          <Shield className="h-3 w-3 text-primary" />
                          <span className="text-[11px] font-medium text-primary whitespace-nowrap">{t.certifiedDelivery}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
