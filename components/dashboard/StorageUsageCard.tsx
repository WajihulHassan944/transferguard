import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Send, TrendingUp, AlertTriangle } from "lucide-react";

interface StorageUsageCardProps {
  userId: string;
}

interface UserAccount {
  storage_used: number;
  storage_limit: number;
  plan: string;
}

export function StorageUsageCard({ userId }: StorageUsageCardProps) {
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(0)} GB`;
  };

  const getUsagePercentage = (): number => {
    if (!account || account.storage_limit === 0) return 0;
    return Math.min((account.storage_used / account.storage_limit) * 100, 100);
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
      case "pro":
        return "Pro";
      case "basic":
        return "Basic";
      default:
        return "Trial";
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

  const percentage = getUsagePercentage();
  const remainingBytes = Math.max(account.storage_limit - account.storage_used, 0);

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-xs font-medium">Transfer Quota</span>
        </div>
        <span className="text-xs text-primary font-medium">
          {getPlanLabel(account.plan)}
        </span>
      </div>
      
      <div className="space-y-1.5">
        <div className="relative">
          <Progress 
            value={percentage} 
            className="h-2"
          />
          <div 
            className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatBytes(account.storage_used)} used</span>
          <span>{formatBytes(remainingBytes)} left</span>
        </div>
      </div>

      {percentage >= 90 && (
        <div className="mt-2 p-1.5 bg-destructive/10 rounded text-xs text-destructive font-medium">
          ⚠️ Quota almost full
        </div>
      )}
    </Card>
  );
}
