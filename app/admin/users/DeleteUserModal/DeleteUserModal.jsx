'use client';
import React from 'react';
import { Trash2, Loader2, X } from 'lucide-react';
import './DeleteUserModal.css';

const DeleteUserModal = ({ user, onClose, onConfirm, deletingUserId }) => {
  if (!user) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <h2>Delete User</h2>
        <p className="delete-warning">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>

        <div className="delete-box">
          <Trash2 className="delete-icon" size={32} />
          <div>
            <p className="delete-heading">You are about to delete:</p>
            <p className="delete-name">{user.name}</p>
            <p className="delete-email">{user.email}</p>
          </div>
        </div>

        <div className="delete-info">
          <p>This will permanently delete:</p>
          <ul>
            <li>User account and profile</li>
            <li>All user data and settings</li>
            <li>Order history and credits</li>
            <li>Access to all services</li>
          </ul>
        </div>

        <div className="delete-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="confirm-delete-btn"
            onClick={() => onConfirm(user.id)}
            disabled={deletingUserId === user.id}
          >
            {deletingUserId === user.id ? (
              <Loader2 className="animate-spin icon" size={16} />
            ) : (
              <Trash2 size={16} className="icon" />
            )}
            {deletingUserId === user.id ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
