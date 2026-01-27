'use client';
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import "./CreditsTable.css";
import AddRemoveCredits from "./AddRemoveCredits/AddRemoveCredits";
import { baseUrl } from "@/const";
const CreditsTable = ({onUpdated}) => {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // 🔹 Fetch customer credits
  useEffect(() => {
    fetch(`${baseUrl}/wallet/all-customers-credits`)
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
        setLoading(false);
      });
  }, []);

  // 🔹 Search filter
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setFiltered(
      customers.filter(
        (c) =>
          c.customer.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term)
      )
    );
  };

  const handleOpenPopup = (type, customer) => {
    setActionType(type);
    setSelectedCustomer(customer);
    setShowPopup(true);
  };

  const handleClosePopup = (updated = false) => {
  setShowPopup(false);
  setActionType(null);
  setSelectedCustomer(null);

  if (updated) {
    setLoading(true); // 🔹 show skeleton loader
    fetch(`${baseUrl}/wallet/all-customers-credits`)
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setFiltered(data);
        setLoading(false); // 🔹 hide loader
      })
      .catch((err) => {
        console.error("Error refreshing customers:", err);
        setLoading(false); // 🔹 ensure loader stops on error
      });

    if (onUpdated) onUpdated();
  }
};


 return (
  <div>
    {/* Search */}
    <div className="search-bar">
      <Search className="search-icon" size={18} />
      <input
        type="text"
        placeholder="Search customers..."
        onChange={handleSearch}
      />
    </div>

    {/* Credits Table */}
    <div className="table-container">
      <h3>Customer Credits</h3>
      <p className="subtitle">
        Monitor and manage customer credit balances and expiry dates
      </p>

      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Company</th>
            <th>Credits Usage</th>
            <th>Remaining</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // 🔹 Skeleton rows while loading
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><div className="skeleton-loader" style={{ width: "120px" }} /></td>
                <td><div className="skeleton-loader" style={{ width: "100px" }} /></td>
                <td><div className="skeleton-loader" style={{ width: "80px" }} /></td>
                <td><div className="skeleton-loader" style={{ width: "40px" }} /></td>
                <td><div className="skeleton-loader" style={{ width: "90px" }} /></td>
                <td><div className="skeleton-loader" style={{ width: "70px" }} /></td>
                <td><div className="skeleton-loader" style={{ width: "100px" }} /></td>
              </tr>
            ))
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No customers found
              </td>
            </tr>
          ) : (
            filtered.map((cust) => {
               const match = cust.creditsUsage?.match(/(\d+)\s*\/\s*(\d+)\s*\((\d+)%\)/);
  if (!match) {
    return null; // or handle gracefully
  }
  const [used, total, percentRaw] = match.slice(1);
              const percent = parseInt(percentRaw, 10);

              // Expiry logic
              const today = new Date();
              const expiry = new Date(cust.expiryDate);
              const daysLeft = Math.floor(
                (expiry - today) / (1000 * 60 * 60 * 24)
              );
              let statusClass = "active";
              let statusText = cust.status;
              let expiryNote = null;

              if (daysLeft <= 0) {
                statusClass = "expired";
                statusText = "Expired";
                expiryNote = <div className="expiry-error">⚠ Expired</div>;
              } else if (daysLeft <= 30) {
                statusClass = "expiring";
                statusText = "Expiring Soon";
                expiryNote = (
                  <div className="expiry-warning">
                    ⚠ Expires in {daysLeft} days
                  </div>
                );
              }

              return (
                <tr key={cust.id}>
                  <td>
                    <div className="customer">
                      <span className="customer-name">{cust.customer}</span>
                      <span className="customer-email">{cust.email}</span>
                    </div>
                  </td>
                  <td>{cust.company || "—"}</td>
                  <td>
                    {used} / {total}{" "}
                    <span className="usage-percent">{percent}%</span>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </td>
                  <td>{cust.remaining}</td>
                  <td>
                    {cust.expiryDate}
                    {expiryNote}
                  </td>
                  <td>
                    <span className={`status ${statusClass}`}>
                      {statusText}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn add"
                      onClick={() => handleOpenPopup("add", cust)}
                    >
                      + Add
                    </button>
                    <button
                      className="btn remove"
                      onClick={() => handleOpenPopup("remove", cust)}
                      disabled={cust.remaining <= 0}
                    >
                      − Remove
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>

    {showPopup && (
      <AddRemoveCredits
        actionType={actionType}
        customer={selectedCustomer}
        onClose={handleClosePopup}
      />
    )}
  </div>
);

};

export default CreditsTable;
