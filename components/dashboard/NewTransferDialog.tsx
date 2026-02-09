"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { baseUrl } from "@/const";
import { handleMultipartSubmit } from "./encrypt/multipartUpload";


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
  Send
} from "lucide-react";
import { toast } from "sonner";
import { SecurityLevelSelector, SecurityLevel } from "./SecurityLevelSelector";
import { UpgradeModal } from "./UpgradeModal";
import { WorkerPool } from "./encrypt/workerPool";

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

export function NewTransferDialog({ 
  open, 
  onOpenChange, 
  userId, 
  userEmail,
  onTransferCreated 
}: NewTransferDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [dossierNumber, setDossierNumber] = useState("");
  const [expiryDays, setExpiryDays] = useState("7");
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>("starter");
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
    setSecurityLevel("professional");
    setChunkProgress({});
setUploadMessage("");

  };

     
  const isValid = recipientEmail && files.length > 0;

const handleSubmit = async () => {
  await handleMultipartSubmit({
    files,
    baseUrl,
    expiryDays,
    recipientEmail,
    message,
    dossierNumber,

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
  });
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            New Secure Transfer
          </DialogTitle>
          <DialogDescription>
            Send files securely with QERDS verification and delivery certificates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Dropzone */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Files</Label>
            <Card 
              className={`p-6 border-2 border-dashed transition-all duration-300 cursor-pointer ${
                isDragging 
                  ? "border-primary bg-accent/50" 
                  : "border-border hover:border-primary/50 bg-card/50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-sm font-medium">Drop files here or click to browse</p>
                <p className="text-xs text-muted-foreground">Max 10GB per transfer</p>
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
                <p className="text-xs text-muted-foreground">
                  Total: {formatFileSize(totalSize)}
                </p>
              </div>
            )}
          </div>

          {/* Recipient Email */}
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Recipient Email *</Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="recipient@company.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            {showPublicWarning && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 text-amber-600 text-xs">
                <AlertTriangle className="h-4 w-4" />
                <span>Warning: You are sending to a public email provider.</span>
              </div>
            )}
          </div>

          {/* Dossier Number */}
          <div className="space-y-2">
            <Label htmlFor="dossierNumber" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Dossier Number (optional)
            </Label>
            <Input
              id="dossierNumber"
              placeholder="e.g., 2024-001234"
              value={dossierNumber}
              onChange={(e) => setDossierNumber(e.target.value)}
            />
          </div>

          {/* Security Level Selector */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Security Level
            </Label>
            <SecurityLevelSelector
              value={securityLevel}
              onChange={setSecurityLevel}
              userPlan={userPlan}
              onUpgradeClick={() => setShowUpgradeModal(true)}
            />
          </div>

          {/* Expiry */}
          <div className="space-y-2">
            <Label>Available for</Label>
            <Select value={expiryDays} onValueChange={setExpiryDays}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a message for the recipient..."
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        <Button onClick={handleSubmit} disabled={!isValid || isUploading}>
    {isUploading ? "Creating..." : "Send Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <UpgradeModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal} 
      />
    </Dialog>
  ); 
  }