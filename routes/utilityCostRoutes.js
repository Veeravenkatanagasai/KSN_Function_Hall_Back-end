import express from "express";
import {
  getUtilities,
  addUtility,
  updateUtility,
  deleteUtility,
} from "../controllers/utilityCostController.js";

const router = express.Router();

router.get("/", getUtilities);
router.post("/", addUtility);
router.put("/:id", updateUtility);
router.delete("/:id", deleteUtility);

export default router;
