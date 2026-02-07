import { useState, useEffect } from "react";
import { UserCheck, FileCheck, Cloud, Check, X, Lock } from "lucide-react";
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
          tgBadge: "LEGAL",
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
          tgBadge: "JURIDISCH",
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
    <section className="py-24 lg:py-32 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="container max-w-5xl mx-auto">
        {/* Animated Header - Typewriter Effect */}
        <div className="text-center mb-12">
          <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
                isTypingNew ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {displayText}
              <span className="inline-block w-[2px] h-[1em] ml-1 bg-current animate-pulse" />
            </h2>
          </div>
          <p className="text-lg text-muted-foreground mt-2">{data.subtitle}</p>
        </div>

        {/* Comparison Table */}
        <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-md">
          {/* Desktop Table Header - Hidden on mobile */}
          <div className="hidden md:grid grid-cols-[1.2fr_1fr_1fr] bg-muted/50 border-b border-border">
            <div className="p-5 lg:p-6" />
            <div className="p-5 lg:p-6 text-center border-x border-border/50">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <X className="h-4 w-4 text-destructive" />
                {data.legacyLabel}
              </span>
            </div>
            <div className="p-5 lg:p-6 text-center">
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
                <div className="p-5 lg:p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <row.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-semibold text-base text-foreground">{row.feature}</span>
                </div>
                <div className="p-5 lg:p-6 text-center border-x border-border/30">
                  <span className={`text-sm ${row.legacyBad ? "text-destructive" : "text-muted-foreground"}`}>
                    {row.legacy}
                  </span>
                </div>
                <div className="p-5 lg:p-6 text-center">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-primary">{row.tg}</span>
                    {row.tgBadge && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-md border border-amber-200">
                        {row.tgBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden">
            {data.rows.map((row, index) => (
              <div key={row.id} className={`p-5 ${index !== data.rows.length - 1 ? "border-b border-border/50" : ""}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <row.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-base text-foreground">{row.feature}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-destructive/5 rounded-xl p-3 border border-destructive/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <X className="h-3.5 w-3.5 text-destructive" />
                      <span className="text-xs font-medium text-muted-foreground">{data.legacyLabel}</span>
                    </div>
                    <p className={`text-sm ${row.legacyBad ? "text-destructive" : "text-muted-foreground"}`}>
                      {row.legacy}
                    </p>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-3 border border-primary/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-primary">{data.tgLabel}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-semibold text-primary">{row.tg}</p>
                      {row.tgBadge && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md border border-amber-200 w-fit">
                          {row.tgBadge}
                        </span>
                      )}
                    </div>
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
