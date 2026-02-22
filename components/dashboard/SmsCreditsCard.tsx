import { useState, useEffect } from "react";
import { MessageSquare, Coins, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { BuySmsCreditsModal } from "./BuySmsCreditsModal";

interface SmsCreditsCardProps {
  userId: string;
  effectivePlan: string;
}

export function SmsCreditsCard({ userId, effectivePlan }: SmsCreditsCardProps) {
  const { language } = useLanguage();
  const [credits, setCredits] = useState<number>(50);
  const MONTHLY_ALLOWANCE = 50;
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const normalizedPlan = effectivePlan.toLowerCase();
  const isTrialPlan = normalizedPlan === "trial";
  const hasSmsAccess = normalizedPlan === "professional" || normalizedPlan === "pro" || normalizedPlan === "legal" || normalizedPlan === "premium" || isTrialPlan;

  useEffect(() => {
    if (!hasSmsAccess) return;
    loadCredits();
    checkAdminRole();
  }, [userId, hasSmsAccess]);

  const loadCredits = async () => {
  };

  const checkAdminRole = async () => {
    setIsAdmin(false);
  };

  if (!hasSmsAccess) return null;

  if (loading) {
    return (
      <div className="p-4 bg-primary/5 rounded-xl animate-pulse">
        <div className="h-3 bg-primary/10 rounded w-2/3 mb-2" />
        <div className="h-2 bg-primary/10 rounded" />
      </div>
    );
  }

  const monthlyAllowance = isTrialPlan ? 5 : MONTHLY_ALLOWANCE;
  const percentage = Math.min((credits / monthlyAllowance) * 100, 100);
  const isLow = credits <= 10 && credits > 0;
  const isEmpty = credits === 0;

  // Calculate billing cycle renewal (1st of next month)
  const now = new Date();
  const nextRenewal = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysUntilRenewal = Math.ceil((nextRenewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const renewalDate = nextRenewal.toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', {
    day: 'numeric', month: 'short'
  });
  const renewalLabel = isTrialPlan
    ? (language === 'nl' ? `5 SMS inbegrepen (proefperiode)` : `5 SMS included (trial)`)
    : language === 'nl'
      ? `+50 SMS op ${renewalDate} (over ${daysUntilRenewal} ${daysUntilRenewal === 1 ? 'dag' : 'dagen'})`
      : `+50 SMS on ${renewalDate} (in ${daysUntilRenewal} ${daysUntilRenewal === 1 ? 'day' : 'days'})`;

  // Calculate purchased credits expiry
  let purchasedExpiryLabel = '';
  let purchasedExpiryUrgent = false;
  let purchasedExpired = false;
  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const formattedDate = expiryDate.toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    if (daysUntilExpiry <= 0) {
      purchasedExpiryLabel = language === 'nl' ? 'Gekochte credits verlopen' : 'Purchased credits expired';
      purchasedExpired = true;
    } else if (daysUntilExpiry <= 30) {
      purchasedExpiryLabel = language === 'nl'
        ? `Gekochte credits verlopen over ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'dag' : 'dagen'}`
        : `Purchased credits expire in ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'day' : 'days'}`;
      purchasedExpiryUrgent = true;
    } else {
      purchasedExpiryLabel = language === 'nl'
        ? `Gekochte credits geldig tot ${formattedDate}`
        : `Purchased credits valid until ${formattedDate}`;
    }
  }

  const content = {
    title: language === 'nl' ? "SMS Verificaties" : "SMS Verifications",
    remaining: language === 'nl' ? "/ maand beschikbaar" : "/ month remaining",
    buy: language === 'nl' ? "SMS'en kopen" : "Buy SMS credits",
    low: language === 'nl' ? "Bijna op" : "Running low",
    empty: language === 'nl' ? "Geen SMS'en meer" : "No SMS credits left",
  };

  return (
    <>
      <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-semibold text-foreground">{content.title}</span>
          </div>
          <span className="text-[11px] font-bold text-primary">{credits}/{monthlyAllowance}</span>
        </div>

        <div className="relative h-1.5 bg-primary/10 rounded-full overflow-hidden mb-1.5">
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all ${
              isEmpty ? "bg-destructive" : isLow ? "bg-primary/60" : "bg-primary"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <CalendarClock className="h-2.5 w-2.5 shrink-0" />
          <span className="truncate">{renewalLabel}</span>
        </div>

        <button
          onClick={() => setShowBuyModal(true)}
          className="text-[10px] font-medium text-primary hover:underline w-full text-left"
        >
          {content.buy}
        </button>

        {(isLow || isEmpty) && (
          <p className={`text-[10px] font-medium mt-1 ${isEmpty ? "text-destructive" : "text-primary/80"}`}>
            ⚠️ {isEmpty ? content.empty : content.low}
          </p>
        )}

        {purchasedExpiryLabel && (
          <div className={`flex items-center gap-1 text-[10px] mt-1 ${
            purchasedExpired ? 'text-destructive' : purchasedExpiryUrgent ? 'text-amber-600' : 'text-muted-foreground'
          }`}>
            <CalendarClock className="h-2.5 w-2.5" />
            <span>{purchasedExpiryLabel}</span>
          </div>
        )}
      </div>

      <BuySmsCreditsModal
        open={showBuyModal}
        onOpenChange={setShowBuyModal}
        currentCredits={credits}
        isAdmin={isAdmin}
        onCreditsPurchased={(purchased) => {
          setCredits(prev => prev + purchased);
        }}
      />
    </>
  );
}
