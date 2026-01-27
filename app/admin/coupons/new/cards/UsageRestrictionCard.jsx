import React from "react";

const UsageRestrictionCard = ({ formData, setFormData }) => {
  return (
    <div className="card">
      <h3 className="card-title">Usage Restriction</h3>

      <div className="flexedDiv">
        <div className="form-group">
          <label>Restriction Code</label>
          <input
            type="text"
            placeholder="Enter restriction code"
            value={formData.restrictionCode}
            onChange={(e) =>
              setFormData({ ...formData, restrictionCode: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Restriction Amount</label>
          <input
            type="number"
            value={formData.restrictionAmount}
            onChange={(e) =>
              setFormData({
                ...formData,
                restrictionAmount: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* Individual Use */}
      <div className="form-check">
        <div className="form-text">
          <label htmlFor="individualUse">
            Show in Homepage Banner? <br />
            <span>
              Coupon visibility on homepage.
            </span>
          </label>
        </div>
        <label className="form-toggle">
          <input
            type="checkbox"
            id="individualUse"
            checked={formData.individualUse}
            className="toggle-input"
            onChange={(e) =>
              setFormData({ ...formData, individualUse: e.target.checked })
            }
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      {/* Render email input only when individualUse is true */}
      {!formData.individualUse && (
        <div className="form-group mt-2">
          <label>User Email</label>
          <input
            type="email"
            placeholder="Enter user email"
            value={formData.userEmail || ""}
            onChange={(e) =>
              setFormData({ ...formData, userEmail: e.target.value })
            }
          />
        </div>
      )}

      {/* Exclude Sale */}
      <div className="form-check">
        <div className="form-text">
          <label htmlFor="excludeSale">
            Exclude sale items <br />
            <span>Coupon will not apply to discounted products.</span>
          </label>
        </div>
        <label className="form-toggle">
          <input
            type="checkbox"
            id="excludeSale"
            className="toggle-input"
            checked={formData.excludeSale}
            onChange={(e) =>
              setFormData({ ...formData, excludeSale: e.target.checked })
            }
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  );
};

export default UsageRestrictionCard;
