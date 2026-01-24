"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import "./index.css";
import "./App.css";
import { Toaster } from "sonner";
import { Header } from "@/components/greensecure/Header";
import { Footer } from "@/components/greensecure/Footer";

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import UserInitializer from './UserInitializer';


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
const hideHeader = pathname === "/signup/pro" || pathname.startsWith("/auth") || pathname === "/reset-password" || pathname === "/dashboard";


  return (
    <>
   <Provider store={store}>
        <UserInitializer />

    <Toaster  position="bottom-right" />
      {!hideHeader && <Header />}

      {children}

      <Footer />
      </Provider>
    </>
  );
}
