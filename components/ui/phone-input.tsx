import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

const countries = [
  { code: "NL", flag: "🇳🇱", dial: "+31", name: "Nederland" },
  { code: "BE", flag: "🇧🇪", dial: "+32", name: "België" },
  { code: "DE", flag: "🇩🇪", dial: "+49", name: "Duitsland" },
  { code: "FR", flag: "🇫🇷", dial: "+33", name: "Frankrijk" },
  { code: "GB", flag: "🇬🇧", dial: "+44", name: "United Kingdom" },
  { code: "US", flag: "🇺🇸", dial: "+1", name: "United States" },
  { code: "AT", flag: "🇦🇹", dial: "+43", name: "Österreich" },
  { code: "CH", flag: "🇨🇭", dial: "+41", name: "Schweiz" },
  { code: "ES", flag: "🇪🇸", dial: "+34", name: "España" },
  { code: "IT", flag: "🇮🇹", dial: "+39", name: "Italia" },
  { code: "PT", flag: "🇵🇹", dial: "+351", name: "Portugal" },
  { code: "PL", flag: "🇵🇱", dial: "+48", name: "Polska" },
  { code: "SE", flag: "🇸🇪", dial: "+46", name: "Sverige" },
  { code: "NO", flag: "🇳🇴", dial: "+47", name: "Norge" },
  { code: "DK", flag: "🇩🇰", dial: "+45", name: "Danmark" },
  { code: "FI", flag: "🇫🇮", dial: "+358", name: "Suomi" },
  { code: "IE", flag: "🇮🇪", dial: "+353", name: "Ireland" },
  { code: "LU", flag: "🇱🇺", dial: "+352", name: "Luxembourg" },
  { code: "CZ", flag: "🇨🇿", dial: "+420", name: "Česko" },
  { code: "RO", flag: "🇷🇴", dial: "+40", name: "România" },
  { code: "HU", flag: "🇭🇺", dial: "+36", name: "Magyarország" },
  { code: "GR", flag: "🇬🇷", dial: "+30", name: "Ελλάδα" },
  { code: "HR", flag: "🇭🇷", dial: "+385", name: "Hrvatska" },
  { code: "BG", flag: "🇧🇬", dial: "+359", name: "България" },
  { code: "SK", flag: "🇸🇰", dial: "+421", name: "Slovensko" },
  { code: "SI", flag: "🇸🇮", dial: "+386", name: "Slovenija" },
  { code: "LT", flag: "🇱🇹", dial: "+370", name: "Lietuva" },
  { code: "LV", flag: "🇱🇻", dial: "+371", name: "Latvija" },
  { code: "EE", flag: "🇪🇪", dial: "+372", name: "Eesti" },
  { code: "MT", flag: "🇲🇹", dial: "+356", name: "Malta" },
  { code: "CY", flag: "🇨🇾", dial: "+357", name: "Κύπρος" },
  { code: "TR", flag: "🇹🇷", dial: "+90", name: "Türkiye" },
  { code: "AU", flag: "🇦🇺", dial: "+61", name: "Australia" },
  { code: "CA", flag: "🇨🇦", dial: "+1", name: "Canada" },
  { code: "JP", flag: "🇯🇵", dial: "+81", name: "Japan" },
  { code: "CN", flag: "🇨🇳", dial: "+86", name: "China" },
  { code: "IN", flag: "🇮🇳", dial: "+91", name: "India" },
  { code: "BR", flag: "🇧🇷", dial: "+55", name: "Brasil" },
  { code: "MX", flag: "🇲🇽", dial: "+52", name: "México" },
  { code: "ZA", flag: "🇿🇦", dial: "+27", name: "South Africa" },
  { code: "AE", flag: "🇦🇪", dial: "+971", name: "UAE" },
  { code: "SA", flag: "🇸🇦", dial: "+966", name: "Saudi Arabia" },
  { code: "KR", flag: "🇰🇷", dial: "+82", name: "South Korea" },
  { code: "SG", flag: "🇸🇬", dial: "+65", name: "Singapore" },
  { code: "IL", flag: "🇮🇱", dial: "+972", name: "Israel" },
  { code: "NZ", flag: "🇳🇿", dial: "+64", name: "New Zealand" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  id?: string;
  className?: string;
}

export function PhoneInput({ value, onChange, language = "nl", id, className }: PhoneInputProps) {
  const defaultCode = language === "nl" ? "NL" : "GB";
  const [selectedCountry, setSelectedCountry] = useState(() => {
    // Try to detect country from existing value
    const match = countries.find((c) => value?.startsWith(c.dial));
    return match?.code || defaultCode;
  });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const country = countries.find((c) => c.code === selectedCountry) || countries[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  const filtered = search
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      )
    : countries;

  const handleSelect = (c: (typeof countries)[0]) => {
    setSelectedCountry(c.code);
    setOpen(false);
    setSearch("");
    // Replace dial code in value
    const currentDial = country.dial;
    if (value?.startsWith(currentDial)) {
      onChange(c.dial + value.slice(currentDial.length));
    } else if (!value || value.trim() === "") {
      onChange(c.dial + " ");
    } else {
      onChange(c.dial + " " + value.replace(/^\+\d+\s*/, ""));
    }
  };

  return (
    <div className={`relative ${className || ""}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="absolute left-0 top-0 h-full px-3 flex items-center gap-1 hover:bg-muted/50 rounded-l-md transition-colors z-10 border-r border-border"
      >
        <span className="text-base">{country.flag}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      <Input
        id={id}
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${country.dial} ...`}
        className="pl-16"
      />
      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-border">
            <Input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === "nl" ? "Zoek land..." : "Search country..."}
              className="h-8 text-sm"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleSelect(c)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 transition-colors ${
                  c.code === selectedCountry ? "bg-muted" : ""
                }`}
              >
                <span className="text-base">{c.flag}</span>
                <span className="flex-1 text-left truncate text-foreground">{c.name}</span>
                <span className="text-muted-foreground text-xs">{c.dial}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                {language === "nl" ? "Geen resultaten" : "No results"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
