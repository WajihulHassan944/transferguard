"use client";
import React, { useState } from "react";
import "./users.css";
import { GeistSans } from "geist/font/sans";
import withAdminAuth from "@/hooks/withAdminAuth";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import UserStats from "./UserStats/UserStats";
import UsersTable from "./UsersTable/UsersTable";
import AddUserModal from "./AddUserModal/AddUserModal";

const page = () => {
   const [addUser, setAddUser] = useState(null);
const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={`users-container ${GeistSans.className}`}>
      <div className="users-header">
        <div>
          <h2>Users</h2>
          <p>Manage user accounts and permissions</p>
        </div>
          <button className="add-btn" onClick={()=>setAddUser(true)}>
          <span className="btn-plus"><UserPlus size={17} /></span> Add User
        </button>
      </div>
<UserStats refreshKey={refreshKey}  />
<UsersTable onUpdate={handleRefresh} refreshKey={refreshKey}  />
 {addUser && (
        <AddUserModal onClose={()=>setAddUser(false)} onAdd={handleRefresh} />
      )}
    </div>
  );
};

export default withAdminAuth(page);
