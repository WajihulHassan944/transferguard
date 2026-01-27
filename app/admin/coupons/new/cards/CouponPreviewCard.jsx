import React from "react";
import { GeistMono } from "geist/font/mono";
import { Percent } from "lucide-react";

const CouponPreviewCard = ({ formData }) => {
  const renderAmount = () => {
    if (formData.amount > 0) {
      return (
        <>
          <span>{formData.amount}</span>
          <Percent size={14} style={{ marginLeft: 4, marginRight: 4 }} />
          <span>off</span>
        </>
      );
    }
    return "Enter discount percentage";
  };

  return (
    <div className="card">
      <h3 className="card-title">Coupon Preview</h3>
      <div className="coupon-preview">
        <span className={`${GeistMono.className} specialInput`}>
          {formData.code || "COUPON_CODE"}
        </span>
        <small className="amount-display">{renderAmount()}</small>
      </div>
    </div>
  );
};

export default CouponPreviewCard;
