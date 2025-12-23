import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/admin/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="brand">VyomVision HRMS</h1>
        <p className="welcome">Welcome back</p>
        <p className="subtitle">Admin Login Panel</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p 
        className="forgot-password"
        onClick={() => navigate("/forgot-password")}>
          Forgot password?

        </p>
        <p className="footer-text">
          Connecting Talent with Opportunity, One Career at a Time.
        </p>
      </div>
    </div>
  );
}

export default Login;
