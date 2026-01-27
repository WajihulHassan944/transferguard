import React, { useState } from "react";
import "./ResetPasswordModal.css";
import { Eye, EyeOff, RefreshCw, Copy, X } from "lucide-react";
import { baseUrl } from "@/const";
import toast from "react-hot-toast";
const ResetPasswordModal = ({ userId, userName = "John Doe", onClose }) => {
console.log(userId);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);
const [strength, setStrength] = useState({ label: "", level: 0 });
const [loading, setLoading] = useState(false);

const evaluateStrength = (value) => {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  let result = { label: "Weak", level: 1 };
  if (score >= 4) result = { label: "Strong", level: 3 };
  else if (score === 2 || score === 3) result = { label: "Fair", level: 2 };

  setStrength(result);
};

const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let pass = "";
  for (let i = 0; i < 16; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  setPassword(pass);
  setGenerated(true);
  setStrength({ label: "", level: 0 }); // 👈 hides strength bar when auto-generated
};

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
const handleReset = async () => {
  if (!password) return;
  setLoading(true);
  try {
    const res = await fetch(`${baseUrl}/users/update-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId, newPassword: password }),
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Password updated successfully!");
      onClose();
    } else {
      toast.error(data.message || "Failed to update password.");
    }
  } catch (err) {
    console.error("Reset error:", err);
    toast.error("Something went wrong while resetting password.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="reset-modal-overlay">
      <div className="reset-modal">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          <X size={16} />
        </button>

        <h2 className="modal-title">Reset Password</h2>
        <p className="modal-subtitle">Reset password for {userName}</p>

        <div className="toggle-row">
          <label htmlFor="auto-gen">Auto-generate password</label>
          <label className="switch">
            <input
              id="auto-gen"
              type="checkbox"
              checked={autoGenerate}
              onChange={(e) => {
                const val = e.target.checked;
                setAutoGenerate(val);
                setPassword("");
                setGenerated(false);
              }}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Manual Password Section */}
        {!autoGenerate && (
          <div className="input-group">
            <label>New Password</label>
            <div className="password-field">
              <input
  type={showPassword ? "text" : "password"}
  placeholder="Enter new password"
  value={password}
  onChange={(e) => {
    setPassword(e.target.value);
    setGenerated(false); // 👈 reset generated flag when user types
    evaluateStrength(e.target.value);
  }}
/>
<button
                type="button"
                className="icon-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button type="button" className="icon-btn" onClick={generatePassword}>
                <RefreshCw size={18} />
              </button>
            </div>
          {password && !generated && (
  <div className="strength-row">
   <div className="spaced-between">
    <span className="strength-label">Password Strength:</span>
    <span
      className={`strength-value ${strength.label.toLowerCase()}`}
    >
      {strength.label}
    </span>
    </div>

    <div className="strength-bar">
      <div
        className={`strength-fill level-${strength.level}`}
      ></div>
    </div>
  </div>
)}

            <p className="helper-text">
              Enter a custom password or click the refresh button to generate a strong one
            </p>
          </div>
        )}

        {/* Auto-generate Password Section */}
        {autoGenerate && (
          <div className="input-group">
            <label>Generated Password</label>

            {!generated ? (
              <div className="generate-placeholder" onClick={generatePassword}>
                <RefreshCw size={18} /> Generate Strong Password
              </div>
            ) : (
              <>
                <div className="password-field">
                  <input type="text" value={password} readOnly />
                  <button type="button" className="icon-btn" onClick={handleCopy}>
                    <Copy size={18} />
                  </button>
                </div>
                <p className="success-text">
                  Strong password generated (16 characters with special characters)
                </p>
              </>
            )}

            <p className="helper-text">
              Automatically generates a secure 16-character password with letters,
              numbers, and special characters
            </p>
          </div>
        )}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
         <button
  className="reset-btn"
  disabled={!password || loading}
  onClick={handleReset}
>
  {loading ? "Resetting..." : "Reset Password"}
</button>

        </div>

        {copied && <span className="copy-toast">Copied!</span>}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
