import React from "react";
import { Copy } from "lucide-react";

const DetailsTab = ({ details,editImage, setDetails }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(details.url);
  };

  return (
    <div className="emm-details-wrapper">
      {/* LEFT SIDE: Preview + Meta */}
      <div className="em-details-img">
        {/* Preview */}
        {details.type === "video" ? (
          <video
            src={details.url}
            className="emm-preview-image"
            controls
            muted
          />
        ) : details.type === "external" ? (
          <div className="external-preview-box">
            <p>External Video</p>
            <small>{details.platform?.toUpperCase()}</small>
          </div>
        ) : (
          <img
  src={details.previewUrl || details.url || "/assets/media1.png"}
  alt="preview"
  className="emm-preview-img"
  style={{
    transform: `rotate(${editImage.rotate || 0}deg)`,
    filter: `${editImage.filter || ""} brightness(${editImage.filterIntensity}%)`,

    // --- APPLY SIZE (crop → resize → fallback) ---
    width:
      editImage.resizeWidth ||
      editImage.cropWidth ||
      "auto",

    height:
      editImage.resizeHeight ||
      editImage.cropHeight ||
      "auto",

    objectFit: "cover",
  }}
/>

        )}

        {/* Meta info */}
        <div className="emm-meta-grid">
          <div>
            <label>File Size:</label>
            <p>{details.size || "N/A"}</p>
          </div>

          <div>
            <label>Dimensions:</label>
            <p>{details.dimensions || "N/A"}</p>
          </div>

          <div>
            <label>Upload Date:</label>
            <p>
              {details.uploadDate
                ? new Date(details.uploadDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="emm-form-section">
   {/* File Name */}
        <label>Unique Identifier</label>
        <input
          type="text"
          className="emm-input"
          value={details.identifier}
          onChange={(e) => setDetails({ identifier: e.target.value })}
        />

        {/* File Name */}
        <label>File Name</label>
        <input
          type="text"
          className="emm-input"
          value={details.name}
          onChange={(e) => setDetails({ name: e.target.value })}
        />

        {/* Alt Text */}
        <label>Alt Text</label>
        <input
          type="text"
          className="emm-input"
          value={details.alt || ""}
          onChange={(e) => setDetails({ alt: e.target.value })}
        />

        {/* Tags */}
        <label>Tags</label>
        <input
          type="text"
          className="emm-input"
          value={details.tags?.join(", ") || ""}
          onChange={(e) =>
            setDetails({
              tags: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
        />
        <span className="emm-hint">Separate tags with commas</span>

        {/* File URL */}
        <label>File URL</label>
        <div className="emm-url-container">
          <input
            type="text"
            className="emm-input"
            value={details.url}
            onChange={(e) => setDetails({ url: e.target.value })}
          />
          <button className="emm-copy-btn" onClick={handleCopy}>
            <Copy size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
