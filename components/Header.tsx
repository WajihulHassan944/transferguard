'use client'
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

const isActive = (path: string) => pathname === path;
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src='/assets/transferguard-logo-new.png' alt="Transfer Guard" className="h-16" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-10">
            <Link 
              href="/convert" 
              className={cn(
                "text-base font-medium transition-colors hover:text-primary",
                isActive("/convert") ? "text-primary" : "text-foreground"
              )}
            >
              Convert
            </Link>
            <Link 
              href="/#pricing" 
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/#faq" 
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              FAQ
            </Link>
            <Link 
              href="/contact" 
              className={cn(
                "text-base font-medium transition-colors hover:text-primary",
                isActive("/contact") ? "text-primary" : "text-foreground"
              )}
            >
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="hidden md:inline-flex border-primary/50 hover:bg-primary/10">
              <Link href="/convert">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="bg-primary hover:bg-primary-glow">
              <Link href="/convert">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
