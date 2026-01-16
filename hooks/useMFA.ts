import { useState, useEffect } from "react";

export type MFAStatus = "loading" | "unenrolled" | "enrolled_unverified" | "verified";

export function useMFA() {
  const [status, setStatus] = useState<MFAStatus>("loading");
  const [isEnrolled, setIsEnrolled] = useState(false);

  const checkMFAStatus = async () => {
  };

  useEffect(() => {
    checkMFAStatus();
  }, []);

  return {
    status,
    isEnrolled,
    checkMFAStatus,
  };
}
