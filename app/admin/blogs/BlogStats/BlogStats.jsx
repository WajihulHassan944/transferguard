"use client";
import React, { useState, useEffect } from "react";
import { FileText, Eye, Edit, Clock } from "lucide-react";
import "./BlogStats.css";
import { baseUrl } from "@/const";

const BlogStats = ({ refreshKey }) => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    published: 0,
    drafts: 0,
    scheduled: 0,
  });

  const [loading, setLoading] = useState(true);
const fetchStats = async () => {
  try {
    setLoading(true);
    const res = await fetch(`${baseUrl}/blogs/stats`, {
      cache: "no-store",
      credentials: "include", // ✅ ensures cookies/session are sent
    });

    const data = await res.json();

    if (data.success && data.stats) {
      setStats(data.stats);
    } else {
      console.error("Failed to load stats:", data);
    }
  } catch (err) {
    console.error("Error fetching stats:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  return (
    <div className="pages-stats">
      <div className="pages-stats-grid">
        {/* Total Posts */}
        <div className="pages-stat-card">
          <div className="pages-icon pages-icon-blue">
            <FileText size={22} />
          </div>
          <div>
            <p className="pages-label">Total Posts</p>
            <h3 className="pages-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats.totalPosts
              )}
            </h3>
          </div>
        </div>

        {/* Published */}
        <div className="pages-stat-card">
          <div className="pages-icon pages-icon-green">
            <Eye size={22} />
          </div>
          <div>
            <p className="pages-label">Published</p>
            <h3 className="pages-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats.published
              )}
            </h3>
          </div>
        </div>

        {/* Drafts */}
        <div className="pages-stat-card">
          <div className="pages-icon pages-icon-orange">
            <Edit size={22} />
          </div>
          <div>
            <p className="pages-label">Drafts</p>
            <h3 className="pages-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats.drafts
              )}
            </h3>
          </div>
        </div>

        {/* Scheduled */}
        <div className="pages-stat-card">
          <div className="pages-icon pages-icon-purple">
            <Clock size={22} />
          </div>
          <div>
            <p className="pages-label">Scheduled</p>
            <h3 className="pages-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats.scheduled
              )}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogStats;
