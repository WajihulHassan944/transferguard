"use client";
import React, { useState } from "react";
import "./media.css";
import { GeistSans } from "geist/font/sans";
import withAdminAuth from "@/hooks/withAdminAuth";
import { Upload, Youtube } from "lucide-react";
import MediaStats from "./MediaStats/MediaStats";
import MediaUpload from "./MediaList/MediaUpload/MediaUpload";
import UploadModal from "./MediaList/MediaUpload/UploadModal/UploadModal";
import MediaAddVideoModal from "./MediaList/MediaUpload/MediaAddVideoModal/MediaAddVideoModal";

const Pages = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <>
      <div className={`media-container ${GeistSans.className}`}>
        <div className="media-header">
          <div>
            <h2>Media Library</h2>
            <p>Manage images, videos, and files</p>
          </div>

          <div className="header-btns">
            {/* 1️⃣ Opens Add Video Modal */}
            <button
              className="add-video"
              onClick={() => setShowAddVideoModal(true)}
            >
              <span className="btn-upload">
                <Youtube size={19} />
              </span>{" "}
              Add External Video
            </button>

            {/* 2️⃣ Opens Upload Modal */}
            <button
              className="add-btn"
              onClick={() => setShowUploadModal(true)}
            >
              <span className="btn-upload">
                <Upload size={17} />
              </span>{" "}
              Upload Files
            </button>
          </div>
        </div>

        <MediaStats refreshKey={refreshKey} />
      </div>

      <MediaUpload key={refreshKey} handleRefresh={handleRefresh} />

      {/* ✅ Modals */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleRefresh}
        />
      )}

      {showAddVideoModal && (
        <MediaAddVideoModal
          onClose={() => setShowAddVideoModal(false)}
          onUpload={handleRefresh}
        />
      )}
    </>
  );
};

export default withAdminAuth(Pages);
