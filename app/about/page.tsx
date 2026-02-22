'use client';
import { Shield, Lock, Users, Eye, Server, Globe, ArrowRight, CircleDollarSign, Bot, ShieldOff, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

import Link from "next/link";

export default function About() {
  const { t } = useLanguage();

  const dataPromises = [
    {
      icon: CircleDollarSign,
      title: t('about.promise.nosell.title'),
      highlight: t('about.promise.nosell.highlight'),
      description: t('about.promise.nosell.desc'),
      color: "primary",
    },
    {
      icon: Bot,
      title: t('about.promise.noai.title'),
      highlight: t('about.promise.noai.highlight'),
      description: t('about.promise.noai.desc'),
      color: "green",
    },
    {
      icon: ShieldOff,
      title: t('about.promise.nocloudact.title'),
      highlight: t('about.promise.nocloudact.highlight'),
      description: t('about.promise.nocloudact.desc'),
      color: "primary",
    },
    {
      icon: BookOpen,
      title: t('about.promise.transparent.title'),
      highlight: t('about.promise.transparent.highlight'),
      description: t('about.promise.transparent.desc'),
      color: "green",
    },
  ];

  const coreValues = [
    {
      icon: Shield,
      title: t('about.value.proof.title'),
      description: t('about.value.proof.desc'),
    },
    {
      icon: Lock,
      title: t('about.value.secure.title'),
      description: t('about.value.secure.desc'),
    },
    {
      icon: Server,
      title: t('about.value.eu.title'),
      description: t('about.value.eu.desc'),
    },
    {
      icon: Users,
      title: t('about.value.professionals.title'),
      description: t('about.value.professionals.desc'),
    },
    {
      icon: Eye,
      title: t('about.value.privacy.title'),
      description: t('about.value.privacy.desc'),
    },
    {
      icon: Globe,
      title: t('about.value.independent.title'),
      description: t('about.value.independent.desc'),
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container max-w-4xl mx-auto text-center">
          <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3 opacity-0 animate-fade-in-up">
            {t('about.label')}
          </p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {t('about.title.line1')}
            <span className="block text-primary">{t('about.title.line2')}</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {t('about.subtitle')}
          </p>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-12 max-w-xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
              <img src="/assets/gdpr-logo.png" alt="GDPR" className="h-8 w-auto" />
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-foreground">GDPR</span>
                <span className="text-xs text-muted-foreground">{t('about.badge.gdpr')}</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
              <img src="/assets/iso27001-logo.png" alt="ISO 27001" className="h-8 w-auto" />
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-foreground">ISO 27001</span>
                <span className="text-xs text-muted-foreground">{t('about.badge.iso')}</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-foreground">AES-256</span>
                <span className="text-xs text-muted-foreground">{t('about.badge.aes')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{t('about.why.title')}</h2>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p>{t('about.why.p1')}</p>
            <p><strong className="text-foreground">{t('about.why.p2')}</strong></p>
            <p>{t('about.why.p3')}</p>
            <p>{t('about.why.p4')}</p>
            <p>{t('about.why.p5')}</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary font-medium text-sm tracking-widest uppercase mb-4">
              {t('about.values.label')}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {t('about.values.title.part1')}<span className="text-primary">{t('about.values.title.trust')}</span>, <span className="text-primary">{t('about.values.title.security')}</span>,
              <span className="block"><span className="text-primary">{t('about.values.title.legal')}</span>.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              <span className="font-medium text-foreground">{t('about.values.subtitle.bold')}</span>{t('about.values.subtitle')}
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
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t('about.promise.title')}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t('about.promise.subtitle')}</p>
          </div>
          
          <div className="grid gap-5 md:grid-cols-2">
            {dataPromises.map((promise) => (
              <Card 
                key={promise.title} 
                className="p-8 bg-background/80 backdrop-blur-sm border border-border/60 rounded-2xl hover:shadow-md transition-all duration-200 text-center"
              >
                <div className={`mx-auto mb-5 p-4 rounded-2xl w-fit ${
                  promise.color === "green" ? "bg-emerald-100" : "bg-primary/10"
                }`}>
                  <promise.icon 
                    className={`h-10 w-10 ${
                      promise.color === "green" ? "text-emerald-600" : "text-primary"
                    }`}
                    strokeWidth={1.5} 
                  />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">
                  {promise.title.split(promise.highlight).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className={promise.color === "green" ? "text-emerald-600" : "text-primary"}>
                          {promise.highlight}
                        </span>
                      )}
                    </span>
                  ))}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{promise.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t('about.cta.title')}</h2>
          <p className="text-lg text-muted-foreground mb-10">{t('about.cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6 h-auto group bg-cta hover:bg-cta/90 text-white">
              <Link href="/signup/pro">
                {t('about.cta.primary')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </main>
  );
}
