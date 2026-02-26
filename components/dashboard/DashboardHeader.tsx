import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, ChevronDown, Crown, Shield, Scale, Menu } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import useLogout from "@/hooks/useLogout";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { userAgent } from "next/server";
interface DashboardHeaderProps {
  onMobileMenuToggle?: () => void;
}const getPlanInfo = (plan?: string | null) => {
  switch (plan?.toLowerCase()) {
    case "premium":
    case "legal":
      return {
        label: "Verified Identity",
        icon: Scale,
        className: "bg-legal-light text-legal-foreground border-legal-border",
      };

    case "certified delivery":
      return {
        label: "Certified Delivery",
        icon: Shield,
        className: "bg-primary/10 text-primary border-primary/20",
      };

    case "trial":
      return {
        label: "Certified Delivery Trial",
        icon: Shield,
        className: "bg-primary/10 text-primary border-primary/20",
      };

    case "starter":
      return {
        label: "Secure Transfer",
        icon: Shield,
        className: "bg-muted text-muted-foreground border-border",
      };

    default:
      return {
        label: "Free",
        icon: Shield,
        className: "bg-muted text-muted-foreground border-border",
      };
  }
};
export function DashboardHeader({ onMobileMenuToggle }: DashboardHeaderProps) {
    const router = useRouter();
const logout = useLogout();
  const user = useAppSelector((state) => state.user);
const email = typeof user?.email === "string" ? user.email : "";
  
  const handleLogout = async () => {
    logout();
    toast.success("Logged out");
    router.push("/");
  };

  const { t } = useLanguage();
  
const getInitials = (email?: string | null) => {
  if (!email) return "";
  return email.slice(0, 2).toUpperCase();
};

  const planInfo = getPlanInfo(user?.plan);
  const PlanIcon = planInfo.icon;

  return (
    <header className="h-20 border-b border-border bg-background sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left - Mobile Menu Button + Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-10 w-10"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
          
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/transferguard-logo-new.png" alt="Transfer Guard" className="h-10 sm:h-14" />
          </Link>
        </div>

        {/* Right - Actions & User */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="compact" />
       
          {/* Plan Badge */}
          <Badge variant="outline" className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-full ${planInfo.className}`}>
            <PlanIcon className="h-3.5 w-3.5" />
            {planInfo.label}
          </Badge>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-2.5 px-2 rounded-full hover:bg-muted/50">
                <Avatar className="h-8 w-8">
                   <AvatarImage src={user?.profileUrl || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
  {getInitials(email)}
</AvatarFallback>

                </Avatar>
                <span className="hidden sm:block text-sm font-medium max-w-[140px] truncate">
                 {email.split("@")[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{email.split("@")[0]}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                <Badge variant="outline" className={`mt-2 text-xs rounded-full ${planInfo.className}`}>
                  <PlanIcon className="h-3 w-3 mr-1" />
                  {planInfo.label} {t('dashboard.plan')}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive focus:text-destructive rounded-lg mx-1">
                <LogOut className="h-4 w-4" />
                {t('dashboard.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
