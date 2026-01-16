import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  FolderPlus,
  Upload,
  Folder,
  FolderOpen,
  File,
  Pencil,
  Trash2,
  Share2,
  ArrowLeft,
  FolderInput,
  X,
  Check,
  LayoutGrid,
  List,
  LayoutList,
  Plus,
  Lock,
  LockOpen,
  Shield,
  Mail,
  Copy,
  Link,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  HardDrive,
  FileText,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilePreview, FileThumbnail, canPreview } from "./FilePreview";

interface FileExplorerProps {
  userId: string;
}

interface FolderItem {
  id: string;
  name: string;
  parent_folder_id: string | null;
  created_at: string;
}

interface FileItem {
  id: string;
  file_name: string;
  file_size: number;
  folder_id: string | null;
  created_at: string;
  s3_key: string;
  mime_type?: string | null;
  locked_until?: string | null;
  lock_reason?: string | null;
}

type SelectedItem = { id: string; type: "folder" | "file"; name: string };
type ViewMode = "grid" | "list" | "compact";
type SortField = "name" | "size" | "created_at";
type SortDirection = "asc" | "desc";

export function FileExplorer({ userId }: FileExplorerProps) {
  const isMobile = useIsMobile();
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  
  // Sort options
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  // Selection mode
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  
  // Swipe state
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);
  const touchStartX = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  
  // Dialog states
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameItem, setRenameItem] = useState<{ id: string; name: string; type: "folder" | "file" } | null>(null);
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveItem, setMoveItem] = useState<{ id: string; type: "folder" | "file" } | null>(null);
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
  const [allFolders, setAllFolders] = useState<FolderItem[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Share dialog states
  const [shareOpen, setShareOpen] = useState(false);
  const [shareFileId, setShareFileId] = useState<string | null>(null);
  const [shareFileName, setShareFileName] = useState("");
  const [shareEmails, setShareEmails] = useState<string[]>([""]);
  const [shareMessage, setShareMessage] = useState("");
  const [sharePassword, setSharePassword] = useState("");
  const [sharePasswordEnabled, setSharePasswordEnabled] = useState(false);
  const [shareExpiryDays, setShareExpiryDays] = useState<number | null>(7);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  
  // Preview states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  
  // Object lock states
  const [lockOpen, setLockOpen] = useState(false);
  const [lockFileId, setLockFileId] = useState<string | null>(null);
  const [lockFileName, setLockFileName] = useState("");
  const [lockDuration, setLockDuration] = useState<number>(30); // days
  const [lockReason, setLockReason] = useState("");
  const [isLocking, setIsLocking] = useState(false);

  useEffect(() => {
    loadContent();
  }, [currentFolder, userId]);

  // Close swipe when clicking elsewhere
  useEffect(() => {
    const handleClick = () => setSwipedItemId(null);
    if (swipedItemId) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [swipedItemId]);

  const loadContent = async () => {
    setLoading(true);
    
    // Load folders
    let foldersQuery = supabase
      .from("folders")
      .select("*")
      .eq("user_id", userId);
    
    if (currentFolder === null) {
      foldersQuery = foldersQuery.is("parent_folder_id", null);
    } else {
      foldersQuery = foldersQuery.eq("parent_folder_id", currentFolder);
    }
    
    const { data: foldersData, error: foldersError } = await foldersQuery;

    if (foldersError) {
      toast.error("Error loading folders");
    } else {
      setFolders(foldersData || []);
    }

    // Load files
    let filesQuery = supabase
      .from("archived_files")
      .select("*")
      .eq("user_id", userId);
    
    if (currentFolder === null) {
      filesQuery = filesQuery.is("folder_id", null);
    } else {
      filesQuery = filesQuery.eq("folder_id", currentFolder);
    }
    
    const { data: filesData, error: filesError } = await filesQuery;

    if (filesError) {
      toast.error("Error loading files");
    } else {
      setFiles(filesData || []);
    }

    // Load all folders for move dialog
    const { data: allFoldersData } = await supabase
      .from("folders")
      .select("*")
      .eq("user_id", userId);
    
    setAllFolders(allFoldersData || []);

    setLoading(false);
  };

  const navigateToFolder = async (folderId: string | null) => {
    if (selectionMode) return; // Don't navigate in selection mode
    
    if (folderId === null) {
      setFolderPath([]);
      setCurrentFolder(null);
      return;
    }

    const folder = folders.find(f => f.id === folderId) || allFolders.find(f => f.id === folderId);
    if (folder) {
      setFolderPath(prev => [...prev, folder]);
      setCurrentFolder(folderId);
    }
  };

  const navigateUp = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath];
      newPath.pop();
      setFolderPath(newPath);
      setCurrentFolder(newPath.length > 0 ? newPath[newPath.length - 1].id : null);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;

    const { error } = await supabase.from("folders").insert({
      user_id: userId,
      name: newFolderName.trim(),
      parent_folder_id: currentFolder,
    });

    if (error) {
      toast.error("Error creating folder");
    } else {
      toast.success("Folder created");
      setNewFolderName("");
      setNewFolderOpen(false);
      loadContent();
    }
  };

  // Check if file is locked
  const isFileLocked = (file: FileItem): boolean => {
    if (!file.locked_until) return false;
    return new Date(file.locked_until) > new Date();
  };

  const getLockedFile = (id: string): FileItem | undefined => {
    return files.find(f => f.id === id);
  };

  const handleRename = async () => {
    if (!renameItem || !renameItem.name.trim()) return;

    // Check if file is locked
    if (renameItem.type === "file") {
      const file = getLockedFile(renameItem.id);
      if (file && isFileLocked(file)) {
        toast.error(`This file is locked until ${new Date(file.locked_until!).toLocaleDateString()}`);
        setRenameOpen(false);
        setRenameItem(null);
        return;
      }
    }

    if (renameItem.type === "folder") {
      const { error } = await supabase
        .from("folders")
        .update({ name: renameItem.name.trim() })
        .eq("id", renameItem.id);

      if (error) {
        toast.error("Error renaming");
      } else {
        toast.success("Renamed");
        loadContent();
      }
    } else {
      const { error } = await supabase
        .from("archived_files")
        .update({ file_name: renameItem.name.trim() })
        .eq("id", renameItem.id);

      if (error) {
        toast.error("Error renaming");
      } else {
        toast.success("Renamed");
        loadContent();
      }
    }

    setRenameOpen(false);
    setRenameItem(null);
  };

  const handleMove = async () => {
    if (!moveItem) return;

    if (moveItem.type === "folder") {
      const { error } = await supabase
        .from("folders")
        .update({ parent_folder_id: targetFolderId })
        .eq("id", moveItem.id);

      if (error) {
        toast.error("Error moving");
      } else {
        toast.success("Moved");
        loadContent();
      }
    } else {
      const { error } = await supabase
        .from("archived_files")
        .update({ folder_id: targetFolderId })
        .eq("id", moveItem.id);

      if (error) {
        toast.error("Error moving");
      } else {
        toast.success("Moved");
        loadContent();
      }
    }

    setMoveOpen(false);
    setMoveItem(null);
    setTargetFolderId(null);
  };

  const handleDelete = async (id: string, type: "folder" | "file") => {
    // Check if file is locked
    if (type === "file") {
      const file = getLockedFile(id);
      if (file && isFileLocked(file)) {
        toast.error(`This file is locked until ${new Date(file.locked_until!).toLocaleDateString()}`);
        return;
      }
    }

    const confirmed = window.confirm(
      type === "folder" 
        ? "Are you sure you want to delete this folder and all its contents?" 
        : "Are you sure you want to delete this file?"
    );

    if (!confirmed) return;

    if (type === "folder") {
      const { error } = await supabase.from("folders").delete().eq("id", id);
      if (error) {
        toast.error("Error deleting");
      } else {
        toast.success("Folder deleted");
        loadContent();
      }
    } else {
      const { error } = await supabase.from("archived_files").delete().eq("id", id);
      if (error) {
        toast.error("Error deleting");
      } else {
        toast.success("File deleted");
        loadContent();
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    // Check for locked files
    const lockedFiles = selectedItems.filter(item => {
      if (item.type === "file") {
        const file = getLockedFile(item.id);
        return file && isFileLocked(file);
      }
      return false;
    });

    if (lockedFiles.length > 0) {
      toast.error(`${lockedFiles.length} file(s) are locked and cannot be deleted`);
      return;
    }
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedItems.length} item(s)?`
    );
    
    if (!confirmed) return;

    for (const item of selectedItems) {
      if (item.type === "folder") {
        await supabase.from("folders").delete().eq("id", item.id);
      } else {
        await supabase.from("archived_files").delete().eq("id", item.id);
      }
    }

    toast.success(`${selectedItems.length} item(s) deleted`);
    setSelectedItems([]);
    setSelectionMode(false);
    loadContent();
  };

  const handleBulkMove = () => {
    if (selectedItems.length === 0) return;
    setMoveItem({ id: selectedItems[0].id, type: selectedItems[0].type });
    setMoveOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort folders and files
  const sortedFolders = [...folders].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "created_at") {
      comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    // Folders don't have size, so treat them as equal for size sorting
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const sortedFiles = [...files].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.file_name.localeCompare(b.file_name);
    } else if (sortField === "size") {
      comparison = a.file_size - b.file_size;
    } else if (sortField === "created_at") {
      comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortLabel = () => {
    const labels: Record<SortField, string> = {
      name: "Name",
      size: "Size",
      created_at: "Date"
    };
    return labels[sortField];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    
    try {
      for (const file of selectedFiles) {
        const s3Key = `${userId}/${currentFolder || 'root'}/${Date.now()}-${file.name}`;
        
        const { error } = await supabase.from("archived_files").insert({
          user_id: userId,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          folder_id: currentFolder,
          folder_path: folderPath.length > 0 ? "/" + folderPath.map(f => f.name).join("/") : "/",
          s3_key: s3Key,
        });

        if (error) {
          toast.error(`Error uploading ${file.name}`);
          console.error("Upload error:", error);
        }
      }
      
      toast.success(`${selectedFiles.length} file(s) uploaded`);
      setSelectedFiles([]);
      setUploadOpen(false);
      loadContent();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading files");
    } finally {
      setUploading(false);
    }
  };

  const toggleSelection = (item: SelectedItem) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const isSelected = (id: string) => selectedItems.some(i => i.id === id);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent, itemId: string) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (itemId: string) => {
    const diff = touchStartX.current - touchCurrentX.current;
    if (diff > 50) {
      // Swiped left - show actions
      setSwipedItemId(itemId);
    } else if (diff < -50) {
      // Swiped right - hide actions
      setSwipedItemId(null);
    }
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedItems([]);
  };

  const openShareDialog = (fileId: string, fileName: string) => {
    setShareFileId(fileId);
    setShareFileName(fileName);
    setShareEmails([""]);
    setShareMessage("");
    setSharePassword("");
    setSharePasswordEnabled(false);
    setShareExpiryDays(7);
    setShareLink(null);
    setShareOpen(true);
  };

  const addEmailField = () => {
    setShareEmails([...shareEmails, ""]);
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...shareEmails];
    newEmails[index] = value;
    setShareEmails(newEmails);
  };

  const removeEmailField = (index: number) => {
    if (shareEmails.length > 1) {
      setShareEmails(shareEmails.filter((_, i) => i !== index));
    }
  };

  const handleShare = async () => {
    if (!shareFileId) return;
    
    const validEmails = shareEmails.filter(e => e.trim() && e.includes("@"));
    if (validEmails.length === 0) {
      toast.error("Please enter at least one valid email address");
      return;
    }

    setIsSharing(true);

    try {
      const expiresAt = shareExpiryDays === null 
        ? null 
        : new Date(Date.now() + shareExpiryDays * 24 * 60 * 60 * 1000).toISOString();
      
      // Simple password hash (in production, use bcrypt via edge function)
      const passwordHash = sharePasswordEnabled && sharePassword 
        ? btoa(sharePassword) // Base64 encode for demo - use proper hashing in production
        : null;

      // Create share for each email
      for (const email of validEmails) {
        const { error } = await supabase.from("file_shares").insert({
          file_id: shareFileId,
          shared_by: userId,
          shared_with_email: email.trim().toLowerCase(),
          message: shareMessage || null,
          expires_at: expiresAt,
          password_hash: passwordHash,
          is_active: true,
        });

        if (error) throw error;
      }

      // Get the download token for the first share to show the link
      const { data: shareData } = await supabase
        .from("file_shares")
        .select("download_token")
        .eq("file_id", shareFileId)
        .eq("shared_by", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (shareData) {
        const downloadUrl = `${window.location.origin}/download?token=${shareData.download_token}`;
        setShareLink(downloadUrl);
      }

      toast.success(`Shared with ${validEmails.length} recipient(s)`);
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share file");
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard");
    }
  };

  const openLockDialog = (fileId: string, fileName: string) => {
    setLockFileId(fileId);
    setLockFileName(fileName);
    setLockDuration(30);
    setLockReason("");
    setLockOpen(true);
  };

  const handleLockFile = async () => {
    if (!lockFileId) return;
    
    setIsLocking(true);
    
    try {
      const lockedUntil = new Date(Date.now() + lockDuration * 24 * 60 * 60 * 1000).toISOString();
      
      const { error } = await supabase
        .from("archived_files")
        .update({
          locked_until: lockedUntil,
          lock_reason: lockReason || null,
        })
        .eq("id", lockFileId);

      if (error) throw error;

      toast.success(`File locked for ${lockDuration} days`);
      setLockOpen(false);
      loadContent();
    } catch (error) {
      console.error("Lock error:", error);
      toast.error("Failed to lock file");
    } finally {
      setIsLocking(false);
    }
  };

  const handleUnlockFile = async (fileId: string) => {
    const file = getLockedFile(fileId);
    if (!file) return;
    
    if (isFileLocked(file)) {
      const confirmed = window.confirm(
        "Warning: This file is still in its retention period. Are you sure you want to remove the lock? This may violate compliance requirements."
      );
      if (!confirmed) return;
    }
    
    try {
      const { error } = await supabase
        .from("archived_files")
        .update({
          locked_until: null,
          lock_reason: null,
        })
        .eq("id", fileId);

      if (error) throw error;

      toast.success("File unlocked");
      loadContent();
    } catch (error) {
      console.error("Unlock error:", error);
      toast.error("Failed to unlock file");
    }
  };

  return (
    <div className="space-y-4">
{/* macOS-style Breadcrumb Navigation */}
      <nav className="flex items-center gap-0.5 text-[13px] bg-secondary/50 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-border/50 shadow-sm">
        <button
          onClick={() => navigateToFolder(null)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
            folderPath.length === 0 
              ? "bg-primary text-primary-foreground font-medium shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
          }`}
        >
          <FolderOpen className="h-4 w-4" />
          <span>My Files</span>
        </button>
        
        {folderPath.map((folder, index) => (
          <div key={folder.id} className="flex items-center gap-0.5">
            <svg className="h-4 w-4 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
            <button
              onClick={() => {
                const newPath = folderPath.slice(0, index + 1);
                setFolderPath(newPath);
                setCurrentFolder(folder.id);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                index === folderPath.length - 1
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
              }`}
            >
              <Folder className="h-3.5 w-3.5" />
              {folder.name}
            </button>
          </div>
        ))}
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectionMode && (
            <Button variant="ghost" size="sm" onClick={exitSelectionMode}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-xl font-semibold">
            {selectionMode 
              ? `${selectedItems.length} selected`
              : folderPath.length > 0 
                ? folderPath[folderPath.length - 1].name
                : "All Files"}
          </h1>
        </div>
        
        {selectionMode ? (
          // Selection toolbar
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (selectedItems.length === 1) {
                  const item = selectedItems[0];
                  setRenameItem({ id: item.id, name: item.name, type: item.type });
                  setRenameOpen(true);
                }
              }}
              disabled={selectedItems.length !== 1}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Rename
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleBulkMove}
              disabled={selectedItems.length === 0}
            >
              <FolderInput className="h-4 w-4 mr-2" />
              Move
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleBulkDelete}
              disabled={selectedItems.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            {/* View mode toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {viewMode === "grid" && <LayoutGrid className="h-4 w-4" />}
                  {viewMode === "list" && <List className="h-4 w-4" />}
                  {viewMode === "compact" && <LayoutList className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border shadow-lg z-50">
                <DropdownMenuItem onClick={() => setViewMode("grid")}>
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Grid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("list")}>
                  <List className="h-4 w-4 mr-2" />
                  List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("compact")}>
                  <LayoutList className="h-4 w-4 mr-2" />
                  Compact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {getSortLabel()}
                  {sortDirection === "asc" ? (
                    <ArrowUp className="h-3 w-3 ml-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 ml-1" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border shadow-lg z-50">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toggleSort("name")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Name
                  {sortField === "name" && (sortDirection === "asc" ? <ArrowUp className="h-3 w-3 ml-auto" /> : <ArrowDown className="h-3 w-3 ml-auto" />)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort("size")}>
                  <HardDrive className="h-4 w-4 mr-2" />
                  File Size
                  {sortField === "size" && (sortDirection === "asc" ? <ArrowUp className="h-3 w-3 ml-auto" /> : <ArrowDown className="h-3 w-3 ml-auto" />)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort("created_at")}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Created
                  {sortField === "created_at" && (sortDirection === "asc" ? <ArrowUp className="h-3 w-3 ml-auto" /> : <ArrowDown className="h-3 w-3 ml-auto" />)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectionMode(true)}
            >
              <Check className="h-4 w-4 mr-2" />
              Select
            </Button>
            <Button variant="outline" onClick={() => setNewFolderOpen(true)}>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : folders.length === 0 && files.length === 0 ? (
        <Card className="p-12 text-center bg-card/60 backdrop-blur-sm border-border/50 shadow-sm">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
            <Folder className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">This folder is empty</h3>
          <p className="text-muted-foreground mb-4">
            Create a new folder or upload files
          </p>
        </Card>
      ) : (
        <>
          {/* Grid View - macOS Finder style */}
          {viewMode === "grid" && (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {sortedFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="relative overflow-hidden"
                  onTouchStart={(e) => isMobile && handleTouchStart(e, folder.id)}
                  onTouchMove={isMobile ? handleTouchMove : undefined}
                  onTouchEnd={() => isMobile && handleTouchEnd(folder.id)}
                >
                  <div
                    className={`p-3 rounded-xl transition-all cursor-pointer group flex flex-col items-center text-center ${
                      isSelected(folder.id) 
                        ? "bg-primary/15 ring-2 ring-primary/50" 
                        : "hover:bg-accent/60"
                    } ${swipedItemId === folder.id ? "-translate-x-24" : ""}`}
                    onClick={() => {
                      if (selectionMode) {
                        toggleSelection({ id: folder.id, type: "folder", name: folder.name });
                      } else {
                        navigateToFolder(folder.id);
                      }
                    }}
                  >
                    {selectionMode && (
                      <div className="absolute top-2 left-2">
                        <Checkbox 
                          checked={isSelected(folder.id)}
                          onCheckedChange={() => toggleSelection({ id: folder.id, type: "folder", name: folder.name })}
                          onClick={(e) => e.stopPropagation()}
                          className="border-primary data-[state=checked]:bg-primary"
                        />
                      </div>
                    )}
                    
                    {/* macOS-style folder icon */}
                    <div className="relative mb-2">
                      <svg viewBox="0 0 64 64" className="h-16 w-16 drop-shadow-md">
                        <defs>
                          <linearGradient id={`folder-grad-${folder.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="hsl(211 100% 65%)" />
                            <stop offset="100%" stopColor="hsl(211 100% 50%)" />
                          </linearGradient>
                        </defs>
                        {/* Folder back */}
                        <path 
                          d="M6 16c0-2.2 1.8-4 4-4h14l4 6h26c2.2 0 4 1.8 4 4v32c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V16z" 
                          fill={`url(#folder-grad-${folder.id})`}
                        />
                        {/* Folder front highlight */}
                        <path 
                          d="M6 24h52v26c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V24z" 
                          fill="hsl(211 100% 55%)"
                        />
                        {/* Top shine */}
                        <path 
                          d="M6 16c0-2.2 1.8-4 4-4h14l4 6h26c2.2 0 4 1.8 4 4v4H6v-10z" 
                          fill="hsl(211 100% 70%)"
                          opacity="0.6"
                        />
                      </svg>
                    </div>
                    
                    <p className="font-medium text-[13px] truncate w-full max-w-[100px] leading-tight">{folder.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(folder.created_at)}</p>
                    
                    {!selectionMode && !isMobile && (
                      <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md bg-background/80 backdrop-blur-sm shadow-sm" onClick={(e) => { e.stopPropagation(); setRenameItem({ id: folder.id, name: folder.name, type: "folder" }); setRenameOpen(true); }}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md bg-background/80 backdrop-blur-sm shadow-sm text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(folder.id, "folder"); }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                      
                  {isMobile && swipedItemId === folder.id && (
                    <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1 pr-2">
                      <Button variant="outline" size="icon" className="h-10 w-10" onClick={(e) => { e.stopPropagation(); setRenameItem({ id: folder.id, name: folder.name, type: "folder" }); setRenameOpen(true); setSwipedItemId(null); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" className="h-10 w-10" onClick={(e) => { e.stopPropagation(); handleDelete(folder.id, "folder"); setSwipedItemId(null); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className="relative overflow-hidden"
                  onTouchStart={(e) => isMobile && handleTouchStart(e, file.id)}
                  onTouchMove={isMobile ? handleTouchMove : undefined}
                  onTouchEnd={() => isMobile && handleTouchEnd(file.id)}
                >
                  <div
                    className={`p-3 rounded-xl transition-all group cursor-pointer flex flex-col items-center text-center ${
                      isSelected(file.id) 
                        ? "bg-primary/15 ring-2 ring-primary/50" 
                        : "hover:bg-accent/60"
                    } ${swipedItemId === file.id ? "-translate-x-24" : ""}`}
                    onClick={() => {
                      if (selectionMode) {
                        toggleSelection({ id: file.id, type: "file", name: file.file_name });
                      } else {
                        setPreviewFile(file);
                        setPreviewOpen(true);
                      }
                    }}
                  >
                    {selectionMode && (
                      <div className="absolute top-2 left-2">
                        <Checkbox 
                          checked={isSelected(file.id)}
                          onCheckedChange={() => toggleSelection({ id: file.id, type: "file", name: file.file_name })}
                          onClick={(e) => e.stopPropagation()}
                          className="border-primary data-[state=checked]:bg-primary"
                        />
                      </div>
                    )}
                    
                    {/* macOS-style file icon */}
                    <div className="relative mb-2">
                      <div className="h-16 w-14 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg shadow-md flex items-center justify-center border border-slate-200 dark:border-slate-600">
                        <FileThumbnail mimeType={file.mime_type} fileName={file.file_name} className="h-8 w-8" />
                      </div>
                      {isFileLocked(file) && (
                        <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5">
                          <Lock className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <p className="font-medium text-[13px] truncate w-full max-w-[100px] leading-tight">{file.file_name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{formatFileSize(file.file_size)}</p>
                    
                    {!selectionMode && !isMobile && (
                      <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md bg-background/80 backdrop-blur-sm shadow-sm" onClick={(e) => { e.stopPropagation(); openShareDialog(file.id, file.file_name); }}>
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md bg-background/80 backdrop-blur-sm shadow-sm text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(file.id, "file"); }} disabled={isFileLocked(file)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {isMobile && swipedItemId === file.id && (
                    <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1 pr-2">
                      <Button variant="outline" size="icon" className="h-10 w-10" onClick={(e) => { e.stopPropagation(); setRenameItem({ id: file.id, name: file.file_name, type: "file" }); setRenameOpen(true); setSwipedItemId(null); }} disabled={isFileLocked(file)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {isFileLocked(file) ? (
                        <Button variant="outline" size="icon" className="h-10 w-10 text-amber-600" onClick={(e) => { e.stopPropagation(); handleUnlockFile(file.id); setSwipedItemId(null); }}>
                          <LockOpen className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="icon" className="h-10 w-10 text-amber-600" onClick={(e) => { e.stopPropagation(); openLockDialog(file.id, file.file_name); setSwipedItemId(null); }}>
                          <Lock className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="destructive" size="icon" className="h-10 w-10" onClick={(e) => { e.stopPropagation(); handleDelete(file.id, "file"); setSwipedItemId(null); }} disabled={isFileLocked(file)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* List View - macOS style */}
          {viewMode === "list" && (
            <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm overflow-hidden">
              <div className="divide-y divide-border/50">
              {sortedFolders.map((folder) => (
                <div
                  key={folder.id}
                  className={`px-4 py-2.5 transition-all cursor-pointer group ${
                    isSelected(folder.id) ? "bg-primary/10" : "hover:bg-accent/60"
                  }`}
                  onClick={() => {
                    if (selectionMode) {
                      toggleSelection({ id: folder.id, type: "folder", name: folder.name });
                    } else {
                      navigateToFolder(folder.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {selectionMode && (
                        <Checkbox 
                          checked={isSelected(folder.id)}
                          onCheckedChange={() => toggleSelection({ id: folder.id, type: "folder", name: folder.name })}
                          onClick={(e) => e.stopPropagation()}
                          className="border-primary data-[state=checked]:bg-primary"
                        />
                      )}
                      {/* Inline blue folder SVG */}
                      <svg viewBox="0 0 32 32" className="h-5 w-5 flex-shrink-0">
                        <defs>
                          <linearGradient id={`list-folder-${folder.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="hsl(211 100% 65%)" />
                            <stop offset="100%" stopColor="hsl(211 100% 50%)" />
                          </linearGradient>
                        </defs>
                        <path d="M3 8c0-1.1.9-2 2-2h7l2 3h13c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8z" fill={`url(#list-folder-${folder.id})`}/>
                        <path d="M3 12h26v13c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V12z" fill="hsl(211 100% 55%)"/>
                      </svg>
                      <span className="font-medium text-[13px] truncate">{folder.name}</span>
                      <span className="text-[13px] text-muted-foreground ml-auto mr-4">—</span>
                      <span className="text-[13px] text-muted-foreground">{new Date(folder.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {!selectionMode && (
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setRenameItem({ id: folder.id, name: folder.name, type: "folder" }); setRenameOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(folder.id, "folder"); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`px-4 py-2.5 transition-all group cursor-pointer ${
                    isSelected(file.id) ? "bg-primary/10" : "hover:bg-accent/60"
                  }`}
                  onClick={() => {
                    if (selectionMode) {
                      toggleSelection({ id: file.id, type: "file", name: file.file_name });
                    } else {
                      setPreviewFile(file);
                      setPreviewOpen(true);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {selectionMode && (
                        <Checkbox 
                          checked={isSelected(file.id)}
                          onCheckedChange={() => toggleSelection({ id: file.id, type: "file", name: file.file_name })}
                          onClick={(e) => e.stopPropagation()}
                          className="border-primary data-[state=checked]:bg-primary"
                        />
                      )}
                      <div className="relative flex-shrink-0">
                        <FileThumbnail mimeType={file.mime_type} fileName={file.file_name} className="h-5 w-5" />
                        {isFileLocked(file) && (
                          <Lock className="h-2.5 w-2.5 text-amber-500 absolute -top-0.5 -right-0.5" />
                        )}
                      </div>
                      <span className="font-medium text-[13px] truncate">{file.file_name}</span>
                      {isFileLocked(file) && (
                        <span className="text-[11px] text-amber-600 hidden sm:inline">Locked</span>
                      )}
                      <span className="text-[13px] text-muted-foreground ml-auto mr-4">{formatFileSize(file.file_size)}</span>
                      <span className="text-[13px] text-muted-foreground">{new Date(file.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {!selectionMode && (
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); openShareDialog(file.id, file.file_name); }}>
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(file.id, "file"); }} disabled={isFileLocked(file)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}

          {/* Compact View */}
          {viewMode === "compact" && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50 text-sm">
                  <tr>
                    {selectionMode && <th className="w-10 p-2"></th>}
                    <th className="text-left p-2 font-medium">Name</th>
                    <th className="text-left p-2 font-medium hidden sm:table-cell">Size</th>
                    <th className="text-left p-2 font-medium hidden md:table-cell">Date</th>
                    <th className="w-24 p-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sortedFolders.map((folder) => (
                    <tr 
                      key={folder.id}
                      className={`hover:bg-accent/50 cursor-pointer group ${isSelected(folder.id) ? "bg-primary/5" : ""}`}
                      onClick={() => {
                        if (selectionMode) {
                          toggleSelection({ id: folder.id, type: "folder", name: folder.name });
                        } else {
                          navigateToFolder(folder.id);
                        }
                      }}
                    >
                      {selectionMode && (
                        <td className="p-2" onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={isSelected(folder.id)}
                            onCheckedChange={() => toggleSelection({ id: folder.id, type: "folder", name: folder.name })}
                          />
                        </td>
                      )}
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Folder className="h-5 w-5 text-primary" />
                          <span className="truncate">{folder.name}</span>
                        </div>
                      </td>
                      <td className="p-2 text-muted-foreground text-sm hidden sm:table-cell">—</td>
                      <td className="p-2 text-muted-foreground text-sm hidden md:table-cell">{new Date(folder.created_at).toLocaleDateString()}</td>
                      <td className="p-2">
                        {!selectionMode && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setRenameItem({ id: folder.id, name: folder.name, type: "folder" }); setRenameOpen(true); }}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(folder.id, "folder"); }}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {sortedFiles.map((file) => (
                    <tr 
                      key={file.id}
                      className={`hover:bg-accent/50 group cursor-pointer ${isSelected(file.id) ? "bg-primary/5" : ""}`}
                      onClick={() => {
                        if (selectionMode) {
                          toggleSelection({ id: file.id, type: "file", name: file.file_name });
                        } else {
                          setPreviewFile(file);
                          setPreviewOpen(true);
                        }
                      }}
                    >
                      {selectionMode && (
                        <td className="p-2" onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={isSelected(file.id)}
                            onCheckedChange={() => toggleSelection({ id: file.id, type: "file", name: file.file_name })}
                          />
                        </td>
                      )}
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <FileThumbnail mimeType={file.mime_type} fileName={file.file_name} className="h-5 w-5" />
                            {isFileLocked(file) && (
                              <Lock className="h-2 w-2 text-amber-500 absolute -top-0.5 -right-0.5" />
                            )}
                          </div>
                          <span className="truncate">{file.file_name}</span>
                          {isFileLocked(file) && (
                            <span className="text-xs text-amber-600 hidden lg:inline">Locked</span>
                          )}
                        </div>
                      </td>
                      <td className="p-2 text-muted-foreground text-sm hidden sm:table-cell">{formatFileSize(file.file_size)}</td>
                      <td className="p-2 text-muted-foreground text-sm hidden md:table-cell">{new Date(file.created_at).toLocaleDateString()}</td>
                      <td className="p-2">
                        {!selectionMode && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setRenameItem({ id: file.id, name: file.file_name, type: "file" }); setRenameOpen(true); }} disabled={isFileLocked(file)}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            {isFileLocked(file) ? (
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-600" onClick={(e) => { e.stopPropagation(); handleUnlockFile(file.id); }}>
                                <LockOpen className="h-3 w-3" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-600" onClick={(e) => { e.stopPropagation(); openLockDialog(file.id, file.file_name); }}>
                                <Lock className="h-3 w-3" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(file.id, "file"); }} disabled={isFileLocked(file)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* New Folder Dialog */}
      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Folder Name</Label>
              <Input
                placeholder="My new folder"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createFolder()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Name</Label>
              <Input
                value={renameItem?.name || ""}
                onChange={(e) => setRenameItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Dialog */}
      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <Button
              variant={targetFolderId === null ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setTargetFolderId(null)}
            >
              <Folder className="h-4 w-4 mr-2" />
              Root Folder
            </Button>
            {allFolders
              .filter(f => f.id !== moveItem?.id && !selectedItems.some(s => s.id === f.id))
              .map((folder) => (
                <Button
                  key={folder.id}
                  variant={targetFolderId === folder.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setTargetFolderId(folder.id)}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  {folder.name}
                </Button>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={async () => {
              if (selectedItems.length > 1) {
                // Bulk move
                for (const item of selectedItems) {
                  if (item.type === "folder") {
                    await supabase.from("folders").update({ parent_folder_id: targetFolderId }).eq("id", item.id);
                  } else {
                    await supabase.from("archived_files").update({ folder_id: targetFolderId }).eq("id", item.id);
                  }
                }
                toast.success(`${selectedItems.length} items moved`);
                setSelectedItems([]);
                setSelectionMode(false);
                setMoveOpen(false);
                loadContent();
              } else {
                handleMove();
              }
            }}>Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={(open) => {
        setUploadOpen(open);
        if (!open) setSelectedFiles([]);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <Label 
                htmlFor="file-upload" 
                className="cursor-pointer text-primary hover:underline"
              >
                Click to select files
              </Label>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <p className="text-sm text-muted-foreground mt-2">
                or drag and drop files here
              </p>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">{selectedFiles.length} file(s) selected:</p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                      <span className="truncate max-w-[200px]">{file.name}</span>
                      <span className="text-muted-foreground">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setUploadOpen(false);
              setSelectedFiles([]);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={selectedFiles.length === 0 || uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={(open) => {
        setShareOpen(open);
        if (!open) {
          setShareLink(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share "{shareFileName}"
            </DialogTitle>
          </DialogHeader>
          
          {shareLink ? (
            // Show success state with link
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  File shared successfully!
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={shareLink} 
                    readOnly 
                    className="text-xs"
                  />
                  <Button variant="outline" size="icon" onClick={copyShareLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShareOpen(false)}>Done</Button>
              </DialogFooter>
            </div>
          ) : (
            // Show share form
            <div className="space-y-4">
              {/* Email addresses */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Share with
                </Label>
                <div className="space-y-2">
                  {shareEmails.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                      />
                      {shareEmails.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEmailField(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onClick={addEmailField}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add another email
                </Button>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label>Message (optional)</Label>
                <Textarea
                  placeholder="Add a personal message..."
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Password protection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password protection
                  </Label>
                  <Switch
                    checked={sharePasswordEnabled}
                    onCheckedChange={setSharePasswordEnabled}
                  />
                </div>
                {sharePasswordEnabled && (
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={sharePassword}
                    onChange={(e) => setSharePassword(e.target.value)}
                  />
                )}
              </div>

              {/* Expiry */}
              <div className="space-y-2">
                <Label>Link expires in</Label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 7, 30].map((days) => (
                    <Button
                      key={days}
                      variant={shareExpiryDays === days ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShareExpiryDays(days)}
                    >
                      {days === 1 ? "1 day" : `${days} days`}
                    </Button>
                  ))}
                  <Button
                    variant={shareExpiryDays === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShareExpiryDays(null)}
                  >
                    Never
                  </Button>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShareOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleShare} disabled={isSharing}>
                  {isSharing ? "Sharing..." : "Share"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* File Preview */}
      <FilePreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        file={previewFile}
        files={files}
        onNavigate={(fileId) => {
          const file = files.find(f => f.id === fileId);
          if (file) setPreviewFile(file);
        }}
      />

      {/* Object Lock Dialog */}
      <Dialog open={lockOpen} onOpenChange={setLockOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              Object Lock (Retention)
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Lock <strong>{lockFileName}</strong> to prevent deletion or renaming for a specified period. 
              This is useful for compliance and data retention requirements.
            </p>

            {/* Lock Duration */}
            <div className="space-y-2">
              <Label>Lock duration</Label>
              <div className="flex gap-2 flex-wrap">
                {[7, 30, 90, 365].map((days) => (
                  <Button
                    key={days}
                    variant={lockDuration === days ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLockDuration(days)}
                  >
                    {days < 365 ? `${days} days` : "1 year"}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="number"
                  min="1"
                  max="3650"
                  value={lockDuration}
                  onChange={(e) => setLockDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </div>

            {/* Lock Reason */}
            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Textarea
                placeholder="e.g., Compliance requirement, legal hold, audit..."
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                rows={2}
              />
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Warning:</strong> Once locked, this file cannot be deleted or renamed until {new Date(Date.now() + lockDuration * 24 * 60 * 60 * 1000).toLocaleDateString()}.
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setLockOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleLockFile} disabled={isLocking} className="bg-amber-600 hover:bg-amber-700">
                {isLocking ? "Locking..." : "Lock File"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
