'use client';
import { Lock, MessageSquare, FolderOpen, Download, Shield, UserCheck, FileText, ChevronRight, CheckCircle2, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

const getAdvantages = (language: 'en' | 'nl') => {
  const content = {
    en: [
      { icon: MessageSquare, title: "Secure Messaging", description: "Real-time encrypted inbox between you and your client" },
      { icon: FolderOpen, title: "Dossier Management", description: "Organize files per case, matter, or project in structured dossiers" },
      { icon: Download, title: "Download Certificates", description: "Legally valid proof of who downloaded what, when, and from where" },
      { icon: UserCheck, title: "ID Verification", description: "Biometric identity check before document access — irrefutable proof" },
    ],
    nl: [
      { icon: MessageSquare, title: "Beveiligd Berichtenverkeer", description: "Realtime versleutelde inbox tussen u en uw cliënt" },
      { icon: FolderOpen, title: "Dossierbeheer", description: "Organiseer bestanden per zaak, dossier of project in gestructureerde mappen" },
      { icon: Download, title: "Downloadcertificaten", description: "Juridisch geldig bewijs van wie wat heeft gedownload, wanneer en vanwaar" },
      { icon: UserCheck, title: "ID-Verificatie", description: "Biometrische identiteitscontrole vóór documenttoegang — onweerlegbaar bewijs" },
    ],
  };
  return content[language];
};

const sectionContent = {
  en: {
    badge: "Verified Identity Feature",
    title: "Your Own Client Workspace",
    subtitle: "A Secure Digital Vault per Client",
    description: "Give every client their own encrypted workspace with messaging, dossier management, and legally valid download proof. No account required for your clients.",
    workspaceTitle: "De Vries Advocaten",
    clientName: "Workspace: J. van der Berg",
    tabMessages: "Messages",
    tabDossiers: "Dossiers",
    tabDownloads: "Downloads",
    message1From: "Mr. De Vries",
    message1Text: "The signed agreement has been uploaded to your dossier.",
    message1Time: "14:23",
    message2From: "J. van der Berg",
    message2Text: "Thank you, I will review and sign today.",
    message2Time: "14:31",
    dossier1: "Purchase Agreement 2024",
    dossier1Files: "3 files",
    dossier2: "Identity Documents",
    dossier2Files: "2 files",
    verified: "Identity Verified",
    encrypted: "End-to-End Encrypted",
  },
  nl: {
    badge: "Verified Identity Feature",
    title: "Uw Eigen Klantwerkruimte",
    subtitle: "Een Veilige Digitale Kluis per Cliënt",
    description: "Geef elke cliënt een eigen versleutelde werkruimte met berichtenverkeer, dossierbeheer en juridisch geldig downloadbewijs. Geen account nodig voor uw cliënten.",
    workspaceTitle: "De Vries Advocaten",
    clientName: "Werkruimte: J. van der Berg",
    tabMessages: "Berichten",
    tabDossiers: "Dossiers",
    tabDownloads: "Downloads",
    message1From: "Mr. De Vries",
    message1Text: "De getekende overeenkomst is geüpload naar uw dossier.",
    message1Time: "14:23",
    message2From: "J. van der Berg",
    message2Text: "Dank u, ik zal het vandaag bekijken en ondertekenen.",
    message2Time: "14:31",
    dossier1: "Koopovereenkomst 2024",
    dossier1Files: "3 bestanden",
    dossier2: "Identiteitsdocumenten",
    dossier2Files: "2 bestanden",
    verified: "Identiteit Geverifieerd",
    encrypted: "End-to-End Versleuteld",
  },
};

export const ClientWorkspaceSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const { language } = useLanguage();

  const advantages = getAdvantages(language);
  const content = sectionContent[language];

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 bg-muted/30 overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-16 scroll-animate ${isVisible ? 'is-visible' : ''}`}>
          <Badge variant="secondary" className="mb-4 bg-amber-50 text-amber-700 border-amber-200 px-4 py-1.5">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            {content.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            {content.title}
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight text-primary">
            {content.subtitle}
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Visual mockup */}
          <div className={`relative scroll-animate-left ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            {/* Browser frame */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-background">
              {/* Browser chrome */}
              <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-cta" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-background border border-border text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-cta" />
                    workspace.devries-advocaten.nl
                  </div>
                </div>
              </div>

              {/* Workspace content */}
              <div className="bg-background">
                {/* Workspace header */}
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{content.workspaceTitle}</p>
                      <p className="text-xs text-muted-foreground">{content.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cta/10 border border-cta/20">
                    <CheckCircle2 className="h-3 w-3 text-cta" />
                    <span className="text-[10px] font-medium text-cta">{content.verified}</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border">
                  <button className="px-4 py-2.5 text-xs font-medium text-primary border-b-2 border-primary">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="h-3 w-3" />
                      {content.tabMessages}
                    </span>
                  </button>
                  <button className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <FolderOpen className="h-3 w-3" />
                      {content.tabDossiers}
                    </span>
                  </button>
                  <button className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Download className="h-3 w-3" />
                      {content.tabDownloads}
                    </span>
                  </button>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-3 min-h-[200px]">
                  {/* Sender message */}
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-primary">DV</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">{content.message1From}</span>
                        <span className="text-[10px] text-muted-foreground">{content.message1Time}</span>
                      </div>
                      <div className="bg-primary/5 border border-primary/10 rounded-lg rounded-tl-none px-3 py-2">
                        <p className="text-xs text-foreground">{content.message1Text}</p>
                      </div>
                      {/* Attached dossier */}
                      <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50 border border-border">
                        <FolderOpen className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-medium">{content.dossier1}</span>
                        <span className="text-[10px] text-muted-foreground">• {content.dossier1Files}</span>
                      </div>
                    </div>
                  </div>

                  {/* Client reply */}
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-cta/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-cta">JB</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">{content.message2From}</span>
                        <span className="text-[10px] text-muted-foreground">{content.message2Time}</span>
                        <Eye className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="bg-muted/50 border border-border rounded-lg rounded-tl-none px-3 py-2">
                        <p className="text-xs text-foreground">{content.message2Text}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dossiers preview */}
                  <div className="mt-2 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{content.tabDossiers}</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                            <FileText className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-[11px] font-medium">{content.dossier1}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{content.dossier1Files}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                            <UserCheck className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-[11px] font-medium">{content.dossier2}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{content.dossier2Files}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer security bar */}
                <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-cta font-medium">
                    <Lock className="h-3 w-3" />
                    {content.encrypted}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div
              className={`absolute -left-4 top-1/4 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-lg transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{language === 'nl' ? 'Realtime Chat' : 'Realtime Chat'}</span>
            </div>

            <div
              className={`absolute -right-4 top-1/2 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-lg transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <Download className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{language === 'nl' ? 'Downloadbewijs' : 'Download Proof'}</span>
            </div>

            <div
              className={`absolute -left-4 bottom-1/4 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-cta/10 border border-cta/30 shadow-lg transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <UserCheck className="h-4 w-4 text-cta" />
              <span className="text-sm font-medium text-cta">{language === 'nl' ? 'ID Geverifieerd' : 'ID Verified'}</span>
            </div>
          </div>

          {/* Right: Advantages */}
          <div className={`space-y-8 scroll-animate-right ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            <div className={`space-y-4 stagger-children ${isVisible ? 'is-visible' : ''}`}>
              {advantages.map((advantage) => (
                <div
                  key={advantage.title}
                  className="flex gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors shadow-sm"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <advantage.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{advantage.title}</h4>
                    <p className="text-sm text-muted-foreground">{advantage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
