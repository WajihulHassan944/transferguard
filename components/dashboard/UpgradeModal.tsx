import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, FileCheck, Check } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: "storage" | "file_size";
}

const upgradeReasons = {
  storage: {
    title: "Storage Limit Reached",
    description: "You've reached your storage limit. Upgrade to Professional for 2 TB of secure storage.",
    icon: Crown,
  },
  file_size: {
    title: "File Too Large",
    description: "Your file exceeds the 10 GB limit. Upgrade to Professional for files up to 50 GB.",
    icon: Crown,
  },
};

const proFeatures = [
  "Adobe Certified PDF audit trail",
  "2 TB secure storage",
  "50 GB max file size",
  "Priority support",
  "Anti-tamper seal with timestamp",
];

export function UpgradeModal({ open, onOpenChange, reason = "storage" }: UpgradeModalProps) {
  const reasonData = upgradeReasons[reason];
  const ReasonIcon = reasonData.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ReasonIcon className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">{reasonData.title}</DialogTitle>
          <DialogDescription className="text-base">
            {reasonData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-5 w-5 text-primary" />
            <span className="font-semibold">Professional Plan - €35/month</span>
          </div>
          <ul className="space-y-2">
            {proFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/signup/pro?plan=professional">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Professional
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
