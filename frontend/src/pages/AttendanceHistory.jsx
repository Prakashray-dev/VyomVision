import { useState } from "react";
import axios from "../api/axios";
import AdminLayout from "../layout/AdminLayout";

function AttendanceHistory() {
  // Date-wise history
  const [date, setDate] = useState("");
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  // Employee-wise summary
  const [empId, setEmpId] = useState("");
  const [month, setMonth] = useState("");
  const [summary, setSummary] = useState(null);

  /* --------- DATE WISE HISTORY ----------- */
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

  /* --------- EMPLOYEE MONTHLY SUMMARY ------------*/
  const fetchEmployeeSummary = async () => {
    if (!empId || !month) {
      setMessage("Employee ID and Month are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `/attendance/employee-summary?employeeId=${empId}&month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data);
      setMessage("");
    } catch (error) {
      setSummary(null);
      setMessage(
        error.response?.data?.message || "Failed to fetch employee summary"
      );
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: "20px" }}>
        <h2>Attendance History</h2>

        {/* -------- DATE BASED -------- */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="btn" onClick={fetchHistory}>
            View Attendance
          </button>
        </div>

        <br />

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

        {/* -------- SEPARATOR -------- */}
        <hr style={{ margin: "40px 0" }} />

        {/* -------- EMPLOYEE SUMMARY --------  */}
        <h2>Employee Attendance Summary</h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Employee ID (e.g. EMP001)"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
          />

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />

          <button className="btn" onClick={fetchEmployeeSummary}>
            View Summary
          </button>
        </div>

        <br />

        {summary && (
          <div className="card" style={{ maxWidth: "420px" }}>
            <p>
              <b>Employee:</b> {summary.fullName} ({summary.employeeId})
            </p>
            <p>
              <b>Month:</b> {summary.month}
            </p>
            <p>
              <b>Total Working Days:</b> {summary.totalWorkingDays}
            </p>
            <p style={{ color: "green" }}>
              <b>Present Days:</b> {summary.presentDays}
            </p>
            <p style={{ color: "red" }}>
              <b>Absent Days:</b> {summary.absentDays}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AttendanceHistory;
