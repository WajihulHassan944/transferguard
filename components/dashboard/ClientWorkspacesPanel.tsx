import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Plus, 
  FolderOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  Search,
  ExternalLink,
  Copy,
  MoreVertical,
  Trash2,
  Mail,
  ShieldCheck,
  FileText,
  Activity,
  MessageSquare,
  Download,
} from "lucide-react";
import { WorkspaceDossierManager } from "./WorkspaceDossierManager";
import { WorkspaceMessagesPanel } from "./WorkspaceMessagesPanel";
import { WorkspaceDownloadLogsPanel } from "./WorkspaceDownloadLogsPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

interface Workspace {
  id: string;
  recipient_email: string;
  recipient_name: string | null;
  identity_verified_at: string | null;
  verification_method: string | null;
  last_accessed_at: string | null;
  access_token: string;
  created_at: string;
  dossiers_count?: number;
  files_count?: number;
  unread_messages_count?: number;
}

interface ClientWorkspacesPanelProps {
  userId: string;
  userEmail: string;
}

export function ClientWorkspacesPanel({ userId, userEmail }: ClientWorkspacesPanelProps) {
  const { t, language } = useLanguage();
  const dateLocale = language === 'nl' ? nl : enUS;
  
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newRecipientEmail, setNewRecipientEmail] = useState("");
  const [newRecipientName, setNewRecipientName] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [dossierManagerOpen, setDossierManagerOpen] = useState(false);


  const handleCreateWorkspace = async () => {
    if (!newRecipientEmail.trim()) {
      toast.error(t('workspaces.emailRequired'));
      return;
    }

    setCreating(true);
      setCreating(false);
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (!confirm(t('workspaces.deleteConfirm'))) {
      return;
    }

  };

  const copyAccessLink = (workspace: Workspace) => {
    const link = `${window.location.origin}/workspace/${workspace.access_token}`;
    navigator.clipboard.writeText(link);
    toast.success(t('workspaces.linkCopied'));
  };

  const filteredWorkspaces = workspaces.filter(ws => 
    ws.recipient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ws.recipient_name && ws.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{t('workspaces.title')}</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('workspaces.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('workspaces.subtitle')}
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('workspaces.new')}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('workspaces.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-border"
        />
      </div>

      {/* Workspaces Grid */}
      {filteredWorkspaces.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('workspaces.noWorkspaces')}</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              {t('workspaces.noWorkspacesDesc')}
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('workspaces.createFirst')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkspaces.map((workspace) => (
            <Card 
              key={workspace.id} 
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => setSelectedWorkspace(workspace)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate">
                      {workspace.recipient_name || workspace.recipient_email}
                    </CardTitle>
                    {workspace.recipient_name && (
                      <CardDescription className="truncate mt-1">
                        {workspace.recipient_email}
                      </CardDescription>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); copyAccessLink(workspace); }}>
                        <Copy className="h-4 w-4 mr-2" />
                        {t('workspaces.copyAccessLink')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={(e) => { e.stopPropagation(); handleDeleteWorkspace(workspace.id); }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('workspaces.deleteWorkspace')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-5">
                {/* Verification Status */}
                <div>
                  {workspace.identity_verified_at ? (
                    <Badge className="bg-success-light text-success border-success-border px-3 py-1">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      {t('workspaces.verified')}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground px-3 py-1">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      {t('workspaces.pendingVerification')}
                    </Badge>
                  )}
                </div>

                {/* Stats - More spacious layout */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground/70" />
                    <span className="font-medium text-foreground">{workspace.dossiers_count}</span>
                    <span>{t('workspaces.dossiers')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground/70" />
                    <span className="font-medium text-foreground">{workspace.files_count}</span>
                    <span>{t('workspaces.files')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground/70" />
                    <span className="font-medium text-foreground">{workspace.unread_messages_count || 0}</span>
                    {(workspace.unread_messages_count || 0) > 0 && (
                      <Badge className="h-5 px-1.5 text-[10px] bg-primary text-primary-foreground">
                        {t('workspaces.new_badge')}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Last Activity - With separator */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {workspace.last_accessed_at 
                      ? `${t('workspaces.lastAccessed')} ${formatDistanceToNow(new Date(workspace.last_accessed_at), { addSuffix: true, locale: dateLocale })}`
                      : `${t('workspaces.created')} ${formatDistanceToNow(new Date(workspace.created_at), { addSuffix: true, locale: dateLocale })}`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Workspace Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('workspaces.createTitle')}</DialogTitle>
            <DialogDescription>
              {t('workspaces.createDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('workspaces.clientEmail')} *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="client@company.com"
                  value={newRecipientEmail}
                  onChange={(e) => setNewRecipientEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t('workspaces.clientName')}</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newRecipientName}
                onChange={(e) => setNewRecipientName(e.target.value)}
              />
            </div>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>{t('workspaces.oneTimeVerification')}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('workspaces.verificationDesc')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              {t('workspaces.cancel')}
            </Button>
            <Button onClick={handleCreateWorkspace} disabled={creating}>
              {creating ? t('workspaces.creating') : t('workspaces.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workspace Details Sheet with Tabs */}
      <Sheet open={!!selectedWorkspace} onOpenChange={() => setSelectedWorkspace(null)}>
        <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col">
          <SheetHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <SheetTitle>
                    {selectedWorkspace?.recipient_name || selectedWorkspace?.recipient_email}
                  </SheetTitle>
                  {selectedWorkspace?.recipient_name && (
                    <p className="text-sm text-muted-foreground">
                      {selectedWorkspace?.recipient_email}
                    </p>
                  )}
                </div>
              </div>
              {selectedWorkspace?.identity_verified_at ? (
                <Badge className="bg-success-light text-success border-success-border">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {t('workspaces.verified')}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {t('workspaces.pendingVerification')}
                </Badge>
              )}
            </div>
          </SheetHeader>

          {selectedWorkspace && (
            <Tabs defaultValue="messages" className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 border-b">
                <TabsList className="h-12 bg-transparent gap-4">
                  <TabsTrigger 
                    value="messages" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('workspaces.tab.messages')}
                    {(selectedWorkspace.unread_messages_count || 0) > 0 && (
                      <Badge className="ml-2 h-5 px-1.5 bg-primary text-primary-foreground">
                        {selectedWorkspace.unread_messages_count}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="dossiers" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    {t('workspaces.tab.dossiers')}
                    <Badge variant="outline" className="ml-2">
                      {selectedWorkspace.dossiers_count}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="downloads" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {language === 'nl' ? 'Downloads' : 'Downloads'}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="info" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    {t('workspaces.tab.info')}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="messages" className="flex-1 m-0 overflow-hidden">
                <WorkspaceMessagesPanel
                  workspaceId={selectedWorkspace.id}
                  workspaceName={selectedWorkspace.recipient_name || selectedWorkspace.recipient_email}
                  recipientEmail={selectedWorkspace.recipient_email}
                  currentUserEmail={userEmail}
                />
              </TabsContent>

              <TabsContent value="dossiers" className="flex-1 m-0 overflow-auto p-6">
                <div className="space-y-4">
                  <Button onClick={() => setDossierManagerOpen(true)}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    {t('workspaces.manageDossiers')}
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <FolderOpen className="h-6 w-6 mx-auto text-primary mb-2" />
                        <p className="text-2xl font-semibold">{selectedWorkspace.dossiers_count}</p>
                        <p className="text-xs text-muted-foreground">{t('workspaces.tab.dossiers')}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <FileText className="h-6 w-6 mx-auto text-primary mb-2" />
                        <p className="text-2xl font-semibold">{selectedWorkspace.files_count}</p>
                        <p className="text-xs text-muted-foreground">{t('workspaces.files')}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="downloads" className="flex-1 m-0 overflow-auto p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {language === 'nl' ? 'Download Bewijzen' : 'Download Evidence'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'nl' 
                        ? 'Volledig bewijs met IP-adres, locatie, apparaat en certificaat voor elke download.'
                        : 'Complete proof with IP address, location, device and certificate for each download.'}
                    </p>
                  </div>
                  <WorkspaceDownloadLogsPanel workspaceId={selectedWorkspace.id} />
                </div>
              </TabsContent>

              <TabsContent value="info" className="flex-1 m-0 overflow-auto p-6">
                <div className="space-y-6">
                  {/* Verification Status */}
                  <div className="flex items-center gap-4">
                    {selectedWorkspace.identity_verified_at ? (
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle2 className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{t('workspaces.identityVerified')}</p>
                          <p className="text-xs text-muted-foreground">
                            via {selectedWorkspace.verification_method || "iDIN"} • {formatDistanceToNow(new Date(selectedWorkspace.identity_verified_at), { addSuffix: true, locale: dateLocale })}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{t('workspaces.waitingVerification')}</p>
                          <p className="text-xs">{t('workspaces.clientNotVerified')}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Access Link */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <Label className="text-xs text-muted-foreground mb-2 block">{t('workspaces.accessLinkLabel')}</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        readOnly 
                        value={`${window.location.origin}/workspace/${selectedWorkspace.access_token}`}
                        className="text-sm"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyAccessLink(selectedWorkspace)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => window.open(`/workspace/${selectedWorkspace.access_token}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => copyAccessLink(selectedWorkspace)}>
                      <Mail className="h-4 w-4 mr-2" />
                      {t('workspaces.sendAccessLink')}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>

      {/* Dossier Manager Sheet */}
      {selectedWorkspace && (
        <WorkspaceDossierManager
          workspaceId={selectedWorkspace.id}
          workspaceName={selectedWorkspace.recipient_name || selectedWorkspace.recipient_email}
          open={dossierManagerOpen}
          onOpenChange={setDossierManagerOpen}
        />
      )}
    </div>
  );
}