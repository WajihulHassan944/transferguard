import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Fingerprint, Sparkles, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

interface LegalTrialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTryOnce: () => void;
}

const getContent = (language: string) => ({
  title: language === 'nl' 
    ? "Hoogste bewijskracht activeren" 
    : "Activate highest strength of evidence",
  description: language === 'nl'
    ? "U staat op het punt de hoogste bewijskracht te gebruiken. Dit dossier wordt voorzien van een biometrische match met het paspoort van de ontvanger."
    : "You are about to use the highest strength of evidence. This dossier will be matched with the recipient's passport biometrics.",
  tryOnce: language === 'nl' ? "Eenmalig gratis testen" : "Try once for free",
  upgrade: language === 'nl' ? "Abonnement upgraden" : "Upgrade subscription",
  later: language === 'nl' ? "Misschien later" : "Maybe later",
  freeTrialNote: language === 'nl' 
    ? "Probeer het één keer gratis tijdens uw proefperiode"
    : "Try it once for free during your trial period",
  upgradeNote: language === 'nl'
    ? "Krijg onbeperkte toegang tot Full Legal Evidence"
    : "Get unlimited access to Full Legal Evidence",
});

export function LegalTrialModal({ open, onOpenChange, onTryOnce }: LegalTrialModalProps) {
  const { language } = useLanguage();
  const content = getContent(language);

  const handleTryOnce = () => {
    onTryOnce();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
            <Fingerprint className="h-8 w-8 text-emerald-600" />
          </div>
          <DialogTitle className="text-xl">{content.title}</DialogTitle>
          <DialogDescription className="text-base text-center px-4">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          {/* Try once for free */}
          <Button
            size="lg"
            variant="outline"
            className="w-full justify-between h-auto py-4 border-primary/30 hover:bg-primary/5"
            onClick={handleTryOnce}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold">{content.tryOnce}</div>
                <div className="text-xs text-muted-foreground font-normal">{content.freeTrialNote}</div>
              </div>
            </div>
          </Button>

          {/* Upgrade subscription */}
          <Button
            asChild
            size="lg"
            className="w-full justify-between h-auto py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
          >
            <Link href="/checkout?plan=legal">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">{content.upgrade}</div>
                  <div className="text-xs opacity-90 font-normal">{content.upgradeNote}</div>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-muted-foreground">
            {content.later}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
