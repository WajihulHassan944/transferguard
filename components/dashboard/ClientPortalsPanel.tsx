import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  Plus, 
  Copy, 
  ExternalLink, 
  MoreVertical, 
  Trash2, 
  Edit2,
  Upload,
  Shield,
  Clock,
  FileText,
  Inbox,
  Loader2,
  Phone,
  MessageSquare,
  Mail
} from "lucide-react";
import { format } from "date-fns";

interface ClientPortal {
  id: string;
  portal_name: string;
  portal_token: string;
  description: string | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  folder_id: string | null;
  client_phone: string | null;
  sms_verification_required: boolean;
}

interface Submission {
  id: string;
  client_name: string;
  client_email: string;
  message: string | null;
  submitted_at: string;
  files: { id: string; file_name: string; file_size: number }[];
}

interface ClientPortalsPanelProps {
  userId: string;
}

export function ClientPortalsPanel({ userId }: ClientPortalsPanelProps) {
  const [portals, setPortals] = useState<ClientPortal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<ClientPortal | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  
  // Form state
  const [portalName, setPortalName] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [clientPhone, setClientPhone] = useState("");
  const [smsVerificationRequired, setSmsVerificationRequired] = useState(false);

  const getPortalUrl = (token: string) => {
    return `${window.location.origin}/upload/${token}`;
  };

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(getPortalUrl(token));
    toast.success("Link copied!");
  };

  const resetForm = () => {
    setPortalName("");
    setDescription("");
    setExpiresAt("");
    setIsActive(true);
    setSelectedPortal(null);
    setClientPhone("");
    setSmsVerificationRequired(false);
  };

  const handleCreate = async () => {
    if (!portalName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (smsVerificationRequired && !clientPhone.trim()) {
      toast.error("Phone number is required for SMS verification");
      return;
    }

    setIsSaving(true);
    setIsSaving(false);
  };

  const handleUpdate = async () => {
    if (!selectedPortal || !portalName.trim()) return;

    if (smsVerificationRequired && !clientPhone.trim()) {
      toast.error("Phone number is required for SMS verification");
      return;
    }

    setIsSaving(true);

    setIsSaving(false);
  };

  const handleDelete = async (portal: ClientPortal) => {
    if (!confirm(`Are you sure you want to delete "${portal.portal_name}"?`)) return;

  };

  const openEdit = (portal: ClientPortal) => {
    setSelectedPortal(portal);
    setPortalName(portal.portal_name);
    setDescription(portal.description || "");
    setExpiresAt(portal.expires_at ? portal.expires_at.split("T")[0] : "");
    setIsActive(portal.is_active);
    setClientPhone(portal.client_phone || "");
    setSmsVerificationRequired(portal.sms_verification_required || false);
    setIsEditOpen(true);
  };

  const viewSubmissions = async (portal: ClientPortal) => {
    setSelectedPortal(portal);
    setLoadingSubmissions(true);
    setIsSubmissionsOpen(true);

    setLoadingSubmissions(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Client Upload Portals</h1>
          <p className="text-muted-foreground">
            Create personalized upload links for your clients
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Portal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Upload Portal</DialogTitle>
              <DialogDescription>
                Create a secure upload link to share with your client.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Tax Documents - John Smith"
                  value={portalName}
                  onChange={(e) => setPortalName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="desc">Description (optional)</Label>
                <Textarea
                  id="desc"
                  placeholder="Instructions for your client..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expires">Expiry Date (optional)</Label>
                <Input
                  id="expires"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>

              {/* QERDS Verification Section */}
              <Card className="bg-accent/30 border-accent">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <Label htmlFor="email-verify">QERDS Verification</Label>
                    </div>
                    <Switch
                      id="email-verify"
                      checked={smsVerificationRequired}
                      onCheckedChange={setSmsVerificationRequired}
                    />
                  </div>
                  
                  {smsVerificationRequired && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Clients must verify their identity before uploading documents (legally binding).
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active immediately</Label>
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Portal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">End-to-end Encrypted</p>
              <p className="text-sm text-muted-foreground">
                All uploads via your portals are secured with end-to-end encryption and appear automatically in your dashboard with your own branding.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portals List */}
      {portals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No upload portals yet</h3>
            <p className="text-muted-foreground mb-4">
              Create a portal to let clients upload documents securely.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Portal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {portals.map((portal) => (
            <Card key={portal.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium truncate">{portal.portal_name}</h3>
                      <Badge variant={portal.is_active ? "default" : "secondary"}>
                        {portal.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {portal.sms_verification_required && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          SMS 2FA
                        </Badge>
                      )}
                      {portal.expires_at && new Date(portal.expires_at) < new Date() && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </div>
                    
                    {portal.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {portal.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Created: {format(new Date(portal.created_at), "MMM d, yyyy")}
                      </span>
                      {portal.expires_at && (
                        <span className="flex items-center gap-1">
                          Expires: {format(new Date(portal.expires_at), "MMM d, yyyy")}
                        </span>
                      )}
                      {portal.client_phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {portal.client_phone}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyLink(portal.portal_token)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Link
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewSubmissions(portal)}
                    >
                      <Inbox className="h-4 w-4 mr-1" />
                      Submissions
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(getPortalUrl(portal.portal_token), "_blank")}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Portal
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(portal)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(portal)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Portal</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={portalName}
                onChange={(e) => setPortalName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-expires">Expiry Date</Label>
              <Input
                id="edit-expires"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>

            {/* SMS Verification Section */}
            <Card className="bg-accent/30 border-accent">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <Label htmlFor="edit-sms-verify">SMS Verification (2FA)</Label>
                  </div>
                  <Switch
                    id="edit-sms-verify"
                    checked={smsVerificationRequired}
                    onCheckedChange={setSmsVerificationRequired}
                  />
                </div>
                
                {smsVerificationRequired && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-client-phone">Client Phone Number *</Label>
                    <Input
                      id="edit-client-phone"
                      type="tel"
                      placeholder="+31 6 12345678"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Only this phone number can verify and upload documents.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-active">Active</Label>
              <Switch
                id="edit-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submissions Dialog */}
      <Dialog open={isSubmissionsOpen} onOpenChange={setIsSubmissionsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Submissions - {selectedPortal?.portal_name}</DialogTitle>
            <DialogDescription>
              View all documents submitted via this portal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4">
            {loadingSubmissions ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No submissions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <Card key={sub.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{sub.client_name}</p>
                          <p className="text-sm text-muted-foreground">{sub.client_email}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(sub.submitted_at), "MMM d, yyyy HH:mm")}
                        </span>
                      </div>
                      
                      {sub.message && (
                        <p className="text-sm text-muted-foreground mb-3 bg-muted/50 p-2 rounded">
                          {sub.message}
                        </p>
                      )}
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          {sub.files.length} file{sub.files.length !== 1 ? "s" : ""}
                        </p>
                        {sub.files.map((file) => (
                          <div 
                            key={file.id}
                            className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded"
                          >
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="flex-1 truncate">{file.file_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.file_size)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
