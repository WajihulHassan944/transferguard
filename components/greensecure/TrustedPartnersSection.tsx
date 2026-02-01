
const partners = [
  {
    name: "Hetzner",
    description: "Hosted in Germany / GDPR Compliant",
    logo: "/assets/partner-hetzner.png",
  },
  {
    name: "Veriff",
    description: "Biometric ID Verification",
    logo: "/assets/partner-veriff.png",
  },
  {
    name: "Adyen",
    description: "Secure Payments",
    logo: "/assets/partner-adyen.jpg",
  },
];

export const TrustedPartnersSection = () => {
  return (
    <section className="py-24 lg:py-32 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Trusted EU Infrastructure
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Built on Industry Leaders</h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 lg:gap-20">
          {partners.map((partner) => (
            <div key={partner.name} className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-background border border-border/50 flex items-center justify-center mb-4 transition-all duration-300 ease-out group-hover:border-primary/30 group-hover:shadow-xl group-hover:-translate-y-1 p-4">
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <span className="font-semibold text-base text-foreground/80">{partner.name}</span>
              <span className="text-sm text-muted-foreground max-w-[140px] leading-tight mt-1">
                {partner.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
