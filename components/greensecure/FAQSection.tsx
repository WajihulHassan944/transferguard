import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    question: "What is TransferGuard?",
    answer: "TransferGuard is a secure platform for sending sensitive documents with legal proof of receipt. Ideal for lawyers, notaries, and businesses that need certainty.",
  },
  {
    question: "Why do I need secure file transfer?",
    answer: "With sensitive documents like contracts, legal files, or financial records, you want certainty that the recipient has received it and cannot deny it. Our certificates provide legal proof.",
  },
  {
    question: "How does Identity Verification work?",
    answer: "With the Legal plan, the recipient must verify their identity using a government-issued ID (passport, ID card, or driver's license) and a live biometric selfie. This creates proof of exactly who received your documents, combined with timestamp, file hash, IP address, and device fingerprint.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Professional plan supports files up to 50GB each, and Legal plan supports files up to 100GB each. There is no limit on the number of files per transfer.",
  },
  {
    question: "How secure are my files?",
    answer: "All files are end-to-end encrypted with AES-256 encryption. Files are automatically deleted after the set expiration date.",
  },
  {
    question: "Can I try TransferGuard for free?",
    answer: "Yes! There is a 14-day free trial available for both plans. No credit card required.",
  },
];

export const FAQSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <div className={`text-center mb-14 scroll-animate ${isVisible ? 'is-visible' : ''}`}>
          <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-4">FAQ</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about TransferGuard
          </p>
        </div>

        <div className={`grid md:grid-cols-2 gap-x-12 gap-y-0 scroll-animate ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '150ms' }}>
          {/* Left column */}
          <Accordion type="single" collapsible className="space-y-0">
            {faqs.slice(0, 3).map((faq, index) => (
              <AccordionItem key={index} value={`left-${index}`} className="border-b border-border py-2">
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-primary hover:no-underline py-5 [&>svg]:text-primary [&>svg]:h-5 [&>svg]:w-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Right column */}
          <Accordion type="single" collapsible className="space-y-0">
            {faqs.slice(3, 6).map((faq, index) => (
              <AccordionItem key={index} value={`right-${index}`} className="border-b border-border py-2">
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-primary hover:no-underline py-5 [&>svg]:text-primary [&>svg]:h-5 [&>svg]:w-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
