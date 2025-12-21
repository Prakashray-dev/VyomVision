import express from "express";
import { calculatePayroll } from "../controllers/payroll.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, calculatePayroll);

export default router;
