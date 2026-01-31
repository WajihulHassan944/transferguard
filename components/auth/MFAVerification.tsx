"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Shield, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { baseUrl } from "@/const";
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";
import { refreshAndDispatchUser } from "@/utils/refreshUser";
import { getLoginMeta } from "@/hooks/getLoginMeta";

interface MFAVerificationProps {
  tempToken: string;
  onBack?: () => void;
  onSuccess?: () => void;
}
export function MFAVerification({
  tempToken,
  onBack,
  onSuccess,
}: MFAVerificationProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleVerify = async () => {
    if (code.length !== 6) return;

    try {
      setLoading(true);
const loginMeta = await getLoginMeta();
      const res = await fetch(`${baseUrl}/users/2fa/verify-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          token: code,
          tempToken,
          loginMeta,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid code");
      }
console.log("data from backend", data);
      refreshAndDispatchUser(dispatch);

      toast.success("Login successful");
      if (onSuccess) {
  onSuccess();
} else {
  router.push("/dashboard");
}
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-muted-foreground text-sm">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="font-medium text-center block">
            Verification Code
          </Label>

          <div className="flex justify-center">
            <InputOTP value={code} onChange={setCode} maxLength={6} autoFocus>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleVerify}
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
            <Button variant="ghost" onClick={onBack} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Open your authenticator app to get the code
        </p>
      </div>
    </Card>
  );
}
