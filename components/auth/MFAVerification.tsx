import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Shield, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface MFAVerificationProps {
  onSuccess: () => void;
  onBack?: () => void;
}

export function MFAVerification({ onSuccess, onBack }: MFAVerificationProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Card className="p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Two-Factor Authentication</h2>
        <p className="text-muted-foreground text-sm">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="font-medium text-center block">Verification Code</Label>
          <div className="flex justify-center">
            <InputOTP
              value={code}
              onChange={setCode}
              maxLength={6}
              autoFocus
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

        <div className="space-y-3">
          <Button
            disabled={code.length !== 6 || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
          
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Open your authenticator app (Google Authenticator, Authy, etc.) to view your code
        </p>
      </div>
    </Card>
  );
}
