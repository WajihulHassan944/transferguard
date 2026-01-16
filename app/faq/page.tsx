import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, Shield, Send, CreditCard, Users, Lock, FileCheck, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const faqCategories = [
  {
    icon: Send,
    title: "Secure Document Transfer",
    questions: [
      {
        question: "How large can my files be?",
        answer: "You can send files up to 10GB per transfer. With a Pro subscription, you get 1TB monthly transfer volume for your business needs."
      },
      {
        question: "How long are my documents available for download?",
        answer: "Documents are automatically deleted after 7, 30, or 90 days - you choose when creating the transfer. We are not a storage platform; we focus on secure, temporary document delivery."
      },
      {
        question: "What is a dossier number?",
        answer: "A dossier number is optional metadata you can add to your transfers for easy organization. This is useful for lawyers, accountants, and professionals who work with case files or client dossiers."
      },
      {
        question: "Can I reshare a document with a new recipient?",
        answer: "Yes! From your dashboard, you can reshare any transfer to a new recipient with a new expiry date, without re-uploading the files."
      },
      {
        question: "What file types can I send?",
        answer: "You can send any file type including PDFs, Word documents, images, videos, and archives. There are no restrictions on file types."
      }
    ]
  },
  {
    icon: Shield,
    title: "QERDS Verification",
    questions: [
      {
        question: "What is QERDS?",
        answer: "QERDS (Qualified Electronic Registered Delivery Service) is an EU-certified standard under the eIDAS regulation. It provides legally binding, court-admissible proof of delivery that is recognized across all EU member states."
      },
      {
        question: "Why is QERDS important?",
        answer: "QERDS provides the highest level of legal certainty for document delivery. Unlike regular email or file sharing, QERDS verification creates irrefutable evidence that cannot be denied in court proceedings."
      },
      {
        question: "Is QERDS included in all plans?",
        answer: "Yes! QERDS verification is included in all plans. You get legally binding proof of delivery with every transfer."
      },
      {
        question: "How does QERDS work?",
        answer: "When you send a transfer with QERDS, the recipient must verify their identity before downloading. This creates a legally binding timestamp and verification record that serves as court-admissible proof of delivery."
      }
    ]
  },
  {
    icon: FileCheck,
    title: "Delivery Certificates",
    questions: [
      {
        question: "What is a delivery certificate?",
        answer: "A delivery certificate is a legally valid PDF document that proves a recipient downloaded your documents. It includes timestamp, IP address, location data, and verification details."
      },
      {
        question: "When do I receive a certificate?",
        answer: "Certificates are automatically generated when the recipient downloads the files. You can download them anytime from your dashboard under 'Certificates'."
      },
      {
        question: "Are delivery certificates legally valid?",
        answer: "Yes, our certificates include all necessary information (timestamp, IP, geolocation) to serve as proof of delivery in legal proceedings. Many law firms and notaries use our certificates."
      },
      {
        question: "Do I need 2FA verification for certificates?",
        answer: "For the strongest legal proof, we recommend enabling Email 2FA verification. This adds identity verification to your certificate, making it irrefutable proof that the correct person received the documents."
      }
    ]
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    questions: [
      {
        question: "How secure is Share Compliant?",
        answer: "We use AES-256 end-to-end encryption for all file transfers. Your files are encrypted before leaving your device and can only be decrypted by the intended recipient."
      },
      {
        question: "Where is my data stored?",
        answer: "All data is stored exclusively on servers within the European Union (Netherlands and Germany) with geo-redundant backups across multiple EU locations. This ensures GDPR compliance and full data sovereignty."
      },
      {
        question: "Can people outside the EU upload and download files?",
        answer: "Yes, users from anywhere in the world can upload and download files. However, transfers from outside the EU may be slightly slower due to the physical distance to our EU servers. Privacy is our top priority — that's why we keep all data and servers exclusively within the EU, never outside."
      },
      {
        question: "Can you access my files?",
        answer: "No. With end-to-end encryption, only you and your recipients can access the file contents. We cannot view, access, or share your files."
      },
      {
        question: "What is the 'Instant Revoke' feature?",
        answer: "If you accidentally send documents to the wrong person or need to immediately disable access, you can instantly revoke any transfer from your dashboard. The download link becomes invalid immediately."
      },
      {
        question: "What happens to files after they expire?",
        answer: "Files are permanently deleted from our servers after the expiry date (7, 30, or 90 days). We do not keep any copies. This is by design - we are not a storage platform."
      }
    ]
  },
  {
    icon: Users,
    title: "Client Upload Portals",
    questions: [
      {
        question: "What is a Client Upload Portal?",
        answer: "A Client Upload Portal is a personalized, secure link you can share with clients so they can upload documents to you. Perfect for collecting tax documents, contracts, or any sensitive files."
      },
      {
        question: "Can I restrict who can upload?",
        answer: "Yes! You can enable Email 2FA verification on upload portals. Only clients who verify their email can upload documents, ensuring the right person is sending you files."
      },
      {
        question: "Can I add my own branding?",
        answer: "Pro subscribers can customize upload portals with their own logo and brand colors, providing a professional experience for clients."
      },
      {
        question: "How do I know when clients upload documents?",
        answer: "You'll receive notifications in your dashboard when new submissions arrive. All uploads appear automatically in your 'Submissions' view for each portal."
      }
    ]
  },
  {
    icon: CreditCard,
    title: "Pricing & Plans",
    questions: [
      {
        question: "Is there a free trial?",
        answer: "Yes! You can try Pro free for 14 days with full access to all features including Legally Sealed PDF. Cancel anytime during the trial period."
      },
      {
        question: "What's included in the Starter plan (€19/month)?",
        answer: "Starter includes 1 TB EU geo-redundant storage, 10 GB max file size, end-to-end encryption, Client Upload Portal with custom branding, 2FA verification, and Level 1: Basic Log."
      },
      {
        question: "What's included in the Professional plan (€35/month)?",
        answer: "Professional includes everything in Starter plus: 2 TB EU geo-redundant storage, 50 GB max file size, Level 2: Certified Delivery with Adobe Certified PDF audit trail, anti-tamper seal with timestamp, and priority support. Provides proof of integrity comparable to Registered Mail."
      },
      {
        question: "What's included in the Legal plan (€79/month)?",
        answer: "Legal includes everything in Professional plus: 5 TB EU geo-redundant storage, 100 GB max file size, Level 3: Qualified Validation with QERDS blockchain verification. Includes 10 QERDS credits per month for irrefutable proof. Provides identity guarantee comparable to a Digital Notary - fully court-admissible."
      },
      {
        question: "What is the Legally Sealed PDF?",
        answer: "The Legally Sealed PDF is a certified document with an Adobe green checkmark that proves your files were delivered. It includes timestamp, IP address, and verification details - providing legal proof that the recipient received your documents."
      },
      {
        question: "Can I cancel anytime?",
        answer: "Absolutely. Cancel anytime with no questions asked. You'll keep access until the end of your billing period."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard), Apple Pay, Google Pay, and SEPA bank transfers."
      }
    ]
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center px-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow">
        <div className="container max-w-4xl px-4 py-16">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about Share Compliant. Can't find what you're looking for? 
              <Link href="/contact" className="text-primary hover:underline ml-1">Contact us</Link>.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <div key={category.title} className="rounded-xl border border-border/50 bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, index) => (
                    <AccordionItem key={index} value={`${category.title}-${index}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center p-8 rounded-xl bg-muted/50 border border-border/50">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you with any questions.
            </p>
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
