export const getLoginMeta = async () => {
  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();

    if (!data.success) throw new Error("IP lookup failed");

    return {
      ip_address: data.ip,
      country: data.country,
      city: data.city,
      region: data.region,
      timezone: data.timezone?.id,
      latitude: data.latitude,
      longitude: data.longitude,
      isp: data.connection?.isp,
      user_agent: navigator.userAgent,
      device_type: /mobile/i.test(navigator.userAgent)
        ? "mobile"
        : "desktop",
      timestamp: new Date().toISOString(),
    };
  } catch {
    // Fallback if IP service fails
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
