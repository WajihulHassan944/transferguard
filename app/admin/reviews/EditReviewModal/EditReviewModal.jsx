"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./EditReviewModal.css";
import { baseUrl } from "@/const";

const EditReviewModal = ({ review, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    productName: "",
    userName: "",
    email: "",
    rating: 5,
    reviewTitle: "",
    roleOrProfession:"",
    reviewText: "",
    status: "pending",
    featured: false,
    photoUrl: "",
  });
  const [newPhoto, setNewPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);


  useEffect(() => {
    if (review) {
      setFormData({
        productName: review.productName || "",
        userName: review.userName || "",
        email: review.email || "",
        rating: review.rating || 1,
        reviewTitle: review.reviewTitle || "",
        roleOrProfession:review.roleOrProfession || "",
        reviewText: review.reviewText || "",
        status: review.status || "pending",
        featured: review.featured || false,
        photoUrl: review.photoUrl || "",
      });
      setPreview(review.photoUrl || "");
    }
  }, [review]);

  if (!review) return null;


  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setNewPhoto(null);
    setPreview("");
    setFormData((prev) => ({ ...prev, photoUrl: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const form = new FormData();
      for (const key in formData) {
        if (key !== "photoUrl") form.append(key, formData[key]);
      }
      if (newPhoto) form.append("photo", newPhoto);

      const res = await fetch(`${baseUrl}/reviews/update/${review._id}`, {
        method: "PUT",
        body: form,
      });

      const data = await res.json();
      if (data.success) {
        onSave();
        onClose();
      } else {
        alert(data.message || "Failed to update review");
      }
    } catch (err) {
      console.error("Error updating review:", err);
      alert("An error occurred while updating review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editReviewModal-overlay">
      <div className="editReviewModal-container">
        {/* Header */}
        <div className="editReviewModal-header">
          <h2>Edit Review</h2>
          <button className="editReviewModal-closeBtn" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="editReviewModal-body">
          <div className="editReviewModal-formRow">
            <div className="editReviewModal-formGroup">
              <label>Product Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
              />
            </div>
            <div className="editReviewModal-formGroup">
              <label>Customer Name</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="editReviewModal-formRow">
            <div className="editReviewModal-formGroup">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="editReviewModal-formGroup">
              <label>Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 && "s"}
                  </option>
                ))}
              </select>
            </div>
          </div>

  <div className="editReviewModal-formRow">
          <div className="editReviewModal-formGroup">
            <label>Review Title</label>
            <input
              type="text"
              name="reviewTitle"
              value={formData.reviewTitle}
              onChange={handleChange}
            />
          </div>
           <div className="editReviewModal-formGroup">
            <label>Customer Role</label>
            <input
              type="text"
              name="roleOrProfession"
              value={formData.roleOrProfession}
              onChange={handleChange}
            />
          </div>
</div>
          <div className="editReviewModal-formGroup" style={{ marginTop: "19px" }}>
            <label>Review Comment</label>
            <textarea
              rows="3"
              name="reviewText"
              value={formData.reviewText}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="editReviewModal-formGroup" style={{ marginTop: "19px" }}>
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="editReviewModal-checkboxRow">
            <input
              type="checkbox"
              id="featureReview"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            <label htmlFor="featureReview">
              Feature this review on homepage
            </label>
          </div>

          <div className="editReviewModal-formGroup">
            <label>Review Image</label>
           <div
  className={`editReviewModal-uploadArea ${isDragging ? "drag-active" : ""}`}
  onClick={() => document.getElementById("photoInput").click()}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
>
  <p>{isDragging ? "Drop image here..." : "Click to upload or drag and drop"}</p>
  <span>PNG, JPG, GIF up to 10MB</span>
</div>

            <input
              id="photoInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />

            {preview && (
              <div className="editReviewModal-uploadedImage">
                <img
                  src={preview}
                  alt="uploaded"
                  className="editReviewModal-reviewImg"
                />
                <button
                  type="button"
                  className="editReviewModal-removeImg"
                  onClick={handleRemovePhoto}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="editReviewModal-footer">
            <button
              type="button"
              className="editReviewModal-cancelBtn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="editReviewModal-saveBtn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;
