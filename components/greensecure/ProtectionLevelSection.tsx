import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Fingerprint, Check, Mail, MapPin, Clock, Hash, Monitor, FileCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Link from "next/link";

export const ProtectionLevelSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  const professionalFeatures = [
    { icon: Mail, text: "Two-Factor Email Verification" },
    { icon: MapPin, text: "IP Address & Location Logging" },
    { icon: Clock, text: "Sectigo Qualified Timestamp" },
    { icon: Hash, text: "SHA-256 File Hash Integrity" },
    { icon: Monitor, text: "Device & OS Fingerprinting" },
    { icon: FileCheck, text: "Adobe AATL Sealed PDF" },
  ];

  const legalFeatures = [
    { icon: Shield, text: "Everything in Professional +" },
    { icon: Fingerprint, text: "Biometric ID Verification" },
    { icon: FileCheck, text: "Government ID Document Check" },
    { icon: Check, text: "Complete Non-Repudiation Package" },
  ];

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 scroll-animate ${isVisible ? 'is-visible' : ''}`}>
          Legal certainty.
          <span className="text-primary"> Choose your level.</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Professional Plan with Label */}
          <div className="flex flex-col">
            {/* Professional Plan Label */}
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-5 py-2.5 rounded-full border border-primary/20">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                Professional Plan
              </span>
            </div>
            
            {/* Professional Card */}
            <Card className={`relative p-8 bg-background border-l-4 border-l-primary border-t border-r border-b border-border flex flex-col h-full rounded-xl scroll-animate-left card-hover ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '100ms' }}>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">Verified Download Proof</h3>
              <p className="text-muted-foreground text-center mb-6 text-sm leading-relaxed">
                Prove exactly when, where, and how your file was downloaded. Every download generates a tamper-proof audit
                trail sealed with an Adobe AATL certificate.
              </p>

              <ul className="space-y-3 flex-1">
                {professionalFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground text-sm">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12 text-base font-medium"
                >
                  <Link href="/signup/pro?plan=professional">Select Professional</Link>
                </Button>
              </div>
            </Card>
          </div>

          {/* Legal Plan with Label */}
          <div className="flex flex-col">
            {/* Legal Plan Label */}
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-100 px-5 py-2.5 rounded-full border border-amber-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Legal Plan
              </span>
            </div>
            
            {/* Legal Card */}
            <Card className={`relative p-8 bg-background border-2 border-amber-400 flex flex-col h-full rounded-xl overflow-visible scroll-animate-right card-hover card-hover-amber ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '200ms' }}>
              {/* Court Ready Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                IDENTITY VERIFIED
              </div>

              <div className="flex justify-center mb-6 mt-2">
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                  <Fingerprint className="h-8 w-8 text-amber-600" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">Identity-Verified Delivery</h3>
              <p className="text-muted-foreground text-center mb-6 text-sm leading-relaxed">
                Know exactly <strong className="text-foreground">who</strong> downloaded your documents. Biometric
                verification proves recipient identity for strong legal evidence.
              </p>

              <ul className="space-y-3 flex-1">
                {legalFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-foreground text-sm">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg h-12 text-base font-medium"
                >
                  <Link href="/signup/pro?plan=legal">Select Legal</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
