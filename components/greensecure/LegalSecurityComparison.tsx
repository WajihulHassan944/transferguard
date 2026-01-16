import { Shield, FileCheck, Scale, Mail, Stamp } from "lucide-react";

export const LegalSecurityComparison = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What is the difference in legal security?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding the legal protection levels for your file transfers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Certified Delivery Card */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Certified Delivery</h3>
                <p className="text-sm text-muted-foreground">Standard on Professional & Legal</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              For every transfer, we generate an <strong className="text-foreground">Adobe Certified Audit Report</strong>. 
              This is not just a standard log file (which can be easily edited), but a digitally sealed document.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Anti-Tampering Guarantee</p>
                  <p className="text-sm text-muted-foreground">
                    The Adobe seal proves that the audit trail (including timestamps, IP addresses, and file hashes) 
                    has not been manipulated after issuance. If a single character is altered, the digital signature breaks immediately.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Legal Status</p>
                  <p className="text-sm text-muted-foreground">
                    Provides proof of integrity and delivery. You can prove the file existed at a specific time and hasn't been changed.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Comparable to:</span> Registered Mail
                </p>
              </div>
            </div>
          </div>

          {/* Qualified Validation Card */}
          <div className="bg-card rounded-2xl p-8 border-2 border-primary shadow-lg relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Highest Protection
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Stamp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Qualified Validation</h3>
                <p className="text-sm text-muted-foreground">Legal plan only</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              For your most critical, high-stakes documents, you can use your <strong className="text-foreground">QERDS credits</strong>. 
              This process validates the transaction via the blockchain and links it to strict identity verification standards.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Identity Guarantee</p>
                  <p className="text-sm text-muted-foreground">
                    While the Adobe Report proves integrity (the file is untouched), QERDS indisputably proves identity 
                    (who exactly sent and received it).
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Legal Status</p>
                  <p className="text-sm text-muted-foreground">
                    Provides the highest possible evidentiary value in court. It shifts the burden of proof, 
                    making the evidence nearly impossible to refute.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Stamp className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Comparable to:</span> A Digital Notary Seal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
