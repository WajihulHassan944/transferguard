import React from "react";

const UsageLimitsCard = ({ formData, setFormData }) => {
  return (
    <div className="card">
      <h3 className="card-title">Usage Limits</h3>
      <div className="form-group">
        <label>Usage limit per coupon</label>
        <input
          type="text"
          placeholder="Unlimited usage"
          value={formData.limitPerCoupon}
          onChange={(e) =>
            setFormData({ ...formData, limitPerCoupon: e.target.value })
          }
        />
      </div>
      <div className="form-group">
        <label>Usage limit per user</label>
        <input
          type="text"
          placeholder="Unlimited usage"
          value={formData.limitPerUser}
          onChange={(e) =>
            setFormData({ ...formData, limitPerUser: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default UsageLimitsCard;
