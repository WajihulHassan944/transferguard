"use client";
import React, { useState, useEffect } from "react";
import "./MediaStats.css";
import { baseUrl } from "@/const";

const MediaStats = ({refreshKey}) => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    images: 0,
    videos: 0,
    storageUsed: "0 MB",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/media/stats`, {
          headers: {
            "Content-Type": "application/json",
            // Optional: Include auth token if route is protected
            // Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching media stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshKey]);

  return (
    <div className="media-stats">
      <div className="media-stats-grid">
        {/* Total Files */}
        <div className="media-stat-card">
          <div>
            <h3 className="media-value">
              {loading ? <span className="skeleton-loader" /> : stats.totalFiles}
            </h3>
            <p className="media-label">Total Files</p>
          </div>
        </div>

        {/* Images */}
        <div className="media-stat-card">
          <div>
            <h3 className="media-value">
              {loading ? <span className="skeleton-loader" /> : stats.images}
            </h3>
            <p className="media-label">Images</p>
          </div>
        </div>

        {/* Videos */}
        <div className="media-stat-card">
          <div>
            <h3 className="media-value">
              {loading ? <span className="skeleton-loader" /> : stats.videos}
            </h3>
            <p className="media-label">Videos</p>
          </div>
        </div>

        {/* Storage Used */}
        <div className="media-stat-card">
          <div>
            <h3 className="media-value">
              {loading ? (
                <span className="skeleton-loader" />
              ) : (
                stats.storageUsed
              )}
            </h3>
            <p className="media-label">Storage Used</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaStats;
