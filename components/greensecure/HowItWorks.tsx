'use client'
import { Upload, Download, Mail, Shield, Fingerprint, Link2, FileCheck, BadgeCheck, KeyRound } from "lucide-react";
import { useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/useParallax";
import { cn } from "@/lib/utils";
type PlanType = 'starter' | 'professional' | 'legal';
const starterSteps = [{
  icon: Upload,
  title: "Upload & Send",
  description: "Drag & drop your files (up to 10GB). Secured with end-to-end encryption."
}, {
  icon: KeyRound,
  title: "Email 2FA Verification",
  description: "Recipient verifies their identity with a one-time email code before access."
}, {
  icon: Download,
  title: "Secure Download",
  description: "After verification, recipient downloads the files securely."
}, {
  icon: Mail,
  title: "Delivery Confirmation",
  description: "You receive an email confirmation with date, time, and IP address of the download."
}];
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
}, {
  icon: FileCheck,
  title: "Sealed Audit Trail PDF",
  description: "Generate an Adobe Certified Audit Report with exact timestamp, IP address, browser info, and download confirmation to prove file integrity and delivery. Comparable to Registered Mail.",
  badge: "Adobe Certified"
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
}, {
  icon: BadgeCheck,
  title: "You Get Verdict",
  description: "You receive the Qualified Certificate with full legal evidential value."
}];
const planConfig = {
  starter: {
    label: 'Starter',
    icon: Mail,
    steps: starterSteps,
    usp: 'Basic security with two factor email verification',
    uspIcon: KeyRound,
    gradient: false,
    color: 'slate'
  },
  professional: {
    label: 'Professional',
    icon: Shield,
    steps: professionalSteps,
    usp: 'Proof of delivery & integrity',
    uspIcon: FileCheck,
    gradient: false,
    color: 'primary'
  },
  legal: {
    label: 'Legal',
    icon: BadgeCheck,
    steps: legalSteps,
    usp: 'Identity verification & legal irrefutability',
    uspIcon: Fingerprint,
    gradient: true,
    color: 'amber'
  }
};
export const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const {
    isVisible
  } = useScrollProgress(sectionRef);
  const [activePlan, setActivePlan] = useState<PlanType>('professional');
  const currentConfig = planConfig[activePlan];
  const currentSteps = currentConfig.steps;
  return <section id="how-it-works" className="py-24 px-4 bg-muted/30 overflow-hidden" ref={sectionRef}>
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            From simple security to court-admissible evidence — choose your protection level
          </p>

          {/* Toggle Switch - 3 options */}
          <div className="inline-flex flex-col items-center gap-2" style={{
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? 0 : 20}px)`,
          transitionDelay: '100ms'
        }}>
            <div className="inline-flex items-center bg-background rounded-full p-1.5 border border-border shadow-lg">
              <button onClick={() => setActivePlan('starter')} className={cn("relative px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300", activePlan === 'starter' ? "bg-slate-700 text-white shadow-md" : "text-muted-foreground hover:text-foreground")}>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Standard</span>
                </div>
              </button>
              <button onClick={() => setActivePlan('professional')} className={cn("relative px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300", activePlan === 'professional' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground")}>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Professional</span>
                </div>
              </button>
              <button onClick={() => setActivePlan('legal')} className={cn("relative px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300", activePlan === 'legal' ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md" : "text-muted-foreground hover:text-foreground")}>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4" />
                  <span>Legal</span>
                </div>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              ← Click to compare different protection levels →
            </p>
          </div>
        </div>

        {/* USP Badge - below the header section */}
        <div className={cn("flex justify-center mb-10 transition-all duration-500")} style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 20}px)`,
        transitionDelay: '150ms'
      }}>
          <div className={cn("inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium", activePlan === 'legal' ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200" : activePlan === 'professional' ? "bg-primary/10 text-primary border border-primary/20" : "bg-slate-100 text-slate-700 border border-slate-200")}>
            <currentConfig.uspIcon className="w-4 h-4" />
            <span>{currentConfig.usp}</span>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 transition-all duration-500">
          {currentSteps.map((step, index) => <div key={`${activePlan}-${index}`} className={cn("relative flex flex-col p-8 rounded-2xl border transition-all duration-500 group hover:-translate-y-2", activePlan === 'legal' ? "bg-gradient-to-br from-amber-50/50 to-orange-50/50 border-amber-200/50 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50" : activePlan === 'professional' ? "bg-background border-border hover:border-primary/30 hover:shadow-lg" : "bg-background border-border hover:border-slate-400 hover:shadow-lg")} style={{
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? 0 : 40}px)`,
          transitionDelay: `${(index + 2) * 100}ms`
        }}>
              {/* Step number badge */}
              <div className={cn("absolute -top-3 -left-3 w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-300", activePlan === 'legal' ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white" : activePlan === 'professional' ? "bg-primary text-primary-foreground" : "bg-slate-700 text-white")}>
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300", activePlan === 'legal' ? "bg-gradient-to-br from-amber-100 to-orange-100" : activePlan === 'professional' ? "bg-primary/10 group-hover:bg-primary/20" : "bg-slate-100 group-hover:bg-slate-200")}>
                <step.icon className={cn("w-7 h-7 transition-transform group-hover:scale-110", activePlan === 'legal' ? "text-amber-600" : activePlan === 'professional' ? "text-primary" : "text-slate-600")} />
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>

              {/* Legal badges for specific steps */}
              {activePlan === 'legal' && index === 1 && <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-100/50 rounded-full px-3 py-1.5 w-fit">
                  <Shield className="w-3 h-3" />
                  <span>GDPR Compliant</span>
                </div>}
              {activePlan === 'legal' && index === 2 && <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-100/50 rounded-full px-3 py-1.5 w-fit">
                  <Link2 className="w-3 h-3" />
                  <span>Immutable Record</span>
                </div>}
              {activePlan === 'legal' && index === 3 && <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-100/50 rounded-full px-3 py-1.5 w-fit">
                  <BadgeCheck className="w-3 h-3" />
                  <span>eIDAS Qualified</span>
                </div>}

              {/* Professional badge for audit trail */}
              {activePlan === 'professional' && index === 3 && <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1.5 w-fit">
                  <FileCheck className="w-3 h-3" />
                  <span>Adobe Certified</span>
                </div>}

              {/* Starter badge for delivery confirmation */}
              {activePlan === 'starter' && index === 3 && <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-full px-3 py-1.5 w-fit">
                  <Mail className="w-3 h-3" />
                  <span>Email Proof</span>
                </div>}
            </div>)}
        </div>

        {/* Bottom CTA hint */}
        <div className="text-center mt-12" style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 20}px)`,
        transitionDelay: '600ms'
      }}>
          <p className="text-muted-foreground text-sm">
            {activePlan === 'starter' && <>
                Need audit trails and proof of delivery? Upgrade to <button onClick={() => setActivePlan('professional')} className="text-primary font-medium hover:underline">Professional</button>.
              </>}
            {activePlan === 'professional' && <>
                Need court-admissible proof? Switch to <button onClick={() => setActivePlan('legal')} className="text-amber-600 font-medium hover:underline">Legal</button> for identity verification & blockchain anchoring.
              </>}
            {activePlan === 'legal' && <>
                <span className="text-amber-600 font-medium">Legal Evidence</span> provides qualified certificates recognized across the EU under eIDAS regulation.
              </>}
          </p>
        </div>
      </div>
    </section>;
};