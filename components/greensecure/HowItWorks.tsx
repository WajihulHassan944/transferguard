import { Upload, Download, Shield, Fingerprint, Link2, FileCheck, BadgeCheck, KeyRound, Scale, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/useParallax";
import { cn } from "@/lib/utils";
import certificateExample from "@/assets/certificate-example.png";

type PlanType = 'professional' | 'legal';

const professionalSteps = [{
  icon: Upload,
  title: "Upload & Send",
  description: "Drag & drop your files (up to 50GB). Secured with end-to-end encryption."
}, {
  icon: KeyRound,
  title: "Email 2FA Verification",
  description: "Recipient verifies their identity with a one-time email code before access."
}, {
  icon: Download,
  title: "Secure Download",
  description: "After verification, recipient downloads the files securely."
}];

const legalSteps = [{
  icon: Upload,
  title: "Upload & Certify",
  description: "Drag & drop your files (up to 100GB). Enable 'Require Qualified Validation' for legal-grade proof."
}, {
  icon: Fingerprint,
  title: "Strict ID Check",
  description: "Recipient must verify identity (SMS/BankID) before download starts."
}, {
  icon: Link2,
  title: "Blockchain Anchor",
  description: "The transaction is immutably recorded on the Blockchain."
}];

const planConfig = {
  professional: {
    label: 'Professional',
    icon: Shield,
    steps: professionalSteps,
    usp: 'Proof of delivery & integrity',
    uspIcon: FileCheck,
    gradient: false,
    color: 'primary',
    certificateTitle: 'Sealed Audit Trail PDF',
    certificateDesc: 'Generate an Adobe Certified Audit Report with exact timestamp, IP address, browser info, and download confirmation.',
    certificateBadge: 'Adobe Certified'
  },
  legal: {
    label: 'Legal',
    icon: Scale,
    steps: legalSteps,
    usp: 'Identity verification & legal irrefutability',
    uspIcon: Fingerprint,
    gradient: true,
    color: 'amber',
    certificateTitle: 'Qualified Certificate',
    certificateDesc: 'You receive the eIDAS Qualified Certificate with full legal evidential value, admissible in EU courts.',
    certificateBadge: 'eIDAS Qualified'
  }
};

export const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const {
    isVisible
  } = useScrollProgress(sectionRef as React.RefObject<HTMLElement>);
  const [activePlan, setActivePlan] = useState<PlanType>('professional');
  const currentConfig = planConfig[activePlan];
  const currentSteps = currentConfig.steps;

  return (
    <section id="how-it-works" className="py-24 px-4 bg-muted/30 overflow-hidden" ref={sectionRef}>
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12 transition-all duration-700" style={{
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? 0 : 30}px)`
        }}>
          <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3">
            How it works
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Secure & legally sealed delivery
          </h2>
          <p className="text-lg text-muted-foreground mx-auto mb-8">
            Legal certainty for every delivery — choose the level that fits your needs
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex flex-col items-center gap-2" style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 20}px)`,
            transitionDelay: '100ms'
          }}>
            <div className="inline-flex items-center bg-background rounded-full p-1 sm:p-1.5 border border-border shadow-lg max-w-full overflow-x-auto">
              <button onClick={() => setActivePlan('professional')} className={cn("relative px-3 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap", activePlan === 'professional' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground")}>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Professional</span>
                </div>
              </button>
              <button onClick={() => setActivePlan('legal')} className={cn("relative px-3 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap", activePlan === 'legal' ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md" : "text-muted-foreground hover:text-foreground")}>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Scale className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Legal</span>
                </div>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              ← Click to compare different protection levels →
            </p>
          </div>
        </div>

        {/* USP Badge */}
        <div className={cn("flex justify-center mb-10 transition-all duration-500")} style={{
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? 0 : 20}px)`,
          transitionDelay: '150ms'
        }}>
          <div className={cn("inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium", activePlan === 'legal' ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200" : "bg-primary/10 text-primary border border-primary/20")}>
            <currentConfig.uspIcon className="w-4 h-4" />
            <span>{currentConfig.usp}</span>
          </div>
        </div>

        {/* Steps Flow with Arrows - Compact Layout */}
        <div className="relative">
          <div className="flex flex-col lg:flex-row items-stretch gap-3 lg:gap-2">
            {currentSteps.map((step, index) => (
              <div key={`${activePlan}-${index}`} className="flex items-center gap-2 flex-1">
                {/* Step Card */}
                <div 
                  className={cn(
                    "relative flex flex-col p-5 rounded-xl border transition-all duration-500 group hover:-translate-y-1 flex-1 min-h-[180px]",
                    activePlan === 'legal' 
                      ? "bg-gradient-to-br from-amber-50/50 to-orange-50/50 border-amber-200/50 hover:border-amber-300 hover:shadow-md" 
                      : "bg-background border-border hover:border-primary/30 hover:shadow-md"
                  )} 
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: `translateY(${isVisible ? 0 : 30}px)`,
                    transitionDelay: `${(index + 2) * 80}ms`
                  }}
                >
                  {/* Step number badge */}
                  <div className={cn(
                    "absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center z-10",
                    activePlan === 'legal' 
                      ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white" 
                      : "bg-primary text-primary-foreground"
                  )}>
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                    activePlan === 'legal' 
                      ? "bg-gradient-to-br from-amber-100 to-orange-100" 
                      : "bg-primary/10"
                  )}>
                    <step.icon className={cn(
                      "w-5 h-5",
                      activePlan === 'legal' ? "text-amber-600" : "text-primary"
                    )} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-semibold text-sm mb-1.5">{step.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow */}
                <div 
                  className="hidden lg:flex items-center justify-center flex-shrink-0"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transitionDelay: `${(index + 2.5) * 80}ms`
                  }}
                >
                  <ChevronRight className={cn(
                    "w-5 h-5",
                    activePlan === 'legal' ? "text-amber-400" : "text-primary/40"
                  )} />
                </div>
              </div>
            ))}

            {/* Final Certificate Card - Step 4 */}
            <div 
              className={cn(
                "relative flex flex-col p-5 rounded-xl border transition-all duration-500 group hover:-translate-y-1 flex-1 lg:flex-[1.3] min-h-[180px]",
                activePlan === 'legal' 
                  ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300" 
                  : "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30"
              )} 
              style={{
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? 0 : 30}px)`,
                transitionDelay: '450ms'
              }}
            >
              {/* Step number badge */}
              <div className={cn(
                "absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center z-10",
                activePlan === 'legal' 
                  ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white" 
                  : "bg-primary text-primary-foreground"
              )}>
                4
              </div>

              <div className="flex gap-4 h-full">
                {/* Left: Text Content */}
                <div className="flex-1 flex flex-col">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                    activePlan === 'legal' 
                      ? "bg-gradient-to-br from-amber-100 to-orange-100" 
                      : "bg-primary/10"
                  )}>
                    <FileCheck className={cn(
                      "w-5 h-5",
                      activePlan === 'legal' ? "text-amber-600" : "text-primary"
                    )} />
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-1.5">{currentConfig.certificateTitle}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-2">
                    {currentConfig.certificateDesc}
                  </p>
                  
                  <div className={cn(
                    "inline-flex items-center gap-1.5 text-[10px] font-medium rounded-full px-2 py-1 w-fit mt-auto",
                    activePlan === 'legal' 
                      ? "bg-amber-100 text-amber-700" 
                      : "bg-primary/10 text-primary"
                  )}>
                    <BadgeCheck className="w-3 h-3" />
                    <span>{currentConfig.certificateBadge}</span>
                  </div>
                </div>

                {/* Right: Certificate Mockup */}
                <div className="hidden sm:flex flex-col items-center justify-center flex-shrink-0 w-24">
                  {/* Mini Certificate Mockup */}
                  <div className="relative bg-white rounded-lg shadow-lg border border-border/50 p-2 w-full">
                    {/* Header bar */}
                    <div className={cn(
                      "h-1.5 rounded-full mb-2",
                      activePlan === 'legal' ? "bg-amber-400" : "bg-primary"
                    )} />
                    {/* Content lines */}
                    <div className="space-y-1.5 mb-3">
                      <div className="h-1 bg-muted rounded-full w-full" />
                      <div className="h-1 bg-muted rounded-full w-3/4" />
                      <div className="h-1 bg-muted rounded-full w-5/6" />
                      <div className="h-1 bg-muted rounded-full w-2/3" />
                    </div>
                    {/* Checkmarks */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className={cn("w-2 h-2 rounded-full", activePlan === 'legal' ? "bg-amber-400" : "bg-primary")} />
                        <div className="h-0.5 bg-muted rounded-full flex-1" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={cn("w-2 h-2 rounded-full", activePlan === 'legal' ? "bg-amber-400" : "bg-primary")} />
                        <div className="h-0.5 bg-muted rounded-full flex-1" />
                      </div>
                    </div>
                    
                    {/* Wax Seal */}
                    <div className={cn(
                      "absolute -bottom-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white",
                      activePlan === 'legal'
                        ? "bg-gradient-to-br from-red-600 to-red-800"
                        : "bg-gradient-to-br from-primary to-primary/70"
                    )}>
                      <div className="text-center">
                        <BadgeCheck className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Label under mockup */}
                  <p className={cn(
                    "text-[9px] font-medium mt-3 text-center",
                    activePlan === 'legal' ? "text-amber-600" : "text-primary"
                  )}>
                    {activePlan === 'legal' ? 'Legal Proof' : 'Sealed Proof'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA hint */}
        <div className="text-center mt-12" style={{
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? 0 : 20}px)`,
          transitionDelay: '600ms'
        }}>
          <p className="text-muted-foreground text-sm">
            {activePlan === 'professional' && (
              <>
                Need court-admissible proof? Switch to <button onClick={() => setActivePlan('legal')} className="text-amber-600 font-medium hover:underline">Legal</button> for identity verification & blockchain anchoring.
              </>
            )}
            {activePlan === 'legal' && (
              <>
                <span className="text-amber-600 font-medium">Legal Evidence</span> provides qualified certificates recognized across the EU under eIDAS regulation.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};