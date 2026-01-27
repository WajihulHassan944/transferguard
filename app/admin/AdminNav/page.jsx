"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  FileText,
  Image,
  Users,
  ShoppingCart,
  Tag,
  Search,
  Settings,
  X,
  CreditCard,
  RefreshCcw,
  BookOpen,
  Package,
  MessageSquare,
  Logs
} from "lucide-react";
import "./adminSideNav.css";
import TopNavRight from "./TopNav/TopNavRight/TopNavRight";

const AdminSideNav = ({ isOpen, setIsOpen }) => {
  const toggleNav = () => setIsOpen(!isOpen);
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/media", label: "Media", icon: Image },
    { href: "/admin/pages", label: "Pages", icon: FileText },
        { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: Package },
     { href: "/admin/credits", label: "Credits", icon: CreditCard },
       { href: "/admin/conversions", label: "Conversions", icon: RefreshCcw },
    { href: "/admin/coupons", label: "Coupons", icon: Tag },
       { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
    { href: "/admin/videologs", label: "Upload Logs", icon: Logs },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
  <>
    {/* Mobile Hamburger (only visible ≤768px via CSS) */}
    <div className="mobile-hamburger">
      <Menu className="toggle-icon" onClick={toggleNav} />
    </div>

<div className="topNavHeaderMobile">
  <TopNavRight />
</div>


    {/* Sidebar */}
    <div className={`side-nav ${isOpen ? "open" : "collapsed"}`}>
      {/* Header */}
      <div className="side-nav-header">
       {isOpen ? ( <> <h2>Admin Panel</h2> <X className="toggle-icon" onClick={toggleNav} /> </> ) : ( <Menu className="toggle-icon collapsed-toggle" onClick={toggleNav} /> )}
      </div>

      {/* Menu */}
      <ul className="side-nav-menu">
        {navItems.map(({ href, label, icon: Icon }) => {
          let isActive = false;

          if (href === "/admin") {
            isActive = pathname === "/admin";
          } else {
            isActive = pathname === href || pathname.startsWith(href + "/");
          }

          return (
            <Link href={href} key={href} onClick={() => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  }}>
              <li className={isActive ? "active" : ""}>
                <Icon className="side-nav-icon" />
                {isOpen && <span>{label}</span>}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  </>
);

};

export default AdminSideNav;
