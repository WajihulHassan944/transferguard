import { Scale, Lock, Upload, Home, FileCheck, Briefcase, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const ClientPortalSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 bg-background overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-16 scroll-animate ${isVisible ? 'is-visible' : ''}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Receive Sensitive Client Files
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 tracking-tight text-primary">
            Securely & in Your Own Branding
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Offer clients a professional, encrypted upload portal. Fully customizable with your logo and colors, no technical knowledge required.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Use Cases */}
          <div className={`space-y-8 scroll-animate-left ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            <h3 className="text-2xl font-semibold">Perfect for professionals who receive sensitive documents</h3>
            
            <div className={`space-y-4 stagger-children ${isVisible ? 'is-visible' : ''}`}>
              {[
                {
                  icon: Scale,
                  title: "Lawyers & Law Firms",
                  description: "Receive contracts, evidence, and case files securely from clients"
                },
                {
                  icon: Home,
                  title: "Notaries",
                  description: "Collect deeds, identity documents, and signed agreements safely"
                },
                {
                  icon: Briefcase,
                  title: "Mortgage Advisors",
                  description: "Gather income statements, bank records, and property documents"
                },
                {
                  icon: FileCheck,
                  title: "Accountants & Tax Advisors",
                  description: "Receive financial statements, invoices, and annual reports"
                }
              ].map((useCase) => (
                <div 
                  key={useCase.title} 
                  className="flex gap-4 p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <useCase.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{useCase.title}</h4>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual Preview */}
          <div className={`relative scroll-animate-right ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '200ms' }}>
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
                    upload.vandenberg-notaris.nl
                  </div>
                </div>
              </div>
              
              {/* Portal content */}
              <div className="relative min-h-[400px]">
                {/* Custom wallpaper */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
                  <div 
                    className="absolute inset-0 opacity-30" 
                    style={{
                      backgroundImage: `linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.03) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.03) 75%)`,
                      backgroundSize: '60px 60px'
                    }} 
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/80 to-transparent" />
                </div>
                
                {/* Floating encryption badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-cta/20 border border-cta/30 backdrop-blur-sm z-10">
                  <div className="w-2 h-2 rounded-full bg-cta animate-pulse" />
                  <span className="text-xs font-medium text-cta-foreground">End-to-End Encrypted</span>
                </div>
                
                {/* Portal card */}
                <div className="relative p-6 pt-14">
                  <Card className="max-w-sm mx-auto p-6 bg-background/95 backdrop-blur-sm shadow-xl">
                    {/* Custom branded logo */}
                    <div className="text-center mb-5">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg mb-3">
                        <Scale className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg">Van den Berg Notaris</h3>
                      <p className="text-sm text-muted-foreground">Veilig documenten uploaden</p>
                    </div>

                    {/* File upload list */}
                    <div className="space-y-3 mb-4">
                      {/* Completed upload */}
                      <div className="p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-destructive/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-destructive">PDF</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-[140px]">Koopovereenkomst.pdf</p>
                              <p className="text-xs text-muted-foreground">2.4 GB</p>
                            </div>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-cta" />
                        </div>
                      </div>
                      
                      {/* Uploading file */}
                      <div className="p-3 rounded-lg bg-muted/50 border border-primary/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">PDF</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-[140px]">Taxatierapport_2024.pdf</p>
                              <p className="text-xs text-muted-foreground">8.7 GB • Uploading...</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-primary">67%</span>
                        </div>
                        <Progress value={67} className="h-1.5" />
                      </div>
                      
                      {/* Waiting file */}
                      <div className="p-3 rounded-lg bg-muted/30 border border-border opacity-70">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-violet-500/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-violet-600">ZIP</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium truncate max-w-[140px]">Bijlagen_dossier.zip</p>
                            <p className="text-xs text-muted-foreground">12.3 GB • Wachtend...</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security indicator */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-cta/10 border border-cta/20 rounded-lg px-3 py-2">
                      <Lock className="h-3.5 w-3.5 text-cta" />
                      <span className="font-medium text-cta">AES-256 Encrypted</span>
                      <span className="text-muted-foreground">• EU Servers</span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div 
              className={`absolute -left-4 top-1/3 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-lg transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center">
                <Scale className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium">Your Logo</span>
            </div>
            
            <div 
              className={`absolute -right-4 top-1/2 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-lg transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <Upload className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Large Files</span>
            </div>
            
            <div 
              className={`absolute -left-4 bottom-1/4 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-cta/10 border border-cta/30 shadow-lg transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <Lock className="h-4 w-4 text-cta" />
              <span className="text-sm font-medium text-cta">E2E Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
