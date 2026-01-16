import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Shield, Smartphone, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MFAEnrollmentProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function MFAEnrollment({ onComplete, onSkip }: MFAEnrollmentProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    startEnrollment();
  }, []);

  const startEnrollment = async () => {
    setEnrolling(true);
      setEnrolling(false);
  };

  const verifyAndActivate = async () => {
    if (!factorId || verifyCode.length !== 6) return;
 };

  const copySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success("Secret copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (enrolling) {
    return (
      <Card className="p-8 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Setting up two-factor authentication...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Enable Two-Factor Authentication</h2>
        <p className="text-muted-foreground text-sm">
          Secure your account with an authenticator app like Google Authenticator or Authy
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Scan QR Code */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              1
            </div>
            <Label className="font-medium">Scan QR code with your authenticator app</Label>
          </div>
          
          {qrCode && (
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img src={qrCode} alt="QR Code for MFA" className="w-48 h-48" />
            </div>
          )}
          
          {/* Manual entry option */}
          {secret && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Or enter this code manually:
              </p>
              <div className="flex items-center justify-center gap-2">
                <code className="px-3 py-1.5 bg-muted rounded text-xs font-mono break-all">
                  {secret}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={copySecret}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Enter verification code */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
            <Label className="font-medium">Enter the 6-digit code from your app</Label>
          </div>
          
          <div className="flex justify-center">
            <InputOTP
              value={verifyCode}
              onChange={setVerifyCode}
              maxLength={6}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={verifyAndActivate}
            disabled={verifyCode.length !== 6 || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Smartphone className="mr-2 h-4 w-4" />
                Enable 2FA
              </>
            )}
          </Button>
          
          {onSkip && (
            <Button
              variant="ghost"
              onClick={onSkip}
              className="w-full"
            >
              Skip for now
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
