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
import "./ConversionTable.css";
import { baseUrl } from "@/const";
import toast from "react-hot-toast";

const ConversionTable = ({ onUpdated, refreshKey }) => {
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
const handleSendNotification = async (videoId) => {
  try {
     setNotifyingId(videoId);
    const res = await fetch(`${baseUrl}/b2/videos/resend-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId }),
    });

    const data = await res.json();
    if (data.success) {
      console.log("✅ Notification re-sent:", data.message);
      toast.success("Notification sent successfully!");
    } else {
      toast.error(data.error || "Failed to send notification");
    }
  } catch (err) {
    console.error("❌ Error sending notification:", err);
    toast.error("Server error while sending notification");
  }finally{
    setOpenMenu(false);
    setNotifyingId(null);
  }
};

const handleRefundCredits = async (videoId) => {
  try {
    setRefundingId(videoId);
    const res = await fetch(`${baseUrl}/wallet/videos/refund-credits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success(data.message || "Credits refunded successfully!");
      fetchConversions();
    } else {
      toast.error(data.error || "Failed to refund credits");
    }
  } catch (err) {
    console.error("❌ Error refunding credits:", err);
    toast.error("Server error while refunding credits");
  } finally {
    setRefundingId(null);
    setOpenMenu(false);
  }
};

const handleRetry = async (id, status) => {
  setRetryingId(id); // start animation
  try {
    const res = await fetch(`${baseUrl}/b2/videos/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
      body: JSON.stringify({ videoId: id, status: "queued" }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Retry failed");

    setConversions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "queued" } : c))
    );
    setSelectedError(null);
    setOpenMenu(null);
  } catch (err) {
    console.error("❌ Retry failed:", err);
  } finally {
    setRetryingId(null); // stop animation
  }
  if(status === "failed" || status === "error"){
    onUpdated();
  }
};
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
          placeholder="Search conversions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table Container */}
      <div className="table-container">
        <h3>Conversion Queue</h3>
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
              <th>Status</th>
              <th>Customer</th>
              <th>File</th>
              <th>Type</th>
              <th>Progress</th>
              <th>Credits</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {loading ? (
    [...Array(2)].map((_, i) => (
      <tr key={i}>
        <td>
          <span className="skeleton-loader" style={{ width: "60px", height: "16px" }} />
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
          <span className="skeleton-loader" style={{ width: "90px", height: "14px" }} />
        </td>
        <td>
          <span className="skeleton-loader" style={{ width: "70px", height: "14px", display: "block", marginBottom: "4px" }} />
          <span className="skeleton-loader" style={{ width: "100%", height: "6px", display: "block", borderRadius: "3px" }} />
        </td>
        <td>
          <span className="skeleton-loader" style={{ width: "40px", height: "14px" }} />
        </td>
        <td>
          <span className="skeleton-loader" style={{ width: "70px", height: "14px" }} />
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

        <td>
          <span className={`status ${c.status.toLowerCase()}`}>
            {c.status === "completed" && <CheckCircle size={14} />}
            {c.status === "processing" && <RefreshCcw size={14} />}
            {(c.status === "queued" || c.status === "uploaded" || c.status === "pending") && <Clock size={14} />}
            {(c.status === "error" || c.status === "failed") && <AlertCircle size={14} />}
            {c.status === "pending" && <PauseCircle size={14} />}
            {c.status}
          </span>
        </td>
        <td>
          <div className="customer">
            <span className="customer-name">{c.customer}</span>
            <span className="customer-email">{c.email}</span>
          </div>
        </td>
        <td>
          {c.fileName}
          <br />
          <span className="file-size">{c.fileSize || "-"}</span>
        </td>
        <td>{c.type || "-"}</td>
        <td>
          {c.status === "processing" ? (
            <>
              {c.progress || "0%"}
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: c.progress || "0%" }}
                />
              </div>
            </>
          ) : c.status === "completed" ? (
            "100%"
          ) : c.status === "error" ? (
            "Failed"
          ) : (
            "Waiting"
          )}
        </td>
        <td>{c.credits || 0}</td>
        <td>{c.duration || "-"}</td>
        <td className="relative">
  <MoreHorizontal
    className="action-menu"
    size={18}
    onClick={() => setOpenMenu(openMenu === idx ? null : idx)}
  />
  {openMenu === idx && (
    <div className="dropdown-menu-table">
      <button
      className="btn retry"
      onClick={(e) => {
        e.stopPropagation();
        handleRetry(c.id,c.status);
      }}
    >
      <RefreshCcw
        size={12}
        className={retryingId === c.id ? "spin" : ""}
      />
      {retryingId === c.id ? " Retrying..." : " Retry"}
    </button>

        <button
        className={`btn download ${!c.conversionUrl ? "disabled" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (c.conversionUrl) downloadFile(c.conversionUrl, `input-${c.fileName}`);
        }}
        disabled={!c.conversionUrl}
      >
        <Download size={12} />
        Input
      </button>

      {/* Output file download */}
      <button
        className={`btn download ${!c.convertedUrl ? "disabled" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          if (c.convertedUrl) downloadFile(c.convertedUrl, `output-${c.fileName}`);
        }}
        disabled={!c.convertedUrl}
      >
        <Download size={12} />
        Output
      </button>

     <button
  className={`btn download ${!c.convertedUrl ? "disabled" : ""}`}
  onClick={(e) => {
    e.stopPropagation();
    if (c.convertedUrl) handleSendNotification(c.id);
  }}
  disabled={!c.convertedUrl || notifyingId === c.id}
>
  <Bell size={12} />
  {notifyingId === c.id ? "Notifying..." : "Notify"}
</button>
<button
  className={`btn download ${c.creditsRefunded ? "disabled" : ""}`}
  onClick={(e) => {
    e.stopPropagation();
    if (!c.creditsRefunded) handleRefundCredits(c.id);
  }}
  disabled={c.creditsRefunded || refundingId === c.id}
>
  <RotateCcw size={12} className={refundingId === c.id ? "spin" : ""} />
  {c.creditsRefunded
    ? "Refunded"
    : refundingId === c.id
    ? "Refunding..."
    : "Refund"}
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

export default ConversionTable;
