import express from "express";
import {
  markAttendance,
  getAttendanceStatus,
  getAttendanceByDate,
  getDashboardStats,
} from "../controllers/attendance.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, markAttendance);
router.get("/status", protect, getAttendanceStatus);

router.get("/history", protect, getAttendanceByDate);
router.get("/dashboard-stats", protect, getDashboardStats);
export default router;
