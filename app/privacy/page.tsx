import { Shield, Lock, Server, Eye, Trash2, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 5, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-primary" />
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At GreenSecure, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our file transfer service. 
                We are committed to protecting your personal data in accordance with the General Data 
                Protection Regulation (GDPR) and other applicable EU privacy laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <Server className="h-6 w-6 text-primary" />
                Data We Collect
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  We collect the following types of information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Email address, name, and company name (if provided) when you create an account.</li>
                  <li><strong>Transfer Information:</strong> Sender and recipient email addresses, file names, file sizes, and optional messages included with transfers.</li>
                  <li><strong>Usage Data:</strong> Information about how you use our service, including IP addresses, browser type, and access times.</li>
                  <li><strong>File Data:</strong> The files you upload for transfer. These are encrypted and stored temporarily on EU-based servers.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-primary" />
                How We Protect Your Data
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>End-to-End Encryption:</strong> All files are encrypted during upload, storage, and download using AES-256 encryption.</li>
                  <li><strong>EU-Only Storage:</strong> All data is stored exclusively on servers located within the European Union.</li>
                  <li><strong>Secure Transmission:</strong> All data transfers use TLS 1.3 encryption.</li>
                  <li><strong>Access Controls:</strong> Strict access controls ensure only authorized personnel can access our systems.</li>
                  <li><strong>Regular Audits:</strong> We conduct regular security audits and penetration testing.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <Trash2 className="h-6 w-6 text-primary" />
                Data Retention
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  We retain your data only for as long as necessary:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Transferred Files:</strong> Files are automatically deleted 7 days after upload, or immediately after download (depending on your settings).</li>
                  <li><strong>Account Data:</strong> Retained for the duration of your account. You can request deletion at any time.</li>
                  <li><strong>Usage Logs:</strong> Anonymized after 90 days and deleted after 1 year.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Your Rights Under GDPR</h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  As an EU resident, you have the following rights:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Right to Access:</strong> Request a copy of your personal data.</li>
                  <li><strong>Right to Rectification:</strong> Request correction of inaccurate data.</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data.</li>
                  <li><strong>Right to Portability:</strong> Receive your data in a structured, machine-readable format.</li>
                  <li><strong>Right to Object:</strong> Object to processing of your personal data.</li>
                  <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use only essential cookies required for the functioning of our service. 
                We do not use tracking cookies or share data with third-party advertisers. 
                Essential cookies help us maintain your session and remember your preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use trusted third-party services for payment processing and email delivery. 
                These providers are GDPR-compliant and process data only as necessary to perform their services. 
                We never sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-primary" />
                Contact Us
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy or wish to exercise your rights, 
                  please contact our Data Protection Officer:
                </p>
                <div className="bg-muted/50 rounded-lg p-6">
                  <p><strong>GreenSecure B.V.</strong></p>
                  <p>Data Protection Officer</p>
                  <p>Email: privacy@greensecure.eu</p>
                  <p>Address: Amsterdam, The Netherlands</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                We encourage you to review this Privacy Policy periodically.
              </p>
            </section>
          </div>
        </div>
      </main>

    </div>
  );
};

export default PrivacyPolicy;
