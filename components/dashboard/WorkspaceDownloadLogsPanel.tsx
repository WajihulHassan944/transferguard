import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  FileText,
  Globe,
  Monitor,
  Clock,
  MapPin,
  Shield,
  FileCheck,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

interface DownloadLog {
  id: string;
  workspace_id: string;
  file_id: string;
  dossier_id: string | null;
  downloaded_by_email: string;
  downloaded_by_name: string | null;
  downloaded_at: string;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  certificate_generated_at: string | null;
  certificate_url: string | null;
  file?: {
    file_name: string;
    file_size: number;
  };
}

interface WorkspaceDownloadLogsPanelProps {
  workspaceId: string;
}

export function WorkspaceDownloadLogsPanel({ workspaceId }: WorkspaceDownloadLogsPanelProps) {
  const { language } = useLanguage();
  const dateLocale = language === 'nl' ? nl : enUS;
  
  const [logs, setLogs] = useState<DownloadLog[]>([]);
  const [loading, setLoading] = useState(true);



  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {language === 'nl' ? 'Download logs laden...' : 'Loading download logs...'}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="p-8 text-center">
        <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">
          {language === 'nl' ? 'Geen downloads' : 'No downloads yet'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === 'nl' 
            ? 'Wanneer de klant bestanden downloadt, verschijnt hier een volledig bewijs met certificaat.'
            : 'When the client downloads files, full proof with certificate will appear here.'}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 p-1">
        {logs.map((log) => (
          <Card key={log.id} className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <FileCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {log.file?.file_name || 'Unknown file'}
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      {language === 'nl' ? 'Gedownload' : 'Downloaded'}
                    </Badge>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {log.file?.file_size ? formatFileSize(log.file.file_size) : ''}
                  </p>
                </div>
              </div>
              {log.certificate_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={log.certificate_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    {language === 'nl' ? 'Certificaat' : 'Certificate'}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
            </div>

            {/* Download details grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {/* Downloaded by */}
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {language === 'nl' ? 'Gedownload door' : 'Downloaded by'}
                </p>
                <p className="font-medium">{log.downloaded_by_name || log.downloaded_by_email}</p>
              </div>

              {/* Timestamp */}
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {language === 'nl' ? 'Datum & tijd' : 'Date & time'}
                </p>
                <p className="font-medium">
                  {format(new Date(log.downloaded_at), "d MMM yyyy, HH:mm:ss", { locale: dateLocale })}
                </p>
              </div>

              {/* IP Address */}
              {log.ip_address && (
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    IP {language === 'nl' ? 'Adres' : 'Address'}
                  </p>
                  <p className="font-medium font-mono text-xs">{log.ip_address}</p>
                </div>
              )}

              {/* Location */}
              {(log.city || log.country) && (
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {language === 'nl' ? 'Locatie' : 'Location'}
                  </p>
                  <p className="font-medium">
                    {[log.city, log.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {/* Device & OS */}
              {(log.device_type || log.os) && (
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Monitor className="h-3 w-3" />
                    {language === 'nl' ? 'Apparaat' : 'Device'}
                  </p>
                  <p className="font-medium">
                    {[log.device_type, log.os].filter(Boolean).join(' • ')}
                  </p>
                </div>
              )}

              {/* Browser */}
              {log.browser && (
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Browser
                  </p>
                  <p className="font-medium">{log.browser}</p>
                </div>
              )}
            </div>

            {/* Certificate status */}
            {log.certificate_generated_at && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    <FileCheck className="h-3 w-3 mr-1" />
                    {language === 'nl' ? 'Certificaat gegenereerd' : 'Certificate generated'}
                  </Badge>
                  <span className="text-muted-foreground">
                    {format(new Date(log.certificate_generated_at), "d MMM yyyy, HH:mm", { locale: dateLocale })}
                  </span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
