import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

const faqsData = {
  en: [
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
      question: "How does Identity Verification work?",
      answer:
        "With the Legal plan, the recipient must verify their identity using a government-issued ID (passport, ID card, or driver's license) and a live biometric selfie. This creates proof of exactly who received your documents, combined with timestamp, file hash, IP address, and device fingerprint.",
    },
    {
      question: "Is there a file size limit?",
      answer:
        "Professional plan supports files up to 25GB each, and Legal plan supports files up to 100GB each. There is no limit on the number of files per transfer.",
    },
    {
      question: "How secure are my files?",
      answer:
        "All files are end-to-end encrypted with AES-256 encryption. Files are automatically deleted after the set expiration date.",
    },
    {
      question: "Can I try TransferGuard for free?",
      answer: "Yes! There is a 14-day free trial available for both plans. No credit card required.",
    },
    {
      question: "Which devices can be used for Identity Verification?",
      answer:
        "Recipients can verify their identity using a computer webcam or a smartphone camera. With a smartphone, the NFC chip in the ID document can also be read for the highest possible level of legal evidence.",
    },
    {
      question: "How does TransferGuard help with my burden of proof as a lawyer?",
      answer:
        "As a lawyer, you often need to prove that a document was actually received by the right person. TransferGuard generates an Adobe-certified PDF report with a qualified timestamp, SHA-256 file hash, IP logging, and device fingerprint. With the Legal plan, this is supplemented with biometric identity verification (passport + live selfie), giving you irrefutable proof of who received what, when, and how.",
    },
    {
      question: "Is TransferGuard's evidence legally valid in court?",
      answer:
        "TransferGuard is designed to generate strong circumstantial evidence that is usable in court proceedings. Each piece of evidence is sealed with a qualified timestamp via Sectigo, recorded in an Adobe-certified report that cannot be tampered with. Combined with biometric ID verification on the Legal plan, this creates an irrefutable chain of evidence.",
    },
    {
      question: "What is the difference between registered mail and TransferGuard?",
      answer:
        "A registered letter only proves that something was delivered to an address, not that the right person received or opened it. TransferGuard goes much further: you have proof that the specific file was downloaded, by whom (with ID verification), at what time (qualified timestamp), from which device and IP address, and that the file was not altered (SHA-256 hash). This provides significantly stronger evidence.",
    },
    {
      question: "Can I use TransferGuard for sending summons or formal notices?",
      answer:
        "Yes, TransferGuard is ideally suited for sending legal documents such as summons, formal notices, default notices, and contracts. The platform generates a complete evidence dossier for each transfer with timestamp, proof of receipt, and optional identity verification. All data remains 100% within the EU on our own infrastructure, fully GDPR compliant.",
    },
    {
      question: "How does TransferGuard differ from WeTransfer or email for legal documents?",
      answer:
        "WeTransfer and standard email provide no conclusive legal proof of receipt. If the recipient denies it, you're left empty-handed. There is no timestamp from an independent party, no file integrity check, and no identity verification of the recipient. TransferGuard offers all of this: end-to-end encryption, qualified timestamps, SHA-256 file hash, and with the Legal plan biometric ID verification. Moreover, everything runs on 100% EU infrastructure, free from the US Cloud Act.",
    },
  ],
  nl: [
    {
      question: "Wat is TransferGuard?",
      answer:
        "TransferGuard is een veilig platform voor het versturen van gevoelige documenten met juridisch bewijs van ontvangst. Ideaal voor advocaten, notarissen en bedrijven die zekerheid nodig hebben.",
    },
    {
      question: "Waarom heb ik veilige bestandsoverdracht nodig?",
      answer:
        "Bij gevoelige documenten zoals contracten, juridische dossiers of financiële gegevens wilt u zekerheid dat de ontvanger het heeft ontvangen en dit niet kan ontkennen. Onze certificaten bieden juridisch bewijs.",
    },
    {
      question: "Hoe werkt Identiteitsverificatie?",
      answer:
        "Met het Verified Identity abonnement moet de ontvanger zijn identiteit verifiëren met een officieel identiteitsbewijs (paspoort, ID-kaart of rijbewijs) en een live biometrische selfie. Dit creëert bewijs van precies wie uw documenten heeft ontvangen, gecombineerd met tijdstempel, bestandshash, IP-adres en apparaatvingerafdruk.",
    },
    {
      question: "Is er een bestandsgroottelimiet?",
      answer:
        "Het Certified Delivery abonnement ondersteunt bestanden tot 50GB per stuk, en het Verified Identity abonnement ondersteunt bestanden tot 100GB per stuk. Er is geen limiet op het aantal bestanden per overdracht.",
    },
    {
      question: "Hoe veilig zijn mijn bestanden?",
      answer:
        "Alle bestanden zijn end-to-end versleuteld met AES-256 encryptie. Bestanden worden automatisch verwijderd na de ingestelde vervaldatum.",
    },
    {
      question: "Kan ik TransferGuard gratis uitproberen?",
      answer: "Ja! Er is een 14-dagen gratis proefperiode beschikbaar voor beide abonnementen. Geen creditcard nodig.",
    },
    {
      question: "Met welke apparaten kunnen personen zich identificeren?",
      answer:
        "Ontvangers kunnen zich identificeren met de webcam op een computer of de camera op een smartphone. Via de smartphone kan tevens de NFC-chip in het identiteitsbewijs worden uitgelezen voor de hoogst mogelijke juridische bewijskracht.",
    },
    {
      question: "Hoe helpt TransferGuard bij mijn bewijslast als advocaat?",
      answer:
        "Als advocaat moet u vaak aantonen dat een document daadwerkelijk is ontvangen door de juiste persoon. TransferGuard genereert een Adobe-gecertificeerd PDF-rapport met gekwalificeerde tijdstempel, SHA-256 bestandshash, IP-logging en apparaatvingerafdruk. Met het Verified Identity abonnement wordt dit aangevuld met biometrische identiteitsverificatie (paspoort + live selfie), waardoor u onweerlegbaar bewijs heeft van wie, wat, wanneer en hoe heeft ontvangen.",
    },
    {
      question: "Is het bewijs van TransferGuard rechtsgeldig in de rechtbank?",
      answer:
        "TransferGuard is ontworpen om sterke bewijskracht te genereren die bruikbaar is in gerechtelijke procedures. Elk bewijs wordt verzegeld met een gekwalificeerde tijdstempel via Sectigo, vastgelegd in een Adobe-gecertificeerd rapport dat niet kan worden gemanipuleerd. In combinatie met biometrische ID-verificatie bij het Verified Identity abonnement creëert dit een onweerlegbare bewijsketen.",
    },
    {
      question: "Wat is het verschil tussen een aangetekende brief en TransferGuard?",
      answer:
        "Een aangetekende brief bewijst alleen dat er iets is afgeleverd op een adres, niet dat de juiste persoon het heeft ontvangen of geopend. TransferGuard gaat veel verder: u heeft bewijs dat het specifieke bestand is gedownload, door wie (met ID-verificatie), op welk moment (gekwalificeerde tijdstempel), vanaf welk apparaat en IP-adres, en dat het bestand niet is gewijzigd (SHA-256 hash). Dit biedt aanzienlijk sterkere bewijskracht.",
    },
    {
      question: "Kan ik TransferGuard gebruiken voor het verzenden van dagvaardingen, sommaties of notariële aktes?",
      answer:
        "Ja, TransferGuard is bij uitstek geschikt voor de advocatuur en het notariaat. Verstuur juridische documenten zoals dagvaardingen, sommaties, ingebrekestellingen, contracten en notariële aktes. Het platform genereert voor elke verzending een compleet bewijsdossier met tijdstempel, ontvangstbewijs en optioneel identiteitsverificatie. Alle data blijft 100% binnen de EU op onze eigen infrastructuur, volledig conform de AVG.",
    },
    {
      question: "Hoe verschilt TransferGuard van WeTransfer of e-mail voor juridische documenten?",
      answer:
        "WeTransfer en standaard e-mail leveren geen sluitend juridisch bewijs van ontvangst. Als de ontvanger ontkent, staat u met lege handen. Er is geen tijdstempel van een onafhankelijke partij, geen integriteitscontrole van het bestand, en geen identiteitsverificatie van de ontvanger. TransferGuard biedt dit allemaal: end-to-end encryptie, gekwalificeerde tijdstempels, SHA-256 bestandshash, en met het Verified Identity abonnement biometrische ID-verificatie. Bovendien draait alles op 100% EU-infrastructuur, vrij van de US Cloud Act.",
    },
  ],
};

const sectionContent = {
  en: {
    label: "FAQ",
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about TransferGuard",
  },
  nl: {
    label: "FAQ",
    title: "Veelgestelde Vragen",
    subtitle: "Alles wat u moet weten over TransferGuard",
  },
};

export const FAQSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const { language } = useLanguage();

  const faqs = faqsData[language];
  const content = sectionContent[language];

  return (
    <section ref={ref} className="py-16 lg:py-20 px-4 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <div className={`text-center mb-14 scroll-animate ${isVisible ? "is-visible" : ""}`}>
          <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-4">{content.label}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">{content.title}</h2>
          <p className="text-lg text-muted-foreground">{content.subtitle}</p>
        </div>

        <div
          className={`grid md:grid-cols-2 gap-x-12 gap-y-0 scroll-animate ${isVisible ? "is-visible" : ""}`}
          style={{ transitionDelay: "150ms" }}
        >
          {/* Left column */}
          <Accordion type="single" collapsible className="space-y-0">
            {faqs.slice(0, 6).map((faq, index) => (
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
            {faqs.slice(6, 12).map((faq, index) => (
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
