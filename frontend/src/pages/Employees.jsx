import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import AdminLayout from "../layout/AdminLayout";

function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const deactivateEmployee = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.patch(
      `/employees/${id}/deactivate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEmployees((prev) =>
      prev.filter((emp) => emp._id !== id)
    );
  } catch (error) {
    alert("Failed to deactivate employee");
  }
};

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEmployees(res.data.employees || []);
      } catch (err) {
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <AdminLayout>
    <div style={{ padding: "20px" }}>
      <h2>Employees</h2>

      {/* ADD EMPLOYEE BUTTON */}
      <button onClick={() => navigate("/employees/add")}>
        Add Employee
      </button>

      <br /><br />

      {employees.length === 0 ? (
        <p>No employees found</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Employee ID</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.fullName}</td>
                <td>{emp.employeeId}</td>
                <td>{emp.email}</td>
                <td>
                  <button onClick={() => deactivateEmployee(emp._id)}>
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </AdminLayout>
  );
}

export default Employees;
