'use client';
import React, { useState } from 'react';
import { ChevronDown, Youtube, Video, Link2 } from 'lucide-react';
import { baseUrl } from '@/const';
import "./MediaAddVideoModal.css";
const MediaAddVideoModal = ({ onClose, onUpload }) => {
  const [platform, setPlatform] = useState('YouTube');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = (value) => {
    setPlatform(value);
    setShowDropdown(false);
  };

  const handleAdd = async () => {
    if (!url.trim()) {
      setError('Please enter a valid video URL.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('type', 'external');
      formData.append('url', url);
      formData.append('platform', platform.toLowerCase());
      formData.append('name', title);
      formData.append('size', 'N/A');
      formData.append('dimensions', 'N/A');
      formData.append('tags', 'external');

      const res = await fetch(`${baseUrl}/media/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        onUpload();
        onClose();
      } else {
        setError(data.message || 'Failed to add video.');
      }
    } catch (err) {
      setError('Something went wrong while adding video.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="media-add-video-overlay">
      <div className="media-add-video-modal">
        <div className="media-add-video-header">
          <h2>Add External Video</h2>
          <button className="media-add-video-close-btn" onClick={onClose}>×</button>
        </div>

        <p className="media-add-video-subtext">
          Add YouTube or Vimeo videos to your media library
        </p>

        {/* Platform Select */}
        <div className="media-add-video-form-group">
          <label>Platform</label>
          <div className="media-add-video-select" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="media-add-video-select-value">
              {platform === 'YouTube' && <Youtube size={16} color="#ff0000" />}
              {platform === 'Vimeo' && <Video size={16} color="#1ab7ea" />}
              <span>{platform}</span>
              <ChevronDown size={16} />
            </div>
            {showDropdown && (
              <div className="media-add-video-dropdown">
                <div onClick={() => handleSelect('YouTube')}>
                  <Youtube size={14} color="#ff0000" /> YouTube
                </div>
                <div onClick={() => handleSelect('Vimeo')}>
                  <Video size={14} color="#1ab7ea" /> Vimeo
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video URL */}
        <div className="media-add-video-form-group">
          <label>Video URL</label>
          <input
            type="text"
            placeholder={
              platform === 'YouTube'
                ? 'https://www.youtube.com/watch?v=...'
                : 'https://vimeo.com/...'
            }
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <p className="media-add-video-hint">Paste the full URL from {platform}</p>
        </div>

        {/* Video Title */}
        <div className="media-add-video-form-group">
          <label>Video Title</label>
          <input
            type="text"
            placeholder="Enter a descriptive title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {error && <p className="media-add-video-error">{error}</p>}

        {/* How to Use */}
        <div className="media-add-video-howto">
          <h4>How to use:</h4>
          <ol>
            <li>Copy the video URL from YouTube or Vimeo</li>
            <li>Paste it in the URL field above</li>
            <li>Give your video a descriptive title</li>
            <li>Click "Add Video" to save it to your media library</li>
            <li>Use the embed code in your pages and blog posts</li>
          </ol>
        </div>

        {/* Footer */}
        <div className="media-add-video-footer">
          <button className="media-add-video-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="media-add-video-add-btn"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? 'Adding...' : (<><Link2 size={16} /> Add Video</>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaAddVideoModal;
