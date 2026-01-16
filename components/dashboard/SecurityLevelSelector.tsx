import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SecurityLevel = "starter" | "professional" | "eidas_qualified";

export interface SecurityLevelOption {
  id: SecurityLevel;
  label: string;
  description: string;
  icon: string;
  requiredPlan: "free" | "starter" | "professional" | "premium" | "enterprise";
}

export const SECURITY_LEVELS: SecurityLevelOption[] = [
  {
    id: "starter",
    label: "Level 1 - Starter",
    description: "End-to-end encryption transfer with 2-factor authentication. Download confirmation by email with IP address, timestamp.",
    icon: "🔐",
    requiredPlan: "free",
  },
  {
    id: "professional",
    label: "Level 2 - Professional",
    description: "End-to-end encryption transfer with 2-factor authentication. Receive a download confirmation by Adobe certified Audit PDF (cannot be modified afterwards) with IP address, timestamp, email used for 2FA.",
    icon: "🔐📄",
    requiredPlan: "professional",
  },
  {
    id: "eidas_qualified",
    label: "Level 3 - eIDAS Qualified",
    description: "QERDS certified delivery with legal certificate",
    icon: "🛡️",
    requiredPlan: "premium",
  },
];

// Plan hierarchy for access checking
const PLAN_HIERARCHY: Record<string, number> = {
  free: 0,
  starter: 1,
  professional: 2,
  premium: 3,
  enterprise: 4,
};

export const hasAccessToLevel = (userPlan: string, requiredPlan: string): boolean => {
  const userLevel = PLAN_HIERARCHY[userPlan.toLowerCase()] ?? 0;
  const requiredLevel = PLAN_HIERARCHY[requiredPlan.toLowerCase()] ?? 0;
  return userLevel >= requiredLevel;
};

interface SecurityLevelSelectorProps {
  value: SecurityLevel;
  onChange: (level: SecurityLevel) => void;
  userPlan: string;
  onUpgradeClick?: () => void;
}

export function SecurityLevelSelector({
  value,
  onChange,
  userPlan,
  onUpgradeClick,
}: SecurityLevelSelectorProps) {
  return (
    <div className="grid gap-2">
      {SECURITY_LEVELS.map((level) => {
        const hasAccess = hasAccessToLevel(userPlan, level.requiredPlan);
        const isSelected = value === level.id;

        return (
          <div
            key={level.id}
            onClick={() => hasAccess && onChange(level.id)}
            className={`relative flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
              !hasAccess
                ? "opacity-50 cursor-not-allowed border-border bg-muted/30"
                : isSelected
                ? "border-primary bg-primary/5 cursor-pointer"
                : "border-border hover:border-primary/50 bg-card/50 cursor-pointer"
            }`}
          >
            <div className={`text-xl ${!hasAccess ? "grayscale" : ""}`}>
              {level.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium text-sm ${!hasAccess ? "text-muted-foreground" : ""}`}>
                  {level.label}
                </span>
                {!hasAccess && (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <div className={`text-xs ${!hasAccess ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                {level.description}
              </div>
            </div>
            
            {isSelected && hasAccess && (
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary" />
            )}
            
            {!hasAccess && (
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 text-xs h-7 px-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpgradeClick?.();
                }}
              >
                Upgrade
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
