import { useState } from "react";
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
  Plus,
  Building2,
  Receipt,
  FolderOpen,
  X
} from "lucide-react";
import { StorageUsageCard } from "./StorageUsageCard";
import { NewTransferDialog } from "./NewTransferDialog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DashboardView } from "@/app/dashboard/page";

interface DashboardSidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  userId: string;
  userEmail: string;
  onTransferCreated: () => void;
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
  mobileOpen = false,
  onMobileOpenChange
}: DashboardSidebarProps) {
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const { t } = useLanguage();

  const handleViewChange = (view: DashboardView) => {
    onViewChange(view);
    // Close mobile sidebar after selection
    onMobileOpenChange?.(false);
  };

  const mainMenuItems: { id: DashboardView; labelKey: string; icon: React.ElementType }[] = [
    { id: "transfers", labelKey: "dashboard.sentTransfers", icon: Send },
    { id: "certificates", labelKey: "dashboard.certificates", icon: FileCheck },
    { id: "workspaces", labelKey: "dashboard.clientWorkspaces", icon: FolderOpen },
    { id: "portals", labelKey: "dashboard.uploadPortals", icon: Upload },
  ];

  const settingsMenuItems: { id: DashboardView; labelKey: string; icon: React.ElementType }[] = [
    { id: "billing", labelKey: "dashboard.billing", icon: Receipt },
    { id: "teams", labelKey: "dashboard.teamManagement", icon: Building2 },
    { id: "contacts", labelKey: "dashboard.contacts", icon: Users },
    { id: "branding", labelKey: "dashboard.branding", icon: Palette },
    { id: "profile", labelKey: "dashboard.profile", icon: UserCircle },
    { id: "security", labelKey: "dashboard.security", icon: Shield },
  ];

  const renderMenuItem = (item: { id: DashboardView; labelKey: string; icon: React.ElementType }) => {
    const isActive = activeView === item.id;
    return (
      <button
        key={item.id}
        onClick={() => handleViewChange(item.id)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          "hover:bg-primary/5",
          isActive 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <item.icon className={cn(
          "h-[18px] w-[18px] flex-shrink-0",
          isActive ? "text-primary" : "text-muted-foreground"
        )} />
        <span className="truncate">{t(item.labelKey)}</span>
        {isActive && (
          <ChevronRight className="h-3.5 w-3.5 ml-auto text-primary/70" />
        )}
      </button>
    );
  };

  const sidebarContent = (
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

        {/* Settings */}
        <nav className="space-y-1">
          <p className="px-3 py-2 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
            {t('dashboard.settings')}
          </p>
          {settingsMenuItems.map(renderMenuItem)}
        </nav>
      </div>
      
      {/* Storage Card - Bottom */}
      <div className="p-4 border-t border-border">
        <StorageUsageCard userId={userId} />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-background border-r border-border min-h-[calc(100vh-80px)] hidden md:flex flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex-1 flex flex-col overflow-hidden">
            {sidebarContent}
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
