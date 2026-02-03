import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload, Trash2, Image, Palette } from "lucide-react";
import { toast } from "sonner";
import { baseUrl } from "@/const";

interface BrandingPanelProps {
  userId: string;
  isPro: boolean;
}

interface BrandingSettings {
  id?: string;
  logo_url: string | null;
  wallpaper_url: string | null;
  brand_color: string;
  enabled: boolean;
}

export const BrandingPanel = ({ userId, isPro }: BrandingPanelProps) => {
  const [settings, setSettings] = useState<BrandingSettings>({
    logo_url: null,
    wallpaper_url: null,
    brand_color: "#10B981",
    enabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingWallpaper, setUploadingWallpaper] = useState(false);

  const logoFileRef = useRef<File | null>(null);
  const wallpaperFileRef = useRef<File | null>(null);

  /* ---------------------------------- */
  // Load current branding on mount
  /* ---------------------------------- */
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await fetch(`${baseUrl}/branding/my`, { credentials: "include" });
        const data = await res.json();
        if (data.success && data.branding) {
          setSettings({
            id: data.branding.id,
            logo_url: data.branding.logoUrl,
            wallpaper_url: data.branding.wallpaperUrl,
            brand_color: data.branding.brandColor || "#10B981",
            enabled: data.branding.brandingEnabled || false,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load branding");
      } finally {
        setLoading(false);
      }
    };

    fetchBranding();
  }, []);

  /* ---------------------------------- */
  // Remove selected image (UI only)
  /* ---------------------------------- */
  const removeImage = (type: "logo" | "wallpaper") => {
    if (type === "logo") logoFileRef.current = null;
    if (type === "wallpaper") wallpaperFileRef.current = null;

    setSettings((prev) => ({
      ...prev,
      [type === "logo" ? "logo_url" : "wallpaper_url"]: null,
    }));
  };

  /* ---------------------------------- */
  // Handle file selection
  /* ---------------------------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "wallpaper") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      toast.error("Unsupported file type");
      return;
    }

    if (type === "logo") {
      logoFileRef.current = file;
      setUploadingLogo(true);
    } else {
      wallpaperFileRef.current = file;
      setUploadingWallpaper(true);
    }

    // Show preview immediately
    setSettings((prev) => ({
      ...prev,
      [type === "logo" ? "logo_url" : "wallpaper_url"]: URL.createObjectURL(file),
    }));
  };

  /* ---------------------------------- */
  // Save all branding settings
  /* ---------------------------------- */
  const saveSettings = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("brandingEnabled", settings.enabled.toString());
      formData.append("brandColor", settings.brand_color);

      if (logoFileRef.current) formData.append("logo", logoFileRef.current);
      if (wallpaperFileRef.current) formData.append("wallpaper", wallpaperFileRef.current);

      const res = await fetch(`${baseUrl}/branding/update`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.branding) {
        setSettings({
          id: data.branding.id,
          logo_url: data.branding.logoUrl,
          wallpaper_url: data.branding.wallpaperUrl,
          brand_color: data.branding.brandColor || "#10B981",
          enabled: data.branding.brandingEnabled || false,
        });
        toast.success("Branding saved successfully");
        logoFileRef.current = null;
        wallpaperFileRef.current = null;
      } else {
        toast.error(data.message || "Failed to save branding");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save branding");
    } finally {
      setSaving(false);
      setUploadingLogo(false);
      setUploadingWallpaper(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardContent className="py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Custom Branding
        </CardTitle>
        <CardDescription>
          Customize your transfer and download pages with your brand identity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Branding */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div>
            <Label htmlFor="enable-branding" className="font-medium">Enable Custom Branding</Label>
            <p className="text-sm text-muted-foreground">
              Show your branding on transfer and download pages
            </p>
          </div>
          <Switch
            id="enable-branding"
            checked={settings.enabled}
            onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enabled: checked }))}
          />
        </div>

        {/* Logo */}
        <div className="space-y-3">
          <Label className="font-medium">Company Logo</Label>
          <p className="text-sm text-muted-foreground">
            Recommended size: 200x60px, PNG or SVG with transparent background
          </p>
          {settings.logo_url ? (
            <div className="relative inline-block">
              <div className="p-4 border border-border rounded-lg bg-muted/30">
                <img src={settings.logo_url} alt="Company logo" className="max-h-16 max-w-[200px] object-contain" />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={() => removeImage("logo")}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "logo")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadingLogo}
              />
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {uploadingLogo ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click or drag to upload logo</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Wallpaper */}
        <div className="space-y-3">
          <Label className="font-medium">Background Wallpaper</Label>
          <p className="text-sm text-muted-foreground">
            Recommended size: 1920x1080px or larger, JPG or PNG
          </p>
          {settings.wallpaper_url ? (
            <div className="relative">
              <div className="aspect-video max-w-md rounded-lg overflow-hidden border border-border">
                <img src={settings.wallpaper_url} alt="Background wallpaper" className="w-full h-full object-cover" />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeImage("wallpaper")}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "wallpaper")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadingWallpaper}
              />
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                {uploadingWallpaper ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                ) : (
                  <>
                    <Image className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click or drag to upload wallpaper</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Brand Color */}
        <div className="space-y-3">
          <Label htmlFor="brand-color" className="font-medium">Brand Color</Label>
          <p className="text-sm text-muted-foreground">Used for buttons and accents on your branded pages</p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              id="brand-color"
              value={settings.brand_color}
              onChange={(e) => setSettings((prev) => ({ ...prev, brand_color: e.target.value }))}
              className="w-12 h-10 rounded cursor-pointer border-0"
            />
            <Input
              value={settings.brand_color}
              onChange={(e) => setSettings((prev) => ({ ...prev, brand_color: e.target.value }))}
              placeholder="#10B981"
              className="max-w-[120px]"
            />
          </div>
        </div>

        {/* Preview */}
        {(settings.logo_url || settings.wallpaper_url) && settings.enabled && (
          <div className="space-y-3">
            <Label className="font-medium">Preview</Label>
            <div 
              className="relative aspect-video rounded-lg overflow-hidden border border-border"
              style={{
                backgroundImage: settings.wallpaper_url ? `url(${settings.wallpaper_url})` : 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--background)))',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center">
                {settings.logo_url && (
                  <img src={settings.logo_url} alt="Logo preview" className="max-h-12 max-w-[160px] object-contain mb-4" />
                )}
                <div className="px-6 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.brand_color }}>
                  Download Files
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button onClick={saveSettings} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Branding Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};
