"use client";
import React, { useEffect, useState } from "react";
import { Tag, CalendarCheck, Euro, Percent } from "lucide-react";
import { baseUrl } from "@/const";
const CouponsStats = ({ refreshKey }) => {
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    totalSavings: "€0",
    usageRate: "0%",
  });

  const [loading, setLoading] = useState(true);

   const fetchStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/coupons/stats`); // ✅ API endpoint
        const data = await res.json();

        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Error fetching coupon stats:", err);
      } finally {
        setLoading(false);
      }
    };
    
     useEffect(() => {
    setLoading(true);
    fetchStats();
  }, [refreshKey]); 
    
  return (
   <div className="coupon-stats">
   <div className="stats-grid">
      <div className="stat-card">
        <Tag className="icon tag" />
        <div>
          <p>Total Coupons</p>
          <h3>{loading ? "…" : stats.totalCoupons}</h3>
        </div>
      </div>
      <div className="stat-card">
        <CalendarCheck className="icon calendar" />
        <div>
          <p>Active Coupons</p>
          <h3>{loading ? "…" : stats.activeCoupons}</h3>
        </div>
      </div>
      <div className="stat-card">
        <Euro className="icon dollar" />
        <div>
          <p>Total Savings</p>
          <h3>{loading ? "…" : stats.totalSavings}</h3>
        </div>
      </div>
      <div className="stat-card">
        <Percent className="icon percent" />
        <div>
          <p>Usage Rate</p>
          <h3>{loading ? "…" : stats.usageRate}</h3>
        </div>
      </div>
    </div></div>
  );
};

export default CouponsStats;
