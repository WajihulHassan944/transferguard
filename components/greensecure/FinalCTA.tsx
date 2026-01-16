import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

export const FinalCTA = () => {
  return (
    <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Start your free trial
        </h2>

        <Button asChild size="lg" className="bg-cta hover:bg-cta/90 text-white shadow-lg px-8 h-14 text-base">
          <Link href="/signup/pro?plan=professional">
            <Shield className="h-5 w-5 mr-2" />
            Try 14 days free
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>

        <p className="text-sm text-muted-foreground mt-4">No credit card required</p>
      </div>
    </section>
  );
};
