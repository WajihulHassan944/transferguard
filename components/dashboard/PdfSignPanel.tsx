import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FileText, Upload, X, CheckCircle2, Shield, Download,
  FileLock2, Eye, Ban, ShieldCheck, Clock, Loader2, XCircle, Info
} from "lucide-react";
import { toast } from "sonner";


type FileStatus = "idle" | "pending" | "signing" | "signed" | "error";

interface TrackedFile {
  file: File;
  status: FileStatus;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const StatusBadge = ({ status, language }: { status: FileStatus; language: string }) => {
  const config: Record<FileStatus, { label: string; icon: React.ReactNode; className: string }> = {
    idle: { label: "", icon: null, className: "" },
    pending: {
      label: language === "nl" ? "Wachtend..." : "Pending...",
      icon: <Clock className="h-3 w-3" />,
      className: "bg-muted text-muted-foreground border-muted",
    },
    signing: {
      label: language === "nl" ? "Ondertekenen..." : "Signing...",
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
      className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    },
    signed: {
      label: language === "nl" ? "Ondertekend" : "Signed",
      icon: <CheckCircle2 className="h-3 w-3" />,
      className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    },
    error: {
      label: language === "nl" ? "Mislukt" : "Failed",
      icon: <XCircle className="h-3 w-3" />,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

  const c = config[status];
  if (!c.label) return null;

  return (
    <Badge variant="outline" className={`gap-1 text-xs font-medium ${c.className}`}>
      {c.icon}
      {c.label}
    </Badge>
  );
};

export function PdfSignPanel() {
  const { language } = useLanguage();
  const [trackedFiles, setTrackedFiles] = useState<TrackedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const content = language === 'nl' ? {
    title: "PDF's Digitaal Verzegelen",
    subtitle: "Verzegel PDF-documenten met een Adobe-vertrouwd certificaat — aantoonbaar bewijs van integriteit, wereldwijd herkend. Ideaal voor aktes, contracten, jaarstukken en rapportages.",
    dropTitle: "Sleep PDF-bestanden hierheen",
    dropSubtitle: "of klik om te bladeren",
    dropAccept: "Alleen PDF-bestanden • Max 50MB per bestand",
    selectFiles: "Selecteer PDF's",
    signAll: "Alle PDF's verzegelen",
    filesSelected: "PDF-bestanden geselecteerd",
    remove: "Verwijderen",
    invalidFile: "Alleen PDF-bestanden zijn toegestaan",
    tooLarge: "Bestand is te groot (max 50MB)",
    download: "Download",
    downloadAll: "Alles downloaden",
    benefitsTitle: "Waarom Adobe PDF Verzegeling?",
    benefits: [
      { title: "Elke pagina verzegeld", desc: "Cryptografisch verzegeld. Wijzigingen worden direct zichtbaar.", icon: FileLock2 },
      { title: "Manipulatiedetectie", desc: "Adobe toont een waarschuwing bij elke wijziging.", icon: Ban },
      { title: "Automatische validatie", desc: "Adobe Acrobat valideert automatisch bij openen — wereldwijd herkend.", icon: Eye },
      { title: "Aantoonbaar bewijs", desc: "Tijdstempel en certificaatketen als aantoonbaar bewijs van integriteit.", icon: ShieldCheck },
    ],
    transferInfoTitle: "Ook beschikbaar bij transfers",
    transferInfoDesc: "Bij het verzenden via Certified Delivery of Verified Identity kunt u ervoor kiezen om PDF's server-side te laten verzegelen met een Adobe-vertrouwd certificaat voordat ze end-to-end versleuteld worden verzonden.",
  } : {
    title: "Digitally Seal PDFs",
    subtitle: "Seal PDF documents with an Adobe-trusted certificate — demonstrable proof of integrity, recognized worldwide. Ideal for deeds, contracts, annual reports and financial statements.",
    dropTitle: "Drop PDF files here",
    dropSubtitle: "or click to browse",
    dropAccept: "PDF files only • Max 50MB per file",
    selectFiles: "Select PDFs",
    signAll: "Seal All PDFs",
    filesSelected: "PDF files selected",
    remove: "Remove",
    invalidFile: "Only PDF files are allowed",
    tooLarge: "File is too large (max 50MB)",
    download: "Download",
    downloadAll: "Download All",
    benefitsTitle: "Why Adobe PDF Sealing?",
    benefits: [
      { title: "Every page sealed", desc: "Cryptographically sealed. Any change is immediately visible.", icon: FileLock2 },
      { title: "Tamper detection", desc: "Adobe shows a warning for any modification.", icon: Ban },
      { title: "Automatic validation", desc: "Adobe Acrobat validates automatically upon opening — recognized worldwide.", icon: Eye },
      { title: "Demonstrable proof", desc: "Timestamp and certificate chain as demonstrable proof of integrity.", icon: ShieldCheck },
    ],
    transferInfoTitle: "Also available for transfers",
    transferInfoDesc: "When sending via Certified Delivery or Verified Identity, you can choose to have PDFs sealed server-side with an Adobe-trusted certificate before they are sent end-to-end encrypted.",
  };

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: TrackedFile[] = [];

    for (const f of fileArray) {
      if (f.type !== "application/pdf") {
        toast.error(content.invalidFile);
        continue;
      }
      if (f.size > 50 * 1024 * 1024) {
        toast.error(content.tooLarge);
        continue;
      }
      validFiles.push({ file: f, status: "idle" });
    }

    if (validFiles.length > 0) {
      setTrackedFiles(prev => [...prev, ...validFiles]);
    }
  }, [content]);

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
    setTrackedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownload = (trackedFile: TrackedFile) => {
    const url = URL.createObjectURL(trackedFile.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `signed_${trackedFile.file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    trackedFiles.filter(tf => tf.status === "signed").forEach(tf => handleDownload(tf));
  };

  const handleSignAll = async () => {
    if (trackedFiles.length === 0) return;
    setIsSigning(true);

    // Set all idle files to pending
    setTrackedFiles(prev => prev.map(tf => tf.status === "idle" ? { ...tf, status: "pending" as FileStatus } : tf));

    for (let i = 0; i < trackedFiles.length; i++) {
      if (trackedFiles[i].status !== "idle" && trackedFiles[i].status !== "pending") continue;

      // Set current to signing
      setTrackedFiles(prev => prev.map((tf, idx) => idx === i ? { ...tf, status: "signing" as FileStatus } : tf));

      // Simulate 1-2s delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      // Set to signed (simulate ~95% success)
      const success = Math.random() > 0.05;
      setTrackedFiles(prev => prev.map((tf, idx) => idx === i ? { ...tf, status: success ? "signed" as FileStatus : "error" as FileStatus } : tf));
    }

    setIsSigning(false);
    toast.success(
      language === "nl" ? "Ondertekening voltooid" : "Signing completed"
    );
  };

  const allSigned = trackedFiles.length > 0 && trackedFiles.every(tf => tf.status === "signed");
  const hasSignableFiles = trackedFiles.some(tf => tf.status === "idle");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          {content.title}
        </h2>
        <p className="text-muted-foreground mt-1">{content.subtitle}</p>
      </div>


      {/* Drop Zone */}
      <Card
        className={`p-8 border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? "border-primary bg-accent/50 scale-[1.01]"
            : "border-border hover:border-primary/50 bg-card/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className={`p-4 rounded-full transition-colors ${
            isDragging ? "bg-primary text-primary-foreground" : "bg-accent text-primary"
          }`}>
            <FileText className="h-10 w-10" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">{content.dropTitle}</p>
            <p className="text-sm text-muted-foreground">{content.dropSubtitle}</p>
            <p className="text-xs text-muted-foreground mt-1">{content.dropAccept}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Button type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
            <Upload className="mr-2 h-4 w-4" />
            {content.selectFiles}
          </Button>
        </div>
      </Card>

      {/* File List */}
      {trackedFiles.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <p className="text-sm font-medium">{trackedFiles.length} {content.filesSelected}</p>
            <div className="flex gap-2">
              {allSigned && (
                <Button onClick={handleDownloadAll} size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  {content.downloadAll}
                </Button>
              )}
              {hasSignableFiles && (
                <Button onClick={handleSignAll} disabled={isSigning} size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  {isSigning
                    ? (language === "nl" ? "Ondertekenen..." : "Signing...")
                    : content.signAll}
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {trackedFiles.map((tf, index) => (
              <div
                key={`${tf.file.name}-${index}`}
                className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{tf.file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(tf.file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={tf.status} language={language} />
                  {tf.status === "signed" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-emerald-600 hover:text-emerald-700"
                      onClick={() => handleDownload(tf)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {(tf.status === "idle" || tf.status === "error") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Benefits Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{content.benefitsTitle}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {content.benefits.map((b, i) => (
            <Card key={i} className="p-4 flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <b.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{b.title}</h4>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
