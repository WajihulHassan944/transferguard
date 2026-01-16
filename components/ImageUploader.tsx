import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export const ImageUploader = ({ onImageSelect, selectedImage, onClear }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File is too large. Maximum 10MB allowed.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image.");
        return;
      }
      onImageSelect(file);
      toast.success("Image loaded successfully!");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File is too large. Maximum 10MB allowed.");
        return;
      }
      onImageSelect(file);
      toast.success("Image loaded successfully!");
    } else {
      toast.error("Please select a valid image.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card className="p-8 border-2 border-dashed border-border hover:border-primary transition-all duration-300 bg-card">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex flex-col items-center justify-center space-y-4"
      >
        {selectedImage ? (
          <div className="relative w-full">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="w-full h-64 object-contain rounded-lg"
            />
            <Button
              onClick={onClear}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <p className="text-lg font-medium mb-2">
                Drag your photo here or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                JPG, PNG or WEBP (max. 10MB)
              </p>
            </div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {!selectedImage && (
          <Button onClick={() => fileInputRef.current?.click()} size="lg" className="bg-primary hover:bg-primary-glow">
            <Upload className="mr-2 h-4 w-4" />
            Upload your photo
          </Button>
        )}
      </div>
    </Card>
  );
};
