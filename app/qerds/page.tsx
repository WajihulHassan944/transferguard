import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Shield, 
  Scale, 
  FileCheck, 
  CheckCircle, 
  Gem, 
  Building2, 
  Globe, 
  Lock,
  Stamp,
  Award,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const qerdsFeatures = [
  {
    icon: Scale,
    title: "Legally Binding",
    description: "QERDS verifications are 100% legally binding and recognized by courts throughout Europe. Equivalent to a physically signed document."
  },
  {
    icon: Stamp,
    title: "eIDAS Certified",
    description: "Fully compliant with the European eIDAS regulation (EU 910/2014) for electronic identification and trust services."
  },
  {
    icon: Clock,
    title: "Qualified Timestamp",
    description: "Each verification includes a qualified electronic timestamp that proves exactly when the document was sent and received."
  },
  {
    icon: Lock,
    title: "Irrefutable Evidence",
    description: "The recipient cannot deny receiving the documents. The evidence is cryptographically sealed and tamper-proof."
  },
  {
    icon: Building2,
    title: "Recognized by Authorities",
    description: "QERDS certificates are accepted by courts, notaries, government agencies and regulators throughout the EU."
  },
  {
    icon: Globe,
    title: "Valid EU-Wide",
    description: "Thanks to the eIDAS regulation, a QERDS verification is equally valid in any EU member state."
  },
];

const useCases = [
  {
    title: "Legal Firms",
    description: "Proof of service for legal documents, subpoenas and contracts.",
  },
  {
    title: "Notaries",
    description: "Sending deeds and official documents with full evidentiary value.",
  },
  {
    title: "Financial Services",
    description: "Compliance documents, audits and regulatory reports with full traceability.",
  },
  {
    title: "Real Estate",
    description: "Purchase agreements, lease contracts and mortgage documents legally sealed.",
  },
  {
    title: "HR & Employment Law",
    description: "Employment contracts, termination letters and official personnel communications.",
  },
  {
    title: "Healthcare",
    description: "Patient data, informed consent forms and medical correspondence.",
  },
];

const comparisonData = [
  { feature: "Legal Validity", email: "❌ None", pdf: "⚠️ Limited", qerds: "✅ Full" },
  { feature: "eIDAS Certification", email: "❌", pdf: "❌", qerds: "✅" },
  { feature: "Qualified Timestamp", email: "❌", pdf: "⚠️ Basic", qerds: "✅" },
  { feature: "Irrefutable Evidence", email: "❌", pdf: "⚠️ Limited", qerds: "✅" },
  { feature: "EU-Wide Recognition", email: "❌", pdf: "⚠️ Varies", qerds: "✅" },
  { feature: "Tamper-Proof", email: "❌", pdf: "✅", qerds: "✅" },
];

export default function QERDS() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
     
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-amber-50/50 to-background">
          <div className="container max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 px-4 py-2">
              <Gem className="h-4 w-4 mr-2" />
              eIDAS Certified
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              QERDS: <span className="text-amber-600">100% Legally Binding</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Qualified Electronic Registered Delivery Service — the gold standard for 
              legally binding document delivery. Equivalent to a physically signed 
              and registered letter.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-amber-200">
                <Scale className="h-5 w-5 text-amber-600" />
                <span className="font-medium">Valid across Europe</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-amber-200">
                <Award className="h-5 w-5 text-amber-600" />
                <span className="font-medium">eIDAS EU 910/2014</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-amber-200">
                <Shield className="h-5 w-5 text-amber-600" />
                <span className="font-medium">Irrefutable proof</span>
              </div>
            </div>

            <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
              <Link href="/signup/pro?plan=legal">
                <Gem className="h-5 w-5 mr-2" />
                Start with QERDS Legal
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* What is QERDS */}
        <section className="py-20 px-4">
          <div className="container max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What is QERDS?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                QERDS stands for <strong>Qualified Electronic Registered Delivery Service</strong>. 
                It is an EU-certified service that provides legally binding proof that 
                documents have been sent and received.
              </p>
            </div>

            <Card className="p-8 bg-gradient-to-br from-amber-50 to-background border-amber-200">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Scale className="h-5 w-5 text-amber-600" />
                    Legal Value
                  </h3>
                  <p className="text-muted-foreground">
                    A QERDS verification has the same legal value as a 
                    <strong> registered letter with receipt confirmation</strong>. 
                    The difference? QERDS is faster, cheaper and offers even stronger 
                    cryptographic security.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-amber-600" />
                    How it Works
                  </h3>
                  <p className="text-muted-foreground">
                    When you send a document via QERDS, it is <strong>cryptographically 
                    sealed</strong> with a qualified timestamp. Upon receipt, 
                    irrefutable evidence is generated that complies with EU legislation.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why QERDS?</h2>
              <p className="text-lg text-muted-foreground">
                The benefits of legally binding document delivery
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qerdsFeatures.map((feature, index) => (
                <Card key={feature.title} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="p-3 rounded-xl bg-amber-100 w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 px-4">
          <div className="container max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">QERDS vs. Alternatives</h2>
              <p className="text-lg text-muted-foreground">
                See why QERDS is the only truly legally binding solution
              </p>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold">Regular Email</th>
                      <th className="text-center p-4 font-semibold">Legally Sealed PDF</th>
                      <th className="text-center p-4 font-semibold text-amber-600">QERDS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, index) => (
                      <tr key={row.feature} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center">{row.email}</td>
                        <td className="p-4 text-center">{row.pdf}</td>
                        <td className="p-4 text-center font-semibold text-amber-600">{row.qerds}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases</h2>
              <p className="text-lg text-muted-foreground">
                QERDS is essential for sectors where legal certainty is crucial
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {useCases.map((useCase) => (
                <Card key={useCase.title} className="p-5 hover:border-amber-300 transition-colors">
                  <h3 className="font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="container max-w-4xl mx-auto text-center">
            <Gem className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for Legally Binding Document Delivery?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              With the Legal plan you get 10 QERDS verifications per month. 
              Every document you send is 100% legally binding and valid throughout Europe.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-amber-50">
                <Link href="/signup/pro?plan=legal">
                  <Gem className="h-5 w-5 mr-2" />
                  Legal Plan - €79/month
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/contact">
                  Contact for Custom Solutions
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}