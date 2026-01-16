import { Shield, Lock, Heart, Users, Eye, Server, Globe, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const coreValues = [
  {
    icon: Lock,
    title: "Your Data, Your Property",
    description: "We believe that data belonging to you should remain yours. Period. We never sell, share, or use your files for any purpose other than delivering them safely to your recipients."
  },
  {
    icon: Eye,
    title: "No AI Training",
    description: "Your files will never be used to train AI models or for any commercial purposes. We're a file transfer service, not a data mining company."
  },
  {
    icon: Shield,
    title: "Privacy by Design",
    description: "End-to-end encryption, zero-knowledge architecture, and strict access controls ensure that only you and your intended recipients can access your files."
  },
  {
    icon: Server,
    title: "EU Data Sovereignty",
    description: "All data is stored exclusively within the European Union, protected by GDPR and the strictest privacy regulations in the world."
  },
  {
    icon: Users,
    title: "Built for Professionals",
    description: "Designed for law firms, healthcare, and businesses that handle sensitive data. Security shouldn't be complicated."
  },
  {
    icon: Globe,
    title: "100% Independent",
    description: "No big tech. No GAFAM. We are fully independent and will never be acquired by companies that don't share our values."
  }
];

const stats = [
  { value: "100%", label: "EU Data Storage" },
  { value: "Zero", label: "Knowledge Encryption" },
  { value: "ISO 27001", label: "Certified" },
  { value: "AES-256", label: "Encryption" }
];

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container max-w-4xl mx-auto text-center">
          <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3 opacity-0 animate-fade-in-up">
            Our Mission
          </p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Secure file sharing
            <span className="block text-primary">built for professionals</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            We built Transfer Guard with a simple belief: sharing files should be easy, 
            secure, and respectful of your privacy. No compromises.
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
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why We Built Transfer Guard</h2>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p>
              In a world where big tech companies monetize every bit of data they can get their hands on, 
              we saw a need for something different. A service that puts users first, not advertisers.
            </p>
            
            <p>
              Too many file sharing services treat your data as their product. They scan your files, 
              build profiles about you, and sell insights to the highest bidder. Some even use your 
              documents to train AI models without your consent.
            </p>
            
            <p>
              <strong className="text-foreground">We reject this approach entirely.</strong>
            </p>
            
            <p>
              Transfer Guard was built on the principle that your data belongs to you. When you upload 
              a file, it's encrypted, delivered, and that's it. We don't peek inside. We don't analyze it. 
              We don't keep it longer than necessary. And we certainly don't sell it.
            </p>
            
            <p>
              Beyond privacy, we provide legally binding proof of delivery. With our Legally Sealed PDF 
              certificates, you can prove that documents were sent AND received — essential for legal 
              proceedings, contractual deadlines, and compliance requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3">
              Values
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make, from product design to business partnerships.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value) => (
              <Card key={value.title} className="p-8 bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Promise */}
      <section className="py-24 px-4">
        <div className="container max-w-3xl mx-auto">
          <Card className="p-10 border-2 border-primary/20 bg-card">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-full bg-primary/10">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Our Data Promise</h2>
            </div>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="p-2 rounded-lg bg-primary/10 mt-0.5 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">We will never sell your data</p>
                  <p className="text-muted-foreground">Your files and metadata are not for sale. Not now, not ever.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="p-2 rounded-lg bg-primary/10 mt-0.5 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">We will never train AI on your files</p>
                  <p className="text-muted-foreground">Your documents, photos, and files are yours alone.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="p-2 rounded-lg bg-primary/10 mt-0.5 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">We will never share data with third parties</p>
                  <p className="text-muted-foreground">Unless required by law, your data stays between you and your recipients.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="p-2 rounded-lg bg-primary/10 mt-0.5 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">We will always be transparent</p>
                  <p className="text-muted-foreground">If our policies change, you'll be the first to know.</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-10">
            Start your 14-day free trial today. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6 h-auto group">
              <Link href="/signup/pro">
                Start Your Free Trial
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
}