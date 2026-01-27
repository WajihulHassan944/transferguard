import React, { useEffect, useState } from "react";
import {
  Search,
  CheckCircle,
  RefreshCcw,
  Clock,
  AlertCircle,
  PauseCircle,
  MoreHorizontal,
  Download,
  Bell,
  RotateCcw,
} from "lucide-react";
import "./VideoLogTable.css";
import { baseUrl } from "@/const";
import toast from "react-hot-toast";

const VideoLogTable = ({ onUpdated, refreshKey }) => {
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedError, setSelectedError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [retryingId, setRetryingId] = useState(null);
const [openMenu, setOpenMenu] = useState(null);
 const [notifyingId, setNotifyingId] = useState(null);
  const [search, setSearch] = useState("");
  const [refundingId, setRefundingId] = useState(null);
const fetchConversions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/b2/queue`);
        const data = await res.json();
        setConversions(data.queue || []); // ✅ use queue array
      } catch (err) {
        console.error("❌ Failed to fetch conversions:", err);
      } finally {
        setLoading(false);
      }
    };

  // Fetch conversions
  useEffect(() => {
    setLoading(true);
    fetchConversions();
  }, [refreshKey]);
useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".action-menu") && !e.target.closest(".dropdown-menu-table")) {
      setOpenMenu(null);
    }
  };
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

const downloadFile = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "video";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
// Filter conversions by search + tab
const filteredConversions = conversions.filter((c) => {
  const matchesSearch =
    c.fileName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase());

  const status = c.status.toLowerCase();

  const matchesTab =
    activeTab === "all"
      ? true
      : activeTab === "queued"
      ? ["queued", "pending", "uploaded"].includes(status)
      : activeTab === "error"
      ? ["error", "failed"].includes(status)
      : status === activeTab;

  return matchesSearch && matchesTab;
});


  return (
    <div>
      {/* Search */}
      <div className="search-bar">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search uploads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table Container */}
      <div className="table-container">
        <h3>Video Uploads</h3>
        <p className="subtitle">Track all conversion jobs and their current status</p>

        {/* Tabs */}
        <div className="tabs">
          {["all", "processing", "queued", "completed", "error"].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} (
          {conversions.filter((c) => {
  const status = c.status.toLowerCase();
  return tab === "all"
    ? true
    : tab === "queued"
    ? ["queued", "pending", "uploaded"].includes(status)
    : tab === "error"
    ? ["error", "failed"].includes(status)
    : status === tab;
}).length}


              )
            </button>
          ))}
        </div>

        {/* Table */}
      <table>
  <thead>
    <tr>
      <th>Flag</th>
      <th>IP</th>
      <th>Customer</th>
      <th>File</th>
      <th>Region</th>
      <th>Status</th>
      <th>Dates</th> {/* ✅ New column */}
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {loading ? (
      [...Array(2)].map((_, i) => (
        <tr key={i}>
          <td>
            <span className="skeleton-loader" style={{ width: "24px", height: "16px" }} />
          </td>
          <td>
            <span className="skeleton-loader" style={{ width: "100px", height: "14px" }} />
          </td>
          <td>
            <div className="customer">
              <span className="skeleton-loader" style={{ width: "80px", height: "14px", display: "block", marginBottom: "4px" }} />
              <span className="skeleton-loader" style={{ width: "120px", height: "12px", display: "block" }} />
            </div>
          </td>
          <td>
            <span className="skeleton-loader" style={{ width: "100px", height: "14px", display: "block", marginBottom: "4px" }} />
            <span className="skeleton-loader" style={{ width: "50px", height: "12px", display: "block" }} />
          </td>
          <td>
            <span className="skeleton-loader" style={{ width: "60px", height: "14px" }} />
          </td>
          <td>
            <span className="skeleton-loader" style={{ width: "60px", height: "14px" }} />
          </td>
          <td>
            <span className="skeleton-loader" style={{ width: "90px", height: "14px" }} />
          </td>
          <td>
            <span className="skeleton-loader" style={{ width: "50px", height: "16px" }} />
          </td>
        </tr>
      ))
    ) : filteredConversions.length > 0 ? (
      filteredConversions.map((c, idx) => (
        <tr
          key={c.id}
          onClick={() =>
            ["error", "failed"].includes(c.status.toLowerCase())
              ? setSelectedError(c)
              : setSelectedError(null)
          }
          style={{
            cursor: ["error", "failed"].includes(c.status.toLowerCase())
              ? "pointer"
              : "default",
          }}
        >
          {/* Flag */}
          <td>
            {c.clientInfo?.flag?.img ? (
              <img
                src={c.clientInfo.flag.img}
                alt={c.clientInfo.flag.emoji}
                style={{ width: "24px", height: "16px" }}
              />
            ) : "–"}
          </td>

          {/* IP & Country */}
          <td>
            {c.clientInfo?.ip && c.clientInfo?.country ? (
              <div className="customer">
                <span className="customer-name">{c.clientInfo.country}</span>
                <span className="customer-email">{c.clientInfo.ip}</span>
              </div>
            ) : (
              <div className="customer">
                <span className="customer-name">--</span>
                <span className="customer-email">--</span>
              </div>
            )}
          </td>

          {/* Customer */}
          <td>
            <div className="customer">
              <span className="customer-name">{c.customer}</span>
              <span className="customer-email">{c.email}</span>
            </div>
          </td>

          {/* File Info */}
          <td>
            {c.fileName} <br />
            <span className="file-size">{c.fileSize || "-"}</span> <br />
            <small>
              Type: {c.fileType || "-"} | Resolution: {c.resolution || "-"} | FPS: {c.fps || "-"} | Length: {c.duration || "-"}
            </small>
          </td>

          {/* Region */}
          <td>{c.clientInfo?.region || "–"}</td>

          {/* Status */}
          <td>
            <span className={`status ${c.status.toLowerCase()}`}>
              {c.status === "completed" && <CheckCircle size={14} />}
              {c.status === "processing" && <RefreshCcw size={14} />}
              {["queued", "uploaded", "pending"].includes(c.status.toLowerCase()) && <Clock size={14} />}
              {["error", "failed"].includes(c.status.toLowerCase()) && <AlertCircle size={14} />}
              {c.status === "pending" && <PauseCircle size={14} />}
              {c.status}
            </span>
          </td>

       {/* Dates Column */}
<td className="dates-column">
  <div>
    <span className="date-label">Uploaded:</span> <span className="date-value">{c.createdAt || "-"}</span>
  </div>
  <div>
    <span className="date-label">Completed:</span> <span className="date-value">{c.completedAt || "-"}</span>
  </div>
</td>


          {/* Actions */}
          <td className="relative">
            <MoreHorizontal
              className="action-menu"
              size={18}
              onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
            />
            {openMenu === idx && (
              <div className="dropdown-menu-table">
                <button
                  className={`btn download ${!c.conversionUrl ? "disabled" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (c.conversionUrl) downloadFile(c.conversionUrl, `input-${c.fileName}`);
                  }}
                  disabled={!c.conversionUrl}
                >
                  <Download size={12} />
                  Download
                </button>
              </div>
            )}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
          No conversions found
        </td>
      </tr>
    )}
  </tbody>
</table>

        {/* Error Details */}
        {selectedError && (
          <div className="error-details">
            <AlertCircle size={16} />
            <p>
              <strong>{selectedError.fileName}</strong>
              <span>{selectedError.errorMessage || "Unknown error occurred."}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLogTable;
