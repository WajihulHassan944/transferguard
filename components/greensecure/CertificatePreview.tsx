import { useState } from "react";
import { FileText, Eye, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface CertificatePreviewProps {
  variant: "legal" | "professional";
}

const content = {
  en: {
    viewCertificate: "View PDF Proof",
    certificateTitle: "Certificate of Evidence",
    scrollHint: "Scroll to view full document",
    page: "Page",
  },
  nl: {
    viewCertificate: "Bekijk PDF Bewijs",
    certificateTitle: "Bewijs Certificaat",
    scrollHint: "Scroll om het volledige document te bekijken",
    page: "Pagina",
  },
};

export const CertificatePreview = ({ variant }: CertificatePreviewProps) => {
  const { language } = useLanguage();
  const t = content[language];
  const [isOpen, setIsOpen] = useState(false);

  const isLegal = variant === "legal";
  const accentColor = isLegal ? "amber" : "primary";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "mt-6 group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full",
            "text-sm font-semibold transition-all duration-300",
            "hover:scale-105 hover:shadow-lg",
            isLegal
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-500/25"
              : "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-primary/25",
            "shadow-md"
          )}
        >
          <Eye className="w-4 h-4" />
          <span>{t.viewCertificate}</span>
          <div
            className={cn(
              "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
              "bg-white shadow-sm",
              isLegal ? "text-amber-600" : "text-primary"
            )}
          >
            <FileText className="w-3 h-3" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[85vh] p-0 overflow-hidden bg-muted/95 backdrop-blur-sm">
        <DialogTitle className="sr-only">{t.certificateTitle}</DialogTitle>
        
        {/* Header */}
        <div
          className={cn(
            "sticky top-0 z-10 px-6 py-4 border-b",
            isLegal
              ? "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200"
              : "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                isLegal ? "bg-amber-500 text-white" : "bg-primary text-primary-foreground"
              )}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className={cn("font-bold", isLegal ? "text-amber-900" : "text-foreground")}>
                {t.certificateTitle}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                {t.scrollHint}
                <ChevronDown className="w-3 h-3 animate-bounce" />
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable PDF Pages */}
        <ScrollArea className="h-[calc(85vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Page 1 */}
            <div className="relative group">
              <div className="absolute -top-2 -left-2 px-2 py-1 rounded-md text-xs font-medium bg-background border shadow-sm">
                {t.page} 1
              </div>
              <div
                className={cn(
                  "rounded-xl overflow-hidden border-2 shadow-xl transition-all duration-300",
                  "group-hover:shadow-2xl",
                  isLegal ? "border-amber-300" : "border-primary/30"
                )}
              >
                <img
                  src="/assets/certificate-legal-page1.jpg"
                  alt="Certificate Page 1"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Page 2 */}
            <div className="relative group">
              <div className="absolute -top-2 -left-2 px-2 py-1 rounded-md text-xs font-medium bg-background border shadow-sm">
                {t.page} 2
              </div>
              <div
                className={cn(
                  "rounded-xl overflow-hidden border-2 shadow-xl transition-all duration-300",
                  "group-hover:shadow-2xl",
                  isLegal ? "border-amber-300" : "border-primary/30"
                )}
              >
                <img
                  src="/assets/certificate-legal-page2.jpg"
                  alt="Certificate Page 2"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
