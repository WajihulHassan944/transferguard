import { FileLock2, Ban, Eye, ShieldCheck, FileCheck, Shield, Scale, CheckCircle2, AlertTriangle, Fingerprint } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const getContent = (language: string) => {
  if (language === 'nl') {
    return {
      badge: "Adobe PDF Verzegeling",
      title: "Verzegel uw PDF's met Adobe-vertrouwd certificaat",
      subtitle: "Verzegel PDF-documenten vanuit uw dashboard met een Adobe-vertrouwd certificaat. Hiermee is elke wijziging direct zichtbaar in Adobe Acrobat — zonder extra software. Geschikt voor gebruik bij aktes, contracten, jaarstukken en rapportages.",
      benefits: [
        { icon: FileLock2, title: "Elke pagina cryptografisch verzegeld", desc: "Alle pagina's worden verzegeld met een Adobe-vertrouwd certificaat. Wijzigingen na verzegeling worden direct zichtbaar in Adobe Acrobat." },
        { icon: Ban, title: "Manipulatiedetectie", desc: "Als iemand het document wijzigt — zelfs één karakter — toont Adobe een rode waarschuwing dat het zegel ongeldig is." },
        { icon: Eye, title: "Wereldwijd herkend door Adobe", desc: "Ontvangers hoeven niets te installeren. Adobe Acrobat en Reader valideren het zegel automatisch met een groen vinkje — in meer dan 190 landen." },
        { icon: ShieldCheck, title: "Aantoonbaar bewijs van integriteit", desc: "Tijdstempel en certificaatketen bewijzen dat het document niet is gewijzigd na verzending. Ideaal als ondersteunend bewijs bij aktes, jaarstukken en rapportages." },
      ],
      verifiedBadge: "50/mnd inbegrepen",
      certifiedBadge: "€2,50 per PDF",
      verifiedLabel: "Verified Identity",
      certifiedLabel: "Certified Delivery",
      availableNote: "Verified Identity bevat 50 PDF verzegelingen per maand. Voor Certified Delivery is het beschikbaar als betaalde extra (€2,50 per PDF).",
      problemCaption: "Voorkom dat uw klanten dit zien",
      solutionCaption: "Met TransferGuard Adobe PDF Verzegeling",
      validLabel: "Ondertekend en alle handtekeningen zijn geldig.",
      invalidLabel: "Handtekening ongeldig — document is gewijzigd.",
      validCaption: "Wat uw ontvanger ziet in Adobe Acrobat",
      sealedFile: "Contract_2026.pdf — Verzegeld door TransferGuard",
      tamperedFile: "Contract_gewijzigd.pdf — Manipulatie gedetecteerd",
    };
  }
  return {
    badge: "Adobe PDF Sealing",
    title: "Seal your PDFs with an Adobe-trusted certificate",
    subtitle: "Seal PDF documents from your dashboard with an Adobe-trusted certificate. Any modification is immediately visible in Adobe Acrobat — no extra software needed. Suitable for use with deeds, contracts, annual reports and financial statements.",
    benefits: [
      { icon: FileLock2, title: "Every page cryptographically sealed", desc: "All pages are sealed with an Adobe-trusted certificate. Changes after sealing are immediately visible in Adobe Acrobat." },
      { icon: Ban, title: "Tamper detection", desc: "If anyone modifies the document — even a single character — Adobe displays a red warning that the seal is invalid." },
      { icon: Eye, title: "Recognized worldwide by Adobe", desc: "Recipients don't need to install anything. Adobe Acrobat and Reader validate the seal automatically with a green checkmark — in over 190 countries." },
      { icon: ShieldCheck, title: "Demonstrable proof of integrity", desc: "Timestamp and certificate chain prove the document was not modified after sending. Ideal as supporting evidence for deeds, annual reports and financial statements." },
    ],
    verifiedBadge: "50/mo included",
    certifiedBadge: "€2.50 per PDF",
    verifiedLabel: "Verified Identity",
    certifiedLabel: "Certified Delivery",
    availableNote: "Verified Identity includes 50 PDF seals per month. For Certified Delivery, it is available as a paid add-on (€2.50 per PDF).",
    problemCaption: "Prevent your clients from seeing this",
    solutionCaption: "With TransferGuard Adobe PDF Sealing",
    validLabel: "Signed and all signatures are valid.",
    invalidLabel: "Signature invalid — document has been modified.",
    validCaption: "What your recipient sees in Adobe Acrobat",
    sealedFile: "Contract_2026.pdf — Sealed by TransferGuard",
    tamperedFile: "Contract_modified.pdf — Tampering detected",
  };
};

export const AatlSealingSection = () => {
  const { language } = useLanguage();
  const content = getContent(language);

  return (
    <section className="py-24 px-4 bg-background">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-5">
            <Fingerprint className="h-4 w-4" />
            {content.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {content.subtitle}
          </p>

          {/* Plan availability badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 pointer-events-none">
              <Shield className="h-3 w-3 mr-1.5" />
              {content.certifiedLabel} — {content.certifiedBadge}
            </Badge>
            <Badge className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 pointer-events-none">
              <Fingerprint className="h-3 w-3 mr-1.5" />
              {content.verifiedLabel} — {content.verifiedBadge}
            </Badge>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {content.benefits.map((b, i) => (
            <Card key={i} className="p-6 flex gap-4 items-start border-border hover:border-primary/30 transition-colors">
              <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Adobe Acrobat Visual Mockup */}
        <div className="max-w-3xl mx-auto mt-12 mb-8">
          
          
          <div className="space-y-4">
            {/* Problem: Invalid / tampered signature bar */}
            <div>
              <p className="text-sm font-semibold text-destructive mb-2 text-center">{content.problemCaption}</p>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10 shrink-0">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-destructive">{content.invalidLabel}</p>
                  <p className="text-xs text-destructive/70 truncate">{content.tamperedFile}</p>
                </div>
                <div className="ml-auto shrink-0">
                  <div className="px-2.5 py-1 rounded-md bg-destructive/10">
                    <span className="text-xs font-bold text-destructive">✗ INVALID</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution: Valid signature bar */}
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2 text-center">{content.solutionCaption}</p>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{content.validLabel}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate">{content.sealedFile}</p>
                </div>
                <div className="ml-auto shrink-0">
                  <div className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/40">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">✓ ADOBE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {content.availableNote}
        </p>
      </div>
    </section>
  );
};
