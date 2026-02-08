"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { baseUrl } from "@/const";
import * as openpgp from "openpgp";

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

const CHUNK_SIZE = 50 * 1024 * 1024;   // ✅ 50MB parts
const WORKERS = 8;                    // ✅ match CPU/encryption throughput
const BUFFER_SIZE = 12;               // ✅ keep uploads fed
const UPLOAD_CONCURRENCY = 8;         // ✅ 8 parallel PUT streams
const URL_BATCH_SIZE = 20;            // ✅ backend limit


const splitIntoChunks = (blob: Blob) => {
  const chunks: Blob[] = [];
  for (let i = 0; i < blob.size; i += CHUNK_SIZE) {
    chunks.push(blob.slice(i, i + CHUNK_SIZE));
  }
  return chunks;
};
const handleSubmit = async () => {
  if (!files[0]) return;

  try {
    setIsUploading(true);
    setProgress(0);
    setUploadSpeed("");
    speedRef.current = { lastTime: Date.now(), lastLoaded: 0 };

    const file = files[0];
    const encryptionPass = crypto.randomUUID();

    const expiresAt = new Date(
      Date.now() + Number(expiryDays) * 24 * 60 * 60 * 1000
    ).toISOString();

    /* -------------------------------------------------- */
    /* START MULTIPART                                    */
    /* -------------------------------------------------- */

    const startRes = await fetch(`${baseUrl}/transfers/multipart/start`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType: "application/octet-stream",
      }),
    });

    const startData = await startRes.json();
    if (!startRes.ok) throw new Error(startData.message);

    const { uploadId, key, bucket } = startData;
    setUploadKey(key);

    const chunks = splitIntoChunks(file);

    const pool = new WorkerPool(WORKERS);
    const uploadedParts: any[] = [];

    /* -------------------------------------------------- */
    /* ✅ URL BATCH CACHE (NEW)                           */
    /* -------------------------------------------------- */

    const urlCache = new Map<number, string>();

    const fetchUrlBatch = async (startPart: number) => {
      const batch: number[] = [];

      for (
        let p = startPart;
        p <= chunks.length && batch.length < URL_BATCH_SIZE;
        p++
      ) {
        if (!urlCache.has(p)) batch.push(p);
      }

      if (!batch.length) return;

      const res = await fetch(`${baseUrl}/transfers/multipart/urls`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadId, key, parts: batch }),
      });

      const data = await res.json();

      for (const { partNumber, url } of data) {
        urlCache.set(partNumber, url);
      }
    };

    /* -------------------------------------------------- */
    /* BUFFER + PROGRESS                                  */
    /* -------------------------------------------------- */

    const buffer: { partNumber: number; encrypted: Uint8Array }[] = [];
    let nextChunkToEncrypt = 0;
    let nextChunkToUpload = 0;

    const chunkProgress: Record<number, number> = {};

    const updateOverallProgress = () => {
      const total =
        Object.values(chunkProgress).reduce((s, v) => s + v, 0) / chunks.length;
      setProgress(Math.round(total));
    };

    /* -------------------------------------------------- */
    /* PRODUCER (ENCRYPT)                                 */
    /* -------------------------------------------------- */

    const producer = async () => {
      while (nextChunkToEncrypt < chunks.length) {
        if (buffer.length >= BUFFER_SIZE) {
          await new Promise((r) => setTimeout(r, 10));
          continue;
        }

        const partNumber = nextChunkToEncrypt++;

        const encrypted = await pool.run({
          chunk: await chunks[partNumber].arrayBuffer(),
          pass: encryptionPass,
          id: partNumber + 1,
        });

        buffer.push({ partNumber, encrypted });
      }
    };

    /* -------------------------------------------------- */
    /* CONSUMER (UPLOAD)                                  */
    /* -------------------------------------------------- */

    const consumer = async () => {
      while (nextChunkToUpload < chunks.length) {
        if (!buffer.length) {
          await new Promise((r) => setTimeout(r, 10));
          continue;
        }

        const { partNumber, encrypted } = buffer.shift()!;
        nextChunkToUpload++;

        const partNum = partNumber + 1;

        /* ✅ fetch URL batch only when needed */
        if (!urlCache.has(partNum)) {
          await fetchUrlBatch(partNum);
        }

        const url = urlCache.get(partNum)!;
        urlCache.delete(partNum);

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.open("PUT", url, true);
          xhr.setRequestHeader("Content-Type", "application/octet-stream");

          xhr.upload.onprogress = (e) => {
            if (!e.lengthComputable) return;

            chunkProgress[partNum] = Math.round((e.loaded / e.total) * 100);

            const now = Date.now();
            const timeDiff = (now - speedRef.current.lastTime) / 1000;
            const bytesDiff = e.loaded - speedRef.current.lastLoaded;

            if (timeDiff > 0.5) {
              const speedBps = bytesDiff / timeDiff;
              const speedMbps = (speedBps * 8) / (1024 * 1024);
              setUploadSpeed(`${speedMbps.toFixed(2)} Mbps`);
              speedRef.current.lastTime = now;
              speedRef.current.lastLoaded = e.loaded;
            }

            updateOverallProgress();
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const etag = xhr.getResponseHeader("ETag")!.replace(/"/g, "");
              uploadedParts.push({ PartNumber: partNum, ETag: etag });
              resolve();
            } else reject(new Error("Chunk upload failed"));
          };

          xhr.onerror = reject;

         const normalized = new Uint8Array(encrypted); xhr.send( new Blob([normalized], { type: "application/octet-stream" }) );
        });
      }
    };

    /* -------------------------------------------------- */
    /* RUN PIPELINE                                       */
    /* -------------------------------------------------- */

    const producerPromise = producer();

    const consumers = Array.from(
      { length: UPLOAD_CONCURRENCY },
      () => consumer()
    );

    await Promise.all([producerPromise, ...consumers]);

    pool.terminate();

    /* -------------------------------------------------- */
    /* COMPLETE MULTIPART                                 */
    /* -------------------------------------------------- */

    await fetch(`${baseUrl}/transfers/multipart/complete`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uploadId,
        key,
        parts: uploadedParts.sort((a, b) => a.PartNumber - b.PartNumber),
      }),
    });

    /* -------------------------------------------------- */
    /* SAVE METADATA                                      */
    /* -------------------------------------------------- */

    const metaRes = await fetch(`${baseUrl}/transfers/create`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientEmail,
        message,
        dossierNumber,
        securityLevel: "professional",
        expiresAt,
        file: {
          name: file.name,
          size: file.size,
          type: "application/octet-stream",
        },
        key,
        bucket,
        totalSizeBytes: file.size,
        encryption: "pgp",
        encryptionPassword: encryptionPass,
      }),
    });

    if (!metaRes.ok) throw new Error("Metadata save failed");

    toast.success("Secure transfer created successfully");

    resetForm();
    onTransferCreated();
    onOpenChange(false);
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    setIsUploading(false);
  }
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

  {/* {uploadSpeed && (
    <span className="upload-progress-speed">
      {uploadSpeed}
    </span>
  )} */}
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