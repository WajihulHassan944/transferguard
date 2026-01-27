"use client";
import React, { useState } from "react";
import "./products.css";
import { GeistSans } from "geist/font/sans";
import withAdminAuth from "@/hooks/withAdminAuth";
import ProductStats from "./ProductStats/ProductStats";
import CreditPackages from "./CreditPackages/CreditPackages";
import PriceSchedules from "./PriceSchedules/PriceSchedules";
import EditProductModal from "./EditProductModal/EditProductModal";

const Pages = () => {
const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
const [addProduct, setAddProduct] = useState(false);
  return (
    <div className={`credits-container ${GeistSans.className}`}>
      <div className="credits-header">
        <div>
          <h2>Products</h2>
          <p>Manage credit packages and pricing</p>
        </div>
        <button className="add-btn" onClick={()=>setAddProduct(true)}>
          <span className="btn-plus">+</span> New Product
        </button>
         </div>

<ProductStats refreshKey={refreshKey} />
<CreditPackages onAdd={handleRefresh} refreshKey={refreshKey} onSave={handleRefresh} />
{addProduct && (
  <EditProductModal onClose={()=>setAddProduct(false)} onAdd={handleRefresh} />
)}
<PriceSchedules refreshKey={refreshKey} onDelete={handleRefresh}  />
    </div>
  );
};

export default withAdminAuth(Pages);
