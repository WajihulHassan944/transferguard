import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  FolderOpen,
  FileText,
  MoreVertical,
  Trash2,
  Upload,
  ArrowLeft,
  Download,
  Calendar,
  CheckCircle2,
  File,
  X,
  Loader2,
  User,
  UserCheck,
  Award,
  Clock,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { nl } from "date-fns/locale";

// FileRow subcomponent for cleaner code
interface FileRowProps {
  file: WorkspaceFile;
  getFileIcon: (mimeType: string | null) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
  onDelete: (fileId: string) => void;
}

function FileRow({ file, getFileIcon, formatFileSize, onDelete }: FileRowProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-background rounded-xl border hover:shadow-sm transition-all group">
      <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
        {getFileIcon(file.mime_type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{file.file_name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <span>{formatFileSize(file.file_size)}</span>
          <span>•</span>
          <span>{format(new Date(file.created_at), "d MMM yyyy", { locale: nl })}</span>
        </div>
        
        {/* Download Status - more prominent */}
        {file.downloaded_at ? (
          <div className="mt-2 flex items-center gap-2 p-2 bg-success/5 rounded-lg border border-success/20">
            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
            <div className="text-xs">
              <p className="font-medium text-success">Gedownload</p>
              <p className="text-muted-foreground">
                {format(new Date(file.downloaded_at), "d MMMM yyyy 'om' HH:mm", { locale: nl })}
                {file.downloaded_by && (
                  <span className="block">Door: {file.downloaded_by}</span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">Nog niet gedownload</p>
          </div>
        )}
      </div>
      
      {/* Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-popover">
          <DropdownMenuItem onClick={() => toast.info("Download functie binnenkort beschikbaar")}>
            <Download className="h-4 w-4 mr-2" />
            Download bestand
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info("Details bekijken binnenkort beschikbaar")}>
            <Eye className="h-4 w-4 mr-2" />
            Bekijk details
          </DropdownMenuItem>
          {file.downloaded_at && (
            <DropdownMenuItem onClick={() => toast.info("Certificaat genereren binnenkort beschikbaar")}>
              <Award className="h-4 w-4 mr-2" />
              Download certificaat
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => onDelete(file.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Verwijder bestand
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface Dossier {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  dossier_number: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  files_count?: number;
}

interface WorkspaceFile {
  id: string;
  dossier_id: string;
  file_name: string;
  file_size: number;
  mime_type: string | null;
  s3_key: string;
  uploaded_by: string;
  uploader_email: string;
  created_at: string;
  downloaded_at: string | null;
  downloaded_by: string | null;
}

interface WorkspaceDossierManagerProps {
  workspaceId: string;
  workspaceName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkspaceDossierManager({
  workspaceId,
  workspaceName,
  open,
  onOpenChange,
}: WorkspaceDossierManagerProps) {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(false);
  
  // Create dossier state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newDossierName, setNewDossierName] = useState("");
  const [newDossierDescription, setNewDossierDescription] = useState("");
  const [newDossierNumber, setNewDossierNumber] = useState("");
  const [creating, setCreating] = useState(false);

  // Upload state
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [dragOver, setDragOver] = useState(false);



  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <File className="h-5 w-5" />;
    if (mimeType.startsWith("image/")) return <FileText className="h-5 w-5" />;
    if (mimeType.includes("pdf")) return <FileText className="h-5 w-5 text-destructive" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-2">
            {selectedDossier && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDossier(null)}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <SheetTitle>
                {selectedDossier ? selectedDossier.name : `Dossiers - ${workspaceName}`}
              </SheetTitle>
              <SheetDescription>
                {selectedDossier
                  ? `${files.length} files in this dossier`
                  : `Manage dossiers and files for this client workspace`}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Dossier List View */}
        {!selectedDossier && (
          <div className="space-y-4">
            <Button onClick={() => setCreateDialogOpen(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create New Dossier
            </Button>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : dossiers.length === 0 ? (
              <Card className="py-12">
                <CardContent className="text-center">
                  <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No dossiers yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create a dossier to organize and share files with this client.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {dossiers.map((dossier) => (
                  <Card
                    key={dossier.id}
                    className="hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => setSelectedDossier(dossier)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FolderOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{dossier.name}</h3>
                            {dossier.dossier_number && (
                              <p className="text-xs text-muted-foreground">
                                #{dossier.dossier_number}
                              </p>
                            )}
                            {dossier.description && (
                              <p className="text-sm text-muted-foreground truncate mt-1">
                                {dossier.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {dossier.files_count} files
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDistanceToNow(new Date(dossier.created_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                // handleDeleteDossier(dossier.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete dossier
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* File List View */}
        {selectedDossier && (
          <div className="space-y-4">
            {/* Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                // handleFileUpload(e.dataTransfer.files);
              }}
            >
              {uploadingFiles ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag files here or click to upload
                  </p>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    // onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span>Select Files</span>
                    </Button>
                  </label>
                </>
              )}
            </div>

            {/* Files List */}
            {filesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-muted rounded" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : files.length === 0 ? (
              <Card className="py-8">
                <CardContent className="text-center">
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-medium mb-1">No files yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload files to share with your client.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Files by Sender */}
                {files.filter(f => f.uploaded_by === "sender").length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Door jou gedeeld</h4>
                        <p className="text-xs text-muted-foreground">
                          {files.filter(f => f.uploaded_by === "sender").length} bestand(en)
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 pl-10">
                      {files.filter(f => f.uploaded_by === "sender").map((file) => (
                        <FileRow 
                          key={file.id} 
                          file={file} 
                          getFileIcon={getFileIcon}
                          formatFileSize={formatFileSize}
                          onDelete={()=>alert("del")}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Files by Recipient */}
                {files.filter(f => f.uploaded_by === "recipient").length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <UserCheck className="h-4 w-4 text-secondary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Door klant geüpload</h4>
                        <p className="text-xs text-muted-foreground">
                          {files.filter(f => f.uploaded_by === "recipient").length} bestand(en)
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 pl-10">
                      {files.filter(f => f.uploaded_by === "recipient").map((file) => (
                        <FileRow 
                          key={file.id} 
                          file={file} 
                          getFileIcon={getFileIcon}
                          formatFileSize={formatFileSize}
                          onDelete={()=>("del")}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Create Dossier Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Dossier</DialogTitle>
              <DialogDescription>
                Create a dossier to organize files for this client.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="dossier-name">Dossier Name *</Label>
                <Input
                  id="dossier-name"
                  placeholder="e.g., Contract Documents 2024"
                  value={newDossierName}
                  onChange={(e) => setNewDossierName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dossier-number">Dossier Number (optional)</Label>
                <Input
                  id="dossier-number"
                  placeholder="e.g., DOS-2024-001"
                  value={newDossierNumber}
                  onChange={(e) => setNewDossierNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dossier-description">Description (optional)</Label>
                <Textarea
                  id="dossier-description"
                  placeholder="Add a description for this dossier..."
                  value={newDossierDescription}
                  onChange={(e) => setNewDossierDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button  disabled={creating}>
                {creating ? "Creating..." : "Create Dossier"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  );
}
