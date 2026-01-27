'use client';
import React, { useEffect, useState } from 'react';
import { ImageIcon, VideoIcon, ExternalLink } from 'lucide-react';
import './MediaTiles.css';
import { baseUrl } from '@/const';

const MediaTiles = ({
  searchQuery = '',
  filterType = 'all',
  selectAll = false,
  onSelectionChange = () => {},
}) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [selected, setSelected] = useState([]);

  // 🧠 Fetch media from backend
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch(`${baseUrl}/media/all`);
        const data = await res.json();
        if (data.success) {
          setMediaItems(data.media);
        }
      } catch (err) {
        console.error('Error fetching media:', err);
      }
    };
    fetchMedia();
  }, []);

useEffect(() => {
  if (selectAll) {
    const allSelected = mediaItems.map((item) => ({
      id: item._id,
      url: item.url,
      type: item.type,
    }));
    setSelected(allSelected.map((s) => s.id));
    onSelectionChange(allSelected);
  } else {
    setSelected([]);
    onSelectionChange([]);
  }
}, [selectAll, mediaItems]);

const toggleSelect = (id) => {
  const newSelectedIds = selected.includes(id)
    ? selected.filter((sid) => sid !== id)
    : [...selected, id];

  setSelected(newSelectedIds);

  const selectedItems = mediaItems
    .filter((item) => newSelectedIds.includes(item._id))
    .map((item) => ({
      id: item._id,
      url: item.url,
      type: item.type,
    }));

  onSelectionChange(selectedItems);
};
  // 🔍 Apply search and filter
  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'image' && item.type === 'image') ||
      (filterType === 'video' && item.type === 'video') ||
      (filterType === 'external' && item.type === 'external');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="media-gallery">
      {filteredItems.map((item) => (
        <div
          className={`media-card ${selected.includes(item._id) ? 'selected' : ''}`}
          key={item._id}
        >
          <div className="thumbnail-wrapper" onClick={() => toggleSelect(item._id)}>
            {item.type === 'video' ? (
              <video
                src={item.url}
                className="thumbnail"
                controls={false}
                muted
                preload="metadata"
              />
            ) : item.type === 'external' ? (
              <div className="external-thumbnail">
                <ExternalLink size={26} color="#6b7280" />
              </div>
            ) : (
              <img src={item.url} alt={item.name} className="thumbnail" />
            )}
            <input
              type="checkbox"
              className="media-checkbox"
              checked={selected.includes(item._id)}
              onChange={() => toggleSelect(item._id)}
            />
          </div>
          <div className="media-info">
            <p className="media-name">{item.name}</p>
            <p className="media-meta">
              {item.size} • {item.dimensions || 'N/A'}
            </p>
            <div className="tags">
              {item.tags.map((tag, j) => (
                <span key={j} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      {filteredItems.length === 0 && (
        <p className="no-media-text">No media found matching your filters.</p>
      )}
    </div>
  );
};

export default MediaTiles;
