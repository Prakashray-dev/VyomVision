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
          <>
            <p><b>Date:</b> {stats.date}</p>
            <p><b>Total Employees:</b> {stats.totalEmployees}</p>
            <p><b>Present Today:</b> {stats.present}</p>
            <p><b>Absent Today:</b> {stats.absent}</p>
          </>
        )}

        <br />

        <button onClick={() => navigate("/employees")}>Employees</button>
        <br /><br />

        <button onClick={() => navigate("/attendance")}>Attendance</button>
        <br /><br />

        <button onClick={() => navigate("/attendance-history")}>
          Attendance History
        </button>

        <br /><br />

        <button onClick={() => navigate("/payroll")}>
          Payroll
        </button>

        <br /><br />

        <button onClick={logout}>Logout</button>
      </div>
    </AdminLayout> 
  );
}

export default Dashboard;
