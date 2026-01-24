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
    description: "EU-wide legal recognition and enforceability. The highest standard of digital proof.",
    legalOnly: true,
  },
];

export const CertificateSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isVisible } = useScrollProgress(sectionRef as React.RefObject<HTMLElement>);

  return (
    <section className="py-20 px-4 bg-muted/20 overflow-hidden relative" ref={sectionRef}>
      <div className="container max-w-6xl mx-auto relative">
        {/* Header */}
        <div
          className="text-center mb-14 transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 30}px)`,
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Your Irrefutable <span className="text-primary">Proof of Delivery</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every Registered File Transfer Generates a Certified Audit Trail. See What Pro & Legal Users Get.
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          
          {/* Left: Certificate Image */}
          <div
            className="relative transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateX(${isVisible ? 0 : -30}px)`,
              transitionDelay: "200ms",
            }}
          >
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-border/40">
              <img
                src="/assets/certificate-example.png"
                alt="Certified Delivery Report"
                className="w-full h-auto"
              />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
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
            {benefits.map((benefit, index) => (
              <Card
                key={benefit.title}
                className={`p-6 bg-background border rounded-2xl transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden ${
                  benefit.legalOnly 
                    ? "border-amber-200/80 hover:border-amber-300" 
                    : "border-border/60 hover:border-primary/30"
                } hover:shadow-lg`}
                style={{
                  transitionDelay: `${(index + 1) * 100}ms`,
                }}
              >
                {/* Colored accent bar on the left */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  benefit.legalOnly ? "bg-amber-400" : "bg-primary"
                }`} />
                
                <div className="flex items-start gap-4 pl-2">
                  {/* Plan badge */}
                  {benefit.legalOnly ? (
                    <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full border border-amber-200 bg-amber-50">
                      <div className="flex items-center gap-1.5">
                        <Scale className="h-3 w-3 text-amber-600" />
                        <span className="text-[11px] font-medium text-amber-700">Legal Plan</span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5">
                      <Shield className="h-3 w-3 text-primary" />
                      <span className="text-[11px] font-medium text-primary">Pro</span>
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div
                    className={`p-3 rounded-xl flex-shrink-0 ${
                      benefit.legalOnly ? "bg-amber-100" : "bg-primary/10"
                    }`}
                  >
                    <benefit.icon className={`h-5 w-5 ${benefit.legalOnly ? "text-amber-600" : "text-primary"}`} strokeWidth={1.5} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pr-20">
                    <h3 className="font-bold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
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