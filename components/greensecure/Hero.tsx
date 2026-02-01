import { CheckCircle2, ArrowRight, Check, FileText, File, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative py-16 md:py-24 lg:py-32 px-4 overflow-hidden bg-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent pointer-events-none" />
      
      {/* Minimal floating accent */}
      <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none -translate-x-1/4" />

      <div className="container max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <div className="text-left">
            {/* Eyebrow text */}
            <p className="inline-block text-xs font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full uppercase tracking-wider mb-6 animate-fade-in">
              Registered File Transfer
            </p>

            {/* Main headline - Larger, bolder */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold mb-6 tracking-tight leading-[1.1] animate-fade-in" style={{ animationDelay: '100ms' }}>
              <span className="block text-foreground">
                Undisputable Evidence for
              </span>
              <span className="block mt-2 text-primary">
                Every File Transfer.
              </span>
            </h1>

            {/* Subtitle - More spacious */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
              Stop the 'I didn't receive it' debate. Turn every transfer into court-admissible evidence with audit-ready logs.
            </p>

            {/* Feature bullets - Clean checkmarks */}
            <div className="flex flex-col gap-3 mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-3 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-cta flex-shrink-0" />
                <span>Secure large dossiers up to <span className="font-semibold">100GB</span></span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-cta flex-shrink-0" />
                <span>Guarantee professional secrecy with E2EE</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-cta flex-shrink-0" />
                <span>Undisputable biometric delivery proof</span>
              </div>
            </div>

            {/* CTA buttons - Premium style */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <Button 
                asChild 
                size="lg" 
                className="text-base md:text-lg px-8 py-6 h-auto bg-cta hover:bg-cta/90 text-white shadow-lg hover:shadow-xl transition-all group"
              >
                <Link href="/signup/pro">
                  Send with Legal Proof
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <button 
                type="button" 
                className="text-base md:text-lg px-8 py-6 h-auto text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 font-medium cursor-pointer border border-border rounded-lg hover:border-primary/40 hover:bg-muted/30"
                onClick={() => {
                  const element = document.getElementById("how-it-works");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                How it works
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-10 animate-fade-in" style={{ animationDelay: '500ms' }}>
              Start 14 day trial — No credit card required
            </p>

            {/* Trust badges - Responsive for mobile */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 animate-fade-in" style={{ animationDelay: '600ms' }}>
              {/* GDPR Badge */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2.5 px-2 sm:px-3 py-2 sm:py-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                <img src="/assets/gdpr-logo.png" alt="GDPR" className="h-5 sm:h-7 w-auto" />
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[10px] sm:text-xs font-semibold text-foreground">GDPR</span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground hidden sm:block">Compliant</span>
                </div>
              </div>

              {/* ISO 27001 Badge */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2.5 px-2 sm:px-3 py-2 sm:py-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                <img src="/assets/iso27001-logo.png" alt="ISO 27001" className="h-5 sm:h-7 w-auto" />
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[10px] sm:text-xs font-semibold text-foreground whitespace-nowrap">ISO 27001</span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground hidden sm:block">Certified</span>
                </div>
              </div>

              {/* ID Verification Badge */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2.5 px-2 sm:px-3 py-2 sm:py-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:border-amber-300 transition-colors relative">
                <div className="absolute -top-2 -right-1 sm:-right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm">
                  LEGAL
                </div>
                <div className="h-5 w-5 sm:h-7 sm:w-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="9" cy="10" r="2" />
                    <path d="M15 8h2" />
                    <path d="M15 12h2" />
                    <path d="M7 16h10" />
                  </svg>
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[10px] sm:text-xs font-semibold text-foreground whitespace-nowrap">ID Verified</span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground hidden sm:block">Biometric</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - ID Verification Hero Image */}
          <div className="relative lg:scale-110 lg:origin-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            {/* Main ID Verification Image */}
            <div className="relative">
              <img 
                src="/assets/hero-id-verification.png" 
                alt="Identity verification with passport and facial recognition" 
                className="w-full h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-cover object-[center_20%] rounded-2xl shadow-2xl"
              />
              
              {/* Identity Verified Overlay Card - Hidden on mobile, visible from sm breakpoint */}
              <div className="absolute hidden sm:block sm:top-4 sm:right-0 lg:-right-4 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-xl p-4 w-48">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-cta/20 flex items-center justify-center mb-2">
                    <Check className="h-6 w-6 text-cta" />
                  </div>
                  <span className="font-bold text-foreground text-sm">IDENTITY VERIFIED</span>
                  
                  {/* File type icons */}
                  <div className="flex gap-2 mt-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1">PDF</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                        <File className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1">DOCX</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center">
                        <Archive className="h-4 w-4 text-cyan-500" />
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1">ZIP</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="mt-3 text-xs w-full border-border text-muted-foreground hover:bg-muted/50">
                    Download Secure Files
                  </Button>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Privacy notice */}
        <p className="mt-16 text-sm text-muted-foreground text-center animate-fade-in" style={{ animationDelay: '700ms' }}>
          No ads. No data selling. <span className="text-foreground font-medium">100% EU privacy focused.</span>
        </p>
      </div>
    </section>
  );
};
