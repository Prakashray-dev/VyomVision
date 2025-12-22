import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import AdminLayout from "../layout/AdminLayout";

function AddEmployee() {
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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      await axios.post("/employees", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Employee created successfully");

      // small delay for UX
      setTimeout(() => {
        navigate("/employees");
      }, 1000);
    } catch (err) {
      setError("Failed to create employee");
    }
  };

  return (
    <AdminLayout>
      <div className="card">
        <h2>Add Employee</h2>
        <p style={{color: "#1DB954", marginBottom: "20px"}}>
          Congrats For Hiring New Employee
        </p>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            required
          />

          <input
            name="department"
            placeholder="Department"
            onChange={handleChange}
            required
          />

          <input
            name="designation"
            placeholder="Designation"
            onChange={handleChange}
            required
          />

          <input
            name="salary"
            type="number"
            placeholder="Salary"
            onChange={handleChange}
            required
          />

          <input
            name="dateOfJoining"
            type="date"
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn">
            Create Employee
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddEmployee;
