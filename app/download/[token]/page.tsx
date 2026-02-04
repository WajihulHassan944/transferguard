"use client"

import {
    AlertCircle,
  CheckCircle2,
  KeyRound,
  Lock,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { baseUrl } from "@/const"
const defaultBrandColor = "hsl(217, 91%, 50%)"

const activeBrandColor = defaultBrandColor
const lightBrandColor = activeBrandColor.replace(
  /(\d+)%\)$/,
  (_, l) => `${Math.min(98, parseInt(l) + 45)}%)`
)

const page = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter()
const { token } = useParams()

const [otpCode, setOtpCode] = useState("")
const [loading, setLoading] = useState(false)
const [error, setError] = useState("")


const handleVerify = async () => {
  if (otpCode.length !== 6 || !termsAccepted) return

  try {
    setLoading(true)
    setError("")

    const res = await fetch(
      `${baseUrl}/transfers/verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          otp: otpCode,
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) throw new Error(data.message)

    router.push(data.redirectUrl)
  } catch (err: any) {
    setError(err.message || "Verification failed")
  } finally {
    setLoading(false)
  }
}

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
          <div className="text-center mb-12">
             <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Secure Files Ready for Download
              </h1>
              <p className="text-muted-foreground">
              Verify your identity to access the encrypted files sent to you.
            </p>
          </div>

          {/* Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* ================= LEFT COLUMN ================= */}
            <div className="space-y-6">
              {/* Sender card */}
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

              {/* Security & Compliance */}
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

            {/* ================= RIGHT COLUMN ================= */}
               <Card className="border-border shadow-soft ">
                {/* file summary */}
                <div className="flex items-center gap-4 border-b p-4 bg-primary/5 border-primary/10 mb-12 " style={{borderTopLeftRadius:'15px',borderTopRightRadius:'15px'}}>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-semibold">3 Encrypted Files</p>
                    <p className="text-sm text-muted-foreground">
                      Total size: 4.34 MB
                    </p>
                  </div>
                </div>

                {/* 2FA */}
                <div className="text-center space-y-5">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <KeyRound className="h-7 w-7 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">
                      Two-Factor Verification
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Enter the security code sent to
                    </p>
                    <p className="font-medium">jan.de.vries@klant.nl</p>
                  </div>

                  {/* OTP inputs */}
                  <div className="flex justify-center pt-2">
                          <InputOTP 
                            maxLength={6} 
                           value={otpCode}
                           onChange={setOtpCode}
                            className="gap-2"
                          >
                            <InputOTPGroup className="gap-2">
                              <InputOTPSlot index={0} className="w-12 h-14 bg-muted/50 border-border text-foreground text-xl font-semibold rounded-lg" />
                              <InputOTPSlot index={1} className="w-12 h-14 bg-muted/50 border-border text-foreground text-xl font-semibold rounded-lg" />
                              <InputOTPSlot index={2} className="w-12 h-14 bg-muted/50 border-border text-foreground text-xl font-semibold rounded-lg" />
                              <InputOTPSlot index={3} className="w-12 h-14 bg-muted/50 border-border text-foreground text-xl font-semibold rounded-lg" />
                              <InputOTPSlot index={4} className="w-12 h-14 bg-muted/50 border-border text-foreground text-xl font-semibold rounded-lg" />
                              <InputOTPSlot index={5} className="w-12 h-14 bg-muted/50 border-border text-foreground text-xl font-semibold rounded-lg" />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
{error && (
  <p className="text-sm text-red-500 font-medium">{error}</p>
)}

                  {/* checkbox */}
                 <div className={`flex items-start gap-4 text-left rounded-xl p-5 max-w-sm mx-auto border-2 transition-all cursor-pointer ${
                              termsAccepted 
                                ? 'bg-success-light border-success ring-2 ring-success/20' 
                                : 'bg-muted/30 border-border hover:border-amber-400'
                            }`}
                              onClick={() => setTermsAccepted(!termsAccepted)}
                            >
                              <Checkbox 
                                id="terms-id" 
                                checked={termsAccepted}
                                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                                className={`mt-0.5 h-5 w-5 border-2 ${
                                  termsAccepted 
                                    ? 'border-success data-[state=checked]:bg-success data-[state=checked]:text-success-foreground' 
                                    : 'border-muted-foreground/50'
                                }`}
                              />
                              <label htmlFor="terms-id" className="text-sm leading-relaxed cursor-pointer">
                                <span className={termsAccepted ? 'text-success font-medium' : 'text-foreground'}>I agree to the </span>
                                <Link href="/terms" className="text-primary font-semibold hover:underline">Terms of Service</Link>
                                <span className={termsAccepted ? 'text-success font-medium' : 'text-foreground'}> & </span>
                                <Link href="/privacy" className="text-primary font-semibold hover:underline">Confidentiality Policy</Link>
                              </label>
                            </div>
                  {/* button */}
                  <Button
  onClick={handleVerify}
  disabled={!termsAccepted || otpCode.length !== 6 || loading}
  className="mb-10 w-full max-w-sm h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
>
  {loading ? (
    "Verifying..."
  ) : (
    <>
      <ShieldCheck className="mr-2 h-5 w-5" />
      Verify & Unlock Files
    </>
  )}
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
              <Link
                href="/"
                className="text-primary hover:underline font-medium"
              >
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

function Item({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-muted-foreground">{text}</span>
    </div>
  )
}

export default page
