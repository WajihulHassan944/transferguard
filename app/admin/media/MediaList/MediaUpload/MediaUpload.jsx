'use client';
import React, { useState } from 'react';
import './MediaUpload.css';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Upload,
  Check,
  Download,
  Trash2,
} from 'lucide-react';
import MediaTiles from './MediaTiles/MediaTiles';
import MediaTable from './MediaTable/MediaTable';
import UploadModal from './UploadModal/UploadModal';
import MediaAddVideoModal from './MediaAddVideoModal/MediaAddVideoModal';
import { baseUrl } from '@/const';
import toast from 'react-hot-toast';

const MediaUpload = ({ handleRefresh }) => {
  const [view, setView] = useState('list');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
const [selectedMedia, setSelectedMedia] = useState([]);
const [selectAll, setSelectAll] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [filterType, setFilterType] = useState('all');
  // 🖱️ Drag & Drop Events
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

  // 🚀 Upload Function
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

    // 🔹 Format size
    const size = selectedFile.size;
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
    formData.append(
      'tags',
      type === 'video' ? 'video' : type === 'image' ? 'image' : 'external'
    );

    try {
      // 🔹 Get dimensions
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
            formData.append(
              'dimensions',
              `${video.videoWidth}x${video.videoHeight}`
            );
            resolve();
          };
        });
      } else {
        formData.append('dimensions', 'N/A');
      }

      // 🚀 Upload to backend
      const res = await fetch(`${baseUrl}/media/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        handleRefresh?.(data);
        setSelectedFile(null);
      } else {
        setError(data.message || 'Upload failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while uploading.');
    } finally {
      setLoading(false);
    }
  };
const handleDeleteSelected = async () => {
  const idsToDelete = selectedMedia.map((m) => m.id);
  if (idsToDelete.length === 0) return;

  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${idsToDelete.length} media item(s)?`
  );
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${baseUrl}/media/delete-multiple`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: idsToDelete }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Media deleted successfully!");
      setSelectedMedia([]); // clear selected items
      handleRefresh();
    } else {
      toast.error(`❌ Failed to delete media: ${data.message}`);
    }
  } catch (error) {
    console.error("Error deleting media:", error);
    toast.error("⚠️ An error occurred while deleting media.");
  }
};

  return (
    <div className="media-upload-container">
      {/* Top Bar */}
      <div className="media-top-bar">
        <div className="media-top-filters">
          <div className="flexedDiv">
            <div className="search-box">
              <Search size={18} color="#111827" />
             <input
  type="text"
  placeholder="Search media..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

            </div>
            <div className="filter-box">
              <Filter size={18} />
             <select
  value={filterType}
  onChange={(e) => setFilterType(e.target.value)}
>
  <option value="all">All Types</option>
  <option value="image">Images</option>
  <option value="video">Videos</option>
</select>

            </div>
          </div>

          <div className="media-header-right">
          {selectedMedia.length > 0 && (<>
          <span className='selectedCount'>{selectedMedia.length} selected</span>
           <button
  className="action-header-btn"
  onClick={handleDeleteSelected}
  disabled={selectedMedia.length === 0}
>
  <Trash2 size={17} /> Delete
</button>

<button
  className="action-header-btn"
  onClick={() => {
    selectedMedia.forEach((m) => {
      if (m.type !== 'external') {
        const link = document.createElement('a');
        link.href = m.url;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });
  }}
  disabled={selectedMedia.length === 0}
>
  <Download size={17} /> Download
</button></>
)}

            <div className="view-toggle">
              <button
                className={`view-segment ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                className={`view-segment ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
{selectedMedia.length > 0 && 
      <button
  className="browse-btn"
  onClick={() => setSelectAll((prev) => !prev)}
>
  <Check size={17} /> {selectAll ? 'Unselect All' : 'Select All'}
</button>}

      </div>

      {/* Upload Area */}
      <div className="wrapper-for-rendering">
        <div
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="upload-icon" size={42} />
          {!selectedFile ? (
            <>
              <p className="upload-text">Drag and drop files here</p>
              <p className="upload-subtext">
                or use the buttons above to add media
              </p>
              <div className="upload-buttons">
                <button
                  className="browse-btn"
                  onClick={() => setShowUploadModal(true)}
                >
                  Browse Files
                </button>
                <button
                  className="youtube-btn"
                  onClick={() => setShowAddVideoModal(true)}
                >
                  Add YouTube/Vimeo
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="upload-text selected">{selectedFile.name}</p>
              {error && <p className="upload-error">{error}</p>}
              <button
                className="media-upload-btn"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </>
          )}
        </div>

    {view === 'grid' ? (
  <MediaTiles
    searchQuery={searchQuery}
    filterType={filterType}
    selectAll={selectAll}
    onSelectionChange={setSelectedMedia}
  />
) : (
  <MediaTable
    searchQuery={searchQuery}
    filterType={filterType}
    selectAll={selectAll}
    onSelectionChange={setSelectedMedia}
    onUpdated={handleRefresh}
  />
)}



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
      </div>
    </div>
  );
};

export default MediaUpload;
