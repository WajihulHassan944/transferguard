import { FileText, AlertTriangle, Scale, Ban, CreditCard, HelpCircle } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 5, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <Scale className="h-6 w-6 text-primary" />
                Agreement to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using GreenSecure ("the Service"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our Service. These terms apply to all visitors, 
                users, and others who access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Description of Service</h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  GreenSecure provides a secure file transfer service that allows users to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Upload and share files with recipients via secure download links</li>
                  <li>Store files temporarily on EU-based servers</li>
                  <li>Access files through a personal dashboard (Pro accounts)</li>
                  <li>Collaborate with team members (Business accounts)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Account Registration</h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  Some features of the Service require you to create an account. When creating an account, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <Ban className="h-6 w-6 text-primary" />
                Prohibited Content and Uses
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  You agree not to use the Service to upload, share, or store:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Illegal content, including but not limited to child exploitation material</li>
                  <li>Malware, viruses, or other harmful software</li>
                  <li>Content that infringes on intellectual property rights</li>
                  <li>Stolen or unauthorized personal data</li>
                  <li>Content promoting violence, terrorism, or hate speech</li>
                  <li>Spam or unsolicited commercial communications</li>
                </ul>
                <p className="leading-relaxed">
                  We reserve the right to remove any content that violates these terms and to terminate 
                  accounts of repeat offenders without notice or refund.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
                Payments and Subscriptions
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed"><strong>Free Plan:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Transfer up to 5 GB per transfer</li>
                  <li>Files available for download for 7 days</li>
                  <li>No account required</li>
                </ul>
                
                <p className="leading-relaxed mt-4"><strong>Paid Plans (Pro and Business):</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Subscriptions are billed monthly or annually</li>
                  <li>Payments are non-refundable except as required by law</li>
                  <li>You may cancel at any time; access continues until the end of the billing period</li>
                  <li>We reserve the right to change pricing with 30 days notice</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content, features, and functionality are owned by GreenSecure 
                and are protected by international copyright, trademark, and other intellectual property laws. 
                You retain all rights to the files you upload. By using the Service, you grant us a limited 
                license to process and store your files solely for the purpose of providing the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-primary" />
                Limitation of Liability
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  To the maximum extent permitted by law, GreenSecure shall not be liable for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Any indirect, incidental, special, or consequential damages</li>
                  <li>Loss of data, revenue, or profits</li>
                  <li>Business interruption</li>
                  <li>Unauthorized access to or alteration of your transmissions or data</li>
                </ul>
                <p className="leading-relaxed">
                  Our total liability shall not exceed the amount you paid for the Service in the 
                  twelve months preceding the claim.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided "as is" and "as available" without warranties of any kind, 
                either express or implied, including but not limited to implied warranties of merchantability, 
                fitness for a particular purpose, and non-infringement. We do not warrant that the Service 
                will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless GreenSecure, its officers, directors, employees, 
                and agents from any claims, damages, losses, or expenses (including legal fees) arising 
                from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the Netherlands, 
                without regard to its conflict of law provisions. Any disputes arising from these Terms or 
                the Service shall be subject to the exclusive jurisdiction of the courts of Amsterdam, 
                The Netherlands.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of material 
                changes via email or by posting a notice on our website. Your continued use of the Service 
                after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, 
                without prior notice, for conduct that we believe violates these Terms or is harmful 
                to other users, us, or third parties, or for any other reason at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <HelpCircle className="h-6 w-6 text-primary" />
                Contact Us
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-muted/50 rounded-lg p-6">
                  <p><strong>GreenSecure B.V.</strong></p>
                  <p>Email: legal@greensecure.eu</p>
                  <p>Address: Amsterdam, The Netherlands</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

    </div>
  );
};

export default TermsOfService;
