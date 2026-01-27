"use client";
import React, { useState, useEffect } from "react";
import { FileText, Globe, Edit3, Eye } from "lucide-react";
import "./PagesStats.css";
import { baseUrl } from "@/const";

const PagesStats = () => {
  const [stats, setStats] = useState({
    totalPages: 0,
    publishedPages: 0,
    draftPages: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/pages/stats`);
        const data = await res.json();

        if (data.success && data.stats) {
          setStats({
            totalPages: data.stats.totalPages || 0,
            publishedPages: data.stats.publishedPages || 0,
            draftPages: data.stats.draftPages || 0,
            totalViews: data.stats.totalViews?.toLocaleString() || "0",
          });
        }
      } catch (error) {
        console.error("Failed to fetch page stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="pages-stats">
      <div className="pages-stats-grid">
        {/* Total Pages */}
        <div className="pages-stat-card">
          <div className="pages-icon pages-icon-blue">
            <FileText size={22} />
          </div>
          <div>
            <p className="pages-label">Total Pages</p>
            <h3 className="pages-value">
              {loading ? <span className="skeleton-loader" /> : stats.totalPages}
            </h3>
          </div>
        </div>

        {/* Published */}
        <div className="pages-stat-card">
          <div className="pages-icon pages-icon-green">
            <Globe size={22} />
          </div>
          <div>
            <p className="pages-label">Published</p>
            <h3 className="pages-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats.publishedPages
              )}
            </h3>
          </div>
        </div>

        {/* Drafts */}
        <div className="pages-stat-card">
          <div className="pages-icon pages-icon-orange">
            <Edit3 size={22} />
          </div>
          <div>
            <p className="pages-label">Drafts</p>
            <h3 className="pages-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats.draftPages
              )}
            </h3>
          </div>
        </div>

        {/* Total Views */}
        <div className="pages-stat-card">
          <div className="pages-icon pages-icon-purple">
            <Eye size={22} />
          </div>
          <div>
            <p className="pages-label">Total Views</p>
            <h3 className="pages-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats.totalViews
              )}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagesStats;
