import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Link from "next/link";

export const FinalCTA = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 bg-primary rounded-t-[2rem] sm:rounded-t-[3rem]">
      <div className={`container max-w-2xl mx-auto text-center scroll-animate-scale ${isVisible ? 'is-visible' : ''}`}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
          Start your 14 day free trial
        </h2>
        <p className="text-lg text-white/70 mb-8">
          No credit card required. Cancel anytime.
        </p>

        <Button asChild size="lg" className="bg-cta hover:bg-cta/90 text-white shadow-lg px-8 h-14 text-base group">
          <Link href="/signup/pro?plan=professional">
            <Shield className="h-5 w-5 mr-2" />
            Send with Legal Proof
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
