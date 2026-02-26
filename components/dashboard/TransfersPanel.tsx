
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
import { SecurityLevelSelector, SecurityLevel as SecLevel } from "./SecurityLevelSelector";

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
  CalendarPlus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
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
import { useLanguage } from "@/contexts/LanguageContext";

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
  status: string;
  files?: TransferFile[];
}


type SecurityLevel = 'standard' | 'adobe_sealed' | 'legal';


// Security level configuration with consistent colors
const getSecurityLevelInfo = (level: SecurityLevel | undefined, hasPhone: boolean) => {
  
  // Legal Seal (Level 3) - Amber/Gold with Scale icon
  if (level === 'legal') {
    return {
      level: 3,
      label: 'Verified Identity',
      icon: Award,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-500',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      badgeBorder: 'border-amber-200',
    };
  }
  // Professional (Level 2) - Blue with Shield icon
  if (level === 'adobe_sealed') {
    return {
      level: 2,
      label: 'Certified Delivery',
      icon: ShieldCheck,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-700',
      badgeBorder: 'border-blue-200',
    };
  }
  // Professional (Level 1) - Blue
  return {
    level: 1,
    label: 'Certified Delivery',
    icon: Shield,
    iconColor: 'text-primary',
    bgColor: 'bg-primary',
    badgeBg: 'bg-primary/10',
    badgeText: 'text-primary',
    badgeBorder: 'border-primary/20',
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

export function TransfersPanel() {
 const { t, language } = useLanguage();
  
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







  const [userPlan, setUserPlan] = useState<string>("free");
  const [transferLimit, setTransferLimit] = useState<number | null>(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered' | 'expired' | 'revoked'>('all');
  const ITEMS_PER_PAGE = 10;
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [transferToExtend, setTransferToExtend] = useState<Transfer | null>(null);
  const [extendDays, setExtendDays] = useState("7");
  const [isExtending, setIsExtending] = useState(false);
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [transferToReplace, setTransferToReplace] = useState<Transfer | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [cloneSecurityLevel, setCloneSecurityLevel] = useState<SecLevel>("email");
  const [legalCreditsRemaining, setLegalCreditsRemaining] = useState(0);








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
}, []);

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

// Apply search + status filter together
const filteredTransfers = transfers
  .filter((t) => {
    // 🔎 Search filter
    const matchesSearch =
      !searchQuery ||
      t.dossier_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.recipient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.files?.some((f) =>
        f.file_name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    // 🏷 Status filter
    if (statusFilter === "all") return true;

    switch (statusFilter) {
      case "active":
        return t.status === "pending";

      case "delivered":
        return ["delivered", "downloaded", "signed"].includes(t.status);

      case "expired":
        return t.status === "expired";

      case "revoked":
        return t.status === "revoked";

      default:
        return true;
    }
  });

// Reset to page 1 when filter changes (optional but recommended)
useEffect(() => {
  setCurrentPage(1);
}, [statusFilter, searchQuery]);

// Pagination based on filtered results
const totalPages = Math.ceil(filteredTransfers.length / ITEMS_PER_PAGE);

const paginatedTransfers = filteredTransfers.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);
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
  const statusCounts = transfers.reduce(
  (acc, t) => {
    switch (t.status) {
      case "pending":
        acc.active += 1;
        break;

      case "delivered":
      case "downloaded":
        case "signed":
        acc.delivered += 1;
        break;

      case "expired":
        acc.expired += 1;
        break;

      case "revoked":
        acc.revoked += 1;
        break;

      default:
        break;
    }

    return acc;
  },
  { active: 0, delivered: 0, expired: 0, revoked: 0 } as Record<
    "active" | "delivered" | "expired" | "revoked",
    number
  >
);
  const canExtend = (transfer: Transfer) => {
    return !transfer.revoked_at && !transfer.downloaded_at;
  };

  const openExtendDialog = (transfer: Transfer) => {
    setTransferToExtend(transfer);
    setExtendDays("7");
    setExtendDialogOpen(true);
  };


  
  const canReplace = (transfer: Transfer) => {
    const now = new Date();
    const expiresAt = new Date(transfer.expires_at);
    return !transfer.revoked_at && expiresAt > now && !transfer.downloaded_at;
  };

  const openReplaceDialog = (transfer: Transfer) => {
    setTransferToReplace(transfer);
    setReplaceFile(null);
    setReplaceDialogOpen(true);
  };

  const handleReplace = async () => {
    if (!transferToReplace || !replaceFile) return;
    setIsReplacing(true);
  };


  
  const handleExtend = async () => {
    if (!transferToExtend) return;
    setIsExtending(true);
    
    try {
      const currentExpiry = new Date(transferToExtend.expires_at);
      const now = new Date();
      const baseDate = currentExpiry > now ? currentExpiry : now;
      const newExpiry = new Date(baseDate);
      newExpiry.setDate(newExpiry.getDate() + parseInt(extendDays));

     
      toast.success(language === 'nl' 
        ? `Retentie verlengd met ${extendDays} dagen` 
        : `Retention extended by ${extendDays} days`
      );
      setExtendDialogOpen(false);
      setTransferToExtend(null);
    } catch (error) {
      console.error("Error extending retention:", error);
      toast.error(language === 'nl' ? 'Verlengen mislukt' : 'Failed to extend retention');
    } finally {
      setIsExtending(false);
    }
  };


    return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('transfers.title')}</h1>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('transfers.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 pl-10 h-11 bg-background border-border rounded-xl"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {([
            { key: 'all' as const, label: language === 'nl' ? 'Alle' : 'All', count: transfers.length },
            { key: 'active' as const, label: language === 'nl' ? 'Actief' : 'Active', count: statusCounts.active },
            { key: 'delivered' as const, label: language === 'nl' ? 'Afgeleverd' : 'Delivered', count: statusCounts.delivered },
            { key: 'expired' as const, label: language === 'nl' ? 'Verlopen' : 'Expired', count: statusCounts.expired },
            { key: 'revoked' as const, label: language === 'nl' ? 'Ingetrokken' : 'Revoked', count: statusCounts.revoked },
          ]).map(tab => (
            <Button
              key={tab.key}
              variant={statusFilter === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(tab.key)}
              className="h-8 text-xs rounded-lg px-3 whitespace-nowrap flex-shrink-0"
            >
              {tab.label}
              <span className={cn(
                "ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold",
                statusFilter === tab.key 
                  ? "bg-primary-foreground/20 text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                {tab.count}
              </span>
            </Button>
          ))}
        </div>

        {/* Transfers List */}
        {filteredTransfers.length === 0 ? (
          <Card className="border-dashed rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-5">
                <Send className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{statusFilter !== 'all' ? (language === 'nl' ? 'Geen transfers in deze categorie' : 'No transfers in this category') : t('transfers.noTransfers')}</h3>
              <p className="text-sm text-muted-foreground">{statusFilter !== 'all' ? (language === 'nl' ? 'Probeer een andere filter' : 'Try a different filter') : t('transfers.noTransfersDesc')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {/* Column Headers */}
            <div className="hidden xl:flex items-center gap-6 px-5 py-2.5 bg-muted/50 rounded-xl border border-border/50">
              {/* Spacer for file icon */}
              <div className="w-10 flex-shrink-0" />
              
              {/* File & Delivery Details */}
              <div className="w-[200px] flex-shrink-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('transfers.col.fileRecipient')}
                </span>
              </div>
              
              {/* Reference & Date */}
              <div className="w-[120px] flex-shrink-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('transfers.col.reference')}
                </span>
              </div>
              
              {/* Plan */}
              <div className="w-[120px] flex-shrink-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('transfers.col.evidence')}
                </span>
              </div>
              
              {/* Status */}
              <div className="w-[100px] flex-shrink-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('transfers.col.status')}
                </span>
              </div>
              
              {/* Empty spacer for actions alignment */}
              <div className="flex-1" />
            </div>

            {paginatedTransfers.map((transfer) => {
              const status = getStatus(transfer as Transfer & { security_level?: SecurityLevel });
              const securityInfo = getSecurityLevelInfo(
                (transfer as Transfer & { security_level?: SecurityLevel }).security_level, 
                !!transfer.recipient_phone
              );
              const mainFile = transfer.files?.[0];
              const fileStyle = mainFile ? getFileIcon(mainFile.mime_type, mainFile.file_name) : null;
              const isDownloaded = !!transfer.downloaded_at;
              const isExpired = new Date(transfer.expires_at) < new Date() && !transfer.revoked_at;
              const isRevoked = !!transfer.revoked_at;
              const SecurityIcon = securityInfo.icon;
              
              return (
                <Card 
                  key={transfer.id} 
                  className={cn(
                    "transition-all duration-200 hover:shadow-md rounded-2xl border-border/80",
                    isRevoked && "opacity-50",
                    isExpired && "opacity-60"
                  )}
                >
                  <div className="p-3 sm:p-4 lg:p-5">
                    {/* Desktop Layout - Single Row */}
                    <div className="hidden xl:flex items-center gap-6 min-w-0">
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
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        fileStyle?.bg || 'bg-primary/10'
                      )}>
                        <FileText className={cn("h-4 w-4", fileStyle?.text || 'text-primary')} />
                      </div>
                      
                      {/* File Info - Fixed width */}
                      <div className="w-[200px] min-w-0 flex-shrink-0">
                        <h3 className="font-semibold text-sm truncate" title={mainFile?.file_name}>
                          {mainFile?.file_name || 'No file'}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {transfer.recipient_email}
                        </p>
                      </div>
                      
                      {/* Meta Info - Fixed width */}
                      <div className="w-[120px] flex-shrink-0">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {transfer.dossier_number && <span className="block font-medium text-foreground/70">{transfer.dossier_number}</span>}
                          <span>{format(new Date(transfer.created_at), "d MMM yyyy", { locale: nl })}</span>
                        </p>
                      </div>
                      
                      {/* Security Level / Plan - Fixed width */}
                      <div className="w-[120px] flex-shrink-0">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border",
                          securityInfo.badgeBg,
                          securityInfo.badgeBorder,
                          securityInfo.badgeText
                        )}>
                          <SecurityIcon className={cn("h-3.5 w-3.5", securityInfo.iconColor)} />
                          {securityInfo.label}
                        </div>
                      </div>
                      
                      {/* Status - Fixed width */}
                      <div className="w-[100px] flex-shrink-0">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border",
                          status.bgColor, 
                          status.textColor, 
                          status.borderColor
                        )}>
                          <status.icon className="h-3.5 w-3.5" />
                          {status.label.split(' ')[0]}
                        </div>
                      </div>
                      
                       {/* Actions - clean compact layout */}
                       <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                         {/* Certificate CTA - always visible */}
                        <TooltipProvider>
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <span className="inline-flex shrink-0">
                               <Button
                                 size="sm"
                                 variant="default"
                                 className="bg-cta hover:bg-cta/90 text-cta-foreground h-8 text-xs rounded-lg px-3 whitespace-nowrap"
                                 disabled={!transfer.audit_certificate}
                                onClick={() => window.open(transfer.audit_certificate!, "_blank")}
                               >
                                 <Download className="h-3.5 w-3.5 mr-1.5" />
                                 {t('transfers.btn.certificate')}
                               </Button>
                             </span>
                           </TooltipTrigger>
                           {!isDownloaded && (
                             <TooltipContent>
                               <p className="text-xs">{language === 'nl' ? 'Beschikbaar zodra de ontvanger het bestand heeft gedownload' : 'Available once the recipient has downloaded the file'}</p>
                             </TooltipContent>
                           )}
                         </Tooltip></TooltipProvider>

                         {/* More actions dropdown */}
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-48">
                             <DropdownMenuItem onClick={() => openReshare(transfer)}>
                               <Send className="h-3.5 w-3.5 mr-2" />
                               {t('transfers.btn.clone')}
                             </DropdownMenuItem>
                             {canExtend(transfer) && (
                               <DropdownMenuItem onClick={() => openExtendDialog(transfer)}>
                                 <CalendarPlus className="h-3.5 w-3.5 mr-2" />
                                 {language === 'nl' ? 'Verleng retentie' : 'Extend retention'}
                               </DropdownMenuItem>
                             )}
                             {canReplace(transfer) && (
                               <DropdownMenuItem onClick={() => openReplaceDialog(transfer)}>
                                 <RefreshCw className="h-3.5 w-3.5 mr-2" />
                                 {language === 'nl' ? 'Vervang bestand' : 'Replace file'}
                               </DropdownMenuItem>
                             )}
                             {canRevoke(transfer) && (
                               <DropdownMenuItem 
                                 onClick={() => openRevokeDialog(transfer)}
                                 className="text-destructive focus:text-destructive"
                               >
                                 <Ban className="h-3.5 w-3.5 mr-2" />
                                 {t('transfers.btn.revoke')}
                               </DropdownMenuItem>
                             )}
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </div>
                    </div>

                    {/* Tablet & Mobile Layout - Stacked */}
                    <div className="xl:hidden space-y-4">
                      {/* Top row: File info */}
                      <div className="flex items-start gap-3">
                        {/* Bulk Select */}
                        {bulkMode && (
                          <Checkbox 
                            checked={selectedIds.has(transfer.id)}
                            onCheckedChange={() => toggleSelect(transfer.id)}
                            className="flex-shrink-0 mt-1"
                          />
                        )}
                        
                        {/* File Icon */}
                        <div className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          fileStyle?.bg || 'bg-primary/10'
                        )}>
                          <FileText className={cn("h-4 w-4 sm:h-5 sm:w-5", fileStyle?.text || 'text-primary')} />
                        </div>
                        
                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate" title={mainFile?.file_name}>
                            {mainFile?.file_name || 'No file'}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {transfer.recipient_email}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {transfer.dossier_number && (
                              <span className="text-xs font-medium text-foreground/70">{transfer.dossier_number}</span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(transfer.created_at), "d MMM yyyy", { locale: nl })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Middle row: Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Security Level */}
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                          securityInfo.badgeBg,
                          securityInfo.badgeBorder,
                          securityInfo.badgeText
                        )}>
                          <SecurityIcon className={cn("h-3 w-3", securityInfo.iconColor)} />
                          {securityInfo.label}
                        </div>
                        
                        {/* Status */}
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                          status.bgColor, 
                          status.textColor, 
                          status.borderColor
                        )}>
                          <status.icon className="h-3 w-3" />
                          {status.label.split(' ')[0]}
                        </div>
                      </div>
                      
                      {/* Bottom row: Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {/* Clone */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReshare(transfer)}
                          className="h-8 text-xs rounded-lg px-3"
                        >
                          <Send className="h-3 w-3 mr-1.5" />
                          {t('transfers.btn.clone')}
                        </Button>

                        {/* Extend Retention */}
                        {canExtend(transfer) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openExtendDialog(transfer)}
                            className="h-8 text-xs rounded-lg px-3"
                          >
                            <CalendarPlus className="h-3 w-3 mr-1.5" />
                            {language === 'nl' ? 'Verleng' : 'Extend'}
                          </Button>
                        )}

                        {/* Replace File */}
                        {canReplace(transfer) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openReplaceDialog(transfer)}
                            className="h-8 text-xs rounded-lg px-3 whitespace-nowrap"
                          >
                            <RefreshCw className="h-3 w-3 mr-1.5" />
                            {language === 'nl' ? 'Vervang' : 'Replace'}
                          </Button>
                        )}
                        
                        {/* Revoke */}
                        {canRevoke(transfer) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openRevokeDialog(transfer)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 text-xs rounded-lg px-3 whitespace-nowrap"
                          >
                             {t('transfers.btn.revoke')}
                          </Button>
                        )}
                        
                        {/* Certificate - always visible */}
                         <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex">
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-cta hover:bg-cta/90 text-cta-foreground h-8 text-xs rounded-lg px-3 whitespace-nowrap"
                                disabled={!transfer.audit_certificate}
                                onClick={() => window.open(transfer.audit_certificate!, "_blank")}
                              >
                                <Download className="h-3 w-3 mr-1.5" />
                                {t('transfers.btn.certificate')}
                              </Button>
                            </span>
                          </TooltipTrigger>
                          {!isDownloaded && (
                            <TooltipContent>
                              <p className="text-xs">{language === 'nl' ? 'Beschikbaar zodra de ontvanger het bestand heeft gedownload' : 'Available once the recipient has downloaded the file'}</p>
                            </TooltipContent>
                          )}
                        </Tooltip></TooltipProvider>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransfers.length)} of {filteredTransfers.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-9 w-9 p-0 rounded-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-9 w-9 p-0 rounded-lg"
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 p-0 rounded-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reshare Dialog */}
      <Dialog open={reshareOpen} onOpenChange={setReshareOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{language === 'nl' ? 'Document opnieuw verzenden' : 'Reshare Document'}</DialogTitle>
            <DialogDescription>
              {language === 'nl' 
                ? 'Verzend dit document naar een nieuwe ontvanger en kies het bewijskracht niveau.' 
                : 'Send this document to a new recipient and choose the evidence level.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-2 pl-1">
            {selectedTransfer?.dossier_number && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Dossier: {selectedTransfer.dossier_number}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>{language === 'nl' ? 'E-mail ontvanger' : 'Recipient Email'}</Label>
              <Input
                type="email"
                placeholder="recipient@example.com"
                value={newRecipientEmail}
                onChange={(e) => setNewRecipientEmail(e.target.value)}
              />
            </div>

            {/* Security Level Selector */}
            <SecurityLevelSelector
              value={cloneSecurityLevel}
              onChange={setCloneSecurityLevel}
              userPlan={userPlan}
              legalCreditsRemaining={legalCreditsRemaining}
            />

            {/* Phone field for SMS-based levels */}
            {(cloneSecurityLevel === "sms" || cloneSecurityLevel === "email_sms") && (
              <div className="space-y-2">
                <Label>{language === 'nl' ? 'Telefoonnummer ontvanger' : 'Recipient Phone Number'}</Label>
                <Input
                  type="tel"
                  placeholder="+31 6 12345678"
                  value={newRecipientPhone}
                  onChange={(e) => setNewRecipientPhone(e.target.value)}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>{language === 'nl' ? 'Bericht (optioneel)' : 'Message (optional)'}</Label>
              <Textarea
                placeholder={language === 'nl' ? 'Voeg een bericht toe...' : 'Add a message...'}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>{language === 'nl' ? 'Beschikbaar voor' : 'Available for'}</Label>
              <Select value={newExpiryDays} onValueChange={setNewExpiryDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">{language === 'nl' ? '7 dagen' : '7 days'}</SelectItem>
                  <SelectItem value="30">{language === 'nl' ? '30 dagen' : '30 days'}</SelectItem>
                  <SelectItem value="90">{language === 'nl' ? '90 dagen' : '90 days'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReshareOpen(false)}>
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button onClick={handleReshare} disabled={isResharing || !newRecipientEmail}>
              {isResharing 
                ? (language === 'nl' ? 'Verzenden...' : 'Resharing...') 
                : (language === 'nl' ? 'Verzenden' : 'Reshare')}
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
              {t('transfers.revokeTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately disable the download link for{" "}
              <strong>{transferToRevoke?.recipient_email}</strong>. 
              The recipient will no longer be able to access the files.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>{t('transfers.revokeCancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={isRevoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRevoking ? "..." : t('transfers.revokeAction')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Extend Retention Dialog */}
      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-primary" />
              {language === 'nl' ? 'Retentie Verlengen' : 'Extend Retention'}
            </DialogTitle>
            <DialogDescription>
              {language === 'nl' 
                ? `Verleng de beschikbaarheid van het bestand voor ${transferToExtend?.recipient_email}.`
                : `Extend the file availability for ${transferToExtend?.recipient_email}.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm">
              <p className="text-muted-foreground">
                {language === 'nl' ? 'Huidige vervaldatum:' : 'Current expiry:'}{' '}
                <strong className="text-foreground">
                  {transferToExtend && format(new Date(transferToExtend.expires_at), "d MMM yyyy, HH:mm", { locale: nl })}
                </strong>
              </p>
            </div>

            <div className="space-y-2">
              <Label>{language === 'nl' ? 'Verleng met' : 'Extend by'}</Label>
              <Select value={extendDays} onValueChange={setExtendDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">{language === 'nl' ? '7 dagen' : '7 days'}</SelectItem>
                  <SelectItem value="14">{language === 'nl' ? '14 dagen' : '14 days'}</SelectItem>
                  <SelectItem value="30">{language === 'nl' ? '30 dagen' : '30 days'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground">
                {language === 'nl' 
                  ? `Nieuwe vervaldatum: ${transferToExtend ? format(
                      new Date(
                        Math.max(new Date(transferToExtend.expires_at).getTime(), Date.now()) + parseInt(extendDays) * 24 * 60 * 60 * 1000
                      ), "d MMM yyyy, HH:mm", { locale: nl }
                    ) : ''}`
                  : `New expiry date: ${transferToExtend ? format(
                      new Date(
                        Math.max(new Date(transferToExtend.expires_at).getTime(), Date.now()) + parseInt(extendDays) * 24 * 60 * 60 * 1000
                      ), "d MMM yyyy, HH:mm", { locale: nl }
                    ) : ''}`
                }
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtendDialogOpen(false)}>
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button onClick={handleExtend} disabled={isExtending}>
              {isExtending 
                ? "..." 
                : language === 'nl' ? 'Verlengen' : 'Extend'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replace File Dialog */}
      <Dialog open={replaceDialogOpen} onOpenChange={setReplaceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              {language === 'nl' ? 'Bestand Vervangen' : 'Replace File'}
            </DialogTitle>
            <DialogDescription>
              {language === 'nl'
                ? `Vervang het bestand in deze transfer naar ${transferToReplace?.recipient_email}. Het oude bestand wordt verwijderd.`
                : `Replace the file in this transfer to ${transferToReplace?.recipient_email}. The old file will be removed.`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current file info */}
            {transferToReplace?.files?.[0] && (
              <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm">
                <p className="text-muted-foreground">
                  {language === 'nl' ? 'Huidig bestand:' : 'Current file:'}{' '}
                  <strong className="text-foreground">{transferToReplace.files[0].file_name}</strong>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({formatFileSize(transferToReplace.files[0].file_size)})
                  </span>
                </p>
              </div>
            )}

            {/* New file input */}
            <div className="space-y-2">
              <Label>{language === 'nl' ? 'Nieuw bestand' : 'New file'}</Label>
              <Input
                type="file"
                onChange={(e) => setReplaceFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
              {replaceFile && (
                <p className="text-xs text-muted-foreground">
                  {replaceFile.name} ({formatFileSize(replaceFile.size)})
                </p>
              )}
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {language === 'nl'
                  ? 'De ontvanger ziet het nieuwe bestand via dezelfde downloadlink.'
                  : 'The recipient will see the new file via the same download link.'
                }
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReplaceDialogOpen(false)}>
              {language === 'nl' ? 'Annuleren' : 'Cancel'}
            </Button>
            <Button onClick={handleReplace} disabled={isReplacing || !replaceFile}>
              {isReplacing
                ? "..."
                : language === 'nl' ? 'Vervangen' : 'Replace'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

}
