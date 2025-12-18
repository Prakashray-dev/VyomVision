import express from "express";
import { checkIn, getAttendanceStatus} from "../controllers/attendance.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/check-in", protect, checkIn);

router.get("/status", protect, getAttendanceStatus);

export default router;
