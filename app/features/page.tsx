import { Shield, Server, Lock, Zap, Globe, Building2, Scale, Stethoscope, GraduationCap, Landmark, Factory, FileCheck, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const securityFeatures = [
  {
    icon: Shield,
    title: "ISO 27001 Certified",
    description: "Industry-leading security certifications for information security management. Audited annually by independent certification bodies."
  },
  {
    icon: Lock,
    title: "Military-Grade Encryption",
    description: "AES-256 encryption algorithm - the same standard used by governmental organizations. Your files are encrypted at rest and in transit."
  },
  {
    icon: Server,
    title: "Triple Data Replication",
    description: "Your data is automatically replicated across 3 geographically distributed EU data centers. Daily backups ensure you never lose a file."
  },
  {
    icon: Zap,
    title: "Anti-Ransomware Protection",
    description: "WORM (Write Once Read Many) backup technology protects against ransomware attacks. Your data remains safe even if your systems are compromised."
  }
];

const complianceFeatures = [
  {
    icon: Globe,
    title: "100% EU Data Sovereignty",
    description: "All data is stored exclusively in EU data centers. Zero exposure to US CLOUD Act or other foreign government data requests."
  },
  {
    icon: FileCheck,
    title: "GDPR Compliant",
    description: "Fully compliant with European General Data Protection Regulation. Your privacy rights are legally protected."
  },
  {
    icon: Lock,
    title: "Zero-Knowledge Architecture",
    description: "We can't read your files even if we wanted to. Your encryption keys never leave your device."
  },
  {
    icon: Users,
    title: "No Third-Party Access",
    description: "100% independent from big tech. No government, company, or marketing program will ever access your data."
  }
];

const industries = [
  {
    icon: Stethoscope,
    title: "Healthcare & Hospitals",
    description: "Share medical records, imaging files, and lab results securely between departments and external specialists.",
    useCases: ["Patient record transfers", "Medical imaging", "Lab result sharing"]
  },
  {
    icon: Scale,
    title: "Law Firms & Legal",
    description: "Attorney-client privilege protected with end-to-end encryption. Share case files and contracts securely.",
    useCases: ["Client case files", "Contract documents", "Court submissions"]
  },
  {
    icon: Landmark,
    title: "Government & Public Sector",
    description: "EU data sovereignty ensures compliance with public sector data protection requirements.",
    useCases: ["Citizen documents", "Inter-agency transfers", "Confidential reports"]
  },
  {
    icon: Building2,
    title: "Financial Services",
    description: "Meet stringent financial industry regulations with ISO 27001 certified infrastructure.",
    useCases: ["Financial statements", "Audit documents", "Regulatory filings"]
  },
  {
    icon: GraduationCap,
    title: "Education & Research",
    description: "Protect research data and student information. Share large datasets securely across institutions.",
    useCases: ["Research datasets", "Student records", "Collaborative projects"]
  },
  {
    icon: Factory,
    title: "Manufacturing & R&D",
    description: "Protect intellectual property and trade secrets. Share CAD files and technical specs with partners.",
    useCases: ["CAD/CAM files", "Technical specifications", "Product designs"]
  }
];

const certifications = [
  { name: "ISO 27001", description: "Information Security" },
  { name: "SOC 2", description: "Data Security" },
  { name: "GDPR", description: "EU Data Protection" },
  { name: "SSL/TLS", description: "Encrypted Transfer" }
];

const Features = () => {
  return (
    <main className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3 opacity-0 animate-fade-in-up">
              Enterprise-Grade Security
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Security & Compliance
              <span className="block text-primary">Built for Europe</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Transfer files up to 100GB with military-grade encryption and EU data sovereignty. 
              ISO 27001 certified infrastructure trusted by healthcare, legal, and government sectors.
            </p>
          </div>

          {/* Certification Badges */}
          <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {certifications.map((cert) => (
              <div 
                key={cert.name}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-semibold text-sm">{cert.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{cert.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3">
              Security
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Enterprise-grade protection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your most sensitive files deserve the best security.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {securityFeatures.map((feature, index) => (
              <Card 
                key={feature.title}
                className="p-8 bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Features */}
      <section className="py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3">
              Compliance
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Privacy & data sovereignty
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              100% EU-based. Zero compromises on data sovereignty.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {complianceFeatures.map((feature) => (
              <Card 
                key={feature.title}
                className="p-8 bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3">
              Industry Solutions
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Trusted by regulated industries
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              When data security isn't optional. Transfer Guard serves organizations where 
              confidentiality and compliance are business-critical.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <Card 
                key={industry.title}
                className="p-8 bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group h-full"
              >
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 w-fit mb-6">
                  <industry.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">{industry.title}</h3>
                <p className="text-muted-foreground mb-4">{industry.description}</p>
                <div className="mt-auto">
                  <p className="text-xs font-medium mb-2">Common use cases:</p>
                  <div className="flex flex-wrap gap-2">
                    {industry.useCases.map((useCase) => (
                      <span 
                        key={useCase}
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
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
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 h-auto hover:bg-muted/50">
              <Link href="/#pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Features;