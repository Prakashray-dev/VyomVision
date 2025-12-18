import Employee from "../models/Employee.js";

/**
 * @desc Add New Employee
 * @route POST /api/employees
 * @access Admin
 */
export const addEmployee = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      department,
      designation,
      salary,
      dateOfJoining,
    } = req.body;

    // Check existing employee
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    // Generate Employee ID
    const count = await Employee.countDocuments();
    const employeeId = `EMP${String(count + 1).padStart(3, "0")}`;

    const employee = await Employee.create({
      employeeId,
      fullName,
      email,
      phone,
      department,
      designation,
      salary,
      dateOfJoining,
    });

    res.status(201).json({
      message: "Employee added successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







export const getAllEmployees = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const employees = await Employee.find({ isActive: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments({ isActive: true });

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      employees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee || !employee.isActive) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Invalid employee ID" });
  }
};




export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee || !employee.isActive) {
      return res.status(404).json({ message: "Employee not found" });
    }

    Object.assign(employee, req.body);

    const updatedEmployee = await employee.save();

    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const deactivateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee || !employee.isActive) {
      return res.status(404).json({ message: "Employee not found or already inactive" });
    }

    employee.isActive = false;
    await employee.save();

    res.status(200).json({
      message: "Employee deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
