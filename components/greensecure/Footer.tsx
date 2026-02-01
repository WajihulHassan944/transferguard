import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <img src='/assets/transferguard-logo-transparent.png' alt="Transfer Guard" className="h-12" />
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Secure, compliant file sharing for professionals. Your data stays in the EU with zero-knowledge encryption.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>🇪🇺 EU Data Only</span>
              <span>•</span>
              <span>ISO 27001</span>
              <span>•</span>
              <span>GDPR Compliant</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Transfer Guard. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made in the European Union 🇪🇺
          </p>
        </div>
      </div>
    </footer>
  );
};