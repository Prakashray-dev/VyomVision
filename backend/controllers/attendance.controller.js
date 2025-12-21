import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

/**
 * @desc Mark attendance (Present / Absent)
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
      {
        employee: employeeId,
        date,
        status,
      },
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

/**
 * @desc Get attendance status of single employee on a date
 * @route GET /api/attendance/status
 * @access Admin
 */
export const getAttendanceStatus = async (req, res) => {
  try {
    const { employeeId, date } = req.query;

    if (!employeeId || !date) {
      return res.status(400).json({
        message: "employeeId and date required",
      });
    }

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date,
    });

    res.status(200).json({
      employeeId,
      date,
      status: attendance ? attendance.status : "Absent",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    
    const employees = await Employee.find();

    
    const attendanceRecords = await Attendance.find({ date }).populate("employee");

if (attendanceRecords.length === 0) {
  const result = employees.map((emp) => ({
    employeeId: emp.employeeId,
    fullName: emp.fullName,
    status: "Present", // DEFAULT PRESENT
  }));

  return res.status(200).json({
    date,
    attendance: result,
    isHoliday: true,
  });
}

// CASE 2: Attendance WAS taken
const attendanceMap = {};
attendanceRecords.forEach((record) => {
  attendanceMap[record.employee._id.toString()] = record.status;
});

const result = employees.map((emp) => ({
  employeeId: emp.employeeId,
  fullName: emp.fullName,
  status: attendanceMap[emp._id.toString()] || "Absent",
}));

res.status(200).json({
  date,
  attendance: result,
  isHoliday: false,
});

  } catch (error) {
    console.error("Attendance history error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};



export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const totalEmployees = await Employee.countDocuments();

    const attendanceRecords = await Attendance.find({ date: today });

    let presentCount = totalEmployees;
    let absentCount = 0;

    // If attendance is taken today
    if (attendanceRecords.length > 0) {
      presentCount = 0;
      absentCount = 0;

      attendanceRecords.forEach((rec) => {
        if (rec.status === "Present") presentCount++;
        else absentCount++;
      });

      absentCount = totalEmployees - presentCount;
    }

    res.status(200).json({
      date: today,
      totalEmployees,
      present: presentCount,
      absent: absentCount,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
