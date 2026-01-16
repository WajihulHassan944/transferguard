import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the credit system work?",
    answer: "Each photo transformation costs 1 credit. You can purchase credits in packages, and they never expire. Credits are deducted only after a successful transformation."
  },
  {
    question: "What image formats are supported?",
    answer: "We support all major image formats including JPG, JPEG, PNG, and WEBP. Maximum file size is 10MB per image."
  },
  {
    question: "How long does a transformation take?",
    answer: "Most transformations are completed within 30-60 seconds. During high demand periods, it may take slightly longer, but you'll always receive your artwork quickly."
  },
  {
    question: "Can I use the transformed images commercially?",
    answer: "Yes! Once you've transformed an image, you have full rights to use it for any purpose, including commercial use. There are no watermarks or restrictions."
  },
  {
    question: "What artistic styles are available?",
    answer: "Currently, we offer three legendary artistic styles: Van Gogh (expressive post-impressionism), Monet (soft impressionism), and Herman Brood (bold rock 'n roll art). More styles are coming soon!"
  },
  {
    question: "What happens if I'm not satisfied with the result?",
    answer: "If you're not satisfied with a transformation, contact our support team within 24 hours. We'll review your case and may offer a credit refund or a free retry."
  },
  {
    question: "Do credits expire?",
    answer: "No! Your credits never expire. Purchase them once and use them whenever you need, whether that's tomorrow or next year."
  },
  {
    question: "Can I get a refund on unused credits?",
    answer: "We offer refunds on unused credits within 30 days of purchase. Simply contact our support team with your purchase details."
  },
  {
    question: "Is there a subscription option?",
    answer: "Currently, we operate on a pay-per-use credit system with no subscriptions. This gives you complete flexibility to use the service only when you need it, without recurring fees."
  },
  {
    question: "How do I download my transformed artwork?",
    answer: "After your transformation is complete, simply click the 'Download Artwork' button. Your image will be saved in high-resolution PNG format, perfect for printing or digital use."
  }
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-20 px-4 scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about Art Transform
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card/80 backdrop-blur-sm border-2 border-border rounded-lg px-6 hover:border-primary/50 transition-all"
            >
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
