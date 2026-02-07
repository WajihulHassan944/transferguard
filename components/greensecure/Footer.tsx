
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

const content = {
  en: {
    description: "Secure, compliant file sharing for professionals. Your data stays in the EU with zero-knowledge encryption.",
    euData: "🇪🇺 EU Data Only",
    iso: "ISO 27001 Certified Infrastructure",
    gdpr: "GDPR Compliant",
    product: "Product",
    features: "Features",
    pricing: "Pricing",
    faq: "FAQ",
    about: "About Us",
    contact: "Contact",
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    copyright: "© 2026 TransferGuard. A brand of PVG Technologies B.V. All Rights Reserved.",
    madeIn: "Made in the European Union 🇪🇺",
  },
  nl: {
    description: "Veilig, compliant bestandsdelen voor professionals. Uw data blijft in de EU met zero-knowledge encryptie.",
    euData: "🇪🇺 Alleen EU Data",
    iso: "ISO 27001 Gecertificeerde Infrastructuur",
    gdpr: "AVG Conform",
    product: "Product",
    features: "Functies",
    pricing: "Prijzen",
    faq: "FAQ",
    about: "Over Ons",
    contact: "Contact",
    legal: "Juridisch",
    privacy: "Privacybeleid",
    terms: "Algemene Voorwaarden",
    copyright: "© 2026 TransferGuard. Een merk van PVG Technologies B.V. Alle rechten voorbehouden.",
    madeIn: "Gemaakt in de Europese Unie 🇪🇺",
  },
};

export const Footer = () => {
  const { language } = useLanguage();
  const c = content[language];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <img src="/assets/transferguard-logo-new.png" alt="Transfer Guard" className="h-12" />
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
              {c.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span>{c.euData}</span>
              <span className="hidden sm:inline">•</span>
              <span>{c.iso}</span>
              <span className="hidden sm:inline">•</span>
              <span>{c.gdpr}</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{c.product}</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/features" className="hover:text-foreground transition-colors">{c.features}</Link></li>
              <li><a href="/#pricing" className="hover:text-foreground transition-colors">{c.pricing}</a></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">{c.faq}</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">{c.about}</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">{c.contact}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{c.legal}</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">{c.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">{c.terms}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {c.copyright}
          </p>
          <p className="text-sm text-muted-foreground">
            {c.madeIn}
          </p>
        </div>
      </div>
    </footer>
  );
};
