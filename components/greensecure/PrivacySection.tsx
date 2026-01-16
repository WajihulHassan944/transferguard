'use client'
import { Shield, Server, Lock, EyeOff, Database, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRef } from "react";
import { useScrollProgress } from "@/hooks/useParallax";

const privacyFeatures = [
  {
    icon: Server,
    title: "100% EU Data",
    description: "Data stays exclusively in EU data centers. No Cloud Act exposure.",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "AES-256 encryption from upload to download.",
  },
  {
    icon: EyeOff,
    title: "Zero-Knowledge",
    description: "We cannot read or access your files.",
  },
  {
    icon: Database,
    title: "No Data Mining",
    description: "Your files are not used for AI or advertising.",
  },
  {
    icon: Globe,
    title: "EU Infrastructure",
    description: "No US cloud providers. GDPR-compliant by design.",
  },
];

const certifications = [
  { name: "eIDAS", image: "/assets/eidas-logo.png" },
  { name: "GDPR", image: "/assets/gdpr-logo.png" },
  { name: "ISO 27001", image: "/assets/iso27001-logo.png" },
];

export const PrivacySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isVisible } = useScrollProgress(sectionRef);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30" ref={sectionRef}>
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div 
          className="text-center mb-10 transition-all duration-700" 
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 30}px)`
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-green-600 dark:text-green-400 font-medium text-sm">Privacy First</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Your Privacy, <span className="text-green-500">Our Priority</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No surveillance, no data mining, no compromises. Built from the ground up to protect your data.
          </p>
        </div>

        {/* Feature Cards - Horizontal scroll on mobile, grid on desktop */}
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 30}px)`,
            transitionDelay: '200ms',
            transition: 'all 0.7s ease'
          }}
        >
          {privacyFeatures.map((feature) => (
            <Card 
              key={feature.title} 
              className="p-4 bg-background/80 border border-green-500/10 hover:border-green-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-2 rounded-lg w-fit mb-3 bg-green-500/10">
                <feature.icon className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-muted-foreground text-xs">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Certifications - inline row */}
        <div 
          className="flex items-center justify-center gap-8 flex-wrap"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 20}px)`,
            transitionDelay: '400ms',
            transition: 'all 0.7s ease'
          }}
        >
        {certifications.map((cert) => (
            <div key={cert.name} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/50 border border-border/50">
              <img src={cert.image} alt={cert.name} className="h-10 w-10 object-contain" />
              <span className="text-sm font-semibold text-foreground">{cert.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
