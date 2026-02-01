import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, UserCheck, ScanFace, FileCheck, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Link from "next/link";

export const IdentityVerificationSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  const verificationSteps = [
    {
      icon: ScanFace,
      title: "Live Selfie Capture",
      description: "Recipient takes a real-time photo to prevent fraud"
    },
    {
      icon: Shield,
      title: "Government ID Scan",
      description: "Passport or ID card is scanned and verified"
    },
    {
      icon: UserCheck,
      title: "Biometric Match",
      description: "AI compares selfie with ID photo for identity confirmation"
    },
    {
      icon: FileCheck,
      title: "Proof Generated",
      description: "Tamper-proof certificate with verified identity data"
    }
  ];

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 bg-gradient-to-b from-background to-amber-50/30">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 scroll-animate ${isVisible ? 'is-visible' : ''}`}>
          <p className="inline-block text-xs font-semibold text-amber-600 bg-amber-100 px-4 py-2 rounded-full uppercase tracking-wider mb-4">
            Legal Plan Feature
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Send with <span className="text-amber-600">undisputable</span> identity proof.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Legal-grade biometric verification.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className={`relative lg:col-span-1 scroll-animate-left ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '150ms' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-200">
              <img 
                src="/assets/id-verification.png" 
                alt="ID Verification Process - Passport matched with live selfie" 
                className="w-full h-auto object-contain max-w-2xl lg:max-w-3xl"
              />
              {/* Badge overlay - Hidden on mobile */}
              <div className="absolute hidden sm:block top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                LEGAL GRADE
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -z-10 top-6 left-6 w-full h-full bg-amber-200/30 rounded-2xl" />
          </div>

          {/* Right: Content */}
          <div className={`space-y-8 scroll-animate-right ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '250ms' }}>
            {/* Value proposition */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">
                From "I didn't receive it" to undeniable proof
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Standard file transfers can be disputed. Our Identity-Verified Delivery uses government-issued ID 
                combined with live biometric verification to create irrefutable evidence that the specific person 
                received your documents.
              </p>
            </div>

            {/* Verification steps */}
            <div className={`grid sm:grid-cols-2 gap-4 stagger-children ${isVisible ? 'is-visible' : ''}`}>
              {verificationSteps.map((step, index) => (
                <Card 
                  key={index}
                  className="p-4 bg-background border-l-4 border-l-amber-500 card-hover card-hover-amber"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <step.icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* eIDAS Compliance */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-5 border border-amber-200/50">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                eIDAS Compliant
              </h4>
              <ul className="space-y-2 text-sm text-amber-900/80">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>Our processes are designed in full alignment with the eIDAS regulation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>We utilize identity verification that meets stringent eIDAS standards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>Supports legally binding signatures in accordance with EU Regulation No 910/2014.</span>
                </li>
              </ul>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                GDPR Compliant
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Data deleted after verification
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                EU-based processing
              </span>
            </div>

            {/* CTA */}
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg group"
            >
              <Link href="/checkout?plan=legal">
                Get Identity-Verified Delivery
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
