import { Lock, Shield, Fingerprint, LucideIcon, Coins, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export type SecurityLevel = "starter" | "professional" | "eidas_qualified";

export interface SecurityLevelOption {
  id: SecurityLevel;
  labelKey: string;
  descriptionKey: string;
  Icon: LucideIcon;
  requiredPlan: "free" | "starter" | "professional" | "premium" | "enterprise";
  creditCost?: number;
}

export const SECURITY_LEVELS: SecurityLevelOption[] = [
  {
    id: "professional",
    labelKey: "professional",
    descriptionKey: "professionalDesc",
    Icon: Shield,
    requiredPlan: "professional",
  },
  {
    id: "eidas_qualified",
    labelKey: "legal",
    descriptionKey: "legalDesc",
    Icon: Fingerprint,
    requiredPlan: "premium",
    creditCost: 1,
  },
];

// Plan hierarchy for access checking
const PLAN_HIERARCHY: Record<string, number> = {
  free: 0,
  starter: 1,
  trial: 2, // Trial has same access as professional
  professional: 2,
  premium: 3,
  legal: 3, // Legal plan has premium access
  enterprise: 4,
};

export const hasAccessToLevel = (userPlan: string, requiredPlan: string): boolean => {
  const userLevel = PLAN_HIERARCHY[userPlan.toLowerCase()] ?? 0;
  const requiredLevel = PLAN_HIERARCHY[requiredPlan.toLowerCase()] ?? 0;
  return userLevel >= requiredLevel;
};

// Helper to calculate remaining trial days
export const getTrialDaysRemaining = (createdAt: string): number => {
  const created = new Date(createdAt);
  const trialEnd = new Date(created);
  trialEnd.setDate(trialEnd.getDate() + 14);
  const now = new Date();
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

const getContent = (language: string) => ({
  stepTitle: language === 'nl' ? "Stap 2: Kies bewijsniveau" : "Step 2: Choose evidence level",
  professional: "Professional Evidence",
  professionalDesc: language === 'nl' 
    ? "Email verificatie & Tijdstempel" 
    : "Email verification & Timestamp",
  professionalBadge: language === 'nl' ? "Inbegrepen in uw proefperiode" : "Included in your trial",
  legal: "Full Legal Evidence",
  legalDesc: language === 'nl' 
    ? "Biometrische paspoort-check" 
    : "Biometric passport verification",
  legalBadge: language === 'nl' ? "Upgrade vereist" : "Upgrade required",
  trialDays: language === 'nl' ? "dagen over in proefperiode" : "days remaining in trial",
  trialExpired: language === 'nl' ? "Proefperiode verlopen" : "Trial expired",
  upgradeToPro: language === 'nl' ? "Upgrade naar Pro" : "Upgrade to Pro",
  credits: language === 'nl' ? "credits" : "credits",
  costsCredit: language === 'nl' ? "Kost 1 credit" : "Costs 1 credit",
  noCredits: language === 'nl' ? "Geen credits meer. Credits worden maandelijks aangevuld." : "No credits remaining. Credits reset monthly.",
});

interface SecurityLevelSelectorProps {
  value: SecurityLevel;
  onChange: (level: SecurityLevel) => void;
  userPlan: string;
  legalCreditsRemaining?: number;
  onUpgradeClick?: () => void;
  trialDaysRemaining?: number;
  onUpgradeToPro?: () => void;
  onLegalTrialClick?: () => void;
}

export function SecurityLevelSelector({
  value,
  onChange,
  userPlan,
  legalCreditsRemaining = 0,
  onUpgradeClick,
  trialDaysRemaining,
  onUpgradeToPro,
  onLegalTrialClick,
}: SecurityLevelSelectorProps) {
  const { language } = useLanguage();
  const content = getContent(language);
  
  const isTrial = userPlan.toLowerCase() === "trial";
  const isProfessional = userPlan.toLowerCase() === "professional";
  const showUpgradeToLegal = isTrial || isProfessional;

  const handleLevelClick = (levelId: SecurityLevel, hasAccess: boolean, canSelect: boolean) => {
    if (levelId === "eidas_qualified" && !hasAccess && isTrial) {
      // Trial user clicking on Legal - show the trial modal
      onLegalTrialClick?.();
    } else if (canSelect) {
      onChange(levelId);
    } else if (!hasAccess) {
      onUpgradeClick?.();
    }
  };

  return (
    <div className="space-y-3">
      {/* Step Title */}
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
          2
        </div>
        {content.stepTitle}
      </div>

      {/* Trial Status Banner */}
      {isTrial && trialDaysRemaining !== undefined && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {trialDaysRemaining > 0 
                ? `${trialDaysRemaining} ${content.trialDays}`
                : content.trialExpired
              }
            </span>
          </div>
          <Button
            size="sm"
            variant="default"
            className="text-xs h-7 px-3"
            onClick={(e) => {
              e.stopPropagation();
              onUpgradeToPro?.();
            }}
          >
            <ArrowUpRight className="h-3 w-3 mr-1" />
            {content.upgradeToPro}
          </Button>
        </div>
      )}

      <div className="grid gap-2">
        {SECURITY_LEVELS.map((level) => {
          const hasAccess = hasAccessToLevel(userPlan, level.requiredPlan);
          const isSelected = value === level.id;
          const isLegal = level.id === "eidas_qualified";
          const hasCredits = legalCreditsRemaining > 0;
          const canSelect = hasAccess && (!isLegal || hasCredits);
          
          // Show upgrade badge for Legal level if user is on trial or professional
          const showLegalUpgrade = isLegal && !hasAccess && showUpgradeToLegal;

          return (
            <div
              key={level.id}
              onClick={() => handleLevelClick(level.id, hasAccess, canSelect)}
              className={`relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isLegal
                  ? isSelected && canSelect
                    ? "border-amber-400 bg-amber-50/50"
                    : "border-amber-200 bg-amber-50/30 hover:border-amber-300"
                  : isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card/50"
              }`}
            >
              {/* Radio indicator */}
              <div className={`flex items-center justify-center w-5 h-5 mt-0.5 rounded-full border-2 shrink-0 ${
                isSelected && canSelect
                  ? isLegal
                    ? "border-amber-500 bg-amber-500"
                    : "border-primary bg-primary"
                  : "border-muted-foreground/40"
              }`}>
                {isSelected && canSelect && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <level.Icon className={`h-4 w-4 ${isLegal ? "text-amber-600" : "text-primary"}`} />
                  <span className={`font-semibold text-sm ${!canSelect && !showLegalUpgrade ? "text-muted-foreground" : ""}`}>
                    {content[level.labelKey as keyof typeof content] as string}
                  </span>
                  
                  {/* Trial badge for professional */}
                  {!isLegal && isTrial && (
                    <Badge variant="secondary" className="text-[10px] px-2 py-0 bg-primary/10 text-primary border-0">
                      {content.professionalBadge}
                    </Badge>
                  )}
                  
                  {/* Lock icon for Legal if not accessible */}
                  {isLegal && !hasAccess && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0 border-amber-400 text-amber-600 bg-amber-50">
                      <Lock className="h-2.5 w-2.5 mr-1" />
                      {content.legalBadge}
                    </Badge>
                  )}
                  
                  {/* Credits badge for Legal with access */}
                  {isLegal && hasAccess && (
                    <Badge variant={hasCredits ? "secondary" : "destructive"} className="text-[10px] px-2 py-0">
                      <Coins className="h-3 w-3 mr-1" />
                      {legalCreditsRemaining}/10 {content.credits}
                    </Badge>
                  )}
                  
                  {/* Cost badge */}
                  {level.creditCost && hasAccess && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0 border-amber-400/50 text-amber-600">
                      {content.costsCredit}
                    </Badge>
                  )}
                </div>
                <p className={`text-xs mt-1 ${!canSelect && !showLegalUpgrade ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                  {content[level.descriptionKey as keyof typeof content] as string}
                </p>
                
                {isLegal && hasAccess && !hasCredits && (
                  <p className="text-xs text-destructive mt-1">
                    {content.noCredits}
                  </p>
                )}
              </div>
              
              {/* Upgrade button for Legal level */}
              {showLegalUpgrade && (
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 text-xs h-7 px-2 border-amber-400 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isTrial) {
                      onLegalTrialClick?.();
                    } else {
                      onUpgradeClick?.();
                    }
                  }}
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Upgrade
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
