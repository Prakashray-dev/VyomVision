import { useEffect, useState } from "react";
import axios from "../api/axios";

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState("");
  const [presentMap, setPresentMap] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get("/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployees(res.data.employees || []);
    };

    fetchEmployees();
  }, []);

  const togglePresent = (empId) => {
    setPresentMap((prev) => ({
      ...prev,
      [empId]: !prev[empId],
    }));
  };

 const submitAttendance = async () => {
  if (!date) {
    setMessage("Please select a date");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const formattedDate = new Date(date).toISOString().split("T")[0];

    for (let emp of employees) {
      const status = presentMap[emp._id] ? "Present" : "Absent";

      await axios.post(
        "/attendance",
        {
          employeeId: emp._id,
          date: formattedDate,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    setMessage("Attendance submitted successfully");
  } 
//   catch (err) {
//     setMessage(
//       err.response?.data?.message || "Failed to submit attendance"
//     );
//   }
catch (err) {
  console.log("Attendance error:", err.response?.data || err.message);
  setMessage(err.response?.data?.message || "Failed to submit attendance");
}

};


  return (
    <div style={{ padding: "20px" }}>
      <h2>Mark Attendance</h2>

      {message && <p>{message}</p>}

      {/* DATE SELECTION */}
      <label>
        Select Date:{" "}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <br /><br />

      {/* EMPLOYEE LIST */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Present</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.fullName}</td>
              <td>{emp.employeeId}</td>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={presentMap[emp._id] || false}
                  onChange={() => togglePresent(emp._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      {/* SUBMIT BUTTON */}
      <button onClick={submitAttendance}>
        Submit Attendance
      </button>
    </div>
  );
}

export default Attendance;
