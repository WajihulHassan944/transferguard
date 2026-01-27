import React, { useEffect, useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import "./OrderTable.css";
import { baseUrl } from "@/const";
import toast from "react-hot-toast";
import AddOrder from "../AddOrder/AddOrder";
import InvoiceModal from "../InvoiceModal/InvoiceModal";
import CancelOrder from "../CancelOrder/CancelOrder";

const OrderTable = ({refreshKey, onDeleted}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
    const [showModal, setShowModal] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showInvoice, setShowInvoice] = useState(null);
    const [cancelModal, setCancelModal] = useState(null);
    
 
  const fetchOrders = async () => {
      try {
        const res = await fetch(`${baseUrl}/wallet/orders/all`);
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
     setLoading(true);
    fetchOrders();
  }, [refreshKey]);
useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".action-menu") && !e.target.closest(".dropdown-menu-table")) {
      setOpenMenu(null);
    }
  };
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

  const filteredOrders = orders.filter((order) =>
    [order.orderId, order.customer, order.email, order.company]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this order?")) return;

  try {
    const res = await fetch(`${baseUrl}/wallet/order/${id}`, { method: "DELETE" });

    if (!res.ok) {
      throw new Error(`Delete failed: ${res.status}`);
    }

    if(onDeleted) onDeleted();
    toast.success("Order deleted successfully");
  } catch (err) {
    console.error("Error deleting order:", err);
    toast.error("Failed to delete order");
  } finally {
    setOpenMenu(null);
  }
};



  return (
    <div>
      {/* Search */}
      <div className="search-bar">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search order"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <h3>All Orders</h3>
        <p className="subtitle">Manage and track all customer orders</p>

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Company</th>
              <th>Amount</th>
              <th>Credits</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
        <tbody>
  {loading
    ? Array.from({ length: 5 }).map((_, idx) => (
        <tr key={idx}>
          {Array.from({ length: 8 }).map((_, colIdx) => (
            <td key={colIdx}>
              <span className="skeleton-loader" />
            </td>
          ))}
        </tr>
      ))
    : filteredOrders.map((order, idx) => (
        <React.Fragment key={idx}>
          <tr>
            <td>{order.orderId}</td>
            <td>
              <div className="customer">
                <span className="customer-name">{order.customer}</span>
                <span className="customer-email">{order.email}</span>
              </div>
            </td>
            <td>{order.company || "—"}</td>
            <td>
              {order.currency === "CREDITS" && Number(order.amount) === 0 ? (
                <span className="admin-added">Added by Admin</span>
              ) : (
                <>
                  {order.currency} {Number(order.amount).toFixed(2)}
                </>
              )}
            </td>
            <td>{order.credits}</td>
            <td>
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </td>
            <td className="order-date-cell">
              <div className="order-date-wrapper">
                <span className="order-date">{order.date}</span>
                <span className="order-time">{order.time}</span>
              </div>
            </td>
            <td className="relative">
              <MoreHorizontal
                className="action-menu"
                size={18}
                onClick={() =>
                  setOpenMenu(openMenu === idx ? null : idx)
                }
              />
              {openMenu === idx && (
                <div className="dropdown-menu-table">
                  <button onClick={() => handleDelete(order._id)} className="delete-btn">Delete</button>
                  <button
  className={`action-btn ${order.status === "cancelled" ? "disabled" : ""}`}
  onClick={() => {
    setSelectedOrder(order);
    setCancelModal(true);
  }}
  disabled={order.status === "cancelled"}
>
  Cancel
</button>

<button
  className={`action-btn ${order.status === "cancelled" ? "disabled" : ""}`}
  onClick={() => {
    setSelectedOrder(order);
    setShowModal(true);
  }}
  disabled={order.status === "cancelled"}
>
  Update
</button>

                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowInvoice(idx); // 👈 track row index instead of true/false
                      setOpenMenu(null);
                    }}
                  >
                    Invoice
                  </button>
                </div>
              )}
            </td>
          </tr>

          {/* Inline invoice row */}
          {showInvoice === idx && selectedOrder?._id === order._id && (
            <tr>
              <td colSpan={8}>
                <InvoiceModal
                  orderId={order._id}
                  onClose={() => setShowInvoice(null)}
                />
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
</tbody>

</table>
{showModal && (
  <AddOrder
    order={selectedOrder}   // 👈 pass order if editing
    onClose={() => setShowModal(false)}
    onPlaced={onDeleted}
  />
)}

{cancelModal && (
  <CancelOrder
    order={selectedOrder}   // 👈 pass order if editing
    onClose={() => setCancelModal(false)}
    onCancelled={onDeleted}
  />
)}


      </div>
    </div>
  );
};

export default OrderTable;
