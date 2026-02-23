/**
 * Generates login metadata by combining ipapi.is data 
 * with local browser information.
 */

export interface LoginMeta {
  ip_address: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
  latitude: number | null;
  longitude: number | null;
  isp: string | null;
  user_agent: string;
  device_type: string;
  timestamp: string;
}

export const getLoginMeta = async (): Promise<LoginMeta> => {
  // 1. Setup local browser data
  const ua = typeof window !== "undefined" ? navigator.userAgent : "server-side";
  
  // Basic device detection logic
  const isMobile = /android|iphone|ipad|ipod/i.test(ua);
  const isTablet = /ipad|tablet/i.test(ua);
  const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  try {
    // 2. Fetch IP and Geolocation data
    const res = await fetch("https://api.ipapi.is");
    
    if (!res.ok) throw new Error("IP API unreachable");
    
    const data = await res.json();

    return {
      ip_address: data.ip || null,
      country: data.location?.country || null,
      city: data.location?.city || null,
      region: data.location?.region || null,
      timezone: data.location?.timezone || null,
      latitude: data.location?.latitude || null,
      longitude: data.location?.longitude || null,
      isp: data.asn?.org || null,
      user_agent: ua,
      device_type: deviceType,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("getLoginMeta Error:", error);
    
    // 3. Fallback: Return what we know (User Agent & Time) if API fails
    return {
      ip_address: null,
      country: null,
      city: null,
      region: null,
      timezone: null,
      latitude: null,
      longitude: null,
      isp: null,
      user_agent: ua,
      device_type: deviceType,
      timestamp: new Date().toISOString(),
    };
  }
};