import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

const content = {
  en: {
    title: "Receive legal proof with every download",
    subtitle: "Get to know the Certified Delivery plan with no obligations.",
    cta: "Try 14 Days Free",
  },
  nl: {
    title: "Ontvang een sluitend bewijsdossier bij elke download.",
    subtitle: "Maak geheel vrijblijvend kennis met het Certified Delivery plan.",
    cta: "Probeer nu 14 dagen gratis",
  },
};

export const FinalCTA = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { language } = useLanguage();
  const c = content[language];

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 bg-primary rounded-t-[2rem] sm:rounded-t-[3rem]">
      <div className={`container max-w-4xl mx-auto text-center scroll-animate-scale ${isVisible ? "is-visible" : ""}`}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">{c.title}</h2>
        <p className="text-lg text-white/70 mb-8">{c.subtitle}</p>

        <Button asChild size="lg" className="bg-cta hover:bg-cta/90 text-white shadow-lg px-8 h-14 text-base group">
          <Link href="/signup/pro?plan=professional">
            <Shield className="h-5 w-5 mr-2" />
            {c.cta}
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
