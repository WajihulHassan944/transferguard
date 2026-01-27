"use client";
import React, { useState } from "react";
import "./orders.css";
import { GeistSans } from "geist/font/sans";
import withAdminAuth from "@/hooks/withAdminAuth";
import OrderStats from "./OrderStats/OrderStats";
import OrderTable from "./OrderTable/OrderTable";
import AddOrder from "./AddOrder/AddOrder";

const Orders = () => {
const [showAddOrder, setShowAddOrder] = useState(false);
const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };


  return (
    <div className={`orders-container ${GeistSans.className}`}>
      <div className="orders-header">
        <div>
          <h2>Orders</h2>
          <p>Manage customer orders, edit details, and generate invoices</p>
        </div>
        <button className="add-btn" onClick={() => setShowAddOrder(true)}>
          <span className="btn-plus">+</span> Add New Order
        </button>
      </div>


<OrderStats refreshKey={refreshKey} />
<OrderTable refreshKey={refreshKey} onDeleted={handleRefresh} />


{showAddOrder && <AddOrder onClose={() => setShowAddOrder(false)} onPlaced={handleRefresh} />}
    </div>
  );
};

export default withAdminAuth(Orders);
