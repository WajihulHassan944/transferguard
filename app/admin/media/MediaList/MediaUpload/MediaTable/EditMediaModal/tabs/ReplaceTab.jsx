import React, { useRef } from "react";
import { Upload } from "lucide-react";

const ReplaceTab = ({ replace, onChange }) => {
  const fileInputRef = useRef(null);

  const handleChooseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    // Send to parent in required format
    onChange({
      file,
      previewUrl,
    });
  };

  return (
    <div className="emm-replace-wrapper">
      <div className="emm-upload-box">
        <Upload size={45} className="emm-upload-icon" />

        <p className="emm-upload-text">Upload a new file to replace this media</p>
        <small className="emm-upload-sub">The URL will remain the same</small>

        <center>
          <button className="emm-choose-btn" onClick={handleChooseClick}>
            Choose File
          </button>
        </center>

        {/* Hidden input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Show selected file preview if exists */}
        {replace?.previewUrl && (
          <p className="emm-selected-file">
            Selected: <b>{replace.file?.name}</b>
          </p>
        )}
      </div>
    </div>
  );
};

export default ReplaceTab;
