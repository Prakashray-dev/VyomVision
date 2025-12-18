import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

/**
 * @desc Employee Check-In
 * @route POST /api/attendance/check-in
 * @access Admin
 */
export const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const employee = await Employee.findById(employeeId);

    if (!employee || !employee.isActive) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      date: today,
      checkIn: new Date(),
    });

    res.status(201).json({
      message: "Check-in successful",
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const getAttendanceStatus = async (req, res) => {
  try {
    const { employeeId, date } = req.query;

    if (!employeeId || !date) {
      return res.status(400).json({ message: "employeeId and date required" });
    }

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date,
    });

    res.status(200).json({
      employeeId,
      date,
      status: attendance ? "Present" : "Absent",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
