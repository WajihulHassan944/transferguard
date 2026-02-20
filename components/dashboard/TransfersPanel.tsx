
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

import { baseUrl } from "@/const";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Send, 
  Clock, 
  Download, 
  Copy, 
  CheckCircle,
  XCircle,
  Hash,
  Ban,
  Shield,
  AlertTriangle,
  Mail,
  FileText,
  MoreHorizontal,
  ExternalLink,
  Search,
  ShieldCheck,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TransferFile {
  id: string;
  file_name: string;
  file_size: number;
  mime_type: string | null;
}

interface Transfer {
  id: string;
  sender_email: string;
  recipient_email: string;
  recipient_phone: string | null;
  message: string | null;
  dossier_number: string | null;
  download_token: string;
  expires_at: string;
  downloaded_at: string | null;
  revoked_at: string | null;
  verified_at: string | null;
audit_certificate?: string | null;
  created_at: string;
  files?: TransferFile[];
}

type SecurityLevel = 'starter' | 'adobe_sealed' | 'qerds';


// Security level configuration with consistent colors
const getSecurityLevelInfo = (level: SecurityLevel | undefined, hasPhone: boolean) => {
  // Legal Seal (Level 3) - Amber/Gold
  if (hasPhone || level === 'qerds') {
    return {
      level: 3,
      label: 'Legal Seal',
      icon: Award,
      iconColor: 'text-amber-600',
      bgColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      badgeBorder: 'border-amber-200',
    };
  }
  // Professional (Level 2) - Silver/Gray
  if (level === 'adobe_sealed') {
    return {
      level: 2,
      label: 'Professional',
      icon: ShieldCheck,
      iconColor: 'text-slate-500',
      bgColor: 'bg-gradient-to-r from-slate-400 to-slate-500',
      badgeBg: 'bg-slate-50',
      badgeText: 'text-slate-700',
      badgeBorder: 'border-slate-200',
    };
  }
  // starter (Level 1) - Bronze/Brown
  return {
    level: 1,
    label: 'starter',
    icon: Shield,
    iconColor: 'text-amber-700',
    bgColor: 'bg-gradient-to-r from-amber-600 to-amber-700',
    badgeBg: 'bg-amber-50/50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200/50',
  };
};

const getFileIcon = (mimeType: string | null, fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (mimeType?.includes('pdf') || ext === 'pdf') return { bg: 'bg-primary/10', text: 'text-primary' };
  if (mimeType?.includes('word') || ext === 'docx' || ext === 'doc') return { bg: 'bg-primary/10', text: 'text-primary' };
  if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet') || ext === 'xlsx' || ext === 'xls') return { bg: 'bg-primary/10', text: 'text-primary' };
  if (mimeType?.startsWith('image/')) return { bg: 'bg-primary/10', text: 'text-primary' };
  if (mimeType?.includes('zip') || ['zip', 'rar', '7z'].includes(ext)) return { bg: 'bg-primary/10', text: 'text-primary' };
  return { bg: 'bg-muted', text: 'text-muted-foreground' };
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

interface TransfersPanelProps {
  userId: string;
}

export function TransfersPanel({ userId }: TransfersPanelProps) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [reshareOpen, setReshareOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [newRecipientEmail, setNewRecipientEmail] = useState("");
  const [newRecipientPhone, setNewRecipientPhone] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newExpiryDays, setNewExpiryDays] = useState("7");
  const [isResharing, setIsResharing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [transferToRevoke, setTransferToRevoke] = useState<Transfer | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
  const fetchTransfers = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/transfers/my`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load transfers");
      }

      setTransfers(data.transfers); // must match Transfer interface
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch transfers");
    } finally {
      setLoading(false);
    }
  };

  fetchTransfers();
}, [userId]);

  const getStatus = (transfer: Transfer & { security_level?: SecurityLevel }) => {
    const now = new Date();
    const expiresAt = new Date(transfer.expires_at);
    
    if (transfer.revoked_at) {
      return { 
        label: "Revoked", 
        sublabel: format(new Date(transfer.revoked_at), "d MMM HH:mm", { locale: nl }),
        bgColor: "bg-red-50", 
        textColor: "text-red-600",
        borderColor: "border-red-200",
        icon: Ban 
      };
    }
    if (expiresAt < now) {
      return { 
        label: "Expired", 
        sublabel: format(expiresAt, "d MMM", { locale: nl }),
        bgColor: "bg-muted", 
        textColor: "text-muted-foreground",
        borderColor: "border-border",
        icon: XCircle 
      };
    }
    if (transfer.downloaded_at) {
      return { 
        label: `Downloaded ${format(new Date(transfer.downloaded_at), "HH:mm", { locale: nl })}`, 
        sublabel: format(new Date(transfer.downloaded_at), "d MMM", { locale: nl }),
        bgColor: "bg-emerald-50", 
        textColor: "text-emerald-700",
        borderColor: "border-emerald-200",
        icon: CheckCircle 
      };
    }
    return { 
      label:"Active", 
      sublabel: `expires ${format(expiresAt, "d MMM", { locale: nl })}`,
      bgColor: "bg-sky-50", 
      textColor: "text-sky-700",
      borderColor: "border-sky-200",
      icon: Clock 
    };
  };

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/download/${token}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  const openReshare = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setNewRecipientEmail("");
    setNewRecipientPhone("");
    setNewMessage(transfer.message || "");
    setNewExpiryDays("7");
    setReshareOpen(true);
  };
const handleReshare = async () => {
  if (!selectedTransfer || !newRecipientEmail) return;

  try {
    setIsResharing(true);

    const res = await fetch(`${baseUrl}/transfers/${selectedTransfer.id}/reshare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        recipient_email: newRecipientEmail,
        recipient_phone: newRecipientPhone || null,
        message: newMessage,
        expires_in_days: Number(newExpiryDays),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to reshare");
    }

    setTransfers((prev) => [data.transfer, ...prev]);
    setReshareOpen(false);
    toast.success("Document reshared successfully");
  } catch (err: any) {
    toast.error(err.message || "Reshare failed");
  } finally {
    setIsResharing(false);
  }
};

  const openRevokeDialog = (transfer: Transfer) => {
    setTransferToRevoke(transfer);
    setRevokeDialogOpen(true);
  };
const handleRevoke = async () => {
  if (!transferToRevoke) return;

  try {
    setIsRevoking(true);

    const res = await fetch(`${baseUrl}/transfers/revoke/${transferToRevoke.id}`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to revoke access");
    }

   setTransfers((prev) =>
  prev.map((t) =>
    t.id === transferToRevoke.id
      ? {
          ...t,
          revoked_at: data.transfer?.revoked_at || new Date().toISOString(),
        }
      : t
  )
);


    toast.success("Access revoked");
    setRevokeDialogOpen(false);
  } catch (err: any) {
    toast.error(err.message || "Revoke failed");
  } finally {
    setIsRevoking(false);
  }
};


  const filteredTransfers = searchQuery
    ? transfers.filter(t => 
        t.dossier_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.recipient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.files?.some(f => f.file_name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : transfers;

  const canRevoke = (transfer: Transfer) => {
    const now = new Date();
    const expiresAt = new Date(transfer.expires_at);
    return !transfer.revoked_at && expiresAt > now && !transfer.downloaded_at;
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

 return (
  <>
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Recent Transfers
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 pl-10 h-11 rounded-xl"
            />
          </div>

          {/* <label className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <Checkbox
              checked={bulkMode}
              onCheckedChange={(checked) => {
                setBulkMode(!!checked);
                if (!checked) setSelectedIds(new Set());
              }}
            />
            Bulk
          </label> */}
        </div>
      </div>

      {/* Transfers */}
      {filteredTransfers.length === 0 ? (
        <Card className="border-dashed rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-5">
              <Send className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold text-lg mb-1">No transfers yet</h3>
            <p className="text-sm text-muted-foreground">
              Send your first secure document to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <TooltipProvider delayDuration={150}>
          <div className="space-y-3">
            {/* Desktop Headers */}
            <div className="hidden lg:flex items-center gap-8 px-6 py-3 bg-muted/50 rounded-xl border border-border/50">
              <div className="w-12" />
              <div className="w-[220px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                File & Recipient
              </div>
              <div className="w-[140px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Reference
              </div>
              <div className="w-[140px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Security
              </div>
              <div className="w-[120px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </div>
              <div className="flex-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </div>
            </div>

            {filteredTransfers.map((transfer) => {
              const status = getStatus(transfer as Transfer & { security_level?: SecurityLevel });
              const securityInfo = getSecurityLevelInfo(
                (transfer as Transfer & { security_level?: SecurityLevel }).security_level,
                !!transfer.recipient_phone
              );
              const mainFile = transfer.files?.[0];
              const fileStyle = mainFile ? getFileIcon(mainFile.mime_type, mainFile.file_name) : null;
              const isDownloaded = !!transfer.downloaded_at;
              const isRevoked = !!transfer.revoked_at;
              const SecurityIcon = securityInfo.icon;

              return (
                <Card
                  key={transfer.id}
                  className={cn(
                    "rounded-2xl border-border/80 transition-all hover:shadow-md",
                    isRevoked && "opacity-50"
                  )}
                >
                  <div className="p-4 sm:p-5 lg:p-6">
                    {/* Desktop */}
                    <div className="hidden lg:flex items-center gap-8">
                      {bulkMode && (
                        <Checkbox
                          checked={selectedIds.has(transfer.id)}
                          onCheckedChange={() => toggleSelect(transfer.id)}
                        />
                      )}

                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          fileStyle?.bg || "bg-primary/10"
                        )}
                      >
                        <FileText className={cn("h-5 w-5", fileStyle?.text || "text-primary")} />
                      </div>

                      <div className="w-[220px] min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {mainFile?.file_name || "No file"}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {transfer.recipient_email}
                        </p>
                      </div>

                      <div className="w-[140px] text-xs text-muted-foreground">
                        {transfer.dossier_number && (
                          <span className="block font-medium text-foreground/70">
                            {transfer.dossier_number}
                          </span>
                        )}
                        {format(new Date(transfer.created_at), "d MMM yyyy", { locale: nl })}
                      </div>

                      <div className="w-[140px]">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border",
                            securityInfo.badgeBg,
                            securityInfo.badgeBorder,
                            securityInfo.badgeText
                          )}
                        >
                          <SecurityIcon className="h-3.5 w-3.5" />
                          {securityInfo.label}
                        </div>
                      </div>

                      <div className="w-[120px]">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border",
                            status.bgColor,
                            status.textColor,
                            status.borderColor
                          )}
                        >
                          <status.icon className="h-3.5 w-3.5" />
                          {status.label.split(" ")[0]}
                        </div>
                      </div>

                      <div className="flex-1 flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReshare(transfer)}
                          className="h-9 text-xs rounded-lg px-4"
                        >
                          <Send className="h-3.5 w-3.5 mr-1.5" />
                          Clone
                        </Button>

                        <div className="ml-auto flex items-center gap-3">
                          {canRevoke(transfer) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openRevokeDialog(transfer)}
                              className="text-destructive hover:bg-destructive/10 h-9 text-xs px-4"
                            >
                              Revoke
                            </Button>
                          )}

                        {transfer.audit_certificate && (
  <Button
    size="sm"
    onClick={() => window.open(transfer.audit_certificate!, "_blank")}
    className="bg-cta hover:bg-cta/90 text-cta-foreground h-9 text-xs px-4"
  >
    <Download className="h-3.5 w-3.5 mr-1.5" />
    Certificate
  </Button>
)}
                        </div>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="lg:hidden space-y-4">
                      <div className="flex items-start gap-3">
                        {bulkMode && (
                          <Checkbox
                            checked={selectedIds.has(transfer.id)}
                            onCheckedChange={() => toggleSelect(transfer.id)}
                          />
                        )}

                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            fileStyle?.bg || "bg-primary/10"
                          )}
                        >
                          <FileText className={cn("h-4 w-4", fileStyle?.text || "text-primary")} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">
                            {mainFile?.file_name || "No file"}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {transfer.recipient_email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold border",
                          securityInfo.badgeBg,
                          securityInfo.badgeBorder,
                          securityInfo.badgeText
                        )}>
                          {securityInfo.label}
                        </span>

                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold border",
                          status.bgColor,
                          status.textColor,
                          status.borderColor
                        )}>
                          {status.label.split(" ")[0]}
                        </span>
                        {transfer.audit_certificate && (
  <Button
    size="sm"
    onClick={() => window.open(transfer.audit_certificate!, "_blank")}
    className="bg-cta hover:bg-cta/90 text-cta-foreground h-9 text-xs px-4 w-full"
  >
    <Download className="h-3.5 w-3.5 mr-1.5" />
    Certificate
  </Button>
)}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TooltipProvider>
      )}
    </div>


          {/* Revoke Dialog */}
      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Revoke Access
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately disable the download link for{" "}
              <strong>{transferToRevoke?.recipient_email}</strong>. 
              The recipient will no longer be able to access the files.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={isRevoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRevoking ? "Revoking..." : "Revoke Access"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  </>
);

}
