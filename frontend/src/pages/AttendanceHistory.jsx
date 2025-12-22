import { useState } from "react";
import axios from "../api/axios";
import AdminLayout from "../layout/AdminLayout";

function AttendanceHistory() {
  const [date, setDate] = useState("");
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  const fetchHistory = async () => {
    if (!date) {
      setMessage("Please select a date");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `/attendance/history?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecords(res.data.attendance);
      setMessage("");
    } catch (err) {
      setMessage("Failed to fetch attendance history");
    }
  };

  return (
    <AdminLayout>
    <div style={{ padding: "20px" }}>
      <h2>Attendance History</h2>

      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
      />

      <button className="btn" onClick={fetchHistory}>
        View Attendance
      </button>

      <br /><br />

      {message && <p>{message}</p>}

      {records.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, i) => (
              <tr key={i}>
                <td>{rec.fullName}</td>
                <td>{rec.employeeId}</td>
                <td>{rec.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </AdminLayout>
  );
}

export default AttendanceHistory;
