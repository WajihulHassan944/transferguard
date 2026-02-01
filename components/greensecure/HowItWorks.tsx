import { Upload, Download, Shield, Fingerprint, FileCheck, BadgeCheck, ArrowRight, Lock, FileText } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type PlanType = 'professional' | 'legal';

const professionalSteps = [
  {
    icon: Upload,
    title: "Upload & Send",
    description: "Drag & drop your files (up to 50GB). Secured with end-to-end encryption."
  },
  {
    icon: Lock,
    title: "Email 2FA Verification",
    description: "Recipient verifies their identity with a one-time email code before access."
  },
  {
    icon: Download,
    title: "Secure Download",
    description: "After verification, recipient downloads the files securely."
  },
  {
    icon: FileCheck,
    title: "Access Granted",
    description: "Recipient gains access to files. Complete audit trail is generated."
  }
];

const legalSteps = [
  {
    icon: Upload,
    title: "Upload & Send",
    description: "Drag & drop your files (up to 50GB). Secured with end-to-end encryption."
  },
  {
    icon: Fingerprint,
    title: "Biometric ID Verification",
    description: "Recipient verifies identity with government ID and biometric facial scan."
  },
  {
    icon: Download,
    title: "Secure Download",
    description: "After verification, recipient downloads the files securely."
  },
  {
    icon: FileCheck,
    title: "Access Granted",
    description: "Recipient gains access to files. Complete legal proof is generated."
  }
];

const planConfig = {
  professional: {
    label: 'Professional',
    icon: Shield,
    steps: professionalSteps,
    certificateTitle: 'PDF Proof of Receipt',
    certificateDesc: 'You receive a sealed PDF certificate containing: 2FA verification, IP address, timestamp, device fingerprint, and file hash.',
    certificateBadge: 'Adobe Certified',
    verificationItems: ['2FA Email Verified', 'IP & Timestamp', 'Device Fingerprint', 'SHA-256 Hash']
  },
  legal: {
    label: 'Legal',
    icon: Fingerprint,
    steps: legalSteps,
    certificateTitle: 'PDF Proof of Receipt',
    certificateDesc: 'You receive a sealed PDF certificate containing: verified identity, government ID, biometric match, IP, timestamp, and file hash.',
    certificateBadge: 'Biometric ID Verified',
    verificationItems: ['Government ID', 'Biometric Match', 'IP & Timestamp', 'SHA-256 Hash']
  }
};

export const HowItWorks = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [activePlan, setActivePlan] = useState<PlanType>('legal');
  const currentConfig = planConfig[activePlan];
  const currentSteps = currentConfig.steps;

  return (
    <section id="how-it-works" ref={ref} className="py-24 lg:py-32 px-4 bg-muted/30 overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 scroll-animate ${isVisible ? 'is-visible' : ''}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Secure & Legally Sealed Delivery
          </h2>
          <p className="text-2xl md:text-3xl text-muted-foreground font-medium mb-12">
            ({activePlan === 'legal' ? 'Identity-Verified' : 'Proof of Delivery'})
          </p>

          {/* Toggle Switch - Premium style matching the design */}
          <div className="inline-flex items-center bg-background rounded-full p-1.5 border border-border shadow-lg">
            <button 
              onClick={() => setActivePlan('professional')} 
              className={cn(
                "relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300",
                activePlan === 'professional' 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Professional</span>
              </div>
            </button>
            <button 
              onClick={() => setActivePlan('legal')} 
              className={cn(
                "relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300",
                activePlan === 'legal' 
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4" />
                <span>Legal</span>
              </div>
            </button>
          </div>
        </div>

        {/* Steps Flow - 5 column grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 stagger-children ${isVisible ? 'is-visible' : ''}`}>
          {currentSteps.map((step, index) => (
            <div 
              key={`${activePlan}-${index}`} 
              className="relative"
            >
              <div className={cn(
                "h-full p-5 rounded-2xl border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                "border-border"
              )}>
                {/* Icon */}
                <div className="flex justify-center mb-5">
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center",
                    activePlan === 'legal' && index === 1
                      ? "bg-amber-100" 
                      : "bg-primary/10"
                  )}>
                    <step.icon className={cn(
                      "w-7 h-7",
                      activePlan === 'legal' && index === 1 ? "text-amber-600" : "text-primary"
                    )} />
                  </div>
                </div>
                
                <h3 className="font-bold text-base mb-2 text-center">
                  <span className="text-foreground">{index + 1}. </span>
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed text-center">{step.description}</p>
              </div>
              
              {/* Arrow indicator between cards */}
              {index < 3 && (
                <div className="hidden lg:flex absolute top-1/2 -right-2.5 transform -translate-y-1/2 z-10">
                  <ArrowRight className={cn(
                    "w-4 h-4",
                    activePlan === 'legal' ? "text-amber-400" : "text-primary/40"
                  )} />
                </div>
              )}
            </div>
          ))}

          {/* Final PDF Certificate Card - Highlighted */}
          <div className="relative">
            {/* Arrow before final card */}
            <div className="hidden lg:flex absolute top-1/2 -left-2.5 transform -translate-y-1/2 z-10">
              <ArrowRight className={cn(
                "w-4 h-4",
                activePlan === 'legal' ? "text-amber-400" : "text-primary/40"
              )} />
            </div>
            
            <div className={cn(
              "h-full p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
              activePlan === 'legal' 
                ? "bg-gradient-to-br from-amber-50 to-amber-100/80 border-amber-300" 
                : "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30"
            )}>
              {/* Icon - PDF document */}
              <div className="flex justify-center mb-5">
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center relative",
                  activePlan === 'legal' 
                    ? "bg-amber-200/80" 
                    : "bg-primary/15"
                )}>
                  <FileText className={cn(
                    "w-7 h-7",
                    activePlan === 'legal' ? "text-amber-700" : "text-primary"
                  )} />
                  {/* Small badge overlay */}
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
                    activePlan === 'legal' ? "bg-amber-500" : "bg-primary"
                  )}>
                    <BadgeCheck className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold text-base mb-2 text-center">
                <span className="text-foreground">5. </span>
                {currentConfig.certificateTitle}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed text-center mb-4">
                {currentConfig.certificateDesc}
              </p>
              
              {/* Verification items */}
              <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                {currentConfig.verificationItems.map((item, i) => (
                  <span 
                    key={i}
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full",
                      activePlan === 'legal' 
                        ? "bg-amber-200/60 text-amber-800" 
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
              
              {/* Badge at bottom */}
              <div className="flex justify-center">
                <div className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5",
                  activePlan === 'legal' 
                    ? "bg-white/80 text-amber-800 border border-amber-300" 
                    : "bg-white/80 text-primary border border-primary/30"
                )}>
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>{currentConfig.certificateBadge}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className={`text-center mt-12 scroll-animate ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '400ms' }}>
          <p className="text-muted-foreground text-sm">
            {activePlan === 'professional' && (
              <>
                Need verified recipient identity? Switch to{" "}
                <button onClick={() => setActivePlan('legal')} className="text-amber-600 font-medium hover:underline">
                  Legal
                </button>{" "}
                for biometric ID verification.
              </>
            )}
            {activePlan === 'legal' && (
              <>
                <span className="text-amber-600 font-medium">Identity-Verified Delivery</span> — proof of exactly who received your documents.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};
