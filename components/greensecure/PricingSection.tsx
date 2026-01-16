import { Check, Minus, Shield, Lock, Server, Crown, Sparkles, Scale, FileCheck, Gem, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";

const securityFeatures = [
  { icon: Shield, text: "ISO 27001 Infrastructure" },
  { icon: Lock, text: "End-to-End Encryption" },
  { icon: Server, text: "100% EU Data Residency" },
  { icon: Scale, text: "Court-Admissible Proof" },
];

interface Feature {
  name: string;
  basic: boolean | string;
  pro: boolean | string;
  legal: boolean | string;
  proOnly?: boolean;
  legalOnly?: boolean;
  isCategory?: boolean;
  subtext?: { basic?: string; pro?: string; legal?: string };
}

const features: Feature[] = [
  // Essentials
  { name: "Essentials", basic: "", pro: "", legal: "", isCategory: true },
  { name: "Storage / Max file size", basic: "1 TB / 10 GB", pro: "2 TB / 50 GB", legal: "3 TB / 100 GB" },
  { name: "Secure Transfer (2FA)", basic: "Unlimited", pro: "Unlimited", legal: "Unlimited" },

  // Security Features
  { name: "Security Features", basic: "", pro: "", legal: "Includes everything in Pro, plus:", isCategory: true },
  {
    name: "Validation Level",
    basic: "Level 1: Standard",
    pro: "Level 2: Professional",
    legal: "Level 3: Qualified Validation",
  },
  { name: "Audit Trail Type", basic: "Standard Log", pro: "Adobe Certified PDF", legal: "included" },
  { name: "IP & Access Logging", basic: "Standard Log", pro: "Sealed in Report", legal: "included" },
  { name: "Anti-Tamper Seal", basic: false, pro: "Incl. Timestamp", legal: "included" },
  { name: "The Upgrades (Unique to Legal)", basic: "", pro: "", legal: "", isCategory: true },
  { name: "QERDS Blockchain", basic: false, pro: false, legal: "Guaranteed Unaltered", legalOnly: true },
  {
    name: "QERDS Credits",
    basic: false,
    pro: false,
    legal: "✨ 10 Credits /mo",
    legalOnly: true,
    subtext: { legal: "(Top-ups available)" },
  },

  // Legal Standing
  { name: "Legal Standing", basic: "", pro: "", legal: "", isCategory: true },
  {
    name: "Evidence Strength",
    basic: "Internal Record",
    pro: "Proof of Integrity",
    legal: "Irrefutable Proof",
    subtext: { pro: "(File is 100% unaltered)", legal: "(Identity + Content verified)" },
  },
  { name: "Comparable to", basic: "Standard Mail", pro: "Registered Mail", legal: "Digital Notary" },

  // Extras
  { name: "Extras", basic: "", pro: "", legal: "", isCategory: true },
  { name: "Custom Branding", basic: true, pro: true, legal: true },
  { name: "Priority Support", basic: false, pro: true, legal: true, proOnly: true },
];

const plans = [
  {
    name: "Standard",
    monthlyPrice: 23,
    yearlyPrice: 19,
    subtitle: "Privacy & Security",
    description: "Secure file transfers with basic logging",
    recommended: false,
    badge: null,
    cta: "Choose Standard",
    ctaSubtext: "Direct Access",
    highlights: [
      "1 TB storage, 10 GB max file size",
      "Unlimited secure transfers (2FA)",
      "Standard audit logs",
      "Custom branding",
    ],
  },
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
      "Adobe Certified PDF proof",
      "Anti-tamper seal with timestamp",
      "Priority support",
    ],
  },
  {
    name: "Legal",
    monthlyPrice: 95,
    yearlyPrice: 79,
    subtitle: "QERDS Certified Legal Proof",
    description: "10 QERDS credits/mo for irrefutable proof",
    recommended: false,
    badge: null,
    cta: "Subscribe Now",
    ctaSubtext: "Full Legal Protection",
    highlights: [
      "3 TB storage, 100 GB max file size",
      "10 QERDS credits per month",
      "Blockchain-verified evidence",
      "Comparable to Digital Notary",
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

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case "Standard":
        return <Mail className="h-6 w-6" />;
      case "Professional":
        return <Shield className="h-6 w-6" />;
      case "Legal":
        return <Scale className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getPlanIconBg = (planName: string) => {
    switch (planName) {
      case "Standard":
        return "bg-blue-100 text-blue-600";
      case "Professional":
        return "bg-primary/10 text-primary";
      case "Legal":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-primary font-medium text-sm tracking-wide uppercase mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Secure transfers with <span className="text-primary">legal-grade evidence</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Turn every file transfer into a forensically sealed piece of evidence. From audit-ready logs to qualified
            eIDAS registration.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 mb-4">
            <span
              className={`text-xs sm:text-sm font-medium transition-colors ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-primary" />
            <span
              className={`text-xs sm:text-sm font-medium transition-colors ${isYearly ? "text-foreground" : "text-muted-foreground"}`}
            >
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
                Save €192/yr
              </Badge>
            )}
          </div>
        </div>

        {/* Simplified Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 transition-all duration-300 hover:shadow-lg flex flex-col ${
                plan.name === "Professional"
                  ? "border-primary border-2 bg-primary/5 relative"
                  : plan.name === "Legal"
                    ? "border-amber-500 border-2 bg-gradient-to-b from-amber-50 to-background relative"
                    : "bg-background hover:border-primary/30"
              }`}
            >
              {plan.name === "Professional" && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1">
                  <FileCheck className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getPlanIconBg(plan.name)}`}>
                  {getPlanIcon(plan.name)}
                </div>
              </div>

              {/* Plan name & subtitle */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className={`text-sm font-medium ${plan.name === "Legal" ? "text-amber-600" : "text-primary"}`}>
                  {plan.subtitle}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-4">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">€{getPrice(plan)}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                {isYearly && (
                  <p className="text-sm text-green-600 font-medium mt-1">Save €{getYearlySavings(plan)}/year</p>
                )}
                {!isYearly && <div className="h-5 mt-1" />}
              </div>

              {/* Highlights */}
              <div className="space-y-3 mb-6 flex-grow">
                {plan.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button - Always at bottom */}
              <div className="mt-auto">
                <Button
                  asChild
                  variant={plan.name === "Standard" ? "outline" : "default"}
                  size="lg"
                  className={`w-full ${
                    plan.name === "Professional"
                      ? "bg-cta hover:bg-cta/90 text-white shadow-lg"
                      : plan.name === "Legal"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg"
                        : ""
                  }`}
                >
                  <Link href={plan.name === "Legal" ? "/signup/legal" : `/signup/pro?plan=${plan.name.toLowerCase()}`}>
                    {plan.name === "Standard" && <Mail className="h-4 w-4 mr-2" />}
                    {plan.name === "Professional" && <Shield className="h-4 w-4 mr-2" />}
                    {plan.name === "Legal" && <Scale className="h-4 w-4 mr-2" />}
                    {plan.cta}
                  </Link>
                </Button>
                {plan.ctaSubtext && <p className="text-xs text-muted-foreground text-center mt-2">{plan.ctaSubtext}</p>}
                {!plan.ctaSubtext && <div className="h-5 mt-2" />}
              </div>
            </Card>
          ))}
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
              <div className="grid grid-cols-4 gap-3 lg:gap-4 mb-0">
                <div className="col-span-1" />
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`p-4 text-center rounded-t-lg ${
                      plan.name === "Professional"
                        ? "bg-primary/10 border-x border-t border-primary"
                        : plan.name === "Legal"
                          ? "bg-amber-50 border-x border-t border-amber-500"
                          : "bg-muted/50 border-x border-t border-border"
                    }`}
                  >
                    <h4 className="font-semibold">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground">€{getPrice(plan)}/mo</p>
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
                        className="grid grid-cols-4 gap-3 lg:gap-4 px-3 lg:px-6 py-2 lg:py-3 bg-muted/50 border-b border-border"
                      >
                        <div className="text-xs lg:text-sm font-bold text-foreground">{feature.name}</div>
                        <div />
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
                      className={`grid grid-cols-4 gap-3 lg:gap-4 px-3 lg:px-6 py-3 lg:py-4 hover:bg-muted/30 transition-colors ${
                        index !== features.length - 1 ? "border-b border-border" : ""
                      } ${feature.legalOnly ? "bg-amber-50/50" : ""}`}
                    >
                      <div className="text-xs lg:text-sm font-medium flex items-center gap-1 lg:gap-2">
                        <span className="line-clamp-2">{feature.name}</span>
                      </div>
                      <div className="text-center">
                        <FeatureValue value={feature.basic} subtext={feature.subtext?.basic} />
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
                      ? "border-primary"
                      : plan.name === "Legal"
                        ? "border-amber-500"
                        : ""
                  }`}
                >
                  <h4 className="font-semibold text-lg mb-3">{plan.name}</h4>
                  <div className="space-y-2">
                    {features
                      .filter((f) => !f.isCategory)
                      .map((feature) => {
                        const value =
                          plan.name === "Standard"
                            ? feature.basic
                            : plan.name === "Professional"
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
      </div>
    </section>
  );
};