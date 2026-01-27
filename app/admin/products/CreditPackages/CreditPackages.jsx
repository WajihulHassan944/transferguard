"use client";
import React, { useEffect, useState } from "react";
import { Box, Check, Edit, Calendar } from "lucide-react";
import "./CreditPackages.css";
import EditProductModal from "../EditProductModal/EditProductModal";
import SchedulePriceChangeModal from "../SchedulePriceChangeModal/SchedulePriceChangeModal";
import { baseUrl } from "@/const";
const CreditPackages = ({onAdd, refreshKey,onSave}) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/products`);
        const data = await res.json();
if (data.success && Array.isArray(data.products)) {
  let ordered = data.products || [];
  setPackages(ordered);
} else {
  setError("Failed to load products");
}
      } catch (err) {
        setError("Something went wrong fetching products");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchPackages();
  }, [refreshKey]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleSchedule = (product) => {
    setSelectedProduct(product);
    setShowScheduleModal(true);
  };

return (
  <div className="credit-packages">
    <h2 className="credit-title">Credit Packages</h2>

    {error && <p className="error">{error}</p>}

<div className="credit-grid">
  {(
    !loading && !error
      ? (() => {
          if (!packages || packages.length === 0) return [];

          // Sort by priceEUR ascending
         // 🆕 Sort by credits ascending (lowest credits first)
const sortedPackages = [...packages].sort((a, b) => a.credits - b.credits);
return sortedPackages;

        })()
      : Array(3).fill({})
  ).map((pkg, index) => (
    <div
      key={pkg?._id || index}
      className={`credit-card ${pkg?.isPopular ? "popular" : ""}`}
    >
      {pkg?.isPopular && <span className="badge">MOST POPULAR</span>}

      <h3 className="pkg-title">
        {loading ? <span className="skeleton-loader" /> : pkg?.name}
      </h3>

      <p className="pkg-desc">
        {loading ? <span className="skeleton-loader" /> : pkg?.description}
      </p>

      <h1 className="pkg-price">
        {loading ? (
          <span className="skeleton-loader" />
        ) : (
          <>
            <span className="old-price">€{pkg.originalPriceEUR}</span>
          </>
        )}
      </h1>

      <div className="pkg-credits">
        <Box size={20} />
        {loading ? (
          <span className="skeleton-loader" />
        ) : (
          <span>{pkg?.credits} Credits</span>
        )}
      </div>

      <ul className="pkg-features">
        {loading
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <li key={i}>
                  <span className="skeleton-loader" style={{ width: "80%" }} />
                </li>
              ))
          : pkg?.features?.map((feat, i) => (
              <li key={i}>
                <Check size={18} />
                {feat}
              </li>
            ))}
      </ul>

      <div className="divider"></div>

      <div className="pkg-status">
        {loading ? (
          <span className="skeleton-loader" style={{ width: "60px" }} />
        ) : pkg?.isActive === false ? (
          <span className="inactive-badge">Inactive</span>
        ) : (
          <span className="active-badge">Active</span>
        )}
      </div>

      <div className="pkg-actions">
        <button
          className="btn"
          onClick={() => !loading && handleEdit(pkg)}
          disabled={loading}
        >
          <Edit size={16} />
          {loading ? <span className="skeleton-loader" /> : "Edit"}
        </button>
        <button
          className="btn"
          onClick={() => !loading && handleSchedule(pkg)}
        >
          <Calendar size={16} />
          Schedule
        </button>
      </div>
    </div>
  ))}
</div>

    {/* Placeholder Modals */}
    {showEditModal && (
      <EditProductModal
        product={selectedProduct}
        onClose={() => setShowEditModal(false)}
       onAdd={onAdd}
      />
    )}

    {showScheduleModal && (
      <SchedulePriceChangeModal
        product={selectedProduct}
        onClose={() => setShowScheduleModal(false)}
        onSave={onSave}
      />
    )}
  </div>
);

};

export default CreditPackages;
