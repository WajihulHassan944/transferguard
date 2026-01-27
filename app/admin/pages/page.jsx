"use client";
import React, { useEffect, useState } from "react";
import "./pages.css";
import { GeistSans } from "geist/font/sans";
import withAdminAuth from "@/hooks/withAdminAuth";
import PagesStats from "./PagesStats/PagesStats";
import PagesList from "./PagesList/PagesList";
import { baseUrl } from "@/const";

const Pages = () => {
  const [isComingSoon, setIsComingSoon] = useState(false);
const [isStickyNav, setIsStickyNav] = useState(false);
const [actionsOpen, setActionsOpen] = useState(false);
const actionsRef = React.useRef(null);

useEffect(() => {
  function handleClickOutside(e) {
    if (actionsRef.current && !actionsRef.current.contains(e.target)) {
      setActionsOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  // Fetch initial status
  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await fetch(`${baseUrl}/pages/coming-soon/status`);
        const data = await res.json();
        setIsComingSoon(data.isComingSoon);
        setIsStickyNav(data.isStickyNav);
      } catch (err) {
        console.log("Error fetching coming soon status:", err);
      }
    };

    getStatus();
  }, []);

  // Toggle Handler
  const toggleComingSoon = async () => {
    try {
      const newValue = !isComingSoon;

      await fetch(`${baseUrl}/pages/toggle-coming-soon`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isComingSoon: newValue }),
      });

      setIsComingSoon(newValue);
    } catch (err) {
      console.log("Error toggling coming soon:", err);
    }
  };

  const toggleStickyNav = async () => {
  try {
    const newValue = !isStickyNav;

    await fetch(`${baseUrl}/pages/toggle-sticky-nav`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isStickyNav: newValue }),
    });

    setIsStickyNav(newValue);
  } catch (err) {
    console.log("Error toggling sticky nav:", err);
  }
};


  return (
    <div className={`pages-container ${GeistSans.className}`}>
      <div className="pages-header">
        <div>
          <h2>Pages</h2>
          <p>Manage your website pages and content</p>
        </div>

       {/* Actions Dropdown */}
<div className="pages-actions" ref={actionsRef}>
  <button 
    className="pages-actions-btn"
    onClick={() => setActionsOpen(!actionsOpen)}
  >
    Actions ▾
  </button>

  {actionsOpen && (
    <div className="pages-actions-dropdown">

      {/* Maintenance Mode */}
      <div className="pages-toggle-row" onClick={toggleComingSoon}>
        <label>Maintenance Mode</label>
        <div className={`toggle-switch ${isComingSoon ? "active" : "inactive"}`}>
          <span className="toggle-knob"></span>
        </div>
      </div>

      {/* Sticky Navbar */}
      <div className="pages-toggle-row" onClick={toggleStickyNav}>
        <label>Sticky CouponBanner</label>
        <div className={`toggle-switch ${isStickyNav ? "active" : "inactive"}`}>
          <span className="toggle-knob"></span>
        </div>
      </div>

    </div>
  )}
</div>

      </div>

      <PagesStats />
      <PagesList />
    </div>
  );
};

export default withAdminAuth(Pages);
