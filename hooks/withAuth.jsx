"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const user = useSelector((state) => state.user);
    const router = useRouter();
    const pathname = usePathname();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
      if (user.isHydrated && !user.isAuthenticated) {
        setRedirecting(true);
        router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
      }
    }, [user.isHydrated, user.isAuthenticated, router, pathname]);

    if (!user.isHydrated || redirecting) {
      return (
        <div className="auth-spinner-container">
          <div className="auth-spinner"></div>
        </div>
      );
    }

    if (user.isAuthenticated) {
      return <Component {...props} />;
    }

    return null;
  };
}
