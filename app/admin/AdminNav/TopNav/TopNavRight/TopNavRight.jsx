'use client';
import React, { useState } from "react";
import { useSelector } from "react-redux";
import useLogout from "@/hooks/useLogout";
import "./TopNavRight.css";
const TopNavRight = () => {
  const user = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const logout = useLogout();

  return (
    <div className="top-nav-right">
      <div className="user-info">
        <div>
          <h4>Admin User</h4>
          <p>{user?.email}</p>
        </div>
        <div
          className="user-avatar"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          AU
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => logout(() => setDropdownOpen(false))}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavRight;
