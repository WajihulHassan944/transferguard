'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { ImageIcon, VideoIcon, MoreVertical, Link2, Trash, Download, Edit, Trash2, Loader2 } from 'lucide-react';
import './MediaTable.css';
import { baseUrl } from '@/const';
import EditMediaModal from './EditMediaModal/EditMediaModal';
import toast from 'react-hot-toast';

const MediaTable = ({
  searchQuery = '',
  filterType = 'all',
  selectAll = false,
  onSelectionChange = () => {},
  onUpdated
}) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState([]); // ✅ internal selection state
const [openMenu, setOpenMenu] = useState(null);

const [editItem, setEditItem] = useState(null);
const [showEditModal, setShowEditModal] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(null);


  // 🔹 Fetch media data
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/media/all`);
        const data = await res.json();
        if (res.ok) {
          setMediaItems(data.media || []);
        } else {
          setError(data.message || 'Failed to fetch media');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching media');
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  useEffect(() => {
  const closeMenu = () => setOpenMenu(null);
  window.addEventListener("click", closeMenu);
  return () => window.removeEventListener("click", closeMenu);
}, []);


  // 🔹 Filter + search
  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchesType =
        filterType === 'all' ||
        item.type === filterType ||
        (filterType === 'external' && item.type === 'external');
      const matchesSearch = item.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [mediaItems, filterType, searchQuery]);

  // 🔹 Handle "select all" toggle from parent or manually
  useEffect(() => {
    if (selectAll) {
      const allSelected = filteredMedia.map((m) => m._id);
      setSelected(allSelected);
      const selectedItems = filteredMedia.map((m) => ({
        id: m._id,
        url: m.url,
        type: m.type,
      }));
      onSelectionChange(selectedItems);
    } else {
      setSelected([]);
      onSelectionChange([]);
    }
  }, [selectAll, filteredMedia]);

  // 🔹 Handle individual item toggle
  const toggleSelectItem = (id) => {
    const newSelected = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];

    setSelected(newSelected);

    const selectedItems = mediaItems
      .filter((item) => newSelected.includes(item._id))
      .map((item) => ({
        id: item._id,
        url: item.url,
        type: item.type,
      }));

    onSelectionChange(selectedItems);
  };

  // 🔹 Handle header checkbox
  const allSelected =
    filteredMedia.length > 0 &&
    filteredMedia.every((item) => selected.includes(item._id));

  const toggleSelectAll = (checked) => {
    if (checked) {
      const allIds = filteredMedia.map((m) => m._id);
      setSelected(allIds);
      const selectedItems = filteredMedia.map((m) => ({
        id: m._id,
        url: m.url,
        type: m.type,
      }));
      onSelectionChange(selectedItems);
    } else {
      setSelected([]);
      onSelectionChange([]);
    }
  };

  if (loading) return <div className="media-loading">Loading media...</div>;
  if (error) return <div className="media-error">{error}</div>;
const handleDelete = async (id) => {
  if (!confirm("Delete this media item?")) return;

  setDeleteLoading(id);

  try {
    const res = await fetch(`${baseUrl}/media/delete/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      onUpdated();
    } else {
      alert(data.message || "Delete failed");
    }
  } catch (error) {
    console.error(error);
    alert("Failed to delete media.");
  }

  setDeleteLoading(null);
  setOpenMenu(null);
};

  return (
    <div className="media-table-wrapper">
      <table className="media-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className="table-checkbox"
                checked={allSelected}
                onChange={(e) => toggleSelectAll(e.target.checked)}
              />
            </th>
            <th>Preview</th>
            <th>Name</th>
            <th>Type</th>
            <th>Size</th>
            <th>Dimensions</th>
            <th>Upload Date</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {filteredMedia.map((item) => (
            <tr key={item._id} className="media-row ">
              <td>
                <input
                  type="checkbox"
                  className="table-checkbox"
                  checked={selected.includes(item._id)}
                  onChange={() => toggleSelectItem(item._id)}
                />
              </td>

              <td>
                <div className="preview-cell">
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      className="preview-video"
                      preload="metadata"
                      muted
                    />
                  ) : item.type === 'external' ? (
                    <div className="video-placeholder">
                      <Link2 size={22} color="#555" />
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="preview-img"
                    />
                  )}
                </div>
              </td>

              <td>
                <div className="name-cell">
                  <span className="file-name">{item.name}</span>
                  {item.tags?.length > 0 && (
                    <div className="tags">
                      {item.tags.map((tag, j) => (
                        <span key={j} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </td>

              <td className="type-cell-table">
                {item.type === 'image' && <ImageIcon size={18} />}
                {item.type === 'video' && <VideoIcon size={18} />}
                {item.type === 'external' && <Link2 size={18} />}
                <span style={{ textTransform: 'capitalize' }}>
                  {item.platform || item.type}
                </span>
              </td>

              <td>{item.size || 'N/A'}</td>
              <td>{item.dimensions || 'N/A'}</td>
              <td>
                {new Date(item.uploadDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
<td className="actions-cell">
  <div className="media-actions-wrapper">
    <MoreVertical
      size={18}
      color="#555"
      className="media-actions-dots"
      onClick={(e) => {
        e.stopPropagation();
        setOpenMenu(openMenu === item._id ? null : item._id);
      }}
    />

{openMenu === item._id && (
  <div className="media-dropdown-menu-updated" onClick={(e) => e.stopPropagation()}>
    <button
      className="media-menu-item"
      onClick={() => {
        setEditItem(item);
        setShowEditModal(true);
        setOpenMenu(null);
      }}
    >
      <span><Edit size={16} /></span>
      Edit
    </button>

    <button
      className="media-menu-item"
      onClick={() => {
        navigator.clipboard.writeText(item.url);
        setOpenMenu(null);
      }}
    >
      <span><Link2 size={16} /></span>
      Copy URL
    </button>

    <a
      className="media-menu-item"
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      download
      onClick={() => setOpenMenu(null)}
    >
      <span><Download size={16} /></span>
      Download
    </a>
<button
  className="media-menu-item media-delete"
  onClick={() => handleDelete(item._id)}
  disabled={deleteLoading === item._id}
>
  <span>
    {deleteLoading === item._id ? (
      <Loader2 size={16} className="animate-spin" />
    ) : (
      <Trash2 size={16} />
    )}
  </span>
  {deleteLoading === item._id ? "Deleting..." : "Delete"}
</button>

  </div>
)}

  </div>
</td>

            </tr>
          ))}

          {filteredMedia.length === 0 && (
            <tr>
              <td colSpan="8" className="no-results">
                No media found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

{showEditModal && (
  <EditMediaModal
    item={editItem}
    onClose={() => setShowEditModal(false)}
    onUpdated={onUpdated}
  />
)}

    </div>
  );
};

export default MediaTable;
