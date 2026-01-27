import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  RefreshCcw,
  Clock,
  AlertCircle,
  Play,
} from "lucide-react";
import "./ConversionStats.css";
import { baseUrl } from "@/const";

const ConversionStats = ({ refreshKey }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  
    const fetchStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/b2/stats`);
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
  

  useEffect(() => {
    setLoading(true);
    fetchStats();
  }, [refreshKey]);

  return (
    <div className="conversion-stats-grid">
      {/* Total Conversions */}
      <div className="stat-card">
        <div className="stat-header">
          <h3>Total Conversions</h3>
          <Play className="stat-icon" />
        </div>
        <p className="stat-value">
          {loading ? <span className="skeleton-loader" /> : stats?.totalConversions || 0}
        </p>
        <p className="stat-subtext">All time</p>
      </div>

      {/* Completed */}
      <div className="stat-card">
        <div className="stat-header">
          <h3>Completed</h3>
          <CheckCircle className="stat-icon success" />
        </div>
        <p className="stat-value success">
          {loading ? <span className="skeleton-loader" /> : stats?.completed || 0}
        </p>
        <p className="stat-subtext">
          {loading ? <span className="skeleton-loader" /> : `${stats?.successRate || "0%"} success rate`}
        </p>
      </div>

      {/* Processing */}
      <div className="stat-card">
        <div className="stat-header">
          <h3>Processing</h3>
          <RefreshCcw className="stat-icon processing" />
        </div>
        <p className="stat-value processing">
          {loading ? <span className="skeleton-loader" /> : stats?.processing || 0}
        </p>
        <p className="stat-subtext">Currently active</p>
      </div>

      {/* In Queue */}
      <div className="stat-card">
        <div className="stat-header">
          <h3>In Queue</h3>
          <Clock className="stat-icon queue" />
        </div>
        <p className="stat-value queue">
          {loading ? <span className="skeleton-loader" /> : stats?.queued || 0}
        </p>
        <p className="stat-subtext">Waiting to process</p>
      </div>

      {/* Errors */}
      <div className="stat-card">
        <div className="stat-header">
          <h3>Errors</h3>
          <AlertCircle className="stat-icon error" />
        </div>
        <p className="stat-value error">
          {loading ? <span className="skeleton-loader" /> : stats?.errors || 0}
        </p>
        <p className="stat-subtext">Need attention</p>
      </div>
    </div>
  );
};

export default ConversionStats;
