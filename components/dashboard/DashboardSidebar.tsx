import { useState, useEffect } from "react";
import { DashboardView } from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  FileCheck,
  Users, 
  UserCircle,
  Palette,
  Shield,
  Upload,
  ChevronRight,
  ChevronDown,
  Plus,
  Building2,
  Receipt,
  FolderOpen,
  X,
  Lock,
  FileSignature,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StorageUsageCard } from "./StorageUsageCard";
import { IdCreditsCard } from "./IdCreditsCard";
import { SmsCreditsCard } from "./SmsCreditsCard";
import { SignCreditsCard } from "./SignCreditsCard";
import { NewTransferDialog } from "./NewTransferDialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardSidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  userId: string;
  userEmail: string;
  onTransferCreated: () => void;
  effectivePlan?: string;
  /** Mobile sheet open state */
  mobileOpen?: boolean;
  /** Callback to close mobile sheet */
  onMobileOpenChange?: (open: boolean) => void;
}

export function DashboardSidebar({ 
  activeView, 
  onViewChange, 
  userId, 
  userEmail, 
  onTransferCreated,
  effectivePlan = "free",
  mobileOpen = false,
  onMobileOpenChange
}: DashboardSidebarProps) {
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const { t, language } = useLanguage();

  const settingsViewIds: DashboardView[] = ["billing", "teams", "contacts", "branding", "profile", "security"];
  const isSettingsView = settingsViewIds.includes(activeView);
  const [settingsOpen, setSettingsOpen] = useState(isSettingsView);

  useEffect(() => {
    if (isSettingsView) setSettingsOpen(true);
  }, [isSettingsView]);

  const normalizedPlan = effectivePlan.toLowerCase();
  const isLegalPlan = normalizedPlan === "legal" || normalizedPlan === "premium";
  const isStarterPlan = normalizedPlan === "starter";
  const isTrialPlan = normalizedPlan === "trial";
  const isTeamEligible = !isStarterPlan && !isTrialPlan; // Teams available for paid Certified Delivery & Verified Identity
  const isCertificateEligible = !isStarterPlan; // Certificates available for Certified Delivery & Verified Identity
  const isPdfSignEligible = !isStarterPlan && !isTrialPlan; // PDF Sign not available for Starter or Trial

  const handleViewChange = (view: DashboardView) => {
    onViewChange(view);
    // Close mobile sidebar after selection
    onMobileOpenChange?.(false);
  };

  type MenuItemType = { id: DashboardView; labelKey: string; icon: React.ElementType; locked?: boolean; lockLabel?: string };

  const mainMenuItems: MenuItemType[] = [
    { id: "transfers", labelKey: "dashboard.sentTransfers", icon: Send },
    { id: "pdf-sign", labelKey: "dashboard.pdfSign", icon: FileSignature, locked: !isPdfSignEligible, lockLabel: "CD" },
    { id: "certificates", labelKey: "dashboard.certificates", icon: FileCheck, locked: !isCertificateEligible, lockLabel: "CD" },
    { id: "workspaces", labelKey: "dashboard.clientWorkspaces", icon: FolderOpen, locked: !isLegalPlan, lockLabel: "VI" },
    { id: "portals", labelKey: "dashboard.uploadPortals", icon: Upload },
  ];

  const settingsMenuItems: MenuItemType[] = [
    { id: "billing", labelKey: "dashboard.billing", icon: Receipt },
    { id: "teams", labelKey: "dashboard.teamManagement", icon: Building2, locked: !isTeamEligible, lockLabel: "CD" },
    { id: "contacts", labelKey: "dashboard.contacts", icon: Users },
    { id: "branding", labelKey: "dashboard.branding", icon: Palette, locked: isStarterPlan, lockLabel: "CD" },
    { id: "profile", labelKey: "dashboard.profile", icon: UserCircle },
    { id: "security", labelKey: "dashboard.security", icon: Shield },
  ];

  const getLockedMessage = (item: MenuItemType) => {
    if (item.id === "workspaces") {
      return language === 'nl'
        ? "Deze functie is exclusief beschikbaar voor het Verified Identity abonnement"
        : "This feature is exclusively available on the Verified Identity plan";
    }
    return language === 'nl'
      ? "Deze functie is beschikbaar vanaf het Certified Delivery abonnement"
      : "This feature is available from the Certified Delivery plan";
  };

  const getLockedDescription = (item: MenuItemType) => {
    if (item.id === "workspaces") {
      return language === 'nl'
        ? "Upgrade naar Verified Identity voor toegang tot deze functie."
        : "Upgrade to Verified Identity for access to this feature.";
    }
    return language === 'nl'
      ? "Upgrade naar Certified Delivery of hoger om deze functie te gebruiken."
      : "Upgrade to Certified Delivery or higher to use this feature.";
  };

  const renderMenuItem = (item: MenuItemType) => {
    const isActive = activeView === item.id;
    const isLocked = item.locked;
    
    const buttonContent = (
      <button
        key={item.id}
        onClick={() => {
          if (isLocked) {
            toast.info(getLockedMessage(item), {
              description: getLockedDescription(item),
            });
            return;
          }
          handleViewChange(item.id);
        }}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          "hover:bg-primary/5",
          isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent",
          isActive && !isLocked
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <item.icon className={cn(
          "h-[18px] w-[18px] flex-shrink-0",
          isActive && !isLocked ? "text-primary" : "text-muted-foreground"
        )} />
        <span className="truncate">{t(item.labelKey)}</span>
        {isLocked && (
          <Lock className="h-3.5 w-3.5 ml-auto text-muted-foreground/50" />
        )}
        {isActive && !isLocked && (
          <ChevronRight className="h-3.5 w-3.5 ml-auto text-primary/70" />
        )}
      </button>
    );

    if (isLocked) {
      return (
        <TooltipProvider key={item.id} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[220px] text-center">
              <p className="text-xs">{getLockedMessage(item)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return buttonContent;
  };

  const renderSidebarContent = (isMobileSheet: boolean) => (
    <>
      {/* New Transfer Button */}
      <div className="p-4">
        <Button 
          className="w-full rounded-xl shadow-sm" 
          size="default"
          onClick={() => {
            setTransferDialogOpen(true);
            onMobileOpenChange?.(false);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('dashboard.newTransfer')}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 space-y-6 overflow-auto">
        {/* Primary Actions */}
        <nav className="space-y-1">
          <p className="px-3 py-2 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
            {t('dashboard.workspace')}
          </p>
          {mainMenuItems.map(renderMenuItem)}
        </nav>

        {/* Settings (collapsible) */}
        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
          <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest hover:text-muted-foreground transition-colors cursor-pointer">
            <span className="flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5" />
              {t('dashboard.settings')}
            </span>
            <ChevronDown className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              settingsOpen && "rotate-180"
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <nav className="space-y-1">
              {settingsMenuItems.map(renderMenuItem)}
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Bottom Cards - hidden on mobile sheet, shown on desktop */}
      <div className={cn(
        "p-3 border-t border-border space-y-2",
        isMobileSheet && "hidden"
      )}>
        <SmsCreditsCard userId={userId} effectivePlan={effectivePlan} />
        <SignCreditsCard userId={userId} effectivePlan={effectivePlan} />
        <IdCreditsCard userId={userId} effectivePlan={effectivePlan} />
        <StorageUsageCard effectivePlan={effectivePlan} />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-56 lg:w-64 bg-background border-r border-border min-h-[calc(100vh-80px)] hidden md:flex flex-col">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderSidebarContent(true)}
          </div>
        </SheetContent>
      </Sheet>

      <NewTransferDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        userId={userId}
        userEmail={userEmail}
        onTransferCreated={() => {
          onTransferCreated();
          setTransferDialogOpen(false);
        }}
      />
    </>
  );
}
