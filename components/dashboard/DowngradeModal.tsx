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
  Shield, 
  Scale, 
  Check,
  X,
  ArrowDown
} from "lucide-react";
import { toast } from "sonner";

interface DowngradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDowngrade: () => Promise<void>;
}

const keepFeatures = [
  "Unlimited transfers",
  "2 TB storage",
  "Adobe Certified PDF reports",
  "2-Factor Authentication",
  "Custom branding",
  "Priority support",
];

const loseFeatures = [
  "QERDS legal certificates",
  "10 QERDS credits/month",
  "Blockchain anchoring",
  "eIDAS qualified delivery",
  "1 TB extra storage",
];

export function DowngradeModal({ 
  open, 
  onOpenChange, 
  onConfirmDowngrade 
}: DowngradeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleConfirmDowngrade = async () => {
    setIsProcessing(true);
    try {
      await onConfirmDowngrade();
      handleClose();
    } catch (error) {
      toast.error("Failed to downgrade subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Scale className="h-6 w-6 text-amber-600" />
            </div>
            <ArrowDown className="h-5 w-5 text-muted-foreground" />
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl">
            Downgrade to Professional
          </DialogTitle>
          <DialogDescription className="text-base">
            You'll save €40/month but lose access to legal certificates.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {/* What you keep */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              What you keep
            </h4>
            <ul className="space-y-2">
              {keepFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What you lose */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2 text-muted-foreground">
              <X className="h-4 w-4" />
              What you'll lose
            </h4>
            <ul className="space-y-2">
              {loseFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-xs">
                  <X className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <p className="text-sm text-amber-700">
            <strong>Note:</strong> Any unused QERDS credits will be lost at the end of the billing period.
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <Button 
            size="lg" 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleClose}
          >
            <Scale className="h-4 w-4 mr-2" />
            Keep my Legal Plan
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-muted-foreground"
            onClick={handleConfirmDowngrade}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm downgrade to Professional"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
