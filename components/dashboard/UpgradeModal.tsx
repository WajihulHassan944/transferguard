import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, Check, ShieldCheck, Fingerprint } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetPlan?: "professional" | "legal";
}

const getContent = (language: string) => {
  if (language === 'nl') {
    return {
      professional: {
        title: "Upgrade naar Certified Delivery",
        description: "Ontgrendel SMS twee-factor authenticatie en geavanceerde bewijsborging voor al uw overdrachten.",
      features: [
          "SMS twee-factor authenticatie (50/maand)",
          "Adobe Certified PDF-bewijsrapport",
          "1 TB beveiligde opslag",
          "50 GB maximale bestandsgrootte",
          "Anti-manipulatiezegel met tijdstempel",
          "Prioritaire ondersteuning",
        ],
        price: "€49/maand",
        priceNote: "(jaarlijks) of €59/maand (maandelijks)",
        cta: "Activeer Certified Delivery",
        later: "Misschien later",
      },
      legal: {
        title: "Upgrade naar Verified Identity",
        description: "Verkrijg onweerlegbare bewijsborging met biometrische identiteitsverificatie voor maximale juridische zekerheid.",
        features: [
          "ID Check + Biometrische verificatie",
          "Onweerlegbaar juridisch bewijs",
          "Juridisch bindend leveringsbewijs",
          "100 GB maximale bestandsgrootte",
          "Alles uit het Certified Delivery plan",
          "Dedicated accountmanager",
        ],
        price: "€89/maand",
        priceNote: "",
        cta: "Activeer Verified Identity",
        later: "Misschien later",
      },
    };
  }
  return {
    professional: {
      title: "Upgrade to Certified Delivery",
      description: "Unlock SMS two-factor authentication and advanced evidence collection for all your transfers.",
      features: [
        "SMS two-factor authentication (50/month)",
        "Adobe Certified PDF audit trail",
        "1 TB secure storage",
        "50 GB max file size",
        "Anti-tamper seal with timestamp",
        "Priority support",
      ],
      price: "€49/month",
      priceNote: "(yearly) or €59/month (monthly)",
      cta: "Activate Certified Delivery",
      later: "Maybe later",
    },
    legal: {
      title: "Upgrade to Verified Identity",
      description: "Get irrefutable evidence with biometric identity verification for maximum legal certainty.",
      features: [
        "ID Check + Biometric verification",
        "Irrefutable legal evidence",
        "Legally binding delivery proof",
        "100 GB max file size",
        "Everything in Certified Delivery",
        "Dedicated account manager",
      ],
      price: "€89/month",
      priceNote: "",
      cta: "Activate Verified Identity",
      later: "Maybe later",
    },
  };
};

export function UpgradeModal({ open, onOpenChange, targetPlan = "professional" }: UpgradeModalProps) {
  const { language } = useLanguage();
  const content = getContent(language);
  const plan = content[targetPlan];

  const Icon = targetPlan === "legal" ? Fingerprint : ShieldCheck;
  const checkoutPath = `/checkout?plan=${targetPlan}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">{plan.title}</DialogTitle>
          <DialogDescription className="text-base">
            {plan.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-5 w-5 text-primary" />
            <span className="font-semibold">
              {targetPlan === "professional" ? "Certified Delivery" : "Verified Identity"} — {plan.price}
            </span>
          </div>
          {plan.priceNote && (
            <p className="text-xs text-muted-foreground mb-3">{plan.priceNote}</p>
          )}
          <ul className="space-y-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Button asChild size="lg" className="w-full">
            <Link href={checkoutPath}>
              <Crown className="h-4 w-4 mr-2" />
              {plan.cta}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            {plan.later}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
