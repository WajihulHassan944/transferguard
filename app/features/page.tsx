import { Clock, Hash, Globe, Monitor, FileCheck, Scale, Stethoscope, GraduationCap, Landmark, Factory, Building2, CheckCircle2, ArrowRight, Receipt, Fingerprint, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BurdenOfProofSection } from "@/components/greensecure/BurdenOfProofSection";
import Link from "next/link";

// Combined proof features - technical + legal evidence for every download
const proofFeatures = [{
  icon: Clock,
  title: "Exact Timestamp",
  description: "Precise date and time when the recipient downloaded your files. Legally valid proof of the delivery moment.",
  category: "technical"
}, {
  icon: Hash,
  title: "File Hash Verification",
  description: "SHA-256 cryptographic hash proves the exact file content delivered. Tamper-proof evidence of what was sent.",
  category: "technical"
}, {
  icon: MapPin,
  title: "IP Address & Location",
  description: "The IP address and geographic location of the recipient at the moment of download.",
  category: "technical"
}, {
  icon: Monitor,
  title: "Device & OS Information",
  description: "Complete device details including browser, OS version, and device model. Full technical fingerprint.",
  category: "technical"
}, {
  icon: Receipt,
  title: "PDF Delivery Certificate",
  description: "Automatic legally-sealed PDF certificate with every download. Court-admissible proof you can store and present.",
  category: "legal"
}, {
  icon: Scale,
  title: "eIDAS QERDS Qualified",
  description: "EU-certified qualified electronic registered delivery. Same legal status as physical registered mail.",
  category: "legal"
}, {
  icon: Fingerprint,
  title: "Two-Factor Verification",
  description: "Ensures only the intended recipient can access files. Enhanced security for sensitive transfers.",
  category: "legal"
}, {
  icon: FileCheck,
  title: "Complete Audit Trail",
  description: "Full history of all transfer events: sent, viewed, downloaded, expired. Immutable compliance log.",
  category: "legal"
}];
const industries = [{
  icon: Stethoscope,
  title: "Healthcare & Hospitals",
  description: "Share medical records, imaging files, and lab results securely between departments and external specialists.",
  useCases: ["Patient record transfers", "Medical imaging", "Lab result sharing"]
}, {
  icon: Scale,
  title: "Law Firms & Legal",
  description: "Attorney-client privilege protected with end-to-end encryption. Share case files and contracts securely.",
  useCases: ["Client case files", "Contract documents", "Court submissions"]
}, {
  icon: Landmark,
  title: "Government & Public Sector",
  description: "EU data sovereignty ensures compliance with public sector data protection requirements.",
  useCases: ["Citizen documents", "Inter-agency transfers", "Confidential reports"]
}, {
  icon: Building2,
  title: "Financial Services",
  description: "Meet stringent financial industry regulations with ISO 27001 certified infrastructure.",
  useCases: ["Financial statements", "Audit documents", "Regulatory filings"]
}, {
  icon: GraduationCap,
  title: "Education & Research",
  description: "Protect research data and student information. Share large datasets securely across institutions.",
  useCases: ["Research datasets", "Student records", "Collaborative projects"]
}, {
  icon: Factory,
  title: "Manufacturing & R&D",
  description: "Protect intellectual property and trade secrets. Share CAD files and technical specs with partners.",
  useCases: ["CAD/CAM files", "Technical specifications", "Product designs"]
}];
const certifications = [{
  name: "ISO 27001",
  description: "Information Security"
}, {
  name: "SOC 2",
  description: "Data Security"
}, {
  name: "GDPR",
  description: "EU Data Protection"
}, {
  name: "SSL/TLS",
  description: "Encrypted Transfer"
}];
const Features = () => {
  return <main className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3 opacity-0 animate-fade-in-up">
              Registered File Transfer
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight opacity-0 animate-fade-in-up" style={{
            animationDelay: "0.1s"
          }}>
              Proof of Delivery
              <span className="block text-primary">For Every Transfer</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto opacity-0 animate-fade-in-up" style={{
            animationDelay: "0.2s"
          }}>When your recipient downloads, you receive a complete delivery report with timestamp, file hash, IP address, device info, and OS. Court-admissible evidence for every file transfer.</p>
          </div>

          {/* Certification Badges */}
          <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in-up" style={{
          animationDelay: "0.3s"
        }}>
            {certifications.map(cert => <div key={cert.name} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-semibold text-sm">{cert.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{cert.description}</span>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Combined Proof Features */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3">
              Complete Delivery Proof
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Court-admissible evidence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every download generates a complete proof package: technical data for transparency, legal certification for court validity.
            </p>
          </div>
          
          {/* Technical Proof */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Technical Proof</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {proofFeatures.filter(f => f.category === "technical").map((feature) => (
                <Card key={feature.title} className="p-6 bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 w-fit mb-4">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Legal Certification */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-medium text-amber-600 uppercase tracking-wide">Legal Certification</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {proofFeatures.filter(f => f.category === "legal").map((feature) => (
                <Card key={feature.title} className="p-6 bg-background border border-amber-500/20 hover:border-amber-500/40 hover:shadow-lg transition-all duration-300 group">
                  <div className="p-3 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-300 w-fit mb-4">
                    <feature.icon className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* eIDAS & QERDS Section - Clean Design */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3">
              EU Legislation
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              What is eIDAS & QERDS?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              European legislation that gives digital registered delivery the same legal status as physical registered mail.
            </p>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2 items-stretch">
            {/* eIDAS Card */}
            <Card className="p-8 bg-background border border-border rounded-2xl shadow-sm">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="p-4 rounded-xl bg-primary/10">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl">eIDAS</h3>
                  <p className="text-sm text-muted-foreground">Electronic Identification and Trust Services</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                <strong className="text-foreground">eIDAS</strong> is a 2014 EU regulation that provides a legal framework for electronic identification and trust services within the European Union.
              </p>
              
              <div className="bg-primary/5 rounded-xl p-5 border-l-4 border-primary">
                <p className="font-semibold mb-3 text-foreground">What does this mean for you?</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Legal validity in all 27 EU member states</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Electronic signatures have the same value as handwritten ones</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Certified trust services are recognized by courts</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* QERDS Card */}
            <Card className="p-8 bg-background border border-amber-500/30 rounded-2xl shadow-sm relative">
              {/* Legal Gold Standard Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                  <Scale className="h-3.5 w-3.5" />
                  Legal Gold Standard
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-amber-500/20">
                <div className="p-4 rounded-xl bg-amber-500/10">
                  <Scale className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl">QERDS</h3>
                  <p className="text-sm text-muted-foreground">Qualified Electronic Registered Delivery Service</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                <strong className="text-foreground">QERDS</strong> is the highest level of electronic registered delivery under eIDAS. It is the digital equivalent of physical registered mail.
              </p>
              
              <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-5 border-l-4 border-amber-500">
                <p className="font-semibold mb-3 text-foreground">Legal guarantees:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Proof of sending and receipt with exact timestamps</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Integrity guarantee: proof that content was not modified</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Burden of proof in court: counts as legal evidence</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Legal note */}
          <div className="mt-10 p-5 bg-background rounded-xl border border-border text-center">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Legal basis:</strong> Regulation (EU) No. 910/2014 of the European Parliament and of the Council on electronic identification and trust services for electronic transactions in the internal market (eIDAS Regulation).
            </p>
          </div>
        </div>
      </section>

      {/* Burden of Proof Section */}
      <BurdenOfProofSection />

      <section className="py-16 px-4 bg-muted/20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-2">
              Industry Solutions
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              Trusted by regulated industries
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              When data security isn't optional. Transfer Guard serves organizations where 
              confidentiality and compliance are business-critical.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {industries.map(industry => (
              <Card key={industry.title} className="p-5 bg-background border border-border hover:border-primary/20 transition-all duration-200 group">
                <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-4">
                  <industry.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-base mb-2">{industry.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{industry.description}</p>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Common use cases:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {industry.useCases.map(useCase => (
                      <span key={useCase} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to secure your file transfers?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Start your 14-day free trial today. Cancel anytime during trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6 h-auto group bg-cta hover:bg-cta/90">
              <Link href="/signup/pro">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 h-auto border-2 border-border hover:bg-muted/50 hover:border-primary/30">
              <Link href="/#pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

    </main>;
};
export default Features;