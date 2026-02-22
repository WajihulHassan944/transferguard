import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, Coins, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SmsPackage {
  id: string;
  amount: number;
  price: string;
  pricePerSms: string;
  popular?: boolean;
  bestValue?: boolean;
}

interface BuySmsCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCredits: number;
  isAdmin: boolean;
  onCreditsPurchased?: (credits: number) => void;
}

const getContent = (language: string) => {
  if (language === 'nl') {
    return {
      title: "SMS verificaties kopen",
      description: "Koop extra SMS verificaties voor tweefactor authenticatie. Credits zijn een jaar geldig na aankoop.",
      currentCredits: "Huidig saldo",
      credits: "SMS'en",
      perSms: "per SMS",
      popular: "Populair",
      bestValue: "Beste waarde",
      buy: "Afrekenen",
      cancel: "Annuleren",
      notifyAdmin: "Breng admin op de hoogte",
      notifyAdminDesc: "Alleen een admin kan SMS-bundels kopen. Breng uw admin op de hoogte dat de SMS verificaties opgehoogd moeten worden.",
      notifySuccess: "Admin is op de hoogte gebracht",
      notifySuccessDesc: "Uw admin ontvangt een melding om de SMS verificaties op te hogen.",
    };
  }
  return {
    title: "Buy SMS Verifications",
    description: "Purchase additional SMS verifications for two-factor authentication. Credits are valid for one year after purchase.",
    currentCredits: "Current balance",
    credits: "SMS",
    perSms: "per SMS",
    popular: "Popular",
    bestValue: "Best value",
    buy: "Checkout",
    cancel: "Cancel",
    notifyAdmin: "Notify admin",
    notifyAdminDesc: "Only an admin can purchase SMS bundles. Notify your admin that SMS verifications need to be topped up.",
    notifySuccess: "Admin has been notified",
    notifySuccessDesc: "Your admin will receive a notification to top up SMS verifications.",
  };
};

const SMS_PACKAGES: SmsPackage[] = [
  { id: "50", amount: 50, price: "€12,50", pricePerSms: "€0,25" },
  { id: "100", amount: 100, price: "€22,50", pricePerSms: "€0,225", popular: true },
  { id: "250", amount: 250, price: "€50,00", pricePerSms: "€0,20" },
  { id: "500", amount: 500, price: "€87,50", pricePerSms: "€0,175", bestValue: true },
];

export function BuySmsCreditsModal({ open, onOpenChange, currentCredits, isAdmin, onCreditsPurchased }: BuySmsCreditsModalProps) {
  const { language } = useLanguage();
  const router = useRouter();
   const content = getContent(language);
  const [selectedPackage, setSelectedPackage] = useState<string>("100");

  const handleCheckout = () => {
    const pkg = SMS_PACKAGES.find(p => p.id === selectedPackage);
    if (!pkg) return;
    onOpenChange(false);
    router.push(`/checkout?addon=sms&amount=${pkg.amount}`);
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
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-primary" />
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
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="font-semibold">{currentCredits} {content.credits}</span>
          </div>
        </div>

        {isAdmin ? (
          <>
            {/* SMS packages */}
            <div className="grid gap-2 mt-2">
              {SMS_PACKAGES.map((pkg) => {
                const isSelected = selectedPackage === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30 bg-card/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 ${
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {pkg.amount} {content.credits}
                          </span>
                          {pkg.popular && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              {content.popular}
                            </span>
                          )}
                          {pkg.bestValue && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              {content.bestValue}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {pkg.pricePerSms} {content.perSms}
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
                className="w-full"
                onClick={handleCheckout}
              >
                <Coins className="h-4 w-4 mr-2" />
                {`${content.buy} — ${SMS_PACKAGES.find(p => p.id === selectedPackage)?.price}`}
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
              className="w-full"
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
