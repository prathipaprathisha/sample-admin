import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [devMode, setDevMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setPreviewUrl("");
    setOtp("");

    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.forgotPassword({ email });
      if (res.success) {
        setOtpSent(true);
        setDevMode(!!res.devMode);
        setPreviewUrl(res.previewUrl || "");
        if (res.otp) {
          setOtp(res.otp);
        }
        setMessage(res.message || "OTP has been sent to your email.");
      } else {
        setError(res.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      const res = await api.resetPassword({ email, otp, newPassword });
      if (res.success || res.message === "Password has been reset") {
        setMessage("Password reset successfully. Please login.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <button type="button" onClick={handleSendOtp} disabled={loading || !email}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          {otpSent && (
            <>
              {previewUrl && (
                <div className="form-group">
                  <label>Email preview</label>
                  <a href={previewUrl} target="_blank" rel="noreferrer">
                    Open email preview
                  </a>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="otp">OTP</label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter the OTP"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
              </div>

              <button type="submit" disabled={loading || !otp || !newPassword}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
