import { Upload, Download, Shield, Fingerprint, FileCheck, BadgeCheck, Lock, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CertificatePreview } from "./CertificatePreview";

type PlanType = "professional" | "legal";

interface StepInfo {
  icon: React.ElementType;
  title: string;
  tooltipTitle: string;
  tooltipDetails: string[];
}

const getSteps = (language: "en" | "nl") => {
  const content = {
    en: {
      professional: [
        {
          icon: Upload,
          title: "Upload & Send",
          tooltipTitle: "Secure File Transfer",
          tooltipDetails: [
            "AES-256 encryption in transit",
            "Files up to 50GB supported",
            "Automatic virus scanning",
            "Zero-knowledge architecture",
          ],
        },
        {
          icon: Lock,
          title: "2FA Verification",
          tooltipTitle: "Two-Factor Authentication",
          tooltipDetails: [
            "6-digit one-time code via email",
            "Code expires after 15 minutes",
            "Maximum 3 attempts allowed",
            "IP address logged",
          ],
        },
        {
          icon: Download,
          title: "Secure Download",
          tooltipTitle: "Protected Download",
          tooltipDetails: [
            "Encrypted download channel",
            "Download link expires after use",
            "Browser fingerprint captured",
            "Real-time notification to sender",
          ],
        },
        {
          icon: FileCheck,
          title: "Access Granted",
          tooltipTitle: "Complete Audit Trail",
          tooltipDetails: [
            "Timestamp with milliseconds",
            "Geolocation data captured",
            "Device information logged",
            "Immutable audit record created",
          ],
        },
        {
          icon: FileText,
          title: "PDF Proof",
          tooltipTitle: "PDF Proof of Receipt",
          tooltipDetails: ["2FA Email Verified", "IP & Timestamp", "Device Fingerprint", "SHA-256 Hash"],
        },
      ],
      legal: [
        {
          icon: Upload,
          title: "Upload & Send",
          tooltipTitle: "Secure File Transfer",
          tooltipDetails: [
            "AES-256 encryption in transit",
            "Files up to 50GB supported",
            "Automatic virus scanning",
            "Zero-knowledge architecture",
          ],
        },
        {
          icon: Fingerprint,
          title: "Biometric ID",
          tooltipTitle: "Legal-Grade Identity Verification",
          tooltipDetails: [
            "Government ID document scan",
            "Live biometric facial recognition",
            "AI-powered liveness detection",
            "eIDAS compliant verification",
          ],
        },
        {
          icon: Download,
          title: "Secure Download",
          tooltipTitle: "Identity-Verified Download",
          tooltipDetails: [
            "Only verified identity can access",
            "Biometric session validation",
            "Download linked to verified ID",
            "Tamper-proof evidence chain",
          ],
        },
        {
          icon: FileCheck,
          title: "Access Granted",
          tooltipTitle: "Legal Proof Generated",
          tooltipDetails: [
            "Verified recipient identity stored",
            "Government ID reference captured",
            "Biometric match score recorded",
            "Court-admissible evidence created",
          ],
        },
        {
          icon: FileText,
          title: "PDF Proof",
          tooltipTitle: "PDF Proof of Receipt",
          tooltipDetails: ["Government ID", "Biometric Match", "IP & Timestamp", "SHA-256 Hash"],
        },
      ],
    },
    nl: {
      professional: [
        {
          icon: Upload,
          title: "Upload & Verstuur",
          tooltipTitle: "Veilige Bestandsoverdracht",
          tooltipDetails: [
            "AES-256 encryptie tijdens transport",
            "Bestanden tot 50GB ondersteund",
            "Automatische virusscan",
            "Zero-knowledge architectuur",
          ],
        },
        {
          icon: Lock,
          title: "2FA Verificatie",
          tooltipTitle: "Tweefactor Authenticatie",
          tooltipDetails: [
            "6-cijferige eenmalige code via email",
            "Code verloopt na 15 minuten",
            "Maximaal 3 pogingen toegestaan",
            "IP-adres geregistreerd",
          ],
        },
        {
          icon: Download,
          title: "Veilige Download",
          tooltipTitle: "Beschermde Download",
          tooltipDetails: [
            "Versleuteld downloadkanaal",
            "Downloadlink verloopt na gebruik",
            "Browser fingerprint vastgelegd",
            "Realtime melding naar verzender",
          ],
        },
        {
          icon: FileCheck,
          title: "Toegang Verleend",
          tooltipTitle: "Complete Audit Trail",
          tooltipDetails: [
            "Tijdstempel met milliseconden",
            "Geolocatiedata vastgelegd",
            "Apparaatinformatie gelogd",
            "Onveranderlijk auditrecord aangemaakt",
          ],
        },
        {
          icon: FileText,
          title: "PDF Bewijs",
          tooltipTitle: "PDF Bewijs van Ontvangst",
          tooltipDetails: ["2FA Email Geverifieerd", "IP & Tijdstempel", "Apparaat Fingerprint", "SHA-256 Hash"],
        },
      ],
      legal: [
        {
          icon: Upload,
          title: "Upload & Verstuur",
          tooltipTitle: "Veilige Bestandsoverdracht",
          tooltipDetails: [
            "AES-256 encryptie tijdens transport",
            "Bestanden tot 50GB ondersteund",
            "Automatische virusscan",
            "Zero-knowledge architectuur",
          ],
        },
        {
          icon: Fingerprint,
          title: "Biometrische ID",
          tooltipTitle: "Juridisch Niveau Identiteitsverificatie",
          tooltipDetails: [
            "Overheids-ID document scan",
            "Live biometrische gezichtsherkenning",
            "AI-gestuurde liveness detectie",
          ],
        },
        {
          icon: Download,
          title: "Veilige Download",
          tooltipTitle: "Identiteit-Geverifieerde Download",
          tooltipDetails: [
            "Alleen geverifieerde identiteit heeft toegang",
            "Biometrische sessievalidatie",
            "Download gekoppeld aan geverifieerde ID",
            "Fraudebestendige bewijsketen",
          ],
        },
        {
          icon: FileCheck,
          title: "Toegang Verleend",
          tooltipTitle: "Juridisch Bewijs Gegenereerd",
          tooltipDetails: [
            "Geverifieerde ontvangeridentiteit opgeslagen",
            "Overheids-ID referentie vastgelegd",
            "Biometrische matchscore geregistreerd",
            "Rechtbank-toelaatbaar bewijs gecreëerd",
          ],
        },
        {
          icon: FileText,
          title: "PDF Bewijs",
          tooltipTitle: "PDF Bewijs van Ontvangst",
          tooltipDetails: ["Overheids-ID", "Biometrische Match", "IP & Tijdstempel", "SHA-256 Hash"],
        },
      ],
    },
  };
  return content[language];
};

const sectionContent = {
  en: {
    title: "Secure & Legally Sealed Delivery",
    identityVerified: "Identity-Verified",
    proofOfDelivery: "Proof of Delivery",
    switchToLegal: "Need verified recipient identity? Switch to",
    legalText: "Legal",
    forBiometric: "for biometric ID verification.",
    identityVerifiedDelivery: "Identity-Verified Delivery",
    proofOfWho: "— proof of exactly who received your documents.",
  },
  nl: {
    title: "Veilige & Juridisch Verzegelde Levering",
    identityVerified: "Identiteit-Geverifieerd",
    proofOfDelivery: "Bewijs van Levering",
    switchToLegal: "Geverifieerde ontvanger nodig? Schakel naar",
    legalText: "Juridisch",
    forBiometric: "voor biometrische ID-verificatie.",
    identityVerifiedDelivery: "Identiteit-Geverifieerde Levering",
    proofOfWho: "— bewijs van precies wie uw documenten heeft ontvangen.",
  },
};

export const HowItWorks = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [activePlan, setActivePlan] = useState<PlanType>("legal");
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  const steps = getSteps(language);
  const content = sectionContent[language];
  const currentSteps = activePlan === "legal" ? steps.legal : steps.professional;

  return (
    <section id="how-it-works" ref={ref} className="py-24 lg:py-32 px-4 bg-muted/30 overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 scroll-animate ${isVisible ? "is-visible" : ""}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight">{content.title}</h2>
          <p className="text-2xl md:text-3xl text-muted-foreground font-medium mb-12">
            ({activePlan === "legal" ? content.identityVerified : content.proofOfDelivery})
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex items-center bg-background rounded-full p-1.5 border border-border shadow-lg">
            <button
              onClick={() => setActivePlan("professional")}
              className={cn(
                "relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300",
                activePlan === "professional"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{language === "nl" ? "Professioneel" : "Professional"}</span>
              </div>
            </button>
            <button
              onClick={() => setActivePlan("legal")}
              className={cn(
                "relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300",
                activePlan === "legal"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4" />
                <span>{language === "nl" ? "Juridisch" : "Legal"}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className={`relative scroll-animate ${isVisible ? "is-visible" : ""}`}>
          {/* Horizontal line - desktop - behind circles */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-primary via-primary to-amber-500 rounded-full z-0" />

          {/* Steps container */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-0 relative z-10">
            {currentSteps.map((step, index) => {
              const isLast = index === currentSteps.length - 1;
              const isBiometric = activePlan === "legal" && index === 1;

              return (
                <div
                  key={`${activePlan}-${index}`}
                  className="flex flex-col items-center relative z-10"
                  style={{ flex: "1 1 0" }}
                >
                  {/* Use Popover for mobile (tap) and HoverCard for desktop (hover) */}
                  {isMobile ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={cn(
                            "relative w-[120px] h-[120px] rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group",
                            "hover:scale-110 hover:shadow-2xl",
                            isLast && activePlan === "legal"
                              ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30"
                              : isLast
                                ? "bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30"
                                : isBiometric
                                  ? "bg-amber-100 border-4 border-amber-400"
                                  : "bg-background border-4 border-primary",
                          )}
                        >
                          {isLast && (
                            <div
                              className={cn(
                                "absolute inset-0 rounded-full animate-pulse opacity-50",
                                activePlan === "legal"
                                  ? "bg-gradient-to-br from-amber-300 to-amber-500"
                                  : "bg-gradient-to-br from-primary/50 to-primary/70",
                              )}
                            />
                          )}

                          <step.icon
                            className={cn(
                              "w-10 h-10 relative z-10 transition-transform duration-300 group-hover:scale-110",
                              isLast ? "text-white" : isBiometric ? "text-amber-600" : "text-primary",
                            )}
                          />

                          {isLast && (
                            <div
                              className={cn(
                                "absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center",
                                activePlan === "legal"
                                  ? "bg-white border-2 border-amber-400"
                                  : "bg-white border-2 border-primary",
                              )}
                            >
                              <BadgeCheck
                                className={cn("w-5 h-5", activePlan === "legal" ? "text-amber-600" : "text-primary")}
                              />
                            </div>
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="bottom"
                        align="center"
                        className={cn(
                          "w-72 p-4 rounded-xl shadow-2xl border-2 z-[9999]",
                          isBiometric || (isLast && activePlan === "legal")
                            ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300"
                            : "bg-background border-primary/30",
                        )}
                      >
                        <div className="space-y-3">
                          <h4
                            className={cn(
                              "font-bold text-sm flex items-center gap-2",
                              isBiometric || (isLast && activePlan === "legal") ? "text-amber-800" : "text-primary",
                            )}
                          >
                            <step.icon className="w-4 h-4" />
                            {step.tooltipTitle}
                          </h4>
                          <ul className="space-y-1.5">
                            {step.tooltipDetails.map((detail, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs">
                                <div
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                                    isBiometric || (isLast && activePlan === "legal") ? "bg-amber-500" : "bg-primary",
                                  )}
                                />
                                <span
                                  className={
                                    isBiometric || (isLast && activePlan === "legal")
                                      ? "text-amber-800"
                                      : "text-foreground"
                                  }
                                >
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <HoverCard openDelay={100} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <button
                          className={cn(
                            "relative w-[120px] h-[120px] rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group",
                            "hover:scale-110 hover:shadow-2xl",
                            isLast && activePlan === "legal"
                              ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30"
                              : isLast
                                ? "bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30"
                                : isBiometric
                                  ? "bg-amber-100 border-4 border-amber-400"
                                  : "bg-background border-4 border-primary",
                          )}
                        >
                          {isLast && (
                            <div
                              className={cn(
                                "absolute inset-0 rounded-full animate-pulse opacity-50",
                                activePlan === "legal"
                                  ? "bg-gradient-to-br from-amber-300 to-amber-500"
                                  : "bg-gradient-to-br from-primary/50 to-primary/70",
                              )}
                            />
                          )}

                          <step.icon
                            className={cn(
                              "w-10 h-10 relative z-10 transition-transform duration-300 group-hover:scale-110",
                              isLast ? "text-white" : isBiometric ? "text-amber-600" : "text-primary",
                            )}
                          />

                          {isLast && (
                            <div
                              className={cn(
                                "absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center",
                                activePlan === "legal"
                                  ? "bg-white border-2 border-amber-400"
                                  : "bg-white border-2 border-primary",
                              )}
                            >
                              <BadgeCheck
                                className={cn("w-5 h-5", activePlan === "legal" ? "text-amber-600" : "text-primary")}
                              />
                            </div>
                          )}
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent
                        side="bottom"
                        align="center"
                        className={cn(
                          "w-72 p-4 rounded-xl shadow-2xl border-2 z-[100]",
                          isBiometric || (isLast && activePlan === "legal")
                            ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300"
                            : "bg-background border-primary/30",
                        )}
                      >
                        <div className="space-y-3">
                          <h4
                            className={cn(
                              "font-bold text-sm flex items-center gap-2",
                              isBiometric || (isLast && activePlan === "legal") ? "text-amber-800" : "text-primary",
                            )}
                          >
                            <step.icon className="w-4 h-4" />
                            {step.tooltipTitle}
                          </h4>
                          <ul className="space-y-1.5">
                            {step.tooltipDetails.map((detail, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs">
                                <div
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                                    isBiometric || (isLast && activePlan === "legal") ? "bg-amber-500" : "bg-primary",
                                  )}
                                />
                                <span
                                  className={
                                    isBiometric || (isLast && activePlan === "legal")
                                      ? "text-amber-800"
                                      : "text-foreground"
                                  }
                                >
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}

                  {/* Step title */}
                  <div className="mt-4 text-center">
                    <span
                      className={cn(
                        "text-sm font-bold",
                        isLast && activePlan === "legal"
                          ? "text-amber-600"
                          : isLast
                            ? "text-primary"
                            : "text-foreground",
                      )}
                    >
                      {index + 1}. {step.title}
                    </span>
                  </div>

                  {/* Certificate preview button for last step */}
                  {isLast && (
                    <CertificatePreview variant={activePlan} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom hint - lower z-index so popups appear above */}
        <div
          className={`text-center mt-16 scroll-animate relative z-0 ${isVisible ? "is-visible" : ""}`}
          style={{ transitionDelay: "400ms" }}
        >
          <p className="text-muted-foreground text-sm">
            {activePlan === "professional" && (
              <>
                {content.switchToLegal}{" "}
                <button onClick={() => setActivePlan("legal")} className="text-amber-600 font-medium hover:underline">
                  {content.legalText}
                </button>{" "}
                {content.forBiometric}
              </>
            )}
            {activePlan === "legal" && (
              <>
                <span className="text-amber-600 font-medium">{content.identityVerifiedDelivery}</span>{" "}
                {content.proofOfWho}
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};
