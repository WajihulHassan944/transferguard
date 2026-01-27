import React, { useEffect, useState } from "react";
import { Users, UserCheck, UserX, Shield } from "lucide-react";
import "./UserStats.css";
import { baseUrl } from "@/const";

const UserStats = ({ refreshKey }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/users/stats`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch stats");
        setStats(data.stats);
      } catch (err) {
        console.error("Error fetching user stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshKey]);

  const renderValue = (value) =>
    loading ? <span className="skeleton-loader" /> : value ?? "--";

  if (error) {
    return (
      <div className="users-stats-error">
        <p>⚠️ Failed to load stats: {error}</p>
      </div>
    );
  }

  return (
    <div className="users-stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <h3>Total Users</h3>
          <Users className="stat-icon" />
        </div>
        <p className="stat-value">
          {renderValue(stats?.totalUsers)}
        </p>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <h3>Active Users</h3>
          <UserCheck className="stat-icon" color="#00c951" />
        </div>
        <p className="stat-value">
          {renderValue(stats?.activeUsers)}
        </p>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <h3>Inactive Users</h3>
          <UserX className="stat-icon" color="#ff6900" />
        </div>
        <p className="stat-value">
          {renderValue(stats?.inactiveUsers)}
        </p>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <h3>Administrators</h3>
          <Shield className="stat-icon" color="#2b7fff" />
        </div>
        <p className="stat-value">
          {renderValue(stats?.administrators)}
        </p>
      </div>
    </div>
  );
};

export default UserStats;
