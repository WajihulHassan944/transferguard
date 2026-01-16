'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Mail, Lock, User, Building, ArrowLeft, Check, Shield, 
  Loader2, Star, Clock, Zap, ArrowRight, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const proFeatures = [
  "2 TB secure cloud storage",
  "50 GB max per file",
  "End-to-End Encryption",
  "Adobe Certified PDF audit trail",
  "Secure Transfer (2FA)",
  "Anti-Tamper Seal with Timestamp",
  "Full audit logs"
];

// Public email domains that are not allowed
const PUBLIC_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.nl",
  "outlook.com",
  "outlook.nl",
  "live.com",
  "live.nl",
  "yahoo.com",
  "yahoo.nl",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "mail.com",
  "aol.com",
  "msn.com",
  "yandex.com",
  "gmx.com",
  "gmx.de",
  "gmx.nl",
  "zoho.com",
  "inbox.com",
  "fastmail.com",
];

const isPublicEmail = (email: string): boolean => {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? PUBLIC_DOMAINS.includes(domain) : false;
};

export default function SignupPro() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [emailError, setEmailError] = useState("");
  const handleStartTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate business email
    if (isPublicEmail(email)) {
      toast.error("Please use a business email address");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate company name
    if (!companyName.trim()) {
      toast.error("Organization name is required");
      return;
    }

    setLoading(true);
  };

  const isFormValid = 
    firstName.trim() && 
    lastName.trim() && 
    companyName.trim() && 
    email.trim() && 
    password.length >= 6 && 
    password === confirmPassword &&
    !isPublicEmail(email);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-28 items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <img src="/assets/transferguard-logo-transparent.png" alt="Transfer Guard" className="h-24" />
          </Link>
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <div className="container max-w-5xl mx-auto py-12 px-4">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: Form */}
          <div>
            <Card className="p-8 border-0 shadow-lg">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium mb-4">
                  <Zap className="h-4 w-4" />
                  No credit card required
                </div>
                <h2 className="text-2xl font-bold mb-2">Start your 14-day free trial</h2>
                <p className="text-muted-foreground">Up to 5 transfers included. Cancel anytime.</p>
              </div>
              
              <form onSubmit={handleStartTrial} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Organization *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Company name or law firm"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Business Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 ${emailError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      required
                    />
                  </div>
                  {emailError && (
                    <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 ${confirmPassword && password !== confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      required
                      minLength={6}
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Passwords do not match</span>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-base font-semibold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25" 
                  size="lg"
                  disabled={loading || !isFormValid}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Start Free Trial
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </p>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth" className="text-primary hover:underline font-medium">
                    Log in
                  </Link>
                </p>
              </form>
            </Card>
          </div>

          {/* Right: Plan Summary */}
          <Card className="p-6 border-2 border-primary/20 bg-gradient-to-b from-card to-primary/5 sticky top-24">
            {/* Header with badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Professional Trial</h3>
                  <p className="text-sm text-muted-foreground">14 days free</p>
                </div>
              </div>
              <div className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                FREE
              </div>
            </div>

            {/* Trial info */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 mb-6">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-bold text-green-600">€0</span>
                <span className="text-lg text-green-600/70">for 14 days</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-green-700 dark:text-green-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>14 days free</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4" />
                  <span>5 transfers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4" />
                  <span>No credit card</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">What's included</p>
              {proFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>


            {/* Testimonial */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">MV</span>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "Finally a secure way to share legal documents. The audit trail is invaluable."
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    Mark V., Lawyer
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}