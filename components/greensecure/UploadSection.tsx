import { useState } from "react";
import { FileDropzone } from "./FileDropzone";
import { TransferForm, TransferData } from "./TransferForm";
import { toast } from "sonner";

export const UploadSection = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: TransferData) => {
    if (files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setIsUploading(true);

  
  };

  return (
    <section id="upload" className="py-12 px-4">
      <div className="container max-w-2xl mx-auto space-y-6">
        {/* Section Header */}
        <div className="text-center mb-2">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Send Documents <span className="text-gradient-blue">Securely</span>
          </h2>
          <p className="text-muted-foreground">
            End-to-end encrypted. QERDS certified. Legal delivery certificates.
          </p>
        </div>
        
        <FileDropzone
          files={files}
          onFilesSelect={setFiles}
          onRemoveFile={handleRemoveFile}
        />
        
        {/* Info text under dropzone */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Max <strong className="text-foreground">10GB per file</strong>.</span>
          <span>Auto-delete after expiry.</span>
        </div>
        
        {files.length > 0 && (
          <TransferForm 
            files={files}
            onSubmit={handleSubmit}
            isUploading={isUploading}
          />
        )}
      </div>
    </section>
  );
};
