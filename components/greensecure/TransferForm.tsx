import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2, Mail, User, Hash, Clock, AlertTriangle, Shield, Lock } from "lucide-react";
import { SendConfirmationModal } from "./SendConfirmationModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TransferFormProps {
  files: File[];
  onSubmit: (data: TransferData) => Promise<void>;
  isUploading: boolean;
  userPlan?: string; // Optional: passed when user is logged in
}

export type SecurityLevel = "starter" | "professional" | "eidas_qualified";

export interface TransferData {
  senderEmail: string;
  recipientEmail: string;
  message: string;
  dossierNumber: string;
  expiryDays: number;
  securityLevel: SecurityLevel;
}

interface SecurityLevelOption {
  id: SecurityLevel;
  label: string;
  description: string;
  icon: string;
  requiredPlan: "free" | "starter" | "professional" | "premium";
}

const SECURITY_LEVELS: SecurityLevelOption[] = [
  {
    id: "starter",
    label: "Level 1 - Standard",
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

const hasAccessToLevel = (userPlan: string, requiredPlan: string): boolean => {
  const userLevel = PLAN_HIERARCHY[userPlan.toLowerCase()] ?? 0;
  const requiredLevel = PLAN_HIERARCHY[requiredPlan.toLowerCase()] ?? 0;
  return userLevel >= requiredLevel;
};

// Public domains that trigger warnings
const PUBLIC_DOMAINS = [
  "gmail.com", "hotmail.com", "outlook.com", "live.nl", "live.com",
  "yahoo.com", "yahoo.nl", "icloud.com", "protonmail.com", "proton.me",
  "aol.com", "msn.com", "ziggo.nl", "kpnmail.nl", "xs4all.nl",
];

const isPublicDomain = (email: string): boolean => {
  const domain = email.split("@")[1]?.toLowerCase();
  return PUBLIC_DOMAINS.includes(domain);
};

export const TransferForm = ({ files, onSubmit, isUploading, userPlan = "free" }: TransferFormProps) => {
 const router = useRouter();
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [dossierNumber, setDossierNumber] = useState("");
  const [expiryDays, setExpiryDays] = useState("7");
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>("starter");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open confirmation modal instead of submitting directly
    setShowConfirmModal(true);
  };

  const handleConfirmedSubmit = async () => {
    await onSubmit({ 
      senderEmail, 
      recipientEmail, 
      message, 
      dossierNumber,
      expiryDays: parseInt(expiryDays),
      securityLevel,
    });
    setShowConfirmModal(false);
  };

  const isValid = 
    senderEmail.includes("@") && 
    recipientEmail.includes("@") && 
    files.length > 0 &&
    acceptedTerms;

  const showPublicDomainWarning = recipientEmail.includes("@") && isPublicDomain(recipientEmail);

  return (
    <>
      <Card className="p-6 glass-card-strong">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sender & Recipient Emails */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sender" className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Your email
              </Label>
              <Input
                id="sender"
                type="email"
                placeholder="your@email.com"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Recipient email
              </Label>
              <Input
                id="recipient"
                type="email"
                placeholder="recipient@email.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
                className={`bg-background/50 ${showPublicDomainWarning ? "border-amber-400" : ""}`}
              />
              {/* Public Domain Warning */}
              {showPublicDomainWarning && (
                <div className="flex items-center gap-2 p-2 rounded bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Warning: Sending to a public email provider
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Security Level Selector */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Security Level
            </Label>
            <div className="grid gap-2">
              {SECURITY_LEVELS.map((level) => {
                const hasAccess = hasAccessToLevel(userPlan, level.requiredPlan);
                const isSelected = securityLevel === level.id;

                return (
                  <div
                    key={level.id}
                    onClick={() => hasAccess && setSecurityLevel(level.id)}
                    className={`relative flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                      !hasAccess
                        ? "opacity-50 cursor-not-allowed border-border bg-muted/30"
                        : isSelected
                        ? "border-primary bg-primary/5 cursor-pointer"
                        : "border-border hover:border-primary/50 bg-background/50 cursor-pointer"
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
                          router.push("/signup-pro");
                        }}
                      >
                        Upgrade
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dossier Number & Expiry */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dossier" className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                Dossier number (optional)
              </Label>
              <Input
                id="dossier"
                type="text"
                placeholder="e.g., 2024-001234"
                value={dossierNumber}
                onChange={(e) => setDossierNumber(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Available for
              </Label>
              <Select value={expiryDays} onValueChange={setExpiryDays}>
                <SelectTrigger id="expiry" className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a message for the recipient..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="bg-background/50 resize-none"
            />
          </div>

          {/* Auto-delete notice */}
          <div className="text-center text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
            📁 Documents will be <span className="font-medium text-foreground">automatically deleted</span> after {expiryDays} days
          </div>

          {/* Terms of Service Checkbox */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              // onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
              I agree to the{" "}
              <Link 
                href="/terms" 
                target="_blank"
                className="text-primary hover:underline font-medium"
              >
                terms of service
              </Link>
            </Label>
          </div>

          <Button
            type="submit" 
            size="lg" 
            className="w-full bg-primary hover:bg-primary-glow"
            disabled={!isValid || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Review & Send {files.length} file(s)
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Confirmation Modal */}
      <SendConfirmationModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        recipients={[{ email: recipientEmail }]}
        files={files}
        dossierNumber={dossierNumber || undefined}
        onConfirm={handleConfirmedSubmit}
        isLoading={isUploading}
      />
    </>
  );
};
