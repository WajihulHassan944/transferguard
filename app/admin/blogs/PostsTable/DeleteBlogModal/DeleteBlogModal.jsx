'use client';
import React from 'react';
import { Trash2, Loader2, X } from 'lucide-react';
import '../../../users/DeleteUserModal/DeleteUserModal.css'; // reuse same styles

const DeleteBlogModal = ({ blog, onClose, onConfirm, deletingBlogId }) => {
  if (!blog) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <h2>Delete Blog</h2>
        <p className="delete-warning">
          Are you sure you want to delete this blog? This action cannot be undone.
        </p>

        <div className="delete-box">
          <Trash2 className="delete-icon" size={32} />
          <div>
            <p className="delete-heading">You are about to delete:</p>
            <p className="delete-name">{blog.title}</p>
            <p className="delete-email">{blog.authorName}</p>
          </div>
        </div>

        <div className="delete-info">
          <p>This will permanently delete:</p>
          <ul>
            <li>Blog content and details</li>
            <li>Associated comments</li>
            <li>Related metadata</li>
          </ul>
        </div>

        <div className="delete-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="confirm-delete-btn"
            onClick={() => onConfirm(blog._id)}
            disabled={deletingBlogId === blog._id}
          >
            {deletingBlogId === blog._id ? (
              <Loader2 className="animate-spin icon" size={16} />
            ) : (
              <Trash2 size={16} className="icon" />
            )}
            {deletingBlogId === blog._id ? 'Deleting...' : 'Delete Blog'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBlogModal;
