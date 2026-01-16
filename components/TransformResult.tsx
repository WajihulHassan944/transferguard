import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TransformResultProps {
  transformedImage: string | null;
  isTransforming: boolean;
}

export const TransformResult = ({ transformedImage, isTransforming }: TransformResultProps) => {
  const handleDownload = () => {
    if (!transformedImage) return;

    const link = document.createElement("a");
    link.href = transformedImage;
    link.download = `artwork-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Artwork downloaded!");
  };

  if (!transformedImage && !isTransforming) return null;

  return (
    <Card className="p-8 animate-fade-in bg-card">
      <h3 className="text-3xl font-bold text-center mb-8">Your Masterpiece</h3>
      <div className="flex flex-col items-center space-y-6">
        {isTransforming ? (
          <div className="w-full h-96 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <p className="text-xl font-medium">Creating your artwork...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take 30-60 seconds</p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={transformedImage || ""}
              alt="Transformed artwork"
              className="w-full max-h-[500px] object-contain rounded-lg shadow-artistic"
            />
            <Button onClick={handleDownload} size="lg" className="w-full md:w-auto bg-primary hover:bg-primary-glow">
              <Download className="mr-2 h-5 w-5" />
              Download Artwork
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
