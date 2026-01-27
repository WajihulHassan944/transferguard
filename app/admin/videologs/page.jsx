"use client";
import React, { useState } from "react";
import "./VideoLog.css";
import { GeistSans } from "geist/font/sans";
import withAdminAuth from "@/hooks/withAdminAuth";
import { RefreshCcw } from "lucide-react";
import VideoLogTable from "./VideoLogTable/VideoLogTable";
import VideoLogStats from "./VideoLogStats/VideoLogStats";

const VideoLog = () => {
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
          <h2>Upload Logs</h2>
          <p>Monitor uploads, track progress, and manage processing status</p>
        </div>
        <button className="add-btn" onClick={handleRefresh}>
          <span className={`btn-plus ${isRotating ? "rotating" : ""}`}>
            <RefreshCcw size={15} />
          </span>
          Refresh
        </button>
      </div>
      <VideoLogStats refreshKey={refreshKey} />
      <VideoLogTable onUpdated={handleRefresh} refreshKey={refreshKey} />
    </div>
  );
};

export default withAdminAuth(VideoLog);
