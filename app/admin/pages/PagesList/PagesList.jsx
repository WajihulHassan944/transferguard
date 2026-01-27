"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Eye, Calendar, MoreVertical } from "lucide-react";
import "./PagesList.css";
import { baseUrl } from "@/const";

const PagesList = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null); // track open dropdown

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch(`${baseUrl}/pages/all-for-admin`);
        const data = await res.json();
        if (data.success && data.pages) {
          setPages(data.pages);
        }
      } catch (error) {
        console.error("Failed to fetch pages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const filteredPages = pages.filter((page) =>
    page.name.toLowerCase().includes(search.toLowerCase())
  );
useEffect(() => {
  const handleOutsideClick = (e) => {
    // If no dropdown is open, do nothing
    if (!dropdownOpen) return;

    // Check if click target is inside a dropdown or menu container
    if (!e.target.closest(".pages-menu-container")) {
      setDropdownOpen(null);
    }
  };

  // Use mousedown for better responsiveness
  document.addEventListener("mousedown", handleOutsideClick);
  return () => document.removeEventListener("mousedown", handleOutsideClick);
}, [dropdownOpen]);


  return (
    <div className="pages-wrapper">
      {/* Search Bar */}
      <div className="search-bar">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search pages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Pages Grid */}
      <div className="pages-grid">
        {loading
          ? // Skeleton placeholders while loading
            Array.from({ length: 6 }).map((_, i) => (
              <div className="pages-card" key={i}>
                <div className="pages-card-header">
                  <div className="pages-icon-box skeleton-loader" />
                  <div className="pages-title-box">
                    <h3 className="skeleton-loader" style={{ width: "80px" }} />
                    <p className="skeleton-loader" style={{ width: "60px" }} />
                  </div>
                </div>
                <div className="pages-status">
                  <span className="skeleton-loader" style={{ width: "50px" }} />
                </div>
                <div className="pages-meta">
                  <div className="meta-item">
                    <FileText size={16} />
                    <span className="skeleton-loader" style={{ width: "40px" }} />
                  </div>
                  <div className="meta-item">
                    <Eye size={16} />
                    <span className="skeleton-loader" style={{ width: "40px" }} />
                  </div>
                </div>
                <div className="pages-divider"></div>
                <div className="pages-footer">
                  <Calendar size={15} />
                  <span className="skeleton-loader" style={{ width: "80px" }} />
                </div>
              </div>
            ))
          : filteredPages.map((page) => (
              <div className="pages-card" key={page._id}>
                <div className="pages-card-header">
                  <div className="pages-icon-box">
                    <FileText size={22} />
                  </div>
                  <div className="pages-title-box">
                    <h3>{page.name}</h3>
                    <p>{page.url}</p>
                  </div>

                  <div
                    className="pages-menu-container"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(
                        dropdownOpen === page._id ? null : page._id
                      );
                    }}
                  >
                    <MoreVertical
                      className="pages-menu-icon"
                      size={18}
                      style={{ cursor: "pointer" }}
                    />
                    {dropdownOpen === page._id && (
                      <div
                        className="pages-dropdown"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            router.push(`/admin/pages/edit?id=${page._id}`)
                          }
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pages-status">
                  <span className="status-badge">{page.status}</span>
                </div>

                <div className="pages-meta">
                  <div className="meta-item">
                    <FileText size={16} />
                    <span>{page.sectionsCount} sections</span>
                  </div>
                  <div className="meta-item">
                    <Eye size={16} />
                    <span>{page.views}</span>
                  </div>
                </div>

                <div className="pages-divider"></div>

                <div className="pages-footer">
                  <Calendar size={15} />
                  <span>Modified {page.modified}</span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default PagesList;
