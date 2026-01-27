'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { baseUrl } from '@/const'; // ✅ make sure this exists
import './SchedulePriceChangeModal.css';

export default function SchedulePriceChangeModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    newPrice: '',
    discount: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.newPrice || !formData.startDate) {
      toast.error('New price and start date are required.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/products/schedule-price-change/${product._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPrice: parseFloat(formData.newPrice),
          discountPercent: parseFloat(formData.discount) || 0,
          startDate: formData.startDate,
          endDate: formData.endDate || null,
          reason: formData.reason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Price change scheduled successfully!');
        onSave();
        onClose(); // ✅ close modal after success
      } else {
        toast.error(data.message || 'Failed to schedule price change.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const formattedStart = formData.startDate
    ? new Date(formData.startDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No start date';

  const formattedEnd = formData.endDate
    ? new Date(formData.endDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No end date';

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Schedule Price Change</h2>
            <p className="modal-subtitle">
              Set up automatic price changes based on date and time
            </p>
          </div>

          <button className="close-btn-unique" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>New Price (€)</label>
              <input
                type="number"
                name="newPrice"
                value={formData.newPrice}
                onChange={handleChange}
                placeholder="65"
                required
              />
            </div>

            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date (optional)</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reason</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="e.g., Black Friday Sale"
            />
          </div>

          <div className="preview-box">
            <p className="preview-title">Preview</p>
<p className="preview-text">
  {formData.discount > 0 ? (
    <>
      Price will change from <strong>€{product.originalPriceEUR}</strong> to{" "}
      <strong className="strikethrough">
        €{parseFloat(formData.newPrice || product.originalPriceEUR).toFixed(2)}
      </strong>{" "}
      <strong className="highlighted">
        €
        {(
          parseFloat(formData.newPrice || product.originalPriceEUR) *
          (1 - parseFloat(formData.discount) / 100)
        ).toFixed(2)}
      </strong>
    </>
  ) : (
    <>
      Price will change from <strong>€{product.originalPriceEUR}</strong> to{" "}
      <strong className="highlighted">
        €
        {formData.newPrice
          ? parseFloat(formData.newPrice).toFixed(2)
          : product.originalPriceEUR}
      </strong>
    </>
  )}
  <br />
  Starting {formattedStart} to {formattedEnd}
</p>

          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Price Change'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
