"use client";
import React, { useState } from "react";
import "./EditProductModal.css";
import { X } from "lucide-react";
import { baseUrl } from "@/const";
import toast from "react-hot-toast";
export default function EditProductModal({ onClose, onAdd, product }) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || "",
    credits: product?.credits || "",
    priceEUR: product?.priceEUR || "",
    originalPriceEUR: product?.originalPriceEUR || "",
    description: product?.description || "",
    features: product?.features?.join("\n") || "",
    isPopular: product?.isPopular || false,
    packageType: product?.packageType || "Standard",
    isActive: product?.isActive ?? true,
  });

  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      features: formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    try {
      let res;
      if (isEditing) {
        // Call PUT API (for editing)
        res = await fetch(`${baseUrl}/products/${product._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Call POST API (for creating new product)
        res = await fetch(`${baseUrl}/products/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Request failed");

       toast.success(
      isEditing
        ? "Product updated successfully!"
        : "Product created successfully!"
    );
      onAdd();
      onClose(false);
    } catch (error) {
      console.error("Product save error:", error);
       toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="modal-subtitle">
              {isEditing
                ? "Update product details and pricing"
                : "Create a new product entry"}
            </p>
          </div>
          <button className="close-btn-popup" onClick={() => onClose(false)}>
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Row 1: Name & Credits */}
          <div className="form-row">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Pro Package"
                required
              />
            </div>
            <div className="form-group">
              <label>Credits</label>
              <input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                placeholder="50"
                required
              />
            </div>
          </div>

          {/* Row 2: Price & Original Price */}
          <div className="form-row">
            <div className="form-group">
              <label>Price (€)</label>
              <input
                type="number"
                name="originalPriceEUR"
                value={formData.originalPriceEUR}
                onChange={handleChange}
                placeholder="135"
                required
              />
            </div>
            <div className="form-group">
              <label>Strike Through Price (€)</label>
              <input
                type="number"
                name="priceEUR"
                value={formData.priceEUR}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Best value for power users"
            />
          </div>

          {/* Features */}
          <div className="form-group">
            <label>Features (one per line)</label>
            <textarea
              name="features"
              rows="4"
              value={formData.features}
              onChange={handleChange}
              placeholder="Up to 6K conversion"
            />
          </div>

          {/* Toggles */}
          <div className="form-toggles">
            <div className="toggle-item">
              <label>Mark as Popular</label>
              <label className="switch">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={formData.isPopular === true}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <label>Active</label>
              <label className="switch">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

      
          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Save Changes"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
