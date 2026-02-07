import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Link from "next/link";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between px-4 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/assets/transferguard-logo-new.png" alt="Transfer Guard" className="h-16" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <Link
            href="/features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('header.features')}
          </Link>
          <a
            href="/#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('header.pricing')}
          </a>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('header.about')}
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher variant="compact" />
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/auth">{t('header.login')}</Link>
          </Button>
          <Button asChild className="group bg-cta hover:bg-cta/90 shadow-md">
            <Link href="/signup/pro">
              {t('header.signup')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher variant="compact" />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container flex flex-col gap-1 p-4">
            <Link
              href="/features"
              className="text-sm font-medium py-3 px-4 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('header.features')}
            </Link>
            <a
              href="/#pricing"
              className="text-sm font-medium py-3 px-4 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('header.pricing')}
            </a>
            <Link
              href="/about"
              className="text-sm font-medium py-3 px-4 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('header.about')}
            </Link>
            <hr className="border-border my-3" />
            <Button variant="ghost" asChild className="justify-start">
              <Link href="/auth">{t('header.login')}</Link>
            </Button>
            <Button asChild className="bg-cta hover:bg-cta/90">
              <Link href="/signup/pro">{t('header.startTrial')}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
