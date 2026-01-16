import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Save, Building, MapPin } from "lucide-react";
import { toast } from "sonner";

interface ProfilePanelProps {
  userId: string;
}

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
}

export function ProfilePanel({ userId }: ProfilePanelProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  const updateField = (field: keyof Profile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const getInitials = () => {
    if (!profile) return "?";
    const first = profile.first_name?.[0] || "";
    const last = profile.last_name?.[0] || "";
    return (first + last).toUpperCase() || profile.email[0].toUpperCase();
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center py-12 text-muted-foreground">Profile not found</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Button  disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">
              {profile.first_name} {profile.last_name}
            </h2>
            <p className="text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal info */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Personal Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={profile.first_name || ""}
                  onChange={(e) => updateField("first_name", e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={profile.last_name || ""}
                  onChange={(e) => updateField("last_name", e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          {/* Company info */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={profile.company_name || ""}
                  onChange={(e) => updateField("company_name", e.target.value)}
                  placeholder="Company Inc."
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={profile.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+1 555 123 4567"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Information
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={profile.address || ""}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input
                    value={profile.postal_code || ""}
                    onChange={(e) => updateField("postal_code", e.target.value)}
                    placeholder="12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={profile.city || ""}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    value={profile.country || ""}
                    onChange={(e) => updateField("country", e.target.value)}
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
