import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "../styles/login.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("/admin/reset-password", {
        token,
        password,
      });

      setMessage("Password reset successful. Redirecting to login...");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Invalid or expired reset link");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="brand">VyomVision HRMS</h1>
        <p className="welcome">Reset Password</p>
        <p className="subtitle">Create a new secure password</p>

        {error && <p className="error">{error}</p>}
        {message && <p className="success-text">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Reset Password</button>
        </form>

        <p
          className="forgot-password"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
