import React, { useEffect, useState } from "react";
import {
  Package,
  TrendingUp,
  CreditCard,
  Users,
  BarChart3,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./OrderStats.css";
import { baseUrl } from "@/const";

const OrderStats = ({ refreshKey }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("this_week");
  const [error, setError] = useState(null);

  // For custom range
  const [customStart, setCustomStart] = useState(null);
  const [customEnd, setCustomEnd] = useState(null);

  const fetchStats = async (selectedPeriod, start, end) => {
    try {
      setLoading(true);
      setError(null);

      let url = `${baseUrl}/wallet/orders-stats?period=${selectedPeriod}`;
      if (selectedPeriod === "custom" && start && end) {
        url += `&customStart=${start.toISOString()}&customEnd=${end.toISOString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load stats");

      setStats(data);
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (period === "custom") {
      if (customStart && customEnd) {
        fetchStats("custom", customStart, customEnd);
      }
    } else {
      fetchStats(period);
    }
  }, [period, refreshKey, customStart, customEnd]);

  return (
    <div className="order-stats-container">
      <div className="order-stats-header">
        <div>
          <h2>
            <BarChart3 className="analytics-icon" /> Order Analytics
          </h2>
          <p>Track performance across different time periods</p>
        </div>
        <div className="order-stats-controls">
          <select
            className="order-stats-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
             <option value="this_week">This Week</option>
            <option value="last_week">Last Week</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
            <option value="custom">Custom Range</option>
         
           </select>

          {period === "custom" && (
            <div className="custom-date-range">
              <DatePicker
                selected={customStart}
                onChange={(date) => setCustomStart(date)}
                selectsStart
                startDate={customStart}
                endDate={customEnd}
                placeholderText="Start Date"
              />
              <span>to</span>
              <DatePicker
                selected={customEnd}
                onChange={(date) => setCustomEnd(date)}
                selectsEnd
                startDate={customStart}
                endDate={customEnd}
                minDate={customStart}
                placeholderText="End Date"
              />
            </div>
          )}
        </div>
      </div>

      {error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="order-stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Total Orders</h3>
              <Package className="stat-icon" />
            </div>
            <p className="stat-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats?.totalOrders || 0
              )}
            </p>
            <p className="stat-subtext">{period.replace(/([A-Z])/g, " $1")}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h3>Completed Orders</h3>
              <TrendingUp className="stat-icon" />
            </div>
            <p className="stat-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats?.totalOrders || 0
              )}
            </p>
            <p className="stat-subtext">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                `100% placed successfully`
              )}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h3>Total Revenue</h3>
              <CreditCard className="stat-icon" />
            </div>
            <p className="stat-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                `€${Number(stats?.totalRevenue || 0).toFixed(2)}`
              )}
            </p>
            <p className="stat-subtext">
              {period.replace(/([A-Z])/g, " $1")} revenue
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h3>Avg Order Value</h3>
              <Users className="stat-icon" />
            </div>
            <p className="stat-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                `€${Number(stats?.avgOrderValue || 0).toFixed(2)}`
              )}
            </p>
            <p className="stat-subtext">Average per order</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStats;
