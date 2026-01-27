"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Ellipsis,
  Check,
  X,
  Trash2,
  Edit3,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { FaStar } from "react-icons/fa6";
import EditReviewModal from "../EditReviewModal/EditReviewModal";
import { baseUrl } from "@/const";
import "./ReviewsTable.css";

const ReviewsTable = ({onSave, refreshKey}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [editReview, setEditReview] = useState(null);
const [dropdownOpen, setDropdownOpen] = useState(false);
const [statusLoading, setStatusLoading] = useState({ id: null, action: null });

const [deletingId, setDeletingId] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/reviews/all`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [refreshKey]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".reviews-actions")) {
        setDropdownIndex(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const updateStatus = async (id, status) => {
  setStatusLoading({ id, action: status.toLowerCase() });
  try {
    const res = await fetch(`${baseUrl}/reviews/status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: status.toLowerCase() }),
    });
    const data = await res.json();
    if (data.success) {
      onSave();
      setDropdownIndex(null);
    }
  } catch (err) {
    console.error("Error updating status:", err);
  } finally {
    setStatusLoading({ id: null, action: null });
  }
};


const deleteReview = async (id) => {
  if (!confirm("Are you sure you want to delete this review?")) return;
  setDeletingId(id);
  try {
    const res = await fetch(`${baseUrl}/reviews/delete/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      onSave();
      setDropdownIndex(null);
    }
  } catch (err) {
    console.error("Error deleting review:", err);
  } finally {
    setDeletingId(null);
  }
};

  const filteredReviews = reviews
    .filter(
      (r) =>
        statusFilter === "All Status" || r.status.toLowerCase() === statusFilter.toLowerCase()
    )
    .filter(
      (r) =>
        r.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reviewTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="reviews-table-container">
      {/* Header */}
      <div className="reviews-table-header">
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search by product, customer or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

       <div className="filter-dropdowns">
  <div className="reviews-dropdown">
    <button
      className="reviews-dropdown-btn"
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      {statusFilter} <ChevronDown size={16} />
    </button>
    {dropdownOpen && (
      <ul className="reviews-dropdown-menu">
        {["All Status", "Pending", "Approved", "Rejected"].map((status) => (
          <li
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setDropdownOpen(false);
            }}
          >
            {status}
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

      </div>

      {/* Table */}
      <div className="reviews-table-wrapper">
  <div className="reviews-grid header">
    <div>Product</div>
    <div>Customer</div>
    <div>Rating</div>
    <div>Title</div>
    <div>Date</div>
    <div>Status</div>
    <div></div>
  </div>

  {loading ? (
     Array.from({ length: 5 }).map((_, rowIdx) => (
    <div className="reviews-grid row skeleton-row" key={rowIdx}>
      {Array.from({ length: 7 }).map((_, colIdx) => (
        <div key={colIdx} className="skeleton-cell"></div>
      ))}
    </div>
  ))
  ) : filteredReviews.length === 0 ? (
    <div className="reviews-no-data">No reviews found.</div>
  ) : (
    filteredReviews.map((r, index) => (
      <div className="reviews-grid row" key={r._id}>
        <div className="reviewsProductName">{r.productName || "-"}</div>
        <div className="reviews-customer">
          <p className="reviews-name">{r.userName}</p>
          <p className="reviews-email">{r.email}</p>
        </div>
        <div className="reviews-stars">
          {Array.from({ length: 5 }).map((_, i) =>
            i < r.rating ? (
              <FaStar key={i} size={15} className="star filled" />
            ) : (
              <FaStar key={i} size={15} className="star" />
            )
          )}
        </div>
        <div>{r.reviewTitle || "-"}</div>
      <div className="dateInReviewsTable">{new Date(r.createdAt).toISOString().split("T")[0]}</div>
  <div>
          <span
            className={`reviews-status ${r.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {r.status === "pending"
              ? "Pending Approval"
              : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
          </span>
        </div>
        <div className="reviews-actions">
          <button
            className="reviews-more-btn"
            onClick={() =>
              setDropdownIndex(dropdownIndex === index ? null : index)
            }
          >
            <Ellipsis size={18} />
          </button>
  {dropdownIndex === index && (
  <ul className="reviews-action-menu">
    <li className="edit" onClick={() => setEditReview(r)}>
      <Edit3 size={14} className="icon edit" /> Edit
    </li>

    {r.status !== "approved" && r.status !== "rejected" && (
      <>
        <li
          className="approve"
          onClick={() => updateStatus(r._id, "Approved")}
        >
          {statusLoading.id === r._id && statusLoading.action === "approved" ? (
            <Loader2 size={14} className="animate-spin icon approve" />
          ) : (
            <Check size={14} className="icon approve" />
          )}{" "}
          Approve
        </li>

        <li
          className="reject"
          onClick={() => updateStatus(r._id, "Rejected")}
        >
          {statusLoading.id === r._id && statusLoading.action === "rejected" ? (
            <Loader2 size={14} className="animate-spin icon reject" />
          ) : (
            <X size={14} className="icon reject" />
          )}{" "}
          Reject
        </li>
      </>
    )}

    <li className="delete" onClick={() => deleteReview(r._id)}>
      {deletingId === r._id ? (
        <Loader2 size={14} className="animate-spin icon delete" />
      ) : (
        <Trash2 size={14} className="icon delete" />
      )}{" "}
      Delete
    </li>
  </ul>
)}



        </div>
      </div>
    ))
  )}
</div>


      {/* Edit Modal */}
      {editReview && (
        <EditReviewModal
          review={editReview}
          onClose={() => setEditReview(null)}
          onSave={onSave}
        />
      )}
    </div>
  );
};

export default ReviewsTable;
