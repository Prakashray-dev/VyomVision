import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

/**
 * @desc Calculate payroll for a given month
 * @route GET /api/payroll?month=YYYY-MM
 * @access Admin
 */
export const calculatePayroll = async (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM

    if (!month) {
      return res.status(400).json({
        message: "Month is required (YYYY-MM)",
      });
    }

    // Month date range
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Only active employees
    const employees = await Employee.find({ isActive: true });

    // All attendance records for the month
    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lt: endDate },
    });

    // Find unique working dates (attendance taken days)
    const workingDates = [
      ...new Set(
        attendanceRecords.map(
          (a) => a.date.toISOString().split("T")[0]
        )
      ),
    ];

    const totalWorkingDays = workingDates.length;

    const payrollData = employees.map((emp) => {
      let presentDays = 0;

      // 🔥 CORE FIX: loop over working days
      workingDates.forEach((date) => {
        const record = attendanceRecords.find(
          (a) =>
            a.employee.toString() === emp._id.toString() &&
            a.date.toISOString().split("T")[0] === date
        );

        if (record && record.status === "Present") {
          presentDays++;
        }
      });

      const absentDays = totalWorkingDays - presentDays;

      const perDaySalary =
        totalWorkingDays > 0 ? emp.salary / totalWorkingDays : 0;

      const deduction = perDaySalary * absentDays;
      const finalSalary = emp.salary - deduction;

      return {
        employeeId: emp.employeeId,
        fullName: emp.fullName,
        monthlySalary: emp.salary,
        totalWorkingDays,
        absentDays,
        deduction: Math.round(deduction),
        finalSalary: Math.round(finalSalary),
      };
    });

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
