'use client'
import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { ImageUploader } from "@/components/ImageUploader";
import { StyleSelector, ArtStyle } from "@/components/StyleSelector";
import { TransformResult } from "@/components/TransformResult";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { toast } from "sonner";

const Convert = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const handleUploadClick = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setTransformedImage(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setTransformedImage(null);
  };

  const handleStyleSelect = (style: ArtStyle) => {
    setSelectedStyle(style);
  };

  const handleTransform = async () => {
    if (!selectedImage || !selectedStyle) {
      toast.error("Please select an image and style.");
      return;
    }

    setIsTransforming(true);
    
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        const stylePrompts = {
          "van-gogh": "Transform this image into a painting in the style of Vincent van Gogh with expressive brushstrokes, vibrant colors, and swirling patterns. Make it look like Starry Night or Sunflowers style.",
          "monet": "Transform this image into a painting in the style of Claude Monet with impressionistic soft brushwork, light colors, and water lily garden aesthetics. Make it look like a Water Lilies or Impression Sunrise painting.",
          "herman-brood": "Transform this image into a painting in the style of Herman Brood with bold colors, energetic rock and roll aesthetics, and vibrant urban art style. Use bright pinks, blues, and expressive lines."
        };

      };

      reader.onerror = () => {
        throw new Error("Error loading image");
      };
    } catch (error) {
      console.error("Transform error:", error);
      toast.error("Something went wrong during transformation. Please try again.");
    } finally {
      setIsTransforming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <Hero onUploadClick={handleUploadClick} />
      
      <div ref={uploadSectionRef} className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        <ImageUploader
          onImageSelect={handleImageSelect}
          selectedImage={selectedImage}
          onClear={handleClearImage}
        />

        {selectedImage && (
          <>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-muted-foreground">Convert to</h3>
            </div>
            
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleSelect={handleStyleSelect}
            />

            {selectedStyle && (
              <div className="flex justify-center animate-slide-up">
                <Button
                  onClick={handleTransform}
                  size="lg"
                  disabled={isTransforming}
                  className="px-12 py-7 text-lg shadow-glow bg-primary hover:bg-primary-glow"
                >
                  <Palette className="mr-2 h-5 w-5" />
                  Transform into Art
                </Button>
              </div>
            )}

            <TransformResult
              transformedImage={transformedImage}
              isTransforming={isTransforming}
            />
          </>
        )}
      </div>
      
    </div>
  );
};

export default Convert;
