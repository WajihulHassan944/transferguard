import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Shield, 
  Key, 
  History, 
  Eye, 
  EyeOff, 
  Loader2,
  CheckCircle2,
  XCircle,
  Monitor,
  Smartphone,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { MFASettings } from "@/components/auth/MFASettings";
import { baseUrl } from "@/const";
import { useAppSelector } from "@/redux/hooks";
interface SecurityPanelProps {
  userId: string;
}
interface NormalizedLoginEvent {
  at: string;
  success: boolean;
  ip?: string;
  userAgent?: string;
  device?: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
}


export function SecurityPanel({ userId }: SecurityPanelProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
const user = useAppSelector((state) => state.user);

const handlePasswordChange = async () => {
  // Validation
  if (!newPassword || !confirmPassword) {
    toast.error("Please fill in all password fields");
    return;
  }

  if (newPassword.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    setChangingPassword(true);

    const res = await fetch(`${baseUrl}/users/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        newPassword,
        confirmPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to update password");
      return;
    }

    toast.success("Password updated successfully");

    setNewPassword("");
    setConfirmPassword("");
  } catch (error) {
    toast.error("Something went wrong. Please try again.");
  } finally {
    setChangingPassword(false);
  }
};

const getDeviceIcon = (userAgent: string | null | undefined) => {
  if (!userAgent) return <Globe className="h-4 w-4" />;
  if (userAgent.toLowerCase().includes("mobile")) {
    return <Smartphone className="h-4 w-4" />;
  }
  return <Monitor className="h-4 w-4" />;
};

const getDeviceName = (userAgent: string | null | undefined) => {
  if (!userAgent) return "Unknown device";
  if (userAgent.includes("Chrome")) return "Chrome Browser";
  if (userAgent.includes("Firefox")) return "Firefox Browser";
  if (userAgent.includes("Safari")) return "Safari Browser";
  if (userAgent.includes("Edge")) return "Edge Browser";
  return "Web Browser";
};

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Security Settings</h1>
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </h3>
        <MFASettings />
      </div>

      {/* Change Password */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Key className="h-5 w-5" />
          Change Password
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Update your password to keep your account secure. We recommend using a strong, unique password.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            onClick={handlePasswordChange} 
            disabled={changingPassword || !newPassword || !confirmPassword}
          >
            {changingPassword ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Changing...
              </>
            ) : (
              <>
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </>
            )}
          </Button>
        </div>
      </Card>

{/* Login History */}
<Card className="p-6">
  <h3 className="font-semibold mb-4 flex items-center gap-2">
    <History className="h-5 w-5" />
    Login History
  </h3>
  <p className="text-sm text-muted-foreground mb-4">
    Recent sign-in activity for your account.
  </p>

  {!user?.lastLogin || user.lastLogin.length === 0 ? (
    <div className="text-center py-8 text-muted-foreground">
      <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
      <p className="text-sm">Login history will be available soon.</p>
      <p className="text-xs mt-1">
        We're working on tracking login activity for your security.
      </p>
    </div>
  ) : (
    <div className="space-y-3">
      {user.lastLogin.map((event, index) => {
  // normalize old string entries to full object
  const e: NormalizedLoginEvent = typeof event === "string"
    ? { at: event, success: true }
    : event;

  return (
    <div
      key={e.at + index}
      className="flex items-center justify-between p-3 rounded-lg border bg-card"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-muted">
          {getDeviceIcon(e.userAgent)}
        </div>
        <div>
          <p className="font-medium text-sm">
            {getDeviceName(e.userAgent)}
          </p>
          <p className="text-xs text-muted-foreground">
            {e.ip || "Unknown IP"} • {new Date(e.at).toLocaleString()}
          </p>
        </div>
      </div>
      {e.success ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-destructive" />
      )}
    </div>
  );
})}

    </div>
  )}
</Card>
    </div>
  );
}
