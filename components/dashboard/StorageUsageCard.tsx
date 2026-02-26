import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Send, TrendingUp, AlertTriangle } from "lucide-react";

interface StorageUsageCardProps {
  effectivePlan?: string;
}

interface UserAccount {
  storage_used: number;
  storage_limit: number;
  plan: string;
}

export function StorageUsageCard({  effectivePlan }: StorageUsageCardProps) {
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  // 🔹 Dummy Professional Account (for UI testing)
  const dummyAccount: UserAccount = {
    storage_used: 320 * 1024 * 1024 * 1024, // 320GB used
    storage_limit: 1024 * 1024 * 1024 * 1024, // 1TB (not required but included)
    plan: "Certified Delivery",
  };

  setAccount(dummyAccount);
}, []);
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(0)} GB`;
  };
  const getStorageLimit = (): number => {
    if (!account) return 0;
    return getPlanStorageLimit(effectivePlan || account.plan);
  };

  const getUsagePercentage = (): number => {
    const limit = getStorageLimit();
    if (!account || limit === 0) return 0;
    return Math.min((account.storage_used / limit) * 100, 100);
  };

  const getProgressColor = (): string => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-primary";
  };

  const getStatusIcon = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
    if (percentage >= 75) {
      return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    }
    return <Send className="h-4 w-4 text-primary" />;
  };

  const getPlanLabel = (plan: string): string => {
  
    switch (plan) {
      case "premium":
      case "legal":
        return "Verified Identity";
      case "professional":
      case "Certified Delivery":
        return "Certified Delivery";
      case "trial":
        return "Trial";
      case "starter":
      case "basic":
        return "Secure Transfer";
      default:
        return "Free";
    }
  };

  // Return the correct storage limit in bytes based on plan specs
  const getPlanStorageLimit = (plan: string): number => {
    switch (plan) {
      case "premium":
      case "legal":
        return 3 * 1024 * 1024 * 1024 * 1024; // 3TB
      case "professional":
      case "Certified Delivery":
        return 1024 * 1024 * 1024 * 1024; // 1TB
      case "trial":
        return 50 * 1024 * 1024 * 1024; // 50GB
      case "starter":
      case "basic":
        return 500 * 1024 * 1024 * 1024; // 500GB
      default:
        return 5 * 1024 * 1024 * 1024; // 5GB free
    }
  };

  if (loading) {
    return (
      <Card className="p-3">
        <div className="animate-pulse space-y-2">
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="h-2 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (!account) {
    return null;
  }

  const activePlan = effectivePlan || account.plan;
  const percentage = getUsagePercentage();
  const storageLimit = getPlanStorageLimit(activePlan);
  const remainingBytes = Math.max(storageLimit - account.storage_used, 0);

  return (
    <div className="p-3 bg-muted/30 rounded-xl">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {getStatusIcon()}
          <span className="text-[11px] font-semibold text-foreground">Transfer Quota</span>
        </div>
        <span className="text-[10px] text-primary font-semibold">
          {getPlanLabel(activePlan)}
        </span>
      </div>
      
      <div className="relative h-1.5 bg-border rounded-full overflow-hidden mb-1.5">
        <div 
          className={`absolute top-0 left-0 h-full rounded-full transition-all ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{formatBytes(account.storage_used)} used</span>
        <span>{formatBytes(remainingBytes)} left</span>
      </div>

      {percentage >= 90 && (
        <p className="text-[10px] font-medium text-destructive mt-1">
          ⚠️ Quota almost full
        </p>
      )}
    </div>
  );
}
