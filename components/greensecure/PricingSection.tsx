import { Check, Minus, Shield, Lock, Server, Scale, FileCheck, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BurdenOfProofSection } from "./BurdenOfProofSection";
import Link from "next/link";

const securityFeatures = [
  { icon: Shield, text: "ISO 27001 Infrastructure" },
  { icon: Lock, text: "End-to-End Encryption" },
  { icon: Server, text: "100% EU Data Residency" },
  { icon: Scale, text: "Court-Admissible Proof" },
];

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
  // Essentials
  { name: "Essentials", pro: "", legal: "", isCategory: true },
  { name: "Storage / Max file size", pro: "2 TB / 50 GB", legal: "3 TB / 100 GB" },
  { name: "Secure Transfer (2FA)", pro: "Unlimited", legal: "Unlimited" },

  // Security Features
  { name: "Security Features", pro: "", legal: "Includes everything in Pro, plus:", isCategory: true },
  { name: "Audit Trail Type", pro: "Adobe Certified PDF", legal: "included" },
  { name: "IP & Access Logging", pro: "Sealed in Report", legal: "included" },
  { name: "Anti-Tamper Seal", pro: "Incl. Timestamp", legal: "included" },
  { name: "The Upgrades (Unique to Legal)", pro: "", legal: "", isCategory: true },
  { name: "QERDS Blockchain", pro: false, legal: "Guaranteed Unaltered", legalOnly: true },
  {
    name: "QERDS Credits",
    pro: false,
    legal: "✨ 10 Credits /mo",
    legalOnly: true,
    subtext: { legal: "(Top-ups available)" },
  },

  // Legal Standing
  { name: "Legal Standing", pro: "", legal: "", isCategory: true },
  {
    name: "Evidence Strength",
    pro: "Proof of Delivery",
    legal: "Irrefutable Proof",
    subtext: { pro: "(File is 100% unaltered)", legal: "(Identity + Content verified)" },
  },
  { name: "Comparable to", pro: "Registered Mail", legal: "Digital Notary" },

  // Extras
  { name: "Extras", pro: "", legal: "", isCategory: true },
  { name: "Custom Branding", pro: true, legal: true },
  { name: "Priority Support", pro: true, legal: true, proOnly: true },
];

const plans = [
  {
    name: "Professional",
    monthlyPrice: 42,
    yearlyPrice: 35,
    subtitle: "Verified file delivery sealed PDF",
    description: "Adobe Certified PDF for proof of integrity",
    recommended: true,
    badge: null,
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
    subtitle: "QERDS Certified Legal Proof",
    description: "Everything in Professional + QERDS",
    recommended: false,
    badge: null,
    cta: "Subscribe Now",
    ctaSubtext: "Full Legal Protection",
    highlights: [
      "Everything in Professional, plus:",
      "3 TB storage, 100 GB max file size",
      "10 QERDS credits per month",
      "Blockchain-verified evidence",
      "Qualified eIDAS timestamping",
      "Identity verification included",
    ],
  },
];

const FeatureValue = ({ value, subtext }: { value: boolean | string; subtext?: string }) => {
  if (value === "included") {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-green-500 flex items-center justify-center">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </div>
        <span className="text-xs sm:text-sm font-medium text-green-600">Included</span>
      </div>
    );
  }
  if (typeof value === "string" && value !== "") {
    return (
      <div className="flex flex-col items-center">
        <span className="text-xs sm:text-sm font-medium">{value}</span>
        {subtext && <span className="text-[10px] sm:text-xs text-muted-foreground italic">{subtext}</span>}
      </div>
    );
  }
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-green-500 flex items-center justify-center">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <span className="text-muted-foreground">—</span>
    </div>
  );
};

export const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  const getPrice = (plan: (typeof plans)[0]) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getYearlySavings = (plan: (typeof plans)[0]) => {
    return (plan.monthlyPrice - plan.yearlyPrice) * 12;
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-blue-600 font-semibold text-sm tracking-wide uppercase mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Secure transfers with <span className="text-primary">legal-grade</span>{" "}
            <span className="text-primary">evidence</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Turn every file transfer into a forensically sealed piece of evidence. From audit-ready logs to qualified
            eIDAS registration.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 mb-4">
            <span
              className={`text-sm font-medium transition-colors ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-green-500" />
            <span
              className={`text-sm font-medium transition-colors ${isYearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-medium">
                Save €192/yr
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards - New Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
          {/* Professional Card */}
          <Card className="relative overflow-hidden bg-background shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
            {/* Most Popular Badge */}
            <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10">
              <Badge className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded-b-lg rounded-t-none shadow-md">
                <FileCheck className="h-3 w-3 mr-1.5" />
                Most Popular
              </Badge>
            </div>
            
            {/* Blue Header */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 pt-10 pb-6 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-400/30 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Professional</h3>
            </div>

            {/* Price Section */}
            <div className="bg-background px-6 py-6 text-center border-b border-border">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-blue-600">€{getPrice(plans[0])}</span>
                <span className="text-muted-foreground">/user/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">excl. VAT</p>
              {isYearly && (
                <p className="text-sm text-green-600 font-medium mt-1">Save €{getYearlySavings(plans[0])}/year</p>
              )}
              {!isYearly && <div className="h-5 mt-1" />}
            </div>

            {/* Features */}
            <div className="px-6 py-6 flex-grow">
              <div className="space-y-3">
                {plans[0].highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
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
                className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-base font-medium rounded-lg shadow-md"
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
          <Card className="relative overflow-hidden bg-background shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
            {/* Amber/Orange Header */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 pt-10 pb-6 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-400/30 flex items-center justify-center mx-auto mb-4">
                <Scale className="h-7 w-7 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Legal</h3>
            </div>

            {/* Price Section */}
            <div className="bg-background px-6 py-6 text-center border-b border-border">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-amber-600">€{getPrice(plans[1])}</span>
                <span className="text-muted-foreground">/user/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">excl. VAT</p>
              {isYearly && (
                <p className="text-sm text-green-600 font-medium mt-1">Save €{getYearlySavings(plans[1])}/year</p>
              )}
              {!isYearly && <div className="h-5 mt-1" />}
            </div>

            {/* Features */}
            <div className="px-6 py-6 flex-grow">
              <div className="space-y-3">
                {plans[1].highlights.map((highlight, idx) => (
                  <div key={idx} className={`flex items-start gap-3 text-sm ${idx === 0 ? "pb-2 mb-1 border-b border-amber-200" : ""}`}>
                    {idx === 0 ? (
                      <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
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
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white h-12 text-base font-medium rounded-lg shadow-md"
              >
                <Link href="/signup/legal">
                  <Scale className="h-4 w-4 mr-2" />
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
            {/* Desktop: Table-based comparison */}
            <div className="hidden sm:block">
              {/* Header row with plan names */}
              <div className="grid grid-cols-3 gap-3 lg:gap-4 mb-0">
                <div className="col-span-1" />
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`p-4 text-center rounded-t-lg ${
                      plan.name === "Professional"
                        ? "bg-blue-50 border-x border-t border-blue-200"
                        : plan.name === "Legal"
                          ? "bg-amber-50 border-x border-t border-amber-200"
                          : "bg-muted/50 border-x border-t border-border"
                    }`}
                  >
                    <h4 className="font-semibold">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground">€{getPrice(plan)}/user/mo</p>
                  </div>
                ))}
              </div>

              {/* Feature comparison table */}
              <div className="bg-background rounded-b-xl border border-border overflow-hidden">
                {features.map((feature, index) => {
                  // Category row
                  if (feature.isCategory) {
                    return (
                      <div
                        key={feature.name}
                        className="grid grid-cols-3 gap-3 lg:gap-4 px-3 lg:px-6 py-2 lg:py-3 bg-muted/50 border-b border-border"
                      >
                        <div className="text-xs lg:text-sm font-bold text-foreground">{feature.name}</div>
                        <div />
                        <div className="text-center">
                          {feature.legal && typeof feature.legal === "string" && (
                            <span className="text-xs lg:text-sm italic text-muted-foreground">{feature.legal}</span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Regular feature row
                  return (
                    <div
                      key={feature.name}
                      className={`grid grid-cols-3 gap-3 lg:gap-4 px-3 lg:px-6 py-3 lg:py-4 hover:bg-muted/30 transition-colors ${
                        index !== features.length - 1 ? "border-b border-border" : ""
                      } ${feature.legalOnly ? "bg-amber-50/50" : ""}`}
                    >
                      <div className="text-xs lg:text-sm font-medium flex items-center gap-1 lg:gap-2">
                        <span className="line-clamp-2">{feature.name}</span>
                      </div>
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

            {/* Mobile: Stacked comparison */}
            <div className="sm:hidden space-y-6">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`p-4 ${
                    plan.name === "Professional"
                      ? "border-blue-300"
                      : plan.name === "Legal"
                        ? "border-amber-300"
                        : ""
                  }`}
                >
                  <h4 className="font-semibold text-lg mb-3">{plan.name}</h4>
                  <div className="space-y-2">
                    {features
                      .filter((f) => !f.isCategory)
                      .map((feature) => {
                        const value =
                          plan.name === "Professional"
                            ? feature.pro
                            : feature.legal;
                        return (
                          <div key={feature.name} className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0">
                            <span className="text-muted-foreground">{feature.name}</span>
                            <span className="font-medium">
                              {value === true ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : value === false ? (
                                <Minus className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                value || "—"
                              )}
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

        {/* Burden of Proof Section */}
        <BurdenOfProofSection compact showCTA={false} />
      </div>
    </section>
  );
};
