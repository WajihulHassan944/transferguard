import { Server, Fingerprint, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const getContent = (language: string) => {
  const isNl = language === 'nl';
  return {
    label: isNl ? "Vertrouwde EU-infrastructuur" : "Trusted EU Infrastructure",
    title: isNl ? "Gebouwd op Europese standaarden" : "Built on European Standards",
    items: [
      {
        icon: Server,
        title: isNl ? "Gehost in Duitsland" : "Hosted in Germany",
        description: isNl
          ? "Alle data wordt opgeslagen op gecertificeerde servers in Duitsland, volledig GDPR-compliant en vrij van buitenlandse jurisdictie."
          : "All data is stored on certified servers in Germany, fully GDPR-compliant and free from foreign jurisdiction.",
      },
      {
        icon: Fingerprint,
        title: isNl ? "Gecertificeerde ID-verificatie" : "Certified ID Verification",
        description: isNl
          ? "Biometrische identiteitsverificatie die 230+ nationaliteiten ondersteunt, gecertificeerd volgens Europese regelgeving."
          : "Biometric identity verification supporting 230+ nationalities, certified under European regulations.",
      },
      {
        icon: CreditCard,
        title: isNl ? "EU-betaalverwerking" : "EU Payment Processing",
        description: isNl
          ? "Betalingen worden verwerkt door een gelicenseerde Europese betaaldienstverlener, zonder tussenkomst van niet-EU partijen."
          : "Payments are processed by a licensed European payment service provider, without involvement of non-EU parties.",
      },
    ],
  };
};

export const TrustedPartnersSection = () => {
  const { language } = useLanguage();
  const content = getContent(language);

  return (
    <section className="py-24 lg:py-32 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {content.label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {content.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                <item.icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
