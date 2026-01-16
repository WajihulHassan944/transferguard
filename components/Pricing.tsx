import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Starter Pack",
    credits: 10,
    price: 9.99,
    popular: false,
    features: [
      "10 photo transformations",
      "All artistic styles",
      "High-resolution output",
      "No watermarks",
      "Credits never expire"
    ]
  },
  {
    name: "Creative Pack",
    credits: 50,
    price: 39.99,
    popular: true,
    features: [
      "50 photo transformations",
      "All artistic styles",
      "High-resolution output",
      "No watermarks",
      "Credits never expire",
      "Priority processing",
      "20% savings"
    ]
  },
  {
    name: "Professional Pack",
    credits: 100,
    price: 69.99,
    popular: false,
    features: [
      "100 photo transformations",
      "All artistic styles",
      "High-resolution output",
      "No watermarks",
      "Credits never expire",
      "Priority processing",
      "30% savings",
      "Early access to new styles"
    ]
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20 px-4 bg-card/30 backdrop-blur-sm scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Pay per credit, use when you need. No subscriptions, no hidden fees.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index}
              className={`p-8 bg-card/80 backdrop-blur-sm border-2 transition-all hover:shadow-artistic relative ${
                plan.popular 
                  ? "border-primary shadow-glow scale-105" 
                  : "border-border hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-hero px-6 py-2 rounded-full">
                  <span className="text-sm font-bold text-primary-foreground">Most Popular</span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold">${plan.price}</span>
                </div>
                <p className="text-muted-foreground">
                  {plan.credits} credits • ${(plan.price / plan.credits).toFixed(2)} per credit
                </p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? "bg-primary hover:bg-primary-glow shadow-glow" 
                    : "bg-primary/80 hover:bg-primary"
                }`}
                size="lg"
                asChild
              >
                <Link href="/convert">
                  Get Started
                </Link>
              </Button>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Need more credits? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for custom enterprise packages.
          </p>
        </div>
      </div>
    </section>
  );
};
