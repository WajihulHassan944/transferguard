import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Coins, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreditPackage {
  id: string;
  credits: number;
  price: string;
  pricePerCredit: string;
  popular?: boolean;
}

interface BuyCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCredits: number;
  isAdmin: boolean;
  onCreditsPurchased?: (credits: number) => void;
}

const getContent = (language: string) => {
  if (language === 'nl') {
    return {
      title: "ID Verificatie credits kopen",
      description: "Koop extra credits voor biometrische identiteitsverificatie. Credits zijn een jaar geldig na aankoop.",
      currentCredits: "Huidig saldo",
      credits: "credits",
      perCredit: "per credit",
      popular: "Populair",
      bestValue: "Beste waarde",
      buy: "Afrekenen",
      cancel: "Annuleren",
      notifyAdmin: "Breng admin op de hoogte",
      notifyAdminDesc: "Alleen een admin kan ID verificatie credits kopen. Breng uw admin op de hoogte dat de ID verificaties opgehoogd moeten worden.",
      notifySuccess: "Admin is op de hoogte gebracht",
      notifySuccessDesc: "Uw admin ontvangt een melding om de ID verificatie credits op te hogen.",
    };
  }
  return {
    title: "Buy ID Verification Credits",
    description: "Purchase additional credits for biometric identity verification. Credits are valid for one year after purchase.",
    currentCredits: "Current balance",
    credits: "credits",
    perCredit: "per credit",
    popular: "Popular",
    bestValue: "Best value",
    buy: "Checkout",
    cancel: "Cancel",
    notifyAdmin: "Notify admin",
    notifyAdminDesc: "Only an admin can purchase ID verification credits. Notify your admin that ID verifications need to be topped up.",
    notifySuccess: "Admin has been notified",
    notifySuccessDesc: "Your admin will receive a notification to top up ID verification credits.",
  };
};

const CREDIT_PACKAGES: CreditPackage[] = [
  { id: "5", credits: 5, price: "€25", pricePerCredit: "€5,00" },
  { id: "10", credits: 10, price: "€45", pricePerCredit: "€4,50", popular: true },
  { id: "25", credits: 25, price: "€100", pricePerCredit: "€4,00" },
  { id: "50", credits: 50, price: "€175", pricePerCredit: "€3,50" },
];

export function BuyCreditsModal({ open, onOpenChange, currentCredits, isAdmin, onCreditsPurchased }: BuyCreditsModalProps) {
  const { language } = useLanguage();
  const content = getContent(language);
  const [selectedPackage, setSelectedPackage] = useState<string>("10");
  const router = useRouter();
  const handleCheckout = () => {
    const pkg = CREDIT_PACKAGES.find(p => p.id === selectedPackage);
    if (!pkg) return;
    onOpenChange(false);
    router.push(`/checkout?addon=id&amount=${pkg.credits}`);
  };

  const handleNotifyAdmin = () => {
    toast.success(content.notifySuccess, {
      description: content.notifySuccessDesc,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <Coins className="h-8 w-8 text-emerald-600" />
          </div>
          <DialogTitle className="text-xl">{content.title}</DialogTitle>
          <DialogDescription className="text-base">
            {isAdmin ? content.description : content.notifyAdminDesc}
          </DialogDescription>
        </DialogHeader>

        {/* Current balance */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
          <span className="text-sm text-muted-foreground">{content.currentCredits}</span>
          <div className="flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">{currentCredits} {content.credits}</span>
          </div>
        </div>

        {isAdmin ? (
          <>
            {/* Credit packages */}
            <div className="grid gap-2 mt-2">
              {CREDIT_PACKAGES.map((pkg) => {
                const isSelected = selectedPackage === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-50/50"
                        : "border-border hover:border-emerald-200 bg-card/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 ${
                        isSelected ? "border-emerald-500 bg-emerald-500" : "border-muted-foreground/40"
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {pkg.credits} {content.credits}
                          </span>
                          {pkg.popular && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                              {content.popular}
                            </span>
                          )}
                          {pkg.credits === 50 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              {content.bestValue}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {pkg.pricePerCredit} {content.perCredit}
                        </span>
                      </div>
                    </div>

                    <span className="font-bold text-base">{pkg.price}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Button
                size="lg"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleCheckout}
              >
                <Coins className="h-4 w-4 mr-2" />
                {`${content.buy} — ${CREDIT_PACKAGES.find(p => p.id === selectedPackage)?.price}`}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                {content.cancel}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            <Button
              size="lg"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleNotifyAdmin}
            >
              <Mail className="h-4 w-4 mr-2" />
              {content.notifyAdmin}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              {content.cancel}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
