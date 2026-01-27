"use client";
import React, { useState, useEffect } from "react";
import { Clock, DollarSign, Package } from "lucide-react";
import { FaArrowTrendUp } from "react-icons/fa6";
import "./ProductStats.css";
import { baseUrl } from "@/const";
const ProductStats = ({refreshKey}) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalRevenue: 0,
    activeSchedules: 0, // stays static
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/products/stats`);
        const data = await res.json();

      if (data) {
  setStats((prev) => ({
    ...prev,
    totalProducts: data.totalProducts ?? prev.totalProducts,
    activeProducts: data.activeProducts ?? prev.activeProducts,
    totalRevenue: data.totalRevenue ?? prev.totalRevenue,
    activeSchedules: data.activeSchedules ?? prev.activeSchedules, // ✅ added
  }));
}
      } catch (err) {
        console.error("Error fetching product stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshKey]);

  return (
    <div className="products-stats">
      <div className="products-stats-grid">
        {/* Total Products */}
        <div className="products-stat-card">
          <div className="products-icon products-icon-blue">
            <Package size={22} />
          </div>
          <div>
            <p className="products-label">Total Products</p>
            <h3 className="products-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats.totalProducts
              )}
            </h3>
          </div>
        </div>

        {/* Active Products */}
        <div className="products-stat-card">
          <div className="products-icon products-icon-green">
            <FaArrowTrendUp size={22} />
          </div>
          <div>
            <p className="products-label">Active Products</p>
            <h3 className="products-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats.activeProducts
              )}
            </h3>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="products-stat-card">
          <div className="products-icon products-icon-purple">
            <DollarSign size={22} />
          </div>
          <div>
            <p className="products-label">Total Revenue</p>
            <h3 className="products-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                `€${parseFloat(stats.totalRevenue).toLocaleString()}`
              )}
            </h3>
          </div>
        </div>

        {/* Active Schedules (Static) */}
        <div className="products-stat-card">
          <div className="products-icon products-icon-orange">
            <Clock size={22} />
          </div>
          <div>
            <p className="products-label">Active Schedules</p>
            <h3 className="products-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats.activeSchedules
              )}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStats;
