import { useState } from "react";
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
  Plus
} from "lucide-react";
import { StorageUsageCard } from "./StorageUsageCard";
import { NewTransferDialog } from "./NewTransferDialog";
import { cn } from "@/lib/utils";

interface DashboardViewSidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  userId: string;
  userEmail: string;
  onTransferCreated: () => void;
}

const mainMenuItems: { id: DashboardView; label: string; icon: React.ElementType }[] = [
  { id: "transfers", label: "Sent Transfers", icon: Send },
  { id: "certificates", label: "Certificates", icon: FileCheck },
  { id: "portals", label: "Client Portals", icon: Upload },
];

const settingsMenuItems: { id: DashboardView; label: string; icon: React.ElementType }[] = [
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "profile", label: "Profile", icon: UserCircle },
  { id: "security", label: "Security", icon: Shield },
];

export function DashboardViewSidebar({ activeView, onViewChange, userId, userEmail, onTransferCreated }: DashboardViewSidebarProps) {
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  const renderMenuItem = (item: { id: DashboardView; label: string; icon: React.ElementType }) => {
    const isActive = activeView === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onViewChange(item.id)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          "hover:bg-accent/50",
          isActive 
            ? "bg-primary/10 text-primary shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <item.icon className={cn(
          "h-4 w-4 flex-shrink-0",
          isActive ? "text-primary" : "text-muted-foreground"
        )} />
        <span className="truncate">{item.label}</span>
        {isActive && (
          <ChevronRight className="h-3 w-3 ml-auto text-primary/60" />
        )}
      </button>
    );
  };

  return (
    <>
      <aside className="w-60 bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border min-h-[calc(100vh-52px)] flex flex-col hidden md:flex">
        {/* New Transfer Button */}
        <div className="p-3 border-b border-sidebar-border/50">
          <Button 
            className="w-full" 
            size="sm"
            onClick={() => setTransferDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Transfer
          </Button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 p-3 space-y-6">
          {/* Primary Actions */}
          <nav className="space-y-1">
            <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
              Workspace
            </p>
            {mainMenuItems.map(renderMenuItem)}
          </nav>

          {/* Settings */}
          <nav className="space-y-1">
            <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
              Settings
            </p>
            {settingsMenuItems.map(renderMenuItem)}
          </nav>
        </div>
        
        {/* Storage Card - Bottom */}
        <div className="p-3 border-t border-sidebar-border/50 space-y-3">
          <StorageUsageCard userId={userId} />
        </div>
      </aside>

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
