import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileCheck, 
  Download, 
  Globe, 
  Clock, 
  User,
  FileText,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { toast } from "sonner";

interface CertificateLog {
  id: string;
  file_share_id: string | null;
  transfer_id: string | null;
  downloaded_at: string;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  certificate_generated_at: string | null;
  certificate_url: string | null;
  transfer?: {
    id: string;
    recipient_email: string;
    dossier_number: string | null;
    files?: {
      file_name: string;
    }[];
  };
  file_shares?: {
    id: string;
    shared_with_email: string | null;
    archived_files?: {
      file_name: string;
    };
  };
}

interface CertificatesPanelProps {
  userId: string;
}

export function CertificatesPanel({ userId }: CertificatesPanelProps) {
  const [certificates, setCertificates] = useState<CertificateLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, [userId]);

  const loadCertificates = async () => {
  };

  const generateCertificatePDF = (log: CertificateLog) => {
    // Create certificate content
    const recipientEmail = log.transfer?.recipient_email || log.file_shares?.shared_with_email || "Unknown";
    const fileName = log.file_shares?.archived_files?.file_name || "Transfer files";
    const dossierNumber = log.transfer?.dossier_number || "-";
    
    const certificateContent = `
DELIVERY CERTIFICATE
====================

Certificate ID: ${log.id.substring(0, 8).toUpperCase()}
Generated: ${format(new Date(), "d MMMM yyyy HH:mm:ss", { locale: nl })}

DELIVERY DETAILS
----------------
Document: ${fileName}
Dossier Number: ${dossierNumber}
Recipient: ${recipientEmail}

VERIFICATION
------------
Downloaded at: ${format(new Date(log.downloaded_at), "d MMMM yyyy HH:mm:ss", { locale: nl })}
IP Address: ${log.ip_address || "Not recorded"}
Location: ${[log.city, log.country].filter(Boolean).join(", ") || "Unknown"}

This certificate serves as legal proof that the above-mentioned 
document was successfully delivered to and downloaded by the recipient.

---
Transfer Guard - Secure File Transfer
https://transferguard.eu
    `.trim();

    // Create blob and download
    const blob = new Blob([certificateContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificate-${log.id.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Certificate downloaded");
  };

  const parseUserAgent = (ua: string | null): string => {
    if (!ua) return "Unknown device";
    
    if (ua.includes("Mobile")) return "Mobile";
    if (ua.includes("Tablet")) return "Tablet";
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    return "Desktop";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Delivery Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          Delivery Certificates
        </CardTitle>
        <CardDescription>
          Download legal proof of delivery for each successful download. These certificates include timestamp, IP address, and recipient verification.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <FileCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="font-medium">No certificates yet</p>
            <p className="text-sm">Certificates are generated when recipients download your documents</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {certificates.map((log) => {
                const recipientEmail = log.transfer?.recipient_email || log.file_shares?.shared_with_email || "Unknown";
                const fileName = log.file_shares?.archived_files?.file_name || "Transfer files";
                const dossierNumber = log.transfer?.dossier_number;
                
                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <p className="font-medium text-sm">
                            Successfully delivered to {recipientEmail}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {fileName}
                          </span>
                          {dossierNumber && (
                            <Badge variant="outline" className="text-xs">
                              Dossier: {dossierNumber}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(log.downloaded_at), "d MMM yyyy HH:mm", { locale: nl })}
                          </span>
                          {log.ip_address && (
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {log.ip_address}
                            </span>
                          )}
                          {(log.city || log.country) && (
                            <span>
                              {[log.city, log.country].filter(Boolean).join(", ")}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {parseUserAgent(log.user_agent)}
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateCertificatePDF(log)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Certificate
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}