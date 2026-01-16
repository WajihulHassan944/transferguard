import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ArtStyle = "van-gogh" | "monet" | "herman-brood";

interface StyleSelectorProps {
  selectedStyle: ArtStyle | null;
  onStyleSelect: (style: ArtStyle) => void;
}

const styles = [
  {
    id: "van-gogh" as ArtStyle,
    name: "Van Gogh",
    description: "Expressionistic brushstrokes with vibrant colors",
    color: "from-yellow-500 via-orange-500 to-blue-600",
  },
  {
    id: "monet" as ArtStyle,
    name: "Monet",
    description: "Impressionistic softness with water-like effects",
    color: "from-green-400 via-cyan-400 to-blue-500",
  },
  {
    id: "herman-brood" as ArtStyle,
    name: "Herman Brood",
    description: "Bold colors and energetic rock 'n roll art",
    color: "from-pink-500 via-purple-500 to-purple-600",
  },
];

export const StyleSelector = ({ selectedStyle, onStyleSelect }: StyleSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-bold text-center mb-8">Choose Your Artistic Style</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {styles.map((style) => (
          <Card
            key={style.id}
            onClick={() => onStyleSelect(style.id)}
            className={cn(
              "p-6 cursor-pointer transition-all duration-300 hover:shadow-artistic bg-card border-2",
              selectedStyle === style.id
                ? "border-primary shadow-glow scale-105"
                : "border-border hover:scale-102 hover:border-primary/50"
            )}
          >
            <div className={cn("h-40 rounded-lg bg-gradient-to-br mb-4", style.color)} />
            <h4 className="text-xl font-bold mb-2">{style.name}</h4>
            <p className="text-sm text-muted-foreground">{style.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
