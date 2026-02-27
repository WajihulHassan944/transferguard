import { useState, useEffect } from "react";
import { UserCheck, FileCheck, Cloud, Check, X, Lock, Clock, Hash, Trash2, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const getComparisonData = (language: "en" | "nl") => {
  const content = {
    en: {
      oldText: "Why Legacy Cloud Fails.",
      newText: "Why TransferGuard.",
      subtitle: "See the difference at a glance",
      legacyLabel: "Legacy Cloud",
      tgLabel: "TransferGuard",
      rows: [
        {
          id: "jurisdiction",
          icon: Cloud,
          feature: "Data Jurisdiction",
          legacy: "US CLOUD Act exposure",
          tg: "100% EU sovereignty",
          legacyBad: true,
        },
        {
          id: "identity",
          icon: UserCheck,
          feature: "Recipient Verification",
          legacy: "Link-only, no proof",
          tg: "Biometric ID scan",
          legacyBad: true,
          tgBadge: "VERIFIED IDENTITY",
        },
        {
          id: "evidence",
          icon: FileCheck,
          feature: "Legal Evidence",
          legacy: "Basic logs, tamperable",
          tg: "Sealed Adobe PDF",
          legacyBad: true,
        },
        {
          id: "encryption",
          icon: Lock,
          feature: "End-to-End Encryption",
          legacy: "Optional for enterprise",
          tg: "Available in every plan",
          legacyBad: true,
        },
        {
          id: "timestamp",
          icon: Clock,
          feature: "Qualified Timestamp",
          legacy: "No independent timestamp",
          tg: "Externally validated timestamp",
          legacyBad: true,
        },
        {
          id: "integrity",
          icon: Hash,
          feature: "File Integrity",
          legacy: "No hash verification",
          tg: "SHA-256 proof",
          legacyBad: true,
        },
        {
          id: "device",
          icon: Smartphone,
          feature: "Device Tracking",
          legacy: "No logging",
          tg: "IP, geolocation & fingerprint",
          legacyBad: true,
        },
      ],
    },
    nl: {
      oldText: "Waarom Traditionele Cloud Faalt?",
      newText: "Dit is wat TransferGuard oplost.",
      subtitle: "Zie het verschil in één oogopslag",
      legacyLabel: "Traditionele Cloud",
      tgLabel: "TransferGuard",
      rows: [
        {
          id: "jurisdiction",
          icon: Cloud,
          feature: "Data Jurisdictie",
          legacy: "US CLOUD Act risico",
          tg: "100% EU soevereiniteit",
          legacyBad: true,
        },
        {
          id: "identity",
          icon: UserCheck,
          feature: "Ontvanger Verificatie",
          legacy: "Alleen link, geen bewijs",
          tg: "Biometrische ID-scan",
          legacyBad: true,
          tgBadge: "VERIFIED IDENTITY",
        },
        {
          id: "evidence",
          icon: FileCheck,
          feature: "Juridisch Bewijs",
          legacy: "Basis logs, manipuleerbaar",
          tg: "Verzegelde Adobe PDF",
          legacyBad: true,
        },
        {
          id: "encryption",
          icon: Lock,
          feature: "End-to-End Encryptie",
          legacy: "Optioneel voor enterprise",
          tg: "Beschikbaar in elk abonnement",
          legacyBad: true,
        },
        {
          id: "timestamp",
          icon: Clock,
          feature: "Gekwalificeerde Tijdstempel",
          legacy: "Geen onafhankelijke tijdstempel",
          tg: "Extern gevalideerde tijdstempel",
          legacyBad: true,
        },
        {
          id: "integrity",
          icon: Hash,
          feature: "Bestandsintegriteit",
          legacy: "Geen hashverificatie",
          tg: "SHA-256 bewijs",
          legacyBad: true,
        },
        {
          id: "device",
          icon: Smartphone,
          feature: "Apparaat Tracking",
          legacy: "Geen logging",
          tg: "IP, geolocatie en fingerprint",
          legacyBad: true,
        },
      ],
    },
  };
  return content[language];
};

export const ComparisonSection = () => {
  const { language } = useLanguage();
  const data = getComparisonData(language);

  const [displayText, setDisplayText] = useState("");
  const [isTypingNew, setIsTypingNew] = useState(false);

  const oldText = data.oldText;
  const newText = data.newText;

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
        if (!isDeleting && currentIndex <= oldText.length) {
          currentText = oldText.substring(0, currentIndex);
          setDisplayText(currentText);
          setIsTypingNew(false);
          currentIndex++;

          if (currentIndex > oldText.length) {
            timeoutId = setTimeout(() => {
              isDeleting = true;
              currentIndex = oldText.length;
              animate();
            }, pauseBeforeDelete);
            return;
          }
          timeoutId = setTimeout(animate, typeSpeed);
        } else if (isDeleting && currentIndex >= 0) {
          currentText = oldText.substring(0, currentIndex);
          setDisplayText(currentText);
          currentIndex--;

          if (currentIndex < 0) {
            isDeleting = false;
            showingNew = true;
            currentIndex = 0;
            timeoutId = setTimeout(animate, pauseBeforeType);
            return;
          }
          timeoutId = setTimeout(animate, deleteSpeed);
        }
      } else {
        if (currentIndex <= newText.length) {
          currentText = newText.substring(0, currentIndex);
          setDisplayText(currentText);
          setIsTypingNew(true);
          currentIndex++;

          if (currentIndex > newText.length) {
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
  }, [oldText, newText]);

  return (
    <section className="py-16 lg:py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="container max-w-5xl mx-auto">
        {/* Animated Header - Typewriter Effect */}
        <div className="text-center mb-8">
          <div className="h-12 sm:h-14 md:h-16 flex items-center justify-center">
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${
                isTypingNew ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {displayText}
              <span className="inline-block w-[2px] h-[1em] ml-1 bg-current animate-pulse" />
            </h2>
          </div>
          <p className="text-base text-muted-foreground mt-1">{data.subtitle}</p>
        </div>

        {/* Comparison Table */}
        <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-md">
          {/* Desktop Table Header - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-[1.2fr_1fr_1fr] bg-muted/50 border-b border-border">
            <div className="px-4 py-3" />
            <div className="px-4 py-3 text-center border-x border-border/50">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <X className="h-4 w-4 text-destructive" />
                {data.legacyLabel}
              </span>
            </div>
            <div className="px-4 py-3 text-center">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Check className="h-4 w-4" />
                {data.tgLabel}
              </span>
            </div>
          </div>

          {/* Desktop Table Rows - Hidden on mobile */}
          <div className="hidden md:block">
            {data.rows.map((row, index) => (
              <div
                key={row.id}
                className={`grid grid-cols-[1.2fr_1fr_1fr] items-center ${
                  index !== data.rows.length - 1 ? "border-b border-border/50" : ""
                } hover:bg-muted/30 transition-colors`}
              >
              <div className="px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <row.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">{row.feature}</span>
                </div>
                <div className="px-4 py-3 text-center border-x border-border/30">
                  <span className={`text-sm ${row.legacyBad ? "text-destructive" : "text-muted-foreground"}`}>
                    {row.legacy}
                  </span>
                </div>
                <div className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-primary">{row.tg}</span>
                    {row.tgBadge && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200">
                        {row.tgBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Card Layout - Compact */}
          <div className="md:hidden">
            {data.rows.map((row, index) => (
              <div key={row.id} className={`px-4 py-3 ${index !== data.rows.length - 1 ? "border-b border-border/50" : ""}`}>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <row.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">{row.feature}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pl-[42px]">
                  <div className="bg-destructive/5 rounded-lg px-2.5 py-2 border border-destructive/20">
                    <p className={`text-xs leading-snug ${row.legacyBad ? "text-destructive" : "text-muted-foreground"}`}>
                      {row.legacy}
                    </p>
                  </div>
                  <div className="bg-primary/5 rounded-lg px-2.5 py-2 border border-primary/20">
                    <p className="text-xs font-semibold text-primary leading-snug">{row.tg}</p>
                    {row.tgBadge && (
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                        {row.tgBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
