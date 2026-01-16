import { Shield, Lock, ArrowRight, Scale, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useParallax } from "@/hooks/useParallax";
import Link from "next/link";
export const Hero = () => {
  const { scrollY, mouseX, mouseY } = useParallax();
  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden bg-background">
      {/* Parallax background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none transition-transform duration-300"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Floating parallax elements - mouse reactive */}
      <div
        className="absolute top-20 right-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mouseX * 30}px, ${mouseY * 20 + scrollY * 0.15}px)`,
        }}
      />
      <div
        className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mouseX * -20}px, ${mouseY * -15 + scrollY * 0.1}px)`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/3 rounded-full blur-2xl pointer-events-none transition-transform duration-600 ease-out"
        style={{
          transform: `translate(calc(-50% + ${mouseX * 40}px), calc(-50% + ${mouseY * 30}px))`,
        }}
      />

      {/* Floating decorative shapes */}
      <div
        className="absolute top-32 left-20 w-3 h-3 bg-primary/30 rounded-full pointer-events-none hidden md:block"
        style={{
          transform: `translate(${mouseX * 50}px, ${mouseY * 40 + scrollY * 0.3}px)`,
        }}
      />
      <div
        className="absolute top-48 right-32 w-2 h-2 bg-primary/40 rounded-full pointer-events-none hidden md:block"
        style={{
          transform: `translate(${mouseX * -60}px, ${mouseY * -50 + scrollY * 0.25}px)`,
        }}
      />
      <div
        className="absolute bottom-32 right-20 w-4 h-4 bg-primary/20 rounded-full pointer-events-none hidden md:block"
        style={{
          transform: `translate(${mouseX * 35}px, ${mouseY * 25 + scrollY * 0.2}px)`,
        }}
      />

      <div className="container max-w-6xl mx-auto relative">
        <div className="max-w-4xl mx-auto">
          {/* Text Content */}
          <div className="text-center">
            {/* Eyebrow text */}
            <p
              className="text-sm md:text-base font-medium text-primary/80 uppercase tracking-widest mb-4 opacity-0 animate-fade-in-up"
              style={{
                animationDelay: "0.05s",
                transform: `translateY(${scrollY * -0.1}px)`,
              }}
            >
              Secure File Transfer
            </p>

            {/* Main headline with parallax */}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 tracking-tight"
              style={{
                transform: `translateY(${scrollY * -0.08}px)`,
              }}
            >
              <span
                className="block leading-snug opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: "0.1s",
                }}
              >
                Stop the <span className="text-foreground/70">"I didn't receive it"</span> debate.
              </span>
              <span
                className="block text-primary mt-1 leading-snug opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: "0.2s",
                }}
              >
                Get irrefutable proof.
              </span>
            </h1>

            <p
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-in-up"
              style={{
                animationDelay: "0.35s",
                transform: `translateY(${scrollY * -0.06}px)`,
              }}
            >
              Transfer files up to <span className="font-semibold text-foreground">100GB</span> with end-to-end encryption. 
              Get <span className="font-semibold text-foreground">court-admissible evidence</span> backed by Adobe Sealed Audit Trail 
              and eIDAS Qualified validation.
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-col items-center gap-4 mb-8 opacity-0 animate-fade-in-up"
              style={{
                animationDelay: "0.4s",
                transform: `translateY(${scrollY * -0.04}px)`,
              }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-6 h-auto group bg-cta hover:bg-cta/90 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Link href="/signup/pro">
                    Start Secure Transfer
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <button
                  type="button"
                  className="text-lg px-8 py-6 h-auto border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all hover:scale-105 rounded-md font-medium cursor-pointer relative z-10"
                  onClick={() => {
                    const element = document.getElementById("how-it-works");
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  See How It Works
                </button>
              </div>
              <span className="text-xs text-muted-foreground">14 days free access • No credit card needed</span>
            </div>

            {/* Trust badges - minimal style */}
            <div
              className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground opacity-0 animate-fade-in"
              style={{
                animationDelay: "0.5s",
                transform: `translateY(${scrollY * -0.02}px)`,
              }}
            >
              <div className="flex items-center gap-2 px-4 py-3 h-14 min-w-[120px] rounded-lg border border-border/50 bg-background/50 hover:border-primary/30 transition-all cursor-default">
                <span className="text-base">🇪🇺</span>
                <span className="text-xs font-medium leading-tight">
                  EU Data
                  <br />
                  Only
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 h-14 min-w-[120px] rounded-lg border border-border/50 bg-background/50 hover:border-primary/30 transition-all cursor-default">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-medium leading-tight">
                  ISO
                  <br />
                  27001
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 h-14 min-w-[120px] rounded-lg border border-border/50 bg-background/50 hover:border-primary/30 transition-all cursor-default">
                <Lock className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-medium leading-tight">
                  End-to-End
                  <br />
                  Encrypted
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 h-14 min-w-[120px] rounded-lg border border-amber-200 bg-amber-50/50 hover:border-amber-300 transition-all cursor-default">
                <Scale className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium leading-tight">
                    eIDAS
                    <br />
                    Compliant
                  </span>
                  <span className="text-[10px] text-amber-600 font-medium">Legal plan</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 h-14 min-w-[120px] rounded-lg border border-amber-200 bg-amber-50/50 hover:border-amber-300 transition-all cursor-default">
                <LinkIcon className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium leading-tight">
                    Blockchain
                    <br />
                    Anchored
                  </span>
                  <span className="text-[10px] text-amber-600 font-medium">Legal plan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy notice - centered below */}
        <p
          className="mt-12 text-sm text-muted-foreground opacity-0 animate-fade-in text-center"
          style={{
            animationDelay: "0.6s",
          }}
        >
          No ads. No data selling. <span className="text-foreground font-medium">100% EU privacy focused.</span>
        </p>
      </div>
    </section>
  );
};
