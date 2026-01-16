import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, XCircle, Clock, CheckCircle2, AlertCircle, FileIcon } from "lucide-react";
import { toast } from "sonner";

interface SharesPanelProps {
  userId: string;
}

interface FileShare {
  id: string;
  file_id: string;
  shared_with_email: string | null;
  shared_with_team_id: string | null;
  is_active: boolean;
  expires_at: string | null;
  revoked_at: string | null;
  downloaded_at: string | null;
  created_at: string;
  message: string | null;
  file_name?: string;
  file_size?: number;
}

export function SharesPanel({ userId }: SharesPanelProps) {
  const [shares, setShares] = useState<FileShare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShares();
  }, [userId]);

  const loadShares = async () => {
    setLoading(true);
    
    setLoading(false);
  };

  const revokeShare = async (shareId: string) => {
  };

  const getShareStatus = (share: FileShare) => {
    if (!share.is_active || share.revoked_at) {
      return { label: "Revoked", variant: "destructive" as const, icon: XCircle };
    }
    if (share.expires_at && new Date(share.expires_at) < new Date()) {
      return { label: "Expired", variant: "secondary" as const, icon: AlertCircle };
    }
    if (share.downloaded_at) {
      return { label: "Downloaded", variant: "default" as const, icon: CheckCircle2 };
    }
    return { label: "Active", variant: "default" as const, icon: Clock };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shared Files</h1>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : shares.length === 0 ? (
        <Card className="p-12 text-center">
          <Share2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No files shared yet</h3>
          <p className="text-muted-foreground">
            Share files with others or teams from your file manager
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {shares.map((share) => {
            const status = getShareStatus(share);
            return (
              <Card key={share.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">
                        {share.file_name || "Unknown file"}
                      </p>
                      {share.file_size && (
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(share.file_size)}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Share2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Shared with: <span className="font-medium text-foreground">{share.shared_with_email || "Team"}</span>
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(share.created_at).toLocaleDateString("en-US", { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {share.message && (
                        <p className="text-sm text-muted-foreground mt-1 italic">
                          "{share.message}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={status.variant}>
                      <status.icon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                    {share.is_active && !share.revoked_at && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revokeShare(share.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
