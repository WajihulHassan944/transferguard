import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Shield, 
  Scale, 
  Check, 
  ArrowUpRight,
  Calendar,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { CancelSubscriptionModal } from "./CancelSubscriptionModal";
import { DowngradeModal } from "./DowngradeModal";
import { getTrialDaysRemaining } from "./SecurityLevelSelector";
import { toast } from "sonner";

interface SubscriptionPanelProps {
  userId: string;
}

interface PlanInfo {
  name: string;
  displayName: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  price: string;
}

const PLANS: Record<string, PlanInfo> = {
  free: {
    name: "free",
    displayName: "Free",
    icon: Shield,
    color: "text-muted-foreground",
    features: ["5 transfers total", "2 GB storage", "Basic email notifications"],
    price: "€0",
  },
  trial: {
    name: "trial",
    displayName: "Professional Trial",
    icon: Crown,
    color: "text-emerald-600",
    features: [
      "Unlimited transfers",
      "2 TB storage",
      "Adobe Certified PDF reports",
      "2-Factor Authentication",
      "Custom branding",
    ],
    price: "€0 (14 days)",
  },
  professional: {
    name: "professional",
    displayName: "Professional",
    icon: Shield,
    color: "text-primary",
    features: [
      "Unlimited transfers",
      "2 TB storage",
      "Adobe Certified PDF reports",
      "2-Factor Authentication",
      "Custom branding",
      "Priority support",
    ],
    price: "€39/month",
  },
  premium: {
    name: "premium",
    displayName: "Legal",
    icon: Scale,
    color: "text-amber-600",
    features: [
      "Everything in Professional",
      "3 TB storage",
      "10 ID verifications/month",
      "Biometric identity check",
      "Identity-verified delivery",
      "Legal evidence package",
    ],
    price: "€79/month excl. VAT",
  },
  legal: {
    name: "legal",
    displayName: "Legal",
    icon: Scale,
    color: "text-amber-600",
    features: [
      "Everything in Professional",
      "3 TB storage",
      "10 ID verifications/month",
      "Biometric identity check",
      "Identity-verified delivery",
      "Legal evidence package",
    ],
    price: "€79/month excl. VAT",
  },
};

export function SubscriptionPanel({ userId }: SubscriptionPanelProps) {
  const [userPlan, setUserPlan] = useState<string>("free");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [loading, setLoading] = useState(true);


  const planInfo = PLANS[userPlan.toLowerCase()] || PLANS.free;
  const PlanIcon = planInfo.icon;
  const isTrial = userPlan.toLowerCase() === "trial";
  const isPaidPlan = ["professional", "premium", "legal"].includes(userPlan.toLowerCase());
  const isLegalPlan = ["premium", "legal"].includes(userPlan.toLowerCase());
  const trialDaysRemaining = isTrial && createdAt ? getTrialDaysRemaining(createdAt) : null;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Subscription</h2>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      {/* Current Plan Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              planInfo.color === "text-amber-600" ? "bg-amber-500/10" :
              planInfo.color === "text-primary" ? "bg-primary/10" :
              planInfo.color === "text-emerald-600" ? "bg-emerald-500/10" :
              "bg-muted"
            }`}>
              <PlanIcon className={`h-6 w-6 ${planInfo.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{planInfo.displayName}</h3>
                {isTrial && (
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    Trial
                  </Badge>
                )}
                {isPaidPlan && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold mt-1">{planInfo.price}</p>
              {isTrial && trialDaysRemaining !== null && (
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className={trialDaysRemaining <= 3 ? "text-amber-600 font-medium" : "text-muted-foreground"}>
                    {trialDaysRemaining > 0 
                      ? `${trialDaysRemaining} days remaining`
                      : "Trial expired"
                    }
                  </span>
                </div>
              )}
            </div>
          </div>

          {(isTrial || isPaidPlan) && (
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel subscription
            </Button>
          )}
        </div>

        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-medium mb-3">Your plan includes:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {planInfo.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Downgrade Option for Legal users */}
      {isLegalPlan && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Change your plan</h3>
          <Card className="p-5 border-primary/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Professional</h4>
                  <p className="text-sm text-muted-foreground">€39/month excl. VAT</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDowngradeModal(true)}
              >
                Downgrade
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Keep Adobe Certified proof reports but without QERDS legal certificates.
            </p>
          </Card>
        </div>
      )}

      {/* Upgrade Options */}
      {(userPlan.toLowerCase() === "free" || isTrial || userPlan.toLowerCase() === "professional") && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upgrade your plan</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Professional Card */}
            {(userPlan.toLowerCase() === "free" || isTrial) && (
              <Card className="p-5 border-primary/20 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Professional</h4>
                    <p className="text-sm text-muted-foreground">€39/month excl. VAT</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Adobe Certified proof reports with 2FA verification.
                </p>
                <Button className="w-full" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Upgrade to Professional
                </Button>
              </Card>
            )}

            {/* Legal Card */}
            <Card className="p-5 border-amber-500/20 hover:border-amber-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Legal</h4>
                  <p className="text-sm text-muted-foreground">€79/month excl. VAT</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                QERDS certified delivery with legal certificates.
              </p>
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white" 
                size="sm"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Upgrade to Legal
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Billing Info */}
      {isPaidPlan && (
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Billing</h3>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Payment methods will be available after Stripe integration
              </span>
            </div>
          </div>
        </Card>
      )}

      <CancelSubscriptionModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        currentPlan={userPlan}
        onConfirmCancel={()=> console.log("cancel")}
      />

      {/* <DowngradeModal
        open={showDowngradeModal}
        onOpenChange={setShowDowngradeModal}
        onConfirmDowngrade={handleDowngradeToProfessional}
      /> */}
    </div>
  );
}
