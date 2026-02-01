import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Save, Building, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { baseUrl } from "@/const";
import { refreshAndDispatchUser } from "@/utils/refreshUser";

/* =============================
   Types (MATCH BACKEND EXACTLY)
============================= */
interface Profile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileUrl: string | null;

  companyName: string | null;
  phone: string | null;

  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
}

export function ProfilePanel() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  /* =============================
     Initialize from Redux user
  ============================= */
  useEffect(() => {
    if (!user) return;

    setProfile({
      id: user.id ?? "",
  email: user.email ?? "",
      firstName: user.firstName,
      lastName: user.lastName,
      profileUrl: user.profileUrl,

      companyName: user.companyName,
      phone: user.phone,

      address: user.address,
      city: user.city,
      postalCode: user.postalCode,
      country: user.country,
    });
  }, [user]);

  /* =============================
     Helpers
  ============================= */
  const updateField = (field: keyof Profile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const getInitials = () => {
    if (!profile) return "?";
    const first = profile.firstName?.[0] || "";
    const last = profile.lastName?.[0] || "";
    return (first + last).toUpperCase() || profile.email[0].toUpperCase();
  };

  /* =============================
     Save profile
  ============================= */
  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("firstName", profile.firstName || "");
      formData.append("lastName", profile.lastName || "");
      formData.append("email", profile.email || "");
      formData.append("companyName", profile.companyName || "");
      formData.append("phone", profile.phone || "");
      formData.append("address", profile.address || "");
      formData.append("postalCode", profile.postalCode || "");
      formData.append("city", profile.city || "");
      formData.append("country", profile.country || "");

      if (avatarFile) {
        formData.append("profileImg", avatarFile);
      }

      const res = await fetch(`${baseUrl}/users/update-profile`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      toast.success("Profile updated successfully");

      /* optionally update redux */
      dispatch(refreshAndDispatchUser);

      setAvatarFile(null);
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading...
      </div>
    );
  }

  /* =============================
     UI
  ============================= */
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>

        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <Card className="p-6">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <label className="cursor-pointer">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarPreview || profile.profileUrl || undefined} />

              <AvatarFallback className="text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <input
              type="file"
              hidden
              accept="image/*"
             onChange={(e) => {
  const file = e.target.files?.[0] || null;
  setAvatarFile(file);

  if (file) {
    setAvatarPreview(URL.createObjectURL(file));
  }
}}

            />
          </label>

          <div>
            <h2 className="text-xl font-semibold">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Personal Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input
                  value={profile.firstName || ""}
                  placeholder="John"
                  onChange={(e) =>
                    updateField("firstName", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Last Name</Label>
                <Input
                  value={profile.lastName || ""}
                  placeholder="Doe"
                  onChange={(e) =>
                    updateField("lastName", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={profile.companyName || ""}
                  placeholder="Company Inc."
                  onChange={(e) =>
                    updateField("companyName", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={profile.phone || ""}
                  placeholder="+1 555 123 4567"
                  onChange={(e) =>
                    updateField("phone", e.target.value)
                  }
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

            <div className="space-y-4">
              <div>
                <Label>Address</Label>
                <Input
                  value={profile.address || ""}
                  placeholder="123 Main Street"
                  onChange={(e) =>
                    updateField("address", e.target.value)
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  placeholder="Postal Code"
                  value={profile.postalCode || ""}
                  onChange={(e) =>
                    updateField("postalCode", e.target.value)
                  }
                />

                <Input
                  placeholder="City"
                  value={profile.city || ""}
                  onChange={(e) =>
                    updateField("city", e.target.value)
                  }
                />

                <Input
                  placeholder="Country"
                  value={profile.country || ""}
                  onChange={(e) =>
                    updateField("country", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
