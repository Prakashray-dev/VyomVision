import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

/**
 * @desc Calculate payroll for a given month
 * @route GET /api/payroll?month=YYYY-MM
 * @access Admin
 */
export const calculatePayroll = async (req, res) => {
  try {
    const { month } = req.query; // format: YYYY-MM

    if (!month) {
      return res.status(400).json({
        message: "Month is required (YYYY-MM)",
      });
    }

    const employees = await Employee.find();

    // Total days in the month
    const [year, mon] = month.split("-");
    const totalDaysInMonth = new Date(year, mon, 0).getDate();

    const payrollData = [];

    for (let emp of employees) {
      // Attendance records for this employee in the month
      const attendanceRecords = await Attendance.find({
        employee: emp._id,
        date: { $regex: `^${month}` }, // YYYY-MM
      });

      let absentDays = 0;

      attendanceRecords.forEach((record) => {
        if (record.status === "Absent") {
          absentDays++;
        }
      });

      const perDaySalary = emp.salary / totalDaysInMonth;
      const deduction = absentDays * perDaySalary;
      const finalSalary = emp.salary - deduction;

      payrollData.push({
        employeeId: emp.employeeId,
        fullName: emp.fullName,
        monthlySalary: emp.salary,
        totalDaysInMonth,
        absentDays,
        deduction: Math.round(deduction),
        finalSalary: Math.round(finalSalary),
      });
    }

    res.status(200).json({
      month,
      payroll: payrollData,
    });
  } catch (error) {
    console.error("Payroll calculation error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
