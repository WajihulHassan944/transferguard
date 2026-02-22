import { useState, useEffect } from "react";
import { FileCheck, Coins, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { BuySignCreditsModal } from "./BuySignCreditsModal";

interface SignCreditsCardProps {
  userId: string;
  effectivePlan: string;
}

export function SignCreditsCard({ userId, effectivePlan }: SignCreditsCardProps) {
  const { language } = useLanguage();
  const [credits, setCredits] = useState<number>(0);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const normalizedPlan = effectivePlan.toLowerCase();
  const isVerified = normalizedPlan === "legal" || normalizedPlan === "premium";
  const isCertified = normalizedPlan === "pro" || normalizedPlan === "professional";
  const hasAccess = isVerified || isCertified;

  // Both Verified Identity and Certified Delivery use credits
  useEffect(() => {
    if (!hasAccess) return;
    loadCredits();
    checkAdminRole();
  }, [userId, hasAccess]);

  const checkAdminRole = async () => {
    setIsAdmin(false);
  };

  const loadCredits = async () => {
     };

  if (!hasAccess) return null;

  // Credit-based display for both plans
  if (loading) {
    return (
      <div className="p-4 bg-primary/5 rounded-xl animate-pulse">
        <div className="h-3 bg-primary/10 rounded w-2/3 mb-2" />
        <div className="h-2 bg-primary/10 rounded" />
      </div>
    );
  }

  const monthlyAllowance = isVerified ? 50 : 0;
  const displayMax = isVerified ? monthlyAllowance : Math.max(credits, 1);
  const percentage = Math.min((credits / displayMax) * 100, 100);
  const isLow = credits <= 5 && credits > 0;
  const isEmpty = credits === 0;

  const now = new Date();

  // Purchased credits expiry
  let purchasedExpiryLabel = '';
  let purchasedExpiryUrgent = false;
  let purchasedExpired = false;
  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const formattedDate = expiryDate.toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    if (daysUntilExpiry <= 0) {
      purchasedExpiryLabel = language === 'nl' ? 'Credits verlopen' : 'Credits expired';
      purchasedExpired = true;
    } else if (daysUntilExpiry <= 30) {
      purchasedExpiryLabel = language === 'nl'
        ? `Credits verlopen over ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'dag' : 'dagen'}`
        : `Credits expire in ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'day' : 'days'}`;
      purchasedExpiryUrgent = true;
    } else {
      purchasedExpiryLabel = language === 'nl'
        ? `Credits geldig tot ${formattedDate}`
        : `Credits valid until ${formattedDate}`;
    }
  }

  const c = {
    title: language === 'nl' ? "PDF Ondertekeningen" : "PDF Signatures",
    remaining: language === 'nl' ? "beschikbaar" : "available",
    buy: language === 'nl' ? "Credits kopen" : "Buy credits",
    low: language === 'nl' ? "Bijna op" : "Running low",
    empty: language === 'nl' ? "Geen credits meer" : "No credits left",
    price: isVerified
      ? (language === 'nl' ? "50/mnd inbegrepen" : "50/mo included")
      : (language === 'nl' ? "€2,50 per ondertekening" : "€2.50 per signature"),
  };

  const cardBg = isVerified ? "bg-emerald-500/10" : "bg-primary/5";
  const cardBorder = isVerified ? "border-emerald-500/20" : "border-primary/10";
  const accentColor = isVerified ? "text-emerald-600" : "text-primary";
  const barBg = isVerified ? "bg-emerald-500/10" : "bg-primary/10";
  const barFill = isEmpty ? "bg-destructive" : isLow ? (isVerified ? "bg-emerald-500/60" : "bg-primary/60") : (isVerified ? "bg-emerald-500" : "bg-primary");

  return (
    <>
      <div className={`p-3 ${cardBg} rounded-xl border ${cardBorder}`}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <FileCheck className={`h-3.5 w-3.5 ${accentColor}`} />
            <span className="text-[11px] font-semibold text-foreground">{c.title}</span>
          </div>
          <span className={`text-[11px] font-bold ${accentColor}`}>{credits}</span>
        </div>

        <div className={`relative h-1.5 ${barBg} rounded-full overflow-hidden mb-1.5`}>
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all ${barFill}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <span className="text-[10px] text-muted-foreground">{c.remaining} · {c.price}</span>

        {isCertified && (
          <button
            onClick={() => setShowBuyModal(true)}
            className="text-[10px] font-medium text-primary hover:underline w-full text-left"
          >
            {c.buy}
          </button>
        )}

        {(isLow || isEmpty) && (
          <p className={`text-[10px] font-medium mt-1 ${isEmpty ? "text-destructive" : isVerified ? "text-emerald-600/80" : "text-primary/80"}`}>
            ⚠️ {isEmpty ? c.empty : c.low}
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

      {isCertified && (
        <BuySignCreditsModal
          open={showBuyModal}
          onOpenChange={setShowBuyModal}
          currentCredits={credits}
          isAdmin={isAdmin}
          onCreditsPurchased={(purchased) => setCredits(prev => prev + purchased)}
        />
      )}
    </>
  );
}
