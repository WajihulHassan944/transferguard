'use client';
import { Clock, Hash, Globe, Monitor, FileCheck, Fingerprint, Stethoscope, GraduationCap, Landmark, Factory, Building2, CheckCircle2, ArrowRight, Receipt, MapPin, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BurdenOfProofSection } from "@/components/greensecure/BurdenOfProofSection";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

const getContent = (language: string) => {
  const lang = language as 'en' | 'nl';
  
  return {
    hero: {
      badge: {
        en: "Registered File Transfer",
        nl: "Aangetekend Digitaal Versturen",
      },
      title1: {
        en: "Proof of Delivery",
        nl: "Bewijs van Ontvangst",
      },
      title2: {
        en: "For Every Transfer",
        nl: "Voor Elke Overdracht",
      },
      subtitle: {
        en: "When your recipient downloads, you receive a complete delivery report with timestamp, file hash, IP address, device info, and OS. Court-admissible evidence for every file transfer.",
        nl: "Wanneer uw ontvanger downloadt, ontvangt u een volledig leveringsrapport met tijdstempel, bestandshash, IP-adres, apparaatinfo en OS. Rechtsgeldige bewijslast voor elke bestandsoverdracht.",
      },
    },
    certifications: [
      { name: "ISO 27001", description: { en: "Information Security", nl: "Informatiebeveiliging" } },
      { name: "GDPR", description: { en: "EU Data Protection", nl: "EU Gegevensbescherming" } },
      { name: "SSL/TLS", description: { en: "Encrypted Transfer", nl: "Versleutelde Overdracht" } },
    ],
    proofSection: {
      badge: {
        en: "Complete Delivery Proof",
        nl: "Volledig Leveringsbewijs",
      },
      title: {
        en: "Court-admissible evidence",
        nl: "Rechtsgeldige bewijslast",
      },
      subtitle: {
        en: "Every download generates a complete proof package: technical data for transparency, legal certification for court validity.",
        nl: "Elke download genereert een volledig bewijspakket: technische data voor transparantie, juridische certificering voor rechtsgeldigheid.",
      },
      technicalBadge: {
        en: "Technical Proof",
        nl: "Technisch Bewijs",
      },
      legalBadge: {
        en: "Legal Certification",
        nl: "Juridische Certificering",
      },
    },
    proofFeatures: [
      {
        icon: Clock,
        title: { en: "Exact Timestamp", nl: "Exacte Tijdstempel" },
        description: { en: "Precise date and time when the recipient downloaded your files. Legally valid proof of the delivery moment.", nl: "Exacte datum en tijd waarop de ontvanger uw bestanden heeft gedownload. Juridisch geldig bewijs van het leveringsmoment." },
        category: "technical",
      },
      {
        icon: Hash,
        title: { en: "File Hash Verification", nl: "Bestandshash Verificatie" },
        description: { en: "SHA-256 cryptographic hash proves the exact file content delivered. Tamper-proof evidence of what was sent.", nl: "SHA-256 cryptografische hash bewijst de exacte bestandsinhoud die is geleverd. Onweerlegbaar bewijs van wat is verzonden." },
        category: "technical",
      },
      {
        icon: MapPin,
        title: { en: "IP Address & Location", nl: "IP-adres & Locatie" },
        description: { en: "The IP address and geographic location of the recipient at the moment of download.", nl: "Het IP-adres en de geografische locatie van de ontvanger op het moment van downloaden." },
        category: "technical",
      },
      {
        icon: Monitor,
        title: { en: "Device & OS Information", nl: "Apparaat & OS Informatie" },
        description: { en: "Complete device details including browser, OS version, and device model. Full technical fingerprint.", nl: "Volledige apparaatgegevens inclusief browser, OS-versie en apparaatmodel. Complete technische vingerafdruk." },
        category: "technical",
      },
      {
        icon: Receipt,
        title: { en: "PDF Delivery Certificate", nl: "PDF Leveringscertificaat" },
        description: { en: "Automatic legally-sealed PDF certificate with every download. Court-admissible proof you can store and present.", nl: "Automatisch juridisch verzegeld PDF-certificaat bij elke download. Rechtsgeldige bewijslast die u kunt bewaren en presenteren." },
        category: "legal",
      },
      {
        icon: Fingerprint,
        title: { en: "Biometric ID Verification", nl: "Biometrische ID-verificatie" },
        description: { en: "Recipient verifies identity with government ID + biometric selfie. Proof of exactly who received your documents.", nl: "Ontvanger verifieert identiteit met officieel ID + biometrische selfie. Bewijs van exact wie uw documenten heeft ontvangen." },
        category: "legal",
      },
      {
        icon: Scale,
        title: { en: "Two-Factor Verification", nl: "Tweefactor Verificatie" },
        description: { en: "Ensures only the intended recipient can access files. Enhanced security for sensitive transfers.", nl: "Zorgt ervoor dat alleen de beoogde ontvanger toegang heeft tot bestanden. Verhoogde beveiliging voor gevoelige overdrachten." },
        category: "legal",
      },
      {
        icon: FileCheck,
        title: { en: "Complete Audit Trail", nl: "Volledige Audit Trail" },
        description: { en: "Full history of all transfer events: sent, viewed, downloaded, expired. Immutable compliance log.", nl: "Volledige geschiedenis van alle overdrachtsgebeurtenissen: verzonden, bekeken, gedownload, verlopen. Onveranderlijk compliance-logboek." },
        category: "legal",
      },
    ],
    identitySection: {
      badge: {
        en: "Legal Plan Exclusive",
        nl: "Legal Abonnement Exclusief",
      },
      title: {
        en: "Identity-Verified Delivery",
        nl: "Identiteitsgeverifieerde Levering",
      },
      subtitle: {
        en: "When legal certainty matters, verify exactly who received your documents with biometric identity verification.",
        nl: "Wanneer juridische zekerheid telt, verifieer exact wie uw documenten heeft ontvangen met biometrische identiteitsverificatie.",
      },
      howItWorks: {
        title: { en: "How It Works", nl: "Hoe Het Werkt" },
        subtitle: { en: "Biometric identity verification", nl: "Biometrische identiteitsverificatie" },
        description: {
          en: "Before accessing your files, the recipient must complete a <strong class=\"text-foreground\">biometric identity verification</strong>. This process captures their government-issued ID and a live selfie to confirm their identity.",
          nl: "Voordat de ontvanger toegang krijgt tot uw bestanden, moet deze een <strong class=\"text-foreground\">biometrische identiteitsverificatie</strong> voltooien. Dit proces legt het officiële identiteitsbewijs en een live selfie vast om de identiteit te bevestigen.",
        },
        processTitle: { en: "The verification process:", nl: "Het verificatieproces:" },
        steps: [
          { en: "Government ID document scan (passport, ID card, driver's license)", nl: "Scan van officieel identiteitsbewijs (paspoort, ID-kaart, rijbewijs)" },
          { en: "Live biometric selfie with liveness detection", nl: "Live biometrische selfie met liveness-detectie" },
          { en: "Automatic face matching between ID and selfie", nl: "Automatische gezichtsherkenning tussen ID en selfie" },
        ],
      },
      evidencePackage: {
        title: { en: "Your Evidence Package", nl: "Uw Bewijspakket" },
        subtitle: { en: "Complete non-repudiation proof", nl: "Volledig onweerlegbaar bewijs" },
        badge: { en: "Legal Gold Standard", nl: "Juridische Gouden Standaard" },
        description: {
          en: "When identity verification is complete, you receive a comprehensive <strong class=\"text-foreground\">evidence package</strong> that proves exactly who received your documents and when.",
          nl: "Wanneer de identiteitsverificatie is voltooid, ontvangt u een uitgebreid <strong class=\"text-foreground\">bewijspakket</strong> dat exact bewijst wie uw documenten heeft ontvangen en wanneer.",
        },
        capturedTitle: { en: "Captured evidence:", nl: "Vastgelegd bewijs:" },
        evidence: [
          { en: "Verified recipient name and ID document details", nl: "Geverifieerde naam ontvanger en ID-documentgegevens" },
          { en: "Cryptographic timestamp of verification moment", nl: "Cryptografische tijdstempel van verificatiemoment" },
          { en: "IP address, device fingerprint, browser & OS", nl: "IP-adres, apparaat-vingerafdruk, browser & OS" },
          { en: "SHA-256 hash of delivered file contents", nl: "SHA-256 hash van geleverde bestandsinhoud" },
        ],
      },
      legalNote: {
        label: { en: "Legal standing:", nl: "Juridische waarde:" },
        text: {
          en: "This evidence package provides strong circumstantial proof for civil proceedings. The combination of verified identity, cryptographic timestamps, and file hashes creates a robust chain of evidence that is difficult to refute.",
          nl: "Dit bewijspakket biedt sterke indirecte bewijslast voor civiele procedures. De combinatie van geverifieerde identiteit, cryptografische tijdstempels en bestandshashes creëert een robuuste bewijsketen die moeilijk te weerleggen is.",
        },
      },
    },
    industries: {
      badge: { en: "Industry Solutions", nl: "Brancheoplossingen" },
      title: { en: "Trusted by regulated industries", nl: "Vertrouwd door gereguleerde sectoren" },
      subtitle: {
        en: "When data security isn't optional. Transfer Guard serves organizations where confidentiality and compliance are business-critical.",
        nl: "Wanneer gegevensbeveiliging geen optie is. Transfer Guard bedient organisaties waar vertrouwelijkheid en compliance bedrijfskritisch zijn.",
      },
      useCasesLabel: { en: "Use cases:", nl: "Toepassingen:" },
      items: [
        {
          icon: Stethoscope,
          title: { en: "Healthcare & Hospitals", nl: "Gezondheidszorg & Ziekenhuizen" },
          description: { en: "Share medical records, imaging files, and lab results securely between departments and external specialists.", nl: "Deel medische dossiers, beeldvormingsbestanden en laboratoriumresultaten veilig tussen afdelingen en externe specialisten." },
          useCases: [
            { en: "Patient record transfers", nl: "Patiëntdossier overdrachten" },
            { en: "Medical imaging", nl: "Medische beeldvorming" },
            { en: "Lab result sharing", nl: "Labresultaten delen" },
          ],
        },
        {
          icon: Scale,
          title: { en: "Law Firms & Legal", nl: "Advocatenkantoren & Juridisch" },
          description: { en: "Attorney-client privilege protected with end-to-end encryption. Share case files and contracts securely.", nl: "Advocaat-cliënt privilege beschermd met end-to-end encryptie. Deel processtukken en contracten veilig." },
          useCases: [
            { en: "Client case files", nl: "Cliënt dossiers" },
            { en: "Contract documents", nl: "Contractdocumenten" },
            { en: "Court submissions", nl: "Gerechtelijke stukken" },
          ],
        },
        {
          icon: Landmark,
          title: { en: "Government & Public Sector", nl: "Overheid & Publieke Sector" },
          description: { en: "EU data sovereignty ensures compliance with public sector data protection requirements.", nl: "EU data-soevereiniteit zorgt voor compliance met gegevensbeschermingsvereisten voor de publieke sector." },
          useCases: [
            { en: "Citizen documents", nl: "Burgerdocumenten" },
            { en: "Inter-agency transfers", nl: "Overdrachten tussen instanties" },
            { en: "Confidential reports", nl: "Vertrouwelijke rapporten" },
          ],
        },
        {
          icon: Building2,
          title: { en: "Financial Services", nl: "Financiële Dienstverlening" },
          description: { en: "Meet stringent financial industry regulations with ISO 27001 certified infrastructure.", nl: "Voldoe aan strenge financiële regelgeving met ISO 27001 gecertificeerde infrastructuur." },
          useCases: [
            { en: "Financial statements", nl: "Financiële overzichten" },
            { en: "Audit documents", nl: "Auditdocumenten" },
            { en: "Regulatory filings", nl: "Regelgevende dossiers" },
          ],
        },
        {
          icon: GraduationCap,
          title: { en: "Education & Research", nl: "Onderwijs & Onderzoek" },
          description: { en: "Protect research data and student information. Share large datasets securely across institutions.", nl: "Bescherm onderzoeksdata en studentinformatie. Deel grote datasets veilig tussen instellingen." },
          useCases: [
            { en: "Research datasets", nl: "Onderzoeksdatasets" },
            { en: "Student records", nl: "Studentendossiers" },
            { en: "Collaborative projects", nl: "Samenwerkingsprojecten" },
          ],
        },
        {
          icon: Factory,
          title: { en: "Manufacturing & R&D", nl: "Productie & R&D" },
          description: { en: "Protect intellectual property and trade secrets. Share CAD files and technical specs with partners.", nl: "Bescherm intellectueel eigendom en bedrijfsgeheimen. Deel CAD-bestanden en technische specificaties met partners." },
          useCases: [
            { en: "CAD/CAM files", nl: "CAD/CAM-bestanden" },
            { en: "Technical specifications", nl: "Technische specificaties" },
            { en: "Product designs", nl: "Productontwerpen" },
          ],
        },
      ],
    },
    cta: {
      title: { en: "Ready to secure your file transfers?", nl: "Klaar om uw bestandsoverdrachten te beveiligen?" },
      subtitle: { en: "Start your 14-day free trial today. Cancel anytime during trial.", nl: "Start vandaag nog uw 14-daagse gratis proefperiode. Altijd opzegbaar tijdens de proefperiode." },
      primaryButton: { en: "Start Free Trial", nl: "Start Gratis Proefperiode" },
      secondaryButton: { en: "View Pricing", nl: "Bekijk Tarieven" },
    },
  };
};

const Features = () => {
  const { language } = useLanguage();
  const content = getContent(language);
  const lang = language as 'en' | 'nl';

  return (
    <main className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3 opacity-0 animate-fade-in-up">
              {content.hero.badge[lang]}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight opacity-0 animate-fade-in-up" style={{
              animationDelay: "0.1s"
            }}>
              {content.hero.title1[lang]}
              <span className="block text-primary">{content.hero.title2[lang]}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto opacity-0 animate-fade-in-up" style={{
              animationDelay: "0.2s"
            }}>
              {content.hero.subtitle[lang]}
            </p>
          </div>

          {/* Certification Badges */}
          <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in-up" style={{
            animationDelay: "0.3s"
          }}>
            {content.certifications.map(cert => (
              <div key={cert.name} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-semibold text-sm">{cert.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{cert.description[lang]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Combined Proof Features */}
      <section className="py-24 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3">
              {content.proofSection.badge[lang]}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {content.proofSection.title[lang]}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.proofSection.subtitle[lang]}
            </p>
          </div>
          
          {/* Technical Proof */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest px-4 py-2 rounded-full bg-primary/5 border border-primary/20">{content.proofSection.technicalBadge[lang]}</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {content.proofFeatures.filter(f => f.category === "technical").map((feature, index) => (
                <div 
                  key={feature.title[lang]} 
                  className="group relative p-6 rounded-2xl bg-background/60 backdrop-blur-sm border border-primary/10 hover:border-primary/30 hover:bg-background/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-500">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors duration-300">{feature.title[lang]}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Certification */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest px-4 py-2 rounded-full bg-amber-500/5 border border-amber-500/20">{content.proofSection.legalBadge[lang]}</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {content.proofFeatures.filter(f => f.category === "legal").map((feature, index) => (
                <div 
                  key={feature.title[lang]} 
                  className="group relative p-6 rounded-2xl bg-background/60 backdrop-blur-sm border border-amber-500/10 hover:border-amber-500/30 hover:bg-background/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all duration-500">
                      <feature.icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-base mb-2 group-hover:text-amber-600 transition-colors duration-300">{feature.title[lang]}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Identity Verification Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3">
              {content.identitySection.badge[lang]}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {content.identitySection.title[lang]}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {content.identitySection.subtitle[lang]}
            </p>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2 items-stretch">
            {/* How it works Card */}
            <Card className="p-8 bg-background border border-border rounded-2xl shadow-sm">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="p-4 rounded-xl bg-amber-500/10">
                  <Fingerprint className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl">{content.identitySection.howItWorks.title[lang]}</h3>
                  <p className="text-sm text-muted-foreground">{content.identitySection.howItWorks.subtitle[lang]}</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6" dangerouslySetInnerHTML={{ __html: content.identitySection.howItWorks.description[lang] }} />
              
              <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-5 border-l-4 border-amber-500">
                <p className="font-semibold mb-3 text-foreground">{content.identitySection.howItWorks.processTitle[lang]}</p>
                <ul className="space-y-3">
                  {content.identitySection.howItWorks.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{step[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Evidence Package Card */}
            <Card className="p-8 bg-background border border-amber-500/30 rounded-2xl shadow-sm relative">
              {/* Legal Gold Standard Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                  <Scale className="h-3.5 w-3.5" />
                  {content.identitySection.evidencePackage.badge[lang]}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-amber-500/20">
                <div className="p-4 rounded-xl bg-amber-500/10">
                  <FileCheck className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl">{content.identitySection.evidencePackage.title[lang]}</h3>
                  <p className="text-sm text-muted-foreground">{content.identitySection.evidencePackage.subtitle[lang]}</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6" dangerouslySetInnerHTML={{ __html: content.identitySection.evidencePackage.description[lang] }} />
              
              <div className="bg-primary/5 rounded-xl p-5 border-l-4 border-primary">
                <p className="font-semibold mb-3 text-foreground">{content.identitySection.evidencePackage.capturedTitle[lang]}</p>
                <ul className="space-y-3">
                  {content.identitySection.evidencePackage.evidence.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* Legal note */}
          <div className="mt-10 p-5 bg-background rounded-xl border border-border text-center">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{content.identitySection.legalNote.label[lang]}</strong> {content.identitySection.legalNote.text[lang]}
            </p>
          </div>
        </div>
      </section>

      {/* Burden of Proof Section */}
      <BurdenOfProofSection />

      <section className="py-12 px-4 bg-muted/20">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-2">
              {content.industries.badge[lang]}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
              {content.industries.title[lang]}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              {content.industries.subtitle[lang]}
            </p>
          </div>
          
          <div className="relative px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 10000,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {content.industries.items.map(industry => (
                  <CarouselItem key={industry.title[lang]} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <Card className="p-4 bg-background border border-border hover:border-primary/20 transition-all duration-200 h-full">
                      <div className="p-2 rounded-lg bg-primary/10 w-fit mb-3">
                        <industry.icon className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1.5">{industry.title[lang]}</h3>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed line-clamp-2">{industry.description[lang]}</p>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">{content.industries.useCasesLabel[lang]}</p>
                        <div className="flex flex-wrap gap-1">
                          {industry.useCases.slice(0, 2).map(useCase => (
                            <span key={useCase[lang]} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              {useCase[lang]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {content.cta.title[lang]}
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            {content.cta.subtitle[lang]}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6 h-auto group bg-cta hover:bg-cta/90">
              <Link href="/signup/pro">
                {content.cta.primaryButton[lang]}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 h-auto border-2 border-border hover:bg-muted/50 hover:border-primary/30">
              <Link href="/#pricing">{content.cta.secondaryButton[lang]}</Link>
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Features;
