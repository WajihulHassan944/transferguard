'use client';
import React, { useState } from 'react';
import './AddUserModal.css';
import { FiX } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';
import { baseUrl } from '@/const';
import toast from 'react-hot-toast';
const AddUserModal = ({ user, onClose, onAdd, onUpdate }) => {
  console.log(user);
const [formData, setFormData] = useState({
  name: user ? user.name : '',
  email: user ? user.email : '',
  password: '',
  role: user ? user.role?.[0] || 'user' : 'user',
  street: user?.address?.street || '',
  city: user?.address?.city || '',
  postalCode: user?.address?.postalCode || '',
  country: user?.address?.country || '',
  companyName: user?.companyName || '',
  vatNumber: user?.vatNumber || '',
  status: user?.status || 'active',
});

  const [loading, setLoading] = useState(false);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const endpoint = user
      ? `${baseUrl}/users/update-profile`
      : `${baseUrl}/users/register`;

    const method = user ? 'PUT' : 'POST';

    const body = user
      ? {
          userId: user.id,
          firstName,
          lastName,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          companyName: formData.companyName,
          vatNumber: formData.vatNumber,
          address: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        }
      : {
          firstName,
          lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          addedByAdmin: true,
        };

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to process request');
    }

    toast.success(user ? 'User updated successfully!' : 'User created successfully!');
    user ? onUpdate() : onAdd();
    onClose();
  } catch (err) {
    console.error(err);
    toast.error(err.message || 'Something went wrong.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="modal-overlay-user">
      <div className="modal-content">
        <div className="modal-header">
        <h2>{user ? 'Update User' : 'Add New User'}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

       <p className="modal-subtitle">
  {user ? 'Modify existing user details' : 'Create a new user account'}
</p>

     <form className="modal-body" onSubmit={handleSubmit}>
  {/* Basic Information */}
  <h4 className="section-title">Basic Information</h4>
  <div className="form-row">
    <div className="form-group">
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Full name"
        value={formData.name}
        onChange={handleChange}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="user@example.com"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </div>
  </div>
    {!user && (
      <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
    )}


  {/* Address Information */}
  {user && (
    <>
      <h4 className="section-title">Address Information</h4>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="street">Street Address</label>
          <input
            id="street"
            name="street"
            type="text"
            placeholder="123 Main Street"
            value={formData.street || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="Amsterdam"
            value={formData.city || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            placeholder="1012 AB"
            value={formData.postalCode || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            name="country"
            type="text"
            placeholder="Netherlands"
            value={formData.country || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Business Information */}
      <h4 className="section-title">Business Information</h4>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            placeholder="Acme Corporation"
            value={formData.companyName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="vatNumber">VAT Number</label>
          <input
            id="vatNumber"
            name="vatNumber"
            type="text"
            placeholder="NL123456789B01"
            value={formData.vatNumber || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  )}

  {/* Account Settings */}
  <h4 className="section-title">Account Settings</h4>
  <div className="form-row">
    <div className="form-group">
      <label htmlFor="role">Role</label>
      <select id="role" name="role" value={formData.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    {user && (
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status || "active"}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
    )}
  </div>

  <div className="modal-actions">
    <button
      type="button"
      className="btn-cancel"
      onClick={onClose}
      disabled={loading}
    >
      Cancel
    </button>
    <button type="submit" className="btn-primary" disabled={loading}>
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : user ? (
        "Update User"
      ) : (
        "Create User"
      )}
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default AddUserModal;
