"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import "./index.css";
import "./App.css";

import { Header } from "@/components/greensecure/Header";
import { Footer } from "@/components/greensecure/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
const hideHeader = pathname === "/signup/pro" || pathname.startsWith("/auth") || pathname === "/reset-password" || pathname === "/dashboard";


  return (
    <>
      {!hideHeader && <Header />}

      {children}

      <Footer />
    </>
  );
}
