import { Check, Shield, Fingerprint, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BurdenOfProofSection } from "./BurdenOfProofSection";
import { TrustedPartnersSection } from "./TrustedPartnersSection";
import Link from "next/link";

interface Feature {
  name: string;
  pro: boolean | string;
  legal: boolean | string;
  proOnly?: boolean;
  legalOnly?: boolean;
  isCategory?: boolean;
  subtext?: { pro?: string; legal?: string };
}

const features: Feature[] = [
  { name: "Essentials", pro: "", legal: "", isCategory: true },
  { name: "Storage / Max file size", pro: "2 TB / 50 GB", legal: "3 TB / 100 GB" },
  { name: "Secure Transfer (2FA)", pro: "Unlimited", legal: "Unlimited" },
  { name: "Security Features", pro: "", legal: "Includes everything in Pro, plus:", isCategory: true },
  { name: "Audit Trail Type", pro: "Adobe Certified PDF", legal: "included" },
  { name: "IP & Access Logging", pro: "Sealed in Report", legal: "included" },
  { name: "Anti-Tamper Seal", pro: "Incl. Timestamp", legal: "included" },
  { name: "The Upgrades (Unique to Legal)", pro: "", legal: "", isCategory: true },
  { name: "Identity Verification", pro: false, legal: "Biometric ID Check", legalOnly: true },
  { name: "ID Verification Credits", pro: false, legal: "✨ 10 Credits /mo", legalOnly: true, subtext: { legal: "(Extra: €5 each)" } },
  { name: "Legal Standing", pro: "", legal: "", isCategory: true },
  { name: "Evidence Strength", pro: "Proof of Delivery", legal: "Identity-Verified Proof", subtext: { pro: "(File is 100% unaltered)", legal: "(Identity + Content verified)" } },
  { name: "Comparable to", pro: "Registered Mail", legal: "Signed Receipt" },
  { name: "Extras", pro: "", legal: "", isCategory: true },
  { name: "Custom Branding", pro: true, legal: true },
  { name: "Priority Support", pro: true, legal: true, proOnly: true },
];

const plans = [
  {
    name: "Professional",
    monthlyPrice: 47,
    yearlyPrice: 39,
    extraSeatMonthlyPrice: 19,
    extraSeatYearlyPrice: 15,
    subtitle: "Verified file delivery sealed PDF",
    description: "Adobe Certified PDF for proof of integrity",
    cta: "Start 14-Day Trial",
    ctaSubtext: "Try Risk-Free",
    highlights: [
      "2 TB storage, 50 GB max file size",
      "Unlimited PDF proof reports",
      "Adobe Certified & timestamped",
      "Anti-tamper sealed delivery",
      "Priority support included",
      "Real-time tracking & logging",
    ],
  },
  {
    name: "Legal",
    monthlyPrice: 95,
    yearlyPrice: 79,
    extraSeatMonthlyPrice: 39,
    extraSeatYearlyPrice: 31,
    subtitle: "Identity-Verified Delivery",
    description: "Everything in Professional + ID Verification",
    cta: "Subscribe Now",
    ctaSubtext: "Full Legal Protection",
    highlights: [
      "Everything in Professional, plus:",
      "3 TB storage, 100 GB max file size",
      "10 ID verifications included (extra: €5 each)",
      "Biometric NFC identity verification",
      "Government ID document check",
      "Complete non-repudiation package",
    ],
  },
];

const FeatureValue = ({ value, subtext }: { value: boolean | string; subtext?: string }) => {
  if (value === "included") {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-cta flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-medium text-cta">Included</span>
      </div>
    );
  }
  if (typeof value === "string" && value !== "") {
    return (
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium">{value}</span>
        {subtext && <span className="text-xs text-muted-foreground">{subtext}</span>}
      </div>
    );
  }
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div className="w-5 h-5 rounded-full bg-cta flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
      </div>
    );
  }
  return <span className="text-muted-foreground">—</span>;
};

export const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [userCount, setUserCount] = useState(1);

  const userOptions = [1, 3, 5, 10];

  const getMonthlyTotal = (plan: (typeof plans)[0]) => {
    const basePrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const extraSeatPrice = isYearly ? plan.extraSeatYearlyPrice : plan.extraSeatMonthlyPrice;
    const extraUsers = Math.max(0, userCount - 1);
    return basePrice + (extraUsers * extraSeatPrice);
  };

  const getYearlyTotal = (plan: (typeof plans)[0]) => {
    const monthlyTotal = getMonthlyTotal(plan);
    return monthlyTotal * 12;
  };

  const getYearlySavings = (plan: (typeof plans)[0]) => {
    const monthlyPriceTotal = plan.monthlyPrice + (Math.max(0, userCount - 1) * plan.extraSeatMonthlyPrice);
    const yearlyPriceTotal = plan.yearlyPrice + (Math.max(0, userCount - 1) * plan.extraSeatYearlyPrice);
    return (monthlyPriceTotal - yearlyPriceTotal) * 12;
  };

  return (
    <section id="pricing" className="py-24 lg:py-32 px-4 bg-background">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-4">Pricing</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Secure transfers with{" "}
            <span className="text-primary">legal-grade evidence</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Turn every file transfer into a forensically sealed piece of evidence. From audit-ready logs to identity-verified delivery.
          </p>

          {/* User Count Toggle */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-sm font-medium text-muted-foreground">Number of Users</span>
            <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
              {userOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => setUserCount(count)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    userCount === count
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {count} {count === 1 ? "User" : "Users"}
                </button>
              ))}
            </div>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch 
              checked={isYearly} 
              onCheckedChange={setIsYearly} 
              className="data-[state=checked]:bg-cta"
            />
            <span className={`text-sm font-medium transition-colors ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-cta/10 text-cta border-cta/20 text-xs font-medium">
                Save up to 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
          {/* Professional Card */}
          <Card className="relative overflow-hidden bg-background border-2 border-border hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
            {/* Most Popular Badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-b-lg rounded-t-none shadow-md">
                Most Popular
              </Badge>
            </div>
            
            {/* Header */}
            <div className="pt-12 pb-6 px-6 text-center border-b border-border">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Professional</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-primary transition-all duration-300">€{getMonthlyTotal(plans[0])}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {userCount > 1 ? `for ${userCount} users · ` : ""}excl. VAT
              </p>
              {isYearly && (
                <>
                  <p className="text-xs text-muted-foreground mt-2">Billed annually: €{getYearlyTotal(plans[0])}/year</p>
                  <p className="text-sm text-cta font-medium mt-1">Save €{getYearlySavings(plans[0])}/year</p>
                </>
              )}
            </div>

            {/* Features */}
            <div className="px-6 py-6 flex-grow">
              <div className="space-y-3">
                {plans[0].highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-cta flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6">
              <Button
                asChild
                size="lg"
                className="w-full bg-cta hover:bg-cta/90 text-white h-12 text-base font-medium shadow-md"
              >
                <Link href="/signup/pro?plan=professional">
                  <Shield className="h-4 w-4 mr-2" />
                  Start 14-Day Trial
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">Try Risk-Free</p>
            </div>
          </Card>

          {/* Legal Card */}
          <Card className="relative overflow-hidden bg-background border-2 border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
            {/* Header */}
            <div className="pt-10 pb-6 px-6 text-center border-b border-border bg-gradient-to-b from-amber-50/50 to-transparent">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Fingerprint className="h-7 w-7 text-amber-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Legal</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-amber-600 transition-all duration-300">€{getMonthlyTotal(plans[1])}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {userCount > 1 ? `for ${userCount} users · ` : ""}excl. VAT
              </p>
              {isYearly && (
                <>
                  <p className="text-xs text-muted-foreground mt-2">Billed annually: €{getYearlyTotal(plans[1])}/year</p>
                  <p className="text-sm text-cta font-medium mt-1">Save €{getYearlySavings(plans[1])}/year</p>
                </>
              )}
            </div>

            {/* Features */}
            <div className="px-6 py-6 flex-grow">
              <div className="space-y-3">
                {plans[1].highlights.map((highlight, idx) => (
                  <div key={idx} className={`flex items-start gap-3 text-sm ${idx === 0 ? "pb-2 mb-1 border-b border-amber-200" : ""}`}>
                    {idx === 0 ? (
                      <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    ) : (
                      <Check className="h-5 w-5 text-cta flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`${idx === 0 ? "font-medium text-amber-700" : "text-foreground"}`}>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6">
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white h-12 text-base font-medium shadow-md"
              >
                <Link href="/signup/legal">
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Subscribe Now
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">Full Legal Protection</p>
            </div>
          </Card>
        </div>

        {/* Compare All Features Toggle */}
        <Collapsible open={showComparison} onOpenChange={setShowComparison}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
              {showComparison ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide full comparison
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Compare all features
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6">
            {/* Desktop comparison table */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-3 gap-4 mb-0">
                <div className="col-span-1" />
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`p-4 text-center rounded-t-xl ${
                      plan.name === "Professional"
                        ? "bg-primary/5 border-x border-t border-primary/20"
                        : "bg-amber-50 border-x border-t border-amber-200"
                    }`}
                  >
                    <h4 className="font-semibold">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground">€{getMonthlyTotal(plan)}/mo</p>
                  </div>
                ))}
              </div>

              <div className="bg-background rounded-b-xl border border-border overflow-hidden">
                {features.map((feature, index) => {
                  if (feature.isCategory) {
                    return (
                      <div key={feature.name} className="grid grid-cols-3 gap-4 px-6 py-3 bg-muted/50 border-b border-border">
                        <div className="text-sm font-bold text-foreground">{feature.name}</div>
                        <div />
                        <div className="text-center">
                          {feature.legal && typeof feature.legal === "string" && (
                            <span className="text-sm italic text-muted-foreground">{feature.legal}</span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={feature.name}
                      className={`grid grid-cols-3 gap-4 px-6 py-4 hover:bg-muted/30 transition-colors ${
                        index !== features.length - 1 ? "border-b border-border" : ""
                      } ${feature.legalOnly ? "bg-amber-50/30" : ""}`}
                    >
                      <div className="text-sm font-medium">{feature.name}</div>
                      <div className="text-center">
                        <FeatureValue value={feature.pro} subtext={feature.subtext?.pro} />
                      </div>
                      <div className="text-center">
                        <FeatureValue value={feature.legal} subtext={feature.subtext?.legal} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile comparison */}
            <div className="sm:hidden space-y-6">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`p-4 ${plan.name === "Professional" ? "border-primary/30" : "border-amber-300"}`}
                >
                  <h4 className="font-semibold text-lg mb-3">{plan.name}</h4>
                  <div className="space-y-2">
                    {features.filter((f) => !f.isCategory).map((feature) => {
                      const value = plan.name === "Professional" ? feature.pro : feature.legal;
                      return (
                        <div key={feature.name} className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0">
                          <span className="text-muted-foreground">{feature.name}</span>
                          <span className="font-medium">
                            {value === true ? <Check className="h-4 w-4 text-cta" /> : value === false ? "—" : value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Trusted Partners & Burden of Proof sections */}
      <TrustedPartnersSection />
      <BurdenOfProofSection />
    </section>
  );
};
