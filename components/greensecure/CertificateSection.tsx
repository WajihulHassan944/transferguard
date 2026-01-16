'use client'
import { Scale, Clock, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRef } from "react";
import { useScrollProgress } from "@/hooks/useParallax";

const benefits = [
  {
    icon: Shield,
    title: "Proof of Delivery",
    description: "Certified evidence of file transmission with timestamp and recipient ID.",
    legalOnly: false,
  },
  {
    icon: Clock,
    title: "Full Audit Trail",
    description: "IP address, timestamp, and device info logged for every download.",
    legalOnly: false,
  },
  {
    icon: Scale,
    title: "eIDAS Certified",
    description: "EU-wide legal recognition and enforceability.",
    legalOnly: true,
  },
];

export const CertificateSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

const { isVisible } = useScrollProgress(
  sectionRef as React.RefObject<HTMLElement>
);

  return (
    <section className="py-16 px-4 bg-background overflow-hidden relative" ref={sectionRef}>
      <div className="container max-w-6xl mx-auto relative">
        {/* Header */}
        <div
          className="text-center mb-10 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 30}px)`,
          }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-3">
            <span className="text-xs font-medium text-primary">Professional & Legal plan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Certified Delivery Report</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pro & Legal users receive a certified PDF with IP, device, and timestamp data. Standard users receive email confirmation.
          </p>
        </div>

        {/* Two column layout: Certificate + Benefits */}
        <div className="grid gap-8 md:grid-cols-2 items-center">
          {/* Left: Certificate Image */}
          <div
            className="relative transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateX(${isVisible ? 0 : -30}px)`,
              transitionDelay: "200ms",
            }}
          >
            <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-border">
              <img
                src="/assets/certificate-example.png"
                alt="Certified Delivery Report"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right: Benefits list */}
          <div
            className="space-y-4 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateX(${isVisible ? 0 : 30}px)`,
              transitionDelay: "300ms",
            }}
          >
            {benefits.map((benefit) => (
              <Card
                key={benefit.title}
                className={`p-5 bg-background border transition-all duration-300 hover:-translate-y-1 relative ${
                  benefit.legalOnly 
                    ? "border-amber-200 hover:border-amber-300" 
                    : "border-border hover:border-primary/30"
                } hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  {benefit.legalOnly ? (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full border border-amber-200 bg-amber-50">
                      <span className="text-[10px] font-medium text-amber-700">Legal plan</span>
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5">
                      <Shield className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-medium text-primary">Pro</span>
                    </div>
                  )}
                  <div
                    className={`p-2.5 rounded-xl ${
                      benefit.legalOnly ? "bg-amber-100" : "bg-primary/10"
                    }`}
                  >
                    <benefit.icon className={`h-5 w-5 ${benefit.legalOnly ? "text-amber-600" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 pr-16">
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
