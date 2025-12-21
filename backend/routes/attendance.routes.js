import express from "express";
import { markAttendance, getAttendanceStatus } from "../controllers/attendance.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, markAttendance);
router.get("/status", protect, getAttendanceStatus);

export default router;
