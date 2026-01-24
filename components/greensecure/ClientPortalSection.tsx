import { Shield, Lock, Upload, Scale, Home, FileCheck, Briefcase, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
export const ClientPortalSection = () => {
  return <section className="py-24 px-4 bg-background overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          
          <h2 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
            Receive Sensitive Client Files
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight text-primary">
            Securely & in Your Own Branding
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Offer clients a professional, encrypted upload portal. Fully customizable with your logo and colors, no technical knowledge required.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Use Cases */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold">Perfect for professionals who receive sensitive documents</h3>
            
            <div className="space-y-4">
              {[{
              icon: Scale,
              title: "Lawyers & Law Firms",
              description: "Receive contracts, evidence, and case files securely from clients"
            }, {
              icon: Home,
              title: "Notaries",
              description: "Collect deeds, identity documents, and signed agreements safely"
            }, {
              icon: Briefcase,
              title: "Mortgage Advisors",
              description: "Gather income statements, bank records, and property documents"
            }, {
              icon: FileCheck,
              title: "Accountants & Tax Advisors",
              description: "Receive financial statements, invoices, and annual reports"
            }].map(useCase => <div key={useCase.title} className="flex gap-4 p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <useCase.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{useCase.title}</h4>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Right: Visual Preview with branded wallpaper */}
          <div className="relative">
            {/* Browser frame */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-background">
              {/* Browser chrome */}
              <div className="bg-muted/80 px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-background border border-border text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-green-500" />
                    upload.vandenberg-notaris.nl
                  </div>
                </div>
              </div>
              
              {/* Portal content with branded wallpaper */}
              <div className="relative min-h-[400px]">
                {/* Custom wallpaper - Professional office/legal themed */}
                <div className="absolute inset-0">
                  {/* Gradient overlay on wallpaper */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
                  {/* Abstract professional pattern */}
                  <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: `linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.03) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.03) 75%)`,
                  backgroundSize: '60px 60px'
                }} />
                  {/* Subtle office building silhouette effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/80 to-transparent" />
                </div>
                
                {/* Floating encryption badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm z-10">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-green-400">End-to-End Encrypted</span>
                </div>
                
                {/* Portal card */}
                <div className="relative p-6 pt-14">
                  <Card className="max-w-sm mx-auto p-6 bg-background/95 backdrop-blur-sm shadow-xl">
                    {/* Custom branded logo */}
                    <div className="text-center mb-5">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 shadow-lg mb-3">
                        <Scale className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg">Van den Berg Notaris</h3>
                      <p className="text-sm text-muted-foreground">Veilig documenten uploaden</p>
                    </div>

                    {/* File upload list with sizes and progress */}
                    <div className="space-y-3 mb-4">
                      {/* Completed upload */}
                      <div className="p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-red-600">PDF</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-[140px]">Koopovereenkomst.pdf</p>
                              <p className="text-xs text-muted-foreground">2.4 GB</p>
                            </div>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                      
                      {/* Uploading file */}
                      <div className="p-3 rounded-lg bg-muted/50 border border-primary/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">PDF</span>
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
                          <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-purple-600">ZIP</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium truncate max-w-[140px]">Bijlagen_dossier.zip</p>
                            <p className="text-xs text-muted-foreground">12.3 GB • Wachtend...</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security indicator */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                      <Lock className="h-3.5 w-3.5 text-green-500" />
                      <span className="font-medium text-green-600">AES-256 Encrypted</span>
                      <span className="text-muted-foreground">• EU Servers</span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Floating branding badges */}
            <div className="absolute -left-4 top-1/3 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-lg">
              <div className="w-6 h-6 rounded bg-amber-600 flex items-center justify-center">
                <Scale className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium">Your Logo</span>
            </div>
            
            <div className="absolute -right-4 top-1/2 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-lg">
              <Upload className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Large Files</span>
            </div>
            
            <div className="absolute -left-4 bottom-1/4 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 shadow-lg">
              <Lock className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">E2E Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};