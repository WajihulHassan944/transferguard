import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Mail, Phone, Shield, Send, FileText } from "lucide-react";

interface Recipient {
  email: string;
  phone?: string;
}

interface SendConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipients: Recipient[];
  files: File[];
  dossierNumber?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

// Public email domains that trigger a warning
const PUBLIC_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "live.nl",
  "live.com",
  "yahoo.com",
  "yahoo.nl",
  "icloud.com",
  "protonmail.com",
  "proton.me",
  "aol.com",
  "msn.com",
  "ziggo.nl",
  "kpnmail.nl",
  "xs4all.nl",
  "hetnet.nl",
  "upcmail.nl",
];

const isPublicDomain = (email: string): boolean => {
  const domain = email.split("@")[1]?.toLowerCase();
  return PUBLIC_DOMAINS.includes(domain);
};

export function SendConfirmationModal({
  open,
  onOpenChange,
  recipients,
  files,
  dossierNumber,
  onConfirm,
  isLoading = false,
}: SendConfirmationModalProps) {
  const [verified, setVerified] = useState(false);

  const hasPublicDomain = recipients.some((r) => isPublicDomain(r.email));
  const totalFileSize = files.reduce((acc, f) => acc + f.size, 0);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const handleConfirm = () => {
    if (verified) {
      onConfirm();
      setVerified(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setVerified(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Confirm Recipients
          </DialogTitle>
          <DialogDescription>
            Please verify the recipient details before sending sensitive documents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Public Domain Warning */}
          {hasPublicDomain && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Public Email Provider Detected
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  You are sending sensitive data to a public email provider (e.g., Gmail, Hotmail). 
                  Consider using a business email address for confidential documents.
                </p>
              </div>
            </div>
          )}

          {/* Dossier Number */}
          {dossierNumber && (
            <div className="flex items-center gap-2 p-2 rounded bg-muted">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Dossier: <strong>{dossierNumber}</strong>
              </span>
            </div>
          )}

          {/* Files Summary */}
          <div className="p-3 rounded-lg border bg-card">
            <p className="text-sm font-medium mb-2">Files to send:</p>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <span>{formatFileSize(file.size)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
              Total: {files.length} file(s), {formatFileSize(totalFileSize)}
            </div>
          </div>

          {/* Recipients List */}
          <div className="p-3 rounded-lg border bg-card">
            <p className="text-sm font-medium mb-2">Recipients:</p>
            <div className="space-y-2">
              {recipients.map((recipient, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded bg-muted/50"
                >
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{recipient.email}</p>
                    {recipient.phone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {recipient.phone}
                      </p>
                    )}
                  </div>
                  {isPublicDomain(recipient.email) && (
                    <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
                      Public
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Verification Checkbox */}
          <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-primary/30 bg-primary/5">
            <Checkbox
              id="verify-recipients"
              checked={verified}
              onCheckedChange={(checked) => setVerified(checked === true)}
              className="mt-0.5"
            />
            <Label
              htmlFor="verify-recipients"
              className="text-sm cursor-pointer leading-relaxed"
            >
              <strong>I verify that these recipients are correct</strong> and I confirm 
              that I want to send these confidential documents to the listed email addresses.
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!verified || isLoading}>
            {isLoading ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Confirm & Send
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}