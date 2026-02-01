'use client'
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
   <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between px-4 max-w-6xl mx-auto">
         <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src='/assets/transferguard-logo-transparent.png' alt="Transfer Guard" className="h-16" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/features" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Features
          </Link>
          <a 
            href="/#pricing" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Pricing
          </a>
          <Link 
            href="/about" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild className="hover:bg-muted transition-colors">
            <Link href="/auth">Log in</Link>
          </Button>
          <Button asChild className="group bg-cta hover:bg-cta/90">
            <Link href="/signup/pro">
              Create Free Account<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background animate-fade-in">
          <nav className="container flex flex-col gap-2 p-4">
            <Link 
              href="/features" 
              className="text-sm font-medium py-3 px-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <a 
              href="/#pricing" 
              className="text-sm font-medium py-3 px-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <Link 
              href="/about" 
              className="text-sm font-medium py-3 px-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <hr className="border-border my-2" />
            <Button variant="ghost" asChild className="justify-start">
              <Link href="/auth">Log in</Link>
            </Button>
            <Button asChild className="bg-cta hover:bg-cta/90">
              <Link href="/signup/pro">Start Free Trial</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};