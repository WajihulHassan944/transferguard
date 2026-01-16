import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload, Trash2, Image, Palette, Crown } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "wallpaper") => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }
    }
  };

  const removeImage = (type: "logo" | "wallpaper") => {
    setSettings((prev) => ({
      ...prev,
      [type === "logo" ? "logo_url" : "wallpaper_url"]: null,
    }));
  };

  if (!isPro) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Custom Branding
          </CardTitle>
          <CardDescription>
            Upgrade to Professional to customize your transfer pages with your own logo and wallpaper
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Palette className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Personalize Your Brand</h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              Add your company logo, custom background wallpaper, and brand colors to make your file transfers look professional.
            </p>
            <Button asChild>
              <Link href="/signup/pro?plan=professional">Upgrade to Professional</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        {/* Enable Branding Toggle */}
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
            // onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enabled: checked }))}
          />
        </div>

        {/* Logo Upload */}
        <div className="space-y-3">
          <Label className="font-medium">Company Logo</Label>
          <p className="text-sm text-muted-foreground">
            Recommended size: 200x60px, PNG or SVG with transparent background
          </p>
          
          {settings.logo_url ? (
            <div className="relative inline-block">
              <div className="p-4 border border-border rounded-lg bg-muted/30">
                <img 
                  src={settings.logo_url} 
                  alt="Company logo" 
                  className="max-h-16 max-w-[200px] object-contain"
                />
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

        {/* Wallpaper Upload */}
        <div className="space-y-3">
          <Label className="font-medium">Background Wallpaper</Label>
          <p className="text-sm text-muted-foreground">
            Recommended size: 1920x1080px or larger, JPG or PNG
          </p>
          
          {settings.wallpaper_url ? (
            <div className="relative">
              <div className="aspect-video max-w-md rounded-lg overflow-hidden border border-border">
                <img 
                  src={settings.wallpaper_url} 
                  alt="Background wallpaper" 
                  className="w-full h-full object-cover"
                />
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
          <p className="text-sm text-muted-foreground">
            Used for buttons and accents on your branded pages
          </p>
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
                backgroundImage: settings.wallpaper_url 
                  ? `url(${settings.wallpaper_url})` 
                  : 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--background)))',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center">
                {settings.logo_url && (
                  <img 
                    src={settings.logo_url} 
                    alt="Logo preview" 
                    className="max-h-12 max-w-[160px] object-contain mb-4"
                  />
                )}
                <div 
                  className="px-6 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: settings.brand_color }}
                >
                  Download Files
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button 
          disabled={saving}
          className="w-full"
        >
          {saving ? "Saving..." : "Save Branding Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};
