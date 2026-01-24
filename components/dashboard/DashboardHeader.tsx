'use client';

import { Button } from "@/components/ui/button";
import { LogOut, Search, Bell, Settings, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/redux/hooks";

export function DashboardHeader() {
  const router = useRouter();

  const user = useAppSelector((state) => state.user);

  const handleLogout = async () => {
    // TODO: hook real logout later
    toast.success("Logged out");
    router.push("/");
  };

  const getInitials = () => {
    if (!user?.firstName && !user?.lastName) return "U";
    return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  };

  return (
    <header className="h-[52px] border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="h-full px-4 flex items-center justify-between">

        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/assets/transferguard-logo-transparent.png"
            alt="Transfer Guard"
            className="h-10"
          />
        </Link>

        {/* Center - Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files..."
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Right - Actions & User */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 gap-2 px-2 rounded-lg hover:bg-accent/50"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.profileUrl || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>

                <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                  {user?.firstName}
                </span>

                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push("/dashboard")}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
