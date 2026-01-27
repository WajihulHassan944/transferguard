import React from "react";
import { GeistMono } from "geist/font/mono";

const GeneralCard = ({ formData, setFormData }) => {
  return (
    <div className="card">
      <h3 className="card-title">General</h3>
      <div className="flexedDiv">
        <div className="form-group">
          <label>Coupon Code</label>
          <input
            type="text"
            placeholder="Enter coupon code"
            className={`${GeistMono.className} specialInput`}
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Coupon Amount</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          placeholder="Describe this coupon"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default GeneralCard;
