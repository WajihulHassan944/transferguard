import React from "react";

const CouponDataCard = ({ formData, setFormData }) => {
  const handleDiscountType = (type) =>
    setFormData({ ...formData, discountType: type });

  const handleProductRestriction = (value) => {
    setFormData({ ...formData, productRestriction: [value] });
  };

  return (
    <div className="card">
      <h3 className="card-title">Coupon Data</h3>
      <label className="blacked">Discount Type</label>
      <div className="discount-types">
        {["percentage", "fixed_cart", "fixed_product"].map((type) => (
          <button
            key={type}
            className={formData.discountType === type ? "active" : ""}
            onClick={() => handleDiscountType(type)}
            type="button"
          >
            {type === "percentage"
              ? "Percentage discount"
              : type === "fixed_cart"
              ? "Fixed cart discount"
              : "Fixed product discount"}
          </button>
        ))}
      </div>

      {/* Conditional rendering based on discount type */}
      {formData.discountType === "fixed_product" && (
        <div className="form-group">
          <label>Choose Product Restriction</label>
          <div className="discount-types">
            {[
              { label: "Basic", value: 15 },
              { label: "Standard", value: 50 },
              { label: "Premium", value: 120 },
            ].map((option) => (
              <button
                key={option.value}
                className={
                  formData.productRestriction?.[0] === option.value
                    ? "active"
                    : ""
                }
                onClick={() => handleProductRestriction(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {formData.discountType === "fixed_cart" && (
        <div className="form-group">
          <label htmlFor="cartMinItems">
            Cart should contain at least how many items:
          </label>
          <input
            type="number"
            id="cartMinItems"
            min="1"
            style={{ maxWidth: "240px" }}
            value={formData.cartMinItems || ""}
            onChange={(e) =>
              setFormData({ ...formData, cartMinItems: e.target.value })
            }
          />
        </div>
      )}

      <div className="form-check">
        <div className="form-text">
          <label htmlFor="freeShipping">
            Allow free shipping <br />
            <span>Check this if the coupon grants free shipping</span>
          </label>
        </div>
        <label className="form-toggle">
          <input
            type="checkbox"
            id="freeShipping"
            className="toggle-input"
            checked={formData.freeShipping}
            onChange={(e) =>
              setFormData({ ...formData, freeShipping: e.target.checked })
            }
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
<div className="form-check">
  <div className="form-text">
    <label htmlFor="status">
      Coupon Status <br />
      <span>Enable or disable this coupon</span>
    </label>
  </div>
  <label className="form-toggle">
    <input
      type="checkbox"
      id="status"
      className="toggle-input"
      checked={formData.status === "active"}
      onChange={(e) =>
        setFormData({
          ...formData,
          status: e.target.checked ? "active" : "inactive",
        })
      }
    />
    <span className="toggle-slider"></span>
  </label>
</div>

      <div className="form-group">
        <label>Coupon expiry date</label>
        <input
          type="date"
          style={{ maxWidth: "240px" }}
          value={formData.expiryDate}
          onChange={(e) =>
            setFormData({ ...formData, expiryDate: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default CouponDataCard;
