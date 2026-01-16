import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Globe, MapPin, Monitor, Clock, AlertCircle, Smartphone, Tablet, Laptop } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface DownloadLog {
  id: string;
  file_share_id: string | null;
  transfer_id: string | null;
  downloaded_at: string;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  file_shares?: {
    id: string;
    shared_with_email: string | null;
    archived_files?: {
      file_name: string;
    };
  };
}

interface DownloadLogsPanelProps {
  isPaidUser: boolean;
}

export const DownloadLogsPanel = ({ isPaidUser }: DownloadLogsPanelProps) => {
  const [logs, setLogs] = useState<DownloadLog[]>([]);
  const [loading, setLoading] = useState(true);

  const parseUserAgent = (ua: string | null): { device: string; os: string; browser: string; icon: 'mobile' | 'tablet' | 'desktop' } => {
    if (!ua) return { device: "Onbekend", os: "Onbekend", browser: "Onbekend", icon: 'desktop' };
    
    // Detect device type
    let device = "Desktop";
    let icon: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    
    if (/iPad/i.test(ua)) {
      device = "iPad";
      icon = 'tablet';
    } else if (/Android.*Mobile/i.test(ua) || /iPhone/i.test(ua)) {
      device = /iPhone/i.test(ua) ? "iPhone" : "Android Phone";
      icon = 'mobile';
    } else if (/Android/i.test(ua)) {
      device = "Android Tablet";
      icon = 'tablet';
    } else if (/Mobile/i.test(ua)) {
      device = "Mobiel";
      icon = 'mobile';
    }
    
    // Detect OS
    let os = "Onbekend OS";
    if (/Windows NT 10/i.test(ua)) os = "Windows 10/11";
    else if (/Windows NT 6\.3/i.test(ua)) os = "Windows 8.1";
    else if (/Windows NT 6\.2/i.test(ua)) os = "Windows 8";
    else if (/Windows NT 6\.1/i.test(ua)) os = "Windows 7";
    else if (/Windows/i.test(ua)) os = "Windows";
    else if (/Mac OS X 10[._]15/i.test(ua)) os = "macOS Catalina";
    else if (/Mac OS X 11/i.test(ua) || /Mac OS X 10[._]16/i.test(ua)) os = "macOS Big Sur";
    else if (/Mac OS X 12/i.test(ua)) os = "macOS Monterey";
    else if (/Mac OS X 13/i.test(ua)) os = "macOS Ventura";
    else if (/Mac OS X 14/i.test(ua)) os = "macOS Sonoma";
    else if (/Mac OS X/i.test(ua) || /Macintosh/i.test(ua)) os = "macOS";
    else if (/iPhone OS (\d+)/i.test(ua)) {
      const match = ua.match(/iPhone OS (\d+)/i);
      os = `iOS ${match?.[1] || ""}`;
    }
    else if (/iPad.*OS (\d+)/i.test(ua)) {
      const match = ua.match(/OS (\d+)/i);
      os = `iPadOS ${match?.[1] || ""}`;
    }
    else if (/Android (\d+(\.\d+)?)/i.test(ua)) {
      const match = ua.match(/Android (\d+(\.\d+)?)/i);
      os = `Android ${match?.[1] || ""}`;
    }
    else if (/Linux/i.test(ua)) os = "Linux";
    else if (/CrOS/i.test(ua)) os = "Chrome OS";
    
    // Detect browser
    let browser = "Onbekende browser";
    if (/Edg\//i.test(ua)) browser = "Edge";
    else if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) browser = "Chrome";
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
    else if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/Opera|OPR/i.test(ua)) browser = "Opera";
    else if (/MSIE|Trident/i.test(ua)) browser = "Internet Explorer";
    
    return { device, os, browser, icon };
  };
  
  const getDeviceIcon = (iconType: 'mobile' | 'tablet' | 'desktop') => {
    switch (iconType) {
      case 'mobile': return <Smartphone className="h-3 w-3 mr-1" />;
      case 'tablet': return <Tablet className="h-3 w-3 mr-1" />;
      default: return <Laptop className="h-3 w-3 mr-1" />;
    }
  };

  if (!isPaidUser) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5" />
            Download Tracking
          </CardTitle>
          <CardDescription className="text-amber-700">
            Upgrade naar Pro om te zien wanneer en vanaf welk IP-adres je bestanden zijn gedownload.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Download className="h-12 w-12 text-amber-300 mb-4" />
            <p className="text-sm text-amber-700 mb-4">
              Met een Pro account kun je:
            </p>
            <ul className="text-sm text-amber-600 space-y-2">
              <li>✓ Zien wanneer bestanden zijn gedownload</li>
              <li>✓ IP-adressen van downloaders bekijken</li>
              <li>✓ Locatie informatie ontvangen</li>
              <li>✓ Apparaat type zien</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Logs
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
          <Download className="h-5 w-5" />
          Download Logs
        </CardTitle>
        <CardDescription>
          Bekijk wanneer en door wie je bestanden zijn gedownload
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Download className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p>Nog geen downloads geregistreerd</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col gap-2 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {log.file_shares?.archived_files?.file_name || "Onbekend bestand"}
                      </p>
                      {log.file_shares?.shared_with_email && (
                        <p className="text-xs text-muted-foreground">
                          Gedeeld met: {log.file_shares.shared_with_email}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(log.downloaded_at), "d MMM yyyy HH:mm", { locale: nl })}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {log.ip_address && (
                      <Badge variant="outline" className="text-xs">
                        <Globe className="h-3 w-3 mr-1" />
                        {log.ip_address}
                      </Badge>
                    )}
                    
                    {(log.country || log.city) && (
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {[log.city, log.country].filter(Boolean).join(", ")}
                      </Badge>
                    )}
                    
                    {(() => {
                      const parsed = parseUserAgent(log.user_agent);
                      return (
                        <>
                          <Badge variant="outline" className="text-xs">
                            {getDeviceIcon(parsed.icon)}
                            {parsed.device}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Monitor className="h-3 w-3 mr-1" />
                            {parsed.os}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-muted">
                            {parsed.browser}
                          </Badge>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
