import { FileCheck, Crown, HardDrive, Scale, Zap, FolderArchive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";
import { useScrollProgress, useParallax } from "@/hooks/useParallax";

// Large Files & Compliance features (separated from privacy)
const features: {
  icon: typeof HardDrive;
  title: string;
  description: string;
  isPro?: boolean;
  isLegal?: boolean;
}[] = [{
  icon: HardDrive,
  title: "Transfer Files Up to 100GB",
  description: "Send extremely large files without compression. Perfect for video production, CAD files, medical imaging, and data-heavy projects."
}, {
  icon: Zap,
  title: "Lightning Fast Uploads",
  description: "Multi-threaded upload technology ensures your large files transfer at maximum speed. Resume interrupted uploads automatically."
}, {
  icon: FolderArchive,
  title: "Bulk File Transfers",
  description: "Send entire folder structures with hundreds of files in a single transfer. Perfect for project handovers and archive deliveries."
}, {
  icon: Scale,
  title: "QERDS Verification",
  description: "EU-certified qualified delivery. Creates indisputable, court-admissible evidence with the same legal status as physical registered mail (eIDAS).",
  isLegal: true
}, {
  icon: FileCheck,
  title: "Legally Sealed PDF",
  description: "Automatic PDF certificate with every successful delivery. Legal proof that recipients received your files — essential for disputes.",
  isPro: true
}];

export const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { progress, isVisible } = useScrollProgress(sectionRef);
  const { mouseX, mouseY } = useParallax();

  return (
    <section className="py-24 px-4 bg-background overflow-hidden relative" ref={sectionRef}>
      {/* Parallax background shapes */}
      <div 
        className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none transition-transform duration-700" 
        style={{ transform: `translate(${mouseX * -20}px, ${mouseY * -15}px)` }} 
      />
      <div 
        className="absolute bottom-20 left-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl pointer-events-none transition-transform duration-700" 
        style={{ transform: `translate(${mouseX * 15}px, ${mouseY * 10}px)` }} 
      />

      <div className="container max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div 
          className="text-center mb-16 transition-all duration-700" 
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 30}px)`
          }}
        >
          <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3">
            Large Files & Compliance
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Built for <span className="text-primary">Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transfer massive files up to 100GB with legal-grade delivery confirmation. 
            Perfect for law firms, healthcare providers, and businesses requiring proof of delivery.
          </p>
        </div>

        {/* Feature Cards - Top Row */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-6">
          {features.slice(0, 3).map((feature, index) => (
            <Card 
              key={feature.title} 
              className={`p-8 bg-background border transition-all duration-500 group relative hover:-translate-y-2 ${
                feature.isPro 
                  ? "border-primary/30 hover:border-primary hover:shadow-xl" 
                  : feature.isLegal 
                    ? "border-amber-500/30 hover:border-amber-500 hover:shadow-xl" 
                    : "border-border hover:border-primary/30 hover:shadow-lg"
              }`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? 0 : 40}px)`,
                transitionDelay: `${index * 80}ms`
              }}
            >
              {feature.isPro && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold">
                  <Crown className="h-3 w-3 mr-1" />
                  Professional
                </Badge>
              )}
              {feature.isLegal && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold">
                  <Scale className="h-3 w-3 mr-1" />
                  Legal
                </Badge>
              )}
              <div className={`p-3 rounded-xl w-fit mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                feature.isPro 
                  ? "bg-primary/20 group-hover:bg-primary/30" 
                  : feature.isLegal 
                    ? "bg-amber-500/20 group-hover:bg-amber-500/30" 
                    : "bg-primary/10 group-hover:bg-primary/20"
              }`}>
                <feature.icon className={`h-6 w-6 ${feature.isLegal ? "text-amber-500" : "text-primary"}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Feature Cards - Bottom Row (Centered) */}
        <div className="flex justify-center gap-6 max-w-5xl mx-auto">
          {features.slice(3).map((feature, index) => (
            <Card 
              key={feature.title} 
              className={`p-8 bg-background border transition-all duration-500 group relative hover:-translate-y-2 w-full max-w-sm lg:max-w-none lg:w-[calc(33.333%-1rem)] ${
                feature.isPro 
                  ? "border-primary/30 hover:border-primary hover:shadow-xl" 
                  : feature.isLegal 
                    ? "border-amber-500/30 hover:border-amber-500 hover:shadow-xl" 
                    : "border-border hover:border-primary/30 hover:shadow-lg"
              }`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? 0 : 40}px)`,
                transitionDelay: `${(index + 3) * 80}ms`
              }}
            >
              {feature.isPro && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold">
                  <Crown className="h-3 w-3 mr-1" />
                  Professional
                </Badge>
              )}
              {feature.isLegal && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold">
                  <Scale className="h-3 w-3 mr-1" />
                  Legal
                </Badge>
              )}
              <div className={`p-3 rounded-xl w-fit mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                feature.isPro 
                  ? "bg-primary/20 group-hover:bg-primary/30" 
                  : feature.isLegal 
                    ? "bg-amber-500/20 group-hover:bg-amber-500/30" 
                    : "bg-primary/10 group-hover:bg-primary/20"
              }`}>
                <feature.icon className={`h-6 w-6 ${feature.isLegal ? "text-amber-500" : "text-primary"}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};