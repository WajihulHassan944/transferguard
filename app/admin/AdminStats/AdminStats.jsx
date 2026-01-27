"use client";
import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Users,
  LineChart,
  DollarSign,
} from "lucide-react";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { baseUrl } from "@/const";
const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/auth/dashboard-stats`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // optional: refresh every 10 seconds for live visitors
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stats-grid">
      {/* 🟩 Total Revenue */}
      <div className="stat-card">
        <div className="stat-header">
          <h3>Total Revenue This Month</h3>
          <DollarSign className="stat-icon" />
        </div>
        <p className="stat-value">
          {loading ? (
            <span className="skeleton-loader" />
          ) : (
            `${stats?.totalRevenueThisMonth?.currency}${stats?.totalRevenueThisMonth?.value}`
          )}
        </p>
        {!loading && (
          <p className="stat-change">
            <span
              className={
                parseFloat(stats?.totalRevenueThisMonth?.change) >= 0
                  ? "positive"
                  : "negative"
              }
            >
              {parseFloat(stats?.totalRevenueThisMonth?.change) >= 0 ? (
                <FaArrowTrendUp />
              ) : (
                <FaArrowTrendDown />
              )}{" "}
              {Math.abs(stats?.totalRevenueThisMonth?.change)}%
            </span>{" "}
            vs last month
          </p>
        )}
      </div>

      {/* 🛒 Orders Today */}
      <div className="stat-card">
        <div className="stat-header">
          <h3>Orders Today</h3>
          <ShoppingCart className="stat-icon" />
        </div>
        <p className="stat-value">
          {loading ? <span className="skeleton-loader" /> : stats?.ordersToday?.value}
        </p>
        {!loading && (
          <p className="stat-change">
            <span
              className={
                parseFloat(stats?.ordersToday?.change) >= 0
                  ? "positive"
                  : "negative"
              }
            >
              {parseFloat(stats?.ordersToday?.change) >= 0 ? (
                <FaArrowTrendUp />
              ) : (
                <FaArrowTrendDown />
              )}{" "}
              {Math.abs(stats?.ordersToday?.change)}%
            </span>{" "}
            vs yesterday
          </p>
        )}
      </div>

      {/* 📈 Conversion Rate */}
      <div className="stat-card">
        <div className="stat-header">
          <h3>Conversion Rate</h3>
          <LineChart className="stat-icon" />
        </div>
        <p className="stat-value">
          {loading ? <span className="skeleton-loader" /> : `${stats?.conversionRate?.value}%`}
        </p>
        {!loading && (
          <p className="stat-change">
            <span
              className={
                parseFloat(stats?.conversionRate?.change) >= 0
                  ? "positive"
                  : "negative"
              }
            >
              {parseFloat(stats?.conversionRate?.change) >= 0 ? (
                <FaArrowTrendUp />
              ) : (
                <FaArrowTrendDown />
              )}{" "}
              {Math.abs(stats?.conversionRate?.change)}%
            </span>{" "}
            this week
          </p>
        )}
      </div>

      {/* 👥 Live Visitors */}
      <div className="stat-card">
        <div className="stat-header">
          <h3>Live Visitors</h3>
          <Users className="stat-icon" />
        </div>
        <p className="stat-value">
          {loading ? <span className="skeleton-loader" /> : stats?.liveVisitors?.value}
        </p>
        <p className="stat-change">
          <span className="positive">●</span> Real-time active
        </p>
      </div>
    </div>
  );
};

export default AdminStats;
