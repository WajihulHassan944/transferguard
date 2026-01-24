import { Shield, Lock, Heart, Users, Eye, Server, Globe, ArrowRight, CircleDollarSign, Bot, ShieldOff, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const dataPromises = [
  {
    icon: CircleDollarSign,
    title: "We will never sell your data",
    highlight: "never sell",
    description: "Your files and metadata are not for sale. Not now, not ever.",
    color: "primary",
  },
  {
    icon: Bot,
    title: "We will never train AI on your files",
    highlight: "never train AI",
    description: "Your documents, photos, and files are yours alone.",
    color: "amber",
  },
  {
    icon: ShieldOff,
    title: "No US Cloud Act Risk",
    highlight: "No US Cloud Act",
    description: "Unlike US providers (Dropbox, WeTransfer), we are not subject to the US Cloud Act. Your data remains strictly under European law.",
    color: "primary",
  },
  {
    icon: BookOpen,
    title: "We will always be transparent",
    highlight: "always be transparent",
    description: "If our policies change, you'll be the first to know.",
    color: "amber",
  },
];

const coreValues = [
  {
    icon: Shield,
    title: "Proof of Delivery",
    description: "We provide legally binding proof that your documents were delivered and received. Essential for contracts, legal notices, and compliance requirements."
  },
  {
    icon: Lock,
    title: "Secure by Default",
    description: "End-to-end encryption ensures your files are protected from upload to download. Only you and your intended recipient can access the content."
  },
  {
    icon: Server,
    title: "EU Infrastructure",
    description: "All data is processed and stored exclusively within ISO 27001 certified EU data centers, protected by GDPR and European privacy regulations."
  },
  {
    icon: Users,
    title: "Built for Professionals",
    description: "Designed for law firms, notaries, healthcare providers, and businesses that need verifiable proof of document delivery."
  },
  {
    icon: Eye,
    title: "Privacy First",
    description: "Your files are never scanned, analyzed, or used for any purpose other than secure delivery. We respect your data privacy."
  },
  {
    icon: Globe,
    title: "Independent & Trusted",
    description: "We are a fully independent European company. No big tech affiliations, no data mining, no compromises on your security."
  }
];

const stats = [
  { value: "100%", label: "EU Data Storage" },
  { value: "eIDAS", label: "QERDS Compliant" },
  { value: "ISO 27001", label: "Certified Infra" },
  { value: "AES-256", label: "Encryption" }
];

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container max-w-4xl mx-auto text-center">
          <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3 opacity-0 animate-fade-in-up">
            About Us
          </p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Secure Registered
            <span className="block text-primary">Document Delivery</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Transfer Guard is the trusted platform for sending documents with legally binding 
            proof of delivery. We combine enterprise-grade security with EU-compliant infrastructure.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {stats.map((stat) => (
              <Card key={stat.label} className="p-4 text-center bg-background border border-border hover:border-primary/30 transition-colors">
                <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Transfer Guard?</h2>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p>
              Traditional email and file sharing services can't prove that your documents were actually 
              received. When it matters legally — contracts, legal notices, compliance deadlines — 
              you need verifiable proof of delivery.
            </p>
            
            <p>
              <strong className="text-foreground">That's exactly what Transfer Guard provides.</strong>
            </p>
            
            <p>
              We combine secure file transfer with legally binding delivery certificates. Every transfer 
              is tracked, timestamped, and documented. For our Legal plan, we provide eIDAS-compliant 
              QERDS (Qualified Electronic Registered Delivery Service) certificates that hold up in court.
            </p>
            
            <p>
              Our infrastructure runs exclusively on ISO 27001 certified European servers. Your data 
              never leaves the EU, ensuring full GDPR compliance and protection from foreign data access laws.
            </p>
            
            <p>
              Whether you're a law firm sending case documents, a notary delivering contracts, 
              or a business sharing sensitive files — Transfer Guard gives you the security and 
              proof you need.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary font-medium text-sm tracking-widest uppercase mb-4">
              Values
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Built on <span className="text-primary">Trust</span>, <span className="text-primary">Security</span>, and
              <span className="block"><span className="text-primary">Legal Certainty</span>.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              <span className="font-medium text-foreground">Our Promise to You.</span> These principles guide every decision we make.
            </p>
          </div>
          
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value) => (
              <Card key={value.title} className="p-6 bg-background/80 backdrop-blur-sm border border-border/60 rounded-2xl hover:shadow-md transition-all duration-200">
                <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-5">
                  <value.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-bold mb-2 text-foreground">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Promise */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Our Data Promise</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your trust is our most valuable asset. Here is our commitment to protecting your privacy.
            </p>
          </div>
          
          {/* 2x2 Grid of Promise Cards */}
          <div className="grid gap-5 md:grid-cols-2">
            {dataPromises.map((promise) => (
              <Card 
                key={promise.title} 
                className="p-8 bg-background/80 backdrop-blur-sm border border-border/60 rounded-2xl hover:shadow-md transition-all duration-200 text-center"
              >
                {/* Icon */}
                <div className={`mx-auto mb-5 p-4 rounded-2xl w-fit ${
                  promise.color === "amber" ? "bg-amber-100" : "bg-primary/10"
                }`}>
                  <promise.icon 
                    className={`h-10 w-10 ${
                      promise.color === "amber" ? "text-amber-600" : "text-primary"
                    }`} 
                    strokeWidth={1.5} 
                  />
                </div>
                
                {/* Title with highlighted keyword */}
                <h3 className="text-lg font-bold mb-2 text-foreground">
                  {promise.title.split(promise.highlight).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className={promise.color === "amber" ? "text-amber-600" : "text-primary"}>
                          {promise.highlight}
                        </span>
                      )}
                    </span>
                  ))}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {promise.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-10">
            Start your 14-day free trial today. No credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6 h-auto group bg-green-600 hover:bg-green-700 text-white">
              <Link href="/signup/pro">
                Start Free Registered File Transfer
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 h-auto border-2 border-border hover:bg-muted/50">
              <Link href="/#pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
}