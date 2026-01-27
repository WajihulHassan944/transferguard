"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Loader2, Trash2 } from "lucide-react";
import "./PriceSchedules.css";
import { baseUrl } from "@/const";
const PriceSchedules = ({refreshKey, onDelete}) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch(`${baseUrl}/products/price-schedules`);
        const data = await res.json();

        if (!data.success) throw new Error(data.message || "Failed to load schedules");

        setSchedules(data.schedules || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [refreshKey]);


const handleDelete = async (productId, index, productName) => {
  if (!confirm(`Are you sure you want to delete the schedule for ${productName}?`)) return;

  try {
    setDeleting(`${productId}-${index}`);

    const res = await fetch(`${baseUrl}/products/product-to-schedule/${productId}/schedule/${index}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to delete schedule");
    onDelete();
  } catch (err) {
    alert(err.message);
  } finally {
    setDeleting(null);
  }
};

  return (
    <div className="price-schedules">
      <h2 className="price-title">Price Schedules</h2>

      {loading ? (

        <div className="table-wrapper">
    <table className="price-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>New Price</th>
          <th>Discount</th>
          <th>Period</th>
          <th>Reason</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {      Array.from({ length: 5 }).map((_, idx) => (
      <tr key={idx} className="skeleton-row">
        {Array.from({ length: 7 }).map((_, colIdx) => (
          <td key={colIdx}>
            <div className="skeleton-cell"></div>
          </td>
        ))}
      </tr>
    ))
  }
      </tbody>
    </table>
  </div>


      ) : error ? (
        <p className="error-text">Error: {error}</p>
      ) : schedules.length === 0 ? (
        <p className="no-data">No price schedules found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="price-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>New Price</th>
                <th>Discount</th>
                <th>Period</th>
                <th>Reason</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {schedules.map((item, index) => (
                <tr key={index}>
                  <td className="product-name">
                    {item.productName}
                  </td>
                <td className="price-value">
  {(() => {
    // raw values from API (e.g. "€100", "10% off")
    const rawPrice = item.newPrice ?? "";
    const rawDiscount = item.discount ?? "";

    // extract numeric price (handles "€100", "$1,200.50", "100")
    const numericPrice = parseFloat(String(rawPrice).replace(/[^0-9.-]+/g, ""));
    // extract discount percent (handles "10% off", "15%")
    const discountPercent = parseFloat(String(rawDiscount).replace(/[^0-9.-]+/g, "")) || 0;

    // extract currency symbol/prefix if present (e.g. "€" from "€100")
    const currencyMatch = String(rawPrice).match(/^[^\d\-.,]+/);
    const currency = currencyMatch ? currencyMatch[0] : "€";

    if (!Number.isFinite(numericPrice) || discountPercent <= 0) {
      // fallback: render as provided (preserve original format)
      return <>{rawPrice}</>;
    }

    const discounted = (numericPrice * (1 - discountPercent / 100)).toFixed(2);

    return (
      <>
        <span className="strikethrough">
          {currency}
          {numericPrice.toFixed(2)}
        </span>{" "}
        <span>
          {currency}
          {discounted}
        </span>
      </>
    );
  })()}
</td>

<td>
  <span className="discount-badge">
    {item.discount && String(item.discount).trim() !== "-" ? String(item.discount) : "-"}
  </span>
</td>
  <td className="period">
                    <Calendar size={16} />
                  <div>
  {item.period.includes("to") ? (
    (() => {
      const [startRaw, endRaw] = item.period.split("to").map((d) => d.trim());
      const start = new Date(startRaw);
      const end = new Date(endRaw);

      const formattedStart = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const formattedEnd = end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return (
        <>
          <span>{formattedStart}</span>
          
          <span className="to-text">to {formattedEnd}</span>
        </>
      );
    })()
  ) : (
    <span>{item.period}</span>
  )}
</div>

                  </td>
                  <td>{item.reason}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        item.status === "Active" ? "active" : "scheduled"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                  <button
  className="delete-btn"
  onClick={() => handleDelete(item.productId, index, item.productName)}
  title="Delete schedule"
  disabled={deleting === `${item.productId}-${index}`}
>
  {deleting === `${item.productId}-${index}` ? (
    <Loader2 size={16} className="animate-spin" />
  ) : (
    <Trash2 size={16} />
  )}
</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PriceSchedules;
