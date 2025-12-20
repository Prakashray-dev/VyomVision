import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    dateOfJoining: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post("/employees", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/employees");
    } catch (err) {
      setError("Failed to create employee");
    }
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h2>Add Employee</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="employeeId"
          placeholder="Employee ID"
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          name="department"
          placeholder="Department"
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          name="designation"
          placeholder="Designation"
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          name="salary"
          type="number"
          placeholder="Salary"
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          name="dateOfJoining"
          type="date"
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <button type="submit">Create Employee</button>
      </form>
    </div>
  );
}

export default AddEmployee;
