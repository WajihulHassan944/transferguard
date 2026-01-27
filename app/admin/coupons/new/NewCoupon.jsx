'use client';
import React, { useState, useEffect } from "react";
import "./AddCoupon.css";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { GeistSans } from "geist/font/sans";
import GeneralCard from "./cards/GeneralCard";
import CouponDataCard from "./cards/CouponDataCard";
import UsageRestrictionCard from "./cards/UsageRestrictionCard";
import UsageLimitsCard from "./cards/UsageLimitsCard";
import CouponPreviewCard from "./cards/CouponPreviewCard";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { baseUrl } from "@/const";
import toast from 'react-hot-toast';

const NewCoupon = () => {
 const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    status:"active",
    amount: 0,
    description: "",
    discountType: "percentage", // maps to backend "type"
    freeShipping: false,
    expiryDate: "",
    restrictionCode: "",
    restrictionAmount: 0,
    individualUse: true,
    userEmail: "",
    excludeSale: false,
    limitPerCoupon: "",
    limitPerUser: "",
    productRestriction: [],   // ✅ added
  cartMinItems: ""          // ✅ added
  });

  // 👉 Fetch coupon if editing
  useEffect(() => {
    if (id) {
      const fetchCoupon = async () => {
        try {
          setLoading(true);
          const res = await fetch(`${baseUrl}/coupons/get-coupon-by-id/${id}`);
          const data = await res.json();
          if (data.success) {
            const c = data.data;
            setFormData({
              code: c.code || "",
              status: c.status || "",
              amount: c.amount || 0,
              description: c.description || "",
              discountType: c.type || "percentage",
              freeShipping: c.freeShipping || false,
              expiryDate: c.expiryDate ? c.expiryDate.substring(0, 10) : "",
              restrictionCode: c.restrictionCode || "",
              restrictionAmount: c.restrictionAmount || 0,
              individualUse: c.allowCombine === false, // invert logic
              userEmail: c.usageRestriction?.userEmail || "",
              excludeSale: c.excludeSaleItems || false,
              limitPerCoupon: c.usageLimit || "",
              limitPerUser: c.limitPerUser || "",
              productRestriction: c.productRestriction || [],   // ✅ added
  cartMinItems: c.cartMinItems || ""                // ✅ added
            });
          }
        } catch (err) {
          console.error("Error fetching coupon:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchCoupon();
    }
  }, [id]);

  // 👉 Handle create/update
  const handleSave = async () => {
    try {
     
      setLoading(true);
  if (formData.discountType === "fixed_product" && formData.productRestriction.length === 0) {
      toast.error("Please select a product restriction (Basic, Standard, Premium).");
      return;
    }
    if (formData.discountType === "fixed_cart" && !formData.cartMinItems) {
      toast.error("Please enter minimum cart items required.");
      return;
    }
    //  if (!formData.individualUse && !formData.userEmail) {
    //   toast.error("Please enter a user email when Show in homepage is disabled.");
    //   return;
    // }
      // Map frontend formData → backend payload
      const payload = {
  code: formData.code,
  type: formData.discountType,
  amount: formData.amount,
  description: formData.description,
  usageLimit: formData.limitPerCoupon,
  expiryDate: formData.expiryDate,
  allowCombine: !formData.individualUse,
  excludeSaleItems: formData.excludeSale,
  freeShipping: formData.freeShipping,
  status: formData.status,
  minCartTotal: 0,
  maxCartTotal: null,
  productRestriction: formData.discountType === "fixed_product" ? formData.productRestriction : [],
  cartMinItems: formData.discountType === "fixed_cart" ? formData.cartMinItems : null,

  // ✅ usageRestriction object
  usageRestriction: {
    restrictionCode: formData.restrictionCode,
    restrictionAmount: formData.restrictionAmount,
    individualUseOnly: !formData.individualUse,
    userEmail: formData.userEmail
  }
};


      const url = id
        ? `${baseUrl}/coupons/update/${id}`
        : `${baseUrl}/coupons/create`;

      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(id ? "Coupon updated successfully!" : "Coupon created successfully!");
        router.push("/admin/coupons");
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast.error("Server error while saving coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`add-coupon-container ${GeistSans.className}`}>
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div>
            <Link href="/admin/coupons" className="backLink">
              <ArrowLeft size={15} />
              <span className="back-text">Back to Coupons</span>
            </Link>
          </div>
          <div>
            <h2 className="page-title">{id ? "Edit Coupon" : "Add New Coupon"}</h2>
            <p className="page-subtitle">
              {id ? "Update your coupon details" : "Create a new discount coupon"}
            </p>
          </div>
        </div>
        <div className="header-actions">
         <button
  className="preview-btn"
  disabled={loading}
  onClick={() => setShowPreview((prev) => !prev)}
>
  {showPreview ? (
    <>
      <ArrowLeft size={16} />
      Back to Edit
    </>
  ) : (
    <>
      <Eye size={16} />
      Preview
    </>
  )}
</button>

          <button className="save-btn" onClick={handleSave} disabled={loading}>
            <Save size={16} />
            {loading ? "Saving..." : id ? "Update Coupon" : "Save Coupon"}
          </button>
        </div>
      </div>

   {/* Layout */}
{showPreview ? (
  <div className="coupon-preview-only">
    <CouponPreviewCard formData={formData} />
  </div>
) : (
  <div className="coupon-layout">
    <div className="left-section">
      <GeneralCard formData={formData} setFormData={setFormData} />
      <CouponDataCard formData={formData} setFormData={setFormData} />
      <UsageRestrictionCard formData={formData} setFormData={setFormData} />
    </div>

    <div className="right-section">
      <UsageLimitsCard formData={formData} setFormData={setFormData} />
      <CouponPreviewCard formData={formData} />
    </div>
  </div>
)}

    </div>
  );
};

export default NewCoupon;
