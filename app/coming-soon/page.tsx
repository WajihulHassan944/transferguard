import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Clock, Bell } from "lucide-react";
import { toast } from "sonner";
import { baseUrl } from "@/const";
const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email.trim()) {
    toast.error("Please enter your email");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address");
    return;
  }

  try {
    setIsSubmitting(true);

    const response = await fetch(`${baseUrl}/subscribers/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        toast.error("You are already on the waitlist!");
      } else {
        toast.error(data.message || "Something went wrong");
      }
      return;
    }

    toast.success("You've been added to the waitlist 🎉");
    setEmail("");

  } catch (error) {
    console.error("Subscribe error:", error);
    toast.error("Server error. Please try again later.");
  } finally {
    setIsSubmitting(false);
  }
};
  const badges = [
    { logo: "/assets/sovereign-eu-cloud-logo.png", name: "100% EU Data", description: "Storage & Processing" },
    { logo: "/assets/gdpr-logo.png", name: "GDPR", description: "Compliant" },
    { logo: "/assets/iso27001-logo.png", name: "ISO 27001", description: "Certified Infrastructure" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 secure-pattern opacity-30" />
      
      <div className="relative z-10 max-w-3xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src="/assets/transferguard-logo-new.png" 
            alt="TransferGuard" 
            className="h-24 sm:h-28 w-auto"
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          <span>Coming Soon</span>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Legal proof for
            <span className="block text-primary">every file transfer</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
            TransferGuard provides court-admissible evidence for all your file transfers. 
            Be the first to know when we go live.
          </p>
        </div>

        {/* Email Signup */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 border border-border bg-background"
              required
            />
          </div>
        <Button 
  type="submit" 
  size="lg" 
  className="h-12 bg-cta hover:bg-cta/90 text-white"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    "Submitting..."
  ) : (
    <>
      <Bell className="w-4 h-4 mr-2" />
      Notify me
    </>
  )}
</Button>
        </form>

        {/* Compliance Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-8">
          {badges.map((badge, index) => (
            <div 
              key={index}
              className="bg-muted/50 rounded-xl p-4 flex items-center gap-3 w-full sm:w-auto sm:min-w-[180px]"
            >
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <img src={badge.logo} alt={badge.name} className="w-10 h-10 object-contain" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-sm whitespace-nowrap">{badge.name}</h3>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-sm text-muted-foreground pt-8">
          © 2026 TransferGuard. A brand of PVG Technologies B.V. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
