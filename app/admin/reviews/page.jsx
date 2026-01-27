"use client";
import React, { useState } from "react";
import "./reviews.css";
import { GeistSans } from "geist/font/sans";
import withAdminAuth from "@/hooks/withAdminAuth";
import ReviewStats from "./ReviewStats/ReviewStats";
import ReviewsTable from "./ReviewsTable/ReviewsTable";

const Pages = () => {
const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <div className={`reviews-container ${GeistSans.className}`}>
      <div className="reviews-header">
        <div>
          <h2>Reviews</h2>
          <p>Manage and moderate customer reviews</p>
        </div>
         </div>
<ReviewStats refreshKey={refreshKey} />
<ReviewsTable onSave={handleRefresh} refreshKey={refreshKey} />
    </div>
  );
};

export default withAdminAuth(Pages);
