"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function withAdminAuth(Component) {
  return function AdminAuthenticatedComponent(props) {
    const user = useSelector((state) => state.user);
    const router = useRouter();
    const pathname = usePathname();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
      if (user.isHydrated) {
        if (!user.isAuthenticated || !(user.role === "admin")) {
          setRedirecting(true);
          // router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
                router.replace(`/`);
    
        }
      }
    }, [user.isHydrated, user.isAuthenticated, user.role, pathname, router]);

    // While Redux is hydrating
    if (!user.isHydrated) {
      return (
        <div className="auth-spinner-container">
          <div className="auth-spinner"></div>
        </div>
      );
    }

    // While redirecting
    if (redirecting) {
      return (
        <div className="auth-spinner-container">
          <div className="auth-spinner"></div>
        </div>
      );
    }

    // If authenticated and has superadmin role
  if (user.isHydrated && user.isAuthenticated && user.role === "admin") {
      return <Component {...props} />;
    }

    // Otherwise render nothing
    return null;
  };
}
