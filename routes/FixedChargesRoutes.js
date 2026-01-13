import express from "express";
import {
  getAllCharges,
  createCharge,
  updateCharge,
  deleteCharge,
  getCategories
} from "../controllers/fixedChargesController.js";

const router = express.Router();

// GET all charges
router.get("/", getAllCharges);

// GET categories
router.get("/categories", getCategories);

// POST new charge
router.post("/", createCharge);

// PUT update charge
router.put("/:id", updateCharge);

// DELETE charge
router.delete("/:id", deleteCharge);

export default router;
