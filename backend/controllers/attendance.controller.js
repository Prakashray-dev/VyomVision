import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

/**
 * @desc Employee Check-In
 * @route POST /api/attendance/check-in
 * @access Admin
 */

export const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    await Attendance.findOneAndUpdate(
      { employee: employeeId, date },
      { status },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Attendance saved",
    });
  } catch (error) {
    console.error("Attendance error:", error);
    res.status(500).json({
      message: "Server error",
    });
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
