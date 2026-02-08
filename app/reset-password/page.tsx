'use client'
import {  useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPassword() {
  const [checking, setChecking] = useState(false);
  const [hasSession, setHasSession] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const passwordsMatch = useMemo(
    () => newPassword.length > 0 && newPassword === confirmPassword,
    [newPassword, confirmPassword]
  );

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
          <div className="flex items-center justify-center mb-4">
            <img src='/assets/transferguard-logo-new.png' alt="Transfer Guard" className="h-32" />
          </div>
          <p className="text-muted-foreground">Choose a new password</p>
        </div>

        <Card className="p-6 glass-card">
          {checking ? (
            <div className="text-sm text-muted-foreground">Preparing password reset...</div>
          ) : !hasSession ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                This page only works when opened from the password reset email link.
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/auth">Go to login</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10"
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    minLength={6}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={saving || !passwordsMatch}>
                {saving ? "Saving..." : "Set new password"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
