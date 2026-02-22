import {
  Shield,
  Scale,
  ArrowRight,
  CheckCircle2,
  FileText,
  User,
  Fingerprint,
  Mail,
  MapPin,
  Clock,
  Hash,
  Monitor,
  FileCheck,
  Smartphone,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

interface BurdenOfProofSectionProps {
  showCTA?: boolean;
  compact?: boolean;
}

const getContent = (language: string) => ({
  title: {
    en: "Strength of Evidence:",
    nl: "Bewijskracht:",
  },
  titleHighlight: {
    en: "The Key Difference",
    nl: "Het Cruciale Verschil",
  },
  subtitle: {
    en: "How strong is your evidence in a legal dispute? See how identity verification strengthens your proof.",
    nl: "Hoe sterk is uw bewijs bij een juridisch geschil? Ontdek hoe identiteitsverificatie uw bewijskracht versterkt.",
  },
  compactSubtitle: {
    en: "How strong is your evidence in a legal dispute?",
    nl: "Hoe sterk is uw bewijs bij een juridisch geschil?",
  },
  professional: {
    badge: {
      en: "Certified Delivery Plan",
      nl: "Certified Delivery",
    },
    title: {
      en: "Verified Download Proof",
      nl: "Geverifieerd Downloadbewijs",
    },
    boxTitle: {
      en: "Prove When, Where & How",
      nl: "Bewijs Wanneer, Waar & Hoe",
    },
    boxDescription: {
      en: "Every download generates court-admissible evidence: verified email, IP address, timestamp, file integrity hash, and device fingerprint — all sealed in an Adobe certified PDF.",
      nl: "Elke download genereert rechtsgeldige bewijskracht: geverifieerd e-mailadres, IP-adres, tijdstempel, bestandsintegriteits-hash en device-vingerafdruk — alles verzegeld in een Adobe gecertificeerde PDF.",
    },
    evidenceTitle: {
      en: "Your evidence package includes:",
      nl: "Uw bewijspakket bevat:",
    },
    evidence: [
      { icon: Mail, en: "Two-Factor Email Verification", nl: "Tweefactor E-mailverificatie" },
      { icon: Smartphone, en: "Two-Factor SMS Verification", nl: "Tweefactor SMS Verificatie" },
      { icon: MapPin, en: "IP Address & Geolocation", nl: "IP-adres & Geolocatie" },
      { icon: Clock, en: "Sectigo Qualified Timestamp", nl: "Sectigo Gekwalificeerde Tijdstempel" },
      { icon: Hash, en: "SHA-256 File Hash", nl: "SHA-256 Bestandshash" },
      { icon: Monitor, en: "Device & OS Fingerprint", nl: "Apparaat & OS-vingerafdruk" },
      { icon: FileCheck, en: "Adobe Sealed PDF", nl: "Adobe Verzegelde PDF" },
    ],
    comparable: {
      en: "Comparable to:",
      nl: "Vergelijkbaar met:",
    },
    comparableText: {
      en: "Registered mail with proof of posting — solid evidence for everyday business disputes.",
      nl: "Aangetekende post met bewijs van verzending — solide bewijs voor dagelijkse zakelijke geschillen.",
    },
  },
  legal: {
    badge: {
      en: "Verified Identity Plan",
      nl: "Verified Identity Abonnement",
    },
    recommended: {
      en: "Recommended",
      nl: "Aanbevolen",
    },
    title: {
      en: "Identity-Verified Delivery",
      nl: "Identiteitsgeverifieerde Levering",
    },
    boxTitle: {
      en: "Biometric Identity Verification",
      nl: "Biometrische Identiteitsverificatie",
    },
    boxDescription: {
      en: "The recipient verifies their identity with a government-issued ID and biometric selfie before accessing files. Combined with cryptographic proof of delivery, this creates legally robust evidence of who received what, when.",
      nl: "De ontvanger verifieert zijn identiteit met een officieel identiteitsbewijs en biometrische selfie voordat bestanden toegankelijk zijn. Gecombineerd met cryptografisch leveringsbewijs creëert dit juridisch sluitend bewijs van wie wat wanneer heeft ontvangen.",
    },
    recipient: {
      en: "The recipient",
      nl: "De ontvanger",
    },
    evidenceTitle: {
      en: "Your evidence package:",
      nl: "Uw bewijspakket:",
    },
    evidence: [
      { en: "Government ID + biometric verification of recipient", nl: "Officieel ID + biometrische verificatie van ontvanger" },
      { en: "Cryptographic timestamp & file hash", nl: "Cryptografische tijdstempel & bestandshash" },
      { en: "IP address, device & OS fingerprint", nl: "IP-adres, apparaat & OS-vingerafdruk" },
      { en: "Complete audit trail", nl: "Volledige audit trail" },
    ],
    comparable: {
      en: "Comparable to:",
      nl: "Vergelijkbaar met:",
    },
    comparableText: {
      en: "In-person signed receipt — you can prove exactly who received your documents.",
      nl: "Persoonlijk ondertekend ontvangstbewijs — u kunt exact bewijzen wie uw documenten heeft ontvangen.",
    },
  },
  cta: {
    button: {
      en: "Get Identity-Verified Delivery",
      nl: "Kies Identiteitsgeverifieerde Levering",
    },
    subtext: {
      en: "10 ID verifications included monthly • Upgrade anytime",
      nl: "10 ID-verificaties per maand inbegrepen • Altijd upgraden mogelijk",
    },
  },
});

export const BurdenOfProofSection = ({ showCTA = true, compact = false }: BurdenOfProofSectionProps) => {
  const { language } = useLanguage();
  const content = getContent(language);
  const lang = language as 'en' | 'nl';

  return (
    <section className={`${compact ? "py-12" : "py-24 lg:py-32"} px-2 sm:px-4`}>
      <div className="container max-w-5xl mx-auto px-0 sm:px-0">
        {!compact && (
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {content.title[lang]} <span className="text-primary">{content.titleHighlight[lang]}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {content.subtitle[lang]}
            </p>
          </div>
        )}

        {compact && (
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 tracking-tight">
              {content.title[lang]} <span className="text-primary">{content.titleHighlight[lang]}</span>
            </h2>
            <p className="text-muted-foreground">{content.compactSubtitle[lang]}</p>
          </div>
        )}

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 items-stretch">
          {/* Professional Card */}
          <Card className="p-4 sm:p-6 md:p-8 bg-background border border-border shadow-sm relative overflow-hidden flex flex-col">
            {/* Decorative background circle */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

            <div className="relative flex flex-col h-full">
              {/* Header - fixed height */}
              <div className="flex items-start gap-4 mb-6 min-h-[72px]">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2 text-xs border-primary/20 text-primary bg-primary/5">
                    {content.professional.badge[lang]}
                  </Badge>
                  <h3 className="font-bold text-2xl">{content.professional.title[lang]}</h3>
                </div>
              </div>

              {/* Burden of Proof Box - fixed height */}
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/10 mb-6 min-h-[100px] flex flex-col justify-center">
                <p className="font-semibold text-base mb-2 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary shrink-0" />
                  {content.professional.boxTitle[lang]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {content.professional.boxDescription[lang]}
                </p>
              </div>

              {/* Feature list - flex grow */}
              <div className="mb-6 flex-grow">
                <p className="text-sm font-semibold mb-3">{content.professional.evidenceTitle[lang]}</p>
                <ul className="space-y-2">
                  {content.professional.evidence.map((item, index) => (
                    <li key={index} className="flex items-center gap-2.5 text-sm">
                      <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span>{item[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Comparable to - always at bottom */}
              <div className="bg-muted/50 rounded-xl p-4 border border-border mt-auto">
                <p className="text-sm flex items-start gap-2">
                  <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>{content.professional.comparable[lang]}</strong> {content.professional.comparableText[lang]}
                  </span>
                </p>
              </div>
            </div>
          </Card>

          {/* Legal Card */}
          <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-emerald-50/50 to-background border-2 border-emerald-200 shadow-sm relative overflow-hidden flex flex-col">
            {/* Decorative background circle */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl" />

            {/* Recommended badge */}
            <Badge className="absolute top-4 right-4 bg-green-500 text-white shadow-md">
              {content.legal.recommended[lang]}
            </Badge>

            <div className="relative flex flex-col h-full">
              {/* Header - fixed height */}
              <div className="flex items-start gap-4 mb-6 min-h-[72px]">
                <div className="p-3 rounded-xl bg-emerald-100">
                  <Fingerprint className="h-8 w-8 text-emerald-600" strokeWidth={1.5} />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2 text-xs border-emerald-200 text-emerald-700 bg-emerald-50">
                    {content.legal.badge[lang]}
                  </Badge>
                  <h3 className="font-bold text-2xl">{content.legal.title[lang]}</h3>
                </div>
              </div>

              {/* Verified Identity Box - fixed height */}
              <div className="bg-green-500 rounded-xl p-5 mb-6 min-h-[120px] flex flex-col justify-center">
                <p className="font-semibold text-base mb-2 flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-5 w-5 text-white shrink-0" />
                  {content.legal.boxTitle[lang]}
                </p>
                <p className="text-sm text-green-50">
                  <strong className="text-white">{content.legal.recipient[lang]}</strong> {content.legal.boxDescription[lang].replace(lang === 'nl' ? 'De ontvanger' : 'The recipient', '').trim()}
                </p>
              </div>

              {/* Feature list - flex grow */}
              <div className="mb-6 flex-grow">
                <p className="text-sm font-semibold mb-3">{content.legal.evidenceTitle[lang]}</p>
                <ul className="space-y-2.5">
                  {content.legal.evidence.map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span>{item[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Comparable to - always at bottom */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 mt-auto">
                <p className="text-sm flex items-start gap-2">
                  <User className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>{content.legal.comparable[lang]}</strong> {content.legal.comparableText[lang]}
                  </span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {showCTA && (
          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg"
            >
              <Link href="/checkout?plan=legal">
                <Fingerprint className="h-4 w-4 mr-2" />
                {content.cta.button[lang]}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">{content.cta.subtext[lang]}</p>
          </div>
        )}
      </div>
    </section>
  );
};
