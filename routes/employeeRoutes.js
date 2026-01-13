// backend/routes/employeeRoutes.js
import express from "express";
import { isAuthenticated } from "../middleware/sessionAuth.js";
import { profile, listEmployees, addEmployee, updateEmployee, removeEmployee, getEmployee } from "../controllers/employeeController.js";

const router = express.Router();

router.get("/profile", isAuthenticated, profile);
router.get("/", listEmployees);       // Get all
router.get("/:id", getEmployee);      // Get single
router.post("/", addEmployee);        // Add
router.put("/:id", updateEmployee);   // Update
router.delete("/:id", removeEmployee); // Delete

export default router;
