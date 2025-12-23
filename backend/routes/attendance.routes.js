import express from "express";
import {
  markAttendance,
  getAttendanceStatus,
  getAttendanceByDate,
  getDashboardStats,
  getEmployeeAttendanceSummary
} from "../controllers/attendance.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, markAttendance);
router.get("/status", protect, getAttendanceStatus);

router.get("/history", protect, getAttendanceByDate);
router.get("/dashboard-stats", protect, getDashboardStats);

router.get("/employee-summary", getEmployeeAttendanceSummary);

export default router;
