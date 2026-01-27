import React, { useEffect, useState } from "react";
import { TrendingDown, CreditCard, Users, Clock } from "lucide-react";
import "./CreditsStats.css";
import { baseUrl } from "@/const";

const CreditsStats = ({ refreshKey }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


   const fetchStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/wallet/credits-stats`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
   


  useEffect(() => {
    setLoading(true);
    fetchStats();
  }, [refreshKey]);



  return (
   // Replace inside the return(...)
<div className="credits-stats-grid">
  <div className="stat-card">
    <div className="stat-header">
      <h3>Total Active Credits</h3>
      <CreditCard className="stat-icon" />
    </div>
    <p className="stat-value">
      {loading ? <span className="skeleton-loader" /> : stats?.totalActiveCredits || 0}
    </p>
    <p className="stat-subtext">Across all customers</p>
  </div>

  <div className="stat-card">
    <div className="stat-header">
      <h3>Expiring Soon</h3>
      <Clock className="stat-icon" />
    </div>
    <p className="stat-value" style={{ color: "#d08700" }}>
      {loading ? <span className="skeleton-loader" /> : stats?.expiringSoon || 0}
    </p>
    <p className="stat-subtext">Credits expire within 30 days</p>
  </div>

  <div className="stat-card">
    <div className="stat-header">
      <h3>Expired Credits</h3>
      <TrendingDown className="stat-icon" />
    </div>
    <p className="stat-value" style={{ color: "#e7000b" }}>
      {loading ? <span className="skeleton-loader" /> : stats?.expiredCredits || 0}
    </p>
    <p className="stat-subtext">Customers with expired credits</p>
  </div>

  <div className="stat-card">
    <div className="stat-header">
      <h3>Total Customers</h3>
      <Users className="stat-icon" />
    </div>
    <p className="stat-value">
      {loading ? <span className="skeleton-loader" /> : stats?.totalCustomers || 0}
    </p>
    <p className="stat-subtext">With credit balances</p>
  </div>
</div>
 );
};

export default CreditsStats;
