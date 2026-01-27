"use client";
import React, { useState } from "react";
import "./coupons.css";
import { GeistSans } from "geist/font/sans";
import CouponsStats from "./home/CouponsStats";
import CouponsTable from "./home/CouponsTable";
import Link from "next/link";
import withAdminAuth from "@/hooks/withAdminAuth";

const Coupons = () => {
const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={`coupons-container ${GeistSans.className}`}>
      {/* Header */}
      <div className="coupons-header">
        <div>
          <h2>Coupons</h2>
          <p>Manage discount coupons and promotional codes</p>
        </div>
        <Link href="/admin/coupons/new" className="add-btn">
          <span className="btn-plus">+</span> Add New Coupon
        </Link>
      </div>

      <CouponsStats refreshKey={refreshKey} />

      <CouponsTable onDeleted={handleRefresh} />
    </div>
  );
};

export default withAdminAuth(Coupons);
