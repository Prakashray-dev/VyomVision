import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import AdminLayout from "../layout/AdminLayout";

function EditEmployee() {
  const { id } = useParams(); // employee _id from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    dateOfJoining: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch existing employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const emp = res.data;

        setForm({
          fullName: emp.fullName || "",
          email: emp.email || "",
          phone: emp.phone || "",
          department: emp.department || "",
          designation: emp.designation || "",
          salary: emp.salary || "",
          dateOfJoining: emp.dateOfJoining
            ? emp.dateOfJoining.split("T")[0]
            : "",
        });
      } catch (err) {
        setError("Failed to load employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Update employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      await axios.put(`/employees/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Employee updated successfully");

      setTimeout(() => {
        navigate("/employees");
      }, 1000);
    } catch (err) {
      setError("Failed to update employee");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading employee details...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="card">
        <h2>Edit Employee</h2>
        <p style={{ color: "#1DB954", marginBottom: "20px" }}>
          Update employee details
        </p>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
          />

          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            required
          />

          <input
            name="salary"
            type="number"
            placeholder="Monthly Salary (₹)"
            value={form.salary}
            onChange={handleChange}
            required
          />

          <input
            name="dateOfJoining"
            type="date"
            value={form.dateOfJoining}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn">
            Update Employee
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default EditEmployee;
