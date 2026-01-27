import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import "../AddOrder/AddOrder.css";
import "../../credits/CreditsTable/AddRemoveCredits/AddRemoveCredits.css";
import { baseUrl } from "@/const";
import toast from "react-hot-toast";

const CancelOrder = ({ order, onClose, onCancelled }) => {
  const [reason, setReason] = useState("");
  const [refundType, setRefundType] = useState("full"); // default
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // store backend response

  const handleSubmit = async () => {
    if (!reason.trim()) {
      return toast.error("Please provide a reason for cancellation.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/wallet/cancelOrder/${order._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason, refundType }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Order cancelled successfully.");
        setResult(data); // save result to render in popup
        onCancelled?.(order._id, data);
      } else {
        toast.error(data.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error("❌ Cancel error:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="modal-overlay-credits" onClick={onClose}>
    <div
      className="modal modal-add-order"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="modal-header">
        <h3>{result ? "Order Cancelled" : "Cancel Order"}</h3>
        <button className="close-btn-popup" onClick={onClose}>
          <X size={17} />
        </button>
      </div>

      {/* Body */}
      <div className="modal-body">
        {!result ? (
          <>
            <div className="form-group">
              <label>Reason for Cancellation</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Refund Type</label>
              <select
                value={refundType}
                onChange={(e) => setRefundType(e.target.value)}
              >
                <option value="full">Full Refund</option>
                <option value="partial">Partial Refund</option>
                <option value="none">No Refund</option>
              </select>
            </div>
          </>
        ) : (
<div className="result-details">
  <h4 className="result-title">Order Cancelled</h4>

  <div className="result-item">
    <span className="label">Message:</span>
    <span className="value">{result.message}</span>
  </div>

  {result.revokedCredits !== undefined && (
    <div className="result-item">
      <span className="label">Revoked Credits:</span>
      <span className="value">{result.revokedCredits}</span>
    </div>
  )}

  {result.refund && (
    <div className="result-item">
      <span className="label">Refund:</span>
      <div className="refund-details">
        <div>
          <span className="label">Amount:</span>
          <span className="value">
            {result.refund?.amount / 100} {result.refund?.currency?.toUpperCase()}
          </span>
        </div>
        <div>
          <span className="label">Status:</span>
          <span className="value">{result.refund?.status}</span>
        </div>
        <div>
          <span className="label">Created:</span>
          <span className="value">
            {new Date(result.refund?.created * 1000).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="label">Refund ID:</span>
          <span className="value">{result.refund?.id}</span>
        </div>
      </div>
    </div>
  )}

  {result.walletBalance !== undefined && (
    <div className="result-item">
      <span className="label">Wallet Balance:</span>
      <span className="value">{result.walletBalance}</span>
    </div>
  )}
</div>

        )}
      </div>

      {/* Footer */}
      <div className="modal-footer">
        {!result ? (
          <>
            <button
              className="btn cancel"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
            <button
              className="btn confirm"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Confirm Cancel"
              )}
            </button>
          </>
        ) : (
          <button className="btn confirm" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  </div>
);
};

export default CancelOrder;
