import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParallax } from "@/hooks/useParallax";
import Link from "next/link";

export const Hero = () => {
  const {
    scrollY,
    mouseX,
    mouseY
  } = useParallax();

  return (
    <section className="relative py-12 md:py-24 lg:py-32 px-6 md:px-4 overflow-hidden bg-background">
      {/* Parallax background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none transition-transform duration-300" 
        style={{ transform: `translateY(${scrollY * 0.1}px)` }} 
      />

      {/* Floating parallax elements - mouse reactive */}
      <div 
        className="absolute top-20 right-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none transition-transform duration-500 ease-out" 
        style={{ transform: `translate(${mouseX * 30}px, ${mouseY * 20 + scrollY * 0.15}px)` }} 
      />
      <div 
        className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out" 
        style={{ transform: `translate(${mouseX * -20}px, ${mouseY * -15 + scrollY * 0.1}px)` }} 
      />

      <div className="container max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Column - Text Content */}
          <div className="text-left">
            {/* Eyebrow text */}
            <p 
              className="inline-block text-xs md:text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 md:mb-6 opacity-0 animate-fade-in-up" 
              style={{ animationDelay: "0.05s" }}
            >
              Registered File Transfer
            </p>

            {/* Main headline */}
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 tracking-tight"
              style={{ transform: `translateY(${scrollY * -0.08}px)` }}
            >
              <span className="block leading-tight opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Send files with
              </span>
              <span 
                className="block mt-1 leading-tight opacity-0 animate-fade-in-up text-primary" 
                style={{ animationDelay: "0.2s" }}
              >
                undisputable proof.
              </span>
            </h1>

            {/* Subtitle */}
            <p 
              className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 max-w-xl opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              Stop the 'I didn't receive it' debate. Turn every transfer into court-admissible evidence with audit-ready logs.
            </p>

            {/* Feature bullets */}
            <div 
              className="flex flex-col gap-2.5 mb-6 md:mb-8 opacity-0 animate-fade-in-up" 
              style={{ animationDelay: "0.35s" }}
            >
              <div className="flex items-center gap-2.5 text-sm md:text-base text-foreground">
                <CheckCircle2 className="h-5 w-5 text-cta flex-shrink-0" />
                <span>Up to <span className="font-semibold">100GB</span> transfer</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm md:text-base text-foreground">
                <CheckCircle2 className="h-5 w-5 text-cta flex-shrink-0" />
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm md:text-base text-foreground">
                <CheckCircle2 className="h-5 w-5 text-cta flex-shrink-0" />
                <span>Qualified eIDAS timestamping</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div 
              className="opacity-0 animate-fade-in-up" 
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4 mb-2">
                <Button 
                  asChild 
                  size="lg" 
                  className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto group bg-cta hover:bg-cta/90 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Link href="/signup/pro">Send with Legal Proof</Link>
                </Button>
                <button 
                  type="button" 
                  className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 font-medium cursor-pointer relative z-10 border border-border rounded-lg hover:border-primary/30 hover:bg-muted/50"
                  onClick={() => {
                    const element = document.getElementById("how-it-works");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  How it works
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-8 md:mb-10">
                Start 14 day trial - No credit card required
              </p>
            </div>

            {/* Trust badges */}
            <div 
              className="opacity-0 animate-fade-in" 
              style={{ animationDelay: "0.5s" }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                {/* eIDAS Badge - Legal only */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors relative">
                  <img src="/assets/eidas-logo.png" alt="eIDAS" className="h-8 w-auto" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">eIDAS</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">Compliant</span>
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium border border-amber-200">Legal</span>
                </div>

                {/* GDPR Badge */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <img src="/assets/gdpr-logo.png" alt="GDPR" className="h-8 w-auto" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">GDPR</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">Compliant</span>
                  </div>
                </div>

                {/* ISO 27001 Badge */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <img src="/assets/iso27001-logo.png" alt="ISO 27001" className="h-8 w-auto" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">ISO 27001</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">Certified Infrastructure</span>
                  </div>
                </div>

                {/* Blockchain Badge - Legal only */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors relative">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Blockchain</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">Anchored</span>
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium border border-amber-200">Legal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Certificate Image */}
          <div 
            className="relative opacity-0 animate-fade-in-up lg:pl-8" 
            style={{ animationDelay: "0.3s" }}
          >
            {/* Certificate Image */}
            <div 
              className="relative"
              style={{ transform: `translateY(${scrollY * -0.05}px)` }}

            >
              <img 
                src="/assets/certificate-example.png" 
                alt="Certificate of Origin & Delivery - Example of legal proof document" 
                className="w-full max-w-sm mx-auto rounded-xl shadow-md border border-border/30"
              />
            </div>

            {/* Decorative elements behind the image */}
            {/* <div className="absolute -z-10 top-2 left-2 lg:left-10 w-full h-full  rounded-xl" /> */}
          </div>
        </div>

        {/* Privacy notice */}
        <p 
          className="mt-8 md:mt-12 text-xs md:text-sm text-muted-foreground opacity-0 animate-fade-in text-center" 
          style={{ animationDelay: "0.6s" }}
        >
          No ads. No data selling. <span className="text-foreground font-medium">100% EU privacy focused.</span>
        </p>
      </div>
    </section>
  );
};
