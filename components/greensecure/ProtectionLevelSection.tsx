import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Scale, Check } from "lucide-react";
import Link from "next/link";

export const ProtectionLevelSection = () => {
  const professionalFeatures = [
    "Tamper-Evident Sealed PDF",
    "AATL-Certificate Signed",
    "Proof of Content & Delivery"
  ];

  const legalFeatures = [
    "Everything in Professional +",
    "Blockchain Anchored Timestamp",
    "Qualified eIDAS Regulation",
    "Identity Verification included"
  ];

  return (
    <section className="py-20 sm:py-28 px-4 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16">
          Legal certainty for every delivery — <span className="text-amber-500">choose the level</span> that fits your needs
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Professional Card */}
          <Card className="relative p-8 bg-background border-l-4 border-l-blue-500 border-t border-r border-b border-border hover:shadow-xl transition-all duration-300 flex flex-col h-full rounded-xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-500" strokeWidth={1.5} />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">Court-Admissible Evidence</h3>
            <p className="text-muted-foreground text-center mb-6 text-sm leading-relaxed">Generates a tamper-proof Audit Trail with an Adobe-trusted seal. Provides strong, admissible evidence of delivery and file integrity for commercial disputes.</p>

            <ul className="space-y-3 flex-1">
              {professionalFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button asChild size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg h-12 text-base font-medium">
                <Link href="/signup/pro?plan=professional">Select Professional</Link>
              </Button>
            </div>
          </Card>

          {/* Legal Card */}
          <Card className="relative p-8 bg-background border-2 border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col h-full rounded-xl overflow-visible">
            {/* Court Ready Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
              COURT READY
            </div>

            <div className="flex justify-center mb-6 mt-2">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                <Scale className="h-8 w-8 text-amber-600" strokeWidth={1.5} />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">Legal-Grade Evidence</h3>
            <p className="text-muted-foreground text-center mb-6">For high-stakes disputes</p>

            <ul className="space-y-3 flex-1">
              {legalFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg h-12 text-base font-medium"
              >
                <Link href="/signup/pro?plan=legal">Select Legal</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
