import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Shield, Scale } from "lucide-react";
import Link from "next/link";
export const ProtectionLevelSection = () => {
  return (
    <section className="py-20 sm:py-28 px-4 bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-14">
          Choose the level of proof that fits your case.
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Standard Card */}
          <Card className="p-6 sm:p-8 bg-background hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Mail className="h-8 w-8 text-slate-600" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-center mb-4">Secure Transfer & Logging</h3>

            <div className="flex-1 flex flex-col">
              <p className="font-semibold text-foreground mb-2">For everyday client files & correspondence.</p>
              <p className="text-muted-foreground text-sm sm:text-base mb-3">
                Send files with end-to-end encryption. Includes a detailed delivery receipt via email containing the
                recipient's IP address, device info, timestamp, and hash-check.
              </p>
              <p className="italic text-muted-foreground text-sm sm:text-base">
                Perfect for your own case administration.
              </p>
            </div>

            <div className="mt-6">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <Link href="/signup/pro?plan=standard">Choose Standard</Link>
              </Button>
            </div>
          </Card>

          {/* Professional Card */}
          <Card className="p-6 sm:p-8 bg-background hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-center mb-4">Certified Proof of Delivery</h3>

            <div className="flex-1 flex flex-col">
              <p className="font-semibold text-foreground mb-2">For critical deadlines & formal disputes.</p>
              <p className="text-muted-foreground text-sm sm:text-base mb-3">
                Includes everything in Standard, but upgrades the email receipt to a Tamper-Evident Sealed PDF. Signed
                with an AATL-certificate, ensuring the audit trail cannot be altered after issuance.
              </p>
              <p className="italic text-muted-foreground text-sm sm:text-base">Ready to submit as evidence.</p>
            </div>

            <div className="mt-6">
              <Button asChild size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <Link href="/signup/pro?plan=professional">Choose Professional</Link>
              </Button>
            </div>
          </Card>

          {/* Legal Card */}
          <Card className="p-6 sm:p-8 bg-background hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                <Scale className="h-8 w-8 text-amber-600" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-center mb-4">Irrefutable proof of delivery in court</h3>

            <div className="flex-1 flex flex-col">
              <p className="font-semibold text-foreground mb-2">For critical, high-stakes documents.</p>
              <p className="text-muted-foreground text-sm sm:text-base mb-3">
                Use QERDS credits for blockchain-validated, identity-verified evidence with the highest legal standing.
              </p>
              <p className="italic text-muted-foreground text-sm sm:text-base">Comparable to a Digital Notary Seal.</p>
            </div>

            <div className="mt-6">
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
              >
                <Link href="/signup/pro?plan=legal">Choose Legal</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};