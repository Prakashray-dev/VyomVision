import { useState } from "react";
import axios from "../api/axios";
import "../styles/login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);

      await axios.post("/admin/forgot-password", { email });

      setMessage("Password reset link has been sent to your email");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="brand">VyomVision HRMS</h1>
        <p className="welcome">Forgot Password</p>
        <p className="subtitle">
          Enter your admin email to reset password
        </p>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="footer-text">
          Secure access for VyomVision administrators
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
