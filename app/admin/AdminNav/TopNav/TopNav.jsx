'use client';
import React from "react";
import "./TopNav.css";
import TopNavRight from "./TopNavRight/TopNavRight";

const TopNav = ({ isSidebarOpen }) => {
  return (
    <div className={`top-nav ${isSidebarOpen ? "shifted" : "full"}`}>
      <div className="top-nav-left">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's an overview of your business.</p>
      </div>
      <TopNavRight />
    </div>
  );
};

export default TopNav;
