"use client";
import React, { useState } from "react";
import "./credits.css";
import { GeistSans } from "geist/font/sans";
import withAdminAuth from "@/hooks/withAdminAuth";
import CreditsStats from "./CreditsStats/CreditsStats";
import CreditsTable from "./CreditsTable/CreditsTable";

const Credits = () => {
const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={`credits-container ${GeistSans.className}`}>
      <div className="credits-header">
        <div>
          <h2>Credits Management</h2>
          <p>Track customer credits, manage expiry dates, and adjust balances</p>
        </div>
      </div>

<CreditsStats refreshKey={refreshKey} />
<CreditsTable onUpdated={handleRefresh} />
    </div>
  );
};

export default withAdminAuth(Credits);
