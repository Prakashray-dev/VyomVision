import express from "express";
import {
  registerAdmin,
  loginAdmin,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected test route
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Access granted",
    admin: req.admin,
  });
});

export default router;
