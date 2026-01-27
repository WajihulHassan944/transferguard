import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import "./AddOrder.css";
import "../../credits/CreditsTable/AddRemoveCredits/AddRemoveCredits.css";
import { baseUrl } from "@/const";
import toast from "react-hot-toast";
const AddOrder = ({order, onClose, onPlaced }) => {
  const isEdit = !!order;
const [formData, setFormData] = useState({
  customerName: order?.customer || "",
  email: order?.email || "",
  companyName: order?.company || "",
  vatNumber: order?.vatNumber || "",
  street: order?.street || "",
  postalCode: order?.postalCode || "",
  country: order?.country || "",
  amount: order?.amount ? Number(order.amount) : 0,
  credits: order?.credits || 0,
  status: order?.status || "completed",       // ✅ new
  method: order?.method || "Manual order",  // ✅ new
  notes: order?.notes || "",                // ✅ new
});


  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = async () => {
  const requiredFields = [
    { key: "customerName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "street", label: "Street" },
    { key: "postalCode", label: "Postal Code" },
    { key: "country", label: "Country" },
    { key: "amount", label: "Amount" },
    { key: "credits", label: "Credits" },
  ];

  for (const field of requiredFields) {
    if (!formData[field.key] || formData[field.key].toString().trim() === "") {
      toast.error(`${field.label} is required`);
      return;
    }
  }

  try {
    setLoading(true);

    const url = isEdit
      ? `${baseUrl}/wallet/orders/manual-order/${order._id}`
      : `${baseUrl}/wallet/orders/manual-order`;

const res = await fetch(url, {
  method: isEdit ? "PUT" : "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});

const data = await res.json();

// ⬇️ Improved error handling
if (!res.ok || !data.success) {
  const backendMessage =
    data.error ||
    data.message ||
    data.msg ||
    data?.details ||
    "Failed to save order";

  toast.error(backendMessage);
  return;
}

toast.success(
  data.message ||
    (isEdit ? "Manual order updated." : "Manual order created.")
);

if (onPlaced) onPlaced();
onClose();

    } catch (error) {
    console.error("Error saving order:", error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal-overlay-credits" onClick={onClose}>
      <div className="modal modal-add-order" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
         <h3>{isEdit ? "Update Order" : "Add New Order"}</h3>
          <button className="close-btn-popup" onClick={onClose}>
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label>Customer Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>VAT Number</label>
              <input
                type="text"
                name="vatNumber"
                value={formData.vatNumber}
                onChange={handleChange}
              />
            </div>
          </div>

         <div className="form-row">
  <div className="form-group">
    <label>Street</label>
    <input
      type="text"
      name="street"
      value={formData.street}
      onChange={handleChange}
    />
  </div>
  <div className="form-group">
    <label>Postal Code</label>
    <input
      type="text"
      name="postalCode"
      value={formData.postalCode}
      onChange={handleChange}
    />
  </div>
</div>


          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
<div className="form-group">
  <label className={isEdit ? "text-gray-400" : ""}>Amount (€) *</label>
  <input
    type="number"
    name="amount"
    value={formData.amount}
    onChange={handleChange}
    disabled={isEdit}
  />
</div>

<div className="form-group">
  <label className={isEdit ? "text-gray-400" : ""}>Credits *</label>
  <input
    type="number"
    name="credits"
    value={formData.credits}
    onChange={handleChange}
    disabled={isEdit}
  />
</div>

          </div>


          <div className="form-row">
  <div className="form-group">
    <label>Status</label>
    <select name="status" value={formData.status} onChange={handleChange}>
      <option value="pending">Pending</option>
      <option value="paid">Paid</option>
      <option value="completed">Completed</option>
    </select>
  </div>
  <div className="form-group">
    <label>Payment Method</label>
    <input
      type="text"
      name="method"
      value={formData.method}
      onChange={handleChange}
    />
  </div>
</div>

<div className="form-row">
  <div className="form-group note-field">
    <label>Notes</label>
    <textarea
      name="notes"
      value={formData.notes}
      onChange={handleChange}
      rows="3"
    />
    {formData.notes && (
      <div className="note-preview">
        <strong>Notes:</strong> {formData.notes}
      </div>
    )}
  </div>
</div>




        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
           <button
            className="btn confirm"
            onClick={handleSubmit}
            disabled={!formData.customerName || !formData.email || loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : isEdit ? (
              "Update Order"
            ) : (
              "Create Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
