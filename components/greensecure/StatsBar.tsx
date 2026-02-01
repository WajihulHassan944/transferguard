import { useCountUp } from "@/hooks/useCountUp";

const stats = [
  { end: 95, suffix: "%", label: "verified on the first try" },
  { end: 6, suffix: "", label: "second verification" },
  { end: 12, suffix: "K+", label: "documents supported" },
  { end: 230, suffix: "", label: "countries supported" },
];

export const StatsBar = () => {
  return (
    <section className="py-16 lg:py-20">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-center mb-10">
          Instant Global Identity Verification
        </h2>
      </div>
      <div className="bg-primary py-10 lg:py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {stats.map((stat, index) => (
              <StatItem key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatItem = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { displayValue, elementRef } = useCountUp({
    end,
    duration: 2000,
    decimals: 0,
    suffix,
  });

  return (
    <div 
      ref={elementRef}
      className="flex items-center gap-4 lg:justify-center"
    >
      <div className="w-1 h-12 bg-primary-foreground/30 rounded-full" />
      <div>
        <p className="text-3xl lg:text-4xl font-bold text-primary-foreground tracking-tight">
          {displayValue}
        </p>
        <p className="text-sm text-primary-foreground/80">{label}</p>
      </div>
    </div>
  );
};
