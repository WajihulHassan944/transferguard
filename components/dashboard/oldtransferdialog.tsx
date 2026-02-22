"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { baseUrl } from "@/const";
import { handleMultipartSubmit } from "./encrypt/multipartUpload";

import { Switch } from "@/components/ui/switch";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload, 
  X, 
  File as FileIcon, 
  FileText, 
  Image, 
  Video, 
  Music,
  Mail,
  Shield,
  FileCheck,
  AlertTriangle,
  Hash,
  Send,
  Lock,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { SecurityLevelSelector, SecurityLevel } from "./SecurityLevelSelector";
import { UpgradeModal } from "./UpgradeModal";
import { WorkerPool } from "./encrypt/workerPool";
import { useLanguage } from "@/contexts/LanguageContext";

interface MultipartInitPayload {
  uploadId: string;
  key: string;
}


interface NewTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
  onTransferCreated: () => void;
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024 * 1024; // 10GB

const PUBLIC_DOMAINS = [
  "gmail.com", "hotmail.com", "outlook.com", "live.nl", "live.com",
  "yahoo.com", "yahoo.nl", "icloud.com", "protonmail.com", "mail.com"
];

const isPublicDomain = (email: string) => {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? PUBLIC_DOMAINS.includes(domain) : false;
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.startsWith("video/")) return Video;
  if (mimeType.startsWith("audio/")) return Music;
  if (mimeType.includes("pdf") || mimeType.includes("document")) return FileText;
  return FileIcon;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
const getContent = (language: string) => ({
  title: language === 'nl' ? "Nieuwe Beveiligde Overdracht" : "New Secure Transfer",
  files: language === 'nl' ? "Bestanden" : "Files",
  dropzone: language === 'nl' ? "Sleep bestanden hierheen of klik om te bladeren" : "Drop files here or click to browse",
  maxSize: language === 'nl' ? "Max" : "Max",
  perTransfer: language === 'nl' ? "per overdracht" : "per transfer",
  total: language === 'nl' ? "Totaal" : "Total",
  recipientEmail: language === 'nl' ? "E-mailadres Ontvanger" : "Recipient Email",
  recipientPlaceholder: language === 'nl' ? "ontvanger@bedrijf.nl" : "recipient@company.com",
  publicWarning: language === 'nl' ? "Let op: Je verstuurt naar een openbaar e-mailadres." : "Warning: You are sending to a public email provider.",
  dossierNumber: language === 'nl' ? "Dossiernummer (optioneel)" : "Dossier Number (optional)",
  dossierPlaceholder: language === 'nl' ? "bijv. 2024-001234" : "e.g., 2024-001234",
  securityLevel: language === 'nl' ? "Beveiligingsniveau" : "Security Level",
  availableFor: language === 'nl' ? "Beschikbaar voor" : "Available for",
  days1: language === 'nl' ? "1 dagen" : "1 day",
  days7: language === 'nl' ? "7 dagen" : "7 days",
  days30: language === 'nl' ? "30 dagen" : "30 days",
  days90: language === 'nl' ? "90 dagen" : "90 days",
  message: language === 'nl' ? "Bericht (optioneel)" : "Message (optional)",
  messagePlaceholder: language === 'nl' ? "Voeg een bericht toe voor de ontvanger..." : "Add a message for the recipient...",
  cancel: language === 'nl' ? "Annuleren" : "Cancel",
  sendTransfer: language === 'nl' ? "Verstuur Overdracht" : "Send Transfer",
  creating: language === 'nl' ? "Aanmaken..." : "Creating...",
  filesAdded: language === 'nl' ? "bestand(en) toegevoegd" : "file(s) added",
  sizeLimitExceeded: language === 'nl' ? "Totale grootte overschrijdt de limiet voor je abonnement" : "Total size exceeds limit for your plan",
  fillRequired: language === 'nl' ? "Vul het e-mailadres van de ontvanger in en selecteer bestanden" : "Please fill in recipient email and select files",
  transferSuccess: language === 'nl' ? "Overdracht aangemaakt! Downloadlink gekopieerd naar klembord." : "Transfer created! Download link copied to clipboard.",
  transferFailed: language === 'nl' ? "Overdracht aanmaken mislukt" : "Failed to create transfer",
  transferLimitReached: language === 'nl' ? "Transferlimiet bereikt" : "Transfer limit reached",
  transfersUsed: language === 'nl' ? "Transfers gebruikt" : "Transfers used",
  upgrade: language === 'nl' ? "Upgraden" : "Upgrade",
  insufficientCredits: language === 'nl' ? "Onvoldoende credits" : "Insufficient credits",
  teamRequired: language === 'nl' ? "Je hebt een team nodig met ID verificatie credits om Legal transfers te versturen." : "You need a team with ID verification credits to send Legal transfers.",
  noCredits: language === 'nl' ? "Je team heeft geen QERDS credits meer. Koop extra credits om Legal transfers te versturen." : "Your team has no QERDS credits left. Purchase more to send Legal transfers.",
  creditError: language === 'nl' ? "Kon credit niet afschrijven. Probeer het opnieuw." : "Could not deduct credit. Please try again.",
  e2ee: {
    label: language === 'nl' ? "End-to-End Encryptie (E2EE)" : "End-to-End Encryption (E2EE)",
    description: language === 'nl' 
      ? "Extra beveiliging waarbij bestanden versleuteld worden voordat ze je apparaat verlaten." 
      : "Extra security where files are encrypted before leaving your device.",
    speedWarning: language === 'nl' 
      ? "E2EE beperkt upload- en downloadsnelheid tot max. 180 Mbit/s" 
      : "E2EE limits upload and download speed to max 180 Mbit/s",
  },
  legalVerification: language === 'nl' 
    ? "Identiteitsverificatie vereist. Een juridisch bewijspakket wordt gegenereerd."
    : "Identity verification required. A legal evidence package will be generated.",
  professionalVerification: language === 'nl'
    ? "E-mail 2FA verificatie is vereist voor download."
    : "Email 2FA verification is required for download.",
});
export function NewTransferDialog({ 
  open, 
  onOpenChange, 
  userId, 
  userEmail,
  onTransferCreated 
}: NewTransferDialogProps) {
  const { language } = useLanguage();
  const content = getContent(language);
// NEW refs
const abortControllerRef = useRef<AbortController | null>(null);
const activeUploadIdRef = useRef<string | null>(null);
const activeKeyRef = useRef<string | null>(null);
  
  const [files, setFiles] = useState<File[]>([]);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [dossierNumber, setDossierNumber] = useState("");
  const [expiryDays, setExpiryDays] = useState("7");
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>("email");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [userPlan, setUserPlan] = useState<string>("free");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
const progressRef = useRef<HTMLInputElement>(null);
const [progress, setProgress] = useState(0);
const [uploadKey, setUploadKey] = useState<string | null>(null);
const [chunkProgress, setChunkProgress] = useState<Record<number, number>>({});
const [uploadMessage, setUploadMessage] = useState<string>("");
const [uploadSpeed, setUploadSpeed] = useState<string>("");
const [e2eeEnabled, setE2eeEnabled] = useState(false);
  
const speedRef = useRef({
  lastTime: Date.now(),
  lastLoaded: 0,
});

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const showPublicWarning = recipientEmail && isPublicDomain(recipientEmail);
const handleFiles = useCallback((newFiles: FileList | File[]) => {
  const fileArray = Array.from(newFiles);

  if (fileArray.length > 1) {
    toast.error("Only one file is allowed per transfer");
    return;
  }

  const file = fileArray[0];

  // ❌ block .exe explicitly
  if (file.name.toLowerCase().endsWith(".exe")) {
    toast.error("Executable (.exe) files are not allowed");
    return;
  }

  if (file.size > MAX_SIZE_BYTES) {
    toast.error("File exceeds 10GB limit");
    return;
  }

  setFiles([file]);
}, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFiles([]);
    setRecipientEmail("");
    setMessage("");
    setDossierNumber("");
    setExpiryDays("7");
    setSecurityLevel("email");
    setChunkProgress({});
setUploadMessage("");

  };

     
  const isValid = recipientEmail && files.length > 0;

const handleSubmit = async () => {
  const controller = new AbortController();
  abortControllerRef.current = controller;

  await handleMultipartSubmit({
    files,
    baseUrl,
    expiryDays,
    recipientEmail,
    message,
    dossierNumber,
e2eeEnabled,
    setIsUploading,
    setProgress,
    setUploadSpeed,
    setUploadKey,

    resetForm,
    onTransferCreated,
    onOpenChange,

    toast,
    speedRef,
    WorkerPool,

    abortSignal: controller.signal,

   onMultipartInit: ({ uploadId, key }: MultipartInitPayload) => {
  activeUploadIdRef.current = uploadId;
  activeKeyRef.current = key;
},

  });
};



const handleCancelUpload = async () => {
  try {
    // 1️⃣ Abort all in-flight fetch/XHR
    abortControllerRef.current?.abort();

    // 2️⃣ Tell backend to abort multipart upload
    if (activeUploadIdRef.current && activeKeyRef.current) {
      await fetch(`${baseUrl}/transfers/multipart/abort`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadId: activeUploadIdRef.current,
          key: activeKeyRef.current,
        }),
      });
    }
  } catch (e) {
    console.warn("Cancel cleanup failed (safe to ignore)", e);
  } finally {
    // 3️⃣ Hard reset UI
    abortControllerRef.current = null;
    activeUploadIdRef.current = null;
    activeKeyRef.current = null;

    setIsUploading(false);
    setProgress(0);
    setChunkProgress({});
    setUploadSpeed("");
    setUploadMessage("");

    resetForm();
    onOpenChange(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            {content.title}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">

          {/* File Dropzone */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{content.files}</Label>
            <Card
              className={`p-6 border-2 border-dashed transition-all duration-300 cursor-pointer ${
                isDragging ? "border-primary bg-accent/50" : "border-border hover:border-primary/50 bg-card/50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-sm font-medium">{content.dropzone}</p>
                <p className="text-xs text-muted-foreground">{content.maxSize} 20 {content.perTransfer}</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />
            </Card>

            {files.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {files.map((file, index) => {
                  const Icon = getFileIcon(file.type);
                  return (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground">{content.total}: {formatFileSize(totalSize)}</p>
              </div>
            )}
          </div>

          {/* Recipient Email */}
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">{content.recipientEmail} *</Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder={content.recipientPlaceholder}
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            {showPublicWarning && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 text-amber-600 text-xs">
                <AlertTriangle className="h-4 w-4" />
                <span>{content.publicWarning}</span>
              </div>
            )}
          </div>

          {/* Dossier Number */}
          <div className="space-y-2">
            <Label htmlFor="dossierNumber" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              {content.dossierNumber}
            </Label>
            <Input
              id="dossierNumber"
              placeholder={content.dossierPlaceholder}
              value={dossierNumber}
              onChange={(e) => setDossierNumber(e.target.value)}
            />
          </div>

          {/* E2EE Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="e2ee-toggle" className="text-sm font-medium cursor-pointer">
                    {content.e2ee.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {content.e2ee.description}
                  </p>
                </div>
              </div>
              <Switch
                id="e2ee-toggle"
                checked={e2eeEnabled}
                onCheckedChange={setE2eeEnabled}
              />
            </div>
            {e2eeEnabled && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Info className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="text-xs text-amber-700">{content.e2ee.speedWarning}</span>
              </div>
            )}
          </div>

          {/* Security Level Selector */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {content.securityLevel}
            </Label>
            <SecurityLevelSelector
              value={securityLevel}
              onChange={setSecurityLevel}
              userPlan={userPlan}
              // legalCreditsRemaining={teamCredits}
              // onUpgradeClick={() => setShowUpgradeModal(true)}
              // trialDaysRemaining={trialDaysRemaining}
              // onUpgradeToPro={() => setShowUpgradeModal(true)}
              // onLegalTrialClick={() => setShowLegalTrialModal(true)}
            />
          </div>

          {/* Expiry */}
          <div className="space-y-2">
            <Label>{content.availableFor}</Label>
            <Select value={expiryDays} onValueChange={setExpiryDays}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{content.days1}</SelectItem>
                <SelectItem value="7">{content.days7}</SelectItem>
                <SelectItem value="30">{content.days30}</SelectItem>
                <SelectItem value="90">{content.days90}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">{content.message}</Label>
            <Textarea
              id="message"
              placeholder={content.messagePlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

{isUploading && (
  <div className="space-y-4">

    {/* overall progress */}
 <div className="upload-progress-container-new" ref={progressRef}>
  <div
    className="upload-progress-bar-new"
    style={{
      width: `${progress}%`,
      borderRadius: progress === 100 ? "10px" : "10px 0 0 10px",
    }}
  >
    <span className="upload-progress-thumb">{progress}%</span>
  </div>

  {uploadSpeed && (
    <span className="upload-progress-speed">
      {uploadSpeed}
    </span>
  )}
</div>


    {/* message */}
    {uploadMessage && (
      <p className="text-xs text-muted-foreground text-center">
        {uploadMessage}
      </p>
    )}

    {/* per-chunk progress (parallel uploads) */}
    {Object.keys(chunkProgress).length > 0 && (
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {Object.entries(chunkProgress).map(([part, pct]) => (
          <div key={part} className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Part {part}</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded">
              <div
                className="h-2 bg-primary rounded transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}



        <DialogFooter>
         <Button
  variant="outline"
  onClick={isUploading ? handleCancelUpload : () => onOpenChange(false)}
>
  {content.cancel}
</Button>

          <Button onClick={handleSubmit} disabled={!isValid || isUploading}>
            {isUploading ? content.creating : content.sendTransfer}
          </Button>
        </DialogFooter>
      </DialogContent>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      {/* <LegalTrialModal 
        open={showLegalTrialModal} 
        onOpenChange={setShowLegalTrialModal}
        onTryOnce={() => {
          setSecurityLevel("eidas_qualified");
          setHasUsedLegalTrial(true);
        }}
      /> */}
    </Dialog>
  );
  }