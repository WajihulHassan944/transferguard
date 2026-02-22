import { Lock, Fingerprint, Mail, Smartphone, LucideIcon, Coins, ArrowUpRight, Clock, Sparkles, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export type SecurityLevel = "email" | "sms" | "email_sms" | "id_verification";

export interface SecurityLevelOption {
  id: SecurityLevel;
  labelKey: string;
  descriptionKey: string;
  Icon: LucideIcon;
  requiredPlan: "free" | "professional" | "premium";
  creditCost?: number;
}

export const SECURITY_LEVELS: SecurityLevelOption[] = [
  {
    id: "email",
    labelKey: "emailLabel",
    descriptionKey: "emailDesc",
    Icon: Mail,
    requiredPlan: "free",
  },
  {
    id: "sms",
    labelKey: "smsLabel",
    descriptionKey: "smsDesc",
    Icon: Smartphone,
    requiredPlan: "professional",
  },
  {
    id: "email_sms",
    labelKey: "emailSmsLabel",
    descriptionKey: "emailSmsDesc",
    Icon: MailCheck,
    requiredPlan: "professional",
  },
  {
    id: "id_verification",
    labelKey: "legalLabel",
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
  trial: 2, // Trial has Email 2FA + PDF access, but SMS is limited to 5 credits
  pro: 2,
  professional: 2,
  premium: 3,
  legal: 3,
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
  sectionTitle: language === 'nl' ? "Verificatiemethode" : "Verification Method",
  emailLabel: language === 'nl' ? "E-mailverificatie" : "Email Verification",
  emailDesc: language === 'nl' ? "Ontvanger verifieert via e-mail" : "Recipient verifies via email",
  emailEvidence: language === 'nl' ? "Basis bewijskracht — e-mailbevestiging van ontvangst" : "Basic strength of evidence — email confirmation of receipt",
  emailBadge: language === 'nl' ? "Secure Transfer" : "Secure Transfer",
  smsLabel: language === 'nl' ? "SMS verificatie" : "SMS Verification",
  smsDesc: language === 'nl' ? "Ontvanger verifieert via SMS code" : "Recipient verifies via SMS code",
  smsEvidence: language === 'nl' ? "Sterke bewijskracht — bewijs van identiteit via telefoonnummer" : "Strong strength of evidence — proof of identity via phone number",
  smsBadge: language === 'nl' ? "Certified Delivery & Verified Identity" : "Certified Delivery & Verified Identity",
  emailSmsLabel: language === 'nl' ? "E-mail + SMS verificatie" : "Email + SMS Verification",
  emailSmsDesc: language === 'nl' ? "Dubbele verificatie via e-mail én SMS" : "Dual verification via email and SMS",
  emailSmsEvidence: language === 'nl' ? "Sterke bewijskracht — bewijs van identiteit via e-mail én telefoonnummer" : "Strong strength of evidence — proof of identity via email and phone number",
  emailSmsBadge: language === 'nl' ? "Certified Delivery & Verified Identity" : "Certified Delivery & Verified Identity",
  smsUpgradeText: language === 'nl' 
    ? "Beschikbaar bij Certified Delivery (trial: 5 SMS-credits inbegrepen)" 
    : "Available with Certified Delivery (trial: 5 SMS credits included)",
  legalLabel: language === 'nl' ? "ID check + Biometrische verificatie" : "ID Check + Biometric Verification",
  legalDesc: language === 'nl' 
    ? "Onweerlegbaar bewijs via paspoort & biometrische match" 
    : "Irrefutable proof via passport & biometric match",
  legalEvidence: language === 'nl' ? "Maximale bewijskracht — onweerlegbare identificatie van de ontvanger" : "Maximum evidence — irrefutable identification of recipient",
  legalBadge: language === 'nl' ? "Alleen Verified Identity" : "Verified Identity Only",
  legalUpgradeText: language === 'nl' 
    ? "Exclusief beschikbaar bij het Verified Identity abonnement" 
    : "Exclusively available with the Verified Identity plan",
  legalNote: language === 'nl'
    ? "ID verificatie vervangt e-mail en SMS verificatie — deze worden niet gecombineerd."
    : "ID verification replaces email and SMS verification — these are not combined.",
  included: language === 'nl' ? "Inbegrepen" : "Included",
  trialDays: language === 'nl' ? "dagen over in proefperiode" : "days remaining in trial",
  trialExpired: language === 'nl' ? "Proefperiode verlopen" : "Trial expired",
  upgradeNow: language === 'nl' ? "Upgrade nu" : "Upgrade now",
  upgradeToPro: language === 'nl' ? "Activeer Certified Delivery" : "Activate Certified Delivery",
  upgradeToLegal: language === 'nl' ? "Activeer Verified Identity" : "Activate Verified Identity",
  unlockSms: language === 'nl' 
    ? "Activeer SMS verificatie met een Certified Delivery of Verified Identity abonnement" 
    : "Unlock SMS verification with a Certified Delivery or Verified Identity plan",
  unlockLegal: language === 'nl' 
    ? "Ontgrendel de hoogste bewijskracht met het Verified Identity abonnement" 
    : "Unlock the highest level of evidence with the Verified Identity plan",
  credits: language === 'nl' ? "credits" : "credits",
  costsCredit: language === 'nl' ? "Kost 1 credit" : "Costs 1 credit",
  noCredits: language === 'nl' ? "Geen credits meer" : "No credits remaining",
  buyCredits: language === 'nl' ? "Credits kopen" : "Buy credits",
  strongestProof: language === 'nl' ? "Sterkste juridische bewijskracht" : "Strongest legal strength of evidence",
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
  onBuyCreditsClick?: () => void;
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
  onBuyCreditsClick,
}: SecurityLevelSelectorProps) {
  const { language } = useLanguage();
  const content = getContent(language);
  
  const normalizedPlan = userPlan.toLowerCase();
  const isTrial = normalizedPlan === "trial";
  const isProfessional = normalizedPlan === "professional" || normalizedPlan === "pro";
  const isLegalPlan = normalizedPlan === "legal" || normalizedPlan === "premium";

  const handleLevelClick = (levelId: SecurityLevel, hasAccess: boolean, canSelect: boolean) => {
    if (canSelect) {
      onChange(levelId);
    } else if ((levelId === "sms" || levelId === "email_sms") && !hasAccess) {
      onUpgradeToPro?.();
    } else if (levelId === "id_verification" && !hasAccess && isTrial) {
      onLegalTrialClick?.();
    } else if (!hasAccess) {
      onUpgradeClick?.();
    }
  };

  return (
    <div className="space-y-1.5">
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
            {content.upgradeNow}
          </Button>
        </div>
      )}

      <div className="grid gap-1.5">
        {SECURITY_LEVELS.map((level) => {
          const hasAccess = hasAccessToLevel(userPlan, level.requiredPlan);
          const isSelected = value === level.id;
          const isEmail = level.id === "email";
          const isSms = level.id === "sms";
          const isEmailSms = level.id === "email_sms";
          const isLegal = level.id === "id_verification";
          const hasCredits = legalCreditsRemaining > 0;
          const canSelect = hasAccess;
          
          // Who sees upgrade buttons
          const showSmsUpgrade = (isSms || isEmailSms) && !hasAccess;
          const showLegalUpgrade = isLegal && !isLegalPlan;

          return (
            <div
              key={level.id}
              onClick={() => handleLevelClick(level.id, hasAccess, canSelect)}
              className={`relative flex items-start gap-2.5 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                isLegal
                  ? isSelected && canSelect
                    ? "border-emerald-300/70 bg-emerald-50/30"
                    : showLegalUpgrade 
                      ? "border-emerald-100/80 bg-emerald-50/10 hover:border-emerald-200/60"
                      : "border-emerald-100 bg-emerald-50/10 hover:border-emerald-200/60"
                  : isSelected && canSelect
                    ? "border-primary bg-primary/5"
                    : showSmsUpgrade
                      ? "border-border/60 bg-muted/30 hover:border-primary/30"
                      : "border-border hover:border-primary/50 bg-card/50"
              }`}
            >
              {/* Radio indicator */}
              <div className={`flex items-center justify-center w-5 h-5 mt-0.5 rounded-full border-2 shrink-0 ${
                isSelected && canSelect
                  ? isLegal
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-primary bg-primary"
                  : "border-muted-foreground/40"
              }`}>
                {isSelected && canSelect && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <level.Icon className={`h-4 w-4 ${
                    (showSmsUpgrade || showLegalUpgrade) ? "text-muted-foreground/50" : isLegal ? "text-emerald-600" : "text-primary"
                  }`} />
                  <span className={`font-semibold text-sm ${
                    (showSmsUpgrade || showLegalUpgrade) ? "text-muted-foreground/50" : ""
                  }`}>
                    {content[level.labelKey as keyof typeof content] as string}
                  </span>
                  
                  {/* Email: Standard badge */}
                  {isEmail && (
                    <Badge variant="secondary" className="text-[10px] px-2 py-0 bg-primary/10 text-primary border-0">
                      {content.emailBadge}
                    </Badge>
                  )}

                  {/* SMS / Email+SMS: Plan badge for paid users */}
                  {(isSms || isEmailSms) && hasAccess && (
                    <Badge variant="secondary" className="text-[10px] px-2 py-0 bg-primary/10 text-primary border-0">
                      {isSms ? content.smsBadge : content.emailSmsBadge}
                    </Badge>
                  )}
                  
                  {/* SMS / Email+SMS: Lock badge for trial users */}
                  {(isSms || isEmailSms) && !hasAccess && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0 border-primary/30 text-primary/70 bg-primary/5">
                      <Lock className="h-2.5 w-2.5 mr-1" />
                      {isSms ? content.smsBadge : content.emailSmsBadge}
                    </Badge>
                  )}
                  
                  {/* Legal: Lock badge for non-legal users */}
                  {isLegal && !isLegalPlan && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0 border-emerald-200 text-emerald-600/80 bg-emerald-50/30">
                      <Lock className="h-2.5 w-2.5 mr-1" />
                      {content.legalBadge}
                    </Badge>
                  )}
                  
                  {/* Credits badge - ONLY for Legal plan users with access */}
                  {isLegal && isLegalPlan && hasCredits && (
                    <Badge variant="secondary" className="text-[10px] px-2 py-0">
                      <Coins className="h-3 w-3 mr-1" />
                      {legalCreditsRemaining}/10 {content.credits}
                    </Badge>
                  )}
                </div>
                
                <p className={`text-xs mt-1 ${
                  (showSmsUpgrade || showLegalUpgrade) ? "text-muted-foreground/40" : "text-muted-foreground"
                }`}>
                  {content[level.descriptionKey as keyof typeof content] as string}
                </p>
                
                {/* Evidence strength indicator */}
                <p className={`text-[11px] mt-0.5 italic hidden sm:block ${
                  (showSmsUpgrade || showLegalUpgrade) ? "text-muted-foreground/40" : isLegal ? "text-emerald-600/70" : "text-primary/60"
                }`}>
                  {isEmail && content.emailEvidence}
                  {isSms && content.smsEvidence}
                  {isEmailSms && content.emailSmsEvidence}
                  {isLegal && content.legalEvidence}
                </p>

                {/* Note: ID verification replaces email/sms */}
                {isLegal && isSelected && canSelect && (
                  <p className="text-[11px] mt-1.5 text-emerald-600/70 bg-emerald-50/30 border border-emerald-100 rounded px-2 py-1">
                    {content.legalNote}
                  </p>
                )}
                
                {/* SMS upgrade prompt for trial users */}
                {showSmsUpgrade && isSms && (
                  <div className="mt-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs text-primary/80 mb-2">
                      {content.smsUpgradeText}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 px-3 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
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

                {/* Legal upgrade prompt for trial & professional users */}
                {showLegalUpgrade && (
                  <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/30 border border-emerald-100">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-600">
                        {content.strongestProof}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {content.legalUpgradeText}
                    </p>
                    <Button
                      size="sm"
                      className="text-xs h-7 px-3 bg-emerald-500 hover:bg-emerald-600 text-white border-0"
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
                      {content.upgradeToLegal}
                    </Button>
                  </div>
                )}

                {/* No credits warning - ONLY for Legal plan users */}
                {isLegal && isLegalPlan && !hasCredits && (
                  <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/30 border border-emerald-100">
                    <p className="text-xs text-muted-foreground mb-2">
                      {content.noCredits}
                    </p>
                    <Button
                      size="sm"
                      className="text-xs h-7 px-3 bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuyCreditsClick?.();
                      }}
                    >
                      <Coins className="h-3 w-3 mr-1" />
                      {content.buyCredits}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
