import express from "express";

import {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
   deactivateEmployee,
} from "../controllers/employee.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addEmployee);
router.get("/", protect, getAllEmployees);
router.get("/:id", protect, getEmployeeById);
router.put("/:id", protect, updateEmployee);
router.patch("/:id/deactivate", protect, deactivateEmployee);

router.patch("/:id/deactivate", protect, deactivateEmployee);


export default router;
