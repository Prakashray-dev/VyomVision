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
        attendanceRecords.map((a) =>
          new Date(a.date).toISOString().split("T")[0]
        )
      ),
    ];
    const totalWorkingDays = workingDates.length;

    const payrollData = employees.map((emp) => {
      // Attendance of this employee
      const empAttendance = attendanceRecords.filter(
        (a) => a.employee.toString() === emp._id.toString()
      );

      let absentDays = 0;
      let hasFridayAbsent = false;
      let hasMondayAbsent = false;

      empAttendance.forEach((record) => {
        if (record.status === "Absent") {
          absentDays++;

          const day = new Date(record.date).getDay();
          //Sunday = 0, Monday = 1, Friday = 5
          if (day === 5) hasFridayAbsent = true;
          if (day === 1) hasMondayAbsent = true;
        }
      });

      // Sandwich rule
      let extraDeductionDays = 0;

      if (hasFridayAbsent || hasMondayAbsent) {
        extraDeductionDays = 2;
      }

      const totalDeductionDays = absentDays + extraDeductionDays;

      const perDaySalary =
        totalWorkingDays > 0 ? emp.salary / totalWorkingDays : 0;

      const deduction = perDaySalary * totalDeductionDays;
      const finalSalary = emp.salary - deduction;

      return {
        employeeId: emp.employeeId,
        fullName: emp.fullName,
        monthlySalary: emp.salary,
        totalWorkingDays,
        absentDays,
        sandwichDays: extraDeductionDays,
        totalDeductionDays,
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
