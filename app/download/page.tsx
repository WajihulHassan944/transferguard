'use client';
import {  useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { 
  Download as DownloadIcon, 
  Clock, 
  User, 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Lock, 
  FileText, 
  Image, 
  Video, 
  Music, 
  FileArchive, 
  FileSpreadsheet, 
  Presentation, 
  File,
  ShieldCheck,
  KeyRound,
  MessageSquare,
  ScanFace,
  CreditCard,
  Fingerprint,
  Camera,
  Smartphone,
  QrCode,
  Copy,
  ExternalLink,
  Zap,
  Timer,
  Wifi
} from "lucide-react";
import { formatDistanceToNow, format, isPast } from "date-fns";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface TransferData {
  id: string;
  sender_email: string;
  recipient_email: string;
  recipient_phone: string | null;
  message: string | null;
  expires_at: string;
  downloaded_at: string | null;
  revoked_at: string | null;
  verified_at: string | null;
  created_at: string;
  requires_id_verification?: boolean; // Legal plan - Veriff biometric verification
  id_verified_at?: string | null;
  files: {
    id: string;
    file_name: string;
    file_size: number;
    mime_type: string | null;
  }[];
}

interface BrandingData {
  logo_url: string | null;
  wallpaper_url: string | null;
  brand_color: string | null;
  enabled: boolean;
}

// Default branding - TransferGuard blue
const DEFAULT_BRANDING: BrandingData = {
  logo_url: null,
  wallpaper_url: null,
  brand_color: "hsl(217, 91%, 50%)", // TransferGuard primary blue
  enabled: true,
};

// Demo branding for Professional - Example law firm branding
const DEMO_BRANDING: BrandingData = {
  logo_url: null, // Will show TransferGuard logo as fallback
  wallpaper_url: null,
  brand_color: "hsl(217, 91%, 50%)", // Professional blue
  enabled: true,
};

// Demo branding for Legal - Example notary firm with custom branding
const DEMO_BRANDING_LEGAL: BrandingData = {
  logo_url: null, // Will show TransferGuard logo as fallback  
  wallpaper_url: null,
  brand_color: "hsl(37, 91%, 50%)", // Legal amber/gold
  enabled: true,
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (mimeType: string | null): React.ReactNode => {
  const iconClass = "h-5 w-5";
  if (!mimeType) return <File className={`${iconClass} text-muted-foreground`} />;
  if (mimeType.startsWith("image/")) return <Image className={`${iconClass} text-primary`} />;
  if (mimeType.startsWith("video/")) return <Video className={`${iconClass} text-purple-500`} />;
  if (mimeType.startsWith("audio/")) return <Music className={`${iconClass} text-pink-500`} />;
  if (mimeType.includes("pdf")) return <FileText className={`${iconClass} text-destructive`} />;
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("7z")) return <FileArchive className={`${iconClass} text-legal`} />;
  if (mimeType.includes("word") || mimeType.includes("document")) return <FileText className={`${iconClass} text-primary`} />;
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return <FileSpreadsheet className={`${iconClass} text-success`} />;
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return <Presentation className={`${iconClass} text-legal`} />;
  return <File className={`${iconClass} text-muted-foreground`} />;
};

// Demo data for preview mode - Professional plan (OTP verification)
const DEMO_TRANSFER: TransferData = {
  id: "demo-transfer-id",
  sender_email: "legal@hendriksen-partners.nl",
  recipient_email: "jan.de.vries@klant.nl",
  recipient_phone: null,
  message: "Beste Jan,\n\nHierbij de contractdocumenten voor het nieuwe project. Graag voor vrijdag ondertekend retour.\n\nMet vriendelijke groet,\nMr. Hendriksen",
  expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  downloaded_at: null,
  revoked_at: null,
  verified_at: null,
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  requires_id_verification: false,
  id_verified_at: null,
  files: [
    { id: "1", file_name: "Contract_Draft_V3.pdf", file_size: 2500000, mime_type: "application/pdf" },
    { id: "2", file_name: "NDA_Agreement_2025.pdf", file_size: 1200000, mime_type: "application/pdf" },
    { id: "3", file_name: "Financial_Overview.xlsx", file_size: 850000, mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  ],
};

// Demo data for Legal plan - Identity verification required
const DEMO_TRANSFER_LEGAL: TransferData = {
  id: "demo-transfer-legal-id",
  sender_email: "advocaat@dewit-legal.nl",
  recipient_email: "client@bedrijf.nl",
  recipient_phone: null,
  message: "Geachte heer/mevrouw,\n\nBijgevoegd treft u de notariële akte aan. Ter bevestiging van ontvangst is paspoort verificatie vereist.\n\nMet vriendelijke groet,\nMr. De Wit",
  expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  downloaded_at: null,
  revoked_at: null,
  verified_at: null,
  created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  requires_id_verification: true,
  id_verified_at: null,
  files: [
    { id: "1", file_name: "Notariele_Akte_2025.pdf", file_size: 3200000, mime_type: "application/pdf" },
    { id: "2", file_name: "Bijlagen_Overeenkomst.pdf", file_size: 1800000, mime_type: "application/pdf" },
  ],
};

export default function Download() {
  const token = "demo";
  
  // Support both /download/demo and /demo/download routes
  // Check if current path is a demo route
  const pathname = window.location.pathname;
  const isNoTokenDemo = !token && pathname.includes('/download');
  const isDemoLegalPath = pathname === '/demo/download-legal';
  
  const isDemo = token === "demo" || (isNoTokenDemo && !isDemoLegalPath);
//   const isDemoLegal = token === "demo-legal" || isDemoLegalPath;
   const isDemoLegal = false;
  // Determine which demo data to use
  const getDemoTransfer = () => {
    if (isDemoLegal) return DEMO_TRANSFER_LEGAL;
    if (isDemo) return DEMO_TRANSFER;
    return null;
  };

  // Determine which demo branding to use
  const getDemoBranding = () => {
    if (isDemoLegal) return DEMO_BRANDING_LEGAL;
    if (isDemo) return DEMO_BRANDING;
    return null;
  };
  
  const [transfer, setTransfer] = useState<TransferData | null>(getDemoTransfer());
  const [branding, setBranding] = useState<BrandingData | null>(getDemoBranding());
  const [loading, setLoading] = useState(!isDemo && !isDemoLegal);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  
  // Verification state
  const [isVerified, setIsVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [receiptAccepted, setReceiptAccepted] = useState(false);
  const [verifying, setVerifying] = useState(false);
  
  // ID Verification state (Veriff)
  const [idVerificationStep, setIdVerificationStep] = useState<'intro' | 'mobile-transition' | 'waiting-mobile' | 'scanning' | 'selfie' | 'processing' | 'complete'>('intro');
  const [idVerificationProgress, setIdVerificationProgress] = useState(0);
  const [verificationLink, setVerificationLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);


  const handleVerify = async () => {
    if (otpCode.length !== 6 || !termsAccepted) return;
    
    setVerifying(true);
    
    // Simulate verification (in production, this would verify against backend)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, accept any 6-digit code
    setIsVerified(true);
    setVerifying(false);
  };

  // Handle ID Verification (Veriff) flow - Start with mobile transition
  const handleStartIdVerification = async () => {
    if (!termsAccepted) return;
    
    // Generate a mock verification link
    const mockLink = `https://verify.transferguard.app/v/${transfer?.id?.slice(0, 8) || 'demo'}`;
    setVerificationLink(mockLink);
    setIdVerificationStep('mobile-transition');
  };

  // Handle copy link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // Handle continue on desktop
  const handleContinueOnDesktop = async () => {
    setIdVerificationStep('scanning');
    await runVerificationFlow();
  };

  // Handle mobile session started (mock)
  const handleMobileSessionStarted = async () => {
    setIdVerificationStep('waiting-mobile');
    
    // Simulate waiting for mobile verification
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate mobile completing verification
    setIdVerificationStep('processing');
    setIdVerificationProgress(75);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIdVerificationProgress(100);
    setIdVerificationStep('complete');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsVerified(true);
  };

  // Run the verification flow (desktop path)
  const runVerificationFlow = async () => {
    setIdVerificationProgress(0);
    
    // Simulate ID scanning
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIdVerificationProgress(33);
    setIdVerificationStep('selfie');
    
    // Simulate selfie capture
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIdVerificationProgress(66);
    setIdVerificationStep('processing');
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIdVerificationProgress(100);
    setIdVerificationStep('complete');
    
    // Mark as verified
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsVerified(true);
  };

  const handleDownload = async () => {
    if (!transfer) return;

    setDownloading(true);
      setDownloading(false);
    
  };

  const isExpired = transfer ? isPast(new Date(transfer.expires_at)) : false;
  const totalSize = transfer?.files.reduce((acc, file) => acc + file.file_size, 0) || 0;
  const canVerify = otpCode.length === 6 && termsAccepted;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Establishing secure connection...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !transfer) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center px-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/assets/transferguard-logo-transparent.png" alt="TransferGuard" className="h-8 object-contain" />
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-destructive/30">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-xl font-bold mb-2 text-foreground">Access Denied</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button asChild variant="outline">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Expired state
  if (isExpired) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center px-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="/assets/transferguard-logo-transparent.png" alt="TransferGuard" className="h-8 object-contain" />
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-legal/30">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-legal-light flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-legal" />
              </div>
              <h1 className="text-xl font-bold mb-2 text-foreground">Link Expired</h1>
              <p className="text-muted-foreground mb-2">
                This secure download link expired on
              </p>
              <p className="text-foreground font-medium mb-6">
                {format(new Date(transfer.expires_at), "MMMM d, yyyy 'at' HH:mm")}
              </p>
              <Button asChild variant="outline">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

// Generate branded styles
  const getBrandedStyles = () => {
    if (!branding?.brand_color || !branding.enabled) return {};
    return {
      '--brand-color': branding.brand_color,
      '--brand-color-light': branding.brand_color.replace(')', ', 0.1)').replace('hsl', 'hsla'),
      '--brand-color-dark': branding.brand_color.replace(/(\d+)%\)$/, (_, l) => `${Math.max(0, parseInt(l) - 15)}%)`),
    } as React.CSSProperties;
  };

  const hasBranding = branding?.enabled && branding?.brand_color;

  // Always use the primary blue background as default
  const defaultBrandColor = "hsl(217, 91%, 50%)";
  const activeBrandColor = branding?.brand_color || defaultBrandColor;
  const lightBrandColor = activeBrandColor.replace(/(\d+)%\)$/, (_, l) => `${Math.min(98, parseInt(l) + 45)}%)`);

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        ...getBrandedStyles(),
        background: `linear-gradient(135deg, ${lightBrandColor} 0%, hsl(0 0% 100%) 50%)`,
      }}
    >
      {/* White Header with Client Logo (White-Label) */}
      <header className="border-b border-border sticky top-0 z-50 bg-white">
        <div className="container flex h-20 items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto">
          {/* Client Logo - White Label */}
          <div className="flex items-center gap-2">
            {branding?.logo_url ? (
              <img src={branding.logo_url} alt="Company logo" className="h-14 max-w-[220px] object-contain" />
            ) : (
              <img src="/assets/transferguard-logo-transparent.png" alt="TransferGuard" className="h-14 object-contain" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary">
            <Lock className="h-3.5 w-3.5" />
            <span className="font-medium">Secure Connection</span>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout on Desktop */}
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Content Container - White background to separate from branded background */}
          <Card className="border-border shadow-lg bg-white p-6 lg:p-8">
            {/* Page Title & Instructions */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Secure Files Ready for Download
              </h1>
              <p className="text-muted-foreground">
                {isVerified 
                  ? "Your identity has been verified. You can now download the files below."
                  : "Verify your identity to access the encrypted files sent to you."
                }
              </p>
            </div>

          {/* Verified Banner - Full width */}
          {isVerified && (
            <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-success-light border border-success-border mb-6">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-success">Identity Verified. Secure Connection Established.</p>
                <p className="text-xs text-success/80">TLS 1.3 • AES-256 Encryption</p>
              </div>
            </div>
          )}

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Left Column - Sender Info & Message */}
            <div className="space-y-4 lg:space-y-6">
              {/* Sender Card */}
              <Card className="border-border shadow-soft">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Secure transfer from</p>
                      <p className="font-semibold text-foreground truncate text-lg">{transfer.sender_email}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sent {formatDistanceToNow(new Date(transfer.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Message Card - Only show after verification */}
              {isVerified && transfer.message && (
                <Card className="border-border shadow-soft">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-3 mb-3">
                      <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                      <p className="text-sm font-semibold text-foreground">Message from sender</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-5 border border-border">
                      <p className="text-foreground whitespace-pre-wrap leading-relaxed">{transfer.message}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Trust & Security Info */}
              <Card className="border-border shadow-soft bg-muted/20">
                <CardContent className="pt-5 pb-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Security & Compliance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4 text-primary/70" />
                      <span>End-to-End Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-lg">🇪🇺</span>
                      <span>EU Data Storage</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-primary/70" />
                      <span>ISO 27001 Certified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 text-legal" />
                      <span>Audit Trail Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Files or Verification */}
            <div className="space-y-4 lg:space-y-6">
              {/* Files Card - Only show when verified */}
              {isVerified && (
                <Card className="border-border shadow-soft overflow-hidden">
                  {/* Header */}
                  <div className="bg-muted/50 px-5 py-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <h2 className="font-semibold text-foreground">
                          {transfer.files.length} {transfer.files.length === 1 ? "File" : "Files"} Ready
                        </h2>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Expires {formatDistanceToNow(new Date(transfer.expires_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>

                  {/* File List */}
                  <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
                    {transfer.files.map((file) => (
                      <div key={file.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0 border border-border">
                          {getFileIcon(file.mime_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{file.file_name}</p>
                          <p className="text-sm text-muted-foreground">{formatFileSize(file.file_size)}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-success">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Receipt Agreement & Download Button */}
                  <div className="p-5 border-t border-border bg-muted/30 space-y-4">
                    {/* Receipt Agreement Checkbox */}
                    {!downloadComplete && (
                      <div 
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          receiptAccepted 
                            ? 'bg-success-light border-success ring-2 ring-success/20' 
                            : 'bg-white border-border hover:border-primary/50'
                        }`}
                        onClick={() => setReceiptAccepted(!receiptAccepted)}
                      >
                        <Checkbox 
                          id="receipt-agreement" 
                          checked={receiptAccepted}
                          onCheckedChange={(checked) => setReceiptAccepted(checked as boolean)}
                          className={`mt-0.5 h-5 w-5 border-2 ${
                            receiptAccepted 
                              ? 'border-success data-[state=checked]:bg-success data-[state=checked]:text-success-foreground' 
                              : 'border-muted-foreground/50'
                          }`}
                        />
                        <label htmlFor="receipt-agreement" className="text-sm leading-relaxed cursor-pointer flex-1">
                          <span className={receiptAccepted ? 'text-success font-medium' : 'text-foreground font-medium'}>
                            Ik bevestig de ontvangst van deze bestanden
                          </span>
                          <span className={`block mt-1 ${receiptAccepted ? 'text-success/80' : 'text-muted-foreground'}`}>
                            Door te downloaden ga ik akkoord met de ontvangst en wordt dit geregistreerd als juridisch bewijs.
                          </span>
                        </label>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total download size</span>
                      <span className="font-semibold text-foreground">{formatFileSize(totalSize)}</span>
                    </div>
                    {downloadComplete ? (
                      <div className="flex items-center justify-center gap-2 text-success py-3 bg-success-light rounded-xl">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Download initiated successfully</span>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleDownload}
                        disabled={downloading || !receiptAccepted}
                        className="w-full h-14 bg-cta hover:bg-cta/90 text-cta-foreground font-semibold text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        size="lg"
                      >
                        {downloading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Decrypting files...
                          </>
                        ) : (
                          <>
                            <DownloadIcon className="mr-2 h-5 w-5" />
                            {receiptAccepted ? 'Download All Files' : 'Accept Receipt to Download'}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Card>
              )}

              {/* Verification Card - Show when locked */}
              {!isVerified && (
                <Card className="border-border shadow-soft overflow-hidden">
                  {/* Header */}
                  <div className={`px-5 py-4 border-b ${transfer.requires_id_verification ? 'bg-amber-50 border-amber-200' : 'bg-primary/5 border-primary/10'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transfer.requires_id_verification ? 'bg-amber-100' : 'bg-primary/10'}`}>
                        {transfer.requires_id_verification ? (
                          <Fingerprint className="h-5 w-5 text-amber-600" />
                        ) : (
                          <Lock className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-semibold text-foreground">
                            {transfer.files.length} Encrypted {transfer.files.length === 1 ? "File" : "Files"}
                          </h2>
                          {transfer.requires_id_verification && (
                            <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                              LEGAL
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Total size: {formatFileSize(totalSize)}</p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="pt-8 pb-8">
                    {/* ID Verification Flow (Legal Plan) */}
                    {transfer.requires_id_verification ? (
                      <div className="text-center space-y-6">
                        {/* Intro Step */}
                        {idVerificationStep === 'intro' && (
                          <>
                            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                              <ScanFace className="h-10 w-10 text-amber-600" />
                            </div>
                            
                            <div>
                              <h3 className="text-xl font-semibold text-foreground mb-2">Identity-Verified Delivery</h3>
                              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                The sender requires biometric verification to confirm your identity before granting access.
                              </p>
                            </div>

                            {/* Verification Steps Preview */}
                            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                              <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                                <CreditCard className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                                <p className="text-xs font-medium text-foreground">Scan ID</p>
                                <p className="text-xs text-muted-foreground">Passport or ID card</p>
                              </div>
                              <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                                <Camera className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                                <p className="text-xs font-medium text-foreground">Take Selfie</p>
                                <p className="text-xs text-muted-foreground">Live photo</p>
                              </div>
                              <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                                <ShieldCheck className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                                <p className="text-xs font-medium text-foreground">Verified</p>
                                <p className="text-xs text-muted-foreground">Biometric match</p>
                              </div>
                            </div>

                            {/* eIDAS Compliance Note */}
                            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200/50 max-w-md mx-auto">
                              <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div className="text-left">
                                  <p className="text-sm font-semibold text-amber-800">eIDAS Compliant Verification</p>
                                  <p className="text-xs text-amber-700/80 mt-1">
                                    Your identity data is processed in accordance with EU Regulation No 910/2014 and deleted after verification.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className={`flex items-start gap-4 text-left rounded-xl p-5 max-w-sm mx-auto border-2 transition-all cursor-pointer ${
                              termsAccepted 
                                ? 'bg-success-light border-success ring-2 ring-success/20' 
                                : 'bg-muted/30 border-border hover:border-amber-400'
                            }`}
                              onClick={() => setTermsAccepted(!termsAccepted)}
                            >
                              <Checkbox 
                                id="terms-id" 
                                checked={termsAccepted}
                                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                                className={`mt-0.5 h-5 w-5 border-2 ${
                                  termsAccepted 
                                    ? 'border-success data-[state=checked]:bg-success data-[state=checked]:text-success-foreground' 
                                    : 'border-muted-foreground/50'
                                }`}
                              />
                              <label htmlFor="terms-id" className="text-sm leading-relaxed cursor-pointer">
                                <span className={termsAccepted ? 'text-success font-medium' : 'text-foreground'}>I agree to the </span>
                                <Link href="/terms" className="text-primary font-semibold hover:underline">Terms of Service</Link>
                                <span className={termsAccepted ? 'text-success font-medium' : 'text-foreground'}> & </span>
                                <Link href="/privacy" className="text-primary font-semibold hover:underline">Confidentiality Policy</Link>
                              </label>
                            </div>

                            {/* Start Verification Button */}
                            <Button 
                              onClick={handleStartIdVerification}
                              disabled={!termsAccepted}
                              className="w-full max-w-sm h-14 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <ScanFace className="mr-2 h-5 w-5" />
                              Start Identity Verification
                            </Button>
                          </>
                        )}

                        {/* Mobile Transition Step */}
                        {idVerificationStep === 'mobile-transition' && (
                          <div className="space-y-6">
                            {/* Header */}
                            <div className="text-center">
                              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Smartphone className="h-8 w-8 text-primary" />
                              </div>
                              <h3 className="text-xl font-semibold text-foreground mb-2">Continue on your mobile device</h3>
                              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                Scanning your ID and taking a liveness selfie is faster and more accurate on a smartphone camera.
                              </p>
                            </div>

                            {/* QR Code & Instructions Grid */}
                            <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
                              {/* QR Code Side */}
                              <div className="bg-white rounded-2xl p-6 border-2 border-border shadow-soft">
                                <div className="aspect-square bg-muted/30 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                                  {/* QR Code Placeholder with pattern */}
                                  <div className="absolute inset-4 grid grid-cols-8 grid-rows-8 gap-1">
                                    {Array.from({ length: 64 }).map((_, i) => (
                                      <div 
                                        key={i} 
                                        className={`rounded-sm ${
                                          Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white p-2 rounded-lg shadow-lg">
                                      <QrCode className="h-8 w-8 text-primary" />
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs text-center text-muted-foreground">
                                  Scan with your phone camera
                                </p>
                              </div>

                              {/* Instructions Side */}
                              <div className="space-y-4">
                                {/* Features */}
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3 p-3 rounded-xl bg-success-light border border-success-border">
                                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                                      <Zap className="h-4 w-4 text-success" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-foreground">95% success rate on mobile</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <Timer className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-foreground">Average time: 6 seconds</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                      <Wifi className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-foreground">Secure, encrypted connection</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Copy Link Button */}
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={handleCopyLink}
                                >
                                  {linkCopied ? (
                                    <>
                                      <CheckCircle2 className="mr-2 h-4 w-4 text-success" />
                                      Link Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="mr-2 h-4 w-4" />
                                      Copy Link
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Demo: Simulate mobile session button */}
                            <div className="text-center">
                              <Button
                                onClick={handleMobileSessionStarted}
                                variant="default"
                                className="bg-primary hover:bg-primary/90"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Simulate Mobile Session Started
                              </Button>
                            </div>

                            {/* Continue on Desktop Link */}
                            <div className="text-center">
                              <button 
                                onClick={handleContinueOnDesktop}
                                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                              >
                                I'd rather continue on this device
                              </button>
                            </div>

                            {/* Trust Footer */}
                            <div className="bg-muted/30 rounded-xl p-4 border border-border max-w-md mx-auto">
                              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <Shield className="h-4 w-4 text-primary" />
                                <span>eIDAS Compliant & GDPR Protected.</span>
                              </div>
                              <p className="text-xs text-center text-muted-foreground mt-1">
                                Your biometric data is purged immediately after verification.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Waiting for Mobile Step */}
                        {idVerificationStep === 'waiting-mobile' && (
                          <>
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto relative">
                              <Smartphone className="h-10 w-10 text-primary" />
                              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-foreground mb-2">Waiting for mobile...</h3>
                              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                Complete the verification on your mobile device. This page will update automatically.
                              </p>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <div className="bg-success-light rounded-xl p-4 border border-success-border max-w-sm mx-auto">
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-success">Mobile session connected</p>
                                  <p className="text-xs text-success/80">Verification in progress...</p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Scanning Step */}
                        {idVerificationStep === 'scanning' && (
                          <>
                            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto animate-pulse">
                              <CreditCard className="h-10 w-10 text-amber-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-foreground mb-2">Scanning ID Document</h3>
                              <p className="text-sm text-muted-foreground">
                                Please hold your passport or ID card in front of the camera...
                              </p>
                            </div>
                            <div className="w-full max-w-sm mx-auto bg-muted/50 rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 transition-all duration-500" 
                                style={{ width: `${idVerificationProgress}%` }}
                              />
                            </div>
                          </>
                        )}

                        {/* Selfie Step */}
                        {idVerificationStep === 'selfie' && (
                          <>
                            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto animate-pulse">
                              <Camera className="h-10 w-10 text-amber-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-foreground mb-2">Taking Live Selfie</h3>
                              <p className="text-sm text-muted-foreground">
                                Please look directly at the camera for biometric matching...
                              </p>
                            </div>
                            <div className="w-full max-w-sm mx-auto bg-muted/50 rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 transition-all duration-500" 
                                style={{ width: `${idVerificationProgress}%` }}
                              />
                            </div>
                          </>
                        )}

                        {/* Processing Step */}
                        {idVerificationStep === 'processing' && (
                          <>
                            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                              <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-foreground mb-2">Verifying Identity</h3>
                              <p className="text-sm text-muted-foreground">
                                AI is comparing your selfie with your ID photo...
                              </p>
                            </div>
                            <div className="w-full max-w-sm mx-auto bg-muted/50 rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 transition-all duration-500" 
                                style={{ width: `${idVerificationProgress}%` }}
                              />
                            </div>
                          </>
                        )}

                        {/* Complete Step */}
                        {idVerificationStep === 'complete' && (
                          <>
                            <div className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mx-auto">
                              <CheckCircle2 className="h-10 w-10 text-success" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-success mb-2">Identity Verified!</h3>
                              <p className="text-sm text-muted-foreground">
                                Your identity has been confirmed. Unlocking files...
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      /* OTP Verification Flow (Professional Plan) */
                      <div className="text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                          <KeyRound className="h-8 w-8 text-primary" />
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">Two-Factor Verification</h3>
                          <p className="text-sm text-muted-foreground">
                            Enter the security code sent to
                          </p>
                          <p className="text-sm font-semibold text-foreground mt-1">{transfer.recipient_email}</p>
                        </div>

                        {/* OTP Input */}
                        <div className="flex justify-center pt-2">
                          <InputOTP 
                            maxLength={6} 
                            value={otpCode} 
                            onChange={setOtpCode}
                            className="gap-2"
                          >
                            <InputOTPGroup className="gap-2">
                              <InputOTPSlot index={0} className="w-12 h-14 bg-muted/50 border-border text-foreground text-xl font-semibold rounded-lg" />
                              <InputOTPSlot index={1} className="w-12 h-14 bg-muted/50 border-border text-foreground text-xl font-semibold rounded-lg" />
                              <InputOTPSlot index={2} className="w-12 h-14 bg-muted/50 border-border text-foreground text-xl font-semibold rounded-lg" />
                              <InputOTPSlot index={3} className="w-12 h-14 bg-muted/50 border-border text-foreground text-xl font-semibold rounded-lg" />
                              <InputOTPSlot index={4} className="w-12 h-14 bg-muted/50 border-border text-foreground text-xl font-semibold rounded-lg" />
                              <InputOTPSlot index={5} className="w-12 h-14 bg-muted/50 border-border text-foreground text-xl font-semibold rounded-lg" />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>

                        {/* Terms Checkbox */}
                        <div className={`flex items-start gap-4 text-left rounded-xl p-5 max-w-sm mx-auto border-2 transition-all cursor-pointer ${
                          termsAccepted 
                            ? 'bg-success-light border-success ring-2 ring-success/20' 
                            : 'bg-muted/30 border-border hover:border-primary/50'
                        }`}
                          onClick={() => setTermsAccepted(!termsAccepted)}
                        >
                          <Checkbox 
                            id="terms" 
                            checked={termsAccepted}
                            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                            className={`mt-0.5 h-5 w-5 border-2 ${
                              termsAccepted 
                                ? 'border-success data-[state=checked]:bg-success data-[state=checked]:text-success-foreground' 
                                : 'border-muted-foreground/50'
                            }`}
                          />
                          <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                            <span className={termsAccepted ? 'text-success font-medium' : 'text-foreground'}>I agree to the </span>
                            <Link href="/terms" className="text-primary font-semibold hover:underline" >Terms of Service</Link>
                            <span className={termsAccepted ? 'text-success font-medium' : 'text-foreground'}> & </span>
                            <Link href="/privacy" className="text-primary font-semibold hover:underline">Confidentiality Policy</Link>
                          </label>
                        </div>
                        
                        {/* Helper text when not checked */}
                        {!termsAccepted && otpCode.length === 6 && (
                          <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Please accept the terms to continue
                          </p>
                        )}

                        {/* Verify Button */}
                        <Button 
                          onClick={handleVerify}
                          disabled={!canVerify || verifying}
                          className="w-full max-w-sm h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {verifying ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="mr-2 h-5 w-5" />
                              Verify & Unlock Files
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          </Card>
        </div>
      </main>

      {/* Footer - Powered by TransferGuard (always visible, small) */}
      <footer className="py-4 bg-transparent">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <p>
              Powered by{" "}
              <Link href="/" className="text-primary hover:underline font-medium">
                TransferGuard
              </Link>
              {" "}• Registered File Transfer
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
