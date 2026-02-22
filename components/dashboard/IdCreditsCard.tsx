import { useState, useEffect } from "react";
import { Coins, Fingerprint, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { BuyCreditsModal } from "./BuyCreditsModal";

interface IdCreditsCardProps {
  userId: string;
  effectivePlan: string;
}

export function IdCreditsCard({ userId, effectivePlan }: IdCreditsCardProps) {
  const { language } = useLanguage();
  const [credits, setCredits] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(10);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const isLegalPlan = effectivePlan.toLowerCase() === "legal" || effectivePlan.toLowerCase() === "premium";

  useEffect(() => {
    if (!isLegalPlan) return;
    loadCredits();
    checkAdminRole();
  }, [userId, isLegalPlan]);

  const checkAdminRole = async () => {
    setIsAdmin(false);
  };

  const loadCredits = async () => {
  };

  if (!isLegalPlan) return null;

  if (loading) {
    return (
      <div className="p-4 bg-emerald-50/50 rounded-xl animate-pulse">
        <div className="h-3 bg-emerald-100 rounded w-2/3 mb-2" />
        <div className="h-2 bg-emerald-100 rounded" />
      </div>
    );
  }

  const percentage = totalCredits > 0 ? Math.min((credits / totalCredits) * 100, 100) : 0;
  const isLow = credits <= 2;
  const isEmpty = credits === 0;

  // Calculate billing cycle renewal (1st of next month)
  const now = new Date();
  const nextRenewal = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysUntilRenewal = Math.ceil((nextRenewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const renewalDate = nextRenewal.toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', {
    day: 'numeric', month: 'short'
  });
  const renewalLabel = language === 'nl'
    ? `+10 credits op ${renewalDate} (over ${daysUntilRenewal} ${daysUntilRenewal === 1 ? 'dag' : 'dagen'})`
    : `+10 credits on ${renewalDate} (in ${daysUntilRenewal} ${daysUntilRenewal === 1 ? 'day' : 'days'})`;

  // Calculate purchased credits expiry (only shown when extra credits were bought)
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
    title: language === 'nl' ? "ID Verificatie Credits" : "ID Verification Credits",
    remaining: language === 'nl' ? "beschikbaar" : "remaining",
    buy: language === 'nl' ? "Credits kopen" : "Buy credits",
    low: language === 'nl' ? "Bijna op" : "Running low",
    empty: language === 'nl' ? "Geen credits meer" : "No credits left",
  };

  return (
    <>
      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/30">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Fingerprint className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-[11px] font-semibold text-foreground">{content.title}</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-600">{credits}/{totalCredits}</span>
        </div>

        <div className="relative h-1.5 bg-emerald-100 rounded-full overflow-hidden mb-1.5">
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all ${
              isEmpty ? "bg-destructive" : isLow ? "bg-emerald-400" : "bg-emerald-500"
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
          className="text-[10px] font-medium text-emerald-700 hover:underline w-full text-left"
        >
          {content.buy}
        </button>

        {(isLow || isEmpty) && (
          <p className={`text-[10px] font-medium mt-1 ${isEmpty ? "text-destructive" : "text-emerald-600"}`}>
            ⚠️ {isEmpty ? content.empty : content.low}
          </p>
        )}

        {purchasedExpiryLabel && (
          <div className={`flex items-center gap-1 text-[10px] mt-1 ${
            purchasedExpired ? 'text-destructive' : purchasedExpiryUrgent ? 'text-emerald-600' : 'text-muted-foreground'
          }`}>
            <CalendarClock className="h-2.5 w-2.5" />
            <span>{purchasedExpiryLabel}</span>
          </div>
        )}
      </div>

      <BuyCreditsModal
        open={showBuyModal}
        onOpenChange={setShowBuyModal}
        currentCredits={credits}
        isAdmin={isAdmin}
        onCreditsPurchased={(purchased) => {
          setCredits(prev => prev + purchased);
          setTotalCredits(prev => prev + purchased);
        }}
      />
    </>
  );
}
