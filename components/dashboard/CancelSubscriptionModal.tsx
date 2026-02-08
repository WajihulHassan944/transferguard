import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  Shield, 
  Scale, 
  FileCheck, 
  Lock, 
  Clock,
  Users,
  Palette,
  X,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface CancelSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
  onConfirmCancel: () => void;
}

interface FeatureLoss {
  icon: React.ElementType;
  title: string;
  description: string;
}

const getLostFeatures = (currentPlan: string): FeatureLoss[] => {
  const planLower = currentPlan.toLowerCase();
  
  if (planLower === "premium" || planLower === "legal") {
    return [
      {
        icon: Scale,
        title: "QERDS Legal Certificates",
        description: "EU-recognized legal proof with reversed burden of proof",
      },
      {
        icon: FileCheck,
        title: "Adobe Certified PDF Reports",
        description: "Tamper-proof audit trail with digital signatures",
      },
      {
        icon: Lock,
        title: "Blockchain Anchoring",
        description: "Immutable proof of delivery timestamp",
      },
      {
        icon: Shield,
        title: "3 TB Secure Storage",
        description: "Your files will be reduced to 2 GB limit",
      },
      {
        icon: Users,
        title: "Team Collaboration",
        description: "Shared workspaces and team management",
      },
      {
        icon: Palette,
        title: "Custom Branding",
        description: "White-label client portals with your logo",
      },
    ];
  }
  
  if (planLower === "professional" || planLower === "trial") {
    return [
      {
        icon: FileCheck,
        title: "Adobe Certified PDF Reports",
        description: "Tamper-proof audit trail with digital signatures",
      },
      {
        icon: Shield,
        title: "2 TB Secure Storage",
        description: "Your files will be reduced to 2 GB limit",
      },
      {
        icon: Clock,
        title: "2-Factor Authentication",
        description: "Email verification for secure downloads",
      },
      {
        icon: Palette,
        title: "Custom Branding",
        description: "White-label client portals with your logo",
      },
    ];
  }
  
  return [];
};

const getPlanDisplayName = (plan: string): string => {
  const planLower = plan.toLowerCase();
  if (planLower === "premium" || planLower === "legal") return "Legal";
  if (planLower === "professional") return "Professional";
  if (planLower === "trial") return "Professional Trial";
  return "Free";
};

export function CancelSubscriptionModal({ 
  open, 
  onOpenChange, 
  currentPlan,
  onConfirmCancel 
}: CancelSubscriptionModalProps) {
  const [step, setStep] = useState<"features" | "confirm">("features");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const lostFeatures = getLostFeatures(currentPlan);
  const planName = getPlanDisplayName(currentPlan);
  const isLegalPlan = currentPlan.toLowerCase() === "premium" || currentPlan.toLowerCase() === "legal";

  const handleClose = () => {
    setStep("features");
    onOpenChange(false);
  };

  const handleConfirmCancel = async () => {
    setIsProcessing(true);
    try {
      await onConfirmCancel();
      toast.success("Your subscription has been cancelled");
      handleClose();
    } catch (error) {
      toast.error("Failed to cancel subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {step === "features" ? (
          <>
            <DialogHeader className="text-center pb-2">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
              <DialogTitle className="text-xl">
                Are you sure you want to cancel?
              </DialogTitle>
              <DialogDescription className="text-base">
                You'll lose access to these features at the end of your billing period:
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {lostFeatures.map((feature) => (
                <div 
                  key={feature.title}
                  className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <feature.icon className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <X className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
                      <span className="font-medium text-sm">{feature.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleClose}
              >
                {isLegalPlan ? (
                  <>
                    <Scale className="h-4 w-4 mr-2" />
                    Keep my Legal Plan
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Keep my {planName} Plan
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setStep("confirm")}
              >
                Continue to cancel
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="text-center pb-2">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <DialogTitle className="text-xl">
                Final confirmation
              </DialogTitle>
              <DialogDescription className="text-base">
                This action cannot be undone. You will lose access to all {planName} features immediately.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 p-4 bg-muted/50 rounded-xl text-center">
              <p className="text-sm text-muted-foreground">
                Your account will be downgraded to the <strong>Free plan</strong> with limited features.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                You can upgrade again anytime from your dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleClose}
              >
                {isLegalPlan ? (
                  <>
                    <Scale className="h-4 w-4 mr-2" />
                    I want to keep my Legal Plan
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    I want to keep my {planName} Plan
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground/70 hover:text-muted-foreground text-xs"
                onClick={handleConfirmCancel}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Yes, cancel my subscription"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
