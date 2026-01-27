"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import "./index.css";
import "./App.css";
import { Toaster } from "sonner";
import { Header } from "@/components/greensecure/Header";
import { Footer } from "@/components/greensecure/Footer";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import UserInitializer from "./UserInitializer";
import { useAppSelector } from "@/redux/hooks";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Provider store={store}>
      <UserInitializer />

      <Toaster position="bottom-right" />

      <LayoutContent pathname={pathname}>{children}</LayoutContent>
    </Provider>
  );
}

// ✅ Separate inner component that can safely use useAppSelector
const LayoutContent: React.FC<{ pathname: string; children: React.ReactNode }> = ({
  pathname,
  children,
}) => {
  const user = useAppSelector((state) => state.user);

  // Normalize role safely
  const role =
    typeof user.role === "string"
      ? user.role
      : Array.isArray(user.role) && user.role.length > 0
      ? String(user.role[0])
      : null;
console.log(role);
  // Determine if header/footer should be hidden
  const hideHeader =
    pathname === "/admin/login" ||
    pathname === "/coming-soon" ||
    pathname === "/signup/pro" ||
    pathname.startsWith("/auth") ||
    pathname === "/reset-password" ||
    pathname === "/dashboard" ||
    role !== "admin";

  const hideFooter =
    pathname === "/admin/login" ||
    pathname === "/coming-soon" ||
    pathname === "/dashboard" ||
    role !== "admin";

  return (
    <>
      {!hideHeader && <Header />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
};
