import { useState } from "react";
import axios from "../api/axios";

function Payroll() {
  const [month, setMonth] = useState("");
  const [payroll, setPayroll] = useState([]);
  const [message, setMessage] = useState("");

  const fetchPayroll = async () => {
    if (!month) {
      setMessage("Please select a month");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `/payroll?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayroll(res.data.payroll);
      setMessage("");
    } catch (error) {
      setMessage("Failed to fetch payroll");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payroll</h2>

      <label>
        Select Month:{" "}
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </label>

      <button onClick={fetchPayroll} style={{ marginLeft: "10px" }}>
        View Payroll
      </button>

      <br /><br />

      {message && <p>{message}</p>}

      {payroll.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Monthly Salary</th>
              <th>Absent Days</th>
              <th>Deduction</th>
              <th>Final Salary</th>
            </tr>
          </thead>
          <tbody>
            {payroll.map((emp, index) => (
              <tr key={index}>
                <td>{emp.fullName} ({emp.employeeId})</td>
                <td>₹ {emp.monthlySalary}</td>
                <td>{emp.absentDays}</td>
                <td>₹ {emp.deduction}</td>
                <td><b>₹ {emp.finalSalary}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Payroll;
