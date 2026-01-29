"use client";

import { useAppSelector } from "@/redux/hooks";
import { useState, useEffect } from "react";

export type MFAStatus =
  | "loading"
  | "unenrolled"
  | "enrolled_unverified"
  | "verified";

export function useMFA() {
  const user = useAppSelector((state) => state.user);
  const [status, setStatus] = useState<MFAStatus>("loading");
  const [isEnrolled, setIsEnrolled] = useState(false);

  const checkMFAStatus = () => {
    if (!user || !user.id) {
      setStatus("loading");
      setIsEnrolled(false);
      return;
    }

    if (user.twoFAEnabled) {
      setStatus("verified");
      setIsEnrolled(true);
    } else {
      setStatus("unenrolled");
      setIsEnrolled(false);
    }
  };

  useEffect(() => {
    checkMFAStatus();
  }, [user]);

  return {
    status,
    isEnrolled,
    checkMFAStatus,
  };
}
