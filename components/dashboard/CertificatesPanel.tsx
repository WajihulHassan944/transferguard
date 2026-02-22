import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { baseUrl } from "@/const";
import {
  FileCheck,
  Download,
  Globe,
  Clock,
  User,
  FileText,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { toast } from "sonner";

interface TransferFile {
  id: string;
  file_name: string;
  file_size: number;
  mime_type: string | null;
}

interface Transfer {
  id: string;
  recipient_email: string;
  dossier_number: string | null;
  status: string;
  downloaded_at: string | null;
  audit_certificate: string | null;
  created_at: string;
  files?: TransferFile[];
}

export function CertificatesPanel() {
  const [certificates, setCertificates] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCertificates = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/transfers/my`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load certificates");
      }

// ✅ Only signed transfers WITH a valid audit_certificate URL
const signedTransfers = (data.transfers || []).filter((t: Transfer) => {
  const cert = t.audit_certificate;

  return (
    t.status === "signed" &&
    typeof cert === "string" &&
    cert.trim() !== "" &&
    cert.trim().toLowerCase() !== "null"
  );
});

      setCertificates(signedTransfers);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

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
          Download legal proof of delivery for each successfully signed transfer.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <FileCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="font-medium">No certificates yet</p>
            <p className="text-sm">
              Certificates appear after a document is signed.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {certificates.map((transfer) => {
                const fileName =
                  transfer.files?.[0]?.file_name || "Transfer files";

                return (
                  <div
                    key={transfer.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <p className="font-medium text-sm">
                            Successfully signed by {transfer.recipient_email}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {fileName}
                          </span>

                          {transfer.dossier_number && (
                            <Badge variant="outline" className="text-xs">
                              Dossier: {transfer.dossier_number}
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {transfer.downloaded_at
                              ? format(
                                  new Date(transfer.downloaded_at),
                                  "d MMM yyyy HH:mm",
                                  { locale: nl }
                                )
                              : format(
                                  new Date(transfer.created_at),
                                  "d MMM yyyy HH:mm",
                                  { locale: nl }
                                )}
                          </span>

                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Verified Delivery
                          </span>

                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Recipient Verified
                          </span>
                        </div>
                      </div>

                     <Button
  size="sm"
  className="bg-green-600 hover:bg-green-700 text-white"
  onClick={() =>
    transfer.audit_certificate &&
    window.open(transfer.audit_certificate, "_blank")
  }
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