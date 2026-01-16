import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is TransferGuard?",
    answer:
      "TransferGuard is a secure platform for sending sensitive documents with legal proof of receipt. Ideal for lawyers, notaries, and businesses that need certainty.",
  },
  {
    question: "Why do I need secure file transfer?",
    answer:
      "With sensitive documents like contracts, legal files, or financial records, you want certainty that the recipient has received it and cannot deny it. Our certificates provide legal proof.",
  },
  {
    question: "How does Qualified Validation work?",
    answer:
      "With Qualified Validation, each file is validated using QERDS technology, including blockchain registration and identity verification. This gives you the highest level of legal proof.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "No, you can send files up to 100GB. There is no limit on the number of files per transfer, perfect for large dossiers.",
  },
  {
    question: "How secure are my files?",
    answer:
      "All files are end-to-end encrypted with AES-256 encryption. Files are automatically deleted after the set expiration date.",
  },
  {
    question: "Can I try TransferGuard for free?",
    answer: "Yes! There is a 14-day free trial available for the professional plan.",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">Frequently Asked Questions about TransferGuard</h2>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-0">
          {/* Left column */}
          <Accordion type="single" collapsible className="space-y-0">
            {faqs.slice(0, 3).map((faq, index) => (
              <AccordionItem key={index} value={`left-${index}`} className="border-b border-border/50 py-2">
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-primary hover:no-underline py-4 [&>svg]:text-primary [&>svg]:h-5 [&>svg]:w-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Right column */}
          <Accordion type="single" collapsible className="space-y-0">
            {faqs.slice(3, 6).map((faq, index) => (
              <AccordionItem key={index} value={`right-${index}`} className="border-b border-border/50 py-2">
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-primary hover:no-underline py-4 [&>svg]:text-primary [&>svg]:h-5 [&>svg]:w-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
