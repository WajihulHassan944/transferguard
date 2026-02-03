"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Lock,
  Shield,
  User,
  FileText,
  FileSpreadsheet,
  Download,
  MessageSquare,
  Clock,
  AlertCircle,
  ShieldCheck,
  DownloadIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const defaultBrandColor = "hsl(217, 91%, 50%)"

const activeBrandColor = defaultBrandColor
const lightBrandColor = activeBrandColor.replace(
  /(\d+)%\)$/,
  (_, l) => `${Math.min(98, parseInt(l) + 45)}%)`
)

const page = () => {

  const [receiptAccepted, setReceiptAccepted] = useState(false);
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${lightBrandColor} 0%, hsl(0 0% 100%) 50%)`,
      }}
    >
      {/* ================= HEADER ================= */}
      <header className="border-b border-border sticky top-0 z-50 bg-white">
        <div className="container flex h-20 items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto">
          <img
            src="/assets/transferguard-logo-transparent.png"
            alt="TransferGuard"
            className="h-14 object-contain"
          />

          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary">
            <Lock className="h-3.5 w-3.5" />
            <span className="font-medium">Secure Connection</span>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
        <main className="flex-1 ">
        <div className="max-w-7xl mx-auto   border shadow-lg bg-white p-6 lg:p-8 mt-9 rounded-2xl mb-15">
     
          {/* Title */}
         <div className="text-center mb-6">
             <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Secure Files Ready for Download
              </h1>
              <p className="text-muted-foreground">
              Your identity has been verified. You can now download the files below.
            </p>
          </div>

          {/* SUCCESS BANNER */}
         <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-success-light border border-success-border mb-6">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-success">Identity Verified. Secure Connection Established.</p>
                <p className="text-xs text-success/80">TLS 1.3 • AES-256 Encryption</p>
              </div>
            </div>
         

          {/* GRID */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* ===================================================== */}
            {/* LEFT COLUMN */}
            {/* ===================================================== */}
            <div className="space-y-6">
              {/* Sender */}
              <Card className="border-border shadow-soft">
                            <CardContent className="p-6 flex gap-4 items-center">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
            
                              <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Secure transfer from</p>
                                  <p className="font-semibold text-foreground truncate text-lg">
                                  legal@hendriksen-partners.nl
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Sent about 2 hours ago
                                </p>
                              </div>
                            </CardContent>
                          </Card>
            
              {/* Message */}
                 <Card className="border-border shadow-soft bg-muted/20">
                <CardContent className="pt-5 pb-5 space-y-4">
            
                  <div className="flex items-center gap-2 font-medium">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Message from sender
                  </div>

                  <div className="rounded-xl border bg-muted/20 p-4 text-sm whitespace-pre-line leading-relaxed">
                    Beste Jan,

                    {"\n\n"}Hierbij de contractdocumenten voor het nieuwe project. Graag voor
                    vrijdag ondertekend retour.

                    {"\n\n"}Met vriendelijke groet,
                    {"\n"}Mr. Hendriksen
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
                  <Card className="border-border shadow-soft bg-muted/20">
                <CardContent className="pt-5 pb-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Security & Compliance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4 text-primary/70" />
                      <span>End-to-End Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-lg">🇪🇺</span>
                      <span>EU Data Storage</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-primary/70" />
                      <span>ISO 27001 Certified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 text-legal" />
                      <span>Audit Trail Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
</div>

            {/* ===================================================== */}
            {/* RIGHT COLUMN */}
            {/* ===================================================== */}
             <Card className="border-border shadow-soft ">
                          {/* file summary */}
                          <div className="bg-muted/50 px-5 py-4 border-b border-border">
                                             <div className="flex items-center justify-between">
                                               <div className="flex items-center gap-2">
                                                 <CheckCircle2 className="h-5 w-5 text-success" />
                                                 <h2 className="font-semibold text-foreground">
                                                   2 Files Ready
                                                 </h2>
                                               </div>
                                               <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border">
                                                 <Clock className="h-3.5 w-3.5" />
                                                 <span>Expires in 7</span>
                                               </div>
                                             </div>
                                           </div>

                {/* files */}
                <div className="divide-y">
                  <FileRow
                    icon={<FileText className="h-5 w-5 text-red-500" />}
                    name="Contract_Draft_V3.pdf"
                    size="2.38 MB"
                  />

                  <FileRow
                    icon={<FileText className="h-5 w-5 text-red-500" />}
                    name="NDA_Agreement_2025.pdf"
                    size="1.14 MB"
                  />

                  <FileRow
                    icon={<FileSpreadsheet className="h-5 w-5 text-blue-600" />}
                    name="Financial_Overview.xlsx"
                    size="830.08 KB"
                  />
                </div>

                {/* receipt confirm */}
              <div className="p-5 border-t border-border bg-muted/30 space-y-4">
                    {/* Receipt Agreement Checkbox */}
                      <div 
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          receiptAccepted 
                            ? 'bg-success-light border-success ring-2 ring-success/20' 
                            : 'bg-white border-border hover:border-primary/50'
                        }`}
                        onClick={() => setReceiptAccepted(!receiptAccepted)}
                      >
                        <Checkbox 
                          id="receipt-agreement" 
                          checked={receiptAccepted}
                          onCheckedChange={(checked) => setReceiptAccepted(checked as boolean)}
                          className={`mt-0.5 h-5 w-5 border-2 ${
                            receiptAccepted 
                              ? 'border-success data-[state=checked]:bg-success data-[state=checked]:text-success-foreground' 
                              : 'border-muted-foreground/50'
                          }`}
                        />
                        <label htmlFor="receipt-agreement" className="text-sm leading-relaxed cursor-pointer flex-1">
                          <span className={receiptAccepted ? 'text-success font-medium' : 'text-foreground font-medium'}>
                            Ik bevestig de ontvangst van deze bestanden
                          </span>
                          <span className={`block mt-1 ${receiptAccepted ? 'text-success/80' : 'text-muted-foreground'}`}>
                            Door te downloaden ga ik akkoord met de ontvangst en wordt dit geregistreerd als juridisch bewijs.
                          </span>
                        </label>
                      </div>
                  </div>

                {/* total */}
                  <div className="flex items-center justify-between mx-6 mb-6">
                      <span className="text-sm text-muted-foreground">Total download size</span>
                      <span className="font-semibold text-foreground">4.34 Mb</span>
                    </div>

                {/* button */}
              <div className="px-6">
                  <Button 
                        className=" w-full h-14 bg-cta hover:bg-cta/90 text-cta-foreground font-semibold text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        size="lg"
                      >
                          <>
                            <DownloadIcon className="mr-2 h-5 w-5" />
                            {receiptAccepted ? 'Download All Files' : 'Accept Receipt to Download'}
                          </>
                      
                      </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="py-4 bg-transparent">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <p>
              Powered by{" "}
              <Link href="/" className="text-primary hover:underline font-medium">
                TransferGuard
              </Link>{" "}
              • Registered File Transfer
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ================= COMPONENTS ================= */

function SecurityItem({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      {text}
    </div>
  )
}

function FileRow({
  icon,
  name,
  size,
}: {
  icon: React.ReactNode
  name: string
  size: string
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{size}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Verified
      </div>
    </div>
  )
}

export default page
