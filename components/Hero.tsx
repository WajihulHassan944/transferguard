import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface HeroProps {
  onUploadClick: () => void;
}

export const Hero = ({ onUploadClick }: HeroProps) => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-5xl mx-auto text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
          <span className="block text-stroke-white">Transform your</span>
          <span className="block text-foreground font-black">photos into</span>
          <span className="block">
            <span className="text-gradient-orange">stunning </span>
            <span className="text-gradient-purple">masterpieces</span>
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Upload a photo and choose an artistic style. Van Gogh, Monet, or Herman Brood - 
          your image becomes a work of art powered by AI.
        </p>
      </div>
    </section>
  );
};
