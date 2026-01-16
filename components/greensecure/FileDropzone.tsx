import React, { useCallback, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, File as FileIcon, FileText, Image, Video, Music } from "lucide-react";
import { toast } from "sonner";

interface FileDropzoneProps {
  files: File[];
  onFilesSelect: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  maxSizeGB?: number;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024 * 1024; // 5GB

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.startsWith("video/")) return Video;
  if (mimeType.startsWith("audio/")) return Music;
  if (mimeType.includes("pdf") || mimeType.includes("document")) return FileText;
  return FileIcon;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function FileDropzone({ files, onFilesSelect, onRemoveFile, maxSizeGB = 5 }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const newTotalSize = totalSize + fileArray.reduce((acc, file) => acc + file.size, 0);
    
    if (newTotalSize > MAX_SIZE_BYTES) {
      toast.error(`Total size exceeds ${maxSizeGB}GB limit`);
      return;
    }

    onFilesSelect([...files, ...fileArray]);
    toast.success(`${fileArray.length} file(s) added`);
  }, [files, onFilesSelect, totalSize, maxSizeGB]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="space-y-4">
      <Card 
        className={`p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragging 
            ? "border-primary bg-accent/50 scale-[1.02]" 
            : "border-border hover:border-primary/50 bg-card/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full transition-all duration-300 ${
            isDragging ? "bg-primary text-primary-foreground" : "bg-accent text-primary"
          }`}>
            <Upload className="h-10 w-10" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium mb-2">
              Drag files here or click to browse
            </p>
            <p className="text-xl font-semibold text-primary mb-2">
              Send up to {maxSizeGB}GB for free
            </p>
            <p className="text-sm text-muted-foreground">
              No registration required • Files stored for 72 hours (or 48h with eco mode)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
          <Button 
            type="button" 
            size="lg" 
            className="bg-primary hover:bg-primary-glow"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Select Files
          </Button>
        </div>
      </Card>

      {files.length > 0 && (
        <Card className="p-4 glass-card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">
              {files.length} file(s) • {formatFileSize(totalSize)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(MAX_SIZE_BYTES - totalSize)} remaining
            </p>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => {
              const Icon = getFileIcon(file.type);
              return (
                <div 
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="h-5 w-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
