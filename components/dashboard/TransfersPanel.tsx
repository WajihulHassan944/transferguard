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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Recent Transfers</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 bg-background"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
              <Checkbox 
                checked={bulkMode} 
                onCheckedChange={(checked) => {
                  setBulkMode(!!checked);
                  if (!checked) setSelectedIds(new Set());
                }} 
              />
              Bulk Actions
            </label>
          </div>
        </div>

        {/* Transfers List */}
        {filteredTransfers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Send className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-medium mb-1">No transfers yet</h3>
              <p className="text-sm text-muted-foreground">Send your first secure document to get started</p>
            </CardContent>
          </Card>
        ) : (
        <TooltipProvider delayDuration={150}>
        <div className="space-y-3">
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
                    "overflow-hidden transition-all border-border/60 hover:shadow-md",
                    isRevoked && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-4 p-5">
                    {/* Bulk Select */}
                    {bulkMode && (
                      <Checkbox 
                        checked={selectedIds.has(transfer.id)}
                        onCheckedChange={() => toggleSelect(transfer.id)}
                        className="flex-shrink-0"
                      />
                    )}
                    
                    {/* File Icon */}
                    <div className={cn(
                      "hidden sm:flex w-14 h-16 rounded-lg items-center justify-center flex-shrink-0",
                      fileStyle?.bg || 'bg-muted'
                    )}>
                      <FileText className={cn("h-7 w-7", fileStyle?.text || 'text-muted-foreground')} />
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Filename */}
                      <h3 className="font-semibold text-base truncate mb-1" title={mainFile?.file_name}>
                        {mainFile?.file_name || 'No file'}
                      </h3>
                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                        <span className="truncate max-w-[180px]">{transfer.recipient_email}</span>
                        {transfer.dossier_number && (
                          <>
                            <span className="text-border">|</span>
                            <span>Ref: {transfer.dossier_number}</span>
                          </>
                        )}
                        <span className="text-border">|</span>
                        <span>{format(new Date(transfer.created_at), "d MMM. yyyy", { locale: nl })}</span>
                      </div>
                    </div>
                    
                    {/* Security Level Badge */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 flex-shrink-0 w-[130px]">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            securityInfo.bgColor
                          )}>
                            <SecurityIcon className="h-4 w-4 text-white" />
                          </div>
                          <span className={cn("text-sm font-medium", securityInfo.badgeText)}>
                            {securityInfo.label}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="font-medium">Security Level {securityInfo.level}</p>
                        <p className="text-xs text-muted-foreground">{securityInfo.label}</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Download Certificate - for downloaded transfers */}
                      {isDownloaded && (
                        <Button
                          size="sm"
                          className="bg-cta hover:bg-cta/90 text-cta-foreground"
                          onClick={() => toast.success("Certificate download started")}
                        >
                          <Download className="h-4 w-4 mr-1.5" />
                          Download Certificate
                        </Button>
                      )}
                      
                      
                  {/* Clone & Send - hide when revoked */}
{!isRevoked && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => openReshare(transfer)}
    className="hidden sm:flex"
  >
    <Send className="h-4 w-4 mr-1.5" />
    Clone & Send
  </Button>
)}

                      
                      {/* Revoke Button */}
                      {canRevoke(transfer) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openRevokeDialog(transfer)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          Revoke Access
                        </Button>
                      )}
                      
                      {/* Status Badge */}
                      <div className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border flex-shrink-0",
                        status.bgColor, 
                        status.textColor, 
                        status.borderColor
                      )}>
                        {status.label}
                      </div>
                      
                      {/* More Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyLink(transfer.download_token)}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Copy download link
                          </DropdownMenuItem>
                         {!isRevoked && (
  <DropdownMenuItem onClick={() => openReshare(transfer)} className="sm:hidden">
    <Send className="h-4 w-4 mr-2" />
    Clone & Send New
  </DropdownMenuItem>
)}

                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div> </TooltipProvider>
        )}
      </div>

      {/* Reshare Dialog */}
      <Dialog open={reshareOpen} onOpenChange={setReshareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reshare Document</DialogTitle>
            <DialogDescription>
              Send this document to a new recipient with Email 2FA verification.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedTransfer?.dossier_number && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Dossier: {selectedTransfer.dossier_number}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Recipient Email</Label>
              <Input
                type="email"
                placeholder="recipient@example.com"
                value={newRecipientEmail}
                onChange={(e) => setNewRecipientEmail(e.target.value)}
              />
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3 text-primary" />
                Recipient will verify via Email 2FA before downloading
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Message (optional)</Label>
              <Textarea
                placeholder="Add a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Available for</Label>
              <Select value={newExpiryDays} onValueChange={setNewExpiryDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReshareOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReshare} disabled={isResharing || !newRecipientEmail}>
              {isResharing ? "Resharing..." : "Reshare"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
