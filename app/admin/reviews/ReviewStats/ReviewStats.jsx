"use client"; 
import React, { useState, useEffect } from "react";
import { Check, Plus, Star, X } from "lucide-react";
import "./ReviewStats.css";
import { baseUrl } from "@/const";

const ReviewStats = ({ refreshKey }) => {
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgRating: 0,
    pending: 0,
    approved: 0, 
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/reviews/stats`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching review stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and whenever refreshKey changes
  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  return (
    <div className="reviews-stats">
      <div className="reviews-stats-grid">
        {/* Total Reviews */}
        <div className="reviews-stat-card">
          <div className="reviews-icon reviews-icon-blue">
            <Star size={18} />
          </div>
          <div>
            <p className="reviews-label">Total Reviews</p>
            <h3 className="reviews-value">
              {loading ? <span className="skeleton-loader" /> : stats.totalReviews}
            </h3>
          </div>
        </div>

        {/* Avg Rating */}
        <div className="reviews-stat-card">
          <div className="reviews-icon reviews-icon-orange">
            <Star size={18} />
          </div>
          <div>
            <p className="reviews-label">Avg Rating</p>
            <h3 className="reviews-value">
              {loading ? <span className="skeleton-loader" /> : stats.avgRating}
            </h3>
          </div>
        </div>

        {/* Pending */}
        <div className="reviews-stat-card">
          <div className="reviews-icon reviews-icon-red">
            <Plus size={18} />
          </div>
          <div>
            <p className="reviews-label">Pending</p>
            <h3 className="reviews-value">
              {loading ? <span className="skeleton-loader" /> : stats.pending}
            </h3>
          </div>
        </div>

        {/* Approved */}
        <div className="reviews-stat-card">
          <div className="reviews-icon reviews-icon-green">
            <Check size={18} />
          </div>
          <div>
            <p className="reviews-label">Approved</p>
            <h3 className="reviews-value">
              {loading ? <span className="skeleton-loader" /> : stats.approved}
            </h3>
          </div>
        </div>

        {/* Rejected */}
        <div className="reviews-stat-card">
          <div className="reviews-icon reviews-icon-red">
            <X size={18} />
          </div>
          <div>
            <p className="reviews-label">Rejected</p>
            <h3 className="reviews-value">
              {loading ? <span className="skeleton-loader" /> : stats.rejected}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;
