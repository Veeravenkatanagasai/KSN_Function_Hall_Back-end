import express from "express";
import {
  getAllPricing,
  addPricing,
  updatePricing,
  deletePricing
} from "../controllers/hallpricingController.js";

const router = express.Router();

router.get("/", getAllPricing);
router.post("/", addPricing);
router.put("/:id", updatePricing);
router.delete("/:id", deletePricing);

export default router;
