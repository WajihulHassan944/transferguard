import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  File,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  FileSpreadsheet,
  FileCode,
  Archive,
} from "lucide-react";

interface FilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: string;
    file_name: string;
    file_size: number;
    mime_type?: string | null;
    s3_key: string;
  } | null;
  // Optional: for navigating between files
  files?: Array<{
    id: string;
    file_name: string;
    file_size: number;
    mime_type?: string | null;
    s3_key: string;
  }>;
  onNavigate?: (fileId: string) => void;
}

// Get file icon based on mime type
export function getFileIcon(mimeType: string | null | undefined, className = "h-10 w-10") {
  if (!mimeType) return <File className={className} />;
  
  if (mimeType.startsWith("image/")) {
    return <ImageIcon className={`${className} text-blue-500`} />;
  }
  if (mimeType.startsWith("video/")) {
    return <Video className={`${className} text-purple-500`} />;
  }
  if (mimeType.startsWith("audio/")) {
    return <Music className={`${className} text-pink-500`} />;
  }
  if (mimeType === "application/pdf") {
    return <FileText className={`${className} text-red-500`} />;
  }
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || mimeType === "text/csv") {
    return <FileSpreadsheet className={`${className} text-green-500`} />;
  }
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar") || mimeType.includes("gzip")) {
    return <Archive className={`${className} text-yellow-600`} />;
  }
  if (mimeType.includes("javascript") || mimeType.includes("json") || mimeType.includes("html") || mimeType.includes("css") || mimeType.includes("xml")) {
    return <FileCode className={`${className} text-orange-500`} />;
  }
  if (mimeType.startsWith("text/") || mimeType.includes("document")) {
    return <FileText className={`${className} text-blue-600`} />;
  }
  
  return <File className={`${className} text-muted-foreground`} />;
}

// Check if file can be previewed
export function canPreview(mimeType: string | null | undefined): boolean {
  if (!mimeType) return false;
  
  return (
    mimeType.startsWith("image/") ||
    mimeType.startsWith("video/") ||
    mimeType.startsWith("audio/") ||
    mimeType === "application/pdf" ||
    mimeType.startsWith("text/")
  );
}

// Get preview URL (placeholder for now - will use actual S3 URLs when integrated)
function getPreviewUrl(s3Key: string): string {
  // TODO: Replace with actual S3/storage URL when Leviia is integrated
  // For demo purposes, we'll use placeholder URLs based on file type
  return `https://placeholder.com/${s3Key}`;
}

export function FilePreview({ isOpen, onClose, file, files, onNavigate }: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  if (!file) return null;

  const mimeType = file.mime_type || "";
  const isImage = mimeType.startsWith("image/");
  const isVideo = mimeType.startsWith("video/");
  const isAudio = mimeType.startsWith("audio/");
  const isPdf = mimeType === "application/pdf";
  const isText = mimeType.startsWith("text/");

  // Find current file index for navigation
  const currentIndex = files?.findIndex(f => f.id === file.id) ?? -1;
  const hasPrev = currentIndex > 0;
  const hasNext = files && currentIndex < files.length - 1;

  const navigatePrev = () => {
    if (hasPrev && files && onNavigate) {
      onNavigate(files[currentIndex - 1].id);
    }
  };

  const navigateNext = () => {
    if (hasNext && files && onNavigate) {
      onNavigate(files[currentIndex + 1].id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const renderPreview = () => {
    // Note: These previews will work once actual file URLs are available from storage
    // For now, we show a placeholder with file info
    
    if (isImage) {
      return (
        <div className="flex items-center justify-center bg-black/5 rounded-lg p-8 min-h-[300px]">
          <div className="text-center space-y-4">
            <ImageIcon className="h-24 w-24 mx-auto text-blue-500/50" />
            <div>
              <p className="font-medium">{file.file_name}</p>
              <p className="text-sm text-muted-foreground">
                Image preview will be available when storage is connected
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="flex items-center justify-center bg-black rounded-lg min-h-[300px]">
          <div className="text-center space-y-4 text-white/70">
            <Video className="h-24 w-24 mx-auto" />
            <div>
              <p className="font-medium text-white">{file.file_name}</p>
              <p className="text-sm">
                Video player will be available when storage is connected
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg p-8 min-h-[200px] space-y-4">
          <Music className="h-20 w-20 text-pink-500" />
          <div className="text-center">
            <p className="font-medium">{file.file_name}</p>
            <p className="text-sm text-muted-foreground">
              Audio player will be available when storage is connected
            </p>
          </div>
          {/* Placeholder audio controls */}
          <div className="w-full max-w-md space-y-2">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-pink-500 rounded-full" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0:00</span>
              <span>--:--</span>
            </div>
          </div>
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="flex items-center justify-center bg-red-50 dark:bg-red-950/20 rounded-lg p-8 min-h-[400px]">
          <div className="text-center space-y-4">
            <FileText className="h-24 w-24 mx-auto text-red-500" />
            <div>
              <p className="font-medium">{file.file_name}</p>
              <p className="text-sm text-muted-foreground">
                PDF viewer will be available when storage is connected
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (isText) {
      return (
        <div className="bg-muted/50 rounded-lg p-4 min-h-[300px]">
          <div className="text-center space-y-4 py-8">
            <FileCode className="h-16 w-16 mx-auto text-orange-500" />
            <div>
              <p className="font-medium">{file.file_name}</p>
              <p className="text-sm text-muted-foreground">
                Text preview will be available when storage is connected
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Default: show file info
    return (
      <div className="flex items-center justify-center bg-muted/30 rounded-lg p-8 min-h-[200px]">
        <div className="text-center space-y-4">
          {getFileIcon(mimeType, "h-20 w-20")}
          <div>
            <p className="font-medium">{file.file_name}</p>
            <p className="text-sm text-muted-foreground">
              This file type cannot be previewed
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate pr-4">{file.file_name}</DialogTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formatFileSize(file.file_size)}
              </span>
              <Button variant="outline" size="sm" disabled>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto relative">
          {/* Navigation arrows */}
          {files && files.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
                onClick={navigatePrev}
                disabled={!hasPrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
                onClick={navigateNext}
                disabled={!hasNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
          
          {renderPreview()}
        </div>

        {/* File info footer */}
        <div className="flex-shrink-0 pt-4 border-t text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Type: {mimeType || "Unknown"}</span>
            {files && files.length > 1 && (
              <span>{currentIndex + 1} of {files.length}</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Thumbnail component for grid/list views
export function FileThumbnail({ 
  mimeType, 
  fileName,
  className = "h-10 w-10" 
}: { 
  mimeType: string | null | undefined;
  fileName: string;
  className?: string;
}) {
  // For now, show icons. When storage is connected, this can show actual thumbnails
  return getFileIcon(mimeType, className);
}
