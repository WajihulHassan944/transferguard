'use client'
import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {  DashboardViewSidebar } from "@/components/dashboard/DashboardSidebar";
import { TransfersPanel } from "@/components/dashboard/TransfersPanel";
import { CertificatesPanel } from "@/components/dashboard/CertificatesPanel";
import { ContactsPanel } from "@/components/dashboard/ContactsPanel";
import { TeamsPanel } from "@/components/dashboard/TeamsPanel";
import { ProfilePanel } from "@/components/dashboard/ProfilePanel";
import { BrandingPanel } from "@/components/dashboard/BrandingPanel";
import { ClientPortalsPanel } from "@/components/dashboard/ClientPortalsPanel";
import { SecurityPanel } from "@/components/dashboard/SecurityPanel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import withAuth from '@/hooks/withAuth';

import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Shield, 
  Folder, 
  Lock,
  Clock,
  FileText,
  Zap,
  Crown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/redux/hooks";

export type DashboardView = "transfers" | "certificates" | "contacts" | "teams" | "profile" | "branding" | "security" | "portals";

const proFeatures = [
  {
    icon: Folder,
    title: "2TB Cloud Storage",
    description: "EU cloud storage for all your important documents",
    legalOnly: false
  },
  {
    icon: Shield,
    title: "Legal Seal Protection",
    description: "Legally valid proof of delivery with timestamps",
    legalOnly: true
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "Your files are encrypted during transfer and storage",
    legalOnly: false
  },
  {
    icon: FileText,
    title: "Download Certificates",
    description: "Adobe Certified PDF for every transfer",
    legalOnly: false
  },
  {
    icon: Zap,
    title: "Advanced Sharing",
    description: "Password protection, expiry dates, and email verification",
    legalOnly: false
  },
  {
    icon: Clock,
    title: "Transfer History",
    description: "Complete overview of all sent and received files",
    legalOnly: false
  },
  {
    icon: Shield,
    title: "Blockchain Anchored",
    description: "Immutable proof stored on blockchain",
    legalOnly: true
  },
  {
    icon: Shield,
    title: "eIDAS Compliant",
    description: "EU qualified electronic delivery service",
    legalOnly: true
  }
];

const Dashboard = () => {
type User = {
  id: string;
  email: string;
  name: string;
  plan: string;
};
const usered = useAppSelector((state) => state.user);

  console.log("usr is", usered);
const [user, setUser] = useState<User | null>(null);
const [session, setSession] = useState<{ user: User } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<DashboardView>("transfers");
  const [userPlan, setUserPlan] = useState<string>("free");
  const [checkingPlan, setCheckingPlan] = useState(true);
  const [transfersKey, setTransfersKey] = useState(0);
const router = useRouter();
  useEffect(() => {
  // Simulate loading
  setTimeout(() => {
    const dummyUser = {
      id: "123456",
      email: "dummy@example.com",
      name: "John Doe",
      plan: "free",
    };

    setUser(dummyUser);
    setSession({ user: dummyUser });
    setUserPlan("free"); // or "pro"
    setLoading(false);
    setCheckingPlan(false);
  }, 500);
}, []);

  const isPaidUser = userPlan === "pro" || userPlan === "premium";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Redirect pending_pro users to complete payment
  if (!checkingPlan && userPlan === "pending_pro") {
    router.push("/signup/pro");
    return null;
  }

  // Show free trial invitation for free users
  if (false && !checkingPlan && !isPaidUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <DashboardHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
          <div className="max-w-4xl w-full">
            {/* Main Card */}
            <Card className="p-8 md:p-12 text-center border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full mb-6">
                <Crown className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Welcome to Transfer Guard</span>
              </div>

              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/25">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Try Transfer Guard Professional
              </h1>
              <p className="text-xl text-primary font-medium mb-4">
                14 Days Free
              </p>
              
              {/* Description */}
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Experience the full power of Transfer Guard Professional. Send files securely with legal proof of delivery, 
                team collaboration, and advanced security features.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col items-center gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg font-semibold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25"
                  onClick={() => router.push("/signup/pro")}
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>

              {/* Trial Info with Credit Card Explanation */}
              <div className="bg-slate-50 rounded-xl p-4 mb-10 max-w-xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-slate-700">Secure verification</span>
                </div>
                <p className="text-sm text-slate-500">
                  A credit card is required for verification only. You won't be charged during your 14-day trial. 
                  Cancel anytime before the trial ends — no questions asked.
                </p>
              </div>

              {/* Trial Features */}
              <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mb-10">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>14 days free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Full access</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 pt-10">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                  Everything included in your Professional trial
                </h2>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {proFeatures.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-4 text-left p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors relative"
                    >
                      {feature.legalOnly && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                          Legal
                        </div>
                      )}
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 mb-1">{feature.title}</h3>
                        <p className="text-sm text-slate-500">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Info */}
              <div className="mt-10 pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  After your trial, continue with Professional for{" "}
                  <span className="font-semibold text-slate-900">€42/month</span>{" "}
                  or{" "}
                  <span className="font-semibold text-slate-900">€35/month</span>{" "}
                  when billed yearly (save €84/year)
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while checking plan
  if (checkingPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Checking subscription...</div>
      </div>
    );
  }

  const handleTransferCreated = () => {
    setTransfersKey(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeView) {
      case "transfers":
        return <TransfersPanel key={transfersKey} userId={user.id} />;
      case "certificates":
        return <CertificatesPanel userId={user.id} />;
      case "portals":
        return <ClientPortalsPanel userId={user.id} />;
      case "contacts":
        return <ContactsPanel userId={user.id} />;
      case "teams":
        return <TeamsPanel userId={user.id} />;
      case "branding":
        return <BrandingPanel userId={user.id} isPro={isPaidUser} />;
      case "profile":
        return <ProfilePanel userId={user.id} />;
      case "security":
        return <SecurityPanel userId={user.id} />;
      default:
        return <TransfersPanel key={transfersKey} userId={user.id} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <DashboardHeader />
      <div className="flex">
        <DashboardViewSidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
          userId={user.id}
          userEmail={user.email || ""}
          onTransferCreated={handleTransferCreated}
        />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}


export default withAuth(Dashboard);