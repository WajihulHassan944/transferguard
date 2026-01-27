'use client';
import React, { useEffect, useState } from "react";
import { Search, Copy, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/const";
import toast from 'react-hot-toast';

const CouponsTable = ({ onDeleted }) => {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 👉 Fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/coupons/all`);
        const data = await res.json();
        if (data.success) {
          setCoupons(data.data);
        }
      } catch (err) {
        console.error("Error fetching coupons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  // 👉 Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`${baseUrl}/coupons/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.filter((c) => c._id !== id));
        toast.success("Coupon deleted successfully!");
        if (onDeleted) onDeleted();
      } else {
        toast.error(data.message || "Failed to delete coupon");
      }
    } catch (err) {
      console.error("Error deleting coupon:", err);
    }
  };

  // 👉 Handle copy
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied code: ${code}`);
  };

  // 👉 Filtered coupons
  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Search */}
      <div className="search-bar">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search coupons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Coupons Table */}
      <div className="table-container">
        <h3>All Coupons</h3>
        {loading ? (
          <p>Loading coupons...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Usage</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.length > 0 ? (
                filteredCoupons.map((c) => (
                  <tr key={c._id}>
                    <td>{c.code}</td>
                    <td>{c.type}</td>
                    <td>
                        {c.amount}%
                      </td>
                    <td>{c.description}</td>
                    <td>
                      {c.usageCount}/{c.usageLimit || "∞"}
                    </td>
                    <td>
                      {c.expiryDate
                        ? new Date(c.expiryDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`status ${
                          c.status === "active" ? "active" : "inactive"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="actions">
                      <Copy
                        size={18}
                        className="action-icon"
                        onClick={() => handleCopy(c.code)}
                      />
                      <Edit
                        size={18}
                        className="action-icon"
                        onClick={() => router.push(`/admin/coupons/new?id=${c._id}`)}
                      />
                      <Trash2
                        size={18}
                        className="action-icon delete"
                        onClick={() => handleDelete(c._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No coupons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default CouponsTable;
