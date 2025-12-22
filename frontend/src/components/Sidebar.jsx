import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        background: "linear-gradient(180deg, #1DB954, #0B6E3B)",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>VyomVision HRMS</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/employees" style={linkStyle}>Employees</Link>
        <Link to="/attendance" style={linkStyle}>Attendance</Link>
        <Link to="/payroll" style={linkStyle}>Payroll</Link>
      </nav>
    </div>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "16px",
};

export default Sidebar;
