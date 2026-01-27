'use client';
import React, { useEffect, useState } from 'react';
import './UsersTable.css';
import { FiSearch, FiMoreVertical } from 'react-icons/fi';
import AddUserModal from '../AddUserModal/AddUserModal';
import { baseUrl } from '@/const';
import toast from 'react-hot-toast';
import { Pencil, Key, Mail, Trash2, Loader2 } from "lucide-react"
import DeleteUserModal from '../DeleteUserModal/DeleteUserModal';
import ResetPasswordModal from '../ResetPasswordModal/ResetPasswordModal';
const UsersTable = ({onUpdate, refreshKey}) => {
  const [filter, setFilter] = useState('All Users');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
const [deletingUserId, setDeletingUserId] = useState(null);
const [userToDelete, setUserToDelete] = useState(null);
const [resetUser, setResetUser] = useState(null);

useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.actions-wrapper')) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/users/detailed`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshKey]);

  // Reset search after closing any modal
useEffect(() => {
  if (!selectedUser && !resetUser && !userToDelete) {
    setSearch('');
  }
}, [selectedUser, resetUser, userToDelete]);


  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'All Users' ||
      (filter === 'Active' && user.status.includes('active')) ||
      (filter === 'Inactive' && user.status.includes('inactive')) ||
      (filter === 'Admin' && user.role.includes('admin'));
    return matchesSearch && matchesFilter;
  });

  const handleDropdownToggle = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setDropdownOpen(null);
  };

  const handleModalClose = () => {
    setSelectedUser(null);
  };

const handleResetPassword = (user) => {
  setResetUser(user);
  setDropdownOpen(null);
};
  const handleDeleteClick = async (id) => {
  setDeletingUserId(id);
  try {
    const res = await fetch(`${baseUrl}/users/delete-user/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) {
      onUpdate();
      toast.success('User deleted successfully');
       setDropdownOpen(null);
      setUserToDelete(null);
    } else {
      console.error('Failed to delete user:', data.message);
      toast.error(data.message);
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    toast.error("Error while deleting a user");
  } finally {
    setDeletingUserId(null);
  }
};



  return (
    <div className="table-container">
      {/* Search */}
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['All Users', 'Active', 'Inactive', 'Admin'].map((tab) => (
          <button
            key={tab}
            className={`filter-btn ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Credits</th>
            <th>Last Login</th>
            <th>Email Verified</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => (
      <tr key={idx} className="skeleton-row">
        {Array.from({ length: 7 }).map((_, colIdx) => (
          <td key={colIdx}>
            <div className="skeleton-cell"></div>
          </td>
        ))}
      </tr>
    ))
            : filteredUsers.map((user, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </td>
                 <td>
  {Array.isArray(user.role) && user.role.length > 0 ? (
    user.role.map((role, index) => (
      <span key={index} className={`role-badge ${role}`}>
        {role}
      </span>
    ))
  ) : (
    <span className="role-badge user">user</span>
  )}
</td>

                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.credits}</td>
                  <td>{user.lastLogin}</td>
                  <td>
                    <span
                      className={`verify-badge ${
                        user.emailVerified === 'Verified'
                          ? 'verified'
                          : 'unverified'
                      }`}
                    >
                      {user.emailVerified}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="actions-wrapper" >
  <FiMoreVertical
    className="actions-icon"
    onClick={() => handleDropdownToggle(idx)}
  />
{dropdownOpen === idx && (
  <div className="actions-dropdown">
    <button onClick={() => handleUpdateClick(user)}>
      <Pencil size={16} className="icon" />
      Edit User
    </button>

    <button onClick={() => handleResetPassword(user)}>
      <Key size={16} className="icon" />
      Reset Password
    </button>

    <button onClick={() => handleSendEmail(user)}>
      <Mail size={16} className="icon" />
      Send Email
    </button>

<button
  className="delete-btn"
  onClick={() => {
    setUserToDelete(user);
     setDropdownOpen(null);
  }}
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
)}
</div>

                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedUser && (
        <AddUserModal user={selectedUser} onClose={handleModalClose} onUpdate={onUpdate} />
      )}
{resetUser && (
  <ResetPasswordModal
    userId={resetUser.id}
    userName={resetUser.name}
    onClose={() => setResetUser(null)}
  />
)}

      {userToDelete && (
  <DeleteUserModal
    user={userToDelete}
    deletingUserId={deletingUserId}
    onClose={() => setUserToDelete(null)}
    onConfirm={(id) => {
      handleDeleteClick(id);
    }}
  />
)}

    </div>
  );
};

export default UsersTable;
