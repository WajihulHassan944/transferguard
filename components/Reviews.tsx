import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import sarahImage from "@/assets/review-sarah.jpg";
import marcusImage from "@/assets/review-marcus.jpg";
import elenaImage from "@/assets/review-elena.jpg";

const reviews = [
  {
    name: "Sarah Mitchell",
    role: "Professional Photographer",
    image: sarahImage,
    rating: 5,
    text: "Absolutely stunning results! I've transformed dozens of my landscape photos into Van Gogh style artworks. The quality is museum-worthy and my clients love the unique artistic touch."
  },
  {
    name: "Marcus Chen",
    role: "Art Gallery Owner",
    image: marcusImage,
    rating: 5,
    text: "As someone who works with fine art daily, I'm impressed by the authentic style reproduction. The Monet transformations especially capture that impressionistic quality beautifully."
  },
  {
    name: "Elena Rodriguez",
    role: "Interior Designer",
    image: elenaImage,
    rating: 5,
    text: "Perfect for creating custom artwork for my clients' spaces. The Herman Brood style adds such vibrant energy to any room. Fast processing and consistently excellent results."
  }
];

export const Reviews = () => {
  return (
    <section className="py-20 px-4 bg-card/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by Artists & Photographers
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of satisfied users creating stunning artworks
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <Card 
              key={index} 
              className="p-6 bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-all hover:shadow-artistic animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <img 
                 src={review.image.src} 
                  alt={review.name}
                  className="w-12 h-12 rounded-full bg-muted object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-bold">{review.name}</h4>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                "{review.text}"
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
