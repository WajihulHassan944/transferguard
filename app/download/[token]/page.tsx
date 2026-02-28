"use client"
import SignatureCanvas from "react-signature-canvas";

import {
    AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { baseUrl } from "@/const"
import { toast } from "sonner";
const defaultBrandColor = "hsl(217, 91%, 50%)"

const activeBrandColor = defaultBrandColor
const lightBrandColor = activeBrandColor.replace(
  /(\d+)%\)$/,
  (_, l) => `${Math.min(98, parseInt(l) + 45)}%)`
)

const page = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter()
  const params = useParams();
const token = Array.isArray(params?.token)
  ? params.token[0]
  : params?.token ?? "";
const [signatureData, setSignatureData] = useState<string | null>(null);
 const [receiptSign, setReceiptSign] = useState(false); 
const [transfer, setTransfer] = useState<any>(null)
const [resending, setResending] = useState(false)
const [cooldown, setCooldown] = useState(0)
const [smsVerificationPhase, setSmsVerificationPhase] = useState<'email' | 'sms'>('email');
  const [emailVerified, setEmailVerified] = useState(false);
  const [sigPad, setSigPad] = useState<SignatureCanvas | null>(null);
const [signatureEmpty, setSignatureEmpty] = useState(true);
const [otpCode, setOtpCode] = useState("")
const [loading, setLoading] = useState(false)
const [loadingUI, setLoadingUI] = useState(true)
const [error, setError] = useState("")

React.useEffect(() => {
  const loadTransfer = async () => {
    try {
      const res = await fetch(`${baseUrl}/transfers/public/${token}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.message)
// After loading transfer from backend
setTransfer(data);
setEmailVerified(data.emailVerified || false);

// Update SMS verification phase based on emailVerified
if (data.verificationMethod === "email_sms") {
  setSmsVerificationPhase(data.emailVerified ? "sms" : "email");
}
    } catch (err: any) {
      setError(err.message || "Invalid link")
    } finally {
      setLoadingUI(false)
    }
  }

  loadTransfer()
}, [token])
// Send OTP automatically if not already sent
React.useEffect(() => {
  const sendOtpIfNull = async () => {
    if (!transfer || transfer.otpCode) return; // only if transfer exists and otp_code is null

    try {
      setResending(true); // show loading for OTP send
      const res = await fetch(`${baseUrl}/transfers/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      console.log("📨 OTP sent automatically:", data.message);

      // start 30s cooldown after automatic send
      setCooldown(30);
    } catch (err: any) {
      console.error("❌ Automatic OTP send failed:", err.message || err);
      setError(err.message || "Failed to send OTP automatically");
    } finally {
      setResending(false);
    }
  };

  sendOtpIfNull();
}, [transfer, token]);

React.useEffect(() => {
  if (cooldown <= 0) return

  const timer = setInterval(() => {
    setCooldown((c) => c - 1)
  }, 1000)

  return () => clearInterval(timer)
}, [cooldown])


const handleVerify = async () => {
  if (otpCode.length !== 6 || !termsAccepted) return;

  try {
    setLoading(true);
    setError("");

    const res = await fetch(`${baseUrl}/transfers/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        otp: otpCode,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // ✅ Show success toast
    toast.success(data.message || "OTP verified successfully");

    // If email_sms → move to SMS step
    if (data.step === "sms") {
      setOtpCode(""); // clear previous OTP
      return;
    }

    // If verification fully completed
    if (data.step === "completed") {
      setReceiptSign(true);
    }

  } catch (err: any) {
    setError(err.message || "Verification failed");
    toast.error(err.message || "Verification failed");
  } finally {
    setLoading(false);
  }
};

const handleResendOtp = async () => {
  if (resending || cooldown > 0) return

  try {
    setResending(true)
    setError("")

    const res = await fetch(`${baseUrl}/transfers/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to resend OTP")

    // start 30s cooldown
    setCooldown(30)
  } catch (err: any) {
    setError(err.message || "Failed to resend OTP")
  } finally {
    setResending(false)
  }
}


 if (loadingUI) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Establishing secure connection...</p>
        </div>
      </div>
    );
  }

if (!loadingUI && error && !transfer) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-10 text-center max-w-md shadow-soft">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Invalid or Expired Link</h2>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>

        <Button onClick={() => router.push("/")} className="w-full">
          Go Home
        </Button>
      </Card>
    </div>
  )
}

    return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${lightBrandColor} 0%, hsl(0 0% 100%) 50%)`,
      }}
    >
      {/* ================= HEADER ================= */}
      <header className="border-b border-border sticky top-0 z-50 bg-white">
        <div className="container flex h-20 items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto">
          <img
            src="/assets/transferguard-logo-new.png"
            alt="TransferGuard"
            className="h-14 object-contain"
          />

          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary">
            <Lock className="h-3.5 w-3.5" />
            <span className="font-medium">Secure Connection</span>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 ">
        <div className="max-w-7xl mx-auto   border shadow-lg bg-white p-6 lg:p-8 mt-9 rounded-2xl mb-15">
          {/* Title */}
          <div className="text-center mb-12">
             <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Secure Files Ready for Download
              </h1>
              <p className="text-muted-foreground">
              Verify your identity to access the encrypted files sent to you.
            </p>
          </div>

          {/* Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* ================= LEFT COLUMN ================= */}
            <div className="space-y-6">
              {/* Sender card */}
                <Card className="border-border shadow-soft">
                <CardContent className="p-6 flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Secure transfer from</p>
                      <p className="font-semibold text-foreground truncate text-lg">
                      {transfer?.senderEmail}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                     Sent {transfer?.createdAt ? new Date(transfer.createdAt).toLocaleString() : ""}

                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Compliance */}
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

            {/* ================= RIGHT COLUMN ================= */}
               <Card className="border-border shadow-soft ">
         {receiptSign && (
  <CardContent className="pt-0 pb-6 px-0 mx-0">
    <div className="flex items-center gap-4 border-b p-4 bg-primary/5 border-primary/10 mb-12 rounded-t-lg">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Lock className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="font-semibold">{transfer?.fileLabel || "Encrypted Files"}</p>
        <p className="text-sm text-muted-foreground">{transfer?.sizeLabel || ""}</p>
      </div>
    </div>

    <div className="text-center space-y-6">
      <h3 className="text-xl font-semibold text-foreground mb-2">Confirm Receipt</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        To access the encrypted files, confirm that you are the recipient.
      </p>

      {transfer?.agreementType === "one_click" ? (
        <>
          {/* One-Click Agreement */}
          <div
            className={`flex items-start gap-4 text-left rounded-xl p-5 max-w-md mx-auto border-2 transition-all cursor-pointer ${
              signatureData
                ? "bg-success-light border-success ring-2 ring-success/20"
                : "bg-muted/30 border-border hover:border-primary/50"
            }`}
            onClick={() =>
              setSignatureData(signatureData ? null : "agreement-accepted")
            }
          >
            <Checkbox
              id="receipt-agreement"
              checked={!!signatureData}
              onCheckedChange={(checked) =>
                setSignatureData(checked ? "agreement-accepted" : null)
              }
              className={`mt-0.5 h-5 w-5 border-2 ${
                signatureData
                  ? "border-success data-[state=checked]:bg-success data-[state=checked]:text-success-foreground"
                  : "border-muted-foreground/50"
              }`}
            />
            <label htmlFor="receipt-agreement" className="flex-1 cursor-pointer">
              <p
                className={`text-sm font-medium ${
                  signatureData ? "text-success" : "text-foreground"
                }`}
              >
                I confirm receipt of these files
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                By confirming, you agree to the recording of this moment as proof of receipt.
              </p>
            </label>
          </div>

          <Button
            onClick={async () => {
              if (!signatureData) return;
              try {
                setLoading(true);
                const res = await fetch(`${baseUrl}/transfers/agree`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token, oneClickAgreementDone: true }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                router.push(data.redirectUrl);
              } catch (err: any) {
                setError(err.message || "Failed to confirm agreement");
              } finally {
                setLoading(false);
              }
            }}
            disabled={!signatureData || loading}
            className="w-full max-w-md h-14 bg-cta hover:bg-cta/90 text-cta-foreground font-semibold text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Confirm & Unlock Files"}
          </Button>
        </>
      ) : (
        <>
         {/* Digital Signature Canvas */}
<div className="max-w-md mx-auto border rounded-xl p-5 bg-muted/20 space-y-4">

  <div className="text-center space-y-2">
    <p className="text-md font-semibold text-foreground">
      Signature Required by Sender
    </p>
    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
      Please provide your digital signature to confirm receipt of these files.
      Your signature will be recorded as proof of delivery.
    </p>
  </div>

  <div className="flex justify-center">
    <SignatureCanvas
      penColor="black"
      canvasProps={{
        width: 350,
        height: 150,
        className: "bg-white rounded-lg border w-full max-w-sm",
      }}
      ref={(ref) => setSigPad(ref)}
      onEnd={() => setSignatureEmpty(false)}
    />
  </div>

  <div className="flex justify-between mt-2">
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        sigPad?.clear();
        setSignatureEmpty(true);
      }}
    >
      Clear
    </Button>

    <Button
      size="sm"
      onClick={async () => {
        if (!sigPad || sigPad.isEmpty()) return;
        if (!token) {
          setError("Invalid token");
          return;
        }

        try {
          setLoading(true);

        const blob = await new Promise<Blob | null>((resolve) => {
  sigPad
    ?.getTrimmedCanvas()
    .toBlob((b) => resolve(b), "image/png");
});
          if (!blob) throw new Error("Failed to capture signature");

          const formData = new FormData();
          formData.append("token", token);
          formData.append("signature", blob, "signature.png");

          const res = await fetch(`${baseUrl}/transfers/agree`, {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message);

          router.push(data.redirectUrl);
        } catch (err: any) {
          setError(err.message || "Failed to upload signature");
        } finally {
          setLoading(false);
        }
      }}
      disabled={signatureEmpty || loading}
    >
      {loading ? "Uploading..." : "Confirm & Unlock Files"}
    </Button>
  </div>
</div>
        </>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  </CardContent>
)}
           {!receiptSign && ( 
               <CardContent className="pt-0 pb-6 px-0 mx-0">
                 <div className="flex items-center gap-4 border-b p-4 bg-primary/5 border-primary/10 mb-12 " style={{borderTopLeftRadius:'15px',borderTopRightRadius:'15px'}}>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                     <p className="font-semibold">
      {transfer?.fileLabel || "Encrypted Files"}
    </p>
    <p className="text-sm text-muted-foreground">
      {transfer?.sizeLabel || ""}
    </p>
                  </div>
                </div>
<center>{transfer?.verificationMethod === "email_sms" && (
                          <div className="flex items-center justify-center gap-2 max-w-sm mx-auto mb-15">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                              smsVerificationPhase === 'email' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-success-light text-success'
                            }`}>
                              {emailVerified ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span>1</span>}
                              <span>Email</span>
                            </div>
                            <div className="w-6 h-0.5 bg-border" />
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                              smsVerificationPhase === 'sms' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              <span>2</span>
                              <span>SMS</span>
                            </div>
                          </div>
                        )}
</center>
                <div className="text-center space-y-5">
  
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <KeyRound className="h-7 w-7 text-primary" />
                  </div>

    <div>
                   <h3 className="text-xl font-semibold">
  {transfer?.verificationMethod === "email_sms"
    ? smsVerificationPhase === "email"
      ? "Step 1: Email Verification"
      : "Step 2: SMS Verification"
    : "Two-Factor Verification"}
</h3>
<p className="text-muted-foreground text-sm mt-1">
  Enter the security code sent to
</p>
<p className="font-medium">
  {smsVerificationPhase === "email"
    ? transfer?.recipientEmail
    : transfer?.recipientPhone}
</p>
    </div>

                  {/* OTP inputs */}
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

                        <div className="flex justify-center">
  <button
    type="button"
    onClick={handleResendOtp}
    disabled={resending || cooldown > 0}
    className="text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {resending
      ? "Resending OTP..."
      : cooldown > 0
      ? `Resend OTP in ${cooldown}s`
      : "Didn’t receive the code? Resend OTP"}
  </button>
</div>


{error && (
  <p className="text-sm text-red-500 font-medium">{error}</p>
)}

                  {/* checkbox */}
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
                  {/* button */}
                  <Button
  onClick={handleVerify}
  disabled={!termsAccepted || otpCode.length !== 6 || loading || !transfer}
  className="mb-10 w-full max-w-sm h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
>
  {loading ? (
    "Verifying..."
  ) : (
    <>
      <ShieldCheck className="mr-2 h-5 w-5" />
      Verify & Unlock Files
    </>
  )}
</Button>

                </div>
               </CardContent> )}
            </Card>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="py-4 bg-transparent">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <p>
              Powered by{" "}
              <Link
                href="/"
                className="text-primary hover:underline font-medium"
              >
                TransferGuard
              </Link>{" "}
              • Registered File Transfer
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Item({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-muted-foreground">{text}</span>
    </div>
  )
}

export default page
