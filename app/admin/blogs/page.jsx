"use client";
import React, { useState } from "react";
import "./blogs.css";
import { GeistSans } from "geist/font/sans";
import withAdminAuth from "@/hooks/withAdminAuth";
import BlogStats from "./BlogStats/BlogStats";
import PostsTable from "./PostsTable/PostsTable";
import Link from "next/link";

const Pages = () => {
const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={`credits-container ${GeistSans.className}`}>
      <div className="credits-header">
        <div>
          <h2>Blog Posts</h2>
          <p>Manage your blog content and articles</p>
        </div>
         <Link href="/admin/blogs/new" className="add-btn">
          <span className="btn-plus">+</span> New Post
        </Link>
      </div>

<BlogStats refreshKey={refreshKey} />
<PostsTable refreshKey={refreshKey} onDeleted={handleRefresh} />
    </div>
  );
};

export default withAdminAuth(Pages);
