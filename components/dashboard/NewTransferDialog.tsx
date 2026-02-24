"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { baseUrl } from "@/const";
import { handleMultipartSubmit } from "./encrypt/multipartUpload";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PhoneInput } from "@/components/ui/phone-input";

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
  Info,
  PenTool,
  MousePointerClick,
  CheckCircle,
  Copy,
  Smartphone
} from "lucide-react";
import { toast } from "sonner";
import { SecurityLevelSelector, SecurityLevel } from "./SecurityLevelSelector";
import { UpgradeModal } from "./UpgradeModal";
import { WorkerPool } from "./encrypt/workerPool";
import { useLanguage } from "@/contexts/LanguageContext";
import { BuyCreditsModal } from "./BuyCreditsModal";
import { LegalTrialModal } from "./LegalTrialModal";

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
   recipientName: language === 'nl' ? "Naam Ontvanger" : "Recipient Name",
  recipientNamePlaceholder: language === 'nl' ? "Volledige naam ontvanger" : "Recipient full name",
 
  recipientPlaceholder: language === 'nl' ? "ontvanger@bedrijf.nl" : "recipient@company.com",
  publicWarning: language === 'nl' ? "Let op: Je verstuurt naar een openbaar e-mailadres." : "Warning: You are sending to a public email provider.",
  recipientPhone: language === 'nl' ? "Telefoonnummer ontvanger" : "Recipient phone number",
  recipientPhonePlaceholder: language === 'nl' ? "+31 6 12345678" : "+31 6 12345678",
  phoneRequired: language === 'nl' ? "Vereist voor SMS verificatie" : "Required for SMS verification",
  dossierNumber: language === 'nl' ? "Dossiernummer (optioneel)" : "Dossier Number (optional)",
  dossierPlaceholder: language === 'nl' ? "bijv. 2024-001234" : "e.g., 2024-001234",
  securityLevel: language === 'nl' ? "Bewijskracht niveau" : "Strength of Evidence",
  availableFor: language === 'nl' ? "Beschikbaar voor" : "Available for",
  days7: language === 'nl' ? "7 dagen" : "7 days",
  days14: language === 'nl' ? "14 dagen" : "14 days",
  days30: language === 'nl' ? "30 dagen" : "30 days",
  deleteDays1: language === 'nl' ? "Na download (max 1 dag)" : "After download (max 1 day)",
  deleteDays3: language === 'nl' ? "Na download (max 3 dagen)" : "After download (max 3 days)",
  deleteDays7: language === 'nl' ? "Na download (max 7 dagen)" : "After download (max 7 days)",
  deleteDays14: language === 'nl' ? "Na download (max 14 dagen)" : "After download (max 14 days)",
  deleteImmediate: language === 'nl' ? "Na download direct verwijderen" : "Delete immediately after download",
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
  noCredits: language === 'nl' ? "Je team heeft geen verificatie credits meer. Koop extra credits om Legal transfers te versturen." : "Your team has no verification credits left. Purchase more to send Legal transfers.",
  creditError: language === 'nl' ? "Kon credit niet afschrijven. Probeer het opnieuw." : "Could not deduct credit. Please try again.",
  e2ee: {
    label: language === 'nl' ? "End-to-End Encryptie (E2EE)" : "End-to-End Encryption (E2EE)",
    description: language === 'nl' 
      ? "Extra beveiliging waarbij bestanden versleuteld worden voordat ze je apparaat verlaten." 
      : "Extra security where files are encrypted before leaving your device.",
    speedWarning: language === 'nl' 
      ? "E2EE beperkt upload- en downloadsnelheid tot max. 480 Mbit/s" 
      : "E2EE limits upload and download speed to max 480 Mbit/s",
  },
  deleteAfterDownload: {
    label: language === 'nl' ? "Verwijder na downloaden" : "Delete after download",
    description: language === 'nl'
      ? "Bestanden worden direct verwijderd nadat de ontvanger ze heeft gedownload."
      : "Files are immediately deleted after the recipient downloads them.",
  },
  legalVerification: language === 'nl' 
    ? "Identiteitsverificatie vereist. Een juridisch bewijspakket wordt gegenereerd."
    : "Identity verification required. A legal evidence package will be generated.",
  professionalVerification: language === 'nl'
    ? "E-mail 2FA verificatie is vereist voor download."
    : "Email 2FA verification is required for download.",
  acknowledgementMethod: language === 'nl' ? "Ontvangstbevestiging methode" : "Receipt confirmation method",
  oneClickLabel: language === 'nl' ? "One-Click Akkoord" : "One-Click Agreement",
  oneClickDesc: language === 'nl' ? "Ontvanger bevestigt ontvangst met één klik. Snel en eenvoudig." : "Recipient confirms receipt with a single click. Fast and simple.",
  signatureLabel: language === 'nl' ? "Digitale Handtekening" : "Digital Signature",
  signatureDesc: language === 'nl' ? "Ontvanger tekent met een handtekening op een tekenpad. Sterkere juridische bewijskracht." : "Recipient must draw a handwritten signature on a signature pad. Stronger legal proof.",
  signPdfs: language === 'nl' ? "Adobe PDF Verzegeling" : "Adobe PDF Sealing",
  signPdfsDesc: language === 'nl' ? "Alle PDF-bestanden worden automatisch verzegeld met een Adobe-vertrouwd certificaat vóór verzending." : "All PDF files will be automatically sealed with an Adobe-trusted certificate before sending.",
  signPdfsInline: language === 'nl' ? "Verzegelen & versleuteld versturen" : "Seal & send encrypted",
  // Success screen
  successTitle: language === 'nl' ? "Overdracht Succesvol!" : "Transfer Successful!",
  successSubtitle: language === 'nl' 
    ? "Je bestanden zijn veilig end-to-end versleuteld geüpload en de ontvanger is per e-mail op de hoogte gesteld."
    : "Your files have been securely uploaded with end-to-end encryption and the recipient has been notified by email.",
  successEmailSent: language === 'nl' ? "E-mail verzonden naar" : "Email sent to",
  successFilesUploaded: language === 'nl' ? "bestanden geüpload" : "files uploaded",
  successFileUploaded: language === 'nl' ? "bestand geüpload" : "file uploaded",
  successExpiresIn: language === 'nl' ? "Beschikbaar tot" : "Available until",
  successLinkCopied: language === 'nl' ? "Downloadlink gekopieerd naar klembord" : "Download link copied to clipboard",
  successCopyLink: language === 'nl' ? "Kopieer Downloadlink" : "Copy Download Link",
  successNewTransfer: language === 'nl' ? "Nieuwe Overdracht" : "New Transfer",
  successClose: language === 'nl' ? "Sluiten" : "Close",
  successDossier: language === 'nl' ? "Dossiernummer" : "Dossier Number",
  successSecurityLevel: language === 'nl' ? "Bewijskracht niveau" : "Strength of Evidence",
  successEncryption: language === 'nl' ? "End-to-End Versleuteld" : "End-to-End Encrypted",
  successEuInfra: language === 'nl' ? "100% EU Infrastructuur" : "100% EU Infrastructure",
  successAutoDelete: language === 'nl' ? "Automatisch verwijderd na verloopdatum" : "Auto-deleted after expiry",
  successEvidenceStandard: language === 'nl' ? "Basis bewijskracht — e-mailbevestiging" : "Basic strength of evidence — email confirmation",
  successEvidencePro: language === 'nl' ? "Sterke bewijskracht — 2FA verificatie, IP & geolocatie, SHA-256 hash, Adobe verzegelde PDF" : "Strong strength of evidence — 2FA verification, IP & geolocation, SHA-256 hash, Adobe sealed PDF",
  successEvidenceLegal: language === 'nl' ? "Maximale bewijskracht — biometrische ID-verificatie, onweerlegbaar bewijs van ontvangst" : "Maximum evidence — biometric ID verification, irrefutable proof of receipt",
  successSecuredBy: language === 'nl' ? "Beveiligd door TransferGuard" : "Secured by TransferGuard",
  successTimestamp: language === 'nl' ? "Gekwalificeerde tijdstempel" : "Qualified timestamp",
  successGdpr: language === 'nl' ? "AVG-conform" : "GDPR compliant",
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
   const [recipientName, setRecipientName] = useState("");
 
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
const [e2eeEnabled, setE2eeEnabled] = useState(true);
  



  const [uploadProgress, setUploadProgress] = useState(0);
  const [legalCreditsRemaining, setLegalCreditsRemaining] = useState<number>(0);
  const [transferCount, setTransferCount] = useState<number>(0);
  const [upgradeTargetPlan, setUpgradeTargetPlan] = useState<"professional" | "legal">("professional");
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number | undefined>(undefined);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamCredits, setTeamCredits] = useState<number>(0);
  const [deleteAfterDownload, setDeleteAfterDownload] = useState(false);
  const [deleteMaxDays, setDeleteMaxDays] = useState("7");
  const [showLegalTrialModal, setShowLegalTrialModal] = useState(false);
  const [hasUsedLegalTrial, setHasUsedLegalTrial] = useState(false);
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState("");
  const [acknowledgementMethod, setAcknowledgementMethod] = useState<"one_click" | "signature">("one_click");
  const [signPdfIndexes, setSignPdfIndexes] = useState<Set<number>>(new Set());
  const [showSuccess, setShowSuccess] = useState(true);
  const [successData, setSuccessData] = useState<{
    recipientEmail: string;
    fileCount: number;
    totalSize: number;
    expiresAt: string;
    downloadLink: string;
    dossierNumber: string;
    securityLevel: SecurityLevel;
  } | null>(null);









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

     
const requiresPhone = securityLevel === "sms" || securityLevel === "email_sms";
  const isValid = recipientEmail && files.length > 0 && (!requiresPhone || recipientPhone.trim().length > 0);

const handleSubmit = async () => {
  const controller = new AbortController();
  abortControllerRef.current = controller;

  await handleMultipartSubmit({
    files,
    baseUrl,
    expiryDays,
    recipientEmail,
    recipientName,
    message,
    dossierNumber,
e2eeEnabled,
    setIsUploading,
    setProgress,
    setUploadSpeed,
    setUploadKey,
setSuccessData,
    resetForm,
    onTransferCreated,
    onOpenChange,
 setShowSuccess,
 
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
    <Dialog open={open} onOpenChange={(val) => {
        if (!val && showSuccess) {
          onTransferCreated();
          resetForm();
        }
        onOpenChange(val);
      }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        {showSuccess && successData ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                {content.successTitle}
              </DialogTitle>
              <DialogDescription>{content.successSubtitle}</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* Success animation */}
              <div className="flex flex-col items-center py-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-in zoom-in-50 duration-300">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="w-full max-w-sm bg-primary/5 border border-primary/20 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{content.successEmailSent}</p>
                      <p className="text-sm text-primary font-medium">{successData.recipientEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 animate-in fade-in duration-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Lock className="h-3 w-3" />
                  {content.successEncryption}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Shield className="h-3 w-3" />
                  {content.successEuInfra}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <FileCheck className="h-3 w-3" />
                  {content.successGdpr}
                </span>
              </div>

              {/* Evidence level indicator */}
              <div className={`rounded-xl p-3 border ${
                successData.securityLevel === 'id_verification' 
                  ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800' 
                  : (successData.securityLevel === 'sms' || successData.securityLevel === 'email_sms')
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-muted/50 border-border'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    successData.securityLevel === 'id_verification'
                      ? 'bg-amber-100 dark:bg-amber-900/40'
                      : (successData.securityLevel === 'sms' || successData.securityLevel === 'email_sms')
                      ? 'bg-primary/10'
                      : 'bg-muted'
                  }`}>
                    <Shield className={`h-4 w-4 ${
                      successData.securityLevel === 'id_verification'
                        ? 'text-amber-600'
                        : 'text-primary'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold">
                        {content.successSecurityLevel}:{' '}
                        {successData.securityLevel === 'id_verification' ? 'Legal' : 'Professional'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {successData.securityLevel === 'id_verification'
                        ? content.successEvidenceLegal
                        : (successData.securityLevel === 'sms' || successData.securityLevel === 'email_sms')
                        ? content.successEvidencePro
                        : content.successEvidenceStandard}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transfer details */}
              <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{content.files}</span>
                  <span className="font-medium">
                    {successData.fileCount} {successData.fileCount === 1 ? content.successFileUploaded : content.successFilesUploaded}
                    <span className="ml-1 text-muted-foreground">({formatFileSize(successData.totalSize)})</span>
                  </span>
                </div>
                {successData.dossierNumber && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{content.successDossier}</span>
                    <span className="font-medium">{successData.dossierNumber}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{content.successExpiresIn}</span>
                  <span className="font-medium">
                    {new Date(successData.expiresAt).toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{content.successTimestamp}</span>
                  <span className="font-medium text-xs text-muted-foreground">
                    {new Date().toLocaleString(language === 'nl' ? 'nl-NL' : 'en-US')}
                  </span>
                </div>
              </div>

              {/* Copy link */}
              <div className="flex items-center gap-2">
                <Input 
                  readOnly 
                  value={successData.downloadLink} 
                  className="text-xs bg-background font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => {
                    try { navigator.clipboard.writeText(successData.downloadLink); } catch {}
                    toast.success(content.successLinkCopied);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* Secured by footer */}
              <div className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>{content.successSecuredBy}</span>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onTransferCreated();
                  resetForm();
                  setShowSuccess(false);
                  onOpenChange(false);
                }}
              >
                {content.successClose}
              </Button>
              <Button
                onClick={() => {
                  resetForm();
                  
                  setShowSuccess(false);
                }}
              >
                <Send className="h-4 w-4 mr-1.5" />
                {content.successNewTransfer}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            {content.title}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          {/* Left column: Files, Recipient, Dossier, Message */}
          <div className="space-y-4 flex flex-col">
            {/* File Dropzone */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                {content.files} *
              </Label>
              {files.length === 0 ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
                  onDragEnter={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">{content.dropzone}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {content.maxSize} 5 {content.perTransfer}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) handleFiles(e.target.files);
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file, index) => {
                    const ext = file.name.split(".").pop()?.toLowerCase() || "";
                    const Icon = getFileIcon(file.type) || FileText;

                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="space-y-0"
                      >
                        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
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
                      </div>
                    );
                  })}
                  <p className="text-xs text-muted-foreground">{content.total}: {formatFileSize(totalSize)}</p>
                </div>
              )}
            </div>

            {/* Recipient Email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="recipientName">{content.recipientName} *</Label>
                <Input
                  id="recipientName"
                  type="text"
                  placeholder={content.recipientNamePlaceholder}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">{content.recipientEmail} *</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder={content.recipientPlaceholder}
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Recipient Phone - shown when SMS or Email+SMS is selected */}
            {requiresPhone && (
              <div className="space-y-2">
                <Label htmlFor="recipientPhone" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  {content.recipientPhone} *
                </Label>
                <PhoneInput
                  id="recipientPhone"
                  value={recipientPhone}
                  onChange={setRecipientPhone}
                  language={language}
                />
                <p className="text-xs text-muted-foreground">{content.phoneRequired}</p>
              </div>
            )}

            {/* Dossier + Expiry side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="dossierNumber">
                  {content.dossierNumber}
                </Label>
                <Input
                  id="dossierNumber"
                  placeholder={content.dossierPlaceholder}
                  value={dossierNumber}
                  onChange={(e) => setDossierNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{content.availableFor}</Label>
                <Select value={expiryDays} onValueChange={(val) => {
                  setExpiryDays(val);
                  setDeleteAfterDownload(val.startsWith("delete-"));
                  if (val.startsWith("delete-")) {
                    setDeleteMaxDays(val.replace("delete-", ""));
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">{content.days7}</SelectItem>
                    <SelectItem value="14">{content.days14}</SelectItem>
                    <SelectItem value="30">{content.days30}</SelectItem>
                    <SelectItem value="delete-1">{content.deleteDays1}</SelectItem>
                    <SelectItem value="delete-3">{content.deleteDays3}</SelectItem>
                    <SelectItem value="delete-7">{content.deleteDays7}</SelectItem>
                    <SelectItem value="delete-14">{content.deleteDays14}</SelectItem>
                    <SelectItem value="delete-0">{content.deleteImmediate}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2 flex-1 flex flex-col">
              <Label htmlFor="message">{content.message}</Label>
              <Textarea
                id="message"
                placeholder={content.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="flex-1 min-h-[120px]"
              />
            </div>
          </div>

          {/* Right column: E2EE + Security Level */}
          <div className="space-y-4">




            {/* Security Level Selector */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                {content.securityLevel}
              </Label>
              <SecurityLevelSelector
                value={securityLevel}
                onChange={setSecurityLevel}
                userPlan="professional"
                legalCreditsRemaining={teamCredits}
                onUpgradeClick={() => { setUpgradeTargetPlan("legal"); setShowUpgradeModal(true); }}
                trialDaysRemaining={trialDaysRemaining}
                onUpgradeToPro={() => { setUpgradeTargetPlan("professional"); setShowUpgradeModal(true); }}
                onLegalTrialClick={() => setShowLegalTrialModal(true)}
                onBuyCreditsClick={() => setShowBuyCreditsModal(true)}
              />
            </div>

            {/* Acknowledgement Method Selector */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <PenTool className="h-4 w-4 text-primary" />
                {content.acknowledgementMethod}
              </Label>
              <RadioGroup
                value={acknowledgementMethod}
                onValueChange={(val) => setAcknowledgementMethod(val as "one_click" | "signature")}
                className="grid gap-2"
              >
                <div
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    acknowledgementMethod === "one_click"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-background/50"
                  }`}
                  onClick={() => setAcknowledgementMethod("one_click")}
                >
                  <RadioGroupItem value="one_click" id="dash-ack-one-click" className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="dash-ack-one-click" className="font-medium text-sm cursor-pointer flex items-center gap-2">
                      <MousePointerClick className="h-4 w-4" />
                      {content.oneClickLabel}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {content.oneClickDesc}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    acknowledgementMethod === "signature"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-background/50"
                  }`}
                  onClick={() => setAcknowledgementMethod("signature")}
                >
                  <RadioGroupItem value="signature" id="dash-ack-signature" className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="dash-ack-signature" className="font-medium text-sm cursor-pointer flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      {content.signatureLabel}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {content.signatureDesc}
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>



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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {content.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isUploading}>
            {isUploading ? content.creating : content.sendTransfer}
          </Button>
        </DialogFooter>
          </>
        )}
      </DialogContent>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} targetPlan={upgradeTargetPlan} />
      <LegalTrialModal 
        open={showLegalTrialModal} 
        onOpenChange={setShowLegalTrialModal}
        onTryOnce={() => {
          setSecurityLevel("id_verification");
          setHasUsedLegalTrial(true);
        }}
      />
      <BuyCreditsModal
        open={showBuyCreditsModal}
        onOpenChange={setShowBuyCreditsModal}
        currentCredits={teamCredits}
        isAdmin={true}
        onCreditsPurchased={(credits) => {
          setTeamCredits(prev => prev + credits);
        }}
      />
    </Dialog>
  );
  }