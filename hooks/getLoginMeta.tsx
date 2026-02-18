import { baseUrl } from "@/const";

export const getLoginMeta = async () => {
  try {
    const res = await fetch(`${baseUrl}/transfers/login-meta`);
    return await res.json();
  } catch {
    return {
      ip_address: null,
      country: null,
      city: null,
      region: null,
      timezone: null,
      latitude: null,
      longitude: null,
      isp: null,
      user_agent: navigator.userAgent,
      device_type: "unknown",
      timestamp: new Date().toISOString(),
    };
  }
};
