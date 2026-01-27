'use client';
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import "./EditMediaModal.css";

import DetailsTab from "./tabs/DetailsTab";
import EditImageTab from "./tabs/EditImageTab";
import ReplaceTab from "./tabs/ReplaceTab";
import { baseUrl } from "@/const";
const EditMediaModal = ({ item = null, onClose = () => {}, onUpdated = () => {} }) => {
  const [activeTab, setActiveTab] = useState("details");

  // Per-tab state (parent aggregates and passes down)
  const [details, setDetails] = useState({
    identifier: "",
    name: "",
    alt: "",
    url: "",
    size: "",
    dimensions: "",
    uploadDate: "",
    tags: [],
    type: "",
    platform: null,
  });
const [editImage, setEditImage] = useState({
  cropWidth: "",
  cropHeight: "",
  aspectRatio: "free",
  resizeWidth: "",
  resizeHeight: "",
  keepAspect: true,
  rotate: 0,
  filter: "",
  filterIntensity: 100,
  quality: "original",
  format: "original",
});

  const [replace, setReplace] = useState({
    file: null,
    previewUrl: null,
  });

  const [saving, setSaving] = useState(false);
  // Initialize local state from incoming item
  useEffect(() => {
  if (!item) return;

  // ---- DETAILS ----
  setDetails({
    identifier: item.identifier || "",
    name: item.name || "",
    alt: item.alt || "",
    url: item.url || "",
    size: item.size || "",
    dimensions: item.dimensions || "",
    uploadDate: item.uploadDate
      ? new Date(item.uploadDate).toISOString().slice(0, 10)
      : "",
    tags: Array.isArray(item.tags)
      ? item.tags
      : item.tags
      ? String(item.tags).split(",").map((t) => t.trim())
      : [],
    type: item.type || "",
    platform: item.platform || null,
  });

  // ---- TRANSFORMATIONS → editImage ----
  const tr = item.transformations || {};

  setEditImage({
    cropWidth: tr.cropWidth ?? "",
    cropHeight: tr.cropHeight ?? "",
    aspectRatio: tr.aspectRatio ?? "free",

    resizeWidth: tr.resizeWidth ?? "",
    resizeHeight: tr.resizeHeight ?? "",
    keepAspect: tr.keepAspect ?? true,

    rotate: tr.rotate ?? 0,

    filter: tr.filter ?? "",
    filterIntensity: tr.filterIntensity ?? 100,

    quality: tr.quality ?? "original",
    format: tr.format ?? "original",
  });

  // ---- RESET REPLACE FILE ----
  setReplace({
    file: null,
    previewUrl: null,
  });
}, [item]);

  // Close on Esc
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Handlers to pass down to tabs
  const handleDetailsChange = (patch) => {
    setDetails((p) => ({ ...p, ...patch }));
  };

  const handleEditImageChange = (patch) => {
    setEditImage((p) => ({ ...p, ...patch }));
  };

const handleReplaceChange = async ({ file, previewUrl }) => {
  if (!file) {
    setReplace({ file: null, previewUrl: null });
    return;
  }

  // ---------- 1. PREPARE SIZE ----------
  const sizeBytes = file.size;
  let formattedSize;

  if (sizeBytes < 1024 * 1024) {
    formattedSize = `${(sizeBytes / 1024).toFixed(2)} KB`;
  } else if (sizeBytes < 1024 * 1024 * 1024) {
    formattedSize = `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    formattedSize = `${(sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  // ---------- 2. DETECT TYPE ----------
  const type = file.type.startsWith("image")
    ? "image"
    : file.type.startsWith("video")
    ? "video"
    : "external";

  // ---------- 3. GET DIMENSIONS (ASYNC) ----------
  const getDimensions = () =>
    new Promise((resolve) => {
      if (type === "image") {
        const img = new Image();
        img.src = previewUrl;
        img.onload = () => resolve(`${img.width}x${img.height}`);
      } else if (type === "video") {
        const video = document.createElement("video");
        video.src = previewUrl;
        video.onloadedmetadata = () =>
          resolve(`${video.videoWidth}x${video.videoHeight}`);
      } else {
        resolve("N/A");
      }
    });

  const dimensions = await getDimensions();

  // ---------- 4. UPDATE replace STATE ----------
  setReplace({
    file,
    previewUrl,
  });

  // ---------- 5. UPDATE details STATE ----------
 setDetails((prev) => ({
  ...prev,
  url: previewUrl,          // ← update preview URL immediately
  size: formattedSize,
  dimensions,
  type,
  name: file.name,
  uploadDate: new Date().toISOString().slice(0, 10),
}));
};

const detectPlatformFromUrl = (url = "") => {
  if (!url) return { platform: "", type: "" };

  const lower = url.toLowerCase();

  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    return { platform: "youtube", type: "external" };
  }

  if (lower.includes("vimeo.com")) {
    return { platform: "vimeo", type: "external" };
  }

  if (lower.endsWith(".mp4") || lower.endsWith(".webm")) {
    return { platform: "", type: "video" };
  }

  return { platform: "", type: "external" };
};

  const handleSave = async () => {
  setSaving(true);

  try {
    let response;
const { platform, type } = detectPlatformFromUrl(details.url);

    // CASE 1: User selected new file → send multipart/form-data
    if (replace.file) {
      const formData = new FormData();

      formData.append("file", replace.file);
      formData.append("identifier",details.identifier);
      formData.append("name", details.name);
      formData.append("alt", details.alt || "");
      formData.append("size", details.size || "");
      formData.append("dimensions", details.dimensions || "");
      formData.append(
        "uploadDate",
        details.uploadDate ? new Date(details.uploadDate).toISOString() : item.uploadDate
      );
formData.append("type", type || details.type);
formData.append("platform", platform || details.platform || "");
      formData.append("tags", details.tags.join(","));

      // Transformations
      formData.append("transformations", JSON.stringify(editImage));

      response = await fetch(`${baseUrl}/media/update/${item._id}`, {
        method: "PUT",
        body: formData,
      });

    } else {
      // CASE 2: No file replaced → send JSON
      const payload = {
        identifier: details.identifier,
        name: details.name,
        alt: details.alt,
        size: details.size,
        dimensions: details.dimensions,
        uploadDate: details.uploadDate
          ? new Date(details.uploadDate)
          : item.uploadDate,
        tags: details.tags,
      type: type || details.type,
platform: platform || details.platform,

        transformations: editImage,
        url: details.url,
      };

      response = await fetch(`${baseUrl}/media/update/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to update media");
      return;
    }

    // Update parent list with returned server media
    await onUpdated(data.media);

    onClose();
  } catch (error) {
    console.error("Save error:", error);
    alert("Error updating media");
  } finally {
    setSaving(false);
  }
};

  // stop clicks inside modal from closing when overlay has onClick
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className="emm-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-media-title"
    >
      <div className="emm-modal" onClick={stopPropagation}>
        {/* Header */}
        <div className="emm-header">
          <div>
            <h2 className="emm-title" id="edit-media-title">Edit Media</h2>
            <p className="emm-subtitle">Edit media details and apply transformations</p>
          </div>

          <button
            type="button"
            className="emm-close-btn"
            aria-label="Close edit modal"
            onClick={onClose}
          >
            <X size={17} className="emm-close-icon" />
          </button>
        </div>

        {/* Tabs */}
        <div className="emm-tabs" role="tablist" aria-label="Edit media tabs">
          <button
            className={`emm-tab ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
            role="tab"
            aria-selected={activeTab === "details"}
          >
            Details
          </button>

          <button
            className={`emm-tab ${activeTab === "editimage" ? "active" : ""}`}
            onClick={() => setActiveTab("editimage")}
            role="tab"
            aria-selected={activeTab === "editimage"}
          >
            Edit Image
          </button>

          <button
            className={`emm-tab ${activeTab === "replace" ? "active" : ""}`}
            onClick={() => setActiveTab("replace")}
            role="tab"
            aria-selected={activeTab === "replace"}
          >
            Replace
          </button>
        </div>

        {/* BODY CONTENT (Tabs switch) */}
        <div className="emm-body">
          {activeTab === "details" && (
            <DetailsTab
              details={details}
              editImage={editImage}
              setDetails={handleDetailsChange}
            />
          )}

          {activeTab === "editimage" && (
            <EditImageTab
              editImage={editImage}
              details={details}
              onChange={handleEditImageChange}
            />
          )}

          {activeTab === "replace" && (
            <ReplaceTab
              replace={replace}
              onChange={handleReplaceChange}
            />
          )}
        </div>

        {/* FOOTER */}
        <div className="emm-footer">
          <button
            className="emm-cancel-btn"
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="emm-save-btn"
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMediaModal;
