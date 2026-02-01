import { useState, useEffect } from "react";
import { Shield, UserCheck, FileCheck, Cloud, Mail, FileWarning, ArrowRight } from "lucide-react";

const comparisonPoints = [
  {
    id: "cloud-act",
    risk: {
      title: "Compromised Client Confidentiality",
      description:
        "Under the US CLOUD Act, the US government can force providers to grant access to your confidential files, regardless of server location. Your data is never truly sovereign.",
      icon: Cloud,
    },
    solution: {
      title: "100% EU-Owned & Operated Core",
      description:
        "Your transferred files are never subject to US law. Built from the ground up on independent European infrastructure to protect professional secrecy.",
      icon: Shield,
      badge: null,
    },
  },
  {
    id: "identity",
    risk: {
      title: "Identity Uncertainty",
      description:
        "Standard links only track delivery, not the human behind the screen. If a link is forwarded or intercepted, your chain of custody is broken. You have zero proof of the actual recipient.",
      icon: Mail,
    },
    solution: {
      title: "Biometric ID Scan",
      description:
        "Recipient verifies identity with government ID + biometric selfie powered by Veriff. Provides undisputable proof of the specific human receiver.",
      icon: UserCheck,
      badge: "LEGAL PLAN FEATURE",
    },
  },
  {
    id: "evidence",
    risk: {
      title: "Inadmissible Evidence",
      description:
        "Basic logs lack cryptographic sealing and qualified timestamps. In a legal dispute, these easily-tampered confirmations often fail to meet the burden of proof in court.",
      icon: FileWarning,
    },
    solution: {
      title: "Court-Admissible PDF",
      description:
        "Automatic legally-sealed Adobe PDF certificate with every document. Includes timestamps from an independent Time Stamping Authority (TSA).",
      icon: FileCheck,
      badge: null,
    },
  },
];

export const ComparisonSection = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState("");
  const [isTypingNew, setIsTypingNew] = useState(false);

  const oldText = "Why Legacy Cloud Fails.";
  const newText = "The New Standard: TransferGuard Security";

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let currentText = "";
    let showingNew = false;
    let timeoutId: NodeJS.Timeout;

    const typeSpeed = 60;
    const deleteSpeed = 40;
    const pauseBeforeDelete = 2000;
    const pauseBeforeType = 500;
    const pauseAtEnd = 3000;

    const animate = () => {
      if (!showingNew) {
        // Phase 1: Typing old text
        if (!isDeleting && currentIndex <= oldText.length) {
          currentText = oldText.substring(0, currentIndex);
          setDisplayText(currentText);
          setIsTypingNew(false);
          currentIndex++;

          if (currentIndex > oldText.length) {
            // Pause before deleting
            timeoutId = setTimeout(() => {
              isDeleting = true;
              currentIndex = oldText.length;
              animate();
            }, pauseBeforeDelete);
            return;
          }
          timeoutId = setTimeout(animate, typeSpeed);
        }
        // Phase 2: Deleting old text
        else if (isDeleting && currentIndex >= 0) {
          currentText = oldText.substring(0, currentIndex);
          setDisplayText(currentText);
          currentIndex--;

          if (currentIndex < 0) {
            // Switch to new text
            isDeleting = false;
            showingNew = true;
            currentIndex = 0;
            timeoutId = setTimeout(animate, pauseBeforeType);
            return;
          }
          timeoutId = setTimeout(animate, deleteSpeed);
        }
      } else {
        // Phase 3: Typing new text
        if (currentIndex <= newText.length) {
          currentText = newText.substring(0, currentIndex);
          setDisplayText(currentText);
          setIsTypingNew(true);
          currentIndex++;

          if (currentIndex > newText.length) {
            // Pause at the end, then restart
            timeoutId = setTimeout(() => {
              showingNew = false;
              isDeleting = false;
              currentIndex = 0;
              setDisplayText("");
              setIsTypingNew(false);
              animate();
            }, pauseAtEnd);
            return;
          }
          timeoutId = setTimeout(animate, typeSpeed);
        }
      }
    };

    animate();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="py-24 lg:py-32 px-4 bg-gradient-to-b from-muted/20 to-background overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        {/* Animated Section Header - Typewriter Effect */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="h-16 sm:h-20 md:h-24 flex items-center justify-center">
            <h2
              className={`
                text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight
                ${isTypingNew ? "text-primary" : "text-muted-foreground"}
              `}
            >
              {displayText}
              <span className="inline-block w-[3px] h-[1em] ml-1 bg-current animate-pulse" />
            </h2>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
            Consumer tools weren't designed for legal professionals. See how TransferGuard solves what others can't.
          </p>
        </div>

        {/* Column Labels */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_80px_1fr] gap-4 mb-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/60"></span>
              Legacy Cloud
            </span>
          </div>
          <div /> {/* Arrow spacer */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-sm font-semibold bg-primary/10 text-primary px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              TransferGuard
            </span>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="space-y-4 lg:space-y-5">
          {comparisonPoints.map((point, index) => (
            <div key={point.id} className="grid lg:grid-cols-[1fr_80px_1fr] gap-4 lg:gap-0 items-stretch">
              {/* Risk Card */}
              <div
                className={`
                  relative p-5 lg:p-6 rounded-2xl border transition-all duration-300
                  bg-gradient-to-br from-muted/80 to-muted/40 
                  border-border/60
                  grayscale-[30%]
                  hover:grayscale-0
                  ${hoveredId === point.id ? "border-destructive/30 bg-destructive/5" : ""}
                `}
                onMouseEnter={() => setHoveredId(point.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Mobile label */}
                <div className="lg:hidden mb-3">
                  <span className="text-[10px] font-semibold text-destructive/70 uppercase tracking-wider">
                    The Risk
                  </span>
                </div>

                <div className="flex gap-4">
                  <div
                    className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                    bg-muted border border-border/50
                    ${hoveredId === point.id ? "bg-destructive/10 border-destructive/20" : ""}
                  `}
                  >
                    <point.risk.icon
                      className={`h-5 w-5 transition-colors duration-300 ${hoveredId === point.id ? "text-destructive" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground/80 mb-2">{point.risk.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{point.risk.description}</p>
                  </div>
                </div>
              </div>

              {/* Arrow - Desktop: centered between cards, Mobile: between cards */}
              <div className="flex items-center justify-center">
                <div
                  className={`
                  flex items-center justify-center transition-all duration-300
                  ${index === 1 ? "lg:flex-col lg:gap-1" : "lg:opacity-0"}
                `}
                >
                  {index === 1 && (
                    <>
                      <div className="hidden lg:flex flex-col items-center gap-1 px-2">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                          <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider mt-1">
                          Transform
                        </span>
                      </div>
                      <div className="lg:hidden flex items-center gap-2 py-2">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent via-primary/50 to-primary"></div>
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                          <ArrowRight className="h-4 w-4 text-white" />
                        </div>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent via-primary/50 to-primary"></div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Solution Card */}
              <div
                className={`
                  relative p-5 lg:p-6 rounded-2xl border transition-all duration-500
                  bg-gradient-to-br from-primary/[0.08] via-primary/[0.04] to-transparent
                  border-primary/20
                  ${
                    hoveredId === point.id
                      ? "border-primary/50 shadow-xl shadow-primary/10 scale-[1.02] bg-gradient-to-br from-primary/[0.12] via-primary/[0.08] to-amber-500/[0.04]"
                      : "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  }
                `}
              >
                {/* Mobile label */}
                <div className="lg:hidden mb-3">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">The Solution</span>
                </div>

                {/* Badge */}
                {point.solution.badge && (
                  <div className="absolute top-4 right-4">
                    <span
                      className={`
                      text-[10px] font-bold px-2.5 py-1 rounded-full transition-all duration-300
                      ${
                        hoveredId === point.id
                          ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md shadow-amber-500/30"
                          : "bg-amber-100 text-amber-700"
                      }
                    `}
                    >
                      {point.solution.badge}
                    </span>
                  </div>
                )}

                <div className="flex gap-4">
                  <div
                    className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                    ${
                      hoveredId === point.id
                        ? "bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30 scale-110"
                        : "bg-primary/10 border border-primary/20"
                    }
                  `}
                  >
                    <point.solution.icon
                      className={`h-5 w-5 transition-colors duration-300 ${hoveredId === point.id ? "text-white" : "text-primary"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-16 lg:pr-20">
                    <h4
                      className={`font-semibold mb-2 transition-colors duration-300 ${hoveredId === point.id ? "text-primary" : "text-foreground"}`}
                    >
                      {point.solution.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{point.solution.description}</p>
                  </div>
                </div>

                {/* Glow effect on hover */}
                {hoveredId === point.id && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-amber-500/5 pointer-events-none" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA hint */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Ready to upgrade?</span> TransferGuard combines EU
            sovereignty, biometric verification, and legal-grade certificates.
          </p>
        </div>
      </div>
    </section>
  );
};
