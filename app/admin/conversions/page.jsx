"use client";
import React, { useState } from "react";
import "./conversions.css";
import { GeistSans } from "geist/font/sans";
import withAdminAuth from "@/hooks/withAdminAuth";
import ConversionStats from "./ConversionStats/ConversionStats";
import { RefreshCcw } from "lucide-react";
import ConversionTable from "./ConversionTable/ConversionTable";

const Conversions = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setIsRotating(true);

    // stop rotation after 2s
    setTimeout(() => {
      setIsRotating(false);
    }, 2000);
  };

  return (
    <div className={`conversions-container ${GeistSans.className}`}>
      <div className="conversions-header">
        <div>
          <h2>Conversions Tracking</h2>
          <p>Monitor conversion queue, track progress, and manage processing status</p>
        </div>
        <button className="add-btn" onClick={handleRefresh}>
          <span className={`btn-plus ${isRotating ? "rotating" : ""}`}>
            <RefreshCcw size={15} />
          </span>
          Refresh
        </button>
      </div>
      <ConversionStats refreshKey={refreshKey} />
      <ConversionTable onUpdated={handleRefresh} refreshKey={refreshKey} />
    </div>
  );
};

export default withAdminAuth(Conversions);
