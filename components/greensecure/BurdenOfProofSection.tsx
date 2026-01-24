import { Shield, Scale, ArrowRight, CheckCircle2, FileText, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface BurdenOfProofSectionProps {
  showCTA?: boolean;
  compact?: boolean;
}
export const BurdenOfProofSection = ({
  showCTA = true,
  compact = false
}: BurdenOfProofSectionProps) => {
  return <section className={`${compact ? 'py-12' : 'py-24'} px-2 sm:px-4`}>
      <div className="container max-w-5xl mx-auto px-0 sm:px-0">
        {!compact && <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Burden of Proof: <span className="text-primary">The Key Difference</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Who carries the responsibility in a legal dispute? See how QERDS shifts the balance.
            </p>
          </div>}

        {compact && <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              Burden of Proof: <span className="text-primary">The Key Difference</span>
            </h3>
            <p className="text-muted-foreground">
              Who must prove what in a legal dispute?
            </p>
          </div>}

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 items-stretch">
          {/* Professional Card */}
          <Card className="p-4 sm:p-6 md:p-8 bg-background border border-border shadow-sm relative overflow-hidden flex flex-col">
            {/* Decorative background circle */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl" />
            
            <div className="relative flex flex-col h-full">
              {/* Header - fixed height */}
              <div className="flex items-start gap-4 mb-6 min-h-[72px]">
                <div className="p-3 rounded-xl bg-blue-100">
                  <Shield className="h-8 w-8 text-blue-500" strokeWidth={1.5} />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2 text-xs border-blue-200 text-blue-600 bg-blue-50">
                    Professional Plan
                  </Badge>
                  <h3 className="font-bold text-2xl">Proof of Delivery</h3>
                </div>
              </div>

              {/* Burden of Proof Box - fixed height */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 mb-6 min-h-[120px] flex flex-col justify-center">
                <p className="font-semibold text-base mb-2 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-500 shrink-0" />
                  Court-Admissible Evidence
                </p>
                <p className="text-sm text-muted-foreground">
                  Generates a tamper-proof Audit Trail with an Adobe-trusted seal. Provides strong, admissible evidence of delivery and file integrity for commercial disputes.
                </p>
              </div>

              {/* Feature list - flex grow */}
              <div className="mb-6 flex-grow">
                <p className="text-sm font-semibold mb-3">What you get:</p>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>PDF certificate with proof of delivery</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>SHA-256 hash verification</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Timestamp and IP logging</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Strong evidence for most business situations</span>
                  </li>
                </ul>
              </div>

              {/* Comparable to - always at bottom */}
              <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100 mt-auto">
                <p className="text-sm flex items-start gap-2">
                  <FileText className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Comparable to:</strong> Registered mail with proof of posting — solid evidence for everyday business.
                  </span>
                </p>
              </div>
            </div>
          </Card>

          {/* Legal Card */}
          <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-amber-50/50 to-background border-2 border-amber-200 shadow-sm relative overflow-hidden flex flex-col">
            {/* Decorative background circle */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-100/50 rounded-full blur-3xl" />
            
            {/* Recommended badge */}
            <Badge className="absolute top-4 right-4 bg-green-500 text-white shadow-md">
              Recommended
            </Badge>
            
            <div className="relative flex flex-col h-full">
              {/* Header - fixed height */}
              <div className="flex items-start gap-4 mb-6 min-h-[72px]">
                <div className="p-3 rounded-xl bg-amber-100">
                  <Scale className="h-8 w-8 text-amber-600" strokeWidth={1.5} />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2 text-xs border-amber-200 text-amber-700 bg-amber-50">
                    Legal Plan
                  </Badge>
                  <h3 className="font-bold text-2xl">QERDS Certified</h3>
                </div>
              </div>

              {/* Reversed Burden of Proof Box - fixed height */}
              <div className="bg-green-500 rounded-xl p-5 mb-6 min-h-[120px] flex flex-col justify-center">
                <p className="font-semibold text-base mb-2 flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-5 w-5 text-white shrink-0" />
                  Reversed Burden of Proof
                </p>
                <p className="text-sm text-green-50">
                  <strong className="text-white">The recipient</strong> he gold standard under eIDAS Art. 35. The court must presume your evidence is true unless proven otherwise. Essential for high-stakes litigation.
                </p>
              </div>

              {/* Feature list - flex grow */}
              <div className="mb-6 flex-grow">
                <p className="text-sm font-semibold mb-3">In a dispute:</p>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>eIDAS-certified proof presumed valid by law</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Recipient cannot simply deny receipt</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Immutable blockchain verification record</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Courts accept QERDS as prima facie evidence</span>
                  </li>
                </ul>
              </div>

              {/* Comparable to - always at bottom */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mt-auto">
                <p className="text-sm flex items-start gap-2">
                  <User className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Comparable to:</strong> Digital notary — irrefutable legal proof that stands up in any EU court.
                  </span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {showCTA && <div className="mt-10 text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg">
              <Link href="/signup/legal">
                <Scale className="h-4 w-4 mr-2" />
                Get Legal Protection with QERDS
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              10 QERDS credits included monthly • Upgrade anytime
            </p>
          </div>}
      </div>
    </section>;
};
