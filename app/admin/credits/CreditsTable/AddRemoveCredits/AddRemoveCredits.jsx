import React, { useState } from "react";
import { Loader2, X } from "lucide-react";
import "./AddRemoveCredits.css";
import { baseUrl } from "@/const";
import toast from "react-hot-toast";
const AddRemoveCredits = ({ actionType, customer, onClose }) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    try {
       setLoading(true);
      const endpoint =
        actionType === "add"
          ? `${baseUrl}/wallet/customers/add-credits`
          : `${baseUrl}/wallet/customers/remove-credits`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: customer.id,
          credits: Number(amount),
          reason,
        }),
      });

      if (!res.ok) throw new Error("Failed to update credits");

      toast.success(`${actionType === "add" ? "Added" : "Removed"} ${amount} credits for ${customer.customer}`);
      onClose(true); // ✅ trigger refresh
    } catch (err) {
      console.error(err);
      toast.error("Error updating credits");
    }
    finally{
       setLoading(false);
    }
  };

  return (
    <div className="modal-overlay-credits" onClick={() => onClose(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{actionType === "add" ? "Add Credits" : "Remove Credits"}</h3>
          <button className="close-btn-popup" onClick={() => onClose(false)}>
            <X size={17} />
          </button>
        </div>

        <div className="modal-body">
          <label>Credit Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label>Reason (Optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button className="btn cancel" onClick={() => onClose(false)}>
            Cancel
          </button>
          <button
            className="btn confirm"
            onClick={handleSubmit}
            disabled={!amount}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : actionType === "add" ? (
              "Add Credits"
            ) : (
              "Remove Credits"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRemoveCredits;
