import { Check, Shield, Fingerprint, ChevronDown, ChevronUp, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BurdenOfProofSection } from "./BurdenOfProofSection";
import { TrustedPartnersSection } from "./TrustedPartnersSection";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

interface Feature {
  name: { en: string; nl: string };
  starter: boolean | string;
  pro: boolean | string;
  legal: boolean | string;
  proOnly?: boolean;
  legalOnly?: boolean;
  isCategory?: boolean;
  subtext?: { starter?: string; pro?: string; legal?: string };
}

const getFeatures = (lang: 'en' | 'nl'): Feature[] => [
  { name: { en: "Essentials", nl: "Basis" }, starter: "", pro: "", legal: "", isCategory: true },
  {
    name: { en: "Storage / Max file size", nl: "Opslag / Max bestandsgrootte" },
    starter: lang === 'nl' ? "500 GB / 50 GB" : "500 GB / 50 GB",
    pro: lang === 'nl' ? "1 TB gedeeld / 50 GB" : "1 TB shared / 50 GB",
    legal: lang === 'nl' ? "3 TB gedeeld / 100 GB" : "3 TB shared / 100 GB",
  },
  {
    name: { en: "Secure Transfer (2FA)", nl: "Beveiligde Overdracht (2FA)" },
    starter: lang === 'nl' ? "Onbeperkt" : "Unlimited",
    pro: lang === 'nl' ? "Onbeperkt" : "Unlimited",
    legal: lang === 'nl' ? "Onbeperkt" : "Unlimited",
  },
  { name: { en: "Secure 256-bit End-to-End Encryption (E2EE)", nl: "Veilige 256 bits End-to-End Encryptie (E2EE)" }, starter: true, pro: true, legal: true },
  {
    name: { en: "SMS 2FA Verifications", nl: "SMS 2FA Verificaties" },
    starter: false,
    pro: lang === 'nl' ? "50/mnd gedeeld (EU)" : "50/mo shared (EU)",
    legal: lang === 'nl' ? "100/mnd gedeeld (Wereldwijd)" : "100/mo shared (Worldwide)",
  },
  { name: { en: "Users", nl: "Gebruikers" }, starter: lang === 'nl' ? "1 (vast)" : "1 (fixed)", pro: lang === 'nl' ? "Onbeperkt" : "Unlimited", legal: lang === 'nl' ? "Onbeperkt" : "Unlimited" },
  {
    name: { en: "Extra Seat Price", nl: "Extra Gebruiker Prijs" },
    starter: "—",
    pro: lang === 'nl' ? "€19/mnd (jaarlijks)" : "€19/mo (annual)",
    legal: lang === 'nl' ? "€29/mnd (jaarlijks)" : "€29/mo (annual)",
  },
  {
    name: { en: "Security Features", nl: "Beveiligingsfuncties" },
    starter: "",
    pro: "",
    legal: lang === 'nl' ? "Alles van Pro, plus:" : "Everything from Pro, plus:",
    isCategory: true,
  },
  {
    name: { en: "Audit Trail Type", nl: "Audit Trail Type" },
    starter: lang === 'nl' ? "E-mailbevestiging" : "Email confirmation",
    pro: lang === 'nl' ? "Adobe Gecertificeerde PDF" : "Adobe Certified PDF",
    legal: lang === 'nl' ? "inbegrepen" : "included",
  },
  { name: { en: "Validated Timestamp", nl: "Gevalideerde Tijdstempel" }, starter: true, pro: true, legal: true },
  { name: { en: "SHA-256 File Hash", nl: "SHA-256 Bestandshash" }, starter: true, pro: true, legal: true },
  {
    name: { en: "IP & Access Logging", nl: "IP & Toegangslogging" },
    starter: lang === 'nl' ? "Verwerkt in e-mail" : "Processed in email",
    pro: lang === 'nl' ? "Verzegeld in PDF rapport" : "Sealed in PDF report",
    legal: lang === 'nl' ? "Verzegeld in PDF rapport" : "Sealed in PDF report",
  },
  { name: { en: "Anti-Tamper Seal", nl: "Anti-Manipulatie Zegel" }, starter: false, pro: true, legal: lang === 'nl' ? "inbegrepen" : "included" },
  {
    name: { en: "Adobe PDF Sealing", nl: "Adobe PDF Verzegeling" },
    starter: false,
    pro: "€2,50/PDF",
    legal: lang === 'nl' ? "50/mnd inbegrepen" : "50/mo included",
    subtext: { pro: lang === 'nl' ? "(Credits bij te kopen)" : "(Credits purchasable)" },
  },
  { name: { en: "Logging History", nl: "Logging Historie" }, starter: false, pro: lang === 'nl' ? "Onbeperkt" : "Unlimited", legal: lang === 'nl' ? "Onbeperkt" : "Unlimited" },
  {
    name: { en: "The Upgrades (Unique to Legal)", nl: "De Upgrades (Uniek voor Legal)" },
    starter: "",
    pro: "",
    legal: "",
    isCategory: true,
  },
  {
    name: { en: "Identity Verification", nl: "Identiteitsverificatie" },
    starter: false,
    pro: false,
    legal: lang === 'nl' ? "Biometrische ID Check" : "Biometric ID Check",
    legalOnly: true,
  },
  {
    name: { en: "ID Verification Credits", nl: "ID Verificatie Credits" },
    starter: false,
    pro: false,
    legal: lang === 'nl' ? "✨ 10 Credits /mnd" : "✨ 10 Credits /mo",
    legalOnly: true,
    subtext: { legal: lang === 'nl' ? "(Extra: €5 per stuk)" : "(Extra: €5 each)" },
  },
  {
    name: { en: "Client Workspaces", nl: "Klantwerkruimtes" },
    starter: false,
    pro: false,
    legal: true,
    legalOnly: true,
  },
  { name: { en: "Legal Standing", nl: "Juridische Positie" }, starter: "", pro: "", legal: "", isCategory: true },
  {
    name: { en: "Evidence Strength", nl: "Bewijskracht" },
    starter: lang === 'nl' ? "E-mailbevestiging" : "Email confirmation",
    pro: lang === 'nl' ? "Leveringsbewijs" : "Delivery proof",
    legal: lang === 'nl' ? "Identiteitsgeverifieerd Bewijs" : "Identity-verified proof",
    subtext: {
      starter: lang === 'nl' ? "(Veilig verstuurd melding)" : "(Secure delivery notification)",
      pro: lang === 'nl' ? "(Bestand 100% ongewijzigd)" : "(File 100% unmodified)",
      legal: lang === 'nl' ? "(Identiteit + Inhoud geverifieerd)" : "(Identity + Content verified)",
    },
  },
  {
    name: { en: "Comparable to", nl: "Vergelijkbaar met" },
    starter: lang === 'nl' ? "E-mail Notificatie" : "Email Notification",
    pro: lang === 'nl' ? "Aangetekende Post" : "Registered Mail",
    legal: lang === 'nl' ? "Ondertekend Ontvangstbewijs" : "Signed Receipt",
  },
  { name: { en: "Extras", nl: "Extra's" }, starter: "", pro: "", legal: "", isCategory: true },
  { name: { en: "Revoke Transfer Link", nl: "Link Intrekken" }, starter: true, pro: true, legal: true },
  { name: { en: "Replace File", nl: "Bestand Vervangen" }, starter: true, pro: true, legal: true },
  { name: { en: "Custom Branding", nl: "Eigen Huisstijl" }, starter: false, pro: true, legal: true },
  {
    name: { en: "Priority Support", nl: "Prioriteit Support" },
    starter: false,
    pro: false,
    legal: true,
    legalOnly: true,
  },
];

const getPlans = (language: string) => {
  const isNl = language === "nl";
  return [
    {
      name: "Secure Transfer",
      monthlyPrice: 16,
      yearlyPrice: 12,
      extraSeatMonthlyPrice: 0,
      extraSeatYearlyPrice: 0,
      noExtraSeats: true,
      subtitle: isNl ? "Voor de individuele advocaat of mediator" : "For the individual lawyer or mediator",
      description: isNl
        ? "Digitale aangetekende post met sluitend dossier"
        : "Digital registered mail with complete records",
      cta: isNl ? "Abonneer Nu" : "Subscribe Now",
      ctaSubtext: isNl ? "Veilig Versturen" : "Secure Sending",
      highlights: isNl
        ? [
            "500 GB opslag, 50 GB max bestandsgrootte",
            "Veilige 256 bits End-to-End Encryptie (E2EE)",
            "E-mailbevestiging van veilige levering",
            "Gevalideerde tijdstempel & SHA-256 hash",
            "Individuele licentie (1 gebruiker) ",
          ]
        : [
            "500 GB storage, 50 GB max file size",
            "End-to-End Encryption (E2EE)",
            "Email confirmation of secure delivery",
            "Validated timestamp & SHA-256 hash",
            "Individual license (1 user)",
          ],
    },
    {
      name: "Certified Delivery",
      monthlyPrice: 59,
      yearlyPrice: 49,
      extraSeatMonthlyPrice: 23,
      extraSeatYearlyPrice: 19,
      noExtraSeats: false,
      subtitle: isNl ? "Geverifieerde bestandslevering verzegelde PDF" : "Verified file delivery sealed PDF",
      description: isNl
        ? "Adobe Gecertificeerde PDF voor integriteits bewijs"
        : "Adobe Certified PDF for proof of integrity",
      cta: isNl ? "Start 14-Dagen Proef" : "Start 14-Day Trial",
      ctaSubtext: isNl ? "Probeer Risicovrij" : "Try Risk-Free",
      extraSeatNote: isNl
        ? "Extra gebruiker: €19/mnd (jaarlijks) · Deelt 1 TB opslag & 50 SMS (EU)"
        : "Extra user: €19/mo (yearly) · Shares 1 TB storage & 50 SMS (EU)",
      highlights: isNl
        ? [
            "1 TB gedeelde opslag, 50 GB max bestandsgrootte",
            "Onbeperkte PDF bewijsrapporten",
            "Veilige 256 bits End-to-End Encryptie (E2EE)",
            "50 gedeelde SMS 2FA verificaties /mnd (EU)",
            "Adobe gecertificeerd rapport incl. tijdstempel",
            "Adobe PDF Verzegeling: €2,50 per PDF",
            "Extra gebruiker: €19/mnd (jaarlijks)",
          ]
        : [
            "1 TB shared storage, 50 GB max file size",
            "Unlimited PDF proof reports",
            "End-to-End Encryption (E2EE)",
            "50 shared SMS 2FA verifications /mo (EU)",
            "Adobe Certified report incl. timestamp",
            "Adobe PDF Sealing: €2.50 per PDF",
            "Extra user: €19/mo (yearly)",
          ],
    },
    {
      name: "Verified Identity",
      monthlyPrice: 159,
      yearlyPrice: 129,
      extraSeatMonthlyPrice: 35,
      extraSeatYearlyPrice: 29,
      noExtraSeats: false,
      subtitle: isNl ? "Identiteitsgeverifieerde Levering" : "Identity-Verified Delivery",
      description: isNl
        ? "Alles van Certified Delivery + ID Verificatie"
        : "Everything in Certified Delivery + ID Verification",
      cta: isNl ? "Abonneer Nu" : "Subscribe Now",
      ctaSubtext: isNl ? "Maximale Juridische Bescherming" : "Maximum Legal Protection",
      extraSeatNote: isNl
        ? "Extra gebruiker: €29/mnd (jaarlijks) · Deelt 3 TB opslag & 100 SMS"
        : "Extra user: €29/mo (yearly) · Shares 3 TB storage & 100 SMS",
      highlights: isNl
        ? [
            "Alles van Certified Delivery, plus:",
            "3 TB gedeelde opslag, 100 GB max bestandsgrootte",
            "Veilige 256 bits End-to-End Encryptie (E2EE)",
            "100 gedeelde SMS 2FA verificaties /mnd (Wereldwijd)",
            "10 ID verificaties inbegrepen per maand (extra bij te kopen á 5 euro per stuk)",
            "50 Adobe PDF verzegelingen /mnd inbegrepen",
            "Biometrische NFC identiteitsverificatie",
            "Officieel identiteitsbewijs controle",
            "Prioriteit support inbegrepen",
            "Extra gebruiker: €29/mnd (jaarlijks)",
          ]
        : [
            "Everything in Certified Delivery, plus:",
            "3 TB shared storage, 100 GB max file size",
            "End-to-End Encryption (E2EE)",
            "100 shared SMS 2FA verifications /mo (Worldwide)",
            "10 ID verifications included per month (top up whenever needed)",
            "50 Adobe PDF seals /mo included",
            "Biometric NFC identity verification",
            "Government ID document check",
            "Priority support included",
            "Extra user: €29/mo (yearly)",
          ],
    },
  ];
};

const getContent = (language: string) => ({
  header: {
    label: language === "nl" ? "Prijzen" : "Pricing",
    title1: language === "nl" ? "Beveiligde overdrachten met" : "Secure transfers with",
    titleHighlight: language === "nl" ? "juridisch bewijs" : "legal-grade evidence",
    subtitle:
      language === "nl"
        ? "Maak van elke bestandsoverdracht een forensisch verzegeld bewijsstuk. Van audit-ready logs tot identiteitsgeverifieerde levering."
        : "Turn every file transfer into a forensically sealed piece of evidence. From audit-ready logs to identity-verified delivery.",
  },
  userCount: {
    label: language === "nl" ? "Aantal Gebruikers" : "Number of Users",
    user: language === "nl" ? "Gebruiker" : "User",
    users: language === "nl" ? "Gebruikers" : "Users",
  },
  billing: {
    monthly: language === "nl" ? "Maandelijks" : "Monthly",
    yearly: language === "nl" ? "Jaarlijks" : "Yearly",
    saveUpTo: language === "nl" ? "Bespaar tot 20%" : "Save up to 20%",
    billedAnnually: language === "nl" ? "Jaarlijks gefactureerd:" : "Billed annually:",
    save: language === "nl" ? "Bespaar" : "Save",
    year: language === "nl" ? "/jaar" : "/year",
    forUsers: language === "nl" ? "voor" : "for",
    usersLabel: language === "nl" ? "gebruikers" : "users",
    exclVat: language === "nl" ? "excl. BTW" : "excl. VAT",
  },
  badges: {
    mostPopular: language === "nl" ? "Meest Populair" : "Most Popular",
    included: language === "nl" ? "Inbegrepen" : "Included",
    soloUser: language === "nl" ? "Solo" : "Solo",
    legalBadge: language === "nl" ? "Maximale Bewijskracht" : "Maximum Evidence",
  },
  professional: {
    recommended: language === "nl" ? "Aanbevolen voor advocatuur & notariaat" : "Recommended for lawyers & notaries",
    socialProof:
      language === "nl" ? "Gekozen door 500+ juridische professionals" : "Chosen by 500+ legal professionals",
    originalPrice: 69,
  },
  legal: {
    recommended: language === "nl" ? "" : "",
  },
  comparison: {
    show: language === "nl" ? "Vergelijk alle functies" : "Compare all features",
    hide: language === "nl" ? "Verberg volledige vergelijking" : "Hide full comparison",
  },
  enterprise: {
    text: language === "nl" ? "10+ gebruikers?" : "10+ users?",
    cta: language === "nl" ? "Neem contact op" : "Contact us",
  },
});

const FeatureValue = ({
  value,
  subtext,
  includedText,
}: {
  value: boolean | string;
  subtext?: string;
  includedText: string;
}) => {
  if (value === "included" || value === "inbegrepen") {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-cta flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-medium text-cta">{includedText}</span>
      </div>
    );
  }
  if (typeof value === "string" && value !== "") {
    return (
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium">{value}</span>
        {subtext && <span className="text-xs text-muted-foreground">{subtext}</span>}
      </div>
    );
  }
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div className="w-5 h-5 rounded-full bg-cta flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
      </div>
    );
  }
  return <span className="text-muted-foreground">—</span>;
};

export const PricingSection = () => {
  const { language } = useLanguage();
  const [isYearly, setIsYearly] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [userCount, setUserCount] = useState(1);

  const content = getContent(language);
  const plans = getPlans(language);
  const lang = language as "en" | "nl";
  const features = getFeatures(lang);

  const userOptions = [1, 3, 5, 10];

  const getMonthlyTotal = (plan: (typeof plans)[0]) => {
    if (plan.noExtraSeats) {
      return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    }
    const basePrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const extraSeatPrice = isYearly ? plan.extraSeatYearlyPrice : plan.extraSeatMonthlyPrice;
    const extraUsers = Math.max(0, userCount - 1);
    return basePrice + extraUsers * extraSeatPrice;
  };

  const getYearlyTotal = (plan: (typeof plans)[0]) => {
    const monthlyTotal = getMonthlyTotal(plan);
    return Math.round(monthlyTotal * 12 * 100) / 100;
  };

  const getYearlySavings = (plan: (typeof plans)[0]) => {
    if (plan.noExtraSeats) {
      return Math.round((plan.monthlyPrice - plan.yearlyPrice) * 12 * 100) / 100;
    }
    const monthlyPriceTotal = plan.monthlyPrice + Math.max(0, userCount - 1) * plan.extraSeatMonthlyPrice;
    const yearlyPriceTotal = plan.yearlyPrice + Math.max(0, userCount - 1) * plan.extraSeatYearlyPrice;
    return (monthlyPriceTotal - yearlyPriceTotal) * 12;
  };

  const formatPrice = (price: number) => {
    return Number.isInteger(price) ? `${price}` : price.toFixed(2).replace(".", ",");
  };

  return (
    <section id="pricing" className="py-24 lg:py-32 px-4 bg-background">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-4">{content.header.label}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {content.header.title1} <span className="text-primary">{content.header.titleHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{content.header.subtitle}</p>

          {/* User Count Toggle */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-sm font-medium text-muted-foreground">{content.userCount.label}</span>
            <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
              {userOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => setUserCount(count)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    userCount === count
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {count} {count === 1 ? content.userCount.user : content.userCount.users}
                </button>
              ))}
            </div>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span
              className={`text-sm font-medium transition-colors ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              {content.billing.monthly}
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-cta" />
            <span
              className={`text-sm font-medium transition-colors ${isYearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              {content.billing.yearly}
            </span>
            {isYearly && (
              <Badge className="bg-cta/10 text-cta border-cta/20 text-xs font-medium">{content.billing.saveUpTo}</Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {/* Starter Card */}
          <Card className="relative overflow-hidden bg-background border-2 border-border hover:border-muted-foreground/30 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col hover:scale-[1.02]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <Badge className="bg-muted-foreground/70 text-white text-xs px-4 py-1.5 rounded-b-lg rounded-t-none shadow-md">
                {content.badges.soloUser}
              </Badge>
            </div>

            <div className="pt-12 pb-6 px-6 text-center border-b border-border bg-gradient-to-b from-muted/50 to-transparent">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Secure Transfer</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground transition-all duration-300">
                  €{formatPrice(getMonthlyTotal(plans[0]))}
                </span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{content.billing.exclVat}</p>
              {isYearly && (
                <>
                  <p className="text-xs text-muted-foreground mt-2">
                    {content.billing.billedAnnually} €{formatPrice(getYearlyTotal(plans[0]))}
                    {content.billing.year}
                  </p>
                  <p className="text-sm text-cta font-medium mt-1">
                    {content.billing.save} €{formatPrice(getYearlySavings(plans[0]))}
                    {content.billing.year}
                  </p>
                </>
              )}
            </div>

            <div className="px-6 py-6 flex-grow">
              <div className="space-y-3">
                {plans[0].highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-cta flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6 mt-auto">
              <Button
                asChild
                size="lg"
                className="w-full bg-muted-foreground/80 hover:bg-muted-foreground/70 text-white h-12 text-base font-medium shadow-md"
              >
                <Link href="/checkout?plan=starter">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {plans[0].cta}
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">{plans[0].ctaSubtext}</p>
              <p className="text-xs text-transparent select-none mt-1">&nbsp;</p>
            </div>
          </Card>

          {/* Professional Card */}
          <Card className="relative overflow-hidden bg-background border-2 border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col hover:scale-[1.02]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-b-lg rounded-t-none shadow-md">
                {content.badges.mostPopular}
              </Badge>
            </div>

            <div className="pt-12 pb-6 px-6 text-center border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Certified Delivery</h3>
              <div className="flex items-baseline justify-center gap-1">
                {isYearly && (
                  <span className="text-lg text-muted-foreground line-through mr-1">
                    €{content.professional.originalPrice}
                  </span>
                )}
                <span className="text-4xl font-bold text-primary transition-all duration-300">
                  €{getMonthlyTotal(plans[1])}
                </span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {userCount > 1 ? `${content.billing.forUsers} ${userCount} ${content.billing.usersLabel} · ` : ""}
                {content.billing.exclVat}
              </p>
              {isYearly && (
                <>
                  <p className="text-xs text-muted-foreground mt-2">
                    {content.billing.billedAnnually} €{getYearlyTotal(plans[1])}
                    {content.billing.year}
                  </p>
                  <p className="text-sm text-cta font-medium mt-1">
                    {content.billing.save} €{getYearlySavings(plans[1])}
                    {content.billing.year}
                  </p>
                </>
              )}
            </div>

            <div className="px-6 py-6 flex-grow">
              <div className="space-y-3">
                {plans[1].highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-cta flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6 mt-auto">
              <Button
                asChild
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-medium shadow-md"
              >
                <Link href="/signup/pro?plan=professional">
                  <Shield className="h-4 w-4 mr-2" />
                  {plans[1].cta}
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">{plans[1].ctaSubtext}</p>
              <p className="text-xs text-transparent select-none mt-1">&nbsp;</p>
            </div>
          </Card>

          {/* Legal Card */}
          <Card className="relative overflow-hidden bg-background border-2 border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col hover:scale-[1.02]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <Badge className="bg-emerald-500 text-white text-xs px-4 py-1.5 rounded-b-lg rounded-t-none shadow-md">
                {content.badges.legalBadge}
              </Badge>
            </div>
            <div className="pt-12 pb-6 px-6 text-center border-b border-border bg-gradient-to-b from-emerald-50/50 to-transparent">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Fingerprint className="h-7 w-7 text-emerald-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">Verified Identity</h3>
              <p className="text-xs text-emerald-600 font-medium mb-3">{content.legal.recommended}</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-emerald-600 transition-all duration-300">
                  €{getMonthlyTotal(plans[2])}
                </span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {userCount > 1 ? `${content.billing.forUsers} ${userCount} ${content.billing.usersLabel} · ` : ""}
                {content.billing.exclVat}
              </p>
              {isYearly && (
                <>
                  <p className="text-xs text-muted-foreground mt-2">
                    {content.billing.billedAnnually} €{getYearlyTotal(plans[2])}
                    {content.billing.year}
                  </p>
                  <p className="text-sm text-cta font-medium mt-1">
                    {content.billing.save} €{getYearlySavings(plans[2])}
                    {content.billing.year}
                  </p>
                </>
              )}
            </div>

            <div className="px-6 py-6 flex-grow">
              <div className="space-y-3">
                {plans[2].highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 text-sm ${idx === 0 ? "pb-2 mb-1 border-b border-emerald-200" : ""}`}
                  >
                    {idx === 0 ? (
                      <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    ) : (
                      <Check className="h-5 w-5 text-cta flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`${idx === 0 ? "font-medium text-emerald-700" : "text-foreground"}`}>
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6 mt-auto">
              <Button
                asChild
                size="lg"
                className="w-full bg-cta hover:bg-cta/90 text-white h-12 text-base font-medium shadow-md"
              >
                <Link href="/checkout?plan=legal">
                  <Fingerprint className="h-4 w-4 mr-2" />
                  {plans[2].cta}
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">{plans[2].ctaSubtext}</p>
              <p className="text-xs text-transparent select-none mt-1">&nbsp;</p>
            </div>
          </Card>
        </div>

        {/* Compare All Features Toggle */}
        <Collapsible open={showComparison} onOpenChange={setShowComparison}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
            >
              {showComparison ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  {content.comparison.hide}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  {content.comparison.show}
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6">
            {/* Desktop comparison table */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-4 gap-4 mb-0">
                <div className="col-span-1" />
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`p-4 text-center rounded-t-xl ${
                      plan.name === "Secure Transfer"
                        ? "bg-muted/50 border-x border-t border-border"
                        : plan.name === "Certified Delivery"
                          ? "bg-primary/5 border-x border-t border-primary/20"
                          : "bg-emerald-50 border-x border-t border-emerald-200"
                    }`}
                  >
                    <h4 className="font-semibold">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground">€{formatPrice(getMonthlyTotal(plan))}/mo</p>
                  </div>
                ))}
              </div>

              <div className="bg-background rounded-b-xl border border-border overflow-hidden">
                {features.map((feature, index) => {
                  if (feature.isCategory) {
                    return (
                      <div
                        key={feature.name[lang]}
                        className="grid grid-cols-4 gap-4 px-6 py-3 bg-muted/50 border-b border-border"
                      >
                        <div className="text-sm font-bold text-foreground">{feature.name[lang]}</div>
                        <div />
                        <div />
                        <div className="text-center">
                          {feature.legal && typeof feature.legal === "string" && (
                            <span className="text-sm italic text-muted-foreground">{feature.legal}</span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={feature.name[lang]}
                      className={`grid grid-cols-4 gap-4 px-6 py-4 hover:bg-muted/30 transition-colors ${
                        index !== features.length - 1 ? "border-b border-border" : ""
                      } ${feature.legalOnly ? "bg-emerald-50/30" : ""}`}
                    >
                      <div className="text-sm font-medium">{feature.name[lang]}</div>
                      <div className="text-center">
                        <FeatureValue
                          value={feature.starter}
                          subtext={feature.subtext?.starter}
                          includedText={content.badges.included}
                        />
                      </div>
                      <div className="text-center">
                        <FeatureValue
                          value={feature.pro}
                          subtext={feature.subtext?.pro}
                          includedText={content.badges.included}
                        />
                      </div>
                      <div className="text-center">
                        <FeatureValue
                          value={feature.legal}
                          subtext={feature.subtext?.legal}
                          includedText={content.badges.included}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile comparison */}
            <div className="sm:hidden space-y-6">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`p-4 ${
                    plan.name === "Secure Transfer"
                      ? "border-border"
                      : plan.name === "Certified Delivery"
                        ? "border-primary/30"
                        : "border-emerald-300"
                  }`}
                >
                  <h4 className="font-semibold text-lg mb-3">{plan.name}</h4>
                  <div className="space-y-2">
                    {features
                      .filter((f) => !f.isCategory)
                      .map((feature) => {
                        const value =
                          plan.name === "Secure Transfer"
                            ? feature.starter
                            : plan.name === "Certified Delivery"
                              ? feature.pro
                              : feature.legal;
                        return (
                          <div
                            key={feature.name[lang]}
                            className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0"
                          >
                            <span className="text-muted-foreground">{feature.name[lang]}</span>
                            <FeatureValue value={value} includedText={content.badges.included} />
                          </div>
                        );
                      })}
                  </div>
                </Card>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Enterprise Contact Block */}
        <div className="mt-10 mb-16 text-center">
          <p className="text-muted-foreground">
            {content.enterprise.text}{" "}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              {content.enterprise.cta} →
            </Link>
          </p>
        </div>
      </div>

      {/* Burden of Proof Section */}
      <BurdenOfProofSection compact />

      {/* Trusted Partners */}
      <TrustedPartnersSection />
    </section>
  );
};
