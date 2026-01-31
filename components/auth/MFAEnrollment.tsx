"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { refreshAndDispatchUser } from '@/utils/refreshUser';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Shield, Smartphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { baseUrl } from "@/const";
import { useDispatch } from "react-redux";

interface MFAEnrollmentProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function MFAEnrollment({ onComplete, onSkip }: MFAEnrollmentProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
const dispatch = useDispatch();

  useEffect(() => {
    startEnrollment();
  }, []);

  /* =========================
     STEP 1: SETUP MFA
  ========================= */
  const startEnrollment = async () => {
    try {
      setEnrolling(true);

      const res = await fetch(`${baseUrl}/users/2fa/setup`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to start MFA setup");
      }

      setQrCode(data.qr);
      setSecret(data.secret); // store secret internally only
    } catch (err: any) {
      toast.error(err.message || "Unable to setup 2FA");
      onSkip?.();
    } finally {
      setEnrolling(false);
    }
  };

  /* =========================
     STEP 2: VERIFY & ACTIVATE
  ========================= */
  const verifyAndActivate = async () => {
    if (!secret || verifyCode.length !== 6) return;

    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/users/2fa/verify-setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token: verifyCode,
          secret, // send the secret to backend
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid verification code");
      }
      onComplete();
       await refreshAndDispatchUser(dispatch);
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (enrolling) {
    return (
      <Card className="p-8 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            Setting up two-factor authentication...
          </p>
        </div>
      </Card>
    );
  }

  /* =========================
     MAIN RENDER
  ========================= */
  return (
    <Card className="p-8 max-w-md mx-auto max-h-[95vh] overflow-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          Enable Two-Factor Authentication
        </h2>
        <p className="text-muted-foreground text-sm">
          Scan the QR code using Google Authenticator or Authy, then enter the 6-digit code.
        </p>
      </div>

      <div className="space-y-6">
        {/* STEP 1: Scan QR */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              1
            </div>
            <Label className="font-medium">
              Scan QR code with your authenticator app
            </Label>
          </div>

          {qrCode && (
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img src={qrCode} alt="QR Code for MFA" className="w-48 h-48" />
            </div>
          )}
        </div>

        {/* STEP 2: Enter code */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
            <Label className="font-medium">
              Enter the 6-digit code from your app
            </Label>
          </div>

          <div className="flex justify-center">
            <InputOTP value={verifyCode} onChange={setVerifyCode} maxLength={6}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        {/* ACTIONS */}
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
            <Button variant="ghost" onClick={onSkip} className="w-full">
              Skip for now
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
