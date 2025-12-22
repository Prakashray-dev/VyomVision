import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import AdminLayout from "../layout/AdminLayout";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get("/attendance/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    };

    fetchStats();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <h2>Admin Dashboard</h2>

        {stats && (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div className="card">
              <div className="card-title">Date</div>
              <div className="card-value">{stats.date}</div>
            </div>

            <div className="card">
              <div className="card-title">Total Employees</div>
              <div className="card-value">{stats.totalEmployees}</div>
            </div>

            <div className="card">
              <div className="card-title">Present Today</div>
              <div className="card-value green">{stats.present}</div>
            </div>

            <div className="card">
              <div className="card-title">Absent Today</div>
              <div className="card-value red">{stats.absent}</div>
            </div>
          </div>
        )}

        <br />

        {/* <button className="btn" onClick={() => navigate("/employees")}>
          Employees
        </button>
        <br />
        <br />

        <button className="btn" onClick={() => navigate("/attendance")}>
          Attendance
        </button>
        <br />
        <br />

        <button className="btn" onClick={() => navigate("/attendance-history")}>
          Attendance History
        </button>

        <br />
        <br />

        <button className="btn" onClick={() => navigate("/payroll")}>
          Payroll
        </button>

        <br />
        <br />

        <button className="btn" onClick={logout}>
          Logout
        </button> */}
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
