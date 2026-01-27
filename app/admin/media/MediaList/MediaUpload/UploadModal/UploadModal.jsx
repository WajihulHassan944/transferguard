'use client';
import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import './UploadModal.css';
import { baseUrl } from '@/const';
const UploadModal = ({ onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // 🧠 Trigger file input on button click
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // 📂 When file selected via input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  // 🖱️ Drag-and-drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };
const handleUpload = async () => {
  if (!selectedFile) {
    setError('Please select a file first.');
    return;
  }

  setLoading(true);
  setError('');

  const formData = new FormData();
  formData.append('file', selectedFile);

  // Detect file type (image or video)
  const type = selectedFile.type.startsWith('image')
    ? 'image'
    : selectedFile.type.startsWith('video')
    ? 'video'
    : 'external';
  formData.append('type', type);

  // 🔹 Format size (KB / MB / GB)
  let size = selectedFile.size; // in bytes
  let formattedSize;
  if (size < 1024 * 1024) {
    formattedSize = `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    formattedSize = `${(size / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    formattedSize = `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  formData.append('size', formattedSize);
  formData.append('name', selectedFile.name);
 formData.append('tags', type === 'video' ? 'video' : type === 'image' ? 'image' : 'external');

  try {
    // 🔹 Get dimensions before upload
    if (type === 'image') {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);
      await new Promise((resolve) => {
        img.onload = () => {
          formData.append('dimensions', `${img.width}x${img.height}`);
          resolve();
        };
      });
    } else if (type === 'video') {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(selectedFile);
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          formData.append('dimensions', `${video.videoWidth}x${video.videoHeight}`);
          resolve();
        };
      });
    } else {
      formData.append('dimensions', 'N/A');
    }

    // 🚀 Upload
    const res = await fetch(`${baseUrl}/media/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      onUpload?.(data);
      onClose();
    } else {
      setError(data.message || 'Upload failed.');
    }
  } catch (err) {
    setError('Something went wrong while uploading.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

return (
  <div className="media-overlay">
    <div className="media-modal">
      <div className="media-header">
        <h2>Upload Files</h2>
        <button className="media-close-btn" onClick={onClose}>×</button>
      </div>

      <p className="media-subtext">
        Upload images, videos, or other files to your media library
      </p>

      <div
        className={`media-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <Upload size={43} strokeWidth={1.8} className="media-icon" />

        {!selectedFile ? (
          <>
            <p className="media-text">
              Drag and drop files here, or click to browse
            </p>
            <p className="media-hint">
              Supports: JPG, PNG, GIF, MP4, MOV, PDF (Max 50MB)
            </p>
          </>
        ) : (
          <p className="selected-file">{selectedFile.name}</p>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden-input"
          onChange={handleFileChange}
        />

    <center>
  <button
    type="button"
    className="media-browse-btn"
    onClick={(e) => {
      e.stopPropagation(); // prevent double-trigger from parent div
      handleBrowseClick();
    }}
  >
    Browse Files
  </button>
</center>

      </div>

      {error && <p className="media-error">{error}</p>}

      <div className="media-footer">
        <button className="media-cancel-btn" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button
          className="media-upload-btn"
          onClick={handleUpload}
          disabled={loading || !selectedFile}
        >
          {loading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>
    </div>
  </div>
);
};

export default UploadModal;
